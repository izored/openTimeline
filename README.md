# OpenTimeline

> A local-first, open-source dashboard for documenting personal events on a scrollable vertical timeline.

OpenTimeline turns the scattered notes, dates, files, and people of your life into one navigable timeline. Tag events with actors (people, organisations) and group them by subject (a case, a job, a debt, an ongoing project). Scroll through years, search across everything, and drill into the details when you need them.

It runs entirely on your hardware. No cloud, no subscriptions, no API keys.

---

## Why

Most timelines are built for project management or social feeds. OpenTimeline is built for **personal record-keeping** — recovery journeys, legal proceedings, financial milestones, career changes, anything you'd rather not lose track of.

The data is yours. The schema is yours. The code is yours.

---

## Features

- **Vertical year-grouped timeline** — newest year at the top, scroll back through history
- **Events tagged by category** — `legal`, `debt`, `job`, `bv` (business), `personal`, `admin`
- **Subjects** — group related events under a long-running theme (a court case, a creditor, a job hunt)
- **Actors** — people and organisations connected to events
- **Status tracking** — `open`, `pending`, `resolved`, `blocked`
- **Evidence attachments** — link supporting documents to each event
- **Full-text search** — `⌘K` / `Ctrl+K`
- **Light/dark themes** — pastel mint or muted dark
- **Type-safe end-to-end** — tRPC + Zod from DB to UI
- **Local-first** — TiDB / MySQL on your own infrastructure
- **Smooth scroll** — Lenis-powered scroll experience

---

## Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Frontend    | React 19, Vite 7, Tailwind CSS 3, shadcn/ui |
| API         | Hono 4, tRPC 11                             |
| Database    | TiDB (MySQL-compatible) via Drizzle ORM     |
| Validation  | Zod                                         |
| Routing     | React Router 7                              |
| Animation   | GSAP, Lenis                                 |
| Language    | TypeScript                                  |

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/izored/openTimeline.git
cd openTimeline

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# → edit DATABASE_URL

# 4. Push schema to your DB
npm run db:push

# 5. Run dev server (Vite + Hono on :3000)
npm run dev
```

Then open `http://localhost:3000`.

The app ships with demo data so you can preview the UI without a database. Connect one when you're ready to use your own data.

---

## Environment variables

| Variable       | Required | Purpose                                                   |
| -------------- | -------- | --------------------------------------------------------- |
| `DATABASE_URL` | Yes      | TiDB / MySQL connection string                            |
| `APP_ID`       | No       | Reserved for future auth                                  |
| `APP_SECRET`   | No       | Reserved for future auth                                  |

Connection string format: `mysql://user:pass@host:port/dbname`

---

## Scripts

| Command              | What it does                                            |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Dev server with HMR (Vite + Hono)                       |
| `npm run build`      | Build → `dist/public/` (React) + `dist/boot.js` (Hono)  |
| `npm start`          | Run production server                                   |
| `npm run check`      | TypeScript type-check                                   |
| `npm run db:push`    | Sync schema to DB (dev, no migration file)              |
| `npm run db:generate`| Generate migration SQL from schema changes              |
| `npm run db:migrate` | Apply pending migration files                           |
| `npm run format`     | Prettier format                                         |
| `npm run test`       | Run Vitest                                              |

---

## Project structure

```
openTimeline/
├── api/                  Hono server + tRPC routers
│   ├── boot.ts           Server entry
│   ├── router.ts         Root tRPC router
│   ├── routers/          event, subject, actor sub-routers
│   ├── queries/          DB connection
│   └── middleware.ts     publicQuery builder
├── db/                   Drizzle schema + seed scripts
├── contracts/            Shared types
├── src/                  React app
│   ├── App.tsx           Main timeline page
│   ├── pages/            Routed pages (Settings)
│   ├── components/       Reusable UI
│   ├── providers/        tRPC, theme
│   └── data/             Demo data + UI constants
└── public/               Static assets
```

---

## Domain model

- **Event** — single dated entry. Has a category, status, optional end date, description, evidence, related events.
- **Subject** — long-running theme that events belong to (a creditor, a job, a case).
- **Actor** — person or organisation involved in events.

Events ↔ Actors and Events ↔ Subjects are many-to-many.

---

## Contributing

Contributions, bug reports, and ideas are welcome. Please open an issue before submitting large PRs so we can align on direction.

See [ROADMAP.md](./ROADMAP.md) for what's planned.
See [CHANGELOG.md](./CHANGELOG.md) for what's shipped.

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Author

Built by [Reda Izo](https://dev.izo.red) · `dev@izo.red`
