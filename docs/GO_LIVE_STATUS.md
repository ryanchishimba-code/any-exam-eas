# Go-live status — Any Exam Easy

Last verified: May 2026  
Repo: `ryanchishimba-code/any-exam-eas` · Production target: **Vercel + Neon** · Domain: **anyexameasy.com**

---

## Code & database (done)

| Item | Status |
|------|--------|
| Production build (`npm run build`) | Passes |
| GitHub `main` | Up to date (includes build fixes, Neon/Vercel docs) |
| Neon project `any-exam-easy` | Created |
| Prisma migrations on Neon | All 8 applied |
| DB connectivity | `npm run db:check` OK against pooled URL |

Local `.env` may still use SQLite (`file:./dev.db`). Production uses Neon via Vercel `DATABASE_URL`.

---

## Blockers before the public site works

### 1. Vercel Deployment Protection (401 on all routes)

**Symptom:** Visiting the Vercel URL shows “Authentication Required” / HTTP **401**.

**Fix:**

1. [Vercel Dashboard](https://vercel.com) → project **any-exam-eas**
2. **Settings** → **Deployment Protection** (or **Security**)
3. Set **Production** to **Public** (disable password/SSO on production)
4. Optional: keep protection on **Preview** only
5. **Deployments** → **Redeploy**

**Verify:**

```bash
curl -sS https://any-exam-eas-ryanchishimba-codes-projects.vercel.app/api/health
```

Expect JSON with `"ok": true`, not HTML login page.

---

### 2. Custom domain DNS (Squarespace → Vercel)

**Symptom:** `https://anyexameasy.com` shows Squarespace “Coming Soon” (`server: Squarespace`).

**Fix in Squarespace → Domains → anyexameasy.com → DNS:**

| Type | Host | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Remove Squarespace parking/forwarding and conflicting A/CNAME records.

**In Vercel:** **Settings** → **Domains** → add `anyexameasy.com` and `www.anyexameasy.com`.

Details: [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md)

**Verify:**

```bash
curl -sS -I https://anyexameasy.com | head -5
# server: Vercel  (not Squarespace)

curl -sS https://anyexameasy.com/api/health
# {"ok":true,...}
```

DNS can take **5–60 minutes** (sometimes up to 48h).

---

### 3. Vercel environment variables

**Symptom:** App loads but login shows missing `NEXTAUTH_SECRET` / `DATABASE_URL`, or `/api/health` shows `"missing"`.

**Fix:** **Settings** → **Environment Variables** — enable **Production**, **Preview**, and **Build** for each:

```bash
npm run vercel:connect-neon
```

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon **pooled** URL |
| `NEXTAUTH_URL` | `https://anyexameasy.com` |
| `NEXTAUTH_SECRET` | From script output |
| `CRON_SECRET` | From script output |
| `OPENAI_API_KEY` | Required for exam generation |
| `STRIPE_*` | Required for paid checkout |

Then **Redeploy**.

Details: [VERCEL_DATABASE.md](./VERCEL_DATABASE.md) · [GO_LIVE.md](./GO_LIVE.md)

---

## After go-live (once)

| Task | Command / action |
|------|------------------|
| Health check | `https://anyexameasy.com/api/health` |
| Question bank sync (once) | `curl -H "Authorization: Bearer $CRON_SECRET" https://anyexameasy.com/api/cron/sync-question-bank` |
| Stripe webhook | `https://anyexameasy.com/api/stripe/webhook` |
| Smoke test | `npm run test:smoke:prod` (after domain + protection fixed) |
| UI check | `/`, `/login`, `/signup`, `/study`, `/generate` |

---

## Quick reference

| URL | Purpose |
|-----|---------|
| https://vercel.com/dashboard | Env vars, domains, protection, redeploy |
| https://console.neon.tech | Database, connection strings |
| https://anyexameasy.com/api/health | Production health |
| [GO_LIVE.md](./GO_LIVE.md) | Full launch checklist |
| [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md) | Domain + DNS |
| [VERCEL_DATABASE.md](./VERCEL_DATABASE.md) | Neon ↔ Vercel |

---

## Checklist (printable)

- [ ] Vercel Production = **Public** (no 401)
- [ ] Env vars set (Production + Preview + **Build**)
- [ ] Redeploy succeeded (**Ready**)
- [ ] `/api/health` → `"ok": true`
- [ ] Squarespace DNS → Vercel A + CNAME
- [ ] Domain added in Vercel → **Valid Configuration**
- [ ] `anyexameasy.com` shows app (not Squarespace)
- [ ] Question bank cron run once
- [ ] Stripe webhook updated to custom domain
