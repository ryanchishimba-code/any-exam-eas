# Any Exam Easy

AI-powered exam generation and adaptive learning quilts — Apple-inspired, dynamic, and built for students from K–12 through professional fields.

## Features

- **Exam generator** — Multi-source research (OER textbooks + web) → synthesis → high-yield exams
- **Learning quilt** — Flashcard and quiz tiles; choose flashcards, quiz, or mixed mode
- **Accounts** — Email signup, 18+ verification, progress tracking
- **Lesson plans** — K–12 and professional (medicine, nursing, pharmacy, engineering, etc.)
- **Billing** — 7-day free trial, then $9/month via Stripe
- **Legal** — Terms, Privacy, and liability disclaimers (review with a lawyer before launch)

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
| `STRIPE_*` | Payments — create a $9/mo price with 7-day trial in Stripe Dashboard |

### 4. Database

```bash
npx prisma db push
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Go live (Vercel)

1. Create a free **[Neon](https://neon.tech)** or **Vercel Postgres** database and copy the connection string.
2. On **[Vercel](https://vercel.com)** → **Add New Project** → import `ryanchishimba-code/any-exam-eas` from GitHub.
3. In **Environment Variables**, add everything from `.env.example` (production values). Enable each variable for **Production** and **Build** (especially `DATABASE_URL`):
   - `DATABASE_URL` — Neon/Vercel Postgres URL (`postgresql://…`, add `?sslmode=require` for Neon)
   - `NEXTAUTH_URL` — `https://any-exam-eas.vercel.app` (your real deployment URL)
   - `NEXTAUTH_SECRET` (or `AUTH_SECRET`) — `openssl rand -base64 32`
   - `CRON_SECRET` — another random string (weekly question-bank sync)
   - `OPENAI_API_KEY`, `TAVILY_API_KEY`, `STRIPE_*` as needed
4. Deploy (or **Redeploy** after pushing to `main`). Build runs `prisma migrate deploy`, syncs the question bank when Postgres is configured, then `next build`.
   - **Do not** use `file:./dev.db` on Vercel.
5. Verify: open `https://your-domain.vercel.app/api/health` — should return `"ok": true` with `databaseUrl: "postgresql"` and `nextauthSecret: "ok"`.
6. If `questionBank` is `empty-run-cron-sync`, call once: `GET /api/cron/sync-question-bank` with header `Authorization: Bearer <CRON_SECRET>` (or wait for the weekly cron on Pro).
7. Optional: **Stripe webhook** → `https://your-domain.com/api/stripe/webhook`; custom domain in Vercel → Domains.

## Stripe setup

1. Create a Product → recurring Price at **$9/month**
2. Copy Price ID → `STRIPE_PRICE_ID`
3. Enable **trial period** on Checkout (already set to 7 days in code)
4. Webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

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
