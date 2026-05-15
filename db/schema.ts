import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  json,
} from "drizzle-orm/mysql-core";

// ─── Actors Table ────────────────────────────────────────────────
export const actors = mysqlTable("actors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Subjects Table ──────────────────────────────────────────────
export const subjects = mysqlTable("subjects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Events Table ────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  year: int("year").notNull(),
  startDate: varchar("start_date", { length: 50 }).notNull(),
  endDate: varchar("end_date", { length: 50 }),
  ongoing: boolean("ongoing").notNull().default(false),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  description: text("description"),
  evidence: json("evidence"),
  relatedSlugs: json("related_slugs"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Event Actors Junction Table ─────────────────────────────────
export const eventActors = mysqlTable("event_actors", {
  id: serial("id").primaryKey(),
  eventId: int("event_id").notNull(),
  actorId: int("actor_id").notNull(),
});

// ─── Event Subjects Junction Table ───────────────────────────────
export const eventSubjects = mysqlTable("event_subjects", {
  id: serial("id").primaryKey(),
  eventId: int("event_id").notNull(),
  subjectId: int("subject_id").notNull(),
});
