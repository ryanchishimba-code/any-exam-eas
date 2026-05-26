# Vercel + database setup (Neon)

Production hosting stays on **Vercel**. The database is **PostgreSQL on Neon** (free tier works to start).

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

## Related

- [README.md](../README.md) — full app setup
- AWS path (optional later): [AWS_RDS.md](./AWS_RDS.md)
