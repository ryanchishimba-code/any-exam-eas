# Analytics / CRM migration plan

## Phase 1 (shipped)

- [x] Prisma models + SQLite migration
- [x] `trackEvent` + activity/generation persistence
- [x] Permission matrix + internal APIs
- [x] `/internal` dashboards (analytics + CRM)
- [x] Instrumentation on auth, generate, quilt, register, Stripe, progress

## Phase 2 (recommended next)

1. **Production Postgres** — `prisma migrate deploy`; avoid SQLite for analytics volume
2. **Vercel cron** — daily `analytics-rollup` + existing question-bank sync
3. **Staff accounts** — set `role` on real employees; never expose `/internal` in public nav
4. **JWT refresh** — sign out/in after role change so `session.user.role` updates (APIs already read DB)

## Phase 3 (scale)

1. **Event retention** — archive events older than 90 days to cold storage
2. **Materialized views** — subject/topic rollups without scanning `GenerationHistory`
3. **Optional `AcademicField` tables** — see `SCHEMA_RECOMMENDATIONS.md`
4. **GDPR** — `accountStatus: deleted` + anonymize email on delete request

## Rollback

- Revert app deploy; old routes ignore new tables
- New tables are additive; no breaking changes to `Exam` / `User` auth flows

## Verification

```bash
npm run build
# As admin user:
open http://localhost:3000/internal/analytics
open http://localhost:3000/internal/users
# Generate an exam → check CRM profile for new GenerationHistory row
```
