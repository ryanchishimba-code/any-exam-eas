/**
 * Curated PANCE cardiovascular items — physician-educator batch 02.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-02";
const PE = ["physician-educator", BATCH, "pance", "pance-seed"];

const ACCAHA = { label: "ACC/AHA Heart Failure Guideline", url: "https://www.acc.org" };
const ACCAHA_HTN = { label: "ACC/AHA Hypertension Guideline", url: "https://www.acc.org" };

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_02: EnrichedBankItem[] = [
  panceVignette(
    "cardiovascular",
    `A 71-year-old woman with HFrEF (EF 30%) on lisinopril and carvedilol presents with 3 days of worsening dyspnea and 2-pillow orthopnea. BP 108/72 mm Hg, HR 92/min, RR 24/min, SpO₂ 91% on room air. JVD to the angle of the jaw, bibasilar crackles, and 2+ pitting edema. Weight is up 4 kg from baseline.`,
    "What is the most appropriate medication to add to her regimen?",
    [
      "Spironolactone",
      "Amlodipine",
      "Hydralazine monotherapy",
      "Diltiazem",
    ],
    "Spironolactone",
    `Guideline-directed medical therapy for HFrEF includes ACEi/ARB/ARNI, beta-blocker, and MRA when EF ≤35% without contraindications. She is already on ACEi and beta-blocker; spironolactone reduces mortality in symptomatic HFrEF. Amlodipine is not first-line for HFrEF. Non-dihydropyridine CCBs (diltiazem) are contraindicated in HFrEF. Hydralazine-isosorbide is an alternative when ACEi cannot be used, not before MRA.`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "heart failure",
      difficulty: 4,
      references: [ACCAHA],
      tags: ["heart-failure", "GDMT", ...PE],
      related: {
        reviewModuleSlug: "acute-coronary-syndrome",
        keyTakeaway: "HFrEF GDMT: ACEi/ARNI + beta-blocker + MRA when EF ≤35%.",
      },
    }
  ),

  panceVignette(
    "cardiovascular",
    `A 45-year-old man with no medical history presents with palpitations for 6 hours. BP 118/76 mm Hg, HR 168/min and irregularly irregular. ECG shows narrow-complex tachycardia without visible P waves. He is hemodynamically stable.`,
    "What is the most appropriate initial management?",
    [
      "Synchronized cardioversion",
      "IV amiodarone bolus",
      "Rate control with IV beta-blocker or calcium channel blocker",
      "Immediate anticoagulation with heparin only",
    ],
    "Rate control with IV beta-blocker or calcium channel blocker",
    `Hemodynamically stable atrial fibrillation with rapid ventricular response is managed initially with rate control (beta-blocker or non-dihydropyridine CCB). Cardioversion is for unstable patients. Amiodarone is not first-line for rate control. Anticoagulation is based on CHA₂DS₂-VASc and duration, not the sole initial step.`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "intervention",
      blueprintTopic: "arrhythmias",
      difficulty: 3,
      tags: ["atrial-fibrillation", ...PE],
      related: { keyTakeaway: "Stable AF with RVR → rate control first." },
    }
  ),

  panceVignette(
    "cardiovascular",
    `A 62-year-old man with hypertension and hyperlipidemia has BP 152/94 mm Hg on two office visits. Home readings average 148/90 mm Hg. BMI 31, no diabetes. BMP and creatinine are normal. He takes no antihypertensives.`,
    "Which is the most appropriate first-line pharmacotherapy?",
    [
      "Thiazide diuretic or ACE inhibitor",
      "Alpha-blocker",
      "Clonidine",
      "Hydralazine",
    ],
    "Thiazide diuretic or ACE inhibitor",
    `Stage 2 hypertension in a patient without compelling indications: thiazide, ACEi, ARB, or CCB are first-line per ACC/AHA. Alpha-blockers and clonidine are not first-line. Hydralazine is reserved for specific situations (e.g. pregnancy, with isosorbide in HFrEF).`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "hypertension",
      difficulty: 3,
      references: [ACCAHA_HTN],
      tags: ["hypertension", ...PE],
      related: { keyTakeaway: "Uncomplicated HTN: thiazide, ACEi, ARB, or CCB first-line." },
    }
  ),

  panceVignette(
    "cardiovascular",
    `A 28-year-old woman at 32 weeks gestation presents with sudden dyspnea and pleuritic chest pain. HR 118/min, RR 26/min, BP 102/68 mm Hg, SpO₂ 93% on room air. Exam is notable for tachycardia and clear lungs. D-dimer is elevated; leg ultrasound shows no DVT.`,
    "What is the most appropriate next diagnostic step?",
    [
      "Ventilation-perfusion scan",
      "CT pulmonary angiography",
      "Lower extremity Doppler only",
      "Repeat D-dimer in 1 week",
    ],
    "Ventilation-perfusion scan",
    `In pregnancy, V/Q scan is often preferred over CTPA when chest X-ray is normal to minimize fetal radiation exposure. Clinical suspicion for PE is high; repeating D-dimer or Doppler alone is insufficient. CTPA is used when V/Q is nondiagnostic or contraindicated.`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "labs",
      blueprintTopic: "PE",
      difficulty: 4,
      tags: ["PE", "pregnancy", ...PE],
      related: { keyTakeaway: "Pregnant patient with suspected PE: V/Q often preferred over CTPA." },
    }
  ),

  panceVignette(
    "cardiovascular",
    `A 55-year-old man with a mechanical aortic valve on warfarin presents for routine follow-up. INR is 1.4 (target 2.5–3.5). BP 124/78 mm Hg, HR 72/min. He reports no bleeding and takes his medication as prescribed. No new medications.`,
    "What is the most appropriate management?",
    [
      "Increase warfarin dose and recheck INR in 1 week",
      "Switch to apixaban",
      "Add aspirin 325 mg daily",
      "No change — INR is acceptable",
    ],
    "Increase warfarin dose and recheck INR in 1 week",
    `Subtherapeutic INR on warfarin for a mechanical valve requires dose adjustment and close follow-up — DOACs are not approved for mechanical valves. Adding high-dose aspirin increases bleeding without addressing subtherapeutic anticoagulation. INR 1.4 is below target.`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "valvular disease",
      difficulty: 3,
      tags: ["warfarin", "valve", ...PE],
      related: { keyTakeaway: "Mechanical valve → warfarin (not DOAC); adjust subtherapeutic INR." },
    }
  ),

  panceVignette(
    "cardiovascular",
    `A 78-year-old man is found unresponsive in the ED. No pulse is palpable; the cardiac monitor shows ventricular fibrillation at a rate of 320/min. CPR is in progress.`,
    "What is the most appropriate immediate intervention?",
    [
      "Defibrillation",
      "IV epinephrine only",
      "Synchronized cardioversion",
      "Transcutaneous pacing",
    ],
    "Defibrillation",
    `VF/pulseless VT requires immediate defibrillation. Epinephrine is given during ACLS but does not replace defibrillation for shockable rhythms. Synchronized cardioversion is for unstable tachycardia with a pulse. Pacing is for bradyarrhythmias.`,
    {
      blueprintSystem: "cardiovascular",
      taskCategory: "intervention",
      blueprintTopic: "arrhythmias",
      difficulty: 3,
      tags: ["ACLS", "VF", ...PE],
      related: { keyTakeaway: "VF/pulseless VT → defibrillate immediately." },
    }
  ),
];
