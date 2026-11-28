# USMLE Quick Bites

AnyExamEasy is independent of the USMLE program, the NBME, and the FSMB. Nothing here promises a result on an exam.

`/workspace/usmle-parity/PLAN.md` is not in this repo or in `content/`. This file is the plan.

Quick Bites are the one-screen branch point. The question bank makes the learner use it in a vignette. The USMLE feed (PR #476) drills it as a card. The study guides explain the chapter around it. A bite does not repeat those three.

## What a bite is

A bite is one must-know decision, number, or mechanism. It is not a vignette, not a flashcard, and not a chapter.

| Piece | Rule |
| --- | --- |
| Lead | One sentence. The thing that changes the next answer. |
| Scan lines | Three or four short lines. No warmup and no trivia. |
| The usual miss | The wrong move students make with this fact. |
| Diagram | Only when a table, a branch, or a map is clearer than a sentence. |
| Source | A current guideline, or one named chapter or paper, with a year and a URL. |
| Length | About one minute. |

Step 1 bites cite the mechanism from a named StatPearls chapter checked against the NCBI Bookshelf record, or from the guideline when one exists. Step 2 CK and Step 3 bites cite the guideline that sets the threshold, the drug, or the order.

The library reuses the NCLEX Quick Bites page: the same eyebrow, title, two-column grid, and list cards. The reading pane holds the bite. These are not videos, so there is no player and no poster. Nursing, pharmacy, FNP, and PANCE Quick Bites are unchanged. The homepage and `/usmle` are unchanged.

## Hidden until Ryan says so

Students get a 404. Admins can preview `/usmle/quick-bites`.

The flags match the USMLE study guide and the USMLE feed:

- `NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC` turns on the sidebar link after a rebuild.
- `USMLE_QUICK_BITES_PUBLIC` opens the route at request time.

Either flag must be `1` or `true`. Both default off. The sidebar does not list Quick Bites for USMLE while the public flag is off.

No question-bank row, study-guide row, or other table is written. `scripts/usmle-quickbites-sample/01-backup.sql` records that the pre-insert count is zero. `scripts/usmle-quickbites-sample/03-undo.sql` restores that empty state. Do not run `scripts/06-rollback-DO-NOT-RUN.sql`.

When a flag is later turned on, the first bite of each Step is the free sample and the rest stay on the same paid check as NCLEX Quick Bites. That path is not on now.

## How the four products divide the work

| Product | Job | What a bite must not do |
| --- | --- | --- |
| Question bank | A vignette with one best next step. | Copy a stem, options, or the explanation. |
| USMLE feed, PR #476 | 240 cards per Step. A question on the front, a short answer on the back. | Ask the card's question again, or restate its answer as the lead. |
| Study guides | The chapter, the study plan, and the exam-day notes. | Retell the chapter. |
| Quick Bites | The branch point, the number, and the diagram. | Add a fact that does not change a decision. |

An audit script compares each lead with feed fronts and backs. A high word overlap fails the check.

## Counts

The full library is 180 bites per Step. That is large enough to cover the outline at the grain of one decision, and smaller than the 240-card feed so the two stay different. This change contains those 540 bites, still hidden.

Organ-system ranges are the official ranges already in `src/lib/exam-prep/usmle/official-content-model.ts` (USMLE content outlines, retrieved 2026-09-06). The midpoint is that file's midpoint. Shares are normalized so they sum to 100%.

This repo has no published per-topic miss table. The miss weight below is an editorial multiplier for topics that change a scored decision and that learners reliably confuse. Outline share still dominates. A multiplier cannot pull a 2% system up to the size of cardiovascular disease. Replace these multipliers with measured miss rates from served items before the full 180 are written.

### Step 1

Pathology and physiology are the integrative disciplines (about 45–55% and 30–40%). They are not a second quota. Each bite sits in one organ system and is taught as a mechanism.

| System | Outline | Midpoint | Miss weight | Full library | This sample |
| --- | ---: | ---: | ---: | ---: | ---: |
| Human development | 1–3% | 2 | 1.1 | 3 | 1 |
| Blood and immune | 9–13% | 11 | 1.3 | 20 | 3 |
| Nervous system and behavior | 10–14% | 12 | 1.2 | 20 | 3 |
| Musculoskeletal and skin | 8–12% | 10 | 1.0 | 14 | 2 |
| Cardiovascular | 7–11% | 9 | 1.3 | 16 | 3 |
| Respiratory and renal | 11–15% | 13 | 1.5 | 27 | 4 |
| Gastrointestinal | 6–10% | 8 | 1.1 | 12 | 2 |
| Reproductive and endocrine | 12–16% | 14 | 1.4 | 27 | 5 |
| Multisystem | 8–12% | 10 | 1.3 | 18 | 3 |
| Biostatistics | 4–6% | 5 | 1.6 | 11 | 2 |
| Ethics and systems | 6–9% | 7.5 | 1.3 | 12 | 2 |
| Total |  |  |  | 180 | 30 |

The sample spends its extra respiratory, endocrine, and biostatistics slots on acid-base compensation, the nephron, steroid-enzyme blocks, and predictive values. Those are the Step 1 misses that a card cannot draw.

### Step 2 CK

Physician tasks are integrative. Diagnosis is about 35–45% of the exam, pharmacotherapy and clinical interventions about 10–20% each. Bites are the management number, not the diagnosis name.

| System | Outline | Midpoint | Miss weight | Full library | This sample |
| --- | ---: | ---: | ---: | ---: | ---: |
| Human development | 2–4% | 3 | 1.2 | 5 | 1 |
| Blood and immune | 5–10% | 7.5 | 1.2 | 13 | 2 |
| Nervous system and behavior | 10–20% combined | 12.5 | 1.3 | 24 | 4 |
| Musculoskeletal and skin | 6–12% | 9 | 1.0 | 13 | 2 |
| Cardiovascular | 6–12% | 9 | 1.4 | 18 | 3 |
| Respiratory and renal | 10–18% combined | 15 | 1.4 | 31 | 5 |
| Gastrointestinal | 5–10% | 7.5 | 1.2 | 13 | 2 |
| Reproductive and endocrine | 6–14% | 10 | 1.3 | 19 | 3 |
| Multisystem | 4–8% | 6 | 1.2 | 10 | 2 |
| Biostatistics and population health | 3–5% | 4 | 1.5 | 9 | 2 |
| Ethics and systems | 10–15% | 12.5 | 1.4 | 25 | 4 |
| Total |  |  |  | 180 | 30 |

Respiratory and renal disease is the largest Step 2 block. Ethics stays large because the outline puts it at 10–15% and the misses are decision errors. The sample's four ethics bites are capacity, disclosure, the surrogate's job, and a valid refusal. Depression screening sits with population health.

### Step 3

Step 3 adds the order, the disposition, and the clock. A Step 3 bite does not reteach the Step 2 diagnosis.

| System | Outline | Midpoint | Miss weight | Full library | This sample |
| --- | ---: | ---: | ---: | ---: | ---: |
| Human development | 1–3% | 2 | 1.2 | 4 | 1 |
| Blood and immune | 6–10% | 8 | 1.2 | 14 | 2 |
| Nervous system and behavior | 10–16% | 12 | 1.2 | 21 | 4 |
| Musculoskeletal and skin | 6–10% | 8 | 1.0 | 12 | 2 |
| Cardiovascular | 8–12% | 10 | 1.4 | 21 | 3 |
| Respiratory and renal | 10–14% | 12 | 1.3 | 23 | 4 |
| Gastrointestinal | 6–10% | 8 | 1.1 | 13 | 2 |
| Reproductive and endocrine | 8–12% | 10 | 1.3 | 19 | 3 |
| Multisystem | 6–10% | 8 | 1.2 | 14 | 2 |
| Biostatistics and population health | 6–12% | 8 | 1.5 | 18 | 3 |
| Ethics and systems | 7–12% | 10 | 1.4 | 21 | 4 |
| Total |  |  |  | 180 | 30 |

Foundations of independent practice are why biostatistics and ethics stay large. The sample uses those slots for absolute risk, when to stop a screen, adult vaccines, the handoff, opioid prescribing, an unrepresented patient, and who may obtain consent. Capacity, disclosure, and a valid refusal are the Step 2 bites and are not repeated.

## Sample rules

1. Every bite is a decision a passer is expected to make.
2. The citation is the current guideline or the named chapter used for that sentence.
3. A diagram is added only for a comparison that a sentence muddles.
4. No bite's lead may match a feed card's front or back.
5. No bite retells a study-guide chapter or a question-bank explanation.
6. The full library is in this change and stays hidden. Nothing is live until Ryan says so.

## Where the library lives

- `content/usmle-quickbites/step-1/bites.json`
- `content/usmle-quickbites/step-2/bites.json`
- `content/usmle-quickbites/step-3/bites.json`
- Preview route: `/usmle/quick-bites`, `/usmle/quick-bites?step=2ck`, `/usmle/quick-bites?step=3`
- Audit: `content/usmle-quickbites/AUDIT.md`
