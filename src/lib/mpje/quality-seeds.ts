/**
 * 50 high-yield MPJE v2 seeds — Oklahoma-heavy, K-type, SATA, scenario vignettes.
 * Merged into MPJE_QUESTION_BANK; synced to QuestionBankItem via ensureStaticSeedsForField.
 */
import type { BankItem } from "@/lib/question-bank";
import { mpjeKType, mpjeMcq, mpjeSelectAll } from "./seed-helpers";

const OK_REF = {
  label: "Oklahoma Pharmacy Act / OBN rules",
  citation: "63 O.S. § 1521 et seq.; OAC 535:15",
};
const FED_REF = {
  label: "Federal pharmacy law",
  citation: "21 CFR / DEA / HIPAA",
};

export const MPJE_QUALITY_SEEDS: BankItem[] = [
  // ── Oklahoma K-type (8) ──────────────────────────────────────────────
  mpjeKType(
    "Regarding controlled substance handling at an Oklahoma community pharmacy, which statements are correct?",
    [
      "Schedule II prescriptions may not be refilled without a new written order.",
      "Partial fills of Schedule II are permitted when the patient is in a LTC facility or terminally ill with prescriber notation.",
      "An Oklahoma pharmacist may accept an oral emergency C-II prescription only when state and federal rules both allow documentation within 7 days.",
    ],
    [true, true, true],
    {
      subjectId: "controlled-substances",
      stateCode: "OK",
      explanation:
        "Federal law bars C-II refills; limited partial-fill exceptions exist. Oklahoma follows federal CS rules with board-specific documentation for emergencies.",
      tags: ["oklahoma", "C-II", "partial-fill"],
      references: [OK_REF],
    },
    "A PIC at a Tulsa chain pharmacy reviews a weekend emergency order for oxycodone 10 mg tablets after a post-surgical patient runs out on Saturday night."
  ),
  mpjeKType(
    "An Oklahoma pharmacist-in-charge is updating technician supervision policies. Which statements are correct?",
    [
      "The PIC remains legally responsible for all dispensing even when tasks are delegated to technicians.",
      "Technicians may perform final verification of pharmacist-only functions if the store is busy.",
      "Board rules define technician training and ratio requirements the PIC must enforce.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      stateCode: "OK",
      explanation:
        "PIC liability cannot be delegated. Final verification and clinical judgment remain pharmacist-only; technicians work within board-defined scope.",
      tags: ["oklahoma", "PIC", "technician"],
      references: [OK_REF],
    }
  ),
  mpjeKType(
    "A patient requests transfer of all Oklahoma prescriptions to a mail-order pharmacy. Which statements are correct?",
    [
      "The receiving pharmacy must document transfer per board rules and maintain a retrievable record.",
      "Controlled substance prescriptions may be transferred only once between pharmacies if schedules and rules permit.",
      "Transfer of C-II prescriptions between pharmacies is generally prohibited under federal law.",
    ],
    [true, true, true],
    {
      subjectId: "dispensing-procedures",
      stateCode: "OK",
      explanation:
        "Non-controlled transfers follow state documentation rules. C-III–V may transfer once if permitted; C-II transfers are federally prohibited.",
      tags: ["oklahoma", "transfer"],
      references: [OK_REF],
    },
    "Mrs. Chen, 68, moves from Norman to a rural Oklahoma town and wants every active Rx moved to a new local pharmacy before her trip."
  ),
  mpjeKType(
    "Regarding pharmacist immunization practice in Oklahoma, which statements are correct?",
    [
      "Pharmacists must complete board-approved training before administering vaccines.",
      "A standing protocol or prescriber authorization is required for pharmacist-administered immunizations.",
      "Technicians may independently administer influenza vaccines without pharmacist presence.",
    ],
    [true, true, false],
    {
      subjectId: "pharmacy-operations",
      stateCode: "OK",
      explanation:
        "Oklahoma immunization authority requires pharmacist training and protocol/prescriber oversight. Vaccine administration is not in technician scope.",
      tags: ["oklahoma", "immunization"],
      references: [OK_REF],
    }
  ),
  mpjeKType(
    "An Oklahoma inspector reviews compounding records. Which statements are correct?",
    [
      "Non-sterile compounding must follow USP <795> standards adopted by the board.",
      "Beyond-use dating must be assigned and documented for compounded preparations.",
      "Compounding logs may be discarded after 30 days regardless of board retention rules.",
    ],
    [true, true, false],
    {
      subjectId: "compounding-regulations",
      stateCode: "OK",
      explanation:
        "USP <795> BUD and documentation apply. Oklahoma requires retention per board rules—often years, not 30 days.",
      tags: ["oklahoma", "USP-795"],
      references: [OK_REF],
    }
  ),
  mpjeKType(
    "A pharmacy receives a suspicious cash payer for multiple early oxycodone refills in Oklahoma City. Which statements are correct?",
    [
      "The pharmacist should evaluate red flags and may refuse to fill if a valid medical purpose is not established.",
      "Oklahoma pharmacies must report every early refill to DEA within 24 hours regardless of suspicion.",
      "PDMP review is part of corresponding responsibility before dispensing controlled substances.",
    ],
    [true, false, true],
    {
      subjectId: "controlled-substances",
      stateCode: "OK",
      explanation:
        "Corresponding responsibility and PDMP checks are mandatory practices; suspicious orders are reported when warranted, not every early fill automatically.",
      tags: ["oklahoma", "red-flags", "PDMP"],
      references: [OK_REF],
    }
  ),
  mpjeKType(
    "Regarding confidentiality at an Oklahoma pharmacy counter, which statements are correct?",
    [
      "HIPAA minimum necessary applies when discussing PHI with caregivers present.",
      "A spouse may always receive full medication profiles without patient consent.",
      "Counseling offers must be documented when required by state and federal rules.",
    ],
    [true, false, true],
    {
      subjectId: "patient-privacy",
      stateCode: "OK",
      explanation:
        "Disclosures to family require patient permission or permitted exceptions. Offer-to-counsel documentation is a dispensing compliance element.",
      tags: ["oklahoma", "HIPAA", "counseling"],
      references: [OK_REF],
    }
  ),
  mpjeKType(
    "An Oklahoma pharmacist discovers a colleague diverting tramadol. Which statements are correct?",
    [
      "Mandatory reporting to the board or appropriate authority may be required when impairment or diversion is suspected.",
      "The pharmacist should document internal findings and secure controlled substance records.",
      "Ignoring diversion protects patient privacy and avoids workplace conflict.",
    ],
    [true, true, false],
    {
      subjectId: "pharmacy-ethics",
      stateCode: "OK",
      explanation:
        "Professional duty and board rules require action on diversion; documentation and CS record integrity are essential.",
      tags: ["oklahoma", "diversion", "ethics"],
      references: [OK_REF],
    }
  ),

  // ── Federal / uniform K-type (10) ──────────────────────────────────────
  mpjeKType(
    "A mail-order pharmacy ships Schedule III refills interstate. Which federal statements are correct?",
    [
      "C-III prescriptions may be refilled up to five times within six months if authorized.",
      "C-III refills require no quantity limits or authorization on the original prescription.",
      "Federal law preempts less restrictive state refill rules for controlled substances.",
    ],
    [true, false, false],
    {
      subjectId: "controlled-substances",
      explanation:
        "21 CFR Part 1306 limits C-III–V refills to five in six months. States may be more restrictive; federal does not preempt stricter state law.",
      tags: ["federal", "C-III", "refills"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "A hospital pharmacist receives a disaster-relief oral order. Which statements are correct under typical federal/uniform patterns?",
    [
      "Emergency oral orders must be reduced to writing with required elements within the permitted timeframe.",
      "Quantity limits for emergency supplies may be restricted by state and institutional policy.",
      "Technicians may accept prescriber orders for new controlled substances without pharmacist involvement.",
    ],
    [true, true, false],
    {
      subjectId: "dispensing-procedures",
      explanation:
        "Emergency oral Rx rules require pharmacist involvement and written follow-up. Technicians cannot accept new CS orders independently.",
      tags: ["federal", "emergency", "oral-Rx"],
      references: [FED_REF],
    },
    "After a tornado, a volunteer clinic sends a nurse practitioner oral order for antibiotic suspension for a child with no written Rx available."
  ),
  mpjeKType(
    "Regarding DSCSA product tracing at a retail pharmacy, which statements are correct?",
    [
      "Pharmacies must quarantine suspect products lacking required transaction history.",
      "Dispensing without verifying trading partners is acceptable for urgent patient needs.",
      "Suspect or illegitimate product investigations must be documented.",
    ],
    [true, false, true],
    {
      subjectId: "federal-pharmacy-law",
      explanation:
        "DSCSA requires investigation and quarantine of suspect products; shortcuts bypassing tracing violate federal supply-chain rules.",
      tags: ["federal", "DSCSA"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "A specialty pharmacy compounds sterile chemotherapy. Which statements are correct?",
    [
      "USP <797> standards apply to sterile compounding risk levels.",
      "Garbing, environmental monitoring, and BUD assignment are required elements.",
      "Non-sterile compounding rules alone satisfy oncology IV admixture requirements.",
    ],
    [true, true, false],
    {
      subjectId: "compounding-regulations",
      explanation:
        "Sterile hazardous compounding requires USP <797> (and <800> for hazardous drugs), not only <795>.",
      tags: ["federal", "USP-797", "sterile"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "An employer requests workers' compensation claim records from a pharmacy. Which HIPAA statements are correct?",
    [
      "Disclosure may be permitted without patient authorization when required by workers' comp law.",
      "The pharmacy may disclose the entire patient profile to any employer on request.",
      "Minimum necessary standard still applies to permitted disclosures.",
    ],
    [true, false, true],
    {
      subjectId: "patient-privacy",
      explanation:
        "HIPAA permits certain workers' comp disclosures by law but limits scope to minimum necessary—not blanket profile release.",
      tags: ["federal", "HIPAA", "workers-comp"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "A wholesaler delivers damaged C-II bottles with broken seals. Which statements are correct?",
    [
      "The pharmacist should refuse acceptance and document the discrepancy.",
      "DEA Form 222 or electronic equivalent integrity must be maintained for C-II procurement.",
      "Damaged seals may be ignored if the invoice matches the shipment count.",
    ],
    [true, true, false],
    {
      subjectId: "controlled-substances",
      explanation:
        "CS receiving requires intact chain of custody; damaged seals trigger investigation and refusal per DEA rules.",
      tags: ["federal", "DEA", "receiving"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "Regarding FDA OTC switch and pharmacist counseling, which statements are correct?",
    [
      "Pharmacists must offer counseling on new prescriptions including those for newly OTC-switched products when dispensed by Rx.",
      "OTC status eliminates all labeling requirements for former prescription products.",
      "Misbranding rules under the FDCA still apply to OTC labeling claims.",
    ],
    [true, false, true],
    {
      subjectId: "federal-pharmacy-law",
      explanation:
        "Rx counseling rules attach to dispensed prescriptions. OTC products remain subject to FDA labeling and misbranding standards.",
      tags: ["federal", "FDA", "OTC"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "A pharmacy intern precepts at a university site. Which uniform licensure statements are correct?",
    [
      "Interns must practice under a preceptor pharmacist within board-defined ratios.",
      "Interns may serve as PIC during the preceptor's lunch break without notification.",
      "Intern hours must be documented for board licensure credit.",
    ],
    [true, false, true],
    {
      subjectId: "state-practice-act",
      explanation:
        "Intern scope is supervised and documented; PIC duties require a licensed pharmacist in charge.",
      tags: ["uniform", "intern", "licensure"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "A patient requests a HIPAA restriction on disclosure to a health plan for a self-pay item. Which statements are correct?",
    [
      "Pharmacies must comply with valid restriction requests when paid out-of-pocket in full.",
      "Restrictions apply to all future disclosures to any party without limitation.",
      "The pharmacy should document the restriction in policies and train staff.",
    ],
    [true, false, true],
    {
      subjectId: "patient-privacy",
      explanation:
        "HIPAA right to restrict applies to self-pay situations with specific scope—not unlimited global restriction.",
      tags: ["federal", "HIPAA", "restriction"],
      references: [FED_REF],
    }
  ),
  mpjeKType(
    "During a DEA inspection, which inventory statements are correct?",
    [
      "Biennial inventory of controlled substances is required for pharmacies.",
      "Perpetual inventory is required for Schedule II substances.",
      "Annual inventory alone satisfies all Schedule II record requirements.",
    ],
    [true, true, false],
    {
      subjectId: "controlled-substances",
      explanation:
        "DEA requires biennial inventory plus ongoing perpetual records for C-II; annual-only is insufficient.",
      tags: ["federal", "DEA", "inventory"],
      references: [FED_REF],
    }
  ),

  // ── SATA (7) ───────────────────────────────────────────────────────────
  mpjeSelectAll(
    "Which actions are appropriate when a Oklahoma pharmacist identifies a forged hydrocodone prescription? Select all that apply.",
    [
      "Refuse to dispense and document the incident",
      "Retain the prescription if permitted by state law",
      "Notify local law enforcement or board as required",
      "Dispense a partial quantity to avoid confrontation",
      "Contact the prescriber to verify only after dispensing",
    ],
    [
      "Refuse to dispense and document the incident",
      "Retain the prescription if permitted by state law",
      "Notify local law enforcement or board as required",
    ],
    {
      subjectId: "controlled-substances",
      stateCode: "OK",
      explanation:
        "Forgery requires refusal, documentation, retention per law, and reporting. Partial fills or dispense-first approaches violate corresponding responsibility.",
      tags: ["oklahoma", "forgery"],
      references: [OK_REF],
    },
    "A college student presents a hydrocodone 7.5/325 prescription with mismatched prescriber DEA number and no office stamp."
  ),
  mpjeSelectAll(
    "Which elements are typically required for a valid prescription under uniform MPJE patterns? Select all that apply.",
    [
      "Patient identification",
      "Drug name and strength",
      "Quantity and directions for use",
      "Prescriber signature and date",
      "Pharmacist's social security number",
    ],
    ["Patient identification", "Drug name and strength", "Quantity and directions for use", "Prescriber signature and date"],
    {
      subjectId: "uniform-mpje",
      explanation: "Core validity elements are tested nationally; pharmacist SSN is not a prescription requirement.",
      tags: ["uniform", "validity"],
      references: [FED_REF],
    }
  ),
  mpjeSelectAll(
    "Which records should be available during a routine board inspection? Select all that apply.",
    [
      "Prescription files (electronic or hard copy)",
      "Controlled substance perpetual inventory",
      "Compounding master formulation records",
      "Employee personal credit reports",
      "Policies for technician supervision",
    ],
    [
      "Prescription files (electronic or hard copy)",
      "Controlled substance perpetual inventory",
      "Compounding master formulation records",
      "Policies for technician supervision",
    ],
    {
      subjectId: "pharmacy-operations",
      explanation: "Inspections focus on dispensing, CS, compounding, and supervision policies—not personal credit data.",
      tags: ["inspection", "records"],
      references: [FED_REF],
    }
  ),
  mpjeSelectAll(
    "A Oklahoma LTC consultant pharmacist reviews psychotropic utilization. Which duties apply? Select all that apply.",
    [
      "Monthly drug regimen review with documented recommendations",
      "Reporting irregularities to the medical director and DON",
      "Independent prescriptive authority to change all orders without contact",
      "Ensuring unnecessary medications are identified",
      "Delegating the entire review to uncertified dietary staff",
    ],
    [
      "Monthly drug regimen review with documented recommendations",
      "Reporting irregularities to the medical director and DON",
      "Ensuring unnecessary medications are identified",
    ],
    {
      subjectId: "pharmacy-operations",
      stateCode: "OK",
      explanation:
        "Consultant pharmacists perform regimen reviews and report issues; they do not unilaterally change orders or delegate clinical review to non-pharmacy staff.",
      tags: ["oklahoma", "LTC", "consultant"],
      references: [OK_REF],
    }
  ),
  mpjeSelectAll(
    "Which are federal Schedule I characteristics? Select all that apply.",
    [
      "No currently accepted medical use in the United States",
      "High potential for abuse",
      "May be refilled up to five times in six months",
      "Not typically dispensed at retail pharmacies",
      "Same partial-fill rules as Schedule III",
    ],
    [
      "No currently accepted medical use in the United States",
      "High potential for abuse",
      "Not typically dispensed at retail pharmacies",
    ],
    {
      subjectId: "controlled-substances",
      explanation: "Schedule I drugs lack accepted medical use and are not retail-dispensed; refill rules apply to C-III–V.",
      tags: ["federal", "schedule-I"],
      references: [FED_REF],
    }
  ),
  mpjeSelectAll(
    "Which counseling or privacy steps apply when a teenager picks up isotretinoin? Select all that apply.",
    [
      "Verify iPLEDGE requirements and REMS documentation",
      "Provide mandatory patient counseling per REMS",
      "Post the patient's diagnosis on the pickup bag",
      "Offer confidential counseling away from the counter crowd",
      "Share records with the patient's employer without authorization",
    ],
    ["Verify iPLEDGE requirements and REMS documentation", "Provide mandatory patient counseling per REMS", "Offer confidential counseling away from the counter crowd"],
    {
      subjectId: "dispensing-procedures",
      explanation: "REMS programs require documentation and counseling; PHI must not be publicized or disclosed to employers without permission.",
      tags: ["federal", "REMS", "counseling"],
      references: [FED_REF],
    }
  ),
  mpjeSelectAll(
    "Which steps are required after a significant theft of C-II stock? Select all that apply.",
    [
      "File DEA Form 106",
      "Notify local law enforcement as required",
      "Update perpetual inventory and investigate root cause",
      "Resume dispensing C-II without documentation to avoid backlog",
      "Notify the state board of pharmacy if required",
    ],
    [
      "File DEA Form 106",
      "Notify local law enforcement as required",
      "Update perpetual inventory and investigate root cause",
      "Notify the state board of pharmacy if required",
    ],
    {
      subjectId: "controlled-substances",
      explanation: "Theft triggers DEA 106, law enforcement, inventory reconciliation, and board notification per state rules.",
      tags: ["federal", "theft", "DEA-106"],
      references: [FED_REF],
    }
  ),

  // ── Scenario vignettes + MCQ (25) ──────────────────────────────────────
  mpjeMcq(
    "What is the pharmacist's best next step?",
    [
      "Verify the order with the prescriber and clarify the duplicate before dispensing either Rx",
      "Dispense both prescriptions because the patient insists",
      "Fill only the newer prescription and discard the older one",
      "Ask the technician to choose the lower-cost option",
    ],
    "Verify the order with the prescriber and clarify the duplicate before dispensing either Rx",
    {
      subjectId: "dispensing-procedures",
      stateCode: "OK",
      explanation:
        "Therapeutic duplication requires pharmacist intervention and prescriber clarification under Oklahoma dispensing standards.",
      tags: ["oklahoma", "DUR", "duplication"],
      references: [OK_REF],
    },
    "An Oklahoma retail pharmacist receives two electronic prescriptions from different prescribers: metformin 1000 mg BID and metformin 500 mg QAM + 1000 mg QPM for the same patient."
  ),
  mpjeMcq(
    "How should the pharmacist handle the transfer request?",
    [
      "Explain that C-II prescriptions cannot be transferred and contact the prescriber for a new prescription at the receiving pharmacy",
      "Transfer the C-II using the interstate transfer form",
      "Transfer once and document in the profile note",
      "Ask the patient to photocopy the bottle label as a new Rx",
    ],
    "Explain that C-II prescriptions cannot be transferred and contact the prescriber for a new prescription at the receiving pharmacy",
    {
      subjectId: "controlled-substances",
      stateCode: "OK",
      explanation: "Federal law prohibits transfer of C-II prescriptions between pharmacies.",
      tags: ["oklahoma", "transfer", "C-II"],
      references: [OK_REF],
    },
    "A patient moving from Edmond to Stillwater asks the pharmacist to transfer an active oxycodone 5 mg prescription to another Oklahoma pharmacy."
  ),
  mpjeMcq(
    "What action complies with Oklahoma and federal rules?",
    [
      "Decline to fill until a valid hard copy or compliant electronic prescription is received",
      "Fill a 30-day supply based on the patient's verbal assurance",
      "Allow the technician to document the prescriber's cell number as authorization",
      "Fill an emergency quantity without any record",
    ],
    "Decline to fill until a valid hard copy or compliant electronic prescription is received",
    {
      subjectId: "dispensing-procedures",
      stateCode: "OK",
      explanation:
        "C-II requires a written or compliant EPCS order; voicemail alone is insufficient except in narrow emergency rules with strict documentation.",
      tags: ["oklahoma", "C-II", "voicemail"],
      references: [OK_REF],
    },
    "A patient presents a smartphone photo of a hydrocodone prescription left as voicemail by a clinic that closed for the day."
  ),
  mpjeMcq(
    "The Oklahoma pharmacist should:",
    [
      "Offer private counseling and verify whether the caregiver is authorized to receive PHI",
      "Announce the medication name loudly so the waiting room can assist",
      "Refuse to dispense because a caregiver is present",
      "Mail the medication to the caregiver without patient consent",
    ],
    "Offer private counseling and verify whether the caregiver is authorized to receive PHI",
    {
      subjectId: "patient-privacy",
      stateCode: "OK",
      explanation: "HIPAA and professional standards require confidential counseling and authorized disclosures only.",
      tags: ["oklahoma", "counseling", "caregiver"],
      references: [OK_REF],
    },
    "An elderly patient with mild cognitive impairment picks up donepezil with an adult daughter who demands to know whether the patient has been adherent."
  ),
  mpjeMcq(
    "The PIC's best response is:",
    [
      "Implement quarantine, notify the wholesaler, and investigate tracing data before dispensing",
      "Dispense immediately because the NDC matches",
      "Return to stock and ignore if no patient complaints occur",
      "Destroy product without recording the event",
    ],
    "Implement quarantine, notify the wholesaler, and investigate tracing data before dispensing",
    {
      subjectId: "federal-pharmacy-law",
      explanation: "DSCSA mandates investigation of missing tracing and quarantine of suspect product.",
      tags: ["federal", "DSCSA", "quarantine"],
      references: [FED_REF],
    },
    "A wholesaler shipment of insulin pens arrives without 3T transaction history at an Oklahoma pharmacy during a shortage."
  ),
  mpjeMcq(
    "The pharmacist should:",
    [
      "Contact the prescriber to clarify indication and document rationale if continued therapy is appropriate",
      "Auto-refill indefinitely because the insurance plan allows 90-day supplies",
      "Switch the patient to an OTC alternative without prescriber approval",
      "Cancel the prescription without notifying anyone",
    ],
    "Contact the prescriber to clarify indication and document rationale if continued therapy is appropriate",
    {
      subjectId: "dispensing-procedures",
      stateCode: "OK",
      explanation: "Long-term PPI use requires DUR and prescriber collaboration to prevent inappropriate continuation.",
      tags: ["oklahoma", "DUR", "PPI"],
      references: [OK_REF],
    },
    "PDMP review shows a patient received opioid prescriptions from two prescribers; the pharmacist also notes a 2-year esomeprazole refill with no diagnosis on file."
  ),
  mpjeMcq(
    "Under DEA rules, the pharmacist may:",
    [
      "Provide a partial fill and document the remaining quantity with prescriber authorization when permitted",
      "Refill the remaining tablets next month without documentation",
      "Transfer the remainder to another pharmacy as a C-II transfer",
      "Discard leftover tablets without inventory adjustment",
    ],
    "Provide a partial fill and document the remaining quantity with prescriber authorization when permitted",
    {
      subjectId: "controlled-substances",
      explanation:
        "Partial fills of C-II are limited to LTC/terminally ill with notation; documentation and inventory updates are mandatory.",
      tags: ["federal", "partial-fill"],
      references: [FED_REF],
    },
    "A hospice nurse requests a 10-tablet partial fill of oxycodone 20 mg with prescriber notation 'terminal illness' on the prescription."
  ),
  mpjeMcq(
    "The Oklahoma board would most likely find:",
    [
      "A violation for inadequate supervision and dispensing without pharmacist verification",
      "Full compliance because technicians are certified",
      "No issue if no patient harm occurred",
      "Acceptable if the store met script count quotas",
    ],
    "A violation for inadequate supervision and dispensing without pharmacist verification",
    {
      subjectId: "state-practice-act",
      stateCode: "OK",
      explanation: "Pharmacist verification of dispensing is non-delegable; technician certification does not replace pharmacist check.",
      tags: ["oklahoma", "supervision", "violation"],
      references: [OK_REF],
    },
    "Board investigation reveals a busy Oklahoma store where technicians performed final verification on 40 new prescriptions during a pharmacist lunch break."
  ),
  mpjeMcq(
    "The pharmacist's appropriate action is:",
    [
      "Use professional judgment to dispense a therapeutic equivalent only if the prescriber approves substitution",
      "Substitute another GLP-1 because it is in the same class",
      "Refuse and tell the patient to switch pharmacies permanently",
      "Substitute without contact because the drug is unavailable nationwide",
    ],
    "Use professional judgment to dispense a therapeutic equivalent only if the prescriber approves substitution",
    {
      subjectId: "dispensing-procedures",
      explanation: "Therapeutic substitution of non-equivalent agents requires prescriber authorization.",
      tags: ["uniform", "substitution"],
      references: [FED_REF],
    },
    "A patient needs semaglutide pens but the pharmacy is out of stock; a different GLP-1 is available."
  ),
  mpjeMcq(
    "Compliance requires the pharmacy to:",
    [
      "Maintain separate records, security, and labeling standards for hazardous drug compounding per USP <800>",
      "Treat hazardous compounding like OTC repackaging",
      "Skip environmental controls if batch size is under five units",
      "Allow food in the compounding area to boost staff morale",
    ],
    "Maintain separate records, security, and labeling standards for hazardous drug compounding per USP <800>",
    {
      subjectId: "compounding-regulations",
      explanation: "USP <800> governs hazardous drug handling, storage, and documentation beyond general <795>/<797>.",
      tags: ["federal", "USP-800"],
      references: [FED_REF],
    },
    "An oncology clinic requests compounded hazardous preparations shipped from a Oklahoma compounding pharmacy."
  ),
  mpjeMcq(
    "The pharmacist should:",
    [
      "Decline to fill and counsel on dangerous interaction; contact prescriber if patient insists",
      "Dispense both because the patient signed a waiver",
      "Fill the MAOI and hold the pseudoephedrine for later without documentation",
      "Ask the cashier to resolve the interaction",
    ],
    "Decline to fill and counsel on dangerous interaction; contact prescriber if patient insists",
    {
      subjectId: "dispensing-procedures",
      explanation: "Severe drug interactions trigger corresponding responsibility; waivers do not override pharmacist duty.",
      tags: ["uniform", "DUR", "interaction"],
      references: [FED_REF],
    },
    "A patient on phenelzine requests OTC pseudoephedrine for congestion and becomes upset when the pharmacist raises a hypertensive crisis risk."
  ),
  mpjeMcq(
    "Under typical MPJE uniform rules, electronic prescriptions must:",
    [
      "Meet federal and state EPCS standards with prescriber authentication",
      "Be accepted from any emailed PDF without verification",
      "Replace all record-keeping requirements",
      "Bypass DUR because they are digital",
    ],
    "Meet federal and state EPCS standards with prescriber authentication",
    {
      subjectId: "uniform-mpje",
      explanation: "Valid e-prescribing requires compliant systems and authentication; email PDFs are not automatically valid.",
      tags: ["uniform", "EPCS"],
      references: [FED_REF],
    }
  ),
  mpjeMcq(
    "The Oklahoma pharmacist should:",
    [
      "Verify intern status with the board, ensure preceptor availability, and document supervision",
      "Allow independent PIC shifts for the intern immediately",
      "Permit the intern to counsel on controlled substances without oversight",
      "Skip documentation if the intern is enrolled in an out-of-state program",
    ],
    "Verify intern status with the board, ensure preceptor availability, and document supervision",
    {
      subjectId: "state-practice-act",
      stateCode: "OK",
      explanation: "Intern practice requires active intern registration and documented preceptor supervision per Oklahoma rules.",
      tags: ["oklahoma", "intern"],
      references: [OK_REF],
    },
    "A pharmacy school intern from out of state begins an Oklahoma rotation and asks to verify prescriptions solo on the first day."
  ),
  mpjeMcq(
    "Federal law requires the pharmacy to:",
    [
      "Maintain a bound or compliant electronic logbook with required patient identifiers for each sale",
      "Sell unlimited pseudoephedrine without identification",
      "Record sales only when purchases exceed 9 grams per year automatically without daily logs",
      "Delegate all meth precursor compliance to the cashier without pharmacist oversight",
    ],
    "Maintain a bound or compliant electronic logbook with required patient identifiers for each sale",
    {
      subjectId: "federal-pharmacy-law",
      explanation: "Combat Methamphetamine Epidemic Act mandates logbooks, ID verification, and quantity limits for OTC sympathomimetics.",
      tags: ["federal", "meth-precursor", "logbook"],
      references: [FED_REF],
    },
    "A customer attempts to purchase multiple boxes of pseudoephedrine for a 'church trip' during allergy season."
  ),
  mpjeMcq(
    "The consultant pharmacist should:",
    [
      "Document the recommendation in the medical record and communicate with the interdisciplinary team",
      "Stop the medication unilaterally without prescriber involvement",
      "Ignore the order because the patient is asymptomatic",
      "Delegate the decision to nursing only",
    ],
    "Document the recommendation in the medical record and communicate with the interdisciplinary team",
    {
      subjectId: "pharmacy-operations",
      stateCode: "OK",
      explanation: "Consultant pharmacists recommend changes through proper channels; they do not unilaterally discontinue prescriber orders.",
      tags: ["oklahoma", "LTC"],
      references: [OK_REF],
    },
    "Monthly review at an Oklahoma nursing home flags diphenhydramine use for sleep in a patient with dementia."
  ),
  mpjeMcq(
    "The pharmacist's best action is:",
    [
      "Review PDMP, assess red flags, and refuse or clarify if no legitimate medical purpose exists",
      "Fill because the prescription appears valid on its face",
      "Fill a 2-day supply only without documentation",
      "Report the patient to media outlets",
    ],
    "Review PDMP, assess red flags, and refuse or clarify if no legitimate medical purpose exists",
    {
      subjectId: "controlled-substances",
      stateCode: "OK",
      explanation: "Corresponding responsibility requires PDMP review and refusal when red flags indicate potential diversion.",
      tags: ["oklahoma", "PDMP", "red-flags"],
      references: [OK_REF],
    },
    "A new patient pays cash for brand-name oxycodone, declines insurance, and requests 'the strongest you have' while appearing sedated."
  ),
  mpjeMcq(
    "HIPAA permits this disclosure when:",
    [
      "The patient is present and does not object to the caregiver receiving information needed for care",
      "The neighbor asks politely at the drive-through",
      "The pharmacy posts pickup names on a public screen",
      "An employer requests adherence data for wellness incentives without authorization",
    ],
    "The patient is present and does not object to the caregiver receiving information needed for care",
    {
      subjectId: "patient-privacy",
      explanation: "HIPAA allows incidental disclosures to caregivers involved in care when the patient does not object.",
      tags: ["federal", "HIPAA", "caregiver"],
      references: [FED_REF],
    }
  ),
  mpjeMcq(
    "The pharmacy must:",
    [
      "Provide a notice of privacy practices and honor patient rights to access and amend records",
      "Share all records with marketing partners by default",
      "Deny patients access to their own medication lists",
      "Destroy records immediately after each fill",
    ],
    "Provide a notice of privacy practices and honor patient rights to access and amend records",
    {
      subjectId: "patient-privacy",
      explanation: "Covered entities must distribute NPP and facilitate access/amendment rights under HIPAA.",
      tags: ["federal", "HIPAA", "NPP"],
      references: [FED_REF],
    }
  ),
  mpjeMcq(
    "The pharmacist should:",
    [
      "Report to the Oklahoma Board of Pharmacy and cooperate with the investigation while ensuring patient safety",
      "Continue working without disclosure to avoid defamation claims",
      "Post details on social media to warn the community",
      "Ask the impaired pharmacist to self-prescribe stimulants",
    ],
    "Report to the Oklahoma Board of Pharmacy and cooperate with the investigation while ensuring patient safety",
    {
      subjectId: "pharmacy-ethics",
      stateCode: "OK",
      explanation: "Impairment threatens public safety; mandatory reporting and board cooperation are required.",
      tags: ["oklahoma", "impairment", "ethics"],
      references: [OK_REF],
    },
    "Staff report that the Oklahoma PIC has been arriving with slurred speech and dilated pupils before the morning shift."
  ),
  mpjeMcq(
    "Under federal law, the refill authorization on this C-IV prescription:",
    [
      "May be refilled up to five times within six months of the date written if authorized",
      "May be refilled unlimited times within one year",
      "Cannot be refilled because all controlled substances prohibit refills",
      "Requires a new DEA Form 222 for each refill",
    ],
    "May be refilled up to five times within six months of the date written if authorized",
    {
      subjectId: "controlled-substances",
      explanation: "C-IV follows the five-refills-in-six-months federal rule when authorized on the prescription.",
      tags: ["federal", "C-IV", "refills"],
      references: [FED_REF],
    },
    "A patient requests a refill of alprazolam 0.5 mg (#30, five refills) written four months ago with one refill used."
  ),
  mpjeMcq(
    "The Oklahoma pharmacist should:",
    [
      "Counsel on device technique, storage, and board-required documentation for naloxone distribution",
      "Dispense without counseling because it is OTC in some contexts",
      "Refuse because the patient has no opioid prescription on file",
      "Provide only one unit per lifetime without records",
    ],
    "Counsel on device technique, storage, and board-required documentation for naloxone distribution",
    {
      subjectId: "pharmacy-operations",
      stateCode: "OK",
      explanation:
        "Oklahoma naloxone access protocols require pharmacist counseling and documentation even when supplied under standing order.",
      tags: ["oklahoma", "naloxone"],
      references: [OK_REF],
    },
    "A bystander requests intranasal naloxone under Oklahoma's pharmacist access protocol after a family member's overdose."
  ),
  mpjeMcq(
    "The pharmacy's legal obligation is to:",
    [
      "Maintain confidentiality of the error investigation while implementing corrective action plans",
      "Publish the technician's name on the store website",
      "Ignore the event if the patient was not harmed",
      "Delete surveillance footage immediately",
    ],
    "Maintain confidentiality of the error investigation while implementing corrective action plans",
    {
      subjectId: "pharmacy-ethics",
      explanation: "Medication error investigations require QI processes with confidentiality and corrective actions, not public shaming.",
      tags: ["uniform", "medication-error"],
      references: [FED_REF],
    },
    "A dispensing error investigation reveals a technician misread a strength on a pediatric liquid antibiotic."
  ),
  mpjeMcq(
    "The wholesaler must provide:",
    [
      "An electronic pedigree or 3T documentation interoperable with DSCSA requirements",
      "Only a verbal assurance of authenticity",
      "Marketing brochures instead of transaction statements",
      "A handwritten note from the sales representative",
    ],
    "An electronic pedigree or 3T documentation interoperable with DSCSA requirements",
    {
      subjectId: "federal-pharmacy-law",
      explanation: "DSCSA requires electronic tracing between trading partners; verbal assurances are non-compliant.",
      tags: ["federal", "DSCSA", "wholesaler"],
      references: [FED_REF],
    }
  ),
  mpjeMcq(
    "The pharmacist should:",
    [
      "Authenticate the caller, verify prescriber credentials, and document required elements before dispensing",
      "Fill immediately because the clinic is well known",
      "Allow the technician to take the order without pharmacist involvement",
      "Fill the maximum quantity allowed for six months of refills on the oral order",
    ],
    "Authenticate the caller, verify prescriber credentials, and document required elements before dispensing",
    {
      subjectId: "dispensing-procedures",
      stateCode: "OK",
      explanation: "Emergency oral orders require pharmacist authentication of prescriber and strict documentation under Oklahoma rules.",
      tags: ["oklahoma", "oral-order"],
      references: [OK_REF],
    },
    "After-hours call from an Oklahoma urgent care physician requests an oral antibiotic for a child with documented penicillin allergy."
  ),
  mpjeMcq(
    "Uniform MPJE testing emphasizes that foreign pharmacy graduates must:",
    [
      "Obtain FPGEC certification and meet state licensure requirements including exams",
      "Practice immediately with a technician license",
      "Skip MPJE if they have overseas experience only",
      "Register with DEA instead of the state board",
    ],
    "Obtain FPGEC certification and meet state licensure requirements including exams",
    {
      subjectId: "state-practice-act",
      explanation: "FPGEC and state licensure (NAPLEX/MPJE) are standard requirements for foreign graduates in uniform patterns.",
      tags: ["uniform", "FPGEC", "licensure"],
      references: [FED_REF],
    }
  ),
];
