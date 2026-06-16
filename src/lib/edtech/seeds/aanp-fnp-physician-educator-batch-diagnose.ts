/**
 * Curated AANP FNP Diagnose domain items — physician-educator batch 01.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { aanpFnpVignette } from "@/lib/exam-prep/aanp-fnp-seed-factory";

const BATCH = "physician-educator-batch-diagnose";
const PE = ["physician-educator", BATCH, "aanp-fnp-seed"];

export const AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_DIAGNOSE: EnrichedBankItem[] = [
  aanpFnpVignette(
    "diagnose",
    `A 58-year-old man with hypertension presents with 30 minutes of crushing substernal chest pain radiating to the jaw. He is diaphoretic. BP 160/95 mm Hg, HR 102/min. ECG shows ST elevation in leads II, III, and aVF.`,
    "What is the most likely diagnosis?",
    ["Anterior STEMI", "Inferior STEMI", "Pericarditis", "Aortic dissection"],
    "Inferior STEMI",
    `ST elevation in II, III, aVF localizes to the inferior wall (RCA territory). Anterior STEMI shows V1–V4 changes. Pericarditis shows diffuse ST elevation with PR depression. Dissection presents with tearing pain and mediastinal widening.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "cardiovascular",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "ACS",
      difficulty: 4,
      tags: ["STEMI", "ECG", ...PE],
      related: { reviewModuleSlug: "acute-coronary-syndrome" },
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 4-week-old previously healthy full-term infant is brought to the ED with fever. Rectal temperature is 38.1°C. The infant feeds well, urinates normally, and appears non-toxic. Birth history was uncomplicated; the infant went home at 48 hours and has no sick contacts. WBC 12,000/µL. UA is negative. Exam shows no meningismus, rash, or lethargy.`,
    "What is the most likely clinical concern requiring management?",
    [
      "Viral URI — outpatient management",
      "Serious bacterial infection until proven otherwise",
      "Teething fever",
      "Overbundling only",
    ],
    "Serious bacterial infection until proven otherwise",
    `Fever in infants ≤28 days requires full sepsis workup and admission. At 29 days, many guidelines still treat febrile infants <60 days aggressively — a rectal temp of 38.1°C in a neonate/young infant mandates sepsis evaluation (blood, urine, CSF) regardless of appearance.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "newborn",
      blueprintTopic: "febrile infant",
      difficulty: 5,
      tags: ["febrile infant", "sepsis", ...PE],
      related: { reviewModuleSlug: "aanp-pediatrics-high-yield" },
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 72-year-old woman with type 2 diabetes and a history of recurrent UTIs presents with 2 days of dysuria and increased urinary frequency. She takes metformin and has no known drug allergies. Temp 37.8°C. UA shows nitrites, leukocyte esterase, and WBCs. She is alert and hemodynamically stable with no flank pain.`,
    "What is the most likely diagnosis?",
    ["Uncomplicated cystitis", "Pyelonephritis", "Urosepsis", "Interstitial nephritis"],
    "Uncomplicated cystitis",
    `Localized urinary symptoms without flank pain, systemic toxicity, or hemodynamic instability in a stable older adult suggest uncomplicated lower UTI (cystitis). Pyelonephritis adds fever, CVA tenderness, and systemic symptoms. Urosepsis involves hypotension or end-organ dysfunction.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "infectious-disease",
      patientAgeGroup: "older-adult",
      blueprintTopic: "UTI",
      difficulty: 3,
      tags: ["UTI", ...PE],
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 15-year-old girl with no prior medical history presents with 3 weeks of fatigue, weight gain, cold intolerance, and constipation. She takes no medications. Exam shows delayed relaxation of deep tendon reflexes. TSH 18 mIU/L, free T4 low. She denies pregnancy.`,
    "What is the most likely diagnosis?",
    ["Hashimoto thyroiditis", "Graves disease", "Subclinical hyperthyroidism", "Euthyroid sick syndrome"],
    "Hashimoto thyroiditis",
    `Primary hypothyroidism (elevated TSH, low free T4) in an adolescent with classic symptoms and delayed reflexes is most consistent with Hashimoto thyroiditis — the most common cause in iodine-sufficient regions. Graves presents with hyperthyroidism. Subclinical hyperthyroidism has suppressed TSH with normal T4.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "endocrine",
      patientAgeGroup: "adolescent",
      blueprintTopic: "hypothyroidism",
      difficulty: 3,
      tags: ["thyroid", ...PE],
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 45-year-old woman with a 10-pack-year smoking history presents with 6 months of progressive dyspnea on exertion and dry cough. She works in a bird sanctuary and keeps parrots at home. Chest X-ray shows upper-lobe reticular opacities. Spirometry shows restrictive pattern with reduced DLCO.`,
    "What is the most likely diagnosis?",
    ["Hypersensitivity pneumonitis", "COPD", "Asthma", "Pulmonary embolism"],
    "Hypersensitivity pneumonitis",
    `Bird exposure + restrictive spirometry + reduced DLCO + upper-lobe interstitial changes suggests hypersensitivity pneumonitis (bird fancier's lung). COPD and asthma are obstructive. PE presents acutely with pleuritic pain and hypoxemia.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "pulmonary",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "interstitial lung disease",
      difficulty: 4,
      tags: ["pulmonary", ...PE],
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 26-year-old woman at 32 weeks gestation presents with sudden severe headache, visual scotomata, and BP 168/110 mm Hg. Proteinuria 2+ on dipstick. Platelets 98,000/µL, AST 86 U/L.`,
    "What is the most likely diagnosis?",
    ["Preeclampsia with severe features", "Migraine with aura", "Gestational hypertension", "Chronic hypertension"],
    "Preeclampsia with severe features",
    `After 20 weeks: hypertension + proteinuria defines preeclampsia. Severe features include BP ≥160/110, thrombocytopenia, elevated transaminases, visual symptoms, and severe headache — this patient meets criteria for preeclampsia with severe features (formerly severe preeclampsia).`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "womens-health",
      patientAgeGroup: "young-adult",
      blueprintTopic: "preeclampsia",
      difficulty: 4,
      tags: ["OB", "preeclampsia", ...PE],
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `An 80-year-old man with a history of moderate Alzheimer dementia is brought in by family for 3 days of acute confusion, inattention, and fluctuating alertness. Baseline dementia allows him to recognize family. Temp 38.4°C, HR 92/min. UA is positive for infection. No focal neurologic deficits on exam.`,
    "What is the most likely diagnosis?",
    [
      "Delirium secondary to infection",
      "Progression of Alzheimer dementia",
      "Depression",
      "Normal pressure hydrocephalus",
    ],
    "Delirium secondary to infection",
    `Acute onset, fluctuating course, inattention, and altered consciousness over hours-days defines delirium — especially with UTI in an older adult. Dementia progression is insidious. Depression may mimic but lacks acute fluctuation and fever.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "geriatrics",
      patientAgeGroup: "older-adult",
      blueprintTopic: "delirium",
      difficulty: 3,
      tags: ["delirium", "geriatrics", ...PE],
      related: { reviewModuleSlug: "aanp-geriatrics-high-yield" },
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 32-year-old man who immigrated from a high-TB-prevalence country 2 years ago presents with 2 weeks of persistent cough, night sweats, and 10-lb unintentional weight loss. He takes no medications and has no HIV risk factors. Chest X-ray shows upper-lobe cavitary lesion. PPD is 18 mm.`,
    "What is the most likely diagnosis?",
    ["Pulmonary tuberculosis", "Community-acquired pneumonia", "Lung cancer", "Sarcoidosis"],
    "Pulmonary tuberculosis",
    `Chronic cough, constitutional symptoms, upper-lobe cavitary lesion, and positive PPD in a patient from endemic area strongly suggest active pulmonary TB. CAP is acute without chronic weight loss pattern. Lung cancer possible but TB more likely with exposure history.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "infectious-disease",
      patientAgeGroup: "young-adult",
      blueprintTopic: "tuberculosis",
      difficulty: 4,
      tags: ["TB", ...PE],
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 55-year-old woman presents with 4 months of sadness, anhedonia, 12-lb weight loss, insomnia, poor concentration, and guilt. She denies suicidal ideation. PHQ-9 score is 18. TSH is normal.`,
    "What is the most likely diagnosis?",
    ["Major depressive disorder, moderate-severe", "Adjustment disorder", "Hypothyroidism", "Bipolar mania"],
    "Major depressive disorder, moderate-severe",
    `≥5 depressive symptoms for ≥2 weeks including anhedonia/depressed mood with functional impairment meets MDD criteria. PHQ-9 of 18 indicates moderately severe depression. Normal TSH excludes hypothyroidism. No manic symptoms.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "psychiatry-behavioral",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "depression",
      difficulty: 3,
      tags: ["depression", "MDD", ...PE],
    }
  ),

  aanpFnpVignette(
    "diagnose",
    `A 4-year-old boy with no chronic illnesses presents with 2 days of periorbital swelling and cola-colored urine. He had impetigo on the chin treated with topical antibiotics 2 weeks ago. BP 130/90 mm Hg (95th percentile for age). UA shows RBC casts and proteinuria.`,
    "What is the most likely diagnosis?",
    ["Post-streptococcal glomerulonephritis", "Minimal change disease", "IgA nephropathy", "HUS"],
    "Post-streptococcal glomerulonephritis",
    `Post-infectious GN 1–3 weeks after skin/pharyngeal strep: edema, hypertension, cola urine, RBC casts. Minimal change presents with nephrotic syndrome without hypertension. HUS follows bloody diarrhea with thrombocytopenia.`,
    {
      blueprintDomain: "diagnose",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "child",
      blueprintTopic: "nephrology",
      difficulty: 4,
      tags: ["PSGN", "pediatrics", ...PE],
    }
  ),
];
