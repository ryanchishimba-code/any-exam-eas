import type { MemoryCard } from "./types";

export type MemoryCardSourceMeta = {
  sourceLabel: string;
  sourceUrl?: string;
  lastReviewedAt?: string;
};

/** Curated citations keyed by memory card id — applied at load time in seeds/index.ts */
export const MEMORY_CARD_SOURCES: Record<string, MemoryCardSourceMeta> = {
  // NAPLEX
  "naplex-hf-four-pillars": {
    sourceLabel: "ACC/AHA Heart Failure Guideline — GDMT pillars",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-arni-washout": {
    sourceLabel: "FDA sacubitril/valsartan labeling — ACEi washout",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-loop-diuretics": {
    sourceLabel: "OpenStax Nursing Pharmacology — diuretics",
    sourceUrl: "https://openstax.org/books/nursing-pharmacology",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-bb-start-rule": {
    sourceLabel: "ACC/AHA HFrEF — beta-blocker initiation",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-k-hyperkalemia": {
    sourceLabel: "KDIGO / clinical hyperkalemia management",
    sourceUrl: "https://kdigo.org/",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-sglt2i-periop-dka": {
    sourceLabel: "FDA SGLT2 inhibitor labeling — DKA risk",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-digoxin-toxicity": {
    sourceLabel: "OpenStax Nursing Pharmacology — digoxin",
    sourceUrl: "https://openstax.org/books/nursing-pharmacology",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-reversal-chart": {
    sourceLabel: "ASHP / anticoagulation reversal references",
    sourceUrl: "https://www.ashp.org/",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-hit-rule": {
    sourceLabel: "ACCP antithrombotic therapy — HIT",
    sourceUrl: "https://www.chestnet.org/guidelines-and-topic-collections",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-doac-renal-dose": {
    sourceLabel: "FDA DOAC prescribing information — renal dosing",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-warfarin-vs-doac": {
    sourceLabel: "ACC/AHA anticoagulation guidance",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-ufh-lmwh-monitor": {
    sourceLabel: "OpenStax Nursing Pharmacology — heparins",
    sourceUrl: "https://openstax.org/books/nursing-pharmacology",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-bridge-therapy": {
    sourceLabel: "ACCP perioperative anticoagulation",
    sourceUrl: "https://www.chestnet.org/guidelines-and-topic-collections",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-insulin-kinetics": {
    sourceLabel: "ADA Standards of Care — insulin",
    sourceUrl: "https://diabetesjournals.org/care/issue/47/Supplement_1",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-metformin-hold": {
    sourceLabel: "FDA metformin labeling — contrast / surgery hold",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-hypoglycemia-15-15": {
    sourceLabel: "ADA hypoglycemia rule of 15",
    sourceUrl: "https://diabetes.org/",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-sglt2i-counseling": {
    sourceLabel: "FDA SGLT2i patient counseling — genital infections",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "naplex-abx-spectrum-ladder": {
    sourceLabel: "Sanford Guide — beta-lactam spectrum",
    sourceUrl: "https://www.sanfordguide.com/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-cap-empiric": {
    sourceLabel: "IDSA/ATS Community-Acquired Pneumonia Guideline",
    sourceUrl: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-mrsa-agents": {
    sourceLabel: "IDSA MRSA Clinical Practice Guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/mrsa/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-daptomycin-lung-trap": {
    sourceLabel: "FDA daptomycin labeling — not indicated for pneumonia",
    sourceUrl: "https://www.accessdata.fda.gov/scripts/cder/daf/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-pseudomonas-coverage": {
    sourceLabel: "Sanford Guide — Pseudomonas coverage",
    sourceUrl: "https://www.sanfordguide.com/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-uti-pyelonephritis": {
    sourceLabel: "IDSA Uncomplicated UTI & Pyelonephritis Guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/uncomplicated-cystitis-and-pyelonephritis/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-cdiff-treatment": {
    sourceLabel: "IDSA/SHEA C. difficile Clinical Practice Guideline",
    sourceUrl: "https://www.idsociety.org/practice-guideline/clostridioides-difficile/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-penicillin-allergy": {
    sourceLabel: "CDC — penicillin allergy delabeling",
    sourceUrl: "https://www.cdc.gov/antibiotic-use/hcp/core-elements/index.html",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-aminoglycoside-pae": {
    sourceLabel: "Sanford Guide — aminoglycoside dosing",
    sourceUrl: "https://www.sanfordguide.com/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-fq-boxed-warnings": {
    sourceLabel: "FDA fluoroquinolone safety labeling",
    sourceUrl: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-advises-restricting-fluoroquinolone-antibiotics",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-vanc-auc": {
    sourceLabel: "IDSA vancomycin therapeutic monitoring — AUC/MIC 400–600",
    sourceUrl: "https://www.idsociety.org/practice-guideline/vancomycin-therapeutic-monitoring/",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-hiv-oi-prophylaxis": {
    sourceLabel: "NIH HIV OI prevention guidelines",
    sourceUrl: "https://hivinfo.nih.gov/guidelines/html/4/adult-and-adolescent-opportunistic-infection-guideline/0",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-art-first-line": {
    sourceLabel: "NIH DHHS HIV treatment guidelines",
    sourceUrl: "https://hivinfo.nih.gov/guidelines/html/1/adult-and-adolescent-arv/0",
    lastReviewedAt: "2026-06-07",
  },
  "naplex-abx-renal-dosing": {
    sourceLabel: "Sanford Guide — renal dose adjustments",
    sourceUrl: "https://www.sanfordguide.com/",
    lastReviewedAt: "2026-06-07",
  },
  // NCLEX infection control
  "nclex-precaution-types": {
    sourceLabel: "CDC isolation precautions",
    sourceUrl: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/",
    lastReviewedAt: "2026-06-07",
  },
  "nclex-cdiff-soap": {
    sourceLabel: "CDC C. diff infection prevention",
    sourceUrl: "https://www.cdc.gov/c-diff/hcp/prevention/index.html",
    lastReviewedAt: "2026-06-07",
  },
  "nclex-mrsa-contact": {
    sourceLabel: "CDC HAI — MRSA prevention",
    sourceUrl: "https://www.cdc.gov/mrsa/healthcare/index.html",
    lastReviewedAt: "2026-06-07",
  },
  "nclex-vanc-red-man": {
    sourceLabel: "FDA vancomycin labeling — infusion rate",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-07",
  },
  "nclex-vanc-trough": {
    sourceLabel: "IDSA vancomycin therapeutic monitoring",
    sourceUrl: "https://www.idsociety.org/practice-guideline/vancomycin-therapeutic-monitoring/",
    lastReviewedAt: "2026-06-07",
  },
  "nclex-neutropenic-precautions": {
    sourceLabel: "NCCN / oncology neutropenia guidelines",
    sourceUrl: "https://www.nccn.org/",
    lastReviewedAt: "2026-06-07",
  },
  "nclex-peak-trough-labs": {
    sourceLabel: "OpenStax Nursing Pharmacology — therapeutic drug monitoring",
    sourceUrl: "https://openstax.org/books/nursing-pharmacology",
    lastReviewedAt: "2026-06-07",
  },
  // USMLE infectious disease
  "usmle-mrsa-agents": {
    sourceLabel: "IDSA MRSA guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/mrsa/",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-daptomycin-lung-trap": {
    sourceLabel: "FDA daptomycin labeling",
    sourceUrl: "https://www.accessdata.fda.gov/scripts/cder/daf/",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-vanc-dosing": {
    sourceLabel: "IDSA vancomycin AUC/MIC monitoring",
    sourceUrl: "https://www.idsociety.org/practice-guideline/vancomycin-therapeutic-monitoring/",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-cdiff-treatment": {
    sourceLabel: "IDSA/SHEA C. difficile guideline",
    sourceUrl: "https://www.idsociety.org/practice-guideline/clostridioides-difficile/",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-hiv-oi-prophylaxis": {
    sourceLabel: "NIH HIV OI prevention guidelines",
    sourceUrl: "https://hivinfo.nih.gov/guidelines/html/4/adult-and-adolescent-opportunistic-infection-guideline/0",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-abx-spectrum": {
    sourceLabel: "Sanford Guide — antimicrobial spectrum",
    sourceUrl: "https://www.sanfordguide.com/",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-febrile-neutropenia": {
    sourceLabel: "IDSA febrile neutropenia guideline",
    sourceUrl: "https://www.idsociety.org/practice-guideline/neutropenic-fever/",
    lastReviewedAt: "2026-06-07",
  },
  "usmle-crcl-dosing": {
    sourceLabel: "NKF — Cockcroft-Gault for drug dosing",
    sourceUrl: "https://www.kidney.org/",
    lastReviewedAt: "2026-06-07",
  },
  // NCLEX critical care
  "nclex-sepsis-bundle": {
    sourceLabel: "Surviving Sepsis Campaign — Hour-1 bundle",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-shock-types": {
    sourceLabel: "Open RN Nursing Skills — shock types",
    sourceUrl: "https://openrn.ecampusontario.ca/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-lactate-four": {
    sourceLabel: "Surviving Sepsis Campaign — lactate-guided resuscitation",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-norepinephrine-first": {
    sourceLabel: "Surviving Sepsis — first-line vasopressor",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-qsofa-screen": {
    sourceLabel: "Sepsis-3 / qSOFA bedside screening",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-abx-one-hour": {
    sourceLabel: "Surviving Sepsis — antibiotics within 1 hour",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-sepsis-vs-shock": {
    sourceLabel: "Sepsis-3 definitions — infection vs septic shock",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-perfusion-endpoints": {
    sourceLabel: "Surviving Sepsis — perfusion targets",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  // USMLE
  "usmle-stemi-path": {
    sourceLabel: "ACC/AHA ACS — STEMI reperfusion",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-acs-spectrum": {
    sourceLabel: "ACC/AHA ACS — UA/NSTEMI/STEMI",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-acs-antithrombotics": {
    sourceLabel: "ACC/AHA ACS — DAPT and anticoagulation",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-stroke-tpa": {
    sourceLabel: "AHA/ASA acute ischemic stroke guidelines",
    sourceUrl: "https://www.stroke.org/",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-hyperkalemia": {
    sourceLabel: "KDIGO / emergency hyperkalemia management",
    sourceUrl: "https://kdigo.org/",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-aki-fena": {
    sourceLabel: "KDIGO AKI guideline — FeNa / prerenal vs ATN",
    sourceUrl: "https://kdigo.org/",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-dka-orders": {
    sourceLabel: "ADA Standards of Care — DKA management",
    sourceUrl: "https://diabetesjournals.org/care/issue/47/Supplement_1",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-hhs-vs-dka": {
    sourceLabel: "ADA — HHS vs DKA differentiation",
    sourceUrl: "https://diabetesjournals.org/care/issue/47/Supplement_1",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-cap-antibiotics": {
    sourceLabel: "IDSA/ATS community-acquired pneumonia guideline",
    sourceUrl: "https://www.idsociety.org/",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-meningitis-emergency": {
    sourceLabel: "IDSA bacterial meningitis guidelines",
    sourceUrl: "https://www.idsociety.org/",
    lastReviewedAt: "2026-06-01",
  },
  "usmle-tpa-exclusions": {
    sourceLabel: "AHA/ASA stroke — IV alteplase contraindications",
    sourceUrl: "https://www.stroke.org/",
    lastReviewedAt: "2026-06-01",
  },
  // NCLEX delegation
  "nclex-five-rights": {
    sourceLabel: "NCSBN National Council — delegation model",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-never-delegate": {
    sourceLabel: "NCSBN delegation decision tree",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-scope-rn-lpn-uap": {
    sourceLabel: "NCSBN scope of practice — RN/LPN/UAP",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-stable-unstable": {
    sourceLabel: "NCSBN delegation — stable vs unstable client",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-supervision-eval": {
    sourceLabel: "NCSBN — supervision and evaluation of delegated care",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-delegation-decision-tree": {
    sourceLabel: "NCSBN delegation decision-making model",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "nclex-delegation": {
    sourceLabel: "NCSBN RN accountability in delegation",
    sourceUrl: "https://www.ncsbn.org/",
    lastReviewedAt: "2026-06-01",
  },
  // MPJE
  "mpje-cii-rules": {
    sourceLabel: "DEA Controlled Substances Act — Schedule II",
    sourceUrl: "https://www.dea.gov/drug-information/csa",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-schedules": {
    sourceLabel: "DEA drug scheduling",
    sourceUrl: "https://www.dea.gov/drug-information/csa",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-recordkeeping": {
    sourceLabel: "DEA 21 CFR Part 1304 — records and inventories",
    sourceUrl: "https://www.dea.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-transfer-rules": {
    sourceLabel: "DEA prescription transfer requirements",
    sourceUrl: "https://www.dea.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-partial-fill-ciii": {
    sourceLabel: "DEA partial dispensing rules by schedule",
    sourceUrl: "https://www.dea.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-expired-rx": {
    sourceLabel: "DEA / state Rx validity windows",
    sourceUrl: "https://www.dea.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-otp-basics": {
    sourceLabel: "SAMHSA OTP regulations — methadone maintenance",
    sourceUrl: "https://www.samhsa.gov/medications-substance-use-disorders",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-dea-registration": {
    sourceLabel: "DEA Form 224 — pharmacy registration",
    sourceUrl: "https://www.dea.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-pseudoephedrine": {
    sourceLabel: "Combat Methamphetamine Epidemic Act (CMEA)",
    sourceUrl: "https://www.deadiversion.usdoj.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-interstate-transfer": {
    sourceLabel: "NABP / state board interstate practice standards",
    sourceUrl: "https://nabp.pharmacy/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-inspection-citations": {
    sourceLabel: "State board pharmacy inspection standards",
    sourceUrl: "https://nabp.pharmacy/",
    lastReviewedAt: "2026-06-01",
  },
  "mpje-confidentiality": {
    sourceLabel: "HIPAA pharmacy privacy — minimum necessary",
    sourceUrl: "https://www.hhs.gov/hipaa",
    lastReviewedAt: "2026-06-01",
  },
  // Cross-exam
  "all-creatinine-clearance": {
    sourceLabel: "Cockcroft-Gault equation — FDA renal dosing references",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "all-anion-gap": {
    sourceLabel: "OpenStax Anatomy & Physiology — acid-base",
    sourceUrl: "https://openstax.org/books/anatomy-and-physiology",
    lastReviewedAt: "2026-06-01",
  },
};

export function enrichMemoryCard(card: MemoryCard): MemoryCard {
  const meta = MEMORY_CARD_SOURCES[card.id];
  if (!meta) return card;
  return {
    ...card,
    sourceLabel: meta.sourceLabel,
    sourceUrl: meta.sourceUrl,
    lastReviewedAt: meta.lastReviewedAt ?? card.lastReviewedAt,
  };
}

export function enrichMemoryCards(cards: MemoryCard[]): MemoryCard[] {
  return cards.map(enrichMemoryCard);
}
