/**
 * Curated MPJE-style items — physician-educator batch 10.
 * Topics: central fill/mail order, prescription transfers, emergency preparedness,
 * pharmacy ownership/PIC duties, WI/IN/MI state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-10";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const OBRA = {
  label: "Omnibus Budget Reconciliation Act (OBRA '90) Pharmacy Provisions",
  citation: "42 U.S.C. § 1396r-8",
};
const WI_REF = {
  label: "Wisconsin Pharmacy Examining Board",
  citation: "Wis. Stat. § 450.01 et seq.",
};
const IN_REF = {
  label: "Indiana Pharmacy Board",
  citation: "Ind. Code § 25-26 et seq.",
};
const MI_REF = {
  label: "Michigan Pharmacy Laws",
  citation: "MCL § 333.17701 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_10: EnrichedBankItem[] = [
  // ── Central Fill / Mail Order (3) ───────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 67-year-old patient's maintenance lisinopril 20 mg prescription is processed at a central fill facility and shipped to a retail pickup site. The central fill pharmacist completes product selection and labeling but skips final verification because the retail pharmacist will "check it later."`,
    "What is the pharmacist's most appropriate action at the central fill site?",
    opts4(
      "Skip verification at central fill because retail staff will inspect at pickup",
      "Perform pharmacist final verification at the central fill site before release to shipping per policy and board rules",
      "Allow technicians to perform final verification at central fill when volume is high",
      "Ship unverified product if delivery occurs within 24 hours"
    ),
    "Perform pharmacist final verification at the central fill site before release to shipping per policy and board rules",
    `Central fill and mail-order models require pharmacist final verification before product leaves the dispensing pharmacy or central fill site. Delegating final verification to retail pickup staff, technicians, or time-based shortcuts violates standard of practice and board accountability rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["central-fill", "mail-order", "verification", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Central fill requires pharmacist final verification before release to shipping — not deferred to pickup sites.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient receives a mail-order shipment of a new prescription for apixaban 5 mg. The package includes medication and labeling but no offer to speak with a pharmacist. The patient calls asking about bleeding risk and drug interactions.`,
    "What is the mail-order pharmacy's most appropriate action?",
    opts4(
      "Refuse all phone counseling because mail order is exempt from OBRA",
      "Provide toll-free pharmacist access and offer counseling on the new prescription per OBRA and applicable mail-order rules",
      "Direct the patient to an online FAQ only without pharmacist availability",
      "Require the patient to return the package unused before counseling"
    ),
    "Provide toll-free pharmacist access and offer counseling on the new prescription per OBRA and applicable mail-order rules",
    `Mail-order pharmacies must offer counseling through toll-free access for new prescriptions under OBRA and state mail-order requirements. Blanket exemptions, FAQ-only responses, or conditioning counseling on product return fail federal and state offer-to-counsel obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["mail-order", "counseling", "OBRA", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old patient in a rural area receives mail-order oxycodone 5 mg tablets shipped from an out-of-state pharmacy. The dispensing pharmacist did not query the patient's home-state PDMP before release, assuming mail-order CS is exempt from monitoring.`,
    "What is the dispensing pharmacist's most appropriate action regarding PDMP review?",
    opts4(
      "Skip PDMP review for all mail-order controlled substances",
      "Query and document applicable PDMP review before dispensing controlled substances per state and corresponding-responsibility requirements",
      "Query PDMP only if the patient picks up in person at a retail counter",
      "Delegate PDMP review to the shipping carrier"
    ),
    "Query and document applicable PDMP review before dispensing controlled substances per state and corresponding-responsibility requirements",
    `Mail-order dispensing does not waive PDMP review and corresponding-responsibility duties for controlled substances. Pharmacist accountability remains with the dispensing pharmacy — not retail-only assumptions or carrier delegation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["mail-order", "PDMP", "controlled-substances", ...PE],
    }
  ),

  // ── Prescription Transfers (3) ──────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 61-year-old patient requests transfer of a remaining refill on tramadol 50 mg tablets (Schedule IV) from Pharmacy A to your store. Pharmacy A confirms no prior transfer, one fill dispensed, and refills remaining. Both pharmacists document required transfer elements.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the one-time documented transfer of the Schedule IV prescription if all federal and state transfer requirements are met",
      "Refuse because all controlled substances are non-transferable",
      "Accept unlimited transfers for Schedule IV drugs",
      "Transfer without documentation if the patient is a regular customer"
    ),
    "Accept the one-time documented transfer of the Schedule IV prescription if all federal and state transfer requirements are met",
    `Schedule III–V prescriptions may be transferred once between pharmacies when federal conditions and documentation requirements are satisfied. Schedule II is non-transferable. Unlimited transfers and undocumented transfers violate 21 CFR § 1306.25 and board rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["transfer", "C-IV", "documentation", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Schedule III–V may transfer once with full documentation — Schedule II cannot transfer.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 48-year-old patient asks Pharmacy B to transfer out a non-controlled metformin 500 mg prescription with two refills remaining. Pharmacy B's pharmacist receives a transfer request from Pharmacy C but notices the last fill date on the request does not match Pharmacy B's records.`,
    "What is the releasing pharmacist's most appropriate action?",
    opts4(
      "Release the prescription immediately to avoid delaying patient therapy",
      "Reconcile the discrepancy with Pharmacy C, verify accurate transfer information, and document before releasing the prescription",
      "Cancel the prescription without contacting the other pharmacy",
      "Transfer only one refill and discard the rest without explanation"
    ),
    "Reconcile the discrepancy with Pharmacy C, verify accurate transfer information, and document before releasing the prescription",
    `Releasing pharmacies must verify accurate prescription information before transfer. Discrepancies require pharmacist-to-pharmacist reconciliation and documentation — not silent release, unilateral cancellation, or arbitrary refill reduction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["transfer", "documentation", "releasing-pharmacy", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 39-year-old patient presents a transfer request for gabapentin 300 mg from a pharmacy 200 miles away. The faxed transfer lists a prescriber the receiving pharmacist cannot verify and shows a quantity inconsistent with the patient's insurance claim history.`,
    "What is the receiving pharmacist's most appropriate action?",
    opts4(
      "Dispense immediately because the patient needs the medication today",
      "Withhold dispensing, verify the transfer and prescriber authenticity, and resolve discrepancies before dispensing",
      "Dispense a 7-day supply without verification to build goodwill",
      "Accept all out-of-state transfers without pharmacist contact"
    ),
    "Withhold dispensing, verify the transfer and prescriber authenticity, and resolve discrepancies before dispensing",
    `Receiving pharmacists must verify transfer authenticity and resolve red flags before dispensing. Urgency, partial goodwill supplies, or blanket acceptance of out-of-state transfers without verification violate corresponding responsibility and transfer documentation standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["transfer", "red-flags", "verification", ...PE],
    }
  ),

  // ── Emergency Preparedness (3) ──────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 72-year-old patient's insulin and vaccines are stored in a pharmacy refrigerator when a power outage occurs during a winter storm. The backup generator fails and internal temperature rises above 8°C for six hours before power returns.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue dispensing affected insulin and vaccines because the outage was brief",
      "Quarantine affected products, document the excursion, and follow manufacturer and CDC guidance before any use or dispensing",
      "Discard all pharmacy inventory regardless of storage location",
      "Sell affected products at a discount to reduce loss"
    ),
    "Quarantine affected products, document the excursion, and follow manufacturer and CDC guidance before any use or dispensing",
    `Emergency power loss requires quarantine, documentation, and manufacturer/CDC guidance for temperature-sensitive products. Continuing to dispense compromised cold-chain products or discounting them creates patient safety risk. Blanket disposal of all inventory is unnecessary without evaluation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-preparedness", "cold-chain", "power-outage", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "After cold-chain failure, quarantine affected products and follow manufacturer/CDC guidance before dispensing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old pharmacist-in-charge must evacuate a community pharmacy due to flooding. Controlled substances remain in the dispensing vault. The PIC has a relocation plan but staff ask whether CS records and inventory can be left behind until water recedes.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave controlled substances and records unsecured until the flood subsides",
      "Secure and relocate controlled substances and critical records per the emergency plan and DEA/board requirements",
      "Abandon all Schedule II inventory without documentation",
      "Transfer CS accountability to the nearest technician-only site"
    ),
    "Secure and relocate controlled substances and critical records per the emergency plan and DEA/board requirements",
    `Emergency preparedness requires securing and relocating controlled substances and critical records — not leaving them unsecured, abandoning inventory without documentation, or delegating CS accountability to unqualified staff.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["emergency-preparedness", "controlled-substances", "PIC", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old independent pharmacy closes unexpectedly when the PIC becomes ill. Patients call requesting emergency refills of maintenance medications. A relief pharmacist from a neighboring store offers to access the closed pharmacy's files without board authorization.`,
    "What is the pharmacist's most appropriate action to maintain continuity of care?",
    opts4(
      "Break into the closed pharmacy and dispense without authorization",
      "Follow board emergency procedures, coordinate authorized coverage or transfers, and document patient access pathways per state rules",
      "Refuse all patient requests until the PIC returns regardless of clinical need",
      "Provide unlimited refills without prescription verification"
    ),
    "Follow board emergency procedures, coordinate authorized coverage or transfers, and document patient access pathways per state rules",
    `Unexpected closure requires authorized emergency coverage, transfers, or board-approved procedures — not unauthorized access, blanket refusal despite clinical need, or unlimited unverified refills.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-preparedness", "continuity-of-care", ...PE],
    }
  ),

  // ── Pharmacy Ownership / PIC Duties (3) ─────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old pharmacist accepts designation as pharmacist-in-charge at a new community pharmacy. The non-pharmacist owner asks the PIC to defer board notification of the PIC change until after a promotional grand opening in six weeks.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Delay PIC notification until marketing events conclude",
      "Ensure timely board notification and compliance with PIC designation requirements before or as required upon assuming duties",
      "Allow the owner to serve as acting PIC because they hold the business license",
      "Designate a technician as PIC for the opening period"
    ),
    "Ensure timely board notification and compliance with PIC designation requirements before or as required upon assuming duties",
    `PIC designation requires board notification and compliance within required timeframes — not marketing delays. Non-pharmacist owners and technicians cannot serve as PIC. Operating without proper PIC designation violates practice act requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["PIC", "ownership", "board-notification", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "PIC changes require timely board notification — non-pharmacist owners cannot serve as PIC.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old non-pharmacist investor purchases a retail pharmacy and instructs the staff pharmacist to "run the pharmacy however you want" while the owner signs prescriptions and performs final verification to save payroll costs.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the owner to verify prescriptions because they hold the business license",
      "Refuse non-pharmacist dispensing and verification; ensure only licensed pharmacists perform pharmacist duties",
      "Register the owner as a technician to expand scope",
      "Close the pharmacy permanently without reporting the violation"
    ),
    "Refuse non-pharmacist dispensing and verification; ensure only licensed pharmacists perform pharmacist duties",
    `Pharmacy ownership does not authorize non-pharmacists to perform pharmacist duties such as final verification. Business licenses, technician registration, or silent closure do not substitute for licensed pharmacist practice.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["ownership", "PIC", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old pharmacist serves as PIC for three chain locations within the same district. Corporate policy directs the PIC to sign all controlled-substance invoices remotely without reviewing receiving records at each site.`,
    "What is the pharmacist's most appropriate action as PIC?",
    opts4(
      "Sign all invoices remotely without review to meet corporate deadlines",
      "Maintain PIC oversight of controlled-substance accountability at each licensed site per DEA and board rules",
      "Delegate CS receiving entirely to technicians at all three sites",
      "Consolidate all CS inventory at one store without DEA authorization"
    ),
    "Maintain PIC oversight of controlled-substance accountability at each licensed site per DEA and board rules",
    `PIC accountability for controlled substances cannot be reduced to blind remote signatures. Each licensed site requires pharmacist oversight of CS receiving and records. Technician-only receiving and unauthorized inventory consolidation violate DEA and board requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["PIC", "controlled-substances", "multi-site", ...PE],
    }
  ),

  // ── Wisconsin (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 56-year-old patient in Milwaukee presents a new prescription for oxycodone 10 mg tablets. Wisconsin requires pharmacists to query the Prescription Drug Monitoring Program (PDMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Wisconsin PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with established local prescribers",
      "Query PDMP only for Schedule II drugs, not oxycodone",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Wisconsin PDMP, document the review, and apply corresponding-responsibility judgment",
    `Wisconsin requires pharmacists to query and document PDMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WI",
      difficulty: 3,
      references: [WI_REF],
      tags: ["wisconsin", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist licensed in Illinois begins dispensing at a Madison chain pharmacy before receiving a Wisconsin pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Wisconsin licensure?",
    opts4(
      "Continue dispensing under the Illinois license until Wisconsin approves",
      "Obtain a Wisconsin pharmacist license before practicing in the state",
      "Register with DEA only and defer Wisconsin board licensure",
      "Work as a pharmacy intern indefinitely without Wisconsin licensure"
    ),
    "Obtain a Wisconsin pharmacist license before practicing in the state",
    `Wisconsin requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Wisconsin pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WI",
      difficulty: 2,
      references: [WI_REF],
      tags: ["wisconsin", "licensure", ...PE],
    }
  ),

  // ── Indiana (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Indianapolis presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Indiana requires INSPECT (Indiana Scheduled Prescription Electronic Collection and Tracking) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query INSPECT, document the review, and exercise corresponding responsibility before dispensing",
      "Skip INSPECT for combination hydrocodone products",
      "Query INSPECT once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist INSPECT review"
    ),
    "Query INSPECT, document the review, and exercise corresponding responsibility before dispensing",
    `Indiana requires PDMP (INSPECT) query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IN",
      difficulty: 3,
      references: [IN_REF],
      tags: ["indiana", "INSPECT", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 65-year-old patient in Fort Wayne picks up a new prescription at a community pharmacy. Indiana aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient has filled at this pharmacy before"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Indiana community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or prior fill history do not waive OBRA-aligned offer-to-counsel requirements for new prescriptions.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IN",
      difficulty: 2,
      references: [IN_REF],
      tags: ["indiana", "offer-to-counsel", ...PE],
    }
  ),

  // ── Michigan (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Detroit presents a new prescription for alprazolam 0.5 mg tablets. Michigan requires MAPS (Michigan Automated Prescription System) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query MAPS, document the review, and apply corresponding-responsibility judgment",
      "Skip MAPS because benzodiazepines are not monitored",
      "Query MAPS only when the patient pays cash",
      "Delegate MAPS review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query MAPS, document the review, and apply corresponding-responsibility judgment",
    `Michigan requires pharmacists to query and document MAPS review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PDMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MI",
      difficulty: 3,
      references: [MI_REF],
      tags: ["michigan", "MAPS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 53-year-old pharmacist relocates to Ann Arbor and begins dispensing at an independent pharmacy before receiving a Michigan pharmacist license, relying on an active Ohio license.`,
    "What is the pharmacist's most appropriate action regarding Michigan licensure?",
    opts4(
      "Continue dispensing under the Ohio license until Michigan renewal season",
      "Obtain a Michigan pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Michigan board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Michigan pharmacist license through the board before practicing in the state",
    `Michigan requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate the Michigan Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MI",
      difficulty: 2,
      references: [MI_REF],
      tags: ["michigan", "licensure", ...PE],
    }
  ),
];
