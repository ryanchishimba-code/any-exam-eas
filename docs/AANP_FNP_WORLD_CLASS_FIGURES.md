# AANP FNP world-class figures & media

**Goal:** Match BoardVitals / APEA-class clinical exhibit density for high-yield FNP stems — teaching schematics first; no unreviewed generative clinical photos as authority.

**Product rule:** Figures teach; they do not predict AANP pass rates or imply AANPCB affiliation.

**Status (2026-09-10):** Wave 1 Phase 0 + starter SVG catalog **shipped** (parallel to NCLEX/NAPLEX).

| Piece | Status |
|-------|--------|
| Shared exhibit normalize + `ExhibitFigureRef` | Done |
| Stem UI (`AanpFnpExhibitBlock` + `ExhibitMedia`) | Done — shows media/table without requiring `kind=exhibit` |
| SVG catalog (AFib ECG, ABCDE derm, otoscopy OM, spirometry, growth chart) | Done — approved only |
| Serve-time attach via `prepareAanpFnpBankItem` | Done |
| `db:attach-aanp-fnp-figures` | Done |
| Rationale `image` blocks via visual enrich | Done (re-run after attach) |
| FNP expert rationales | Done — `generateExpertRationaleForField("aanp-fnp")` |
| Licensed real clinical photos | **Not done** — ops/licensing |

Schematics are board-style teaching diagrams, not patient tracings or derm photos.

**Fit rule (hard):** Attach only when the stem/question tests the figure’s teaching point (purpose keywords). Topic tags or ambient mentions (“history of AFib”, “uses inhaler”) are not enough. Prefer fewer correct attaches over dense misfits. Re-run `db:repair-figure-media -- --field aanp-fnp` after tightening gates.

---

## Commands

```bash
npm run db:attach-aanp-fnp-figures -- --limit 2000
npm run db:attach-aanp-fnp-figures -- --topic atrial-fibrillation-anticoagulation
npm run db:attach-aanp-fnp-figures:dry
npm run db:repair-figure-media -- --field aanp-fnp
npm run db:audit-figure-media

# After attach — densify rationale image/lab blocks
npm run db:enrich-aanp-fnp-visual-rationales -- --limit 2000

# Expert rationales (OpenAI)
npm run db:enrich-board-expert -- --field aanp-fnp --serve-only --limit 500
```

## Catalog topics (starter)

| Figure id | Blueprint topics |
|---------|------------------|
| `aanp-ecg-afib` | `atrial-fibrillation-anticoagulation` |
| `aanp-derm-abcde` | `skin-cancer-detection` |
| `aanp-otoscopy-om` | `otitis-hearing-loss`, peds illnesses |
| `aanp-spirometry-obstructive` | `asthma-gina-stepwise`, `copd-gold-inhalers` |
| `aanp-growth-chart` | `well-child-developmental-milestones` |

## Next

1. Expand catalog (murmur timing, vaccine schedule card, Beers deprescribing)
2. License real derm/otoscopy photos where allowed
3. Wave 2: SATA-style FNP formats + 6K serve-ready push
