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
};
