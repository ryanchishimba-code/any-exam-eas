/**
 * Curated MPJE-style items — physician-educator batch 25.
 * Topics: FDA REMS follow-up dispensing, central fill / hub-and-spoke liability,
 * prescriber office-use / 503A home stock, whistleblower / mandatory fraud reporting,
 * CO/ID/WY state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-25";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA_REMS = {
  label: "FDA REMS / Drug Safety",
  url: "https://www.fda.gov/drugs/drug-safety-and-availability/risk-evaluation-and-mitigation-strategies-rems",
};
const FDA503A = {
  label: "FDA Section 503A Compounding",
  url: "https://www.fda.gov/drugs/human-drug-compounding",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const OIG = {
  label: "HHS OIG Health Care Fraud and Abuse",
  url: "https://oig.hhs.gov/compliance/physician-education/fraud-abuse-laws",
};
const CO_REF = {
  label: "Colorado Pharmacy Laws / DORA",
  citation: "C.R.S. § 12-22-101 et seq.",
};
const ID_REF = {
  label: "Idaho Pharmacy Practice Act",
  citation: "Idaho Code § 54-17 et seq.",
};
const WY_REF = {
  label: "Wyoming Pharmacy Act",
  citation: "Wyo. Stat. § 33-24-101 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_25: EnrichedBankItem[] = [
  // ── FDA REMS Follow-Up Dispensing (3) ─────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 58-year-old male patient returns for a lenalidomide refill under the Revlimid REMS program. The pharmacist confirms a valid prescription but the REMS system shows the required monthly pregnancy test documentation for a female household contact is overdue per program rules (patient is male; survey documentation for partners is required when applicable).`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Dispense because the patient is male and pregnancy tests do not apply",
      "Verify all applicable Revlimid REMS requirements including required surveys and documentation in the REMS system before dispensing",
      "Dispense a 90-day supply to reduce REMS paperwork",
      "Allow the technician to override the REMS hold because the patient is established"
    ),
    "Verify all applicable Revlimid REMS requirements including required surveys and documentation in the REMS system before dispensing",
    `Lenalidomide REMS requires verified program documentation before each dispense — including applicable survey elements. Male patient status does not waive all REMS requirements. Extended supplies, technician overrides, and unverified holds violate federal REMS obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_REMS],
      tags: ["REMS", "lenalidomide", "follow-up", "documentation", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Revlimid REMS requires verified program documentation before each dispense — not technician overrides.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 7-year-old patient with refractory seizures presents a vigabatrin refill. The REMS program requires documented vision monitoring at specified intervals. The parent provides a phone message from the prescriber but no current REMS vision assessment is recorded in the system.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the parent spoke with the prescriber yesterday",
      "Withhold dispensing until required Vigabatrin REMS vision monitoring documentation is verified in the program",
      "Dispense one week without REMS verification as a bridge",
      "Substitute a different antiepileptic without prescriber contact"
    ),
    "Withhold dispensing until required Vigabatrin REMS vision monitoring documentation is verified in the program",
    `Vigabatrin REMS requires verified vision monitoring documentation before dispensing — not parent reports alone, bridge supplies without program verification, or unilateral therapeutic substitution.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_REMS],
      tags: ["REMS", "vigabatrin", "follow-up", "monitoring", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 44-year-old patient with narcolepsy requests a sodium oxybate refill under the REMS program. The pharmacy participates in the program but the patient's prescriber and pharmacy enrollment linkage in the REMS registry shows an expired authorization from last month.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the patient has received the drug for years",
      "Verify active REMS authorization linking prescriber, patient, and pharmacy before dispensing; resolve expired registry status with the prescriber or program",
      "Transfer the patient to an online pharmacy without REMS verification",
      "Dispense half the quantity to reduce REMS burden"
    ),
    "Verify active REMS authorization linking prescriber, patient, and pharmacy before dispensing; resolve expired registry status with the prescriber or program",
    `Sodium oxybate REMS requires active prescriber-pharmacy-patient authorization in the registry — not prior use history, unverified transfers, or partial dispensing to evade REMS.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_REMS],
      tags: ["REMS", "sodium-oxybate", "follow-up", "authorization", ...PE],
    }
  ),

  // ── Central Fill / Hub-and-Spoke Liability (3) ────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 69-year-old patient picks up a maintenance medication bag from a retail spoke pharmacy after central fill processing. The label shows another patient's name and drug product. The retail technician nearly handed it to the waiting patient before the error was noticed.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Re-label the bag for the correct patient because the drug is the same class",
      "Quarantine the misfilled product, investigate the central fill error, notify the hub pharmacy, and dispense only after correct verification to the intended patient",
      "Return the product to central fill inventory without documentation",
      "Allow the technician to decide whether the error is clinically significant"
    ),
    "Quarantine the misfilled product, investigate the central fill error, notify the hub pharmacy, and dispense only after correct verification to the intended patient",
    `Hub-and-spoke misfills require quarantine, investigation, and correct patient verification — not relabeling without process review, silent returns, or technician-only significance judgments.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["central-fill", "hub-and-spoke", "dispensing-error", "liability", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Central fill misfills require quarantine and investigation — never relabel without verification.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 74-year-old patient receives a new mail-order prescription shipped directly from a central fill hub to the patient's home. The patient calls with questions about dosing and interactions. The hub policy provides a toll-free pharmacist line but the patient reached a voicemail-only menu.`,
    "What is the pharmacist's most appropriate action when contacted through the spoke store?",
    opts4(
      "Refuse to help because mail-order is entirely separate from retail",
      "Provide or facilitate pharmacist counseling access per OBRA and mail-order requirements, document the contact, and escalate hub counseling access failures",
      "Tell the patient to read the package insert only",
      "Transfer the patient to the manufacturer call center for all clinical questions"
    ),
    "Provide or facilitate pharmacist counseling access per OBRA and mail-order requirements, document the contact, and escalate hub counseling access failures",
    `Mail-order and hub-and-spoke models require accessible pharmacist counseling for new prescriptions — not retail refusal, insert-only guidance, or manufacturer deflection for core dispensing questions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["central-fill", "hub-and-spoke", "mail-order", "counseling", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old patient's Schedule III refill is processed at a central fill hub and delivered to a retail pickup store. The hub pharmacist performed verification but no PDMP review is documented. The retail PIC asks whether PDMP responsibility lies with the hub or spoke pharmacist.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip PDMP review because central fill already verified the product",
      "Ensure PDMP review and corresponding-responsibility documentation occur per state law before the patient receives the controlled substance, regardless of hub processing",
      "Delegate PDMP review to the delivery driver",
      "Query PDMP only when the patient pays cash"
    ),
    "Ensure PDMP review and corresponding-responsibility documentation occur per state law before the patient receives the controlled substance, regardless of hub processing",
    `Central fill does not eliminate spoke pharmacist PDMP and corresponding-responsibility duties before patient release. Hub verification alone, driver delegation, or cash-only monitoring fail state controlled-substance requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["central-fill", "hub-and-spoke", "PDMP", "corresponding-responsibility", ...PE],
    }
  ),

  // ── Prescriber Office-Use / 503A Home Stock (3) ───────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 50-year-old dermatologist requests 200 unit-dose tubes of a compounded topical steroid for clinic crash-cart stock without patient-specific prescriptions. The tubes will be labeled only with the clinic name and lot number.`,
    "What is the pharmacist's most appropriate action under 503A and state office-use rules?",
    opts4(
      "Compound the batch because the prescriber is licensed and the clinic is medical",
      "Evaluate whether the order complies with FDA 503A patient-specific requirements and applicable state office-use authorization before compounding",
      "Label the product as OTC moisturizer to avoid compounding rules",
      "Ship the batch interstate to the clinic without verifying either state's rules"
    ),
    "Evaluate whether the order complies with FDA 503A patient-specific requirements and applicable state office-use authorization before compounding",
    `503A office-use compounding requires compliance with federal patient-specific limits and state authorization — not prescriber licensure alone, OTC misbranding, or unverified interstate shipment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["503A", "office-use", "prescriber-stock", "compounding", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "503A office-use batch compounding requires federal and state authorization — not clinic name labeling alone.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 47-year-old physician asks a compounding pharmacy to deliver patient-specific hormone capsules to the physician's home address for the physician's spouse and adult children without individual prescriptions for each family member.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Deliver to the home because the physician vouches for family members",
      "Decline to compound or dispense without valid patient-specific prescriptions for each intended recipient per 503A and state law",
      "Compound one large batch labeled for the physician household",
      "Ship the order as dietary supplements to simplify delivery"
    ),
    "Decline to compound or dispense without valid patient-specific prescriptions for each intended recipient per 503A and state law",
    `503A compounding requires patient-specific prescriptions — not physician household batches, family vouching, or dietary supplement relabeling for multi-recipient home delivery.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["503A", "office-use", "prescriber-stock", "patient-specific", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 55-year-old clinic returns expired office-use compounded antibiotic suspension vials prepared by the pharmacy six months ago. Staff propose filtering and repackaging the remaining volume for new clinic patients to reduce waste.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Repack expired office-use compound for new patients after visual inspection",
      "Reject reuse of expired office-use compounded product; dispose per policy and compound new patient-specific or authorized orders only",
      "Credit the clinic and restock returned vials for retail patients",
      "Extend beyond-use dates in the computer system to match current month"
    ),
    "Reject reuse of expired office-use compounded product; dispose per policy and compound new patient-specific or authorized orders only",
    `Expired compounded office-use products cannot be filtered, repackaged, or date-extended for new patients. Retail restock from clinic returns violates compounding integrity and 503A documentation standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["503A", "office-use", "BUD", "disposal", ...PE],
    }
  ),

  // ── Whistleblower / Mandatory Fraud Reporting (3) ─────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 49-year-old staff pharmacist documents phantom immunization events billed to Medicare and reports through the corporate compliance hotline. Two weeks later the district manager reduces the pharmacist's hours and assigns only overnight technician shifts, stating the report was "disloyal."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Withdraw the fraud report to restore hours",
      "Continue cooperating with compliance investigation, document potential retaliation, and pursue board or legal protections for good-faith reporting as applicable",
      "Publicly identify patients involved in the billing scheme on social media",
      "Participate in future phantom billing to avoid further retaliation"
    ),
    "Continue cooperating with compliance investigation, document potential retaliation, and pursue board or legal protections for good-faith reporting as applicable",
    `Good-faith fraud reporting is protected; retaliation should be documented and addressed through proper channels — not report withdrawal, public PHI disclosure, or renewed participation in fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OIG],
      tags: ["whistleblower", "mandatory-reporting", "retaliation", "Medicare-fraud", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Good-faith fraud reporting is protected — document retaliation and continue compliance cooperation.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 61-year-old consultant pharmacist reviewing LTC medication records observes untreated pressure injuries and medication withholding patterns suggesting elder neglect at a facility. State law designates pharmacists as mandatory reporters for suspected elder abuse in applicable settings.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore findings because pharmacists only dispense medications",
      "Report suspected elder abuse or neglect to the designated state agency or hotline as required by mandatory reporter laws",
      "Confront facility administrators publicly during a resident meal",
      "Wait until a family member files a complaint before reporting"
    ),
    "Report suspected elder abuse or neglect to the designated state agency or hotline as required by mandatory reporter laws",
    `Mandatory reporter laws require pharmacists in applicable roles to report suspected elder abuse — not scope limitation claims, public confrontation, or passive waiting for family complaints.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["whistleblower", "mandatory-reporting", "elder-abuse", "LTC", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 43-year-old PIC discovers a technician altering days-supply fields on Medicaid claims to increase reimbursement. Corporate policy requires documented internal escalation to compliance before external reporting, but compliance has not responded in three weeks while the scheme continues.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the scheme to continue because internal policy was followed once",
      "Stop the fraudulent billing, secure records, re-escalate compliance, and report to the board or appropriate authorities if internal channels fail to remediate ongoing fraud",
      "Join the scheme briefly to gather evidence without reporting",
      "Delete claim records to eliminate proof of fraud"
    ),
    "Stop the fraudulent billing, secure records, re-escalate compliance, and report to the board or appropriate authorities if internal channels fail to remediate ongoing fraud",
    `Ongoing Medicaid fraud requires cessation, record preservation, and escalation beyond unresponsive internal channels — not passive continuation, participatory investigation, or record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OIG],
      tags: ["whistleblower", "mandatory-reporting", "Medicaid-fraud", "False-Claims", ...PE],
    }
  ),

  // ── Colorado (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 48-year-old pharmacist licensed in New Mexico begins dispensing at a Denver chain pharmacy before obtaining a Colorado pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Colorado licensure?",
    opts4(
      "Continue dispensing under the New Mexico license until Colorado approves",
      "Obtain a Colorado pharmacist license before practicing in the state",
      "Register with DEA only and defer Colorado board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Colorado pharmacist license before practicing in the state",
    `Colorado requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Colorado pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CO",
      difficulty: 2,
      references: [CO_REF],
      tags: ["colorado", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient requests a pneumococcal vaccine at a Colorado Springs pharmacy. The pharmacist completed Colorado-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Colorado protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Colorado protocol requirements",
    `Colorado authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CO",
      difficulty: 2,
      references: [CO_REF],
      tags: ["colorado", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── Idaho (2) ─────────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 51-year-old pharmacist licensed in Montana begins dispensing at a Boise retail pharmacy before receiving an Idaho pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Idaho licensure?",
    opts4(
      "Continue dispensing under the Montana license until Idaho approves",
      "Obtain an Idaho pharmacist license before practicing in the state",
      "Register with DEA only and defer Idaho board licensure",
      "Work as a pharmacy intern indefinitely without Idaho licensure"
    ),
    "Obtain an Idaho pharmacist license before practicing in the state",
    `Idaho requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Idaho pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 2,
      references: [ID_REF],
      tags: ["idaho", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient requests an influenza vaccine at an Idaho Falls pharmacy. The pharmacist holds valid Idaho immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Idaho protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Idaho protocol requirements",
    `Idaho authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Idaho access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 2,
      references: [ID_REF],
      tags: ["idaho", "immunization", "influenza", ...PE],
    }
  ),

  // ── Wyoming (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 46-year-old pharmacist licensed in Nebraska begins dispensing at a Cheyenne community pharmacy before obtaining a Wyoming pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Wyoming licensure?",
    opts4(
      "Continue dispensing under the Nebraska license until Wyoming renewal season",
      "Obtain a Wyoming pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Wyoming board licensure indefinitely",
      "Work as an unregistered clerk to bypass licensure requirements"
    ),
    "Obtain a Wyoming pharmacist license through the board before practicing in the state",
    `Wyoming requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Wyoming pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WY",
      difficulty: 2,
      references: [WY_REF],
      tags: ["wyoming", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests a shingles vaccine at a Casper pharmacy. The pharmacist holds valid Wyoming immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Wyoming protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Wyoming protocol requirements",
    `Wyoming authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WY",
      difficulty: 2,
      references: [WY_REF],
      tags: ["wyoming", "immunization", "shingles", ...PE],
    }
  ),
];
