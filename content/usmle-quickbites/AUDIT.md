# USMLE Quick Bites sourcing pass

The library stays hidden. Flags are unchanged. This pass checked claims against a confirmable source and rewrote or removed anything that source does not state. Design and components were not changed.

Backup of the pre-sourcing files: `scripts/usmle-quickbites-20261121/backup-pre-sourcing-20261121/`.
Undo: `scripts/usmle-quickbites-20261121/05-undo-sourcing.sh`.

## Citations by type

Counted from the source name after this pass. "Guideline" is a society or government practice guideline. "Statement or trial" is a scientific statement, consensus parameter, or named trial. "Reference text" is StatPearls or the same kind of textbook chapter. "Ethics code" is the AMA Code of Medical Ethics.

| | Step 1 | Step 2 CK | Step 3 |
| --- | ---: | ---: | ---: |
| Guideline | 18 | 57 | 62 |
| Statement or trial | 3 | 7 | 8 |
| Ethics code | 3 | 8 | 4 |
| Reference text | 156 | 108 | 106 |

Before this pass the reference-text counts were 162, 118, and 118. Guideline counts were 13, 48, and 51.

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

## Management bites still on a reference text

These are decisions, drugs, or next steps whose primary guideline page was not confirmed in this pass, so they were not given a guessed citation. A guideline may exist.

- DIC treatment, including cryoprecipitate for fibrinogen (`usmle-qb-s2-012`, `usmle-qb-s3-011`). An ISTH document was not locked to a recommendation sentence.
- Polycythemia vera phlebotomy target, APL/ATRA, tumor lysis/rasburicase, PNH complement-inhibitor vaccination, sickle-cell acute chest and exchange transfusion.
- Migraine triptan limits and medication-overuse days (`usmle-qb-s2-036`, `usmle-qb-s3-030`). The AHS 2021 consensus (PMID 34160823) was identified and not quoted, because the overuse-day and coronary-contraindication lines were not re-read in it.
- Parkinson timing, multiple sclerosis flare, cord-compression dexamethasone dose, TIA antithrombotic plan, thunderclap pathway, brain abscess size cutoff.
- Neuroleptic malignant syndrome, serotonin syndrome, lithium level, torsades magnesium dose (`usmle-qb-s2-069`, `usmle-qb-s3-061`).
- Pheochromocytoma alpha-before-beta preparation. The Endocrine Society guideline (PMID 24893135) was identified. The alpha-before-beta sentence was not re-read, so the bites were not switched.
- Infant salt-wasting crisis (`usmle-qb-s3-004`) was not forced onto the adult primary-adrenal-insufficiency guideline.
- Guillain-Barré treatment (IVIG or plasma exchange, not steroid) remains StatPearls.
- Carbon monoxide, acetaminophen/NAC timing, naloxone duration, flumazenil, dantrolene dose, malignant hyperthermia.
- PID partner treatment, previa, abruption, gestational diabetes thresholds, torsion time window, postmenopausal bleeding biopsy, H. pylori test-of-cure, cholecystitis wall thickness.
- Compartment pressure, hip-fracture timing, septic-joint cell count, necrotizing infection.
- Several ethics and systems bites (error disclosure, DNR limits, reporting abuse, placebo, organ-donation requesting) stay on a reference text or the AMA Code where that opinion was already confirmed. They are not a disease guideline.

Mechanism bites with no society guideline remain on the named StatPearls chapter. Where the "says" line was updated, it restates the lead so the citation matches the claim and does not add a number the line no longer contains.
