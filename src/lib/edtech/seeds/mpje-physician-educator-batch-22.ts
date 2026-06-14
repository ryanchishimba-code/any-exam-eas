/**
 * Curated MPJE-style items — physician-educator batch 22.
 * Topics: Ryan Haight / internet pharmacy, medication synchronization (Med Sync),
 * USP <800> hazardous drug handling, anti-kickback / Stark compliance, VA/WV/KY state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-22";
const PE = ["physician-educator", BATCH, "mpje"];

const RYAN_HAIGHT = {
  label: "Ryan Haight Online Pharmacy Consumer Protection Act",
  url: "https://www.dea.gov/press-releases/2023/05/09/dea-announces-extension-telemedicine-flexibilities",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const USP800 = { label: "USP <800> Hazardous Drugs", citation: "USP-NF <800>" };
const AKS = {
  label: "Federal Anti-Kickback Statute (42 U.S.C. § 1320a-7b)",
  url: "https://oig.hhs.gov/compliance/physician-education/fraud-abuse-laws",
};
const VA_REF = {
  label: "Virginia Drug Control Act",
  citation: "Va. Code § 54.1-3300 et seq.",
};
const WV_REF = {
  label: "West Virginia Pharmacy Act",
  citation: "W. Va. Code § 30-5-1 et seq.",
};
const KY_REF = {
  label: "Kentucky Pharmacy Practice Act",
  citation: "KRS Chapter 315",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_22: EnrichedBankItem[] = [
  // ── Ryan Haight / Internet Pharmacy (3) ───────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 44-year-old patient in Oregon submits an online questionnaire to a mail-order pharmacy in Nevada and receives alprazolam 0.5 mg tablets shipped interstate. The prescriber has never conducted an in-person medical evaluation and holds no applicable telemedicine exception.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Dispense because the patient completed a valid online questionnaire",
      "Refuse to dispense controlled substances issued without a valid prescription meeting Ryan Haight in-person evaluation requirements and applicable telemedicine rules",
      "Dispense if the patient pays cash and signs a waiver",
      "Ship the medication and resolve licensure issues only if the board inquires"
    ),
    "Refuse to dispense controlled substances issued without a valid prescription meeting Ryan Haight in-person evaluation requirements and applicable telemedicine rules",
    `The Ryan Haight Act requires at least one in-person medical evaluation before prescribing controlled substances via the internet unless a valid telemedicine exception applies. Online questionnaires alone, cash payment, or deferred licensure review do not create valid prescriptions for interstate CS dispensing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "internet-pharmacy", "controlled-substances", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Internet CS dispensing requires valid Rx with Ryan Haight in-person eval — online questionnaires alone are insufficient.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 52-year-old PIC at an internet pharmacy registered with DEA discovers the corporate website dispenses Schedule III controlled substances nationwide but the DEA registration lacks the internet pharmacy business activity designator and the pharmacy is not licensed in several destination states.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue dispensing because DEA registration alone authorizes nationwide internet sales",
      "Ensure DEA internet pharmacy registration, valid prescriptions, and licensure in each patient destination state before dispensing controlled substances online",
      "Ship only to states where enforcement is unlikely",
      "Register as a dietary supplement seller to bypass pharmacy licensing"
    ),
    "Ensure DEA internet pharmacy registration, valid prescriptions, and licensure in each patient destination state before dispensing controlled substances online",
    `Internet controlled substance dispensing requires DEA registration with the internet pharmacy designator, valid prescriptions, and pharmacy licensure where patients are located — not general DEA registration alone, selective enforcement avoidance, or supplement relabeling.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "internet-pharmacy", "licensure", "DEA-registration", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 38-year-old patient requests early refill of an internet-dispensed hydrocodone prescription through a toll-free line. The pharmacy has no record of EPCS for the original order and cannot verify prescriber identity or patient evaluation documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Process the early refill because the patient is a established mail-order customer",
      "Verify prescription validity, prescriber authentication, and Ryan Haight/EPCS requirements before dispensing; refuse or clarify if documentation is inadequate",
      "Transfer the patient to a rogue offshore site without documentation",
      "Dispense double quantity to reduce shipping frequency"
    ),
    "Verify prescription validity, prescriber authentication, and Ryan Haight/EPCS requirements before dispensing; refuse or clarify if documentation is inadequate",
    `Internet controlled substance dispensing must meet EPCS and valid prescription standards including prescriber verification. Established customer status does not waive Ryan Haight or authentication requirements. Offshore redirection or quantity escalation without verification violates federal and professional rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "internet-pharmacy", "EPCS", "hydrocodone", ...PE],
    }
  ),

  // ── Medication Synchronization / Med Sync (3) ─────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old patient with four chronic medications asks to enroll in medication synchronization so all refills align on the 15th of each month. The pharmacy has no signed enrollment form or documented sync date on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Align all fills immediately without documentation to improve adherence",
      "Obtain patient consent, document the sync enrollment and target date, coordinate with prescribers as needed, and follow plan billing rules for alignment fills",
      "Refuse synchronization because insurance never covers partial fills",
      "Allow the technician to set sync dates without pharmacist review"
    ),
    "Obtain patient consent, document the sync enrollment and target date, coordinate with prescribers as needed, and follow plan billing rules for alignment fills",
    `Med Sync programs require documented patient consent, sync dates, and prescriber coordination when needed. Undocumented alignment, blanket refusal, or technician-only enrollment fail professional and payer synchronization standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["Med-Sync", "medication-synchronization", "documentation", "adherence", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Med Sync requires documented consent, sync dates, and prescriber coordination — not undocumented alignment.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 71-year-old Med Sync patient needs a 10-day supply of lisinopril to align with other chronic medications due next week. The insurance plan allows short fills for synchronization but requires specific billing codes and documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense a 10-day supply with appropriate synchronization documentation and billing per plan and state rules",
      "Dispense a full 90-day supply early without documentation to avoid partial-fill billing",
      "Bill a 10-day supply as cash to bypass plan requirements",
      "Tell the patient to skip lisinopril until the sync date"
    ),
    "Dispense a 10-day supply with appropriate synchronization documentation and billing per plan and state rules",
    `Synchronization often requires short fills with documented alignment and compliant billing — not early 90-day supplies without records, cash workarounds, or advising medication omission.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["Med-Sync", "medication-synchronization", "partial-fill", "billing", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old Med Sync patient's prescriber changes one medication strength mid-cycle, disrupting the established sync date. The patient wants all remaining medications held until the prescriber returns from vacation in three weeks.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Withhold all chronic medications until the prescriber returns without assessment",
      "Assess clinical need, contact the prescriber or covering provider when appropriate, adjust the sync plan with documented patient communication, and avoid unsafe treatment gaps",
      "Auto-sync all medications to a new date without prescriber or patient notification",
      "Discharge the patient from Med Sync permanently for causing disruption"
    ),
    "Assess clinical need, contact the prescriber or covering provider when appropriate, adjust the sync plan with documented patient communication, and avoid unsafe treatment gaps",
    `Med Sync disruptions require clinical assessment and prescriber communication — not blanket withholding of chronic therapy, silent rescheduling, or punitive program discharge.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["Med-Sync", "medication-synchronization", "prescriber-coordination", ...PE],
    }
  ),

  // ── USP <800> Hazardous Drugs (3) ─────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 56-year-old pharmacy technician receives a shipment of cyclophosphamide tablets without outer HD labeling. The PIC asks whether USP <800> handling requirements apply because the product is oral and dispensed intact, not compounded.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Store cyclophosphamide in open retail shelving because it is dispensed intact",
      "Identify cyclophosphamide as a hazardous drug, apply USP <800> receipt, storage, and handling requirements including HD labeling and staff training",
      "Return the product because USP <800> applies only to injectable antineoplastics",
      "Allow technicians to repackage tablets without HD controls if gloves are available"
    ),
    "Identify cyclophosphamide as a hazardous drug, apply USP <800> receipt, storage, and handling requirements including HD labeling and staff training",
    `USP <800> applies to listed hazardous drugs including many oral antineoplastics during receipt, storage, and dispensing — not only sterile compounding. Open shelving, injectable-only assumptions, and uncontrolled repackaging violate HD standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "receipt", "labeling", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "USP <800> applies to HD receipt and dispensing — including many oral antineoplastics.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 48-year-old PIC must dispose of expired hazardous drug inventory including intact oral chemotherapy capsules and empty HD vials. Staff propose mixing all waste into regular pharmacy trash to reduce disposal costs.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Discard all HD waste in regular trash because the drugs are expired",
      "Segregate hazardous drug waste and dispose through approved HD waste pathways per USP <800>, EPA, and state requirements",
      "Flush all oral chemotherapy down the sink to avoid trash handling",
      "Give expired HD inventory to patients for home disposal without guidance"
    ),
    "Segregate hazardous drug waste and dispose through approved HD waste pathways per USP <800>, EPA, and state requirements",
    `Hazardous drug waste requires segregated disposal through approved pathways — not routine trash, indiscriminate flushing, or patient redistribution of expired HD products.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "disposal", "waste", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old employee who handles hazardous drugs requests whether the pharmacy maintains required USP <800> training and medical surveillance records. The manager says verbal training at hire is sufficient and no documentation is needed.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Rely on verbal training only because USP <800> documentation is optional",
      "Maintain documented HD training, competency assessment, and applicable medical surveillance per USP <800> and employer policy",
      "Exclude technicians from training because only pharmacists touch HDs",
      "Document training only after an employee develops symptoms"
    ),
    "Maintain documented HD training, competency assessment, and applicable medical surveillance per USP <800> and employer policy",
    `USP <800> requires documented hazardous drug training and applicable surveillance for exposed personnel — not verbal-only onboarding, pharmacist-only assumptions, or reactive documentation after illness.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "training", "surveillance", ...PE],
    }
  ),

  // ── Anti-Kickback / Stark Compliance (3) ──────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 55-year-old physician who owns 40 percent of a retail pharmacy refers all patients to that pharmacy and receives quarterly profit distributions tied to prescription volume generated by the practice.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept all referrals because physician ownership is common in healthcare",
      "Evaluate Stark self-referral and anti-kickback implications, ensure lawful ownership and compensation arrangements, and refuse improper inducements tied to referral volume",
      "Offer larger profit shares to increase referral volume",
      "Bill referred patients as cash-only to avoid federal scrutiny"
    ),
    "Evaluate Stark self-referral and anti-kickback implications, ensure lawful ownership and compensation arrangements, and refuse improper inducements tied to referral volume",
    `Physician ownership of pharmacies implicates Stark and anti-kickback laws when compensation ties to referral volume. Volume-based profit sharing, expanded inducements, or cash conversion to evade rules violate federal fraud and abuse standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [AKS],
      tags: ["anti-kickback", "Stark", "physician-ownership", "self-referral", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Physician pharmacy ownership with volume-linked profit may implicate Stark and anti-kickback laws.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 49-year-old manufacturer representative offers the pharmacy a rebate for every new patient switched to the company's brand biologic when the pharmacist steers commercially insured patients to use the manufacturer's copay card exclusively at this pharmacy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the rebate and require all eligible patients to use the copay card at this pharmacy",
      "Decline remuneration tied to referrals or switching; provide unbiased therapeutic and financial counseling within lawful copay assistance programs",
      "Bill insurance for brand and dispense generic while keeping the rebate",
      "Share rebate payments directly with patients as gift cards"
    ),
    "Decline remuneration tied to referrals or switching; provide unbiased therapeutic and financial counseling within lawful copay assistance programs",
    `Manufacturer rebates tied to patient steering and brand switching may violate anti-kickback rules. Exclusive copay card steering, brand/generic billing fraud, and patient kickbacks are improper inducements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [AKS],
      tags: ["anti-kickback", "copay-assistance", "manufacturer-rebate", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 63-year-old specialty pharmacy manager instructs staff to waive commercially insured patient copays routinely for high-margin specialty drugs to capture market share from a competitor, without using a lawful independent charity or manufacturer program.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Waive all copays because it improves patient access and market share",
      "Decline routine copay waivers that function as improper inducements; use only lawful financial assistance pathways with compliant documentation",
      "Bill payers for copay amounts the pharmacy waived without disclosure",
      "Require patients to sign forms falsely stating they are uninsured"
    ),
    "Decline routine copay waivers that function as improper inducements; use only lawful financial assistance pathways with compliant documentation",
    `Routine commercial copay waivers to steer patients may constitute anti-kickback violations. Undisclosed payer billing for waived copays and false uninsured attestations are fraud — not permissible access programs.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [AKS],
      tags: ["anti-kickback", "copay-waiver", "specialty-pharmacy", ...PE],
    }
  ),

  // ── Virginia (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient in Norfolk picks up a new prescription for a high-risk medication. Virginia community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Virginia community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VA",
      difficulty: 2,
      references: [VA_REF],
      tags: ["virginia", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests an influenza vaccine at a Richmond pharmacy. The pharmacist holds valid Virginia immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Virginia protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Virginia protocol requirements",
    `Virginia authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Virginia access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VA",
      difficulty: 2,
      references: [VA_REF],
      tags: ["virginia", "immunization", "influenza", ...PE],
    }
  ),

  // ── West Virginia (2) ───────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 64-year-old patient in Morgantown picks up a new prescription at a community pharmacy. West Virginia aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `West Virginia community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WV",
      difficulty: 2,
      references: [WV_REF],
      tags: ["west-virginia", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old patient requests a pneumococcal vaccine at a Huntington pharmacy. The pharmacist completed West Virginia-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per West Virginia protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per West Virginia protocol requirements",
    `West Virginia authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WV",
      difficulty: 2,
      references: [WV_REF],
      tags: ["west-virginia", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── Kentucky (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient in Louisville picks up a new prescription for a high-risk medication. Kentucky community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Kentucky community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KY",
      difficulty: 2,
      references: [KY_REF],
      tags: ["kentucky", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests a shingles vaccine at a Lexington pharmacy. The pharmacist holds valid Kentucky immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Kentucky protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Kentucky protocol requirements",
    `Kentucky authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KY",
      difficulty: 2,
      references: [KY_REF],
      tags: ["kentucky", "immunization", "shingles", ...PE],
    }
  ),
];
