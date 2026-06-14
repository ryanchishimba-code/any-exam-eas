/**
 * Curated MPJE-style items — physician-educator batch 18.
 * Topics: FDA drug shortages reporting, veterinary compounding, NPI/Medicare fraud,
 * closing pharmacy wind-down, ME/NH/WV state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-18";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA = {
  label: "FDA Drug Shortages / Supply Chain",
  url: "https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const CMS = { label: "CMS Medicare Provider Enrollment (NPI)", url: "https://www.cms.gov" };
const ME_REF = {
  label: "Maine Pharmacy Practice Act",
  citation: "32 M.R.S. § 13701 et seq.",
};
const NH_REF = {
  label: "New Hampshire Pharmacy Act",
  citation: "RSA 318:1 et seq.",
};
const WV_REF = {
  label: "West Virginia Pharmacy Act",
  citation: "W. Va. Code § 30-5-1 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_18: EnrichedBankItem[] = [
  // ── FDA Drug Shortages Reporting (3) ──────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 62-year-old patient on chronic carbidopa-levodopa cannot obtain the prescribed strength because the manufacturer reported a national shortage and wholesalers show zero allocation. The pharmacist has documented two wholesaler denials this week.`,
    "What is the pharmacist's most appropriate action regarding the shortage?",
    opts4(
      "Tell the patient nothing can be done until the manufacturer restocks",
      "Notify the prescriber of the shortage, discuss therapeutic alternatives, document allocation efforts, and report the shortage through appropriate FDA/manufacturer channels when required",
      "Purchase the drug from an unlicensed online seller without pedigree",
      "Reserve the last bottles exclusively for cash-paying patients"
    ),
    "Notify the prescriber of the shortage, discuss therapeutic alternatives, document allocation efforts, and report the shortage through appropriate FDA/manufacturer channels when required",
    `Drug shortages require prescriber communication, documented sourcing efforts, fair allocation, and reporting through FDA shortage programs when applicable — not patient abandonment, gray-market purchases, or cash-only hoarding.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["drug-shortage", "FDA-reporting", "allocation", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Shortages require prescriber notification, alternatives, documentation, and FDA reporting when applicable.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 55-year-old pharmacy manager learns a critical injectable antibiotic is in FDA shortage. Staff propose purchasing excess inventory from another pharmacy at triple cost and withholding the information from prescribers to sell at premium cash prices.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Participate in premium resale and withhold shortage information",
      "Decline price gouging and concealment; communicate shortage status to prescribers and pursue lawful allocation and reporting",
      "Compound a different drug class without prescriber orders to substitute",
      "Discard all remaining stock to force equal patient impact"
    ),
    "Decline price gouging and concealment; communicate shortage status to prescribers and pursue lawful allocation and reporting",
    `Shortage management prohibits concealment, price gouging, and unilateral therapeutic substitution. Lawful communication, allocation, and reporting protect patients and comply with professional and regulatory expectations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["drug-shortage", "FDA-reporting", "ethics", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 48-year-old hospital outpatient pharmacy cannot fill pediatric oncology maintenance therapy due to a reported shortage. The pharmacist has identified a temporary alternative strength in stock but needs prescriber direction and must document shortage response for accreditation surveyors.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the alternative strength without prescriber contact because it is an emergency",
      "Contact the prescriber regarding the shortage and alternative therapy, document interventions, and maintain shortage response records per policy and FDA expectations",
      "Cancel the prescription without patient notification",
      "Import unapproved foreign product without regulatory authorization"
    ),
    "Contact the prescriber regarding the shortage and alternative therapy, document interventions, and maintain shortage response records per policy and FDA expectations",
    `Pediatric oncology shortages require prescriber-directed alternatives and documented shortage response — not silent substitution, abandonment, or unauthorized importation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["drug-shortage", "FDA-reporting", "documentation", ...PE],
    }
  ),

  // ── Veterinary Compounding (3) ──────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 40-year-old pet owner presents a human prescription for amoxicillin suspension written by a physician for their dog's ear infection. The owner asks the community pharmacist to dispense it for the pet today.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the human prescription for the dog because the drug is the same",
      "Decline to fill a human prescription for veterinary use; require a valid veterinary prescription issued within the veterinarian's scope for the animal patient",
      "Dispense if the owner signs a waiver converting it to veterinary use",
      "Allow the technician to select the dose for the dog without pharmacist review"
    ),
    "Decline to fill a human prescription for veterinary use; require a valid veterinary prescription issued within the veterinarian's scope for the animal patient",
    `Veterinary dispensing generally requires valid veterinary prescriptions for animal patients — not human prescriptions repurposed with owner waivers or technician dose selection without veterinary authority.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["veterinary", "prescription-validity", "dispensing", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Animal patients require valid veterinary prescriptions — not repurposed human Rx with owner waivers.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old veterinarian sends a prescription for compounded transdermal methimazole for a 12-year-old cat with hyperthyroidism. The pharmacist proposes using the human bulk powder stock without a veterinary-specific master formulation record.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Compound using human stock without veterinary compounding records",
      "Compound only with appropriate veterinary prescription, compliant compounding documentation, labeling for animal use, and applicable USP/state veterinary compounding standards",
      "Refuse all veterinary compounding because pharmacies serve humans only",
      "Dispense human tablets with instructions to the owner to crush and mix at home"
    ),
    "Compound only with appropriate veterinary prescription, compliant compounding documentation, labeling for animal use, and applicable USP/state veterinary compounding standards",
    `Veterinary compounding requires valid veterinary orders, proper compounding records, animal-appropriate labeling, and applicable standards — not human-stock shortcuts, blanket refusal without evaluation, or unsafe home manipulation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["veterinary", "compounding", "USP-795", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 45-year-old horse owner requests ketamine injection from a leftover veterinary prescription written for a different animal two years ago. The owner states the veterinarian is unreachable and the horse is in pain tonight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense ketamine from the old prescription because the owner confirms pain",
      "Refuse to dispense controlled substances from an expired or non-patient-specific veterinary prescription; require current veterinary authorization",
      "Dispense a smaller quantity without documentation to help the horse",
      "Transfer the owner to an online seller without prescription verification"
    ),
    "Refuse to dispense controlled substances from an expired or non-patient-specific veterinary prescription; require current veterinary authorization",
    `Controlled substances require current valid veterinary prescriptions for the specific animal — not expired orders, partial undocumented supplies, or unverified online redirection.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["veterinary", "controlled-substances", "prescription-validity", ...PE],
    }
  ),

  // ── NPI / Medicare Enrollment Fraud (3) ─────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old relief pharmacist discovers that Part D claims at a retail pharmacy were submitted under a former pharmacist's NPI who no longer works at the store. The manager says this "keeps star ratings stable."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue billing under the former pharmacist's NPI to preserve metrics",
      "Stop misattributed billing, use only active credentialed provider identifiers, and correct enrollment and claims per CMS and payer rules",
      "Bill under the technician's personal NPI",
      "Bill all claims as cash to hide the NPI issue"
    ),
    "Stop misattributed billing, use only active credentialed provider identifiers, and correct enrollment and claims per CMS and payer rules",
    `Medicare Part D claims must use accurate active provider NPI attribution — not former staff NPIs, technician identifiers, or cash conversion to conceal enrollment fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["NPI", "Medicare", "billing-fraud", "enrollment", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Part D claims must use accurate active NPIs — misattribution is enrollment fraud.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old pharmacy owner asks a newly hired pharmacist to sign CMS provider enrollment forms and bill MTM services under the new pharmacist's NPI while the owner performs all clinical services without licensure in that state.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Sign and bill because the owner holds the business license",
      "Refuse to lend NPI credentials for services not personally performed; ensure enrollment and billing reflect the licensed pharmacist actually providing the service",
      "Bill under a random active NPI found online",
      "Perform services without enrolling because enrollment is optional"
    ),
    "Refuse to lend NPI credentials for services not personally performed; ensure enrollment and billing reflect the licensed pharmacist actually providing the service",
    `NPI and CMS enrollment require that billed services are performed by the enrolled licensed provider — not credential lending, random NPI use, or unenrolled billing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["NPI", "Medicare", "MTM", "billing-fraud", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 51-year-old pharmacist learns a corporate affiliate created phantom immunization events billed to Medicare using the pharmacist's NPI without administering vaccines. An audit letter arrives next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the revenue because the NPI is technically the pharmacist's",
      "Report the fraudulent billing, refuse participation, cooperate with audit remediation, and ensure future claims reflect services actually rendered",
      "Create backdated vaccine records to match the claims",
      "Ignore the audit because corporate legal will handle everything silently"
    ),
    "Report the fraudulent billing, refuse participation, cooperate with audit remediation, and ensure future claims reflect services actually rendered",
    `Phantom billing using a pharmacist's NPI without service delivery is fraud. Reporting, remediation, and accurate future claims — not passive acceptance, backdated records, or silent audit avoidance — are required.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["NPI", "Medicare", "billing-fraud", "immunization", ...PE],
    }
  ),

  // ── Closing Pharmacy Wind-Down (3) ────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old independent pharmacy will permanently close in 30 days. The PIC must plan disposition of Schedule II–V inventory, patient records, and outstanding prescriptions at two LTC facilities.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Abandon controlled substances and records when the doors close",
      "Develop a board- and DEA-compliant wind-down plan including CS disposition, record retention/transfer, prescriber and patient notification, and prescription transfers",
      "Sell controlled substances to employees at discount on the last day",
      "Destroy all prescription records immediately to reduce storage costs"
    ),
    "Develop a board- and DEA-compliant wind-down plan including CS disposition, record retention/transfer, prescriber and patient notification, and prescription transfers",
    `Pharmacy closure requires lawful CS disposition, record retention or transfer, and patient/prescriber notification — not abandonment, employee sales, or premature record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["pharmacy-closure", "wind-down", "controlled-substances", "records", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Pharmacy closure requires DEA/board wind-down — CS disposition, records, and patient notification.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old chain pharmacy's lease ends abruptly in seven days. The district manager instructs staff to stop accepting prescription transfers in and to discard partial patient profiles to simplify closing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Follow the manager and discard profiles to meet the deadline",
      "Facilitate lawful prescription transfers, retain or transfer records per board rules, and notify patients and prescribers despite the accelerated timeline",
      "Transfer only controlled substance files and discard all other records",
      "Leave medications in the store for the landlord to handle"
    ),
    "Facilitate lawful prescription transfers, retain or transfer records per board rules, and notify patients and prescribers despite the accelerated timeline",
    `Accelerated closure still requires patient access through transfers, proper record handling, and notification — not profile destruction, selective retention, or abandoned inventory.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["pharmacy-closure", "wind-down", "transfers", "records", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old PIC closing a community pharmacy must notify the state board, DEA, third-party payers, and patients. The owner asks to delay board notification until after the final sale of fixtures to avoid scrutiny.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Delay all regulatory notifications until fixture sales close",
      "Provide required timely notice to the board, DEA, payers, and affected patients/prescribers per closure regulations",
      "Notify patients only through a social media post on the last day",
      "Close silently without notifying LTC partners receiving blister packs"
    ),
    "Provide required timely notice to the board, DEA, payers, and affected patients/prescribers per closure regulations",
    `Pharmacy wind-down requires timely regulatory and stakeholder notification — not delayed concealment, last-minute social posts only, or silent LTC disruption.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["pharmacy-closure", "wind-down", "board-notification", ...PE],
    }
  ),

  // ── Maine (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Portland presents a new prescription for oxycodone 10 mg tablets. Maine requires pharmacists to query the Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Maine PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Maine PMP, document the review, and apply corresponding-responsibility judgment",
    `Maine requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ME",
      difficulty: 3,
      references: [ME_REF],
      tags: ["maine", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist licensed in Massachusetts begins dispensing at a Bangor chain pharmacy before receiving a Maine pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Maine licensure?",
    opts4(
      "Continue dispensing under the Massachusetts license until Maine approves",
      "Obtain a Maine pharmacist license before practicing in the state",
      "Register with DEA only and defer Maine board licensure",
      "Work as a pharmacy intern indefinitely without Maine licensure"
    ),
    "Obtain a Maine pharmacist license before practicing in the state",
    `Maine requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Maine pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ME",
      difficulty: 2,
      references: [ME_REF],
      tags: ["maine", "licensure", ...PE],
    }
  ),

  // ── New Hampshire (2) ───────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Manchester presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. New Hampshire requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the New Hampshire PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the New Hampshire PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `New Hampshire requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NH",
      difficulty: 3,
      references: [NH_REF],
      tags: ["new-hampshire", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Nashua picks up a new prescription at a community pharmacy. New Hampshire aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `New Hampshire community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NH",
      difficulty: 2,
      references: [NH_REF],
      tags: ["new-hampshire", "offer-to-counsel", ...PE],
    }
  ),

  // ── West Virginia (2) ───────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Charleston presents a new prescription for alprazolam 0.5 mg tablets. West Virginia requires Controlled Substances Monitoring Program (CSMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the West Virginia CSMP, document the review, and apply corresponding-responsibility judgment",
      "Skip CSMP because benzodiazepines are not monitored",
      "Query CSMP only when the patient pays cash",
      "Delegate CSMP review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the West Virginia CSMP, document the review, and apply corresponding-responsibility judgment",
    `West Virginia requires pharmacists to query and document CSMP review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WV",
      difficulty: 3,
      references: [WV_REF],
      tags: ["west-virginia", "CSMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 54-year-old pharmacist relocates to Morgantown and begins dispensing at an independent pharmacy before receiving a West Virginia pharmacist license, relying on an active Ohio license.`,
    "What is the pharmacist's most appropriate action regarding West Virginia licensure?",
    opts4(
      "Continue dispensing under the Ohio license until West Virginia renewal season",
      "Obtain a West Virginia pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer West Virginia board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a West Virginia pharmacist license through the board before practicing in the state",
    `West Virginia requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate West Virginia pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WV",
      difficulty: 2,
      references: [WV_REF],
      tags: ["west-virginia", "licensure", ...PE],
    }
  ),
];
