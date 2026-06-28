# NCLEX content sprint

Orchestrated pipeline to grow the NCLEX bank to **5,000 serve-ready** items with rationales and a pragmatic quality bar (competitive with budget prep tools, below UWorld polish).

## Run

```bash
npm run db:nclex-sprint
```

Dry-run (no DB writes):

```bash
npm run db:nclex-sprint -- --dry-run
```

Promote only (elevate + reactivate + sync):

```bash
npm run db:promote-nclex-5k
```

## Steps

1. **`db:promote-nclex-5k`** — elevate active failures, reactivate top inactive candidates, sync `qaPassed`
2. **`db:enrich-nclex-guidelines`** — rule-based guideline refs + explanation augmentation
3. **`db:sync-nclex-serve-ready`** — align `qaPassed` with serve-tier gate
4. **`db:qa-gate-nclex-best`** — promote/demote rows
5. **`db:audit-nclex-served`** — alignment audit artifact
6. **`db:report-nclex-serve-rate`** — serve vs best tier counts

## Serve-tier quality (pragmatic)

Defined in `src/lib/exam-prep/nclex-board-quality.ts` (`NCLEX_SERVE_QUALITY_CONTROLS`):

| Check | Best tier | Serve tier |
|-------|-----------|------------|
| Min score | 0.68 | **0.62** |
| Min explanation | 120 chars | **90 chars** |
| Min vignette | 40 chars | **35 chars** |
| Distractor rationales | Required | **Required** |
| Guideline refs | Structured refs required | **Refs OR society tie-in in explanation** |
| Curated source only | Yes | **No** (polished/elevated OK) |
| Cartoon/generic distractors | Blocked | **Blocked** |

Hard blockers (generic pharmacology distractors, clinical mismatches, etc.) apply to **both** tiers.

## Target

- **≥5,000** serve-ready NCLEX items (`NCLEX_SERVE_TARGET`)
- Live counts on site via `/api/marketing/bank-counts`

## If still short after promote

```bash
npm run db:enrich-nclex-guidelines
npm run db:generate-nclex-to-target -- --target 5000 --metric qaPassed
npm run db:promote-nclex-5k
```

## Related

- `npm run db:apply-perf-indexes` — Neon performance indexes after sprint
- `docs/performance.md` — session load targets
