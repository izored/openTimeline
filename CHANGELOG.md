# Changelog

All notable changes to OpenTimeline will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-05-15

Initial public release.

### Added

- Vertical year-grouped timeline (most recent year at top)
- Event CRUD via tRPC (`event.list`, `byYear`, `bySlug`, `create`, `delete`, `search`)
- Subject CRUD (`subject.list`, `bySlug`, `create`, `delete`)
- Actor CRUD (`actor.list`, `create`, `delete`)
- Event categories: `legal`, `debt`, `job`, `bv`, `personal`, `admin`
- Event statuses: `open`, `pending`, `resolved`, `blocked`
- Many-to-many: events ↔ actors, events ↔ subjects
- Detail panel for individual events
- Subject drill-down panel
- Full-text search overlay (`⌘K` / `Ctrl+K`)
- Light / dark theme with persistence
- Settings page (`/settings`) with bento-grid layout
- Sidebar navigation with contextual greeting per page
- Active section highlighting + colored pill hover states
- Demo data: 85 events · 9 subjects · 26 actors · spans 2022 – 2026
- Automatic year derivation (no hardcoded year ranges)
- Smooth scroll powered by Lenis
- Zod validation on every tRPC input
- Drizzle ORM + MySQL2 driver for TiDB / MySQL
- Hono + Vite dev integration

### Design tokens

- Pastel mint / teal palette in light mode
- Muted dark mode
- Shared divider utility class (`.divider-b`, `.divider-t`, `.divider-l`, `.divider-card`) for consistent styling

---

## Unreleased

See [ROADMAP.md](./ROADMAP.md) for upcoming work.
