# Analytics & internal CRM

Lightweight admin CRM + analytics for Any Exam Easy. User-facing UX is unchanged; staff tools live under `/internal/*`.

## Architecture

```
src/lib/analytics/
  events.ts          # trackEvent(), logActivity(), recordGeneration()
  aggregate.ts       # getPlatformOverview(), rollupDailySummaries()
  request-context.ts # IP hashing (SHA-256), user-agent parsing
  types.ts           # EVENT_TYPES, StaffRole

src/lib/crm/
  user-profile.ts    # CRM profile + user search
  notes.ts           # Support notes, tags, bookmarks

src/lib/permissions.ts  # Role → permission matrix
src/lib/audit.ts        # AdminAction audit log

src/app/internal/       # Staff UI (Recharts dashboards)
src/app/api/internal/   # Permission-gated APIs
```

## Database models

| Model | Purpose |
|-------|---------|
| `AnalyticsEvent` | Append-only event store (indexed by type, user, date) |
| `AnalyticsDailySummary` | Pre-aggregated metrics (cron rollup) |
| `ActivityLog` | Human-readable user timeline |
| `GenerationHistory` | Exams/quilts per user |
| `UserSession` / `DeviceHistory` | Session & device telemetry |
| `UserUsageMetrics` / `UserPreference` | Rollups & preferences |
| `SupportNote` / `UserInternalTag` / `UserBookmark` | CRM |
| `AdminAction` | Employee audit trail |

`User` extensions: `role`, `accountStatus`, `lastActiveAt`, `mfaEnabled`.

## Roles & permissions

| Role | Analytics | CRM |
|------|-----------|-----|
| `user` | — | — |
| `support_staff` | Basic | View, notes, bookmarks |
| `moderator` | + education | + tags |
| `admin` | Full + billing | Full |
| `super_admin` | + system metrics | Full |

## Event tracking

```typescript
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

trackEvent({
  userId,
  eventType: EVENT_TYPES.QUESTION_GENERATED,
  category: "education",
  metadata: { field, subjectId, topic },
  req, // optional — hashes IP, parses UA
});
```

Wired today: register, login, exam generate (success/fail), quilt generate, progress updates, question bank fetch, Stripe webhooks, admin profile views.

## Staff UI

- `/internal/analytics` — platform KPIs + trend charts
- `/internal/users` — search CRM directory
- `/internal/users/[userId]` — profile, notes, tags, generation history, timeline

## Cron

Daily rollup (requires `CRON_SECRET`):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://your-app.vercel.app/api/cron/analytics-rollup"
```

## Local setup

```bash
npx prisma db push
DEV_USER_ROLE=admin npm run db:seed-user
# Log in as dev@anyexameasy.test, visit /internal/analytics
```

## Privacy

- IPs stored as truncated SHA-256 hashes only
- Staff routes require login; APIs re-check role from DB
- `AdminAction` logs profile views and note/tag changes
- No raw PII in `AnalyticsEvent.metadata` by convention

## Production migration

1. Run `prisma migrate deploy` on Postgres (migration `20250526120000_analytics_crm`)
2. Promote staff: `UPDATE "User" SET role = 'admin' WHERE email = 'you@company.com';`
3. Schedule Vercel cron for `/api/cron/analytics-rollup`
4. Optional: partition `AnalyticsEvent` by month at scale (see `docs/SCHEMA_RECOMMENDATIONS.md`)

## Future (no schema rewrite)

- Institution dashboards → `dimensions` JSON on summaries
- Token/API cost tracking → new event types + summary keys
- Export/save events when UI adds those actions
- Redis rate-limit + session store for multi-instance
