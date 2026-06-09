# Forgot password email → Vercel + Resend

Password reset uses **Resend**. Production must have `RESEND_API_KEY` on **Vercel** (not only in `.env.local`).

## Quick connect (one command)

1. Create a Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create** → copy `vca_...`

2. Add to `.env.local`:

```bash
VERCEL_TOKEN=vca_your_token_here
RESEND_API_KEY=re_your_key_here
```

3. Verify **anyexameasy.com** in [Resend Domains](https://resend.com/domains) (Squarespace DNS — see Resend Squarespace guide).

4. Push to Vercel and redeploy:

```bash
npm run vercel:email:deploy
```

5. Confirm:

```bash
curl -s https://www.anyexameasy.com/api/health
```

Expect `"resend":"set"` and `"passwordResetEmail":"ok"`.

---

## Manual (Vercel Dashboard)

**Vercel** → **any-exam-eas** → **Settings** → **Environment Variables** → **Production**:

| Name | Value |
|------|--------|
| `RESEND_API_KEY` | `re_...` |
| `EMAIL_FROM` | `Any Exam Easy <noreply@anyexameasy.com>` |
| `NEXTAUTH_URL` | `https://www.anyexameasy.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.anyexameasy.com` |

Then **Deployments** → latest → **Redeploy**.

---

## Squarespace DNS (Resend)

Add in **Squarespace → Domains → anyexameasy.com → DNS → Custom records**:

| Type | Host | Value |
|------|------|--------|
| MX | `send` | From Resend (priority 10) |
| TXT | `send` | SPF from Resend (`v=spf1...`) |
| TXT | `resend._domainkey` | DKIM `p=...` from Resend |

Do **not** remove Vercel records (`@` A, `www` CNAME).

Details: [Resend × Squarespace](https://resend.com/docs/knowledge-base/squarespace)

---

## Test

```bash
npm run email:test-reset -- your@email.com
```

Use an account that signed up with **email + password**, not Google-only.
