import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { subjects, events, eventSubjects, eventActors, actors } from "@db/schema";
import { eq } from "drizzle-orm";

export const subjectRouter = createRouter({
  // ─── List all subjects ───────────────────────────────────────
  list: publicQuery.query(async () => {
    const db = getDb();
    const allSubjects = await db.select().from(subjects);
    return allSubjects;
  }),

  // ─── Get subject by slug with events ─────────────────────────
  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [subject] = await db.select().from(subjects).where(eq(subjects.slug, input.slug)).limit(1);
      if (!subject) return null;

      // Get linked events
      const eventLinks = await db
        .select({ eventId: eventSubjects.eventId })
        .from(eventSubjects)
        .where(eq(eventSubjects.subjectId, subject.id));

      const eventIds = eventLinks.map((e) => e.eventId);
      const subjectEvents = [];

      for (const eventId of eventIds) {
        const [ev] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
        if (!ev) continue;

        const actorLinks = await db
          .select({ name: actors.name, role: actors.role })
          .from(eventActors)
          .innerJoin(actors, eq(eventActors.actorId, actors.id))
          .where(eq(eventActors.eventId, ev.id));

        subjectEvents.push({
          ...ev,
          actors: actorLinks,
          evidence: (ev.evidence as Array<{ label: string; filename: string }>) ?? [],
          relatedSlugs: (ev.relatedSlugs as string[]) ?? [],
        });
      }

      // Group events by year
      const eventsByYear: Record<number, typeof subjectEvents> = {};
      subjectEvents.sort((a, b) => b.year - a.year || b.startDate.localeCompare(a.startDate));
      for (const ev of subjectEvents) {
        if (!eventsByYear[ev.year]) eventsByYear[ev.year] = [];
        eventsByYear[ev.year].push(ev);
      }

      return {
        ...subject,
        events: subjectEvents,
        eventsByYear,
      };
    }),

  // ─── Create a subject ────────────────────────────────────────
  create: publicQuery
    .input(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        category: z.string().min(1),
        description: z.string().default(""),
        status: z.enum(["open", "pending", "resolved", "blocked"]).default("open"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(subjects).values(input);
      return { id: Number(result.insertId), slug: input.slug };
    }),

  // ─── Delete a subject ────────────────────────────────────────
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(eventSubjects).where(eq(eventSubjects.subjectId, input.id));
      await db.delete(subjects).where(eq(subjects.id, input.id));
      return { success: true };
    }),
});
