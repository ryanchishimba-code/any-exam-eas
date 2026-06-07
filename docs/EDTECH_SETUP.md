# AnyExamEasy — Edtech Study Hub Setup

This guide covers **Clerk** (optional auth), **Neon Postgres**, **Drizzle + Prisma**, and seeding the Study Hub schema.

## Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) project (or any Postgres matching `DATABASE_URL`)
- (Optional) A [Clerk](https://clerk.com) application for hosted auth

## 1. Environment variables

Create `.env.local`:

```bash
# Neon — pooled connection recommended for serverless
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth (current production auth)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional — Clerk (schema supports User.clerkId; wire middleware when migrating)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...
```

## 2. Database schema

The Study Hub adds four tables:

| Table | Purpose |
|-------|---------|
| `Exam` | Static reference for NCLEX, USMLE, NAPLEX, MPJE |
| `UserExamPreference` | User's primary exam + `lastStudiedAt` |
| `HighYieldTopic` | Exam-specific book-summary topics |
| `UserTopicProgress` | Topic views and practice launches |

Apply migrations:

```bash
npm run db:migrate
# or for local dev:
npx prisma db push
npx prisma generate
```

## 3. Seed exams, topics, and starter questions

```bash
npx tsx scripts/seed-edtech.ts
```

This upserts:

- 4 exams from `src/lib/edtech/exams.ts`
- 48 high-yield topics (12 per exam) from `src/lib/edtech/seeds/`
- ~144 starter MCQs (3 per topic) tagged `edtech-seed`

Full question bank sync (existing pipeline):

```bash
npm run db:sync-questions
```

## 4. Drizzle

Drizzle mirrors Prisma tables in `src/db/schema.ts`. Use Drizzle for analytics queries; Prisma for upserts in seed scripts.

```bash
npm run db:drizzle:push   # optional — Prisma is source of truth for migrations
npm run db:drizzle:studio
```

## 5. Clerk migration (optional)

The app currently uses **NextAuth v5** with credentials. To adopt Clerk:

1. Install `@clerk/nextjs` and add keys to `.env.local`.
2. Map Clerk `userId` → `User.clerkId` on first sign-in (webhook or `afterSignIn`).
3. Replace `auth()` calls gradually; `UserExamPreference.userId` stays the internal `User.id`.
4. Protect `/study-hub`, `/onboarding/exam-select` with Clerk middleware.

`User.clerkId` is already nullable and unique in Prisma.

## 6. User flow

1. **Login** → `/auth/login`
2. **Exam selection** → `/onboarding/exam-select` (if no `UserExamPreference`)
3. **Study Hub** → `/study-hub` (5 feature cards)
4. **High-yield topics** → `/study-hub/topics`
5. Switch exam anytime via the **Exam** dropdown on dashboard/topics

## 7. Development

```bash
npm install
npm run dev
```

Visit `/onboarding/exam-select` after signing in to set your primary exam.

## Key paths

| Area | Path |
|------|------|
| Types | `src/types/edtech.ts` |
| Exam catalog | `src/lib/edtech/exams.ts` |
| Topic seeds | `src/lib/edtech/seeds/` |
| Preference service | `src/lib/edtech/exam-preference.ts` |
| Study Hub page | `src/app/study-hub/page.tsx` |
| Topics page | `src/app/study-hub/topics/page.tsx` |
| Exam onboarding | `src/app/onboarding/exam-select/page.tsx` |
