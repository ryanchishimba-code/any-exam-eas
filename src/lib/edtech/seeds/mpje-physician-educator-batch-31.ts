/**
 * Curated MPJE-style items — physician-educator batch 31.
 * Topics: HIPAA minimum necessary, pharmacy inspection readiness, naloxone standing orders,
 * DIR fee transparency, GA/PA/NJ state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-31";
const PE = ["physician-educator", BATCH, "mpje"];

const HIPAA = { label: "HIPAA Privacy Rule", url: "https://www.hhs.gov/hipaa" };
const CMS_DIR = {
  label: "CMS Medicare Part D / DIR Fee Guidance",
  url: "https://www.cms.gov/medicare/prescription-drug-coverage",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const GA_REF = {
  label: "Georgia Pharmacy Practice Act",
  citation: "O.C.G.A. § 26-4-80 et seq.",
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

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_31: EnrichedBankItem[] = [
  // ── HIPAA Minimum Necessary (3) ───────────────────────────────────────────
  mpjeCase(
    "patient-privacy",
    `Scenario: A 56-year-old hospital discharge planner calls requesting a complete two-year medication profile and all counseling notes for a 63-year-old patient being admitted to a skilled nursing facility. The planner provides the patient's name and date of birth but no signed HIPAA authorization or treatment relationship documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Release the complete profile and all notes because care coordination always permits full disclosure",
      "Verify authorization or a permitted treatment/payment exception, and disclose only the minimum necessary information needed for the requested care coordination",
      "Release medication names only while withholding all dates and quantities",
      "Decline all disclosures to facilities without exception"
    ),
    "Verify authorization or a permitted treatment/payment exception, and disclose only the minimum necessary information needed for the requested care coordination",
    `HIPAA minimum necessary limits PHI disclosure to what is needed for the purpose. Care coordination may permit disclosure but does not authorize indiscriminate full profiles without verification. Partial arbitrary withholding or blanket refusal without assessing permitted exceptions both fail HIPAA standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "minimum-necessary", "care-coordination", "PHI", ...PE],
      related: {
        reviewModuleSlug: "patient-privacy",
        keyTakeaway:
          "HIPAA minimum necessary limits disclosure to what is needed — full profiles require authorization or a valid exception.",
      },
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 41-year-old law enforcement officer presents a subpoena requesting all prescription records for a named patient for the past five years. The subpoena does not specify which drugs or dates are relevant to the investigation. The pharmacy has no patient authorization on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Release the entire five-year profile immediately because law enforcement requests override HIPAA",
      "Consult the privacy officer or legal counsel, verify the subpoena's validity, and disclose only the minimum necessary records responsive to the lawful request",
      "Release only controlled substance records and withhold all non-controlled prescriptions without review",
      "Refuse all law enforcement requests regardless of subpoena validity"
    ),
    "Consult the privacy officer or legal counsel, verify the subpoena's validity, and disclose only the minimum necessary records responsive to the lawful request",
    `Law enforcement requests require valid legal process and minimum necessary disclosure — not automatic full profile release, arbitrary partial release without review, or blanket refusal of lawful subpoenas.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "minimum-necessary", "law-enforcement", "subpoena", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 38-year-old pharmacy intern asks for unrestricted access to the entire patient database to "study refill patterns" for a school project. No business associate agreement or workforce role limitation covers this request.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Grant full database access because interns are pharmacy workforce members",
      "Deny unrestricted access, limit intern PHI access to the minimum necessary for assigned supervised duties, and document workforce training on HIPAA",
      "Export de-identified data by removing names only while retaining addresses and birth dates",
      "Allow the intern to share patient lists with classmates for peer review"
    ),
    "Deny unrestricted access, limit intern PHI access to the minimum necessary for assigned supervised duties, and document workforce training on HIPAA",
    `Workforce and student access must be role-limited to minimum necessary PHI under HIPAA — not unrestricted database access, partial de-identification that remains identifiable, or sharing with unauthorized third parties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [HIPAA],
      tags: ["HIPAA", "minimum-necessary", "workforce", "intern", ...PE],
    }
  ),

  // ── Pharmacy Inspection Readiness (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 53-year-old state board inspector arrives for a routine inspection and requests the pharmacy's written policies on compounding, immunizations, and controlled-substance security. The pharmacist-in-charge locates a policy manual last revised four years ago with no current PIC signature or staff acknowledgement records.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the inspector the manual is optional because daily practice is consistent",
      "Provide the existing manual, acknowledge gaps, and initiate immediate policy review, update, and staff acknowledgement per board expectations",
      "Backdate signatures on the old manual before handing it to the inspector",
      "Refuse to provide policies because corporate legal handles all manuals"
    ),
    "Provide the existing manual, acknowledge gaps, and initiate immediate policy review, update, and staff acknowledgement per board expectations",
    `Inspection readiness requires current written policies with documented staff acknowledgement — not claims that practice alone suffices, backdated signatures, or refusing on-site policy production.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["inspection", "policy-manual", "PIC", "readiness", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Inspection readiness requires current written policies and documented staff acknowledgement.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old DEA investigator conducting an unannounced audit finds the controlled-substance vault door propped open during business hours and three Schedule II bottles on the open dispensing counter. The perpetual inventory is current but receiving records for last month are incomplete.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Explain that propped vault doors are acceptable during busy periods",
      "Correct security violations immediately, produce all retrievable records, document gaps, and reconcile missing receiving documentation",
      "Move Schedule II bottles to the back room without updating inventory",
      "Ask the investigator to return after the pharmacy closes to avoid patient disruption"
    ),
    "Correct security violations immediately, produce all retrievable records, document gaps, and reconcile missing receiving documentation",
    `DEA inspection findings require immediate security correction and prompt record production — not normalized vault violations, unrecorded product movement, or delaying lawful inspections.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["inspection", "DEA-records", "vault", "security", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old state inspector requests proof of pharmacist-in-charge designation, technician registration, and continuing education compliance for all staff. The pharmacy's PIC designation letter names a pharmacist who left six months ago and was never formally replaced on file with the board.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue operations because the current pharmacist functionally acts as PIC",
      "Notify the board of the PIC change deficiency, ensure proper PIC designation and current staff licensure and CE records are available for inspection",
      "Allow the technician to sign inspection documents as acting PIC",
      "Close the pharmacy permanently to avoid the citation"
    ),
    "Notify the board of the PIC change deficiency, ensure proper PIC designation and current staff licensure and CE records are available for inspection",
    `Board rules require formal pharmacist-in-charge designation and current staff credential documentation — not informal role assumption, technician PIC substitution, or closure to evade inspection findings.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["inspection", "PIC", "licensure", "readiness", ...PE],
    }
  ),

  // ── Naloxone Standing Orders (3) ──────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 35-year-old family member requests intranasal naloxone for a 28-year-old relative with opioid use disorder. The relative is not present. The pharmacy participates in an authorized statewide naloxone standing order program with trained pharmacists.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because the patient must always be present for naloxone dispensing",
      "Dispense under the authorized standing order if program requirements are met, including screening, consent, counseling, and documentation per state protocol",
      "Dispense without counseling because the requester is not the patient",
      "Require a patient-specific prescription from any physician before dispensing"
    ),
    "Dispense under the authorized standing order if program requirements are met, including screening, consent, counseling, and documentation per state protocol",
    `Many standing order programs authorize third-party naloxone dispensing to at-risk individuals and bystanders with required screening, counseling, and documentation — not universal patient presence, uncounseled dispensing, or prescription-only refusal when protocols authorize access.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["naloxone", "standing-order", "harm-reduction", "counseling", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Standing order naloxone programs may authorize third-party dispensing with required screening and counseling.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old patient picking up a new opioid prescription asks whether the pharmacy can also provide naloxone under the state standing order. The pharmacist completed required training but the pharmacy's standing order protocol expired last month.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense naloxone because training alone authorizes standing order dispensing indefinitely",
      "Do not dispense under the standing order until a current authorized protocol is in place; offer alternatives such as prescriber prescription or referral per state law",
      "Dispense naloxone without documentation to avoid delaying opioid pickup",
      "Refuse all naloxone requests permanently after protocol expiration"
    ),
    "Do not dispense under the standing order until a current authorized protocol is in place; offer alternatives such as prescriber prescription or referral per state law",
    `Standing order naloxone dispensing requires current authorized protocol plus training — not training alone, undocumented dispensing, or permanent refusal without exploring lawful alternatives.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["naloxone", "standing-order", "protocol", "opioid", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old patient received naloxone under a standing order three months ago and requests a replacement kit because the prior device expired. The pharmacist must determine documentation and counseling obligations for repeat standing order dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense a replacement under the standing order after screening, counseling on use and expiration, and documentation per protocol requirements",
      "Refuse replacement because standing orders authorize only one lifetime dose",
      "Dispense without counseling because the patient received prior training",
      "Require emergency department evaluation before every replacement kit"
    ),
    "Dispense a replacement under the standing order after screening, counseling on use and expiration, and documentation per protocol requirements",
    `Repeat naloxone dispensing under standing orders requires ongoing screening, counseling, and documentation per protocol — not one-time-only assumptions, skipped counseling, or universal ED referral when program rules authorize replacement.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["naloxone", "standing-order", "replacement", "counseling", ...PE],
    }
  ),

  // ── DIR Fee Transparency (3) ──────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 67-year-old Medicare Part D patient asks why the pharmacy's posted cash price for a generic is lower than the copay shown at pickup. The pharmacist knows retroactive DIR fees reduced net reimbursement below the point-of-sale amount shown to the patient.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Explain that DIR clawbacks justify collecting additional amounts from the patient at pickup",
      "Counsel the patient per plan cost-sharing rules, explain applicable pricing and plan obligations accurately, and do not collect prohibited DIR-related surcharges beyond contracted copay",
      "Refuse to explain PBM pricing because it is proprietary",
      "Bill the patient the difference as a pharmacy service fee"
    ),
    "Counsel the patient per plan cost-sharing rules, explain applicable pricing and plan obligations accurately, and do not collect prohibited DIR-related surcharges beyond contracted copay",
    `DIR fees affect pharmacy reimbursement but do not authorize prohibited patient surcharges beyond contracted cost sharing. Accurate patient counseling and compliance with plan rules — not clawback pass-through or opaque refusal — satisfy transparency obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "transparency", "Medicare", "patient-counseling", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "DIR clawbacks do not justify prohibited patient surcharges beyond contracted copay obligations.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old pharmacy owner asks the pharmacist to review PBM contract terms before renewing. The contract buries DIR and performance-based true-up language in appendices with no point-of-sale disclosure of estimated net reimbursement on generic claims.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Sign the contract without review because all PBMs use identical DIR terms",
      "Review DIR, performance metric, and audit clauses for transparency, advise the owner on net reimbursement risk, and document concerns before contract execution",
      "Accept the contract and offset DIR by overcharging patients at pickup",
      "Stop dispensing all PBM claims without attempting contract review"
    ),
    "Review DIR, performance metric, and audit clauses for transparency, advise the owner on net reimbursement risk, and document concerns before contract execution",
    `DIR transparency requires careful contract review of true-up and performance clauses — not blind acceptance, patient surcharge offsets, or wholesale program abandonment without analysis.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "transparency", "PBM", "contract-review", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old independent pharmacy receives a PBM report showing estimated point-of-sale DIR adjustments on Part D generic claims for the upcoming quarter. The manager asks whether to change generic selection counseling based on anticipated DIR exposure rather than therapeutic equivalence.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Counsel patients to select higher-DIR-reimbursement generics regardless of formulary or equivalence",
      "Maintain clinically appropriate generic selection and counseling based on therapeutic equivalence and plan formulary; use lawful contracting and appeals to address DIR — not patient steering for DIR optimization",
      "Stop counseling on generics entirely to avoid DIR documentation",
      "Bill all generics as brand to increase reimbursement"
    ),
    "Maintain clinically appropriate generic selection and counseling based on therapeutic equivalence and plan formulary; use lawful contracting and appeals to address DIR — not patient steering for DIR optimization",
    `DIR exposure does not justify steering patients away from therapeutically appropriate generics. Clinical counseling and accurate dispensing with lawful DIR mitigation — not DIR-driven product steering or brand misbilling — satisfy professional and program standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "transparency", "generic-substitution", "PBM", ...PE],
    }
  ),

  // ── Georgia (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests an influenza vaccine at an Atlanta pharmacy. The pharmacist completed Georgia-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Georgia protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Georgia protocol requirements",
    `Georgia authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Georgia access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "GA",
      difficulty: 2,
      references: [GA_REF],
      tags: ["georgia", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 65-year-old patient in Savannah picks up a new prescription at a community pharmacy. Georgia aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Georgia community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "GA",
      difficulty: 2,
      references: [GA_REF],
      tags: ["georgia", "offer-to-counsel", ...PE],
    }
  ),

  // ── Pennsylvania (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Philadelphia presents a new prescription for oxycodone 5 mg tablets. Pennsylvania requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Pennsylvania PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with commercial insurance",
      "Query PDMP only for Schedule II drugs, not oxycodone combination products",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Pennsylvania PDMP, document the review, and apply corresponding-responsibility judgment",
    `Pennsylvania requires pharmacists to query and document PDMP review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 3,
      references: [PA_REF],
      tags: ["pennsylvania", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient requests a shingles vaccine at a Pittsburgh pharmacy. The pharmacist completed Pennsylvania-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Pennsylvania protocol requirements",
      "Refuse because shingles vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Pennsylvania protocol requirements",
    `Pennsylvania authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 2,
      references: [PA_REF],
      tags: ["pennsylvania", "immunization", "shingles", ...PE],
    }
  ),

  // ── New Jersey (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 45-year-old pharmacist licensed in New York begins dispensing at a Newark community pharmacy before obtaining a New Jersey pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding New Jersey licensure?",
    opts4(
      "Continue dispensing under the New York license until New Jersey approves",
      "Obtain a New Jersey pharmacist license before practicing in the state",
      "Register with DEA only and defer New Jersey board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a New Jersey pharmacist license before practicing in the state",
    `New Jersey requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate New Jersey pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 2,
      references: [NJ_REF],
      tags: ["new-jersey", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Trenton picks up a new prescription at a community pharmacy. New Jersey aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `New Jersey community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 2,
      references: [NJ_REF],
      tags: ["new-jersey", "offer-to-counsel", ...PE],
    }
  ),
];
