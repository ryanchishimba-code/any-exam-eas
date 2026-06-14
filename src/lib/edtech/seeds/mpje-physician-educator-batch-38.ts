/**
 * Curated MPJE-style items — physician-educator batch 38.
 * Topics: EPCS identity proofing / credentialing (deeper), LTC emergency kit rules,
 * board inspection readiness, pregnancy/lactation counseling, UT/AZ/NM state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-38";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const EPCS = {
  label: "DEA Electronic Prescriptions for Controlled Substances (21 CFR Part 1311)",
  url: "https://www.dea.gov/drug-information/drug-scheduling/electronic-prescriptions-controlled-substances",
};
const CMS = { label: "CMS Long-Term Care Requirements", url: "https://www.cms.gov" };
const LACTMED = {
  label: "LactMed Database (NIH)",
  url: "https://www.ncbi.nlm.nih.gov/books/NBK501922/",
};
const UT_REF = {
  label: "Utah Pharmacy Practice Act",
  citation: "Utah Code § 58-17b et seq.",
};
const AZ_REF = {
  label: "Arizona Pharmacy Practice Act",
  citation: "A.R.S. § 32-1901 et seq.",
};
const NM_REF = {
  label: "New Mexico Pharmacy Practice Act",
  citation: "N.M. Stat. § 61-11 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_38: EnrichedBankItem[] = [
  // ── EPCS Identity Proofing / Credentialing — Deeper (3) ─────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 44-year-old newly hired pharmacist at a retail pharmacy attempts to access the EPCS dispensing module before completing required identity proofing and two-factor authentication enrollment with the certified application provider.`,
    "What is the pharmacist-in-charge's most appropriate action?",
    opts4(
      "Allow temporary shared login credentials until identity proofing is complete",
      "Prohibit EPCS controlled-substance dispensing until the pharmacist completes required identity proofing, credentialing, and two-factor authentication enrollment per DEA Part 1311",
      "Permit EPCS access for Schedule IV only while credentialing is pending",
      "Use the technician's credentials to process EPCS orders during onboarding"
    ),
    "Prohibit EPCS controlled-substance dispensing until the pharmacist completes required identity proofing, credentialing, and two-factor authentication enrollment per DEA Part 1311",
    `DEA Part 1311 requires individual identity proofing and two-factor authentication before EPCS dispensing — not shared logins, schedule-limited workarounds, or technician credential use.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA, EPCS],
      tags: ["EPCS", "identity-proofing", "credentialing", "two-factor-authentication", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Pharmacists must complete EPCS identity proofing and 2FA enrollment before dispensing controlled substances electronically.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 57-year-old patient presents an EPCS prescription for oxycodone 10 mg tablets. The pharmacy software flags that the prescriber's identity proofing credentials were revoked yesterday after a reported token compromise, but the prescription transmission timestamp is from this morning.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the prescription was transmitted today",
      "Withhold dispensing, verify prescriber and EPCS credential status through the certified system, and resolve authentication concerns before dispensing",
      "Accept a patient portal screenshot showing the prescription list",
      "Convert to a verbal refill because the prescriber is re-enrolling"
    ),
    "Withhold dispensing, verify prescriber and EPCS credential status through the certified system, and resolve authentication concerns before dispensing",
    `Revoked prescriber EPCS credentials require verification through certified systems before dispensing — not transmission timing alone, patient screenshots, or verbal refill conversion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA, EPCS],
      tags: ["EPCS", "identity-proofing", "credentialing", "red-flags", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 49-year-old pharmacy manager discovers that two relief pharmacists have been sharing one EPCS-enabled workstation profile and password to speed weekend controlled-substance dispensing. Both pharmacists completed individual identity proofing when hired.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue shared access because both pharmacists are individually credentialed",
      "Stop shared EPCS credentials immediately, require individual authenticated logins, and remediate audit trail integrity per DEA Part 1311",
      "Disable EPCS entirely and accept paper prescriptions only on weekends",
      "Allow technicians to use the shared profile for data entry only"
    ),
    "Stop shared EPCS credentials immediately, require individual authenticated logins, and remediate audit trail integrity per DEA Part 1311",
    `Individual EPCS credentialing does not permit shared workstation profiles — each dispenser must use personal authenticated access with intact audit trails. Shared passwords, EPCS shutdown, or technician profile use violate Part 1311.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA, EPCS],
      tags: ["EPCS", "credentialing", "audit-trail", "authentication", ...PE],
    }
  ),

  // ── LTC Emergency Kit / Crash Cart (3) ──────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 79-year-old skilled nursing facility nurse uses morphine 10 mg/10 mL vials from the facility emergency drug kit for acute pain at 2 a.m. The on-call pharmacist learns the kit log was not updated and one vial lot expired last month but remained in the sealed compartment.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the after-hours use without documentation because the patient was in pain",
      "Investigate kit use, remove expired product, reconcile controlled-substance inventory, update the emergency kit log, and report discrepancies per facility policy and applicable law",
      "Replace the expired vial with retail pharmacy stock without documentation",
      "Discard all kit medications to avoid future expiration issues without notifying the facility"
    ),
    "Investigate kit use, remove expired product, reconcile controlled-substance inventory, update the emergency kit log, and report discrepancies per facility policy and applicable law",
    `LTC emergency drug kits require current product, controlled-substance reconciliation, and documented use — not undocumented after-hours dispensing, silent retail substitution, or wholesale discard without facility notification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CMS, DEA],
      tags: ["LTC", "emergency-kit", "controlled-substances", "documentation", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "LTC emergency kit use requires current product, CS reconciliation, and documented logs — not silent after-hours dispensing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 76-year-old LTC consultant pharmacist reviews the facility emergency drug supply during a monthly visit. The sealed kit contains epinephrine, naloxone, and lorazepam injection but no current prescriber authorization list or pharmacy contract specifying restock intervals and responsible pharmacist oversight.`,
    "What is the consultant pharmacist's most appropriate recommendation?",
    opts4(
      "Ignore kit contents because nurses manage emergency medications independently",
      "Recommend establishing documented prescriber authorization, pharmacy contract oversight, restock intervals, and emergency kit policies aligned with CMS and state requirements",
      "Remove all injectable medications from the kit to reduce liability",
      "Allow nurses to purchase replacement kit drugs from a retail pharmacy without records"
    ),
    "Recommend establishing documented prescriber authorization, pharmacy contract oversight, restock intervals, and emergency kit policies aligned with CMS and state requirements",
    `LTC emergency drug kits require documented authorization, pharmacy oversight, and restock policies — not nurse-only management, complete kit elimination, or undocumented retail replacement.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["LTC", "emergency-kit", "consultant-pharmacist", "policy", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 82-year-old nursing home resident receives duplicate doses of emergency kit nitroglycerin tablets and sublingual lorazepam during a code event because two nurses accessed the kit simultaneously without pharmacy verification of remaining inventory afterward.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Take no action because code events are exempt from documentation",
      "Reconcile emergency kit inventory, document the event, review kit access procedures with nursing leadership, and replace product per policy",
      "Permanently remove benzodiazepines from all facility kits without review",
      "Bill the resident for duplicate doses as cash overrides"
    ),
    "Reconcile emergency kit inventory, document the event, review kit access procedures with nursing leadership, and replace product per policy",
    `Emergency code kit use requires post-event inventory reconciliation and procedure review — not documentation exemptions, blanket drug removal, or resident cash billing for system errors.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["LTC", "emergency-kit", "inventory", "documentation", ...PE],
    }
  ),

  // ── Board Inspection Readiness (3) ──────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 51-year-old pharmacist-in-charge conducts an internal mock board inspection and discovers technician training logs for hazardous drug handling were backdated to cover gaps before the scheduled state visit next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Submit the backdated logs because the technicians were informally trained",
      "Correct the records honestly, complete required training, document remediation, and prohibit falsified inspection documents",
      "Cancel the state inspection by closing the pharmacy temporarily",
      "Hide the training file and provide only compounding records during inspection"
    ),
    "Correct the records honestly, complete required training, document remediation, and prohibit falsified inspection documents",
    `Inspection readiness requires honest records and completed training — not backdated logs, closure to evade inspection, or selective record production.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["inspection", "readiness", "training", "PIC", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Mock audits should drive honest remediation — backdated training logs must be corrected before inspection.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old PIC preparing for a routine board inspection finds that PDMP query documentation for controlled-substance dispensing is stored inconsistently — some in the patient profile, some on paper sticky notes, and some missing for mail-order shipments verified by a hub pharmacist.`,
    "What is the pharmacist's most appropriate action before inspection?",
    opts4(
      "Tell inspectors PDMP review occurred even when documentation is missing",
      "Standardize PDMP documentation workflows, retrieve or recreate compliant records where lawfully possible, and ensure spoke and mail-order models meet corresponding-responsibility documentation",
      "Stop dispensing all controlled substances until inspection passes",
      "Delegate PDMP documentation entirely to technicians without pharmacist review"
    ),
    "Standardize PDMP documentation workflows, retrieve or recreate compliant records where lawfully possible, and ensure spoke and mail-order models meet corresponding-responsibility documentation",
    `Inspection readiness requires consistent PDMP documentation across dispensing models — not verbal assurances, total CS cessation, or technician-only accountability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["inspection", "readiness", "PDMP", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old staff pharmacist learns a colleague moved expired drug samples and outdated compounded preparations to a back room before a announced board walk-through, intending to discard them after the inspector leaves.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the plan because the products will be discarded soon",
      "Require immediate proper quarantine or disposal, accurate inventory records, and prohibit concealing non-compliant products from inspectors",
      "Relabel expired samples as employee education stock",
      "Refuse all future board inspections without a subpoena"
    ),
    "Require immediate proper quarantine or disposal, accurate inventory records, and prohibit concealing non-compliant products from inspectors",
    `Inspection readiness prohibits concealing expired or non-compliant inventory — immediate quarantine or disposal and accurate records are required. Relabeling or inspection refusal violate board cooperation duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["inspection", "readiness", "inventory", "quarantine", ...PE],
    }
  ),

  // ── Pregnancy / Lactation Dispensing Counseling (3) ───────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 31-year-old pregnant patient in her second trimester presents a refill for lisinopril 20 mg tablets for chronic hypertension. She reports the medication was started before pregnancy and has not seen her obstetrician since the positive test.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the refill because the patient is established on therapy",
      "Counsel that ACE inhibitors are contraindicated in pregnancy, recommend urgent obstetric/prescriber follow-up, and contact the prescriber before continued dispensing when clinically appropriate",
      "Switch to labetalol without prescriber authorization because it is pregnancy-safe",
      "Refuse all counseling because hypertension management is solely the physician's role"
    ),
    "Counsel that ACE inhibitors are contraindicated in pregnancy, recommend urgent obstetric/prescriber follow-up, and contact the prescriber before continued dispensing when clinically appropriate",
    `Pharmacists must counsel on pregnancy contraindications for ACE inhibitors and facilitate prescriber follow-up — not silent refills, unilateral therapeutic switches, or refusal to counsel.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["pregnancy", "counseling", "ACE-inhibitor", "dispensing", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "ACE inhibitors are contraindicated in pregnancy — counsel and contact the prescriber before continued dispensing.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 28-year-old breastfeeding patient picks up a prescription for codeine 30 mg/acetaminophen tablets for postpartum pain. She asks whether the medication is safe while nursing her 10-day-old infant.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Assure the patient codeine is safe in all breastfeeding mothers",
      "Counsel on codeine risks in breastfeeding including ultra-rapid metabolizer concerns, discuss safer analgesic alternatives with the prescriber when appropriate, and document counseling",
      "Dispense without counseling because the prescriber already approved the drug",
      "Refuse to dispense any opioid to breastfeeding patients without board permission"
    ),
    "Counsel on codeine risks in breastfeeding including ultra-rapid metabolizer concerns, discuss safer analgesic alternatives with the prescriber when appropriate, and document counseling",
    `Codeine carries serious infant risk in breastfeeding due to variable metabolism — pharmacists must counsel and coordinate safer alternatives when appropriate. Blank assurances, prescriber-only reliance, or blanket refusal without assessment fail patient care duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [LACTMED],
      tags: ["lactation", "breastfeeding", "codeine", "counseling", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 34-year-old patient in her third trimester asks the pharmacist whether she may take OTC ibuprofen 200 mg for back pain until her obstetric appointment next week. She has no aspirin allergy and normal blood pressure.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Recommend ibuprofen because it is OTC and lower dose than prescription NSAIDs",
      "Counsel that NSAIDs are generally avoided in the third trimester due to fetal risks, suggest non-pharmacologic measures and prescriber/obstetric follow-up for appropriate analgesia",
      "Sell a large bottle of ibuprofen to last until delivery",
      "Recommend aspirin 325 mg instead because it is cardioprotective"
    ),
    "Counsel that NSAIDs are generally avoided in the third trimester due to fetal risks, suggest non-pharmacologic measures and prescriber/obstetric follow-up for appropriate analgesia",
    `Third-trimester NSAID use carries fetal risk — pharmacists should counsel against casual OTC ibuprofen use and recommend appropriate follow-up. OTC status, bulk supply, or aspirin substitution without obstetric guidance are inappropriate.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["pregnancy", "OTC", "NSAID", "counseling", ...PE],
    }
  ),

  // ── Utah (2) ──────────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Salt Lake City presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets. Utah requires Controlled Substance Database (CSD) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Utah CSD, document the review, and apply corresponding-responsibility judgment",
      "Skip CSD review for patients with commercial insurance",
      "Query CSD only for Schedule II drugs, not hydrocodone combination products",
      "Delegate CSD review and dispensing authorization to a technician"
    ),
    "Query the Utah CSD, document the review, and apply corresponding-responsibility judgment",
    `Utah requires pharmacists to query and document Controlled Substance Database review before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 3,
      references: [UT_REF],
      tags: ["utah", "CSD", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 66-year-old patient requests a shingles vaccine at an Ogden pharmacy. The pharmacist completed Utah-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Utah protocol requirements",
      "Refuse because shingles vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Utah protocol requirements",
    `Utah authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Utah access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 2,
      references: [UT_REF],
      tags: ["utah", "immunization", "shingles", ...PE],
    }
  ),

  // ── Arizona (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Phoenix presents a new prescription for tramadol 50 mg tablets. Arizona requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Arizona PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients paying cash",
      "Query PMP only for Schedule II drugs, not tramadol",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Arizona PMP, document the review, and apply corresponding-responsibility judgment",
    `Arizona requires pharmacists to query and document PMP review before dispensing controlled substances. Cash payment does not waive monitoring. Tramadol is controlled under federal and Arizona schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AZ",
      difficulty: 3,
      references: [AZ_REF],
      tags: ["arizona", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 70-year-old patient requests a pneumococcal vaccine at a Tucson pharmacy. The pharmacist completed Arizona-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Arizona protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Arizona protocol requirements",
    `Arizona authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AZ",
      difficulty: 2,
      references: [AZ_REF],
      tags: ["arizona", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── New Mexico (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 46-year-old patient in Albuquerque presents a new prescription for oxycodone 5 mg tablets. New Mexico requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the New Mexico PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the New Mexico PMP, document the review, and apply corresponding-responsibility judgment",
    `New Mexico requires pharmacists to query and document PMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NM",
      difficulty: 3,
      references: [NM_REF],
      tags: ["new-mexico", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests an influenza vaccine at a Santa Fe pharmacy. The pharmacist completed New Mexico-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per New Mexico protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per New Mexico protocol requirements",
    `New Mexico authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate New Mexico access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NM",
      difficulty: 2,
      references: [NM_REF],
      tags: ["new-mexico", "immunization", "influenza", ...PE],
    }
  ),
];
