/**
 * Curated MPJE-style items — physician-educator batch 27.
 * Topics: telehealth prescribing compliance, OSHA hazard communication (non-sterile compounding),
 * prescription tampering / forged Rx, NDC / billing accuracy, MT/AK/HI state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-27";
const PE = ["physician-educator", BATCH, "mpje"];

const RYAN_HAIGHT = {
  label: "Ryan Haight Online Pharmacy Consumer Protection Act",
  url: "https://www.dea.gov/press-releases/2023/05/09/dea-announces-extension-telemedicine-flexibilities",
};
const OSHA = {
  label: "OSHA Hazard Communication Standard (29 CFR 1910.1200)",
  url: "https://www.osha.gov/hazcom",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };
const HI_REF = {
  label: "Hawaii Pharmacy Practice Act",
  citation: "HRS § 461-1 et seq.",
};
const AK_REF = {
  label: "Alaska Pharmacy Practice Act",
  citation: "Alaska Stat. § 08.80 et seq.",
};
const MT_REF = {
  label: "Montana Pharmacy Practice Act",
  citation: "Mont. Code Ann. § 37-7-101 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_27: EnrichedBankItem[] = [
  // ── Telehealth Prescribing Compliance (3) ─────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 41-year-old patient in Montana presents an electronic prescription for tramadol 50 mg tablets issued after a video telehealth visit with a prescriber licensed only in California. The patient has never had an in-person evaluation with the prescriber and no applicable telemedicine exception is documented.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Dispense because telehealth video visits create valid prescriptions in all states",
      "Verify prescriber licensure, patient location, and Ryan Haight / telemedicine requirements for controlled substances before dispensing; refuse or clarify if the prescription is invalid",
      "Dispense if the patient signed a telehealth consent form",
      "Transfer the prescription to an online pharmacy in California"
    ),
    "Verify prescriber licensure, patient location, and Ryan Haight / telemedicine requirements for controlled substances before dispensing; refuse or clarify if the prescription is invalid",
    `Interstate telehealth controlled substance prescriptions require valid prescriber authority, applicable telemedicine exceptions, and Ryan Haight compliance — not video visits alone, consent forms alone, or out-of-state transfer to evade verification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [RYAN_HAIGHT, DEA],
      tags: ["telehealth", "telemedicine", "Ryan-Haight", "controlled-substances", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Interstate telehealth CS Rx requires licensure and Ryan Haight compliance — video alone is insufficient.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 55-year-old patient requests dispensing of a Schedule IV benzodiazepine prescribed through audio-only telehealth from an out-of-state clinician. The pharmacy is in a state that permits telehealth prescribing for non-controlled drugs but the prescriber cannot verify an established patient relationship.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because Schedule IV drugs have lower restrictions than Schedule II",
      "Verify applicable federal and state telehealth and controlled-substance prescribing rules, including patient relationship and authentication requirements, before dispensing",
      "Require the patient to complete an online questionnaire instead of prescriber verification",
      "Dispense a 90-day supply to reduce future telehealth visits"
    ),
    "Verify applicable federal and state telehealth and controlled-substance prescribing rules, including patient relationship and authentication requirements, before dispensing",
    `Schedule IV telehealth prescribing still requires compliance with federal and state authentication and relationship rules — not schedule-based relaxation, questionnaire substitution, or extended supplies without valid authorization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [RYAN_HAIGHT, DEA],
      tags: ["telehealth", "telemedicine", "benzodiazepine", "C-IV", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old rural patient receives maintenance non-controlled medications via telehealth from a prescriber in another state. The pharmacist must confirm whether the prescriber is authorized to prescribe for a patient located in the pharmacy's state before refill processing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Process refills because telehealth automatically authorizes interstate prescribing",
      "Verify the prescriber's authority to prescribe for the patient in the pharmacy state, including licensure and telehealth rules, before dispensing",
      "Require the patient to travel to the prescriber's state for every refill",
      "Bill all telehealth prescriptions as cash to avoid licensing questions"
    ),
    "Verify the prescriber's authority to prescribe for the patient in the pharmacy state, including licensure and telehealth rules, before dispensing",
    `Telehealth does not waive prescriber licensure and state-specific prescribing authority for patients in the dispensing state. Travel mandates for every refill or cash billing to avoid verification fail professional and legal standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["telehealth", "telemedicine", "interstate", "licensure", ...PE],
    }
  ),

  // ── OSHA Hazard Communication — Non-Sterile Compounding (3) ────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 49-year-old compounding pharmacy switches bulk chemical suppliers for niacinamide powder used in non-sterile preparations. New containers arrive without updated Safety Data Sheets (SDS) in the compounding area and staff continue weighing powder at the counter.`,
    "What is the pharmacist's most appropriate action under OSHA hazard communication requirements?",
    opts4(
      "Continue compounding because the chemical name is unchanged",
      "Obtain and make accessible current SDS for the new supplier, update hazard communication training, and use appropriate PPE per USP <795> and OSHA before compounding resumes",
      "Rely on the old supplier SDS indefinitely",
      "Allow technicians to compound without SDS access if the pharmacist is in the building"
    ),
    "Obtain and make accessible current SDS for the new supplier, update hazard communication training, and use appropriate PPE per USP <795> and OSHA before compounding resumes",
    `Supplier changes require current SDS, accessible hazard communication, and PPE — not assumptions that chemical identity alone suffices, obsolete SDS, or technician compounding without hazard controls.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OSHA, USP795],
      tags: ["hazard-communication", "OSHA", "SDS", "nonsterile", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "New chemical suppliers require updated SDS and hazard communication before compounding resumes.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 44-year-old technician splashes compounded topical base containing salicylic acid into their eye while transferring material without goggles. The pharmacy has no written hazard communication program and no documented eyewash location training for compounding staff.`,
    "What is the pharmacist's most appropriate immediate and follow-up action?",
    opts4(
      "Tell the technician to finish the batch before seeking care",
      "Provide immediate first aid including eyewash per SDS directions, seek medical care as indicated, and implement hazard communication training and PPE requirements",
      "Document the incident as non-work-related to avoid OSHA reporting",
      "Discontinue all compounding permanently without assessing controls"
    ),
    "Provide immediate first aid including eyewash per SDS directions, seek medical care as indicated, and implement hazard communication training and PPE requirements",
    `Chemical splashes require immediate SDS-guided first aid and medical evaluation when indicated, plus hazard program remediation — not delayed care, misclassified incidents, or blanket compounding cessation without corrective controls.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OSHA, USP795],
      tags: ["hazard-communication", "OSHA", "PPE", "exposure", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old PIC finds non-sterile compounded chemical concentrates stored in unmarked secondary containers in the compounding room. Technicians identify contents by memory because labels faded after cleaning.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow unmarked containers if staff recognize the chemicals",
      "Ensure secondary containers are labeled with chemical identity and hazard information per OSHA hazard communication and USP <795> requirements",
      "Store all chemicals in the break room to avoid inspection",
      "Use prescription labels alone without chemical hazard identifiers"
    ),
    "Ensure secondary containers are labeled with chemical identity and hazard information per OSHA hazard communication and USP <795> requirements",
    `Secondary chemical containers require identity and hazard labeling — not staff memory, concealment, or prescription-style labels without hazard communication elements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [OSHA, USP795],
      tags: ["hazard-communication", "OSHA", "labeling", "secondary-container", ...PE],
    }
  ),

  // ── Prescription Tampering / Forged Rx (3) ────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 38-year-old patient presents a photocopied prescription for oxycodone 10 mg tablets on plain paper. The copy shows irregular prescriber signature shading and a DEA number that fails check-digit validation. The patient insists the original was lost.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense from the photocopy because the patient appears trustworthy",
      "Withhold dispensing, verify prescriber and prescription authenticity per policy, and report suspected forgery if confirmed",
      "Accept a patient-written note confirming the prescription",
      "Dispense a partial supply to reduce liability"
    ),
    "Withhold dispensing, verify prescriber and prescription authenticity per policy, and report suspected forgery if confirmed",
    `Photocopied controlled substance prescriptions with invalid DEA numbers and signature irregularities require verification and possible forgery reporting — not trust-based dispensing, patient notes, or partial undocumented supplies.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["forgery", "prescription-validity", "red-flags", "tampering", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "Photocopied CS Rx with invalid DEA and signature red flags require verification — do not dispense.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 46-year-old patient presents a faxed prescription for alprazolam 1 mg tablets. The quantity appears changed from 30 to 120 tablets with visible correction fluid over the original number. The prescriber office is closed for the weekend.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense 120 tablets because the fax is from a medical office",
      "Refuse to dispense the altered prescription and verify an unaltered order with the prescriber when available",
      "Dispense 30 tablets based on the original visible number without prescriber contact",
      "Accept the patient's verbal request for 120 tablets"
    ),
    "Refuse to dispense the altered prescription and verify an unaltered order with the prescriber when available",
    `Altered or tampered prescriptions — including quantity changes with correction fluid — must not be dispensed without prescriber verification of the authentic order. Weekend closure does not authorize dispensing visibly altered controlled substance prescriptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["forgery", "tampering", "prescription-validity", "benzodiazepine", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old pharmacist calls a prescriber office to verify a new hydrocodone prescription after noticing mismatched letterhead and unusual abbreviations. The prescriber states they did not write the prescription and has no record of the patient visit.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the patient may have seen a covering provider",
      "Refuse to dispense, document the forgery report, retain the prescription, and notify appropriate authorities per policy and law",
      "Return the prescription to the patient to obtain a different prescriber",
      "Dispense a non-controlled cough syrup instead without documentation"
    ),
    "Refuse to dispense, document the forgery report, retain the prescription, and notify appropriate authorities per policy and law",
    `Confirmed prescriber denial of a controlled substance prescription requires refusal, documentation, and appropriate reporting — not assumption of covering providers, patient return without report, or undocumented substitution.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["forgery", "prescription-validity", "callback-verification", ...PE],
    }
  ),

  // ── NDC / Billing Accuracy (3) ──────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old technician adjudicates a generic atorvastatin claim using an NDC for a 90-count bottle while dispensing a 30-count bottle from a different manufacturer with the same strength.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the mismatch because the drug strength is identical",
      "Correct the claim to reflect the actual manufacturer and package size NDC dispensed per billing accuracy requirements",
      "Always bill the 90-count NDC to maximize reimbursement",
      "Bill brand NDC when generic is dispensed to increase payment"
    ),
    "Correct the claim to reflect the actual manufacturer and package size NDC dispensed per billing accuracy requirements",
    `Claims must use the NDC for the actual product dispensed — identical strength does not authorize package-size or manufacturer mismatch. Inflated NDC billing and brand NDC misrepresentation constitute fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["NDC", "billing-accuracy", "adjudication", "generic", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Claims must match the actual dispensed product NDC — strength alone does not justify mismatch.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old PBM audit identifies 20 claims billed under a high-reimbursement brand NDC for inhalers while dispensing records show a lower-reimbursement generic product was physically dispensed to patients.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Argue that therapeutic equivalence makes brand NDC billing acceptable",
      "Review audit findings, provide accurate dispensing and claim records, and correct billing practices to match dispensed NDCs going forward",
      "Alter historical dispensing records to match the billed brand NDC",
      "Bill patients retroactively for the audit difference"
    ),
    "Review audit findings, provide accurate dispensing and claim records, and correct billing practices to match dispensed NDCs going forward",
    `Therapeutic equivalence does not permit billing a brand NDC when a generic was dispensed. Record alteration and patient retro-billing are fraud — accurate records and corrected NDC submission are required.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["NDC", "billing-accuracy", "PBM", "audit", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old pharmacy manager instructs staff to select whichever generic NDC adjudicates at the highest reimbursement regardless of which manufacturer's product is in stock, updating inventory records after the fact.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Follow the manager to meet revenue targets",
      "Maintain accurate NDC selection matching the physical product dispensed and inventory; refuse claim misrepresentation",
      "Stop dispensing all generics until reimbursement equalizes",
      "Bill all claims as cash to avoid NDC rules"
    ),
    "Maintain accurate NDC selection matching the physical product dispensed and inventory; refuse claim misrepresentation",
    `NDC selection must match the dispensed product — not post-hoc inventory updates for reimbursement optimization. Revenue-target misrepresentation, generic cessation, or cash conversion violate payer contracts and fraud laws.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["NDC", "billing-accuracy", "inventory", "fraud-prevention", ...PE],
    }
  ),

  // ── Montana (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests an influenza vaccine at a Billings pharmacy. The pharmacist holds valid Montana immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Montana protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Montana protocol requirements",
    `Montana authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Montana access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MT",
      difficulty: 2,
      references: [MT_REF],
      tags: ["montana", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient in Missoula picks up a new prescription at a community pharmacy. Montana aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Montana community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MT",
      difficulty: 2,
      references: [MT_REF],
      tags: ["montana", "offer-to-counsel", ...PE],
    }
  ),

  // ── Alaska (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 47-year-old pharmacist licensed in Washington begins dispensing at an Anchorage retail pharmacy before obtaining an Alaska pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Alaska licensure?",
    opts4(
      "Continue dispensing under the Washington license until Alaska approves",
      "Obtain an Alaska pharmacist license before practicing in the state",
      "Register with DEA only and defer Alaska board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain an Alaska pharmacist license before practicing in the state",
    `Alaska requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Alaska pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AK",
      difficulty: 2,
      references: [AK_REF],
      tags: ["alaska", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests a pneumococcal vaccine at a Fairbanks pharmacy. The pharmacist completed Alaska-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Alaska protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Alaska protocol requirements",
    `Alaska authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AK",
      difficulty: 2,
      references: [AK_REF],
      tags: ["alaska", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── Hawaii (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 65-year-old patient in Honolulu picks up a new prescription for a high-risk medication. Hawaii community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Hawaii community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "HI",
      difficulty: 2,
      references: [HI_REF],
      tags: ["hawaii", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 56-year-old patient requests a shingles vaccine at a Hilo pharmacy. The pharmacist holds valid Hawaii immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Hawaii protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Hawaii protocol requirements",
    `Hawaii authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "HI",
      difficulty: 2,
      references: [HI_REF],
      tags: ["hawaii", "immunization", "shingles", ...PE],
    }
  ),
];
