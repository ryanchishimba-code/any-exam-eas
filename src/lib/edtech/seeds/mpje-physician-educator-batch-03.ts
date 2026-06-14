/**
 * Curated MPJE-style items — physician-educator batch 03.
 * Topics: USP <795>, ethics/refusal, prescription transfers, CA/TX state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-03";
const PE = ["physician-educator", BATCH, "mpje"];

const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const TX_REF = { label: "Texas Pharmacy Act / TSBP", citation: "Tex. Occ. Code Ch. 562; 22 TAC §291" };
const CA_REF = {
  label: "California Business & Professions Code / BOP",
  citation: "Bus. & Prof. Code § 4000 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_03: EnrichedBankItem[] = [
  // ── USP <795> Nonsterile Compounding (4) ───────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 67-year-old patient needs a non-sterile topical ketoconazole 2% cream compounded in a water-containing base. The compounding pharmacist assigns a 180-day beyond-use date at room temperature because the API is commercially stable.`,
    "What is the pharmacist's most appropriate beyond-use date (BUD) assignment under USP <795>?",
    opts4(
      "Assign BUD per <795> category limits for the formulation type, storage, and water content — not API stability alone",
      "Use 180 days for all non-sterile creams regardless of water content",
      "Use 12 months because ketoconazole is stable in every vehicle",
      "Omit BUD labeling for patient-specific compounds picked up within 48 hours"
    ),
    "Assign BUD per <795> category limits for the formulation type, storage, and water content — not API stability alone",
    `USP <795> requires BUD assignment based on formulation category, water content, packaging, and storage — not API stability alone. Water-containing non-sterile preparations generally carry shorter BUDs due to microbial growth risk. Arbitrary 180-day or 12-month dating ignores compounding-specific contamination risk. All dispensed compounded preparations require an assigned BUD on the label.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Non-sterile BUD under USP <795> depends on water content and storage — never API stability alone.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 54-year-old patient requests a refill of a non-sterile compounded oral suspension prepared at your pharmacy three weeks ago. The pharmacist discovers the master formulation record lacks the assigned beyond-use date and compounding date for the original batch.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refill from the original batch without documentation because the patient needs the medication",
      "Do not dispense beyond the documented BUD; prepare a new compound with complete master formulation and compounding records per USP <795>",
      "Assign a new 6-month BUD retroactively in the computer system",
      "Outsource to a 503B facility without verifying prescription requirements"
    ),
    "Do not dispense beyond the documented BUD; prepare a new compound with complete master formulation and compounding records per USP <795>",
    `USP <795> requires master formulation records, compounding records, and assigned BUD for every preparation. Dispensing without adequate documentation or beyond BUD violates compounding standards adopted by state boards. Retroactive BUD assignment is prohibited. Outsourcing does not bypass prescription and documentation requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "MFR", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 39-year-old prescriber orders 200 unit-dose non-sterile capsules of a hormone preparation for in-office administration without patient-specific prescriptions. The community pharmacist proposes batch compounding under USP <795> for office stock.`,
    "What is the pharmacist's most appropriate action under federal compounding law and USP <795>?",
    opts4(
      "Compound unlimited office stock because USP <795> applies only to hospitals",
      "Evaluate whether the order complies with FDA 503A patient-specific requirements, state board office-use rules, and <795> standards before compounding",
      "Proceed if the prescriber is a long-standing customer",
      "Label the batch as OTC dietary supplement to avoid prescription rules"
    ),
    "Evaluate whether the order complies with FDA 503A patient-specific requirements, state board office-use rules, and <795> standards before compounding",
    `Traditional pharmacy compounding under 503A generally requires patient-specific prescriptions; office-use batch compounding is heavily restricted and state-dependent. USP <795> applies in community and hospital non-sterile settings. Prescriber relationship does not waive federal compounding limits. Misbranding as dietary supplement is unlawful.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP795, { label: "FDA 503A compounding", url: "https://www.fda.gov/drugs" }],
      tags: ["USP-795", "503A", "office-use", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 71-year-old hospice patient needs a non-sterile compounded oral morphine solution. The compounding area lacks a dedicated sink with hand washing, and the technician proposes skipping hand hygiene because gloves will be worn.`,
    "What is the pharmacist's most appropriate action under USP <795> personnel and facility standards?",
    opts4(
      "Allow compounding because gloves replace hand washing in all non-sterile workflows",
      "Ensure proper hand hygiene, appropriate facility requirements, and personnel training before compounding per USP <795>",
      "Compound in the retail counseling area to save time",
      "Extend BUD to 90 days to reduce compounding frequency"
    ),
    "Ensure proper hand hygiene, appropriate facility requirements, and personnel training before compounding per USP <795>",
    `USP <795> requires personnel hygiene, training, and facility standards appropriate to non-sterile compounding risk. Gloves supplement but do not replace hand hygiene. Compounding in uncontrolled counseling areas increases contamination risk. BUD extension without scientific basis violates <795>.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "hand-hygiene", "facility", ...PE],
    }
  ),

  // ── Ethics & Professional Responsibility (4) ──────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 33-year-old patient presents a valid prescription for ulipristal acetate emergency contraception. The pharmacist has a sincerely held moral objection in a state that permits refusal when certain conditions are met. No other pharmacist is on duty for two hours and the nearest pharmacy is 30 minutes away.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse and provide no further assistance because personal objection ends the professional duty",
      "Refuse to dispense personally but take reasonable steps to ensure timely access, such as referral or transfer to another pharmacy",
      "Dispense despite personal objection because the patient cannot wait",
      "Require the prescriber to cancel the prescription to avoid conflict"
    ),
    "Refuse to dispense personally but take reasonable steps to ensure timely access, such as referral or transfer to another pharmacy",
    `Permitted conscientious refusal does not eliminate the duty to avoid patient abandonment. Pharmacists must facilitate reasonable alternative access through referral, transfer, or timely coverage when refusal is authorized by state law. Mandatory dispensing despite objection misstates permitted refusal frameworks. Prescriber cancellation interferes with lawful care.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["ethics", "refusal", "patient-access", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Permitted conscientious refusal requires facilitating timely alternative access — not abandonment.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 46-year-old patient presents a prescription for oxycodone 30 mg tablets. The pharmacist notices irregular prescriber handwriting, mismatched letterhead, and a DEA number that fails validation. The patient becomes agitated when questioned.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense to avoid confrontation because the patient appears to be in pain",
      "Withhold dispensing, verify prescriber authenticity per policy and law, and report suspected forgery if confirmed",
      "Call law enforcement on every patient who requests controlled substances",
      "Post the patient's name in the pharmacy to warn other stores"
    ),
    "Withhold dispensing, verify prescriber authenticity per policy and law, and report suspected forgery if confirmed",
    `Pharmacists have corresponding responsibility to identify forged or altered prescriptions. Verification and refusal to dispense suspected forgeries protects public health. Dispensing despite red flags violates DEA and board expectations. Automatic police contact for all CS patients or public shaming violates privacy and professionalism.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["ethics", "forgery", "red-flags", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A staff pharmacist observes a 50-year-old colleague pharmacist slurring speech, smelling of alcohol, and approving controlled substance orders with obvious errors during the evening shift at a community pharmacy.`,
    "What is the pharmacist's most appropriate action under professional ethics and typical board rules?",
    opts4(
      "Ignore the behavior to protect the colleague's privacy and employment",
      "Intervene to protect patient safety, restrict impaired practice, and report to the PIC and board/mandatory authority as required",
      "Post about the incident on social media to warn the community",
      "Allow the impaired pharmacist to finish the shift unsupervised to maintain workflow"
    ),
    "Intervene to protect patient safety, restrict impaired practice, and report to the PIC and board/mandatory authority as required",
    `Impaired practice threatens patient safety. Professional duty and many state mandatory reporting rules require intervention, removal from dangerous duties, and reporting to supervisors and the board when impairment or diversion is suspected. Silence, public disclosure, or unsupervised continuation violates ethics and patient safety obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["ethics", "impairment", "mandatory-reporting", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 59-year-old long-term patient asks the pharmacist to waive the copay and bill insurance for a full paid amount, stating financial hardship. The pharmacist is offered a kickback by a local prescriber to prioritize that prescriber's patients in the queue.`,
    "What is the pharmacist's most appropriate ethical and legal response?",
    opts4(
      "Accept the kickback and waive copays to build prescriber loyalty",
      "Decline kickbacks and copay waivers that constitute fraud; follow anti-kickback, insurance, and professional ethics rules",
      "Waive copays routinely for all patients without documentation",
      "Prioritize the prescriber's patients in exchange for gift cards only"
    ),
    "Decline kickbacks and copay waivers that constitute fraud; follow anti-kickback, insurance, and professional ethics rules",
    `Federal anti-kickback statutes and insurance fraud laws prohibit remuneration for referrals or claims misrepresentation. Routine copay waivers without permissible programs may constitute fraud. Gift-based queue priority is an improper inducement. Pharmacists must maintain fair dispensing and billing integrity.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["ethics", "fraud", "anti-kickback", ...PE],
    }
  ),

  // ── Prescription Transfers (4) ────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 64-year-old patient asks your pharmacy to transfer a remaining fill of oxycodone 15 mg tablets from another pharmacy across town. The original pharmacy confirms the prescription is active with partial fills remaining.`,
    "What is the pharmacist's most appropriate action under federal controlled substance transfer rules?",
    opts4(
      "Complete the transfer because the patient requested it",
      "Refuse — Schedule II prescriptions generally may not be transferred between pharmacies under federal law",
      "Transfer only if both pharmacists agree verbally without records",
      "Transfer unlimited times if the patient provides ID"
    ),
    "Refuse — Schedule II prescriptions generally may not be transferred between pharmacies under federal law",
    `21 CFR § 1306.25 prohibits transfer of Schedule II prescriptions between pharmacies. A new prescription is required. C-III–V may transfer once under specific conditions. Verbal agreement without records or unlimited transfers violate federal CS transfer rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["transfer", "C-II", "dispensing", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway: "Schedule II prescriptions cannot be transferred between pharmacies under federal law.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 42-year-old patient requests transfer of a remaining refill on lorazepam 1 mg tablets (Schedule IV) from Pharmacy A to your store. Pharmacy A reports one prior transfer of this prescription one month ago to a different pharmacy that was never filled.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the transfer because C-IV prescriptions may be transferred without limit",
      "Refuse the transfer because Schedule III–V prescriptions generally may be transferred only once between pharmacies",
      "Accept if the patient pays cash",
      "Accept if the prescriber verbally approves by phone"
    ),
    "Refuse the transfer because Schedule III–V prescriptions generally may be transferred only once between pharmacies",
    `Federal law permits only one transfer of Schedule III–V prescriptions between pharmacies when all regulatory conditions are met. A prior transfer generally bars a second transfer on the same prescription. Cash payment and verbal prescriber approval do not override federal transfer limits.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["transfer", "C-IV", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 58-year-old patient wants all non-controlled maintenance medications transferred from a closed mail-order pharmacy to your community pharmacy. The mail-order records include patient name, drug, quantity, and remaining refills but omit transfer dates and sending pharmacist identification.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept incomplete transfers to help the patient avoid gaps in therapy",
      "Obtain complete transfer documentation required by state and professional standards before dispensing transferred prescriptions",
      "Require new prescriptions from every prescriber regardless of transfer law",
      "Transfer only controlled substances first and ignore documentation gaps for others"
    ),
    "Obtain complete transfer documentation required by state and professional standards before dispensing transferred prescriptions",
    `Prescription transfers require documented communication between pharmacies with required elements under state law and board rules. Incomplete records create liability and patient safety risks. Blanket new Rx requirements ignore valid transfer law; prioritizing CS while ignoring documentation fails compliance for all medications.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["transfer", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 36-year-old patient at your pharmacy needs a refill of lisinopril 20 mg sent from a pharmacy in another state. The out-of-state pharmacist faxes a transfer with all required elements including refills remaining and last fill date.`,
    "What is the pharmacist's most appropriate action for this non-controlled transfer?",
    opts4(
      "Accept the documented inter-state transfer if state and board requirements for non-controlled prescriptions are satisfied",
      "Refuse all out-of-state transfers regardless of documentation",
      "Require the patient to pick up the prescription in person in the other state only",
      "Accept only if the fax is notarized"
    ),
    "Accept the documented inter-state transfer if state and board requirements for non-controlled prescriptions are satisfied",
    `Non-controlled prescription transfers between states are permitted when properly documented and consistent with applicable state board rules. Blanket refusal or notarization requirements are not standard transfer elements. In-person pickup in the original state defeats transfer purpose when lawful transfer is authorized.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["transfer", "interstate", ...PE],
    }
  ),

  // ── California State Depth (3) ────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 48-year-old patient needs a sterile compounded ophthalmic preparation at a San Diego outpatient pharmacy that lacks a current California sterile compounding license and compliant ISO-classified primary engineering controls.`,
    "What is the pharmacist's most appropriate action under California pharmacy law and USP <797>?",
    opts4(
      "Compound in the retail workflow because sterile eye drops are low risk",
      "Do not compound sterile ophthalmics without required California licensing, facilities, and USP <797> compliance",
      "Use USP <795> non-sterile standards for all eye drops",
      "Ship the order to the patient with a 90-day BUD regardless of licensing"
    ),
    "Do not compound sterile ophthalmics without required California licensing, facilities, and USP <797> compliance",
    `California strictly regulates sterile compounding with board licensing and USP <797> requirements. Sterile ophthalmics require appropriate ISO-classified compounding environments — not retail workflow or <795> standards. Dispensing without compliance violates state and quality standards.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CA",
      difficulty: 4,
      references: [CA_REF, { label: "USP <797>", citation: "USP-NF <797>" }],
      tags: ["california", "USP-797", "sterile", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 55-year-old patient asks a Los Angeles community pharmacist to administer a herpes zoster vaccine. The pharmacist completed California board-approved immunization training but the store's protocol expired six months ago and has not been renewed.`,
    "What is the pharmacist's most appropriate action under California pharmacy practice rules?",
    opts4(
      "Administer the vaccine because prior training never expires",
      "Do not administer until a current protocol or authorization meeting California requirements is in place",
      "Allow a technician to administer the vaccine while the pharmacist is at lunch",
      "Administer only if the patient signs a waiver replacing protocol requirements"
    ),
    "Do not administer until a current protocol or authorization meeting California requirements is in place",
    `California pharmacist immunization authority requires board-approved training plus current protocol/prescriber authorization as applicable. Expired protocols do not authorize vaccination. Technicians cannot independently administer vaccines. Patient waivers do not replace statutory protocol requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CA",
      difficulty: 3,
      references: [CA_REF],
      tags: ["california", "immunization", "protocol", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 43-year-old patient presents an electronic prescription for alprazolam at a Sacramento pharmacy. The pharmacist notes excessive early refills from multiple prescribers on CURES (California PDMP). The current prescription appears valid on its face.`,
    "What is the pharmacist's most appropriate action under California corresponding responsibility rules?",
    opts4(
      "Dispense automatically because the e-prescription format is valid",
      "Review CURES, assess red flags, document professional judgment, and refuse or clarify if a valid medical purpose is not established",
      "Report the patient to police before contacting the prescriber in every case",
      "Dispense a partial fill without documentation to avoid conflict"
    ),
    "Review CURES, assess red flags, document professional judgment, and refuse or clarify if a valid medical purpose is not established",
    `California requires PDMP (CURES) review as part of corresponding responsibility for controlled substances. Valid e-prescription format does not eliminate duty to evaluate suspicious patterns. Automatic police reporting or undocumented partial fills fail professional and legal standards.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CA",
      difficulty: 3,
      references: [CA_REF],
      tags: ["california", "CURES", "PDMP", "red-flags", ...PE],
    }
  ),

  // ── Texas State Depth (3) ─────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old patient in Houston presents a new prescription for hydrocodone 7.5 mg/acetaminophen 325 mg. Texas rules require PMP review before dispensing applicable controlled substances. The pharmacist has not queried the Texas PMP.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Texas PMP, document the review, and apply corresponding-responsibility judgment before dispensing",
      "Skip PMP review for established patients",
      "Query PMP only for Schedule II drugs, not hydrocodone combinations",
      "Delegate PMP review and dispensing authorization to a certified technician"
    ),
    "Query the Texas PMP, document the review, and apply corresponding-responsibility judgment before dispensing",
    `Texas requires pharmacists to query and document PMP review as part of corresponding responsibility before dispensing controlled substances. Patient familiarity does not waive monitoring. Hydrocodone combinations are controlled substances subject to PMP rules. Technicians cannot perform final CS dispensing decisions.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TX",
      difficulty: 3,
      references: [TX_REF],
      tags: ["texas", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 61-year-old relief pharmacist is asked to serve as temporary pharmacist-in-charge at a Dallas chain pharmacy while the regular PIC is on medical leave. Controlled substance ordering invoices and DEA Form 222 require PIC-level accountability.`,
    "What is the pharmacist's most appropriate action regarding Texas PIC responsibilities?",
    opts4(
      "Accept PIC designation and maintain legal compliance, CS accountability, and board-required supervision as the Texas PIC",
      "Decline all PIC duties and allow technicians to sign DEA Form 222",
      "Operate without a designated PIC until corporate assigns one next quarter",
      "Transfer CS accountability to the district manager who is not a pharmacist"
    ),
    "Accept PIC designation and maintain legal compliance, CS accountability, and board-required supervision as the Texas PIC",
    `The Texas PIC ensures pharmacy compliance with the Texas Pharmacy Act and TSBP rules, including controlled substance accountability. Technicians and non-pharmacist managers cannot assume PIC or DEA ordering responsibilities. Operating without a pharmacist PIC violates board requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TX",
      difficulty: 3,
      references: [TX_REF],
      tags: ["texas", "PIC", "DEA", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 52-year-old patient in Austin runs out of levothyroxine 112 mcg on a Friday night. The prescriber's office is closed until Monday. The patient has a stable multi-year fill history. Texas permits limited emergency dispensing under applicable rules.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Provide a limited emergency supply per applicable Texas protocol with documentation and prescriber follow-up",
      "Refuse any supply without a brand-new written prescription",
      "Dispense a 90-day supply using therapeutic substitution without prescriber contact",
      "Transfer the prescription out of state to avoid Texas rules"
    ),
    "Provide a limited emergency supply per applicable Texas protocol with documentation and prescriber follow-up",
    `Texas allows pharmacists to provide limited emergency maintenance medication supplies when prescriber contact is temporarily impossible, with documentation and follow-up. Blanket refusal ignores authorized emergency access. Excessive quantity with unauthorized substitution violates dispensing law. Transfer to evade state law is inappropriate.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TX",
      difficulty: 3,
      references: [TX_REF],
      tags: ["texas", "emergency-supply", "maintenance-med", ...PE],
    }
  ),
];
