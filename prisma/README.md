# Database

## User accounts (login foundation)

| Table / model | Purpose |
|---------------|---------|
| **User** | Email (unique, lowercase), `passwordHash` (bcrypt), profile fields |
| **Account** | Reserved for OAuth providers (NextAuth adapter) |
| **Session** | Reserved for database sessions (app uses JWT) |
| **Subscription** | Trial/billing row created at signup |

**App code:** `src/lib/user-auth.ts` — register, lookup by email, verify password, `lastLoginAt`.

**Flows:**

1. **Sign up** — `POST /api/register` → creates `User` + `Subscription` → client signs in with NextAuth credentials.
2. **Log in** — NextAuth `credentials` → `verifyUserPassword` → JWT session.
3. **Current user** — `GET /api/me` (requires session).
4. **Forgot password** — `POST /api/auth/forgot-password` → email with link → `POST /api/auth/reset-password`.
   - Requires `RESEND_API_KEY` + `EMAIL_FROM` in production (dev logs link to terminal).

## Subscriptions & free trial

- Signup with **trial** creates `trialing` + `trialEndsAt` (2 days). **Subscribe** creates `inactive` until Stripe checkout completes.
- When `trialEndsAt` passes, status becomes `trial_expired` and study features are blocked.
- User pays via Stripe Checkout (`POST /api/stripe/checkout`) → webhook sets `active`.
- Env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

Dev: `npm run db:expire-trial -- you@example.com` to test the paywall.

**Local dev test account** (premium + staff portal after seed):

```bash
npm run db:seed-user
# dev@anyexameasy.test / DevPassword1! — role admin, /internal access
# Sign in at /employee/login for staff portal (or /login then open /internal)
```

**Production:** Run `npx prisma migrate deploy` on Vercel build when `DATABASE_URL` is set.
