import { a, faq, h2, h3, ol, p, readMinutes, table, ul } from "@/lib/blog/upgrades/html";
import { trialClose } from "@/lib/blog/upgrades/offer";
import type { BlogUpgrade } from "@/lib/blog/upgrades/types";

const RN_PLAN = "https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf";
const TEST_PLANS = "https://www.nclex.com/test-plans";
const BULLETIN = "https://www.nclex.com/files/2026_NCLEX_Candidate_Bulletin_English.pdf";
const PASSING = "https://www.nclex.com/passing-standard.page";

const content = [
  p(
    `Both the NCLEX-RN and the NCLEX-PN are computerized adaptive tests. You will answer at least 85 items and at most 150, and you have five hours including the tutorial and every break. You pass or fail against a fixed standard. You are not shown a percent correct. Build the study plan around that shape: Client Needs content, three unfolding case studies on every exam, and stand-alone clinical judgment items as the test gets longer.`
  ),
  p(
    `The rules below come from the ${a(BULLETIN, "2026 NCLEX Candidate Bulletin", true)} and the ${a(RN_PLAN, "2026 NCLEX-RN Test Plan", true)}, effective April 1, 2026 through March 31, 2029. PN candidates should open the PN plan from ${a(TEST_PLANS, "the test-plan page", true)} for category names. If you mainly need a lower-cost way to study, read ${a("/blog/why", "affordable NCLEX prep")} and come back here for the format.`
  ),

  h2("What the computer is doing"),
  p(
    `The exam adapts. Stronger answers lead to harder items. The test can stop when the computer is 95% sure your ability is above or below the passing standard, when you reach the maximum of 150 items, or when time runs out. An early stop is not a result you can read from the room. Keep using the same safety check on item 85 that you used on item 20.`
  ),
  p(
    `On a minimum-length RN exam, NCSBN’s test plan assigns 52 items to the content areas below, 18 items to three clinical-judgment case studies (six items in each case), and 15 unscored pretest items. You cannot tell which items are pretest. Longer exams add more scored content and about 10% stand-alone clinical judgment items, depending on length. The PN exam uses the same 85-to-150 range and the same five-hour clock.`
  ),
  p(
    `The RN passing standard is 0.00 logits through March 31, 2029. The PN standard is −0.18 logits through the same date. ${a(PASSING, "NCSBN’s passing-standard page", true)} is the source. A logit is not a percent, and a practice-test percent on any prep site is not that standard.`
  ),

  h2("RN Client Needs ranges"),
  p(
    `These ranges apply to the content-area items, not to the 18 case-study items, which can span categories. Individual exams can vary by about three percentage points in a category. Study the wide bands more, and do not skip a “small” band. Six to twelve percent of a 150-item test is still a lot of questions.`
  ),
  table(
    ["RN Client Needs category", "Share of content-area items"],
    [
      ["Management of Care", "15–21%"],
      ["Safety and Infection Prevention and Control", "10–16%"],
      ["Health Promotion and Maintenance", "6–12%"],
      ["Psychosocial Integrity", "6–12%"],
      ["Basic Care and Comfort", "6–12%"],
      ["Pharmacological and Parenteral Therapies", "13–19%"],
      ["Reduction of Risk Potential", "9–15%"],
      ["Physiological Adaptation", "11–17%"],
    ]
  ),
  p(
    `PN exams use Coordinated Care instead of Management of Care, and Pharmacological Therapies instead of Pharmacological and Parenteral Therapies. The percentage bands differ. Study the PN test plan if that is the exam on your authorization to test. Do not memorize the RN table and hope it transfers.`
  ),

  h2("How to work an unfolding case"),
  p(
    `Each case study walks the six steps of the NCSBN Clinical Judgment Measurement Model: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes. New information shows up as you go. Do not answer step 4 with data that has not been revealed yet, and do not ignore a new vital sign because you already “decided” on step 1.`
  ),
  ol([
    `First screen: who is this client, why are they here, and what is unstable right now?`,
    `Each question: answer only what is asked. A teaching question is not a “call the provider” question.`,
    `When a new time point appears, name what changed in one line before you pick.`,
    `Last questions often ask whether the action worked. If the client is worse, the next step is escalation, not repeating the same action.`,
  ]),
  h3("Bow-tie items"),
  p(
    `A bow-tie puts a condition in the middle, actions on one side, and parameters to monitor on the other. Name the condition first. Then pick actions that treat that condition, and monitors that would tell you the action worked. A correct monitor for a different disease is still wrong here.`
  ),
  p(
    `Study sketch, not an official item. Center: suspected fluid overload in a client with heart failure who has new crackles and a weight gain since yesterday. Actions you can defend: raise the head of the bed, give the prescribed diuretic if it is due, and restrict fluid as ordered. Monitors that match: urine output, breath sounds, potassium, and weight. A glucose check may be good nursing in another chart. It does not belong on this bow-tie unless the stem gives you a diabetes problem.`
  ),
  h3("Trend items"),
  p(
    `Trend items show the same measures across time. Read down the columns, not just the latest number. Oxygen saturation of 97%, then 94%, then 90% on an unchanged device is a deteriorating client. Pain that was 8 and is now 3 after the prescribed analgesic is a different decision. The question is what the change means for the next action.`
  ),
  h3("Partial credit"),
  p(
    `Some items have more than one correct key. The candidate bulletin names three partial-credit methods: plus/minus, zero/one, and rationale scoring. You will not see the method on the item. Select an option only when you can say why it belongs. Filling every box because “partial credit rewards more clicks” is a rumor, not a strategy.`
  ),

  h2("A six-week study plan"),
  p(
    `Use this if you can study most days after graduation. Stretch it if you are working full time. The point is a repeating loop: questions, a short note on each miss, and one case. It is not a promise about your result.`
  ),
  table(
    ["Week", "Focus", "Daily target"],
    [
      ["1", "Test plan plus a mixed diagnostic", "40–60 questions, untimed"],
      ["2", "Two weakest Client Needs categories", "60–85 questions"],
      ["3", "Pharmacology and physiological adaptation, plus one case", "60–85 questions and 1 case"],
      ["4", "Safety, psychosocial, health promotion, basic care", "Mixed 75-question sets"],
      ["5", "Timed endurance", "One ~85-item timed block, then misses only"],
      ["6", "Error log and sleep", "One timed block early, then light review"],
    ]
  ),
  p("A single study block that actually fits in a day:"),
  ul([
    `10 minutes: read yesterday’s error log. Do not open a new topic first.`,
    `40 to 70 minutes: a timed or untimed set. Stop while you can still review.`,
    `20 minutes: for each miss, write the cue, the safer action, and the category.`,
    `Optional 15 minutes: one case study, or a bow-tie and a trend item.`,
  ]),
  p(
    `On ${a("/nclex", "the NCLEX page")}, practice by Client Needs after week 1 so the sets follow the table above. The bank includes bow-tie items, trend items, and unfolding case studies — an authored set of 10 cases, six questions each — so you are not limited to single-best-answer drills.`
  ),

  h2("Priorities you can reuse on almost every item"),
  ol([
    `If the airway, breathing, or circulation is failing, that client comes before teaching, comfort, or paperwork.`,
    `New and unexpected beats chronic and expected. A sudden change after surgery outranks a stable home diagnosis.`,
    `Assess when you do not have the data and the client is not crashing. Act when the data already shows a threat.`,
    `Stay inside nursing scope. “Prescribe” and “order a CT” are usually not your move unless the stem gives you a protocol you are allowed to start.`,
    `On management items, the stable client can be delegated. The unstable client, a new admission with an unknown problem, and teaching that has not been done stay with the nurse whose scope matches the task.`,
  ]),
  p(
    `Apply those rules out loud on practice items until they are boring. Boring is the goal. Exam day is a poor time to invent a new framework.`
  ),

  h2("The week of the exam"),
  ul([
    `Reread the candidate bulletin’s identification rules. The name on your ID has to match the authorization to test. A mismatch can mean you pay to register again.`,
    `Do the ${a("https://www.nclex.com/prepare.page", "candidate tutorial", true)} if the software is unfamiliar.`,
    `Two days out, stop long timed exams. Review the error log and sleep.`,
    `During the exam, take the optional breaks. They count against the five hours, and so does staring at one item for eight minutes. Pick, note the number if you use the whiteboard, and move.`,
  ]),
  p(
    `Your nursing regulatory body releases the result. A prep company cannot. Quick-result services, where Pearson offers them, are still not the license.`
  ),
  trialClose(`Practice the cases in the same formats you just read about.`),

  h2("Sources"),
  ul([
    `${a(RN_PLAN, "NCSBN, 2026 NCLEX-RN Test Plan", true)} for length, the 52 / 18 / 15 minimum-length mix, Client Needs ranges, and the three case studies.`,
    `${a(TEST_PLANS, "NCLEX test plans", true)} for the 2026 RN and PN plans (April 1, 2026–March 31, 2029).`,
    `${a(BULLETIN, "2026 NCLEX Examination Candidate Bulletin", true)} for the five-hour limit, 85 to 150 items on both exams, fees, and partial-credit methods.`,
    `${a(PASSING, "NCLEX passing standard", true)} for 0.00 logits (RN) and −0.18 logits (PN) through March 31, 2029.`,
  ]),
  p(
    `This is a study aid, not an official item and not medical advice. Any Exam Easy is not affiliated with NCSBN. If a number here ever disagrees with the test plan, follow NCSBN.`
  ),

  faq([
    {
      q: "How many questions are on the NCLEX?",
      a: "Both the NCLEX-RN and the NCLEX-PN give you between 85 and 150 items. The length depends on your performance. Fifteen items on a minimum-length exam are unscored pretest questions. Everyone also receives three scored case studies, six items each.",
    },
    {
      q: "How long is the NCLEX?",
      a: "Five hours. That clock includes the introductory tutorial, scheduled optional breaks, and any extra breaks you take. It is the same limit for the RN and PN exams.",
    },
    {
      q: "What is a passing score on the NCLEX?",
      a: "There is no published percent-correct cut score. Through March 31, 2029, the RN passing standard is 0.00 logits and the PN passing standard is −0.18 logits. You pass if your ability is at or above that standard.",
    },
    {
      q: "Do I need a different plan for the NCLEX-PN?",
      a: "Use the same length, time, and case-study habits. Use the PN test plan for content. Category names and percentage ranges are not the same as the RN plan. Coordinated Care is the large management category on the PN exam.",
    },
    {
      q: "Should I keep studying if my practice scores are high?",
      a: "Use practice scores to see which Client Needs categories you miss. They are not an NCLEX result. A high percent on easy single-answer items can hide weak case studies. Keep at least one case, one bow-tie, and one trend in the weekly plan.",
    },
  ]),
].join("");

export const strategiesPost: BlogUpgrade = {
  slug: "strategies",
  title: "The NCLEX Study Plan for RN and PN Candidates",
  metaTitle: "The NCLEX Study Plan for RN and PN Candidates",
  metaDescription:
    "Plan the NCLEX-RN or PN around the 2026 rules: 85–150 items, five hours, three case studies, and a six-week schedule mapped to Client Needs.",
  excerpt:
    "What the 2026 NCLEX actually looks like — 85 to 150 items, five hours, three case studies — and a six-week plan for RN and PN candidates.",
  category: "NCLEX",
  tags: ["NCLEX study plan", "NCLEX-RN", "NCLEX-PN", "NGN", "CAT"],
  primaryKeyword: "NCLEX study plan",
  searchIntent: "Understand NCLEX format and build a week-by-week study plan",
  content,
  readTime: readMinutes(content),
};
