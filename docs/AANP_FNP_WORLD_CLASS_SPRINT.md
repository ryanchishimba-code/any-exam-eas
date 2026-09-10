# AANP FNP world-class sprint checklist

Track the path from solid scaffold → competitive FNP QBank (BoardVitals / APEA / Barkley packaging bar).

**Product rule:** No AANPCB affiliation claims. No guaranteed pass rates. No fake NCLEX NGN.

---

## Wave 1 — Trust & visuals ✅

- [x] FNP expert-rationale prompts + `generateExpertRationaleForField("aanp-fnp")`
- [x] Figure catalog (AFib, ABCDE, otoscopy, spirometry, growth) + `AanpFnpExhibitBlock`
- [x] Purpose-gated attach / repair / audit
- [x] Visual rationales on generate + backfill scripts
- [x] Docs: `AANP_FNP_WORLD_CLASS_FIGURES.md`

```bash
npm run db:attach-aanp-fnp-figures -- --limit 5000
npm run db:enrich-aanp-fnp-visual-rationales -- --limit 2000
npm run db:enrich-board-expert -- --field aanp-fnp --serve-only --limit 500
```

---

## Wave 2 — Formats, volume, serve quality ✅

- [x] FNP-native SATA (~12% of new gen) + `|||` normalize
- [x] Lab `chartData` densify on generate
- [x] Dedicated `aanp-fnp-serve-gate` + `aanp-fnp-bank-bridge`
- [x] `db:generate-aanp-fnp-to-target` wired

```bash
npm run db:generate-aanp-fnp-to-target -- --target 6000 --mode hybrid
npm run db:rebalance-aanp-fnp
```

---

## Wave 3 — Study packaging ✅ (code)

- [x] Study presets: domains, lifespan, pharm, preventive, SATA, CV HY, timed mock
- [x] Prep hub panel + `/api/questions?aanpFnpPreset=`
- [x] 4-week study plan
- [x] Docs: expert rationales + this sprint
- [x] FNP study-guide MVP (Wave 4)

```bash
# Smoke: open /prep/aanp-fnp → Question Bank → Featured presets
# Or: /question-bank?field=aanp-fnp&mode=bank&aanpFnpPreset=assess-domain-block&count=25&autostart=1
```

---

## Wave 4 — FNP Study Guide MVP ✅ (code)

- [x] Register `aanp-fnp` in study-guide registry (`/aanp-fnp/study-guide`)
- [x] Routes + premium/middleware/app-shell wiring
- [x] **Full Pablo manuscript** drop-in (`00`–`16` + 57 visuals)
- [x] Prep hub + Toolkit links; sidebar Study Guide for FNP learners
- [x] Chapter → high-yield topic map + tests

```bash
npm run ingest:aanp-fnp-guide
# Smoke: /aanp-fnp/study-guide (premium) or Study Tools → Study Guide with exam=aanp-fnp
```

---

## Definition of done (world-class QBank)

| Gate | Status |
|------|--------|
| Expert rationales on serve-ready path | Code ✅ · run enrich |
| Purpose-fit exhibits | Code ✅ · run attach |
| 6K+ blueprint-balanced bank | Ops — run to-target |
| SATA + lab formats | Code ✅ |
| FNP study presets + 4-week plan | Code ✅ |
| FNP study-guide MVP | Code ✅ · run ingest |
| Docs / ops parity with NCLEX | Code ✅ |

**Still out of scope:** full video course, licensed clinical photo libraries, APEA-style predictor pass probability.
