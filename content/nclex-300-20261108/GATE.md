# NCLEX-RN serving gate (read 2026-11-08, SELECT only)

`fieldId = nursing`, `active = true`, `qaPassed = true`, and the student-eligibility predicate in `student-eligibility-sql.ts` (structural defects, code-hidden ids, retired rows).

Served rows: **4,467**.

Client Needs are taken from `options.clientNeedsCategory`, which is what the 2026 quota uses. Official midpoints are the NCSBN NCLEX-RN Test Plan effective April 2026.

| Category | Served | Share | 2026 midpoint | Gap |
|---|---:|---:|---:|---:|
| Management of Care | 610 | 13.7% | 18% | light |
| Safety and Infection Prevention and Control | 390 | 8.7% | 13% | light |
| Basic Care and Comfort | 296 | 6.6% | 9% | light |
| Reduction of Risk Potential | 483 | 10.8% | 12% | light |
| Psychosocial Integrity | 391 | 8.8% | 9% | near |
| Health Promotion and Maintenance | 455 | 10.2% | 9% | near |
| Pharmacological and Parenteral Therapies | 887 | 19.9% | 16% | heavy |
| Physiological Adaptation | 903 | 20.2% | 14% | heavy |
| Untagged options | 52 | 1.2% | — | — |

Formats in that served pool: vignette 3,959, select-all 267, case study 124, highlight 83, ordered response 9, bow-tie 2, matrix 2. The new 300 are weighted to the light categories and to bow-tie, matrix, ordered-response, and complete 6-item case studies.

NCSBN also measures clinical judgment with 18 case-study items (three sets) plus about 10% stand-alone clinical-judgment items. Case groups are stored inactive. The serve rule counts a case only when all six members are active, so a later go-live has to turn each set of six on together.
