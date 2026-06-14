/**
 * High-yield static MPJE seeds — federal law, uniform patterns, and Oklahoma state focus.
 * Synced to QuestionBankItem via HEALTH_QUESTION_BANK and ensureStaticSeedsForField().
 */
import type { BankItem } from "@/lib/question-bank";
import { MPJE_QUALITY_SEEDS } from "./quality-seeds";
import { MPJE_ALL_STATE_SUBSTANTIVE_SEEDS } from "./state-substantive-seeds";
import { mergeStateSeedsIntoBank } from "./state-seed-bank";

const MPJE_DIFFICULTY: Record<string, number> = {
  "pharmacy-ethics": 2,
  "patient-privacy": 2,
  "uniform-mpje": 3,
  "dispensing-procedures": 3,
  "pharmacy-operations": 3,
  "federal-pharmacy-law": 4,
  "controlled-substances": 4,
  "compounding-regulations": 4,
  "state-practice-act": 4,
};

function mpje(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  tags: string[] = [],
  stateCode: string | null = null
): BankItem {
  return {
    subjectId,
    stateCode,
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty: MPJE_DIFFICULTY[subjectId] ?? 3,
    topicCategory: subjectId,
    blueprintDomain: stateCode ? "mpje-jurisprudence" : "umpje-uniform",
    itemType: "mcq",
    tags: ["mpje", "high-yield", ...(stateCode ? [`state-${stateCode}`] : ["federal"]), ...tags],
    references: stateCode
      ? [{ label: `${stateCode} Board of Pharmacy / Oklahoma Pharmacy Act`, citation: "State practice act + federal overlay" }]
      : [{ label: "DEA / FDA / HIPAA federal pharmacy law", citation: "Federal pharmacy jurisprudence" }],
  };
}

const MPJE_FEDERAL_BANK: Record<string, BankItem[]> = {
  "federal-pharmacy-law": [
    mpje(
      "federal-pharmacy-law",
      "Under the Federal Food, Drug, and Cosmetic Act (FDCA), which activity is primarily regulated by FDA for prescription drug products?",
      [
        "Manufacturing standards, labeling, and interstate distribution",
        "State pharmacist-to-technician ratio requirements",
        "Individual state pharmacy technician certification",
        "Local municipal zoning for retail pharmacies",
      ],
      "Manufacturing standards, labeling, and interstate distribution",
      "The FDCA governs interstate commerce of drugs, including manufacturing, adulteration/misbranding, and labeling. State boards regulate practice within their jurisdiction.",
      ["federal", "FDA", "FDCA"]
    ),
    mpje(
      "federal-pharmacy-law",
      "A pharmacy receives a shipment lacking required DSCSA product tracing data. The pharmacist should:",
      [
        "Quarantine the product and resolve tracing with the trading partner before dispensing",
        "Dispense immediately if the wholesaler is well known",
        "Return only after patient complaints",
        "Destroy the product without documentation",
      ],
      "Quarantine the product and resolve tracing with the trading partner before dispensing",
      "The Drug Supply Chain Security Act requires interoperable tracing. Pharmacies must investigate suspect or illegitimate products and maintain transaction history.",
      ["federal", "DSCSA"]
    ),
  ],
  "uniform-mpje": [
    mpje(
      "uniform-mpje",
      "Under typical uniform MPJE patterns, a valid prescription must generally include which element?",
      [
        "Patient name, drug name, strength, quantity, directions, prescriber signature, and date",
        "Patient social security number only",
        "Pharmacist's personal license number on every refill",
        "Insurance copay amount",
      ],
      "Patient name, drug name, strength, quantity, directions, prescriber signature, and date",
      "Uniform jurisprudence exams test core prescription validity elements adopted across most state practice acts and NABP model standards.",
      ["uniform", "UMPJE", "prescription"]
    ),
    mpje(
      "uniform-mpje",
      "A pharmacist discovers an obvious dosage error on a new prescription. The best legal and professional action is to:",
      [
        "Contact the prescriber for clarification before dispensing",
        "Dispense as written to avoid delay",
        "Ask the technician to change the dose independently",
        "Refuse all future prescriptions from the prescriber permanently",
      ],
      "Contact the prescriber for clarification before dispensing",
      "Pharmacists have a corresponding responsibility to ensure prescriptions are valid and appropriate; clarification is required when an error is suspected.",
      ["uniform", "dispensing"]
    ),
  ],
  "controlled-substances": [
    mpje(
      "controlled-substances",
      "Federal law (DEA) permits how many refills on a Schedule II (C-II) prescription?",
      [
        "No refills — a new prescription is required",
        "Up to five refills within six months",
        "Unlimited refills if the patient requests them",
        "Three refills within one year",
      ],
      "No refills — a new prescription is required",
      "Schedule II controlled substances cannot be refilled under federal law. A new prescription with all required elements is needed.",
      ["federal", "DEA", "C-II"]
    ),
    mpje(
      "controlled-substances",
      "A pharmacy experiences a significant theft of C-II medications. The pharmacist-in-charge must:",
      [
        "Report the loss to DEA on Form 106 and notify local/state authorities per regulations",
        "Only update internal inventory records",
        "Wait until the annual inventory to report",
        "Report to the wholesaler only",
      ],
      "Report the loss to DEA on Form 106 and notify local/state authorities per regulations",
      "Theft or significant loss of controlled substances requires prompt DEA notification and cooperation with investigators; records must be maintained.",
      ["DEA", "inventory", "theft"]
    ),
  ],
  "dispensing-procedures": [
    mpje(
      "dispensing-procedures",
      "A patient presents an emergency oral prescription for a non-controlled medication after hours. Under common state rules, the pharmacist should:",
      [
        "Document the oral order with required elements and obtain written follow-up within the permitted timeframe",
        "Refuse all oral prescriptions regardless of circumstance",
        "Allow the technician to take the order without pharmacist involvement",
        "Dispense without any record if the prescriber is a family friend",
      ],
      "Document the oral order with required elements and obtain written follow-up within the permitted timeframe",
      "Emergency oral prescriptions are allowed in many jurisdictions with strict documentation and reduced quantity limits until hard copy or electronic follow-up is received.",
      ["dispensing", "prescription"]
    ),
    mpje(
      "dispensing-procedures",
      "Before dispensing, a pharmacist performs drug utilization review (DUR) and identifies a serious drug–drug interaction. The pharmacist should:",
      [
        "Resolve the interaction through prescriber contact or documented intervention before dispensing",
        "Dispense and counsel the patient to monitor at home only",
        "Delegate the decision entirely to the technician",
        "Ignore the interaction if the patient has taken the drug before",
      ],
      "Resolve the interaction through prescriber contact or documented intervention before dispensing",
      "DUR is a core dispensing responsibility; serious interactions require pharmacist intervention and documentation.",
      ["DUR", "dispensing"]
    ),
  ],
  "pharmacy-ethics": [
    mpje(
      "pharmacy-ethics",
      "A pharmacist suspects a colleague is impaired at work. According to professional ethics and most board rules, the pharmacist should:",
      [
        "Report concerns to the appropriate supervisor or board per mandatory reporting requirements",
        "Ignore the situation to maintain workplace harmony",
        "Post about the concern on social media",
        "Confront the patient queue instead of addressing the impairment",
      ],
      "Report concerns to the appropriate supervisor or board per mandatory reporting requirements",
      "Patient safety and professional duty may require reporting impaired practitioners to supervisors or the board of pharmacy.",
      ["ethics", "professionalism"]
    ),
  ],
  "patient-privacy": [
    mpje(
      "patient-privacy",
      "A patient's employer requests prescription records without patient authorization. Under HIPAA, the pharmacy should:",
      [
        "Decline unless a permitted disclosure exception applies",
        "Provide records because the employer pays for insurance",
        "Fax records if the employer sends a letterhead request",
        "Post a summary on the patient portal for the employer",
      ],
      "Decline unless a permitted disclosure exception applies",
      "HIPAA generally requires patient authorization for disclosures to employers; minimum necessary and permitted exceptions still apply.",
      ["HIPAA", "privacy"]
    ),
  ],
  "pharmacy-operations": [
    mpje(
      "pharmacy-operations",
      "During a routine board inspection, which records are pharmacies typically required to maintain?",
      [
        "Prescription files, controlled substance records, compounding logs, and policies/procedures",
        "Only daily cash register receipts",
        "Personal employee social media policies only",
        "Wholesaler marketing materials exclusively",
      ],
      "Prescription files, controlled substance records, compounding logs, and policies/procedures",
      "Board inspections review dispensing records, CS logs, compounding documentation, and operational compliance with state rules.",
      ["operations", "records", "inspection"]
    ),
    mpje(
      "pharmacy-operations",
      "A pharmacy technician prepares a sterile IV admixture. Under typical board rules, the pharmacist must:",
      [
        "Provide adequate supervision and verify compounding according to policy and USP standards",
        "Allow independent technician compounding without pharmacist oversight",
        "Delegate all verification to the delivery driver",
        "Skip documentation if the batch is small",
      ],
      "Provide adequate supervision and verify compounding according to policy and USP standards",
      "Technician scope is limited; pharmacists remain responsible for compounding oversight and verification.",
      ["operations", "technician", "compounding"]
    ),
  ],
  "compounding-regulations": [
    mpje(
      "compounding-regulations",
      "A pharmacy prepares non-sterile compounded preparations for office use. USP <795> requires:",
      [
        "Documented compounding procedures, beyond-use dating, and facility/personnel standards",
        "No records if batches are under ten units",
        "Sterile garb for all OTC counseling",
        "Outsourcing to patients without prescriptions",
      ],
      "Documented compounding procedures, beyond-use dating, and facility/personnel standards",
      "USP <795> sets standards for non-sterile compounding including BUD, training, and quality practices incorporated into board rules.",
      ["compounding", "USP", "federal"]
    ),
  ],
  "state-practice-act": [
    mpje(
      "state-practice-act",
      "Under the Model State Pharmacy Act framework tested on uniform MPJE, pharmacist licensure generally requires:",
      [
        "Graduation from an accredited program, passing NAPLEX/MPJE, and board registration",
        "Only on-the-job training without examination",
        "Registration as a pharmacy technician",
        "DEA registration alone",
      ],
      "Graduation from an accredited program, passing NAPLEX/MPJE, and board registration",
      "Uniform MPJE tests multistate licensure patterns: education, exams, and board registration.",
      ["uniform", "licensure"]
    ),
  ],
};

function bucketQualitySeeds(): Record<string, BankItem[]> {
  const buckets: Record<string, BankItem[]> = {};
  for (const item of MPJE_QUALITY_SEEDS) {
    const sid = item.subjectId ?? "uniform-mpje";
    (buckets[sid] ??= []).push(item);
  }
  return buckets;
}

function mergeBanks(
  ...banks: Record<string, BankItem[]>[]
): Record<string, BankItem[]> {
  const out: Record<string, BankItem[]> = {};
  for (const bank of banks) {
    for (const [sid, items] of Object.entries(bank)) {
      out[sid] = [...(out[sid] ?? []), ...items];
    }
  }
  return out;
}

function bucketSubstantiveSeeds(): Record<string, BankItem[]> {
  const buckets: Record<string, BankItem[]> = {};
  for (const item of MPJE_ALL_STATE_SUBSTANTIVE_SEEDS) {
    const sid = item.subjectId ?? "state-practice-act";
    (buckets[sid] ??= []).push(item);
  }
  return buckets;
}

export const MPJE_QUESTION_BANK: Record<string, BankItem[]> =
  mergeStateSeedsIntoBank(
    mergeBanks(MPJE_FEDERAL_BANK, bucketQualitySeeds(), bucketSubstantiveSeeds())
  );
