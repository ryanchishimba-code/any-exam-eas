# Serve-ready QA scan

Automated QA for **all serve-ready** bank items (`active: true`, `qaPassed: true`) across NAPLEX, NCLEX, USMLE, PANCE, AANP-FNP, and NPTE-PT.

Two layers:

1. **Heuristic prefilter** — reuses existing ingest gates and field audits (NAPLEX calc coherence, NCLEX/USMLE editorial rules). Fast, free, suitable for 40K+ items.
2. **Optional LLM review** — batched board-exam QA via OpenAI or Anthropic with a strict JSON rubric (logic, answer validity, board quality, distractors, rationale).

## Quick start

```bash
# Heuristic-only scan (recommended first pass)
npm run qa:scan -- --exam=naplex --heuristics-only

# All exams, cap at 5k items
npm run qa:scan -- --exam=all --limit=5000 --heuristics-only

# LLM sample (cost-controlled)
npm run qa:scan -- --exam=nclex --limit=500 --llm --llm-limit=100 --sample-rate=0.1

# Resume after interruption
npm run qa:scan -- --exam=naplex --llm --resume

# Flag failing items in DB (does not deactivate)
npm run qa:scan -- --exam=naplex --heuristics-only --apply --fail-action=flag

# Deactivate failing items (use with care)
npm run qa:scan -- --exam=naplex --heuristics-only --apply --fail-action=deactivate
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Neon Postgres connection |
| `OPENAI_API_KEY` | For `--provider=openai` | LLM QA (default provider) |
| `OPENAI_ALLOWED_PURPOSES` | Often | Include `curation` if generation-only mode is on |
| `QA_SCAN_OPENAI_MODEL` | No | Default `gpt-4o-mini` |
| `ANTHROPIC_API_KEY` | For `--provider=anthropic` | Alternate LLM provider |
| `QA_SCAN_ANTHROPIC_MODEL` | No | Default `claude-sonnet-4-20250514` |

Load from `.env` / `.env.local` automatically via `scripts/load-env.ts`.

## CLI flags

| Flag | Description |
|------|-------------|
| `--exam=` | `naplex`, `nclex`, `usmle`, `pance`, `aanp-fnp`, `npte-pt`, `all` |
| `--field=` | Override with raw `fieldId` (e.g. `usmle-step-1`) |
| `--limit=` | Max rows to scan (`0` = all) |
| `--heuristics-only` | Skip LLM (default when `--llm` omitted) |
| `--llm` | Enable LLM after heuristics pass |
| `--llm-all` | LLM even when heuristics fail (expensive) |
| `--llm-limit=` | Cap LLM-evaluated items per run |
| `--llm-batch-size=` | Items per API call (default 8) |
| `--llm-concurrency=` | Parallel batches (default 3) |
| `--sample-rate=` | 0–1 deterministic hash sample (default 1) |
| `--provider=` | `openai` or `anthropic` |
| `--model=` | Override model id |
| `--resume` | Continue from checkpoint in `artifacts/` |
| `--apply` | Write results to DB |
| `--fail-action=` | `flag` (reviewStatus) or `deactivate` |
| `--dry-run` | Reports only, no checkpoint/DB writes |
| `--out=` | Output directory (default `artifacts/`) |

## Outputs

Written to `artifacts/`:

- `qa-scan-{exam}.json` — full report with per-item verdicts, scores, issues
- `qa-scan-{exam}.md` — human summary + top failures
- `qa-scan-{exam}-failing.csv` — spreadsheet-friendly failing rows
- `qa-scan-{exam}.checkpoint.json` — resume state

### DB apply behavior

With `--apply --fail-action=flag`:

- Sets `reviewStatus: flagged`, `qaAuditedAt`
- Merges `generationMeta.qaScan` with prior metadata (issues, scores, suggested fixes)

With `--fail-action=deactivate`:

- Sets `active: false`, `qaPassed: false`, `reviewStatus: rejected`

## Architecture

```
scripts/qa-scan-serve-ready.ts     CLI entry
src/lib/qa-scan/
  exam-config.ts                   exam slug → fieldId
  heuristic-prefilter.ts           ingest + field audits
  serialize-item.ts                LLM payload (MCQ, SATA, NGN, calc)
  prompt.ts                        core QA system prompt
  llm-provider.ts                  OpenAI / Anthropic batching
  report.ts                        JSON + Markdown + CSV
  checkpoint.ts                    resume support
```

## Edge cases

- **NAPLEX calculations** — heuristics include `naplex-format-coherence` (orphan calc stems, missing numeric context).
- **SATA / select-all** — `correctAnswer` uses `|||` delimiter; prompt instructs LLM on multi-key validation.
- **NGN / constructed_response** — format notes in serialized payload; numeric unit validation for pharmacy calcs.
- **Long rationales** — serialized with stem/options; batch size defaults to 8 to respect token limits.

## CI / scheduled runs

`.github/workflows/qa-scan-scheduled.yml` runs weekly (Monday 06:00 UTC):

- Heuristic scan up to 2000 items (all exams by default)
- Optional manual dispatch with `--llm` for a 200-item sample

Required GitHub secret: `DATABASE_URL`. For LLM: `OPENAI_API_KEY`.

## Recommended workflow for 40K+ bank

1. **Full heuristic pass** (no cost):  
   `npm run qa:scan -- --exam=all --heuristics-only`
2. **Triage** failing CSV; fix or deactivate obvious bad batches.
3. **LLM spot-check** per exam at 5–10% sample:  
   `--llm --sample-rate=0.05 --llm-limit=500`
4. **Apply flags** for human review queue:  
   `--apply --fail-action=flag`
5. **Unit tests**: `npm run test:qa:scan`

## Improving warn-level items

After a scan flags editorial warnings (not hard fails):

```bash
# Dry-run repairs from latest scan JSON
npm run db:improve-qa-warns:dry

# Apply deterministic fixes (stem, vignette, rationales, NAPLEX anchors)
npm run db:improve-qa-warns -- --csv artifacts/qa-scan-all-....json

# Optional: also run USMLE polish layer (use sparingly — verify ingest gate)
npm run db:improve-qa-warns:polish
```

Repairs live in `src/lib/exam-prep/qa-warn-fixes.ts`.

## Tests

```bash
npm run test:qa:scan
```
