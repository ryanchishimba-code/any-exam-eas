# Go live checklist

## 1. Vercel environment variables (required)

Project **any-exam-eas** → Settings → Environment Variables → **Production + Preview + Build**:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon pooled URL (`npx neonctl connection-string --pooled`) |
| `NEXTAUTH_URL` | `https://anyexameasy.com` |
| `NEXTAUTH_SECRET` | `npm run vercel:setup` |
| `CRON_SECRET` | `npm run vercel:setup` |
| `OPENAI_API_KEY` | Your key |
| `STRIPE_SECRET_KEY` | Live or test key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe |
| `STRIPE_PRICE_ID` | Monthly price ID |

Run `npm run vercel:connect-neon` to print DATABASE_URL + secrets.

## 2. Deploy

Push to `main` or **Redeploy** in Vercel. Build must show **Ready**.

## 3. Verify

```text
https://anyexameasy.com/api/health
→ "ok": true, "databaseUrl": "postgresql", "prisma": "ok"
```

## 4. Domain DNS

| Type | Host | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

See [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md).

## 5. Question bank (once)

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://anyexameasy.com/api/cron/sync-question-bank"
```

## 6. Stripe

Webhook: `https://anyexameasy.com/api/stripe/webhook`
