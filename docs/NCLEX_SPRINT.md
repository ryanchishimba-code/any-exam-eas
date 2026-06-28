# NCLEX content sprint

Orchestrated pipeline to grow and validate the NCLEX serve-ready bank.

## Run

```bash
npm run db:nclex-sprint
```

Dry-run (sync + QA only, skip enrichment writes):

```bash
npm run db:nclex-sprint -- --dry-run
```

## Steps

1. **`db:sync-nclex-serve-ready`** — align `qaPassed` with best-tier NCLEX quality gate
2. **`db:enrich-nclex-guidelines`** — backfill structured rationales for nursing items
3. **`db:qa-gate-nclex-best`** — promote/demote best-tier rows
4. **`db:audit-nclex-served`** — write `artifacts/nclex-served-alignment-audit.json`
5. **`db:report-nclex-best-rate`** — best-tier coverage report

## Target

- **≥5,000** serve-ready NCLEX items before marketing parity
- Live counts on site via `/api/marketing/bank-counts` (no static inflation)

## Related

- `npm run db:apply-perf-indexes` — apply Neon performance indexes after sprint
- `docs/performance.md` — session load targets
