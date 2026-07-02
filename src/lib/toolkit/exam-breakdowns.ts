import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { examMarketingPath } from "@/lib/seo/exam-config";
import {
  NAPLEX_CONTENT_OUTLINE,
  NAPLEX_HIGH_YIELD_FOCUS_AREAS,
  NAPLEX_OUTLINE_SOURCE,
} from "@/lib/exam-prep/naplex/content-outline";
import {
  NPTE_PT_BODY_SYSTEMS,
  NPTE_PT_EXAM_DOMAINS,
  NPTE_PT_HIGH_YIELD_FOCUS_AREAS,
  NPTE_PT_OUTLINE_SOURCE,
} from "@/lib/exam-prep/npte-pt/content-outline";

export type ToolkitExamBreakdown = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  prepHref: string;
  /** Short summary for SEO / JSON-LD. */
  whatItTests: string;
  duration: string;
  questions: string;
  /** Expand-panel bullets — scannable exam facts. */
  detailBullets: string[];
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
    detailBullets: [
      "Step 1 — basic science foundations for safe medical practice (~280 MCQs, 8 hours)",
      "Step 2 CK — clinical knowledge for supervised patient care (~316 MCQs, 9 hours)",
      "Step 3 — unsupervised practice, management, and CCS cases (two-day format)",
      "Computer-based, single-best-answer format across all steps",
    ],
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
    detailBullets: [
      "Next Gen NCLEX (NGN) — clinical judgment and case-study items",
      "Client Needs: management of care, safety, pharmacology, and more",
      "Computer-adaptive length — 85 to 150 items, up to 5 hours",
      "Required for RN licensure in the U.S. and Canada",
    ],
    officialBoard: { label: "nclex.com", href: "https://www.nclex.com" },
  },
  {
    id: "naplex",
    title: "NAPLEX",
    subtitle: "North American Pharmacist Licensure Examination",
    accent: EXAM_ACCENTS.naplex,
    prepHref: examMarketingPath("naplex"),
    whatItTests:
      "Assesses safe and effective pharmacy practice across five NABP content domains — from calculations and PK/PD through medication use, guideline-based treatment planning, professional practice, and pharmacy management.",
    duration: "6 hours",
    questions: "225 questions (200 scored, 25 pretest)",
    detailBullets: [
      ...NAPLEX_CONTENT_OUTLINE.map(
        (d) => `${d.label} (${d.weightLabel}) — ${d.summary.split("—")[0]?.trim() ?? d.summary}`
      ),
      `High-yield: ${NAPLEX_HIGH_YIELD_FOCUS_AREAS.slice(0, 3).join("; ")}`,
      "225 items over 6 hours (200 scored + 25 pretest)",
      NAPLEX_OUTLINE_SOURCE,
    ],
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
    detailBullets: [
      "Organ-system and task-based blueprint (cardiovascular, pulmonary, etc.)",
      "Single-best-answer multiple choice — 300 questions, 5 hours",
      "Entry-level competency for physician assistant practice",
      "Administered by NCCPA for PA certification",
    ],
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
    detailBullets: [
      "AANPCB domains: Assess, Diagnose, Plan, and Evaluate",
      "Primary care across the lifespan — newborn through older adult",
      "150 items in 3 hours (135 scored + 15 pretest)",
      "Certifies Family Nurse Practitioners (FNP-BC)",
    ],
    officialBoard: { label: "aanpcert.org", href: "https://www.aanpcert.org" },
  },
  {
    id: "npte-pt",
    title: "NPTE-PT",
    subtitle: "National Physical Therapy Examination for Physical Therapists",
    accent: EXAM_ACCENTS.nptePt,
    prepHref: examMarketingPath("npte-pt"),
    whatItTests:
      "Assesses entry-level competence in physical therapy — examination, evaluation, diagnosis, prognosis, intervention, and safety across the lifespan.",
    duration: "5 hours",
    questions: "250 multiple-choice questions (180 scored + 70 pretest)",
    detailBullets: [
      ...NPTE_PT_EXAM_DOMAINS.map(
        (d) => `${d.label} (${d.weightLabel}) — ${d.summary.split("—")[0]?.trim() ?? d.summary}`
      ),
      `High-yield systems: ${NPTE_PT_BODY_SYSTEMS.slice(0, 2).map((s) => s.label).join(" & ")} (~52% combined)`,
      `Focus: ${NPTE_PT_HIGH_YIELD_FOCUS_AREAS.slice(0, 2).join("; ")}`,
      "250 MCQs over 5 hours (180 scored + 70 pretest)",
      NPTE_PT_OUTLINE_SOURCE,
    ],
    officialBoard: { label: "fsbpt.org", href: "https://www.fsbpt.org" },
  },
];
