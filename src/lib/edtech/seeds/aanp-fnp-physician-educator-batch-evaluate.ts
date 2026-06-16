/**
 * Curated AANP FNP Evaluate domain items — physician-educator batch 01.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { aanpFnpVignette } from "@/lib/exam-prep/aanp-fnp-seed-factory";

const BATCH = "physician-educator-batch-evaluate";
const PE = ["physician-educator", BATCH, "aanp-fnp-seed"];

export const AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_EVALUATE: EnrichedBankItem[] = [
  aanpFnpVignette(
    "evaluate",
    `A 60-year-old man started atorvastatin 40 mg 6 weeks ago for primary prevention. He reports new bilateral leg cramping and dark urine. CK 2,400 U/L (was normal at baseline).`,
    "What is the most appropriate next step?",
    [
      "Stop atorvastatin immediately and monitor CK and renal function",
      "Continue statin and add coenzyme Q10",
      "Increase atorvastatin dose",
      "Switch to niacin",
    ],
    "Stop atorvastatin immediately and monitor CK and renal function",
    `Symptomatic myopathy with CK >10× ULN (or significantly elevated with symptoms) requires statin discontinuation and monitoring for rhabdomyolysis. Continuing or increasing the statin risks renal failure. Rechallenge with lower dose or alternate statin later after resolution.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "statin adverse effects",
      difficulty: 4,
      tags: ["statin", "myopathy", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 45-year-old woman with type 2 diabetes started metformin 8 weeks ago. A1c decreased from 9.2% to 8.0%. She reports good adherence. eGFR stable at 88.`,
    "What is the most appropriate evaluation at this visit?",
    [
      "Continue metformin and add second agent — A1c still above goal",
      "Stop metformin due to inadequate response",
      "Recheck A1c in 12 months",
      "Switch to insulin only",
    ],
    "Continue metformin and add second agent — A1c still above goal",
    `Individualized A1c goal often <7% for many adults. 1.2% reduction shows partial response — continue metformin and escalate (GLP-1 RA, SGLT2i, etc.). Stopping effective therapy or delaying follow-up is inappropriate. Insulin is not required before trying additional oral/injectable non-insulin agents.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "endocrine",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "diabetes monitoring",
      difficulty: 3,
      tags: ["diabetes", "A1c", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 22-year-old woman started sertraline 50 mg for depression 10 days ago. She reports increased energy, decreased need for sleep, and spending sprees for 3 days. Mood is euphoric.`,
    "What is the most appropriate next step?",
    [
      "Discontinue sertraline and evaluate for bipolar disorder; consider mood stabilizer",
      "Increase sertraline to 100 mg",
      "Add trazodone for sleep",
      "Continue sertraline — early improvement expected",
    ],
    "Discontinue sertraline and evaluate for bipolar disorder; consider mood stabilizer",
    `SSRI-induced mania/hypomania suggests underlying bipolar disorder — antidepressant monotherapy can trigger mania. Stop SSRI, assess for bipolarity, and treat with mood stabilizer. Increasing SSRI worsens mania.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "psychiatry-behavioral",
      patientAgeGroup: "young-adult",
      blueprintTopic: "SSRI monitoring",
      difficulty: 4,
      tags: ["bipolar", "SSRI", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 70-year-old man on warfarin for AFib presents with INR 6.8. He has no bleeding. He took his usual dose and has no new medications.`,
    "What is the most appropriate management?",
    [
      "Hold warfarin, give vitamin K 2.5 mg PO, recheck INR in 24–48 hours",
      "Continue warfarin — therapeutic range",
      "Administer fresh frozen plasma immediately",
      "Increase warfarin dose",
    ],
    "Hold warfarin, give vitamin K 2.5 mg PO, recheck INR in 24–48 hours",
    `Supratherapeutic INR 4.5–10 without bleeding: hold warfarin, consider low-dose oral vitamin K, recheck INR. FFP is for serious bleeding or INR >10 with bleeding risk. INR 6.8 is not therapeutic — continuing or increasing dose is dangerous.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "older-adult",
      blueprintTopic: "warfarin monitoring",
      difficulty: 4,
      tags: ["warfarin", "INR", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 3-year-old completed amoxicillin for otitis media 5 days ago. Parent reports fever returned today with ear tugging. Otoscopy shows bulging red tympanic membrane.`,
    "What is the most appropriate next step?",
    [
      "Start high-dose amoxicillin-clavulanate for treatment failure",
      "Observation only — antibiotics already given",
      "Refer for tympanostomy tubes immediately",
      "Azithromycin for 1 day",
    ],
    "Start high-dose amoxicillin-clavulanate for treatment failure",
    `Treatment failure of AOM within 30 days warrants high-dose amoxicillin-clavulanate to cover beta-lactamase producers. Observation is inappropriate with recurrent symptoms and exam findings. Tubes are for recurrent AOM, not first-line after single failure.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "toddler",
      blueprintTopic: "AOM follow-up",
      difficulty: 3,
      tags: ["AOM", "pediatrics", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 55-year-old woman on lisinopril for HTN returns with BP 138/88 (was 128/78 at last visit). She reports good adherence. BMP shows potassium 5.6 mEq/L, creatinine 1.4 (was 1.0).`,
    "What is the most appropriate modification?",
    [
      "Reduce or stop lisinopril and recheck BMP in 1–2 weeks",
      "Add hydrochlorothiazide",
      "Increase lisinopril dose",
      "No change — BP acceptable",
    ],
    "Reduce or stop lisinopril and recheck BMP in 1–2 weeks",
    `ACEi-induced hyperkalemia and creatinine rise require dose reduction or discontinuation with BMP monitoring. Adding HCTZ without addressing ACEi effect may worsen renal function. Increasing lisinopril is contraindicated with K+ 5.6 and rising creatinine.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "ACEi monitoring",
      difficulty: 4,
      tags: ["ACEi", "hyperkalemia", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 78-year-old woman started donepezil 5 mg 4 weeks ago for Alzheimer disease. Daughter reports increased urinary incontinence and bradycardia (HR 48/min). No falls.`,
    "What is the most appropriate next step?",
    [
      "Reduce dose or discontinue donepezil and monitor; consider alternative",
      "Increase donepezil to 10 mg",
      "Add oxybutynin for incontinence",
      "Continue current dose — expected side effects",
    ],
    "Reduce dose or discontinue donepezil and monitor; consider alternative",
    `Cholinesterase inhibitors cause bradycardia and increased urinary symptoms. Significant bradycardia warrants dose reduction or discontinuation. Adding anticholinergic (oxybutynin) worsens cognition and is on Beers list. Increasing dose exacerbates adverse effects.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "geriatrics",
      patientAgeGroup: "older-adult",
      blueprintTopic: "dementia medication monitoring",
      difficulty: 4,
      tags: ["donepezil", "Beers", ...PE],
      related: { reviewModuleSlug: "aanp-geriatrics-high-yield" },
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 35-year-old man with a 10-year history of moderate persistent asthma on fluticasone/salmeterol has used albuterol 4 times daily for 2 weeks. He has seasonal allergies and denies smoking. Peak flow is 65% of personal best. No fever or purulent sputum.`,
    "What is the most appropriate plan modification?",
    [
      "Short course oral prednisone and reassess controller therapy",
      "Continue current regimen — albuterol use acceptable",
      "Stop all inhalers",
      "Start long-term daily oral steroids",
    ],
    "Short course oral prednisone and reassess controller therapy",
    `Poor asthma control (SABA >2 days/week, peak flow 65%) requires systemic corticosteroid burst and controller escalation/reassessment. Continuing without change risks exacerbation. Stopping controllers is dangerous. Daily maintenance oral steroids are not appropriate.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "pulmonary",
      patientAgeGroup: "young-adult",
      blueprintTopic: "asthma monitoring",
      difficulty: 3,
      tags: ["asthma", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 48-year-old woman with a history of recurrent UTIs completed 7 days of nitrofurantoin for uncomplicated cystitis. She has no diabetes or anatomic abnormalities. Symptoms resolved but repeat UA shows persistent bacteriuria without symptoms.`,
    "What is the most appropriate management?",
    [
      "No further antibiotics — asymptomatic bacteriuria does not require treatment in non-pregnant adults",
      "Repeat 14-day course of nitrofurantoin",
      "Switch to ciprofloxacin",
      "Order CT urogram",
    ],
    "No further antibiotics — asymptomatic bacteriuria does not require treatment in non-pregnant adults",
    `Asymptomatic bacteriuria in non-pregnant, premenopausal women should not be treated — antibiotics increase resistance without benefit. Treatment is indicated in pregnancy and before urologic procedures. Imaging is not indicated without symptoms or complicating factors.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "infectious-disease",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "asymptomatic bacteriuria",
      difficulty: 3,
      tags: ["UTI", ...PE],
    }
  ),

  aanpFnpVignette(
    "evaluate",
    `A 62-year-old man had PCI with drug-eluting stent 8 months ago. He stopped clopidogrel 2 weeks ago because he felt well. He presents with substernal chest pain. ECG shows ST depression in V4–V6.`,
    "What is the most important factor in evaluating his presentation?",
    [
      "Premature antiplatelet discontinuation — high risk for stent thrombosis",
      "Need for routine stress test only",
      "Pain is non-cardiac because stent was placed",
      "Start aspirin monotherapy and discharge",
    ],
    "Premature antiplatelet discontinuation — high risk for stent thrombosis",
    `DAPT for DES typically ≥12 months — premature P2Y12 cessation dramatically increases stent thrombosis risk. Acute chest pain with ischemic ECG changes requires emergent ACS evaluation, not outpatient stress testing alone.`,
    {
      blueprintDomain: "evaluate",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "post-PCI follow-up",
      difficulty: 5,
      tags: ["ACS", "DAPT", ...PE],
      related: { reviewModuleSlug: "acute-coronary-syndrome" },
    }
  ),
];
