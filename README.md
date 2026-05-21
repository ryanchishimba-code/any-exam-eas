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

## Go live (recommended path)

1. Push the repo to **GitHub**
2. Import the project on **[Vercel](https://vercel.com)** (free tier works)
3. Add all `.env` variables in Vercel project settings
4. Switch `DATABASE_URL` to **PostgreSQL** (Neon, Supabase, or Vercel Postgres) and update `prisma/schema.prisma` provider to `postgresql`
5. Set up **Stripe webhook** → `https://your-domain.com/api/stripe/webhook`
6. Buy a domain and connect it in Vercel → Domains

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
