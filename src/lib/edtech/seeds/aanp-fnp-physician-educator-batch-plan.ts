/**
 * Curated AANP FNP Plan domain items — physician-educator batch 01.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { aanpFnpVignette } from "@/lib/exam-prep/aanp-fnp-seed-factory";

const BATCH = "physician-educator-batch-plan";
const PE = ["physician-educator", BATCH, "aanp-fnp-seed"];

const ADA = { label: "ADA Standards of Care", url: "https://diabetesjournals.org/care" };
const GOLD = { label: "GOLD COPD Guidelines", url: "https://goldcopd.org" };

export const AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_PLAN: EnrichedBankItem[] = [
  aanpFnpVignette(
    "plan",
    `A 54-year-old man with type 2 diabetes has A1c 8.9% on metformin 1000 mg BID. BMI 34. eGFR 72 mL/min. No cardiovascular disease. He adheres to diet and medication.`,
    "What is the most appropriate addition to his regimen?",
    [
      "Add a GLP-1 receptor agonist",
      "Start basal insulin immediately",
      "Discontinue metformin and start sulfonylurea",
      "No change — recheck in 12 months",
    ],
    "Add a GLP-1 receptor agonist",
    `Per ADA, when A1c is above goal on metformin with obesity, add GLP-1 RA or SGLT2i for glycemic and weight benefit. Insulin is not first add-on unless symptomatic hyperglycemia. Sulfonylurea causes weight gain. Ignoring A1c 8.9% is inappropriate.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "endocrine",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "diabetes management",
      difficulty: 4,
      references: [ADA],
      tags: ["diabetes", "GLP-1", ...PE],
      related: {
        reviewModuleSlug: "insulin-diabetes-management",
        memoryCardIds: ["fnp-diabetes-intensification", "fnp-sglt2-benefits"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 68-year-old man with COPD (FEV1 45% predicted) on tiotropium has increased dyspnea and 2 exacerbations this year. He continues to smoke. SpO₂ 92% at rest.`,
    "What is the most appropriate next step in management?",
    [
      "Add LABA/LAMA combination inhaler and smoking cessation counseling",
      "Oral prednisone daily maintenance",
      "Home oxygen without medication change",
      "Antibiotic prophylaxis only",
    ],
    "Add LABA/LAMA combination inhaler and smoking cessation counseling",
    `GOLD group D COPD with frequent exacerbations: escalate to LABA/LAMA (± ICS if eosinophilic). Smoking cessation is essential. Daily prednisone is not maintenance therapy. Oxygen if qualifying by ABG/resting sat criteria but does not replace bronchodilator optimization.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "pulmonary",
      patientAgeGroup: "older-adult",
      blueprintTopic: "COPD",
      difficulty: 4,
      references: [GOLD],
      tags: ["COPD", ...PE],
      related: {
        reviewModuleSlug: "aanp-plan-domain",
        memoryCardIds: ["fnp-plan-copd-exacerbation"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 28-year-old woman requests combined oral contraceptives. She has migraine with aura occurring twice monthly. BP 118/76 mm Hg. Non-smoker.`,
    "What is the most appropriate contraceptive plan?",
    [
      "Progestin-only pill or IUD — avoid estrogen due to migraine with aura",
      "Combined OCP low dose",
      "Combined transdermal patch",
      "No contraception needed",
    ],
    "Progestin-only pill or IUD — avoid estrogen due to migraine with aura",
    `Migraine with aura is an absolute contraindication to estrogen-containing contraception due to stroke risk. Progestin-only methods (POP, IUD, implant) or non-hormonal options are appropriate.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "womens-health",
      patientAgeGroup: "young-adult",
      blueprintTopic: "contraception",
      difficulty: 3,
      tags: ["contraception", ...PE],
      related: {
        reviewModuleSlug: "aanp-plan-domain",
        memoryCardIds: ["fnp-plan-contraception"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 7-year-old boy with ADHD has poor school performance despite behavioral therapy for 6 months. Weight and height track normally. BP normal. No tics or cardiac history.`,
    "What is the most appropriate pharmacotherapy?",
    [
      "Methylphenidate",
      "Fluoxetine",
      "Aripiprazole",
      "Diazepam",
    ],
    "Methylphenidate",
    `Stimulants (methylphenidate or amphetamines) are first-line for ADHD when behavioral therapy insufficient. SSRIs treat depression/anxiety, not first-line ADHD. Antipsychotics and benzodiazepines are not ADHD treatments.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "child",
      blueprintTopic: "ADHD",
      difficulty: 3,
      tags: ["ADHD", "pediatrics", ...PE],
      related: {
        reviewModuleSlug: "aanp-plan-domain",
        memoryCardIds: ["fnp-plan-referral-triggers"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 75-year-old woman with permanent atrial fibrillation (CHADS2-VASc 4), hypertension, and stage 3 CKD (eGFR 38) needs anticoagulation. She takes amlodipine and has no history of GI bleeding. No active bleeding today. BP 132/78 mm Hg. Weight 62 kg.`,
    "What is the most appropriate anticoagulant?",
    [
      "Apixaban 5 mg BID",
      "Warfarin with INR 3.0–4.0",
      "Aspirin 325 mg daily",
      "No anticoagulation due to CKD",
    ],
    "Apixaban 5 mg BID",
    `DOACs (apixaban) are preferred over warfarin for non-valvular AF in appropriate CKD (apixaban can be used down to eGFR 25 with dose adjustment if ≥2 criteria). Aspirin alone is insufficient for stroke prevention. Withholding anticoagulation with CHADS2-VASc 4 increases stroke risk.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "older-adult",
      blueprintTopic: "atrial fibrillation",
      difficulty: 4,
      tags: ["AFib", "anticoagulation", ...PE],
      related: {
        reviewModuleSlug: "acute-coronary-syndrome",
        memoryCardIds: ["fnp-atrial-fib-rate-control"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 42-year-old man with major depressive disorder (first episode) has PHQ-9 of 16. No bipolar history, no psychosis. He prefers medication over therapy.`,
    "What is the most appropriate initial pharmacotherapy?",
    [
      "Sertraline",
      "Lithium",
      "Haloperidol",
      "Alprazolam",
    ],
    "Sertraline",
    `SSRIs (sertraline) are first-line for moderate MDD. Lithium is for bipolar disorder. Antipsychotics are not first-line monotherapy for uncomplicated MDD. Benzodiazepines do not treat depression.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "psychiatry-behavioral",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "depression treatment",
      difficulty: 3,
      tags: ["SSRI", "depression", ...PE],
      related: {
        reviewModuleSlug: "aanp-plan-domain",
        memoryCardIds: ["fnp-depression-screening"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 65-year-old woman with uncomplicated cystitis (positive UA, no fever, no flank pain) has no drug allergies. eGFR 55 mL/min.`,
    "What is the most appropriate antibiotic regimen?",
    [
      "Nitrofurantoin 100 mg BID × 5 days",
      "Ciprofloxacin 500 mg BID × 7 days",
      "IV ceftriaxone",
      "Observation without antibiotics",
    ],
    "Nitrofurantoin 100 mg BID × 5 days",
    `Uncomplicated cystitis: nitrofurantoin or TMP-SMX (if local resistance low) are first-line. Fluoroquinolones are reserved for complicated cases due to resistance and side effects. IV therapy is for pyelonephritis/sepsis. Symptomatic UTI requires treatment.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "infectious-disease",
      patientAgeGroup: "older-adult",
      blueprintTopic: "UTI treatment",
      difficulty: 3,
      tags: ["UTI", "antibiotics", ...PE],
      related: {
        reviewModuleSlug: "infectious-disease",
        memoryCardIds: ["fnp-uti-pyelonephritis", "fnp-plan-antibiotic-duration"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 58-year-old man with new hypertension (BP 148/92 on 3 readings) has no diabetes, CKD, or CVD. BMI 28. He exercises 3× weekly and limits sodium.`,
    "What is the most appropriate initial pharmacotherapy?",
    [
      "Lisinopril",
      "Metoprolol",
      "Clonidine",
      "Hydralazine",
    ],
    "Lisinopril",
    `First-line antihypertensives per ACC/AHA: thiazide, ACEi/ARB, or CCB for uncomplicated HTN. ACEi (lisinopril) is appropriate. Beta-blockers are not first-line unless compelling indication (CAD, HFrEF). Clonidine and hydralazine are not initial choices.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "hypertension",
      difficulty: 3,
      tags: ["HTN", ...PE],
      related: {
        reviewModuleSlug: "aanp-plan-domain",
        memoryCardIds: ["fnp-hypertension-first-line"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `A 19-year-old college student with no chronic medical conditions presents after a sexual assault 72 hours ago. She takes oral contraceptives and has no drug allergies. She is not pregnant and has no injuries requiring surgery. Hep B vaccinated. HIV status unknown.`,
    "What is the most appropriate post-exposure management?",
    [
      "Offer HIV PEP, emergency contraception if applicable, STI prophylaxis, and counseling referral",
      "HIV testing only — PEP window closed",
      "No intervention needed",
      "Mandatory law enforcement report before care",
    ],
    "Offer HIV PEP, emergency contraception if applicable, STI prophylaxis, and counseling referral",
    `HIV PEP is effective up to 72 hours (some guidelines 96 hours) post-exposure. STI prophylaxis (ceftriaxone + azithromycin/doxy), emergency contraception, trauma-informed care, and counseling are standard. Care should not be delayed for reporting; reporting laws vary by state.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "womens-health",
      patientAgeGroup: "young-adult",
      blueprintTopic: "sexual assault care",
      difficulty: 4,
      tags: ["PEP", "trauma", ...PE],
      related: {
        reviewModuleSlug: "aanp-plan-domain",
        memoryCardIds: ["fnp-hiv-prep-basics", "fnp-plan-referral-triggers"],
      },
    }
  ),

  aanpFnpVignette(
    "plan",
    `An 85-year-old man with advanced Alzheimer disease (FAST 7a) and a history of aspiration pneumonia has had two episodes in the past 3 months. He takes donepezil and has an advance directive declining intubation and tube feeding. Family asks about goals of care after the most recent episode.`,
    "What is the most appropriate plan?",
    [
      "Discuss comfort-focused care, oral care, and hospice referral",
      "Insert PEG tube to prevent aspiration",
      "Transfer to ICU for intubation",
      "Routine antibiotics indefinitely after each episode",
    ],
    "Discuss comfort-focused care, oral care, and hospice referral",
    `Advanced dementia with recurrent aspiration and documented preferences against aggressive interventions warrants goals-of-care discussion, comfort measures, oral hygiene, and hospice when appropriate. PEG does not reduce aspiration pneumonia and violates stated preferences.`,
    {
      blueprintDomain: "plan",
      clinicalSystem: "geriatrics",
      patientAgeGroup: "older-adult",
      blueprintTopic: "advance care planning",
      difficulty: 4,
      tags: ["hospice", "dementia", ...PE],
      related: {
        reviewModuleSlug: "aanp-geriatrics-high-yield",
        memoryCardIds: ["fnp-advance-directives", "fnp-plan-referral-triggers"],
      },
    }
  ),
];
