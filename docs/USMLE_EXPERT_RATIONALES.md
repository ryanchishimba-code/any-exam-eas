# USMLE Expert Rationales — Attending-Level Explanations

Gold-standard explanation system for AnyExamEasy USMLE (Steps 1–3): deeper than thin template polish, with Concise / Expert UI when `generationMeta.expertRationale` is present.

**Product disclaimer:** Explanations improve in-app learning only. They do not predict USMLE pass/fail and do not imply NBME/FSMB affiliation.

## Architecture

| Layer | Location | Role |
|-------|----------|------|
| **Expert JSON schema** | `src/lib/engine/rationale/expert-rationale-types.ts` | Shared `ExpertStructuredRationale` + `USMLE_EXPERT_RATIONALE_VERSION` |
| **USMLE expert prompt** | `src/lib/engine/prompts/usmle-expert-rationale.ts` | Attending voice; Step 1/2/3 reasoning spines |
| **Quality engine** | `src/lib/engine/rationale/usmle-explanation-quality.ts` | Coverage + pearl + Step-aware language scoring |
| **Generator** | `src/lib/engine/rationale/generate-expert-rationale.ts` | `generateExpertUsmleRationale` / `generateExpertRationaleForField` |
| **Assembler** | `src/lib/engine/rationale/assemble-expert-rationale.ts` | JSON → markdown + side fields (shared with NCLEX) |
| **UI** | `src/components/study/questions/ExpertRationalePanel.tsx` | Concise / Expert toggle when expert JSON exists |
| **Storage** | `QuestionBankItem.generationMeta.expertRationale` | Persisted JSON (`usmle-expert-v1`) |
| **Display text** | `QuestionBankItem.explanation` | Full markdown for search/fallback |

## Clinical bar (what “attending” means)

1. **Why correct** — mechanism / diagnosis / next-step chain tied to *this* vignette
2. **Why each wrong** — named trap + vignette-specific correction
3. **Clinical pearl** — one bedside fact a chief resident would underline
4. **High-yield facts + pitfalls** — board-relevant, Step-aware
5. **Test-taking tip** — how NBME-style stems signal the concept
6. **Layered depth** — basic → intermediate → advanced

### Step reasoning spines (`stepByStepReasoning`)

| Step | Spine |
|------|--------|
| Step 1 | Anatomy/phys → pathogenesis → presentation → lab/histo correlate |
| Step 2 CK | Cue recognition → differential → most likely → next best step |
| Step 3 | Urgency → workup/management sequence → monitoring / disposition (CCS-style) |

## Bulk enrichment

```bash
# Dry-run candidates (serve-ready Step 2)
npm run db:enrich-board-expert -- --field usmle-step-2 --serve-only --limit 20 --dry-run

# Enrich 50 Step 2 items (requires OPENAI_API_KEY)
npm run db:enrich-board-expert -- --field usmle-step-2 --serve-only --limit 50

# Step 1 / Step 3
npm run db:enrich-board-expert -- --field usmle-step-1 --serve-only --limit 50
npm run db:enrich-board-expert -- --field usmle-step-3 --serve-only --limit 50

# Force re-enrich
npm run db:enrich-board-expert -- --field usmle-step-2 --serve-only --limit 100 --force
```

Report: `artifacts/board-expert-rationale-report.json`

On generate (optional): set `RATIONALE_ENRICH_ON_GENERATE=1` so new USMLE items call `maybeEnrichExpertBankItemRationale`.

## Persist shape (no Prisma migration)

- `generationMeta.expertRationale` — full expert JSON
- `generationMeta.expertRationaleVersion` — `usmle-expert-v1`
- `generationMeta.rationaleQualityScore` — from `scoreUsmleExplanationQuality`
- `generationMeta.rationaleEnrichedAt` / `rationaleModel`
- `explanation` — assembled markdown
- `options` envelope — `distractorRationale`, `clinicalReasoning`, `keyTakeaways`

## Quality gates (v1)

- Enrich **rejects** writes when quality `ok` is false (coverage, thin pearl/context, missing step reasoning).
- Serve-ready hard fail does **not** yet require expert JSON (Phase B once coverage is meaningful).

## Before / after (sketch)

**Before (thin polish):**
> Correct because this is the most likely diagnosis. Why other options are incorrect: Option B does not apply…

**After (expert):**
- Concise: headline + key takeaway + named distractor traps
- Expert: Step-aware reasoning chain, clinical pearl, high-yield facts, pitfalls, test tip, layered depth

## Related

- NCLEX twin: [`docs/NCLEX_EXPERT_RATIONALES.md`](NCLEX_EXPERT_RATIONALES.md)
- Official USMLE spine: [`docs/usmle-official-alignment.md`](usmle-official-alignment.md)
