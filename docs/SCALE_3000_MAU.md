# Scaling Any Exam Easy to 3,000 MAU

Target: **~3,000 monthly active users** on Vercel + Neon Postgres with controlled LLM spend.

> For the full ramp playbook through **5,000 MAU**, see [SCALE_5000_MAU.md](./SCALE_5000_MAU.md).

## Architecture (current)

| Layer | Choice | Notes |
|-------|--------|-------|
| App | Next.js 15 App Router | Server components + API routes |
| DB | **Neon Postgres** (pooled URL) | Prisma singleton in `src/lib/prisma.ts` |
| Auth | NextAuth JWT | Roles: `user`, `support_staff`, `moderator`, `admin`, `super_admin` |
| Billing | Stripe subscriptions | 7-day trial → $32.99/mo (`billing-config.ts`) |
| AI | OpenAI + Tavily RAG | Cached research briefs (`src/lib/cache.ts`) |
| Rate limits | Upstash Redis (production) | Required at multi-instance scale — see `src/lib/rate-limit-distributed.ts` |

## Database (Neon)

1. Use the **pooled** connection string (`-pooler` in hostname).
2. Set `DATABASE_URL` in Vercel Production + Preview + Build.
3. Prisma auto-appends `connection_limit=5`, `pool_timeout=20` via `withPoolParams()`.
4. Optional: `PRISMA_CONNECTION_LIMIT=5` env override.

**Indexes already in schema:** `QuestionAttempt` (userId+fieldId+createdAt), `GenerationHistory` (userId+createdAt), `ConceptMastery` (userId+conceptKey).

## Cost controls (LLM)

| Control | Location |
|---------|----------|
| Research cache (1h TTL) | `src/lib/research.ts` |
| Free tier: 3 gens/mo, 10 Q | `src/lib/generate-test/usage-limits.ts` |
| Paid tier: 200 gens/mo, 50 Q | same |
| Per-user rate limit 6/min | `/api/exams/generate`, `/api/generate-test` |
| Per-IP rate limit 40/min | `/api/generate-test` |

**At 3k MAU:** assume ~10% generate weekly → ~300 gens/week. Cache hit rate on repeated topics cuts Tavily + synthesis cost ~40–60%.

## Caching roadmap

| Phase | Implementation |
|-------|----------------|
| **Now** | In-process TTL cache (`src/lib/cache.ts`) |
| **3k+ MAU** | Upstash Redis for rate limits (required on Vercel) |
| **Optional** | Next.js `unstable_cache` for subject catalog |

## Question engine priorities

1. **RAG:** Tavily + OER domains per subject module (`src/lib/subjects/*/`)
2. **NCLEX:** Nursing prompts include unfolding cases, bow-tie, matrix, trend (`nursing/prompts.ts`)
3. **SAT Prep:** Dedicated module (`src/lib/subjects/sat/`)
4. **Adaptive:** `src/lib/learning/adaptive-session.ts` + mastery in Postgres
5. **Source citations:** Prompts require `[n]` references in explanations

## Auth & roles

- Students: `role=user` → `/dashboard`, `/study`, `/generate`
- Staff: `support_staff+` → `/internal/*` with permission checks (`src/lib/permissions.ts`)
- Google SSO optional via env

## Staff analytics

- Portal: `/internal/analytics` — MRR estimate, churn, subject performance
- Billing metrics: `src/lib/analytics/billing-metrics.ts`

## Deployment checklist

- [ ] Neon pooled `DATABASE_URL` on Vercel
- [ ] Upstash Redis for distributed rate limits
- [ ] Stripe Prices for $32.99/mo (+ quarterly/semi/yearly) — `npm run stripe:sync-prices`
- [ ] `OPENAI_API_KEY`, `TAVILY_API_KEY`
- [ ] `npx prisma migrate deploy` on deploy
- [ ] Disable Vercel Deployment Protection for production domain
- [ ] DNS: `anyexameasy.com` → Vercel

## Not yet built (roadmap)

- Conversational **AI Tutor** chat (LLM streaming)
- Full NGN interactive UI (bow-tie, matrix grids in player)
- MFA for staff accounts
