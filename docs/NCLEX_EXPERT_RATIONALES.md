# NCLEX Expert Rationales — Beat UWorld

Gold-standard explanation system for AnyExamEasy NCLEX: deeper than UWorld, PharmD-informed, with Concise / Expert UI toggle.

## Architecture

| Layer | Location | Role |
|-------|----------|------|
| **Expert JSON schema** | `src/lib/engine/rationale/expert-rationale-types.ts` | Full structured payload |
| **NCLEX expert prompt** | `src/lib/engine/prompts/nclex-expert-rationale.ts` | UWorld-beating generation instructions |
| **Generator** | `src/lib/engine/rationale/generate-expert-rationale.ts` | OpenAI JSON → validated expert rationale |
| **Assembler** | `src/lib/engine/rationale/assemble-expert-rationale.ts` | JSON → markdown + side fields |
| **Parser** | `src/lib/engine/rationale/parse-rationale-display.ts` | Markdown/JSON → UI sections |
| **UI** | `src/components/study/questions/ExpertRationalePanel.tsx` | Concise / Expert toggle, lazy-loaded |
| **Storage** | `QuestionBankItem.generationMeta.expertRationale` | Persisted JSON (no migration required) |
| **Display text** | `QuestionBankItem.explanation` | Full markdown for search/fallback |

### Optional future schema

```prisma
// prisma/schema.prisma — optional dedicated column
rationaleJson Json? // full ExpertStructuredRationale
```

Until migrated, `generationMeta.expertRationale` is the source of truth.

## Bulk enrichment

```bash
# Preview candidates among 5K serve-ready items
npm run db:enrich-nclex-expert:dry

# Enrich 50 questions (requires OPENAI_API_KEY)
npm run db:enrich-nclex-expert -- --limit 50

# All serve-ready, force re-enrich
npm run db:enrich-nclex-expert -- --limit 500 --force
```

Report: `artifacts/nclex-expert-rationale-report.json`

## UI behavior

- **Collapsed:** headline + key takeaway only (fast, sub-2s sessions unchanged)
- **Expanded:** lazy-loaded `ExpertRationalePanel` (code-split)
- **Concise tab:** correct answer + distractors + takeaway
- **Expert tab:** step-by-step CJMM, clinical pearl, pharm tie-in, high-yield facts, pitfalls, test tips, layered depth, visual cues, cross-refs

---

## Current vs improved — example (sepsis / contact precautions)

### Before (legacy nclex-elevate placeholder)

```
Clinical Judgment (CJMM): apply ABCs and evidence-based nursing scope.
Priority nursing action for this scenario.

Why other options are incorrect:
• Use alcohol-based hand rub alone: Incorrect — does not reflect the highest-priority,
  safest nursing action for this clinical presentation.
• Droplet precautions only: Incorrect — does not reflect the highest-priority…
```

**Problems:** Generic distractors, no pathophysiology, no test tip, no PharmD lens, no real-world pearl.

### After (expert tier)

**Concise view:**
> Contact precautions with soap-and-water hand hygiene are required because *C. diff* spores survive alcohol gel.
>
> **Key takeaway:** When you see antibiotic-associated diarrhea + fever + leukocytosis, think *C. diff* — contact precautions and soap-and-water hand hygiene, not alcohol alone.

**Expert view adds:**

| Section | Sample content |
|---------|----------------|
| **Step-by-step reasoning** | 1. Recognize cues: watery diarrhea post-clindamycin, fever, WBC 14k → 2. Analyze: *C. diff* spore transmission → 3. Prioritize: break transmission chain before comfort measures |
| **Clinical pearl** | Alcohol gel does not kill *C. diff* spores — keep a dedicated commode and teach visitors soap-and-water technique. |
| **Pharmacology tie-in** | Clindamycin disrupts normal flora, allowing *C. diff* overgrowth; hold unnecessary antibiotics per provider order. |
| **High-yield facts** | • Contact precautions for *C. diff* • Soap-and-water hand hygiene • Oral vancomycin or fidaxomicin for severe disease |
| **Common pitfalls** | Choosing droplet vs contact; assuming nodding = understanding |
| **Test-taking tip** | When an infection control option conflicts with a comfort option, infection control wins on NCLEX. |
| **Real-world application** | Flag roommates; dedicated equipment; report diarrhea frequency and WBC trend. |
| **Layered depth** | Basic: *C. diff* = contact + soap/water → Intermediate: spores survive alcohol → Advanced: fulminant colitis → surgery consult |
| **Cross-reference** | NAPLEX: oral vancomycin/fidaxomicin dosing and CDAD stewardship |

---

## Expert JSON schema (abbreviated)

See `NCLEX_EXPERT_RATIONALE_JSON_SCHEMA` in `nclex-expert-rationale.ts`.

Required sections: `stepByStepReasoning`, `clinicalPearl`, `highYieldFacts`, `commonPitfalls`, `testTakingTip`, `realWorldApplication`, plus full `whyIncorrect` for every distractor.

## Quality gates

- Existing `validateStructuredRationale()` — all wrong options covered, min lengths
- `needsRationaleEnrichment()` — flags generic elevate placeholders + missing expert sections
- `nclex-elevate.ts` — **no longer injects generic distractor text** (items queue for expert enrichment instead)

## Rollout plan

1. **Pilot:** `npm run db:enrich-nclex-expert -- --limit 100` → QA sample in study session
2. **Scale:** Batch 500/day across 5K serve-ready bank (~10 days)
3. **Generate path:** Set `RATIONALE_ENRICH_ON_GENERATE=1` + wire `generateExpertNclexRationale` in NCLEX pipeline for new items
4. **Marketing:** "Expert rationales — deeper than UWorld, with PharmD nursing lens"
