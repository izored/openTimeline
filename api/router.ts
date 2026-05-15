import { createRouter, publicQuery } from "./middleware";
import { eventRouter } from "./routers/event";
import { subjectRouter } from "./routers/subject";
import { actorRouter } from "./routers/actor";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  event: eventRouter,
  subject: subjectRouter,
  actor: actorRouter,
});

export type AppRouter = typeof appRouter;
