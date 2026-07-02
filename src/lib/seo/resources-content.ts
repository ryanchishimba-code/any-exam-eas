import type { ExamSeoKey } from "@/lib/seo/exam-config";
import {
  NAPLEX_CONTENT_OUTLINE,
  NAPLEX_HIGH_YIELD_FOCUS_AREAS,
  NAPLEX_OUTLINE_SOURCE,
  NAPLEX_PLATFORM_STUDY_FEATURES,
} from "@/lib/exam-prep/naplex/content-outline";
import {
  PANCE_HIGH_YIELD_FOCUS_AREAS,
  PANCE_KNOWLEDGE_AREAS,
  PANCE_OUTLINE_SOURCE,
  PANCE_PLATFORM_STUDY_FEATURES,
} from "@/lib/exam-prep/pance/content-outline";
import {
  seoSixBoardTrialParagraph,
  seoTrialHeading,
  seoTrialResourceParagraph,
  seoTrialTryNclexHeading,
} from "@/lib/seo/trial-copy";

export type ResourceDownload = {
  slug: string;
  title: string;
  description: string;
  examTags: ExamSeoKey[];
  signupHref: string;
};

export type ResourceArticle = {
  slug: string;
  title: string;
  metaDescription: string;
  examTags: ExamSeoKey[];
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  primaryExam?: ExamSeoKey;
};

export const RESOURCE_DOWNLOADS: ResourceDownload[] = [
  {
    slug: "lab-values-cheat-sheet",
    title: "Normal Lab Values Cheat Sheet (PDF)",
    description:
      "Printable reference for CBC, BMP, LFTs, coagulation, and ABG normals — ideal for NCLEX, USMLE, PANCE, and FNP prep.",
    examTags: ["nclex", "usmle", "pance", "aanp-fnp"],
    signupHref: "/signup?plan=trial&tier=pro&utm_source=resources&utm_content=lab-values",
  },
  {
    slug: "six-board-study-planner",
    title: "6-Board Study Planner (Printable)",
    description:
      "Weekly planner template for students juggling NCLEX, USMLE, NAPLEX, PANCE, FNP, or NPTE study blocks.",
    examTags: ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"],
    signupHref: "/signup?plan=trial&tier=pro&utm_source=resources&utm_content=study-planner",
  },
  {
    slug: "top-pharmacy-drugs-list",
    title: "Top 503 High-Yield Drugs List",
    description:
      "Access the interactive Top 503 Drugs deck with generic/brand, class, MOA, and adverse effects — included with every plan.",
    examTags: ["naplex", "nclex", "usmle", "pance", "aanp-fnp"],
    signupHref: "/signup?plan=trial&tier=pro&utm_source=resources&utm_content=top-drugs",
  },
];

function article(
  partial: Omit<
    ResourceArticle,
    "keywords" | "readingMinutes" | "intro" | "sections" | "publishedAt" | "updatedAt"
  > &
    Partial<
      Pick<
        ResourceArticle,
        "keywords" | "readingMinutes" | "intro" | "sections" | "publishedAt" | "updatedAt"
      >
    >
): ResourceArticle {
  return {
    ...partial,
    keywords: partial.keywords ?? [],
    readingMinutes: partial.readingMinutes ?? 6,
    intro: partial.intro ?? "",
    sections: partial.sections ?? [],
    publishedAt: partial.publishedAt ?? "2026-01-15",
    updatedAt: partial.updatedAt ?? "2026-06-01",
  };
}

/** SEO resource articles — 18 guides targeting high-intent exam keywords. */
export const RESOURCE_ARTICLES: ResourceArticle[] = [
  article({
    slug: "best-nclex-practice-questions-2026",
    title: "Best NCLEX Practice Questions in 2026 (Free Trial + Roadmap)",
    metaDescription:
      "Compare what makes high-quality NCLEX practice questions in 2026 — NGN formats, clinical judgment, and how AnyExamEasy bundles NCLEX with five other boards.",
    examTags: ["nclex"],
    primaryExam: "nclex",
    keywords: ["best NCLEX practice questions 2026", "NCLEX question bank", "free NCLEX questions"],
    readingMinutes: 7,
    intro:
      "The best NCLEX practice questions in 2026 test clinical judgment with Next Generation NCLEX (NGN) formats — not recall-only flashcards. Here's what to look for and how to study efficiently.",
    sections: [
      {
        heading: "What high-yield NCLEX items include",
        paragraphs: [
          "Strong NCLEX stems present a realistic patient scenario, vital signs or labs when relevant, and a lead-in that tests prioritization or safe nursing action.",
          "Look for banks that include SATA, bow-tie, matrix, and unfolding case formats — these mirror current NCSBN delivery patterns.",
        ],
      },
      {
        heading: "Why a Roadmap beats random QBank churn",
        paragraphs: [
          "Random 75-question sets feel productive but hide weak Client Needs categories. A blueprint-aligned Roadmap surfaces gaps after every session.",
          "AnyExamEasy links missed topics to Deep Dive modules so you can go from question → structured review in one click.",
        ],
      },
      {
        heading: seoTrialTryNclexHeading(),
        paragraphs: [seoTrialResourceParagraph()],
      },
    ],
  }),
  article({
    slug: "how-to-pass-nclex-first-try",
    title: "How to Pass the NCLEX on Your First Try (2026 Study Plan)",
    metaDescription:
      "A practical NCLEX first-attempt study plan: daily question minimums, NGN practice, weak-area drills, and timed simulations before test day.",
    examTags: ["nclex"],
    primaryExam: "nclex",
    keywords: ["how to pass NCLEX first try", "NCLEX study plan 2026"],
    sections: [
      {
        heading: "Build a consistent daily question habit",
        paragraphs: [
          "Aim for 50–75 quality questions per day in the final month, mixing untimed review sets with timed blocks twice weekly.",
          "Review every incorrect and flagged item the same day — rationales are where learning compounding happens.",
        ],
      },
      {
        heading: "Simulate test-day conditions",
        paragraphs: [
          "Use full-length timed sessions to practice endurance and decision speed. AnyExamEasy timed simulations mirror board pacing.",
        ],
      },
    ],
  }),
  article({
    slug: "nclex-study-guide-roadmap",
    title: "NCLEX Study Guide & Blueprint Roadmap (2026)",
    metaDescription:
      "Use an NCLEX study guide tied to the NCSBN blueprint — Client Needs categories, NGN formats, and weekly Roadmap checkpoints.",
    examTags: ["nclex"],
    primaryExam: "nclex",
    keywords: ["NCLEX study guide", "NCLEX roadmap", "NCLEX blueprint 2026"],
    sections: [
      {
        heading: "Map study weeks to Client Needs",
        paragraphs: [
          "Divide your calendar across Safe and Effective Care, Health Promotion, Psychosocial Integrity, and Physiological Integrity.",
          "Track category accuracy weekly; if Med-Surg pharmacology lags, schedule Deep Dive review before adding volume.",
        ],
      },
    ],
  }),
  article({
    slug: "best-usmle-step-2-practice-questions-2026",
    title: "Best USMLE Step 2 CK Practice Questions (2026)",
    metaDescription:
      "What separates elite Step 2 CK practice questions from generic MCQs — vignette design, distractors, and affordable multi-exam prep.",
    examTags: ["usmle"],
    primaryExam: "usmle",
    keywords: ["best USMLE Step 2 practice questions 2026", "Step 2 CK question bank"],
    sections: [
      {
        heading: "Vignette quality matters",
        paragraphs: [
          "Step 2 CK rewards next-best-step reasoning. The best items include competitive distractors that reflect real clinical alternatives.",
          "Avoid banks that reuse the same stem template with swapped diagnoses — variation trains pattern recognition without memorization.",
        ],
      },
    ],
  }),
  article({
    slug: "usmle-step-2-study-guide-roadmap",
    title: "USMLE Step 2 CK Study Guide & Roadmap",
    metaDescription:
      "Systems-based Step 2 CK study guide with Roadmap tracking — rotate weak specialties and use timed blocks before your exam.",
    examTags: ["usmle"],
    primaryExam: "usmle",
    keywords: ["USMLE Step 2 study guide", "Step 2 CK roadmap"],
    sections: [
      {
        heading: "Systems rotation schedule",
        paragraphs: [
          "Run 7–10 day blocks per major system — cardiovascular, pulmonary, GI, renal, ID, neuro, MSK, OB, peds, psych.",
          "Use analytics to promote weak systems into your next week's primary focus.",
        ],
      },
    ],
  }),
  article({
    slug: "how-to-pass-usmle-step-2-first-try",
    title: "How to Pass USMLE Step 2 CK on Your First Attempt",
    metaDescription:
      "Step 2 CK first-pass strategy: question volume, timed blocks, weak-area remediation, and integrated review modules.",
    examTags: ["usmle"],
    primaryExam: "usmle",
    keywords: ["how to pass USMLE Step 2 first try"],
    sections: [
      {
        heading: "Question volume with quality review",
        paragraphs: [
          "Most successful candidates complete thousands of vignettes — but only if each miss becomes a micro-lesson via rationale review.",
        ],
      },
    ],
  }),
  article({
    slug: "best-naplex-practice-questions-2026",
    title: "Best NAPLEX Practice Questions in 2026",
    metaDescription:
      "NAPLEX prep in 2026: calculations, patient cases, and pharmacotherapy questions with a pharmacy blueprint Roadmap.",
    examTags: ["naplex"],
    primaryExam: "naplex",
    keywords: ["best NAPLEX practice questions 2026", "NAPLEX question bank"],
    sections: [
      {
        heading: "Balance math and clinical cases",
        paragraphs: [
          "Split weekly study between calculation drills and case-based management — both are heavily represented on NAPLEX.",
          "AnyExamEasy includes a Top 503 Drugs deck for brand/generic mastery alongside the NAPLEX bank.",
        ],
      },
    ],
  }),
  article({
    slug: "how-to-pass-naplex-first-try",
    title: "How to Pass the NAPLEX on Your First Try",
    metaDescription:
      "First-attempt NAPLEX strategy: calculation speed, therapeutic substitution, and timed mixed practice sets.",
    examTags: ["naplex"],
    primaryExam: "naplex",
    keywords: ["how to pass NAPLEX first try"],
    sections: [
      {
        heading: "Final-month timed mixed sets",
        paragraphs: [
          "In the last 3–4 weeks, prioritize timed sessions mixing calculations and cases to build exam-day pacing.",
        ],
      },
    ],
  }),
  article({
    slug: "naplex-study-guide-blueprint",
    title: "NAPLEX Study Guide & Blueprint Review (2026)",
    metaDescription:
      "NAPLEX study guide aligned to the NABP five-domain content outline — calculations, medication use, treatment planning (~40%), and professional practice.",
    examTags: ["naplex"],
    primaryExam: "naplex",
    keywords: ["NAPLEX study guide", "NAPLEX blueprint", "NAPLEX content outline 2026"],
    sections: [
      {
        heading: "Five NABP content domains (effective May 2025)",
        paragraphs: [
          NAPLEX_CONTENT_OUTLINE.map(
            (d) => `${d.label} (${d.weightLabel}): ${d.topics.slice(0, 3).join("; ")}.`
          ).join(" "),
        ],
      },
      {
        heading: "Highest-yield study priorities",
        paragraphs: [NAPLEX_HIGH_YIELD_FOCUS_AREAS.join(" · ")],
      },
      {
        heading: "How AnyExamEasy aligns to the outline",
        paragraphs: [NAPLEX_PLATFORM_STUDY_FEATURES.join(" · "), NAPLEX_OUTLINE_SOURCE],
      },
    ],
  }),
  article({
    slug: "best-pance-practice-questions-2026",
    title: "Best PANCE Practice Questions in 2026",
    metaDescription:
      "PANCE practice questions aligned to the NCCPA blueprint — systems vignettes, Roadmap tracking, and affordable prep.",
    examTags: ["pance"],
    primaryExam: "pance",
    keywords: ["best PANCE practice questions 2026", "PANCE question bank"],
    sections: [
      {
        heading: "NCCPA category coverage",
        paragraphs: [
          "Ensure your bank spans all 14 NCCPA knowledge areas — overweighting one system creates surprise gaps on exam day.",
        ],
      },
    ],
  }),
  article({
    slug: "pance-study-guide-nccpa-blueprint",
    title: "PANCE Study Guide — NCCPA Blueprint Roadmap (2026)",
    metaDescription:
      "PANCE study guide aligned to the NCCPA task areas and organ-system weights — cardiovascular (13%), treatment tasks, and primary care across the lifespan.",
    examTags: ["pance"],
    primaryExam: "pance",
    keywords: ["PANCE study guide", "NCCPA blueprint PANCE", "PANCE content outline 2026"],
    sections: [
      {
        heading: "Organ-system weights (2026 blueprint)",
        paragraphs: [
          PANCE_KNOWLEDGE_AREAS.map(
            (d) => `${d.label} (${d.weightLabel}): ${d.topics.slice(0, 2).join("; ")}.`
          ).join(" "),
        ],
      },
      {
        heading: "Highest-yield study priorities",
        paragraphs: [PANCE_HIGH_YIELD_FOCUS_AREAS.join(" · ")],
      },
      {
        heading: "How AnyExamEasy aligns to the outline",
        paragraphs: [PANCE_PLATFORM_STUDY_FEATURES.join(" · "), PANCE_OUTLINE_SOURCE],
      },
    ],
  }),
  article({
    slug: "how-to-pass-pance-first-try",
    title: "How to Pass the PANCE on Your First Attempt",
    metaDescription:
      "PANCE first-pass tips: daily vignettes, Roadmap weak areas, and timed simulations in the final month.",
    examTags: ["pance"],
    primaryExam: "pance",
    keywords: ["how to pass PANCE first try"],
    sections: [
      {
        heading: "Simulate before exam day",
        paragraphs: [
          "Full-length timed PANCE-style blocks build the stamina needed for the five-hour exam window.",
        ],
      },
    ],
  }),
  article({
    slug: "best-aanp-fnp-practice-questions-2026",
    title: "Best AANP FNP Practice Questions in 2026",
    metaDescription:
      "AANPCB FNP certification prep — primary care vignettes across Assess, Diagnose, Plan, and Evaluate domains.",
    examTags: ["aanp-fnp"],
    primaryExam: "aanp-fnp",
    keywords: ["best AANP FNP practice questions 2026", "AANPCB FNP prep"],
    sections: [
      {
        heading: "Domain-balanced practice",
        paragraphs: [
          "FNP exams test management across the lifespan. Rotate pediatric, adult, and geriatric stems weekly.",
        ],
      },
    ],
  }),
  article({
    slug: "aanp-fnp-study-guide-blueprint",
    title: "AANP FNP Study Guide & Certification Blueprint",
    metaDescription:
      "AANPCB FNP study guide with domain tracking — Assess, Diagnose, Plan, Evaluate, and professional role.",
    examTags: ["aanp-fnp"],
    primaryExam: "aanp-fnp",
    keywords: ["AANP FNP study guide", "AANPCB blueprint"],
    sections: [
      {
        heading: "Weekly domain rotation",
        paragraphs: [
          "Many candidates under-practice Evaluate and professional responsibility items — tag misses by domain in your Roadmap.",
        ],
      },
    ],
  }),
  article({
    slug: "how-to-pass-aanp-fnp-first-try",
    title: "How to Pass the AANP FNP Exam on Your First Try",
    metaDescription:
      "First-attempt AANP FNP strategy: primary care vignettes, weak-area Deep Dives, and timed practice blocks.",
    examTags: ["aanp-fnp"],
    primaryExam: "aanp-fnp",
    keywords: ["how to pass AANP FNP first try"],
    sections: [
      {
        heading: "Link misses to Deep Dives",
        paragraphs: [
          "Pro subscribers open eight-section modules directly from missed FNP questions — faster remediation than searching textbooks.",
        ],
      },
    ],
  }),
  article({
    slug: "best-npte-practice-questions-2026",
    title: "Best NPTE-PT Practice Questions in 2026",
    metaDescription:
      "NPTE physical therapy board prep — FSBPT blueprint scenarios, MSK/neuro/cardiopulmonary focus, and timed exams.",
    examTags: ["npte-pt"],
    primaryExam: "npte-pt",
    keywords: ["best NPTE practice questions 2026", "NPTE-PT question bank"],
    sections: [
      {
        heading: "Scenario-based clinical reasoning",
        paragraphs: [
          "NPTE items should test examination findings, intervention selection, and safety — not isolated fact recall.",
        ],
      },
    ],
  }),
  article({
    slug: "npte-pt-study-guide-fsbpt-blueprint",
    title: "NPTE Study Guide — FSBPT Blueprint Roadmap",
    metaDescription:
      "NPTE-PT study guide mapped to FSBPT systems — musculoskeletal, neuromuscular, cardiopulmonary, and modalities.",
    examTags: ["npte-pt"],
    primaryExam: "npte-pt",
    keywords: ["NPTE study guide", "FSBPT blueprint NPTE"],
    sections: [
      {
        heading: "System-based weekly plan",
        paragraphs: [
          "Alternate MSK-heavy weeks with neuro and cardiopulmonary blocks; track modality and equipment safety separately.",
        ],
      },
    ],
  }),
  article({
    slug: "how-to-pass-npte-first-try",
    title: "How to Pass the NPTE on Your First Attempt",
    metaDescription:
      "NPTE first-pass plan: daily scenario practice, Roadmap weak systems, and full-length timed simulations.",
    examTags: ["npte-pt"],
    primaryExam: "npte-pt",
    keywords: ["how to pass NPTE first try"],
    sections: [
      {
        heading: "Build exam stamina early",
        paragraphs: [
          "Start timed 50-question blocks six weeks out, progressing to full-length NPTE-style sessions.",
        ],
      },
    ],
  }),
  article({
    slug: "six-board-exams-one-subscription",
    title: "Six Board Exams, One Subscription — NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE",
    metaDescription:
      "Why students switch from per-exam QBanks to AnyExamEasy — six licensing tracks, Roadmaps, Deep Dives, and one Pro plan.",
    examTags: ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"],
    keywords: ["board exam prep subscription", "UWorld alternative", "affordable board prep"],
    readingMinutes: 8,
    intro:
      "Stacking separate NCLEX, USMLE, NAPLEX, PANCE, FNP, and NPTE subscriptions can cost thousands per year. One integrated platform changes the math.",
    sections: [
      {
        heading: "What's included on every plan",
        paragraphs: [
          "All six question banks, Exam Roadmaps, lab values, clinical calculators, Library, Memory Cards, and the Top 503 Drugs deck.",
          "Pro adds Deep Dive modules, advanced analytics, spaced repetition, unlimited mock exams, and exportable notes.",
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoSixBoardTrialParagraph()],
      },
    ],
  }),
];

export function getResourceArticle(slug: string): ResourceArticle | undefined {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesForExam(exam: ExamSeoKey): ResourceArticle[] {
  return RESOURCE_ARTICLES.filter((a) => a.examTags.includes(exam));
}
