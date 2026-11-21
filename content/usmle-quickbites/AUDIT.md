# USMLE Quick Bites upgrade audit

Upgrade of the hidden 540-bite library. Release flags stay off. Nothing in this pass is merged or live.

Word count is the whitespace word count of the lead, the lines, and the miss together. The same function was used before and after. The backup is `scripts/usmle-quickbites-20261121/backup-pre-upgrade-20261121/`.

## Counts

| | Step 1 before | Step 1 after | Step 2 CK before | Step 2 CK after | Step 3 before | Step 3 after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Bites | 180 | 180 | 180 | 180 | 180 | 180 |
| Mean words | 71.4 | 101.5 | 70.2 | 101.9 | 64.9 | 101.7 |
| Shortest / longest | 52 / 96 | 80 / 120 | 45 / 110 | 80 / 126 | 43 / 104 | 81 / 133 |
| StatPearls | 180 | 162 | 138 | 118 | 137 | 118 |
| Guideline or USPSTF / CDC / society | 0 | 13 | 38 | 48 | 39 | 51 |
| Trial, consensus report, or scientific statement | 0 | 2 | 3 | 6 | 4 | 7 |
| AMA Code of Ethics | 0 | 3 | 1 | 8 | 0 | 4 |
| Diagrams | 10 | 70 | 4 | 92 | 0 | 100 |

All 540 bites are between 80 and 133 words, with 3 to 5 lines. Diagrams are on 262 of 540 bites (49%). Each diagram is a table the bite actually uses (a cutoff, a dose, a sequence, or a split). Quotas are unchanged: 180 per Step, one open sample per Step.

The overlap checks still pass. Leads were not rewritten in this pass, so none became a copy of a study-guide sentence, a question seed, or a feed card.

## What changed

Lines that did not teach a testable fact were removed. The ones called out in review are gone: "Do not assign a sex in the hallway," "Document the reason," "The note quotes the patient's words," and "Tell the patient why the familiar pill is gone." The miss line is still the usual exam trap.

StatPearls was replaced where a primary guideline, USPSTF recommendation, CDC guideline, or equivalent standing source was confirmed and the "says" line is limited to what that source supports. Step 1 stays mostly StatPearls because those bites are mechanisms, histology, pathways, and calculations. Thirteen Step 1 bites that are decisions (screening, consent, a trial result) now cite the decision's source.

## StatPearls kept on purpose

**Basic science.** Step 1 mechanisms and the matching Step 2 or Step 3 bites that teach a pathway rather than a society recommendation stay on the StatPearls chapter: receptor coupling, tract anatomy, murmur maneuvers, infarct histology, coagulation tests, menstrual-cycle order, gram-stain branch points, shock profiles, urine anion gap, renal tubular acidosis types, bilirubin solubility, and the biostatistics identities. No society guideline owns those facts.

**Clinical topics with no confirmed primary URL in this pass.** These stayed on the StatPearls chapter rather than a guessed link. A guideline may exist; it was not cited because the page was not confirmed:

- Hematology: HIT (ASH 2018 page not re-fetched), febrile neutropenia (IDSA 2010 page not re-fetched), TTP, ITP, DIC, hemophilia factor replacement, PNH, polycythemia vera targets, APL/ATRA (NCCN is paywalled), tumor lysis.
- Neurology and psychiatry: thunderclap headache, migraine (AHS page not fetched), multiple-sclerosis flare dosing, Parkinson timing, cord compression, brain abscess, Horner syndrome, Bell palsy, epidural and subdural operative thresholds, neuroleptic malignant syndrome, serotonin syndrome, lithium.
- Endocrine: thyroid storm and antithyroid drugs in pregnancy (ATA 2016 URL not re-read), adrenal crisis (Endocrine Society page not confirmed), pheochromocytoma preparation, prolactinoma.
- Gastrointestinal and renal physiology orders: ulcerative colitis (ACG URL not confirmed this pass), achalasia, cholecystitis versus duct stone, H. pylori regimen details, hyponatremia bolus practice (no European-guideline URL rechecked), hyperkalemia sequence (no single current society URL).
- Injury and infection: anaphylaxis (WAO page returned 403 and was not used), carbon monoxide, acetaminophen nomogram, naloxone duration, alcohol was moved to ASAM, pancreatitis and celiac and reflux were moved to ACG.
- Obstetrics and gynecology beyond the confirmed ACOG and USPSTF pages: abruption, previa, gestational-diabetes newborn checks, torsion time windows.
- Ethics and systems that are not the two confirmed AMA opinions (informed consent, and decisions for adults who lack capacity): error disclosure, scarce-resource rules, POLST versus an advance directive, impaired-colleague reporting, placebos, organ-donation requesting.

IDSA bacterial meningitis remains the 2004 guideline because it is still the standing IDSA document. Beers is the 2023 criteria; a 2026 edition was not confirmed. The AASLD portal-hypertension page is live and is cited as the 2017 practice guidance, because that is the published document and the page HTML did not show a later edition. AMA Code opinions are cited as 2016, the year those opinions are dated, at the current Code URLs. GOLD is cited to the live 2026 report page (`https://goldcopd.org/2026-gold-report-and-pocket-guide/`), which is where the older report path redirects.

## Checks

Unit audit (`src/lib/quick-bites/usmle-bites.test.ts`) and the library component test passed after the edit. Homepage and `/usmle` were not edited. Flags still default off.
