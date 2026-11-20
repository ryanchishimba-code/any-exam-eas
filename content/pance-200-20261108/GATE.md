# PANCE serving gate (read 2026-11-08, SELECT only)

Current code (`studentEligibleAndSql` in `src/lib/exam-prep/student-eligibility-sql.ts`):

`active = true AND qaPassed = true AND (student-eligibility restored OR NOT structural defect)`

The structural-defect predicate already includes `keyWrongIdSql()` (2,955 code-hidden ids) and retired `itemQa` rows.

## Reconciliation

| Gate | Count |
|---|---|
| `fieldId = pance` AND `active` AND `qaPassed` | **2,560** |
| Of those, code-hidden id overlap | **0** |
| Of those, `itemQa.retiredReason` set | **0** |
| Of those, `studentEligibility.status = restored` | **0** |
| Of those, item type | all vignette |
| Distinct question openings (first 180 characters) | 1,157 |
| Distinct openings by subject (160-character stem) | 1,426 |

The October query that returned 2,560 is the same active + qaPassed pool. The eligibility SQL does not remove any of those rows, because none are code-hidden or retired. The older “about 1,123” figure matches unique stem openings (1,157), not the row count students can be served. Served count used for gaps is **2,560 rows**.

Row share versus the January 2025 NCCPA weights (cardiovascular 11, pulmonary 9, GI 8, musculoskeletal 8, neurologic 7, psychiatry 7, infectious disease 7, reproductive 7, endocrine 6, EENT 6, hematologic 5, renal 5, dermatologic 4, genitourinary 4, professional practice 6): dermatologic (116), genitourinary (108), and renal (127) are the three smallest organ-system banks. Distinct-stem counts are even thinner for dermatologic (51) and genitourinary (60). The new 200 items are weighted toward those three.
