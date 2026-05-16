# Contributing to OpenTimeline

## Before you start

OpenTimeline is a personal-record-keeping tool, not a generic project manager. Keep that lens when proposing features — changes should serve someone documenting their own events, cases, and relationships over time.

## Setup

```bash
git clone https://github.com/izohub/opentimeline.git
cd opentimeline/github
cp .env.example .env          # add your DATABASE_URL
npm install
npm run db:push               # sync schema to DB
npx tsx db/seed-fast.ts       # optional demo data
npm run dev                   # http://localhost:3000
```

Requires Node 20+ and a MySQL-compatible database (TiDB, PlanetScale, or local MySQL).

## Workflow

1. Open an issue before large changes — alignment first, code second.
2. Fork → feature branch → PR against `main`.
3. Run `npm run check` (TypeScript) and `npm run lint` before pushing.
4. Keep PRs focused. One concern per PR.

## Code conventions

- All tRPC inputs validated with Zod.
- DB accessed only via `getDb()` — never import Drizzle directly.
- No raw `console.log` in API code.
- No new dependencies without discussion.

## Domain constants

| Constant | Values |
|----------|--------|
| Categories | `legal` `debt` `job` `bv` (business entity) `personal` `admin` |
| Statuses | `open` `pending` `resolved` `blocked` |

## Known gaps (good first issues)

- Zero test coverage despite `vitest.config.ts` being present — any test is an improvement.
- No CI/CD — a basic GitHub Actions workflow (lint + type-check) would help.
- `event.list` and `event.byYear` still use per-event queries — same JOIN refactor applied to `event.search` should be replicated there.

## Questions

Open a GitHub Discussion or file an issue.
