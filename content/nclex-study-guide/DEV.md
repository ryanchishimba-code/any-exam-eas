# NCLEX Study Guide — developer notes

Isolated **book/PDF reader** product surface. Not the blog. Not the QBank.

Full copy also at `src/lib/nclex-study-guide/DEV.md`.

## Routes

| Path | Purpose |
|------|---------|
| `/nclex` | Thin product hub stub |
| `/nclex/study-guide` | Redirects to first chapter |
| `/nclex/study-guide/[chapterSlug]` | Three-pane reader |

Static `/nclex` takes precedence over the dynamic `[examSlug]` marketing page for NCLEX only. Homepage and QBank were not rewritten.

## Run locally

```bash
npx prisma migrate deploy   # or: npx prisma db push
npx prisma generate
npm run dev
```

Open:
- http://localhost:3000/nclex
- http://localhost:3000/nclex/study-guide

Highlights / bookmarks / notes / progress **require sign-in** (FK to `User`). Anonymous users can still read; save actions return 401.

## Manuscript source

Paste-ready archive dropped as numbered chapters `00`–`16` in this folder
(from `anyexameasy-nclex-book-paste-ready.tar.gz`). Visuals: `visuals/` +
`public/nclex-study-guide/visuals/`.

```bash
npm run ingest:nclex-guide
```

## Do not touch (for manuscript / reader work)

- `src/components/landing/**`
- `src/components/study/StudyBankPractice.tsx` / QBank player
- `src/app/(marketing)/page.tsx`
- Question bank APIs under `src/app/api/questions`
