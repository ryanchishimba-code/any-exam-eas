# Plan to reach 3,000 solid served questions on each USMLE Step

The 60-item pilot is live. Batch 1 has 188 items live and 12 holdouts hidden. Batch 2 has 78 items live and 122 thin items hidden. Batch 3 has 96 sound items live and 104 thin items hidden. Batch 4 has 175 sound items live and 25 thin items hidden. Batch 5 has 127 sound items live and 73 thin items hidden. Batch 6 (200 items) is inserted hidden and is not live. Served counts after the batch-5 activation are Step 1 2,298, Step 2 CK 2,042, and Step 3 4,644. A batch goes live only after Ryan says so.

## Where the bank is now

Served counts use the public gate (active, qaPassed, Step 2 not labeled step 3, student-eligible). Solid is the sound share from the 30-item blind read after Step B (sound 9 / thin 6 / fail 3). The sound rate is 17/30, 18/30, and 15/30.

| Step | Served | Sound rate | Estimated solid | Gap to 3,000 solid |
| --- | ---: | ---: | ---: | ---: |
| Step 1 | 1,934 | 17/30 | 1,096 | 1,904 |
| Step 2 CK | 1,702 | 18/30 | 1,021 | 1,979 |
| Step 3 | 4,624 | 15/30 | 2,312 | 688 |

Step 3 is already above 3,000 served. Its gap is quality, not headcount. Step 1 and Step 2 are short on both.

## How new items are counted

A new item closes the gap only when a blind read calls it sound and Ryan has allowed it to become active. Rewriting a thin item does not count until that same read calls it sound. Do not add another copy of the families already cleaned up: heart-failure shells, NSAID kidney injury, insulin-omission ketoacidosis, dormitory meningitis, or a methods question bolted onto an unrelated labor story.

## Outline targets for the new solid items

Weights are midpoints of the ranges on the USMLE.org specification pages (reviewed 2026-11-09). Step 2 nutrition (15–20%) is cross-coded onto a system, so it is not a separate pile. About one in six Step 2 items should also teach a nutrition decision inside its system quota.

Step 1 (1,904). Source: Step 1 content specifications.

| System | Midpoint % | New solid items |
| --- | ---: | ---: |
| Reproductive and endocrine | 14 | 261 |
| Respiratory and renal | 13 | 244 |
| Behavioral health and nervous system | 12 | 225 |
| Blood and immune | 11 | 206 |
| Musculoskeletal and skin | 10 | 188 |
| Multisystem | 10 | 188 |
| Cardiovascular | 9 | 169 |
| Gastrointestinal | 8 | 150 |
| Social sciences | 7.5 | 141 |
| Biostatistics | 5 | 94 |
| Human development | 2 | 38 |

Step 2 CK (1,979). Source: Step 2 CK content specifications. Physician tasks to favor: diagnosis, diagnostic studies, and management. Foundational-science-only items are not the Step 2 job.

| System | Midpoint % | New solid items |
| --- | ---: | ---: |
| Social sciences, ethics, and safety | 12.5 | 245 |
| Renal and reproductive | 10 | 196 |
| Cardiovascular | 9 | 176 |
| Musculoskeletal and skin | 9 | 176 |
| Behavioral health | 7.5 | 147 |
| Blood and immune | 7.5 | 147 |
| Gastrointestinal | 7.5 | 147 |
| Nervous system | 7.5 | 147 |
| Respiratory | 7.5 | 147 |
| Multisystem | 6 | 118 |
| Endocrine | 5 | 98 |
| Pregnancy and puerperium | 5 | 98 |
| Biostatistics | 4 | 78 |
| Human development | 3 | 59 |

Step 3 (688). Source: Step 3 MCQ table. Biostatistics and ethics are a large share of this smaller gap. Day-2 items should be management a general physician would start.

| System | Midpoint % | New solid items |
| --- | ---: | ---: |
| Biostatistics and literature | 12 | 80 |
| Cardiovascular | 10 | 69 |
| Respiratory | 9 | 63 |
| Nervous system | 9 | 63 |
| Pregnancy and female reproductive | 8 | 56 |
| Social sciences and patient safety | 8 | 56 |
| Immune, blood, and multisystem | 7 | 49 |
| Gastrointestinal | 7 | 49 |
| Endocrine | 6 | 42 |
| Musculoskeletal | 6 | 42 |
| Behavioral health | 5 | 35 |
| Skin | 5 | 35 |
| Renal and male reproductive | 5 | 35 |
| Human development | 2 | 14 |

## How a batch moves

1. Write original single-best-answer vignettes for the next slice of the table.
2. Run them through the exam gate before any insert. Exam-readiness is first: a high-yield, outline-weighted decision at that Step's difficulty, with the takeaway taught in the rationale. Then no near-duplicate stem, every option explained, one best answer, the step label matching the field, a real vignette, and a guideline or year when the question is a management decision.
3. Snapshot the branch, back up the batch, and insert at most 100 rows with active false and qaPassed false. Keep a scoped undo.
4. Blind-read the batch, then check the key and the citation against the source.
5. Set a batch active only after Ryan says that batch is ready. Do not activate a batch because the gate passed.

## Pilot

Twenty items per Step are in `pilot-step1.json`, `pilot-step2.json`, and `pilot-step3.json`. Those 60 rows are live. Batch 1 (100 Step 1 and 100 Step 2 CK) is in `batch1/` and is inserted with active false. The unit test `src/lib/exam-prep/usmle-3000-pilot.test.ts` checks that the pilot passes the gate and does not repeat itself.
