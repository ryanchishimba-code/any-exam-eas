import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AANP FNP geriatrics (~30% lifespan weight). */
export const AANP_GERIATRICS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Older adults represent the largest lifespan share on the AANP FNP exam (~30%). Items test polypharmacy, falls, delirium, dementia, atypical disease presentations, and goals-of-care — not just 'normal aging.'",
        "Geriatric syndromes (delirium, falls, incontinence, frailty) often have reversible triggers. Beers Criteria and deprescribing appear in Plan and Evaluate items.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Beers Criteria — avoid high-risk medications in older adults when alternatives exist",
        "Delirium: acute, fluctuating attention/cognition — medical cause until proven otherwise",
        "Dementia: chronic progressive cognitive decline — safety, caregiver support, reversible mimics ruled out",
        "Falls: multifactorial — meds, orthostasis, vision, environment, gait",
        "Polypharmacy: ≥5 medications — reconcile, deprescribe, watch interactions",
        "Atypical presentations: silent MI, apneic UTI, delirium instead of fever",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "New confusion → delirium workup: infection, meds (benzos, anticholinergics), metabolic, pain, constipation",
        "Fall with head strike on anticoagulant → neuro exam, consider imaging",
        "Orthostatic hypotension: review diuretics/alpha blockers; hydration; slow position changes",
        "Urinary incontinence: treat reversible causes (UTI, BPH, meds) before absorbent products only",
        "Deprescribing PPIs, sedative-hypnotics, anticholinergics when risk exceeds benefit",
        "Advance care planning: POLST/MOLST, surrogate decision-maker, code status discussions",
        "Pain in dementia: behavioral signs of pain — do not assume 'can't feel pain'",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Delirium vs dementia vs depression",
          headers: ["Feature", "Delirium", "Dementia", "Depression"],
          rows: [
            ["Onset", "Hours to days", "Months to years", "Weeks to months"],
            ["Course", "Fluctuating", "Progressive", "Variable; mood prominent"],
            ["Attention", "Impaired", "Impaired late", "Distractible but improvable"],
            ["Cause", "Medical trigger", "Neurodegenerative", "Mood disorder"],
            ["First step", "Treat trigger", "Safety + workup", "PHQ-9 + treat depression"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Beers Criteria high-risk drug classes: benzos, anticholinergics, long-acting sulfonylureas, PPI long-term",
        "Fall prevention bundle: home safety, PT, vision, med review, vitamin D if deficient",
        "Delirium workup mnemonic: infection, meds, metabolic, pain, retention, environment",
        "Capacity assessment framework for major medical decisions",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Confusion in older adult is 'just dementia' — new change is delirium until proven otherwise",
        "Restraints prevent falls — they increase injury and delirium",
        "Start benzodiazepine for insomnia in elderly — non-pharm sleep hygiene + CBT-I preferred",
        "Ignore caregiver strain — safety and adherence depend on support system",
        "Skip suicide screening in older adults — rates are significant especially with medical illness",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Geriatric Plan answers often require stopping a harmful drug rather than adding one",
        "Evaluate items: check orthostatics after antihypertensive changes",
        "Immunizations still indicated in older adults: flu, pneumococcal, shingles, COVID per schedule",
        "Functional status (ADLs/IADLs) is a vital sign in geriatric care",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Geriatrics ≈ 30% of exam — polypharmacy, falls, delirium, dementia, atypical disease",
        "New confusion = delirium workup first",
        "Beers Criteria + deprescribing for Plan/Evaluate",
        "Falls and function are Assess priorities",
        "Goals-of-care and caregiver support are part of complete plans",
      ],
    },
  ],
};
