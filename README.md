# Any Exam Easy

AI-powered exam generation and adaptive learning quilts — Apple-inspired, dynamic, and built for students from K–12 through professional fields.

## Features

- **Exam generator** — Multi-source research (OER textbooks + web) → synthesis → high-yield exams
- **Learning quilt** — Flashcard and quiz tiles; choose flashcards, quiz, or mixed mode
- **Accounts** — Email signup, 18+ verification, progress tracking
- **Lesson plans** — K–12 and professional (medicine, nursing, pharmacy, engineering, etc.)
- **Billing** — 5-day free trial (500 practice questions, no payment required) then Pro at $27.99/mo via Stripe (see `src/lib/billing-config.ts`)
- **Legal** — Terms, Privacy, and liability disclaimers (review with a lawyer before launch)

## Testing

```bash
npm run test:unit      # Vitest — question engine, stems, sessions
npm run test:smoke     # HTTP smoke (dev server on :3000)
npm test               # unit + smoke
```

CI runs lint, unit tests, and production build on push (`.github/workflows/ci.yml`).

## Docker (local production-like)

```bash
cp .env.docker.example .env.docker
# Edit NEXTAUTH_SECRET and API keys
docker compose up --build
```

See [docs/AWS_DEPLOYMENT.md](docs/AWS_DEPLOYMENT.md) for AWS architecture.

### AWS RDS (recommended for AWS hosting)

1. Create **RDS PostgreSQL 16** in the AWS Console (private VPC, no public access).
2. Copy `.env.rds.example` → `.env` and set `DATABASE_URL` to your RDS endpoint.
3. Run:

```bash
npm run db:rds -- --sync --seed-admin
npm run dev
```

Full steps: [docs/AWS_RDS.md](docs/AWS_RDS.md)

## Quick start

### 1. Install Node.js

If `npm` is not available, install Node 20+:

```bash
brew install node
```

### 2. Install dependencies

```bash
cd /Users/ryanchishimba/Desktop/cursor
npm install
cp .env.example .env
```

### 3. Configure environment

Edit `.env`:

| Variable | Purpose |
|----------|---------|
| `NEXTAUTH_SECRET` | Random string — `openssl rand -base64 32` |
| `OPENAI_API_KEY` | Exam & quilt generation |
| `TAVILY_API_KEY` | Web + OER search (OpenStax, LibreTexts, Wikibooks, etc.) — [tavily.com](https://tavily.com) |
| `STRIPE_*` | **Required for paid access after trial** — $3.99/mo subscription (see Stripe setup below) |
| `RESEND_API_KEY` | Password reset emails (optional in dev) |

### 4. Database

```bash
npx prisma db push
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` repairs stale `.next` cache, frees port 3000, and aligns auth URLs on `localhost`. After `npm run build`, use `npm run dev:fresh` if you see chunk or 500 errors. Plain `next dev` without those guards: `npm run dev:next`.

## Go live on Vercel (recommended)

**Hosting:** [Vercel](https://vercel.com) · **Database:** [Neon](https://neon.tech) PostgreSQL

**Full guide:** [docs/VERCEL_DATABASE.md](docs/VERCEL_DATABASE.md) · **Launch status:** [docs/GO_LIVE_STATUS.md](docs/GO_LIVE_STATUS.md)

### Quick steps

1. **Neon** → [console.neon.tech](https://console.neon.tech) → New project → copy **pooled** connection string (`?sslmode=require`).
2. **Secrets locally:** `npm run vercel:setup` → copy `NEXTAUTH_SECRET` and `CRON_SECRET`.
3. **Vercel** → Project → **Environment Variables** → add for **Production**, **Preview**, and **Build**:

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | Neon pooled URL |
   | `NEXTAUTH_URL` | `https://any-exam-eas.vercel.app` |
   | `NEXTAUTH_SECRET` | from step 2 |
   | `CRON_SECRET` | from step 2 |

4. **Redeploy** (Deployments → ⋯ → Redeploy).
5. **Schema (if needed):** paste same `DATABASE_URL` in local `.env` → `npm run vercel:db`.
6. **Verify:** `https://any-exam-eas.vercel.app/api/health` → `"ok": true`.
7. **Question bank (once):** `curl -H "Authorization: Bearer CRON_SECRET" https://any-exam-eas.vercel.app/api/cron/sync-question-bank`

Do **not** use `file:./dev.db` on Vercel.

## AWS (optional)

ECS + RDS for self-hosted production: [docs/MIGRATE_VERCEL_TO_AWS.md](docs/MIGRATE_VERCEL_TO_AWS.md) · `npm run aws:bootstrap`

## Stripe setup (cards, Apple Pay, Google Pay, Link)

1. Create a Product → recurring Price at **$3.99/month** → copy **Price ID** → `STRIPE_PRICE_ID`
2. Add env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
3. In [Stripe Dashboard → Settings → Payment methods](https://dashboard.stripe.com/settings/payment_methods), enable **Cards**, **Apple Pay**, **Google Pay**, and **Link**
4. **Apple Pay:** register your domain under Stripe → Settings → Payment methods → Apple Pay (required for Safari / iOS)
5. Checkout UI: users pay at `/checkout` (embedded) or via hosted Stripe Checkout
6. Webhook URL: `https://your-domain.com/api/stripe/webhook`  
   Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
7. Free trial is handled in-app (2 days); paid checkout uses Stripe at **$3.99/month**

## Legal note

Terms, Privacy, and Disclaimers in `/legal` are **templates**. Have a licensed attorney review them before accepting paying users, especially for health-education content and subscription billing.

## How exam quality works

For each topic, the app runs **7 parallel searches**:

1. OpenStax / LibreTexts textbook chapters (OER)
2. Additional open educational resources
3. Wikibooks / Wikiversity study guides
4. Commonly tested / high-yield exam topics
5. Curriculum & learning objectives
6. Comprehensive study guides
7. Practice tests and quizzes

Sources are deduplicated, synthesized into a **research brief**, then used to write questions tagged **high yield** when appropriate.

**Required for full quality:** both `TAVILY_API_KEY` and `OPENAI_API_KEY` in `.env`.

## Project structure

```
src/
  app/          # Pages & API routes
  components/   # UI (Hero, ExamGenerator, LearningQuilt, etc.)
  lib/          # AI, search, Stripe, Prisma, legal copy
prisma/         # Database schema
```
