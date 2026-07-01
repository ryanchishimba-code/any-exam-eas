/**
 * Community NCLEX-RN dosage calculation pack (100 items).
 * Items 1–5, 21–23, 41–44, 71–72, 86–87 are fully specified from source outline;
 * remaining slots are procedurally generated with verified math.
 * Imported via scripts/ingest-nclex-dosage-calc-pack.ts → AI elevation for best-tier QA.
 */
import type { BankItem } from "@/lib/question-bank";

export type CommunityNclexDosageItem = {
  id: number;
  subjectId: "pharmacology-nursing" | "reduction-risk";
  topicCategory: string;
  question: string;
  options: [string, string, string, string];
  correctLetter: "A" | "B" | "C" | "D";
  rationale: string;
};

const PACK_TAGS = [
  "curated",
  "community-dosage-calc-100",
  "nclex-practice-import",
  "oer-community",
] as const;

function o(a: string, b: string, c: string, d: string): [string, string, string, string] {
  return [a, b, c, d];
}

function fmt(n: number, decimals = 0): string {
  const v = decimals > 0 ? Number(n.toFixed(decimals)) : Math.round(n);
  return String(v);
}

function pickLetter(correctIdx: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[correctIdx]!;
}

function shuffleOptions(
  correct: string,
  distractors: [string, string, string],
  seed: number
): { options: [string, string, string, string]; correctLetter: "A" | "B" | "C" | "D" } {
  const all = [correct, ...distractors];
  const idx = seed % 4;
  const options = [...all] as [string, string, string, string];
  for (let i = 0; i < idx; i++) {
    const first = options.shift()!;
    options.push(first);
  }
  const correctLetter = pickLetter(options.indexOf(correct));
  return { options, correctLetter };
}

function buildUniqueDistractors(correct: string, candidates: string[]): [string, string, string] {
  const used = new Set<string>([correct.trim().toLowerCase()]);
  const picked: string[] = [];
  for (const candidate of candidates) {
    const key = candidate.trim().toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    picked.push(candidate);
    if (picked.length === 3) return [picked[0]!, picked[1]!, picked[2]!];
  }
  throw new Error(`Need 3 unique distractors for "${correct}", only found ${picked.length}`);
}

function formatTabletCount(n: number): string {
  if (Math.abs(n - 0.25) < 0.01) return "¼ tablet";
  if (Math.abs(n - 0.5) < 0.01) return "½ tablet";
  if (Math.abs(n - 0.75) < 0.01) return "¾ tablet";
  const whole = Math.round(n);
  if (Math.abs(n - whole) < 0.01) {
    return `${whole} tablet${whole !== 1 ? "s" : ""}`;
  }
  return `${fmt(n)} tablet${n > 1 ? "s" : ""}`;
}

function tabletDistractors(answer: number): [string, string, string] {
  const correct = formatTabletCount(answer);
  const counts = [
    answer + 1,
    answer + 2,
    answer - 1,
    answer - 2,
    answer * 2,
    answer + 0.5,
    answer - 0.5,
    1,
    2,
    3,
    4,
    0.25,
    0.5,
  ].filter((n) => n > 0 && Math.abs(n - answer) > 0.01);
  return buildUniqueDistractors(correct, counts.map(formatTabletCount));
}

function volumeDistractors(vol: number, decimals = 1): [string, string, string] {
  const label = (n: number) => `${fmt(n, decimals)} mL`;
  const correct = label(vol);
  const offsets = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
  const candidates = [
    vol / 2,
    vol * 2,
    vol / 4,
    vol * 1.5,
    vol * 3,
    ...offsets.map((o) => vol + o),
    ...offsets.map((o) => vol - o),
    ...offsets.map((o) => vol * 2 + o),
  ]
    .filter((n) => n > 0 && Math.abs(n - vol) > 0.01)
    .map(label);
  return buildUniqueDistractors(correct, candidates);
}

function rateDistractors(rate: number, step = 25): [string, string, string] {
  const label = (n: number) => `${fmt(n)} mL/hr`;
  const correct = label(rate);
  const candidates = [
    rate / 2,
    rate * 2,
    rate / 4,
    rate * 1.5,
    rate * 3,
    rate + step,
    rate - step,
    rate + step * 2,
    rate - step * 2,
    rate + 5,
    rate - 5,
    rate + 10,
    rate - 10,
    rate + 50,
    rate - 50,
  ]
    .filter((n) => n > 0 && Math.abs(n - rate) > 0.01)
    .map(label);
  return buildUniqueDistractors(correct, candidates);
}

function mgDistractors(dose: number): [string, string, string] {
  const label = (n: number) => `${fmt(n)} mg`;
  const correct = label(dose);
  const candidates = [
    dose / 2,
    dose * 2,
    dose / 4,
    dose * 1.5,
    dose + 25,
    dose - 25,
    dose + 50,
    dose - 50,
    dose + 10,
    dose - 10,
    dose + 100,
    dose - 100,
  ]
    .filter((n) => n > 0 && Math.abs(n - dose) > 0.01)
    .map(label);
  return buildUniqueDistractors(correct, candidates);
}

function gttDistractors(gtt: number): [string, string, string] {
  const label = (n: number) => `${fmt(n, 1)} gtt/min`;
  const correct = label(gtt);
  const candidates = [
    gtt * 2,
    gtt / 2,
    gtt + 5,
    gtt - 5,
    gtt + 10,
    gtt - 10,
    gtt + 15,
    gtt - 15,
    gtt * 1.5,
    gtt / 1.5,
  ]
    .filter((n) => n > 0 && Math.abs(n - gtt) > 0.01)
    .map(label);
  return buildUniqueDistractors(correct, candidates);
}

function signedMlDistractors(net: number): [string, string, string] {
  const sign = net >= 0 ? "+" : "";
  const label = (n: number) => `${n >= 0 ? "+" : ""}${fmt(n)} mL`;
  const correct = label(net);
  const offsets = [50, 100, 150, 200, 250, 300];
  const candidates = offsets.flatMap((o) => [net + o, net - o, net + o / 2, net - o / 2]).map(label);
  return buildUniqueDistractors(correct, candidates);
}

function assertUniqueOptions(item: CommunityNclexDosageItem): void {
  const keys = item.options.map((o) => o.trim().toLowerCase());
  if (new Set(keys).size < 4) {
    throw new Error(`Item ${item.id} has duplicate options: ${item.options.join(" | ")}`);
  }
}

// ── Fully specified items ────────────────────────────────────────────────────

const SPECIFIED: CommunityNclexDosageItem[] = [
  // Oral 1–5
  {
    id: 1,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "The provider orders acetaminophen 750 mg PO. The pharmacy supplies 250 mg tablets. How many tablets should the nurse administer?",
    options: o("1 tablet", "2 tablets", "3 tablets", "4 tablets"),
    correctLetter: "C",
    rationale:
      "750 mg ÷ 250 mg/tablet = 3 tablets. Verify the order, check the label, and use the rights of medication administration before giving the dose.",
  },
  {
    id: 2,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "A client is prescribed cephalexin 0.5 g PO. Available tablets are 250 mg each. How many tablets should the nurse give?",
    options: o("1 tablet", "2 tablets", "3 tablets", "4 tablets"),
    correctLetter: "B",
    rationale:
      "Convert grams to milligrams: 0.5 g = 500 mg. 500 mg ÷ 250 mg/tablet = 2 tablets.",
  },
  {
    id: 3,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "The provider orders amoxicillin 375 mg PO. The suspension is labeled 250 mg/5 mL. How many milliliters should the nurse administer?",
    options: o("5 mL", "7.5 mL", "10 mL", "15 mL"),
    correctLetter: "B",
    rationale:
      "Set up proportion: 250 mg/5 mL = 375 mg/x mL → x = (375 × 5) ÷ 250 = 7.5 mL. Shake the suspension and measure with an oral syringe.",
  },
  {
    id: 4,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Digoxin 0.125 mg PO is ordered. Available tablets are 0.25 mg. How many tablets should the nurse administer?",
    options: o("¼ tablet", "½ tablet", "1 tablet", "2 tablets"),
    correctLetter: "B",
    rationale:
      "0.125 mg ÷ 0.25 mg/tablet = 0.5 tablet (½ tablet). Use a pill splitter when appropriate and document partial doses per facility policy.",
  },
  {
    id: 5,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Cephalexin 500 mg PO is ordered. The liquid is labeled 250 mg/5 mL. How many milliliters should the nurse give?",
    options: o("5 mL", "10 mL", "15 mL", "20 mL"),
    correctLetter: "B",
    rationale:
      "250 mg/5 mL = 500 mg/x mL → x = (500 × 5) ÷ 250 = 10 mL.",
  },
  // Parenteral 21–23
  {
    id: 21,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Heparin 8,000 units subcutaneous is ordered. The vial concentration is 10,000 units/mL. How many milliliters should the nurse draw up?",
    options: o("0.4 mL", "0.8 mL", "1.0 mL", "1.6 mL"),
    correctLetter: "B",
    rationale:
      "8,000 units ÷ 10,000 units/mL = 0.8 mL. Use an insulin syringe or tuberculin syringe as appropriate and rotate injection sites.",
  },
  {
    id: 22,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Morphine sulfate 4 mg IV push is ordered. Available concentration is 10 mg/mL. How many milliliters should the nurse administer?",
    options: o("0.2 mL", "0.4 mL", "0.6 mL", "1.0 mL"),
    correctLetter: "B",
    rationale:
      "4 mg ÷ 10 mg/mL = 0.4 mL. Administer slowly per protocol and monitor respiratory rate and sedation level.",
  },
  {
    id: 23,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Gentamicin 60 mg IM is ordered. The vial is labeled 80 mg/2 mL. How many milliliters should the nurse administer?",
    options: o("1.0 mL", "1.5 mL", "2.0 mL", "2.5 mL"),
    correctLetter: "B",
    rationale:
      "Concentration = 80 mg/2 mL = 40 mg/mL. 60 mg ÷ 40 mg/mL = 1.5 mL. Use a large muscle site and document the injection site.",
  },
  // IV 41–44
  {
    id: 41,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Normal saline 1,000 mL is to infuse over 8 hours. At what rate (mL/hr) should the nurse set the IV pump?",
    options: o("62.5 mL/hr", "125 mL/hr", "150 mL/hr", "250 mL/hr"),
    correctLetter: "B",
    rationale:
      "Rate = volume ÷ time = 1,000 mL ÷ 8 hr = 125 mL/hr. Program the pump and reassess the IV site per policy.",
  },
  {
    id: 42,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "A heparin infusion contains 20,000 units in 500 mL D5W. The provider orders 1,000 units/hr. What infusion rate (mL/hr) should the nurse program?",
    options: o("12.5 mL/hr", "25 mL/hr", "50 mL/hr", "100 mL/hr"),
    correctLetter: "B",
    rationale:
      "Concentration = 20,000 units/500 mL = 40 units/mL. Rate = 1,000 units/hr ÷ 40 units/mL = 25 mL/hr. Monitor aPTT per protocol.",
  },
  {
    id: 43,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "An IV is running at 100 mL/hr using microdrip tubing (60 gtt/mL). How many drops per minute should the nurse count?",
    options: o("50 gtt/min", "60 gtt/min", "100 gtt/min", "120 gtt/min"),
    correctLetter: "C",
    rationale:
      "gtt/min = (mL/hr × drop factor) ÷ 60 = (100 × 60) ÷ 60 = 100 gtt/min. With microdrip tubing, gtt/min equals mL/hr when the drop factor is 60.",
  },
  {
    id: 44,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Dopamine 400 mg is in 250 mL D5W. The provider orders 5 mcg/kg/min for a client weighing 80 kg. What infusion rate (mL/hr) should the nurse set? (Round to the nearest whole number.)",
    options: o("7 mL/hr", "15 mL/hr", "24 mL/hr", "30 mL/hr"),
    correctLetter: "B",
    rationale:
      "Concentration = 400 mg/250 mL = 1,600 mcg/mL. Desired dose = 5 mcg/kg/min × 80 kg = 400 mcg/min. mL/hr = (400 mcg/min × 60 min/hr) ÷ 1,600 mcg/mL = 15 mL/hr.",
  },
  // Pediatric 71–72
  {
    id: 71,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "A child weighs 55 lb. The provider orders 8 mg/kg/day PO divided every 6 hours. What is the dose per administration? (Round to the nearest whole number.)",
    options: o("25 mg", "50 mg", "75 mg", "100 mg"),
    correctLetter: "B",
    rationale:
      "Convert weight: 55 lb ÷ 2.2 ≈ 25 kg. Daily dose = 8 mg/kg × 25 kg = 200 mg/day. q6h = 4 doses → 200 ÷ 4 = 50 mg per dose.",
  },
  {
    id: 72,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "Cefazolin 25 mg/kg/day IV divided every 8 hours is ordered for a child weighing 12 kg. What dose (mg) should the nurse administer per dose?",
    options: o("50 mg", "100 mg", "150 mg", "300 mg"),
    correctLetter: "B",
    rationale:
      "Daily dose = 25 mg/kg × 12 kg = 300 mg/day. q8h = 3 doses → 300 ÷ 3 = 100 mg per dose.",
  },
  // Mixed 86–87
  {
    id: 86,
    subjectId: "reduction-risk",
    topicCategory: "Reduction of Risk Potential",
    question:
      "A client's intake for the shift: IV fluids 750 mL, oral fluids 400 mL, ice chips 100 mL (counted as 50% = 50 mL). Output: urine 600 mL, emesis 200 mL, wound drainage 100 mL. What is the net fluid balance for the shift?",
    options: o("+200 mL", "+300 mL", "+400 mL", "+500 mL"),
    correctLetter: "B",
    rationale:
      "Total intake = 750 + 400 + 50 = 1,200 mL. Total output = 600 + 200 + 100 = 900 mL. Net balance = 1,200 − 900 = +300 mL (positive fluid balance).",
  },
  {
    id: 87,
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "The provider orders 100 mL of IV antibiotic to infuse over 30 minutes. What rate (mL/hr) should the nurse program on the pump?",
    options: o("50 mL/hr", "100 mL/hr", "200 mL/hr", "300 mL/hr"),
    correctLetter: "C",
    rationale:
      "30 minutes = 0.5 hour. Rate = 100 mL ÷ 0.5 hr = 200 mL/hr.",
  },
];

// ── Procedural generators ────────────────────────────────────────────────────

function generateOralItems(startId: number, count: number): CommunityNclexDosageItem[] {
  const templates: Array<{
    drug: string;
    orderMg: number;
    tabMg: number;
    unit: "tablet" | "mL";
    concMg?: number;
    concMl?: number;
  }> = [
    { drug: "Metformin", orderMg: 1000, tabMg: 500, unit: "tablet" },
    { drug: "Furosemide", orderMg: 40, tabMg: 20, unit: "tablet" },
    { drug: "Levothyroxine", orderMg: 75, tabMg: 25, unit: "tablet" },
    { drug: "Warfarin", orderMg: 5, tabMg: 2.5, unit: "tablet" },
    { drug: "Prednisone", orderMg: 30, tabMg: 10, unit: "tablet" },
    { drug: "Azithromycin", orderMg: 500, tabMg: 250, unit: "tablet" },
    { drug: "Lisinopril", orderMg: 20, tabMg: 10, unit: "tablet" },
    { drug: "Carvedilol", orderMg: 12.5, tabMg: 6.25, unit: "tablet" },
    { drug: "Omeprazole", orderMg: 40, tabMg: 20, unit: "tablet" },
    { drug: "Spironolactone", orderMg: 50, tabMg: 25, unit: "tablet" },
    { drug: "Amoxicillin", orderMg: 400, tabMg: 0, unit: "mL", concMg: 250, concMl: 5 },
    { drug: "Ibuprofen", orderMg: 600, tabMg: 200, unit: "tablet" },
    { drug: "Hydrochlorothiazide", orderMg: 25, tabMg: 12.5, unit: "tablet" },
    { drug: "Atorvastatin", orderMg: 40, tabMg: 20, unit: "tablet" },
    { drug: "Ciprofloxacin", orderMg: 750, tabMg: 250, unit: "tablet" },
  ];

  return templates.slice(0, count).map((t, i) => {
    const id = startId + i;
    if (t.unit === "tablet") {
      const answer = t.orderMg / t.tabMg;
      const label = formatTabletCount(answer);
      const distractors = tabletDistractors(answer);
      const { options, correctLetter } = shuffleOptions(label, distractors, id);
      return {
        id,
        subjectId: "pharmacology-nursing" as const,
        topicCategory: "Pharmacological Therapies",
        question: `The provider orders ${t.drug} ${t.orderMg} mg PO. Available tablets are ${t.tabMg} mg each. How many tablets should the nurse administer?`,
        options,
        correctLetter,
        rationale: `${t.orderMg} mg ÷ ${t.tabMg} mg/tablet = ${answer} tablet${answer !== 1 ? "s" : ""}. Verify the order and use the rights of medication administration.`,
      };
    }
    const vol = (t.orderMg / t.concMg!) * t.concMl!;
    const label = `${fmt(vol, 1)} mL`;
    const distractors = volumeDistractors(vol);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    return {
      id,
      subjectId: "pharmacology-nursing" as const,
      topicCategory: "Pharmacological Therapies",
      question: `${t.drug} ${t.orderMg} mg PO is ordered. The suspension is labeled ${t.concMg} mg/${t.concMl} mL. How many milliliters should the nurse administer?`,
      options,
      correctLetter,
      rationale: `${t.concMg} mg/${t.concMl} mL = ${t.orderMg} mg/x → x = (${t.orderMg} × ${t.concMl}) ÷ ${t.concMg} = ${fmt(vol, 1)} mL.`,
    };
  });
}

function generateParenteralItems(startId: number, count: number): CommunityNclexDosageItem[] {
  const templates: Array<{ drug: string; order: number; orderUnit: string; conc: number; concVol: number; route: string }> = [
    { drug: "Enoxaparin", order: 40, orderUnit: "mg", conc: 100, concVol: 1, route: "subcutaneous" },
    { drug: "Insulin regular", order: 8, orderUnit: "units", conc: 100, concVol: 1, route: "subcutaneous" },
    { drug: "Ceftriaxone", order: 1, orderUnit: "g", conc: 500, concVol: 2, route: "IM" },
    { drug: "Hydromorphone", order: 1.5, orderUnit: "mg", conc: 2, concVol: 1, route: "IV push" },
    { drug: "Ondansetron", order: 4, orderUnit: "mg", conc: 4, concVol: 2, route: "IV push" },
    { drug: "Fentanyl", order: 50, orderUnit: "mcg", conc: 50, concVol: 1, route: "IV push" },
    { drug: "Vitamin B12", order: 1000, orderUnit: "mcg", conc: 1000, concVol: 1, route: "IM" },
    { drug: "Heparin", order: 5000, orderUnit: "units", conc: 5000, concVol: 1, route: "subcutaneous" },
    { drug: "Diphenhydramine", order: 25, orderUnit: "mg", conc: 50, concVol: 1, route: "IM" },
    { drug: "Epinephrine", order: 0.3, orderUnit: "mg", conc: 1, concVol: 1, route: "IM" },
    { drug: "Promethazine", order: 12.5, orderUnit: "mg", conc: 25, concVol: 1, route: "IM" },
    { drug: "Ketorolac", order: 15, orderUnit: "mg", conc: 30, concVol: 1, route: "IM" },
    { drug: "Methylprednisolone", order: 40, orderUnit: "mg", conc: 40, concVol: 1, route: "IM" },
    { drug: "Naloxone", order: 0.4, orderUnit: "mg", conc: 0.4, concVol: 1, route: "IV push" },
    { drug: "Atropine", order: 0.5, orderUnit: "mg", conc: 1, concVol: 1, route: "IV push" },
    { drug: "Lorazepam", order: 1, orderUnit: "mg", conc: 2, concVol: 1, route: "IV push" },
    { drug: "Metoclopramide", order: 5, orderUnit: "mg", conc: 5, concVol: 2, route: "IV push" },
  ];

  return templates.slice(0, count).map((t, i) => {
    const id = startId + i;
    const orderAmount = t.orderUnit === "g" ? t.order * 1000 : t.order;
    const orderLabel = t.orderUnit === "g" ? `${t.order} g (${orderAmount} mg)` : `${t.order} ${t.orderUnit}`;
    const concPerMl = t.conc / t.concVol;
    const vol = orderAmount / concPerMl;
    const label = `${fmt(vol, 1)} mL`;
    const distractors = volumeDistractors(vol);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    const orderDisplay = t.orderUnit === "g" ? `${t.order} g` : `${t.order} ${t.orderUnit}`;
    return {
      id,
      subjectId: "pharmacology-nursing" as const,
      topicCategory: "Pharmacological Therapies",
      question: `${t.drug} ${orderDisplay} ${t.route} is ordered. The vial is labeled ${t.conc} ${t.orderUnit === "units" ? "units" : t.orderUnit === "mcg" ? "mcg" : "mg"}/${t.concVol} mL. How many milliliters should the nurse draw up?`,
      options,
      correctLetter,
      rationale: `${orderLabel}. Concentration = ${t.conc}/${t.concVol} mL = ${concPerMl} per mL. Volume = ${orderAmount} ÷ ${concPerMl} = ${fmt(vol, 1)} mL.`,
    };
  });
}

function generateIvItems(startId: number, count: number): CommunityNclexDosageItem[] {
  const items: CommunityNclexDosageItem[] = [];
  let idx = 0;

  // Simple mL/hr (volume/time)
  const volTime = [
    { vol: 500, hrs: 4 },
    { vol: 1000, hrs: 10 },
    { vol: 250, hrs: 2 },
    { vol: 750, hrs: 6 },
    { vol: 1500, hrs: 12 },
    { vol: 200, hrs: 1 },
  ];
  for (const vt of volTime) {
    if (idx >= count) break;
    const id = startId + idx;
    const rate = vt.vol / vt.hrs;
    const label = `${fmt(rate)} mL/hr`;
    const distractors = rateDistractors(rate);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `The provider orders ${vt.vol} mL of IV fluid to infuse over ${vt.hrs} hours. What rate (mL/hr) should the nurse set?`,
      options,
      correctLetter,
      rationale: `${vt.vol} mL ÷ ${vt.hrs} hr = ${fmt(rate)} mL/hr.`,
    });
    idx++;
  }

  // Macrodrop gtt/min
  const macroRates = [
    { mlHr: 125, factor: 15 },
    { mlHr: 100, factor: 10 },
    { mlHr: 75, factor: 15 },
    { mlHr: 150, factor: 20 },
  ];
  for (const mr of macroRates) {
    if (idx >= count) break;
    const id = startId + idx;
    const gtt = (mr.mlHr * mr.factor) / 60;
    const label = `${fmt(gtt, 1)} gtt/min`;
    const distractors = gttDistractors(gtt);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `An IV is infusing at ${mr.mlHr} mL/hr using ${mr.factor} gtt/mL tubing. How many drops per minute should the nurse count? (Round to one decimal.)`,
      options,
      correctLetter,
      rationale: `gtt/min = (${mr.mlHr} mL/hr × ${mr.factor} gtt/mL) ÷ 60 = ${fmt(gtt, 1)} gtt/min.`,
    });
    idx++;
  }

  // Weight-based drips (mcg/kg/min)
  const drips = [
    { drug: "Dopamine", mg: 400, ml: 250, dose: 3, kg: 70 },
    { drug: "Dobutamine", mg: 250, ml: 250, dose: 5, kg: 60 },
    { drug: "Norepinephrine", mg: 4, ml: 250, dose: 0.1, kg: 75 },
    { drug: "Dopamine", mg: 800, ml: 250, dose: 7, kg: 90 },
    { drug: "Dobutamine", mg: 500, ml: 500, dose: 10, kg: 55 },
  ];
  for (const d of drips) {
    if (idx >= count) break;
    const id = startId + idx;
    const mcgMl = (d.mg * 1000) / d.ml;
    const mcgMin = d.dose * d.kg;
    const rate = (mcgMin * 60) / mcgMl;
    const label = `${fmt(rate)} mL/hr`;
    const distractors = rateDistractors(rate, 5);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `${d.drug} ${d.mg} mg in ${d.ml} mL D5W. Order: ${d.dose} mcg/kg/min for a client weighing ${d.kg} kg. What rate (mL/hr)? (Round to nearest whole number.)`,
      options,
      correctLetter,
      rationale: `Concentration = ${d.mg * 1000} mcg/${d.ml} mL = ${mcgMl} mcg/mL. Dose = ${d.dose} × ${d.kg} = ${mcgMin} mcg/min. Rate = (${mcgMin} × 60) ÷ ${mcgMl} = ${fmt(rate)} mL/hr.`,
    });
    idx++;
  }

  // Unit-based drips (units/hr)
  const unitDrips = [
    { units: 25000, ml: 500, orderHr: 800 },
    { units: 10000, ml: 250, orderHr: 600 },
    { units: 50000, ml: 1000, orderHr: 1200 },
  ];
  for (const u of unitDrips) {
    if (idx >= count) break;
    const id = startId + idx;
    const unitsPerMl = u.units / u.ml;
    const rate = u.orderHr / unitsPerMl;
    const label = `${fmt(rate)} mL/hr`;
    const distractors = rateDistractors(rate, 10);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `Heparin ${u.units.toLocaleString()} units in ${u.ml} mL. Order: ${u.orderHr} units/hr. What infusion rate (mL/hr)?`,
      options,
      correctLetter,
      rationale: `${u.units} units/${u.ml} mL = ${unitsPerMl} units/mL. ${u.orderHr} units/hr ÷ ${unitsPerMl} = ${fmt(rate)} mL/hr.`,
    });
    idx++;
  }

  // Fill remaining with more vol/time variants
  const extra = [
    { vol: 50, hrs: 0.5 },
    { vol: 100, hrs: 1 },
    { vol: 300, hrs: 3 },
    { vol: 600, hrs: 4 },
    { vol: 80, hrs: 0.25 },
    { vol: 450, hrs: 5 },
    { vol: 1200, hrs: 24 },
    { vol: 100, hrs: 4 },
  ];
  for (const vt of extra) {
    if (idx >= count) break;
    const id = startId + idx;
    const rate = vt.vol / vt.hrs;
    const label = `${fmt(rate)} mL/hr`;
    const distractors = rateDistractors(rate, 50);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    const timeLabel = vt.hrs < 1 ? `${vt.hrs * 60} minutes` : `${vt.hrs} hour${vt.hrs > 1 ? "s" : ""}`;
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `The provider orders ${vt.vol} mL IV to infuse over ${timeLabel}. What rate (mL/hr) should the nurse set?`,
      options,
      correctLetter,
      rationale: `${vt.vol} mL ÷ ${vt.hrs} hr = ${fmt(rate)} mL/hr.`,
    });
    idx++;
  }

  return items.slice(0, count);
}

function generatePediatricItems(startId: number, count: number): CommunityNclexDosageItem[] {
  const templates: Array<{ drug: string; mgKgDay: number; freq: number; freqLabel: string; kg: number }> = [
    { drug: "Amoxicillin", mgKgDay: 40, freq: 3, freqLabel: "every 8 hours", kg: 15 },
    { drug: "Acetaminophen", mgKgDay: 60, freq: 4, freqLabel: "every 6 hours", kg: 10 },
    { drug: "Ibuprofen", mgKgDay: 30, freq: 3, freqLabel: "every 8 hours", kg: 20 },
    { drug: "Azithromycin", mgKgDay: 10, freq: 1, freqLabel: "once daily", kg: 18 },
    { drug: "Cefdinir", mgKgDay: 14, freq: 2, freqLabel: "every 12 hours", kg: 14 },
    { drug: "Ampicillin", mgKgDay: 100, freq: 4, freqLabel: "every 6 hours", kg: 8 },
    { drug: "Clindamycin", mgKgDay: 30, freq: 3, freqLabel: "every 8 hours", kg: 16 },
    { drug: "Prednisolone", mgKgDay: 2, freq: 1, freqLabel: "once daily", kg: 22 },
    { drug: "Furosemide", mgKgDay: 2, freq: 2, freqLabel: "every 12 hours", kg: 11 },
    { drug: "Vancomycin", mgKgDay: 40, freq: 2, freqLabel: "every 12 hours", kg: 13 },
    { drug: "Gentamicin", mgKgDay: 6, freq: 1, freqLabel: "once daily", kg: 9 },
    { drug: "Phenobarbital", mgKgDay: 4, freq: 1, freqLabel: "once daily", kg: 17 },
    { drug: "Metronidazole", mgKgDay: 30, freq: 3, freqLabel: "every 8 hours", kg: 19 },
  ];

  return templates.slice(0, count).map((t, i) => {
    const id = startId + i;
    const daily = t.mgKgDay * t.kg;
    const perDose = daily / t.freq;
    const label = `${fmt(perDose)} mg`;
    const distractors = mgDistractors(perDose);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    return {
      id,
      subjectId: "pharmacology-nursing" as const,
      topicCategory: "Pharmacological Therapies",
      question: `${t.drug} ${t.mgKgDay} mg/kg/day PO divided ${t.freqLabel} is ordered for a child weighing ${t.kg} kg. What dose (mg) per administration? (Round to nearest whole number.)`,
      options,
      correctLetter,
      rationale: `Daily dose = ${t.mgKgDay} mg/kg × ${t.kg} kg = ${daily} mg/day. ${t.freqLabel} = ${t.freq} dose(s)/day → ${daily} ÷ ${t.freq} = ${fmt(perDose)} mg per dose.`,
    };
  });
}

function generateMixedItems(startId: number, count: number): CommunityNclexDosageItem[] {
  const items: CommunityNclexDosageItem[] = [];
  let idx = 0;

  // Intake/output balance
  const ioCases = [
    { iv: 500, oral: 300, ice: 80, urine: 400, emesis: 100, drain: 50, icePct: 0.5 },
    { iv: 1000, oral: 200, ice: 0, urine: 800, emesis: 0, drain: 150, icePct: 0.5 },
    { iv: 600, oral: 500, ice: 200, urine: 700, emesis: 150, drain: 75, icePct: 0.5 },
  ];
  for (const c of ioCases) {
    if (idx >= count) break;
    const id = startId + idx;
    const intake = c.iv + c.oral + c.ice * c.icePct;
    const output = c.urine + c.emesis + c.drain;
    const net = intake - output;
    const sign = net >= 0 ? "+" : "";
    const label = `${sign}${fmt(net)} mL`;
    const distractors = signedMlDistractors(net);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "reduction-risk",
      topicCategory: "Reduction of Risk Potential",
      question: `Intake: IV ${c.iv} mL, oral ${c.oral} mL, ice chips ${c.ice} mL (50%). Output: urine ${c.urine} mL, emesis ${c.emesis} mL, drainage ${c.drain} mL. What is the net fluid balance?`,
      options,
      correctLetter,
      rationale: `Intake = ${c.iv} + ${c.oral} + ${c.ice * c.icePct} = ${intake} mL. Output = ${c.urine} + ${c.emesis} + ${c.drain} = ${output} mL. Net = ${intake} − ${output} = ${sign}${fmt(net)} mL.`,
    });
    idx++;
  }

  // Short infusion rate conversions
  const shortInf = [
    { vol: 50, min: 15 },
    { vol: 150, min: 45 },
    { vol: 200, min: 60 },
    { vol: 75, min: 20 },
  ];
  for (const s of shortInf) {
    if (idx >= count) break;
    const id = startId + idx;
    const rate = (s.vol / s.min) * 60;
    const label = `${fmt(rate)} mL/hr`;
    const distractors = rateDistractors(rate, Math.max(25, Math.round(rate / 4)));
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `${s.vol} mL IV antibiotic is ordered over ${s.min} minutes. What pump rate (mL/hr)?`,
      options,
      correctLetter,
      rationale: `${s.min} min = ${s.min / 60} hr. Rate = ${s.vol} mL ÷ ${s.min / 60} hr = ${fmt(rate)} mL/hr.`,
    });
    idx++;
  }

  // Safe dose / max daily
  const safeDose = [
    { drug: "Acetaminophen", mgKg: 15, kg: 20, maxDay: 75, freq: 4 },
    { drug: "Ibuprofen", mgKg: 10, kg: 25, maxDay: 40, freq: 3 },
  ];
  for (const sd of safeDose) {
    if (idx >= count) break;
    const id = startId + idx;
    const perDose = sd.mgKg * sd.kg;
    const daily = perDose * sd.freq;
    const safe = daily <= sd.maxDay * sd.kg;
    const label = safe ? `${fmt(perDose)} mg per dose — within safe limits` : `${fmt(perDose)} mg per dose — exceeds maximum`;
    const alt1 = safe ? `${fmt(perDose * 2)} mg per dose — within safe limits` : `${fmt(perDose / 2)} mg per dose — exceeds maximum`;
    const alt2 = `${fmt(perDose)} mg per dose — ${safe ? "exceeds maximum" : "within safe limits"}`;
    const alt3 = `${fmt(perDose + 50)} mg per dose — within safe limits`;
    const { options, correctLetter } = shuffleOptions(label, [alt1, alt2, alt3], id);
    items.push({
      id,
      subjectId: "reduction-risk",
      topicCategory: "Reduction of Risk Potential",
      question: `${sd.drug} ${sd.mgKg} mg/kg/dose ${sd.freq} times daily is ordered for a ${sd.kg}-kg child (max ${sd.maxDay} mg/kg/day). Which statement is correct?`,
      options,
      correctLetter,
      rationale: `Per dose = ${sd.mgKg} × ${sd.kg} = ${fmt(perDose)} mg. Daily total = ${fmt(perDose)} × ${sd.freq} = ${daily} mg. Max allowed = ${sd.maxDay} × ${sd.kg} = ${sd.maxDay * sd.kg} mg/day. Order is ${safe ? "within" : "above"} safe limits.`,
    });
    idx++;
  }

  // Reconstitution
  const reconst = [
    { drug: "Penicillin G", totalMg: 5000000, diluent: 8.2, orderMg: 2500000 },
    { drug: "Cefazolin", totalMg: 1000, diluent: 2.5, orderMg: 500 },
  ];
  for (const r of reconst) {
    if (idx >= count) break;
    const id = startId + idx;
    const conc = r.totalMg / r.diluent;
    const vol = r.orderMg / conc;
    const label = `${fmt(vol, 1)} mL`;
    const distractors = buildUniqueDistractors(label, [
      `${fmt(vol * 2, 1)} mL`,
      `${fmt(vol / 2, 1)} mL`,
      `${fmt(r.diluent, 1)} mL`,
      `${fmt(vol + 1, 1)} mL`,
      `${fmt(vol - 1, 1)} mL`,
      `${fmt(vol + 2, 1)} mL`,
    ]);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `${r.drug} ${(r.totalMg / 1e6 >= 1 ? r.totalMg / 1e6 + " million units" : r.totalMg + " mg")} reconstituted with ${r.diluent} mL yields standard concentration. How many mL contain ${r.orderMg >= 1e6 ? r.orderMg / 1e6 + " million units" : r.orderMg + " mg"}?`,
      options,
      correctLetter,
      rationale: `Concentration after reconstitution = ${r.totalMg} ÷ ${r.diluent} mL. Volume needed = ${r.orderMg} ÷ concentration = ${fmt(vol, 1)} mL.`,
    });
    idx++;
  }

  // Fill remaining with lb→kg + dose
  const lbCases = [
    { lb: 44, mgKg: 10, freq: 4 },
    { lb: 66, mgKg: 5, freq: 2 },
    { lb: 33, mgKg: 12, freq: 3 },
    { lb: 88, mgKg: 6, freq: 4 },
  ];
  for (const lc of lbCases) {
    if (idx >= count) break;
    const id = startId + idx;
    const kg = Math.round(lc.lb / 2.2);
    const daily = lc.mgKg * kg;
    const perDose = daily / lc.freq;
    const label = `${fmt(perDose)} mg`;
    const distractors = mgDistractors(perDose);
    const { options, correctLetter } = shuffleOptions(label, distractors, id);
    items.push({
      id,
      subjectId: "pharmacology-nursing",
      topicCategory: "Pharmacological Therapies",
      question: `A child weighs ${lc.lb} lb. Order: ${lc.mgKg} mg/kg/day divided q${24 / lc.freq}h. What is each dose (mg)? (Round to nearest whole number.)`,
      options,
      correctLetter,
      rationale: `${lc.lb} lb ÷ 2.2 ≈ ${kg} kg. Daily = ${lc.mgKg} × ${kg} = ${daily} mg. ÷ ${lc.freq} doses = ${fmt(perDose)} mg per dose.`,
    });
    idx++;
  }

  return items.slice(0, count);
}

function buildAllItems(): CommunityNclexDosageItem[] {
  const byId = new Map<number, CommunityNclexDosageItem>();

  for (const item of SPECIFIED) byId.set(item.id, item);
  for (const item of generateOralItems(6, 15)) byId.set(item.id, item);
  for (const item of generateParenteralItems(24, 17)) byId.set(item.id, item);
  for (const item of generateIvItems(45, 26)) byId.set(item.id, item);
  for (const item of generatePediatricItems(73, 13)) byId.set(item.id, item);
  for (const item of generateMixedItems(88, 13)) byId.set(item.id, item);

  const ordered: CommunityNclexDosageItem[] = [];
  for (let id = 1; id <= 100; id++) {
    const item = byId.get(id);
    if (!item) throw new Error(`Missing dosage calc item id ${id}`);
    assertUniqueOptions(item);
    ordered.push(item);
  }
  return ordered;
}

export const COMMUNITY_NCLEX_DOSAGE_CALC_100: CommunityNclexDosageItem[] = buildAllItems();

export function communityDosageItemToBankItem(row: CommunityNclexDosageItem): BankItem {
  const idx = row.correctLetter.charCodeAt(0) - 65;
  const correctAnswer = row.options[idx]!;
  return {
    subjectId: row.subjectId,
    question: row.question,
    options: [...row.options],
    correctAnswer,
    explanation: row.rationale,
    topicCategory: row.topicCategory,
    tags: [...PACK_TAGS],
    source: "ai-curated",
    itemType: "vignette",
    difficulty: 3,
    references: [{ label: "NCSBN NCLEX-RN Test Plan", citation: "Dosage Calculation & Pharmacological Therapies" }],
  };
}
