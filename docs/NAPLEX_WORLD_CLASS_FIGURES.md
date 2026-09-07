# NAPLEX world-class figures & media

**Goal:** Apply NCLEX/USMLE lessons — teaching exhibits that match what the item tests; sparse correct attaches over dense misfits.

**Product rule:** Figures teach pharmacy decision-making. They do not imply NABP affiliation or predict NAPLEX outcomes.

**Status (2026-09-06):** Phase 0 + starter catalog **shipped**.

| Piece | Status |
|-------|--------|
| Shared exhibit normalize + `ExhibitFigureRef` | Done (reuse) |
| Stem UI (`NaplexExhibitBlock` + `ExhibitMedia`) | Done — media/table without requiring `kind=exhibit` |
| SVG catalog (inhaler, vanco TDM, high-alert, CrCl, insulin timing) | Done — approved only |
| Preserve item kinds when attaching media | Done |
| `db:attach-naplex-figures` | Done |
| Purpose-keyword attach gates | Done |
| `db:repair-figure-media --field pharmacy` | Done |
| Licensed device photos | **Not done** |

**Fit rule (hard):** Attach only when the stem/question tests the figure’s teaching point. Ambient mentions (“tiotropium refill”, “on insulin”) are not enough.

---

## Commands

```bash
npm run db:attach-naplex-figures -- --dry-run --limit 200
npm run db:attach-naplex-figures -- --limit 2000
npm run db:attach-naplex-figures -- --topic asthma-copd-inhalers
npm run db:repair-figure-media -- --field pharmacy
npm run db:audit-figure-media
```

## Catalog (starter)

| Figure id | Purpose attach cues |
|---------|---------------------|
| `naplex-inhaler-mdi-steps` | inhaler technique, spacer, prime, rinse mouth |
| `naplex-vanco-tdm-pathway` | vancomycin trough, AUC/MIC, dose adjustment |
| `naplex-mar-high-alert` | high-alert, ISMP, U-500, double-check |
| `naplex-crcl-formula` | Cockcroft, creatinine clearance, renal dose adjust |
| `naplex-insulin-timing` | peak/onset/duration, hypo risk window |

## Next

1. Persist attaches via `db:attach-naplex-figures` on production bank
2. Expand BUD / warfarin INR when purpose-language stems exist
3. Prompt gen slots that emit purpose keywords for insulin peak & Y-site
4. Densify `naplexExhibit` lab tables via findings normalize

## Related

- [`docs/NCLEX_WORLD_CLASS_FIGURES.md`](NCLEX_WORLD_CLASS_FIGURES.md)
- [`docs/USMLE_WORLD_CLASS_FIGURES.md`](USMLE_WORLD_CLASS_FIGURES.md)
