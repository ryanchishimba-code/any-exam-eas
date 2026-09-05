# Site health improvement path

Living plan from the 2026-08-26 production health review.
Track progress in the Cursor canvas `site-health-review` and the long-running goal.

**North star:** Keep production healthy (zero 5xx, fast question bank) while cutting unnecessary serverless cost and improving observability.

---

## Phase 1 — Neon cost / latency (P1)

**Goal:** Stop paying for keepalive if Neon compute can stay warm another way.

1. Open Neon Console → production branch → Compute.
2. Confirm plan:
   - **Free / scale-to-zero required** → keep `/api/cron/db-keepalive` at `*/3` (see `vercel.json`). Do not weaken it.
   - **Paid + Scale to Zero disabled** → change keepalive to hourly (or remove), redeploy, then watch `/api/health` and question-bank latency for 48h.
3. Record decision in this doc under [Decisions](#decisions).

**Done when:** Neon setting matches cron schedule, and no new “question bank unavailable” spikes.

**Status (2026-09-04):** Local `DATABASE_URL` reconfirmed **pooled** (`ep-small-resonance-…-pooler…neon.tech`). Keepalive remains `*/3` — Neon Console Scale to Zero still **unverified** (no API key / console access this session). Weakening keepalive without that confirmation would risk cold-start blips.

---

## Phase 2 — Observability (P1)

**Goal:** Native visitor metrics without guessing from cron logs.

1. Vercel → Project → Analytics → enable **Web Analytics**.
2. Ship `@vercel/analytics` on the root layout.
3. Verify the Web Analytics dashboard shows pageviews within 24h.

**Done when:** Web Analytics is no longer `not_found` for the project.

**Status (2026-09-05):** Code live on production (`bd224e0`) — `@vercel/analytics` in layout; client chunk confirms package shipped. **Product still disabled:** API returns `Web Analytics not found`. CLI refuses non-interactive enable (Pro paid feature). **User must run in a terminal and confirm:**

```bash
vercel project web-analytics enable any-exam-eas --scope ryanchishimba-codes-projects
```

Or Dashboard → Analytics → Enable: https://vercel.com/ryanchishimba-codes-projects/any-exam-eas/analytics


---

## Phase 3 — Beacon noise (P2)

**Goal:** Know whether `/api/analytics/beacon` 400s are bots or real clients.

1. Add **sampled** server logs on Zod failure (path keys only; no PII).
2. After 7 days, triage: ignore bots, or tighten client beacon payload.
3. Keep rate limit (do not loosen under Neon pool pressure).

**Done when:** Beacon 400 rate understood and either ignored or fixed upstream.

**Status (2026-09-04):** Sampled (~10%) Zod-failure logging in `src/app/api/analytics/beacon/route.ts` (keys only). Triage still pending after ~7 days of prod logs.

---

## Phase 4 — Marketing weight (P2)

**Goal:** Smaller homepage JS without hurting conversion.

1. Audit client components on `/` (dynamic imports, below-fold deferral).
2. Measure before/after: HTML/JS transfer size and LCP on mobile.
3. Ship only changes that do not regress hero CTA clarity.

**Done when:** Compressed homepage transfer down meaningfully with stable LCP.

**Status (2026-09-04):**
- `HomeExperience` only mounts `useUserAccess` inside an authenticated branch (guests skip access API work).
- `NgnInteractiveDemo` is `next/dynamic` + `ssr: false` inside `LandingSamplePractice`.

---

## Phase 5 — Social cron review (P3)

**Goal:** Avoid dozens of empty publishes/day if the queue is often idle.

1. Check `/api/cron/social-publish` success vs no-op rate.
2. If mostly no-ops (or publisher often unconfigured), move from `*/15` to hourly.
3. Keep cadence if posts regularly go out on that schedule.

**Done when:** Cron frequency matches real publish volume.

**Status (2026-09-04):** `social-publish` schedule set to `0 * * * *` (hourly) in `vercel.json`. Ayrshare publisher returns `notConfigured` when `AYRSHARE_API_KEY` is unset, so the old `*/15` cadence was mostly empty invocations.

---

## Guardrails (do not regress)

- Pooled Neon URL (`-pooler`) stays required on Vercel.
- Question-bank retries (500 → 1000 → 2000 ms) stay in place.
- Public `/api/health` must remain `ok=true` after every cron change.
- Prefer read-only probes; use `npm run test:load:100:prod:reads` for load, not write-heavy storms.

---

## Decisions

| Date | Phase | Decision | Owner |
|------|-------|----------|-------|
| 2026-09-04 | 1 | Keep db-keepalive `*/3` (pooled URL confirmed; Scale to Zero still unverified in Console) | Eng |
| 2026-09-04 | 2 | Ship `@vercel/analytics` in layout; enable product in Vercel dashboard / CLI | Eng |
| 2026-09-04 | 3 | Sample 10% of invalid beacon Zod errors to logs | Eng |
| 2026-09-04 | 4 | Defer access hook + dynamic-load NGN demo on homepage | Eng |
| 2026-09-04 | 5 | social-publish cron `*/15` → hourly | Eng |

---

## Quick commands

```bash
# Public health
npm run ops:health

# Detailed health (needs CRON_SECRET)
npm run ops:health:detailed

# Prod read load (100 concurrent)
npm run test:load:100:prod:reads
```
