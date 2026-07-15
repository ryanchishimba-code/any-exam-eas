/**
 * Central authority map for Anatomy Explorer disease → drug threads.
 * Citations come only from guideline-registry (no free-form invented sources).
 */
import type { ExamReference } from "@/lib/exam-prep/types";
import {
  ACC_AHA_CV,
  ADA_STANDARDS,
  AHA_ASA_STROKE,
  AHA_HF,
  APA_THERAPEUTIC,
  ATA_THYROID,
  CDC_INFECTION,
  CHEST_ANTITHROMBOTIC,
  FDA_LABELING,
  GINA_ASTHMA,
  GOLD_COPD,
  IDSA_INFECTION,
  ISMP_MED_SAFETY,
  KDIGO_CKD,
  SURVIVING_SEPSIS,
} from "@/lib/exam-prep/guideline-registry";
import type { AnatomyDiseaseLink, AnatomyEvidenceLevel } from "./types";

const VERIFIED_AT = "2026-07-15";

type AuthoritySpec = {
  guidelines: ExamReference[];
  evidenceLevel?: AnatomyEvidenceLevel;
};

/** Explicit diseaseId → society/FDA authorities. */
export const DISEASE_GUIDELINE_MAP: Record<string, AuthoritySpec> = {
  "primary-hypothyroidism": { guidelines: [ATA_THYROID, FDA_LABELING] },
  "hyperthyroidism-graves": { guidelines: [ATA_THYROID, FDA_LABELING] },
  "thyroid-cancer-suppression": { guidelines: [ATA_THYROID, FDA_LABELING] },
  "type-2-diabetes": { guidelines: [ADA_STANDARDS, ACC_AHA_CV, FDA_LABELING] },
  "type-1-diabetes": { guidelines: [ADA_STANDARDS, ISMP_MED_SAFETY, FDA_LABELING] },
  "heart-failure-hfref": { guidelines: [AHA_HF, ACC_AHA_CV, FDA_LABELING] },
  "stemi-acs": { guidelines: [ACC_AHA_CV, FDA_LABELING] },
  "hypertension-essential": { guidelines: [ACC_AHA_CV, FDA_LABELING] },
  "atrial-fibrillation-stroke": { guidelines: [ACC_AHA_CV, AHA_ASA_STROKE, FDA_LABELING] },
  "hyperlipidemia-ascvd": { guidelines: [ACC_AHA_CV, FDA_LABELING] },
  "copd-chronic": { guidelines: [GOLD_COPD, FDA_LABELING] },
  "asthma-bronchospasm": { guidelines: [GINA_ASTHMA, FDA_LABELING] },
  "community-pneumonia": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "pulmonary-embolism": { guidelines: [CHEST_ANTITHROMBOTIC, ACC_AHA_CV, FDA_LABELING] },
  "aki-prerenal": { guidelines: [KDIGO_CKD, FDA_LABELING] },
  "uti-uncomplicated": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "gerd-reflux": { guidelines: [FDA_LABELING] },
  "bph-lut": { guidelines: [FDA_LABELING] },
  "adrenal-insufficiency": { guidelines: [FDA_LABELING] },
  "ischemic-stroke-brain": { guidelines: [AHA_ASA_STROKE, ACC_AHA_CV, FDA_LABELING] },
  "seizure-epilepsy": { guidelines: [FDA_LABELING, ISMP_MED_SAFETY] },
  "infective-endocarditis": { guidelines: [IDSA_INFECTION, ACC_AHA_CV, FDA_LABELING] },
  "bacterial-meningitis": { guidelines: [IDSA_INFECTION, CDC_INFECTION, FDA_LABELING] },
  "acute-appendicitis": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "acute-cholecystitis": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "peptic-ulcer-disease": { guidelines: [FDA_LABELING, IDSA_INFECTION] },
  "liver-cirrhosis": { guidelines: [FDA_LABELING] },
  "acute-pancreatitis": { guidelines: [FDA_LABELING] },
  "diverticulitis": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "crohn-disease": { guidelines: [FDA_LABELING] },
  "ulcerative-colitis": { guidelines: [FDA_LABELING] },
  "nephrolithiasis": { guidelines: [KDIGO_CKD, FDA_LABELING] },
  "acute-bacterial-prostatitis": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "open-fracture-infection": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "pneumothorax": { guidelines: [FDA_LABELING] },
  "carotid-stenosis": { guidelines: [AHA_ASA_STROKE, ACC_AHA_CV, FDA_LABELING] },
  "cushing-syndrome": { guidelines: [FDA_LABELING] },
  "pheochromocytoma": { guidelines: [FDA_LABELING, ACC_AHA_CV] },
  "primary-hyperaldosteronism": { guidelines: [ACC_AHA_CV, FDA_LABELING] },
  "musculoskeletal-pain-nsaid": { guidelines: [FDA_LABELING, ISMP_MED_SAFETY] },
  "hiatal-hernia-gerd": { guidelines: [FDA_LABELING] },
  "cavernous-sinus-thrombosis": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "epidural-hematoma": { guidelines: [AHA_ASA_STROKE, FDA_LABELING] },
  "subdural-hematoma": { guidelines: [AHA_ASA_STROKE, FDA_LABELING] },
  "uncal-herniation": { guidelines: [FDA_LABELING] },
  "spinal-epidural-abscess": { guidelines: [IDSA_INFECTION, FDA_LABELING] },
  "cord-compression": { guidelines: [FDA_LABELING] },
  "cauda-equina-syndrome": { guidelines: [FDA_LABELING] },
  "viral-hepatitis": { guidelines: [IDSA_INFECTION, CDC_INFECTION, FDA_LABELING] },
  "sepsis-like": { guidelines: [SURVIVING_SEPSIS, IDSA_INFECTION] },
};

function inferGuidelinesFromText(link: AnatomyDiseaseLink): ExamReference[] {
  const blob = `${link.name} ${link.pathologyLabel ?? ""} ${link.pathophysiology}`.toLowerCase();
  const refs: ExamReference[] = [];
  const push = (r: ExamReference) => {
    if (!refs.some((x) => x.label === r.label)) refs.push(r);
  };

  if (/diabet|insulin|a1c|hypoglyc/.test(blob)) push(ADA_STANDARDS);
  if (/heart failure|hfref|gdmt|acs|stemi|hypertension|lipid|ascvd|afib|atrial/.test(blob))
    push(ACC_AHA_CV);
  if (/heart failure|hfref/.test(blob)) push(AHA_HF);
  if (/stroke|tia|carotid|thrombolysis|nihss/.test(blob)) push(AHA_ASA_STROKE);
  if (/copd|emphysema|chronic bronchitis/.test(blob)) push(GOLD_COPD);
  if (/asthma|bronchospasm/.test(blob)) push(GINA_ASTHMA);
  if (/pneumonia|meningitis|endocarditis|abscess|uti|prostatitis|sepsis|hepatitis|cellulitis/.test(blob))
    push(IDSA_INFECTION);
  if (/aki|ckd|nephro|kidney|creatinine|egfr/.test(blob)) push(KDIGO_CKD);
  if (/pe |pulmonary embol|dvt|vte|anticoagul/.test(blob)) push(CHEST_ANTITHROMBOTIC);
  if (/thyroid|graves|hashimoto|myxedema/.test(blob)) push(ATA_THYROID);
  if (/depress|anxiety|psych|ssri|antipsych/.test(blob)) push(APA_THERAPEUTIC);
  if (/infection control|isolation|meningococcus/.test(blob)) push(CDC_INFECTION);
  push(FDA_LABELING);
  return refs;
}

function dedupeGuidelines(refs: ExamReference[]): ExamReference[] {
  const seen = new Set<string>();
  const out: ExamReference[] = [];
  for (const r of refs) {
    const key = r.label;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

/** Attach guidelines / evidenceLevel / verifiedAt to a disease link. */
export function enrichDiseaseLinkWithAuthorities(link: AnatomyDiseaseLink): AnatomyDiseaseLink {
  if (link.generated) {
    return {
      ...link,
      evidenceLevel: "auto-matched",
      guidelines: link.guidelines?.length ? dedupeGuidelines(link.guidelines) : [FDA_LABELING],
    };
  }

  const mapped = DISEASE_GUIDELINE_MAP[link.id];
  const guidelines = dedupeGuidelines([
    ...(link.guidelines ?? []),
    ...(mapped?.guidelines ?? []),
    ...(!mapped && !link.guidelines?.length ? inferGuidelinesFromText(link) : []),
  ]);

  const evidenceLevel: AnatomyEvidenceLevel =
    link.evidenceLevel ??
    mapped?.evidenceLevel ??
    (guidelines.some((g) => g.label !== FDA_LABELING.label) ? "guideline" : "labeling");

  return {
    ...link,
    guidelines,
    evidenceLevel,
    verifiedAt: link.verifiedAt ?? (link.highYield ? VERIFIED_AT : link.verifiedAt),
  };
}

export function enrichDiseaseLinksWithAuthorities(
  links: AnatomyDiseaseLink[]
): AnatomyDiseaseLink[] {
  return links.map(enrichDiseaseLinkWithAuthorities);
}
