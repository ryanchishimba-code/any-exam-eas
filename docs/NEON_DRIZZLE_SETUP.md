# Neon + Drizzle setup (Any Exam Easy)

This project uses **Neon Serverless Postgres** with:

- **Prisma** — existing auth, subscriptions, question bank, analytics
- **Drizzle ORM + `neon-http`** — new platform tables and serverless queries (dashboard stats, exam sessions, promos)

## 1. Neon project & connection string

1. Create a project at [Neon Console](https://console.neon.tech).
2. Copy the **pooled** connection string (hostname contains `-pooler`).
3. Add to `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Development vs production (branching)

| Environment | Recommendation |
|-------------|----------------|
| Local dev | Neon branch `dev` or `main` |
| Preview (Vercel) | Neon branch per preview, or shared `staging` |
| Production | Isolated `main` branch, no direct dev writes |

Create branches in Neon Console or CLI:

```bash
npx neonctl branches create --name dev --parent main
```

Point each environment’s `DATABASE_URL` at the correct branch connection string.

## 2. Required environment variables

```bash
# Database (Neon pooled URL)
DATABASE_URL=

# Auth — NextAuth (current). Optional Clerk for future:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Trial & pricing
TRIAL_DAYS=14
TRIAL_INTRO_PRICE_USD=17.99
MONTHLY_PRICE_USD=29.99

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
STRIPE_TRIAL_INTRO_PRICE_ID=
# Optional: map promo codes to Stripe Coupons
# PromoCode.stripeCouponId in DB → applied at checkout

# AI generation
OPENAI_API_KEY=

# Optional: textbook blobs
# BLOB_READ_WRITE_TOKEN=   # Vercel Blob
# AWS_S3_BUCKET=
```

## 3. Apply schema (Prisma migration)

Platform tables are defined in `prisma/schema.prisma` and migrated via:

```bash
npx prisma migrate deploy
# or local dev:
npm run db:push
npx prisma generate
```

Migration folder: `prisma/migrations/20250601120000_platform_neon_tables/`

### Tables

| Table | Purpose |
|-------|---------|
| `User.clerkId` | Optional Clerk user id |
| `PromoCode` / `PromoRedemption` | Signup promo validation |
| `exam_sessions` | Timed practice exams, answers JSONB, weak areas |
| `generated_questions` | AI-generated items |
| `flashcards` | Spaced repetition decks |
| `exam_topics` | Blueprint topics per exam hub |
| `textbook_uploads` | PDF metadata (blob URL) |
| `Subscription.plan` | trial / monthly / yearly label |

Seed promos: `WELCOME10` (10%), `STUDY20` (20%, max 500 uses).

## 4. Drizzle ORM

Schema: `src/db/schema.ts`  
Client: `src/db/index.ts` (Neon HTTP driver)

```bash
# Generate SQL from Drizzle schema (optional; Prisma is source of truth for deploy)
npm run db:drizzle:generate

# Open Drizzle Studio
npm run db:drizzle:studio
```

### Usage in Server Components

```ts
import { requireDb } from "@/db";
import { examSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const db = requireDb();
const rows = await db.select().from(examSessions).where(eq(examSessions.userId, userId));
```

## 5. Auth

**Current:** NextAuth v5 with credentials + Google/Apple. Login: `/login`, register: `/signup` or `/register`.

**Clerk (optional):** Set Clerk keys, sync `clerkId` on `User`, and replace `auth()` calls gradually.

## 6. Discount codes & Stripe

| Endpoint | Purpose |
|----------|---------|
| `GET /api/discount/validate?code=WELCOME10&plan=subscribe` | Real-time validation (debounced UI) |
| `POST /api/discount/validate` | Body `{ code, plan }` — explicit Apply |
| `GET /api/promo/validate` | Legacy alias |

Error codes: `not_found`, `inactive`, `expired`, `max_uses`, `already_redeemed`, `server_error`.

Discounts change **price only** — `hasPremiumAccess` ignores promo codes; full subscription features always apply when Stripe status is active/trialing.

Valid codes with `stripeCouponId` apply at embedded checkout.

## 7. Key routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Exam cards, quick stats (Drizzle) |
| `/prep/[exam]` | Exam hub (nclex, usmle, naplex, top500) |
| `/exam/[type]/[sessionId]` | Timed practice exam |
| `/analytics` | Performance charts & session history |
| `/api/ai/generate` | AI question generation |
| `/api/exam-sessions` | Create practice session |
| `/api/flashcards` | SR flashcards |

## 8. Row-level security (optional)

Neon supports Postgres RLS. Example policy pattern:

```sql
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY exam_sessions_user ON exam_sessions
  FOR ALL USING (user_id = current_setting('app.user_id', true));
```

Set `app.user_id` per request in a transaction if you adopt RLS. The app currently enforces access in application code (`userId` filters).

## 9. Connection pooling notes

- Use the **pooler** URL on Vercel/serverless.
- Drizzle `neon-http` = one-shot HTTP queries (ideal for Next.js Route Handlers).
- Long transactions: prefer Prisma or `@neondatabase/serverless` WebSocket driver if needed.

## 10. Verify

```bash
npm run db:check
npm run dev
# Sign up with promo WELCOME10 → checkout
# Open /dashboard → /prep/nclex → Start practice exam
```
