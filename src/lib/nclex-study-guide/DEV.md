# NCLEX Study Guide — developer notes

Isolated **book/PDF reader** product surface. Not the blog. Not the QBank.

## Routes

| Path | Purpose |
|------|---------|
| `/nclex` | Thin product hub stub |
| `/nclex/study-guide` | Redirects to first chapter |
| `/nclex/study-guide/[chapterSlug]` | Three-pane reader |

Marketing homepage and QBank were **not** rewritten in this pass. Static `/nclex` takes precedence over the dynamic `[examSlug]` marketing page for NCLEX only.

## Run locally

```bash
# 1) Apply migration (Neon / local Postgres)
npx prisma migrate deploy
# or during local schema iteration:
npx prisma db push

npx prisma generate

# 2) Start app
npm run dev

# 3) Open
# http://localhost:3000/nclex
# http://localhost:3000/nclex/study-guide
```

Highlights / bookmarks / notes / progress **require sign-in** (FK to `User`). Anonymous users can still read chapters; save actions return 401 with a sign-in hint.

## Where to paste the manuscript

Drop `.md` files here:

```
content/nclex-study-guide/
```

Expected format (see `content/nclex-study-guide/README.md`):

```markdown
# Guide Title
## Chapter 1 — Title
### Section
body…
```

Then ingest (does **not** invent text):

```bash
npx tsx scripts/ingest-nclex-guide.ts
```

## Files you should not touch for manuscript work

- `src/components/landing/**` — marketing homepage
- `src/components/study/StudyBankPractice.tsx` / QBank player
- `src/app/(marketing)/page.tsx`
- Existing question bank APIs under `src/app/api/questions`

## Module map

- Prisma: `SgGuide`, `SgChapter`, `SgHighlight`, `SgBookmark`, `SgNote`, `SgReadingProgress` → tables `sg_*`
- Lib: `src/lib/nclex-study-guide/`
- APIs: `src/app/api/nclex-study-guide/`
- UI: `src/components/nclex-study-guide/StudyGuideReader.tsx`
- Migration: `prisma/migrations/20260907010000_nclex_study_guide/`

## Auth adapter

`src/lib/nclex-study-guide/auth.ts` — marked for swap when Auth requirements change. Writes use session `user.id` only (no fake DB user).
