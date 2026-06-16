/**
 * Curated PANCE-style items — physician-educator batch 01 (clinical vignette tone).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-01";
const PE = ["physician-educator", BATCH, "pance"];

const ACCAHA = { label: "ACC/AHA Chest Pain Guideline", url: "https://www.acc.org" };
const IDSA = { label: "IDSA CAP Guideline", url: "https://www.idsociety.org" };
const ADA = { label: "ADA Standards of Care", url: "https://diabetesjournals.org/care" };
const AAN = { label: "AAN Stroke Guideline", url: "https://www.aan.com" };
const ACOG = { label: "ACOG Hypertension in Pregnancy", url: "https://www.acog.org" };

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_01: EnrichedBankItem[] = [
  panceVignette(
    "cardiovascular",
    `A 58-year-old man with hypertension and type 2 diabetes presents with 45 minutes of substernal pressure radiating to the left arm. He is diaphoretic. BP 148/92 mm Hg, HR 96/min, SpO₂ 97% on room air. ECG shows 2 mm ST elevation in leads V2–V4.`,
    "Which is the most appropriate immediate management?",
    [
      "Administer sublingual nitroglycerin and observe in the ED",
      "Activate the cath lab for primary PCI",
      "Order a troponin and repeat ECG in 6 hours",
      "Start heparin infusion and schedule stress test tomorrow",
    ],
    "Activate the cath lab for primary PCI",
    `Anterior STEMI with ongoing symptoms requires emergent reperfusion — primary PCI when available within guideline time frames. Nitroglycerin alone does not reperfuse occluded coronary arteries. Delaying reperfusion increases infarct size and mortality.`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "intervention",
      blueprintTopic: "ACS",
      difficulty: 4,
      references: [ACCAHA],
      tags: ["ACS", "STEMI", ...PE],
      related: {
        reviewModuleSlug: "acute-coronary-syndrome",
        keyTakeaway: "STEMI → emergent reperfusion (PCI preferred when timely).",
      },
    }
  ),

  panceVignette(
    "infectious-diseases",
    `A 72-year-old nursing home resident with COPD presents with fever, productive cough, and confusion. Temp 38.9°C, RR 28/min, BP 92/58 mm Hg, SpO₂ 88% on room air. Chest X-ray shows right lower lobe infiltrate.`,
    "Which empiric antibiotic regimen is most appropriate?",
    [
      "Azithromycin monotherapy",
      "Ceftriaxone plus azithromycin",
      "Amoxicillin-clavulanate monotherapy",
      "Vancomycin monotherapy",
    ],
    "Ceftriaxone plus azithromycin",
    `This patient has severe CAP with hypotension and hypoxemia requiring hospitalization. IDSA/ATS severe CAP regimens include a beta-lactam plus macrolide (or respiratory fluoroquinolone). Azithromycin alone is insufficient for severe disease. Vancomycin is not first-line for uncomplicated CAP without MRSA risk.`,
    {
      blueprintSystem: "infectious-diseases",
      difficulty: 4,
      references: [IDSA],
      tags: ["CAP", "sepsis", ...PE],
      related: {
        reviewModuleSlug: "infectious-disease",
        keyTakeaway: "Severe CAP: beta-lactam + macrolide (or respiratory FQ).",
      },
    }
  ),

  panceVignette(
    "endocrine",
    `A 24-year-old woman with type 1 diabetes presents with nausea, vomiting, and abdominal pain for 12 hours. She stopped taking insulin yesterday. BP 102/64 mm Hg, HR 118/min, RR 28/min (Kussmaul). Glucose 412 mg/dL, pH 7.18, bicarbonate 8 mEq/L, potassium 5.8 mEq/L.`,
    "What is the most appropriate next step in management?",
    [
      "Start regular insulin infusion immediately",
      "Administer IV fluids and potassium replacement before insulin",
      "Administer sodium bicarbonate bolus",
      "Obtain CT abdomen before any treatment",
    ],
    "Administer IV fluids and potassium replacement before insulin",
    `DKA requires aggressive IV fluids first. Despite serum K+ appearing high, total body potassium is depleted and insulin drives K+ intracellularly — replete K+ to ≥3.3 mEq/L before insulin unless hyperkalemia with ECG changes. Bicarbonate is reserved for severe acidosis with hemodynamic compromise. Imaging is not the priority.`,
    {
      blueprintSystem: "endocrine",
      difficulty: 4,
      references: [ADA],
      tags: ["DKA", ...PE],
      related: {
        keyTakeaway: "DKA: fluids first; ensure K+ ≥3.3 before insulin.",
      },
    }
  ),

  panceVignette(
    "neurologic",
    `A 67-year-old woman with atrial fibrillation (not anticoagulated) develops sudden right-sided weakness and aphasia. Last known well 90 minutes ago. BP 168/92 mm Hg, glucose 118 mg/dL, NIHSS 14. CT head shows no hemorrhage.`,
    "Which management is most appropriate?",
    [
      "Start aspirin 325 mg and admit to stroke unit",
      "Administer IV alteplase if no contraindications",
      "Begin heparin drip immediately",
      "Obtain MRI before any treatment",
    ],
    "Administer IV alteplase if no contraindications",
    `Acute ischemic stroke within the tPA window without hemorrhage on CT warrants thrombolysis when eligible. Aspirin alone misses reperfusion opportunity. Immediate anticoagulation is not indicated in acute stroke. Non-contrast CT excludes hemorrhage — MRI should not delay treatment.`,
    {
      blueprintSystem: "neurologic",
      difficulty: 5,
      references: [AAN],
      tags: ["stroke", "tPA", ...PE],
      related: {
        keyTakeaway: "Acute ischemic stroke within window: tPA if eligible after excluding hemorrhage.",
      },
    }
  ),

  panceVignette(
    "reproductive",
    `A 32-year-old G2P1 at 34 weeks gestation presents with BP 158/104 mm Hg on two readings 4 hours apart, 2+ proteinuria on dipstick, and a persistent headache. Reflexes are brisk. AST 28 U/L, ALT 32 U/L, platelets 198 × 10³/µL.`,
    "What is the most appropriate management?",
    [
      "Expectant management with weekly BP checks",
      "Start magnesium sulfate and plan delivery",
      "Prescribe lisinopril for blood pressure control",
      "Discharge with home BP monitoring",
    ],
    "Start magnesium sulfate and plan delivery",
    `Preeclampsia with severe features (BP ≥160/110, symptoms) at ≥34 weeks warrants magnesium for seizure prophylaxis and delivery planning. ACE inhibitors are contraindicated in pregnancy. Outpatient management is unsafe with severe features.`,
    {
      blueprintSystem: "reproductive",
      taskCategory: "intervention",
      blueprintTopic: "pregnancy complications",
      difficulty: 4,
      references: [ACOG],
      tags: ["preeclampsia", ...PE],
      related: {
        keyTakeaway: "Severe preeclampsia ≥34 weeks: magnesium + delivery.",
      },
    }
  ),
];
