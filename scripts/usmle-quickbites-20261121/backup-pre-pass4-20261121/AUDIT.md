# USMLE Quick Bites sourcing pass

The library stays hidden. Flags are unchanged. This pass checked claims against a confirmable source and rewrote or removed anything that source does not state. Design and components were not changed.

Backup before the third pass: `scripts/usmle-quickbites-20261121/backup-pre-third-pass-20261121/`.
Undo the third pass: `scripts/usmle-quickbites-20261121/08-undo-third-pass.sh`.
Backup before the finish pass: `scripts/usmle-quickbites-20261121/backup-pre-finish-20261121/`.
Undo the finish pass: `scripts/usmle-quickbites-20261121/07-undo-finish-sourcing.sh`.
Earlier sourcing backup: `scripts/usmle-quickbites-20261121/backup-pre-sourcing-20261121/`.

## Citations by type

Counted from the source name after this pass. "Guideline" is a society or government practice guideline. "Statement or trial" is a scientific statement, consensus parameter, or named trial. "Reference text" is StatPearls or the same kind of textbook chapter. "Ethics code" is the AMA Code of Medical Ethics.

| | Step 1 | Step 2 CK | Step 3 |
| --- | ---: | ---: | ---: |
| Guideline | 42 | 91 | 104 |
| Statement or trial | 3 | 9 | 9 |
| Ethics code | 5 | 16 | 12 |
| Reference text | 130 | 64 | 55 |

These counts are after the third pass. A statement or trial includes expert panels, consensus statements, and focused updates. Ethics opinions are the AMA Code. Reference text is StatPearls.

New or corrected guideline links use a PubMed URL or, for the UK kidney guideline, the society's PDF. Paywalled journal pages were not used as the only link.

## Claims changed to match the source

These management claims were rewritten because the previous number or sequence was not what the cited document says.

- **Severe hyponatremia** (`usmle-qb-s1-090` was left as the SIADH mechanism; `usmle-qb-s2-085`, `usmle-qb-s3-078`). The European 2014 guideline (PMID 24569125) uses 150 mL of 3% saline over 20 minutes, with a second 150 mL if symptoms persist. The rise is limited to 10 mmol/L in the first 24 hours and 8 mmol/L each 24 hours after that, until the sodium is 130 mmol/L. The previous 100 mL bolus was removed. The diagram rows were changed to the same figures.
- **Hyperkalemia with ECG changes** (`usmle-qb-s3-085`). The July 2026 UK Kidney Association update, not the 2020 edition, is the current document. ECG changes get 30 mL of 10% calcium gluconate over 10 minutes (10 mL of 10% calcium chloride over 5 minutes in resuscitation), then 10 units of soluble insulin in 25 g of glucose. Calcium resonium is not the acute treatment. The diagram matches that.
- **Giant-cell arteritis** (`usmle-qb-s1-049`, `usmle-qb-s3-046`). The 2021 ACR/VF guideline (PMID 34235884) recommends high-dose oral glucocorticoids when there is no cranial ischemia, and IV pulse glucocorticoids when vision is threatened. Biopsy is within 2 weeks of starting oral glucocorticoids, and the specimen should be longer than 1 cm. Prednisone 40–60 mg and a 7-day biopsy deadline were removed. They are not the recommendation text.
- **Thyroid storm** (`usmle-qb-s1-118`, `usmle-qb-s2-122`, `usmle-qb-s3-110`). The 2016 ATA hyperthyroidism guideline (PMID 27521067) names a multimodality regimen: beta blocker, antithyroid drug, inorganic iodide, corticosteroid, and cooling with acetaminophen. A 60-minute gap before iodide, and a ban on aspirin, were removed. The titles no longer say the drugs are a timed sequence.
- **Antithyroid drug in pregnancy** (`usmle-qb-s1-136`, `usmle-qb-s3-126`). The same 2016 ATA guideline says propylthiouracil when a drug is used in the first trimester, and methimazole when a drug is started after the first trimester.
- **Anaphylaxis** (`usmle-qb-s1-157`, `usmle-qb-s2-138`, `usmle-qb-s3-129`). The 2023 practice parameter (PMID 38108678) doses epinephrine at 0.01 mg/kg, maximum 0.3 mg in children and teenagers and 0.5 mg in adults. Acute tryptase is drawn as early as possible, ideally within 2 hours, and a value under the laboratory cutoff does not exclude the diagnosis. The flat "0.3–0.5 mg of 1 mg/mL" line was removed.
- **HIT** (`usmle-qb-s1-153`, `usmle-qb-s2-013`, `usmle-qb-s3-010`). ASH 2018 (PMID 30482768) uses the 4Ts score, recommends against empiric treatment when the score is low, and recommends a non-heparin anticoagulant when the score is intermediate or high. A vitamin K antagonist is not started before the platelet count recovers, usually to at least 150 × 10^9/L. Day 5–10 as a free-standing rule, apart from the 4Ts score, was not left as its own claim.
- **TTP** (`usmle-qb-s2-006`, `usmle-qb-s3-007`). ISTH 2020 diagnosis (PMID 32914582) and treatment (PMID 32914526): when suspicion is high, draw ADAMTS13 before plasma exchange, then start plasma exchange and corticosteroids without waiting. Caplacizumab is conditional and does not delay exchange.
- **ITP management** (`usmle-qb-s2-009`). ASH 2019 (PMID 31794604) includes observation, and corticosteroids when treatment is chosen. A platelet-count threshold was removed.
- **Febrile neutropenia** (`usmle-qb-s2-007`, `usmle-qb-s3-008`). The IDSA 2010 update (PMID 21258094) says fever and neutropenia is treated immediately with broad empiric antibiotics. ANC cutoffs, a 38.3 °C definition, a 60-minute rule, and a vancomycin indication list were removed because they were not in the abstract used to check this citation. The 2018 ASCO/IDSA outpatient update (PMID 29461916) is the document that states the first dose within 1 hour of triage. It was not substituted for the inpatient bite.
- **Adrenal crisis** (`usmle-qb-s1-119`, `usmle-qb-s2-123`, `usmle-qb-s3-111`). The Endocrine Society 2016 guideline (PMID 26760044) says not to withhold treatment in an acutely ill patient while waiting for a corticotropin test. Adult maintenance, after the emergency, is hydrocortisone 15–25 mg/day plus fludrocortisone about 0.1 mg. A 100 mg crisis dose was removed. It was not in the text checked.
- **Bell palsy treatment** (`usmle-qb-s2-032`, `usmle-qb-s3-036`). The 2026 facial-nerve guideline (PMID 42163702) strongly recommends an oral corticosteroid within 72 hours. A specific prednisone milligram dose was not added. The forehead-sparing localization bite stays a reference-text mechanism.
- **Ulcerative colitis management** (`usmle-qb-s2-115`, `usmle-qb-s3-105`). Cited to the 2025 ACG update (PMID 40701556). Stool-count and colon-diameter cutoffs, and a specific antidiarrheal ban, were removed because they were not confirmed in the text reviewed. The anatomic bite (continuous from the rectum) stays a reference text.

Across the mechanism bites, numeric lines that were not rechecked against the named chapter were removed rather than left standing. Examples include Turner coarctation percentages, a 20 mm Hg arm-leg gradient, G6PD recheck timing, compartment-pressure delta, uric-acid urine pH targets, and several drug-hour windows. The qualitative claim was kept.

## UK Kidney Association hyperkalemia source

Confirmed. The document exists.

Exact title: UKKA Clinical Practice Guideline – Management of Hyperkalaemia in Adults. Updated July 2026.

URL: https://www.ukkidney.org/wp-content/uploads/drupal-archive/documents/FINAL%20VERSION%20-%20UKKA%20CLINICAL%20PRACTICE%20GUIDELINE%20-%20MANAGEMENT%20OF%20HYPERKALAEMIA%20IN%20ADULTS%20-%20UPDATED%20JULY%202026_0.pdf

The society's current guideline page, https://guidelines.ukkidney.org/hyperkalaemia/, is marked updated July 2026. The calcium and insulin doses in `usmle-qb-s3-085` are the hospital recommendations in that PDF. The 2020 edition was not used.

## Finish pass

Management bites that were still on a reference text were moved when a PubMed record stated the claim.

- DIC treatment (`usmle-qb-s2-012`, `usmle-qb-s3-011`): ISTH 2013 harmonized guidance, PMID 23379279. Treat the cause. Transfuse platelets or plasma for bleeding, not for a number. The cryoprecipitate-as-fibrinogen-order line was removed. It is not in that guidance.
- Guillain-Barré (`usmle-qb-s1-032`, `usmle-qb-s2-023`, `usmle-qb-s3-024`): EAN/PNS 2023, PMID 37814552. IVIg 0.4 g/kg for 5 days, or plasma exchange 12–15 L. Oral corticosteroids are recommended against. Ventilation risk uses mEGRIS, not a vital-capacity cutoff.
- Migraine overuse (`usmle-qb-s2-036`, `usmle-qb-s3-030`): ICHD-3, PMID 29368949. Triptans, ergots, opioids, and combination analgesics at 10 or more days a month; simple analgesics at 15 or more. The AHS 2021 consensus (PMID 34160823) is the treatment-integration statement. It was not used for the day counts, and the coronary-disease contraindication was not in the text checked, so that claim was removed.
- Pheochromocytoma (`usmle-qb-s1-120`, `usmle-qb-s2-124`, `usmle-qb-s3-112`): Endocrine Society 2014, PMID 24893135. Preoperative blockade, plus a high-sodium diet and fluids. The alpha-before-beta sentence was not in the abstract, so it was removed.
- Infant salt-wasting crisis (`usmle-qb-s2-002`, `usmle-qb-s3-004`): Endocrine Society CAH guideline 2018, PMID 30272171. Sodium and potassium cutoffs were removed because they were not in the text checked.
- Carbon monoxide (`usmle-qb-s2-139`, `usmle-qb-s3-130`): ACEP 2017 clinical policy, PMID 27993310. The affinity number stays off these management bites.
- Acetaminophen (`usmle-qb-s2-140`, `usmle-qb-s3-131`): 2023 US/Canada consensus, PMID 37552484, which uses a revised Rumack-Matthew nomogram. Acute ingestion for that nomogram is a presentation from 4 to 24 hours.
- Naloxone (`usmle-qb-s1-145`, `usmle-qb-s2-141`, `usmle-qb-s3-132`): 2023 AHA poisoning update, PMID 37721023. Adults: 0.2–2 mg IV/IO/IM or 2–4 mg intranasal, every 2–3 minutes. A 30–90 minute duration was removed.
- Gestational diabetes (`usmle-qb-s2-131`, `usmle-qb-s3-119`): ACOG Practice Bulletin 190, PMID 29370047. Diagnostic cutoffs are not restated. The PubMed text of the bulletin does not print them.
- H. pylori (`usmle-qb-s3-108`): ACG 2024, PMID 39626064. Bismuth quadruple therapy for 14 days when susceptibility is unknown, and a universal test of cure.
- Necrotizing fasciitis (`usmle-qb-s1-056`, `usmle-qb-s2-055`, `usmle-qb-s3-047`): IDSA 2014 skin and soft tissue guideline, PMID 24973422. Prompt treatment. A drug list was not added.
- Pelvic inflammatory disease (`usmle-qb-s2-136`, `usmle-qb-s3-124`): CDC STI Treatment Guidelines 2021, PMID 34292926.

## Third pass

US sources were preferred. Where the US document does not state the management step, the guideline that does is cited and the US document is named beside it.

- Hyponatremia (`usmle-qb-s2-085`, `usmle-qb-s3-078`): US regimen is 100 mL of 3% saline over 10 minutes, up to three times (Verbalis 2013, PMID 24074529). European regimen is 150 mL over 20 minutes, repeated up to twice. First-hour target is a 4 to 6 mmol/L rise. The miss is a 24-hour rise over 10 mmol/L.
- HIT diagram: platelets fall at least 50% on days 5 to 10, with or without thrombosis.
- Sensitivity (`usmle-qb-s1-160`): false positives come from imperfect specificity and are amplified by low prevalence.
- Subdural hematoma (`usmle-qb-s3-039`): reverse anticoagulation for any anticoagulant-associated subdural hematoma. NCS/SCCM 2016, PMID 27858808.
- Giant-cell arteritis: prednisone about 1 mg/kg up to 80 mg for every suspected case, intravenous pulse if vision is threatened. Biopsy as soon as possible, ideally within 2 weeks, and a later biopsy may still be informative.
- Adrenal crisis: hydrocortisone 100 mg IV, then 200 mg over 24 hours. Endocrine Society 2016 recommendation 4.1.
- Thyroid storm: propylthiouracil, iodide at least 1 hour later, no aspirin, Burch-Wartofsky score of 45 or more. The lead, the lines, and the diagram match.
- DIC bleeding (`usmle-qb-s3-011`): cryoprecipitate when fibrinogen is under 1.5 g/L and the patient is bleeding. BSH major-haemorrhage guideline, PMID 26147359.
- Hyperkalemia (`usmle-qb-s3-085`): calcium gluconate 1 g IV, insulin with dextrose, albuterol, sodium zirconium cyclosilicate or patiromer, or dialysis. Calcium resonium was removed. Source is the KDIGO emergency-department summary, PMID 32852924.
- Naloxone: 2025 AHA Part 10, PMID 41122889, with intravenous 0.2 to 2 mg from the AHA poisoning guidance and 4 mg for the FDA-labeled nasal spray. Flumazenil cites the 2023 AHA poisoning update, PMID 37721023.
- COPD spirometry and long-term oxygen follow GOLD 2026. Pancreatitis cites ACG 2024, PMID 38857482.
- Acetaminophen: 150 micrograms/mL at 4 hours, acetylcysteine within 8 hours. Epidural hematoma over 30 mL is evacuated (Brain Trauma Foundation surgical guideline, PMID 16710967).
- DiGeorge is named as the 22q11.2 deletion. The duplicate depression bite `usmle-qb-s2-154` is now osteoporosis screening at age 65 (USPSTF).
- StatPearls "says" lines that copied the lead were replaced with a different sentence from the chapter's teaching.
- Repeated lines were replaced or dropped. Management bites named in the review were moved to the PubMed record given for that topic. Ethics bites that matched an AMA opinion now cite that opinion.

## Management bites still on a reference text

Kept on StatPearls on purpose, because no single current society guideline states the order:

- Parkinson medication timing (`usmle-qb-s3-026` and the Step 1 mechanism bite).
- Serotonin syndrome (`usmle-qb-s1-038`, `usmle-qb-s2-029`, `usmle-qb-s3-034`).
- Neuroleptic malignant syndrome (`usmle-qb-s1-037`, `usmle-qb-s2-028`, `usmle-qb-s3-035`).
- The intravenous potassium rate (`usmle-qb-s1-086`, `usmle-qb-s2-096`, `usmle-qb-s3-086`).

Also still on a reference text, because a recommendation sentence was not locked to a guideline in this pass: Klinefelter testosterone replacement, hemolytic transfusion reaction, tardive dyskinesia, psoriatic arthritis treatment, reactive arthritis, adult polycystic kidney disease, tamponade drainage, tet spell, dilated-cardiomyopathy alcohol cessation, restrictive cardiomyopathy and light chains, diabetes insipidus water replacement, respiratory acidosis ventilation, hypernatremia replacement rate, phosphate-binder timing, and a few ethics bites whose titles did not match an AMA opinion (futility, against-advice discharge). Mechanism bites with no society guideline remain on the named chapter.
