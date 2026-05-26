# Subject module architecture

Any Exam Easy uses a **plugin-style subject system**. Domain intelligence lives in subject modules; the shared engine handles retrieval, composition, deduplication, and quality scoring.

## Layout

```
src/lib/
  engine/
    pipeline.ts          # Orchestrated generation pipeline
    prompts/
      base.ts            # Universal examiner prompt
      compose.ts         # Layer subject augmentation on base
    stages/
      deduplication.ts
      quality.ts
  subjects/
    types.ts             # SubjectModule interface
    registry.ts          # Register & resolve modules
    taxonomy.ts          # Hierarchical taxonomy helpers
    medicine/            # USMLE-oriented module
    nursing/             # NCLEX-oriented module
    pharmacy/            # NAPLEX-oriented module
```

## SubjectModule contract

Each discipline implements:

| Piece | Purpose |
|--------|---------|
| `metadata` | Label, board exam, OER domains |
| `subjectAreas` | Stratified topics (exam dropdown) |
| `taxonomy` | Hierarchy with prerequisites & difficulty |
| `capabilities` | Feature flags (case studies, calculations, etc.) |
| `getExamSystemAugmentation()` | Board-specific system prompt layer |
| `getExamUserAugmentation(ctx)` | User-prompt layer |
| `extractConcepts()` | Concept / relationship extraction |
| `evaluateDifficulty()` | Discipline-specific difficulty model |
| `validateExam()` | Subject-aware validation |
| `distractorPatterns` | Pluggable distractor strategies |
| `questionTemplates` | Composable question styles |

## Capability registry

`SUBJECT_CAPABILITY_REGISTRY` in `subjects/registry.ts` drives behavior without hardcoding in the engine:

```typescript
{
  medicine: { supportsClinicalVignettes: true, requiresCitationValidation: true },
  nursing: { supportsPrioritization: true },
  pharmacy: { supportsCalculations: true, supportsDrugQuestions: true },
}
```

## Generation pipeline

1. **Subject resolver** — `resolveSubjectModule(fieldId)`
2. **Taxonomy loader** — subject area + taxonomy path
3. **Topic analyzer** — scoped topic string (existing `buildScopedTopic`)
4. **Retrieval** — `gatherStudyMaterial` (unchanged)
5. **Concept extractor** — `module.extractConcepts()`
6. **Subject intelligence injection** — composed prompts
7. **Blueprint** — concept/high-yield hints in prompt (extensible)
8. **Question composer** — OpenAI JSON exam
9. **Validation** — `module.validateExam()`
10. **Deduplication** — shared stem dedup
11. **Quality scoring** — shared + optional `scoreQuestionQuality`

Entry point: `runExamGenerationPipeline()` in `engine/pipeline.ts`.  
Public API: `generateExam()` in `ai.ts` delegates to the pipeline.

## Adding a new subject (e.g. Engineering)

1. Create `src/lib/subjects/engineering/` with:
   - `subjects.ts` — subject area list
   - `taxonomy.ts` — hierarchy
   - `prompts.ts`, `validation.ts`, `difficulty.ts`, `distractors.ts`, `sources.ts`, `concepts.ts`, `capabilities.ts`, `templates.ts`
   - `index.ts` — export `engineeringModule: SubjectModule`
2. Register in `subjects/registry.ts`:
   ```typescript
   import { engineeringModule } from "./engineering";
   MODULES.engineering = engineeringModule;
   ```
3. Add field to `fields.ts` `STUDY_FIELDS` (UI only).
4. Optionally add bulk generator under `engineering/bulk.ts` and wire `buildBulkQuestion` via registry.

**Do not modify** `engine/pipeline.ts` for domain rules.

## Medical modules (current)

- **Medicine** — clinical vignettes, DDx, lab reasoning, patient safety
- **Nursing** — NCLEX prioritization, delegation, infection control
- **Pharmacy** — NAPLEX calculations, interactions, counseling, law

All former hardcoded prompts in `ai.ts` now live in each module’s `prompts.ts`.
