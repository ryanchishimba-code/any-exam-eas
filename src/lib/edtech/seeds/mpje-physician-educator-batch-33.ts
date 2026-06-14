/**
 * Curated MPJE-style items — physician-educator batch 33.
 * Topics: anti-kickback/Stark (deeper), PAP/copay accumulator compliance,
 * prescription validity red flags, pharmacy closure wind-down, NY/PA/NJ state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-33";
const PE = ["physician-educator", BATCH, "mpje"];

const AKS = {
  label: "Federal Anti-Kickback Statute (42 U.S.C. § 1320a-7b)",
  url: "https://oig.hhs.gov/compliance/physician-education-toolkit",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const NY_REF = {
  label: "New York Pharmacy Practice Act",
  citation: "N.Y. Ed. Law § 6800 et seq.",
};
const PA_REF = {
  label: "Pennsylvania Pharmacy Act",
  citation: "63 P.S. § 390-1 et seq.",
};
const NJ_REF = {
  label: "New Jersey Pharmacy Practice Act",
  citation: "N.J.S.A. § 45:14-47 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_33: EnrichedBankItem[] = [
  // ── Anti-Kickback / Stark — Deeper (3) ────────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 57-year-old home health agency offers the pharmacy $50 per new Medicare patient referred for durable medical equipment supplies and mail-order pharmacy services. The agency's medical director owns a financial interest in the pharmacy through a management services organization with no documented fair-market-value contract.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept per-referral payments because MSO arrangements are always lawful",
      "Evaluate anti-kickback and Stark implications, ensure any MSO compensation reflects fair market value for legitimate services, and refuse volume-based referral fees",
      "Accept payments only for cash-paying patients to avoid Medicare scrutiny",
      "Share referral fees with patients as gift cards to improve satisfaction scores"
    ),
    "Evaluate anti-kickback and Stark implications, ensure any MSO compensation reflects fair market value for legitimate services, and refuse volume-based referral fees",
    `Per-referral payments and sham MSO arrangements may violate anti-kickback and Stark laws. Compensation must reflect fair market value for legitimate services — not volume-based fees, cash-only evasion, or patient kickbacks.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [AKS],
      tags: ["anti-kickback", "Stark", "MSO", "referral-fee", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Per-referral fees and sham MSO arrangements may violate anti-kickback and Stark laws.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 50-year-old prescriber office manager asks the pharmacy to pay monthly "administrative fees" to the clinic in exchange for routing all discharge prescriptions to the store. The pharmacy owner proposes disguising the payments as inflated delivery charges on invoices.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Disguise referral payments as delivery fees because clinics require support",
      "Decline disguised inducements for prescription referrals and maintain lawful business relationships without volume-linked payments",
      "Pay the fees in cash to avoid invoice documentation",
      "Require patients to sign forms stating they chose the pharmacy independently while paying the clinic secretly"
    ),
    "Decline disguised inducements for prescription referrals and maintain lawful business relationships without volume-linked payments",
    `Disguised referral payments — including inflated delivery fees or cash inducements — may violate the anti-kickback statute regardless of patient choice documentation. Prescription routing must not be purchased through improper remuneration.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [AKS],
      tags: ["anti-kickback", "referral-fee", "disguised-payment", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 62-year-old laboratory company offers the pharmacy free point-of-care testing equipment if the pharmacy refers all eligible patients back to the lab for paid diagnostic panels billed to Medicare. The equipment vendor shares a common owner with the lab.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept free equipment because it benefits patient care regardless of referral obligations",
      "Evaluate Stark self-referral and anti-kickback implications of equipment inducements tied to lab referrals; use only lawful arrangements with compliant documentation",
      "Accept equipment and refer only commercially insured patients to the lab",
      "Bill Medicare for waived copays on lab panels to offset equipment cost"
    ),
    "Evaluate Stark self-referral and anti-kickback implications of equipment inducements tied to lab referrals; use only lawful arrangements with compliant documentation",
    `Free equipment tied to referral volume between commonly owned entities implicates Stark and anti-kickback laws. Patient care benefits do not cure improper inducements — lawful structured arrangements with documentation are required.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [AKS],
      tags: ["anti-kickback", "Stark", "self-referral", "equipment-inducement", ...PE],
    }
  ),

  // ── PAP / Copay Accumulator Compliance (3) ────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old commercially insured patient uses a manufacturer copay card for a specialty biologic. The plan has an accumulator program that excludes manufacturer copay assistance from the deductible. Billing staff propose applying the copay card without informing the plan so the patient reaches deductible faster.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Apply the copay card without plan disclosure to help the patient reach deductible",
      "Follow plan and program rules on accumulator/maximizer billing; counsel the patient on how copay assistance affects deductible progress per payer requirements",
      "Bill the plan for the full copay amount the card paid without disclosure",
      "Refuse all copay cards for accumulator plans permanently"
    ),
    "Follow plan and program rules on accumulator/maximizer billing; counsel the patient on how copay assistance affects deductible progress per payer requirements",
    `Accumulator and maximizer programs require compliant copay card billing and patient counseling — not concealed card use, undisclosed payer billing for card-paid amounts, or blanket refusal without lawful alternatives.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["copay-accumulator", "copay-card", "PAP", "billing-compliance", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Accumulator plans require compliant copay card billing — concealed card use to manipulate deductibles violates plan rules.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient on a manufacturer PAP for an oncology drug has insurance that newly added a copay accumulator. The PAP coordinator asks the pharmacy to continue billing insurance at full price while applying PAP credit so the pharmacy retains spread and the patient pays zero.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill insurance at full price and apply PAP credit without plan disclosure",
      "Bill according to plan accumulator rules and PAP program requirements; do not use PAP to circumvent accumulator policies or retain impermissible spread",
      "Stop dispensing until the patient switches insurers",
      "Bill cash and apply PAP without any insurance claim"
    ),
    "Bill according to plan accumulator rules and PAP program requirements; do not use PAP to circumvent accumulator policies or retain impermissible spread",
    `PAP and accumulator programs require compliant billing pathways — not full-price insurance billing with hidden PAP spread to circumvent plan rules or cash conversion to evade oversight.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["copay-accumulator", "PAP", "billing-compliance", "specialty-pharmacy", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old uninsured patient qualifies for a bridge PAP supply while full enrollment is pending. The manufacturer program prohibits bridge dispensing without completed prescriber attestation and income documentation. The patient needs the drug tonight for a scheduled oncology infusion tomorrow.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense bridge supply tonight without attestation because infusion is scheduled",
      "Complete required PAP bridge documentation per program rules before dispensing under assistance, or coordinate lawful alternative access with the prescriber",
      "Bill a former insurer from two years ago to create documentation",
      "Dispense from pharmacy stock and backdate PAP enrollment after the weekend"
    ),
    "Complete required PAP bridge documentation per program rules before dispensing under assistance, or coordinate lawful alternative access with the prescriber",
    `Bridge PAP supplies require program-compliant documentation — clinical urgency does not waive attestation requirements. Former insurer billing, backdated enrollment, or stock dispensing without authorization violate program and payer rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["PAP", "bridge-supply", "enrollment", "attestation", ...PE],
    }
  ),

  // ── Prescription Validity Red Flags (3) ───────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 46-year-old patient presents a handwritten prescription for alprazolam 2 mg tablets, quantity 120, dated today. The prescriber's printed address on the Rx is a residential apartment, but the DEA registrant lookup lists a hospital clinic address in another city. The patient claims walk-in clinic care.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the DEA number validates electronically",
      "Withhold dispensing, verify prescriber identity and practice location through DEA registration and direct prescriber contact, and resolve red flags before dispensing",
      "Dispense a 7-day supply only without verification",
      "Accept a patient-provided photo of the prescriber's badge as sufficient proof"
    ),
    "Withhold dispensing, verify prescriber identity and practice location through DEA registration and direct prescriber contact, and resolve red flags before dispensing",
    `DEA number validation alone does not cure address and practice-location mismatches. Corresponding responsibility requires prescriber verification before dispensing — not partial dispensing or badge photos without authenticated contact.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescription-validity", "red-flags", "DEA-registration", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "DEA number validation alone does not cure prescriber address and practice-location red flags.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 52-year-old patient presents a prescription for methotrexate 2.5 mg tablets with directions "Take 4 tablets daily" for rheumatoid arthritis. The quantity is 120 tablets with three refills. The patient states the prescriber is on vacation and unavailable by phone.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense as written because the prescriber signed the order",
      "Withhold dispensing, contact the prescriber or covering provider to verify the unusual daily dosing for methotrexate before dispensing",
      "Change directions to weekly dosing independently and dispense",
      "Dispense half the quantity to reduce toxicity risk without prescriber contact"
    ),
    "Withhold dispensing, contact the prescriber or covering provider to verify the unusual daily dosing for methotrexate before dispensing",
    `Methotrexate is typically dosed weekly for RA — daily dosing is a serious validity red flag requiring prescriber verification. Signed orders alone do not waive corresponding responsibility for implausible regimens or independent dose changes.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["prescription-validity", "red-flags", "methotrexate", "dosing", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 43-year-old patient presents a Schedule II oxycodone prescription with a rubber-stamp prescriber signature and no hand-written elements. State and federal rules require handwritten signatures for Schedule II orders unless valid EPCS is used.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because rubber-stamp signatures are common in busy clinics",
      "Refuse to dispense the stamped Schedule II prescription unless a valid EPCS or lawful handwritten signature exception applies; verify with the prescriber",
      "Accept a faxed copy of the same stamped prescription as replacement",
      "Convert the order to Schedule III hydrocodone without prescriber contact"
    ),
    "Refuse to dispense the stamped Schedule II prescription unless a valid EPCS or lawful handwritten signature exception applies; verify with the prescriber",
    `Schedule II prescriptions generally require handwritten signatures or valid EPCS — rubber-stamp signatures are not valid under federal CSA requirements. Fax substitutes or therapeutic class switches without prescriber authorization violate controlled-substance validity rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescription-validity", "red-flags", "C-II", "signature", ...PE],
    }
  ),

  // ── Pharmacy Closure Wind-Down — Deeper (3) ───────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old PIC closing a community pharmacy in 14 days discovers unused DEA Form 222 order books and outstanding signed orders for Schedule II products that will not arrive before closure. Controlled-substance inventory will be transferred to a nearby pharmacy per wind-down plan.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Discard blank Form 222 books and unsigned orders with regular trash",
      "Follow DEA closure procedures for Form 222 records, notify DEA of closure plans, and execute lawful CS inventory transfer or destruction with required documentation",
      "Sell outstanding Form 222 orders to another pharmacy without DEA notification",
      "Leave Form 222 books for the landlord after closure"
    ),
    "Follow DEA closure procedures for Form 222 records, notify DEA of closure plans, and execute lawful CS inventory transfer or destruction with required documentation",
    `Pharmacy closure requires DEA notification and proper Form 222 and controlled-substance disposition — not trash disposal, unauthorized order sale, or abandonment of CS records.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["pharmacy-closure", "wind-down", "Form-222", "controlled-substances", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Pharmacy closure requires DEA notification and proper Form 222 and CS disposition documentation.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 51-year-old pharmacy closing in 10 days must terminate PBM and Medicare Part D network contracts. The owner asks staff to stop submitting claims immediately while continuing to dispense to loyal patients without notifying payers or transferring credentials.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Stop billing and dispense without payer notification until the doors close",
      "Follow payer contract termination and final claims procedures, notify networks per contract and regulatory requirements, and ensure lawful billing for services through closure",
      "Bill all final claims as cash to avoid termination paperwork",
      "Transfer the pharmacy NPI to the owner's relative without board approval"
    ),
    "Follow payer contract termination and final claims procedures, notify networks per contract and regulatory requirements, and ensure lawful billing for services through closure",
    `Closure requires proper payer notification and compliant final claims — not silent dispensing without billing, cash conversion, or unauthorized NPI transfer.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["pharmacy-closure", "wind-down", "PBM", "Medicare", "credentialing", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old compounding pharmacy closing in 21 days has sterile compounded products in quarantine, patient-specific non-sterile preparations in will-call, and an buyer interested in purchasing the patient profile list separately from the prescription files.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Sell the patient profile list to the buyer as a business asset without restriction",
      "Follow board and HIPAA requirements for record retention or lawful transfer, quarantine or dispose of compounded products per USP and board rules, and notify affected patients and prescribers",
      "Release all quarantined sterile products to patients without quality review to empty inventory",
      "Destroy all records immediately after selling fixtures"
    ),
    "Follow board and HIPAA requirements for record retention or lawful transfer, quarantine or dispose of compounded products per USP and board rules, and notify affected patients and prescribers",
    `Compounding pharmacy closure requires lawful record handling under HIPAA, proper quarantine or disposal of compounded products, and patient notification — not profile list sales without authorization, rushed release of quarantined products, or immediate record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["pharmacy-closure", "wind-down", "compounding", "HIPAA", "records", ...PE],
    }
  ),

  // ── New York (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient requests an influenza vaccine at a Buffalo pharmacy. The pharmacist completed New York-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per New York protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per New York protocol requirements",
    `New York authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate New York access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NY",
      difficulty: 2,
      references: [NY_REF],
      tags: ["new-york", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient in Albany picks up a new prescription at a community pharmacy. New York aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `New York community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NY",
      difficulty: 2,
      references: [NY_REF],
      tags: ["new-york", "offer-to-counsel", ...PE],
    }
  ),

  // ── Pennsylvania (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 48-year-old pharmacist licensed in Maryland begins dispensing at a Philadelphia community pharmacy before obtaining a Pennsylvania pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Pennsylvania licensure?",
    opts4(
      "Continue dispensing under the Maryland license until Pennsylvania approves",
      "Obtain a Pennsylvania pharmacist license before practicing in the state",
      "Register with DEA only and defer Pennsylvania board licensure",
      "Work as a pharmacy intern indefinitely without Pennsylvania licensure"
    ),
    "Obtain a Pennsylvania pharmacist license before practicing in the state",
    `Pennsylvania requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Pennsylvania pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 2,
      references: [PA_REF],
      tags: ["pennsylvania", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient requests an influenza vaccine at a Harrisburg pharmacy. The pharmacist completed Pennsylvania-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Pennsylvania protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Pennsylvania protocol requirements",
    `Pennsylvania authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 2,
      references: [PA_REF],
      tags: ["pennsylvania", "immunization", "influenza", ...PE],
    }
  ),

  // ── New Jersey (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Newark presents a new prescription for oxycodone 5 mg tablets. New Jersey requires Prescription Monitoring Program (NJPMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the NJPMP, document the review, and apply corresponding-responsibility judgment",
      "Skip NJPMP review for patients with commercial insurance",
      "Query NJPMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate NJPMP review and dispensing authorization to a technician"
    ),
    "Query the NJPMP, document the review, and apply corresponding-responsibility judgment",
    `New Jersey requires pharmacists to query and document NJPMP review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 3,
      references: [NJ_REF],
      tags: ["new-jersey", "NJPMP", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests a shingles vaccine at a Jersey City pharmacy. The pharmacist completed New Jersey-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per New Jersey protocol requirements",
      "Refuse because shingles vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per New Jersey protocol requirements",
    `New Jersey authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate New Jersey access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 2,
      references: [NJ_REF],
      tags: ["new-jersey", "immunization", "shingles", ...PE],
    }
  ),
];
