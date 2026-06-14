/**
 * Curated MPJE-style items — physician-educator batch 04.
 * Topics: REMS, DSCSA, technician scope, USP <800>, FL/OH/IL state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-04";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA = { label: "FDA REMS / Drug Safety", url: "https://www.fda.gov/drugs" };
const DSCSA = {
  label: "Drug Supply Chain Security Act (DSCSA)",
  citation: "21 U.S.C. § 360eee et seq.",
};
const USP800 = { label: "USP <800> Hazardous Drugs", citation: "USP-NF <800>" };
const FL_REF = { label: "Florida Pharmacy Act", citation: "Fla. Stat. Ch. 465; FAC 64B16" };
const OH_REF = { label: "Ohio Pharmacy Practice Act", citation: "ORC Ch. 4729; OARRS" };
const IL_REF = { label: "Illinois Pharmacy Practice Act", citation: "225 ILCS 85; IDFPR rules" };

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_04: EnrichedBankItem[] = [
  // ── FDA REMS (4) ──────────────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 19-year-old female patient presents a new prescription for isotretinoin 40 mg capsules. The prescriber is enrolled in iPLEDGE and the prescription includes required REMS elements. The pharmacist confirms negative pregnancy test documentation on file per program rules.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Dispense without REMS verification because the prescriber is board-certified",
      "Verify iPLEDGE REMS requirements are met — including patient enrollment, counseling, and documentation — before dispensing",
      "Allow the technician to bypass REMS documentation if the patient declines counseling",
      "Substitute topical tretinoin without prescriber contact to avoid REMS paperwork"
    ),
    "Verify iPLEDGE REMS requirements are met — including patient enrollment, counseling, and documentation — before dispensing",
    `Isotretinoin is subject to the FDA iPLEDGE REMS with mandatory prescriber, pharmacy, and patient enrollment, pregnancy prevention requirements, and documented counseling. Dispensing without REMS compliance violates federal law and program agreements. Technicians cannot waive REMS duties. Unauthorized substitution bypasses prescriber intent and REMS controls.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA],
      tags: ["REMS", "iPLEDGE", "isotretinoin", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "iPLEDGE REMS requires verified enrollment, documentation, and counseling before every isotretinoin dispense.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 38-year-old patient with treatment-resistant schizophrenia presents a prescription for clozapine 100 mg tablets. The pharmacy is not yet active in the Clozapine REMS program but has the drug in stock. ANC monitoring documentation is attached from the prescriber.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because ANC labs satisfy clinical monitoring regardless of REMS enrollment",
      "Enroll or verify active pharmacy participation in the Clozapine REMS and meet dispensing requirements before release",
      "Dispense a 90-day supply to reduce REMS paperwork burden",
      "Transfer the patient to an out-of-state pharmacy to avoid REMS"
    ),
    "Enroll or verify active pharmacy participation in the Clozapine REMS and meet dispensing requirements before release",
    `Clozapine is governed by a shared-system REMS requiring certified pharmacies, prescribers, and documented ANC monitoring and dispensing authorization. Clinical labs alone do not replace REMS pharmacy certification. Extended supplies and out-of-state evasion violate REMS and patient safety requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA],
      tags: ["REMS", "clozapine", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 55-year-old patient with chronic pain presents a prescription for extended-release oxycodone 20 mg tablets. The prescriber completed REMS-compliant patient counseling documentation for ER/LA opioids. The pharmacy participates in applicable REMS requirements.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore REMS documentation because DEA scheduling alone governs all opioid dispensing",
      "Verify REMS and state/federal opioid dispensing requirements, provide required patient counseling, and document before dispensing",
      "Require the patient to sign REMS forms but skip pharmacist counseling to save time",
      "Refuse all ER/LA opioids because REMS prohibits community pharmacy dispensing"
    ),
    "Verify REMS and state/federal opioid dispensing requirements, provide required patient counseling, and document before dispensing",
    `Extended-release/long-acting opioids are subject to FDA REMS elements emphasizing patient counseling on safe use, storage, and disposal, in addition to DEA controlled substance rules. REMS does not ban community dispensing but mandates documented compliance. DEA rules alone are insufficient where REMS applies.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA, { label: "DEA", url: "https://www.dea.gov" }],
      tags: ["REMS", "opioid", "ER-LA", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 42-year-old male patient with multiple myeloma presents a prescription for lenalidomide 10 mg capsules. The prescriber and patient are enrolled in the Lenalidomide REMS (REVLIMID REMS). The pharmacist has never dispensed this medication before.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense immediately because the prescription appears valid on its face",
      "Complete required pharmacy REMS enrollment/training and verify all program requirements before the first dispense",
      "Allow a technician to complete REMS verification without pharmacist review",
      "Dispense if the patient signs a generic counseling waiver"
    ),
    "Complete required pharmacy REMS enrollment/training and verify all program requirements before the first dispense",
    `Lenalidomide carries a REMS with mandatory pharmacy certification, patient counseling on embryo-fetal toxicity, and dispensing controls. First-time dispensers must be REMS-compliant before release. Valid appearance of the prescription does not substitute for program enrollment. Technicians cannot perform REMS certification duties reserved to the pharmacist.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA],
      tags: ["REMS", "lenalidomide", ...PE],
    }
  ),

  // ── DSCSA (3) ─────────────────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 60-year-old patient's maintenance medication arrives from the wholesaler without required DSCSA product tracing data (transaction history and statement). The outer packaging appears authentic but the electronic tracing file is missing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense immediately because the wholesaler is reputable",
      "Quarantine the product, investigate with the trading partner, and do not dispense until DSCSA tracing requirements are resolved",
      "Return the product to the patient if they paid in advance",
      "Remove lot labels and dispense to avoid delay"
    ),
    "Quarantine the product, investigate with the trading partner, and do not dispense until DSCSA tracing requirements are resolved",
    `The Drug Supply Chain Security Act requires pharmacies to receive and maintain interoperable transaction information, history, and statements. Suspect or incomplete tracing requires quarantine and investigation before dispensing. Reputation, patient prepayment, or label alteration do not satisfy federal supply-chain integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "tracing", "quarantine", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Missing DSCSA tracing data requires quarantine and investigation — do not dispense until resolved.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 35-year-old pharmacy technician scanning inbound inventory notices a serial number on a serialized unit that fails verification in the DSCSA system and the product identifier does not match the purchase order.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Add the product to shelf stock because the barcode scanned with an error",
      "Treat as suspect or illegitimate product per DSCSA, quarantine, and investigate before dispensing",
      "Sell at a discount to move inventory quickly",
      "Repackage into unit-dose without documenting the discrepancy"
    ),
    "Treat as suspect or illegitimate product per DSCSA, quarantine, and investigate before dispensing",
    `DSCSA serialization and verification help identify suspect and illegitimate products. Failed verification and mismatched product identifiers trigger investigation, quarantine, and potential notification — not shelf placement, discount sales, or silent repackaging.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "serialization", "suspect-product", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 50-year-old pharmacist-in-charge is updating policies after a DSCSA inspection finding. Staff ask whether pharmacies must retain transaction records for prescription drug products received from trading partners.`,
    "What is the pharmacist's most appropriate guidance under DSCSA?",
    opts4(
      "No retention is required if dispensing occurs within 30 days",
      "Maintain required transaction information, history, and statements for applicable periods and make them retrievable for investigation",
      "Retain only paper invoices from unknown suppliers",
      "Destroy tracing data after each daily inventory count"
    ),
    "Maintain required transaction information, history, and statements for applicable periods and make them retrievable for investigation",
    `DSCSA obligates dispensers to maintain transaction records supporting product tracing and investigation of suspect products. Retention is not waived by rapid dispensing. Paper invoices alone may be insufficient for interoperable tracing. Destroying tracing data undermines compliance and investigation capability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "records", "PIC", ...PE],
    }
  ),

  // ── Technician Scope (3) ────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old certified pharmacy technician at a busy retail store completes data entry for a new lisinopril prescription and labels the vial. The technician asks to perform final accuracy verification and release the bag to the 68-year-old patient without pharmacist check because the queue is long.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow technician final verification for non-controlled medications during backlog",
      "Prohibit technician final verification; the pharmacist must perform final review and accept professional responsibility before release",
      "Allow release if the technician has ten years of experience",
      "Delegate counseling and verification to the cashier if the pharmacist is on lunch break"
    ),
    "Prohibit technician final verification; the pharmacist must perform final review and accept professional responsibility before release",
    `Final verification, clinical review, and acceptance of professional responsibility are pharmacist-only duties in virtually all jurisdictions. Technicians may perform supportive tasks such as data entry and labeling under supervision. Experience level, non-controlled status, or cashier delegation does not expand technician scope.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["technician-scope", "verification", "supervision", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Final prescription verification and release remain pharmacist-only duties — not delegable to technicians.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient asks detailed drug interaction questions about a new warfarin prescription at the pickup counter. The pharmacy technician states the pharmacist is busy and offers to provide complete counseling alone to speed the line.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow technician-only counseling on warfarin if a script is read from the label",
      "Ensure a pharmacist provides required counseling or offer of counseling for the new high-risk prescription",
      "Refuse all counseling to maintain workflow",
      "Provide counseling only in written form mailed later without offer at pickup"
    ),
    "Ensure a pharmacist provides required counseling or offer of counseling for the new high-risk prescription",
    `Pharmacist counseling or an offer of counseling is required for new prescriptions under federal and state rules, especially high-risk anticoagulants. Technicians cannot replace pharmacist counseling on clinical interaction questions. Mailing-only counseling without pickup offer may fail offer-to-counsel requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["technician-scope", "counseling", "warfarin", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 41-year-old pharmacy technician in a hospital inpatient pharmacy prepares IV admixtures and proposes signing off chemotherapy orders independently on the night shift when the pharmacist is covering the emergency department.`,
    "What is the pharmacist's most appropriate action regarding technician scope?",
    opts4(
      "Authorize independent technician verification of all IV chemotherapy orders",
      "Maintain pharmacist oversight and verification of sterile and hazardous compounding per policy, USP standards, and board rules",
      "Allow independent sign-off if the technician holds national certification only",
      "Suspend all chemotherapy until day shift regardless of patient need"
    ),
    "Maintain pharmacist oversight and verification of sterile and hazardous compounding per policy, USP standards, and board rules",
    `Sterile and hazardous compounding requires pharmacist supervision and verification; technicians cannot independently authorize chemotherapy compounding. Certification alone does not expand legal scope. Blanket suspension ignoring emergency patient needs is inappropriate when pharmacist oversight can be arranged.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["technician-scope", "chemotherapy", "supervision", ...PE],
    }
  ),

  // ── USP <800> Hazardous Drugs (3) ─────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 63-year-old oncology patient needs oral capecitabine tablets dispensed at retail. The pharmacy stores the stock bottle with other non-hazardous oral medications on open shelves near the counseling area without HD labeling.`,
    "What is the pharmacist's most appropriate action under USP <800>?",
    opts4(
      "Continue open storage because oral dosage forms are never hazardous",
      "Identify capecitabine as a hazardous drug (HD), implement required receipt, storage, labeling, and handling controls per USP <800>",
      "Dispense without HD controls if the patient wears gloves at home",
      "Transfer all oncology drugs to the technician break room for convenience"
    ),
    "Identify capecitabine as a hazardous drug (HD), implement required receipt, storage, labeling, and handling controls per USP <800>",
    `USP <800> applies to listed hazardous drugs including many oral antineoplastics such as capecitabine. HDs require designated storage, labeling, and handling to protect staff and patients — not open shelf storage with routine inventory. Patient home glove use does not replace pharmacy HD controls.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "storage", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "USP <800> requires HD identification, labeled storage, and handling controls — including many oral antineoplastics.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 49-year-old pharmacy technician drops a broken vial of powdered cyclophosphamide on the compounding bench, creating visible aerosol and surface contamination during HD preparation.`,
    "What is the pharmacist's most appropriate immediate action under USP <800>?",
    opts4(
      "Wipe with a paper towel and resume compounding to avoid delay",
      "Activate spill kit procedures, use appropriate PPE, contain and clean per <800> spill guidelines, and document the event",
      "Ignore the spill if the air filter runs continuously",
      "Ask the patient to clean the area before pickup"
    ),
    "Activate spill kit procedures, use appropriate PPE, contain and clean per <800> spill guidelines, and document the event",
    `USP <800> mandates spill kits, trained personnel, PPE, and documented decontamination procedures for hazardous drug spills. Paper towel cleanup or reliance on general ventilation is insufficient. Patient cleanup is unsafe and unprofessional.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["USP-800", "spill", "PPE", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 58-year-old patient needs a compounded sterile preparation containing an hazardous drug at an outpatient pharmacy planning to use a positive-pressure non-containment room without external venting for HD compounding.`,
    "What is the pharmacist's most appropriate facility decision under USP <800>?",
    opts4(
      "Use positive-pressure non-containment space because USP <800> applies only to hospitals",
      "Prepare HD sterile compounds in compliant containment-primary engineering controls and facility requirements per USP <800> and <797>",
      "Rely on USP <795> non-sterile standards for all HD workflows",
      "Compound in the retail counseling area during slow hours"
    ),
    "Prepare HD sterile compounds in compliant containment-primary engineering controls and facility requirements per USP <800> and <797>",
    `USP <800> requires containment strategies and appropriate primary engineering controls for hazardous drug compounding to protect personnel and environments. Positive-pressure non-containment setups are inappropriate for HD sterile compounding. <795> and retail counseling areas do not satisfy HD sterile requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP800, { label: "USP <797>", citation: "USP-NF <797>" }],
      tags: ["USP-800", "containment", "C-PEC", ...PE],
    }
  ),

  // ── Florida (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Miami presents early refills for alprazolam and oxycodone from different prescribers. Florida E-FORCSE shows overlapping benzodiazepine and opioid fills in the past 30 days. The current prescriptions appear valid individually.`,
    "What is the pharmacist's most appropriate action under Florida corresponding responsibility rules?",
    opts4(
      "Dispense both because each prescription is valid on its face",
      "Review E-FORCSE, assess red flags, document professional judgment, and refuse or clarify if a valid medical purpose is not established",
      "Report the patient to law enforcement before any prescriber contact in every case",
      "Dispense partial fills without documentation to reduce conflict"
    ),
    "Review E-FORCSE, assess red flags, document professional judgment, and refuse or clarify if a valid medical purpose is not established",
    `Florida requires PDMP (E-FORCSE) review as part of corresponding responsibility for controlled substance dispensing. Valid individual prescriptions do not eliminate duty to evaluate suspicious overlap patterns. Automatic police reporting or undocumented partial fills fail professional standards.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "FL",
      difficulty: 3,
      references: [FL_REF],
      tags: ["florida", "E-FORCSE", "PDMP", "red-flags", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Tampa requests naloxone nasal spray without a patient-specific prescription. Florida authorizes pharmacist dispensing under standing order or protocol in applicable settings.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense naloxone under an authorized Florida standing order or protocol if requirements are met",
      "Refuse because naloxone always requires an individual prescription in Florida",
      "Dispense only to licensed EMS personnel",
      "Require emergency department discharge papers for every request"
    ),
    "Dispense naloxone under an authorized Florida standing order or protocol if requirements are met",
    `Florida expanded naloxone access through pharmacist dispensing authority under standing orders/protocols with training and documentation requirements. Community access for at-risk patients and bystanders is authorized when protocol conditions are met. EMS-only or universal discharge-paper requirements misstate Florida access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "FL",
      difficulty: 3,
      references: [FL_REF],
      tags: ["florida", "naloxone", "standing-order", ...PE],
    }
  ),

  // ── Ohio (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 45-year-old patient in Columbus presents a prescription for tramadol 50 mg tablets. Ohio requires OARRS review before dispensing applicable controlled substances. The pharmacist has not yet queried OARRS.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query OARRS, document the review, and apply corresponding-responsibility judgment before dispensing",
      "Skip OARRS for tramadol because it is not a controlled substance",
      "Query OARRS only if the patient appears suspicious",
      "Allow a technician to complete dispensing before pharmacist PDMP review"
    ),
    "Query OARRS, document the review, and apply corresponding-responsibility judgment before dispensing",
    `Ohio requires pharmacists to query and document OARRS (Ohio Automated Rx Reporting System) review before dispensing controlled substances. Tramadol is a controlled substance federally and in Ohio. Suspicion-only review and technician-led CS dispensing violate state monitoring and supervision rules.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OH",
      difficulty: 3,
      references: [OH_REF],
      tags: ["ohio", "OARRS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 53-year-old registered pharmacy technician in Cleveland asks to perform final verification on refill prescriptions while the pharmacist counts controlled substances in the vault.`,
    "What is the pharmacist's most appropriate response under Ohio pharmacy practice standards?",
    opts4(
      "Allow final verification on refills only when the pharmacist is temporarily unavailable",
      "Decline — Ohio requires pharmacist final verification; technicians remain within board-defined supportive scope",
      "Allow verification if the technician completed a hospital externship",
      "Permit verification for non-controlled refills only without pharmacist review"
    ),
    "Decline — Ohio requires pharmacist final verification; technicians remain within board-defined supportive scope",
    `Ohio, consistent with national standards, restricts final verification and clinical judgment to licensed pharmacists. Temporary pharmacist absence, externship, or non-controlled status does not authorize technician final verification.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OH",
      difficulty: 2,
      references: [OH_REF],
      tags: ["ohio", "technician-scope", "verification", ...PE],
    }
  ),

  // ── Illinois (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Chicago presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg. Illinois rules require pharmacists to check the Prescription Monitoring Program (PMP) before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Illinois PMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PMP review for combination hydrocodone products",
      "Query PMP only once per calendar year per patient",
      "Delegate PMP review and dispensing authorization to clerical staff"
    ),
    "Query the Illinois PMP, document the review, and exercise corresponding responsibility before dispensing",
    `Illinois requires PMP access and documentation as part of pharmacist corresponding responsibility for controlled substance dispensing. Combination hydrocodone products are controlled substances. Annual-only or clerical delegation fails Illinois monitoring and supervision requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IL",
      difficulty: 3,
      references: [IL_REF],
      tags: ["illinois", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 62-year-old relief pharmacist is designated pharmacist-in-charge at a Springfield independent pharmacy. An IDFPR inspector arrives for a routine inspection requesting prescription files, controlled substance records, and technician training documentation.`,
    "What is the pharmacist's most appropriate action as Illinois PIC?",
    opts4(
      "Produce required records and demonstrate compliance with the Illinois Pharmacy Practice Act and IDFPR rules",
      "Refuse inspection until corporate legal arrives even for routine board visits",
      "Provide only records the technician selects from the workstation",
      "Discard outdated controlled substance logs before the inspector reviews them"
    ),
    "Produce required records and demonstrate compliance with the Illinois Pharmacy Practice Act and IDFPR rules",
    `The PIC ensures pharmacy operation per state practice act and board rules, including record retention and technician training documentation during inspections. Routine board inspections must be accommodated with required records. Selective production, refusal without legal basis, or destroying CS logs violates Illinois law and federal recordkeeping.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IL",
      difficulty: 3,
      references: [IL_REF],
      tags: ["illinois", "PIC", "inspection", "records", ...PE],
    }
  ),
];
