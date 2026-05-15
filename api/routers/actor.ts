import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { actors } from "@db/schema";
import { eq } from "drizzle-orm";

export const actorRouter = createRouter({
  // ─── List all actors ─────────────────────────────────────────
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(actors).orderBy(actors.name);
  }),

  // ─── Create an actor ─────────────────────────────────────────
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        role: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(actors).values(input);
      return { id: Number(result.insertId), name: input.name };
    }),

  // ─── Delete an actor ─────────────────────────────────────────
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(actors).where(eq(actors.id, input.id));
      return { success: true };
    }),
});
