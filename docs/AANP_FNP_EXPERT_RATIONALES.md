# AANP FNP Expert Rationales

Gold-standard NP explanation system for AnyExamEasy AANP FNP: BoardVitals/APEA-caliber depth with Assess → Diagnose → Plan → Evaluate voice.

## Architecture

| Layer | Location | Role |
|-------|----------|------|
| **Expert JSON schema** | `src/lib/engine/rationale/expert-rationale-types.ts` | Shared structured payload (`aanp-fnp-expert-v1`) |
| **FNP expert prompt** | `src/lib/engine/prompts/aanp-fnp-expert-rationale.ts` | Guideline-aware NP generation instructions |
| **Generator** | `src/lib/engine/rationale/generate-expert-rationale.ts` | Routes `aanp-fnp` → FNP prompts |
| **Assembler** | `src/lib/engine/rationale/assemble-expert-rationale.ts` | Board=`aanp-fnp` section titles |
| **UI** | `ExpertRationalePanel` (shared) | Concise / Expert toggle |
| **Storage** | `generationMeta.expertRationale` | Persisted JSON |

## Bulk enrichment

```bash
npm run db:enrich-board-expert:dry -- --field aanp-fnp --limit 10
npm run db:enrich-board-expert -- --field aanp-fnp --serve-only --limit 500
```

Requires `OPENAI_API_KEY`. On generate, set `RATIONALE_ENRICH_ON_GENERATE=1`.

## Voice bar

- Assess → Diagnose → Plan → Evaluate steps tied to vignette data
- Guideline families when relevant (ADA, ACC/AHA, GINA/GOLD, USPSTF, IDSA, CDC) — no invented year numbers
- Lifespan-aware teaching (peds / adult / geri / women's health)
- Every wrong option gets a named trap
- Pharm tie-in when drugs appear (monitoring, Beers, interactions)

## Related

- Figures / exhibits: [`AANP_FNP_WORLD_CLASS_FIGURES.md`](AANP_FNP_WORLD_CLASS_FIGURES.md)
- Sprint checklist: [`AANP_FNP_WORLD_CLASS_SPRINT.md`](AANP_FNP_WORLD_CLASS_SPRINT.md)
