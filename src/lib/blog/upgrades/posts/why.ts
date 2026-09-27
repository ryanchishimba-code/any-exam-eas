import { a, faq, h2, h3, ol, p, readMinutes, ul } from "@/lib/blog/upgrades/html";
import { TRIAL_HREF, TRIAL_OFFER, TRIAL_QUESTION_LIMIT, trialClose } from "@/lib/blog/upgrades/offer";
import type { BlogUpgrade } from "@/lib/blog/upgrades/types";

const RN_PLAN = "https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf";
const TEST_PLANS = "https://www.nclex.com/test-plans";
const BULLETIN = "https://www.nclex.com/files/2026_NCLEX_Candidate_Bulletin_English.pdf";
const PREPARE = "https://www.nclex.com/prepare.page";

const content = [
  p(
    `You can prepare for the NCLEX without a several-hundred-dollar course if you study the official test plan, practice clinical judgment in short daily sets, and pay only for a question bank you will actually finish. Expensive does not mean complete. A focused plan and honest review of your misses will carry more of the work than another unused video library.`
  ),
  p(
    `This guide is about cost and habits. For the exam format, the week-by-week schedule, and how bow-tie and trend items work, use the ${a("/blog/strategies", "NCLEX study plan for RN and PN candidates")}. If you are also looking at pharmacy or several boards on one bill, see ${a("/blog/spend-less-pass-easy", "what one subscription includes")}.`
  ),

  h2("Start with what NCSBN already gives you"),
  p(
    `Before you buy anything, download the test plan for your exam. The ${a(RN_PLAN, "2026 NCLEX-RN Test Plan", true)} is effective April 1, 2026 through March 31, 2029. The PN plan for the same window is listed on ${a(TEST_PLANS, "NCLEX test plans", true)}. Both the RN and PN exams are computerized adaptive tests of 85 to 150 items with a five-hour limit, including the tutorial and breaks, per the ${a(BULLETIN, "2026 NCLEX Candidate Bulletin", true)}.`
  ),
  p("Use the free official pieces this way:"),
  ul([
    `<strong>Test plan.</strong> Read the Client Needs ranges and the activity statements. That is your syllabus. Spend more time on the wider ranges, not on whatever a social post called “high yield” this week.`,
    `<strong>Candidate bulletin.</strong> Registration with Pearson VUE is $200. A change to an existing registration is $50. International scheduling is an extra $150 where it applies. Your nursing regulatory body charges its own licensure fee. Confirm the current bulletin before you pay, because those amounts are set by NCSBN and Pearson, not by a prep company.`,
    `<strong>Tutorial and sample pack.</strong> ${a(PREPARE, "NCLEX’s prepare page", true)} includes a candidate tutorial and a sample pack with case studies. Do the tutorial once so exam day is not the first time you see the software.`,
  ]),
  p(
    `None of that replaces practice questions. It stops you from buying a second resource to learn facts the test plan already states.`
  ),

  h2("Where the money usually goes"),
  p(
    `Most of the bill in NCLEX prep is a question bank, sometimes bundled with videos and a “readiness” score. Readiness scores are marketing unless the company shows you the method. AnyExamEasy does not turn a practice percent into a promise that you will pass. In-app scores describe what you did on this platform. They are not a prediction of your NCLEX result.`
  ),
  p("A workable budget, in order:"),
  ol([
    `Free: test plan, candidate bulletin, tutorial, and a simple error log (a note on your phone is enough).`,
    `One paid bank you will open daily. Skip the second and third banks. Switching products feels like progress and usually resets your notes.`,
    `A reference book only if you will read it. The NCLEX study guide on this site is part of the trial and Pro. It is not a free download that stays open after the trial ends.`,
  ]),
  p(
    `AnyExamEasy is one plan for six exams, not an NCLEX-only course. The public offer is ${TRIAL_OFFER}. ${TRIAL_QUESTION_LIMIT}. The trial also includes one full-length adaptive exam. Pro removes the question cap. ${a(TRIAL_HREF, "Start the trial")} when you are ready to practice, or keep reading and decide at the end.`
  ),

  h2("A six-week plan that fits a student budget"),
  p(
    `Six weeks is enough for many graduates who can study most days. If you have been away from clinical content, stretch the same steps over eight to ten weeks instead of adding more products. If you are working, protect 90 minutes on workdays and one longer block on a day off. Ten hours on Sunday does not replace four ordinary days.`
  ),
  h3("Weeks 1 and 2 — find the holes"),
  ul([
    `Day 1: skim the test plan and write the eight RN Client Needs categories, or the PN categories if that is your exam, on one page.`,
    `Days 2 to 4: 40 to 60 mixed questions, untimed. After each miss, write the category and the one cue you ignored.`,
    `Days 5 to 14: 60 to 85 questions on your two weakest categories. Still untimed until you can explain the answer before you look.`,
  ]),
  h3("Weeks 3 and 4 — judgment, not more content dumps"),
  p(
    `Add one unfolding-style case a day. Read only the information that has been revealed, answer, then ask what changed when the next tab opens. On a bow-tie shape, name the condition before you pick actions or monitors. On a trend, compare the columns: a falling oxygen saturation on the same device is a change in condition.`
  ),
  p(
    `The NCLEX bank here includes bow-tie items, trend items, and unfolding case studies, including an authored set of 10 cases with six questions each. Use them. A video that explains a format is not the same as answering one.`
  ),
  h3("Weeks 5 and 6 — time and recovery"),
  ul([
    `One timed block of about 85 questions in week 5. Review only the misses the same day, while you still remember why you picked them.`,
    `Week 6 is lighter. One timed block early in the week, then the error log, sleep, and the tutorial if you have not done it.`,
    `Stop adding resources in the last ten days. A new bank in the final week creates a new pile of unfamiliar rationales and very little new judgment.`,
  ]),

  h2("How to review a miss so you do not buy another course"),
  p("Keep the note to four lines:"),
  ol([
    `The cue you underweighted (a vital sign, a lab, a safety risk, a scope-of-practice limit).`,
    `The action you chose, and the action that protected the client sooner.`,
    `The Client Needs category.`,
    `Whether you missed it from a knowledge gap or from rushing. Those need different fixes. A knowledge gap gets a short reread. Rushing gets a slower set tomorrow, not a new subscription.`,
  ]),
  p(
    `Example. A client two hours after abdominal surgery is suddenly short of breath, oxygen saturation is 89% on the same nasal cannula as this morning, and the nurse’s note says the client was comfortable at breakfast. The trend is the point. You do not finish the dressing change and “recheck in an hour.” You stay with the client, support breathing, and get help. That is the same habit a trend item is built to test. It is a study sketch, not an official NCSBN item.`
  ),

  h2("What to skip"),
  ul([
    `Claims that you will pass, and readiness percents you cannot audit. NCSBN does not license those claims.`,
    `A second question bank before you have finished a full pass through one error log.`,
    `Buying every mnemonic deck. Pharmacology matters — the RN test plan assigns about 13–19% of content-area items to Pharmacological and Parenteral Therapies — but a deck without cases will not teach you which client to see first.`,
    `Studying for a score of 75% because someone said that is “safe.” The NCLEX is not scored as a percent you get to see. The RN passing standard is 0.00 logits and the PN standard is −0.18 logits through March 31, 2029. ${a("https://www.nclex.com/passing-standard.page", "NCSBN publishes both", true)}.`,
  ]),

  h2("Put the hours on the exam you are actually taking"),
  p(
    `Open ${a("/nclex", "NCLEX prep")} and sort practice by Client Needs after the first diagnostic. The ${a("/blog/strategies", "study-plan article")} has the RN percentage ranges and a closer look at case studies. PN candidates should use the PN test plan for category names and ranges. Coordinated Care replaces Management of Care, and the bands are not identical. Do not study RN percentages if you are taking the PN.`
  ),
  trialClose(
    `When you want the cases and the error-log habit in one place, use the trial on the question bank.`
  ),

  h2("Sources"),
  ul([
    `${a(RN_PLAN, "NCSBN, 2026 NCLEX-RN Test Plan (effective April 1, 2026–March 31, 2029)", true)}.`,
    `${a(TEST_PLANS, "NCLEX test plans", true)}, including the 2026 PN test plan for the same window.`,
    `${a(BULLETIN, "NCSBN, 2026 NCLEX Examination Candidate Bulletin", true)} for length, time, registration fees, and partial-credit scoring.`,
    `${a("https://www.nclex.com/passing-standard.page", "NCLEX passing standard", true)}.`,
    `${a(PREPARE, "NCLEX prepare page", true)} for the tutorial and sample pack.`,
  ]),
  p(
    `Any Exam Easy is an independent study aid. It is not affiliated with, endorsed by, or sponsored by NCSBN. Confirm every rule in the documents above if your appointment is outside the 2026 test-plan window.`
  ),

  faq([
    {
      q: "Can I pass the NCLEX with only free materials?",
      a: "The test plan, candidate bulletin, and tutorial are free and you should use them. Most candidates still need a large set of practice questions with rationales. Free quizzes rarely cover unfolding cases, bow-tie items, and trend items at exam length. Use free official documents for the rules, and a question bank for the reps.",
    },
    {
      q: "How much does NCLEX registration cost?",
      a: "The 2026 NCLEX Candidate Bulletin lists a $200 registration fee, a $50 fee to change an existing registration, and a $150 international scheduling fee where it applies. Your nursing regulatory body sets a separate licensure fee. Read the current bulletin before you pay.",
    },
    {
      q: "Is a six-week plan long enough?",
      a: "Six weeks of nearly daily practice is a reasonable block for many new graduates. If your program ended a long time ago, or you can study only a few hours a week, use the same steps over more weeks. Adding a second commercial course does not replace the hours.",
    },
    {
      q: "Does AnyExamEasy replace the official test plan?",
      a: "No. The test plan is the syllabus. The question bank is where you practice the judgment the plan describes. The trial is 5 days, no payment method required, then $27.99 a month, and it includes 500 practice questions plus one full-length adaptive exam.",
    },
  ]),
].join("");

export const whyPost: BlogUpgrade = {
  slug: "why",
  title: "Affordable NCLEX Prep That Builds Clinical Judgment",
  metaTitle: "Affordable NCLEX Prep That Builds Clinical Judgment",
  metaDescription:
    "Build an affordable NCLEX plan from the official test plan, daily questions, and an error log. Skip extra courses. 5-day free trial, no payment method required.",
  excerpt:
    "A budget NCLEX plan: official test plan first, one question bank, and a six-week habit that trains clinical judgment without a stack of unused courses.",
  category: "NCLEX",
  tags: ["affordable NCLEX prep", "NCLEX budget", "NCLEX test plan", "clinical judgment"],
  primaryKeyword: "affordable NCLEX prep",
  searchIntent: "How to prepare for the NCLEX without an expensive course",
  content,
  readTime: readMinutes(content),
};
