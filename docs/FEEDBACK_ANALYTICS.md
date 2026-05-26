# Feedback & Analytics

Extends the existing `/internal` staff portal with a public feedback form and a full analytics dashboard.

## Folder structure

```
prisma/schema.prisma              # UserFeedback model
src/lib/feedback/
  types.ts                        # Categories, sort/filter types
  validators.ts                   # Zod schema (public submit)
  service.ts                      # CRUD + trends
src/lib/analytics/
  dashboard.ts                    # getAnalyticsDashboard(), CSV export
  beacon-schema.ts                # Page-view beacon validation
  events.ts                       # trackPageView(), touchUserSession()
src/app/feedback/page.tsx         # Public feedback UI
src/components/feedback/FeedbackForm.tsx
src/components/analytics/PageViewTracker.tsx   # Client page-view middleware
src/app/api/feedback/route.ts                 # POST (public, rate-limited)
src/app/api/analytics/beacon/route.ts         # POST page views
src/app/api/internal/feedback/                # Staff inbox API
src/app/api/internal/analytics/dashboard/     # Dashboard + CSV export
src/app/internal/feedback/                    # Staff inbox UI
src/app/internal/analytics/                   # Enhanced dashboard (Recharts)
```

## Database

### `UserFeedback`

| Field | Description |
|-------|-------------|
| `name`, `email` | Optional contact |
| `category` | `general`, `bug`, `feature`, `content`, `billing`, `ux`, `other` |
| `message` | 10–5000 chars |
| `rating` | 1–5 |
| `status` | `open` \| `resolved` |
| `userId` | Set when logged in |
| `resolvedAt`, `resolvedById` | Staff resolution audit |

Apply locally:

```bash
npm run db:push
npx prisma generate
```

## API endpoints

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/feedback` | Public (15/min per IP) |
| POST | `/api/analytics/beacon` | Public (120/min per IP) |
| GET | `/api/internal/feedback` | `feedback.view` |
| PATCH | `/api/internal/feedback/[id]` | `feedback.manage` (resolve/reopen) |
| DELETE | `/api/internal/feedback/[id]` | `feedback.manage` |
| GET | `/api/internal/analytics/dashboard` | `analytics.view_basic` |
| GET | `...?format=csv` | `analytics.export` |

Query params for feedback inbox: `category`, `status`, `q`, `sort`, `limit`, `offset`.

Dashboard: `from`, `to` (ISO dates `YYYY-MM-DD`).

## Permissions

| Permission | Roles |
|------------|-------|
| `feedback.view` | support_staff+ |
| `feedback.manage` | moderator+ |
| `analytics.export` | admin+ |

## Page-view tracking

`PageViewTracker` in the root layout sends beacons on route change and `pagehide` (duration). Skips `/internal` and `/api` paths. Events stored as `PAGE_VIEW` in `AnalyticsEvent` with metadata `{ path, durationSec, referrer }`.

This is the recommended Next.js pattern (edge middleware cannot use Prisma).

## Staff UI

- `/feedback` — user-facing form
- `/internal/feedback` — inbox (filter, search, sort, resolve, delete)
- `/internal/analytics` — SaaS-style dashboard with date range, charts, 60s refresh, CSV export

## Security

- Rate limits on public endpoints
- IP hashed at rest (`ipHash`); no raw IP in feedback rows
- Staff routes require session + permission checks server-side
- Admin actions logged via `AdminAction`
- CSV export gated behind `analytics.export`

## Deployment

1. Run `prisma migrate deploy` (or `db push` on SQLite dev).
2. Ensure `DATABASE_URL`, `NEXTAUTH_SECRET` on Vercel.
3. Seed admin: `npm run db:seed-admin` — sign out/in to refresh JWT role.
4. Optional: extend `scripts/smoke-test.mjs` with `/feedback` and `/api/feedback` health.
5. Production analytics need traffic + optional cron rollup (`/api/cron/analytics-rollup`) for DAU trends.

## Dev credentials

See `npm run db:seed-admin` — `dev@anyexameasy.test` / `DevPassword1!` with `admin` role.
