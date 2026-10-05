/**
 * Topic ids and field labels for the browser.
 * The subject modules in registry.ts also carry prompts, validators, and seed
 * audits. Importing those from a client component pulls that graph into the
 * page's first-load JavaScript. This file only reads the topic lists.
 */
import { normalizeFieldId } from "./field-ids";
import { AANP_FNP_SUBJECTS } from "./aanp-fnp/subjects";
import { USMLE_STEP_1_SUBJECTS, USMLE_STEP_2_SUBJECTS } from "./medicine/subject-splits";
import { NURSING_SUBJECTS } from "./nursing/subjects";
import { NPTE_PT_SUBJECTS } from "./npte-pt/subjects";
import { PANCE_SUBJECTS } from "./pance/subjects";
import { PHARMACY_SUBJECTS } from "./pharmacy/subjects";
import type { SubjectArea } from "./types";

const MEDICINE_OER_DOMAINS = [
  "openstax.org",
  "med.libretexts.org",
  "nih.gov",
  "ncbi.nlm.nih.gov",
  "cdc.gov",
];

export type PracticeFieldMeta = {
  id: string;
  label: string;
  category: "professional" | "stem";
  oerDomains: string[];
  examFocus: string;
  topicPlaceholder: string;
  boardExam: string;
};

/** Same boards, in the same order, as getRegisteredSubjectIds(). */
export const PRACTICE_FIELD_META: PracticeFieldMeta[] = [
  {
    id: "nursing",
    label: "NCLEX",
    category: "professional",
    boardExam: "NCLEX",
    examFocus:
      "NCLEX prioritization, safety, infection control, pharmacology, med-surg, maternal-child, psychosocial care",
    topicPlaceholder: "Select NCLEX category (e.g. Pharmacological Therapies)",
    oerDomains: ["openstax.org", "openrn.org", "med.libretexts.org", "nih.gov", "cdc.gov"],
  },
  {
    id: "usmle-step-1",
    label: "USMLE Step 1",
    category: "professional",
    boardExam: "USMLE Step 1",
    examFocus:
      "basic sciences — anatomy, physiology, pathology, pharmacology, biochemistry, microbiology & immunology",
    topicPlaceholder: "Select a Step 1 subject area (e.g. Pathology, Pharmacology)",
    oerDomains: MEDICINE_OER_DOMAINS,
  },
  {
    id: "usmle-step-2",
    label: "USMLE Step 2",
    category: "professional",
    boardExam: "USMLE Step 2 CK",
    examFocus:
      "clinical sciences — cardiology, pulmonology, nephrology, neurology, internal medicine, pediatrics, OB/GYN, psychiatry, emergency medicine",
    topicPlaceholder: "Select a Step 2 subject area (e.g. Cardiology, Pediatrics)",
    oerDomains: MEDICINE_OER_DOMAINS,
  },
  {
    id: "usmle-step-3",
    label: "USMLE Step 3",
    category: "professional",
    boardExam: "USMLE Step 3",
    examFocus:
      "ambulatory & inpatient management, biostatistics, ethics, abstracts, pharmaceutical ads, CCS-style case simulations",
    topicPlaceholder: "Select Step 3 area (e.g. Internal Medicine, Biostatistics)",
    oerDomains: MEDICINE_OER_DOMAINS,
  },
  {
    id: "pharmacy",
    label: "NAPLEX",
    category: "professional",
    boardExam: "NAPLEX",
    examFocus:
      "pharmacokinetics, pharmacodynamics, drug interactions, dosing, compounding, patient counseling, therapeutic classes",
    topicPlaceholder: "Select NAPLEX area (e.g. Cardiovascular Pharmacotherapy)",
    oerDomains: ["chem.libretexts.org", "med.libretexts.org", "nih.gov", "fda.gov"],
  },
  {
    id: "pance",
    label: "PANCE",
    category: "professional",
    boardExam: "PANCE",
    examFocus:
      "NCCPA blueprint — cardiovascular, pulmonary, GI, MSK, ID, neurology, psychiatry, reproductive, endocrine, EENT, hematology, renal, dermatology, GU, professional practice",
    topicPlaceholder: "Select a PANCE system (e.g. Cardiovascular, Pulmonary)",
    oerDomains: MEDICINE_OER_DOMAINS,
  },
  {
    id: "aanp-fnp",
    label: "AANP FNP",
    category: "professional",
    boardExam: "AANP FNP-C",
    examFocus:
      "primary care across the lifespan — assessment, diagnosis, plan, evaluate; pharmacology; women's health; pediatrics; geriatrics",
    topicPlaceholder: "Select FNP area (e.g. Assess, Plan, Cardiovascular)",
    oerDomains: ["openrn.org", "openstax.org", "cdc.gov", "nih.gov"],
  },
  {
    id: "npte-pt",
    label: "NPTE-PT",
    category: "professional",
    boardExam: "NPTE-PT",
    examFocus:
      "FSBPT blueprint — musculoskeletal, neuromuscular, cardiopulmonary, other body systems, modalities, equipment, safety, ethics, EBP",
    topicPlaceholder: "Select a content area (e.g. Musculoskeletal, Neuromuscular)",
    oerDomains: MEDICINE_OER_DOMAINS,
  },
];

const SUBJECTS_BY_FIELD: Record<string, SubjectArea[]> = {
  nursing: NURSING_SUBJECTS,
  "usmle-step-1": USMLE_STEP_1_SUBJECTS,
  "usmle-step-2": USMLE_STEP_2_SUBJECTS,
  // Step 3 reuses the Step 2 clinical subject list.
  "usmle-step-3": USMLE_STEP_2_SUBJECTS,
  pharmacy: PHARMACY_SUBJECTS,
  pance: PANCE_SUBJECTS,
  "aanp-fnp": AANP_FNP_SUBJECTS,
  "npte-pt": NPTE_PT_SUBJECTS,
};

/** Topic list for one board. Unknown ids use the Step 2 list, matching the registry. */
export function getSubjectsForFieldId(fieldId: string): SubjectArea[] {
  const id = normalizeFieldId(fieldId);
  return SUBJECTS_BY_FIELD[id] ?? SUBJECTS_BY_FIELD["usmle-step-2"]!;
}

export function getSubjectArea(fieldId: string, subjectId: string): SubjectArea | undefined {
  const needle = subjectId.toLowerCase();
  return getSubjectsForFieldId(fieldId).find(
    (subject) => subject.id === subjectId || subject.label.toLowerCase() === needle
  );
}
