# NAPLEX content fix prep (2026-10-20)

**Status:** content fix **applied** 2026-10-20 (backup `qbi_naplex_content_fix_backup_20261020`, 5 rows). Re-score **not** applied.

## Located items (by stem / key, not exam order)

| Ref | Bank id | Confidence | Notes |
|-----|---------|------------|-------|
| Q71 Cockcroft-Gault 65F, 70 kg, SCr 1.2 | `cmshfh02g00011y4nphbw7995` | **High** | Options `56/66/76/86`, key `56 mL/min`; math = **51.6** → target key **52 mL/min** |
| Q26 diabetes GLP-1 first | `cmqvk1ii000111yvd18azdtnn` | **High** | Stem generic; key `Suggest adding a GLP-1 receptor agonist.` — vignette needs labs/comorbidities |
| Q4 osteoporosis T-score | `cmqvlwbg7001r1yd78mtrdr54` | **High** | Key `Vitamin D level of 25 ng/mL`; option includes `T-score of -2.5` |
| Q19 MRSA SSTI linezolid vs vanco | `cmshdzo0400181y1il9udravj` | **Medium** | MRSA skin infection; options include both; key **Linezolid** — needs severity/disposition for IV vanco |
| Q38 sertraline activation | `cmqvn3qr400101yvveafntelj` | **Medium** | Key `Increased anxiety after starting sertraline.` — **Alt:** `cmr7sbvjj00171y2vi1i8x6zv` (early response expectation) |

Run `01-locate-items.sql` to re-verify live rows before apply.

## Backup tables (created only on `--apply`)

| Table | Contents |
|-------|----------|
| `qbi_naplex_content_fix_backup_20261020` | Full `QuestionBankItem` row copy for ids in `proposed-changes.json` |
| `exam_sessions_numeric_rescore_backup_20261020` | `id`, `userId`, `score`, `answers`, `analysis`, `updatedAt` for sessions touched by re-score |

**Never run** `06-rollback-DO-NOT-RUN.sql` (not shipped here; do not author destructive rollback without explicit approval).

## Commands

```bash
# Locate (read-only SQL — paste in psql or Neon console)
psql "$DATABASE_URL" -f scripts/data/naplex-content-fix-20261020/01-locate-items.sql

# Content fix dry run (default)
npx tsx scripts/apply-naplex-content-fix-20261020.ts

# Content fix apply (after backup + approval)
npx tsx scripts/apply-naplex-content-fix-20261020.ts --apply

# Re-score dry run (completed NAPLEX sessions, numeric grader #240)
npx tsx scripts/rescore-exam-sessions-numeric-20261020.ts

# Re-score apply (after approval)
npx tsx scripts/rescore-exam-sessions-numeric-20261020.ts --apply
```

## Apply order (after approval)

1. Run content script with `--apply` (backs up QBI rows, updates keys/options/rationales, sets `manual_correction = true`).
2. Run re-score script with `--apply` (backs up then updates `exam_sessions` answers/score/analysis).
3. Spot-check one session in results UI.
