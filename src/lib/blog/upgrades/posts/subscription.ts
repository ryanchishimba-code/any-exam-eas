import { a, faq, h2, h3, p, readMinutes, table, ul } from "@/lib/blog/upgrades/html";
import { TRIAL_HREF, TRIAL_OFFER, TRIAL_QUESTION_LIMIT, trialClose } from "@/lib/blog/upgrades/offer";
import type { BlogUpgrade } from "@/lib/blog/upgrades/types";

const content = [
  p(
    `One Pro subscription covers six licensing exams: NCLEX-RN and NCLEX-PN, USMLE Step 1, Step 2 CK, and Step 3, NAPLEX, PANCE, AANP FNP, and NPTE-PT. You do not buy a separate bank for each board. The offer is ${TRIAL_OFFER}. ${TRIAL_QUESTION_LIMIT}. After the trial, practice stays locked unless you continue on Pro.`
  ),
  p(
    `This page is what the product actually includes. It is not a comparison that invents another company’s price, and it is not a claim that you will pass. For how to study, use the ${a("/blog/strategies", "NCLEX study plan")}, the ${a("/blog/why", "budget NCLEX guide")}, or the ${a("/blog/okay", "NAPLEX study plan")}.`
  ),

  h2("Who the plan is for"),
  ul([
    `A nursing graduate who wants Client Needs practice and Next Generation item types without a second subscription for “cases only.”`,
    `A pharmacy graduate who needs calculations and the five NAPLEX domains in the same place as the cases.`,
    `Anyone who might sit more than one of these exams, or who wants one login instead of a stack of single-exam products.`,
  ]),
  p(
    `If you only need a one-week peek, the trial is the honest way to look. Five hundred questions is enough to test rationales, the Roadmap, and a case. It is not enough to finish a full board review. That is what the month is for.`
  ),

  h2("What you can use on the trial, and what Pro adds"),
  table(
    ["", "5-day trial", "Pro"],
    [
      ["Exams", "All six banks", "All six banks"],
      ["Questions", "500 during the trial", "No question cap"],
      ["Full-length adaptive exam", "One", "Included"],
      ["Blueprint Roadmap and weak-area sets", "Yes", "Yes"],
      ["Deep Dive review after a miss", "Yes", "Yes"],
      ["Spaced repetition", "Yes", "Yes"],
      ["AI Tutor on missed reasoning", "NCLEX, NAPLEX, and USMLE", "NCLEX, NAPLEX, and USMLE"],
      ["Reference books", "While the trial is active", "While Pro is active"],
    ]
  ),
  p(
    `AI Tutor walks through why you missed an item on NCLEX, NAPLEX, and the USMLE steps. It is not turned on for PANCE, AANP FNP, or NPTE-PT. Those banks still have rationales, Roadmaps, and full-length exams.`
  ),
  h3("Reference books are not a free download"),
  p(
    `The NCLEX, NAPLEX, and AANP FNP study guides are reference books inside the product. They open for a signed-in trial or Pro account. When the trial ends, they close with the rest of the study tools. Bookmarks and highlights stay on the account if you continue. There is no separate “free PDF” that replaces the book.`
  ),
  p(
    `Open them from ${a("/nclex/study-guide", "NCLEX")}, ${a("/naplex/study-guide", "NAPLEX")}, or ${a("/aanp-fnp/study-guide", "AANP FNP")} after you start. USMLE, PANCE, and NPTE-PT prep on this plan is the question bank, Roadmap, and exams, not a matching reference book.`
  ),

  h2("NCLEX item types in the bank"),
  p(
    `The live NCLEX exam uses unfolding case studies, plus stand-alone clinical judgment items such as bow-tie and trend. The NCLEX question bank includes those formats: bow-tie items, trend items, and an authored set of 10 unfolding case studies with six questions each. Practice them from ${a("/nclex", "NCLEX prep")} instead of only single-best-answer drills.`
  ),
  p(
    `A practice percent is not your NCLEX or NAPLEX result. The product labels in-app scores as practice progress on this platform. NCSBN and NABP do not use a prep company’s percent as a passing standard.`
  ),

  h2("How a week looks if you use one login"),
  ul([
    `Pick the exam on your authorization, not all six at once. The other banks stay available. They should not steal the weeks before a single test date.`,
    `Start on the Roadmap’s weak area, not on a random 75. Random sets hide the category you keep missing.`,
    `After a miss, open the rationale and, on NCLEX, NAPLEX, or USMLE, the AI Tutor if you still cannot say why the better action wins.`,
    `Once a week, sit a longer timed block. The trial includes one full-length adaptive exam. Use it when you want a pacing check, not on the first afternoon.`,
    `Keep an error note outside the app if you want it on paper. Exportable notes are part of Pro.`,
  ]),

  h2("What this subscription does not do"),
  ul([
    `It does not promise a license, a score, or a job.`,
    `It is not affiliated with NCSBN, NABP, NBME, FSMB, NCCPA, AANPCB, or FSBPT.`,
    `It does not set your eligibility. Your board or medical authority does.`,
    `It does not replace the official test plan, content outline, or candidate bulletin. Those stay the source of exam rules. The ${a("/blog/strategies", "NCLEX guide")} and ${a("/blog/okay", "NAPLEX guide")} link them.`,
  ]),
  p(
    `Price after the trial is $27.99 per month on the monthly plan. Longer billing intervals exist on ${a("/pricing", "pricing")} if you want them. The trial itself does not ask for a payment method. ${a(TRIAL_HREF, "Try for free")} when you want to see a case and a rationale, not a feature list.`
  ),
  trialClose(`If the fit is right, keep going on Pro when the 500 questions run out.`),

  h2("Sources for the exams, and for the product"),
  p(
    `Exam rules change on the boards’ calendars. Read them yourself:`
  ),
  ul([
    `${a("https://www.nclex.com/test-plans", "NCLEX test plans", true)} and the ${a("https://www.nclex.com/files/2026_NCLEX_Candidate_Bulletin_English.pdf", "2026 candidate bulletin", true)}.`,
    `${a("https://nabp.pharmacy/programs/examinations/naplex/take-the-naplex-exam/", "NABP, Take the NAPLEX", true)}.`,
    `${a("https://www.usmle.org/", "USMLE", true)} for Step 1, Step 2 CK, and Step 3.`,
    `${a("https://www.nccpa.net/", "NCCPA", true)} for the PANCE.`,
    `${a("https://www.aanpcert.org/", "AANPCB", true)} for the FNP certification exam.`,
    `${a("https://www.fsbpt.org/", "FSBPT", true)} for the NPTE-PT.`,
  ]),
  p(
    `Product limits in the table are the ones in this app: a 5-day trial, 500 questions, one full-length adaptive exam on the trial, and reference books only while trial or Pro access is on. If a screen in your account disagrees with this article, believe the screen.`
  ),

  faq([
    {
      q: "How much does AnyExamEasy cost?",
      a: "5-day free trial · no payment method required · then $27.99/mo. The trial includes 500 practice questions and one full-length adaptive exam. Pro removes the question cap.",
    },
    {
      q: "Which exams are included?",
      a: "NCLEX-RN and NCLEX-PN, USMLE Step 1, Step 2 CK, and Step 3, NAPLEX, PANCE, AANP FNP, and NPTE-PT. One subscription covers the six banks.",
    },
    {
      q: "Are the study guides free?",
      a: "No. The NCLEX, NAPLEX, and AANP FNP reference books are included during the trial and on Pro. They are not available as a free download after the trial ends.",
    },
    {
      q: "Does the NCLEX bank include Next Generation items?",
      a: "Yes. It includes bow-tie items, trend items, and 10 unfolding case studies with six questions each, along with other practice items mapped to Client Needs.",
    },
    {
      q: "Will a high practice score mean I pass?",
      a: "No. Practice scores describe your work on this platform. NCSBN, NABP, and the other boards set their own standards. Use the scores to find weak areas, not as a prediction.",
    },
  ]),
].join("");

export const subscriptionPost: BlogUpgrade = {
  slug: "spend-less-pass-easy",
  title: "What One Subscription Includes for Six Boards",
  metaTitle: "What One Subscription Includes for Six Boards",
  metaDescription:
    "Six exams on one plan: NCLEX, USMLE, NAPLEX, PANCE, FNP, and NPTE, with a Roadmap. 5-day free trial · no payment method required · then $27.99/mo.",
  excerpt:
    "What you actually get on one plan: six exam banks, a 500-question trial, one full-length adaptive exam, and reference books that stay with Pro.",
  category: "All boards",
  tags: ["board exam subscription", "NCLEX", "USMLE", "NAPLEX", "free trial"],
  primaryKeyword: "six board exams one subscription",
  searchIntent: "Decide whether one multi-exam subscription matches how you study",
  content,
  readTime: readMinutes(content),
};
