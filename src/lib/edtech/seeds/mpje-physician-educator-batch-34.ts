/**
 * Curated MPJE-style items — physician-educator batch 34.
 * Topics: Ryan Haight telemedicine (deeper), DSCSA saleable returns, board consent agreements,
 * emergency maintenance supply, VA/NC/SC state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-34";
const PE = ["physician-educator", BATCH, "mpje"];

const RYAN_HAIGHT = {
  label: "Ryan Haight Online Pharmacy Consumer Protection Act",
  url: "https://www.dea.gov/press-releases/2023/05/09/dea-announces-extension-telemedicine-flexibilities",
};
const DSCSA = {
  label: "Drug Supply Chain Security Act (DSCSA)",
  url: "https://www.fda.gov/drugs/drug-supply-chain-integrity/drug-supply-chain-security-act-dscsa",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const VA_REF = {
  label: "Virginia Pharmacy Practice Act",
  citation: "Va. Code § 54.1-3300 et seq.",
};
const NC_REF = { label: "North Carolina Pharmacy Practice Act", citation: "N.C.G.S. § 90-85 et seq." };
const SC_REF = {
  label: "South Carolina Pharmacy Practice Act",
  citation: "S.C. Code § 40-43 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_34: EnrichedBankItem[] = [
  // ── Ryan Haight Telemedicine — Deeper (3) ─────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 47-year-old patient presents an EPCS prescription for buprenorphine/naloxone film from a telehealth addiction clinic in another state. The patient had one in-person evaluation three years ago but all subsequent visits are audio-only. The pharmacist must determine whether Ryan Haight requirements are met.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because a prior in-person evaluation permanently satisfies Ryan Haight",
      "Verify current federal and state Ryan Haight and telemedicine rules, including whether an established relationship and applicable exceptions authorize the prescription before dispensing",
      "Dispense if the patient signed a telehealth consent form",
      "Refuse all buprenorphine telehealth prescriptions regardless of documentation"
    ),
    "Verify current federal and state Ryan Haight and telemedicine rules, including whether an established relationship and applicable exceptions authorize the prescription before dispensing",
    `Ryan Haight and evolving telemedicine rules require verification of current in-person evaluation and exception requirements — not indefinite reliance on old in-person visits, consent forms alone, or blanket refusal without review.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "telemedicine", "telehealth", "buprenorphine", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Ryan Haight requires verification of current telemedicine rules — prior in-person visits alone may not suffice indefinitely.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 39-year-old patient vacationing in Virginia presents a Schedule IV clonazepam prescription from their established Texas psychiatrist via telehealth video visit. The prescriber holds Texas licensure and DEA registration but is not licensed in Virginia. The patient has an documented ongoing treatment relationship.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because telehealth automatically authorizes interstate controlled-substance prescribing",
      "Verify prescriber authority to treat the patient in Virginia, applicable Ryan Haight and telemedicine exceptions, and state licensure requirements before dispensing",
      "Require the patient to obtain a new prescription only from a Virginia prescriber regardless of telehealth law",
      "Dispense a 90-day supply to reduce future interstate telehealth visits"
    ),
    "Verify prescriber authority to treat the patient in Virginia, applicable Ryan Haight and telemedicine exceptions, and state licensure requirements before dispensing",
    `Interstate telehealth controlled substance prescriptions require verification of prescriber authority in the patient's location state and Ryan Haight compliance — not automatic telehealth authorization, universal in-state prescriber mandates, or extended supplies without valid authorization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "telemedicine", "interstate", "C-IV", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 56-year-old patient requests dispensing of tramadol 50 mg tablets prescribed through a telehealth platform after an asynchronous chat review with no live video or audio encounter. The platform claims a public health emergency waiver applies indefinitely.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because asynchronous telehealth satisfies Ryan Haight when a waiver is claimed",
      "Verify whether current federal telemedicine flexibilities and Ryan Haight requirements authorize asynchronous prescribing for this controlled substance before dispensing",
      "Dispense if the patient pays cash to avoid regulatory questions",
      "Transfer the prescription to an online pharmacy in the prescriber's home state"
    ),
    "Verify whether current federal telemedicine flexibilities and Ryan Haight requirements authorize asynchronous prescribing for this controlled substance before dispensing",
    `Asynchronous telehealth and claimed indefinite waivers do not automatically authorize controlled substance prescribing. Pharmacists must verify current Ryan Haight and DEA telemedicine rules — not cash payment or out-of-state transfer to evade verification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "telemedicine", "asynchronous", "tramadol", ...PE],
    }
  ),

  // ── DSCSA Saleable Returns — Deeper (3) ───────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old PIC prepares a saleable return shipment to the primary wholesaler. Two serialized units in the tote were drop-shipped directly from a manufacturer hub and never scanned into the pharmacy's inventory system, though the product is unopened and within expiration.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include the units in the saleable return because packaging is intact",
      "Reconcile drop-shipment tracing data, document receipt in inventory, and include units in saleable returns only with complete DSCSA transaction history",
      "Donate the units to staff to avoid tracing reconciliation",
      "Return the units to the manufacturer hub without transaction statements"
    ),
    "Reconcile drop-shipment tracing data, document receipt in inventory, and include units in saleable returns only with complete DSCSA transaction history",
    `Drop-shipped products require tracing reconciliation before saleable return — intact packaging alone does not cure missing transaction history. Staff diversion or returns without statements violate DSCSA.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "drop-shipment", "tracing", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Drop-shipped products require tracing reconciliation before DSCSA saleable return.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old pharmacy uses a third-party reverse-logistics vendor to process saleable returns. The vendor proposes accepting returns without pharmacy review of transaction statements and shipping mismatched serial numbers as "administrative exceptions."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Delegate all DSCSA return compliance to the vendor without pharmacy oversight",
      "Maintain pharmacist oversight of saleable returns, require complete transaction information, and quarantine serial mismatches per DSCSA before release to the vendor",
      "Allow the vendor to obscure serial numbers to speed credit processing",
      "Discard mismatched units in regular trash to avoid vendor delays"
    ),
    "Maintain pharmacist oversight of saleable returns, require complete transaction information, and quarantine serial mismatches per DSCSA before release to the vendor",
    `Third-party reverse logistics does not eliminate pharmacy DSCSA accountability. Vendor shortcuts, obscured serial numbers, and unreviewed returns violate supply chain integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "reverse-logistics", "vendor", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old pharmacist discovers that a saleable return tote includes one unit from a lot the wholesaler flagged for enhanced verification due to a prior suspect-product inquiry. The unit passes visual inspection and is within expiration.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include the unit in the saleable return because visual inspection is normal",
      "Quarantine the flagged lot unit, complete enhanced verification and investigation per DSCSA, and exclude it from saleable returns until resolved",
      "Repackage the unit with a different lot label to match tracing records",
      "Sell the unit at discount to patients before the return deadline"
    ),
    "Quarantine the flagged lot unit, complete enhanced verification and investigation per DSCSA, and exclude it from saleable returns until resolved",
    `Wholesaler-flagged lots require quarantine and enhanced verification — not inclusion in saleable returns based on appearance, relabeling, or discount dispensing to avoid investigation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "suspect-product", "enhanced-verification", ...PE],
    }
  ),

  // ── Board Consent Agreements — Deeper (3) ─────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 51-year-old pharmacist on a board consent order requiring monthly substance monitoring and quarterly board reports discovers a dispensing error involving the wrong strength dispensed to a patient. No harm occurred but the error was not previously reported.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Document internally only because no patient harm occurred",
      "Notify the patient and prescriber as indicated, document the error, and self-report to the board and practice monitor per consent order requirements",
      "Wait until the next quarterly report to mention the error",
      "Ask the technician to sign the error report as the responsible pharmacist"
    ),
    "Notify the patient and prescriber as indicated, document the error, and self-report to the board and practice monitor per consent order requirements",
    `Consent orders typically require self-reporting of practice incidents beyond routine error logs. Internal-only documentation, delayed quarterly reporting, or technician proxy signing violate board agreement obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "consent-agreement", "self-reporting", "medication-error", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Consent orders require self-reporting of dispensing errors — internal documentation alone is insufficient.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 44-year-old pharmacist's board consent agreement requires completion of four hours of board-approved ethics CE within 60 days. The pharmacist completed generic CE online that is not board-approved and the deadline is in five days.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Submit the generic CE because any ethics content satisfies consent orders",
      "Complete board-approved ethics CE within the deadline and submit required documentation to the board monitor",
      "Request the employer to backdate attendance at an unrelated in-service",
      "Ignore the CE requirement because the consent order is nearly complete"
    ),
    "Complete board-approved ethics CE within the deadline and submit required documentation to the board monitor",
    `Consent order CE requirements specify board-approved content and deadlines — not generic CE substitution, backdated attendance, or ignored remaining conditions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["board-discipline", "consent-agreement", "continuing-education", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 53-year-old pharmacist on probation with a consent order requiring an on-site practice monitor during all compounding shifts is scheduled alone to compound non-sterile hormone preparations because the monitor called in sick.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Compound alone because the monitor's absence is temporary",
      "Defer compounding until the required practice monitor is present or obtain board approval for modified supervision per the consent order",
      "Have the technician serve as the practice monitor",
      "Compound without documentation to avoid board scrutiny"
    ),
    "Defer compounding until the required practice monitor is present or obtain board approval for modified supervision per the consent order",
    `Consent order supervision requirements are binding — temporary monitor absence does not authorize unsupervised compounding. Technicians cannot serve as board-appointed monitors, and undocumented compounding violates probation terms.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "consent-agreement", "probation", "compounding", ...PE],
    }
  ),

  // ── Emergency Maintenance Supply (3) ────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 62-year-old patient with type 2 diabetes runs out of insulin glargine pens on Saturday morning. The prescriber's office is closed until Monday. The patient has a stable dose history with exhausted refills on the profile. State law permits limited emergency maintenance supplies.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse any supply without a new prescription because insulin is high-risk",
      "Provide a limited emergency supply per applicable state protocol with documentation and prescriber follow-up",
      "Dispense a 90-day supply using a different insulin product without prescriber contact",
      "Loan insulin from another patient's will-call bin"
    ),
    "Provide a limited emergency supply per applicable state protocol with documentation and prescriber follow-up",
    `Many states authorize limited emergency maintenance supplies for essential medications including insulin when prescriber contact is temporarily impossible — with documentation and follow-up. Blanket refusal, therapeutic substitution without authorization, or borrowing from other patients violate professional and legal standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-supply", "emergency-refill", "insulin", "maintenance-med", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Limited emergency maintenance supply may be authorized for essential drugs like insulin when prescriber contact is temporarily impossible.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old patient on phenytoin 100 mg three times daily for seizure disorder lost medication while traveling. The patient requests an emergency supply until returning home in four days. Refills remain on the valid prescription but the patient cannot reach the prescriber until next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because the patient should have planned travel supplies",
      "Provide a limited emergency quantity if permitted by state law and pharmacy policy, document the supply, and ensure prescriber follow-up",
      "Dispense the full remaining refill quantity without documentation",
      "Substitute phenobarbital without prescriber authorization because it is also an anticonvulsant"
    ),
    "Provide a limited emergency quantity if permitted by state law and pharmacy policy, document the supply, and ensure prescriber follow-up",
    `Emergency maintenance supply protocols may authorize limited anticonvulsant quantities when continuity is essential and prescriber contact is delayed — not patient-blame refusal, full refill without documentation, or unilateral therapeutic substitution.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-supply", "emergency-refill", "anticonvulsant", "maintenance-med", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 70-year-old patient on chronic carvedilol 12.5 mg twice daily presents on Sunday evening without medication after a pharmacy system outage prevented refill processing Friday. The prescriber's on-call line is not answering. State law allows pharmacist emergency supply for non-controlled maintenance medications.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because the outage was the pharmacy's fault not the patient's",
      "Provide a limited emergency supply per state protocol if authorized, document the reason and quantity, and follow up with the prescriber",
      "Dispense a one-year supply to prevent future outages",
      "Bill the patient cash at triple the usual copay as an emergency fee"
    ),
    "Provide a limited emergency supply per state protocol if authorized, document the reason and quantity, and follow up with the prescriber",
    `Pharmacist emergency maintenance supply authority focuses on patient continuity when prescriber contact is temporarily unavailable — not blame-based refusal, excessive quantities, or punitive emergency fees beyond lawful cost sharing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["emergency-supply", "emergency-refill", "maintenance-med", "carvedilol", ...PE],
    }
  ),

  // ── Virginia (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient requests a pneumococcal vaccine at a Richmond pharmacy. The pharmacist completed Virginia-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Virginia protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Virginia protocol requirements",
    `Virginia authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VA",
      difficulty: 2,
      references: [VA_REF],
      tags: ["virginia", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 46-year-old pharmacist licensed in West Virginia begins dispensing at a Norfolk community pharmacy before obtaining a Virginia pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Virginia licensure?",
    opts4(
      "Continue dispensing under the West Virginia license until Virginia approves",
      "Obtain a Virginia pharmacist license before practicing in the state",
      "Register with DEA only and defer Virginia board licensure",
      "Work as a pharmacy intern indefinitely without Virginia licensure"
    ),
    "Obtain a Virginia pharmacist license before practicing in the state",
    `Virginia requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Virginia pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VA",
      difficulty: 2,
      references: [VA_REF],
      tags: ["virginia", "licensure", ...PE],
    }
  ),

  // ── North Carolina (2) ────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Raleigh presents a new prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. North Carolina requires CSRS (Controlled Substances Reporting System) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query CSRS, document the review, and apply corresponding-responsibility judgment",
      "Skip CSRS for patients paying with commercial insurance",
      "Query CSRS only for Schedule II drugs, not hydrocodone combination products",
      "Delegate CSRS review and dispensing authorization to a technician"
    ),
    "Query CSRS, document the review, and apply corresponding-responsibility judgment",
    `North Carolina requires pharmacists to query and document CSRS review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NC",
      difficulty: 3,
      references: [NC_REF],
      tags: ["north-carolina", "CSRS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Charlotte picks up a new prescription at a community pharmacy. North Carolina aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `North Carolina community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NC",
      difficulty: 2,
      references: [NC_REF],
      tags: ["north-carolina", "offer-to-counsel", ...PE],
    }
  ),

  // ── South Carolina (2) ────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests a shingles vaccine at a Charleston pharmacy. The pharmacist completed South Carolina-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per South Carolina protocol requirements",
      "Refuse because shingles vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per South Carolina protocol requirements",
    `South Carolina authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate South Carolina access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SC",
      difficulty: 2,
      references: [SC_REF],
      tags: ["south-carolina", "immunization", "shingles", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 43-year-old pharmacist licensed in Georgia begins dispensing at a Columbia community pharmacy before obtaining a South Carolina pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding South Carolina licensure?",
    opts4(
      "Continue dispensing under the Georgia license until South Carolina approves",
      "Obtain a South Carolina pharmacist license before practicing in the state",
      "Register with DEA only and defer South Carolina board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a South Carolina pharmacist license before practicing in the state",
    `South Carolina requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate South Carolina pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SC",
      difficulty: 2,
      references: [SC_REF],
      tags: ["south-carolina", "licensure", ...PE],
    }
  ),
];
