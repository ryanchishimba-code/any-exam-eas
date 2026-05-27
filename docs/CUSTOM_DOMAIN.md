# Custom domain — anyexameasy.com

Connect **anyexameasy.com** to Vercel project **any-exam-eas**.

## Prerequisites

1. Production deploy must **succeed** (fix failed builds before adding domain).
2. You control DNS at your registrar (GoDaddy, Namecheap, Cloudflare, etc.).

## Step 1 — Add domain in Vercel

**Dashboard:** [vercel.com](https://vercel.com) → **any-exam-eas** → **Settings** → **Domains** → Add:

- `anyexameasy.com`
- `www.anyexameasy.com` (recommended)

**CLI** (from repo root, after `npx vercel link`):

```bash
npx vercel domains add anyexameasy.com
npx vercel domains add www.anyexameasy.com
```

If you see *"latest production deployment has errored"*, fix the deploy first (Step 2), then retry.

## Step 2 — DNS records (at your registrar)

Vercel shows exact values after you add the domain. Typical setup:

### Apex root (`anyexameasy.com`)

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |

### WWW (`www.anyexameasy.com`)

| Type | Name | Value |
|------|------|--------|
| **CNAME** | `www` | `cname.vercel-dns.com` |

### Using Cloudflare

- Proxy status: **DNS only** (grey cloud) until SSL is verified, or use Full (strict) after cert is active.
- Do not add conflicting A/CNAME records for the same host.

## Step 3 — Update app env vars

**Vercel** → **Environment Variables** → set for Production + Preview + Build:

```text
NEXTAUTH_URL=https://anyexameasy.com
```

Redeploy after changing.

## Step 4 — Redirect www → apex (optional)

Vercel → **Domains** → `www.anyexameasy.com` → **Redirect to** `anyexameasy.com`.

## Step 5 — Verify

- DNS propagation: 5 minutes – 48 hours (often under 1 hour).
- Vercel shows **Valid Configuration** on the Domains page.
- Open `https://anyexameasy.com/api/health` → `"ok": true`.

## Stripe & OAuth

Update URLs to use the custom domain:

- Stripe webhook: `https://anyexameasy.com/api/stripe/webhook`
- Google OAuth redirect (if used): add `https://anyexameasy.com` in Google Cloud Console

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Domain add blocked | Fix last production deployment, then redeploy |
| SSL pending | Wait; ensure DNS points to Vercel |
| Auth redirect errors | Set `NEXTAUTH_URL` to `https://anyexameasy.com` and redeploy |
| Wrong site | Confirm domain is on project **any-exam-eas**, not another team project |
