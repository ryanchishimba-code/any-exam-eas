import type { ResourceArticle, ResourceSection } from "@/lib/seo/resources-content";
import {
  seoSixBoardTrialParagraph,
  seoTrialHeading,
  seoTrialResourceParagraph,
} from "@/lib/seo/trial-copy";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { SEO_LIVE_STATS, SEO_VALUE_PROPS } from "@/lib/seo/seo-copy";
import { formatMonthlyPrice } from "@/lib/site";
import { clampMetaDescription, clampMetaTitle } from "@/lib/seo/meta-budget";

function normalizeSection(section: ResourceSection): ResourceSection {
  return {
    ...section,
    paragraphs: section.paragraphs ?? [],
  };
}

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
    title: clampMetaTitle(partial.title),
    metaDescription: clampMetaDescription(partial.metaDescription),
    keywords: partial.keywords ?? [],
    readingMinutes: partial.readingMinutes ?? 7,
    intro: partial.intro ?? "",
    sections: (partial.sections ?? []).map(normalizeSection),
    publishedAt: partial.publishedAt ?? "2026-06-15",
    updatedAt: partial.updatedAt ?? "2026-07-17",
  };
}

/** SEO resource articles — multi-exam prep, Roadmap/Full Exams/Deep Dives, and long-tail queries. */
export const ADDITIONAL_RESOURCE_ARTICLES: ResourceArticle[] = [
  article({
    slug: "multi-exam-board-prep-2026",
    title: "Multi-Exam Board Prep in One Subscription (2026)",
    metaDescription: `One Pro plan at ${formatMonthlyPrice("pro")}/mo for unlimited access, Deep Dives, and Full Exams across NCLEX, USMLE, NAPLEX, PANCE, FNP, and NPTE-PT. ${TRIAL_DAYS}-day free trial: ${TRIAL_LIFETIME_QUESTIONS} practice questions, no payment required.`,
    examTags: ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"],
    keywords: [
      "multi-exam board prep",
      "six board exams one subscription",
      "affordable board exam prep",
      "Roadmap board prep",
      "NCLEX USMLE NAPLEX one plan",
    ],
    readingMinutes: 6,
    intro:
      `If you are preparing for more than one licensing exam, separate per-exam subscriptions add cost and context switching. AnyExamEasy keeps NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, AANP FNP, and NPTE-PT on one Pro plan with a shared study system. Start with a ${TRIAL_DAYS}-day free trial (${TRIAL_LIFETIME_QUESTIONS} practice questions, no payment required), then upgrade to Pro for unlimited bank access.`,
    faq: [
      {
        question: "Which board exams are included on one Pro subscription?",
        answer:
          "NCLEX, USMLE Step 1, Step 2 CK, and Step 3, NAPLEX, PANCE, AANP FNP, and NPTE-PT — each with its own question bank, Roadmap, and blueprint-aligned practice tools on the same account.",
      },
      {
        question: "How much does Pro cost after the trial?",
        answer: `Pro is ${formatMonthlyPrice("pro")}/month on the monthly plan (see pricing for other billing intervals). Subscribe after your ${TRIAL_DAYS}-day trial when you want unlimited question-bank access, Deep Dive modules, and Full Exam simulations.`,
      },
      {
        question: "What is included in the free trial?",
        answer: `${TRIAL_DAYS} days with ${TRIAL_LIFETIME_QUESTIONS} practice questions across all six boards, plus Roadmap and reference tools. No payment method required at signup. The trial is a capped sample — not the full live banks. Deep Dives and Full Exam simulations unlock on Pro.`,
      },
      {
        question: "How should I study across multiple exams?",
        answer:
          "Pick one primary exam in the Roadmap, run timed practice, open Deep Dive modules on missed topics, and use Full Exam simulations to rehearse pacing. Switch boards anytime without a second checkout.",
      },
    ],
    sections: [
      {
        heading: "Six boards, one study system",
        paragraphs: [
          SEO_VALUE_PROPS.multiExam,
          "Use the same workflow everywhere: practice questions with teachable rationales, a blueprint-aligned Roadmap, Deep Dive review on misses, and timed Full Exam blocks when you are ready to rehearse test day.",
        ],
      },
      {
        heading: "What you get on Pro",
        bullets: [
          "Unlimited access to the live question banks on all six boards (trial is capped at " +
            `${TRIAL_LIFETIME_QUESTIONS} practice questions).`,
          SEO_VALUE_PROPS.qaGated,
          SEO_VALUE_PROPS.adaptiveRoadmap,
          SEO_VALUE_PROPS.deepDives,
          SEO_VALUE_PROPS.fullExam,
          "Library, Memory Cards, lab values, and clinical calculators across boards.",
          `One monthly price — ${formatMonthlyPrice("pro")}/mo on the monthly plan.`,
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [
          `No payment method required at signup. Your ${TRIAL_DAYS}-day trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions across every board track, plus Roadmap and reference tools. Upgrade to Pro when you want unlimited bank access, Deep Dives, and Full Exam simulations.`,
        ],
      },
    ],
  }),
  article({
    slug: "nclex-single-exam-qbank-comparison-2026",
    title: "NCLEX Prep: Single-Exam QBank vs One Plan (2026)",
    metaDescription: `Compare NCLEX study workflows — NGN formats, Roadmap, Deep Dives, and Full Exams on Pro at ${formatMonthlyPrice("pro")}/mo with six boards. ${TRIAL_DAYS}-day trial: ${TRIAL_LIFETIME_QUESTIONS} questions.`,
    examTags: ["nclex"],
    primaryExam: "nclex",
    keywords: [
      "NCLEX Qbank comparison 2026",
      "NCLEX prep options",
      "affordable NCLEX Qbank",
      "NGN NCLEX practice",
    ],
    readingMinutes: 8,
    intro:
      `NCLEX-RN prep often starts with a premium single-exam QBank focused on clinical judgment and rationales. AnyExamEasy is built for candidates who want NCLEX on the same Pro plan as USMLE, NAPLEX, PANCE, FNP, and NPTE — with Roadmap, Deep Dives, and Full Exam simulations. Pro is ${formatMonthlyPrice("pro")}/month after a ${TRIAL_DAYS}-day free trial (${TRIAL_LIFETIME_QUESTIONS} practice questions, no payment required).`,
    faq: [
      {
        question: "Does AnyExamEasy include NCLEX NGN question types?",
        answer:
          "Yes. The NCLEX bank includes SATA, bow-tie, matrix, and other NGN-style formats alongside classic vignettes, mapped to NCSBN Client Needs in your Roadmap.",
      },
      {
        question: "When is a premium single-exam QBank enough?",
        answer:
          "If NCLEX is your only licensing exam and you prefer a product built exclusively for that board, a dedicated single-exam QBank may fit. Compare trial access, explanation depth, and whether you want live review or self-directed study.",
      },
      {
        question: "When does a multi-exam Pro plan make sense for NCLEX?",
        answer: `If you also sit USMLE, NAPLEX, PANCE, FNP, or NPTE on a similar timeline, one Pro subscription at ${formatMonthlyPrice("pro")}/mo covers all six boards with the same Roadmap and review workflow — instead of separate renewals per exam.`,
      },
    ],
    sections: [
      {
        heading: "NGN and clinical judgment coverage",
        paragraphs: [
          "Next Generation NCLEX rewards prioritization and clinical judgment. Look for SATA, bow-tie, matrix, and unfolding case formats — not recall-only stems.",
          "AnyExamEasy NCLEX items are QA-gated and mapped to NCSBN Client Needs categories in your Roadmap.",
        ],
      },
      {
        heading: "Study workflow: self-directed vs integrated Roadmap",
        bullets: [
          "Typical premium single-exam QBank: Strong rationales and analytics; you choose what to study next.",
          "AnyExamEasy: Roadmap surfaces weak Client Needs after each session.",
          "AnyExamEasy: Deep Dive modules open from missed questions for structured review.",
          "AnyExamEasy: Timed Full Exam simulations rehearse board pacing with weak-area focus.",
        ],
      },
      {
        heading: "NCLEX on one plan with five other boards",
        paragraphs: [
          "If NCLEX is your only licensing exam, weigh trial access and explanation depth against any dedicated single-board product.",
          "If you also need another board on a similar calendar, Pro bundles NCLEX with USMLE (Steps 1–3), NAPLEX, PANCE, FNP, and NPTE on one account.",
        ],
        competitorLabel: "Typical single-exam prep",
        comparisonRows: [
          {
            feature: "Exam coverage",
            anyExamEasy: "NCLEX plus five other boards on Pro",
            typicalQbank: "Usually one exam per subscription",
          },
          {
            feature: "Study system",
            anyExamEasy: "Roadmap + Deep Dives + Full Exams",
            typicalQbank: "QBank plus analytics; schedule is self-directed",
          },
          {
            feature: "Trial",
            anyExamEasy: `${TRIAL_DAYS}-day free trial · ${TRIAL_LIFETIME_QUESTIONS} questions`,
            typicalQbank: "Trial terms vary by provider",
          },
          {
            feature: "Pro price",
            anyExamEasy: `${formatMonthlyPrice("pro")}/mo monthly plan · six boards`,
            typicalQbank: "Pricing varies by provider and term",
          },
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoTrialResourceParagraph()],
      },
    ],
  }),
  article({
    slug: "ai-tutor-adaptive-board-prep-2026",
    title: "Roadmap Board Prep Workflow — 2026 Guide",
    metaDescription:
      "How Roadmap, Deep Dive modules, and Full Exam simulations work together for NCLEX, USMLE, and NAPLEX study — a step-by-step workflow for 2026.",
    examTags: ["nclex", "usmle", "naplex"],
    keywords: [
      "Roadmap board prep",
      "adaptive roadmap NCLEX",
      "adaptive USMLE study plan",
      "deep dive board exam review",
      "full exam simulation board prep",
    ],
    readingMinutes: 8,
    intro:
      "Static question banks leave you guessing what to study next. Roadmap, Deep Dive review on misses, and Full Exam simulations turn practice into a directed workflow — especially for high-stakes NCLEX, USMLE, and NAPLEX timelines.",
    sections: [
      {
        heading: "Step 1 — Baseline with blueprint-aligned questions",
        paragraphs: [
          "Complete an untimed diagnostic block in your target exam. AnyExamEasy maps every item to official blueprint categories — NCSBN Client Needs, USMLE content outline, or NABP NAPLEX domains.",
        ],
        bullets: [
          "Review every miss the same day while context is fresh.",
          "Flag items where you guessed correctly — those are hidden weak spots.",
        ],
      },
      {
        heading: "Step 2 — Let the Roadmap prioritize weak areas",
        paragraphs: [
          "Your Roadmap promotes underperforming categories into daily queues. This replaces random 75-question marathons that hide gaps in pharmacology or calculations.",
        ],
      },
      {
        heading: "Step 3 — Deep Dive the misses",
        paragraphs: [
          "Open Deep Dive modules from incorrect or flagged items the same day — structured review beats re-reading the same rationale once.",
          "Use Spaced Repetition queues to resurface weak topics before timed mocks.",
        ],
      },
      {
        heading: "Step 4 — Timed Full Exam simulations",
        paragraphs: [
          "In the final 2–4 weeks, shift to timed Full Exam simulations. Roadmap accuracy and weak-area focus should drive confidence — not total questions answered.",
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoSixBoardTrialParagraph()],
      },
    ],
  }),
  article({
    slug: "usmle-step-1-practice-questions-2026",
    title: "USMLE Step 1 Practice Questions (2026)",
    metaDescription:
      "Step 1 Qbank guide — mechanisms, pathology, biostatistics, and systems integration with Roadmap, Deep Dives, and Full Exams on one multi-exam plan.",
    examTags: ["usmle"],
    primaryExam: "usmle",
    keywords: ["Step 1 question bank", "USMLE Step 1 prep"],
    sections: [
      {
        heading: "What high-yield Step 1 items test",
        paragraphs: [
          "Step 1 rewards mechanism-linked reasoning — biochemistry, physiology, pathology, pharmacology, and biostatistics integrated into clinical frames.",
          "Avoid banks that test isolated factoids without linking findings to underlying processes.",
        ],
      },
      {
        heading: "Systems rotation for Step 1",
        bullets: [
          "Week 1–2: Cardiovascular + pulmonary mechanisms",
          "Week 3–4: Renal, acid-base, and electrolytes",
          "Week 5–6: GI, hepatobiliary, and nutrition",
          "Week 7–8: Neuro, MSK, and psychiatry foundations",
          "Week 9–10: Micro, immuno, and biostatistics-heavy sets",
        ],
      },
      {
        heading: "Step 1 on the same plan as Step 2 CK",
        paragraphs: [
          "AnyExamEasy includes dedicated Step 1, Step 2 CK, and Step 3 banks with step-specific Roadmap, Deep Dives, and Full Exam practice — useful when Step 1 and Step 2 prep overlap in your calendar.",
          seoTrialResourceParagraph(),
        ],
      },
    ],
  }),
  article({
    slug: "naplex-calculations-study-guide-2026",
    title: "NAPLEX Calculations Study Guide (2026)",
    metaDescription:
      "Master NAPLEX calculations — dosing, concentrations, IV flow and alligation — with drills, cases, Roadmap, Deep Dives and Full Exam blocks.",
    examTags: ["naplex"],
    primaryExam: "naplex",
    keywords: [
      "NAPLEX calculations",
      "NAPLEX math practice",
      "NAPLEX calculations study guide",
      "how to pass NAPLEX calculations",
    ],
    readingMinutes: 9,
    intro:
      "NAPLEX calculations are high-stakes and time-pressured. A structured drill schedule — paired with case-based pharmacotherapy and Roadmap tracking — prevents math gaps from derailing an otherwise strong content foundation.",
    sections: [
      {
        heading: "Core calculation types on NAPLEX",
        bullets: [
          "Dosing by weight, BSA, and renal adjustment",
          "Concentrations, dilutions, and alligation",
          "IV flow rates and infusion times",
          "Compounding and quantity-to-supply problems",
          "Unit conversions (metric, household, mEq, mmol)",
        ],
      },
      {
        heading: "Weekly calculation drill schedule",
        paragraphs: [
          "Split math and clinical cases across the week — both appear heavily on exam day.",
        ],
        comparisonRows: [
          { feature: "Mon–Wed", anyExamEasy: "15–20 calculation items/day, untimed", typicalQbank: "Self-selected math sets" },
          { feature: "Thu–Fri", anyExamEasy: "Mixed patient cases + 10 timed calculations", typicalQbank: "Case bank only" },
          { feature: "Sat", anyExamEasy: "Full Exam-style timed mixed block (cases + math)", typicalQbank: "Optional mock" },
          { feature: "Sun", anyExamEasy: "Deep Dive review on calc misses + Roadmap weak domains", typicalQbank: "Manual review" },
        ],
      },
      {
        heading: "Pair calculations with Deep Dive review",
        paragraphs: [
          "When a calc miss exposes a concept gap (renal dosing, alligation, IV rates), open the linked Deep Dive the same day.",
          "AnyExamEasy Roadmap surface weak NABP domains so math drills stay tied to blueprint weight — not random churn.",
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoTrialResourceParagraph()],
      },
    ],
  }),
  article({
    slug: "best-value-multi-exam-board-prep-2026",
    title: "Multi-Exam Board Prep: What One Plan Costs (2026)",
    metaDescription: `Compare NCLEX, USMLE, NAPLEX, PANCE, FNP and NPTE costs — one Pro plan from ${formatMonthlyPrice("pro")}/mo with Roadmap and Deep Dives, instead of stacking QBanks.`,
    examTags: ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"],
    keywords: ["affordable multi-exam prep", "board exam subscription", "affordable board prep 2026"],
    readingMinutes: 7,
    intro:
      "Licensing exams rarely arrive one at a time. Dual-degree students, career changers, and clinicians adding certifications face a simple math problem: six separate QBanks or one integrated platform.",
    sections: [
      {
        heading: "The cost of stacking per-exam subscriptions",
        paragraphs: [
          "Premium QBanks often charge $200–400+ per exam annually (public prices as of Sep 27, 2026). Six exams can exceed $1,500 before textbooks and review courses.",
          `AnyExamEasy Pro bundles all six banks with Roadmap, Deep Dive modules, and Full Exam simulations on one plan — from ${formatMonthlyPrice("pro")}/mo after a ${SEO_LIVE_STATS.trialDays}-day free trial.`,
        ],
      },
      {
        heading: "What's included on Pro",
        bullets: [
          "QA-gated questions across six exams",
          "Roadmap per licensing track",
          "Deep Dive modules opened from missed questions",
          "Timed Full Exam simulations with weak-area focus",
          "Spaced Repetition for weak topics",
          "Advanced analytics and unlimited mocks (Pro)",
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoSixBoardTrialParagraph()],
      },
    ],
  }),
  article({
    slug: "nclex-cat-workflow-prep-comparison-2026",
    title: "NCLEX Prep: CAT Practice vs Multi-Exam Workflow (2026)",
    metaDescription: `NCLEX CAT-style practice, NGN coverage, and Roadmap workflow on Pro at ${formatMonthlyPrice("pro")}/mo with six boards. ${TRIAL_DAYS}-day trial with ${TRIAL_LIFETIME_QUESTIONS} questions.`,
    examTags: ["nclex"],
    primaryExam: "nclex",
    keywords: [
      "NCLEX CAT practice",
      "NCLEX prep comparison 2026",
      "affordable NCLEX study plan",
      "NCLEX Roadmap prep",
    ],
    readingMinutes: 8,
    intro:
      `Some NCLEX products emphasize unlimited computer-adaptive practice and mobile study. AnyExamEasy emphasizes a multi-exam workflow — NCLEX with USMLE, NAPLEX, PANCE, FNP, and NPTE on one Pro plan at ${formatMonthlyPrice("pro")}/month, plus Roadmap, Deep Dives, and Full Exam simulations. Start with a ${TRIAL_DAYS}-day free trial (${TRIAL_LIFETIME_QUESTIONS} practice questions, no payment required).`,
    faq: [
      {
        question: "Does AnyExamEasy replace official NCLEX CAT software?",
        answer:
          "Full Exam simulations rehearse timed pacing and weak-area focus; they are study tools, not a duplicate of the NCSBN candidate tutorial or live exam delivery. Always review official NCSBN materials before test day.",
      },
      {
        question: "When is unlimited CAT-style practice the priority?",
        answer:
          "If NCLEX is your only exam and you learn best by cycling adaptive-length practice with minimal cross-board planning, a dedicated single-exam product built around CAT may fit your workflow.",
      },
      {
        question: "What does Pro include for NCLEX?",
        answer: `NCLEX practice with Roadmap, Deep Dives opened from misses, and Full Exam blocks on the same account as five other boards — ${formatMonthlyPrice("pro")}/mo on the monthly plan after your ${TRIAL_DAYS}-day trial.`,
      },
    ],
    sections: [
      {
        heading: "NCLEX-only prep vs six boards on one plan",
        paragraphs: [
          "Budget-focused NCLEX options often sell one exam per subscription with heavy emphasis on adaptive practice volume.",
          "AnyExamEasy Pro includes NCLEX and five other board exams — useful if you are RN-to-NP, dual-track, or planning USMLE or NAPLEX on the same timeline.",
        ],
        competitorLabel: "Typical single-exam prep",
        comparisonRows: [
          {
            feature: "Exam coverage",
            anyExamEasy: "NCLEX + USMLE + NAPLEX + PANCE + FNP + NPTE",
            typicalQbank: "Usually NCLEX-only",
          },
          {
            feature: "Exam-day rehearsal",
            anyExamEasy: "Timed Full Exams + Roadmap-driven sets",
            typicalQbank: "Often CAT-style practice; details vary",
          },
          {
            feature: "Adaptive study path",
            anyExamEasy: "Roadmap per exam",
            typicalQbank: "Performance stats; self-directed schedule",
          },
          {
            feature: "Miss review",
            anyExamEasy: "Deep Dive modules from missed items",
            typicalQbank: "Rationales; depth varies by tier",
          },
          {
            feature: "Pro price",
            anyExamEasy: `${formatMonthlyPrice("pro")}/mo · six boards`,
            typicalQbank: "Pricing varies by provider",
          },
        ],
      },
      {
        heading: "When a dedicated single-exam product may fit better",
        bullets: [
          "NCLEX is your only licensing exam and you want the narrowest product scope.",
          "Unlimited adaptive practice volume is your primary study habit.",
          "Mobile-first QBank study is your main workflow and you do not need other boards on the same plan.",
        ],
      },
      {
        heading: "When AnyExamEasy fits better",
        bullets: [
          "You need NCLEX plus another board (USMLE, NAPLEX, PANCE, FNP, or NPTE).",
          "You want Roadmap, Deep Dives, and Full Exams in one workflow.",
          `${TRIAL_DAYS}-day free trial, no payment method required, then cancel anytime in Settings.`,
        ],
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoTrialResourceParagraph()],
      },
    ],
  }),
  article({
    slug: "naplex-single-exam-qbank-comparison-2026",
    title: "NAPLEX Prep: Pharmacy QBank vs Multi-Exam Plan (2026)",
    metaDescription: `NAPLEX calculations, Roadmap, Deep Dives, and Full Exams on Pro at ${formatMonthlyPrice("pro")}/mo with six boards. ${TRIAL_DAYS}-day trial: ${TRIAL_LIFETIME_QUESTIONS} questions.`,
    examTags: ["naplex"],
    primaryExam: "naplex",
    keywords: [
      "NAPLEX Qbank comparison 2026",
      "NAPLEX prep options",
      "NAPLEX calculations prep",
      "affordable NAPLEX study",
    ],
    readingMinutes: 9,
    intro:
      `Many pharmacy graduates start with a premium single-exam NAPLEX QBank or video course. AnyExamEasy bundles NAPLEX with NCLEX, USMLE, PANCE, FNP, and NPTE on Pro at ${formatMonthlyPrice("pro")}/month — with calculation drills, Roadmap, Deep Dives, and Full Exam practice. Try ${TRIAL_DAYS} days free (${TRIAL_LIFETIME_QUESTIONS} practice questions, no payment required).`,
    faq: [
      {
        question: "Does AnyExamEasy cover NAPLEX calculations?",
        answer:
          "Yes. The NAPLEX bank includes calculation and case-based items with teachable rationales, plus Roadmap tracking across NABP content domains.",
      },
      {
        question: "When is a pharmacy-only prep product enough?",
        answer:
          "If NAPLEX is your only licensing exam and you want a product scoped entirely to pharmacy — especially with bundled video lectures — a dedicated single-exam offering may match your workflow.",
      },
      {
        question: "When does multi-exam Pro help for NAPLEX?",
        answer: `Dual-degree students and clinicians adding nursing, medical, or PA boards can keep NAPLEX on the same Pro plan as five other exams — ${formatMonthlyPrice("pro")}/mo on the monthly plan after the ${TRIAL_DAYS}-day trial.`,
      },
    ],
    sections: [
      {
        heading: "Pharmacy-only prep vs multi-exam Pro",
        paragraphs: [
          "Established NAPLEX products often pair a calc-heavy QBank with optional video courses sold on their own renewal cycle.",
          "AnyExamEasy Pro covers NAPLEX alongside NCLEX, USMLE, PANCE, FNP, and NPTE — relevant for dual-degree students or clinicians adding certifications.",
        ],
        competitorLabel: "Typical single-exam prep",
        comparisonRows: [
          {
            feature: "NAPLEX QBank access",
            anyExamEasy: "Included in Pro · NABP-aligned Roadmap",
            typicalQbank: "Usually pharmacy-only subscription",
          },
          {
            feature: "Calculations prep",
            anyExamEasy: "Daily calc drills + timed Full Exam-style mixed blocks",
            typicalQbank: "Calc sets vary by provider",
          },
          {
            feature: "Miss review",
            anyExamEasy: "Deep Dive modules from missed questions",
            typicalQbank: "Rationales; add-on review bundles vary",
          },
          {
            feature: "Structured teaching",
            anyExamEasy: "Deep Dives + teachable rationales",
            typicalQbank: "Often separate video or course tiers",
          },
          {
            feature: "Other board exams",
            anyExamEasy: "Five additional exams on same subscription",
            typicalQbank: "Typically one licensing exam per product",
          },
          {
            feature: "Pro price",
            anyExamEasy: `${formatMonthlyPrice("pro")}/mo · six boards`,
            typicalQbank: "Pricing varies by provider",
          },
        ],
      },
      {
        heading: "When a dedicated pharmacy prep product may fit better",
        bullets: [
          "NAPLEX is your only exam and you want the narrowest pharmacy-focused scope.",
          "Your program recommends a specific pharmacy QBank or course bundle.",
          "Video lectures and a printed course book are must-haves for your study style.",
        ],
      },
      {
        heading: "When AnyExamEasy fits better",
        bullets: [
          "You are on a PharmD plus RN, PA, or MD track and need more than pharmacy prep.",
          "You want Roadmap, Deep Dives, and Full Exams integrated with NAPLEX practice.",
          `One Pro price at ${formatMonthlyPrice("pro")}/mo instead of separate subscriptions per board.`,
        ],
      },
      {
        heading: "NAPLEX calculations workflow",
        paragraphs: [
          "Pair 15–20 untimed calculation items daily with case-based pharmacotherapy blocks. AnyExamEasy Roadmap surfaces weak NABP domains after each session.",
        ],
        comparisonRows: [
          {
            feature: "Mon–Wed",
            anyExamEasy: "Calc drills + Deep Dive on misses",
            typicalQbank: "Self-selected math sets",
          },
          {
            feature: "Thu–Fri",
            anyExamEasy: "Mixed patient cases + timed calcs",
            typicalQbank: "Case-based QBank blocks",
          },
          {
            feature: "Sat",
            anyExamEasy: "Full Exam timed mock block",
            typicalQbank: "Optional mock or self-assessment",
          },
        ],
        competitorLabel: "Typical schedule",
      },
      {
        heading: seoTrialHeading(),
        paragraphs: [seoSixBoardTrialParagraph()],
      },
    ],
  }),
];
