import type { ExamReference } from "@/lib/exam-prep/types";
import {
  ACC_AHA_CV,
  ACOG_MATERNAL,
  AAP_PEDIATRICS,
  ADA_STANDARDS,
  APA_THERAPEUTIC,
  CDC_INFECTION,
  FDA_LABELING,
  IDSA_INFECTION,
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
  {
    match: (d) => /warfarin|vitamin k antagonist/i.test(`${d.therapeuticClass} ${d.generic}`),
    merge: {
      pearls: [
        "Target INR 2–3 for most AF/DVT indications; 2.5–3.5 for mechanical mitral valves.",
        "Teratogenic (pregnancy Category X) — use LMWH in pregnancy instead.",
        "Many drug/food interactions (vitamin K, CYP2C9); bridged when transitioning to/from DOAC.",
      ],
      guidelines: [ACC_AHA_CV, FDA_LABELING],
      monitoring: "INR, bleeding, medication & diet consistency.",
    },
  },
  {
    match: (d) =>
      /antibiotic|cephalosporin|penicillin|macrolide|fluoroquinolone|tetracycline|nitroimidazole|aminopenicillin|antiprotozoal/i.test(
        d.therapeuticClass
      ) || /sulfamethoxazole|trimethoprim/i.test(d.generic),
    merge: {
      pearls: [
        "Match spectrum to likely pathogen; obtain cultures before broad empiric therapy when feasible (IDSA).",
        "Document penicillin allergy history — true IgE allergy vs intolerance changes cephalosporin options.",
        "Complete full course for strep pharyngitis; avoid antibiotics for viral URI (stewardship).",
        "Counsel GI upset; report rash, severe diarrhea (C. diff), or allergic reactions.",
      ],
      guidelines: [IDSA_INFECTION, CDC_INFECTION, FDA_LABELING],
      counseling: "Take as directed; finish prescribed course unless rash or severe reaction.",
      monitoring: "Clinical response 48–72 h; renal dose adjustment for many agents.",
    },
  },
  {
    match: (d) => /ssri/i.test(d.therapeuticClass),
    merge: {
      mechanism: "Selective serotonin reuptake inhibition → ↑ synaptic serotonin.",
      pearls: [
        "Onset 2–4 weeks for mood benefit — counsel on delayed response; monitor suicidality early in teens/young adults.",
        "Serotonin syndrome risk with MAOIs, triptans, linezolid, other serotonergic drugs.",
        "Do not stop abruptly — taper to reduce discontinuation syndrome.",
        "Common SE: GI upset, sexual dysfunction, insomnia or sedation (agent-dependent).",
      ],
      guidelines: [APA_THERAPEUTIC, FDA_LABELING],
      counseling: "Take consistently; report worsening mood, agitation, or suicidal thoughts early.",
      monitoring: "Mood/suicidality first 4–8 weeks; drug interactions.",
    },
  },
  {
    match: (d) => /snri|ndri/i.test(d.therapeuticClass),
    merge: {
      pearls: [
        "SNRIs: dual NE/5-HT reuptake — venlafaxine/duloxetine may raise BP at higher doses.",
        "Bupropion (NDRI): lowers seizure threshold; avoid in eating disorders, abrupt alcohol withdrawal.",
        "Taper SNRIs — withdrawal (dizziness, brain zaps) if stopped cold.",
      ],
      guidelines: [APA_THERAPEUTIC, FDA_LABELING],
      monitoring: "BP (SNRIs), seizure risk (bupropion), mood/suicidality.",
    },
  },
  {
    match: (d) => /atypical antipsychotic|typical.*antipsychotic|high-potency.*antipsychotic/i.test(d.therapeuticClass),
    merge: {
      pearls: [
        "Monitor metabolic syndrome (weight, glucose, lipids) — especially olanzapine/quetiapine.",
        "Extrapyramidal symptoms more with typical/high-potency agents; hyperprolactinemia with risperidone.",
        "Aripiprazole partial agonist — activating; akathisia common.",
        "Black box: increased mortality in elderly with dementia-related psychosis.",
      ],
      guidelines: [APA_THERAPEUTIC, FDA_LABELING],
      monitoring: "Metabolic panel, weight, EPS, QTc if risk factors.",
    },
  },
  {
    match: (d) => /benzodiazepine|z-drug|non-benzodiazepine hypnotic/i.test(d.therapeuticClass),
    merge: {
      pearls: [
        "Short-term use preferred — dependence, tolerance, withdrawal seizures if stopped abruptly.",
        "Contraindicated/co-caution with opioids (respiratory depression — FDA boxed warning).",
        "Use lowest effective dose in elderly (Beers criteria — fall risk).",
      ],
      guidelines: [FDA_LABELING, APA_THERAPEUTIC],
      contraindications: "Acute narrow-angle glaucoma (most); severe respiratory insufficiency; sleep apnea with opioids.",
      monitoring: "Sedation, falls, dependence; avoid driving until effect known.",
    },
  },
  {
    match: (d) => /cns stimulant/i.test(d.therapeuticClass),
    merge: {
      pearls: [
        "Schedule II — abuse/diversion risk; avoid in structural cardiac disease, symptomatic arrhythmia.",
        "Take early in day to reduce insomnia; appetite suppression common.",
        "Baseline and periodic BP/HR; consider holidays/drug-free periods in stable ADHD.",
      ],
      guidelines: [FDA_LABELING, AAP_PEDIATRICS],
      monitoring: "Height/weight in children, BP, HR, sleep, mood.",
    },
  },
  {
    match: (d) =>
      /contraceptive|progestin-only pill|combined hormonal|levonorgestrel|etonogestrel|norethindrone|medroxyprogesterone/i.test(
        `${d.therapeuticClass} ${d.generic} ${d.brand}`
      ),
    merge: {
      pearls: [
        "Combined OCP: contraindicated if migraine with aura, VTE history, smoker >35, uncontrolled HTN (ACOG).",
        "Progestin-only/LARC options when estrogen contraindicated (lactation, VTE risk).",
        "Enzyme inducers (rifampin, carbamazepine, modafinil) ↓ efficacy — backup method needed.",
      ],
      guidelines: [ACOG_MATERNAL, FDA_LABELING],
      counseling: "Daily timing (COC/POP); report leg swelling, chest pain, severe headache.",
      monitoring: "BP, breakthrough bleeding, VTE symptoms.",
    },
  },
  {
    match: (d) =>
      /magnesium sulfate|oxytocin|misoprostol|labetalol|hydralazine|methotrexate/i.test(d.generic) &&
      /eclampsia|preeclampsia|postpartum|labor|ectopic|uterotonic|tocolytic|hemorrhage|pregnancy/i.test(
        `${d.indications} ${d.therapeuticClass}`
      ),
    merge: {
      pearls: [
        "Severe preeclampsia/eclampsia: magnesium sulfate for seizure prophylaxis — monitor reflexes, RR, urine output.",
        "Postpartum hemorrhage: oxytocin first-line uterotonic; misoprostol if oxytocin unavailable.",
        "Hydralazine/labetalol for acute severe hypertension in pregnancy per ACOG protocols.",
        "Methotrexate for ectopic pregnancy — teratogen; strict contraception & folate antagonism counseling.",
      ],
      guidelines: [ACOG_MATERNAL, FDA_LABELING],
      monitoring: "Mag: DTRs, RR, Mg level; PPH: fundal tone, bleeding; BP with antihypertensives.",
    },
  },
  {
    match: (d) => /folic acid|folate/i.test(d.generic),
    merge: {
      pearls: [
        "ACOG: 400–800 mcg daily in reproductive-age women planning/conceiving — neural tube defect prevention.",
        "Higher doses (4 mg) if prior NTD-affected pregnancy or high-risk anticonvulsant use.",
        "Masks B12 deficiency anemia — ensure B12 adequate in macrocytosis workup.",
      ],
      guidelines: [ACOG_MATERNAL, FDA_LABELING],
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
