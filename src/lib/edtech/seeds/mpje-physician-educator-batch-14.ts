/**
 * Curated MPJE-style items — physician-educator batch 14.
 * Topics: prescriber validity red flags, non-CS partial fills, PBM DIR fees,
 * workplace harassment/reporting, NM/WY/ND state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-14";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const CMS = {
  label: "CMS Medicare Part D / DIR Fee Guidance",
  url: "https://www.cms.gov",
};
const NM_REF = {
  label: "New Mexico Pharmacy Act",
  citation: "NMSA § 61-11-1 et seq.",
};
const WY_REF = {
  label: "Wyoming Pharmacy Act",
  citation: "Wyo. Stat. § 33-24-101 et seq.",
};
const ND_REF = {
  label: "North Dakota Pharmacy Practice Act",
  citation: "N.D. Cent. Code § 19-03.1-01 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_14: EnrichedBankItem[] = [
  // ── Prescriber Validity Red Flags (3) ───────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 57-year-old patient presents a handwritten prescription for hydrocodone 5 mg/acetaminophen 325 mg dated yesterday. The pharmacist's verification system shows the prescriber's medical license was revoked two weeks ago for unrelated reasons, though the DEA number still appears in an outdated directory.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the DEA number validates and the prescription is recent",
      "Withhold dispensing, verify prescriber licensure and authority through current board and DEA sources, and resolve before dispensing",
      "Dispense a 3-day supply while waiting for prescriber reinstatement",
      "Accept the prescription if the patient has filled from this prescriber for years"
    ),
    "Withhold dispensing, verify prescriber licensure and authority through current board and DEA sources, and resolve before dispensing",
    `Corresponding responsibility requires current prescriber authority — not outdated DEA listings or prior fill history. Revoked licensure generally invalidates prescribing authority. Arbitrary short supplies without verification do not cure invalid orders.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescriber-validity", "red-flags", "corresponding-responsibility", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Revoked prescriber licensure invalidates the order — verify current authority before dispensing.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 43-year-old patient presents a prescription for amoxicillin 500 mg capsules dated five days in the future. The patient claims the prescriber intended it to start after a procedure next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense immediately because the patient needs the antibiotic soon",
      "Refuse to dispense before the effective date on the prescription unless law permits early dispensing with prescriber authorization",
      "Change the date on the prescription to today",
      "Dispense half the quantity and hold the rest without prescriber contact"
    ),
    "Refuse to dispense before the effective date on the prescription unless law permits early dispensing with prescriber authorization",
    `Post-dated prescriptions may not be filled before the written date absent specific authorization. Early dispensing, date alteration, or silent partial dispensing violate prescription validity and fraud rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["prescriber-validity", "red-flags", "post-dated", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 62-year-old patient presents a controlled-substance prescription on plain paper without security features. The prescriber's office phone number on the Rx connects to an unrelated business. The patient insists the prescriber is legitimate.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense to avoid delaying pain therapy",
      "Withhold dispensing, independently verify the prescriber and prescription authenticity per policy, and report suspected forgery if confirmed",
      "Call local police on every patient requesting controlled substances",
      "Post the patient's name in the store to warn other pharmacies"
    ),
    "Withhold dispensing, independently verify the prescriber and prescription authenticity per policy, and report suspected forgery if confirmed",
    `Multiple validity red flags require prescriber verification before dispensing — not passive dispensing, automatic police contact for all CS patients, or public patient shaming.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescriber-validity", "red-flags", "forgery", ...PE],
    }
  ),

  // ── Partial Fills — Non-Controlled (3) ────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 71-year-old patient on a fixed income requests a 30-day partial fill of a valid 90-day non-controlled lisinopril 20 mg prescription because they cannot pay for the full quantity today. Refills remain and state law permits documented partial fills.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse any partial fill of non-controlled maintenance medications",
      "Dispense the requested partial quantity if permitted by state law, document the partial fill, and retain the remaining authorized quantity on the prescription record",
      "Require a new prescription for every partial quantity",
      "Dispense the full 90-day supply and bill the patient later informally"
    ),
    "Dispense the requested partial quantity if permitted by state law, document the partial fill, and retain the remaining authorized quantity on the prescription record",
    `Many states permit documented partial fills of non-controlled medications when the prescription balance remains. Blanket refusal, unnecessary new prescriptions, or informal credit billing violate professional standards and may breach insurance rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["partial-fill", "non-controlled", "documentation", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Non-controlled partial fills are permitted in many states when documented with balance retained on the Rx.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 58-year-old patient traveling abroad requests a 14-day partial fill of insulin glargine pens from a 90-day electronic prescription with no refills. The e-prescription system allows balance tracking when partial fills are documented.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because electronic prescriptions cannot be partially filled",
      "Dispense the authorized partial quantity if permitted by state law, document the partial fill in the electronic record, and retain the remaining quantity on the prescription",
      "Dispense the full 90-day supply and ask the patient to return unused pens later",
      "Create a new prescription without prescriber authorization"
    ),
    "Dispense the authorized partial quantity if permitted by state law, document the partial fill in the electronic record, and retain the remaining quantity on the prescription",
    `Electronic non-controlled prescriptions may support documented partial fills when state law permits. Proper electronic balance tracking is required — not blanket refusal, full dispense with return expectation, or unauthorized new prescriptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["partial-fill", "non-controlled", "insulin", "e-prescribing", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 49-year-old patient requests a partial fill of a 90-day non-controlled sertraline prescription. The insurance plan rejects partial billing and requires a full 90-day claim. The patient cannot afford the copay for the full quantity.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill a full 90-day claim while dispensing only 30 days of product",
      "Explain billing limitations, explore permitted alternatives such as prescriber quantity adjustment or cash partial fill if lawful, and document the discussion",
      "Dispense 90 days without collecting copay to avoid conflict",
      "Refuse all service without offering any lawful options"
    ),
    "Explain billing limitations, explore permitted alternatives such as prescriber quantity adjustment or cash partial fill if lawful, and document the discussion",
    `Insurance billing rules may limit partial claims — miscoding quantity dispensed is fraud. Pharmacists should explain constraints and pursue lawful alternatives such as prescriber modification or permitted cash partial fills — not silent copay waivers or abandonment without options.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["partial-fill", "non-controlled", "insurance", ...PE],
    }
  ),

  // ── PBM DIR Fees (3) ──────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 65-year-old Medicare Part D patient picks up a generic maintenance medication. The pharmacy's point-of-sale system shows a negative reimbursement adjustment (DIR-related) that would exceed the patient's copay. The cashier asks to collect the difference directly from the patient at pickup.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Collect the DIR-related shortfall from the patient at the register",
      "Follow plan and pharmacy policy on patient cost sharing; do not bill patients for prohibited PBM/pharmacy DIR clawbacks beyond contracted copay obligations",
      "Refuse to dispense all Part D claims permanently",
      "Bill the patient the brand copay while dispensing generic"
    ),
    "Follow plan and pharmacy policy on patient cost sharing; do not bill patients for prohibited PBM/pharmacy DIR clawbacks beyond contracted copay obligations",
    `Direct and indirect remuneration (DIR) fees affect pharmacy reimbursement — not an automatic pass-through to patients beyond contracted cost sharing. Improper patient surcharges, blanket refusal, or brand copay miscoding violate plan rules and may constitute fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["DIR-fees", "PBM", "Medicare", "billing-compliance", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "DIR clawbacks are not automatically passed to patients beyond contracted copay obligations.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old pharmacy manager instructs staff to alter generic product identifiers at adjudication to improve star ratings and reduce anticipated retroactive DIR true-ups on Medicare Part D claims.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Alter identifiers to protect pharmacy margin",
      "Submit accurate claims with correct product and prescriber data; address DIR through lawful contracting and appeals — not claim misrepresentation",
      "Stop dispensing all Part D drugs until DIR is eliminated",
      "Bill all Part D claims as cash to avoid DIR entirely"
    ),
    "Submit accurate claims with correct product and prescriber data; address DIR through lawful contracting and appeals — not claim misrepresentation",
    `DIR mitigation must not involve claim misrepresentation. Accurate adjudication, lawful PBM appeals, and contracting — not identifier manipulation or cash conversion schemes — satisfy compliance obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["DIR-fees", "PBM", "fraud", "billing-compliance", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old independent pharmacy receives a retroactive PBM audit assessing DIR-related recoupments on claims adjudicated six months ago. The owner asks the pharmacist to backdate counseling and MTM documentation to justify higher quality ratings and reduce clawbacks.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Backdate documentation to match the audit request",
      "Respond with authentic records, appeal through proper PBM channels, and maintain accurate contemporaneous documentation going forward",
      "Ignore the audit because DIR is unenforceable",
      "Destroy claims from the audit period before responding"
    ),
    "Respond with authentic records, appeal through proper PBM channels, and maintain accurate contemporaneous documentation going forward",
    `Retroactive DIR recoupments require authentic records and lawful appeals — not backdated documentation, audit evasion, or record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["DIR-fees", "PBM", "payer-audit", "documentation", ...PE],
    }
  ),

  // ── Workplace Harassment / Reporting (3) ────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 34-year-old pharmacy technician reports that a 50-year-old staff pharmacist repeatedly makes racially discriminatory comments about patients in the break room. The technician asks the PIC whether formal reporting is necessary.`,
    "What is the pharmacist's most appropriate action as PIC?",
    opts4(
      "Tell the technician to ignore the comments to preserve team morale",
      "Investigate and address the conduct through required HR/workplace policy channels and protect the reporter from retaliation",
      "Post about the incident on social media to pressure the colleague to resign",
      "Transfer the technician to another store without investigating"
    ),
    "Investigate and address the conduct through required HR/workplace policy channels and protect the reporter from retaliation",
    `Workplace harassment and discrimination require formal investigation and corrective action — not silence, public shaming, or punishing the reporter. PICs and managers must follow institutional and legal reporting obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workplace-harassment", "reporting", "ethics", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Harassment reports require formal investigation — protect reporters from retaliation.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 29-year-old female pharmacy technician tells the pharmacist that a 61-year-old male patient made repeated unwanted sexual comments during pickup and blocked her at the counter. The patient is waiting in the parking lot for the next refill.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the technician to tolerate the behavior to keep the patient",
      "Support the employee, enforce pharmacy policy, document the incident, and restrict or report the patient's conduct through appropriate channels",
      "Ban all patients of that gender from the pharmacy",
      "Require the technician to serve the patient alone to de-escalate"
    ),
    "Support the employee, enforce pharmacy policy, document the incident, and restrict or report the patient's conduct through appropriate channels",
    `Patient harassment of staff requires employer support, documentation, and policy enforcement — not tolerance for revenue, discriminatory bans, or isolating the victim with the harasser.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workplace-harassment", "reporting", "patient-conduct", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 41-year-old pharmacist filed a good-faith board complaint about unsafe staffing at a chain pharmacy. The district manager reduces the pharmacist's hours and assigns undesirable shifts, stating the complaint "created problems."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Withdraw the complaint to restore hours",
      "Document the retaliation, escalate through HR, legal counsel, or the board as appropriate, and continue reporting legitimate safety concerns through proper channels",
      "Sabotage inventory to force store closure",
      "Publicly identify patients involved in the original complaint"
    ),
    "Document the retaliation, escalate through HR, legal counsel, or the board as appropriate, and continue reporting legitimate safety concerns through proper channels",
    `Retaliation for good-faith safety or regulatory reporting is prohibited. Documentation and escalation through proper channels — not complaint withdrawal, sabotage, or patient privacy violations — protect professional and legal rights.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workplace-harassment", "retaliation", "whistleblower", ...PE],
    }
  ),

  // ── New Mexico (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 54-year-old patient in Albuquerque presents a new prescription for oxycodone 10 mg tablets. New Mexico requires pharmacists to query the Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the New Mexico PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the New Mexico PMP, document the review, and apply corresponding-responsibility judgment",
    `New Mexico requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NM",
      difficulty: 3,
      references: [NM_REF],
      tags: ["new-mexico", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist licensed in Texas begins dispensing at a Santa Fe independent pharmacy before receiving a New Mexico pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding New Mexico licensure?",
    opts4(
      "Continue dispensing under the Texas license until New Mexico approves",
      "Obtain a New Mexico pharmacist license before practicing in the state",
      "Register with DEA only and defer New Mexico board licensure",
      "Work as a pharmacy intern indefinitely without New Mexico licensure"
    ),
    "Obtain a New Mexico pharmacist license before practicing in the state",
    `New Mexico requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates New Mexico pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NM",
      difficulty: 2,
      references: [NM_REF],
      tags: ["new-mexico", "licensure", ...PE],
    }
  ),

  // ── Wyoming (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Cheyenne presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Wyoming requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Wyoming PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the Wyoming PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Wyoming requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WY",
      difficulty: 3,
      references: [WY_REF],
      tags: ["wyoming", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient in Casper picks up a new prescription at a community pharmacy. Wyoming aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the pharmacy serves a rural population with limited staff"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Wyoming community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or rural staffing limitations do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WY",
      difficulty: 2,
      references: [WY_REF],
      tags: ["wyoming", "offer-to-counsel", ...PE],
    }
  ),

  // ── North Dakota (2) ────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Fargo presents a new prescription for alprazolam 0.5 mg tablets. North Dakota requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the North Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP because benzodiazepines are not monitored",
      "Query PDMP only when the patient pays cash",
      "Delegate PDMP review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the North Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
    `North Dakota requires pharmacists to query and document PDMP review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PDMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ND",
      difficulty: 3,
      references: [ND_REF],
      tags: ["north-dakota", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 56-year-old pharmacist relocates to Bismarck and begins dispensing at a chain pharmacy before receiving a North Dakota pharmacist license, relying on an active Minnesota license.`,
    "What is the pharmacist's most appropriate action regarding North Dakota licensure?",
    opts4(
      "Continue dispensing under the Minnesota license until North Dakota renewal season",
      "Obtain a North Dakota pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer North Dakota board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a North Dakota pharmacist license through the board before practicing in the state",
    `North Dakota requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate the North Dakota Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ND",
      difficulty: 2,
      references: [ND_REF],
      tags: ["north-dakota", "licensure", ...PE],
    }
  ),
];
