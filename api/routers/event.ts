import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { events, eventActors, eventSubjects, actors, subjects } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const eventRouter = createRouter({
  // ─── List all events ─────────────────────────────────────────
  list: publicQuery.query(async () => {
    const db = getDb();
    const allEvents = await db.select().from(events).orderBy(desc(events.year), desc(events.startDate));

    // Get actors for each event
    const result = [];
    for (const ev of allEvents) {
      const actorLinks = await db
        .select({
          actorId: eventActors.actorId,
          name: actors.name,
          role: actors.role,
        })
        .from(eventActors)
        .innerJoin(actors, eq(eventActors.actorId, actors.id))
        .where(eq(eventActors.eventId, ev.id));

      const subjectLinks = await db
        .select({
          subjectId: eventSubjects.subjectId,
          slug: subjects.slug,
          name: subjects.name,
          category: subjects.category,
          status: subjects.status,
          description: subjects.description,
        })
        .from(eventSubjects)
        .innerJoin(subjects, eq(eventSubjects.subjectId, subjects.id))
        .where(eq(eventSubjects.eventId, ev.id));

      result.push({
        ...ev,
        actors: actorLinks.map((a) => ({ name: a.name, role: a.role })),
        subjects: subjectLinks.map((s) => ({
          id: s.subjectId,
          slug: s.slug,
          name: s.name,
          category: s.category,
          description: s.description,
          status: s.status,
        })),
      });
    }

    return result;
  }),

  // ─── Get events grouped by year ──────────────────────────────
  byYear: publicQuery.query(async () => {
    const db = getDb();
    const allEvents = await db.select().from(events).orderBy(desc(events.year), desc(events.startDate));

    const result: Record<number, Array<ReturnType<typeof formatEvent>>> = {};

    for (const ev of allEvents) {
      const actorLinks = await db
        .select({
          name: actors.name,
          role: actors.role,
        })
        .from(eventActors)
        .innerJoin(actors, eq(eventActors.actorId, actors.id))
        .where(eq(eventActors.eventId, ev.id));

      if (!result[ev.year]) result[ev.year] = [];

      result[ev.year].push({
        id: ev.id,
        slug: ev.slug,
        title: ev.title,
        category: ev.category,
        year: ev.year,
        startDate: ev.startDate,
        endDate: ev.endDate,
        ongoing: ev.ongoing,
        status: ev.status as "open" | "pending" | "resolved" | "blocked",
        description: ev.description ?? "",
        actors: actorLinks.map((a) => ({ name: a.name, role: a.role })),
        evidence: (ev.evidence as Array<{ label: string; filename: string }>) ?? [],
        relatedSlugs: (ev.relatedSlugs as string[]) ?? [],
      });
    }

    return result;
  }),

  // ─── Get single event by slug ────────────────────────────────
  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [ev] = await db.select().from(events).where(eq(events.slug, input.slug)).limit(1);
      if (!ev) return null;

      const actorLinks = await db
        .select({ name: actors.name, role: actors.role })
        .from(eventActors)
        .innerJoin(actors, eq(eventActors.actorId, actors.id))
        .where(eq(eventActors.eventId, ev.id));

      return {
        ...ev,
        actors: actorLinks,
        evidence: (ev.evidence as Array<{ label: string; filename: string }>) ?? [],
        relatedSlugs: (ev.relatedSlugs as string[]) ?? [],
      };
    }),

  // ─── Create a new event ──────────────────────────────────────
  create: publicQuery
    .input(
      z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        category: z.enum(["legal", "debt", "job", "bv", "personal", "admin"]),
        year: z.number().int(),
        startDate: z.string(),
        endDate: z.string().nullable(),
        ongoing: z.boolean().default(false),
        status: z.enum(["open", "pending", "resolved", "blocked"]),
        description: z.string(),
        actorIds: z.array(z.number()).default([]),
        subjectIds: z.array(z.number()).default([]),
        evidence: z.array(z.object({ label: z.string(), filename: z.string() })).default([]),
        relatedSlugs: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [newEvent] = await db.insert(events).values({
        slug: input.slug,
        title: input.title,
        category: input.category,
        year: input.year,
        startDate: input.startDate,
        endDate: input.endDate,
        ongoing: input.ongoing,
        status: input.status,
        description: input.description,
        evidence: input.evidence,
        relatedSlugs: input.relatedSlugs,
      });

      const eventId = Number(newEvent.insertId);

      // Link actors
      if (input.actorIds.length > 0) {
        await db.insert(eventActors).values(
          input.actorIds.map((actorId) => ({ eventId, actorId }))
        );
      }

      // Link subjects
      if (input.subjectIds.length > 0) {
        await db.insert(eventSubjects).values(
          input.subjectIds.map((subjectId) => ({ eventId, subjectId }))
        );
      }

      return { id: eventId, slug: input.slug };
    }),

  // ─── Delete an event ─────────────────────────────────────────
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(eventActors).where(eq(eventActors.eventId, input.id));
      await db.delete(eventSubjects).where(eq(eventSubjects.eventId, input.id));
      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),

  // ─── Search events ───────────────────────────────────────────
  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const q = input.query.toLowerCase();

      // Single JOIN — no per-event queries
      const rows = await db
        .select({
          event: events,
          actorName: actors.name,
          actorRole: actors.role,
        })
        .from(events)
        .leftJoin(eventActors, eq(eventActors.eventId, events.id))
        .leftJoin(actors, eq(actors.id, eventActors.actorId));

      // Group rows by event id
      const eventMap = new Map<
        number,
        { ev: typeof events.$inferSelect; actorLinks: Array<{ name: string; role: string }> }
      >();
      for (const row of rows) {
        if (!eventMap.has(row.event.id)) {
          eventMap.set(row.event.id, { ev: row.event, actorLinks: [] });
        }
        if (row.actorName != null && row.actorRole != null) {
          eventMap.get(row.event.id)!.actorLinks.push({ name: row.actorName, role: row.actorRole });
        }
      }

      return [...eventMap.values()]
        .filter(
          ({ ev, actorLinks }) =>
            ev.title.toLowerCase().includes(q) ||
            (ev.description ?? "").toLowerCase().includes(q) ||
            ev.category.toLowerCase().includes(q) ||
            ev.year.toString().includes(q) ||
            actorLinks.some((a) => a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q))
        )
        .map(({ ev, actorLinks }) => ({
          ...ev,
          actors: actorLinks,
          evidence: (ev.evidence as Array<{ label: string; filename: string }>) ?? [],
          relatedSlugs: (ev.relatedSlugs as string[]) ?? [],
        }));
    }),
});

function formatEvent(ev: typeof events.$inferSelect) {
  return {
    id: ev.id,
    slug: ev.slug,
    title: ev.title,
    category: ev.category,
    year: ev.year,
    startDate: ev.startDate,
    endDate: ev.endDate,
    ongoing: ev.ongoing,
    status: ev.status as "open" | "pending" | "resolved" | "blocked",
    description: ev.description ?? "",
    actors: [] as Array<{ name: string; role: string }>,
    evidence: (ev.evidence as Array<{ label: string; filename: string }>) ?? [],
    relatedSlugs: (ev.relatedSlugs as string[]) ?? [],
  };
}
