# Application audit — Any Exam Easy

**Date:** May 2026  
**Stack:** Next.js 15 (App Router), React 19, Prisma, NextAuth v5, Stripe, OpenAI, Tavily

## Executive summary

The app is a **premium ed-tech SaaS**: AI exam generation, flashcard quilts, question-bank review, subscriptions, and an internal employee portal. Architecture is sound for Vercel + Neon; AWS/Docker paths are now documented and containerized for portable deployment.

| Area | Status | Notes |
|------|--------|-------|
| Auth & access | Good | JWT sessions, premium route gating, staff `/internal` |
| Data layer | Good | Prisma + SQLite (dev) / PostgreSQL (prod) |
| Question engine | Good | `src/lib/questions/` + `StudySessionPlayer` |
| Payments | Good | Stripe checkout, webhooks, trial/grace |
| Analytics | Good | Events, CRM, question attempts |
| Testing | Improved | Vitest unit tests + smoke + CI workflow |
| Edge middleware | Fixed | No longer imports Prisma/Stripe via full `auth.ts` |
| Migrations | Action needed | Run `prisma migrate deploy` after pull (study tables) |

## Architecture

```
Browser → Next.js (middleware auth) → App Router pages
                ↓
         API routes (/api/*)
                ↓
    Prisma → SQLite | PostgreSQL
                ↓
    OpenAI / Tavily / Stripe / Resend (optional)
```

## Strengths

1. **Clear separation** — Edge `auth.config.ts` vs server `auth.ts` (after middleware fix).
2. **Field/subject modularity** — `src/lib/subjects/` for Medicine, Pharmacy, etc.
3. **Offline-capable bank** — Large question bank with cron sync.
4. **Operational health** — `/api/health` for deploy verification.
5. **Internal tooling** — Feedback inbox, user CRM, analytics dashboards.

## Weaknesses addressed in this pass

| Issue | Risk | Mitigation |
|-------|------|------------|
| Middleware imported full `auth.ts` | Edge runtime failures, Stripe in middleware | `NextAuth(authConfig)` only in `middleware.ts` |
| No unit tests | Regressions in question engine | Vitest + tests under `src/lib/questions/` |
| Missing study DB migration | Runtime errors on attempt/session APIs | `20250526210000_study_sessions` migration |
| `stripe.ts` in user-auth import chain | Heavier server deps | `billing-config.ts` for constants |
| No Docker/CI | Manual deploy risk | Dockerfile, compose, GitHub Actions |
| Stale `.next` cache | 500s on dev | `npm run clean` before dev |

## Remaining recommendations

1. **E2E tests** — Playwright for login → generate → answer flow.
2. **Postgres-native migrations** — Regenerate or verify SQL when switching provider.
3. **Secrets** — AWS Secrets Manager / SSM in production (see `AWS_DEPLOYMENT.md`).
4. **Rate limiting** — API routes (`/api/exams/generate`, auth).
5. **Observability** — CloudWatch or Datadog on AWS; Sentry for errors.

## Route inventory (high level)

| Path | Auth | Purpose |
|------|------|---------|
| `/` | Public | Marketing |
| `/login`, `/signup` | Public | Auth |
| `/employee/login` | Public | Staff login |
| `/study`, `/study/practice` | Premium | Study hub & bank review |
| `/learn`, `/generate` | Premium | Quilt & AI exams |
| `/internal/*` | Staff | Portal |
| `/api/health` | Public | Health check |
| `/api/exams/generate` | Premium API | AI exams |
| `/api/study/*` | Premium API | Sessions & attempts |

## Environment dependencies

See `.env.example`, `.env.docker.example`, and `src/lib/env.ts`. Production **requires**: `DATABASE_URL` (PostgreSQL), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

## Security checklist

- [ ] Rotate `NEXTAUTH_SECRET` and `CRON_SECRET` per environment
- [ ] Stripe webhook signature verification (implemented)
- [ ] Never commit `.env` / `.env.docker`
- [ ] Restrict `/api/cron/*` to bearer `CRON_SECRET`
- [ ] Review staff role assignment (`db:seed-admin` dev only)
