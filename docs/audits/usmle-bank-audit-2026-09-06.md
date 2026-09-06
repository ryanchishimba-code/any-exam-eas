# USMLE bank spine audit — 2026-09-06

Compares serve-ready (`active` + `qaPassed`) items to the official organ-system spine defined in `src/lib/exam-prep/usmle/official-content-model.ts`.

**Disclaimer:** Practice readiness is in-app only — not a board pass predictor and not affiliated with NBME/FSMB.

## Success criteria

- ≥95% serve-ready items have a resolvable spine `blueprintDomain`
- ≥95% have a valid 2026 `blueprintTopic`
- Per-system weight within ~±3 pts of official midpoints (or documented intentional oversample)

## How to run (live DB)

```bash
npx tsx scripts/audit-usmle-spine-alignment.ts --write
npx tsx scripts/reseed-usmle-blueprint-topics.ts          # dry-run
npx tsx scripts/reseed-usmle-blueprint-topics.ts --apply  # remap domains/topics
npx tsx scripts/audit-usmle-spine-alignment.ts --write    # re-check
```

## Status (code shipped)

| Capability | Status |
|------------|--------|
| Official organ-system + physician-task model | Shipped |
| Content spine + topic→system map | Shipped |
| Engine / generation blueprints on spine | Shipped |
| Study Hub domains = organ systems | Shipped |
| Alias normalize + practice matchers | Shipped |
| Spine audit script | Shipped (`scripts/audit-usmle-spine-alignment.ts`) |
| Reseed prefers spine `blueprintDomain` | Shipped |
| Live DB percentages | Run audit against production/staging DB |

## Notes for remappers

1. Prefer deterministic alias + `inferUsmleBlueprint` — do not invent clinical facts.
2. Flag residual orphan topics for curator review.
3. After remap, rebalance only when drift exceeds ±3 pts without a documented remediation oversample.
