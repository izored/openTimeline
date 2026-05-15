# Roadmap

A living list of planned work for OpenTimeline. Items are grouped roughly by horizon, not strictly ordered.

If you'd like to contribute to any of these, please open an issue first to align on approach.

---

## Near term (v0.2)

### Foundation

- [ ] Author proper `LICENSE` file (MIT) at repo root
- [ ] Add `CONTRIBUTING.md` with PR / issue conventions
- [ ] Add GitHub Actions CI: type-check, lint, tests on PR
- [ ] First test coverage — Vitest scaffolding exists but no tests yet
- [ ] Document `bv` category (Dutch private limited company) or rename for international audiences

### UX polish

- [ ] Mobile timeline detail panel (currently desktop-optimised)
- [ ] Keyboard navigation between events (`↑` / `↓`)
- [ ] Event status filter chips in the timeline header
- [ ] Hide-resolved-events toggle (wired up from settings)
- [ ] Compact view setting (wired up from settings)

### Data

- [ ] Inline event editing (currently create-only)
- [ ] Inline subject and actor editing
- [ ] Bulk import from JSON / CSV
- [ ] Export to JSON / CSV / PDF
- [ ] Auto-sync setting (refetch on window focus)

---

## Mid term (v0.3 – v0.4)

### Performance

- [ ] Fix N+1 query in `event.search` — refactor to single JOIN
- [ ] Virtualised scroll for large timelines (> 1000 events)
- [ ] Optimistic UI for event creation

### Features

- [ ] Multi-timeline support (separate dashboards per life area)
- [ ] Custom categories (user-defined, not hardcoded)
- [ ] Relationship visualisation between subjects and actors
- [ ] Time-range zoom (decades / years / months / weeks)
- [ ] Evidence file uploads with local storage backend
- [ ] Markdown rendering in event descriptions

### Infrastructure

- [ ] SQLite driver option (zero-config local DB)
- [ ] Docker Compose with TiDB / SQLite + app
- [ ] One-command self-host setup script

---

## Long term

### Auth

- [ ] Single-user password protection
- [ ] Multi-user with per-user data isolation
- [ ] OAuth providers (GitHub, Google) for shared instances

### AI

- [ ] Local LLM integration (Ollama) for event summarisation
- [ ] Natural-language search (semantic, not just substring)
- [ ] Auto-tagging suggestions from event descriptions

### Localisation

- [ ] i18n framework
- [ ] First non-English language pack
- [ ] Regional date / currency formats from settings

### Privacy

- [ ] Privacy mode (blur names + amounts) wired through the UI
- [ ] At-rest encryption for evidence files
- [ ] Optional E2E encryption for hosted instances

---

## Won't do (for now)

- Multi-tenant SaaS hosting
- Native mobile apps (React Native / Capacitor)
- Real-time collaboration

OpenTimeline is opinionated about being a **local-first, single-user, self-hosted** tool. These tradeoffs are deliberate.

---

## Suggestions?

[Open an issue](https://github.com/izored/openTimeline/issues/new) tagged `roadmap`.
