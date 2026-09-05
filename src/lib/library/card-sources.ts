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
  // PANCE (NCCPA clinical reference)
  "pance-hypertension-first-line": {
    sourceLabel: "ACC/AHA hypertension guideline — first-line therapy",
    sourceUrl: "https://www.acc.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-acs-reperfusion": {
    sourceLabel: "ACC/AHA ACS — STEMI reperfusion windows",
    sourceUrl: "https://www.acc.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-diabetes-a1c-targets": {
    sourceLabel: "ADA Standards of Care — glycemic targets",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-01",
  },
  "pance-sepsis-bundle": {
    sourceLabel: "Surviving Sepsis Campaign — Hour-1 bundle",
    sourceUrl: "https://www.sccm.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-febrile-infant-workup": {
    sourceLabel: "AAP febrile infant evaluation guidelines",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-exacerbation": {
    sourceLabel: "GOLD COPD — exacerbation management",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-depression-screening": {
    sourceLabel: "USPSTF depression screening recommendations",
    sourceUrl: "https://www.uspreventiveservicestaskforce.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-prenatal-initial-visit": {
    sourceLabel: "ACOG initial prenatal visit essentials",
    sourceUrl: "https://www.acog.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-informed-consent": {
    sourceLabel: "AMA Code of Medical Ethics — informed consent",
    sourceUrl: "https://www.ama-assn.org/",
    lastReviewedAt: "2026-06-01",
  },
  // PANCE prescriber law & deep-dive cards
  "pance-stemi-recognition": {
    sourceLabel: "ACC/AHA ACS — STEMI ECG criteria",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "pance-nstemi-management": {
    sourceLabel: "ACC/AHA NSTE-ACS guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "pance-acs-dual-antiplatelet": {
    sourceLabel: "ACC/AHA DAPT in ACS",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "pance-inferior-mi-rv": {
    sourceLabel: "ACC/AHA — RV infarction management",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "pance-acs-heparin-timing": {
    sourceLabel: "ACC/AHA ACS anticoagulation",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-01",
  },
  "pance-qsofa-screen": {
    sourceLabel: "Surviving Sepsis Campaign — qSOFA",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "pance-lactate-resuscitation": {
    sourceLabel: "Surviving Sepsis Campaign — lactate monitoring",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "pance-shock-pressor-first": {
    sourceLabel: "Surviving Sepsis Campaign — vasopressors",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "pance-sepsis-source-control": {
    sourceLabel: "Surviving Sepsis Campaign — source control",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "pance-fluid-resuscitation-caution": {
    sourceLabel: "Surviving Sepsis Campaign — fluid resuscitation",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-01",
  },
  "pance-cap-outpatient": {
    sourceLabel: "IDSA/ATS CAP guideline — outpatient",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-cap-inpatient": {
    sourceLabel: "IDSA/ATS CAP guideline — inpatient",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-mrsa-therapy": {
    sourceLabel: "IDSA MRSA guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-meningitis-empiric": {
    sourceLabel: "IDSA bacterial meningitis guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-cdiff-oral-therapy": {
    sourceLabel: "IDSA/SHEA C. difficile guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-uti-pyelonephritis": {
    sourceLabel: "IDSA UTI/pyelonephritis guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-metformin-contraindications": {
    sourceLabel: "ADA Standards of Care — metformin",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-01",
  },
  "pance-dka-management": {
    sourceLabel: "ADA Standards of Care — DKA",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-01",
  },
  "pance-hypoglycemia-rule-15-15": {
    sourceLabel: "ADA hypoglycemia management",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-01",
  },
  "pance-sglt2-heart-failure": {
    sourceLabel: "ADA — SGLT2 inhibitors cardiorenal benefit",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-01",
  },
  "pance-insulin-basal-bolus": {
    sourceLabel: "ADA insulin therapy recommendations",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-oxygen-target": {
    sourceLabel: "GOLD COPD — oxygen therapy",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-steroid-duration": {
    sourceLabel: "GOLD COPD — exacerbation steroids",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-abx-indication": {
    sourceLabel: "GOLD COPD — antibiotic indications",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-nippv": {
    sourceLabel: "GOLD COPD — NIPPV in acute failure",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-inhaler-technique": {
    sourceLabel: "GOLD COPD — inhaler technique",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-copd-gold-staging": {
    sourceLabel: "GOLD COPD report — staging and therapy",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-cii-prescribing": {
    sourceLabel: "DEA Controlled Substances Act — Schedule II prescribing",
    sourceUrl: "https://www.dea.gov/drug-information/csa",
    lastReviewedAt: "2026-06-01",
  },
  "pance-csa-schedules": {
    sourceLabel: "DEA drug scheduling",
    sourceUrl: "https://www.dea.gov/drug-information/csa",
    lastReviewedAt: "2026-06-01",
  },
  "pance-cii-validity": {
    sourceLabel: "DEA / state Rx validity windows",
    sourceUrl: "https://www.deadiversion.usdoj.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-pdmp-epcs": {
    sourceLabel: "DEA EPCS and state PDMP requirements",
    sourceUrl: "https://www.deadiversion.usdoj.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-opioid-risk-screen": {
    sourceLabel: "CDC opioid prescribing guideline",
    sourceUrl: "https://www.cdc.gov/opioids/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-pa-dea-registration": {
    sourceLabel: "DEA practitioner registration",
    sourceUrl: "https://www.deadiversion.usdoj.gov/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-hipaa-phi-minimum": {
    sourceLabel: "HHS HIPAA — minimum necessary",
    sourceUrl: "https://www.hhs.gov/hipaa",
    lastReviewedAt: "2026-06-01",
  },
  "pance-chronic-opioid-agreement": {
    sourceLabel: "CDC chronic pain management",
    sourceUrl: "https://www.cdc.gov/opioids/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-benzodiazepine-opioid-risk": {
    sourceLabel: "FDA boxed warning — benzodiazepines and opioids",
    sourceUrl: "https://www.fda.gov/drugs",
    lastReviewedAt: "2026-06-01",
  },
  "pance-mat-buprenorphine-basics": {
    sourceLabel: "SAMHSA medication-assisted treatment",
    sourceUrl: "https://www.samhsa.gov/medications-substance-use-disorders",
    lastReviewedAt: "2026-06-01",
  },
  "pance-error-disclosure": {
    sourceLabel: "AMA Code of Medical Ethics — disclosure",
    sourceUrl: "https://www.ama-assn.org/",
    lastReviewedAt: "2026-06-01",
  },
  "pance-consent-controlled-procedures": {
    sourceLabel: "AMA informed consent for procedures",
    sourceUrl: "https://www.ama-assn.org/",
    lastReviewedAt: "2026-06-01",
  },
  // AANP FNP (AANPCB content outline + clinical guidelines)
  "fnp-hypertension-first-line": {
    sourceLabel: "ACC/AHA hypertension guideline — first-line therapy",
    sourceUrl: "https://www.acc.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diabetes-intensification": {
    sourceLabel: "ADA Standards of Care — pharmacologic therapy",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-depression-screening": {
    sourceLabel: "USPSTF depression screening recommendations",
    sourceUrl: "https://www.uspreventiveservicestaskforce.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-pediatric-immunization": {
    sourceLabel: "CDC Advisory Committee on Immunization Practices",
    sourceUrl: "https://www.cdc.gov/vaccines/hcp/imz-schedules/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-stemi-reperfusion": {
    sourceLabel: "ACC/AHA ACS — STEMI reperfusion",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-chest-pain-next-step": {
    sourceLabel: "ACC/AHA chest pain evaluation guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-nstemi-medical-therapy": {
    sourceLabel: "ACC/AHA NSTE-ACS guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-lipid-primary-prevention": {
    sourceLabel: "ACC/AHA cholesterol guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-hf-gdmt-basics": {
    sourceLabel: "ACC/AHA heart failure guideline — GDMT",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-atrial-fib-rate-control": {
    sourceLabel: "ACC/AHA atrial fibrillation guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-metformin-monitoring": {
    sourceLabel: "ADA Standards of Care — metformin",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-a1c-targets": {
    sourceLabel: "ADA Standards of Care — glycemic targets",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-insulin-basal-bolus": {
    sourceLabel: "ADA insulin therapy recommendations",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-sglt2-benefits": {
    sourceLabel: "ADA — SGLT2 inhibitors cardiorenal benefit",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-hypoglycemia-15-15": {
    sourceLabel: "ADA hypoglycemia management",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-dka-vs-hhs": {
    sourceLabel: "ADA Standards of Care — hyperglycemic crises",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-sepsis-hour-one": {
    sourceLabel: "Surviving Sepsis Campaign — Hour-1 bundle",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-qsofa-screen": {
    sourceLabel: "Surviving Sepsis Campaign — qSOFA",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-abx-timing": {
    sourceLabel: "Surviving Sepsis — antibiotics within 1 hour",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-lactate-trend": {
    sourceLabel: "Surviving Sepsis — lactate monitoring",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-pressor-norepi": {
    sourceLabel: "Surviving Sepsis — first-line vasopressor",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-source-control": {
    sourceLabel: "Surviving Sepsis — source control",
    sourceUrl: "https://www.sccm.org/survivingsepsiscampaign",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-cap-outpatient": {
    sourceLabel: "IDSA/ATS CAP guideline — outpatient",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-uti-pyelonephritis": {
    sourceLabel: "IDSA UTI/pyelonephritis guidelines",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-strep-pharyngitis": {
    sourceLabel: "IDSA group A streptococcal pharyngitis guideline",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-mrsa-skin": {
    sourceLabel: "IDSA MRSA skin and soft tissue infection guideline",
    sourceUrl: "https://www.idsociety.org/practice-guideline/mrsa/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-hiv-prep-basics": {
    sourceLabel: "CDC HIV PrEP clinical practice guideline",
    sourceUrl: "https://www.cdc.gov/hiv/clinicians/clinical-guidelines/prep/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-adult-vaccine-catchup": {
    sourceLabel: "CDC adult immunization schedule",
    sourceUrl: "https://www.cdc.gov/vaccines/hcp/imz-schedules/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-assess-screening-uspstf": {
    sourceLabel: "USPSTF A/B recommended screenings",
    sourceUrl: "https://www.uspreventiveservicestaskforce.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-assess-febrile-infant": {
    sourceLabel: "AAP febrile infant evaluation guidelines",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-assess-prenatal-labs": {
    sourceLabel: "ACOG initial prenatal visit essentials",
    sourceUrl: "https://www.acog.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-assess-red-flag-chest": {
    sourceLabel: "ACC/AHA chest pain evaluation — red flags",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-assess-geriatric-falls": {
    sourceLabel: "AGS clinical practice guideline — fall prevention",
    sourceUrl: "https://www.americangeriatrics.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-assess-next-best-test": {
    sourceLabel: "AANPCB FNP Content Outline — assessment domain",
    sourceUrl: "https://www.aanpcert.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-plan-asthma-step": {
    sourceLabel: "NAEPP asthma guideline — step therapy",
    sourceUrl: "https://www.nhlbi.nih.gov/health-topics/asthma",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-plan-contraception": {
    sourceLabel: "CDC U.S. Medical Eligibility Criteria for Contraceptive Use",
    sourceUrl: "https://www.cdc.gov/contraception/hcp/usmec/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-plan-antibiotic-duration": {
    sourceLabel: "IDSA antimicrobial stewardship recommendations",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-plan-referral-triggers": {
    sourceLabel: "AANPCB FNP Content Outline — scope and referral",
    sourceUrl: "https://www.aanpcert.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-plan-scope-limits": {
    sourceLabel: "AANPCB FNP scope of practice",
    sourceUrl: "https://www.aanpcert.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-plan-copd-exacerbation": {
    sourceLabel: "GOLD COPD — exacerbation management",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-beers-criteria": {
    sourceLabel: "AGS Beers Criteria for potentially inappropriate medications",
    sourceUrl: "https://www.americangeriatrics.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-delirium-workup": {
    sourceLabel: "AGS clinical practice guideline — delirium",
    sourceUrl: "https://www.americangeriatrics.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-falls-prevention": {
    sourceLabel: "AGS fall prevention in older adults",
    sourceUrl: "https://www.americangeriatrics.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-polypharmacy-deprescribe": {
    sourceLabel: "AGS deprescribing guidance",
    sourceUrl: "https://www.americangeriatrics.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-dementia-workup": {
    sourceLabel: "Alzheimer's Association / AAN dementia evaluation",
    sourceUrl: "https://www.alz.org/professionals/healthcare-professionals",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-advance-directives": {
    sourceLabel: "AMA Code of Medical Ethics — advance care planning",
    sourceUrl: "https://www.ama-assn.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-febrile-neonate": {
    sourceLabel: "AAP febrile infant — neonatal fever management",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-febrile-3-36-months": {
    sourceLabel: "AAP febrile infant 3–36 months guideline",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-development-milestones": {
    sourceLabel: "Bright Futures — developmental surveillance",
    sourceUrl: "https://www.aap.org/en/patient-care/bright-futures/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-adolescent-confidentiality": {
    sourceLabel: "AAP adolescent confidentiality and HEADSS assessment",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-asthma-pediatric": {
    sourceLabel: "NAEPP pediatric asthma guideline",
    sourceUrl: "https://www.nhlbi.nih.gov/health-topics/asthma",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-otitis-media-treatment": {
    sourceLabel: "AAP acute otitis media clinical practice guideline",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diagnose-differential-priority": {
    sourceLabel: "AANPCB FNP Content Outline — diagnose domain",
    sourceUrl: "https://www.aanpcert.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diagnose-chest-pain-ddx": {
    sourceLabel: "ACC/AHA chest pain evaluation guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diagnose-fever-source": {
    sourceLabel: "AAP febrile child evaluation guidelines",
    sourceUrl: "https://www.aap.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diagnose-delirium-vs-dementia": {
    sourceLabel: "AGS clinical practice guideline — delirium",
    sourceUrl: "https://www.americangeriatrics.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diagnose-headache-red-flags": {
    sourceLabel: "AAN headache red flags in primary care",
    sourceUrl: "https://www.aan.com/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-diagnose-msk-low-back": {
    sourceLabel: "ACP low back pain guideline",
    sourceUrl: "https://www.acponline.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-evaluate-a1c-interval": {
    sourceLabel: "ADA Standards of Care — monitoring",
    sourceUrl: "https://diabetesjournals.org/care",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-evaluate-ssri-follow-up": {
    sourceLabel: "APA depression treatment guidelines",
    sourceUrl: "https://www.psychiatry.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-evaluate-htn-recheck": {
    sourceLabel: "ACC/AHA hypertension follow-up recommendations",
    sourceUrl: "https://www.acc.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-evaluate-statin-monitoring": {
    sourceLabel: "ACC/AHA cholesterol guideline — statin safety",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-evaluate-adherence-first": {
    sourceLabel: "AANPCB FNP Content Outline — evaluate domain",
    sourceUrl: "https://www.aanpcert.org/",
    lastReviewedAt: "2026-06-16",
  },
  "fnp-evaluate-cap-follow-up": {
    sourceLabel: "IDSA/ATS CAP guideline — response assessment",
    sourceUrl: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    lastReviewedAt: "2026-06-16",
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
  // NAPLEX — controlled substances & DEA law
  "naplex-csa-schedules": {
    sourceLabel: "DEA Pharmacist's Manual — CSA schedules",
    sourceUrl: "https://www.deadiversion.usdoj.gov/pubs/manuals/pharm2/pharm_content.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-cii-refill-quantity": {
    sourceLabel: "DEA Pharmacist's Manual — Schedule II rules",
    sourceUrl: "https://www.deadiversion.usdoj.gov/pubs/manuals/pharm2/pharm_content.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-cii-emergency-fill": {
    sourceLabel: "21 CFR 1306.11 — emergency CII dispensing",
    sourceUrl: "https://www.deadiversion.usdoj.gov/21cfr/cfr/1306/1306_11.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-cii-partial-fill": {
    sourceLabel: "DEA Pharmacist's Manual — partial fills",
    sourceUrl: "https://www.deadiversion.usdoj.gov/pubs/manuals/pharm2/pharm_content.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-cs-transfer-refills": {
    sourceLabel: "21 CFR 1306.25 — transfer of CIII–V refills",
    sourceUrl: "https://www.deadiversion.usdoj.gov/21cfr/cfr/1306/1306_25.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-cs-recordkeeping": {
    sourceLabel: "DEA Pharmacist's Manual — records & inventory",
    sourceUrl: "https://www.deadiversion.usdoj.gov/pubs/manuals/pharm2/pharm_content.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-corresponding-responsibility": {
    sourceLabel: "21 CFR 1306.04 — corresponding responsibility",
    sourceUrl: "https://www.deadiversion.usdoj.gov/21cfr/cfr/1306/1306_04.htm",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-glp1-counseling": {
    sourceLabel: "ADA Standards of Care — pharmacotherapy",
    sourceUrl: "https://diabetesjournals.org/care/issue",
    lastReviewedAt: "2026-06-16",
  },
  "naplex-u500-sick-day": {
    sourceLabel: "ISMP High-Alert Medications list",
    sourceUrl: "https://www.ismp.org/recommendations/high-alert-medications-acute-list",
    lastReviewedAt: "2026-06-16",
  },
  // NPTE-PT
  "npte-rotator-cuff-testing": {
    sourceLabel: "APTA Clinical Practice Guidelines",
    sourceUrl: "https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs",
    lastReviewedAt: "2026-06-16",
  },
  "npte-lumbar-red-flags": {
    sourceLabel: "APTA Low Back Pain CPG",
    sourceUrl: "https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs",
    lastReviewedAt: "2026-06-16",
  },
  "npte-tka-precautions": {
    sourceLabel: "APTA Clinical Practice Guidelines",
    sourceUrl: "https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs",
    lastReviewedAt: "2026-06-16",
  },
  "npte-stroke-gait": {
    sourceLabel: "APTA ANPT Locomotor CPG",
    sourceUrl: "https://www.neuropt.org/practice-resources/anpt-clinical-practice-guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "npte-sci-autonomic": {
    sourceLabel: "Consortium for Spinal Cord Medicine",
    sourceUrl: "https://pva.org/research-resources/publications/",
    lastReviewedAt: "2026-06-16",
  },
  "npte-parkinson-cues": {
    sourceLabel: "APTA ANPT Parkinson Disease CPG",
    sourceUrl: "https://www.neuropt.org/practice-resources/anpt-clinical-practice-guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "npte-copd-breathing": {
    sourceLabel: "GOLD COPD Report",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-16",
  },
  "npte-copd-oxygen": {
    sourceLabel: "GOLD COPD Report",
    sourceUrl: "https://goldcopd.org/",
    lastReviewedAt: "2026-06-16",
  },
  "npte-us-contraindications": {
    sourceLabel: "APTA Practice Resources",
    sourceUrl: "https://www.apta.org/patient-care",
    lastReviewedAt: "2026-06-16",
  },
  "npte-cane-side": {
    sourceLabel: "APTA Practice Resources",
    sourceUrl: "https://www.apta.org/patient-care",
    lastReviewedAt: "2026-06-16",
  },
  "npte-fall-risk-tug": {
    sourceLabel: "CDC STEADI Initiative",
    sourceUrl: "https://www.cdc.gov/steadi/",
    lastReviewedAt: "2026-06-16",
  },
  "npte-referral-scope": {
    sourceLabel: "FSBPT NPTE Content Outline",
    sourceUrl: "https://www.fsbpt.org/free-resources/npte/npte-test-content-outline",
    lastReviewedAt: "2026-06-16",
  },
  // USMLE deep-dive reinforcement
  "usmle-thyroid-storm": {
    sourceLabel: "ATA Hyperthyroidism Guidelines",
    sourceUrl: "https://www.thyroid.org/professionals/ata-professional-guidelines/",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-adrenal-crisis": {
    sourceLabel: "Endocrine Society Adrenal Insufficiency CPG",
    sourceUrl: "https://www.endocrine.org/clinical-practice-guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-hyponatremia-siadh": {
    sourceLabel: "European hyponatremia clinical practice guidelines",
    sourceUrl: "https://academic.oup.com/ndt/article/29/suppl_2/i1/1904553",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-hypomagnesemia-hypokalemia": {
    sourceLabel: "OpenStax Anatomy & Physiology — electrolytes",
    sourceUrl: "https://openstax.org/books/anatomy-and-physiology",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-sah-workup": {
    sourceLabel: "AHA/ASA Stroke Guidelines",
    sourceUrl: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000211",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-status-epilepticus": {
    sourceLabel: "Neurocritical Care Society SE Guideline",
    sourceUrl: "https://www.neurocriticalcare.org/resources/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-acs-post-mi-complications": {
    sourceLabel: "ACC/AHA STEMI/NSTEMI Guidelines",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-acs-rv-infarct": {
    sourceLabel: "ACC/AHA STEMI Guidelines — RV infarction",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-acs-secondary-prevention": {
    sourceLabel: "ACC/AHA Secondary Prevention Guideline",
    sourceUrl: "https://www.acc.org/guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-myxedema-coma": {
    sourceLabel: "ATA Hypothyroidism Guidelines",
    sourceUrl: "https://www.thyroid.org/professionals/ata-professional-guidelines/",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-pheochromocytoma": {
    sourceLabel: "Endocrine Society Pheochromocytoma CPG",
    sourceUrl: "https://www.endocrine.org/clinical-practice-guidelines",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-rhabdomyolysis": {
    sourceLabel: "OpenStax Anatomy & Physiology — muscle & kidney",
    sourceUrl: "https://openstax.org/books/anatomy-and-physiology",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-contrast-nephropathy": {
    sourceLabel: "KDIGO Acute Kidney Injury Guideline",
    sourceUrl: "https://kdigo.org/guidelines/acute-kidney-injury/",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-ich-management": {
    sourceLabel: "AHA/ASA Spontaneous ICH Guideline",
    sourceUrl: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000407",
    lastReviewedAt: "2026-06-16",
  },
  "usmle-wernicke-thiamine": {
    sourceLabel: "OpenStax Anatomy & Physiology — nervous system",
    sourceUrl: "https://openstax.org/books/anatomy-and-physiology",
    lastReviewedAt: "2026-06-16",
  },
};

export function enrichMemoryCard(card: MemoryCard): MemoryCard {
  const meta = MEMORY_CARD_SOURCES[card.id];
  if (!meta) {
    if (card.sourceLabel?.trim()) return card;
    return {
      ...card,
      sourceLabel: `${card.examSlug.toUpperCase()} board-review memory card`,
      lastReviewedAt: card.lastReviewedAt ?? "2026-09-05",
    };
  }
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
