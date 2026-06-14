/**
 * Curated MPJE-style items — physician-educator batch 24.
 * Topics: DSCSA saleable returns (deeper), emergency contraception / hormonal access,
 * compounding BUD audits, pharmacy record retention / e-prescribing, AZ/NM/UT state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-24";
const PE = ["physician-educator", BATCH, "mpje"];

const DSCSA = {
  label: "Drug Supply Chain Security Act (DSCSA)",
  url: "https://www.fda.gov/drugs/drug-supply-chain-integrity/drug-supply-chain-security-act-dscsa",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const EPCS = {
  label: "DEA Electronic Prescriptions for Controlled Substances (21 CFR Part 1311)",
  url: "https://www.dea.gov/drug-information/drug-scheduling/electronic-prescriptions-controlled-substances",
};
const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };
const AZ_REF = {
  label: "Arizona State Board of Pharmacy",
  citation: "A.R.S. § 32-1901 et seq.",
};
const NM_REF = {
  label: "New Mexico Pharmacy Practice Act",
  citation: "N.M. Stat. § 61-11-1 et seq.",
};
const UT_REF = {
  label: "Utah Pharmacy Practice Act",
  citation: "Utah Code § 58-17b-101 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_24: EnrichedBankItem[] = [
  // ── DSCSA Saleable Returns — Deeper (3) ───────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 54-year-old patient returns two unopened serialized inhalers purchased last week because of insurance billing issues. The manager asks to include them in the next wholesaler saleable return shipment for full credit without verifying whether patient returns qualify as saleable under DSCSA.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include patient returns in the saleable return shipment if seals are intact",
      "Treat patient returns separately from saleable wholesaler returns; quarantine, document, and follow DSCSA and pharmacy policy — do not restock or return to wholesale as saleable without compliant tracing",
      "Restock the inhalers on the shelf immediately because they are unopened",
      "Discard patient returns in regular trash to avoid paperwork"
    ),
    "Treat patient returns separately from saleable wholesaler returns; quarantine, document, and follow DSCSA and pharmacy policy — do not restock or return to wholesale as saleable without compliant tracing",
    `Patient returns generally cannot be processed as DSCSA saleable wholesaler returns without proper tracing and policy. Intact seals do not authorize automatic restock or saleable return credit. Quarantine and documented disposition protect supply chain integrity.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "patient-returns", "quarantine", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Patient returns are not automatic saleable wholesaler returns — quarantine and trace before restock or credit.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 49-year-old PIC receives a saleable return request from a secondary distributor that is not the pharmacy's authorized trading partner for the serialized product lot. The distributor offers higher credit than the primary wholesaler if tracing paperwork is omitted.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ship saleable returns to the higher-credit distributor without transaction statements",
      "Return saleable product only to authorized trading partners with required DSCSA transaction information and statements",
      "Relabel products to obscure serial numbers before shipping",
      "Donate saleable returns to staff to avoid tracing requirements"
    ),
    "Return saleable product only to authorized trading partners with required DSCSA transaction information and statements",
    `DSCSA saleable returns require authorized trading partner relationships and complete transaction information — not higher-credit unauthorized distributors, serial number obscuring, or staff diversion to avoid tracing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "trading-partner", "transaction-statement", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 57-year-old pharmacist preparing a saleable return discovers three serialized units from a lot subject to an FDA investigation for suspect product. Enhanced verification fails for one unit in the return tote.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include all units in the saleable return to avoid inventory loss",
      "Quarantine failed-verification and investigation-linked units, investigate per DSCSA suspect product procedures, and do not include them in saleable returns until resolved",
      "Ship the failed unit with a note explaining the software error",
      "Repackage failed units into non-serialized bottles for internal use"
    ),
    "Quarantine failed-verification and investigation-linked units, investigate per DSCSA suspect product procedures, and do not include them in saleable returns until resolved",
    `Failed enhanced verification and investigation-linked lots require quarantine and suspect product procedures — not inclusion in saleable returns, explanatory notes without investigation, or repackaging to bypass serialization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "suspect-product", "enhanced-verification", ...PE],
    }
  ),

  // ── Emergency Contraception / Hormonal Access (3) ───────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 22-year-old patient requests OTC levonorgestrel 1.5 mg emergency contraception 68 hours after unprotected intercourse. The patient asks whether timing still matters and whether a prescription is required.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because emergency contraception always requires a prescription",
      "Counsel on time-sensitive efficacy, verify OTC eligibility, dispense or facilitate access as appropriate, and document counseling",
      "Tell the patient timing does not matter after 24 hours",
      "Dispense a 30-day supply of oral contraceptive pills as automatic substitute without assessment"
    ),
    "Counsel on time-sensitive efficacy, verify OTC eligibility, dispense or facilitate access as appropriate, and document counseling",
    `Levonorgestrel emergency contraception is OTC for eligible patients with time-sensitive efficacy counseling. Prescription-only refusal, false timing advice, or unassessed substitution violate access and counseling standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["emergency-contraception", "levonorgestrel", "OTC", "counseling", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "EC counseling must address time-sensitive efficacy — levonorgestrel OTC access requires appropriate counseling.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 29-year-old patient presents a prescription for ulipristal acetate emergency contraception 96 hours after unprotected intercourse. The patient already took OTC levonorgestrel at 48 hours without effect.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense another levonorgestrel dose because it is interchangeable at any hour",
      "Review timing and prior EC use, dispense ulipristal as prescribed if appropriate, and counsel on efficacy windows and follow-up care",
      "Refuse because the patient already used EC once",
      "Dispense ulipristal without counseling because it is a single tablet"
    ),
    "Review timing and prior EC use, dispense ulipristal as prescribed if appropriate, and counsel on efficacy windows and follow-up care",
    `Ulipristal and levonorgestrel have distinct efficacy windows and use considerations after prior EC. Repeat levonorgestrel substitution, refusal after prior EC, or dispensing without counseling fail clinical and professional standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-contraception", "ulipristal", "counseling", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 34-year-old patient requests hormonal contraceptive initiation at a pharmacy operating under a state-approved pharmacist protocol with prescriber oversight. The pharmacist completed required training but has not documented patient screening or consent.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense contraception immediately because protocol authority eliminates documentation",
      "Complete protocol-required screening, consent, and documentation before initiating hormonal contraception under pharmacist authority",
      "Require an emergency department visit for every contraceptive request",
      "Allow a technician to select the product without pharmacist assessment"
    ),
    "Complete protocol-required screening, consent, and documentation before initiating hormonal contraception under pharmacist authority",
    `Pharmacist contraceptive initiation under protocol requires screening, consent, and documentation — not protocol authority without records, universal ED referral, or technician-only product selection.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["hormonal-contraception", "protocol", "consent", "documentation", ...PE],
    }
  ),

  // ── Compounding BUD Audits (3) ────────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 51-year-old board inspector finds three non-sterile compounded oral suspensions on the shelf labeled with beyond-use dates that expired five days ago. Staff propose relabeling with new dates because the products look unchanged.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Relabel with new beyond-use dates because appearance is unchanged",
      "Remove expired compounded products from dispensing, document the inspection finding, and prepare replacements with compliant BUD assignment and records",
      "Sell expired compounds at a discount to reduce waste",
      "Move expired products to the employee break room for personal use"
    ),
    "Remove expired compounded products from dispensing, document the inspection finding, and prepare replacements with compliant BUD assignment and records",
    `Compounded products may not be dispensed beyond labeled BUD regardless of appearance. Relabeling, discount sales, or employee diversion violate USP <795> and board compounding standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["BUD", "USP-795", "inspection", "compounding-audit", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Expired BUD compounds must be removed — relabeling past BUD is prohibited regardless of appearance.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 46-year-old compounding pharmacist assigned a 90-day beyond-use date to a non-sterile topical preparation citing a competitor pharmacy label. An auditor requests stability data supporting the extended dating beyond default USP <795> category limits.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Provide the competitor's label as sufficient stability evidence",
      "Produce valid supporting stability data for extended BUD or reassign dating within default <795> category limits with corrected records",
      "Delete compounding records to match the 90-day label",
      "Argue that topical products never require BUD documentation"
    ),
    "Produce valid supporting stability data for extended BUD or reassign dating within default <795> category limits with corrected records",
    `Extended BUD beyond default USP <795> limits requires supporting stability data — not competitor labels, record deletion, or claims that BUD documentation is optional.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["BUD", "USP-795", "stability", "compounding-audit", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 58-year-old inspector reviews compounding records and finds a sterile ophthalmic preparation labeled with a 180-day room-temperature beyond-use date using non-sterile USP <795> default limits. The batch was prepared in a non-compliant counseling area.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Defend the BUD because the product is preservative-containing",
      "Recognize the misapplication of non-sterile BUD standards to sterile compounding, quarantine the batch, and follow USP <797> and board requirements for sterile dating and facility standards",
      "Extend BUD to one year because ophthalmic drops are stable commercially",
      "Continue dispensing while updating the label next month"
    ),
    "Recognize the misapplication of non-sterile BUD standards to sterile compounding, quarantine the batch, and follow USP <797> and board requirements for sterile dating and facility standards",
    `Sterile compounding requires USP <797> BUD and facility standards — not <795> default limits, commercial stability extrapolation, or continued dispensing from non-compliant areas.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["BUD", "USP-795", "USP-797", "compounding-audit", "sterile", ...PE],
    }
  ),

  // ── Record Retention / E-Prescribing (3) ──────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 62-year-old board auditor requests electronic prescription records and EPCS audit trails for Schedule II hydrocodone dispensing from four years ago. The pharmacy migrated software and partial archives were deleted after two years per an outdated retention policy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the auditor deleted records are unrecoverable and end the inquiry",
      "Provide all retrievable e-prescription and dispensing records, document gaps honestly, and implement compliant retention policies meeting federal and state requirements",
      "Recreate deleted e-prescriptions from memory to satisfy the auditor",
      "Blame the software vendor and refuse further cooperation"
    ),
    "Provide all retrievable e-prescription and dispensing records, document gaps honestly, and implement compliant retention policies meeting federal and state requirements",
    `Electronic prescription and controlled substance records must be retained per federal and state requirements — often longer than two years. Honest gap documentation and policy correction — not inquiry termination, fabricated records, or vendor blame alone — satisfy audit obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [EPCS],
      tags: ["e-prescribing", "record-retention", "EPCS", "audit", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "E-prescription and CS records require compliant retention — gaps must be documented honestly, not recreated.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 55-year-old pharmacist dispenses a partial fill of an EPCS Schedule III prescription. The dispensing software records the quantity dispensed but staff did not document the partial fill notation required on the electronic record and patient profile per DEA expectations.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave the record unchanged because the patient received medication",
      "Correct and document the partial fill on the electronic prescription record and patient profile per DEA and state partial-fill requirements",
      "Convert the remainder to a new cash prescription without prescriber contact",
      "Delete the EPCS record and rely on paper notes only"
    ),
    "Correct and document the partial fill on the electronic prescription record and patient profile per DEA and state partial-fill requirements",
    `Partial fills of electronically prescribed controlled substances require documentation on the electronic record — not silent dispensing, cash conversion without authorization, or deletion of EPCS audit trails.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [EPCS, DEA],
      tags: ["e-prescribing", "EPCS", "partial-fill", "record-retention", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 48-year-old pharmacy uses a hybrid workflow storing some controlled substance prescriptions only as scanned PDFs without linked EPCS metadata. A DEA inspection requests searchable audit trails for altered quantity fields on three e-prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Provide PDF scans only because they show the same drug names",
      "Maintain and produce searchable EPCS audit trails and linked dispensing records; remediate hybrid workflows that lack required electronic integrity data",
      "Print new PDFs with corrected quantities to match dispensing",
      "Refuse inspection because PDF storage is industry standard"
    ),
    "Maintain and produce searchable EPCS audit trails and linked dispensing records; remediate hybrid workflows that lack required electronic integrity data",
    `EPCS requires searchable audit trails demonstrating prescription integrity — PDF scans alone may be insufficient. Fabricated PDFs or inspection refusal violate DEA Part 1311 record and integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [EPCS],
      tags: ["e-prescribing", "EPCS", "audit-trail", "record-retention", ...PE],
    }
  ),

  // ── Arizona (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Phoenix picks up a new prescription for a high-risk medication. Arizona community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Arizona community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AZ",
      difficulty: 2,
      references: [AZ_REF],
      tags: ["arizona", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient requests an influenza vaccine at a Tucson pharmacy. The pharmacist holds valid Arizona immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Arizona protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Arizona protocol requirements",
    `Arizona authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Arizona access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AZ",
      difficulty: 2,
      references: [AZ_REF],
      tags: ["arizona", "immunization", "influenza", ...PE],
    }
  ),

  // ── New Mexico (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient requests a shingles vaccine at an Albuquerque pharmacy. The pharmacist completed New Mexico-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per New Mexico protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per New Mexico protocol requirements",
    `New Mexico authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NM",
      difficulty: 2,
      references: [NM_REF],
      tags: ["new-mexico", "immunization", "shingles", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 70-year-old patient in Santa Fe picks up a new prescription at a community pharmacy. New Mexico aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `New Mexico community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NM",
      difficulty: 2,
      references: [NM_REF],
      tags: ["new-mexico", "offer-to-counsel", ...PE],
    }
  ),

  // ── Utah (2) ──────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests a pneumococcal vaccine at a Salt Lake City pharmacy. The pharmacist holds valid Utah immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Utah protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist counts inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Utah protocol requirements",
    `Utah authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 2,
      references: [UT_REF],
      tags: ["utah", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 65-year-old patient in Provo picks up a new prescription at a community pharmacy. Utah aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Utah community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 2,
      references: [UT_REF],
      tags: ["utah", "offer-to-counsel", ...PE],
    }
  ),
];
