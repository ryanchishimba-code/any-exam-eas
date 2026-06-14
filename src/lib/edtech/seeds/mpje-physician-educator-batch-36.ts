/**
 * Curated MPJE-style items — physician-educator batch 36.
 * Topics: FDA REMS follow-up (deeper), central fill liability, 503A office-use,
 * Med Sync billing, CO/ID/WY state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-36";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA_REMS = {
  label: "FDA REMS / Drug Safety",
  url: "https://www.fda.gov/drugs/drug-safety-and-availability/risk-evaluation-and-mitigation-strategies-rems",
};
const FDA503A = {
  label: "FDA Section 503A Compounding",
  url: "https://www.fda.gov/drugs/human-drug-compounding/compounding-laws-and-policies",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const CO_REF = {
  label: "Colorado Pharmacy Practice Act",
  citation: "Colo. Rev. Stat. § 12-280 et seq.",
};
const ID_REF = {
  label: "Idaho Pharmacy Practice Act",
  citation: "Idaho Code § 54-17 et seq.",
};
const WY_REF = {
  label: "Wyoming Pharmacy Practice Act",
  citation: "Wyo. Stat. § 33-24 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_36: EnrichedBankItem[] = [
  // ── FDA REMS Follow-Up — Deeper (3) ─────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 22-year-old female patient returns for an isotretinoin refill under the iPLEDGE REMS program. The pharmacist confirms a valid prescription but the REMS system shows the required negative pregnancy test result is two days past the program's allowed window.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the patient had a negative test recently",
      "Withhold dispensing until required iPLEDGE pregnancy prevention documentation is current in the REMS system per program rules",
      "Dispense a 30-day supply and update REMS after the weekend",
      "Allow the technician to override the REMS hold for established patients"
    ),
    "Withhold dispensing until required iPLEDGE pregnancy prevention documentation is current in the REMS system per program rules",
    `iPLEDGE requires current pregnancy prevention documentation before each isotretinoin dispense — not recent-but-expired tests, delayed REMS updates, or technician overrides.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA_REMS],
      tags: ["REMS", "isotretinoin", "iPLEDGE", "follow-up", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "iPLEDGE requires current pregnancy prevention documentation — expired REMS tests block dispensing.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 35-year-old patient with treatment-resistant schizophrenia presents a clozapine refill. The Clozapine REMS registry shows the most recent absolute neutrophil count (ANC) is below the program threshold and flagged as not acceptable for dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense a bridge supply because the patient is established on therapy",
      "Withhold dispensing until acceptable ANC monitoring documentation is verified in the Clozapine REMS registry and coordinate with the prescriber per program requirements",
      "Dispense half the quantity to reduce monitoring burden",
      "Transfer the patient to another pharmacy to bypass the REMS hold"
    ),
    "Withhold dispensing until acceptable ANC monitoring documentation is verified in the Clozapine REMS registry and coordinate with the prescriber per program requirements",
    `Clozapine REMS requires acceptable ANC documentation before dispensing — not bridge supplies, partial quantities, or pharmacy transfers to evade registry holds.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA_REMS],
      tags: ["REMS", "clozapine", "ANC", "follow-up", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 58-year-old patient with breakthrough cancer pain presents a refill for a transmucosal immediate-release fentanyl (TIRF) product under the TIRF REMS Access program. The pharmacy is enrolled, but the REMS system shows the patient's opioid tolerance documentation expired last week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the patient tolerated opioids at the initial fill",
      "Verify current TIRF REMS opioid tolerance and program documentation before dispensing; resolve expired registry entries with the prescriber",
      "Substitute oral oxycodone without REMS verification",
      "Dispense one unit without REMS check because the patient is in pain"
    ),
    "Verify current TIRF REMS opioid tolerance and program documentation before dispensing; resolve expired registry entries with the prescriber",
    `TIRF REMS requires current opioid tolerance documentation for each dispensing period — not prior fill history alone, non-TIRF substitution, or single-unit dispensing without verification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA_REMS],
      tags: ["REMS", "TIRF", "fentanyl", "follow-up", ...PE],
    }
  ),

  // ── Central Fill Liability — Deeper (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 73-year-old patient receives a hub-filled bag at a spoke pharmacy after hours via automated locker pickup. The patient later reports receiving metformin 1000 mg tablets labeled for another patient's name but with their own address on the shipping label. The spoke was closed when the bag was loaded.`,
    "What is the pharmacist's most appropriate action when notified?",
    opts4(
      "Tell the patient to return the medication to the locker without pharmacy involvement",
      "Quarantine the misfilled product, investigate the hub error, notify the patient and hub, document the incident, and provide correct medication only after verification",
      "Relabel the product for the patient because metformin is the same drug class",
      "Blame the patient for accepting a bag with another name"
    ),
    "Quarantine the misfilled product, investigate the hub error, notify the patient and hub, document the incident, and provide correct medication only after verification",
    `Hub-and-spoke misfills require quarantine, investigation, and correct patient verification regardless of after-hours delivery method — not locker-only returns, relabeling, or patient blame.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["central-fill", "hub-and-spoke", "dispensing-error", "liability", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "After-hours hub misfills still require quarantine, investigation, and verified correction.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 65-year-old patient's maintenance medication arrives from a central fill hub with the correct label but the barcode scan at the spoke pharmacy shows a different NDC strength than the label indicates. The hub reports an automated dispensing carousel mis-pick.`,
    "What is the pharmacist's most appropriate action before patient release?",
    opts4(
      "Release the product because the label matches the prescription",
      "Quarantine the product, reconcile label and barcode data with the hub, and release only after verified correct strength and product identification",
      "Allow the technician to override the barcode mismatch to reduce wait time",
      "Return the product to hub inventory without documentation"
    ),
    "Quarantine the product, reconcile label and barcode data with the hub, and release only after verified correct strength and product identification",
    `Central fill barcode-label mismatches require quarantine and hub reconciliation before release — not label-only trust, technician overrides, or undocumented returns.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["central-fill", "hub-and-spoke", "barcode", "dispensing-error", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old spoke pharmacist learns the central fill hub shipped a Schedule III refill to the wrong retail store in the same chain. The receiving store nearly dispensed the prescription to a walk-in patient with a similar name before the error was caught.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense to the walk-in patient because the product is already at the store",
      "Quarantine the misfilled controlled substance, document the inter-store error, notify the hub and intended spoke, and ensure PDMP and dispensing records reflect correct patient routing",
      "Transfer the prescription verbally to the walk-in patient to clear inventory",
      "Return the controlled substance to hub stock without DEA documentation"
    ),
    "Quarantine the misfilled controlled substance, document the inter-store error, notify the hub and intended spoke, and ensure PDMP and dispensing records reflect correct patient routing",
    `Inter-store central fill CS routing errors require quarantine, documentation, and correct PDMP and record alignment — not convenience dispensing, verbal transfers, or undocumented stock returns.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["central-fill", "hub-and-spoke", "controlled-substances", "liability", ...PE],
    }
  ),

  // ── 503A Office-Use — Deeper (3) ──────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 50-year-old dermatology clinic requests a standing monthly refill of 200 unit-dose topical steroid syringes for in-office procedures without naming individual patients. The pharmacist previously compounded similar office-use orders under a state-authorized limited office-use rule.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refill automatically because the clinic is an established office-use customer",
      "Verify current federal 503A limits and applicable state office-use authorization, quantity limits, and documentation before each compounding cycle",
      "Compound the batch and label only with the clinic name to simplify tracking",
      "Switch the order to 503B status verbally without FDA registration verification"
    ),
    "Verify current federal 503A limits and applicable state office-use authorization, quantity limits, and documentation before each compounding cycle",
    `503A office-use compounding requires ongoing verification of federal limits and state authorization for each cycle — not automatic refills, clinic-only labeling, or verbal 503B reclassification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA503A],
      tags: ["503A", "office-use", "prescriber-stock", "compounding", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "503A office-use refills require ongoing federal and state authorization verification — not automatic batch repeats.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 47-year-old physician requests patient-specific 503A compounded injectable vitamin B12 for in-office administration plus an additional 50 vials of the same formulation labeled for unnamed clinic stock in the same order.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Compound all vials in one batch because the formulation is identical",
      "Compound only patient-specific units supported by valid prescriptions; evaluate whether unnamed clinic stock exceeds 503A office-use limits and requires separate lawful authorization",
      "Label all vials as dietary supplements to avoid compounding rules",
      "Ship all vials to the clinic without distinguishing patient-specific from stock"
    ),
    "Compound only patient-specific units supported by valid prescriptions; evaluate whether unnamed clinic stock exceeds 503A office-use limits and requires separate lawful authorization",
    `503A requires separation of patient-specific compounding from unauthorized office stock in the same batch — not combined batches, supplement mislabeling, or undifferentiated clinic shipment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA503A],
      tags: ["503A", "office-use", "patient-specific", "compounding", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 55-year-old compounding pharmacy ships office-use non-sterile topical units to a clinic in another state under a state office-use allowance. The clinic calls reporting that several vials leaked in transit and may be contaminated.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the clinic to wipe the vials and continue using them to avoid waste",
      "Quarantine the affected shipment, investigate compounding and shipping integrity, notify the clinic and prescriber, and replace or dispose per policy without redispensing compromised office-use product",
      "Ship replacement vials without documenting the incident",
      "Relabel leaked vials with new beyond-use dates"
    ),
    "Quarantine the affected shipment, investigate compounding and shipping integrity, notify the clinic and prescriber, and replace or dispose per policy without redispensing compromised office-use product",
    `Compromised office-use shipments require quarantine, investigation, and proper replacement or disposal — not wipe-and-use instructions, undocumented reshipment, or BUD relabeling.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["503A", "office-use", "shipping", "compounding", ...PE],
    }
  ),

  // ── Med Sync Billing (3) ──────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 67-year-old Med Sync patient needs a 7-day alignment fill of gabapentin 300 mg to synchronize with other chronic medications. The PBM rejects the claim with "refill too soon" despite documented sync enrollment and appropriate billing codes on the prior claim.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill the 7-day supply as cash to avoid the rejection",
      "Document the synchronization need, resubmit with required sync documentation or appeal per plan rules, and coordinate with the prescriber if an override is needed",
      "Dispense a full 90-day supply early without documentation",
      "Tell the patient to skip gabapentin until the sync date"
    ),
    "Document the synchronization need, resubmit with required sync documentation or appeal per plan rules, and coordinate with the prescriber if an override is needed",
    `Med Sync alignment fills require documented resubmission or appeal when payers reject refill-too-soon — not cash conversion, early 90-day supplies, or advising medication omission.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["Med-Sync", "medication-synchronization", "billing", "PBM", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Med Sync refill-too-soon rejections require documented appeal — not cash workarounds or skipped doses.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old Med Sync patient needs an early partial fill of alprazolam 0.5 mg tablets (Schedule IV) to align with sync date. State law permits sync partial fills for non-controlled medications but restricts early controlled-substance fills without prescriber authorization.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the early C-IV partial fill automatically because Med Sync applies to all drugs equally",
      "Verify state and federal controlled-substance refill rules, obtain prescriber authorization if required, document the sync rationale, and bill per plan rules",
      "Bill the C-IV fill as a new prescription without prescriber contact",
      "Exclude controlled substances from Med Sync permanently without patient counseling"
    ),
    "Verify state and federal controlled-substance refill rules, obtain prescriber authorization if required, document the sync rationale, and bill per plan rules",
    `Med Sync for Schedule IV drugs requires compliance with controlled-substance refill rules and prescriber authorization when needed — not automatic early fills, unauthorized new Rx billing, or silent exclusion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["Med-Sync", "medication-synchronization", "C-IV", "billing", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old chain pharmacy enrolls patients in Med Sync and bills a monthly synchronization service fee to Medicare Part D for each enrolled patient. Corporate billing reports the fee as a dispensing copay offset without a covered service code.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue billing the sync fee to Part D because it improves adherence",
      "Bill only covered Med Sync services and fees per plan and CMS rules; do not bill non-covered synchronization fees as dispensing copay offsets",
      "Bill all sync fees as cash without informing patients",
      "Waive all sync fees and bill Part D for full 90-day supplies instead"
    ),
    "Bill only covered Med Sync services and fees per plan and CMS rules; do not bill non-covered synchronization fees as dispensing copay offsets",
    `Med Sync fees must comply with plan and CMS billing rules — not adherence-based unauthorized Part D fee billing, undisclosed cash charges, or 90-day supply misbilling.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["Med-Sync", "medication-synchronization", "Medicare", "billing-compliance", ...PE],
    }
  ),

  // ── Colorado (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Denver presents a new prescription for oxycodone 5 mg tablets. Colorado requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Colorado PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with commercial insurance",
      "Query PDMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Colorado PDMP, document the review, and apply corresponding-responsibility judgment",
    `Colorado requires pharmacists to query and document PDMP review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CO",
      difficulty: 3,
      references: [CO_REF],
      tags: ["colorado", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 71-year-old patient in Colorado Springs picks up a new prescription at a community pharmacy. Colorado aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Colorado community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CO",
      difficulty: 2,
      references: [CO_REF],
      tags: ["colorado", "offer-to-counsel", ...PE],
    }
  ),

  // ── Idaho (2) ─────────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient in Boise presents a new prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Idaho requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Idaho PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients paying cash",
      "Query PMP only for Schedule II drugs, not hydrocodone combination products",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Idaho PMP, document the review, and apply corresponding-responsibility judgment",
    `Idaho requires pharmacists to query and document PMP review as part of corresponding responsibility before dispensing controlled substances. Cash payment does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 3,
      references: [ID_REF],
      tags: ["idaho", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Idaho Falls picks up a new prescription at a community pharmacy. Idaho aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Idaho community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 2,
      references: [ID_REF],
      tags: ["idaho", "offer-to-counsel", ...PE],
    }
  ),

  // ── Wyoming (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient requests an influenza vaccine at a Cheyenne pharmacy. The pharmacist completed Wyoming-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Wyoming protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Wyoming protocol requirements",
    `Wyoming authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Wyoming access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WY",
      difficulty: 2,
      references: [WY_REF],
      tags: ["wyoming", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old patient in Casper presents a new prescription for tramadol 50 mg tablets. Wyoming requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Wyoming PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with local prescribers",
      "Query PDMP only for Schedule II drugs, not tramadol",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Wyoming PDMP, document the review, and apply corresponding-responsibility judgment",
    `Wyoming requires pharmacists to query and document PDMP review as part of corresponding responsibility before dispensing controlled substances. Local prescriber status does not waive monitoring. Tramadol is controlled under federal and Wyoming schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WY",
      difficulty: 3,
      references: [WY_REF],
      tags: ["wyoming", "PDMP", "PMP", ...PE],
    }
  ),
];
