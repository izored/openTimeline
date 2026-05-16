# 📋 Changelog

All notable changes to OpenTimeline are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🚀 [0.48.0] — 2026-05-16

### 🛠️ Bug fixes

- 🔍 `event.search` — refactored from O(n) per-event queries to a single LEFT JOIN; actors grouped in JS after one round-trip
- 🪟 Subject detail panel — no longer blocked by loading state; opens immediately on pill click with loading indicator while data fetches
- 🪟 Subject detail panel — demo mode fallback: builds subject + events from local data when no DB is connected
- 📐 Subject detail panel — timeline spine repositioned from mid-dates (`left-78px`) to right of dates (`left-152px`), matching main timeline layout
- 📅 Subject detail panel — years now sorted newest-first, matching main timeline order
- 🖱️ Subject detail panel — mouse wheel scroll now works; Lenis no longer intercepts events inside the panel (`data-lenis-prevent`)
- ⚙️ Settings page — Export and About cards now side by side in the bento grid instead of stacked in one column

### 📚 Documentation

- 📖 `CONTRIBUTING.md` — added: setup, workflow, code conventions, domain constants, known gaps
- 🛣️ `ROADMAP.md` — restructured with status key, versioned horizons, and all Settings page placeholders documented as planned items
- 🔑 `.env.example` — corrected misleading comment on `APP_SECRET` (was "used for JWT signing"; now "Reserved — not used at runtime")

---

## 🚀 [0.47.0] — 2026-05-15

First public release. Ground-truth baseline for the repo and local development.

### ✨ Core features

- 🕰️ Vertical year-grouped timeline, most recent year at the top
- 📅 Event entries with start date, optional end date, ongoing flag
- 🏷️ Six categories: `legal` · `debt` · `job` · `bv` · `personal` · `admin`
- 🚦 Four status states: `open` · `pending` · `resolved` · `blocked`
- 🧑‍🤝‍🧑 Many-to-many event ↔ actor relationships
- 🗂️ Many-to-many event ↔ subject relationships
- 🔍 Full-text search overlay (`⌘K` / `Ctrl+K`)
- 📄 Detail panel for individual events
- 🎯 Subject drill-down panel
- 🔗 Related-event links (`relatedSlugs`)
- 📎 Evidence attachments per event (label + filename)

### 🎨 UI / UX

- 🌗 Light / dark theme with localStorage persistence
- 🌿 Pastel mint palette in light mode, muted dark mode
- 🧭 Shared sidebar component across every full page
- 👋 Contextual greeting in the sidebar (timeline vs settings)
- 💊 Coloured pill hover states per nav action (blue · teal · purple)
- 🎯 Active-section highlighting with teal indicator bar
- 📐 Bento-grid layout on the settings page
- 🪟 Smooth scroll via Lenis
- 📏 Shared divider utility classes (`.divider-b`, `.divider-t`, `.divider-l`, `.divider-card`)

### ⚙️ Settings page

- 🔧 Routed `/settings` page (replacing the legacy slide-over panel)
- 🔙 Inline back-to-timeline link
- 🦴 Placeholder controls for compact view, hide-resolved, category filter, privacy, localisation, export

### 🛠️ Backend

- 🚦 tRPC 11 router mounted at `/api/trpc/*`
- ✅ Zod validation on every input
- 🗃️ Drizzle ORM + MySQL2 driver for TiDB / MySQL
- 🦴 Lazy DB connection so the dev server runs without a database
- 🏗️ Hono 4 with Vite dev-server integration
- 🌱 Fast SQL seed script (`db/seed-fast.ts`)

### 📦 Demo data

- 🎬 85 events spanning 2022 – 2026
- 🏢 9 subjects across 4 creditors, 1 business, 1 employment journey, 3 themes
- 👥 26 actors covering creditors, courts, accountants, employers
- 🔁 Frontend falls back to demo data when the DB is unreachable

### 📚 Documentation

- 📖 README with quick-start, scripts, environment vars, project structure
- 🗒️ CHANGELOG (this file)
- 🛣️ ROADMAP with near / mid / long-term plans
- ⚖️ MIT LICENSE

### 🔧 Tooling

- 🧪 Vitest scaffold (`vitest.config.ts`)
- ✨ Prettier config
- 🔎 ESLint config
- 🐳 Dockerfile (basic single-stage)
- 🎯 TypeScript strict mode, path aliases (`@/`, `@db/`, `@contracts/`)

---

## 📅 Unreleased

See [ROADMAP.md](./ROADMAP.md) for upcoming work.
