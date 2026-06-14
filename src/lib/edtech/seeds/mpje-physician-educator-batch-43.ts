/**
 * Curated MPJE-style items — physician-educator batch 43.
 * Topics: HIPAA breach notification (deeper), DEA biennial inventory / CSOS,
 * interstate Rx transfer, bloodborne pathogen exposure, MA/CT/RI state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-43";
const PE = ["physician-educator", BATCH, "mpje"];

const HIPAA = {
  label: "HIPAA Breach Notification Rule",
  url: "https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const OSHA = {
  label: "OSHA Bloodborne Pathogens Standard (29 CFR 1910.1030)",
  url: "https://www.osha.gov/bloodborne-pathogens",
};
const MA_REF = {
  label: "Massachusetts Pharmacy Practice Act",
  citation: "M.G.L. c. 112 § 39 et seq.",
};
const CT_REF = {
  label: "Connecticut Pharmacy Practice Act",
  citation: "Conn. Gen. Stat. § 20-590 et seq.",
};
const RI_REF = {
  label: "Rhode Island Pharmacy Practice Act",
  citation: "R.I. Gen. Laws § 5-19 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_43: EnrichedBankItem[] = [
  // ── HIPAA Breach Notification — Deeper (3) ──────────────────────────────────
  mpjeCase(
    "patient-privacy",
    `Scenario: A 52-year-old pharmacy technician accesses the profiles of 40 celebrity patients over three months out of curiosity without a treatment or payment purpose. No patients have complained and no data left the pharmacy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Take no action because no patients complained and no external disclosure occurred",
      "Report the workforce violation to the privacy officer, investigate, discipline as appropriate, and determine whether HIPAA breach notification is required after risk assessment",
      "Publicly identify the technician on social media to deter future snooping",
      "Wait until a patient files a formal complaint before any internal review"
    ),
    "Report the workforce violation to the privacy officer, investigate, discipline as appropriate, and determine whether HIPAA breach notification is required after risk assessment",
    `Unauthorized workforce access to PHI requires privacy officer investigation and breach risk assessment — not inaction due to lack of complaints, public shaming, or delayed response until external complaints.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "breach-notification", "workforce", "snooping", ...PE],
      related: {
        reviewModuleSlug: "patient-privacy",
        keyTakeaway:
          "Workforce PHI snooping requires privacy officer investigation and breach risk assessment — complaints are not required to act.",
      },
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 58-year-old pharmacy manager discovers an unencrypted laptop containing 600 patient profiles was stolen from a locked office six weeks ago. Staff assumed it was misplaced and did not report the loss until today.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Replace the laptop and take no further action because the office was locked",
      "Activate incident response, conduct a HIPAA breach risk assessment, and determine required patient, HHS, and media notification timelines from discovery date",
      "Notify patients only if someone reports fraudulent use of their information",
      "Destroy remaining paper backups to simplify future audits"
    ),
    "Activate incident response, conduct a HIPAA breach risk assessment, and determine required patient, HHS, and media notification timelines from discovery date",
    `Stolen unencrypted devices with PHI require incident response and breach notification analysis from discovery — not passive replacement, conditional notification, or record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [HIPAA],
      tags: ["HIPAA", "breach-notification", "unencrypted-device", "theft", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 44-year-old billing vendor misroutes a fax containing 12 patients' names, dates of birth, and medication lists to a local auto repair shop. The shop owner returned the fax unread and signed an attestation. The pharmacy privacy officer asks whether breach notification can be skipped.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip notification because the fax was returned unread with an attestation",
      "Document the incident, conduct a HIPAA breach risk assessment considering the nature of PHI and mitigation, and notify affected individuals and HHS if required",
      "Notify only the auto repair shop owner by phone and take no patient action",
      "Post a general apology on the pharmacy website instead of individual notice"
    ),
    "Document the incident, conduct a HIPAA breach risk assessment considering the nature of PHI and mitigation, and notify affected individuals and HHS if required",
    `Misdirected PHI requires documented risk assessment — return with attestation may reduce risk but does not automatically eliminate breach notification obligations. Website apologies alone fail individual notice requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "breach-notification", "misdirected-PHI", "fax", ...PE],
    }
  ),

  // ── DEA Biennial Inventory / CSOS — Deeper (3) ────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old PIC prepares the pharmacy's biennial controlled-substance inventory. A technician proposes estimating all Schedule III-V open bottles by visual fullness while doing exact counts only for Schedule II.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Use visual estimates for all schedules to finish before opening hours",
      "Conduct the biennial inventory using DEA-required exact or estimated count methods by schedule and container status, with pharmacist oversight and documentation",
      "Skip Schedule III-V entirely because they are lower risk",
      "Delegate the entire biennial inventory to technicians without pharmacist verification"
    ),
    "Conduct the biennial inventory using DEA-required exact or estimated count methods by schedule and container status, with pharmacist oversight and documentation",
    `Biennial inventory requires schedule-appropriate exact or estimated counts with pharmacist accountability — not universal visual shortcuts, skipped schedules, or technician-only completion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["biennial-inventory", "DEA", "controlled-substances", "documentation", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Biennial inventory requires schedule-appropriate exact or estimated counts — not visual guesses for all schedules.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old pharmacist attempts to place a CSOS electronic order for Schedule II morphine tablets. The system rejects the order because the pharmacy's CSOS digital certificate expired yesterday. A paper DEA Form 222 book is available.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Proceed with the CSOS order because the certificate expired only recently",
      "Renew or restore valid CSOS credentials before electronic ordering, or use a valid DEA Form 222 per federal ordering rules — do not order Schedule II without lawful authorization",
      "Order Schedule II product as Schedule III on CSOS to bypass the certificate issue",
      "Ask the technician to sign the Form 222 as acting registrant"
    ),
    "Renew or restore valid CSOS credentials before electronic ordering, or use a valid DEA Form 222 per federal ordering rules — do not order Schedule II without lawful authorization",
    `Schedule II ordering requires valid CSOS credentials or lawful Form 222 — not expired certificates, schedule misclassification, or technician signing authority.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["CSOS", "Form-222", "DEA", "ordering", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old pharmacist discovers a completed DEA Form 222 for oxycodone tablets lists the wrong NDC strength due to a typographical error before transmission to the wholesaler. No product has shipped.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "White out the error and continue using the same Form 222",
      "Void the erroneous Form 222 per DEA procedures and issue a corrected lawful order; retain voided records for required retention",
      "Ask the wholesaler to ship the intended strength without correcting the form",
      "Discard the form without documentation because no product shipped"
    ),
    "Void the erroneous Form 222 per DEA procedures and issue a corrected lawful order; retain voided records for required retention",
    `Material Form 222 errors require voiding and corrected ordering with record retention — not white-out corrections, unverified supplier shipment, or undocumented discard.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["Form-222", "DEA", "ordering", "documentation", ...PE],
    }
  ),

  // ── Interstate Prescription Transfer — Deeper (3) ───────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient requests transfer of a remaining balance of a non-controlled lisinopril prescription from an out-of-state pharmacy. The receiving pharmacist calls the sending pharmacy, but the person answering provides inconsistent patient and prescriber information and cannot locate the original record.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Complete the transfer because the patient holds a valid label bottle",
      "Withhold transfer until authenticity is verified with the sending pharmacy through reliable contact and required transfer documentation",
      "Create a new prescription independently to avoid delay",
      "Transfer only the remaining quantity verbally without records"
    ),
    "Withhold transfer until authenticity is verified with the sending pharmacy through reliable contact and required transfer documentation",
    `Interstate transfers require verified communication and documentation — patient-held labels, independent new prescriptions, or verbal-only transfers do not satisfy transfer integrity rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["prescription-transfer", "interstate", "verification", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Interstate transfers require verified sending-pharmacy contact — label bottles alone are insufficient.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 41-year-old patient asks to transfer a Schedule III hydrocodone/acetaminophen prescription with one refill remaining from a pharmacy in another state. The sending pharmacy confirms one lawful transfer is permitted but partial fills were already dispensed there.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Transfer and dispense the full original quantity as a new fill",
      "Verify lawful Schedule III transfer rules, confirm remaining authorized quantity and refill status with the sending pharmacy, and document the transfer before dispensing",
      "Refuse all interstate controlled-substance transfers categorically",
      "Dispense without transfer documentation because the patient is traveling"
    ),
    "Verify lawful Schedule III transfer rules, confirm remaining authorized quantity and refill status with the sending pharmacy, and document the transfer before dispensing",
    `Schedule III transfers require verification of remaining authorized quantity and lawful one-time transfer rules — not full-quantity redispensing, blanket refusal, or travel-based documentation waivers.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["prescription-transfer", "interstate", "C-III", "controlled-substances", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 57-year-old patient evacuating from a hurricane requests an emergency transfer of maintenance non-controlled prescriptions from a closed out-of-state pharmacy. The sending pharmacy phone system is down but the patient has a photo of the prescription label and refill history from the patient portal.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense unlimited refills from the photo alone",
      "Follow applicable state emergency and transfer procedures, use alternative verification when possible, and document limited emergency supply or lawful transfer per board rules",
      "Refuse all help because the sending pharmacy cannot be reached",
      "Bill all medications as new prescriptions without prescriber contact in every case"
    ),
    "Follow applicable state emergency and transfer procedures, use alternative verification when possible, and document limited emergency supply or lawful transfer per board rules",
    `Disaster-related transfers may allow alternative verification and limited emergency supply under board rules — not photo-only unlimited refills, blanket refusal, or universal new-Rx billing without assessment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["prescription-transfer", "interstate", "emergency-preparedness", "disaster", ...PE],
    }
  ),

  // ── Bloodborne Pathogen / Needlestick — Deeper (3) ──────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 36-year-old pharmacist sustains a needlestick while administering an influenza vaccine in the immunization room. The patient confirms no known bloodborne infections, and the pharmacist is unsure whether post-exposure evaluation is required.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue vaccinating other patients without documentation because the source patient appears healthy",
      "Follow the pharmacy's bloodborne pathogen exposure control plan, seek immediate medical evaluation, document the exposure, and complete required follow-up per OSHA and protocol",
      "Dispose of the needle and avoid reporting to prevent licensing scrutiny",
      "Ask the patient to sign a waiver releasing the pharmacy from all future liability and resume work"
    ),
    "Follow the pharmacy's bloodborne pathogen exposure control plan, seek immediate medical evaluation, document the exposure, and complete required follow-up per OSHA and protocol",
    `Needlestick exposures require exposure control plan activation, medical evaluation, and documentation — not silent continuation, unreported disposal, or patient waiver substitutes for occupational health follow-up.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OSHA],
      tags: ["bloodborne-pathogens", "needlestick", "OSHA", "immunization", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Needlestick exposures require exposure control plan activation and medical evaluation — not silent continuation.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 42-year-old technician finds a used syringe in the pharmacy restroom sharps container with the lid improperly closed and visible needle hub. The PIC asks whether immunization waste can be discarded in the regular trash when the sharps container is full.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow regular trash disposal until a new sharps container arrives",
      "Secure the container, replace or properly close sharps containers per OSHA requirements, and ensure immunization and other sharps waste use approved containers — not regular trash",
      "Recap needles before placing them in the regular trash bag",
      "Store full sharps containers indefinitely in the restroom"
    ),
    "Secure the container, replace or properly close sharps containers per OSHA requirements, and ensure immunization and other sharps waste use approved containers — not regular trash",
    `Sharps must be disposed in approved closed containers per OSHA — not regular trash, recapped needle disposal, or indefinitely stored open containers.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [OSHA],
      tags: ["bloodborne-pathogens", "sharps", "OSHA", "immunization", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 50-year-old new immunizing pharmacist asks for hepatitis B vaccination records before starting a clinic shift. The pharmacy has an exposure control plan binder but no documentation that immunizing staff were offered hepatitis B vaccination per OSHA.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Begin immunizing because hepatitis B vaccination is optional for all healthcare workers forever",
      "Ensure the exposure control plan includes offered hepatitis B vaccination and training for staff with occupational exposure risk before immunization duties proceed",
      "Require all patients to disclose hepatitis status instead of vaccinating staff",
      "Allow technicians to administer vaccines while pharmacists skip vaccination offers"
    ),
    "Ensure the exposure control plan includes offered hepatitis B vaccination and training for staff with occupational exposure risk before immunization duties proceed",
    `OSHA bloodborne pathogen standards require exposure control plans including offered hepatitis B vaccination for at-risk staff — not optional indefinite deferral, patient disclosure substitutes, or technician-only workarounds.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OSHA],
      tags: ["bloodborne-pathogens", "OSHA", "hepatitis-B", "exposure-control-plan", ...PE],
    }
  ),

  // ── Massachusetts (2) ─────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient requests an influenza vaccine at a Boston pharmacy. The pharmacist completed Massachusetts-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Massachusetts protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Massachusetts protocol requirements",
    `Massachusetts authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Massachusetts access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MA",
      difficulty: 2,
      references: [MA_REF],
      tags: ["massachusetts", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Worcester presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets. Massachusetts requires MassPAT (Prescription Monitoring Program) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query MassPAT, document the review, and apply corresponding-responsibility judgment",
      "Skip MassPAT review for patients with commercial insurance",
      "Query MassPAT only for Schedule II drugs, not hydrocodone combination products",
      "Delegate MassPAT review and dispensing authorization to a technician"
    ),
    "Query MassPAT, document the review, and apply corresponding-responsibility judgment",
    `Massachusetts requires pharmacists to query and document MassPAT review before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MA",
      difficulty: 3,
      references: [MA_REF],
      tags: ["massachusetts", "MassPAT", "PDMP", ...PE],
    }
  ),

  // ── Connecticut (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient in Hartford picks up a new prescription at a community pharmacy. Connecticut aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Connecticut community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CT",
      difficulty: 2,
      references: [CT_REF],
      tags: ["connecticut", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in New Haven presents a new prescription for tramadol 50 mg tablets. Connecticut requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Connecticut PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients paying cash",
      "Query PMP only for Schedule II drugs, not tramadol",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Connecticut PMP, document the review, and apply corresponding-responsibility judgment",
    `Connecticut requires pharmacists to query and document PMP review before dispensing controlled substances. Cash payment does not waive monitoring. Tramadol is controlled under federal and Connecticut schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CT",
      difficulty: 3,
      references: [CT_REF],
      tags: ["connecticut", "PMP", "PDMP", ...PE],
    }
  ),

  // ── Rhode Island (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 67-year-old patient requests a pneumococcal vaccine at a Providence pharmacy. The pharmacist completed Rhode Island-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Rhode Island protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Rhode Island protocol requirements",
    `Rhode Island authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "RI",
      difficulty: 2,
      references: [RI_REF],
      tags: ["rhode-island", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 45-year-old patient in Cranston presents a new prescription for oxycodone 5 mg tablets. Rhode Island requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Rhode Island PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with local prescribers",
      "Query PDMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Rhode Island PDMP, document the review, and apply corresponding-responsibility judgment",
    `Rhode Island requires pharmacists to query and document PDMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "RI",
      difficulty: 3,
      references: [RI_REF],
      tags: ["rhode-island", "PDMP", "PMP", ...PE],
    }
  ),
];
