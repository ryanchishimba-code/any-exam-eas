# USMLE Quick Bites sourcing pass

The library stays hidden. Flags are unchanged. This pass checked claims against a confirmable source and rewrote or removed anything that source does not state. Design and components were not changed.

Backup before this citation check: `scripts/usmle-quickbites-20261121/backup-pre-pass9-20261121/`.
Undo: `scripts/usmle-quickbites-20261121/14-undo-pass9.sh`.

This check fetched the cited PubMed abstract, StatPearls chapter abstract, or public page and asked whether `says` is in that text and supports the lead. Leads, lines, and diagrams were not edited. Six `says` lines were replaced with a sentence from the fetched page (postmenopausal bleeding, lung-screening stop rules, medically ineffective interventions, and the duty to report abuse). 201 of 540 bites are confirmed against fetched text, including the 15 corrected in pass 8. The other 339 could not be confirmed because the fetched text does not state the tested claim, or the page did not return text. Those ids:

usmle-qb-s1-001, usmle-qb-s1-002, usmle-qb-s1-003, usmle-qb-s1-004, usmle-qb-s1-005, usmle-qb-s1-006, usmle-qb-s1-007, usmle-qb-s1-010, usmle-qb-s1-012, usmle-qb-s1-017, usmle-qb-s1-018, usmle-qb-s1-019, usmle-qb-s1-021, usmle-qb-s1-024, usmle-qb-s1-028, usmle-qb-s1-029, usmle-qb-s1-032, usmle-qb-s1-036, usmle-qb-s1-043, usmle-qb-s1-044, usmle-qb-s1-046, usmle-qb-s1-047, usmle-qb-s1-048, usmle-qb-s1-049, usmle-qb-s1-057, usmle-qb-s1-058, usmle-qb-s1-059, usmle-qb-s1-060, usmle-qb-s1-062, usmle-qb-s1-066, usmle-qb-s1-070, usmle-qb-s1-071, usmle-qb-s1-072, usmle-qb-s1-075, usmle-qb-s1-076, usmle-qb-s1-077, usmle-qb-s1-078, usmle-qb-s1-079, usmle-qb-s1-080, usmle-qb-s1-081, usmle-qb-s1-082, usmle-qb-s1-087, usmle-qb-s1-088, usmle-qb-s1-094, usmle-qb-s1-101, usmle-qb-s1-102, usmle-qb-s1-104, usmle-qb-s1-108, usmle-qb-s1-113, usmle-qb-s1-114, usmle-qb-s1-115, usmle-qb-s1-118, usmle-qb-s1-119, usmle-qb-s1-120, usmle-qb-s1-124, usmle-qb-s1-126, usmle-qb-s1-127, usmle-qb-s1-128, usmle-qb-s1-129, usmle-qb-s1-131, usmle-qb-s1-135, usmle-qb-s1-136, usmle-qb-s1-138, usmle-qb-s1-141, usmle-qb-s1-142, usmle-qb-s1-144, usmle-qb-s1-145, usmle-qb-s1-146, usmle-qb-s1-147, usmle-qb-s1-148, usmle-qb-s1-149, usmle-qb-s1-150, usmle-qb-s1-152, usmle-qb-s1-153, usmle-qb-s1-154, usmle-qb-s1-155, usmle-qb-s1-157, usmle-qb-s1-158, usmle-qb-s1-159, usmle-qb-s1-160, usmle-qb-s1-161, usmle-qb-s1-162, usmle-qb-s1-164, usmle-qb-s1-165, usmle-qb-s1-166, usmle-qb-s1-167, usmle-qb-s1-169, usmle-qb-s1-170, usmle-qb-s1-172, usmle-qb-s1-175, usmle-qb-s1-176, usmle-qb-s1-177, usmle-qb-s1-178, usmle-qb-s1-179, usmle-qb-s1-180, usmle-qb-s2-003, usmle-qb-s2-004, usmle-qb-s2-005, usmle-qb-s2-006, usmle-qb-s2-007, usmle-qb-s2-008, usmle-qb-s2-009, usmle-qb-s2-011, usmle-qb-s2-012, usmle-qb-s2-013, usmle-qb-s2-015, usmle-qb-s2-018, usmle-qb-s2-019, usmle-qb-s2-021, usmle-qb-s2-022, usmle-qb-s2-024, usmle-qb-s2-025, usmle-qb-s2-027, usmle-qb-s2-035, usmle-qb-s2-036, usmle-qb-s2-037, usmle-qb-s2-039, usmle-qb-s2-040, usmle-qb-s2-042, usmle-qb-s2-043, usmle-qb-s2-044, usmle-qb-s2-045, usmle-qb-s2-046, usmle-qb-s2-047, usmle-qb-s2-050, usmle-qb-s2-051, usmle-qb-s2-052, usmle-qb-s2-053, usmle-qb-s2-054, usmle-qb-s2-056, usmle-qb-s2-057, usmle-qb-s2-058, usmle-qb-s2-059, usmle-qb-s2-060, usmle-qb-s2-061, usmle-qb-s2-062, usmle-qb-s2-063, usmle-qb-s2-064, usmle-qb-s2-065, usmle-qb-s2-066, usmle-qb-s2-069, usmle-qb-s2-070, usmle-qb-s2-071, usmle-qb-s2-074, usmle-qb-s2-075, usmle-qb-s2-076, usmle-qb-s2-077, usmle-qb-s2-078, usmle-qb-s2-079, usmle-qb-s2-080, usmle-qb-s2-081, usmle-qb-s2-082, usmle-qb-s2-083, usmle-qb-s2-084, usmle-qb-s2-085, usmle-qb-s2-089, usmle-qb-s2-092, usmle-qb-s2-093, usmle-qb-s2-095, usmle-qb-s2-099, usmle-qb-s2-100, usmle-qb-s2-105, usmle-qb-s2-108, usmle-qb-s2-109, usmle-qb-s2-110, usmle-qb-s2-112, usmle-qb-s2-114, usmle-qb-s2-116, usmle-qb-s2-117, usmle-qb-s2-118, usmle-qb-s2-119, usmle-qb-s2-120, usmle-qb-s2-121, usmle-qb-s2-122, usmle-qb-s2-123, usmle-qb-s2-124, usmle-qb-s2-125, usmle-qb-s2-128, usmle-qb-s2-129, usmle-qb-s2-130, usmle-qb-s2-131, usmle-qb-s2-137, usmle-qb-s2-138, usmle-qb-s2-140, usmle-qb-s2-141, usmle-qb-s2-142, usmle-qb-s2-143, usmle-qb-s2-145, usmle-qb-s2-147, usmle-qb-s2-155, usmle-qb-s2-156, usmle-qb-s2-157, usmle-qb-s2-159, usmle-qb-s2-161, usmle-qb-s2-164, usmle-qb-s2-165, usmle-qb-s2-166, usmle-qb-s2-167, usmle-qb-s2-168, usmle-qb-s2-170, usmle-qb-s2-172, usmle-qb-s2-174, usmle-qb-s2-175, usmle-qb-s2-176, usmle-qb-s2-180, usmle-qb-s3-001, usmle-qb-s3-002, usmle-qb-s3-003, usmle-qb-s3-004, usmle-qb-s3-005, usmle-qb-s3-006, usmle-qb-s3-007, usmle-qb-s3-008, usmle-qb-s3-010, usmle-qb-s3-011, usmle-qb-s3-012, usmle-qb-s3-015, usmle-qb-s3-019, usmle-qb-s3-020, usmle-qb-s3-022, usmle-qb-s3-023, usmle-qb-s3-024, usmle-qb-s3-025, usmle-qb-s3-026, usmle-qb-s3-027, usmle-qb-s3-028, usmle-qb-s3-029, usmle-qb-s3-030, usmle-qb-s3-031, usmle-qb-s3-032, usmle-qb-s3-033, usmle-qb-s3-034, usmle-qb-s3-036, usmle-qb-s3-037, usmle-qb-s3-039, usmle-qb-s3-040, usmle-qb-s3-041, usmle-qb-s3-042, usmle-qb-s3-043, usmle-qb-s3-045, usmle-qb-s3-046, usmle-qb-s3-047, usmle-qb-s3-048, usmle-qb-s3-050, usmle-qb-s3-051, usmle-qb-s3-052, usmle-qb-s3-053, usmle-qb-s3-054, usmle-qb-s3-055, usmle-qb-s3-056, usmle-qb-s3-057, usmle-qb-s3-058, usmle-qb-s3-061, usmle-qb-s3-062, usmle-qb-s3-063, usmle-qb-s3-065, usmle-qb-s3-066, usmle-qb-s3-067, usmle-qb-s3-069, usmle-qb-s3-071, usmle-qb-s3-072, usmle-qb-s3-073, usmle-qb-s3-074, usmle-qb-s3-075, usmle-qb-s3-076, usmle-qb-s3-077, usmle-qb-s3-078, usmle-qb-s3-079, usmle-qb-s3-082, usmle-qb-s3-083, usmle-qb-s3-084, usmle-qb-s3-085, usmle-qb-s3-088, usmle-qb-s3-089, usmle-qb-s3-090, usmle-qb-s3-092, usmle-qb-s3-093, usmle-qb-s3-094, usmle-qb-s3-095, usmle-qb-s3-096, usmle-qb-s3-097, usmle-qb-s3-098, usmle-qb-s3-101, usmle-qb-s3-103, usmle-qb-s3-104, usmle-qb-s3-106, usmle-qb-s3-107, usmle-qb-s3-108, usmle-qb-s3-109, usmle-qb-s3-110, usmle-qb-s3-111, usmle-qb-s3-112, usmle-qb-s3-113, usmle-qb-s3-114, usmle-qb-s3-115, usmle-qb-s3-116, usmle-qb-s3-117, usmle-qb-s3-118, usmle-qb-s3-119, usmle-qb-s3-124, usmle-qb-s3-125, usmle-qb-s3-126, usmle-qb-s3-128, usmle-qb-s3-129, usmle-qb-s3-130, usmle-qb-s3-131, usmle-qb-s3-132, usmle-qb-s3-133, usmle-qb-s3-134, usmle-qb-s3-135, usmle-qb-s3-136, usmle-qb-s3-137, usmle-qb-s3-138, usmle-qb-s3-139, usmle-qb-s3-140, usmle-qb-s3-141, usmle-qb-s3-152, usmle-qb-s3-154, usmle-qb-s3-155, usmle-qb-s3-156, usmle-qb-s3-157, usmle-qb-s3-158, usmle-qb-s3-159, usmle-qb-s3-160, usmle-qb-s3-161, usmle-qb-s3-162, usmle-qb-s3-163, usmle-qb-s3-164, usmle-qb-s3-165, usmle-qb-s3-166, usmle-qb-s3-167, usmle-qb-s3-168, usmle-qb-s3-169, usmle-qb-s3-170, usmle-qb-s3-171, usmle-qb-s3-172, usmle-qb-s3-177, usmle-qb-s3-179, usmle-qb-s3-180

Backup before pass 8: `scripts/usmle-quickbites-20261121/backup-pre-pass8-20261121/`.
Undo pass 8: `scripts/usmle-quickbites-20261121/13-undo-pass8.sh`.
Pass 7 was undone with `12-undo-pass7.sh` because it rewrote leads. Pass 8 changes only the `source` field. Leads, lines, and diagrams are the pass 6 text.

The 15 citations from the fourth blind read now use a sentence the source states. Neuroleptic malignant syndrome quotes the chapter's instruction to stop the drug. Membranous nephropathy cites KDIGO 2021 (PMID 34556300): evaluate for malignancy, infection, and lupus whether or not anti-PLA2R is present. Ovarian torsion quotes the dual blood supply and the need for prompt surgery. Research consent cites AMA Opinion 7.1.2. A capable refusal cites Opinion 1.1.3. A POLST form is cited as a portable medical order. Consent through an interpreter cites 45 CFR 92.201, which forbids relying on a child except during an emergency. An impaired colleague cites Opinion 9.3.2. Hypersensitivity pneumonitis cites the 2020 diagnostic guideline's exposure history. A septic joint cites the 2006 BSR hot-swollen-joint guideline: aspirate and culture before antibiotics. A mechanical valve cites the 2020 ACC/AHA valvular guideline: a vitamin K antagonist, not a direct oral anticoagulant. Pancreatitis cites the 2024 ACG guideline (PMID 38857482). No id from this list lacked a retrieved sentence.

Backup before pass 6: `scripts/usmle-quickbites-20261121/backup-pre-pass6-20261121/`.
Undo pass 6: `scripts/usmle-quickbites-20261121/11-undo-pass6.sh`.
Backup before pass 5: `scripts/usmle-quickbites-20261121/backup-pre-pass5-20261121/`.
Undo pass 5: `scripts/usmle-quickbites-20261121/10-undo-pass5.sh`.

Pass 6 removed off-topic lines (a Cushing line on meningitis, pheochromocytoma lines on prostatic hyperplasia, a diuretic line and the calcium diagram on ascites, refusal lines on previa, BRCA and density lines on a palpable breast mass, and series/parallel lines on cutoff and predictive-value bites). The topic check now rejects those mismatches. Ethics bites that shared one generic sentence now cite a numbered AMA opinion or principle and a sentence from that page. HFpEF no longer uses an HFrEF citation sentence. Chapter-title citations and "(see Image" fragments were replaced with a sentence about the bite's claim. Step 2 and Step 3 reference-text bites fell from 118 to 90. Management that could be tied to a retrieved guideline sentence was moved (rheumatic fever, BPH, acute scrotal pain, pemphigus, nitrates with sildenafil). Other treatment sequences that had no retrieved guideline sentence were rewritten as mechanism.

Pass 5 closed the unverified StatPearls "says" lines. NCBI Bookshelf HTML for the cited NBK chapters returned an empty page from this environment, so the text checked is the PubMed abstract of that StatPearls chapter (PMID 31334949 for complement, whose NBK record had no abstract). A says line is verified when it is a sentence from that abstract and shares at least three content words with the bite. 187 StatPearls bites meet that bar. 58 do not: the abstract does not state the bite's specific claim, the says line is still a real abstract sentence, and it was not invented. Those 58 stay unverified. Marfan bites no longer state a beta blocker or an ARB, which the chapter does not name. Hypokalemia bites now use the chapter's own bands (about 3.5 mmol/L normal floor, under 2.5 mmol/L severe). Carbamazepine for trigeminal neuralgia cites the 2008 AAN/EFNS parameter (PMID 18716236). Ankylosing spondylitis cites the 2019 ACR/SAA/SPARTAN recommendations (PMID 31436036).

Backup before pass 4: `scripts/usmle-quickbites-20261121/backup-pre-pass4-20261121/`.
Undo pass 4: `scripts/usmle-quickbites-20261121/09-undo-pass4.sh`.
Backup before the third pass: `scripts/usmle-quickbites-20261121/backup-pre-third-pass-20261121/`.
Undo the third pass: `scripts/usmle-quickbites-20261121/08-undo-third-pass.sh`.
Backup before the finish pass: `scripts/usmle-quickbites-20261121/backup-pre-finish-20261121/`.
Undo the finish pass: `scripts/usmle-quickbites-20261121/07-undo-finish-sourcing.sh`.
Earlier sourcing backup: `scripts/usmle-quickbites-20261121/backup-pre-sourcing-20261121/`.

## Citations by type

Counted from the source name after this pass. "Guideline" is a society or government practice guideline. "Statement or trial" is a scientific statement, consensus parameter, or named trial. "Reference text" is StatPearls or the same kind of textbook chapter. "Ethics code" is the AMA Code of Medical Ethics.

| | Step 1 | Step 2 CK | Step 3 |
| --- | ---: | ---: | ---: |
| Guideline | 44 | 99 | 107 |
| Statement or trial | 4 | 10 | 13 |
| Ethics code | 12 | 24 | 17 |
| Reference text | 120 | 47 | 43 |

These counts are after pass 6. Reference text is StatPearls and is for mechanism. A says line is unverified when the retrieved chapter abstract does not contain it, or when the guideline record had no recommendation sentence to check. Unverified ids: usmle-qb-s1-002, usmle-qb-s1-005, usmle-qb-s1-006, usmle-qb-s1-010, usmle-qb-s1-024, usmle-qb-s1-058, usmle-qb-s1-059, usmle-qb-s1-060, usmle-qb-s1-075, usmle-qb-s1-076, usmle-qb-s1-079, usmle-qb-s1-088, usmle-qb-s1-101, usmle-qb-s1-102, usmle-qb-s1-131, usmle-qb-s1-141, usmle-qb-s1-142, usmle-qb-s1-150, usmle-qb-s1-155, usmle-qb-s1-156, usmle-qb-s1-159, usmle-qb-s1-162, usmle-qb-s1-164, usmle-qb-s1-165, usmle-qb-s1-166, usmle-qb-s2-005, usmle-qb-s2-035, usmle-qb-s2-088, usmle-qb-s2-089, usmle-qb-s2-106, usmle-qb-s2-146, usmle-qb-s3-028, usmle-qb-s3-037, usmle-qb-s3-063, usmle-qb-s3-071, usmle-qb-s3-088, usmle-qb-s3-089, usmle-qb-s3-093, usmle-qb-s3-098, usmle-qb-s3-103, usmle-qb-s3-107, usmle-qb-s3-137, usmle-qb-s3-155, usmle-qb-s3-156, usmle-qb-s3-157, usmle-qb-s3-158.

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

## Step 2 CK guideline re-sourcing (pass10)

All 180 Step 2 CK bites cite a named current source with year, link, and a quoted sentence. Management bites cite the current primary guideline; StatPearls remains only for basic science or where no guideline states the step, with the guideline listed under further reading.

- DKA (`usmle-qb-s2-121`): 2024 hyperglycemic crises consensus. Potassium is replaced before insulin when under 3.5 mmol/L; resolution is ketones under 0.6 mmol/L with pH 7.3 or more or bicarbonate 18 mmol/L or more. New diagram key `dka-k-2024`; the Step 1 and Step 3 `dka-k` diagram is unchanged.
- Osteoporosis screening (`usmle-qb-s2-154`): USPSTF 2025 wording for postmenopausal women under 65 at increased risk.
- `usmle-qb-s2-021`: lead and one line aligned with the cited guideline.

Statements the cited source does not state, left as written: s2-002, 023 (diagram), 044, 059, 062, 065, 070, 077, 085, 118, 124, 127, 128, 129, 130, 137, 138, 139, 140, 141, 143, 149, 151, 156, 165, 166, 167, 168, 170, 172, 175.

## Blind-review fixes and Step 3 re-sourcing (pass11)

- GOLD labels: `usmle-qb-s2-074`, `s2-079`, `s2-080`, `s3-073` and the `gold-eos` diagram now say GOLD 2027.
- `usmle-qb-s2-147` cites the USPSTF A and B recommendations list. `usmle-qb-s2-135` cites ACOG Committee Opinion 783.
- Meta lines removed: `s2-131`, `s2-032`, `s3-004`, `s3-008`, `s3-036`, `s3-047`, `s3-119`, `s3-124`, `s3-130`, `s3-140`, `s3-161`.
- DKA: `usmle-qb-s1-124`, `s3-109` and the shared `dka-k` diagram now follow the 2024 hyperglycemic crises consensus. Insulin waits while potassium is under 3.5 mmol/L, and insulin continues until the ketoacidosis resolves. The temporary `dka-k-2024` key is removed and `s2-121` uses `dka-k`.
- All 180 Step 3 bites now quote a named source checked against retrieved text. Management bites cite the current primary guideline where its text was retrievable. The 35 Step 3 bites still on StatPearls are basic science or have no retrievable guideline text.

Statements the cited source does not state, left as written: s2-069, s2-135; s3-001, 002, 004, 008, 011, 012, 018, 019, 020, 023, 024, 026, 030, 032, 033, 039, 040, 041, 043, 048, 054, 057, 060, 061, 062, 064, 068, 069, 070, 071, 072, 073, 078, 082, 085, 087, 097, 100, 106, 107, 112, 116, 117, 118, 121, 123, 125, 126, 129, 130, 133, 138, 141, 142, 143, 149, 153, 155, 156, 157, 160, 161, 162, 165, 168, 169, 172, 173, 175, 177, 180.

## Step 1 full-text re-sourcing and Step 3 blind-review fixes (pass12)

- 176 of 180 Step 1 bites now quote sentences checked against retrieved full text. Basic-science bites quote StatPearls (146 bites). Management bites quote the current guideline where its text was retrievable, with the earlier guideline kept as further reading when a bite moved to StatPearls for a mechanism claim.
- `usmle-qb-s1-078` cites the GOLD 2027 report. No Step 1 source is named GOLD 2026.
- Step 1 ethics bites quote the AMA Code opinion text (2.1.1, 3.2.1, 1.1.3, 2.1.3, 2.1.2, 8.10, 1.2.8, 5.5, 11.1.3, 1.1.5, 2.2.1, 11.2.2).
- `s3-126` and `s1-136`: the abstract text is replaced with ATA 2017 Recommendation 47 (a) and (b) from the full guideline. The guideline recommends propylthiouracil through 16 weeks and makes no recommendation on a later switch to methimazole. The switch in both bites is left as written and listed below.
- `s3-041`: the 48-hour timing now cites the AAOS 2021 hip fracture guideline (surgery within 24-48 hours; VTE prophylaxis). NICE CG124 is kept as further reading.
- `s3-054`: the 7-day follow-up and in-hospital start now quote the 2022 AHA/ACC/HFSA guideline recommendations.
- `s3-128`: 30 mL/kg, MAP 65 and the 1-hour antibiotic are quoted from SSC 2026. The lactate threshold of 4 mmol/L comes from the SSC 2018 hour-1 bundle, added as further reading.
- `s3-107` now cites the HaPanEU chronic pancreatitis guideline (enzymes with meals and snacks). `s3-121` now cites NICE CG97 (catheterise acute retention; alpha blocker before catheter removal).

Statements the cited source does not state, left as written: s1-001, 005, 009, 012, 017, 019, 022, 024, 026, 036, 038, 044, 050, 056, 059, 060, 061, 063, 066, 067, 073, 082, 088, 101, 107, 108, 114, 116, 117, 118, 120, 123, 136, 142, 147, 148, 149, 151, 152, 154, 155, 157, 159, 160, 161, 163, 164, 165, 166, 172, 173, 174, 175, 176, 179, 180; s3-041, 062, 107, 126, 128.

Step 3 management bites still on StatPearls because no retrievable primary-guideline text states the claim: s3-017, 018, 026, 034, 035, 043, 062, 063, 064, 070, 079, 080, 086, 089, 090, 091, 092, 093, 094, 095, 100, 110, 133, 135, 137.
