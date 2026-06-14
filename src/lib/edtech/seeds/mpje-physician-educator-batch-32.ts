/**
 * Curated MPJE-style items — physician-educator batch 32.
 * Topics: 340B compliance (deeper), MTM billing documentation, prescriber sample drug rules,
 * pharmacy technician ratio, CA/TX/FL state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-32";
const PE = ["physician-educator", BATCH, "mpje"];

const HRSA_340B = {
  label: "HRSA 340B Drug Pricing Program",
  url: "https://www.hrsa.gov/340b",
};
const CMS_MTM = {
  label: "CMS Medicare Part D Medication Therapy Management (MTM)",
  url: "https://www.cms.gov/medicare/payment/part-d-plans/medication-therapy-management-mtm",
};
const FDA_PDMA = {
  label: "Prescription Drug Marketing Act (PDMA)",
  url: "https://www.fda.gov/drugs/guidance-compliance-regulatory-information/prescription-drug-marketing-act-pdma-and-prescription-drug-amendments-pdaa",
};
const CA_REF = {
  label: "California Pharmacy Practice Act",
  citation: "Bus. & Prof. Code § 4000 et seq.",
};
const TX_REF = {
  label: "Texas Pharmacy Practice Act",
  citation: "Tex. Occ. Code § 551 et seq.",
};
const FL_REF = {
  label: "Florida Pharmacy Practice Act",
  citation: "Fla. Stat. § 465 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_32: EnrichedBankItem[] = [
  // ── 340B Compliance — Deeper (3) ──────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old contract pharmacy dispenses 340B insulin to a covered-entity patient also enrolled in Medicaid. The payer uses an accumulator program that does not credit 340B pricing toward the patient's deductible. Billing staff propose billing Medicaid at undiscounted rates while retaining 340B acquisition savings.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill Medicaid at full price and retain 340B savings without verifying duplicate-discount rules",
      "Verify Medicaid carve-in/carve-out requirements, accumulator policies, and HRSA duplicate-discount prohibitions before 340B billing",
      "Bill all 340B Medicaid claims as cash to avoid payer tracking",
      "Share 340B savings with the patient as a deductible buy-down without payer approval"
    ),
    "Verify Medicaid carve-in/carve-out requirements, accumulator policies, and HRSA duplicate-discount prohibitions before 340B billing",
    `340B Medicaid billing requires compliance with duplicate-discount prohibitions and state Medicaid carve arrangements — not undiscounted billing with retained spread, cash conversion, or unauthorized patient buy-downs.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [HRSA_340B],
      tags: ["340B", "Medicaid", "duplicate-discount", "accumulator", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "340B Medicaid billing requires duplicate-discount and carve-in/carve-out compliance — not undiscounted spread retention.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old covered entity asks its contract pharmacy to ship 340B-acquired specialty medication to a patient's home in another state through a non-contract mail pharmacy to avoid local inventory limits. No individual patient eligibility review is documented.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ship through the non-contract mail pharmacy because the patient is 340B-eligible on intake",
      "Decline diversion outside the contract pharmacy arrangement; ensure 340B dispensing occurs only through compliant contract pathways with documented patient eligibility",
      "Relabel the product as non-340B to simplify interstate shipment",
      "Allow the technician to authorize interstate 340B shipment without documentation"
    ),
    "Decline diversion outside the contract pharmacy arrangement; ensure 340B dispensing occurs only through compliant contract pathways with documented patient eligibility",
    `340B drugs must flow through compliant contract pharmacy arrangements with documented eligibility — not non-contract diversion, relabeling to evade rules, or technician-only authorization without records.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [HRSA_340B],
      tags: ["340B", "contract-pharmacy", "diversion", "eligibility", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old HRSA audit requests three years of 340B replenishment records, accumulator offset policies, and contract pharmacy invoices. The pharmacy can produce invoices but lacks documented policies showing how manufacturer copay assistance interacts with 340B billing on the same claims.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell auditors policies are unnecessary because invoices prove compliance",
      "Provide all retrievable records, document policy gaps, and implement written accumulator and copay-assistance offset procedures per HRSA audit expectations",
      "Destroy incomplete records before the audit visit",
      "Create retroactive policies dated before the audit without actual prior implementation"
    ),
    "Provide all retrievable records, document policy gaps, and implement written accumulator and copay-assistance offset procedures per HRSA audit expectations",
    `HRSA 340B audits require replenishment records and written policies on accumulator and copay-assistance interactions — not invoice-only responses, record destruction, or retroactive policy fabrication.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HRSA_340B],
      tags: ["340B", "audit", "accumulator", "copay-assistance", ...PE],
    }
  ),

  // ── MTM Billing Documentation (3) ─────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 70-year-old Medicare Part D patient declines a comprehensive medication review (CMR) after enrollment outreach but agrees to a brief pickup counseling on a new generic. Corporate staff instruct the pharmacist to bill a CMR because the patient is MTM-eligible.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill a CMR because eligibility alone satisfies CMS requirements",
      "Document the declined CMR and bill only for services actually performed that meet CMS MTM documentation requirements",
      "Bill a targeted MTM and CMR for the same encounter to maximize reimbursement",
      "Allow a technician to submit the CMR claim without pharmacist review"
    ),
    "Document the declined CMR and bill only for services actually performed that meet CMS MTM documentation requirements",
    `MTM billing requires documented eligible services — not eligibility alone, duplicate CMR/TMR billing for one encounter, or technician-submitted pharmacist MTM claims. Declined CMRs must be documented without false billing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "CMR", "billing-compliance", "documentation", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "MTM billing requires documented eligible services — declined CMRs cannot be billed as completed CMRs.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 66-year-old MTM-enrolled patient completes a telephone CMR with the pharmacist. The pharmacist identified two drug therapy problems and communicated one intervention to the prescriber, but no medication action plan or summary was offered or documented as required.`,
    "What is the pharmacist's most appropriate action regarding documentation and billing?",
    opts4(
      "Bill the CMR because the phone call occurred",
      "Complete required CMR documentation including MAP/summary offer and delivery method before billing; do not submit incomplete claims",
      "Bill as targeted MTM instead without documenting the CMR elements",
      "Delete the encounter record if MAP delivery would delay billing"
    ),
    "Complete required CMR documentation including MAP/summary offer and delivery method before billing; do not submit incomplete claims",
    `CMR billing requires documented drug therapy problems, interventions, prescriber communication when applicable, and MAP/summary delivery — not phone contact alone, TMR substitution without elements, or record deletion to force billing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "CMR", "MAP", "billing-compliance", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 74-year-old patient received a documented targeted MTM (TMR) for diabetes therapy six weeks ago. The pharmacist performed another TMR on the same targeted medication today with overlapping drug therapy problems but did not reference the prior TMR in the record before billing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill a second TMR without referencing the prior encounter because each visit is independent",
      "Document the new TMR with linkage to prior problems, resolved and ongoing interventions, and bill only if the service meets CMS distinct-service and documentation requirements",
      "Bill both TMRs for the same quarter without updated documentation",
      "Backdate the prior TMR to a different quarter to allow duplicate billing"
    ),
    "Document the new TMR with linkage to prior problems, resolved and ongoing interventions, and bill only if the service meets CMS distinct-service and documentation requirements",
    `Repeat TMR billing requires updated documentation linking prior and current drug therapy problems and compliance with distinct-service rules — not independent duplicate billing, same-quarter double claims, or backdated records.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "TMR", "targeted-MTM", "billing-compliance", "documentation", ...PE],
    }
  ),

  // ── Prescriber Sample Drug Rules (3) ──────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 49-year-old pharmaceutical representative leaves branded sample cartons of a non-controlled oral medication at the pharmacy counter for "patients who cannot afford copays." No valid prescriptions accompany the samples and the rep asks staff to distribute them during pickup.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense samples to patients without prescriptions to improve access",
      "Decline to distribute prescriber samples without valid prescriptions and proper sample accountability; refer patients to lawful assistance programs or prescriber evaluation",
      "Accept samples and bill insurance for equivalent dispensed product",
      "Allow technicians to distribute samples during busy periods without pharmacist review"
    ),
    "Decline to distribute prescriber samples without valid prescriptions and proper sample accountability; refer patients to lawful assistance programs or prescriber evaluation",
    `Prescription drug samples require prescriber accountability and valid distribution pathways under PDMA and state law — not pharmacy redistribution without prescriptions, insurance billing substitutes, or technician-only sample dispensing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_PDMA],
      tags: ["prescriber-samples", "PDMA", "drug-rep", "distribution", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Pharmacies cannot redistribute prescriber samples without valid prescriptions and proper accountability.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 55-year-old patient brings unlabeled blister packs of a sample antihypertensive from a physician office and asks the pharmacist to "continue the same drug" on refill because the sample worked well. No prescription or sample documentation accompanies the packs.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the same product from stock based on the patient's sample description alone",
      "Decline to dispense from unverified sample packs; contact the prescriber for a valid prescription and document patient counseling on sample limitations",
      "Copy the sample NDC from the blister pack and bill without prescriber contact",
      "Return the sample packs to inventory for future dispensing"
    ),
    "Decline to dispense from unverified sample packs; contact the prescriber for a valid prescription and document patient counseling on sample limitations",
    `Samples are not substitutes for valid prescriptions at community pharmacies. Unlabeled sample packs require prescriber verification and a new prescription — not stock dispensing from patient description, NDC copying, or sample return to resale inventory.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_PDMA],
      tags: ["prescriber-samples", "PDMA", "prescription-validity", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 42-year-old clinic adjacent to the pharmacy asks the pharmacist to store Schedule IV sample benzodiazepine tablets in the pharmacy vault for the physician to distribute. The samples arrived without required sample accountability forms or prescriber signature logs.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Store and dispense the samples from the pharmacy vault to support the clinic",
      "Decline to store or dispense controlled-substance samples without lawful prescriber sample distribution compliance; controlled samples are subject to strict PDMA and DEA requirements",
      "Relabel the samples as OTC sleep aid to avoid controlled-substance rules",
      "Allow the technician to sign sample receipt logs on the prescriber's behalf"
    ),
    "Decline to store or dispense controlled-substance samples without lawful prescriber sample distribution compliance; controlled samples are subject to strict PDMA and DEA requirements",
    `Controlled-substance samples have stringent PDMA and DEA distribution and accountability requirements. Pharmacies cannot store or redistribute clinic CS samples without compliant prescriber sample protocols — not OTC relabeling or technician-signed prescriber logs.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA_PDMA],
      tags: ["prescriber-samples", "PDMA", "controlled-substances", "C-IV", ...PE],
    }
  ),

  // ── Pharmacy Technician Ratio (3) ─────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old telepharmacy site operates with one off-site pharmacist verifying prescriptions by video while two technicians compound non-sterile preparations and release controlled substances without real-time pharmacist observation on site.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow remote verification to replace all on-site pharmacist supervision because video satisfies state law in every jurisdiction",
      "Ensure telepharmacy operations comply with state-specific pharmacist presence, ratio, and verification requirements before technicians compound or release controlled substances",
      "Eliminate pharmacist verification for non-controlled prescriptions only",
      "Delegate controlled-substance release to the senior technician during video verification"
    ),
    "Ensure telepharmacy operations comply with state-specific pharmacist presence, ratio, and verification requirements before technicians compound or release controlled substances",
    `Telepharmacy does not universally waive on-site supervision and ratio rules. Pharmacists must comply with state-specific presence and verification requirements — not assume video replaces all supervision or delegate CS release to technicians.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["technician-ratio", "telepharmacy", "supervision", "verification", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Telepharmacy must comply with state-specific pharmacist presence and supervision rules — video alone may not suffice.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 51-year-old PIC schedules three technicians and one pharmacist for the morning shift. One technician's state registration expired yesterday but continues performing data entry, counting, and patient pickup counseling on drug interactions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the expired technician to work because renewal is pending",
      "Remove the technician from regulated tasks until registration is active, adjust staffing to maintain ratio compliance, and ensure only qualified personnel perform technician functions",
      "Reclassify the technician as a cashier to continue all pharmacy tasks without registration",
      "Have the technician sign prescriptions under the pharmacist's name to maintain workflow"
    ),
    "Remove the technician from regulated tasks until registration is active, adjust staffing to maintain ratio compliance, and ensure only qualified personnel perform technician functions",
    `Expired technician registration prohibits regulated pharmacy tasks. Staffing must maintain ratio compliance with qualified personnel — not pending-renewal workarounds, cashier reclassification with full duties, or proxy prescriber signing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["technician-ratio", "registration", "supervision", "staffing", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 39-year-old pharmacy opens at 7 a.m. with one certified technician alone for the first hour before the pharmacist arrives. The technician has been dispensing refills and accepting new prescriptions during this period.`,
    "What is the pharmacist's most appropriate action upon arrival?",
    opts4(
      "Allow the practice to continue because early-hour volume is low",
      "Stop unsupervised dispensing immediately, review all transactions processed without pharmacist oversight, and ensure future schedules comply with pharmacist-on-duty requirements",
      "Retroactively sign all technician actions without review at end of day",
      "Report the patients to the board for receiving early medications"
    ),
    "Stop unsupervised dispensing immediately, review all transactions processed without pharmacist oversight, and ensure future schedules comply with pharmacist-on-duty requirements",
    `Pharmacist-on-duty requirements prohibit unsupervised technician dispensing regardless of volume or early hours. Immediate cessation, transaction review, and schedule correction — not continued practice, blind retroactive signing, or patient reporting — are required.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["technician-ratio", "supervision", "pharmacist-on-duty", "staffing", ...PE],
    }
  ),

  // ── California (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests an influenza vaccine at a San Diego pharmacy. The pharmacist completed California-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per California protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per California protocol requirements",
    `California authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate California access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CA",
      difficulty: 2,
      references: [CA_REF],
      tags: ["california", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient in Sacramento picks up a new prescription at a community pharmacy. California aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `California community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CA",
      difficulty: 2,
      references: [CA_REF],
      tags: ["california", "offer-to-counsel", ...PE],
    }
  ),

  // ── Texas (2) ─────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old patient requests a pneumococcal vaccine at a Houston pharmacy. The pharmacist completed Texas-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Texas protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Texas protocol requirements",
    `Texas authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TX",
      difficulty: 2,
      references: [TX_REF],
      tags: ["texas", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 47-year-old pharmacist licensed in Oklahoma begins dispensing at an Austin community pharmacy before obtaining a Texas pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Texas licensure?",
    opts4(
      "Continue dispensing under the Oklahoma license until Texas approves",
      "Obtain a Texas pharmacist license before practicing in the state",
      "Register with DEA only and defer Texas board licensure",
      "Work as a pharmacy intern indefinitely without Texas licensure"
    ),
    "Obtain a Texas pharmacist license before practicing in the state",
    `Texas requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Texas pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TX",
      difficulty: 2,
      references: [TX_REF],
      tags: ["texas", "licensure", ...PE],
    }
  ),

  // ── Florida (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests a shingles vaccine at a Miami pharmacy. The pharmacist completed Florida-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Florida protocol requirements",
      "Refuse because shingles vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Florida protocol requirements",
    `Florida authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate Florida access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "FL",
      difficulty: 2,
      references: [FL_REF],
      tags: ["florida", "immunization", "shingles", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 72-year-old patient in Orlando picks up a new prescription at a community pharmacy. Florida aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Florida community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "FL",
      difficulty: 2,
      references: [FL_REF],
      tags: ["florida", "offer-to-counsel", ...PE],
    }
  ),
];
