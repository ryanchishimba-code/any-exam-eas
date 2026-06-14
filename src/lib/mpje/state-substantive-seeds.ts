/**
 * Top-tier state-specific MPJE seeds — cited vignettes, K-type, SATA.
 * Tagged physician-educator + curated for qaPassed on seed sync.
 */
import type { BankItem } from "@/lib/question-bank";
import { mpjeKType, mpjeMcq, mpjeSelectAll } from "./seed-helpers";
import { MPJE_STATE_SUBSTANTIVE_SEEDS_BATCH_02 } from "./state-substantive-seeds-batch-02";

const PE = ["physician-educator", "curated", "state-substantive", "high-yield"] as const;

const TX_REF = { label: "Texas Pharmacy Act / TSBP", citation: "Tex. Occ. Code Ch. 562; 22 TAC §291" };
const FL_REF = { label: "Florida Pharmacy Act", citation: "Fla. Stat. Ch. 465; FAC 64B16" };
const NY_REF = { label: "NY Education Law Art. 137", citation: "NY Educ. Law § 6800; PHL § 334-I" };
const PA_REF = { label: "Pennsylvania Pharmacy Act", citation: "63 P.S. § 390-8; PA PDMP Act" };
const OH_REF = { label: "Ohio Pharmacy Practice Act", citation: "ORC Ch. 4729; OARRS" };
const OK_REF = { label: "Oklahoma Pharmacy Act", citation: "63 O.S. § 1521; OAC 535:15" };

const o4 = (a: string, b: string, c: string, d: string) => [a, b, c, d];

type StateBuilder = (
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
) => BankItem;

function builder(
  stateCode: string,
  ref: { label: string; citation: string },
  tag: string
): StateBuilder {
  return (subjectId, stem, options, correct, explanation, tags, scenario) =>
    mpjeMcq(stem, options, correct, {
      subjectId,
      stateCode,
      explanation,
      tags: [...PE, tag, ...tags],
      references: [ref],
    }, scenario);
}

const tx = builder("TX", TX_REF, "texas");
const fl = builder("FL", FL_REF, "florida");
const ny = builder("NY", NY_REF, "new-york");
const pa = builder("PA", PA_REF, "pennsylvania");
const oh = builder("OH", OH_REF, "ohio");
const ok = builder("OK", OK_REF, "oklahoma");

export const MPJE_STATE_SUBSTANTIVE_SEEDS: BankItem[] = [
  // ── Texas (10) ───────────────────────────────────────────────────────
  tx(
    "controlled-substances",
    "Before dispensing hydrocodone 7.5 mg in Texas, what must the pharmacist do?",
    o4(
      "Query the Texas PMP and document the review",
      "Skip monitoring for established patients",
      "Query PMP only for Schedule I drugs",
      "Delegate PMP review to technicians without oversight"
    ),
    "Query the Texas PMP and document the review",
    "Texas controlled substance dispensing requires PMP query and documentation as part of corresponding responsibility under TSBP rules.",
    ["PDMP", "C-II"],
    "A 45-year-old patient in Houston presents an early refill request for hydrocodone with multiple overlapping opioid fills on the Texas PMP."
  ),
  tx(
    "dispensing-procedures",
    "A Texas patient needs an emergency maintenance refill when the prescriber is unreachable. What may the pharmacist do?",
    o4(
      "Dispense a limited supply with documentation and prescriber follow-up per board rules",
      "Dispense a 90-day supply without records",
      "Refuse all emergency supplies in every situation",
      "Authorize emergency refills via cashier staff"
    ),
    "Dispense a limited supply with documentation and prescriber follow-up per board rules",
    "Texas permits limited emergency dispensing with pharmacist judgment, documentation, and timely prescriber authorization.",
    ["emergency-refill"]
  ),
  tx(
    "state-practice-act",
    "What is the primary legal duty of the Texas pharmacist-in-charge (PIC)?",
    o4(
      "Ensure compliance with the Texas Pharmacy Act and board rules at the licensed site",
      "Manage social media marketing exclusively",
      "Delegate all statutory liability to relief pharmacists",
      "Oversee wholesale purchasing without dispensing oversight"
    ),
    "Ensure compliance with the Texas Pharmacy Act and board rules at the licensed site",
    "The PIC retains non-delegable responsibility for pharmacy operations and regulatory compliance.",
    ["PIC"]
  ),
  tx(
    "pharmacy-operations",
    "A Texas pharmacy operates a board-authorized tech-check-tech program. Which statement is correct?",
    o4(
      "The program requires approved protocols and ongoing pharmacist accountability",
      "Technicians may perform all final clinical verification independently",
      "No board approval is required for tech-check-tech",
      "The program eliminates PIC responsibility for dispensing"
    ),
    "The program requires approved protocols and ongoing pharmacist accountability",
    "Texas tech-check-tech operates only within board-approved scope; pharmacists remain accountable.",
    ["technician", "tech-check-tech"]
  ),
  mpjeSelectAll(
    "Which records should a Texas pharmacy produce during a TSBP inspection? Select all that apply.",
    [
      "Prescription files and refill documentation",
      "Controlled substance perpetual inventory logs",
      "Written policies and procedures",
      "Employee personal credit histories",
      "Compounding records when applicable",
    ],
    [
      "Prescription files and refill documentation",
      "Controlled substance perpetual inventory logs",
      "Written policies and procedures",
      "Compounding records when applicable",
    ],
    {
      subjectId: "pharmacy-operations",
      stateCode: "TX",
      explanation:
        "Board inspections review dispensing records, CS accountability, policies, and compounding documentation — not unrelated personal financial records.",
      tags: [...PE, "texas", "inspection"],
      references: [TX_REF],
    },
    "A TSBP inspector schedules a routine survey at a Dallas chain pharmacy."
  ),
  tx(
    "pharmacy-ethics",
    "A Texas pharmacist suspects a technician is diverting alprazolam. What is the most appropriate action?",
    o4(
      "Notify the PIC and follow board and DEA reporting requirements",
      "Ignore the concern to avoid conflict",
      "Post allegations on social media",
      "Confront waiting-room patients instead"
    ),
    "Notify the PIC and follow board and DEA reporting requirements",
    "Suspected diversion requires internal escalation and external reporting pathways under Texas and federal rules.",
    ["diversion", "ethics"]
  ),
  tx(
    "pharmacy-operations",
    "A Texas pharmacist will administer influenza vaccine under protocol. What is required?",
    o4(
      "Board-approved immunization training and a valid protocol",
      "No training if the pharmacist has ten years' experience",
      "Technician-only vaccine administration",
      "Hospital employment as a prerequisite"
    ),
    "Board-approved immunization training and a valid protocol",
    "Texas pharmacist immunization authority requires training and protocol compliance per TSBP rules.",
    ["immunization"]
  ),
  tx(
    "dispensing-procedures",
    "When transferring non-controlled prescriptions out of a Texas pharmacy, the pharmacist must:",
    o4(
      "Document the transfer and maintain retrievable records",
      "Transfer verbally without any documentation",
      "Transfer Schedule II prescriptions between pharmacies routinely",
      "Share records publicly for efficiency"
    ),
    "Document the transfer and maintain retrievable records",
    "Prescription transfers require documentation; federal law prohibits C-II transfers between pharmacies.",
    ["transfer"]
  ),
  tx(
    "compounding-regulations",
    "A Texas pharmacy performs non-sterile compounding. Which standard applies?",
    o4(
      "USP <795> and Texas board compounding rules",
      "No documentation for batches under five units",
      "Only OTC labeling rules",
      "Technician-only batch release without pharmacist review"
    ),
    "USP <795> and Texas board compounding rules",
    "Non-sterile compounding must follow USP <795> incorporated into Texas board expectations.",
    ["compounding", "USP-795"]
  ),
  mpjeKType(
    "Regarding Texas pharmacy technician scope, which statements are correct?",
    [
      "Technicians may perform supportive tasks within board-defined scope under pharmacist supervision.",
      "Technicians may provide final clinical verification of pharmacist-only functions.",
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
    "A Fort Worth pharmacy updates technician policies after a TSBP advisory."
  ),

  // ── Florida (10) ─────────────────────────────────────────────────────
  fl(
    "pharmacy-operations",
    "A Florida pharmacy dispenses Schedule III–V controlled substances. What does E-FORCSE require?",
    o4(
      "Reporting and/or querying per Florida PDMP statutes and board rules",
      "No PDMP use for Schedule III–V",
      "PDMP access restricted to physicians only",
      "Annual paper reports without electronic query"
    ),
    "Reporting and/or querying per Florida PDMP statutes and board rules",
    "Florida's E-FORCSE PDMP integrates with dispensing workflow for controlled substance accountability.",
    ["PDMP", "E-FORCSE"]
  ),
  fl(
    "state-practice-act",
    "To operate a Florida community pharmacy, the owner must:",
    o4(
      "Hold a valid Florida pharmacy permit with a qualified PIC",
      "Register only with DEA without a state permit",
      "Employ certified technicians in lieu of pharmacist supervision",
      "Use an out-of-state permit exclusively"
    ),
    "Hold a valid Florida pharmacy permit with a qualified PIC",
    "Chapter 465 requires establishment permits and PIC accountability for licensed Florida pharmacies.",
    ["establishment", "PIC"]
  ),
  fl(
    "dispensing-procedures",
    "A Florida patient needs an emergency antihypertensive supply when the prescriber is unavailable. What should the pharmacist do?",
    o4(
      "Dispense only a limited quantity with documentation and prescriber follow-up",
      "Dispense a one-year supply without contact",
      "Refuse all emergency supplies categorically",
      "Delegate the decision to front-end staff"
    ),
    "Dispense only a limited quantity with documentation and prescriber follow-up",
    "Florida emergency supply authority is limited and requires pharmacist documentation and prescriber authorization.",
    ["emergency-supply"]
  ),
  fl(
    "controlled-substances",
    "A Florida pharmacy discovers overnight theft of C-II tablets. The PIC must:",
    o4(
      "Report to DEA (Form 106) and cooperate with board and law enforcement",
      "Adjust inventory silently without external report",
      "Wait until the annual inventory to disclose",
      "Notify the wholesaler only"
    ),
    "Report to DEA (Form 106) and cooperate with board and law enforcement",
    "Controlled substance theft requires prompt federal notification, inventory reconciliation, and cooperation with investigators.",
    ["theft", "DEA"]
  ),
  fl(
    "compounding-regulations",
    "A Florida pharmacy performs sterile compounding. Which requirements apply?",
    o4(
      "USP <797>, Florida sterile compounding rules, and applicable permits",
      "No records for batches under three units",
      "Only federal OTC labeling standards",
      "Technician-only release of sterile batches"
    ),
    "USP <797>, Florida sterile compounding rules, and applicable permits",
    "Florida regulates sterile compounding with USP <797> and board licensing expectations.",
    ["compounding", "USP-797"]
  ),
  fl(
    "patient-privacy",
    "A Florida law enforcement officer requests Rx records without warrant or patient authorization. What should the pharmacist do?",
    o4(
      "Disclose only if a HIPAA or Florida permitted exception applies",
      "Provide all records immediately",
      "Publish records on the pharmacy website",
      "Ask patients in the waiting room to confirm identity"
    ),
    "Disclose only if a HIPAA or Florida permitted exception applies",
    "HIPAA limits law enforcement disclosures; Florida privacy rules may impose additional requirements.",
    ["HIPAA", "privacy"]
  ),
  fl(
    "dispensing-procedures",
    "During DUR, a Florida pharmacist identifies a serious interaction on a new prescription. What is required?",
    o4(
      "Intervene, contact the prescriber if needed, and document before dispensing",
      "Dispense without pharmacist review",
      "Delegate to cashiers",
      "Destroy the prescription"
    ),
    "Intervene, contact the prescriber if needed, and document before dispensing",
    "DUR intervention is a core dispensing duty under Florida pharmacy practice standards.",
    ["DUR"]
  ),
  fl(
    "pharmacy-operations",
    "A Florida pharmacist provides immunizations under protocol. What is required?",
    o4(
      "Board-approved training and compliant immunization protocol",
      "No documentation for influenza vaccines",
      "Technician-only vaccine administration",
      "Hospital-only practice sites"
    ),
    "Board-approved training and compliant immunization protocol",
    "Florida authorizes pharmacist vaccines with training and protocol requirements.",
    ["immunization"]
  ),
  mpjeSelectAll(
    "Which actions align with Florida controlled substance corresponding responsibility? Select all that apply.",
    [
      "Query E-FORCSE before dispensing when required",
      "Evaluate prescription validity and patient safety",
      "Dispense suspicious early opioid refills without question",
      "Document pharmacist interventions in the patient record",
      "Refuse to fill when no legitimate medical purpose is established",
    ],
    [
      "Query E-FORCSE before dispensing when required",
      "Evaluate prescription validity and patient safety",
      "Document pharmacist interventions in the patient record",
      "Refuse to fill when no legitimate medical purpose is established",
    ],
    {
      subjectId: "controlled-substances",
      stateCode: "FL",
      explanation:
        "Corresponding responsibility requires PDMP use, clinical evaluation, documentation, and refusal when appropriate — not blind dispensing of suspicious opioids.",
      tags: [...PE, "florida", "corresponding-responsibility"],
      references: [FL_REF],
    }
  ),
  mpjeKType(
    "Regarding Florida pharmacy establishment permits, which statements are correct?",
    [
      "A pharmacy must hold a valid Florida permit to dispense at a fixed location.",
      "A DEA registration alone replaces Florida board licensure.",
      "The PIC is accountable for operations at the permitted site.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "FL",
      explanation:
        "Florida requires board establishment permits and PIC accountability; federal DEA registration does not substitute for state licensure.",
      tags: [...PE, "florida", "permit"],
      references: [FL_REF],
    }
  ),

  // ── New York (10) ────────────────────────────────────────────────────
  ny(
    "dispensing-procedures",
    "Under New York I-STOP, how must controlled substance prescriptions generally be transmitted?",
    o4(
      "Electronically with limited statutory exceptions",
      "Verbally from any unidentified caller",
      "By unauthenticated fax in all cases",
      "Without prescriber identification when urgent"
    ),
    "Electronically with limited statutory exceptions",
    "New York mandates e-prescribing for controlled substances under I-STOP with narrow exceptions.",
    ["I-STOP", "e-prescribing"]
  ),
  ny(
    "state-practice-act",
    "To practice pharmacy in New York, a candidate must:",
    o4(
      "Meet Education Law Article 137 requirements including NAPLEX and NY jurisprudence exam",
      "Practice immediately with any out-of-state license",
      "Register only with DEA",
      "Complete technician certification only"
    ),
    "Meet Education Law Article 137 requirements including NAPLEX and NY jurisprudence exam",
    "New York licensure requires board registration and passing the state jurisprudence examination.",
    ["licensure"]
  ),
  ny(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in New York, the pharmacist should:",
    o4(
      "Query the state prescription monitoring program and document review",
      "Skip monitoring for cash-paying patients",
      "Query only for Schedule I substances",
      "Delegate monitoring to delivery staff"
    ),
    "Query the state prescription monitoring program and document review",
    "New York I-STOP and PDMP requirements integrate with pharmacist corresponding responsibility.",
    ["PDMP", "I-STOP"]
  ),
  ny(
    "dispensing-procedures",
    "A New York patient needs an emergency non-controlled maintenance refill. What may the pharmacist do?",
    o4(
      "Dispense a limited supply with documentation and prescriber follow-up",
      "Dispense a one-year supply without prescriber contact",
      "Refuse all emergency refills in every case",
      "Authorize via technician only"
    ),
    "Dispense a limited supply with documentation and prescriber follow-up",
    "New York allows limited emergency refills with pharmacist judgment and documentation.",
    ["emergency-refill"]
  ),
  ny(
    "pharmacy-operations",
    "An out-of-state mail-order pharmacy ships prescriptions into New York. It generally must:",
    o4(
      "Register as a nonresident pharmacy with the New York State Board of Pharmacy",
      "Operate without New York registration",
      "Register only with the wholesaler",
      "Avoid controlled substance shipments entirely"
    ),
    "Register as a nonresident pharmacy with the New York State Board of Pharmacy",
    "Nonresident pharmacies dispensing into New York must meet board registration requirements.",
    ["nonresident"]
  ),
  ny(
    "patient-privacy",
    "A New York patient's employer requests medication records without authorization. What should the pharmacist do?",
    o4(
      "Decline unless a HIPAA permitted exception applies",
      "Provide records because the employer funds insurance",
      "Fax records on company letterhead",
      "Publish a summary for the employer on the patient portal"
    ),
    "Decline unless a HIPAA permitted exception applies",
    "HIPAA generally prohibits employer access without patient authorization or a permitted exception.",
    ["HIPAA"]
  ),
  ny(
    "pharmacy-operations",
    "A New York pharmacist administers vaccines under protocol. What is required?",
    o4(
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
    "A New York pharmacist receives a faxed controlled substance prescription. What must be verified?",
    o4(
      "Prescriber authenticity and compliance with I-STOP e-prescribing rules and exceptions",
      "Patient copay amount only",
      "Technician preference for workflow",
      "Wholesaler delivery schedule"
    ),
    "Prescriber authenticity and compliance with I-STOP e-prescribing rules and exceptions",
    "I-STOP limits non-electronic CS prescribing; pharmacists must verify lawful transmission and prescriber identity.",
    ["I-STOP", "fax"]
  ),
  mpjeKType(
    "Regarding New York I-STOP e-prescribing, which statements are correct?",
    [
      "Controlled substances must generally be electronically prescribed.",
      "Paper prescriptions for controlled substances are always permitted without limitation.",
      "Pharmacists must verify authenticity of electronic orders.",
    ],
    [true, false, true],
    {
      subjectId: "dispensing-procedures",
      stateCode: "NY",
      explanation:
        "I-STOP mandates electronic CS prescribing with narrow exceptions; pharmacists verify lawful electronic prescriptions.",
      tags: [...PE, "new-york", "I-STOP"],
      references: [NY_REF],
    }
  ),
  mpjeSelectAll(
    "Which steps are required after a significant theft of C-II stock at a New York pharmacy? Select all that apply.",
    [
      "File DEA Form 106",
      "Notify law enforcement as required",
      "Reconcile perpetual inventory and investigate root cause",
      "Resume C-II dispensing without documentation to clear backlog",
      "Notify the state board of pharmacy if required",
    ],
    [
      "File DEA Form 106",
      "Notify law enforcement as required",
      "Reconcile perpetual inventory and investigate root cause",
      "Notify the state board of pharmacy if required",
    ],
    {
      subjectId: "controlled-substances",
      stateCode: "NY",
      explanation:
        "Theft response requires DEA Form 106, inventory reconciliation, and cooperation with law enforcement and the board — not undocumented resumption of dispensing.",
      tags: [...PE, "new-york", "theft"],
      references: [NY_REF],
    }
  ),

  // ── Pennsylvania (10) ────────────────────────────────────────────────
  pa(
    "controlled-substances",
    "Before dispensing oxycodone in Pennsylvania, the pharmacist should:",
    o4(
      "Query the Pennsylvania PDMP and document the review",
      "Skip PDMP for patients paying cash",
      "Query PDMP only once per year",
      "Delegate PDMP review without pharmacist oversight"
    ),
    "Query the Pennsylvania PDMP and document the review",
    "Pennsylvania PDMP access is part of corresponding responsibility for controlled substance dispensing.",
    ["PDMP"]
  ),
  pa(
    "dispensing-procedures",
    "Under Pennsylvania rules, when may a pharmacist dispense naloxone without a patient-specific prescription?",
    o4(
      "Under standing order or protocol per state authorization",
      "Only with a hospital discharge summary",
      "Only to licensed physicians",
      "Never in community pharmacy settings"
    ),
    "Under standing order or protocol per state authorization",
    "Pennsylvania expanded naloxone access via standing orders and pharmacist dispensing authority.",
    ["naloxone"]
  ),
  pa(
    "state-practice-act",
    "Pennsylvania pharmacy technicians must:",
    o4(
      "Meet board certification or registration requirements and work under pharmacist supervision",
      "Perform final verification independently",
      "Practice without a pharmacist on duty",
      "Register only with DEA"
    ),
    "Meet board certification or registration requirements and work under pharmacist supervision",
    "Pennsylvania defines technician certification and pharmacist supervision standards.",
    ["technician"]
  ),
  pa(
    "compounding-regulations",
    "A Pennsylvania pharmacy performs sterile compounding. Which standards apply?",
    o4(
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
    "A Pennsylvania pharmacist identifies a critical DUR alert. What is required?",
    o4(
      "Intervene, contact the prescriber if needed, and document",
      "Dispense without review",
      "Delegate to cashiers",
      "Cancel the patient's insurance"
    ),
    "Intervene, contact the prescriber if needed, and document",
    "DUR intervention is enforced by the Pennsylvania State Board of Pharmacy.",
    ["DUR"]
  ),
  pa(
    "pharmacy-operations",
    "A Pennsylvania pharmacist provides immunizations. What is required?",
    o4(
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
    "state-practice-act",
    "What is the Pennsylvania pharmacist-in-charge responsible for?",
    o4(
      "Legal compliance and supervision of pharmacy operations at the licensed site",
      "Wholesale marketing exclusively",
      "Delegating all liability to technicians",
      "IT maintenance only"
    ),
    "Legal compliance and supervision of pharmacy operations at the licensed site",
    "PIC duties include compliance with the Pennsylvania Pharmacy Act and board rules.",
    ["PIC"]
  ),
  pa(
    "pharmacy-ethics",
    "A Pennsylvania pharmacist suspects colleague impairment at work. What should they do?",
    o4(
      "Report to the PIC and board per mandatory reporting duties",
      "Ignore to maintain workplace harmony",
      "Post on social media",
      "Confront patients instead"
    ),
    "Report to the PIC and board per mandatory reporting duties",
    "Impaired practice threatens patients; reporting protects public safety.",
    ["ethics"]
  ),
  mpjeKType(
    "Regarding Pennsylvania naloxone access, which statements are correct?",
    [
      "Pharmacists may dispense naloxone under standing order or protocol in permitted cases.",
      "Naloxone requires a new patient-specific prescription in every community scenario.",
      "Counseling on overdose response is part of responsible naloxone dispensing.",
    ],
    [true, false, true],
    {
      subjectId: "dispensing-procedures",
      stateCode: "PA",
      explanation:
        "Pennsylvania standing orders enable pharmacist naloxone dispensing with appropriate patient counseling on use and emergency response.",
      tags: [...PE, "pennsylvania", "naloxone"],
      references: [PA_REF],
    }
  ),
  mpjeSelectAll(
    "Which records should be available during a Pennsylvania board inspection? Select all that apply.",
    [
      "Prescription files",
      "Perpetual controlled substance inventory",
      "Master formulation records for compounding",
      "Employee credit reports",
      "Policies and procedures",
    ],
    [
      "Prescription files",
      "Perpetual controlled substance inventory",
      "Master formulation records for compounding",
      "Policies and procedures",
    ],
    {
      subjectId: "pharmacy-operations",
      stateCode: "PA",
      explanation:
        "Board inspections cover dispensing records, CS logs, compounding documentation, and policies — not unrelated personal financial records.",
      tags: [...PE, "pennsylvania", "inspection"],
      references: [PA_REF],
    }
  ),

  // ── Ohio (10) ────────────────────────────────────────────────────────
  oh(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in Ohio, the pharmacist should:",
    o4(
      "Query OARRS and document the review per board rules",
      "Skip OARRS for walk-in patients",
      "Query only for Schedule I drugs",
      "Delegate OARRS access to technicians without oversight"
    ),
    "Query OARRS and document the review per board rules",
    "Ohio requires prescription monitoring review as part of controlled substance dispensing responsibility.",
    ["PDMP", "OARRS"]
  ),
  oh(
    "state-practice-act",
    "An out-of-state pharmacist wants to practice in Ohio. They must:",
    o4(
      "Obtain an Ohio pharmacist license from the State Board of Pharmacy",
      "Practice immediately with any active license",
      "Register only with DEA",
      "Complete technician training only"
    ),
    "Obtain an Ohio pharmacist license from the State Board of Pharmacy",
    "Ohio requires board licensure; endorsement follows established reciprocity procedures.",
    ["licensure"]
  ),
  oh(
    "dispensing-procedures",
    "An Ohio pharmacist receives an emergency oral non-controlled prescription. What is required?",
    o4(
      "Document required elements and obtain written or electronic follow-up within permitted time",
      "Refuse all oral orders",
      "Dispense a one-year supply without records",
      "Allow technicians to accept orders without documentation"
    ),
    "Document required elements and obtain written or electronic follow-up within permitted time",
    "Emergency oral prescriptions are permitted with strict documentation and quantity limits under Ohio rules.",
    ["emergency", "oral-rx"]
  ),
  oh(
    "pharmacy-operations",
    "During an Ohio board inspection, which records may be reviewed?",
    o4(
      "Prescription files, CS logs, policies, and compounding documentation",
      "Employee social media accounts only",
      "Unrelated personal investments",
      "Patient entertainment preferences"
    ),
    "Prescription files, CS logs, policies, and compounding documentation",
    "Board inspections verify record retention, CS accountability, and operational compliance.",
    ["inspection"]
  ),
  oh(
    "dispensing-procedures",
    "When counseling an Ohio patient on a new high-risk medication, the pharmacist should:",
    o4(
      "Offer counseling and document refusal if the patient declines",
      "Skip counseling for all prescriptions",
      "Counsel only when the physician requests it",
      "Provide counseling only by mail weeks later"
    ),
    "Offer counseling and document refusal if the patient declines",
    "Patient counseling is a core pharmacist duty in Ohio; document when patients decline.",
    ["counseling"]
  ),
  oh(
    "compounding-regulations",
    "An Ohio pharmacy compounds non-sterile preparations. Which standard applies?",
    o4(
      "USP <795> and Ohio board compounding rules",
      "No documentation for batches under five units",
      "Only FDA OTC rules",
      "Hospital-only standards in all settings"
    ),
    "USP <795> and Ohio board compounding rules",
    "Non-sterile compounding requires USP <795> compliance under Ohio board expectations.",
    ["compounding", "USP-795"]
  ),
  oh(
    "pharmacy-operations",
    "An Ohio pharmacist administers immunizations under protocol. What is required?",
    o4(
      "Board-approved immunization training and valid protocol",
      "No training for five-year veterans",
      "Technician-only vaccine administration",
      "Hospital-only sites"
    ),
    "Board-approved immunization training and valid protocol",
    "Ohio pharmacist immunization authority requires training and protocol compliance.",
    ["immunization"]
  ),
  oh(
    "pharmacy-ethics",
    "An Ohio pharmacist suspects controlled substance diversion by a colleague. What should they do?",
    o4(
      "Report to the PIC and appropriate board and law enforcement channels",
      "Ignore the suspicion",
      "Announce it in the waiting room",
      "Post online anonymously"
    ),
    "Report to the PIC and appropriate board and law enforcement channels",
    "Diversion threatens patient safety; pharmacists must report suspected theft per board and DEA expectations.",
    ["diversion", "ethics"]
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
  mpjeSelectAll(
    "Which actions reflect Ohio corresponding responsibility for controlled substances? Select all that apply.",
    [
      "Query OARRS when required before dispensing",
      "Evaluate legitimacy of the prescription",
      "Dispense every early opioid refill without review",
      "Document interventions in the pharmacy record",
      "Refuse to fill when no valid medical purpose exists",
    ],
    [
      "Query OARRS when required before dispensing",
      "Evaluate legitimacy of the prescription",
      "Document interventions in the pharmacy record",
      "Refuse to fill when no valid medical purpose exists",
    ],
    {
      subjectId: "controlled-substances",
      stateCode: "OH",
      explanation:
        "Corresponding responsibility requires PDMP review, clinical evaluation, documentation, and appropriate refusal — not automatic dispensing of suspicious opioids.",
      tags: [...PE, "ohio", "corresponding-responsibility"],
      references: [OH_REF],
    }
  ),

  // ── Oklahoma supplements (4) ───────────────────────────────────────────
  ok(
    "controlled-substances",
    "An Oklahoma pharmacist reviews a C-II prescription dated 22 days ago that was never dispensed. What should the pharmacist do?",
    o4(
      "Refuse to dispense because the prescription is outside the federal 21-day dispensing window",
      "Dispense the full quantity because the patient is in pain",
      "Partially fill now to extend validity another 21 days",
      "Accept a verbal extension from the patient's family member"
    ),
    "Refuse to dispense because the prescription is outside the federal 21-day dispensing window",
    "Federal law limits initial dispensing of written C-II prescriptions to within 21 days of the date written unless limited exceptions apply.",
    ["C-II", "validity"],
    "A 58-year-old post-surgical patient in Tulsa presents an oxycodone prescription written 22 days ago with no prior fills."
  ),
  ok(
    "dispensing-procedures",
    "An Oklahoma patient requests transfer of all prescriptions to another in-state pharmacy. The pharmacist should:",
    o4(
      "Document the transfer per board rules and note controlled substance transfer limits",
      "Transfer all C-II prescriptions between pharmacies routinely",
      "Transfer verbally without records",
      "Refuse all transfers for convenience"
    ),
    "Document the transfer per board rules and note controlled substance transfer limits",
    "Non-controlled transfers require documentation; C-II transfers are federally prohibited between pharmacies.",
    ["transfer"],
    "A 68-year-old patient moving from Norman to Lawton asks to move every active medication to a new pharmacy."
  ),
  mpjeSelectAll(
    "Which immunization requirements apply to Oklahoma pharmacists? Select all that apply.",
    [
      "Board-approved training before vaccine administration",
      "Standing protocol or prescriber authorization",
      "Technician-only influenza administration without pharmacist oversight",
      "Documentation in the patient immunization record",
      "Reporting per state immunization registry rules when applicable",
    ],
    [
      "Board-approved training before vaccine administration",
      "Standing protocol or prescriber authorization",
      "Documentation in the patient immunization record",
      "Reporting per state immunization registry rules when applicable",
    ],
    {
      subjectId: "pharmacy-operations",
      stateCode: "OK",
      explanation:
        "Oklahoma pharmacist immunizations require training, protocol, documentation, and registry reporting when applicable — not unsupervised technician administration.",
      tags: [...PE, "oklahoma", "immunization"],
      references: [OK_REF],
    }
  ),
  mpjeKType(
    "Regarding Oklahoma PIC responsibilities, which statements are correct?",
    [
      "The PIC is accountable for legal compliance at the licensed pharmacy.",
      "The PIC may delegate all statutory liability to technicians.",
      "The PIC ensures technician supervision ratios and training are followed.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "OK",
      explanation:
        "Oklahoma PICs retain non-delegable compliance duties and must enforce technician supervision standards.",
      tags: [...PE, "oklahoma", "PIC"],
      references: [OK_REF],
    }
  ),
];

/** All substantive state seeds (batch 01 + batch 02). */
export const MPJE_ALL_STATE_SUBSTANTIVE_SEEDS: BankItem[] = [
  ...MPJE_STATE_SUBSTANTIVE_SEEDS,
  ...MPJE_STATE_SUBSTANTIVE_SEEDS_BATCH_02,
];

export function substantiveStateSeedCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of MPJE_ALL_STATE_SUBSTANTIVE_SEEDS) {
    const code = item.stateCode ?? "FED";
    counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}
