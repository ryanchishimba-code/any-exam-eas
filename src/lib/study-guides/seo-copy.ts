import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SCHEMA_BRAND_NAME } from "@/lib/seo/course-jsonld";

/**
 * Search phrases people type, written into the title, H1, first paragraph,
 * and the visible question headings. Facts here are the ones already in the
 * manuscripts. Nothing here promises a result.
 */

export type GuideAnswer = {
  id: string;
  question: string;
  answer: string;
};

export type GuideSeoCopy = {
  /** Exact phrase that must appear in the title, H1, and first paragraph. */
  query: string;
  headline: string;
  lede: string;
  answers: GuideAnswer[];
};

export const GUIDE_SEO: Record<string, GuideSeoCopy> = {
  nclex: {
    query: "NCLEX study guide",
    headline: "NCLEX study guide",
    lede:
      "This NCLEX study guide is free to read, with no login. It follows the 2026 test plan for the nursing boards: a computerized adaptive exam of 85 to 150 items, up to five hours, and clinical judgment alongside the Client Needs categories. It is independent of NCSBN and it does not predict a result.",
    answers: [
      {
        id: "nclex-how-many-questions",
        question: "How many questions are on the NCLEX?",
        answer:
          "The 2026 nursing exam is a computerized adaptive test of 85 to 150 items, with a limit of five hours that includes breaks. Some items are unscored pretest questions. You are not told which ones they are.",
      },
      {
        id: "nclex-what-does-it-cover",
        question: "What does an NCLEX study guide cover?",
        answer:
          "This NCLEX study guide covers how the exam is built, then the systems nurses are tested on: safety, management of care, and the body systems, including Next Generation clinical judgment items. Read one section, then practice.",
      },
      {
        id: "nclex-is-it-free",
        question: "Is this NCLEX study guide free?",
        answer:
          "Yes. The full NCLEX study guide is on this page. No account is required to read it. A 5-day free trial, with no card, is how you open the question bank.",
      },
    ],
  },
  naplex: {
    query: "NAPLEX study guide 2026",
    headline: "NAPLEX study guide 2026",
    lede:
      "This NAPLEX study guide 2026 is free to read, with no login. It follows the NABP content outline used for exams on and after May 1, 2025, which is still the outline to study in 2026 unless NABP changes it: 225 questions in six hours, about 200 scored and 25 pretest, across five domains. It is independent of NABP and it does not predict a result.",
    answers: [
      {
        id: "naplex-how-many-questions",
        question: "How many questions are on the NAPLEX?",
        answer:
          "The outline used in this NAPLEX study guide 2026 describes 225 questions and six hours of exam time. About 200 are scored and 25 are pretest. You will not know which items are pretest. Confirm the current bulletin before you sit.",
      },
      {
        id: "naplex-what-domains",
        question: "What are the NAPLEX content domains?",
        answer:
          "Five domains. Foundational knowledge and the medication use process are about 25% each. Person-centered assessment and treatment planning is about 40%. Professional practice and pharmacy management are about 5% each. Domains 1 through 3 are most of the scored exam.",
      },
      {
        id: "naplex-is-it-free",
        question: "Is the NAPLEX study guide 2026 free?",
        answer:
          "Yes. This NAPLEX study guide 2026 is public. No login is required to read it. The daily question is also free. The question bank opens with a 5-day trial and no card.",
      },
    ],
  },
  pance: {
    query: "PANCE study guide",
    headline: "PANCE study guide",
    lede:
      "This PANCE study guide is free to read, with no login. It follows the NCCPA blueprint effective January 2025: 300 questions in five blocks of 60, 60 minutes per block, and a score scale of 200 to 800 with a passing score of 350. It is independent of NCCPA and it does not predict a result.",
    answers: [
      {
        id: "pance-how-many-questions",
        question: "How many questions are on the PANCE?",
        answer:
          "300 multiple-choice questions in five blocks of 60. You get 60 minutes per block. The score scale runs from 200 to 800, and the passing score is 350.",
      },
      {
        id: "pance-what-is-weighted",
        question: "Which PANCE topics are weighted most?",
        answer:
          "On the blueprint effective January 2025, cardiovascular disease is 11% and pulmonary disease is 9%. Study time should follow those weights. A long chapter is not the same thing as a large share of the exam.",
      },
      {
        id: "pance-is-it-free",
        question: "Is this PANCE study guide free?",
        answer:
          "Yes. The PANCE study guide on this page is public. No account is required to read it.",
      },
    ],
  },
  "aanp-fnp": {
    query: "AANP FNP study guide",
    headline: "AANP FNP study guide",
    lede:
      "This AANP FNP study guide is free to read, with no login. It follows the nurse practitioner certification blueprint used here: Assess, Diagnose, Plan, and Evaluate, with older-adult care as a large share of the age mix. It is independent of the certification boards and it does not promise a certificate.",
    answers: [
      {
        id: "fnp-what-domains",
        question: "What does the AANP FNP study guide cover?",
        answer:
          "Assessment, diagnosis, planning, and evaluation in primary care across the lifespan. The domain weights in this book are Assess 32%, Diagnose 27%, Plan 27%, and Evaluate 15%. Confirm the current candidate handbook before you sit.",
      },
      {
        id: "fnp-how-to-use",
        question: "How should I study for the FNP exam?",
        answer:
          "Read one system, then answer questions the same day. Watch older-adult presentations and prenatal care, because those stems change the plan. This AANP FNP study guide is the map. It is not a prediction.",
      },
      {
        id: "fnp-is-it-free",
        question: "Is the AANP FNP study guide free?",
        answer:
          "Yes. You can read this AANP FNP study guide with no account. The question bank opens with a 5-day free trial and no card.",
      },
    ],
  },
  usmle: {
    query: "USMLE study guide",
    headline: "USMLE study guide",
    lede:
      "This USMLE study guide is free to read, with no login. It explains how Step 1, Step 2 Clinical Knowledge, and Step 3 are organized, and each step has its own full book. It is independent of the USMLE program and it does not quote a minimum passing score.",
    answers: [
      {
        id: "usmle-which-step",
        question: "Which USMLE study guide should I read?",
        answer:
          "Start with the step you are sitting. Step 1 is mechanisms. Step 2 Clinical Knowledge is diagnosis and next-step management. Step 3 adds ambulatory care and the case simulations. The links below open each book.",
      },
      {
        id: "usmle-what-step-1",
        question: "What does the Step 1 study guide cover?",
        answer:
          "Step 1 items apply a normal process, one broken step, and the finding that follows. Pathology and physiology sit at the center, with pharmacology, microbiology, and anatomy woven through the organ systems.",
      },
      {
        id: "usmle-is-it-free",
        question: "Is the USMLE study guide free?",
        answer:
          "Yes. This USMLE study guide and the three step books are public. No login is required to read them.",
      },
    ],
  },
  "npte-pt": {
    query: "NPTE study guide",
    headline: "NPTE study guide",
    lede:
      "This NPTE study guide is free to read, with no login. It follows the FSBPT content outline used in this product: 225 items, of which 180 are scored, across the body systems and the examination, evaluation, and intervention tasks. Confirm the current candidate handbook. It does not predict a result.",
    answers: [
      {
        id: "npte-how-many-questions",
        question: "How many questions are on the NPTE?",
        answer:
          "The outline used here describes 225 items, with 180 scored. The rest are pretest items. You will not be told which items are scored. Check the current FSBPT candidate handbook before test day.",
      },
      {
        id: "npte-what-systems",
        question: "What body systems does the NPTE study guide cover?",
        answer:
          "Musculoskeletal, neuromuscular, cardiovascular and pulmonary, and the other systems, plus non-system topics such as safety and professional responsibilities. Spend more time on the larger ranges, and do not skip the smaller ones.",
      },
      {
        id: "npte-is-it-free",
        question: "Is this NPTE study guide free?",
        answer:
          "Yes. This NPTE study guide is public. No account is required to read it.",
      },
    ],
  },
};

export const STEP_SEO: Record<string, GuideSeoCopy> = {
  "step-1": {
    query: "USMLE Step 1 study guide",
    headline: "USMLE Step 1 study guide",
    lede:
      "This USMLE Step 1 study guide is free to read, with no login. It treats each item as a mechanism: a normal process, one broken step, and the finding that follows. It does not quote a minimum passing score.",
    answers: [
      {
        id: "step-1-what",
        question: "What does the USMLE Step 1 study guide cover?",
        answer:
          "Pathology, physiology, and pharmacology by organ system, plus microbiology and anatomy where they change the mechanism. The book tells you to confirm the current weights on the USMLE site.",
      },
      {
        id: "step-1-how",
        question: "How should I read a Step 1 item?",
        answer:
          "Name the normal process, find the broken step, then pick the finding that follows. A fact with no mechanism is usually the trap.",
      },
    ],
  },
  "step-2-ck": {
    query: "USMLE Step 2 CK study guide",
    headline: "USMLE Step 2 CK study guide",
    lede:
      "This USMLE Step 2 CK study guide is free to read, with no login. Clinical Knowledge means diagnosis and the next step in management, not the retired clinical-skills exam. It does not predict a result.",
    answers: [
      {
        id: "step-2-what",
        question: "What does the USMLE Step 2 CK study guide cover?",
        answer:
          "The clerkship systems: cardiovascular, pulmonary, gastrointestinal, and the rest of the diagnostic work, plus ethics and evidence. Read a system, then practice the next-step decision.",
      },
      {
        id: "step-2-ck-vs-cs",
        question: "Is Step 2 CK the same as the clinical-skills exam?",
        answer:
          "No. This book is Step 2 Clinical Knowledge. It is not the retired clinical-skills exam.",
      },
    ],
  },
  "step-3": {
    query: "USMLE Step 3 study guide",
    headline: "USMLE Step 3 study guide",
    lede:
      "This USMLE Step 3 study guide is free to read, with no login. It covers ambulatory decisions, emergency care, and the case-simulation patterns in this book. It does not promise a result.",
    answers: [
      {
        id: "step-3-what",
        question: "What does the USMLE Step 3 study guide cover?",
        answer:
          "Day-to-day management, when to escalate, and how the case simulations are framed. Confirm the current exam-day rules on the USMLE site before you sit.",
      },
      {
        id: "step-3-ccs",
        question: "How are the Step 3 case simulations organized here?",
        answer:
          "The book separates a framework from the common case patterns, so you can practice the order of actions without treating one case as a script.",
      },
    ],
  },
};

export function guideJsonLd(input: {
  path: string;
  headline: string;
  description: string;
  answers: GuideAnswer[];
  dateModified: string;
}): Record<string, unknown> {
  const pageUrl = absoluteUrl(input.path);
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: input.headline, item: pageUrl },
        ],
      },
      {
        "@type": "Article",
        headline: input.headline,
        description: input.description,
        dateModified: input.dateModified,
        mainEntityOfPage: pageUrl,
        author: { "@type": "Organization", name: SCHEMA_BRAND_NAME },
        publisher: { "@type": "Organization", name: SCHEMA_BRAND_NAME },
      },
      {
        "@type": "FAQPage",
        mainEntity: input.answers.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
