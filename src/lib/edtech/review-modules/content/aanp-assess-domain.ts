import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AANPCB Domain I — Assess (32% of FNP exam). */
export const AANP_ASSESS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Assess is the largest AANP FNP domain (~43 scored items). Items test whether you gather the right history, perform a focused exam, and order the single best next diagnostic step — not the most exhaustive workup.",
        "Lifespan integration is constant: the same stem may require newborn sepsis rules, adolescent confidentiality, adult cancer screening, or geriatric atypical presentations. USPSTF and Bright Futures screening schedules appear frequently.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Focused vs comprehensive assessment — match depth to chief complaint and stability",
        "Pre-test probability drives test selection; avoid low-yield panels",
        "Red-flag symptoms mandate escalation regardless of 'normal' vitals",
        "Age-specific screening: USPSTF (adults), Bright Futures / AAP (pediatrics)",
        "Prenatal initial visit labs: blood type/Rh, CBC, rubella immunity, hepatitis B, HIV, GC/chlamydia, urinalysis, glucose screening timing",
        "Geriatric assessment: falls, cognition, ADLs, polypharmacy, sensory deficits",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Chest pain: ECG first if ACS suspected; troponin serially — do not delay ECG for CXR",
        "Dyspnea: pulse ox, CXR, BNP/NT-proBNP when HF/PE considered; Wells + D-dimer when PE pre-test moderate",
        "Abdominal pain: location + rebound/guarding → surgical consult; RLQ pain in reproductive-age female → pregnancy test first",
        "Febrile infant <28 days: full sepsis workup + empiric antibiotics + admission (low threshold)",
        "Febrile infant 29–60 days: risk stratify (AAP/PECARN pathways) — do not apply adult UTI algorithms",
        "Depression screening: PHQ-2 → PHQ-9; suicide risk assessment mandatory if positive",
        "Older adult with confusion: delirium workup (infection, meds, metabolic) before labeling dementia",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Febrile infant by age — assessment urgency",
          headers: ["Age", "Fever threshold concern", "Typical workup"],
          rows: [
            ["0–28 days", "≥38.0°C (100.4°F) rectal", "Blood, urine, CSF cultures; CXR if respiratory signs; admit + IV antibiotics"],
            ["29–60 days", "Context-dependent", "Risk stratification tools; selective LP/imaging based on appearance and labs"],
            ["3–36 months", "Well vs ill appearance", "Urine often key source; consider CXR if tachypnea; shared decision for low-risk"],
            ["≥3 years", "Focus on source", "Guided history/exam; strep test if pharyngitis; avoid blanket sepsis workup if well"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "USPSTF A/B recommendation cheat sheet: colonoscopy, mammography, lung cancer LDCT, AAA one-time screen",
        "Bright Futures visit timeline: newborn, 2 weeks, 2/4/6/9/12/15/18 months, then annual",
        "Red-flag chest pain pathway: ECG within 10 minutes → troponin → disposition",
        "Geriatric fall assessment: get-up-and-go, home safety, orthostatics, vision/hearing",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Order every lab on the differential — choose the test that changes management next",
        "Normal vital signs exclude serious illness in older adults — atypical presentations are common",
        "Skip pregnancy test before abdominal/pelvic imaging in reproductive-age females",
        "Apply adult fever workup to neonates — neonatal sepsis rules are stricter",
        "Defer suicide screening when patient denies depression — screen per guidelines",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "AANP vignettes reward the NEXT best step, not the definitive test",
        "When two answers seem correct, pick the one with higher yield and lower harm first",
        "Document immunization status and catch-up needs during every pediatric/adult preventive visit",
        "Functional assessment (ADLs, falls) belongs in geriatric Assess items even when chief complaint is unrelated",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Assess = 32% of exam — history, exam, screening, next-best diagnostic step",
        "Lifespan: newborn sepsis rules, peds milestones/immunizations, geriatric atypical disease",
        "USPSTF + Bright Futures drive screening questions",
        "Red flags → escalate; do not comfort with incomplete workup",
        "Choose focused, high-yield testing over shotgun labs",
      ],
    },
  ],
};
