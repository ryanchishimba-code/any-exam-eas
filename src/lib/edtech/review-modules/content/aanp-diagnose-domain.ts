import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AANPCB Domain II — Diagnose (26.5% of FNP exam). */
export const AANP_DIAGNOSE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Diagnose is the second-largest AANP FNP domain (~36 scored items). Items test whether you synthesize history, exam, and limited data into a prioritized differential and the most likely primary diagnosis.",
        "Unlike Assess items that ask for the next test, Diagnose items ask which diagnosis best fits the pattern — epidemiology, timeline, discriminating findings, and comorbidity context all matter.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Problem representation: age + key finding + tempo + risk factors",
        "Generate a broad differential, then narrow with discriminating data",
        "Common primary care diagnoses outnumber zebras — anchor on prevalence first",
        "Atypical presentations in older adults and women (silent MI, GERD masquerading as ACS)",
        "When data conflict, choose the diagnosis best supported — not the scariest",
        "Recognize syndromes spanning systems: sepsis, DKA, PE, ectopic pregnancy",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Chest pain: ACS vs GERD vs musculoskeletal vs PE — ECG and risk stratification discriminate",
        "Dyspnea: asthma/COPD exacerbation vs HF vs PE vs pneumonia",
        "Fever: viral URI vs strep vs UTI vs occult sepsis — age and appearance guide",
        "Headache: migraine vs tension vs SAH vs meningitis — sudden worst headache is red flag",
        "Abdominal pain: appendicitis, cholecystitis, ectopic, ovarian torsion, IBS — location and exam",
        "Depression vs hypothyroidism vs anemia vs grief — screen broadly before labeling",
        "Pediatric rash: viral exanthem vs strep scarlet fever vs meningococcemia",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Discriminating findings in high-yield differentials",
          headers: ["Presentation", "Favors A", "Favors B"],
          rows: [
            ["Sore throat", "Cough, rhinorrhea → viral", "Fever, exudates, no cough → GAS"],
            ["Polyuria + weight loss", "DKA: ketones, acidosis", "T2DM new dx: milder, no acidosis"],
            ["Acute confusion", "Delirium: acute, fluctuating", "Dementia: insidious, stable baseline"],
            ["Low back pain", "Radicular leg pain, neuro deficit → herniation", "No red flags → mechanical"],
            ["Syncope", "Orthostatic, vasovagal", "Arrhythmia, structural heart disease"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Chest pain differential flow: unstable features → ACS workup vs stable risk stratification",
        "Febrile infant algorithm by age (0–28 days, 29–90 days, 3–36 months)",
        "Headache red-flag checklist (thunderclap, neuro deficit, immunocompromised, age >50 new)",
        "MSK low back pain red flags (cauda equina, cancer, infection, fracture)",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Choosing rare diagnosis without supporting vignette data",
        "Labeling anxiety as primary cause of chest pain before ACS rule-out in high-risk patients",
        "Calling delirium dementia without acute change in mental status",
        "Diagnosing otitis media without bulging tympanic membrane",
        "Missing pregnancy in reproductive-age abdominal pain differential",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Read every data point in the stem — vitals, meds, pregnancy status, recent travel",
        "If two answers seem plausible, pick the one with strongest discriminating finding",
        "Geriatric 'failure to thrive' often has multifactorial diagnosis — pick the best single answer",
        "Pediatric diagnosis items reward appearance (toxic vs well) over fever number alone",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Diagnose = 26.5% — pattern recognition and clinical reasoning",
        "Build differential from epidemiology + tempo + key finding",
        "Common conditions first; zebras only when data support",
        "Atypical presentations in elderly, women, and immunocompromised",
        "Choose the diagnosis most consistent with ALL provided data",
      ],
    },
  ],
};
