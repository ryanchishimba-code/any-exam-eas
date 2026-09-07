# NCLEX world-class figures & media

**Goal:** Match Amboss/UWorld-style figure density for high-yield NCLEX stems — teaching schematics first; no unreviewed generative clinical images as authority.

**Product rule:** Figures teach; they do not predict NCLEX pass rates or imply NCSBN affiliation.

**Status (2026-09-06):** Phase 0 + starter SVG catalog **shipped** (parallel to USMLE).

| Piece | Status |
|-------|--------|
| Shared exhibit normalize + `ExhibitFigureRef` | Done |
| Stem UI (`NclexExhibitBlock` + `ExhibitMedia`) | Done — shows media/table without requiring `kind=exhibit` |
| SVG catalog (fetal strip, insulin, MAR, VT ECG, pressure injury, PPE) | Done — approved only |
| Preserve NGN kinds when attaching media | Done |
| `db:attach-nclex-figures` | Done |
| Rationale `image` blocks via existing visual enrich | Done (re-run after attach) |
| Licensed real clinical photos | **Not done** — ops/licensing |

Schematics are board-style teaching diagrams, not patient tracings or wound photos.

**Fit rule (hard):** Attach only when the stem/question tests the figure’s teaching point (purpose keywords). Topic tags or ambient mentions (“insulin”, “fetal heart tones”, “contact precautions”) are not enough. Prefer fewer correct attaches over dense misfits. Re-run `db:repair-figure-media` after tightening gates.

---

## Commands

```bash
npm run db:attach-nclex-figures -- --limit 2000
npm run db:attach-nclex-figures -- --topic labor-fetal-monitoring
npm run db:attach-nclex-figures:dry
npm run db:repair-figure-media -- --field nursing
npm run db:audit-figure-media

# After attach — densify rationale image/lab blocks
npm run db:enrich-nclex-visual-rationales -- --limit 2000
```

## Catalog topics (starter)

| Figure id | Blueprint topics |
|---------|------------------|
| `nclex-fetal-late-decels` | `labor-fetal-monitoring` |
| `nclex-insulin-timing` | `endocrine-meds`, dosage |
| `nclex-mar-high-alert` | `medication-error-prevention` |
| `nclex-ecg-vt-schematic` | `cardiac-emergencies` |
| `nclex-pressure-injury-stages` | `pressure-injury-staging` |
| `nclex-ppe-donning` | `ppe-donning-doffing` |

## Next

1. Expand catalog (early/variable decels, blood bag label, chest-tube chambers)
2. License real derm/wound photos where allowed
3. Prompt gen slots for `critical-lab-values` to emit `labTable` / `exhibit.findings`
