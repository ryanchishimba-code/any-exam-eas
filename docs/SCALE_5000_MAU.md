# Scaling Any Exam Easy to 5,000 MAU

Target: **~5,000 monthly active users** on Vercel + Neon Postgres without service disruption during a marketing ramp.

> **5k MAU ≠ 5k concurrent.** Typical peak concurrent is ~1–3% of MAU (~50–150 users). This plan covers registered-user growth, API load, DB connections, billing, and ops — not a 5,000 simultaneous-user stress test (see [Load testing](#load-testing)).

See also: [SCALE_3000_MAU.md](./SCALE_3000_MAU.md), [VERCEL_DATABASE.md](./VERCEL_DATABASE.md), [MIGRATE_VERCEL_TO_AWS.md](./MIGRATE_VERCEL_TO_AWS.md).

---

## Architecture (production)

| Layer | Choice | 5k MAU notes |
|-------|--------|--------------|
| App | Next.js 15 on Vercel | Serverless scales horizontally; watch function duration on AI routes |
| DB | **Neon Postgres** (pooled URL) | Scale tier + `-pooler` hostname required |
| Auth | NextAuth JWT | Stateless — no session store bottleneck |
| Billing | Stripe Embedded Checkout | 7-day trial → $32.99/mo (+ multi-interval plans) |
| Rate limits | Upstash Redis (required) | In-memory limits break across Vercel instances |
| Question bank | ~84K shared rows | Not per-user — storage is not the bottleneck |
| Analytics | Raw events + daily rollup | Weekly purge of events older than 90 days (configurable) |

---

## Ramp phases

Use these gates before increasing ad spend or launch traffic.

### Phase 0 — Pre-launch (0 → 500 MAU)

**Goal:** Core path works; no silent failures.

- [ ] Neon **pooled** `DATABASE_URL` on Vercel Production (+ Preview for staging)
- [ ] `npx prisma migrate deploy` succeeds on deploy
- [ ] Stripe test checkout end-to-end (trial → webhook → premium access)
- [ ] Resend: verified domain + `EMAIL_FROM=noreply@anyexameasy.com`
- [ ] `CRON_SECRET` set; question-bank sync cron succeeds
- [ ] Public health: `GET https://www.anyexameasy.com/api/health` → `{ "ok": true }`

**Verify locally / CI:**

```bash
npm run scale:readiness   # needs CRON_SECRET — hits production /api/health
```

### Phase 1 — Early growth (500 → 1,500 MAU)

**Goal:** Multi-instance safety; billing accuracy.

- [ ] **Upstash Redis** — `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` on Vercel
- [ ] All four Stripe price IDs set (`STRIPE_PRICE_ID`, `_QUARTERLY`, `_SEMIANNUAL`, `_YEARLY`)
- [ ] `MONTHLY_PRICE_USD=32.99` matches Stripe Prices (`npm run stripe:sync-prices`)
- [ ] `STRIPE_WEBHOOK_SECRET` configured; test subscription lifecycle events
- [ ] Apple Pay domains registered: `npm run stripe:register-domains` (re-run when switching test → live keys)
- [ ] k6 smoke test passes: `npm run test:load:k6:smoke`

**Health detail (ops only):**

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" \
  https://www.anyexameasy.com/api/health | jq '.scaleReadiness'
```

Expect `ready: true`, `phase: "3k-5k"` or `"5k+"`.

### Phase 2 — Ramp (1,500 → 3,500 MAU)

**Goal:** Headroom for signup spikes and study sessions.

- [ ] Neon **Scale** plan (or higher) — monitor compute + storage in Neon console
- [ ] `PRISMA_CONNECTION_LIMIT=5` (default) — do not raise without Neon guidance
- [ ] Analytics crons enabled (see [vercel.json](../vercel.json)):
  - Daily rollup: `/api/cron/analytics-rollup` (06:15 UTC)
  - Weekly retention: `/api/cron/analytics-retention` (Sunday 07:00 UTC)
- [ ] `ANALYTICS_RETENTION_DAYS=90` (adjust if compliance requires longer)
- [ ] Monitor Vercel: function errors, p95 duration, 429 rate on `/api/questions`
- [ ] k6 moderate load: `npm run test:load:k6:5k` (200 VUs, realistic think time)

### Phase 3 — 5,000 MAU steady state

**Goal:** Predictable ops; cost controls.

- [ ] Review OpenAI + Tavily spend weekly (`/internal/analytics` for staff)
- [ ] Question bank count stable (`questionBank` in health checks)
- [ ] DB size trend flat or slow (user attempts dominate growth, not question bank)
- [ ] On-call runbook: health endpoint, Neon status, Stripe dashboard, Vercel logs
- [ ] **Before going live on Stripe:** swap to live keys, re-run `stripe:sync-prices` + `stripe:register-domains`, update Vercel env

**If you exceed 5k MAU or see sustained p95 > 3s on core APIs:** read [MIGRATE_VERCEL_TO_AWS.md](./MIGRATE_VERCEL_TO_AWS.md) for dedicated compute path.

---

## Storage estimate (not the bottleneck)

| Data | Approx size at 5k MAU |
|------|------------------------|
| Question bank (~84K items) | ~200–400 MB |
| Users + auth | ~5–20 MB |
| Question attempts (1 yr, active learners) | ~500 MB – 2 GB |
| Analytics raw events (90-day retention) | ~100–500 MB |
| Analytics daily summaries | Negligible |

Neon Scale includes ample storage for years at this scale if retention crons run.

---

## Environment checklist (Vercel Production)

| Variable | Required at 5k | Notes |
|----------|------------------|-------|
| `DATABASE_URL` | **Yes** | Must include `-pooler` in hostname |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | **Yes** | Distributed rate limits |
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | **Yes** | |
| `CRON_SECRET` | **Yes** | Crons + detailed health |
| `STRIPE_SECRET_KEY` | **Yes** | Live keys when charging real cards |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Yes** | |
| `STRIPE_PRICE_ID` (+ quarterly/semi/yearly) | **Yes** | Must match `MONTHLY_PRICE_USD` |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | |
| `MONTHLY_PRICE_USD` | **Yes** | `32.99` |
| `TRIAL_DAYS` | **Yes** | `7` |
| `RESEND_API_KEY` + `EMAIL_FROM` | **Yes** | Password reset |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://www.anyexameasy.com` |
| `NEXTAUTH_URL` | **Yes** | Same as site URL |
| `OPENAI_API_KEY` | Recommended | AI generation |
| `TAVILY_API_KEY` | Recommended | Research RAG |
| `ANALYTICS_RETENTION_DAYS` | Optional | Default `90` |

Push Stripe vars: `npm run vercel:stripe:push` (see [scripts/vercel-stripe-push.mjs](../scripts/vercel-stripe-push.mjs)).

---

## Load testing

| Command | Profile | When to run |
|---------|---------|-------------|
| `npm run test:load:k6:smoke` | 10 VUs, 75s | Before any deploy or campaign |
| `npm run test:load:k6:5k` | 200 VUs, ~10 min | Before Phase 2 ramp |
| `npm run test:load:k6:best` | 100 VUs | Regression after infra changes |
| `npm run test:load:k6` | 4000 VUs | **Ops approval only** — not representative of MAU |

Success criteria (smoke / 5k profiles):

- `http_req_failed` < 10%
- `errors` rate < 10%
- No sustained 503 from `/api/health`
- Login + `/api/questions` succeed for test premium user

Full k6 docs: [loadtests/k6/README.md](../loadtests/k6/README.md).

---

## Monitoring during ramp

1. **Automated:** `npm run scale:readiness` in CI or a daily cron (exit 0 = ready)
2. **Vercel:** Functions → errors, duration p95, invocations spike
3. **Neon:** Connections, CPU, storage graph
4. **Stripe:** Failed payments, webhook delivery failures
5. **Upstash:** Command count (rate limit traffic)

### Alert thresholds (action items)

| Signal | Action |
|--------|--------|
| Health `ok: false` | Check DB URL, Prisma connectivity |
| `scaleReadiness.upstash` fail | Add Upstash env vars immediately |
| `scaleReadiness.neonPooler` fail | Switch to pooled DATABASE_URL |
| 429 spike on auth/register | Review rate limits; possible abuse |
| Neon connection errors | Confirm pooler URL; avoid raising `connection_limit` blindly |
| Stripe price mismatch errors at checkout | Run `npm run stripe:sync-prices` + redeploy |

---

## Cost controls (LLM)

At 5k MAU, assume ~10–15% use AI generation weekly.

| Control | Location |
|---------|----------|
| Research cache (1h TTL) | `src/lib/cache.ts` |
| Free / paid usage caps | `src/lib/generate-test/usage-limits.ts` |
| Per-user + per-IP rate limits | API routes + Upstash |
| Disable heavy AI in load tests | `ENABLE_AI_HEAVY=false` (default) |

---

## Cron schedule (Vercel)

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/sync-question-bank` | Daily 05:00 UTC | Refresh question bank |
| `/api/cron/billing-reminders` | Hourly | Trial / renewal emails |
| `/api/cron/analytics-rollup` | Daily 06:15 UTC | Aggregate yesterday's events |
| `/api/cron/analytics-retention` | Sun 07:00 UTC | Purge raw events > retention window |

Manual trigger:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.anyexameasy.com/api/cron/analytics-retention
```

---

## Go-live checklist (Stripe live mode)

When switching from test to live:

1. Create / sync live Prices: `STRIPE_SECRET_KEY=sk_live_... npm run stripe:sync-prices`
2. Register domains: `npm run stripe:register-domains`
3. Update all Stripe env vars on Vercel (live secret, publishable, price IDs, webhook secret)
4. Configure live webhook endpoint → `https://www.anyexameasy.com/api/webhooks/stripe`
5. Redeploy production
6. Run `npm run scale:readiness` and one real $0 trial checkout

---

## Quick reference

```bash
# Production readiness report
CRON_SECRET=... npm run scale:readiness

# Pre-ramp load test (recommended)
npm run test:load:k6:5k

# Stripe price drift fix
npm run stripe:sync-prices && npm run vercel:stripe:push -- --redeploy
```

**Bottom line:** 5,000 MAU is achievable on current stack if Neon pooled URL + Upstash are configured before the ramp, analytics retention runs weekly, and you load-test at 200 VUs before major traffic increases.
