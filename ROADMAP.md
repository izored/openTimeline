# Roadmap

A living document. Items grouped by horizon and theme — not strictly ordered within each group.

Want to work on something? Open an issue first to align on approach before writing code.

---

## Status key

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| 🔨 | In progress |
| 📋 | Planned |
| 💡 | Under consideration |

---

## Near term — v0.48 to v0.5

### Foundation

- ✅ `CONTRIBUTING.md` with PR / issue conventions
- ✅ Fix N+1 query in `event.search` — refactored to single JOIN
- 📋 GitHub Actions CI — type-check, lint, tests on PR
- 📋 First test coverage — Vitest scaffold exists, zero tests written
- 📋 Document or rename `bv` category for international audiences

### Settings page — wire up placeholders

All items below exist as disabled controls in `/settings`. Each needs implementation + persistence (localStorage or DB).

**Appearance**
- 📋 Compact view — denser event row spacing
- 📋 Show event dots — toggle dots on the timeline spine

**Timeline**
- 📋 Default year — which year loads on open (most recent / specific year)
- 📋 Hide resolved — filter out `resolved` events from the main timeline
- 📋 Category filter — show only selected categories

**Data**
- 📋 Database URL — in-app connection string configuration
- 📋 Auto-sync — refetch data on window focus

**Privacy**
- 📋 Privacy mode — blur actor names and monetary amounts
- 📋 Redact filenames — hide evidence filenames in panels

**Localisation**
- 📋 Language — interface language (depends on i18n framework)
- 📋 Date format — `YYYY-MM-DD` / `DD MMM YYYY` / regional
- 📋 Currency — symbol displayed alongside amounts

**Export**
- 📋 Export timeline — download as CSV or PDF

### UX polish

- 📋 Mobile timeline detail panel (currently desktop-optimised)
- 📋 Keyboard navigation between events (`↑` / `↓`)
- 📋 Inline event editing (currently create-only)
- 📋 Inline subject and actor editing

---

## Mid term — v0.6 to v1.0

### Performance

- 📋 Fix N+1 queries in `event.list` and `event.byYear` — same JOIN pattern applied to `event.search`
- 📋 Fix N+1 queries in `subject.bySlug` — refactor event + actor fetching to batch
- 📋 Virtualised scroll for large timelines (> 500 events)
- 📋 Optimistic UI for event creation and edits

### Data

- 📋 Bulk import from JSON / CSV
- 📋 Evidence file uploads with local storage backend
- 📋 Markdown rendering in event descriptions

### Infrastructure

- 📋 SQLite driver option (zero-config, no external DB needed)
- 📋 Docker Compose with TiDB / SQLite + app in one command
- 📋 One-command self-host setup script

### Features

- 📋 Custom categories (user-defined, not hardcoded)
- 📋 Event status filter chips in the timeline header
- 📋 Time-range zoom (years / months view toggle)
- 📋 Relationship visualisation between subjects and actors

---

## Long term — v1.x and beyond

### Auth

- 💡 Single-user password protection
- 💡 Multi-user with per-user data isolation
- 💡 OAuth providers (GitHub, Google) for shared instances

### Privacy & security

- 💡 At-rest encryption for evidence files
- 💡 Optional E2E encryption for hosted instances

### Localisation

- 💡 i18n framework
- 💡 First non-English language pack

### AI

- 💡 Local LLM integration (Ollama) for event summarisation
- 💡 Natural-language search (semantic, not substring)
- 💡 Auto-tagging suggestions from event descriptions

### Multi-timeline

- 💡 Separate dashboards per life area
- 💡 Cross-timeline actor and subject linking

---

## Won't do

- Multi-tenant SaaS hosting
- Native mobile apps (React Native / Capacitor)
- Real-time collaboration

OpenTimeline is opinionated: **local-first, single-user, self-hosted**. These are features, not constraints.

---

## Suggestions?

[Open an issue](https://github.com/izohub/opentimeline/issues/new) tagged `roadmap`.
