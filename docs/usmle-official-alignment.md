# USMLE official content alignment

Internal editor reference for the shared Step 1 / Step 2 CK / Step 3 content spine.

**Product disclaimer:** In-app practice scores and domain readiness reflect platform activity only. They do **not** predict USMLE pass/fail and do not imply NBME/FSMB affiliation.

## Sources (retrieved 2026-09-06)

- [USMLE Content Outline (PDF)](https://www.usmle.org/sites/default/files/2022-01/USMLE_Content_Outline_0.pdf)
- [Step 1 Content Outline & Specifications](https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications)
- [Step 2 CK Content Outline & Specifications](https://www.usmle.org/exam-resources/step-2-ck-materials/step-2-ck-content-outline-and-specifications)
- [Step 3 Content Outline & Specifications](https://www.usmle.org/exam-resources/step-3-materials/step-3-content-outline-and-specifications)

## Canonical axes

Every serve-ready USMLE item should carry:

1. **`blueprintDomain`** — organ-system ID from the shared spine (`human-development`, `cardiovascular`, …)
2. **`blueprintTopic`** — granular high-yield slug (2026 catalog)
3. **`taskCategory`** — physician task / competency
4. **`stepLevel`** — `step1` | `step2` | `step3`

Code source of truth: `src/lib/exam-prep/usmle/official-content-model.ts` + `content-spine.ts`.

## Organ-system spine (shared)

| ID | Label | Step 1 % | Step 2 CK % | Step 3 % (approx) |
|----|-------|----------|-------------|-------------------|
| human-development | Human Development | 1–3 | 2–4 | 1–3 |
| blood-lymph-immune | Blood / Lymph / Immune | 9–13 | 5–10 | 6–10 |
| behavioral-nervous | Behavioral + Nervous | 10–14 | 10–20* | 10–16 |
| msk-skin | MSK / Skin | 8–12 | 6–12 | 6–10 |
| cardiovascular | Cardiovascular | 7–11 | 6–12 | 8–12 |
| respiratory-renal | Respiratory & Renal | 11–15 | 10–18* | 10–14 |
| gastrointestinal | GI | 6–10 | 5–10 | 6–10 |
| reproductive-endocrine | Repro / Endocrine | 12–16 | 6–14* | 8–12 |
| multisystem | Multisystem | 8–12 | 4–8 | 6–10 |
| biostats-epi | Biostats / Epi | 4–6 | 3–5 | 6–12 |
| social-sciences | Ethics / Comms / SBP | 6–9 | 10–15 | 7–12 |

\*Step 2 published tables split some systems (e.g. Behavioral vs Nervous; Renal/Repro vs Endocrine/Pregnancy). The spine merges related buckets for navigation; generation midpoints normalize to 100%.

## Secondary lenses (not primary nav)

- **Step 1 disciplines** — Pathology ~45–55%, Physiology ~30–40%, etc. (integrative; totals >100%). Use as filter chips / generation hints.
- **Step 2 clinical sciences** — Medicine 55–65%, Pediatrics 17–27%, OB/GYN 10–20%, Psychiatry 10–15%, Surgery 5–15%.
- **Step 3** — Day 1 Foundations (biostats/ethics) + Day 2 ACM (diagnosis/management). CCS: MCQ proxies only in v1 (no Primum simulator).

## Study Hub navigation

Primary domains = organ systems. Step 1 discipline filters are secondary. Do not surface generation-batch or pedagogy tags (`nclex-strategy`, `trap-tier`, etc.) as topics.

## Pass path (product)

1. Foundations / weak-system remediation (Mastery cells by organ system)
2. Mixed blueprint-balanced blocks
3. Timed full-exam simulation

Honest readiness copy only (coverage + competence on this platform).
