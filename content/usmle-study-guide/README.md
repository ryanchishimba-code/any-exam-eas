# USMLE study guides

Three books, one per Step, for the reader at `/usmle/study-guide`.

They stay hidden until a release flag is on. Students get a 404. An admin session can preview. The flags match the USMLE feed pattern:

| Flag | What it does |
| --- | --- |
| `NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC` | `1` or `true`. Turns on the sidebar link. Inlined at build time. |
| `USMLE_STUDY_GUIDE_PUBLIC` | `1` or `true`. Server-only. Read on each request. |

Either flag releases the books to students. Both are off in this repo.

## Routes

| Book | Path |
| --- | --- |
| Step 1 | `/usmle/study-guide/step-1` |
| Step 2 CK | `/usmle/study-guide/step-2-ck` |
| Step 3 | `/usmle/study-guide/step-3` |

`/usmle/study-guide` opens Step 1. The reader switcher moves between books. `/usmle` itself is unchanged.

## Ingest

Manuscripts live in `step-1/`, `step-2-ck/`, and `step-3/`. Numbered files are the chapters. Before anyone ingests, the reader falls back to those files so an admin can preview.

```bash
npm run ingest:usmle-guide -- --dry-run
npm run ingest:usmle-guide -- --step=step1
npm run ingest:usmle-guide -- --undo --step=step1
```

A real ingest writes a backup under `scripts/data/usmle-guide-backups/` (gitignored) and then upserts `sg_guides` / `sg_chapters`. It refuses the production database unless `USMLE_GUIDE_INGEST_ALLOW_PRODUCTION=1`.

Do not ingest production as part of authoring. Dry-run only until the clinical review is accepted.

Figures live in each book's `visuals/` folder and are mirrored in `public/usmle-study-guide/`.

**Study aid only.** Not clinical advice. Not affiliated with the NBME or the FSMB. No pass-rate claims.

Physician checklist: `CLINICAL-REVIEW.md`.
