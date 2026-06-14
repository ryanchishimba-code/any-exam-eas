/**
 * Curated MPJE-style items — physician-educator batch 06.
 * Topics: FDA labeling, offer-to-counsel, compounding inspections, PDMP red flags, OK/MO/VA depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-06";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA = { label: "Federal Food, Drug, and Cosmetic Act (FDCA)", citation: "21 U.S.C. § 301 et seq." };
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const OK_REF = { label: "Oklahoma Pharmacy Act / OBN rules", citation: "63 O.S. § 1521 et seq.; OAC 535:15" };
const MO_REF = { label: "Missouri Pharmacy Act", citation: "RSMo § 338.010 et seq.; 20 CSR 2220" };
const VA_REF = { label: "Virginia Drug Control Act", citation: "Va. Code § 54.1-3300 et seq." };
const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_06: EnrichedBankItem[] = [
  // ── FDA Labeling (3) ────────────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 62-year-old patient picks up a newly dispensed prescription medication. The pharmacy label lists the patient name and quantity but omits the route and frequency directions from the prescriber's order. The drug is not an OTC product.`,
    "What is the pharmacist's most appropriate action under federal labeling requirements?",
    opts4(
      "Release the product because the patient already knows how to take it",
      "Ensure the prescription label includes required directions and identifying information before dispensing per FDCA misbranding standards",
      "Provide directions only verbally without updating the label",
      "Substitute a different strength to simplify labeling"
    ),
    "Ensure the prescription label includes required directions and identifying information before dispensing per FDCA misbranding standards",
    `The FDCA misbranding provisions require prescription labels to bear adequate directions for use and necessary identifying information. Dispensing without complete labeling violates federal law regardless of patient familiarity. Verbal-only directions or unauthorized strength changes compound the violation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["FDA", "labeling", "misbranding", "FDCA", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Prescription labels must include adequate directions and required identifiers — incomplete labels are misbranded under the FDCA.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 55-year-old patient asks to purchase an OTC ibuprofen product from the front store. The outer carton lacks a required Drug Facts panel on one side, though the inner blister pack has partial information.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Sell the product because the inner pack has some labeling",
      "Remove the product from sale and resolve the misbranding issue with the supplier before offering it to patients",
      "Apply a handwritten Drug Facts panel at the register",
      "Sell only if the patient signs a waiver acknowledging missing labels"
    ),
    "Remove the product from sale and resolve the misbranding issue with the supplier before offering it to patients",
    `OTC drugs must bear compliant Drug Facts labeling under FDA requirements. Incomplete outer labeling constitutes misbranding even if inner packaging has partial information. Handwritten panels and patient waivers do not cure federal labeling violations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["FDA", "OTC", "Drug-Facts", "labeling", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 48-year-old patient receives a new prescription for a medication that requires an FDA-approved Medication Guide. The pharmacy's inventory system flags the requirement, but the technician cannot locate the current Medication Guide at the workstation.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Dispense without the Medication Guide if the patient declines counseling",
      "Provide the current FDA-approved Medication Guide and ensure required counseling/documentation before dispensing",
      "Print a summary from a consumer website instead of the official Medication Guide",
      "Substitute a therapeutically equivalent drug that has no Medication Guide requirement without prescriber contact"
    ),
    "Provide the current FDA-approved Medication Guide and ensure required counseling/documentation before dispensing",
    `When FDA requires a Medication Guide, dispensers must provide the approved guide with each dispensing unless a valid exception applies. Substituting drugs or using unofficial summaries does not satisfy federal requirements. Patient counseling declination does not waive Medication Guide distribution obligations where mandated.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["FDA", "Medication-Guide", "counseling", ...PE],
    }
  ),

  // ── Offer-to-Counsel (3) ──────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 70-year-old patient picks up a new prescription for warfarin 5 mg at the drive-through window. The pharmacist offers counseling; the patient states they are in a hurry and declines. State and federal rules require offer-to-counsel documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip documentation because the patient declined counseling",
      "Document that counseling was offered and the patient declined, per OBRA and applicable state requirements",
      "Refuse to release the prescription unless the patient accepts full counseling",
      "Have the technician sign that counseling occurred even though it did not"
    ),
    "Document that counseling was offered and the patient declined, per OBRA and applicable state requirements",
    `OBRA '90 and state rules require pharmacies to offer counseling on new prescriptions and document the offer and patient response. Declination must be documented — not ignored. Refusal to dispense or falsified technician signatures violate federal and professional standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["offer-to-counsel", "OBRA", "warfarin", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Offer-to-counsel must be documented even when the patient declines — OBRA requires the offer and response on record.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 34-year-old patient receives a refill of metformin 500 mg that has been unchanged for two years. The patient asks a complex question about new kidney function labs and drug interactions at pickup.`,
    "What is the pharmacist's most appropriate action regarding counseling?",
    opts4(
      "Refuse to answer because refills do not require any pharmacist involvement",
      "Provide pharmacist counseling or clinical guidance appropriate to the patient's question despite refill status",
      "Tell the patient to read the label only and leave the queue",
      "Refer the patient to the prescriber for all questions regardless of urgency"
    ),
    "Provide pharmacist counseling or clinical guidance appropriate to the patient's question despite refill status",
    `While OBRA offer-to-counsel focuses on new prescriptions, pharmacists remain clinically responsible for addressing patient questions and significant DUR concerns on refills. Blanket refusal, label-only dismissal, or automatic prescriber deferral may fail professional duty when pharmacist intervention is warranted.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["counseling", "refill", "DUR", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 59-year-old patient receives a new mail-order shipment of a high-risk medication at home. The package includes standard shipping documents but no evidence the pharmacy offered pharmacist counseling or how to access counseling.`,
    "What is the pharmacist/mail-order pharmacy's most appropriate compliance approach?",
    opts4(
      "Mail-order pharmacies are exempt from all counseling requirements",
      "Provide required offer of counseling through approved methods (e.g., toll-free access, written notice) and document per federal and state mail-order rules",
      "Include counseling only if the patient pays an extra fee",
      "Counsel only when the patient returns the unused portion"
    ),
    "Provide required offer of counseling through approved methods (e.g., toll-free access, written notice) and document per federal and state mail-order rules",
    `Mail-order and central-fill pharmacies must still meet offer-to-counsel obligations using methods appropriate to the delivery model. Exemption claims, fee-based counseling only, or return-based counseling misstate OBRA and state mail-order compliance expectations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["offer-to-counsel", "mail-order", ...PE],
    }
  ),

  // ── Compounding Inspections (3) ───────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 51-year-old PIC at a compounding pharmacy prepares for a routine state board inspection. An inspector requests master formulation records, compounding logs, and environmental monitoring data for non-sterile preparations compounded in the past six months.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Provide only records from the past 30 days to minimize review time",
      "Produce required USP <795> and board-mandated compounding records for the applicable retention period",
      "Refuse access to compounding records as trade secrets",
      "Allow the technician to answer all compounding questions without pharmacist presence"
    ),
    "Produce required USP <795> and board-mandated compounding records for the applicable retention period",
    `Board inspections evaluate compliance with USP <795>/<797> and state compounding rules, including MFRs, batch logs, and monitoring where applicable. Retention follows board rules — often months to years, not 30 days. Trade-secret refusal and technician-only responses fail inspection cooperation and PIC accountability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["compounding", "inspection", "USP-795", "records", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: During an inspection of a 46-year-old PIC's sterile compounding suite, the board investigator notes inadequate daily certification logs for the ISO 5 primary engineering control and missing media-fill documentation for personnel.`,
    "What is the pharmacist's most appropriate immediate response?",
    opts4(
      "Explain that logs are optional for low-volume compounding",
      "Acknowledge deficiencies, suspend non-compliant compounding if required, and implement corrective action per USP <797> and board rules",
      "Backdate certification logs to satisfy the inspector",
      "Continue compounding while ordering new equipment next quarter"
    ),
    "Acknowledge deficiencies, suspend non-compliant compounding if required, and implement corrective action per USP <797> and board rules",
    `USP <797> requires documented environmental monitoring, PEC certification, and personnel competency (including media fills where applicable). Inspectors expect corrective action — not optional compliance claims, falsified records, or continued compounding with known deficiencies.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP795, { label: "USP <797>", citation: "USP-NF <797>" }],
      tags: ["compounding", "inspection", "USP-797", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old Oklahoma PIC receives 48-hour notice of a board inspection. A technician proposes discarding older compounding batch records and controlled-substance discrepancy notes before the visit.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Approve destruction of records to present a clean inspection file",
      "Prohibit destruction of required records; maintain complete compounding and controlled-substance documentation for inspector review",
      "Hide discrepancy notes in a personal locker during the inspection",
      "Cancel the inspection by claiming the pharmacy is closed"
    ),
    "Prohibit destruction of required records; maintain complete compounding and controlled-substance documentation for inspector review",
    `Destroying or concealing records before an inspection violates board and federal record retention rules and may constitute obstruction. The PIC must ensure retrievable compounding and CS documentation for lawful inspection periods. False closure claims do not lawfully avoid oversight.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 3,
      references: [OK_REF],
      tags: ["oklahoma", "inspection", "records", "PIC", ...PE],
    }
  ),

  // ── PDMP Red Flags (3) ────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 41-year-old patient presents a prescription for oxycodone 10 mg tablets from a new out-of-state prescriber. PDMP review shows the patient received similar opioids from three other prescribers and four pharmacies in the past 30 days, all cash pay.`,
    "What is the pharmacist's most appropriate action under corresponding responsibility rules?",
    opts4(
      "Dispense because the current prescription appears valid on its face",
      "Investigate red flags, document professional judgment, and refuse or clarify with the prescriber if a valid medical purpose is not established",
      "Report the patient to law enforcement before contacting the prescriber in every case",
      "Dispense a partial fill without documentation to reduce liability"
    ),
    "Investigate red flags, document professional judgment, and refuse or clarify with the prescriber if a valid medical purpose is not established",
    `Corresponding responsibility requires pharmacists to evaluate PDMP patterns suggesting doctor shopping or diversion. Valid appearance alone does not eliminate duty to act on multiple prescribers, pharmacies, and cash-pay patterns. Automatic police reporting or undocumented partial fills fail professional standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["PDMP", "red-flags", "corresponding-responsibility", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "PDMP red flags (multiple prescribers/pharmacies, cash pay) trigger corresponding-responsibility review — refuse or clarify if no valid medical purpose.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient requests an early refill of alprazolam 1 mg tablets 18 days after picking up a 30-day supply. The patient claims the medication was lost while traveling. PDMP confirms no other recent fills, but the patient has requested early benzo refills twice this year.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the early refill without question because loss is a common excuse",
      "Apply professional judgment, assess the clinical and legal appropriateness, contact the prescriber if warranted, and document before dispensing or refusing",
      "Refuse all early controlled substance refills regardless of circumstance",
      "Dispense double the quantity to cover future travel"
    ),
    "Apply professional judgment, assess the clinical and legal appropriateness, contact the prescriber if warranted, and document before dispensing or refusing",
    `Early refill requests for controlled substances — especially benzodiazepines with loss claims — require pharmacist assessment and prescriber contact when appropriate. Automatic approval, blanket refusal, or quantity escalation without documentation fail corresponding responsibility.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["PDMP", "early-refill", "benzodiazepine", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 37-year-old patient drives 90 miles to your pharmacy to fill hydrocodone tablets while living near three other pharmacies. The patient pays cash and declines insurance. PDMP shows consistent early fills at distant pharmacies over six months.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the patient has a right to choose any pharmacy",
      "Treat as a potential red flag for diversion; review PDMP, document judgment, and refuse or verify with prescriber if legitimate purpose is not established",
      "Accept cash payment as proof of legitimate medical need",
      "Ban the patient permanently without documentation or prescriber contact"
    ),
    "Treat as a potential red flag for diversion; review PDMP, document judgment, and refuse or verify with prescriber if legitimate purpose is not established",
    `Geographic distance, cash payment, and repeated early fills across pharmacies are classic diversion red flags. Pharmacy choice alone does not waive corresponding responsibility. Cash pay does not establish medical legitimacy. Permanent bans without process may be appropriate only after documented professional judgment and lawful steps.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["PDMP", "red-flags", "diversion", "cash-pay", ...PE],
    }
  ),

  // ── Oklahoma (2) ────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Tulsa presents a new prescription for oxycodone 5 mg tablets. Oklahoma requires PMP review before dispensing applicable controlled substances. The pharmacist has not queried the Oklahoma PMP.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Oklahoma PMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PMP review for patients who appear trustworthy",
      "Query PMP only once per year for each patient",
      "Allow the technician to complete the controlled substance fill without pharmacist PMP review"
    ),
    "Query the Oklahoma PMP, document the review, and exercise corresponding responsibility before dispensing",
    `Oklahoma requires pharmacists to access and document PMP review as part of corresponding responsibility before dispensing controlled substances. Trust-based waivers, annual-only checks, and technician-led CS dispensing violate Oklahoma monitoring and supervision rules.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 3,
      references: [OK_REF],
      tags: ["oklahoma", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 63-year-old technician at an Oklahoma City pharmacy asks to perform final verification on refill prescriptions during a staffing shortage. The pharmacist is on site but counting inventory in the back.`,
    "What is the pharmacist's most appropriate response under Oklahoma practice standards?",
    opts4(
      "Allow technician final verification for non-controlled refills only",
      "Decline — final verification and pharmacist-only duties remain with the licensed pharmacist on duty",
      "Allow verification if the technician is nationally certified",
      "Permit verification when the pharmacist remains anywhere in the building"
    ),
    "Decline — final verification and pharmacist-only duties remain with the licensed pharmacist on duty",
    `Oklahoma follows standard scope rules: technicians may support dispensing but cannot perform final verification or other pharmacist-only clinical functions. Certification, non-controlled status, or pharmacist presence elsewhere in the store does not expand technician authority.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 2,
      references: [OK_REF],
      tags: ["oklahoma", "technician-scope", "verification", ...PE],
    }
  ),

  // ── Missouri (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 46-year-old patient in St. Louis presents a prescription for tramadol 50 mg tablets. Missouri requires pharmacists to check the prescription drug monitoring program before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Missouri PDMP, document the review, and apply corresponding-responsibility judgment before dispensing",
      "Skip PDMP because tramadol is not controlled in Missouri",
      "Query PDMP only if the patient requests early refills",
      "Delegate PDMP review to clerical staff"
    ),
    "Query the Missouri PDMP, document the review, and apply corresponding-responsibility judgment before dispensing",
    `Tramadol is a controlled substance federally and in Missouri. Missouri PDMP review and documentation are part of corresponding responsibility before dispensing. Selective or delegated-only monitoring fails state and professional requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MO",
      difficulty: 3,
      references: [MO_REF],
      tags: ["missouri", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 72-year-old patient in Kansas City picks up a new prescription for a high-risk medication. Missouri rules align with federal OBRA requirements for offer-to-counsel on new prescriptions at community pharmacies.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document the patient's acceptance or declination",
      "Skip counseling offers for all Medicare patients to save time",
      "Provide counseling only when the prescriber checks a box on the prescription",
      "Allow the cashier to document counseling that did not occur"
    ),
    "Offer counseling on the new prescription and document the patient's acceptance or declination",
    `Missouri community pharmacies must offer pharmacist counseling on new prescriptions and document the outcome under OBRA-aligned requirements. Medicare status, prescriber box absence, or falsified documentation do not waive the offer-to-counsel obligation.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MO",
      difficulty: 2,
      references: [MO_REF],
      tags: ["missouri", "offer-to-counsel", "counseling", ...PE],
    }
  ),

  // ── Virginia (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 44-year-old patient in Richmond presents multiple early refill requests for benzodiazepines from different prescribers. Virginia's Prescription Monitoring Program (PMP) shows overlapping fills. The current prescription appears valid.`,
    "What is the pharmacist's most appropriate action under Virginia corresponding responsibility rules?",
    opts4(
      "Dispense because each prescription is individually valid",
      "Review Virginia PMP data, assess red flags, document professional judgment, and refuse or clarify if appropriate",
      "Contact law enforcement instead of the prescriber in all cases",
      "Dispense only on odd-numbered calendar days to limit abuse"
    ),
    "Review Virginia PMP data, assess red flags, document professional judgment, and refuse or clarify if appropriate",
    `Virginia requires PMP-informed corresponding responsibility for controlled substance dispensing. Overlapping benzodiazepine fills from multiple prescribers warrant investigation and documentation. Automatic law enforcement contact or arbitrary dispensing schedules fail professional standards.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VA",
      difficulty: 3,
      references: [VA_REF],
      tags: ["virginia", "PMP", "PDMP", "red-flags", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 57-year-old pharmacist seeks to practice at a Norfolk community pharmacy after relocating from another state. They hold an active license elsewhere but have not applied to the Virginia Board of Pharmacy.`,
    "What is the pharmacist's most appropriate action before dispensing in Virginia?",
    opts4(
      "Begin dispensing immediately under the out-of-state license",
      "Obtain a Virginia pharmacist license through the board's licensure or reciprocity process before practicing",
      "Register only with DEA and skip state licensure",
      "Work as a technician until a Virginia license arrives without board application"
    ),
    "Obtain a Virginia pharmacist license through the board's licensure or reciprocity process before practicing",
    `Pharmacists must hold an active Virginia license before dispensing in the state. Out-of-state licenses, DEA registration alone, or working as a technician without licensure do not authorize pharmacist practice in Virginia.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VA",
      difficulty: 2,
      references: [VA_REF],
      tags: ["virginia", "licensure", "reciprocity", ...PE],
    }
  ),
];
