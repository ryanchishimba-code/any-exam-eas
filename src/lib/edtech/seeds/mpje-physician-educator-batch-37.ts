/**
 * Curated MPJE-style items — physician-educator batch 37.
 * Topics: DSCSA saleable returns / quarantine (deeper), intern/preceptor liability,
 * MTM/CMR documentation, drug shortage alternatives, ND/SD/MT state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-37";
const PE = ["physician-educator", BATCH, "mpje"];

const DSCSA = {
  label: "Drug Supply Chain Security Act (DSCSA)",
  url: "https://www.fda.gov/drugs/drug-supply-chain-integrity/drug-supply-chain-security-act-dscsa",
};
const CMS_MTM = {
  label: "CMS Medicare Part D Medication Therapy Management (MTM)",
  url: "https://www.cms.gov/medicare/payment/part-d-plans/medication-therapy-management-mtm",
};
const FDA_SHORTAGE = {
  label: "FDA Drug Shortages",
  url: "https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages",
};
const ND_REF = {
  label: "North Dakota Pharmacy Practice Act",
  citation: "N.D. Cent. Code § 43-15 et seq.",
};
const SD_REF = {
  label: "South Dakota Pharmacy Practice Act",
  citation: "S.D. Codified Laws § 36-11 et seq.",
};
const MT_REF = {
  label: "Montana Pharmacy Practice Act",
  citation: "Mont. Code Ann. § 37-7 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_37: EnrichedBankItem[] = [
  // ── DSCSA Saleable Returns / Quarantine — Deeper (3) ────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 51-year-old PIC prepares a saleable return tote for the primary wholesaler. Three serialized units are unopened but past manufacturer expiration by two weeks. A technician proposes including them because packaging is intact and the wholesaler may still grant partial credit.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include expired units in the saleable return because seals are intact",
      "Remove expired units from saleable returns, quarantine per pharmacy policy, and process only unexpired product with complete DSCSA transaction information",
      "Relabel expired units with pharmacy purchase dates to extend apparent shelf life",
      "Donate expired units to a free clinic to avoid waste"
    ),
    "Remove expired units from saleable returns, quarantine per pharmacy policy, and process only unexpired product with complete DSCSA transaction information",
    `DSCSA saleable returns require unexpired product with complete transaction history — not intact packaging alone, relabeling tricks, or clinic donation to bypass supply chain rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "quarantine", "expiration", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Expired product cannot be included in DSCSA saleable returns — quarantine and exclude from wholesale credit shipments.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 48-year-old pharmacist at a retail store receives an inter-store transfer of serialized inventory from a sister pharmacy in the same chain. Two units scan correctly but lack matching transaction information (TI) in the receiving system, though physical product and GTIN match.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Shelf the product immediately because GTIN matches",
      "Quarantine the units with TI discrepancies, reconcile tracing data with the sending pharmacy, and release only after compliant transaction history is documented",
      "Sell the product as cash-only to bypass tracing requirements",
      "Return the units to the patient will-call bin without investigation"
    ),
    "Quarantine the units with TI discrepancies, reconcile tracing data with the sending pharmacy, and release only after compliant transaction history is documented",
    `Inter-store transfers require complete DSCSA transaction information before dispensing — GTIN match alone, cash-only workarounds, or undocumented shelving violate supply chain integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DSCSA],
      tags: ["DSCSA", "quarantine", "inter-store-transfer", "tracing", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 57-year-old long-term care facility returns unopened serialized inhalers to the community pharmacy for credit. The pharmacy manager asks to add them directly to the next wholesaler saleable return shipment because the facility is a licensed healthcare provider.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include facility returns in saleable wholesaler returns because the product is unopened",
      "Quarantine facility returns separately, verify tracing and pharmacy return policy, and do not include in saleable wholesaler returns without compliant transaction history",
      "Restock returned inhalers for new patients without quarantine",
      "Ship facility returns to any willing secondary distributor for faster credit"
    ),
    "Quarantine facility returns separately, verify tracing and pharmacy return policy, and do not include in saleable wholesaler returns without compliant transaction history",
    `Healthcare-facility returns generally require quarantine and tracing verification before restock or saleable return — not automatic wholesaler credit, direct restock, or unverified secondary distributor shipment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "quarantine", "facility-returns", ...PE],
    }
  ),

  // ── Intern / Preceptor Liability (3) ────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 64-year-old patient picks up a prescription filled by a pharmacy intern under preceptor supervision. After the patient leaves, the preceptor discovers the intern selected metoprolol tartrate 100 mg instead of the prescribed metoprolol succinate 100 mg.`,
    "What is the preceptor's most appropriate action?",
    opts4(
      "Document the error only if the patient calls back with symptoms",
      "Contact the patient immediately, assess safety, notify the prescriber, document the error, provide correct therapy, and accept professional responsibility as preceptor",
      "Blame the intern and take no further action because the intern performed data entry",
      "Wait until the next scheduled refill to correct the error"
    ),
    "Contact the patient immediately, assess safety, notify the prescriber, document the error, provide correct therapy, and accept professional responsibility as preceptor",
    `Preceptors retain professional responsibility for intern-involved dispensing errors — immediate patient contact, prescriber notification, correction, and documentation are required. Delay, intern blame alone, or symptom-only response fail board and patient safety duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["intern", "preceptor", "dispensing-error", "liability", ...PE],
      related: {
        reviewModuleSlug: "state-practice-act",
        keyTakeaway:
          "Preceptors accept professional responsibility for intern errors — contact patient, prescriber, and correct therapy immediately.",
      },
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A community pharmacy schedules two fourth-year pharmacy interns and one technician on the evening shift while the designated preceptor pharmacist calls in sick. No relief pharmacist is available for two hours.`,
    "What is the pharmacy's most appropriate action regarding intern practice?",
    opts4(
      "Allow both interns to operate the dispensing queue with technician oversight until the preceptor arrives",
      "Restrict intern pharmacy duties until a licensed pharmacist preceptor or supervisor is present per board intern supervision requirements",
      "Register one intern as a technician for the shift to maintain workflow",
      "Continue dispensing with interns performing final verification because the queue is backed up"
    ),
    "Restrict intern pharmacy duties until a licensed pharmacist preceptor or supervisor is present per board intern supervision requirements",
    `Intern practice requires on-site pharmacist preceptor or supervisor presence — not dual-intern technician oversight, intern reclassification, or intern final verification during backlog.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["intern", "preceptor", "supervision", "staffing", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient presents for an influenza vaccine at a community pharmacy. A pharmacy intern screens and administers the vaccine under an approved protocol while the preceptor is verifying prescriptions at the other end of the store. The intern completes documentation but the preceptor has not reviewed contraindications or signed the protocol record before the patient leaves.`,
    "What is the preceptor's most appropriate action?",
    opts4(
      "Accept the documentation because the intern is protocol-trained",
      "Review screening, contraindications, and documentation before the patient leaves or immediately follow up if already departed; the preceptor must accept responsibility for protocol-based immunization",
      "Allow the technician to co-sign the immunization record",
      "Void the vaccine administration without patient follow-up"
    ),
    "Review screening, contraindications, and documentation before the patient leaves or immediately follow up if already departed; the preceptor must accept responsibility for protocol-based immunization",
    `Protocol-based intern immunizations require preceptor review and acceptance of professional responsibility — not intern-only documentation, technician co-signing, or silent voiding without patient follow-up.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["intern", "preceptor", "immunization", "protocol", ...PE],
    }
  ),

  // ── MTM / CMR Documentation (3) ───────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 72-year-old Medicare Part D patient with limited English proficiency completes a telephone CMR with a pharmacist using a qualified interpreter. The pharmacist identified one drug therapy problem and communicated with the prescriber but did not document interpreter use or how the MAP was delivered.`,
    "What is the pharmacist's most appropriate action regarding MTM documentation?",
    opts4(
      "Bill the CMR because the interpreter-assisted call occurred",
      "Complete CMR documentation including interpreter use, drug therapy problems, interventions, prescriber communication, and MAP delivery method before billing",
      "Bill as targeted MTM instead to avoid CMR documentation requirements",
      "Allow the interpreter to sign the MTM record as the responsible provider"
    ),
    "Complete CMR documentation including interpreter use, drug therapy problems, interventions, prescriber communication, and MAP delivery method before billing",
    `CMR billing requires full documented elements including interpreter-assisted encounters and MAP delivery — not phone contact alone, TMR substitution, or interpreter-signed pharmacist claims.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "CMR", "documentation", "interpreter", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Interpreter-assisted CMRs require documented language access and full MAP delivery elements before billing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old MTM-enrolled patient authorized delivery of the medication action plan summary to an adult daughter listed as caregiver on file. The pharmacist completed a documented CMR but mailed the MAP to the patient's home address instead of the authorized caregiver without documenting the delivery method.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Mark MAP delivery complete because the CMR occurred",
      "Document authorized caregiver delivery preferences, use appropriate HIPAA authorization, and deliver or document the MAP per patient-directed instructions before billing",
      "Email the MAP to the caregiver without verifying authorization",
      "Skip MAP delivery because the patient attended the CMR in person"
    ),
    "Document authorized caregiver delivery preferences, use appropriate HIPAA authorization, and deliver or document the MAP per patient-directed instructions before billing",
    `CMR documentation must reflect authorized MAP delivery to caregivers when directed — false completion flags, unauthorized email disclosure, or skipped MAP delivery violate CMS MTM and HIPAA requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_MTM],
      tags: ["MTM", "CMR", "MAP", "documentation", "caregiver", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 75-year-old patient received a documented targeted MTM (TMR) for diabetes therapy 18 days ago addressing metformin adherence. The pharmacist performs another TMR on the same targeted medication today for the same adherence problem and prepares to bill both encounters.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill both TMRs because each encounter involved patient contact",
      "Review plan and CMS rules for duplicate targeted MTM on the same medication, document continuity with the prior TMR, and bill only when a new eligible service period or unresolved problem supports a separate claim",
      "Delete the prior TMR record to allow today's billing",
      "Bill today's encounter as a CMR to avoid TMR duplication rules"
    ),
    "Review plan and CMS rules for duplicate targeted MTM on the same medication, document continuity with the prior TMR, and bill only when a new eligible service period or unresolved problem supports a separate claim",
    `Duplicate TMR billing on the same targeted medication within short intervals requires CMS and plan compliance — not automatic dual billing, record deletion, or CMR upcoding to evade rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CMS_MTM],
      tags: ["MTM", "TMR", "targeted-MTM", "billing-compliance", "documentation", ...PE],
    }
  ),

  // ── Drug Shortage Therapeutic Alternatives (3) ────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 46-year-old patient presents a prescription for a commercially unavailable injectable antibiotic on the FDA shortage list. The prescriber is unreachable and the patient needs therapy today for a serious infection documented in the chart.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse all dispensing until the exact NDC returns to stock",
      "Contact the prescriber or covering provider to discuss FDA-listed therapeutic alternatives, document shortage sourcing efforts, and dispense only with authorized substitution or a new prescription",
      "Substitute a different antibiotic class without prescriber contact because the patient is ill",
      "Purchase product from an unverified online seller to fill the exact NDC"
    ),
    "Contact the prescriber or covering provider to discuss FDA-listed therapeutic alternatives, document shortage sourcing efforts, and dispense only with authorized substitution or a new prescription",
    `Drug shortages require prescriber communication on therapeutic alternatives and documented sourcing — not blanket refusal without outreach, unilateral class substitution, or gray-market purchases.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_SHORTAGE],
      tags: ["drug-shortage", "therapeutic-alternative", "documentation", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Shortage response requires prescriber contact on alternatives and documented sourcing — not unilateral substitution.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: An 8-year-old patient with leukemia has a prescription for a pediatric oncology drug on critical shortage. The pharmacy has two vials allocated for existing patients. A new patient with the same prescription arrives and the parent requests immediate dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense to the new patient first because the prescription is newer",
      "Apply fair allocation policy, communicate with both prescribers, document shortage allocation decisions, and prioritize per policy and clinical urgency without undisclosed favoritism",
      "Sell remaining vials only to cash-paying patients",
      "Compound an unauthorized substitute without prescriber approval"
    ),
    "Apply fair allocation policy, communicate with both prescribers, document shortage allocation decisions, and prioritize per policy and clinical urgency without undisclosed favoritism",
    `Critical shortage allocation requires fair patient-centered policies, prescriber communication, and documentation — not newest-Rx priority, cash-only preference, or unauthorized compounding.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA_SHORTAGE],
      tags: ["drug-shortage", "allocation", "pediatric", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old patient on chronic levothyroxine 75 mcg presents a refill during a national brand shortage. The pharmacy stocks an AB-rated generic with a different appearance. The patient refuses the generic without speaking to the prescriber.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Force generic substitution because AB-rated products are equivalent",
      "Counsel on the shortage and AB-rated substitution, contact the prescriber if the patient declines or clinical concerns exist, and document therapeutic alternative communication",
      "Tell the patient to skip doses until the brand returns",
      "Dispense the brand from emergency reserve without documenting allocation"
    ),
    "Counsel on the shortage and AB-rated substitution, contact the prescriber if the patient declines or clinical concerns exist, and document therapeutic alternative communication",
    `Shortage-related generic substitution requires patient counseling, prescriber contact when needed, and documented communication — not forced acceptance alone, dose omission, or undocumented reserve use.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_SHORTAGE],
      tags: ["drug-shortage", "therapeutic-alternative", "generic-substitution", "documentation", ...PE],
    }
  ),

  // ── North Dakota (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 70-year-old patient in Fargo picks up a new prescription at a community pharmacy. North Dakota aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `North Dakota community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ND",
      difficulty: 2,
      references: [ND_REF],
      tags: ["north-dakota", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Grand Forks presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets. North Dakota requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the North Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with commercial insurance",
      "Query PDMP only for Schedule II drugs, not hydrocodone combination products",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the North Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
    `North Dakota requires pharmacists to query and document PDMP review before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ND",
      difficulty: 3,
      references: [ND_REF],
      tags: ["north-dakota", "PDMP", "PMP", ...PE],
    }
  ),

  // ── South Dakota (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient requests an influenza vaccine at a Rapid City pharmacy. The pharmacist completed South Dakota-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per South Dakota protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per South Dakota protocol requirements",
    `South Dakota authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate South Dakota access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SD",
      difficulty: 2,
      references: [SD_REF],
      tags: ["south-dakota", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Aberdeen presents a new prescription for tramadol 50 mg tablets. South Dakota requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the South Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with local prescribers",
      "Query PDMP only for Schedule II drugs, not tramadol",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the South Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
    `South Dakota requires pharmacists to query and document PDMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Tramadol is controlled under federal and South Dakota schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SD",
      difficulty: 3,
      references: [SD_REF],
      tags: ["south-dakota", "PDMP", "PMP", ...PE],
    }
  ),

  // ── Montana (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 65-year-old patient requests a pneumococcal vaccine at a Helena pharmacy. The pharmacist completed Montana-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Montana protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Montana protocol requirements",
    `Montana authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MT",
      difficulty: 2,
      references: [MT_REF],
      tags: ["montana", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 54-year-old patient in Bozeman presents a new prescription for oxycodone 5 mg tablets. Montana requires Prescription Drug Registry review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Montana Prescription Drug Registry, document the review, and apply corresponding-responsibility judgment",
      "Skip registry review for patients paying cash",
      "Query the registry only for Schedule II drugs, not oxycodone tablets",
      "Delegate registry review and dispensing authorization to a technician"
    ),
    "Query the Montana Prescription Drug Registry, document the review, and apply corresponding-responsibility judgment",
    `Montana requires pharmacists to query and document Prescription Drug Registry review before dispensing controlled substances. Cash payment does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MT",
      difficulty: 3,
      references: [MT_REF],
      tags: ["montana", "PDMP", "prescription-drug-registry", ...PE],
    }
  ),
];
