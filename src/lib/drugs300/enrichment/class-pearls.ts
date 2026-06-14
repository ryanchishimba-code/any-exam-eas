import type { ExamReference } from "@/lib/exam-prep/types";
import {
  ACC_AHA_CV,
  ADA_STANDARDS,
  FDA_LABELING,
  ISMP_MED_SAFETY,
} from "@/lib/exam-prep/guideline-registry";
import type { DrugEntry } from "../types";
import type { DrugEnrichment } from "./types";

type ClassRule = {
  match: (drug: DrugEntry) => boolean;
  merge: Partial<DrugEnrichment>;
};

const GLP1_SHARED: Partial<DrugEnrichment> = {
  mechanism:
    "Incretin mimetic — enhances glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety.",
  pearls: [
    "Titrate slowly over weeks to limit nausea; counsel on injection technique and rotation.",
    "Contraindicated with personal/family history of MEN2 or medullary thyroid carcinoma.",
    "Hold or discuss perioperatively when delayed gastric emptying is a concern (ileus/gastroparesis).",
    "ADA: prefer GLP-1 RA or SGLT2i with proven CV/renal benefit when ASCVD, HF, or CKD comorbidity.",
  ],
  guidelines: [ADA_STANDARDS, FDA_LABELING],
  counseling:
    "Take with meals as labeled; report persistent abdominal pain (pancreatitis). Avoid if pregnant unless prescribed.",
  monitoring: "A1C, weight, GI tolerance; watch for signs of pancreatitis or gallbladder disease.",
  contraindications: "MEN2, medullary thyroid carcinoma, prior serious hypersensitivity to product.",
};

const CLASS_RULES: ClassRule[] = [
  {
    match: (d) => /dual gip\/glp-1|tirzepatide/i.test(`${d.therapeuticClass} ${d.generic}`),
    merge: {
      ...GLP1_SHARED,
      mechanism:
        "Dual GIP and GLP-1 receptor agonist — amplifies insulin secretion, reduces glucagon, delays gastric emptying, increases satiety beyond GLP-1 alone.",
      pearls: [
        ...(GLP1_SHARED.pearls ?? []),
        "SURPASS/SURMOUNT trials: superior A1C and weight loss vs semaglutide in many populations — know brand split (Mounjaro T2DM, Zepbound weight).",
      ],
    },
  },
  {
    match: (d) => /glp-1/i.test(d.therapeuticClass),
    merge: GLP1_SHARED,
  },
  {
    match: (d) => /sglt2/i.test(d.therapeuticClass),
    merge: {
      mechanism: "Inhibits SGLT2 in proximal tubule → glucosuria, osmotic diuresis, modest weight loss.",
      pearls: [
        "ADA: first-line add-on for T2DM with ASCVD, HF, or CKD (empagliflozin, dapagliflozin evidence).",
        "Counsel on genital mycotic infections and volume depletion; hold before major surgery.",
        "Euglycemic DKA risk — especially if insulin withheld or during illness.",
      ],
      guidelines: [ADA_STANDARDS, ACC_AHA_CV, FDA_LABELING],
      counseling: "Maintain hydration; seek care for genital irritation or signs of DKA (nausea, abdominal pain).",
      monitoring: "Renal function, volume status, A1C; foot care in diabetes.",
    },
  },
  {
    match: (d) => /biguanide|metformin/i.test(`${d.therapeuticClass} ${d.generic}`),
    merge: {
      mechanism: "Activates AMPK → ↓ hepatic gluconeogenesis; improves peripheral insulin sensitivity.",
      pearls: [
        "First-line T2DM per ADA unless contraindicated; hold if eGFR <30; caution eGFR 30–45.",
        "Hold before iodinated contrast if AKI risk; resume when renal function stable.",
        "B12 deficiency with long-term use — periodic monitoring.",
      ],
      guidelines: [ADA_STANDARDS, FDA_LABELING],
      monitoring: "eGFR, B12 periodically, A1C.",
    },
  },
  {
    match: (d) => /statin|hmg-coa/i.test(d.therapeuticClass),
    merge: {
      pearls: [
        "ACC/AHA: moderate/high-intensity statin by ASCVD risk; add ezetimibe/PCSK9i if LDL goal not met.",
        "Counsel myalgias vs rhabdo — report unexplained muscle pain with weakness or dark urine.",
        "Check hepatic transaminases if symptoms; avoid in active liver disease/pregnancy.",
      ],
      guidelines: [ACC_AHA_CV, FDA_LABELING],
      monitoring: "Lipid panel, LFTs if symptomatic, CK if rhabdomyolysis suspected.",
    },
  },
  {
    match: (d) => /ace inhibitor|arb\b/i.test(d.therapeuticClass),
    merge: {
      pearls: [
        "First-line HTN/HFrEF per ACC/AHA; ACE-I cough → switch to ARB.",
        "Contraindicated in pregnancy; monitor K+ and creatinine after initiation.",
        "Never combine ACE-I + ARB (hyperkalemia/AKI risk).",
      ],
      guidelines: [ACC_AHA_CV, FDA_LABELING],
      monitoring: "BP, K+, creatinine within 1–2 weeks of start or dose change.",
    },
  },
  {
    match: (d) => /insulin/i.test(d.therapeuticClass) && !/glargine\/lixisenatide/i.test(d.generic),
    merge: {
      pearls: [
        "ISMP high-alert drug — independent double-check dosing; never use 'U' alone for units.",
        "Hypoglycemia protocol: 15 g fast carb, recheck in 15 min; glucagon for severe cases.",
        "Basal vs bolus timing — basal without peak (glargine/degludec) vs mealtime analogs.",
      ],
      guidelines: [ADA_STANDARDS, ISMP_MED_SAFETY, FDA_LABELING],
      counseling: "Never skip meal if rapid-acting insulin taken; rotate injection sites.",
      monitoring: "Blood glucose log, A1C, weight; hypoglycemia education.",
    },
  },
  {
    match: (d) => /factor x|doac|direct oral anticoag/i.test(d.therapeuticClass) || /apixaban|rivaroxaban|edoxaban|dabigatran/i.test(d.generic),
    merge: {
      pearls: [
        "DOACs preferred over warfarin for non-valvular AF in eligible patients (ACC/AHA).",
        "Renal dose adjustment required; avoid with mechanical heart valves.",
        "Bleeding reversal agents differ by agent (andexanet, idarucizumab, PCC).",
      ],
      guidelines: [ACC_AHA_CV, FDA_LABELING],
      monitoring: "Renal function, bleeding signs; avoid unnecessary NSAIDs/antiplatelets.",
    },
  },
];

export function enrichmentFromClass(drug: DrugEntry): Partial<DrugEnrichment> {
  const merged: Partial<DrugEnrichment> = { pearls: [], guidelines: [] };
  for (const rule of CLASS_RULES) {
    if (!rule.match(drug)) continue;
    if (rule.merge.mechanism) merged.mechanism = rule.merge.mechanism;
    if (rule.merge.counseling) merged.counseling = rule.merge.counseling;
    if (rule.merge.monitoring) merged.monitoring = rule.merge.monitoring;
    if (rule.merge.contraindications) merged.contraindications = rule.merge.contraindications;
    merged.pearls = [...(merged.pearls ?? []), ...(rule.merge.pearls ?? [])];
    merged.guidelines = dedupeRefs([...(merged.guidelines ?? []), ...(rule.merge.guidelines ?? [])]);
    break;
  }
  return merged;
}

function dedupeRefs(refs: ExamReference[]): ExamReference[] {
  const seen = new Set<string>();
  return refs.filter((r) => {
    if (seen.has(r.label)) return false;
    seen.add(r.label);
    return true;
  });
}
