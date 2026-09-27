import { a, faq, h2, h3, ol, p, readMinutes, table, ul } from "@/lib/blog/upgrades/html";
import { TRIAL_QUESTION_LIMIT, trialClose } from "@/lib/blog/upgrades/offer";
import type { BlogUpgrade } from "@/lib/blog/upgrades/types";

const TAKE = "https://nabp.pharmacy/programs/examinations/naplex/take-the-naplex-exam/";
const OUTLINE = "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf";
const OUTLINE_DATED = "https://nabp.pharmacy/wp-content/uploads/2024/09/NAPLEX-Content-Outline.pdf";
const SCORE = "https://nabp.pharmacy/help/scaled-score-and-domain-level-meaning/";
const HUB = "https://nabp.pharmacy/programs/examinations/naplex/";

const content = [
  p(
    `The NAPLEX is a fixed, computer-based exam: 225 questions in six hours, reported to you as pass or fail. You may attempt it five times. For appointments on or after May 1, 2025, study NABP’s five-domain content outline. Forty percent of the 200 scored questions are person-centered assessment and treatment planning. Twenty-five questions are unscored pretest items mixed into the 225, so treat every item as if it counts.`
  ),
  p(
    `Those facts are from NABP’s ${a(TAKE, "take-the-NAPLEX page", true)} and the ${a(OUTLINE, "NAPLEX Content Outline", true)}. This article is a study plan built on that outline. It does not predict your result, and it is not affiliated with NABP.`
  ),

  h2("The five domains, with the weights NABP published"),
  p(
    `The outline states the share of the 200 scored questions. Domain 3 is the largest block. Domains 4 and 5 are small and still show up. Candidates who ignore ethics, communication, and pharmacy operations because they are “only 5%” donate easy points.`
  ),
  table(
    ["Domain", "Scored weight", "About how many scored items"],
    [
      ["1. Foundational Knowledge for Pharmacy Practice", "25%", "50"],
      ["2. Medication Use Process", "25%", "50"],
      ["3. Person-Centered Assessment and Treatment Planning", "40%", "80"],
      ["4. Professional Practice", "5%", "10"],
      ["5. Pharmacy Management and Leadership", "5%", "10"],
    ]
  ),
  p("What to put inside each domain while you study:"),
  ul([
    `<strong>Domain 1.</strong> Calculations, pharmacokinetics, pharmaceutics, compounding, and biostatistics you can use on a case (number needed to treat, absolute risk, sensitivity and specificity). This is daily work, not a weekend crash.`,
    `<strong>Domain 2.</strong> The path from prescribing through monitoring: verification, labeling, devices, therapeutic drug monitoring, adherence, and medication safety.`,
    `<strong>Domain 3.</strong> Guideline-level treatment for the common disease states: cardiovascular, infectious diseases, diabetes, respiratory, anticoagulation, and special populations. This is where most of your cases should live.`,
    `<strong>Domain 4.</strong> Ethics, communication, and professional practice. Teach-back and a clear recommendation beat a speech.`,
    `<strong>Domain 5.</strong> Inventory, formulary decisions, quality, and the operational problems a new pharmacist is expected to notice.`,
  ]),
  p(
    `The older two-area NAPLEX split is retired for exams on this outline. If a review book still leads with that split, check the copyright against May 1, 2025.`
  ),

  h2("How the result is decided"),
  p(
    `NABP’s help page on ${a(SCORE, "scaled scores", true)} says a scaled score of 75 or higher is the passing standard on the NAPLEX scale of 0 to 150, and that 75 is not 75% correct. The same page says scaled scores are no longer reported on the NAPLEX itself. You should expect pass or fail. Do not build your plan around hitting a practice percent of 75 and calling it the standard.`
  ),
  p(
    `Eligibility is decided by the board of pharmacy, not by a prep company. Application steps and test-day identification rules are in NABP’s bulletin, linked from the take-the-exam page. Read them before you travel. A refused ID is a wasted attempt.`
  ),

  h2("An eight-week plan"),
  p(
    `Eight weeks fits most new graduates who can study five days a week. Use six weeks if your clinical rotations are fresh and calculations are already clean. Use ten to twelve if you have been away from therapeutics. The loop is the same: math every day, cases in Domain 3, and a written reason for every miss.`
  ),
  table(
    ["Weeks", "Main work"],
    [
      ["1", "Read the outline. Timed diagnostic of mixed items. Sort misses by domain, not by how annoyed you felt."],
      ["2–3", "Domain 1 every morning (calculations and kinetics). Domain 3 cases in the afternoon, one organ system at a time."],
      ["4–5", "Domain 2 safety and process, plus Domain 3 infectious disease, cardiology, and diabetes. One longer set midweek."],
      ["6", "Domains 4 and 5 in short sets so they are not new on test day. Keep the math streak."],
      ["7", "A full-length practice sitting. Review only misses the next day. Note whether the miss was math, a guideline, or reading speed."],
      ["8", "Weak domain only, lighter volume, sleep. No new review book."],
    ]
  ),
  p("A day that respects Domain 3 without dropping math:"),
  ol([
    `25–40 minutes of calculations before cases. Cold math at the start of the day sticks better than math at midnight.`,
    `60–90 minutes of patient cases, mostly Domain 3, with the domain tag visible so you notice when you avoid infectious disease.`,
    `20 minutes on the misses. Write the decision you should have made in one sentence.`,
  ]),

  h2("Calculations you should be able to do cold"),
  p(
    `These are study problems, not NAPLEX items. Check the arithmetic yourself. If a commercial “trick” disagrees with the formula, trust the formula.`
  ),
  h3("Volume from a concentration"),
  p(
    `Order: give 250 mg. The vial is 500 mg in 10 mL. Volume = desired ÷ have × supply = 250 ÷ 500 × 10 mL = 5 mL. Write the units in the setup so you do not invert the fraction.`
  ),
  h3("Infusion rate"),
  p(
    `Order: 1,000 mL of 0.9% sodium chloride over 8 hours. Rate = 1,000 ÷ 8 = 125 mL/h. If the tubing is 15 drops per mL, drops per minute = (125 mL/h × 15 gtt/mL) ÷ 60 minutes = 31.25, which rounds to 31 gtt/min. On the exam the computer usually wants mL/h, but you should still be able to finish the drop-factor step.`
  ),
  h3("A kinetics check, not a derivation"),
  p(
    `Half-life tells you how fast the concentration falls, not the dose by itself. If a level is high and the next dose is due, the question is often “hold and reassess,” not “give it because the schedule says so.” Pair every kinetics fact with the monitoring step in Domain 2.`
  ),

  h2("How to study Domain 3 without rereading the whole book"),
  p("For each disease state, keep a card with only four lines:"),
  ul([
    `First-line therapy you would start, and the one reason you would not.`,
    `The monitoring parameter that changes your next decision (potassium, INR, renal function, glucose, cultures).`,
    `A serious harm: bleed, hypoglycemia, tendon injury, serotonin toxicity, angioedema. Name it specifically.`,
    `One special population twist: pregnancy, older adults, dialysis, or a drug interaction that removes the first-line choice.`,
  ]),
  p(
    `Then do questions. Rereading the card is not practice. If you miss a case, fix that one line. Do not highlight the chapter again.`
  ),
  p(
    `${a("/naplex", "NAPLEX prep")} on this site follows the same five domains, with calculations mixed into the bank and a Roadmap that shows which domain you are avoiding. The reference book at ${a("/naplex/study-guide", "the NAPLEX study guide")} is included during the trial and on Pro. It closes when the trial ends unless you continue. ${TRIAL_QUESTION_LIMIT}.`
  ),

  h2("Mistakes that cost a retake"),
  ul([
    `Leaving calculations for the last week. Domain 1 is a quarter of the scored exam. Fatigue makes arithmetic worse, not better.`,
    `Studying drugs as lists instead of as choices for a specific patient. Domain 3 is assessment and planning.`,
    `Ignoring the 25 pretest items and trying to “spot” them. You cannot. Answer all 225.`,
    `Treating a practice percent of 75 as a pass. NABP has said plainly that a scaled score of 75 is not 75% correct.`,
    `A new resource in the final week. Finish the error log you already have.`,
  ]),
  trialClose(`When the outline is clear, put the hours into cases and math.`),

  h2("Sources"),
  ul([
    `${a(TAKE, "NABP, Take the NAPLEX Exam", true)}: 225 questions, 6 hours, fixed form, pass/fail, five attempts, and the May 1, 2025 outline change.`,
    `${a(OUTLINE, "NABP NAPLEX Content Outline", true)} and the ${a(OUTLINE_DATED, "September 2024 PDF", true)} that states the five domain weights for exams beginning May 1, 2025.`,
    `${a(SCORE, "NABP, What does the scaled score and domain level information mean?", true)}: passing scaled score of 75 is not a percent correct, and NAPLEX results are pass/fail.`,
    `${a(HUB, "NABP NAPLEX program hub", true)}.`,
  ]),
  p(
    `Any Exam Easy is not affiliated with NABP or any board of pharmacy. If NABP updates the outline after your exam date, follow the document that matches your appointment.`
  ),

  faq([
    {
      q: "How many questions are on the NAPLEX, and how long is it?",
      a: "NABP describes a 225-question, six-hour, fixed-form computerized exam. About 200 questions are scored and 25 are pretest. You will not know which are which.",
    },
    {
      q: "What is a passing NAPLEX score?",
      a: "Results are reported as pass or fail. NABP states that a scaled score of 75 or higher on a 0 to 150 scale is the passing standard, and that this is not the percentage of questions you answered correctly. Scaled scores are no longer shown on the NAPLEX report.",
    },
    {
      q: "Which NAPLEX domain should I study the most?",
      a: "Domain 3, Person-Centered Assessment and Treatment Planning, is 40% of scored items, about 80 questions. Still practice calculations every day. Domain 1 is 25%.",
    },
    {
      q: "How many times can I take the NAPLEX?",
      a: "NABP’s take-the-exam page says candidates are allowed five attempts. Your board of pharmacy may have its own waiting rules. Confirm both before you reschedule.",
    },
    {
      q: "Does the NAPLEX study guide come with the free trial?",
      a: "The NAPLEX reference book is available during the 5-day trial and on Pro. It is not a separate free book that stays open after the trial ends. The trial includes 500 practice questions and does not require a payment method.",
    },
  ]),
].join("");

export const naplexPost: BlogUpgrade = {
  slug: "okay",
  title: "NAPLEX Study Plan From the NABP Content Outline",
  metaTitle: "NAPLEX Study Plan From the NABP Content Outline",
  metaDescription:
    "Study the NAPLEX with NABP’s five domains: 225 questions, six hours, pass/fail, and a daily math habit. Domain 3 is 40% of scored items. Eight-week plan inside.",
  excerpt:
    "A NAPLEX plan built on the current five-domain outline: what the exam is, where the points sit, and how to practice calculations without cramming them.",
  category: "NAPLEX",
  tags: ["NAPLEX study plan", "NABP content outline", "pharmacy calculations", "NAPLEX domains"],
  primaryKeyword: "NAPLEX study plan",
  searchIntent: "Learn the current NAPLEX format and build a domain-based study plan",
  content,
  readTime: readMinutes(content),
};
