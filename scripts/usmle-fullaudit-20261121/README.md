# USMLE full audit, 2026-11-21

Draft only. These scripts do not change production until someone runs the apply file on purpose. Do not merge this pull request for that purpose.

The universe is every served Step 1, Step 2, and Step 3 item that passes the attached served gate, minus:

- ids in `qbi_usmle_audit240_20261114_backup` (236)
- the 240-item sample on `cursor/usmle-audit80b-20261121-4883` (the `md5(id || 'usmle-audit80b-20261121')` draw; all 175 defect ids from that pull request sit inside it)
- the 265 ids in `scripts/usmle-optlen-20261121/usmle-optlen-20261121-report.csv` on `cursor/usmle-optlen-20261121-165d`

That leaves 9,398 items: Step 1 2,538, Step 2 2,598, Step 3 4,262.

Pass 1 rule: if the stem is missing one fact, add that fact so it supports the intended key. Do not rekey to a weaker answer.

## Batch 1 (pass 1) — 26 items

The original keys stay. The stems were incomplete.

- 18 stroke items keep alteplase or thrombolysis. Each stem now says the patient was last known well 90 minutes ago and that noncontrast CT shows no hemorrhage. Two stems that listed 180/110 mm Hg now list 170/95 mm Hg, under the alteplase limit of 185/110. Two atrial-fibrillation stems now say no anticoagulant is in use. Source: [2018 AHA/ASA guideline](https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158).
- 4 pulmonary-embolism items keep heparin. Blood pressure 90/60 mm Hg is not high-risk (systolic pressure below 90 mm Hg for 15 minutes, or a drop of 40 mm Hg or more), and the explanations were arguing for anticoagulation. The pressure is now 118/74 mm Hg. Hypoxemia that made oxygen a second correct step is now 96%. Subtherapeutic warfarin stems include an INR of 1.2.
- 3 items ask which choice is contraindicated and were keyed to thrombolysis for a false reason (a blood pressure of 90/60 mm Hg). They now include an ischemic stroke 1 month ago, an absolute fibrinolysis contraindication in the 2019 ESC guideline, and a normal blood pressure. The key stays thrombolysis.
- 1 item whose explanation calls for reperfusion now has a systolic pressure of 78 mm Hg that has lasted 20 minutes after fluid, with no bleeding contraindication. The key stays thrombolysis.

Sources for the embolism edits: [2019 ESC guideline](https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf) and the [Merck Manual](https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe).

Four Step 1 items whose lead-in is only acute management move to Step 2. Blueprint tags on the edited items name the concept the stem tests.

Run later, in order:

1. `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-stage.sql`
2. `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-apply.sql`

Undo with `scripts/usmle-fullaudit-20261121/batch-01-pass1-undo.sql`. Apply aborts if a live row no longer matches the backup snapshot.

## Batch 2 (pass 1) — 16 items

Keys stay.

- 11 hyperkalemia items keep calcium gluconate. Stems that never showed an ECG now include peaked T waves and a widened QRS, the Merck indication for intravenous calcium. Step 1 copies move to Step 2.
- 2 organophosphate items keep pralidoxime. The stem now says atropine has already dried the secretions, which is when the Merck Manual gives pralidoxime for muscle weakness.
- 1 diabetic ketoacidosis item keeps fluids then intravenous insulin. The pH, which had been cut off at "7.", is now 7.18, and the potassium is 4.8 mEq/L, so bicarbonate is not routine and insulin is not held.
- 2 Step 1 stroke items already had a time and a negative CT. One keeps alteplase. One keeps lowering blood pressure from 190/110 mm Hg before alteplase. Both move to Step 2.

Sources: [Merck hyperkalemia](https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia), [Merck diabetic ketoacidosis](https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka), [Merck organophosphate poisoning](https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning), and the [2018 AHA/ASA stroke guideline](https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158).
