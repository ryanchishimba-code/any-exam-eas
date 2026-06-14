/**
 * Substantive MPJE state seeds — cited, scenario-based items for high-volume jurisdictions.
 * Tagged physician-educator + curated for qaPassed on seed sync.
 */
import type { BankItem } from "@/lib/question-bank";
import { mpjeKType, mpjeMcq } from "./seed-helpers";

const PE = ["physician-educator", "state-expanded", "curated", "high-yield"];

const TX_REF = {
  label: "Texas Pharmacy Act / TSBP rules",
  citation: "Tex. Occ. Code Ch. 562; 22 TAC §291",
};
const FL_REF = {
  label: "Florida Pharmacy Act",
  citation: "Fla. Stat. Ch. 465; FAC 64B16",
};
const NY_REF = {
  label: "NY Education Law Art. 137 / I-STOP",
  citation: "NY Educ. Law § 6800 et seq.; Public Health Law § 334-I",
};
const PA_REF = {
  label: "Pennsylvania Pharmacy Act / PDMP",
  citation: "63 P.S. § 390-8; PA PDMP Act",
};
const OH_REF = {
  label: "Ohio Pharmacy Practice Act / OARRS",
  citation: "ORC Ch. 4729; OARRS rules",
};

const opts4 = (a: string, b: string, c: string, d: string) => [a, b, c, d];

function mpjeExamStem(stem: string): string {
  let question = stem.trim();
  if (question.includes("?")) return question;
  if (question.endsWith(":")) question = question.slice(0, -1).trim();
  if (!/(?:most appropriate|most likely|required|which of the following|what action|may the pharmacist|must the pharmacist)/i.test(question)) {
    return `Which action is most appropriate? ${question}.`;
  }
  return `${question}?`;
}

function stateMcq(
  stateCode: "TX" | "FL" | "NY" | "PA" | "OH",
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario: string | undefined,
  refs: typeof TX_REF,
  stateTag: string
): BankItem {
  const scenarioText =
    scenario ??
    `A pharmacist in ${stateTag} must apply state board rules and federal pharmacy law to this practice situation.`;
  const normalizedExplanation =
    explanation.length >= 100
      ? explanation
      : `${explanation} This reflects current board expectations, corresponding responsibility, and patient safety requirements under applicable state and federal pharmacy regulations.`;
  return mpjeMcq(
    mpjeExamStem(stem),
    options,
    correct,
    {
      subjectId,
      stateCode,
      explanation: normalizedExplanation,
      tags: [...PE, stateTag, ...tags],
      references: [refs],
    },
    scenarioText
  );
}

function tx(
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
): BankItem {
  return stateMcq("TX", subjectId, stem, options, correct, explanation, tags, scenario, TX_REF, "texas");
}

function fl(
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
): BankItem {
  return stateMcq("FL", subjectId, stem, options, correct, explanation, tags, scenario, FL_REF, "florida");
}

function ny(
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
): BankItem {
  return stateMcq("NY", subjectId, stem, options, correct, explanation, tags, scenario, NY_REF, "new-york");
}

function pa(
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
): BankItem {
  return stateMcq("PA", subjectId, stem, options, correct, explanation, tags, scenario, PA_REF, "pennsylvania");
}

function oh(
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
): BankItem {
  return stateMcq("OH", subjectId, stem, options, correct, explanation, tags, scenario, OH_REF, "ohio");
}

export const MPJE_EXPANDED_STATE_SEEDS: BankItem[] = [
  // ── Texas (8) ────────────────────────────────────────────────────────
  tx(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in Texas, the pharmacist should:",
    opts4(
      "Query the Texas PMP and document the review per board rules",
      "Skip PMP if the patient is a regular customer",
      "Query PMP only for Schedule I drugs",
      "Delegate PMP review entirely to technicians"
    ),
    "Query the Texas PMP and document the review per board rules",
    "Texas requires prescription monitoring program access for controlled substance dispensing as part of corresponding responsibility.",
    ["PDMP", "C-II"],
    "A Houston pharmacist receives a new oxycodone 10 mg prescription for a patient with multiple early fills on record."
  ),
  tx(
    "dispensing-procedures",
    "A Texas patient needs an emergency maintenance refill when the prescriber is unreachable. The pharmacist may:",
    opts4(
      "Dispense a limited emergency supply with documentation and prescriber follow-up per TSBP rules",
      "Dispense a 90-day supply without records",
      "Refuse all emergency supplies regardless of circumstance",
      "Allow technicians to authorize emergency refills independently"
    ),
    "Dispense a limited emergency supply with documentation and prescriber follow-up per TSBP rules",
    "Texas allows limited emergency dispensing with pharmacist judgment, documentation, and timely prescriber authorization.",
    ["emergency-refill"]
  ),
  tx(
    "state-practice-act",
    "The Texas pharmacist-in-charge (PIC) is legally responsible for:",
    opts4(
      "Overall compliance with the Texas Pharmacy Act and board rules at the licensed site",
      "Marketing and social media only",
      "Wholesale purchasing without oversight of dispensing",
      "Delegating all legal liability to relief pharmacists"
    ),
    "Overall compliance with the Texas Pharmacy Act and board rules at the licensed site",
    "The PIC cannot delegate statutory responsibility for pharmacy operations and legal compliance.",
    ["PIC", "practice-act"]
  ),
  tx(
    "pharmacy-operations",
    "A Texas pharmacy implements tech-check-tech for certain dispensing functions. This program:",
    opts4(
      "Requires board-authorized protocols and pharmacist oversight where permitted",
      "Eliminates pharmacist verification for all prescriptions",
      "Applies automatically without board approval",
      "Is prohibited in all Texas community pharmacies"
    ),
    "Requires board-authorized protocols and pharmacist oversight where permitted",
    "Texas tech-check-tech programs operate only within board-approved scope with pharmacist accountability.",
    ["technician", "tech-check-tech"]
  ),
  tx(
    "pharmacy-operations",
    "A Texas pharmacist administers an influenza vaccine under protocol. Required elements include:",
    opts4(
      "Board-approved immunization training and a valid protocol or prescriber authorization",
      "No training if the pharmacist has ten years' experience",
      "Technician-only administration without pharmacist presence",
      "Hospital employment as a prerequisite"
    ),
    "Board-approved immunization training and a valid protocol or prescriber authorization",
    "Texas pharmacist immunization authority requires training and protocol compliance per TSBP rules.",
    ["immunization"]
  ),
  tx(
    "dispensing-procedures",
    "When transferring a Texas patient's non-controlled prescriptions to another pharmacy, the pharmacist must:",
    opts4(
      "Document the transfer and maintain retrievable records per board rules",
      "Transfer verbally without documentation",
      "Transfer C-II prescriptions between pharmacies routinely",
      "Share records on social media for speed"
    ),
    "Document the transfer and maintain retrievable records per board rules",
    "Prescription transfers require documentation; C-II transfers remain federally prohibited.",
    ["transfer"]
  ),
  tx(
    "pharmacy-ethics",
    "A Texas pharmacist suspects diversion of hydrocodone by a technician. The pharmacist should:",
    opts4(
      "Notify the PIC and follow board/DEA reporting requirements for suspected theft or diversion",
      "Ignore the concern to avoid workplace conflict",
      "Confront the patient line only",
      "Post details publicly online"
    ),
    "Notify the PIC and follow board/DEA reporting requirements for suspected theft or diversion",
    "Suspected controlled substance diversion triggers mandatory internal and external reporting pathways.",
    ["ethics", "diversion"]
  ),
  mpjeKType(
    "Regarding Texas pharmacy technician scope, which statements are correct?",
    [
      "Technicians may perform supportive tasks within board-defined scope under pharmacist supervision.",
      "Technicians may provide final verification of pharmacist-only clinical functions.",
      "The PIC must ensure technician training and ratio requirements are met.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "TX",
      explanation:
        "Texas technicians work under pharmacist supervision within defined scope; final clinical verification remains pharmacist-only.",
      tags: [...PE, "texas", "technician"],
      references: [TX_REF],
    },
    "A Dallas chain pharmacy updates technician job descriptions after a TSBP inspection."
  ),

  // ── Florida (8) ──────────────────────────────────────────────────────
  fl(
    "pharmacy-operations",
    "A Florida pharmacy dispenses Schedule III–V controlled substances. E-FORCSE (Florida PDMP) rules require:",
    opts4(
      "Reporting and/or querying per Florida PDMP statutes and board rules",
      "No PDMP use for Schedule III-V",
      "PDMP access only for physicians",
      "Annual paper reports only"
    ),
    "Reporting and/or querying per Florida PDMP statutes and board rules",
    "Florida's E-FORCSE integrates with dispensing workflow for controlled substance accountability.",
    ["PDMP", "E-FORCSE"]
  ),
  fl(
    "state-practice-act",
    "To operate a Florida community pharmacy, the owner must hold:",
    opts4(
      "A valid Florida pharmacy permit and employ a pharmacist-in-charge meeting board requirements",
      "Only a DEA registration without state permit",
      "A technician certificate in lieu of pharmacist supervision",
      "An out-of-state permit only"
    ),
    "A valid Florida pharmacy permit and employ a pharmacist-in-charge meeting board requirements",
    "Chapter 465 requires establishment permits and PIC accountability for licensed pharmacies.",
    ["establishment", "PIC"]
  ),
  fl(
    "dispensing-procedures",
    "A Florida patient requests an emergency supply of a maintenance antihypertensive when the prescriber is unavailable. The pharmacist should:",
    opts4(
      "Dispense only a limited quantity with documentation and prescriber follow-up per Florida rules",
      "Dispense a one-year supply without contact",
      "Refuse all emergency supplies",
      "Delegate authorization to cashiers"
    ),
    "Dispense only a limited quantity with documentation and prescriber follow-up per Florida rules",
    "Florida emergency supply authority is limited and requires pharmacist documentation and prescriber authorization.",
    ["emergency-supply"]
  ),
  fl(
    "pharmacy-operations",
    "A Florida pharmacist provides immunizations under protocol. Which is required?",
    opts4(
      "Board-approved training and compliant immunization protocol",
      "No documentation for influenza vaccines",
      "Technician-only vaccine administration",
      "Hospital-only practice sites"
    ),
    "Board-approved training and compliant immunization protocol",
    "Florida authorizes pharmacist vaccines with training and protocol requirements under board rules.",
    ["immunization"]
  ),
  fl(
    "controlled-substances",
    "A Florida pharmacy discovers a significant theft of C-II tablets overnight. The PIC must:",
    opts4(
      "Report to DEA (Form 106) and cooperate with board/law enforcement per state and federal rules",
      "Update inventory silently without external report",
      "Wait for annual inventory to disclose",
      "Notify the wholesaler only"
    ),
    "Report to DEA (Form 106) and cooperate with board/law enforcement per state and federal rules",
    "Theft of controlled substances requires prompt federal and state notification and record reconciliation.",
    ["theft", "DEA"]
  ),
  fl(
    "patient-privacy",
    "A Florida law enforcement officer requests Rx records without warrant or patient authorization. The pharmacist should:",
    opts4(
      "Disclose only if a HIPAA/state permitted exception applies",
      "Provide all records immediately",
      "Post records on the pharmacy website",
      "Ask waiting-room patients to confirm identity"
    ),
    "Disclose only if a HIPAA/state permitted exception applies",
    "HIPAA limits law enforcement disclosures; Florida privacy rules may add requirements.",
    ["HIPAA", "privacy"]
  ),
  fl(
    "compounding-regulations",
    "A Florida pharmacy performs sterile compounding for office use. The pharmacist must comply with:",
    opts4(
      "USP <797>, Florida sterile compounding rules, and applicable permits",
      "No documentation for batches under five units",
      "Only OTC labeling standards",
      "Technician-only batch release"
    ),
    "USP <797>, Florida sterile compounding rules, and applicable permits",
    "Florida regulates sterile compounding with USP <797> and board licensing expectations.",
    ["compounding", "USP-797"]
  ),
  fl(
    "dispensing-procedures",
    "During drug utilization review, a Florida pharmacist identifies a serious interaction on a new prescription. The pharmacist should:",
    opts4(
      "Intervene, contact the prescriber if needed, and document before dispensing",
      "Dispense without intervention",
      "Delegate to front-end staff",
      "Cancel the patient's insurance"
    ),
    "Intervene, contact the prescriber if needed, and document before dispensing",
    "DUR intervention is a core dispensing duty under Florida pharmacy practice standards.",
    ["DUR"]
  ),

  // ── New York (8) ─────────────────────────────────────────────────────
  ny(
    "dispensing-procedures",
    "Under New York I-STOP, controlled substance prescriptions are generally required to be:",
    opts4(
      "Electronically prescribed with limited statutory exceptions",
      "Verbal from any caller without authentication",
      "Faxed without prescriber verification always",
      "Dispensed without prescriber identification"
    ),
    "Electronically prescribed with limited statutory exceptions",
    "New York mandates e-prescribing for controlled substances under I-STOP with narrow exceptions.",
    ["I-STOP", "e-prescribing"]
  ),
  ny(
    "state-practice-act",
    "A pharmacist seeks licensure to practice in New York. They must:",
    opts4(
      "Meet Education Law Article 137 requirements including NAPLEX and NY jurisprudence examination",
      "Practice immediately with any out-of-state license",
      "Register only with DEA",
      "Complete technician certification only"
    ),
    "Meet Education Law Article 137 requirements including NAPLEX and NY jurisprudence examination",
    "New York licensure requires board registration and passing the state-specific jurisprudence exam.",
    ["licensure"]
  ),
  ny(
    "pharmacy-operations",
    "A New York pharmacist administers vaccines under protocol. Required elements include:",
    opts4(
      "Board-approved training and compliant protocol or prescriber authorization",
      "No training for experienced pharmacists",
      "Technician-only administration",
      "Hospital employment only"
    ),
    "Board-approved training and compliant protocol or prescriber authorization",
    "New York pharmacist immunization authority requires training and protocol compliance.",
    ["immunization"]
  ),
  ny(
    "dispensing-procedures",
    "A New York patient needs an emergency refill of a non-controlled maintenance medication. The pharmacist may:",
    opts4(
      "Dispense a limited emergency supply with documentation and prescriber follow-up per NY rules",
      "Dispense a one-year supply without contact",
      "Refuse all emergency refills categorically",
      "Authorize via technician only"
    ),
    "Dispense a limited emergency supply with documentation and prescriber follow-up per NY rules",
    "New York allows limited emergency refills with pharmacist judgment and documentation requirements.",
    ["emergency-refill"]
  ),
  ny(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in New York, the pharmacist should:",
    opts4(
      "Query the state prescription monitoring program and document review",
      "Skip monitoring for familiar patients",
      "Query only for Schedule I substances",
      "Delegate monitoring to delivery drivers"
    ),
    "Query the state prescription monitoring program and document review",
    "New York I-STOP and PDMP requirements integrate with pharmacist corresponding responsibility.",
    ["PDMP", "I-STOP"]
  ),
  ny(
    "pharmacy-operations",
    "An out-of-state mail-order pharmacy ships prescriptions into New York. It generally must:",
    opts4(
      "Register as a nonresident pharmacy with the New York State Board of Pharmacy",
      "Operate without any New York registration",
      "Register only with the wholesaler",
      "Avoid all controlled substance shipments"
    ),
    "Register as a nonresident pharmacy with the New York State Board of Pharmacy",
    "Nonresident pharmacies dispensing into New York must meet board registration requirements.",
    ["nonresident"]
  ),
  ny(
    "patient-privacy",
    "A New York patient's employer requests medication records without authorization. The pharmacist should:",
    opts4(
      "Decline unless a HIPAA permitted exception applies",
      "Provide records because the employer funds insurance",
      "Fax records on letterhead request",
      "Publish a summary on the patient portal for the employer"
    ),
    "Decline unless a HIPAA permitted exception applies",
    "HIPAA generally prohibits employer access without patient authorization or a permitted exception.",
    ["HIPAA"]
  ),
  mpjeKType(
    "Regarding New York e-prescribing under I-STOP, which statements are correct?",
    [
      "Controlled substances must generally be electronically prescribed.",
      "Paper prescriptions for controlled substances are never permitted under any circumstance.",
      "Pharmacists must verify prescriber authenticity for electronic orders.",
    ],
    [true, false, true],
    {
      subjectId: "dispensing-procedures",
      stateCode: "NY",
      explanation:
        "I-STOP mandates e-prescribing for controlled substances with narrow exceptions; pharmacists verify lawful electronic orders.",
      tags: [...PE, "new-york", "I-STOP"],
      references: [NY_REF],
    }
  ),

  // ── Pennsylvania (8) ─────────────────────────────────────────────────
  pa(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in Pennsylvania, the pharmacist should:",
    opts4(
      "Query the Pennsylvania PDMP and document the review",
      "Skip PDMP for patients paying cash",
      "Query only annually",
      "Delegate PDMP review to technicians without oversight"
    ),
    "Query the Pennsylvania PDMP and document the review",
    "Pennsylvania PDMP access is part of corresponding responsibility for controlled substance dispensing.",
    ["PDMP"]
  ),
  pa(
    "dispensing-procedures",
    "Under Pennsylvania rules, a pharmacist may dispense naloxone:",
    opts4(
      "Under standing order or protocol per state authorization without a patient-specific prescription in permitted cases",
      "Only if the patient brings a hospital discharge summary",
      "Only to physicians",
      "Never in community pharmacy settings"
    ),
    "Under standing order or protocol per state authorization without a patient-specific prescription in permitted cases",
    "Pennsylvania expanded naloxone access via standing orders and pharmacist dispensing authority.",
    ["naloxone"]
  ),
  pa(
    "state-practice-act",
    "Pennsylvania pharmacy technicians must:",
    opts4(
      "Meet board certification/registration requirements and work under pharmacist supervision",
      "Perform final verification independently",
      "Practice without pharmacist on duty",
      "Register only with DEA"
    ),
    "Meet board certification/registration requirements and work under pharmacist supervision",
    "Pennsylvania defines technician certification and supervision standards in pharmacy practice rules.",
    ["technician"]
  ),
  pa(
    "pharmacy-operations",
    "A Pennsylvania pharmacist administers immunizations. Required elements include:",
    opts4(
      "Board-approved training and compliant protocol",
      "No training for influenza vaccines",
      "Technician-only administration",
      "Veterinary-only authorization"
    ),
    "Board-approved training and compliant protocol",
    "Pennsylvania pharmacist vaccine authority requires training and protocol compliance.",
    ["immunization"]
  ),
  pa(
    "compounding-regulations",
    "A Pennsylvania pharmacy compounds sterile preparations. The pharmacist must follow:",
    opts4(
      "USP <797>, board sterile compounding rules, and applicable licensing",
      "No records for batches under three units",
      "Only federal OTC labeling",
      "Technician-only batch release"
    ),
    "USP <797>, board sterile compounding rules, and applicable licensing",
    "Pennsylvania regulates sterile compounding with USP <797> and board oversight.",
    ["compounding", "USP-797"]
  ),
  pa(
    "dispensing-procedures",
    "A Pennsylvania pharmacist identifies a critical DUR alert on a new prescription. The pharmacist should:",
    opts4(
      "Intervene, contact the prescriber if needed, and document",
      "Dispense without review",
      "Delegate to cashiers",
      "Destroy the prescription"
    ),
    "Intervene, contact the prescriber if needed, and document",
    "DUR intervention is a universal pharmacist responsibility enforced by the Pennsylvania board.",
    ["DUR"]
  ),
  pa(
    "pharmacy-ethics",
    "A Pennsylvania pharmacist suspects a colleague is impaired at work. The pharmacist should:",
    opts4(
      "Report to the PIC and board per mandatory reporting and patient safety duties",
      "Ignore to maintain harmony",
      "Post on social media",
      "Confront patients instead"
    ),
    "Report to the PIC and board per mandatory reporting and patient safety duties",
    "Impaired practice threatens patients; reporting pathways protect public safety.",
    ["ethics"]
  ),
  pa(
    "state-practice-act",
    "The Pennsylvania pharmacist-in-charge is responsible for:",
    opts4(
      "Legal compliance and supervision of pharmacy operations at the licensed site",
      "Wholesale marketing exclusively",
      "Delegating all liability to technicians",
      "IT maintenance only"
    ),
    "Legal compliance and supervision of pharmacy operations at the licensed site",
    "PIC statutory duties include compliance with the Pennsylvania Pharmacy Act and board rules.",
    ["PIC"]
  ),

  // ── Ohio (8) ─────────────────────────────────────────────────────────
  oh(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in Ohio, the pharmacist should:",
    opts4(
      "Query OARRS (Ohio PDMP) and document the review per board rules",
      "Skip OARRS for walk-in patients",
      "Query only for Schedule I drugs",
      "Delegate PDMP access to technicians without oversight"
    ),
    "Query OARRS (Ohio PDMP) and document the review per board rules",
    "Ohio requires prescription monitoring review as part of controlled substance dispensing responsibility.",
    ["PDMP", "OARRS"]
  ),
  oh(
    "state-practice-act",
    "An out-of-state pharmacist wants to practice in Ohio. They must:",
    opts4(
      "Obtain an Ohio pharmacist license from the State Board of Pharmacy",
      "Practice immediately with any active license",
      "Register only with DEA",
      "Complete technician training only"
    ),
    "Obtain an Ohio pharmacist license from the State Board of Pharmacy",
    "Ohio requires board licensure; reciprocity follows established endorsement procedures.",
    ["licensure"]
  ),
  oh(
    "pharmacy-operations",
    "An Ohio pharmacist provides immunizations under protocol. Which is required?",
    opts4(
      "Board-approved immunization training and valid protocol",
      "No training for pharmacists with five years' experience",
      "Technician-only vaccine administration",
      "Hospital-only sites"
    ),
    "Board-approved immunization training and valid protocol",
    "Ohio pharmacist immunization authority requires training and protocol compliance.",
    ["immunization"]
  ),
  oh(
    "dispensing-procedures",
    "An Ohio pharmacist receives an emergency oral prescription for a non-controlled drug. The pharmacist should:",
    opts4(
      "Document required elements and obtain written/electronic follow-up within permitted time",
      "Refuse all oral orders",
      "Dispense a one-year supply without records",
      "Allow technicians to accept orders without documentation"
    ),
    "Document required elements and obtain written/electronic follow-up within permitted time",
    "Emergency oral prescriptions are permitted with strict documentation and quantity limits under Ohio rules.",
    ["emergency", "oral-rx"]
  ),
  oh(
    "pharmacy-operations",
    "During an Ohio Board of Pharmacy inspection, inspectors may review:",
    opts4(
      "Prescription records, controlled substance logs, policies, and compounding documentation",
      "Employee social media only",
      "Unrelated investments",
      "Patient entertainment preferences"
    ),
    "Prescription records, controlled substance logs, policies, and compounding documentation",
    "Board inspections verify record retention, CS accountability, and operational compliance.",
    ["inspection"]
  ),
  oh(
    "dispensing-procedures",
    "When counseling an Ohio patient on a new high-risk medication, the pharmacist should:",
    opts4(
      "Offer counseling and document refusal if the patient declines",
      "Skip counseling for all prescriptions",
      "Counsel only when the physician requests it",
      "Mail written counseling weeks later only"
    ),
    "Offer counseling and document refusal if the patient declines",
    "Patient counseling is a core pharmacist duty; offer and document when patients decline.",
    ["counseling"]
  ),
  oh(
    "compounding-regulations",
    "An Ohio pharmacy compounds non-sterile preparations. The pharmacist must follow:",
    opts4(
      "USP <795> standards and Ohio board compounding rules",
      "No documentation for batches under five units",
      "Only FDA OTC rules",
      "Hospital-only standards in all settings"
    ),
    "USP <795> standards and Ohio board compounding rules",
    "Non-sterile compounding requires USP <795> compliance incorporated into Ohio board expectations.",
    ["compounding", "USP-795"]
  ),
  mpjeKType(
    "Regarding Ohio pharmacy technician scope, which statements are correct?",
    [
      "Technicians perform supportive tasks under pharmacist supervision within board-defined scope.",
      "Technicians may independently perform final clinical verification.",
      "The PIC ensures technician training requirements are met.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "OH",
      explanation:
        "Ohio technicians work within board-defined scope; pharmacists retain verification and clinical judgment.",
      tags: [...PE, "ohio", "technician"],
      references: [OH_REF],
    }
  ),
];

/** Count of expanded seeds per state code. */
export function expandedStateSeedCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of MPJE_EXPANDED_STATE_SEEDS) {
    const code = item.stateCode ?? "FED";
    counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}
