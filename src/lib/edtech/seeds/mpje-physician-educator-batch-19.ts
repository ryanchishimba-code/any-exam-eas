/**
 * Curated MPJE-style items — physician-educator batch 19.
 * Topics: FDA 503B outsourcing, auxiliary prescription labeling, workers' comp billing,
 * pharmacy technician ratio/supervision, MD/DC/PR state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-19";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA_503B = {
  label: "FDA 503B Outsourcing Facilities",
  url: "https://www.fda.gov/drugs/human-drug-compounding/503b-outsourcing-facilities",
};
const FDCA = {
  label: "Federal Food, Drug, and Cosmetic Act (Labeling)",
  url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents",
};
const MD_REF = {
  label: "Maryland Pharmacy Practice Act",
  citation: "Md. Code Ann., Health Occupations § 12-101 et seq.",
};
const DC_REF = {
  label: "District of Columbia Pharmacy Practice Act",
  citation: "D.C. Code § 3-1201.01 et seq.",
};
const PR_REF = {
  label: "Puerto Rico Pharmacy Practice Act",
  citation: "Laws of Puerto Rico Title 27 § 221 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_19: EnrichedBankItem[] = [
  // ── FDA 503B Outsourcing (3) ──────────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 59-year-old hospital outpatient manager asks a community pharmacy to purchase sterile ketamine vials from a registered 503B outsourcing facility and repackage them into patient-specific syringes for clinic stock without individual prescriptions on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Repackage 503B ketamine for office stock because outsourcing facilities are FDA-approved manufacturers",
      "Decline repackaging for office stock without valid patient-specific prescriptions and verify that distribution complies with 503B registration, state law, and USP standards",
      "Treat 503B products as OTC because they are bulk manufactured",
      "Copy the 503B formulation in the community pharmacy clean room without a prescription"
    ),
    "Decline repackaging for office stock without valid patient-specific prescriptions and verify that distribution complies with 503B registration, state law, and USP standards",
    `503B outsourcing facilities operate under FDA registration distinct from 503A compounding. Bulk repackaging for office stock without patient-specific orders violates federal distribution and state practice rules. 503B products are not OTC, and copying without lawful compounding authority is prohibited.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_503B],
      tags: ["503B", "outsourcing", "office-use", "USP-797", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "503B products require lawful distribution pathways — not office-stock repackaging without patient-specific orders.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old physician office requests that a pharmacy obtain a high-risk sterile admixture from a 503B facility for weekly in-office injections across 40 patients. The office has no individual prescriptions and asks the pharmacy to bill the 503B shipment as a routine wholesale purchase.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Process the order as wholesale inventory because the 503B is FDA registered",
      "Verify that the 503B facility is registered, confirm lawful distribution purpose, and ensure patient-specific prescribing or other compliant pathways before dispensing or facilitating use",
      "Substitute a 503A compounded batch prepared overnight in the retail pharmacy",
      "Ship the product interstate to the office without verifying registration or state requirements"
    ),
    "Verify that the 503B facility is registered, confirm lawful distribution purpose, and ensure patient-specific prescribing or other compliant pathways before dispensing or facilitating use",
    `503B registration does not waive prescription, distribution, or interstate requirements. Pharmacists must confirm lawful purpose and compliant prescribing pathways — not wholesale shortcuts, unauthorized 503A substitution, or unverified interstate shipment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_503B],
      tags: ["503B", "outsourcing", "interstate", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 47-year-old PIC discovers that staff received a shipment labeled from an unregistered facility claiming 503B status. The product is a preservative-free ophthalmic solution requested for multiple clinic patients without prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Use the product because the label states 503B",
      "Quarantine the shipment, verify FDA 503B registration status, and refuse use until lawful sourcing and prescribing requirements are confirmed",
      "Relabel the product as 503A compounded and dispense immediately",
      "Return the product to patients already treated without investigation"
    ),
    "Quarantine the shipment, verify FDA 503B registration status, and refuse use until lawful sourcing and prescribing requirements are confirmed",
    `503B status must be verified through FDA registration — not label claims alone. Unregistered or mislabeled bulk ophthalmic products require quarantine and verification before any patient use. Relabeling as 503A or ignoring prior exposure violates federal and safety standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_503B],
      tags: ["503B", "outsourcing", "quarantine", "verification", ...PE],
    }
  ),

  // ── Auxiliary Prescription Labeling (3) ───────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient picks up warfarin 5 mg tablets. The prescription label includes name, directions, and quantity but lacks auxiliary warnings. State law and professional standards require auxiliary labeling for medications with narrow therapeutic index or high-risk administration.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense without auxiliary labels because the federal label is complete",
      "Apply appropriate auxiliary labels such as consistent timing and bleeding-risk warnings, and offer counseling before release",
      "Add auxiliary labels only if the patient requests written warnings",
      "Allow the technician to omit auxiliary labels for drive-through pickup"
    ),
    "Apply appropriate auxiliary labels such as consistent timing and bleeding-risk warnings, and offer counseling before release",
    `Warfarin requires auxiliary warnings and counseling beyond minimum federal label elements. Professional and state standards mandate high-risk auxiliary labels — not optional patient requests, technician omission, or drive-through exceptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [FDCA],
      tags: ["auxiliary-label", "labeling", "counseling", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "High-risk drugs require auxiliary labels and counseling — federal minimum labels alone are insufficient.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 44-year-old patient receives a suspension requiring refrigeration. The primary label lists directions but staff debate whether a "Refrigerate" auxiliary label is necessary because the drug name implies liquid form.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Omit refrigeration labeling because liquids are assumed cold",
      "Apply a refrigeration auxiliary label and include storage instructions in counseling documentation",
      "Write storage instructions only on the receipt, not the container",
      "Use a generic 'Keep at room temperature' label to avoid confusion"
    ),
    "Apply a refrigeration auxiliary label and include storage instructions in counseling documentation",
    `Refrigerated suspensions require explicit auxiliary storage labels on the container plus documented counseling. Assumed liquid storage, receipt-only instructions, or incorrect room-temperature labels fail professional labeling standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [FDCA],
      tags: ["auxiliary-label", "labeling", "storage", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 71-year-old patient with low vision picks up a new eye drop. The manager suggests skipping "For the eye only" auxiliary labeling to reduce label clutter and speed workflow during a busy shift.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip route auxiliary labels during busy periods to improve throughput",
      "Apply route-specific auxiliary labels and offer counseling including proper administration technique",
      "Rely on the drug name alone because ophthalmic products are self-evident",
      "Delegate labeling decisions entirely to unlicensed cashiers"
    ),
    "Apply route-specific auxiliary labels and offer counseling including proper administration technique",
    `Ophthalmic products require route-specific auxiliary labels and counseling regardless of workflow volume. Drug name alone is insufficient for low-vision patients, and unlicensed staff cannot make labeling decisions for dispensed prescriptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["auxiliary-label", "labeling", "offer-to-counsel", ...PE],
    }
  ),

  // ── Workers' Compensation Billing (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 56-year-old injured worker presents a workers' compensation prescription for hydrocodone with a claim number but no employer authorization form required by the payer. The patient needs the medication tonight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill workers' comp without authorization because the claim number is present",
      "Verify payer requirements including authorization or formulary rules, contact the prescriber or payer as needed, and document billing attempts before release",
      "Bill the prescription to Medicare Part D instead to avoid delay",
      "Dispense free samples without any billing documentation"
    ),
    "Verify payer requirements including authorization or formulary rules, contact the prescriber or payer as needed, and document billing attempts before release",
    `Workers' compensation claims require payer-specific authorization and documentation — not claim-number-only billing, improper Medicare crossover, or undocumented free dispensing. Pharmacists must verify requirements and document resolution attempts.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "billing", "authorization", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Workers' comp billing requires payer-specific authorization — claim numbers alone may be insufficient.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old pharmacy receives a workers' compensation audit requesting proof of generic substitution and days-supply limits for a compounded topical billed last quarter. Records show the claim was billed as brand with unlimited refills.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore the audit because workers' comp pays slower than commercial plans",
      "Gather dispensing records, generic substitution documentation, and refill authorization, and respond accurately to the audit with corrective action if billing errors occurred",
      "Backdate authorization forms to match the original claim",
      "Bill future claims as cash to avoid further workers' comp scrutiny"
    ),
    "Gather dispensing records, generic substitution documentation, and refill authorization, and respond accurately to the audit with corrective action if billing errors occurred",
    `Workers' compensation audits require accurate dispensing and billing records. Ignoring audits, backdating authorization, or converting to cash to evade review constitutes fraud and violates payer contracts.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "billing", "audit", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient with a workplace injury asks the pharmacist to split a 90-day workers' comp supply into early partial fills billed separately to maximize reimbursement before the claim closes next month.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Split and bill multiple partial fills to maximize reimbursement before claim closure",
      "Dispense only authorized quantities per prescription and payer rules, and decline manipulative split billing designed to inflate reimbursement",
      "Bill the full 90 days without dispensing any medication",
      "Transfer the claim to a different pharmacy mid-fill without patient consent"
    ),
    "Dispense only authorized quantities per prescription and payer rules, and decline manipulative split billing designed to inflate reimbursement",
    `Workers' compensation dispensing must follow authorized quantities and payer rules. Split billing to inflate reimbursement before claim closure is fraudulent. Billing without dispensing or unauthorized transfers also violate professional and payer standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "billing", "fraud-prevention", ...PE],
    }
  ),

  // ── Pharmacy Technician Ratio / Supervision (3) ───────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 50-year-old chain pharmacy schedules one pharmacist and four technicians during peak hours. State regulations limit the pharmacist-to-technician ratio and require pharmacist supervision of all dispensing activities.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow four technicians to perform all dispensing tasks simultaneously without pharmacist verification because volume is high",
      "Ensure staffing complies with state ratio limits and maintain pharmacist supervision and verification of dispensing, counseling offers, and clinical tasks",
      "Convert technicians to unregistered clerks to bypass ratio rules",
      "Close the pharmacy to all but controlled substance patients"
    ),
    "Ensure staffing complies with state ratio limits and maintain pharmacist supervision and verification of dispensing, counseling offers, and clinical tasks",
    `State technician ratio limits require pharmacist supervision regardless of volume. Unsupervised technician dispensing, unregistered clerk workarounds, or selective closure violate board regulations and patient safety standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["technician-ratio", "supervision", "staffing", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Technician ratios and pharmacist supervision are mandatory — volume does not waive board limits.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 43-year-old PIC at a high-volume store proposes that certified technicians perform final verification on non-controlled prescriptions so the pharmacist can focus solely on immunizations in a separate room without observing dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow technician final verification on all non-controlled prescriptions",
      "Maintain pharmacist final verification and adequate supervision of dispensing per state law; technicians cannot replace pharmacist verification even when the pharmacist is performing other services",
      "Eliminate verification entirely for refills older than one year",
      "Delegate controlled substance verification to the store manager"
    ),
    "Maintain pharmacist final verification and adequate supervision of dispensing per state law; technicians cannot replace pharmacist verification even when the pharmacist is performing other services",
    `Final prescription verification remains a pharmacist responsibility in most jurisdictions. Technicians cannot perform final verification, and off-site immunization work does not eliminate dispensing supervision duties. Managers cannot verify controlled substances.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["technician-ratio", "supervision", "verification", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old relief pharmacist arrives at a store where two technicians are compounding non-sterile preparations and answering clinical drug interaction questions by phone while no pharmacist is on the premises.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow compounding and clinical counseling to continue because technicians are certified",
      "Stop unsupervised compounding and clinical counseling, ensure a pharmacist is present for applicable tasks, and report staffing violations to the PIC and district leadership",
      "Sign compounding logs retroactively at end of shift without review",
      "Refer all patients to mail order without addressing on-site supervision"
    ),
    "Stop unsupervised compounding and clinical counseling, ensure a pharmacist is present for applicable tasks, and report staffing violations to the PIC and district leadership",
    `Compounding and clinical counseling require pharmacist presence and supervision. Certified technicians cannot substitute for on-site pharmacist oversight. Retroactive log signing without review and mail-order redirection without remediation violate practice standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["technician-ratio", "supervision", "compounding", ...PE],
    }
  ),

  // ── Maryland (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 54-year-old patient in Baltimore presents a new prescription for oxycodone 5 mg tablets. Maryland requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Maryland PDMP, document the review, and apply corresponding-responsibility judgment before dispensing",
      "Skip PDMP review for patients with chronic pain established locally",
      "Query PDMP only for Schedule II drugs, not oxycodone tablets",
      "Allow a technician to complete PDMP review and dispense oxycodone without pharmacist authorization"
    ),
    "Query the Maryland PDMP, document the review, and apply corresponding-responsibility judgment before dispensing",
    `Maryland requires pharmacists to query and document PDMP review before dispensing controlled substances. Chronic pain status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MD",
      difficulty: 3,
      references: [MD_REF],
      tags: ["maryland", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 46-year-old pharmacist licensed in Virginia begins dispensing at a Silver Spring community pharmacy before receiving a Maryland pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Maryland licensure?",
    opts4(
      "Continue dispensing under the Virginia license until Maryland approves",
      "Obtain a Maryland pharmacist license before practicing in the state",
      "Register with DEA only and defer Maryland board licensure",
      "Work as a pharmacy intern indefinitely without Maryland licensure"
    ),
    "Obtain a Maryland pharmacist license before practicing in the state",
    `Maryland requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Maryland pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MD",
      difficulty: 2,
      references: [MD_REF],
      tags: ["maryland", "licensure", ...PE],
    }
  ),

  // ── District of Columbia (2) ────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 57-year-old patient in Washington, D.C. presents a prescription for tramadol 50 mg tablets. The District of Columbia requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the D.C. PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP because tramadol is not a controlled substance",
      "Query PDMP only when the patient pays cash",
      "Delegate PDMP review to delivery staff for mail orders without pharmacist oversight"
    ),
    "Query the D.C. PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `The District of Columbia requires PDMP query and documentation before dispensing applicable controlled substances. Tramadol is controlled under federal and D.C. schedules. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "DC",
      difficulty: 3,
      references: [DC_REF],
      tags: ["district-of-columbia", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient in Georgetown picks up a new prescription at a community pharmacy. The District of Columbia aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `D.C. community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "DC",
      difficulty: 2,
      references: [DC_REF],
      tags: ["district-of-columbia", "offer-to-counsel", ...PE],
    }
  ),

  // ── Puerto Rico (2) ─────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient in San Juan presents a new prescription for alprazolam 0.25 mg tablets. Puerto Rico requires monitoring program review before dispensing applicable controlled substances when required by regulation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the applicable Puerto Rico monitoring program, document the review, and apply corresponding-responsibility judgment",
      "Skip monitoring because benzodiazepines are not controlled in Puerto Rico",
      "Query monitoring only for opioid prescriptions, not benzodiazepines",
      "Allow an intern to dispense alprazolam without pharmacist monitoring review"
    ),
    "Query the applicable Puerto Rico monitoring program, document the review, and apply corresponding-responsibility judgment",
    `Puerto Rico requires pharmacists to query and document monitoring program review for applicable controlled substances. Benzodiazepines are controlled. Opioid-only monitoring and intern-only dispensing without pharmacist accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PR",
      difficulty: 3,
      references: [PR_REF],
      tags: ["puerto-rico", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 48-year-old pharmacist licensed in Florida begins dispensing at a Bayamon retail pharmacy before obtaining a Puerto Rico pharmacist license, relying on the Florida license and English-language proficiency.`,
    "What is the pharmacist's most appropriate action regarding Puerto Rico licensure?",
    opts4(
      "Continue dispensing under the Florida license until Puerto Rico approves",
      "Obtain a Puerto Rico pharmacist license through the board before practicing in the jurisdiction",
      "Register with DEA only and defer Puerto Rico board licensure",
      "Work as an unregistered clerk to bypass licensure requirements"
    ),
    "Obtain a Puerto Rico pharmacist license through the board before practicing in the jurisdiction",
    `Puerto Rico requires an active territory pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Puerto Rico pharmacy law regardless of language proficiency.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PR",
      difficulty: 2,
      references: [PR_REF],
      tags: ["puerto-rico", "licensure", ...PE],
    }
  ),
];
