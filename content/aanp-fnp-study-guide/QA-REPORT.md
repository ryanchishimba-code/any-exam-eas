# AnyExamEasy AANP FNP Reference Book — ZERO-ERROR QA Report

**Auditor:** PABLO executor (ruthless pass)  
**Scope:** Chapter files `00`–`16` on disk (not BOOK.md summaries alone)  
**Date:** 2026-09-10 (America/Chicago)  
**Re-scan note:** Parent mid-audit fixes confirmed (Depth cards stripped from 03/05; pulmonary multimorbidity rename; Ryan’s bar removed from 16; endocrine monitoring table rename; BOOK rebuilt). This report reflects **post-fix** disk state, including surgical fixes applied in this audit.

**Overall grade: PASS WITH FIXES**

---

## 1. ERROR list (must fix)

> Items marked **FIXED THIS AUDIT** or **FIXED BY PARENT** are no longer open defects. They remain listed so Ryan can see what was wrong and what changed.

### E1. Domain II asterisk applied to Middle Adult (blueprint deviation) — **FIXED THIS AUDIT**
- **Files:** `00-front-matter.md:89` (was); `01-exam-strategy.md:90` (was); `15-quick-reference.md:55,280` (was); `16-back-matter.md:32` (was); `aanp-fnp-content-guide.md:20` (was); also prose in `03-health-promotion-screening.md:317`, `07-gi-hepatic.md:331`, `11-psych-neuro.md:247`
- **Quote (before):** `| Middle Adult* | 26% |` with footnote `*Includes prenatal`
- **Why wrong:** Locked official Domain II marks asterisk only on **Adolescent\*** and **Young Adult\*** (`*Includes prenatal`). **Middle Adult 26%** has **no** asterisk. Tagging Middle Adult\* falsely folds prenatal into that band and contradicts the locked blueprint.
- **Fix applied:** Removed `*` from Middle Adult everywhere in chapter sources + content guide; rebuilt `BOOK.md` (~52.8k words). Footnotes now correctly attach prenatal only to Adolescent\*/Young Adult\*.

### E2. Kawasaki criterion typo `//5 days` — **FIXED THIS AUDIT**
- **File:** `10-pediatrics-lifespan.md:96` (was)
- **Quote (before):** `Kawasaki cues (//5 days fever + mucocutaneous signs)`
- **Why wrong:** Garbled operator; teaching intent is **≥5 days** (also correctly stated later at `:408`).
- **Fix applied:** `//5` → `≥5`.

### E3. Leftover `## Depth card` padding (03, 05) — **FIXED BY PARENT**
- **Was:** `03-health-promotion-screening.md` Depth card 1; `05-pulmonary.md` Depth cards 1–2 (+ related meta headings / Ryan bar / Extra depth label)
- **Why wrong:** Leftover padding / non-shippable scaffolding.
- **Status:** Re-scan shows **ZERO** `Depth card` / `Rapid-fire padding` / `Ryan’s bar` / `Final word count depth` / `Extra depth —` across `00`–`16`.

### E4. Stale concatenated `BOOK.md` after chapter fixes — **FIXED THIS AUDIT**
- **Why wrong:** Concat book still carried pre-fix Middle Adult\* / Kawasaki typo after chapter edits.
- **Fix applied:** Rebuilt `BOOK.md` from current `00`–`16` (~52,794 words).

**Open ERRORS requiring further author work:** **None identified** after the fixes above.

---

## 2. VERIFY list (clinical nuance / guideline drift — not auto-wrong)

### V1. Infant / young-infant fever age cutoffs
- **File:** `10-pediatrics-lifespan.md` § Topic B (`:89–96`, `:98`)
- **Claim:** Neonate ≤28 days themes → ED/protocol; young infant ~1–2–3 months → “follow current febrile infant pathways.”
- **Verdict:** Acceptable teaching (uses “themes” / current pathways). Keep the soft language; do **not** harden into absolute day-count recipes without “verify current AAP/PECARN-style guidance.”

### V2. SI “do not leave alone” wording uneven across chapters
- **Strong:** `10-pediatrics-lifespan.md:459` — `do not leave alone with access`
- **Adequate but softer:** `11-psych-neuro.md:228–236` — urgent safety/ED + means restriction; explicitly fails “no-suicide contract and send home with opioids”
- **Suggestion:** Add one identical MUST KNOW line in ch11/15 for parallel wording (safety emphasis), not because current text is clinically wrong.

### V3. Quick-ref endocrine can’t-miss row omits thyroid storm / myxedema
- **File:** `15-quick-reference.md:89` — `DKA/HHS; adrenal crisis; severe hypo`
- **Note:** Storm/myxedema are correctly taught in `06-endocrine.md` MUST KNOW boxes. Quick-ref row is incomplete vs chapter depth — enrich for sprint parity.

### V4. Pregnancy antihypertensives named as historical examples
- **Files:** `04-cardiology.md:93`; `14-pharmacology-prescribing.md` pregnancy vignette (~`:327`)
- **Claim:** labetalol / nifedipine / methyldopa as historical teaching examples with **verify current Ob guidance**
- **Verdict:** OK as themes; keep verify language (guideline preference order drifts).

### V5. Black adults HTN initial class nuance
- **File:** `04-cardiology.md:92`
- **Verdict:** Flagged as “nuance” / guideline themes — leave as VERIFY against current ACC/AHA-aligned teaching (not an ERROR as written).

### V6. “Never start ULT during acute gout flare” nuance
- **File:** `12-msk-derm.md:204` — already says exam nuance / verify current teaching
- **Verdict:** Correctly hedged; do not harden.

### V7. Visuals not generated yet
- **Path pattern:** `visuals/...png` referenced throughout; `visuals/` directory currently empty
- **Per brief:** Broken paths OK — images not generated. Track in `VISUALS-NEEDED.md` (filename nit: `aub-palms-coein.png` vs PALM-COEIN spelling).

### V8. Dual Topic G osteoporosis in endocrine
- **File:** `06-endocrine.md:232` brief + `:470` expanded
- **Verdict:** Not copy-paste identical; slightly redundant structure — optional merge later.

---

## 3. NITS (style)

1. **`**Remember this:**` prose labels** in `01-exam-strategy.md:143`, `02-clinical-reasoning.md:134` — not forbidden, but outside the locked callout set (MUST KNOW / HIGHLIGHT / TRAP / LIFESPAN). Prefer converting to HIGHLIGHT for label hygiene.
2. **Cauda equina listed under Neuro** in `15-quick-reference.md:83` can’t-miss table (also covered under MSK) — minor taxonomy nit.
3. **Chapter 03 word count ~2,570** after Depth-card strip — under the ~2,800 enhanced bar if prevention was meant to stay “Enhanced.” Clinical `04`–`14` all remain ≥~3,378.
4. **Empty double rules / trailing `---` whitespace** in a few chapter tails (e.g. endocrine around `:465–468`) — cosmetic.
5. **Vignette titles** sometimes use `Middle adult\*` / `Young adult\*` as decorative lifespan tags (`04:270`, `06:240`) — not blueprint tables; harmless but slightly noisy after asterisk cleanup.
6. **Pricing / CTA** consistently `$27.99/mo after trial; trial terms on site` — good; keep that exact soft language.
7. **No invented pass rates / student counts / Qbank sizes / guaranteed outcomes** found in `00`–`16` (front-matter explicitly disclaims pass guarantee). Soft “Pass-Focused” subtitle is marketing tone, not a guarantee claim.

---

## 4. PASS summary — what’s solid

### A. Blueprint / claims
- Official numbers correct where stated: **150 total; 135 scored + 15 pretest**; Domain I **Assess 43 (32%) / Diagnose 36 (26.5%) / Plan 36 (26.5%) / Evaluate 20 (15%)**; Domain II **2 / 3 / 4 / 4 / 9 / 22 / 26 / 30**; Older Adult **30%** repeated accurately.
- Exam owner framing is **AANPCB/AANP-first**; ANCC FNP-BC soft callout present and correctly separated.
- No NCSBN/NABP misuse; no pass-rate / Qbank-size invention.

### B. Leftover padding
- **Clean** after parent + this audit: zero Depth cards / Rapid-fire padding / Ryan bar / word-count-depth headings.

### C. Clinical can’t-miss accuracy (spot-check)
| Theme | Status |
| --- | --- |
| ACEI/ARB in pregnancy | **PASS** — hard no / switch + Ob (`04`, `09`, `14`, `15`) |
| PDE-5 + nitrates | **PASS** — absolute no (`04`, `08`, `14`, `15`) |
| Septic joint / cauda / SJS-TEN disposition | **PASS** — emergent/ED (`12`, `15`) |
| DKA/HHS / adrenal crisis / thyroid storm → ED | **PASS** (`06`, sprint callouts) |
| Ectopic / toxic PID → acute pathway | **PASS** (`09`, `15`) |
| SI safety | **PASS** with V2 wording polish optional (`10`, `11`) |
| Infant fever cutoffs | **PASS** as themes + verify (`10`) |
| Absolute drug doses | **PASS** — doses framed as teaching themes to verify; study-aid disclaimers present |

### D. Structure completeness (clinical chapters 04–14)
All have: study-aid disclaimer, **Why this chapter matters**, **ADPE lens**, real topics (not stubs), **≥2 vignettes** (actually 3–6+), exam traps, checklists.

| Ch | Words | Vignettes | Structure |
| ---: | ---: | ---: | --- |
| 04 Cardiology | 4137 | 3 | OK |
| 05 Pulmonary | 3378 | 5 | OK |
| 06 Endocrine | 3513 | 5 | OK |
| 07 GI/Hepatic | 3515 | 6+ | OK |
| 08 Renal/GU | 3510 | 6 | OK |
| 09 Women’s Health | 3575 | 3 | OK |
| 10 Pediatrics | 3512 | 5 | OK |
| 11 Psych/Neuro | 3500 | 5 | OK |
| 12 MSK/Derm | 4208 | 3 | OK |
| 13 ENT/Eyes/Heme/ID | 3849 | 3 | OK |
| 14 Pharmacology | 3823 | 3 | OK |

### E. Consistency
- Callout labels overwhelmingly **MUST KNOW / HIGHLIGHT / TRAP / LIFESPAN** (counts healthy; only minor `Remember this` nits).
- Older Adult **~30%** stated correctly whenever weighted.
- Visual refs use `visuals/...png` (images pending — expected).

### F. Thin / weak chapters
- **04–14:** none under ~2,800.
- **03** (~2570): slightly thin post-padding strip — optional enrich.
- **15** (~2051) / **16** (~1123): appropriate for quick-ref / back matter (not stubby FAQ; CTA + legal present).

---

## 5. Fixes applied this audit (surgical)

1. Removed illicit **Middle Adult\*** asterisk from blueprint tables/prose in `00`, `01`, `03`, `07`, `11`, `15`, `16`, `aanp-fnp-content-guide.md`.
2. Corrected Kawasaki `//5` → `≥5` in `10-pediatrics-lifespan.md`.
3. Rebuilt `BOOK.md` from fixed chapters (~52.8k words).

**Parent already fixed:** Depth cards (03/05), pulmonary multimorbidity heading, Ryan’s bar (16), endocrine monitoring table label.

---

## 6. Overall grade

# **PASS WITH FIXES**

Rationale: No remaining open blueprint or dangerous clinical ERRORS after parent + this audit’s surgical fixes. Remaining items are VERIFY hedges, style nits, optional SI wording parity, quick-ref completeness, visuals-not-yet-generated, and slight thinness in ch03 — none of which warrant FAIL for a zero-error *clinical/blueprint* bar if the applied fixes ship.

---

## Post-report polish (parent, same session)

Applied VERIFY polish after audit delivery:
1. Ch11 SI MUST KNOW now includes “Do not leave alone with access to means” (parity with ch10).
2. Ch15 quick-ref endocrine can’t-miss row now includes thyroid storm/myxedema alongside DKA/HHS and adrenal crisis.
3. Converted leftover “Remember this:” labels in ch01/ch02 to HIGHLIGHT callouts where present.
4. Rebuilt BOOK.md again.

**Open ERRORS:** still none.
**Remaining optional:** enrich ch03 word count; generate visuals; optional merge dual osteoporosis topics in ch06.
