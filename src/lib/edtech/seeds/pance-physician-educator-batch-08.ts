/** PANCE renal, dermatologic, GU, EENT, professional — physician-educator batch 08. */
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-08";
const PE = ["physician-educator", BATCH, "pance", "pance-seed", "PANCE-2025"];

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_08 = [
  panceVignette(
    "renal",
    `A 72-year-old man with CKD stage 4 (baseline creatinine 2.8 mg/dL) is started on lisinopril and develops oliguria. Creatinine rises to 5.1 mg/dL, K 6.1 mEq/L. BP 102/64 mm Hg, HR 92/min.`,
    "What is the most appropriate next step?",
    [
      "Hold ACE inhibitor and evaluate for prerenal vs intrinsic cause",
      "Increase lisinopril dose",
      "Immediate dialysis",
      "Add spironolactone",
    ],
    "Hold ACE inhibitor and evaluate for prerenal vs intrinsic cause",
    `Acute rise in creatinine after ACEi in advanced CKD may reflect hemodynamic AKI — hold offending agent and assess volume status. Increasing ACEi or adding MRA worsens hyperkalemia and renal function. Dialysis is not automatic without refractory complications.`,
    {
      blueprintSystem: "renal",
      taskCategory: "intervention",
      blueprintTopic: "AKI",
      difficulty: 4,
      tags: ["AKI", "CKD", ...PE],
    }
  ),
  panceVignette(
    "renal",
    `A 35-year-old man presents with flank pain and hematuria. BP 128/76 mm Hg, HR 88/min. CT shows a 6-mm ureteral stone at the UVJ without hydronephrosis. Pain is controlled with NSAIDs. He can tolerate oral intake.`,
    "What is the most appropriate management?",
    [
      "Medical expulsive therapy with tamsulosin and hydration",
      "Immediate urologic intervention",
      "Prophylactic antibiotics for 2 weeks",
      "Restrict fluids to prevent stone growth",
    ],
    "Medical expulsive therapy with tamsulosin and hydration",
    `Distal ureteral stone ≤10 mm with controlled pain and no infection/obstruction can be managed conservatively with alpha-blocker and hydration. Immediate intervention is for infected obstruction, intractable pain, or renal failure.`,
    {
      blueprintSystem: "genitourinary",
      taskCategory: "intervention",
      blueprintTopic: "nephrolithiasis",
      difficulty: 3,
      tags: ["kidney-stone", ...PE],
    }
  ),
  panceVignette(
    "dermatologic",
    `A 40-year-old man with diabetes has an expanding area of erythema on the lower leg with warmth and tenderness. Temp 38.3°C, WBC 13.8 × 10³/µL, glucose 198 mg/dL. No crepitus.`,
    "What is the most appropriate empiric antibiotic?",
    [
      "Cephalexin or dicloxacillin for nonpurulent cellulitis",
      "Vancomycin monotherapy for all cellulitis",
      "Metronidazole alone",
      "Topical mupirocin only",
    ],
    "Cephalexin or dicloxacillin for nonpurulent cellulitis",
    `Uncomplicated nonpurulent cellulitis in an outpatient without MRSA risk factors is treated with beta-lactam targeting streptococci/staph. Vancomycin is for purulent/MRSA concern or failure of first-line. Topical therapy alone is insufficient for cellulitis.`,
    {
      blueprintSystem: "dermatologic",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "cellulitis",
      difficulty: 3,
      tags: ["cellulitis", ...PE],
    }
  ),
  panceVignette(
    "dermatologic",
    `A 55-year-old fair-skinned man has a 7 mm asymmetric pigmented lesion with irregular borders and color variation on the upper back. BP 124/78 mm Hg. Diameter increased over 6 months.`,
    "What is the most appropriate next step?",
    [
      "Excisional biopsy",
      "Topical hydrocortisone for 4 weeks",
      "Cryotherapy without biopsy",
      "Reassurance and sunscreen only",
    ],
    "Excisional biopsy",
    `ABCDE criteria concerning for melanoma require biopsy — excisional preferred when feasible. Topical steroids or cryotherapy without histology risks missing melanoma.`,
    {
      blueprintSystem: "dermatologic",
      taskCategory: "intervention",
      blueprintTopic: "melanoma screening",
      difficulty: 3,
      tags: ["melanoma", ...PE],
    }
  ),
  panceVignette(
    "genitourinary",
    `A 68-year-old man presents with inability to urinate for 12 hours, suprapubic discomfort, and a distended bladder on exam. BP 142/88 mm Hg, HR 96/min. He takes anticholinergics for BPH symptoms. Creatinine 1.4 mg/dL.`,
    "What is the most appropriate immediate management?",
    [
      "Urethral catheterization",
      "Oral tamsulosin only and discharge",
      "CT abdomen before any intervention",
      "5-alpha reductase inhibitor loading dose",
    ],
    "Urethral catheterization",
    `Acute urinary retention requires immediate bladder decompression with catheterization. Alpha-blockers treat chronic BPH but do not relieve acute retention. CT delays necessary drainage.`,
    {
      blueprintSystem: "genitourinary",
      taskCategory: "intervention",
      blueprintTopic: "BPH",
      difficulty: 3,
      tags: ["urinary-retention", ...PE],
    }
  ),
  panceVignette(
    "genitourinary",
    `A 22-year-old sexually active woman has dysuria and frequency for 2 days. Temp 37.8°C. No fever, flank pain, or vaginal discharge. UA shows nitrites and leukocyte esterase.`,
    "What is the most appropriate treatment?",
    [
      "Nitrofurantoin or trimethoprim-sulfamethoxazole for 5–7 days",
      "IV ceftriaxone",
      "Fluoroquinolone for 14 days as first-line",
      "Observation without antibiotics",
    ],
    "Nitrofurantoin or trimethoprim-sulfamethoxazole for 5–7 days",
    `Uncomplicated cystitis in a nonpregnant woman is treated with short-course nitrofurantoin or TMP-SMX per IDSA — not fluoroquinolones first-line. IV therapy is for pyelonephritis or systemic illness.`,
    {
      blueprintSystem: "genitourinary",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "UTI",
      difficulty: 2,
      tags: ["UTI", ...PE],
    }
  ),
  panceVignette(
    "eent",
    `A 3-year-old boy has 2 days of ear pain and fever. Temp 38.8°C, HR 110/min. Tympanic membrane is bulging with impaired mobility on pneumatic otoscopy.`,
    "What is the most appropriate treatment?",
    [
      "Amoxicillin or amoxicillin-clavulanate",
      "Azithromycin for all otitis media",
      "Topical antibiotic drops only",
      "Decongestants and observation only",
    ],
    "Amoxicillin or amoxicillin-clavulanate",
    `Acute otitis media with bulging TM in a child <2 or with severe symptoms warrants antibiotics — amoxicillin first-line. Topical drops alone treat otitis externa. Observation is for select mild cases in older children.`,
    {
      blueprintSystem: "eent",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "otitis",
      difficulty: 3,
      tags: ["otitis-media", "pediatric", ...PE],
    }
  ),
  panceVignette(
    "eent",
    `A 60-year-old contact lens wearer presents with severe eye pain, photophobia, and decreased vision in one eye. BP 130/82 mm Hg, HR 88/min. Exam shows a corneal infiltrate with hypopyon.`,
    "What is the most appropriate management?",
    [
      "Emergent ophthalmology referral and topical fortified antibiotics",
      "Warm compresses and oral antihistamine",
      "Topical steroid drops alone",
      "Patch eye and follow up in 1 week",
    ],
    "Emergent ophthalmology referral and topical fortified antibiotics",
    `Contact lens keratitis with infiltrate and hypopyon is a vision-threatening corneal ulcer — urgent ophthalmology and fortified topical antibiotics. Steroids alone risk perforation. Delayed follow-up is unsafe.`,
    {
      blueprintSystem: "eent",
      taskCategory: "intervention",
      blueprintTopic: "red eye",
      difficulty: 5,
      tags: ["keratitis", ...PE],
    }
  ),
  panceVignette(
    "professional-practice",
    `A PA student observes a supervising physician documenting a procedure they did not perform. The student is concerned about fraudulent billing and patient safety.`,
    "What is the most appropriate action?",
    [
      "Report concerns through appropriate institutional compliance channels",
      "Ignore it because the physician is responsible",
      "Document the procedure themselves to match the chart",
      "Discuss only with classmates on social media",
    ],
    "Report concerns through appropriate institutional compliance channels",
    `Suspected fraud or falsification must be reported through proper compliance/ethics channels — not ignored, duplicated, or discussed publicly. Professional practice items test ethics, scope, and patient safety obligations.`,
    {
      blueprintSystem: "professional-practice",
      taskCategory: "professional",
      blueprintTopic: "ethics",
      difficulty: 3,
      tags: ["ethics", "compliance", ...PE],
    }
  ),
  panceVignette(
    "professional-practice",
    `A 45-year-old competent patient refuses a life-saving blood transfusion for religious reasons after a motor vehicle collision with Hgb 5.2 g/dL. He understands the risk of death.`,
    "What is the most appropriate action?",
    [
      "Respect the informed refusal and optimize non-blood alternatives",
      "Transfuse over objection because it is life-saving",
      "Obtain a court order for transfusion in all cases",
      "Sedate the patient and transfuse",
    ],
    "Respect the informed refusal and optimize non-blood alternatives",
    `A capacitated adult may refuse transfusion after informed consent — document discussion and use bloodless strategies if available. Overriding refusal requires loss of capacity or emergent exception per state law, not routine transfusion.`,
    {
      blueprintSystem: "professional-practice",
      taskCategory: "professional",
      blueprintTopic: "informed consent",
      difficulty: 4,
      tags: ["consent", ...PE],
    }
  ),
  panceVignette(
    "renal",
    `A 58-year-old woman on chemotherapy has nausea and muscle cramps. BMP: Na 128 mEq/L, K 5.6 mEq/L, Cl 98 mEq/L, bicarbonate 18 mEq/L, BUN 32 mg/dL, creatinine 1.1 mg/dL, glucose 102 mg/dL.`,
    "What is the most likely cause of her hyponatremia?",
    [
      "SIADH from malignancy or chemotherapy",
      "Diabetic ketoacidosis",
      "Primary adrenal insufficiency only",
      "Hyperglycemic hyperosmolar state",
    ],
    "SIADH from malignancy or chemotherapy",
    `Euvolemic hyponatremia with low bicarbonate in a cancer patient suggests SIADH (or vomiting-related); DKA/HHS require hyperglycemia. Adrenal insufficiency causes hyperkalemia with hypotension.`,
    {
      blueprintSystem: "renal",
      taskCategory: "diagnosis",
      blueprintTopic: "electrolytes",
      difficulty: 4,
      tags: ["hyponatremia", ...PE],
    }
  ),
];
