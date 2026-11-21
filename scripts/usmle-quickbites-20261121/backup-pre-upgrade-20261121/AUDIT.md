# USMLE Quick Bites audit

Date: 2026-11-21. Library is hidden. Nothing is live.

Counts after audit: Step 1 180, Step 2 CK 180, Step 3 180.

## What was checked

Every bite has a lead, three or four scan lines, the usual miss, a source name, a four-digit year, an https URL, and a sentence saying what that source supports.

Leads are unique across all three Steps.

No lead is copied verbatim into a USMLE study-guide chapter or into a USMLE question seed in `src/lib/edtech/seeds`.

No lead shares half or more of its content words with a USMLE feed card front plus back (PR #476). Two Step 1 leads were rewritten for that reason. Previa no longer repeats feed card `usmle2-135` (painless third-trimester bleeding, no digital exam). The acid-base bite no longer repeats the feed's Winter formula. It now uses the urine anion gap to separate diarrhea from renal tubular acidosis.

Diagrams are used only for comparisons: acid-base, diuretics, hypoxemia, murmurs, steroid blocks, the menstrual cycle, hypersensitivity, shock, gram-positive cocci, a 2-by-2 table, the stroke window, the four heart-failure pillars, GOLD groups, and screening ages.

## What was dropped instead of forced in

Facts were left out when the only available chapter title did not match the claim. That included citing a surgical or anesthesia chapter for a general disease, citing the diagnostic-accuracy chapter for lead-time bias or number-needed-to-treat, and citing a hemolytic-transfusion chapter for transfusion-associated circulatory overload.

Acromegaly treatment was removed from Step 2 to make room for the 2026 ADA rule that heart failure, kidney disease, and atherosclerotic disease pick the glucose-lowering drug even when the A1C is at goal. The Step 1 IGF-1 bite remains.

## Citations that are current and ones that are the standing older guideline

2025–2026 sources used for management include the 2025 high blood pressure guideline, the 2025 ACS guideline, the 2026 stroke guideline, GOLD 2026, GINA 2026, ADA Standards of Care 2026, and the 2024 hyperglycemic-crisis consensus.

Older sources that are still the standing document, and are labeled with their year on the bite: IDSA/ATS pneumonia 2019, ESC pulmonary embolism 2019, IDSA bacterial meningitis 2004, ACP low-back-pain guideline 2017, USPSTF cervical screening 2018, AGS Beers Criteria 2023, CDC opioid guideline 2022, and the 2014 I-PASS handoff trial.

## Result

540 bites passed. Students cannot see them. The homepage and `/usmle` were not changed. The sidebar link is compiled only when `NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC` is on, which it is not.
