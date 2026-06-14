/**
 * Curated MPJE-style items — physician-educator batch 42.
 * Topics: anti-kickback/Stark (deeper), USP <800> spill/decontamination,
 * non-controlled partial-fill documentation, counseling refusal documentation, NV/UT/ID state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-42";
const PE = ["physician-educator", BATCH, "mpje"];

const AKS = {
  label: "Federal Anti-Kickback Statute (42 U.S.C. § 1320a-7b)",
  url: "https://oig.hhs.gov/compliance/physician-education/anti-kickback-statute/",
};
const USP800 = { label: "USP <800> Hazardous Drugs", citation: "USP-NF <800>" };
const OBRA = {
  label: "OBRA '90 Patient Counseling Requirements",
  url: "https://www.cms.gov/medicare/provider-enrollment-and-certification/guidanceforlawsandregulations/downloads/pharmacy-manual.pdf",
};
const NV_REF = {
  label: "Nevada Pharmacy Practice Act",
  citation: "Nev. Rev. Stat. § 639 et seq.",
};
const UT_REF = {
  label: "Utah Pharmacy Practice Act",
  citation: "Utah Code § 58-17b et seq.",
};
const ID_REF = {
  label: "Idaho Pharmacy Practice Act",
  citation: "Idaho Code § 54-17 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_42: EnrichedBankItem[] = [
  // ── Anti-Kickback / Stark — Deeper (3) ──────────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 50-year-old physician group offers the pharmacy below-market rent in clinic space if the pharmacy commits to filling at least 200 prescriptions monthly from the group's patients and sharing weekly referral reports.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the below-market rent because it reduces overhead",
      "Evaluate anti-kickback and Stark implications; use only lawful lease arrangements at fair market value without prescription volume targets or referral-based discounts",
      "Accept the deal but bill all patients cash to avoid federal scrutiny",
      "Pay the physician a per-prescription rebate to formalize the arrangement"
    ),
    "Evaluate anti-kickback and Stark implications; use only lawful lease arrangements at fair market value without prescription volume targets or referral-based discounts",
    `Below-market rent tied to prescription volume may constitute improper remuneration under anti-kickback and Stark laws — not acceptable overhead savings, cash-only evasion, or reciprocal per-Rx rebates.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [AKS],
      tags: ["anti-kickback", "Stark", "physician-relationship", "lease", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Below-market rent tied to Rx volume may violate anti-kickback and Stark — use fair market value leases only.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 46-year-old specialty pharmacy owner proposes paying a prescriber $250 per hour for "clinical consulting" on complex patients but expects no documented services, meetings, or time records — only continued high-cost prescription volume to the pharmacy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Pay the consulting fee because it is labeled as clinical services",
      "Refuse sham consulting payments tied to referral volume; any legitimate consulting must reflect fair market value with documented services actually performed",
      "Convert the payments to patient gift cards to avoid Stark scrutiny",
      "Bill Medicare for the consulting hours using the pharmacist's NPI instead"
    ),
    "Refuse sham consulting payments tied to referral volume; any legitimate consulting must reflect fair market value with documented services actually performed",
    `Sham physician consulting fees tied to prescription volume violate anti-kickback rules — labeling alone, patient gift card conversion, or NPI misbilling do not cure improper inducements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [AKS],
      tags: ["anti-kickback", "Stark", "physician-relationship", "sham-consulting", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 54-year-old DME supplier offers free medication synchronization software and shelving displays to the pharmacy if the pharmacy refers all new diabetes patients to the supplier for glucose monitors and bills the pharmacy a "marketing fee" per referral.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the free equipment and referral fees because patients benefit from coordinated care",
      "Evaluate anti-kickback implications of referral fees and equipment inducements; refuse remuneration tied to patient steering and maintain independent dispensing decisions",
      "Accept equipment only and hide referral fees in generic delivery charges",
      "Refer all diabetes patients exclusively to the supplier to maximize revenue"
    ),
    "Evaluate anti-kickback implications of referral fees and equipment inducements; refuse remuneration tied to patient steering and maintain independent dispensing decisions",
    `Free equipment and per-referral fees tied to patient steering may violate the anti-kickback statute — patient benefit claims, disguised fees, and exclusive referral mandates do not justify improper inducements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [AKS],
      tags: ["anti-kickback", "referral-fee", "DME", "equipment-inducement", ...PE],
    }
  ),

  // ── USP <800> Spill / Decontamination — Deeper (3) ────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 57-year-old pharmacy technician drops a sealed bag of intact cyclophosphamide tablets on the non-HD designated counting tray in the retail workflow area. Several tablets roll onto the counter near open prescription vials.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Wipe the tray with alcohol and continue dispensing because the tablets are intact",
      "Activate hazardous drug spill procedures, use appropriate PPE, contain and decontaminate the affected area, quarantine potentially contaminated product, and document per USP <800>",
      "Ask the technician to pick up the tablets with bare hands and return them to stock",
      "Ignore the event because oral tablets dispensed intact are never hazardous"
    ),
    "Activate hazardous drug spill procedures, use appropriate PPE, contain and decontaminate the affected area, quarantine potentially contaminated product, and document per USP <800>",
    `USP <800> spill procedures apply to hazardous drug events in non-HD areas — not alcohol wipes alone, bare-hand recovery, or intact-tablet exemptions from decontamination.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "spill", "decontamination", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "HD spills in retail areas require USP <800> spill kit procedures — not routine wipe-down alone.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 44-year-old technician splashes diluted antineoplastic liquid from a broken vial onto a lab coat while preparing a patient-specific IV admixture. The spill kit in the room expired six months ago and replacement kits are on back order.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue compounding because the spill was small",
      "Stop compounding, use available compliant spill materials or obtain replacement kits, follow doffing and decontamination procedures for contaminated PPE and surfaces, and document per USP <800>",
      "Allow the technician to finish the batch in the contaminated coat to avoid waste",
      "Send the technician home without documenting the exposure"
    ),
    "Stop compounding, use available compliant spill materials or obtain replacement kits, follow doffing and decontamination procedures for contaminated PPE and surfaces, and document per USP <800>",
    `HD spills on PPE require compliant spill response and decontamination — not continued compounding, contaminated coat use, or undocumented exposure dismissal. Expired kits must be replaced before relying on them.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "spill", "PPE", "decontamination", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old automated dispensing cabinet ejects a broken unit-dose package of oral methotrexate inside the machine housing. Maintenance staff propose vacuuming the powder without HD spill training to restore uptime quickly.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow maintenance to vacuum the cabinet without pharmacy involvement",
      "Restrict access, deploy trained personnel with appropriate PPE and spill procedures, decontaminate the cabinet per USP <800>, and document before returning to service",
      "Ignore internal cabinet contamination because patients never touch the machine interior",
      "Transfer all remaining cabinet stock to retail shelves without inspection"
    ),
    "Restrict access, deploy trained personnel with appropriate PPE and spill procedures, decontaminate the cabinet per USP <800>, and document before returning to service",
    `Internal HD contamination in automated dispensing equipment requires trained spill response and decontamination — not untrained vacuuming, ignored contamination, or uninspected stock transfer.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "spill", "automated-dispensing", ...PE],
    }
  ),

  // ── Non-Controlled Partial-Fill Documentation (3) ─────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient received a documented 30-day partial fill of a 90-day non-controlled atorvastatin prescription last week. The patient returns today but lost the original prescription and asks for the remaining 60-day balance without bringing documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the balance from memory because the patient is established",
      "Verify the partial-fill balance in pharmacy records, confirm remaining authorized quantity, and document the second partial fill per state law and policy",
      "Require a new prescription for the full 90 days without checking records",
      "Dispense the full 90-day quantity and ignore the prior partial fill"
    ),
    "Verify the partial-fill balance in pharmacy records, confirm remaining authorized quantity, and document the second partial fill per state law and policy",
    `Non-controlled partial-fill balances require verification in pharmacy records and documented dispensing — not memory-based release, unnecessary new prescriptions, or full-quantity redispensing that ignores prior partials.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["partial-fill", "non-controlled", "documentation", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Partial-fill balances must be verified in pharmacy records — not dispensed from memory alone.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 58-year-old patient receives a 14-day partial fill of a non-controlled metformin prescription from an e-prescription with balance tracking enabled. The technician dispenses correctly but forgets to update the electronic balance, and billing submits a claim for the full 90-day quantity.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave the record unchanged because the patient received the correct product",
      "Correct the electronic balance and billing to reflect the partial quantity dispensed and document the partial fill before release or claim submission",
      "Delete the e-prescription and create a paper prescription for the balance",
      "Bill the full 90 days because the plan prefers maintenance billing"
    ),
    "Correct the electronic balance and billing to reflect the partial quantity dispensed and document the partial fill before release or claim submission",
    `Electronic non-controlled partial fills require accurate balance and billing updates — correct product alone, record deletion, or full-quantity misbilling violate documentation and fraud standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["partial-fill", "non-controlled", "e-prescribing", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 49-year-old patient asks the pharmacy to dispense a 30-day partial fill of a 90-day non-controlled escitalopram prescription at one store and the remaining balance at a sister store across town tomorrow because of travel plans.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Split the prescription balance between stores without transfer documentation",
      "Dispense the partial fill with documented balance at the originating pharmacy and process any remaining quantity only through lawful transfer or new prescription rules per state law",
      "Dispense the full 90 days at the first store to avoid complexity",
      "Tell the patient to obtain a duplicate prescription from the prescriber at each store"
    ),
    "Dispense the partial fill with documented balance at the originating pharmacy and process any remaining quantity only through lawful transfer or new prescription rules per state law",
    `Non-controlled partial fills require documented balance at the dispensing pharmacy — not informal cross-store splitting, full-quantity workarounds, or duplicate prescriptions without lawful transfer.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["partial-fill", "non-controlled", "transfer", "documentation", ...PE],
    }
  ),

  // ── Counseling Refusal Documentation — Deeper (3) ─────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient picking up a new dabigatran prescription taps "decline counseling" on the signature pad, but the record shows no pharmacist offered counseling before checkout. The technician processed the transaction to reduce wait time.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the signature pad declination as sufficient documentation",
      "Ensure the pharmacist offered counseling, document acceptance or declination accurately, and correct workflow so declinations are not recorded without an offer",
      "Refuse all future prescriptions for the patient because they declined counseling",
      "Allow cashiers to complete counseling documentation for efficiency"
    ),
    "Ensure the pharmacist offered counseling, document acceptance or declination accurately, and correct workflow so declinations are not recorded without an offer",
    `OBRA-aligned offer-to-counsel requires an actual pharmacist offer before declination documentation — signature pad clicks alone, punitive refusal, or cashier documentation do not satisfy requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["offer-to-counsel", "counseling-refusal", "documentation", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Declination documentation requires a prior pharmacist offer — signature pad clicks alone are insufficient.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 72-year-old patient picking up a mail-delivery package of a new insulin product leaves a voicemail declining counseling. No written or electronic record documents that counseling was offered before shipment.`,
    "What is the pharmacist's most appropriate action for future mail orders?",
    opts4(
      "Treat voicemail declination as permanent waiver of all future counseling offers",
      "Implement workflow that documents pharmacist offer-to-counsel and patient acceptance or declination for mail/delivery new prescriptions per OBRA and state requirements",
      "Stop offering counseling on all mail orders to reduce callbacks",
      "Require counseling only when the patient initiates questions after delivery"
    ),
    "Implement workflow that documents pharmacist offer-to-counsel and patient acceptance or declination for mail/delivery new prescriptions per OBRA and state requirements",
    `Mail and delivery models still require documented offer-to-counsel on new prescriptions — not permanent voicemail waivers, eliminated offers, or passive counseling-only-on-request.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["offer-to-counsel", "counseling-refusal", "mail-order", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 41-year-old patient begins counseling on a new isotretinoin prescription but leaves mid-session stating "I already know this." The technician marks counseling complete in the system without noting the incomplete session or pharmacist offer outcome.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Mark counseling complete because the session started",
      "Document that counseling was offered, note the incomplete session and patient response, and ensure required REMS and offer-to-counsel elements are addressed before release",
      "Refuse future fills because the patient walked away",
      "Allow the technician to finalize counseling documentation without pharmacist review"
    ),
    "Document that counseling was offered, note the incomplete session and patient response, and ensure required REMS and offer-to-counsel elements are addressed before release",
    `Incomplete counseling sessions require accurate documentation of offer and response — not automatic completion flags, punitive refusal, or technician-finalized counseling records for REMS drugs.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["offer-to-counsel", "counseling-refusal", "REMS", "documentation", ...PE],
    }
  ),

  // ── Nevada (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 65-year-old patient requests a shingles vaccine at a Las Vegas pharmacy. The pharmacist completed Nevada-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Nevada protocol requirements",
      "Refuse because shingles vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Nevada protocol requirements",
    `Nevada authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Nevada access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NV",
      difficulty: 2,
      references: [NV_REF],
      tags: ["nevada", "immunization", "shingles", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old patient in Reno presents a new prescription for oxycodone 5 mg tablets. Nevada requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Nevada PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with commercial insurance",
      "Query PMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Nevada PMP, document the review, and apply corresponding-responsibility judgment",
    `Nevada requires pharmacists to query and document PMP review before dispensing controlled substances. Insurance status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NV",
      difficulty: 3,
      references: [NV_REF],
      tags: ["nevada", "PMP", "PDMP", ...PE],
    }
  ),

  // ── Utah (2) ──────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests an influenza vaccine at a Salt Lake City pharmacy. The pharmacist completed Utah-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Utah protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Utah protocol requirements",
    `Utah authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 2,
      references: [UT_REF],
      tags: ["utah", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Provo presents a new prescription for tramadol 50 mg tablets. Utah requires Controlled Substance Database (CSD) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Utah CSD, document the review, and apply corresponding-responsibility judgment",
      "Skip CSD review for patients paying cash",
      "Query CSD only for Schedule II drugs, not tramadol",
      "Delegate CSD review and dispensing authorization to a technician"
    ),
    "Query the Utah CSD, document the review, and apply corresponding-responsibility judgment",
    `Utah requires pharmacists to query and document Controlled Substance Database review before dispensing controlled substances. Cash payment does not waive monitoring. Tramadol is controlled under federal and Utah schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 3,
      references: [UT_REF],
      tags: ["utah", "CSD", "PDMP", ...PE],
    }
  ),

  // ── Idaho (2) ─────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient requests a pneumococcal vaccine at a Boise pharmacy. The pharmacist completed Idaho-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Idaho protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Idaho protocol requirements",
    `Idaho authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate Idaho access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 2,
      references: [ID_REF],
      tags: ["idaho", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 46-year-old patient in Idaho Falls presents a new prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Idaho requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Idaho PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with local prescribers",
      "Query PMP only for Schedule II drugs, not hydrocodone combination products",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Idaho PMP, document the review, and apply corresponding-responsibility judgment",
    `Idaho requires pharmacists to query and document PMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 3,
      references: [ID_REF],
      tags: ["idaho", "PMP", "PDMP", ...PE],
    }
  ),
];
