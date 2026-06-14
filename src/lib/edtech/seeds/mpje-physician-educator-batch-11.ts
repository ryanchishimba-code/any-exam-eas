/**
 * Curated MPJE-style items — physician-educator batch 11.
 * Topics: collaborative practice, vaccine authority, DSCSA saleable returns,
 * intern/preceptor rules, LA/AL/MS state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-11";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const DSCSA = {
  label: "Drug Supply Chain Security Act (DSCSA)",
  url: "https://www.fda.gov/drugs/drug-supply-chain-integrity/drug-supply-chain-security-act-dscsa",
};
const LA_REF = {
  label: "Louisiana Pharmacy Practice Act",
  citation: "La. Rev. Stat. § 37:1161 et seq.",
};
const AL_REF = {
  label: "Alabama Pharmacy Practice Act",
  citation: "Ala. Code § 34-23-1 et seq.",
};
const MS_REF = {
  label: "Mississippi Pharmacy Practice Act",
  citation: "Miss. Code § 73-21-1 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_11: EnrichedBankItem[] = [
  // ── Collaborative Practice (3) ────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old patient on warfarin enrolled in a collaborative practice agreement (CPA) has a subtherapeutic INR. The CPA authorizes the pharmacist to adjust the warfarin dose within defined parameters and notify the collaborating prescriber.`,
    "What is the pharmacist's most appropriate action under the CPA?",
    opts4(
      "Adjust the warfarin dose per the CPA protocol, document the intervention, and communicate with the collaborating prescriber as required",
      "Refuse all dose changes because only physicians may modify anticoagulant therapy",
      "Adjust the dose without documentation to save time",
      "Discontinue warfarin independently and start a new anticoagulant not listed in the CPA"
    ),
    "Adjust the warfarin dose per the CPA protocol, document the intervention, and communicate with the collaborating prescriber as required",
    `Valid CPAs authorize defined pharmacist interventions within protocol limits — including anticoagulant dose adjustments with prescriber collaboration and documentation. Blanket refusal, undocumented changes, or therapy switches outside CPA scope exceed or violate collaborative practice boundaries.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["collaborative-practice", "CPA", "anticoagulation", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "CPAs authorize defined pharmacist interventions within protocol — document and communicate per agreement.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old patient requests pharmacist-initiated hormonal contraception under a state-approved CPA at a community pharmacy. The pharmacist completed required training, but no signed CPA with a collaborating prescriber is on file at this location.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense contraception without a CPA because the state allows pharmacist authority",
      "Do not initiate therapy until a valid CPA or other authorized protocol with a collaborating prescriber is established per state law",
      "Allow a technician to select and dispense contraception under a verbal CPA",
      "Prescribe any medication the patient requests once training is complete"
    ),
    "Do not initiate therapy until a valid CPA or other authorized protocol with a collaborating prescriber is established per state law",
    `Pharmacist-initiated therapy under CPAs requires a valid written agreement, training, and protocol — not training alone or technician delegation. Pharmacists cannot independently prescribe beyond authorized CPA or statutory frameworks.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["collaborative-practice", "CPA", "contraception", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old pharmacist operating under a CPA for hypertension management wants to start the patient on a new beta-blocker not included in the approved protocol because recent guidelines favor that class.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Initiate the new beta-blocker immediately because guidelines changed",
      "Act within the CPA scope; contact the collaborating prescriber to modify therapy or update the protocol before initiating non-protocol drug therapy",
      "Allow the patient to choose any antihypertensive from the shelf",
      "Transfer the patient to urgent care without prescriber communication"
    ),
    "Act within the CPA scope; contact the collaborating prescriber to modify therapy or update the protocol before initiating non-protocol drug therapy",
    `CPAs limit pharmacist prescribing and management to agreed protocols. Initiating non-protocol drug classes requires prescriber collaboration or protocol amendment — not unilateral guideline-based changes, patient self-selection, or passive referral without communication.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["collaborative-practice", "CPA", "hypertension", ...PE],
    }
  ),

  // ── Vaccine Authority (3) ───────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 70-year-old patient requests a tetanus-diphtheria-pertussis (Tdap) booster at a community pharmacy. The pharmacist completed board-approved immunization training and the pharmacy maintains a current standing order protocol authorized under state law.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer Tdap after screening, consent, and documentation per the standing order and state immunization requirements",
      "Refuse because vaccines always require an individual prescription in every setting",
      "Allow a technician to administer Tdap while the pharmacist is off-site",
      "Administer without screening because Tdap is routine"
    ),
    "Administer Tdap after screening, consent, and documentation per the standing order and state immunization requirements",
    `Pharmacist vaccine authority in many states permits administration under standing orders or protocols with required training, screening, consent, and documentation. Individual prescriptions are not always required when authorized protocols exist. Technician-only administration and unscreened administration violate immunization standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["vaccine-authority", "immunization", "standing-order", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Pharmacist vaccines require training, valid protocol/standing order, screening, consent, and documentation.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 16-year-old patient requests an influenza vaccine at a community pharmacy without a parent present. State law permits pharmacist administration to defined adolescent age groups under protocol when specific consent requirements are met.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer without any consent review because influenza vaccine is routine",
      "Follow state adolescent consent and protocol requirements before administering or defer until lawful consent is obtained",
      "Refuse all vaccines to minors regardless of state law",
      "Allow the technician to obtain consent and administer the vaccine independently"
    ),
    "Follow state adolescent consent and protocol requirements before administering or defer until lawful consent is obtained",
    `Minor immunization authority varies by state and protocol. Pharmacists must comply with age-specific consent rules — not skip consent, blanket refusal contrary to statute, or technician-only administration.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["vaccine-authority", "immunization", "minor-consent", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient receives a pneumococcal vaccine from a pharmacist under an authorized protocol. State law requires reporting administered immunizations to the state immunization registry within a defined timeframe.`,
    "What is the pharmacist's most appropriate action after administration?",
    opts4(
      "Document only in the pharmacy system because registry reporting is optional",
      "Document the administration and report to the state immunization registry per protocol and state requirements",
      "Report to the registry only if the patient requests it",
      "Defer registry reporting until the patient's next pharmacy visit"
    ),
    "Document the administration and report to the state immunization registry per protocol and state requirements",
    `Many states require immunization registry reporting within defined timeframes. Pharmacy-only documentation, patient-opt-in reporting, or delayed batch reporting may violate state immunization program requirements and compromise public health records.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["vaccine-authority", "immunization", "registry-reporting", ...PE],
    }
  ),

  // ── DSCSA Saleable Returns (3) ──────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 53-year-old pharmacist-in-charge receives a full unopened case of a serialized maintenance medication from the wholesaler in error. The product is within expiration, properly stored, and the wholesaler offers a saleable return credit under DSCSA.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Return the saleable product with required DSCSA transaction statement and documentation to the authorized trading partner",
      "Return the product without serialization or transaction records to speed credit",
      "Place the extra case on the shelf and sell to patients without tracing updates",
      "Destroy the product without notifying the wholesaler"
    ),
    "Return the saleable product with required DSCSA transaction statement and documentation to the authorized trading partner",
    `DSCSA saleable returns require proper product tracing, transaction statements, and authorized trading partner processes — not undocumented returns, silent shelf placement, or unilateral destruction without partner coordination.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "tracing", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "DSCSA saleable returns require transaction statements and authorized trading partner documentation.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 46-year-old pharmacy manager asks to return three serialized inhaler units to the wholesaler as saleable returns. One unit's serial number no longer matches the electronic tracing record after a software sync error.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Include all three units in the saleable return shipment to maximize credit",
      "Resolve the serialization and tracing discrepancy before returning; quarantine mismatched units and investigate per DSCSA",
      "Remove serial numbers from packaging and return as non-serialized product",
      "Donate mismatched units to a charity without tracing updates"
    ),
    "Resolve the serialization and tracing discrepancy before returning; quarantine mismatched units and investigate per DSCSA",
    `Saleable returns require accurate serialization and tracing data. Discrepancies trigger quarantine and investigation — not commingled returns, defaced identifiers, or off-tracing donations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "serialization", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 41-year-old wholesaler representative offers to accept saleable returns from a community pharmacy without providing a DSCSA transaction statement, stating paper invoices are sufficient.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the return without a transaction statement if the invoice matches",
      "Require compliant DSCSA transaction information and statements for saleable returns before releasing product to the trading partner",
      "Ship returns to any distributor willing to issue credit",
      "Discard saleable returns in regular waste to avoid paperwork"
    ),
    "Require compliant DSCSA transaction information and statements for saleable returns before releasing product to the trading partner",
    `DSCSA saleable returns require electronic transaction information and statements — paper invoices alone are generally insufficient. Unauthorized distributor returns and waste disposal to avoid tracing violate supply chain integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DSCSA],
      tags: ["DSCSA", "saleable-returns", "transaction-statement", ...PE],
    }
  ),

  // ── Intern / Preceptor Rules (3) ────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A fourth-year pharmacy intern performs data entry, product selection, and labeling for a new lisinopril prescription. The intern asks to perform final verification and release the medication to the 65-year-old patient because the preceptor is in a meeting.`,
    "What is the preceptor's most appropriate action?",
    opts4(
      "Allow intern final verification for non-controlled prescriptions when the preceptor is briefly unavailable",
      "Prohibit intern final verification; the licensed pharmacist preceptor must perform final review and accept professional responsibility before release",
      "Allow release if the intern has completed two rotations",
      "Delegate final verification to a certified technician instead"
    ),
    "Prohibit intern final verification; the licensed pharmacist preceptor must perform final review and accept professional responsibility before release",
    `Pharmacy interns may perform supportive tasks under preceptor supervision but cannot perform final verification or accept professional responsibility for dispensing. Brief preceptor absence, rotation progress, or technician substitution do not expand intern scope to pharmacist-only duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["intern", "preceptor", "verification", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Interns cannot perform final verification — the pharmacist preceptor must review and accept responsibility.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A pharmacy intern is scheduled to work an evening shift at a community pharmacy while the designated preceptor pharmacist is off-site at another store. The intern proposes to run the dispensing queue independently and contact the preceptor by text if questions arise.`,
    "What is the pharmacist's most appropriate action regarding intern supervision?",
    opts4(
      "Allow independent intern operation with text backup because the preceptor is licensed at the chain",
      "Ensure a licensed pharmacist preceptor or supervisor is present per board intern supervision requirements before the intern performs pharmacy duties",
      "Register the intern as a technician for the shift to avoid supervision rules",
      "Close the pharmacy and send the intern home without rescheduling"
    ),
    "Ensure a licensed pharmacist preceptor or supervisor is present per board intern supervision requirements before the intern performs pharmacy duties",
    `Intern practice requires on-site pharmacist preceptor or supervisor presence per board rules — not remote text backup, technician reclassification, or unnecessary closure without arranging lawful coverage.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["intern", "preceptor", "supervision", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A pharmacy intern accepts a verbal refill authorization for oxycodone 5 mg tablets and begins dispensing while the preceptor is on lunch break at a neighboring restaurant. The preceptor returns after the product is labeled but before pickup.`,
    "What is the preceptor's most appropriate action?",
    opts4(
      "Allow pickup because the intern already completed most of the work",
      "Prohibit intern handling of controlled-substance dispensing without direct preceptor oversight; verify and document per law before any release",
      "Transfer accountability to the technician on duty",
      "Cancel the prescription without patient notification"
    ),
    "Prohibit intern handling of controlled-substance dispensing without direct preceptor oversight; verify and document per law before any release",
    `Controlled-substance dispensing requires pharmacist oversight and corresponding responsibility. Interns cannot independently process CS orders without direct preceptor supervision. Technician transfer of accountability or silent cancellation violates CS and intern practice rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["intern", "preceptor", "controlled-substances", ...PE],
    }
  ),

  // ── Louisiana (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient in New Orleans presents a new prescription for oxycodone 10 mg tablets. Louisiana requires pharmacists to query the Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Louisiana PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Louisiana PMP, document the review, and apply corresponding-responsibility judgment",
    `Louisiana requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "LA",
      difficulty: 3,
      references: [LA_REF],
      tags: ["louisiana", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 45-year-old pharmacist licensed in Arkansas begins dispensing at a Baton Rouge chain pharmacy before receiving a Louisiana pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Louisiana licensure?",
    opts4(
      "Continue dispensing under the Arkansas license until Louisiana approves",
      "Obtain a Louisiana pharmacist license before practicing in the state",
      "Register with DEA only and defer Louisiana board licensure",
      "Work as a pharmacy intern indefinitely without Louisiana licensure"
    ),
    "Obtain a Louisiana pharmacist license before practicing in the state",
    `Louisiana requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates the Louisiana Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "LA",
      difficulty: 2,
      references: [LA_REF],
      tags: ["louisiana", "licensure", ...PE],
    }
  ),

  // ── Alabama (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 57-year-old patient in Birmingham presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Alabama requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Alabama PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the Alabama PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Alabama requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AL",
      difficulty: 3,
      references: [AL_REF],
      tags: ["alabama", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Mobile picks up a new prescription at a community pharmacy. Alabama aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Alabama community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AL",
      difficulty: 2,
      references: [AL_REF],
      tags: ["alabama", "offer-to-counsel", ...PE],
    }
  ),

  // ── Mississippi (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Jackson presents a new prescription for alprazolam 0.5 mg tablets. Mississippi requires Prescription Monitoring Program (PMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Mississippi PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP because benzodiazepines are not monitored",
      "Query PMP only when the patient pays cash",
      "Delegate PMP review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the Mississippi PMP, document the review, and apply corresponding-responsibility judgment",
    `Mississippi requires pharmacists to query and document PMP review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 3,
      references: [MS_REF],
      tags: ["mississippi", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 54-year-old pharmacist relocates to Gulfport and begins dispensing at an independent pharmacy before receiving a Mississippi pharmacist license, relying on an active Tennessee license.`,
    "What is the pharmacist's most appropriate action regarding Mississippi licensure?",
    opts4(
      "Continue dispensing under the Tennessee license until Mississippi renewal season",
      "Obtain a Mississippi pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Mississippi board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Mississippi pharmacist license through the board before practicing in the state",
    `Mississippi requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate the Mississippi Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 2,
      references: [MS_REF],
      tags: ["mississippi", "licensure", ...PE],
    }
  ),
];
