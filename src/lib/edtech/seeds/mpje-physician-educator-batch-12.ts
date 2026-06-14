/**
 * Curated MPJE-style items — physician-educator batch 12.
 * Topics: MTM/billing compliance, drug shortage allocation, security/robbery,
 * UMPJE transition, UT/ID/NV state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-12";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const NABP = {
  label: "NABP Uniform MPJE (UMPJE) Content Outline",
  url: "https://nabp.pharmacy/programs/mpje/",
};
const CMS = {
  label: "CMS Medicare Part D Medication Therapy Management (MTM)",
  url: "https://www.cms.gov/medicare/prescription-drug-coverage/prescriptiondrugcovgen/mtm",
};
const UT_REF = {
  label: "Utah Pharmacy Practice Act",
  citation: "Utah Code § 58-17b et seq.",
};
const ID_REF = {
  label: "Idaho Pharmacy Practice Act",
  citation: "Idaho Code § 54-17 et seq.",
};
const NV_REF = {
  label: "Nevada Pharmacy Laws",
  citation: "Nev. Rev. Stat. § 639 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_12: EnrichedBankItem[] = [
  // ── MTM / Billing Compliance (3) ──────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 71-year-old Medicare Part D patient completes a comprehensive medication review (CMR) with a pharmacist. Corporate billing staff instruct the pharmacist to submit MTM claims for patients who received only a brief pickup counseling without a documented CMR or targeted MTM service.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Submit MTM claims for all eligible patients to maximize revenue",
      "Bill MTM services only when documented eligible services are performed per CMS and plan requirements",
      "Bill CMR codes whenever any counseling occurs at pickup",
      "Allow technicians to submit MTM claims without pharmacist review"
    ),
    "Bill MTM services only when documented eligible services are performed per CMS and plan requirements",
    `Medicare Part D MTM billing requires documented eligible services — typically CMR or targeted MTM with required elements. Billing for brief pickup counseling or undifferentiated counseling violates CMS program integrity rules and may constitute fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["MTM", "billing-compliance", "Medicare", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "MTM billing requires documented eligible services — brief pickup counseling is not billable CMR.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old patient enrolled in MTM receives a documented comprehensive medication review identifying three drug therapy problems. The pharmacist resolves two problems and documents interventions, but the third requires prescriber follow-up not yet completed.`,
    "What is the pharmacist's most appropriate action regarding MTM documentation and billing?",
    opts4(
      "Bill the CMR as complete without noting the unresolved problem",
      "Document all identified problems, interventions, and follow-up plans accurately; bill only when service documentation meets program completion requirements",
      "Bill twice — once for each resolved problem",
      "Delete the unresolved problem from the record before submission"
    ),
    "Document all identified problems, interventions, and follow-up plans accurately; bill only when service documentation meets program completion requirements",
    `MTM documentation must accurately reflect identified drug therapy problems, interventions, and follow-up — not selective omission for billing. Double billing or record deletion to force claim acceptance violates CMS documentation and fraud standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["MTM", "billing-compliance", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old pharmacy manager offers prescribers gift cards for each patient referred into the pharmacy's MTM program. The manager asks the pharmacist to mark all referred patients as having received CMRs regardless of actual service delivery.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the referral incentives and document phantom CMRs",
      "Refuse improper inducements and bill only for MTM services actually performed with compliant documentation",
      "Bill CMRs for referred patients after a 2-minute pickup conversation",
      "Allow technicians to sign MTM documentation on the pharmacist's behalf"
    ),
    "Refuse improper inducements and bill only for MTM services actually performed with compliant documentation",
    `Kickbacks for MTM referrals and billing for undelivered services violate federal anti-kickback and program integrity rules. Minimal counseling, technician-signed pharmacist MTM records, and phantom documentation constitute fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["MTM", "billing-compliance", "anti-kickback", ...PE],
    }
  ),

  // ── Drug Shortage Allocation (3) ──────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 59-year-old patient on chronic levothyroxine 100 mcg learns the pharmacy has limited stock due to a national shortage. A local prescriber's office asks the pharmacist to reserve the remaining bottles exclusively for that practice's patients.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Reserve all remaining stock for one prescriber's panel",
      "Allocate limited supply fairly among patients with documented need, communicate with prescribers on alternatives, and document allocation decisions",
      "Sell remaining stock only to cash-paying patients",
      "Refuse all fills until full supply returns regardless of patient harm"
    ),
    "Allocate limited supply fairly among patients with documented need, communicate with prescribers on alternatives, and document allocation decisions",
    `Drug shortage response requires fair patient-centered allocation, prescriber communication on therapeutic alternatives, and documentation — not prescriber favoritism, cash-only preference, or blanket refusal despite clinical need.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["drug-shortage", "allocation", "levothyroxine", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Shortage allocation must be fair and documented — not reserved for one prescriber or cash patients only.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 47-year-old oncology patient needs a critical supportive-care medication on FDA shortage. The pharmacist identifies a therapeutically reasonable alternative in stock but the prescriber has not responded to two contact attempts.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Substitute the alternative without any prescriber communication",
      "Continue documented prescriber outreach per protocol; dispense an alternative only when authorized by prescriber or permitted under applicable substitution law and urgency",
      "Tell the patient to find the drug online without pharmacy involvement",
      "Hoard the alternative for future cash sales"
    ),
    "Continue documented prescriber outreach per protocol; dispense an alternative only when authorized by prescriber or permitted under applicable substitution law and urgency",
    `Shortage management requires documented prescriber communication before therapeutic substitution unless state law and urgency authorize pharmacist action. Unilateral substitution, patient abandonment to unverified sources, or hoarding violate professional and patient safety duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["drug-shortage", "therapeutic-alternative", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old pharmacy buyer proposes purchasing excess shortage medication from a secondary gray-market broker at a large markup without verifying pedigree or licensure. Patients on waiting lists need the product within 48 hours.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Purchase immediately from the broker to clear the waiting list",
      "Obtain product only from authorized licensed sources with required pedigree and tracing; do not purchase from unverified gray-market suppliers",
      "Compound a different strength without prescriber approval to simulate the shortage drug",
      "Divert another patient's paid prescription to the waiting-list patient"
    ),
    "Obtain product only from authorized licensed sources with required pedigree and tracing; do not purchase from unverified gray-market suppliers",
    `Shortage urgency does not justify gray-market purchases lacking pedigree, licensure, and supply chain integrity. Unauthorized compounding or diverting another patient's paid prescription violates DSCSA, compounding, and dispensing ethics.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["drug-shortage", "gray-market", "pedigree", ...PE],
    }
  ),

  // ── Security / Robbery Protocols (3) ────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 42-year-old masked individual demands all oxycodone tablets from the pharmacy register during business hours and implies possession of a weapon. The technician asks whether to physically resist to protect inventory.`,
    "What is the pharmacist's most appropriate immediate action?",
    opts4(
      "Physically confront the robber to protect controlled substances",
      "Prioritize staff and patient safety, comply with trained robbery protocols, activate silent alarm if safe, and observe details for law enforcement report",
      "Refuse all demands and lock the robber in the pharmacy",
      "Pursue the robber into the parking lot after they leave"
    ),
    "Prioritize staff and patient safety, comply with trained robbery protocols, activate silent alarm if safe, and observe details for law enforcement report",
    `Robbery response prioritizes human safety over inventory. Trained compliance, silent alarm activation when safe, and post-incident reporting — not physical confrontation, unlawful detention, or pursuit — align with security protocols and DEA/board expectations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["security", "robbery", "controlled-substances", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Robbery protocols prioritize staff and patient safety — comply, alarm if safe, report to law enforcement.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: After an overnight break-in, a 51-year-old pharmacist-in-charge discovers the controlled-substance vault was forced open and Schedule II inventory is missing. The PIC has not yet contacted authorities.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Adjust inventory silently and reorder stock before opening",
      "Secure the scene, notify law enforcement, report theft/loss to DEA on Form 106, and reconcile inventory per DEA and board requirements",
      "Wait until the next biennial inventory to report the loss",
      "Blame the alarm company and take no further action"
    ),
    "Secure the scene, notify law enforcement, report theft/loss to DEA on Form 106, and reconcile inventory per DEA and board requirements",
    `Theft or significant loss of controlled substances requires prompt law enforcement notification, DEA Form 106 reporting, and inventory reconciliation — not silent adjustment, delayed biennial reporting, or vendor blame without regulatory notification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["security", "robbery", "theft", "DEA-106", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 38-year-old relief pharmacist working alone at night proposes leaving the controlled-substance vault unlocked to speed closing procedures. The store has experienced two recent shoplifting incidents but no robberies.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave the vault unlocked because no robbery has occurred",
      "Maintain required CS security controls including locked storage, limited access, and policy compliance regardless of convenience",
      "Store Schedule II bottles at the register for faster access",
      "Give the technician the vault combination for closing efficiency"
    ),
    "Maintain required CS security controls including locked storage, limited access, and policy compliance regardless of convenience",
    `Controlled-substance security requires locked storage and restricted access at all times — not unlocked vaults, register storage, or technician vault access for convenience. Shoplifting history increases security importance.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [DEA],
      tags: ["security", "controlled-substances", "vault", ...PE],
    }
  ),

  // ── UMPJE Transition (3) ──────────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 46-year-old pharmacist licensed in Utah — a state transitioning to the Uniform MPJE (UMPJE) framework — asks whether state-specific dispensing rules still apply after the transition for items such as PDMP review and technician supervision.`,
    "What is the pharmacist's most appropriate understanding?",
    opts4(
      "UMPJE adoption eliminates all state board rules immediately",
      "Federal law and UMPJE uniform standards apply alongside remaining state-specific requirements until fully superseded by board rule",
      "Only federal DEA rules apply after UMPJE transition",
      "Technicians may practice independently once UMPJE is adopted"
    ),
    "Federal law and UMPJE uniform standards apply alongside remaining state-specific requirements until fully superseded by board rule",
    `UMPJE transition aligns multistate jurisprudence testing with uniform federal/state patterns but does not automatically eliminate all state-specific practice act requirements. Pharmacists must comply with federal law, applicable UMPJE-aligned standards, and current state board rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [NABP],
      tags: ["UMPJE", "transition", "multistate", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "UMPJE transition does not eliminate state-specific rules — federal, uniform, and state requirements coexist.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 52-year-old pharmacy board candidate in Idaho asks whether the UMPJE content outline replaces study of Idaho-specific PDMP query requirements and pharmacist licensure rules before practicing.`,
    "What is the pharmacist's most appropriate guidance?",
    opts4(
      "Study only federal DEA topics because UMPJE covers everything",
      "Prepare using UMPJE uniform content plus current Idaho board rules and practice act requirements for licensure and practice",
      "Ignore Idaho rules because Idaho is adopting UMPJE",
      "Rely on NAPLEX clinical content instead of any jurisprudence study"
    ),
    "Prepare using UMPJE uniform content plus current Idaho board rules and practice act requirements for licensure and practice",
    `UMPJE provides a uniform jurisprudence examination framework; candidates and practitioners must still know applicable state board rules — PDMP, licensure, and dispensing — that remain in effect during and after transition.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [NABP],
      tags: ["UMPJE", "transition", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 49-year-old multistate chain pharmacist practices under reciprocity in Nevada while Nevada transitions to UMPJE. Corporate training covers only legacy Nevada-specific exam topics from 2018 materials.`,
    "What is the pharmacist's most appropriate action regarding compliance training?",
    opts4(
      "Rely solely on outdated 2018 Nevada exam prep materials",
      "Update practice compliance using current Nevada board rules and UMPJE-aligned federal/uniform standards as adopted",
      "Assume UMPJE transition waives all continuing compliance obligations",
      "Practice under another state's rules while physically dispensing in Nevada"
    ),
    "Update practice compliance using current Nevada board rules and UMPJE-aligned federal/uniform standards as adopted",
    `Practicing pharmacists must follow current board rules in the state of practice — not outdated exam materials, assumed waivers, or another state's rules. UMPJE transition requires updated compliance awareness, not reduced diligence.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [NABP],
      tags: ["UMPJE", "transition", "compliance", ...PE],
    }
  ),

  // ── Utah (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 54-year-old patient in Salt Lake City presents a new prescription for oxycodone 10 mg tablets. Utah requires pharmacists to query the Controlled Substance Database (CSD) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Utah CSD, document the review, and apply corresponding-responsibility judgment",
      "Skip CSD review for patients with established local prescribers",
      "Query CSD only for Schedule II drugs, not oxycodone",
      "Delegate CSD review and dispensing authorization to a technician"
    ),
    "Query the Utah CSD, document the review, and apply corresponding-responsibility judgment",
    `Utah requires pharmacists to query and document Controlled Substance Database review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 3,
      references: [UT_REF],
      tags: ["utah", "CSD", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 43-year-old pharmacist licensed in Wyoming begins dispensing at a Provo chain pharmacy before receiving a Utah pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Utah licensure?",
    opts4(
      "Continue dispensing under the Wyoming license until Utah approves",
      "Obtain a Utah pharmacist license before practicing in the state",
      "Register with DEA only and defer Utah board licensure",
      "Work as a pharmacy intern indefinitely without Utah licensure"
    ),
    "Obtain a Utah pharmacist license before practicing in the state",
    `Utah requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Utah pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "UT",
      difficulty: 2,
      references: [UT_REF],
      tags: ["utah", "licensure", ...PE],
    }
  ),

  // ── Idaho (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Boise presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Idaho requires Prescription Monitoring Program (PMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Idaho PMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PMP for combination hydrocodone products",
      "Query PMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PMP review"
    ),
    "Query the Idaho PMP, document the review, and exercise corresponding responsibility before dispensing",
    `Idaho requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 3,
      references: [ID_REF],
      tags: ["idaho", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient in Idaho Falls picks up a new prescription at a community pharmacy. Idaho aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient has filled at this pharmacy before"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Idaho community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or prior fill history do not waive OBRA-aligned offer-to-counsel requirements for new prescriptions.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ID",
      difficulty: 2,
      references: [ID_REF],
      tags: ["idaho", "offer-to-counsel", ...PE],
    }
  ),

  // ── Nevada (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Las Vegas presents a new prescription for alprazolam 0.5 mg tablets. Nevada requires Prescription Monitoring Program (PMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Nevada PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP because benzodiazepines are not monitored",
      "Query PMP only when the patient pays cash",
      "Delegate PMP review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the Nevada PMP, document the review, and apply corresponding-responsibility judgment",
    `Nevada requires pharmacists to query and document PMP review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NV",
      difficulty: 3,
      references: [NV_REF],
      tags: ["nevada", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 56-year-old pharmacist relocates to Reno and begins dispensing at an independent pharmacy before receiving a Nevada pharmacist license, relying on an active California license.`,
    "What is the pharmacist's most appropriate action regarding Nevada licensure?",
    opts4(
      "Continue dispensing under the California license until Nevada renewal season",
      "Obtain a Nevada pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Nevada board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Nevada pharmacist license through the board before practicing in the state",
    `Nevada requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate Nevada pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NV",
      difficulty: 2,
      references: [NV_REF],
      tags: ["nevada", "licensure", ...PE],
    }
  ),
];
