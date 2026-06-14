/**
 * Batch 02 — IL, NJ, GA substantive banks + depth boost for TX/FL/NY/PA/OH.
 */
import type { BankItem } from "@/lib/question-bank";
import { mpjeKType, mpjeMcq, mpjeSelectAll } from "./seed-helpers";

const PE = ["physician-educator", "curated", "state-substantive", "high-yield", "batch-02"] as const;

const IL_REF = { label: "Illinois Pharmacy Practice Act", citation: "225 ILCS 85; IDFPR rules" };
const NJ_REF = { label: "New Jersey Pharmacy Practice Act", citation: "N.J.S.A. 45:14-23 et seq." };
const GA_REF = { label: "Georgia Pharmacy Practice Act", citation: "O.C.G.A. § 26-4-1; Ga. BOP rules" };
const TX_REF = { label: "Texas Pharmacy Act / TSBP", citation: "Tex. Occ. Code Ch. 562; 22 TAC §291" };
const FL_REF = { label: "Florida Pharmacy Act", citation: "Fla. Stat. Ch. 465; FAC 64B16" };
const NY_REF = { label: "NY Education Law Art. 137", citation: "NY Educ. Law § 6800; PHL § 334-I" };
const PA_REF = { label: "Pennsylvania Pharmacy Act", citation: "63 P.S. § 390-8; PA PDMP Act" };
const OH_REF = { label: "Ohio Pharmacy Practice Act", citation: "ORC Ch. 4729; OARRS" };

const o4 = (a: string, b: string, c: string, d: string) => [a, b, c, d];

type B = (
  subjectId: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  tags: string[],
  scenario?: string
) => BankItem;

function mk(stateCode: string, ref: { label: string; citation: string }, tag: string): B {
  return (subjectId, stem, options, correct, explanation, tags, scenario) =>
    mpjeMcq(stem, options, correct, {
      subjectId,
      stateCode,
      explanation,
      tags: [...PE, tag, ...tags],
      references: [ref],
    }, scenario);
}

const il = mk("IL", IL_REF, "illinois");
const nj = mk("NJ", NJ_REF, "new-jersey");
const ga = mk("GA", GA_REF, "georgia");
const tx = mk("TX", TX_REF, "texas");
const fl = mk("FL", FL_REF, "florida");
const ny = mk("NY", NY_REF, "new-york");
const pa = mk("PA", PA_REF, "pennsylvania");
const oh = mk("OH", OH_REF, "ohio");

export const MPJE_STATE_SUBSTANTIVE_SEEDS_BATCH_02: BankItem[] = [
  // ── Illinois (10) ──────────────────────────────────────────────────────
  il(
    "controlled-substances",
    "Before dispensing tramadol in Illinois, what must the pharmacist do?",
    o4(
      "Query the Illinois PDMP (PMP) and document review when required",
      "Skip PDMP for patients with commercial insurance",
      "Query PDMP only for Schedule I drugs",
      "Delegate PDMP review to technicians without oversight"
    ),
    "Query the Illinois PDMP (PMP) and document review when required",
    "Illinois controlled substance dispensing integrates PMP query and documentation into corresponding responsibility under the Pharmacy Practice Act.",
    ["PDMP"],
    "A 52-year-old patient in Chicago presents a tramadol prescription with multiple recent opioid fills visible on the Illinois PMP."
  ),
  il(
    "state-practice-act",
    "What is the Illinois pharmacist-in-charge (PIC) primarily responsible for?",
    o4(
      "Legal compliance and supervision of pharmacy operations at the licensed site",
      "Social media marketing exclusively",
      "Delegating all statutory liability to technicians",
      "Wholesale purchasing without dispensing oversight"
    ),
    "Legal compliance and supervision of pharmacy operations at the licensed site",
    "The Illinois PIC retains non-delegable responsibility for board compliance and safe pharmacy operations.",
    ["PIC"]
  ),
  il(
    "dispensing-procedures",
    "An Illinois patient needs an emergency maintenance refill when the prescriber is unreachable. What may the pharmacist do?",
    o4(
      "Dispense a limited supply with documentation and prescriber follow-up per IDFPR rules",
      "Dispense a 90-day supply without records",
      "Refuse all emergency supplies regardless of circumstance",
      "Authorize emergency refills via cashier staff"
    ),
    "Dispense a limited supply with documentation and prescriber follow-up per IDFPR rules",
    "Illinois permits limited emergency dispensing with pharmacist judgment, documentation, and timely prescriber authorization.",
    ["emergency-refill"]
  ),
  il(
    "pharmacy-operations",
    "An Illinois pharmacist will administer influenza vaccine under protocol. What is required?",
    o4(
      "Board-approved immunization training and a valid protocol or prescriber authorization",
      "No training for pharmacists with ten years' experience",
      "Technician-only vaccine administration",
      "Hospital employment as a prerequisite"
    ),
    "Board-approved immunization training and a valid protocol or prescriber authorization",
    "Illinois pharmacist immunization authority requires training and protocol compliance per IDFPR rules.",
    ["immunization"]
  ),
  il(
    "patient-privacy",
    "An Illinois patient's attorney requests Rx records with a signed HIPAA authorization. The pharmacist should:",
    o4(
      "Verify the authorization and disclose only the minimum necessary information",
      "Provide the patient's entire medical record from all providers",
      "Deny all attorney requests categorically",
      "Post records on the pharmacy website"
    ),
    "Verify the authorization and disclose only the minimum necessary information",
    "HIPAA permits disclosure with valid authorization using the minimum necessary standard.",
    ["HIPAA", "privacy"]
  ),
  il(
    "dispensing-procedures",
    "During DUR, an Illinois pharmacist identifies a serious drug–drug interaction. What is required?",
    o4(
      "Intervene, contact the prescriber if needed, and document before dispensing",
      "Dispense without pharmacist review",
      "Delegate to front-end staff",
      "Destroy the prescription"
    ),
    "Intervene, contact the prescriber if needed, and document before dispensing",
    "DUR intervention is a core dispensing duty enforced by the Illinois Department of Financial and Professional Regulation.",
    ["DUR"]
  ),
  il(
    "compounding-regulations",
    "An Illinois pharmacy performs non-sterile compounding. Which standard applies?",
    o4(
      "USP <795> and Illinois board compounding rules",
      "No documentation for batches under five units",
      "Only OTC labeling rules",
      "Technician-only batch release"
    ),
    "USP <795> and Illinois board compounding rules",
    "Non-sterile compounding must follow USP <795> incorporated into Illinois board expectations.",
    ["compounding", "USP-795"]
  ),
  mpjeSelectAll(
    "Which records should an Illinois pharmacy make available during an IDFPR inspection? Select all that apply.",
    [
      "Prescription files and refill documentation",
      "Controlled substance perpetual inventory",
      "Written policies and procedures",
      "Employee personal credit histories",
      "Compounding logs when applicable",
    ],
    [
      "Prescription files and refill documentation",
      "Controlled substance perpetual inventory",
      "Written policies and procedures",
      "Compounding logs when applicable",
    ],
    {
      subjectId: "pharmacy-operations",
      stateCode: "IL",
      explanation:
        "Board inspections review dispensing records, CS accountability, policies, and compounding documentation.",
      tags: [...PE, "illinois", "inspection"],
      references: [IL_REF],
    }
  ),
  mpjeKType(
    "Regarding Illinois pharmacy technician scope, which statements are correct?",
    [
      "Technicians perform supportive tasks under pharmacist supervision within board-defined scope.",
      "Technicians may independently perform final clinical verification.",
      "The PIC ensures technician training requirements are met.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "IL",
      explanation:
        "Illinois technicians work within board-defined scope; pharmacists retain verification and clinical judgment.",
      tags: [...PE, "illinois", "technician"],
      references: [IL_REF],
    }
  ),
  il(
    "pharmacy-ethics",
    "An Illinois pharmacist suspects diversion of alprazolam by a coworker. What is the most appropriate action?",
    o4(
      "Notify the PIC and follow board and DEA reporting requirements",
      "Ignore the concern to avoid conflict",
      "Post allegations on social media",
      "Discuss only with patients in the waiting room"
    ),
    "Notify the PIC and follow board and DEA reporting requirements",
    "Suspected diversion requires internal escalation and external reporting under Illinois and federal rules.",
    ["diversion", "ethics"]
  ),

  // ── New Jersey (10) ────────────────────────────────────────────────────
  nj(
    "controlled-substances",
    "Before dispensing oxycodone in New Jersey, the pharmacist should:",
    o4(
      "Query NJPMP and document the review per board rules",
      "Skip monitoring for cash-paying patients",
      "Query PDMP only once per calendar year",
      "Delegate PDMP review without pharmacist oversight"
    ),
    "Query NJPMP and document the review per board rules",
    "New Jersey PDMP (NJPMP) access is part of corresponding responsibility for controlled substance dispensing.",
    ["PDMP", "NJPMP"]
  ),
  nj(
    "state-practice-act",
    "To practice pharmacy in New Jersey, a pharmacist must:",
    o4(
      "Hold an active New Jersey pharmacist license from the Board of Pharmacy",
      "Practice immediately with any out-of-state license",
      "Register only with DEA",
      "Complete technician certification only"
    ),
    "Hold an active New Jersey pharmacist license from the Board of Pharmacy",
    "New Jersey requires board licensure after NAPLEX and New Jersey jurisprudence examination.",
    ["licensure"]
  ),
  nj(
    "dispensing-procedures",
    "A New Jersey patient needs an emergency non-controlled maintenance refill. What may the pharmacist do?",
    o4(
      "Dispense a limited supply with documentation and prescriber follow-up",
      "Dispense a one-year supply without prescriber contact",
      "Refuse all emergency refills in every case",
      "Authorize via technician only"
    ),
    "Dispense a limited supply with documentation and prescriber follow-up",
    "New Jersey allows limited emergency refills with pharmacist judgment and documentation.",
    ["emergency-refill"]
  ),
  nj(
    "pharmacy-operations",
    "A New Jersey pharmacist administers vaccines under protocol. What is required?",
    o4(
      "Board-approved training and compliant protocol or prescriber authorization",
      "No training for experienced pharmacists",
      "Technician-only administration",
      "Hospital employment only"
    ),
    "Board-approved training and compliant protocol or prescriber authorization",
    "New Jersey pharmacist immunization authority requires training and protocol compliance.",
    ["immunization"]
  ),
  nj(
    "compounding-regulations",
    "A New Jersey pharmacy performs sterile compounding. Which requirements apply?",
    o4(
      "USP <797>, New Jersey sterile compounding rules, and applicable permits",
      "No records for batches under three units",
      "Only federal OTC labeling",
      "Technician-only sterile batch release"
    ),
    "USP <797>, New Jersey sterile compounding rules, and applicable permits",
    "New Jersey regulates sterile compounding with USP <797> and board licensing expectations.",
    ["compounding", "USP-797"]
  ),
  nj(
    "patient-privacy",
    "A New Jersey law enforcement officer requests Rx records without warrant or patient authorization. What should the pharmacist do?",
    o4(
      "Disclose only if a HIPAA or New Jersey permitted exception applies",
      "Provide all records immediately",
      "Publish records on the pharmacy website",
      "Ask waiting-room patients to verify identity"
    ),
    "Disclose only if a HIPAA or New Jersey permitted exception applies",
    "HIPAA limits law enforcement disclosures; New Jersey privacy rules may add requirements.",
    ["HIPAA", "privacy"]
  ),
  nj(
    "dispensing-procedures",
    "When transferring non-controlled prescriptions from a New Jersey pharmacy, the pharmacist must:",
    o4(
      "Document the transfer and maintain retrievable records per board rules",
      "Transfer verbally without documentation",
      "Transfer Schedule II prescriptions between pharmacies routinely",
      "Share records publicly for efficiency"
    ),
    "Document the transfer and maintain retrievable records per board rules",
    "Prescription transfers require documentation; federal law prohibits C-II transfers between pharmacies.",
    ["transfer"]
  ),
  mpjeSelectAll(
    "Which actions reflect New Jersey corresponding responsibility for opioids? Select all that apply.",
    [
      "Query NJPMP before dispensing when required",
      "Evaluate prescription validity and patient safety",
      "Dispense suspicious early refills without review",
      "Document pharmacist interventions",
      "Refuse to fill when no legitimate medical purpose exists",
    ],
    [
      "Query NJPMP before dispensing when required",
      "Evaluate prescription validity and patient safety",
      "Document pharmacist interventions",
      "Refuse to fill when no legitimate medical purpose exists",
    ],
    {
      subjectId: "controlled-substances",
      stateCode: "NJ",
      explanation:
        "Corresponding responsibility requires PDMP review, clinical evaluation, documentation, and appropriate refusal.",
      tags: [...PE, "new-jersey", "corresponding-responsibility"],
      references: [NJ_REF],
    }
  ),
  mpjeKType(
    "Regarding New Jersey pharmacy establishment licensure, which statements are correct?",
    [
      "A pharmacy must hold a valid New Jersey license to operate at a fixed location.",
      "DEA registration alone satisfies New Jersey board licensure.",
      "The PIC is accountable for operations at the licensed site.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "NJ",
      explanation:
        "New Jersey requires board pharmacy licensure and PIC accountability; DEA registration does not replace state licensure.",
      tags: [...PE, "new-jersey", "permit"],
      references: [NJ_REF],
    }
  ),
  nj(
    "pharmacy-ethics",
    "A New Jersey pharmacist believes a colleague is impaired on duty. What should they do?",
    o4(
      "Report to the PIC and board per mandatory reporting and patient safety duties",
      "Ignore to maintain harmony",
      "Post on social media",
      "Confront patients instead"
    ),
    "Report to the PIC and board per mandatory reporting and patient safety duties",
    "Impaired practice threatens patients; New Jersey reporting pathways protect public safety.",
    ["ethics"]
  ),

  // ── Georgia (10) ───────────────────────────────────────────────────────
  ga(
    "controlled-substances",
    "Before dispensing a Schedule II opioid in Georgia, the pharmacist should:",
    o4(
      "Query the Georgia PDMP (GRx) and document the review",
      "Skip GRx for established patients",
      "Query only for Schedule I substances",
      "Delegate monitoring to delivery staff"
    ),
    "Query the Georgia PDMP (GRx) and document the review",
    "Georgia prescription monitoring integrates with pharmacist corresponding responsibility for controlled substances.",
    ["PDMP", "GRx"]
  ),
  ga(
    "state-practice-act",
    "An out-of-state pharmacist wants to practice in Georgia. They must:",
    o4(
      "Obtain a Georgia pharmacist license from the Georgia Board of Pharmacy",
      "Practice immediately with any active license",
      "Register only with DEA",
      "Complete technician training only"
    ),
    "Obtain a Georgia pharmacist license from the Georgia Board of Pharmacy",
    "Georgia requires board licensure; endorsement follows established reciprocity procedures.",
    ["licensure"]
  ),
  ga(
    "dispensing-procedures",
    "A Georgia patient needs an emergency oral non-controlled prescription after hours. What is required?",
    o4(
      "Document required elements and obtain written or electronic follow-up within permitted time",
      "Refuse all oral orders",
      "Dispense a one-year supply without records",
      "Allow technicians to accept orders without documentation"
    ),
    "Document required elements and obtain written or electronic follow-up within permitted time",
    "Emergency oral prescriptions are permitted with strict documentation and quantity limits under Georgia rules.",
    ["emergency", "oral-rx"]
  ),
  ga(
    "pharmacy-operations",
    "A Georgia pharmacist provides immunizations under protocol. What is required?",
    o4(
      "Board-approved training and valid immunization protocol",
      "No training for influenza vaccines",
      "Technician-only administration",
      "Hospital-only practice sites"
    ),
    "Board-approved training and valid immunization protocol",
    "Georgia pharmacist immunization authority requires training and protocol compliance.",
    ["immunization"]
  ),
  ga(
    "dispensing-procedures",
    "When counseling a Georgia patient on a new high-risk medication, the pharmacist should:",
    o4(
      "Offer counseling and document refusal if the patient declines",
      "Skip counseling for all refills and new prescriptions",
      "Counsel only when the physician requests it",
      "Provide counseling only by mail weeks later"
    ),
    "Offer counseling and document refusal if the patient declines",
    "Patient counseling is a core pharmacist duty in Georgia; document when patients decline.",
    ["counseling"]
  ),
  ga(
    "compounding-regulations",
    "A Georgia pharmacy compounds non-sterile preparations. Which standard applies?",
    o4(
      "USP <795> and Georgia board compounding rules",
      "No documentation for batches under five units",
      "Only FDA OTC rules",
      "Hospital-only standards in all settings"
    ),
    "USP <795> and Georgia board compounding rules",
    "Non-sterile compounding requires USP <795> compliance under Georgia board expectations.",
    ["compounding", "USP-795"]
  ),
  ga(
    "pharmacy-operations",
    "During a Georgia Board of Pharmacy inspection, which records may be reviewed?",
    o4(
      "Prescription files, CS logs, policies, and compounding documentation",
      "Employee social media only",
      "Unrelated financial investments",
      "Patient entertainment preferences"
    ),
    "Prescription files, CS logs, policies, and compounding documentation",
    "Board inspections verify record retention, CS accountability, and operational compliance.",
    ["inspection"]
  ),
  mpjeSelectAll(
    "Which steps are required after significant theft of C-II stock at a Georgia pharmacy? Select all that apply.",
    [
      "File DEA Form 106",
      "Notify law enforcement as required",
      "Reconcile perpetual inventory and investigate root cause",
      "Resume C-II dispensing without documentation",
      "Notify the Georgia board if required",
    ],
    [
      "File DEA Form 106",
      "Notify law enforcement as required",
      "Reconcile perpetual inventory and investigate root cause",
      "Notify the Georgia board if required",
    ],
    {
      subjectId: "controlled-substances",
      stateCode: "GA",
      explanation:
        "Theft response requires DEA notification, inventory reconciliation, and cooperation with law enforcement and the board.",
      tags: [...PE, "georgia", "theft"],
      references: [GA_REF],
    }
  ),
  mpjeKType(
    "Regarding Georgia pharmacy technician scope, which statements are correct?",
    [
      "Technicians perform supportive tasks under pharmacist supervision within board-defined scope.",
      "Technicians may independently perform final clinical verification.",
      "The PIC ensures technician training requirements are met.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "GA",
      explanation:
        "Georgia technicians work within board-defined scope; pharmacists retain verification and clinical judgment.",
      tags: [...PE, "georgia", "technician"],
      references: [GA_REF],
    }
  ),
  ga(
    "pharmacy-ethics",
    "A Georgia pharmacist suspects controlled substance diversion. What should they do?",
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

  // ── Depth boost: Texas (+5) ──────────────────────────────────────────
  tx(
    "patient-privacy",
    "A Texas patient's spouse requests all medication records without patient authorization. What should the pharmacist do?",
    o4(
      "Decline unless the patient authorizes disclosure or a permitted exception applies",
      "Provide records because they are married",
      "Fax records to any family member who asks",
      "Publish a summary on the patient portal for the spouse"
    ),
    "Decline unless the patient authorizes disclosure or a permitted exception applies",
    "HIPAA treats spouses like other third parties absent patient authorization or a permitted exception.",
    ["HIPAA"],
    "A patient's husband visits a Plano pharmacy requesting a complete medication profile while the patient is hospitalized."
  ),
  tx(
    "controlled-substances",
    "A Texas pharmacy receives a partial fill request for oxycodone for a terminally ill hospice patient with prescriber notation. What should the pharmacist verify?",
    o4(
      "Federal partial-fill hospice rules and Texas documentation requirements are met",
      "Partial fills of C-II are never permitted in any context",
      "Technicians may authorize partial fills independently",
      "A one-year supply may be dispensed without notation"
    ),
    "Federal partial-fill hospice rules and Texas documentation requirements are met",
    "Limited C-II partial-fill exceptions exist for LTC/hospice with prescriber notation; pharmacists must verify federal and state documentation.",
    ["C-II", "partial-fill", "hospice"]
  ),
  tx(
    "pharmacy-operations",
    "A Texas pharmacy closes permanently. The PIC must ensure:",
    o4(
      "Prescription records and controlled substance inventories are secured and transferred or retained per board rules",
      "All records may be discarded immediately",
      "CS inventory may be abandoned without DEA notice",
      "Only social media notice is required"
    ),
    "Prescription records and controlled substance inventories are secured and transferred or retained per board rules",
    "Pharmacy closure requires proper record retention, CS reconciliation, and board/DEA compliance.",
    ["closure", "records"]
  ),
  mpjeKType(
    "Regarding Texas prescription monitoring for benzodiazepines, which statements are correct?",
    [
      "Pharmacists should query the Texas PMP as part of corresponding responsibility when dispensing monitored drugs.",
      "PMP query is optional for all Schedule II drugs only.",
      "Documentation of PMP review supports clinical decision-making.",
    ],
    [true, false, true],
    {
      subjectId: "controlled-substances",
      stateCode: "TX",
      explanation:
        "Texas PMP integration applies to controlled substance dispensing beyond Schedule II alone; documentation is expected.",
      tags: [...PE, "texas", "PDMP"],
      references: [TX_REF],
    }
  ),
  tx(
    "dispensing-procedures",
    "A Texas pharmacist receives a telepharmacy prescription for a remote site. What is required?",
    o4(
      "Compliance with Texas telepharmacy rules including pharmacist oversight and verification standards",
      "Technician-only verification at the remote site without pharmacist involvement",
      "No documentation if the prescriber is local",
      "Telepharmacy is prohibited in all Texas settings"
    ),
    "Compliance with Texas telepharmacy rules including pharmacist oversight and verification standards",
    "Texas telepharmacy operates under board rules requiring pharmacist accountability and documented procedures.",
    ["telepharmacy"]
  ),

  // ── Depth boost: Florida (+5) ──────────────────────────────────────────
  fl(
    "dispensing-procedures",
    "A Florida pharmacist receives a prescription for a compounded pediatric suspension. What is required?",
    o4(
      "Verify compounding license scope, labeling, and beyond-use dating per Florida and USP standards",
      "Dispense without BUD assignment",
      "Use technician-only batch release",
      "Skip prescriber contact for all compounds"
    ),
    "Verify compounding license scope, labeling, and beyond-use dating per Florida and USP standards",
    "Pediatric compounding requires USP standards, proper labeling, and BUD documentation under Florida rules.",
    ["compounding", "pediatric"]
  ),
  fl(
    "state-practice-act",
    "A relief pharmacist works in a Florida pharmacy without being the PIC. Who retains legal responsibility?",
    o4(
      "The PIC remains responsible for overall compliance; the relief pharmacist is responsible for their dispensing decisions",
      "The relief pharmacist assumes all PIC statutory duties permanently",
      "No pharmacist is responsible when the PIC is off site",
      "Technicians assume PIC duties automatically"
    ),
    "The PIC remains responsible for overall compliance; the relief pharmacist is responsible for their dispensing decisions",
    "PIC site accountability continues; each pharmacist remains responsible for professional acts performed.",
    ["PIC", "relief"]
  ),
  fl(
    "controlled-substances",
    "A Florida patient presents multiple early benzodiazepine refills from different prescribers. What should the pharmacist do?",
    o4(
      "Query E-FORCSE, evaluate red flags, and refuse or clarify if no legitimate medical purpose exists",
      "Dispense all prescriptions without review",
      "Report every early refill to DEA within 24 hours automatically",
      "Delegate the decision to cashiers"
    ),
    "Query E-FORCSE, evaluate red flags, and refuse or clarify if no legitimate medical purpose exists",
    "Corresponding responsibility requires PDMP review and clinical judgment before dispensing suspicious benzodiazepine patterns.",
    ["red-flags", "benzodiazepine"],
    "A 34-year-old patient in Miami presents three alprazolam prescriptions from different clinics within two weeks."
  ),
  mpjeSelectAll(
    "Which Florida pharmacist duties apply when dispensing a new warfarin prescription? Select all that apply.",
    [
      "Perform drug utilization review for interactions",
      "Offer patient counseling on bleeding precautions",
      "Dispense without reviewing INR history when available",
      "Document patient refusal of counseling if declined",
      "Contact prescriber when a critical interaction is identified",
    ],
    [
      "Perform drug utilization review for interactions",
      "Offer patient counseling on bleeding precautions",
      "Document patient refusal of counseling if declined",
      "Contact prescriber when a critical interaction is identified",
    ],
    {
      subjectId: "dispensing-procedures",
      stateCode: "FL",
      explanation:
        "High-risk anticoagulant dispensing requires DUR, counseling offer with documented refusal, and prescriber contact when critical interactions exist.",
      tags: [...PE, "florida", "DUR", "counseling"],
      references: [FL_REF],
    }
  ),
  fl(
    "pharmacy-operations",
    "A Florida pharmacy ships prescriptions to patients statewide from a central fill site. The pharmacy must:",
    o4(
      "Comply with Florida central fill and delivery rules including pharmacist verification and record requirements",
      "Ship without any pharmacist verification",
      "Avoid all controlled substance shipments",
      "Use technician-only verification for all deliveries"
    ),
    "Comply with Florida central fill and delivery rules including pharmacist verification and record requirements",
    "Central fill and mail/delivery operations must meet Florida board verification and documentation standards.",
    ["central-fill"]
  ),

  // ── Depth boost: New York (+5) ───────────────────────────────────────
  ny(
    "controlled-substances",
    "A New York pharmacist receives an e-prescription for buprenorphine with visible suspicious dosing. What is the best action?",
    o4(
      "Verify prescriber DEA/X-waiver authority, query PDMP, and clarify before dispensing",
      "Dispense immediately because e-prescribing guarantees validity",
      "Refuse all buprenorphine regardless of prescriber",
      "Delegate verification to technicians"
    ),
    "Verify prescriber DEA/X-waiver authority, query PDMP, and clarify before dispensing",
    "MAT prescribing has federal and state requirements; pharmacists must verify prescriber authority and clinical appropriateness.",
    ["MAT", "buprenorphine"],
    "An Albany pharmacy receives an electronic buprenorphine order with unusually high daily quantity."
  ),
  ny(
    "pharmacy-operations",
    "A New York pharmacy employs pharmacy interns. Which statement is correct?",
    o4(
      "Interns work under pharmacist supervision within board-defined scope and training requirements",
      "Interns may independently verify all prescriptions without pharmacist presence",
      "Interns replace PIC duties on weekends",
      "Interns require no supervision if enrolled in pharmacy school"
    ),
    "Interns work under pharmacist supervision within board-defined scope and training requirements",
    "New York intern practice is limited and supervised; pharmacists retain accountability for dispensing.",
    ["intern"]
  ),
  ny(
    "dispensing-procedures",
    "A New York patient requests brand–generic substitution for a narrow therapeutic index drug. The pharmacist should:",
    o4(
      "Follow New York substitution rules and prescriber DAW instructions after appropriate counseling",
      "Substitute without prescriber or patient communication in all cases",
      "Refuse all generic substitution categorically",
      "Allow technicians to decide substitution independently"
    ),
    "Follow New York substitution rules and prescriber DAW instructions after appropriate counseling",
    "Generic substitution in New York follows prescriber DAW codes and pharmacist professional judgment for NTI agents.",
    ["substitution", "DAW"]
  ),
  mpjeKType(
    "Regarding New York nonresident pharmacy registration, which statements are correct?",
    [
      "Out-of-state pharmacies shipping into New York generally must register with the state board.",
      "Internet pharmacies need no New York license if headquartered elsewhere.",
      "Registered nonresident pharmacies must comply with New York dispensing and record rules.",
    ],
    [true, false, true],
    {
      subjectId: "pharmacy-operations",
      stateCode: "NY",
      explanation:
        "New York requires nonresident pharmacy registration for dispensing into the state; remote location does not exempt board oversight.",
      tags: [...PE, "new-york", "nonresident"],
      references: [NY_REF],
    }
  ),
  ny(
    "patient-privacy",
    "A New York minor's parent requests medication records for an adolescent patient. The pharmacist should:",
    o4(
      "Apply HIPAA minor-consent and state privacy rules before disclosing",
      "Provide all records to any parent without review",
      "Deny all parental requests categorically",
      "Post records on social media for family convenience"
    ),
    "Apply HIPAA minor-consent and state privacy rules before disclosing",
    "Adolescent privacy may limit parental access when minors lawfully consent to care; pharmacists must follow HIPAA and state rules.",
    ["HIPAA", "minor"]
  ),

  // ── Depth boost: Pennsylvania (+5) ───────────────────────────────────
  pa(
    "dispensing-procedures",
    "A Pennsylvania pharmacist receives a prescription for a Schedule II stimulant with dates suggesting forgery. What is the best action?",
    o4(
      "Verify prescriber identity, query PDMP, and refuse or clarify if forgery is suspected",
      "Dispense quickly to avoid patient confrontation",
      "Accept any prescription with a signature",
      "Delegate forgery checks to technicians"
    ),
    "Verify prescriber identity, query PDMP, and refuse or clarify if forgery is suspected",
    "Forgery suspicion triggers prescriber verification, PDMP review, and refusal when validity cannot be established.",
    ["forgery", "red-flags"],
    "A Philadelphia pharmacy receives an Adderall prescription with inconsistent prescriber phone numbers and altered dates."
  ),
  pa(
    "pharmacy-operations",
    "A Pennsylvania pharmacy participates in a vaccine clinic off-site. Required elements include:",
    o4(
      "Board-compliant protocol, trained pharmacist, and documentation/reporting per immunization rules",
      "No documentation for off-site influenza vaccines",
      "Technician-only administration without pharmacist presence",
      "No protocol if the clinic is one day only"
    ),
    "Board-compliant protocol, trained pharmacist, and documentation/reporting per immunization rules",
    "Off-site immunization clinics require the same training, protocol, and documentation standards as in-pharmacy administration.",
    ["immunization", "clinic"]
  ),
  pa(
    "compounding-regulations",
    "A Pennsylvania pharmacy prepares hormone capsules for office use. The pharmacist must:",
    o4(
      "Follow USP <795>, assign BUD, and maintain master formulation and compounding records",
      "Compound without BUD for office-use batches",
      "Skip prescriber office-use documentation",
      "Release batches without pharmacist review"
    ),
    "Follow USP <795>, assign BUD, and maintain master formulation and compounding records",
    "Office-use non-sterile compounding requires USP <795> documentation and BUD assignment under Pennsylvania rules.",
    ["compounding", "office-use"]
  ),
  mpjeSelectAll(
    "Which Pennsylvania naloxone counseling points are appropriate at dispensing? Select all that apply.",
    [
      "Recognize opioid overdose signs",
      "Administer naloxone and call emergency services",
      "Store naloxone in a locked safe inaccessible to caregivers",
      "Explain repeat dosing may be needed",
      "Encourage follow-up with prescriber or harm-reduction resources",
    ],
    [
      "Recognize opioid overdose signs",
      "Administer naloxone and call emergency services",
      "Explain repeat dosing may be needed",
      "Encourage follow-up with prescriber or harm-reduction resources",
    ],
    {
      subjectId: "dispensing-procedures",
      stateCode: "PA",
      explanation:
        "Naloxone counseling covers overdose recognition, emergency response, repeat dosing, and follow-up — not locking product away from caregivers who may need it.",
      tags: [...PE, "pennsylvania", "naloxone", "counseling"],
      references: [PA_REF],
    }
  ),
  pa(
    "state-practice-act",
    "A Pennsylvania pharmacy changes ownership. The PIC must ensure:",
    o4(
      "Board notification, record transfer plans, and controlled substance inventory reconciliation",
      "Immediate destruction of all prescription files",
      "No DEA or board notice if the name on the door stays the same",
      "Technicians sign ownership documents"
    ),
    "Board notification, record transfer plans, and controlled substance inventory reconciliation",
    "Ownership changes require board notification and proper CS and prescription record handling.",
    ["ownership", "records"]
  ),

  // ── Depth boost: Ohio (+5) ───────────────────────────────────────────
  oh(
    "dispensing-procedures",
    "An Ohio pharmacist identifies a critical interaction between a new macrolide and the patient's statin. What is required?",
    o4(
      "Contact the prescriber or document intervention before dispensing",
      "Dispense without review because the patient took the statin for years",
      "Delegate to cashiers",
      "Cancel insurance instead of calling prescriber"
    ),
    "Contact the prescriber or document intervention before dispensing",
    "Serious DUR findings require pharmacist intervention and documentation under Ohio dispensing standards.",
    ["DUR", "interaction"],
    "A 61-year-old patient in Columbus starts azithromycin while continuing simvastatin 40 mg daily."
  ),
  oh(
    "pharmacy-operations",
    "An Ohio pharmacy uses automated dispensing cabinets in a hospital satellite. The pharmacist must:",
    o4(
      "Ensure pharmacist verification, policies, and board-compliant ADC procedures",
      "Allow technicians to load and verify all controlled substances independently",
      "Skip documentation for ADC overrides",
      "Operate ADC without pharmacist involvement"
    ),
    "Ensure pharmacist verification, policies, and board-compliant ADC procedures",
    "Automated dispensing requires pharmacist oversight and documented policies under Ohio practice standards.",
    ["ADC", "hospital"]
  ),
  oh(
    "controlled-substances",
    "An Ohio patient presents a C-II prescription with obvious alteration of the quantity. What should the pharmacist do?",
    o4(
      "Refuse to dispense and verify prescriber intent; report forgery if confirmed",
      "Dispense the altered quantity to avoid delay",
      "White-out the quantity and initial it",
      "Accept technician correction of the quantity"
    ),
    "Refuse to dispense and verify prescriber intent; report forgery if confirmed",
    "Altered controlled substance prescriptions must not be dispensed; forgery requires refusal and appropriate reporting.",
    ["forgery", "C-II"]
  ),
  mpjeSelectAll(
    "Which immunization documentation elements apply to Ohio pharmacist-administered vaccines? Select all that apply.",
    [
      "Vaccine lot number and administration date",
      "Patient screening for contraindications",
      "Technician-only administration without pharmacist oversight",
      "Entry in patient immunization record",
      "Reporting to state registry when required",
    ],
    [
      "Vaccine lot number and administration date",
      "Patient screening for contraindications",
      "Entry in patient immunization record",
      "Reporting to state registry when required",
    ],
    {
      subjectId: "pharmacy-operations",
      stateCode: "OH",
      explanation:
        "Immunization documentation requires lot/date, screening, patient record entry, and registry reporting — not unsupervised technician administration.",
      tags: [...PE, "ohio", "immunization"],
      references: [OH_REF],
    }
  ),
  oh(
    "patient-privacy",
    "An Ohio patient's ex-spouse requests medication records without authorization. The pharmacist should:",
    o4(
      "Decline unless patient authorizes disclosure or a permitted exception applies",
      "Provide records because they were previously married",
      "Fax records to any household member",
      "Publish records on the patient portal for family"
    ),
    "Decline unless patient authorizes disclosure or a permitted exception applies",
    "Former marital relationship does not create HIPAA authorization; disclosure requires consent or permitted exception.",
    ["HIPAA", "privacy"]
  ),
];
