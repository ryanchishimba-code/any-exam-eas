import type { ExamSlug, HighYieldTopic } from "@/types/edtech";

type SigCodeTopicInput = Omit<HighYieldTopic, "id" | "examSlug" | "sortOrder">;

const ROUTE_ABBREVIATIONS = [
  "PO — by mouth (per os)",
  "SL — sublingual (under the tongue)",
  "Buccal — between cheek and gum",
  "PR — per rectum",
  "IV — intravenous",
  "IM — intramuscular",
  "SubQ / SC — subcutaneous",
  "ID — intradermal",
  "Topical / TOP — apply to skin",
  "Inh / INH — inhaled",
  "Ophth / OU / OD / OS — both eyes / right eye / left eye",
  "Otic / AD / AS / AU — right ear / left ear / both ears",
  "Nasal — intranasal spray or drops",
  "Vag — vaginal",
  "TD — transdermal patch",
];

const FREQUENCY_ABBREVIATIONS = [
  "QD or daily — once daily (prefer spelling out “daily” to avoid QID confusion)",
  "BID — twice daily (every 12 hours when timed)",
  "TID — three times daily (every 8 hours when timed)",
  "QID — four times daily (every 6 hours when timed)",
  "QAM — every morning",
  "QHS or HS — at bedtime",
  "Q4H / Q6H / Q8H / Q12H — every 4, 6, 8, or 12 hours",
  "QOD — every other day (high error risk — spell out)",
  "AC — before meals",
  "PC — after meals",
  "PRN — as needed",
  "STAT — immediately, one-time dose",
  "UD — as directed",
  "NTE — not to exceed (maximum daily dose)",
];

const QUANTITY_ABBREVIATIONS = [
  "#30 / Disp 30 — dispense 30 units (tablets, capsules, mL as labeled)",
  "Refill 0 / Refills: 3 — number of additional fills authorized",
  "AA — apply to affected area",
  "GTT / gtt — drops",
  "TSP / tsp — teaspoon (5 mL); TBSP / tbsp — tablespoon (15 mL)",
  "mcg or µg — microgram; mg — milligram; g — gram",
  "U or units — insulin or heparin (always spell out “units” to avoid “0” confusion)",
];

const DO_NOT_USE = [
  "U — write “units” (can be misread as 0 or 4)",
  "IU — write “international units”",
  "QD — can be misread as QID; write “daily”",
  "QOD — can be misread as QD or QID; write “every other day”",
  "Trailing zero after decimal (e.g., 1.0 mg) — write 1 mg",
  "Missing leading zero (e.g., .5 mg) — write 0.5 mg",
  "MS / MSO4 / MgSO4 — write “morphine sulfate” or “magnesium sulfate”",
  "SC / SQ / subQ — acceptable in some settings; “subcutaneous” is clearest",
  "TID × 7d — ensure duration and frequency are unambiguous when handwritten",
];

const EXAM_CONTEXT: Record<
  ExamSlug,
  Pick<SigCodeTopicInput, "overview" | "summary" | "pearls" | "pitfalls" | "mustKnowFacts" | "practiceTopicSlug">
> = {
  naplex: {
    overview:
      "Decode prescription sigs, translate Latin abbreviations, and apply ISMP/Joint Commission safety rules at the pharmacy counter.",
    summary:
      "NAPLEX routinely tests whether you can read, write, and counsel on prescription directions. A complete sig includes drug, dose, route, frequency, indication (when PRN), and duration. Pharmacists must recognize ambiguous or dangerous abbreviations and clarify with the prescriber before dispensing.\n\nRoute abbreviations tell how the drug enters the body; frequency abbreviations tell when to take it; PRN requires a reason (e.g., “PRN pain” or “PRN nausea”). Quantity and refill notation (#30, Disp, Refills) must match the prescribed days’ supply. When translating sigs for patients, use plain language: “Take 1 tablet by mouth twice daily with food for 10 days.”\n\nISMP and the Joint Commission maintain lists of error-prone abbreviations — QD, QOD, U, and trailing zeros cause fatal tenfold errors. Always use leading zeros for decimals and avoid naked decimal points. When a sig is incomplete (missing route, frequency, or PRN indication), contact the prescriber rather than guessing.",
    mustKnowFacts: [
      "Incomplete sig (missing route, frequency, or PRN indication) requires prescriber clarification before dispensing",
      "Tenfold errors often trace to decimal placement, trailing zeros, or “U” misread as “0”",
      "Patient counseling must translate sig codes into plain language the patient can repeat back",
    ],
    pearls: [
      "Example sig: “Amoxicillin 500 mg PO BID × 10 days, Disp #20, Refill 0” → 2 tabs/day × 10 days = 20 capsules.",
      "PRN orders require an indication and often a maximum frequency (e.g., “q4h PRN pain, max 4 doses/day”).",
    ],
    pitfalls: [
      "Dispensing when frequency could mean QD or QID because of illegible handwriting",
      "Counseling “take as directed” without verifying the patient understands each component of the sig",
    ],
    practiceTopicSlug: "patient-counseling",
  },
  nclex: {
    overview:
      "Interpret medication orders safely, clarify ambiguous sigs, and teach patients using plain language.",
    summary:
      "NCLEX medication-safety items assume you can read common prescription abbreviations and recognize when an order is unsafe or incomplete. The nurse verifies the six rights before administration and contacts the prescriber or pharmacist when sig components are missing or ambiguous.\n\nKnow routes (PO, IV, IM, SubQ), frequencies (BID, TID, QHS, PRN), and timing modifiers (AC, PC). PRN orders must include the reason and often a minimum interval. High-alert medications (insulin, heparin, opioids, chemo) require independent double-checks regardless of how clearly the sig is written.\n\nNever administer from an order you cannot interpret. Error-prone abbreviations (QD, QOD, U, trailing zeros) are nursing safety red flags — request clarification and document the read-back.",
    mustKnowFacts: [
      "Do not administer medications from ambiguous or incomplete orders — clarify first",
      "PRN requires an indication; document indication, dose, time, and response",
      "High-alert drugs require independent double-check per agency policy",
    ],
    pearls: [
      "Teach-back: have the patient repeat sig instructions in their own words before discharge.",
      "“Take with food” vs AC/PC — confirm whether the prescriber meant with meals or before/after meals.",
    ],
    pitfalls: [
      "Assuming QD on a handwritten order when it could be QID",
      "Administering PRN medication without documenting indication and reassessment",
    ],
    practiceTopicSlug: "pharmacology-nursing",
  },
  usmle: {
    overview:
      "Read prescription sigs in clinical vignettes and spot dangerous abbreviation errors.",
    summary:
      "USMLE items often embed medication orders in discharge instructions, inpatient orders, or patient counseling scenarios. You must translate common sig abbreviations into correct administration schedules and recognize orders that would cause harm if followed literally.\n\nRoutes (PO, IV, IM, SubQ, SL), frequencies (BID, TID, QID, QHS, q4h PRN), and duration (× 7 days) determine total dose exposure. PRN without indication or maximum frequency is incomplete. Insulin and anticoagulant orders using “U” instead of “units” are classic exam traps.\n\nWhen a vignette asks for the next best step after a medication error, consider whether the root cause was an ambiguous abbreviation, decimal error, or wrong route/frequency interpretation.",
    mustKnowFacts: [
      "“U” for units and QD for daily are classic sources of tenfold dosing errors",
      "PRN analgesic orders still require indication and reassessment intervals",
      "Extended-release formulations must not be crushed unless specifically ordered",
    ],
    pearls: [
      "Warfarin 5 mg PO QD vs 5 U insulin — “U” misread as “0” causes catastrophic under-dosing.",
      "Metoprolol tartrate (BID) vs succinate (daily) — frequency in the sig determines formulation choice.",
    ],
    pitfalls: [
      "Choosing a monitoring step when the immediate problem is an ambiguous or lethal sig",
      "Ignoring route — SL nitroglycerin is not interchangeable with PO",
    ],
    practiceTopicSlug: "pharmacology",
  },
  pance: {
    overview:
      "Write and interpret prescription directions using standard sig abbreviations safely.",
    summary:
      "PAs prescribe and adjust medications daily — sig abbreviations must be unambiguous. Include dose, route, frequency, duration, and PRN indication when applicable. Use plain-language patient instructions even when the chart sig uses standard abbreviations.\n\nKnow common routes and frequencies and avoid ISMP “do not use” abbreviations (QD, QOD, U, naked decimals). PRN orders specify reason and maximum daily dose when relevant. Controlled substances require quantity and refill limits per schedule.\n\nExam items may test whether you recognize an incomplete order, choose the correct formulation based on frequency, or counsel on administration timing (AC, PC, with food).",
    mustKnowFacts: [
      "Always spell out “units” for insulin and heparin — never “U”",
      "PRN orders need indication; scheduled orders need clear frequency",
      "Match formulation to frequency (ER/DR once daily vs immediate-release BID)",
    ],
    pearls: [
      "Discharge sig: spell out frequency in patient handout even if EHR uses BID/TID.",
      "Pediatric liquid orders: specify mL per dose, not just mg/kg, to prevent parent dosing errors.",
    ],
    pitfalls: [
      "Prescribing QD for a drug that requires BID immediate-release formulation",
      "Refilling PRN opioids without documenting indication and interval",
    ],
    practiceTopicSlug: "professional-practice",
  },
  "aanp-fnp": {
    overview:
      "Prescribe and counsel using clear sig language — abbreviations must not create ambiguity.",
    summary:
      "AANP FNP Plan-domain items include selecting appropriate pharmacotherapy and communicating directions. Standard sig abbreviations appear in orders, but patient-facing instructions should use plain language. Know routes, frequencies, PRN indications, and duration.\n\nAvoid error-prone abbreviations in your own prescribing (QD, QOD, U). When reviewing a prescriber order or patient medication list, flag ambiguous sigs before the patient leaves. Geriatric and pediatric patients need extra clarity on mL vs teaspoon and maximum PRN doses.\n\nFormulation matters: once-daily ER products vs BID immediate-release — the sig frequency must match the product selected.",
    mustKnowFacts: [
      "Patient counseling requires translating BID/TID/QHS into clock times the patient can follow",
      "PRN psychotropics and opioids need indication, interval, and max daily dose documentation",
      "Never use “U” for units — spell out “units” on all insulin orders",
    ],
    pearls: [
      "Ask patients to teach back sig instructions at every medication start or change.",
      "Polypharmacy review: same patient may have conflicting AC/PC timing across multiple drugs.",
    ],
    pitfalls: [
      "Assuming patients understand PRN without defining when to take vs when to call",
      "Choosing correct drug but wrong sig frequency for the formulation",
    ],
    practiceTopicSlug: "plan",
  },
  "npte-pt": {
    overview:
      "Read common medical abbreviations on referrals, home exercise prescriptions, and medication lists affecting rehab.",
    summary:
      "Physical therapists interpret physician orders and medication lists that affect treatment — anticoagulants before manual therapy, beta-blockers blunting HR response to exercise, PRN pain meds affecting session tolerance. While PTs do not prescribe medications, chart abbreviations appear constantly in referrals and co-treatment notes.\n\nKnow basic routes and frequencies when reading medication histories (PO BID, PRN, QHS). Recognize when a patient’s home medication sig is ambiguous and confirm with nursing or pharmacy before assuming timing. Blood thinners, insulin, and PRN opioids change safety planning for mobility and manual techniques.\n\nDocument what medications the patient reports taking and how timing affects that day’s session (e.g., took PRN opioid before PT — affects balance and pain reporting).",
    mustKnowFacts: [
      "Anticoagulant and antiplatelet sigs affect manual therapy and high-fall-risk exercise timing",
      "PRN pain medication timing influences session participation — ask what was taken and when",
      "Beta-blockers blunt exercise HR response — use RPE, not HR targets alone",
    ],
    pearls: [
      "Home exercise “BID” on a referral means twice daily — confirm patient understands timing.",
      "Insulin timing relative to meals affects energy and balance during gait training.",
    ],
    pitfalls: [
      "Proceeding with aggressive manual therapy without knowing anticoagulant status",
      "Attributing fatigue to deconditioning when PRN sedating meds were taken pre-session",
    ],
    practiceTopicSlug: "professional-responsibilities",
  },
};

/** Shared high-yield sig-code topic input — merged into each exam's topic seeds. */
export function sigCodeAbbreviationTopic(examSlug: ExamSlug): SigCodeTopicInput {
  const ctx = EXAM_CONTEXT[examSlug];
  return {
    slug: "sig-code-abbreviations",
    category: "Foundations",
    title: "Prescription Sig Codes & Abbreviations",
    overview: ctx.overview,
    summary: ctx.summary,
    keyConcepts: [
      "Routes of administration",
      ...ROUTE_ABBREVIATIONS,
      "Dosing frequency & timing",
      ...FREQUENCY_ABBREVIATIONS,
      "Quantity, duration & dispensing",
      ...QUANTITY_ABBREVIATIONS,
      "Error-prone abbreviations (ISMP / Joint Commission)",
      ...DO_NOT_USE,
    ],
    mustKnowFacts: ctx.mustKnowFacts,
    pearls: ctx.pearls,
    pitfalls: ctx.pitfalls,
    practiceTopicSlug: ctx.practiceTopicSlug,
  };
}
