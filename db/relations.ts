import { relations } from "drizzle-orm";
import { events, subjects, actors, eventActors, eventSubjects } from "./schema";

export const eventsRelations = relations(events, ({ many }) => ({
  eventActors: many(eventActors),
  eventSubjects: many(eventSubjects),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  eventSubjects: many(eventSubjects),
}));

export const actorsRelations = relations(actors, ({ many }) => ({
  eventActors: many(eventActors),
}));

export const eventActorsRelations = relations(eventActors, ({ one }) => ({
  event: one(events, { fields: [eventActors.eventId], references: [events.id] }),
  actor: one(actors, { fields: [eventActors.actorId], references: [actors.id] }),
}));

export const eventSubjectsRelations = relations(eventSubjects, ({ one }) => ({
  event: one(events, { fields: [eventSubjects.eventId], references: [events.id] }),
  subject: one(subjects, { fields: [eventSubjects.subjectId], references: [subjects.id] }),
}));
