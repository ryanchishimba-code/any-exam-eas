# NCLEX + NAPLEX Improvement Summary

**Date:** 2026-08-03  
**Scope:** Content quality gates, format coherence, serve readiness  
**Commit status:** Code changes uncommitted (per request)

## What was wrong

### NAPLEX (higher urgency)
1. **Failing seed QA tests** — `test:qa:naplex` failed 3 suites (`NAPLEX_QUALITY_V2`, `NAPLEX_CALC_CASES_V3`, `NAPLEX_VIGNETTE_SEEDS`) with `naplex_orphan_calc_stem` / `naplex_clinical_stem_numeric_options` on **valid** calc items.
2. **Gate false positives** — `concentrationStemLacksSolvableInputs` treated product strength (`mg/mL`) as “asking for concentration,” rejecting volume/dose stems. `NS\b` matched the trailing `ns` in words like **contains**.
3. **ED triage mis-rewrite** — Multi-room ED vignettes with one psych room mentioning “denies suicidal plan” were rewritten as psych suicide priority instead of anaphylaxis.
4. **Live bank format debt** — ~~71~~ **0** active NAPLEX items with auto-fixable format issues (**applied this session**).
5. **Coverage skew (live audit):** oncology-rx ~2 active / 0 qaPassed; pharmacy-law 170; ordered_response 1; select_all 59. Tough rating B (8/10); expertPct still 0%.

### NCLEX (healthier, residual debt)
1. Live serve **7995/8078 (99.0%)**, best **98.9%** — target met.
2. Residual serve blockers: missing distractor rationales (83), explanation_too_short (57), score_below_serve_bar (58), missing_vignette (35).
3. Expert rationales ~38% (from Jul 20 tough rating) — room to grow via enrich waves.
4. **2** live format mismatches fixed this session (upper GI bleed / diabetes education options).

## What we fixed / improved (code)

| Area | File(s) | Change |
|------|---------|--------|
| Calc coherence | `naplex-format-coherence.ts` | Only apply concentration solvability when stem **asks** for concentration; expand volume/rate/CrCl/insulin/Calvert recognition; tablet day-supply support; `\bNS\b` fix |
| ED vs psych | `naplex-format-coherence.ts` | ED multi-client triage excluded from psych unit path; denies-suicidal scored low |
| Numeric options | `naplex-format-coherence.ts` | Recognize `mg/mL` as numeric-only option unit |
| Clinical repair | `naplex-clinical-numeric-repair.ts` | Prefer calc reclassify for tablet/capsule with day supply before counseling rewrite; stem phrasing aligned |
| Live NCLEX | DB via `fix-nclex-format-coherence.ts` | **2** items rewritten to hemorrhage MCQs |
| Live NAPLEX | DB via `fix-naplex-format-coherence.ts` | **71** format fixes applied (see below) |

### Test results (after)
- `npm run test:qa:naplex` — **59/59 pass** (was 3 failing)
- `naplex-format-coherence` + `naplex-clinical-numeric-repair` — **65/65 pass**
- NCLEX curated/quality/serve/format unit tests — **22/22 pass**

## Live NAPLEX format apply (this session)

```bash
bash scripts/run-with-node.sh npm run db:fix-naplex-format
bash scripts/run-with-node.sh npm run db:qa-gate-naplex-best
bash scripts/run-with-node.sh npm run db:sync-naplex-serve-ready
```

| Result | Value |
|--------|-------|
| Flagged / applied | **71 / 71** (Unresolved: 0) |
| Post-apply dry recheck | **0** flagged |
| Best tier (before → after) | 9030 (98.0%) → **9098 (98.7%)** |
| Serve-ready sync | **9098 / 9216** active (98.7%) |
| qaPassed = active best | YES ✓ |
| Rejected after gate | **49** |

### Fix mix (71)
- Counseling vignette rewrites (qualitative MCQ): 44
- Fallback counseling rewrites: 20
- Orphan calc → clinical MCQ: 6
- MCQ → constructed_response calc reclassify: 1
- Note: 1 item (`cmr104rjv000m1yhqm0joto25`) format-fixed but audit still `weak_naplex_correct`

### Remaining QA reject reasons (49)
| Reason | Count |
|--------|-------|
| missing_vignette | 25 |
| naplex_stem_lead_in | 24 |
| naplex_explanation_short | 24 |
| explanation_too_short | 24 |
| empty_explanation | 22 |
| weak_naplex_correct | 1 |

(Items can carry multiple reasons.)

### A-quality audit (post-apply)
```
pharmacokinetics: 262
pharmaceutics: 304
domain1Proxy: 1819
domain3Core: 2870
ordered_response: 1
select_all: 59
Flags: none
```
Subject gap: **oncology-rx** still 2 active / **0** qaPassed.

## Live metrics (after NAPLEX format apply)

| Metric | NCLEX | NAPLEX |
|--------|-------|--------|
| Active | 8078 | 9216 |
| Serve / qaPassed | 7995 / 8034 | **9098** |
| Best tier | 7991 (98.9%) | **9098 (98.7%)** |
| Format fixable | 2 applied | **71 applied; 0 remaining** |
| A-quality gap flags | — | none (PK/pharmaceutics targets met) |

## What still needs longer runs / approval

1. ~~**Apply NAPLEX format fix**~~ — **DONE** (71/71).
2. **NAPLEX residual rejects (49)** — vignette/lead-in/explanation polish (not auto format):
   ```bash
   npm run db:fix-naplex-audit-gaps   # if available for short explanations
   # or targeted polish / elevation
   ```
3. **NAPLEX elevation waves** (oncology, select_all, ordered_response, deeper rationales) — longer OPENAI runs:
   ```bash
   OPENAI_GENERATION_ONLY=1 npm run db:elevate-naplex-a:wave
   # or larger: npm run db:elevate-naplex-a -- --wave 20 --generate-count 40 --enrich-limit 150
   ```
4. **NCLEX residual blockers / expert enrichment:**
   ```bash
   npm run db:curate-nclex:failures
   npm run db:enrich-nclex-expert:serve
   npm run db:sync-nclex-serve-ready
   ```
5. **Re-rate after batches:**
   ```bash
   bash scripts/run-with-node.sh npx tsx scripts/rate-nclex-ncsbn-tough.mts
   bash scripts/run-with-node.sh npx tsx scripts/rate-naplex-nabp-tough.mts
   ```

## How to verify

```bash
# Unit / seed QA
npm run test:qa:naplex
npx vitest run src/lib/exam-prep/naplex-format-coherence.test.ts \
  src/lib/exam-prep/naplex-clinical-numeric-repair.test.ts \
  src/lib/exam-prep/nclex-curated-quality.test.ts

# Live bank
npm run db:elevate-naplex-a:audit
bash scripts/run-with-node.sh npx tsx scripts/report-nclex-serve-rate.ts
bash scripts/run-with-node.sh npx tsx scripts/report-naplex-production-counts.ts
npm run db:qa-gate-naplex-best:dry
npm run db:qa-gate-nclex-best:dry
npm run db:fix-naplex-format:dry   # expect 0 flagged
```

## Artifacts written this session
- `artifacts/nclex-naplex-improvement-summary.md` (this file)
- `artifacts/naplex-format-fix-dry.log` — 71/71 auto-fixable (pre-apply)
- `artifacts/naplex-format-fix-live.log` — **71 applied**
- `artifacts/naplex-qa-gate-live.log` — best 9098 / reject 49
- `artifacts/naplex-sync-serve-live.log` — 9098 serve-ready
- `artifacts/naplex-a-quality-audit-post-fix.log`
- `artifacts/naplex-production-counts.json` (refreshed; 9098 qaPassed)
- `artifacts/nclex-format-fix-live.log` — 2 applied (prior)
- `tmp/naplex-a-quality-gap.json` (refreshed audit)
