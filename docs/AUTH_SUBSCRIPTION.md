# Authentication & subscription access

Production-ready access control built on **NextAuth (JWT)** + **Prisma** + **Stripe**.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Middleware │────▶│  Session (JWT)   │────▶│  PremiumGate / APIs │
│  (auth only)│     │  email + role    │     │  getUserAccess()    │
└─────────────┘     └──────────────────┘     └─────────────────────┘
                                                        │
                        ┌───────────────────────────────┴───────────────────────────────┐
                        │ trial (User.trialEndsAt) │ Stripe active │ compAccessUntil │
                        │ staff role bypass        │ grace past_due │ account active   │
                        └───────────────────────────────────────────────────────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| `src/middleware.ts` | Requires login for `/dashboard`, `/internal`, premium study routes |
| `src/lib/access-control.ts` | Single `getUserAccess()` — subscription + suspend + email verify |
| `src/lib/api-access.ts` | `requirePremiumApi()` for JSON routes |
| `src/components/PremiumGate.tsx` | Server component paywall for pages |
| `src/lib/subscription-access.ts` | Trial expiry, status evaluation |
| `src/lib/trial-eligibility.ts` | One trial per email |
| Stripe webhooks | `active`, `past_due` + grace, `canceled` |

## User roles (access)

| Role | Premium content | Admin portal |
|------|-----------------|--------------|
| Guest | No | No |
| Trial (`trialing`) | Yes | No |
| Subscriber (`active`) | Yes | No |
| Expired / inactive | No (paywall) | No |
| Staff (`support_staff`+) | Yes | Yes (`/internal`) |

## Protected routes

**Pages:** `/study`, `/learn`, `/generate`, `/progress`, `/checkout` (+ `/dashboard`, `/internal`)

**APIs:** exams generate, learn quilt, questions, lesson plans, progress GET/POST

## Environment variables

```bash
# Auth (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=long-random-string

# Database
DATABASE_URL="file:./dev.db"

# Trial & billing (optional overrides)
TRIAL_DAYS=7
GRACE_PERIOD_DAYS=3
MONTHLY_PRICE_USD=3.99
YEARLY_PRICE_USD=39.99

# Email verification (off by default locally)
REQUIRE_EMAIL_VERIFICATION=false
RESEND_API_KEY=
EMAIL_FROM=onboarding@resend.dev

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=          # monthly price id
STRIPE_PRICE_ID_YEARLY=   # yearly price id (optional)
```

## Deployment checklist

1. `npx prisma migrate deploy` (or `npm run db:push` on SQLite dev).
2. Set all env vars on Vercel; redeploy.
3. Stripe Dashboard → Webhook → `https://your-app/api/stripe/webhook` (checkout, subscription, invoice events).
4. Enable Google OAuth redirect: `{NEXTAUTH_URL}/api/auth/callback/google`.
5. `npm run db:seed-admin` for staff access; sign out/in to refresh JWT.

## Admin actions

`PATCH /api/internal/users/[userId]/access` (requires `admin.actions`):

- `accountStatus`: `active` | `suspended`
- `extendTrialDays`: number
- `grantCompDays`: complimentary access
- `revokeCompAccess`: boolean
- `subscriptionStatus`: manual status override

UI: CRM user profile → **Access management** panel.

## API reference

| Endpoint | Purpose |
|----------|---------|
| `POST /api/register` | Signup with trial or subscribe plan |
| `POST /api/auth/forgot-password` | Password reset email |
| `GET /api/auth/verify-email?token=` | Email verification |
| `POST /api/auth/resend-verification` | Resend verify email |
| `GET /api/subscription/status` | Client billing state |
| `POST /api/stripe/checkout` | `{ interval: "monthly" \| "yearly" }` |
| `POST /api/stripe/portal` | Billing portal |
| `POST /api/stripe/webhook` | Stripe events |

## Analytics

Billing KPIs included in `GET /api/internal/analytics/dashboard` → `billing`:

- Registered users, active subscribers, trials, churn, conversions
- Study tool usage, quiz scores, exam completions
