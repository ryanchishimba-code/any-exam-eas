import type { DrugEnrichment } from "./types";

/** Drug-specific high-yield overlays (merged after class rules). */
export const DRUG_ENRICHMENT_OVERLAYS: Record<string, Partial<DrugEnrichment>> = {
  semaglutide: {
    pearls: [
      "Ozempic SQ weekly (T2DM); Wegovy higher dose (obesity); Rybelsus oral daily — take on empty stomach with ≤4 oz water.",
      "SELECT trial: semaglutide reduces MACE in T2DM with established ASCVD.",
      "Start 0.25 mg weekly × 4 weeks before titrating — reduces GI dropout.",
    ],
    counseling: "Rotate injection sites; oral form: wait 30 min before food/drink/other meds.",
  },
  tirzepatide: {
    pearls: [
      "Start 2.5 mg weekly × 4 weeks, then titrate per label — GI side effects peak early.",
      "Mounjaro (T2DM) vs Zepbound (obesity) — same molecule, different indications/dosing paths.",
      "Do not substitute with GLP-1 mono-agonist pens without prescriber order.",
    ],
  },
  liraglutide: {
    pearls: [
      "Victoza daily for T2DM; Saxenda higher dose for weight — LEADER trial CV benefit (Victoza).",
      "Daily injection vs weekly semaglutide/dulaglutide — adherence counseling matters.",
    ],
  },
  dulaglutide: {
    pearls: [
      "REWIND trial: CV benefit in T2DM with and without established ASCVD.",
      "Single-dose weekly pen — no dose adjustment for mild renal impairment.",
    ],
  },
  exenatide: {
    pearls: [
      "Byetta BID before meals; Bydureon weekly ER — renal limits for Byetta (eGFR <30 avoid).",
      "First GLP-1 RA class prototype — know short- vs long-acting formulations.",
    ],
  },
  lixisenatide: {
    pearls: [
      "Once daily within 1 h before first meal; often combined with basal insulin (LixiLan).",
      "Hypoglycemia risk increases when paired with insulin or sulfonylurea — dose adjustment may be needed.",
    ],
  },
  albiglutide: {
    pearls: [
      "Withdrawn US market 2018 — still tested for GLP-1 fusion-protein class comparison.",
    ],
  },
  metformin: {
    pearls: [
      "Extended-release may improve GI tolerance; take with food.",
      "Safe in many CKD stages at reduced dose — do not use if eGFR <30.",
    ],
  },
  empagliflozin: {
    pearls: [
      "EMPEROR-Reduced/HFpEF and EMPA-REG OUTCOME — HF and CV mortality benefit beyond glucose.",
    ],
  },
  dapagliflozin: {
    pearls: [
      "DAPA-HF / DELIVER — SGLT2i benefit in HFrEF and HFpEF regardless of diabetes status.",
    ],
  },
  apixaban: {
    pearls: [
      "ARISTOTLE: apixaban vs warfarin in AF — less intracranial hemorrhage; dose-reduce if ≥2 of: age ≥80, weight ≤60 kg, Cr ≥1.5.",
    ],
  },
  atorvastatin: {
    pearls: [
      "High-intensity statin (40–80 mg) for clinical ASCVD; 10–20 mg moderate intensity in primary prevention by risk.",
    ],
  },
  lisinopril: {
    pearls: [
      "Once-daily ACE-I; dry cough in ~10% — switch to ARB if intolerable.",
    ],
  },
  sertraline: {
    pearls: [
      "First-line SSRI for depression, PTSD, panic — favorable drug interaction profile vs paroxetine/fluoxetine.",
      "Start 25–50 mg daily; titrate every 1–2 weeks; max 200 mg/day.",
    ],
  },
  escitalopram: {
    pearls: [
      "S-enantiomer of citalopram — generally 10–20 mg daily for MDD/GAD.",
      "QT prolongation at high doses — avoid >20 mg if elderly or on other QT drugs.",
    ],
  },
  citalopram: {
    pearls: [
      "FDA max 40 mg/day (20 mg if age >60, hepatic impairment, or QTc risk).",
      "More QT concern than escitalopram at equivalent doses.",
    ],
  },
  fluoxetine: {
    pearls: [
      "Long half-life (active metabolite) — less discontinuation syndrome; CYP2D6 inhibitor.",
      "Activating SSRI — may worsen insomnia; useful in atypical depression with fatigue.",
    ],
  },
  paroxetine: {
    pearls: [
      "Most anticholinergic SSRI — weight gain, dry mouth; worst discontinuation syndrome.",
      "Teratogenic (cardiac defects) — avoid in pregnancy if alternatives exist.",
    ],
  },
  duloxetine: {
    pearls: [
      "FDA-approved for diabetic peripheral neuropathy and fibromyalgia — SNRI pain indication.",
      "Avoid with uncontrolled narrow-angle glaucoma; hepatic impairment limits use.",
    ],
  },
  venlafaxine: {
    pearls: [
      "Dose-dependent NE effect — monitor BP at ≥150 mg/day.",
      "Taper over weeks — discontinuation syndrome if stopped abruptly.",
    ],
  },
  bupropion: {
    pearls: [
      "No sexual dysfunction or weight gain — good adjunct for SSRI-induced sexual SE.",
      "Contraindicated in bulimia/anorexia (seizure risk); max 450 mg/day.",
    ],
  },
  trazodone: {
    pearls: [
      "Low-dose (25–100 mg) commonly used for insomnia; priapism is urologic emergency.",
      "Sedating — orthostatic hypotension in elderly.",
    ],
  },
  quetiapine: {
    pearls: [
      "Low-dose (25–100 mg) sedating for insomnia (off-label) — metabolic effects still apply.",
      "Monitor fasting glucose and lipids; orthostatic hypotension on initiation.",
    ],
  },
  aripiprazole: {
    pearls: [
      "Partial D2 agonist — less weight gain than olanzapine/quetiapine; akathisia common.",
      "Long half-life — slow titration; used as MDD adjunct at lower doses.",
    ],
  },
  alprazolam: {
    pearls: [
      "Short half-life — high dependence potential; avoid long-term daily use.",
      "Never combine with opioids — respiratory depression risk.",
    ],
  },
  lorazepam: {
    pearls: [
      "Preferred benzo in hepatic impairment (no active metabolites) — status epilepticus, alcohol withdrawal.",
      "IV/IM routes for acute agitation/seizures in hospital settings.",
    ],
  },
  clonazepam: {
    pearls: [
      "Long half-life — panic disorder and absence/myoclonic seizures.",
      "Taper slowly — withdrawal seizures if discontinued abruptly.",
    ],
  },
  methylphenidate: {
    pearls: [
      "First-line ADHD stimulant — IR vs ER formulations for school/work coverage.",
      "Schedule II — monthly prescriptions in many states; growth monitoring in children.",
    ],
  },
  amoxicillin: {
    pearls: [
      "First-line otitis media, strep pharyngitis, H. pylori triple therapy component.",
      "Maculopapular rash if misdiagnosed mono (EBV) — not always true allergy.",
    ],
  },
  azithromycin: {
    pearls: [
      "Z-Pak: 500 mg day 1 then 250 mg days 2–5 — atypical pneumonia, MAC prophylaxis in HIV.",
      "QT prolongation — caution with other QT drugs and baseline long QT.",
    ],
  },
  doxycycline: {
    pearls: [
      "Tick-borne illness (Lyme, ehrlichiosis), chlamydia, MRSA skin — take with full glass of water upright.",
      "Avoid in pregnancy and children <8 (bone/tooth discoloration); photosensitivity counseling.",
    ],
  },
  cephalexin: {
    pearls: [
      "First-gen cephalosporin for uncomplicated SSTI, strep pharyritis if no PCN allergy.",
      "~1–10% cross-reactivity with penicillin allergy — assess severity of prior reaction.",
    ],
  },
  ciprofloxacin: {
    pearls: [
      "Fluoroquinolone black box: tendon rupture, peripheral neuropathy, CNS effects — reserve for when alternatives fail.",
      "Avoid in uncomplicated UTI/strep when other options exist (stewardship).",
    ],
  },
  "sulfamethoxazole-trimethoprim": {
    pearls: [
      "First-line uncomplicated UTI; PCP prophylaxis in HIV; MRSA skin (community).",
      "Hyperkalemia (especially with ACE-I/ARBs), SJS/TEN, renal crystal precipitation — hydrate well.",
    ],
  },
  metronidazole: {
    pearls: [
      "Anaerobic coverage, C. diff, trichomoniasis, H. pylori — disulfiram-like reaction with alcohol.",
      "Metallic taste common; avoid alcohol during and 48 h after course.",
    ],
  },
  warfarin: {
    pearls: [
      "Vitamin K antagonist — INR 2–3 most indications; frequent drug/food interactions.",
      "Teratogenic — contraindicated in pregnancy; use LMWH for anticoagulation in pregnancy.",
    ],
  },
  hydralazine: {
    pearls: [
      "IV hydralazine or labetalol for acute severe HTN in pregnancy per ACOG.",
      "Drug-induced lupus-like syndrome with long-term use — ANA positive arthralgias.",
    ],
  },
  labetalol: {
    pearls: [
      "First-line oral/IV agent for chronic and acute HTN in pregnancy — α+β block.",
      "Neonatal bradycardia/hypoglycemia if used near delivery — pediatric team awareness.",
    ],
  },
  "folic-acid": {
    pearls: [
      "400 mcg daily preconception through first trimester — spina bifida/anencephaly prevention.",
      "Co-administer with methotrexate for RA (different dose) — do not confuse indications.",
    ],
  },
  "magnesium-sulfate": {
    pearls: [
      "Loading 4–6 g IV then 1–2 g/h for eclampsia seizure prophylaxis — lose DTRs = stop/redose.",
      "Antidote: calcium gluconate for magnesium toxicity (respiratory depression).",
    ],
  },
  oxytocin: {
    pearls: [
      "Labor induction/augmentation — titrate to contraction pattern; risk of uterine hyperstimulation.",
      "Postpartum hemorrhage: 10–40 units in 1 L crystalloid after delivery.",
    ],
  },
  misoprostol: {
    pearls: [
      "PPH: 800–1000 mcg rectally if oxytocin insufficient; cervical ripening off-label obstetric use.",
      "Abortifacient — contraindicated in wanted pregnancy; GI cramping/diarrhea common.",
    ],
  },
  "ethinyl-estradiol-levonorgestrel": {
    pearls: [
      "Combined OCP — take same time daily; 7-day backup if ≥2 pills missed (product-specific).",
      "Smoking + age >35 = absolute contraindication (VTE, stroke risk).",
    ],
  },
  medroxyprogesterone: {
    pearls: [
      "Depo-Provera q12 weeks — delayed return to fertility; bone density loss with prolonged use.",
      "No estrogen — option when COC contraindicated.",
    ],
  },
};
