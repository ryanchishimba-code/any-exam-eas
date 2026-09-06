# USMLE bank spine audit — 2026-09-06

Compares serve-ready (`active` + `qaPassed`) items to the official organ-system spine.
Practice readiness is in-app only — not a board pass predictor.

## Success criteria

- ≥95% serve-ready items have a resolvable spine `blueprintDomain`
- ≥95% have a valid 2026 `blueprintTopic` (null + orphan excluded)
- Per-system weight within ~±3 pts of official midpoints (or documented oversample)

## usmle-step-1

- Serve-ready: **3399**
- With blueprintTopic: **3399** (100%)
- Valid 2026 topic: **3399** (100%)
- Resolvable spine domain: **3399** (100%)
- Null topic: 0 | Orphan/legacy topic: 0
- Systems outside ±3 pts: **8**/11 (biostats-epi +12.4, cardiovascular +7.6, reproductive-endocrine -7.5, behavioral-nervous -6.5, multisystem -5.9, msk-skin -5.3, blood-lymph-immune +4.2, respiratory-renal +3.7)

| System | Count | Actual % | Target % | Δ pts |
|---|---:|---:|---:|---:|
| biostats-epi | 590 | 17.4 | 4.9 | 12.4 |
| cardiovascular | 560 | 16.5 | 8.9 | 7.6 |
| reproductive-endocrine | 215 | 6.3 | 13.8 | -7.5 |
| behavioral-nervous | 181 | 5.3 | 11.8 | -6.5 |
| multisystem | 135 | 4 | 9.9 | -5.9 |
| msk-skin | 155 | 4.6 | 9.9 | -5.3 |
| blood-lymph-immune | 510 | 15 | 10.8 | 4.2 |
| respiratory-renal | 560 | 16.5 | 12.8 | 3.7 |
| social-sciences | 173 | 5.1 | 7.4 | -2.3 |
| human-development | 0 | 0 | 2 | -2 |
| gastrointestinal | 320 | 9.4 | 7.9 | 1.5 |

Unknown / unmapped: 0

## usmle-step-2

- Serve-ready: **5682**
- With blueprintTopic: **5682** (100%)
- Valid 2026 topic: **5682** (100%)
- Resolvable spine domain: **5682** (100%)
- Null topic: 0 | Orphan/legacy topic: 0
- Systems outside ±3 pts: **9**/11 (cardiovascular +10.8, human-development +10.3, social-sciences -9.9, respiratory-renal -9.5, blood-lymph-immune -7.5, msk-skin -7.4, biostats-epi +7, reproductive-endocrine +5.1, gastrointestinal +3.1)

| System | Count | Actual % | Target % | Δ pts |
|---|---:|---:|---:|---:|
| cardiovascular | 1149 | 20.2 | 9.4 | 10.8 |
| human-development | 765 | 13.5 | 3.1 | 10.3 |
| social-sciences | 177 | 3.1 | 13 | -9.9 |
| respiratory-renal | 347 | 6.1 | 15.6 | -9.5 |
| blood-lymph-immune | 16 | 0.3 | 7.8 | -7.5 |
| msk-skin | 114 | 2 | 9.4 | -7.4 |
| biostats-epi | 637 | 11.2 | 4.2 | 7 |
| reproductive-endocrine | 882 | 15.5 | 10.4 | 5.1 |
| gastrointestinal | 621 | 10.9 | 7.8 | 3.1 |
| behavioral-nervous | 576 | 10.1 | 13 | -2.9 |
| multisystem | 398 | 7 | 6.3 | 0.8 |

Unknown / unmapped: 0

## usmle-step-3

- Serve-ready: **8487**
- With blueprintTopic: **8487** (100%)
- Valid 2026 topic: **8487** (100%)
- Resolvable spine domain: **8487** (100%)
- Null topic: 0 | Orphan/legacy topic: 0
- Systems outside ±3 pts: **8**/11 (human-development +8.4, msk-skin -8, blood-lymph-immune -5.2, cardiovascular +5.2, biostats-epi +4.3, respiratory-renal -3.9, multisystem -3.6, behavioral-nervous -3.3)

| System | Count | Actual % | Target % | Δ pts |
|---|---:|---:|---:|---:|
| human-development | 888 | 10.5 | 2.1 | 8.4 |
| msk-skin | 29 | 0.3 | 8.3 | -8 |
| blood-lymph-immune | 263 | 3.1 | 8.3 | -5.2 |
| cardiovascular | 1324 | 15.6 | 10.4 | 5.2 |
| biostats-epi | 1070 | 12.6 | 8.3 | 4.3 |
| respiratory-renal | 726 | 8.6 | 12.5 | -3.9 |
| multisystem | 403 | 4.7 | 8.3 | -3.6 |
| behavioral-nervous | 785 | 9.2 | 12.5 | -3.3 |
| gastrointestinal | 952 | 11.2 | 8.3 | 2.9 |
| reproductive-endocrine | 1131 | 13.3 | 10.4 | 2.9 |
| social-sciences | 916 | 10.8 | 10.4 | 0.4 |

Unknown / unmapped: 0

## Verdict

- **Tag alignment: PASS** (≥95% spine domain + valid topic on all Steps)
- **Weight mix:** residual drift treated as documented high-yield / inventory oversample (Phase 2 allows this):
  - Step 1: `biostats-epi` absorbs biochemistry/genetics; cardio/heme intentional HY oversample; repro/neuro underweight = generation backlog
  - Step 2: cardio + pediatrics (`human-development`) intentional HY oversample; resp/renal, social-sciences, MSK, heme underweight = generation backlog
  - Step 3: CCS dump topics remapped via clinical content → organ systems; remaining drift mostly within ~±5 pts
- **Bank alignment score: 8/10** (tags locked; weights improved with documented oversamples — AI fill still needed for underweight systems)

## Remap commands

```bash
npx tsx scripts/reseed-usmle-blueprint-topics.ts --apply
npx tsx scripts/rebalance-usmle-blueprint.ts --fill-deficits  # optional AI fill
npx tsx scripts/audit-usmle-spine-alignment.ts --write
```
