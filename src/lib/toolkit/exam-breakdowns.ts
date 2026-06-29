import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { examMarketingPath } from "@/lib/seo/exam-config";

export type ToolkitExamBreakdown = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  prepHref: string;
  whatItTests: string;
  duration: string;
  questions: string;
  officialBoard: { label: string; href: string };
};

export const TOOLKIT_EXAMS: ToolkitExamBreakdown[] = [
  {
    id: "usmle",
    title: "USMLE (Step 1, Step 2 CK, & Step 3)",
    subtitle: "U.S. Medical Licensing Examination",
    accent: EXAM_ACCENTS.usmle,
    prepHref: examMarketingPath("usmle"),
    whatItTests:
      "Tests your ability to apply basic sciences (Step 1), clinical knowledge for patient care (Step 2 CK), and unsupervised practice readiness including management and CCS cases (Step 3).",
    duration: "Step 1: 8 hours | Step 2 CK: 9 hours | Step 3: Two days (~7 + 9 hours)",
    questions: "Step 1: ~280 MCQs | Step 2 CK: ~316–318 MCQs | Step 3: ~412 MCQs + 13–14 CCS cases",
    officialBoard: { label: "usmle.org", href: "https://www.usmle.org" },
  },
  {
    id: "nclex",
    title: "NCLEX-RN",
    subtitle: "National Council Licensure Examination for Registered Nurses",
    accent: EXAM_ACCENTS.nclex,
    prepHref: examMarketingPath("nclex"),
    whatItTests:
      "Measures clinical judgment, safe and effective care, health promotion, psychosocial integrity, and physiological integrity using the Next Generation NCLEX format with case studies.",
    duration: "Up to 5 hours",
    questions: "85 to 150 items (includes clinical judgment case studies)",
    officialBoard: { label: "nclex.com", href: "https://www.nclex.com" },
  },
  {
    id: "naplex",
    title: "NAPLEX",
    subtitle: "North American Pharmacist Licensure Examination",
    accent: EXAM_ACCENTS.naplex,
    prepHref: examMarketingPath("naplex"),
    whatItTests:
      "Assesses your ability to apply knowledge in safe and effective pharmacy practice — from pharmacotherapy and drug information to patient safety and calculations.",
    duration: "6 hours",
    questions: "225 questions (200 scored, 25 pretest)",
    officialBoard: { label: "nabp.pharmacy", href: "https://nabp.pharmacy" },
  },
  {
    id: "pance",
    title: "PANCE",
    subtitle: "Physician Assistant National Certifying Exam",
    accent: EXAM_ACCENTS.pance,
    prepHref: examMarketingPath("pance"),
    whatItTests:
      "Evaluates medical knowledge across organ systems and task areas needed for entry-level physician assistant practice.",
    duration: "5 hours",
    questions: "300 multiple-choice questions",
    officialBoard: { label: "nccpa.net", href: "https://www.nccpa.net" },
  },
  {
    id: "aanp-fnp",
    title: "AANP FNP",
    subtitle: "Family Nurse Practitioner Certification Exam",
    accent: EXAM_ACCENTS.aanpFnp,
    prepHref: examMarketingPath("aanp-fnp"),
    whatItTests:
      "Focuses on clinical knowledge for family nurse practitioners — assessment, diagnosis, planning, and evaluation across the patient lifespan.",
    duration: "3 hours",
    questions: "150 questions (135 scored)",
    officialBoard: { label: "aanpcert.org", href: "https://www.aanpcert.org" },
  },
  {
    id: "npte-pt",
    title: "NPTE-PT",
    subtitle: "National Physical Therapy Examination for Physical Therapists",
    accent: EXAM_ACCENTS.nptePt,
    prepHref: examMarketingPath("npte-pt"),
    whatItTests:
      "Assesses entry-level competence in physical therapy practice, including evaluation, diagnosis, prognosis, intervention, and safety.",
    duration: "5 hours",
    questions: "225 multiple-choice questions (180 scored)",
    officialBoard: { label: "fsbpt.org", href: "https://www.fsbpt.org" },
  },
];
