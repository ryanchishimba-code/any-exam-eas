# Vercel + database setup (Neon)

Production hosting stays on **Vercel**. The database is **PostgreSQL on Neon** (free tier works to start).

## Connect Neon ↔ Vercel (fastest)

### Automated prep (local)

```bash
npm run vercel:connect-neon
```

Prints copy-paste values and saves `scripts/.vercel-neon-env.json`.

### Official Vercel + Neon integration

1. [Vercel Dashboard](https://vercel.com/dashboard) → project **any-exam-eas**
2. **Storage** → **Create Database** → **Neon** → **Continue**
3. Select Neon project **`any-exam-easy`** (or create new)
4. Vercel injects **`DATABASE_URL`** automatically
5. Add auth secrets manually (**Production + Preview + Build**):
   - `NEXTAUTH_URL` = `https://any-exam-eas.vercel.app`
   - `NEXTAUTH_SECRET` / `CRON_SECRET` from `npm run vercel:setup`
6. **Deployments** → **Redeploy**

Docs: [Neon — Vercel integration](https://neon.tech/docs/guides/vercel)

---

## Part 1 — Create the database (Neon)

1. Open **[console.neon.tech](https://console.neon.tech)** and sign in (GitHub is fine).
2. **New project** → name: `any-exam-easy` → region: closest to your users (e.g. `US East`).
3. On the project dashboard, open **Connection details**.
4. Copy the **pooled** connection string (recommended for serverless).
5. Ensure the URL ends with SSL, e.g. add if missing:

   ```text
   ?sslmode=require
   ```

   Example shape:

   ```text
   postgresql://neondb_owner:PASSWORD@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Part 2 — Vercel environment variables

1. Open **[vercel.com](https://vercel.com)** → your project **any-exam-eas**.
2. **Settings** → **Environment Variables**.
3. Add each row below. For every variable, check **Production**, **Preview**, and **Build**.

| Name | Value |
|------|--------|
| `DATABASE_URL` | Your Neon pooled URL from Part 1 |
| `NEXTAUTH_URL` | `https://any-exam-eas.vercel.app` (your real domain) |
| `NEXTAUTH_SECRET` | Run `npm run vercel:setup` locally and copy the value |
| `CRON_SECRET` | From `npm run vercel:setup` |
| `OPENAI_API_KEY` | Your OpenAI key |
| `TAVILY_API_KEY` | Optional but recommended |

Optional: `STRIPE_*`, `RESEND_API_KEY`, `EMAIL_FROM` — see `.env.example`.

4. **Deployments** → latest → **⋯** → **Redeploy** (required after adding env vars).

## Part 3 — Verify

```bash
npm run vercel:setup
```

Or open in the browser:

```text
https://any-exam-eas.vercel.app/api/health
```

Success looks like:

```json
{
  "ok": true,
  "checks": {
    "nextauthSecret": "ok",
    "databaseUrl": "postgresql",
    "prisma": "ok"
  }
}
```

## Part 4 — Apply schema (first time)

Vercel’s build runs `prisma migrate deploy` when `DATABASE_URL` is set for **Build**.

If tables are missing, run migrations from your Mac (same Neon URL):

```bash
cp .env.example .env
# Paste DATABASE_URL into .env

npm run vercel:db
```

## Part 5 — Question bank (once)

After health is OK:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://any-exam-eas.vercel.app/api/cron/sync-question-bank"
```

Or wait for the weekly cron (see `vercel.json`).

## Alternative: Vercel Postgres (no Neon account)

1. Vercel project → **Storage** → **Create Database** → **Postgres**.
2. Connect it to the project — Vercel injects `POSTGRES_URL` or `DATABASE_URL`.
3. If only `POSTGRES_URL` exists, add env var:

   ```text
   DATABASE_URL = $POSTGRES_URL
   ```

   (Use Vercel’s “reference” UI to link the storage variable.)

4. Redeploy.

## Local development with the same database

```bash
# .env
DATABASE_URL="postgresql://...neon...?sslmode=require"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-dev-secret-min-16-chars

npm run vercel:db
npm run dev
```

## Do not use on Vercel

- `file:./dev.db` (SQLite) — not supported in production
- AWS RDS private endpoints — Vercel cannot reach VPC-only RDS

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `nextauthSecret: missing` | Add `NEXTAUTH_SECRET` → redeploy |
| `databaseUrl: missing` | Add `DATABASE_URL` for **Build** + **Production** → redeploy |
| `prisma: error` | Wrong password/URL; use **pooled** Neon string |
| Login still shows config warning | Hard refresh; confirm `/api/health` is ok |
| Empty question bank | Run cron sync (Part 5) |
| Production has few questions vs local | Vercel Neon integration (`exameasy_*`) may point at a **different** branch than `.env`. Run `npm run vercel:fix-neon-db` to set `DATABASE_URL` on production/preview/development from local `.env`, then redeploy |
| `DATABASE_URL` empty after `vercel env pull` | Production var may be `sensitive` or unset; app falls back to `exameasy_DATABASE_URL`. Fix with `npm run vercel:fix-neon-db` |

## Production hardening (required for reliability)

### 1. Lock canonical Neon URL on Vercel

After any Neon or env change:

```bash
npm run vercel:fix-neon-db          # sync DATABASE_URL + POSTGRES_* from .env.local
npm run vercel:fix-neon-db:verify   # audit only — no writes
npm run vercel:fix-neon-db:deploy   # sync + redeploy + verify question bank
```

This sets explicit `DATABASE_URL`, `POSTGRES_URL`, and `POSTGRES_PRISMA_URL` on **production, preview, and development**, overriding stale Vercel Neon integration vars (`exameasy_*`).

In the Vercel dashboard, ensure those vars are also checked for **Build**. Runtime refuses non-pooled Neon hosts on Vercel production.

### 2. Keep Neon compute awake (scale-to-zero)

Neon Free suspends compute after **~5 minutes** idle. That causes Prisma `P1001` / “Something went wrong” on the next study request.

Permanent mitigations in this repo:

| Layer | What it does |
|-------|----------------|
| Vercel cron `/api/cron/db-keepalive` every **3 minutes** | HTTP + Prisma `SELECT 1` so compute never reaches the 5-minute sleep window |
| `ensureNeonReady()` on study pages + `withDbCatch` APIs | Wakes Neon over HTTP before Prisma TCP |
| Prisma `$extends` retries | Backoff + one warm-and-retry on Vercel query timeouts |
| GitHub Actions uptime | Pings `/api/health` and keepalive when `CRON_SECRET` is set |

**Paid Neon:** disable Scale to Zero on the production compute (Neon Console → Branches → Compute → disable autosuspend) for always-on latency. Free plan cannot disable it — rely on the 3-minute keepalive.

### 3. Uptime + database monitoring

**Frequent liveness:** `.github/workflows/production-uptime.yml` pings `/api/health` every 5 minutes and on every `main` push. Failed runs appear under **Actions → Production uptime**.

**Every-other-day database check:** `.github/workflows/database-health.yml` runs at **15:00 UTC on every other day** (and via **Run workflow**). It requires repo secret `CRON_SECRET` and verifies:

1. Public `/api/health` → `ok: true`
2. Detailed health → `databaseUrl=postgresql`, `databasePing=ok`, Prisma/bank healthy
3. `/api/cron/db-keepalive` → Neon HTTP + Prisma warm succeed
4. **100 concurrent** public page/health requests succeed (reads-only capacity gate)

Add repo secret `CRON_SECRET` (same value as Vercel) so both workflows can probe the DB. Without it, the every-other-day job **fails** on purpose so you notice.

**100 concurrent users:** Vercel serverless + Neon pooler is sized for this (and well beyond). Live probe target: `npm run test:load:100:prod:reads`. Full authenticated study-session load: `npm run test:load:k6:best` (needs test account). See [SCALE_5000_MAU.md](./SCALE_5000_MAU.md) — ~100 concurrent is a normal peak for several thousand MAU.

**External (optional):** [Better Stack](https://betterstack.com/uptime) or [UptimeRobot](https://uptimerobot.com) on `https://www.anyexameasy.com/api/health` — expect HTTP 200 and `"ok":true`.

Local check:

```bash
npm run ops:health
CRON_SECRET=... npm run ops:health:detailed
CRON_SECRET=... npm run ops:health:database
npm run vercel:fix-neon-db:verify
```

## Related

- [README.md](../README.md) — full app setup
- AWS path (optional later): [AWS_RDS.md](./AWS_RDS.md)
