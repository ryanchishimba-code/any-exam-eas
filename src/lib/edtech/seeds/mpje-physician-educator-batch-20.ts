/**
 * Curated MPJE-style items — physician-educator batch 20.
 * Topics: 340B program compliance, MTM documentation, interstate compounding agreements,
 * HIPAA breach response, OK/PA/OH state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-20";
const PE = ["physician-educator", BATCH, "mpje"];

const HRSA_340B = {
  label: "HRSA 340B Drug Pricing Program",
  url: "https://www.hrsa.gov/340b",
};
const CMS_MTM = {
  label: "CMS Medicare Part D Medication Therapy Management (MTM)",
  url: "https://www.cms.gov/medicare/payment/part-d-plans/medication-therapy-management-mtm",
};
const HIPAA_BREACH = {
  label: "HIPAA Breach Notification Rule",
  url: "https://www.hhs.gov/hipaa/for-professionals/breach-notification",
};
const FDA_COMPOUNDING = {
  label: "FDA Human Drug Compounding",
  url: "https://www.fda.gov/drugs/human-drug-compounding",
};
const OK_REF = {
  label: "Oklahoma Pharmacy Act / OBN rules",
  citation: "63 O.S. § 1521 et seq.; OAC 535:15",
};
const PA_REF = {
  label: "Pennsylvania Pharmacy Act / PDMP",
  citation: "63 P.S. § 390-8; PA PDMP Act",
};
const OH_REF = {
  label: "Ohio Pharmacy Practice Act",
  citation: "ORC Ch. 4729; OARRS",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_20: EnrichedBankItem[] = [
  // ── 340B Program Compliance (3) ───────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient with an HRSA-covered entity referral presents a 340B-eligible prescription at a contract retail pharmacy. Corporate billing staff instruct the pharmacist to bill Medicaid at full price and retain the 340B spread without verifying covered-entity eligibility or duplicate-discount rules.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill Medicaid at full price and retain the spread without eligibility verification",
      "Verify 340B patient eligibility, covered-entity registration, and duplicate-discount prohibitions before 340B billing",
      "Bill all 340B claims as cash to avoid payer audits",
      "Share 340B savings directly with prescribers as referral incentives"
    ),
    "Verify 340B patient eligibility, covered-entity registration, and duplicate-discount prohibitions before 340B billing",
    `340B contract pharmacy arrangements require verified patient eligibility and compliance with duplicate-discount and GPO prohibitions. Billing without verification, cash conversion to evade rules, or prescriber kickbacks from 340B savings violate HRSA program integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HRSA_340B],
      tags: ["340B", "contract-pharmacy", "duplicate-discount", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "340B billing requires verified eligibility and duplicate-discount compliance — not unverified spread retention.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old hospital outpatient pharmacy manager proposes purchasing drugs through a GPO account for in-house 340B dispensing while also claiming 340B ceiling pricing on the same inventory.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Use GPO and 340B pricing on the same drugs to minimize cost",
      "Ensure 340B-acquired drugs are not subject to GPO prohibited arrangements and maintain auditable split-inventory or equivalent compliance",
      "Stop all 340B dispensing because GPO membership is mandatory",
      "Divert 340B inventory to non-eligible employees at employee discount"
    ),
    "Ensure 340B-acquired drugs are not subject to GPO prohibited arrangements and maintain auditable split-inventory or equivalent compliance",
    `340B entities generally cannot obtain covered outpatient drugs through GPO prohibited arrangements. Split-inventory and auditable tracking prevent duplicate discounts. GPO/340B double dipping, program abandonment, and diversion to ineligible patients violate HRSA rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HRSA_340B],
      tags: ["340B", "GPO", "split-inventory", "audit", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old covered entity asks its contract pharmacy to refill a 340B prescription for a patient who has not visited the entity in 18 months but still lists the clinic as their primary provider on the intake form.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense under 340B because the patient signed an intake form",
      "Confirm the patient meets current 340B patient definition and covered-entity relationship requirements before 340B dispensing",
      "Bill 340B for all community patients to support the clinic budget",
      "Allow the technician to determine 340B eligibility without documentation"
    ),
    "Confirm the patient meets current 340B patient definition and covered-entity relationship requirements before 340B dispensing",
    `340B eligibility depends on the patient definition and an ongoing relationship with the covered entity — not stale intake forms alone. Community-wide 340B billing and technician-only eligibility decisions without documentation violate program requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HRSA_340B],
      tags: ["340B", "patient-eligibility", "documentation", ...PE],
    }
  ),

  // ── MTM Documentation (3) ─────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 73-year-old Medicare Part D patient completes a comprehensive medication review (CMR). The pharmacist identifies two drug therapy problems and communicates one intervention to the prescriber but has not documented the medication action plan (MAP) or patient take-home summary.`,
    "What is the pharmacist's most appropriate action regarding MTM documentation?",
    opts4(
      "Bill the CMR immediately because the conversation occurred",
      "Complete required CMR documentation including identified problems, interventions, MAP or patient summary, and prescriber communication before billing",
      "Document only drug names without problems or interventions to save time",
      "Allow the technician to sign the MTM record as the responsible provider"
    ),
    "Complete required CMR documentation including identified problems, interventions, MAP or patient summary, and prescriber communication before billing",
    `CMS MTM programs require documented CMR elements including drug therapy problems, interventions, patient action plan or summary, and prescriber communication when applicable. Conversation alone, incomplete records, or technician-signed pharmacist MTM claims fail documentation and program integrity standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "CMR", "documentation", "MAP", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "CMR billing requires full documentation — problems, interventions, MAP, and prescriber communication.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 69-year-old patient enrolled in targeted MTM for anticoagulation returns after a hospital discharge with changed therapy. The pharmacist performed follow-up counseling but did not update the MTM record, medication list, or prescriber notification log from the prior quarter.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill a new targeted MTM encounter without updating prior documentation",
      "Update the MTM record with current medications, resolved and new drug therapy problems, interventions, and documented prescriber follow-up",
      "Delete the prior MTM record to avoid conflicting information",
      "Document the visit on a sticky note only"
    ),
    "Update the MTM record with current medications, resolved and new drug therapy problems, interventions, and documented prescriber follow-up",
    `Targeted MTM requires current medication lists, problem tracking across encounters, and documented prescriber communication. Billing without updated records, deleting prior documentation, or informal notes fail CMS and professional MTM documentation standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "targeted-MTM", "documentation", "transitions-of-care", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 66-year-old patient declines a mailed copy of the personal medication list after a documented CMR but agrees to a brief in-person summary. The pharmacy manager instructs staff to mark MAP delivery complete without any written or documented alternative.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Mark MAP delivery complete without any documentation because the patient declined mail",
      "Document the CMR, patient declination preferences, and the alternative method used to provide the medication action plan or summary",
      "Skip MAP delivery entirely when patients decline mail",
      "Email the MAP to the patient's employer for convenience"
    ),
    "Document the CMR, patient declination preferences, and the alternative method used to provide the medication action plan or summary",
    `CMR documentation must reflect how the patient received or declined the medication action plan or summary. False completion flags, skipped MAP delivery, or unauthorized employer disclosure violate CMS MTM and HIPAA requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [CMS_MTM],
      tags: ["MTM", "CMR", "MAP", "documentation", ...PE],
    }
  ),

  // ── Interstate Compounding Agreements (3) ─────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 57-year-old compounding pharmacy in Texas receives orders to ship patient-specific sterile preparations weekly to a physician clinic in Louisiana without verifying whether the home state permits interstate distribution of compounded drugs.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ship interstate because the prescription is patient-specific",
      "Verify home-state and recipient-state compounding and distribution rules, including interstate limits, before shipping compounded preparations",
      "Label all shipments as dietary supplements to avoid regulation",
      "Ship bulk clinic stock without patient names to simplify logistics"
    ),
    "Verify home-state and recipient-state compounding and distribution rules, including interstate limits, before shipping compounded preparations",
    `503A compounding is subject to federal interstate distribution limits and state board requirements. Pharmacists must verify lawful pathways in both states — not assume patient-specific status alone authorizes shipment, relabel as supplements, or ship unnamed bulk clinic stock.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_COMPOUNDING],
      tags: ["interstate-compounding", "503A", "distribution", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Interstate compounded drug shipment requires verification of federal limits and both states' rules.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 50-year-old PIC signs a reciprocal compounding inspection agreement allowing another state's board to share inspection findings. A partner pharmacy in a neighboring state ships non-sterile compounds into the PIC's state without registering as an out-of-state pharmacy when required.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept shipments because reciprocal inspection agreements replace all registration",
      "Confirm out-of-state pharmacy registration and compounding compliance requirements before accepting interstate compounded products for dispensing",
      "Dispense out-of-state compounds without review because they bear another board's label",
      "Copy the partner's formulas locally without prescriptions to avoid interstate shipment"
    ),
    "Confirm out-of-state pharmacy registration and compounding compliance requirements before accepting interstate compounded products for dispensing",
    `Reciprocal inspection agreements do not replace out-of-state pharmacy registration or dispensing compliance. Pharmacists must verify registration and quality standards before redispensing interstate compounds — not rely on labels alone or unauthorized local copying.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_COMPOUNDING],
      tags: ["interstate-compounding", "reciprocal-inspection", "registration", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 46-year-old mail-order compounding pharmacy plans to fill prescriptions for patients in five states from a single licensed location. Corporate counsel states that one home-state license covers all mail-order compounding nationwide.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Rely on the home-state license for all mail-order compounding nationwide",
      "Determine licensure, compounding, and shipping requirements in each destination state and comply with applicable registration and USP standards",
      "Ship only on weekends when boards are closed",
      "Use a PO box address in each state instead of registering"
    ),
    "Determine licensure, compounding, and shipping requirements in each destination state and comply with applicable registration and USP standards",
    `Mail-order compounding into multiple states typically requires compliance with each destination state's pharmacy and compounding rules in addition to federal requirements. A single home license, weekend shipping, or PO box workarounds do not substitute for lawful multistate compliance.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_COMPOUNDING],
      tags: ["interstate-compounding", "mail-order", "licensure", "USP-795", ...PE],
    }
  ),

  // ── HIPAA Breach Response (3) ───────────────────────────────────────────────
  mpjeCase(
    "patient-privacy",
    `Scenario: A 54-year-old pharmacy discovers ransomware encrypted the dispensing server overnight. Backup files may also be affected. Patient names, prescription histories, and insurance identifiers were stored on the server without offline recovery tested recently.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Pay the ransom immediately and resume operations without reporting",
      "Activate the incident response plan, contain the breach, assess PHI exposure, notify the privacy officer, and follow HIPAA breach notification requirements if indicated",
      "Delete encrypted files to eliminate evidence of a breach",
      "Wait until patients complain before any internal review"
    ),
    "Activate the incident response plan, contain the breach, assess PHI exposure, notify the privacy officer, and follow HIPAA breach notification requirements if indicated",
    `Ransomware affecting PHI triggers incident response, risk assessment, and potential HIPAA breach notification. Paying ransom without assessment, destroying evidence, or waiting for complaints fail mandatory breach response duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA_BREACH],
      tags: ["HIPAA", "breach-response", "ransomware", "PHI", ...PE],
      related: {
        reviewModuleSlug: "patient-privacy",
        keyTakeaway:
          "Ransomware with PHI requires incident response, risk assessment, and breach notification if indicated.",
      },
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 42-year-old pharmacist learns an employee's unencrypted laptop containing 800 patient medication profiles was stolen from a car after hours. The laptop was not password-protected and had no remote wipe enabled.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Take no action because the theft occurred off-site after hours",
      "Report the incident, conduct a HIPAA risk assessment, implement mitigation, and determine whether breach notification to patients and HHS is required",
      "Replace the laptop and avoid documenting the loss to reduce liability",
      "Notify only the patients who call the pharmacy asking about the theft"
    ),
    "Report the incident, conduct a HIPAA risk assessment, implement mitigation, and determine whether breach notification to patients and HHS is required",
    `Lost unencrypted devices with PHI require documented incident response and breach risk assessment regardless of off-site timing. Undocumented replacement or reactive-only patient contact fails HIPAA breach notification obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA_BREACH],
      tags: ["HIPAA", "breach-response", "PHI", "device-security", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 49-year-old pharmacy uses a cloud e-fax vendor to receive prescriptions. The vendor reports an unauthorized access incident exposing patient names and medication orders for 120 patients. The vendor asks the pharmacy to delay notification while it completes marketing remediation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Delay all notification until the vendor completes marketing remediation",
      "Require the business associate to provide breach details, cooperate with investigation, and fulfill HIPAA breach notification obligations within required timeframes",
      "Terminate the vendor silently without assessing patient impact",
      "Post patient names on the pharmacy website to provide transparency"
    ),
    "Require the business associate to provide breach details, cooperate with investigation, and fulfill HIPAA breach notification obligations within required timeframes",
    `Business associate breaches require covered entity oversight and timely breach notification per HIPAA — not vendor-directed delays, silent termination without assessment, or public PHI posting.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA_BREACH],
      tags: ["HIPAA", "breach-response", "business-associate", "PHI", ...PE],
    }
  ),

  // ── Oklahoma (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 47-year-old pharmacist licensed in Kansas begins dispensing at a Norman community pharmacy before receiving an Oklahoma pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Oklahoma licensure?",
    opts4(
      "Continue dispensing under the Kansas license until Oklahoma approves",
      "Obtain an Oklahoma pharmacist license before practicing in the state",
      "Register with DEA only and defer Oklahoma board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain an Oklahoma pharmacist license before practicing in the state",
    `Oklahoma requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Oklahoma pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 2,
      references: [OK_REF],
      tags: ["oklahoma", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient requests an influenza vaccine at an Oklahoma City pharmacy. The pharmacist completed Oklahoma-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Oklahoma protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Oklahoma protocol requirements",
    `Oklahoma authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 2,
      references: [OK_REF],
      tags: ["oklahoma", "immunization", "influenza", ...PE],
    }
  ),

  // ── Pennsylvania (2) ────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 51-year-old pharmacist licensed in Maryland begins dispensing at a Harrisburg retail pharmacy before obtaining a Pennsylvania pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Pennsylvania licensure?",
    opts4(
      "Continue dispensing under the Maryland license until Pennsylvania renewal season",
      "Obtain a Pennsylvania pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Pennsylvania board licensure indefinitely",
      "Work as an unregistered clerk to bypass licensure requirements"
    ),
    "Obtain a Pennsylvania pharmacist license through the board before practicing in the state",
    `Pennsylvania requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Pennsylvania pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 2,
      references: [PA_REF],
      tags: ["pennsylvania", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 70-year-old patient in Allentown picks up a new prescription for a high-risk medication. Pennsylvania community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Pennsylvania community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 2,
      references: [PA_REF],
      tags: ["pennsylvania", "offer-to-counsel", ...PE],
    }
  ),

  // ── Ohio (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 45-year-old pharmacist licensed in Indiana begins dispensing at a Dayton chain pharmacy before receiving an Ohio pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Ohio licensure?",
    opts4(
      "Continue dispensing under the Indiana license until Ohio approves",
      "Obtain an Ohio pharmacist license before practicing in the state",
      "Register with DEA only and defer Ohio board licensure",
      "Work as a pharmacy intern indefinitely without Ohio licensure"
    ),
    "Obtain an Ohio pharmacist license before practicing in the state",
    `Ohio requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Ohio pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OH",
      difficulty: 2,
      references: [OH_REF],
      tags: ["ohio", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests a shingles vaccine at a Cincinnati pharmacy. The pharmacist holds valid Ohio immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Ohio protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Ohio protocol requirements",
    `Ohio authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal hospital referral misstates Ohio access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OH",
      difficulty: 2,
      references: [OH_REF],
      tags: ["ohio", "immunization", "shingles", ...PE],
    }
  ),
];
