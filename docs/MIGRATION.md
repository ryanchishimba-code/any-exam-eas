# Migration: medical-centric → modular subjects

## What changed

| Before | After |
|--------|--------|
| Board prompts in `ai.ts` | `subjects/{medicine,nursing,pharmacy}/prompts.ts` |
| `FIELD_SUBJECTS` monolith in `field-subjects.ts` | Per-module `subjects.ts` + registry aggregation |
| `medicine-subjects.ts` duplicate taxonomy | Re-exports from registry; counts in `subjects/shared/question-counts.ts` |
| Direct OpenAI call in `generateExam` | `engine/pipeline.ts` |

## What did NOT change

- Frontend (`ExamGenerator`, pages, auth, Stripe)
- API routes (`/api/exams/generate` contract)
- Prisma models (`QuestionBankItem.fieldId`, `subjectId`)
- Deployment / Vercel flow
- Offline bank sync (`bulk-question-generator.ts` — procedural builders pending full module split)

## Incremental next steps

1. **Bulk generators** — Move `buildMedicineQuestion` / nursing / pharmacy into `subjects/*/bulk.ts`; thin router in `bulk-question-generator.ts`.
2. **Search hints** — Wire `module.buildSearchQueryHints` into `search.ts`.
3. **Learning quilt** — Reuse subject modules for quilt prompts (optional `subjectId` on learn API).
4. **DB taxonomy** — Optional `Field` / `Subject` tables (see `SCHEMA_RECOMMENDATIONS.md`).
5. **Remove legacy** `field-exam-styles.ts` STEM entries if product stays health-only.

## Rollback

Revert `ai.ts` to call inline prompts and restore monolithic `field-subjects.ts` from git history. Registry is additive; no DB migration required for this phase.

## Verification

```bash
npm run build
npm run test:smoke
```

Generate exams for Medicine / Nursing / Pharmacy subjects and confirm JSON shape and 4-option MCQs unchanged.
