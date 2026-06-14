/**
 * Curated MPJE-style items — physician-educator batch 13.
 * Topics: non-sterile BUD, counseling refusal documentation, third-party payer audits,
 * pharmacy automation, HI/AK/MT state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-13";
const PE = ["physician-educator", BATCH, "mpje"];

const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };
const OBRA = {
  label: "Omnibus Budget Reconciliation Act (OBRA '90) Pharmacy Provisions",
  citation: "42 U.S.C. § 1396r-8",
};
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

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_13: EnrichedBankItem[] = [
  // ── Non-Sterile Beyond-Use Dating (3) ───────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 60-year-old patient receives a non-sterile compounded oral suspension in a water-containing vehicle. The pharmacist assigns a 90-day room-temperature beyond-use date because the commercial API label lists 24-month stability in a dry form.`,
    "What is the pharmacist's most appropriate beyond-use date (BUD) assignment under USP <795>?",
    opts4(
      "Assign BUD per <795> category limits for aqueous oral suspensions and storage — not dry API label stability alone",
      "Use 90 days at room temperature for all oral suspensions",
      "Use 24 months because the API is stable in bulk powder",
      "Omit BUD if the patient will finish the bottle within two weeks"
    ),
    "Assign BUD per <795> category limits for aqueous oral suspensions and storage — not dry API label stability alone",
    `USP <795> BUD for non-sterile aqueous preparations depends on formulation category, water content, and storage — not bulk API stability data alone. Arbitrary 90-day or 24-month dating ignores microbial growth risk in water-containing vehicles. All dispensed compounds require labeled BUD.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", "oral-suspension", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Non-sterile aqueous BUD follows USP <795> category limits — not bulk API stability alone.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old patient needs a non-sterile topical hydrocortisone 2.5% cream compounded in a nonaqueous base. The pharmacy stores the preparation refrigerated but labels it for room-temperature patient use with a 180-day BUD.`,
    "What is the pharmacist's most appropriate BUD assignment?",
    opts4(
      "Assign BUD based on <795> limits for the formulation type using the labeled patient storage conditions — not refrigeration during compounding alone",
      "Use 180 days because nonaqueous bases always allow maximum dating",
      "Use 12 months for all topical non-sterile compounds",
      "Extend BUD whenever the product looks and smells normal at pickup"
    ),
    "Assign BUD based on <795> limits for the formulation type using the labeled patient storage conditions — not refrigeration during compounding alone",
    `USP <795> BUD must reflect the labeled storage and formulation category assigned to the patient — not internal refrigeration convenience or sensory appearance at pickup. Nonaqueous bases still have category-specific limits; arbitrary 180-day or 12-month dating violates <795>.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", "topical", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 45-year-old compounding pharmacist discovers a non-sterile batch of diphenhydramine oral liquid was prepared without potency testing or stability data beyond default <795> category limits. Staff propose extending the BUD to match a competitor pharmacy's 60-day label.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Match the competitor's 60-day BUD without documentation",
      "Assign BUD within default <795> category limits unless valid supporting stability data justify extended dating per standards",
      "Extend BUD indefinitely because diphenhydramine is widely used",
      "Dispense without BUD labeling if prepared same-day"
    ),
    "Assign BUD within default <795> category limits unless valid supporting stability data justify extended dating per standards",
    `Extended non-sterile BUD beyond default <795> limits requires supporting stability data and documentation — not competitor matching, therapeutic familiarity, or same-day labeling omissions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", "stability", ...PE],
    }
  ),

  // ── Counseling Refusal Documentation (3) ────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient picks up a new prescription for apixaban 5 mg and states, "I don't need counseling — I'm in a hurry." The technician offers to skip documentation to speed checkout.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip documentation because the patient declined counseling verbally",
      "Ensure the pharmacist offered counseling and document the patient's declination per OBRA and state requirements",
      "Refuse to dispense because the patient declined counseling",
      "Allow the cashier to document counseling offer without pharmacist involvement"
    ),
    "Ensure the pharmacist offered counseling and document the patient's declination per OBRA and state requirements",
    `Offer-to-counsel requires documentation of acceptance or declination — verbal refusal does not waive the offer or recordkeeping. Refusing dispense solely for declination misstates OBRA. Non-pharmacist documentation of pharmacist counseling obligations may fail compliance standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [OBRA],
      tags: ["offer-to-counsel", "counseling-refusal", "documentation", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Patient counseling declinations must be documented — the offer still must occur.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 38-year-old adult picks up a new methotrexate 2.5 mg prescription for a 72-year-old parent and says the parent already knows how to take it. No caregiver authorization is on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling to the adult pickup person or arrange pharmacist contact with the patient; document the offer and response",
      "Skip counseling because the pickup person is family",
      "Provide counseling only to the pickup person without offering patient contact",
      "Dispense without any counseling offer because it is a refill look-alike drug"
    ),
    "Offer counseling to the adult pickup person or arrange pharmacist contact with the patient; document the offer and response",
    `New high-risk prescriptions require offer-to-counsel even when picked up by a family member. Documentation of offer and response is required. Family relationship does not waive offer obligations; proxy counseling without patient contact option may be insufficient for certain therapies.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["offer-to-counsel", "counseling-refusal", "caregiver-pickup", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old patient picking up a new insulin glargine prescription signs a generic counseling waiver form that does not specify the drug or date. The pharmacy uses the same pre-signed form for all patients at drive-through.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the generic waiver for all new prescriptions",
      "Offer counseling on the new prescription and document specific acceptance or declination per OBRA — generic waivers do not replace prescription-specific documentation",
      "Refuse all drive-through dispensing permanently",
      "Counsel only when the patient initiates questions"
    ),
    "Offer counseling on the new prescription and document specific acceptance or declination per OBRA — generic waivers do not replace prescription-specific documentation",
    `OBRA-aligned offer-to-counsel requires prescription-specific documentation of offer and patient response. Blanket generic waivers and passive counseling-only-on-request fail federal and state documentation standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [OBRA],
      tags: ["offer-to-counsel", "counseling-refusal", "documentation", ...PE],
    }
  ),

  // ── Third-Party Payer Audits (3) ────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 50-year-old pharmacy receives a PBM audit request for 40 dispensing records including signatures, DUR documentation, and proof of generic substitution for a 68-year-old patient's statin therapy. Staff propose creating missing DUR notes after the audit letter arrives.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Create retroactive DUR notes to satisfy the auditor",
      "Produce retrievable authentic records and respond accurately; do not fabricate or alter documentation",
      "Ignore the audit because PBMs lack legal authority",
      "Submit only records that already show perfect compliance and discard others"
    ),
    "Produce retrievable authentic records and respond accurately; do not fabricate or alter documentation",
    `Payer audits require production of authentic dispensing and clinical records. Retroactive fabrication, selective submission, or ignoring valid audit requests violates program integrity and may constitute fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["payer-audit", "PBM", "documentation", "fraud", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Payer audits require authentic records — never fabricate or alter documentation retroactively.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old pharmacy manager discovers that generic atorvastatin was dispensed to a 64-year-old patient but the claim was submitted with a brand product code to obtain higher reimbursement. A Medicare contractor audit is scheduled next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Alter past claims quietly before the audit",
      "Correct billing practices immediately, disclose and remediate erroneous claims per legal and compliance guidance, and cooperate with the audit",
      "Continue miscoding because audits rarely find individual claims",
      "Blame the software vendor and take no corrective action"
    ),
    "Correct billing practices immediately, disclose and remediate erroneous claims per legal and compliance guidance, and cooperate with the audit",
    `Miscoding dispensed product on claims is fraud. Immediate correction, remediation, and audit cooperation — not silent alteration, continued miscoding, or vendor blame without remediation — satisfy legal and professional obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["payer-audit", "billing-compliance", "Medicare", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old Medicaid integrity auditor requests compounding records, ingredient invoices, and reimbursement claims for 12 non-sterile compounds billed to Medicaid over the past year. The PIC cannot locate invoices for two batches.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Reconstruct invoices from memory before the auditor arrives",
      "Provide all retrievable authentic records, document gaps honestly, and implement corrective record retention procedures",
      "Refuse the audit because compounding is clinical practice",
      "Bill the compounds as manufactured products to simplify the audit response"
    ),
    "Provide all retrievable authentic records, document gaps honestly, and implement corrective record retention procedures",
    `Medicaid and payer audits require authentic compounding and billing documentation. Reconstructed invoices, audit refusal, or rebilling misclassification to evade review violate program integrity and board expectations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["payer-audit", "Medicaid", "compounding", "records", ...PE],
    }
  ),

  // ── Pharmacy Automation (3) ───────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 66-year-old patient's refill for warfarin 5 mg is retrieved automatically from a robotic dispensing system and placed in the will-call bin. The workflow bypasses pharmacist verification when the barcode matches the previous fill exactly.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow technician release because the robot matched the prior fill barcode",
      "Maintain pharmacist final verification before patient release even when automation selects product",
      "Disable all barcode scanning to speed production",
      "Allow patients to self-retrieve from the robot without any verification"
    ),
    "Maintain pharmacist final verification before patient release even when automation selects product",
    `Automated dispensing and robotics do not replace pharmacist final verification and professional responsibility. Barcode matches and prior-fill similarity do not waive pharmacist review for high-risk medications.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["pharmacy-automation", "verification", "robotics", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Automation does not replace pharmacist final verification before release.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 43-year-old technician overrides an automated dispensing cabinet (ADC) barcode mismatch alert to retrieve hydromorphone 2 mg tablets for a 59-year-old hospice patient, stating the correct pocket was empty and an adjacent pocket looked identical.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the override because hospice patients need timely pain control",
      "Prohibit unauthorized barcode overrides for controlled substances; verify product identity and document per CS and automation policy before dispensing",
      "Disable ADC alerts permanently to reduce workflow interruptions",
      "Transfer ADC accountability to the nurse on the unit"
    ),
    "Prohibit unauthorized barcode overrides for controlled substances; verify product identity and document per CS and automation policy before dispensing",
    `Barcode mismatch overrides for controlled substances require pharmacist verification and documentation — not technician convenience, disabled alerts, or nurse delegation of pharmacy CS accountability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["pharmacy-automation", "ADC", "barcode", "controlled-substances", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old chain enables auto-refill for chronic medications. A new drug-drug interaction alert fires for a 70-year-old patient starting clarithromycin while on simvastatin, but the system queues the refill for shipping without pharmacist DUR review.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow auto-shipment because the patient enrolled in auto-refill",
      "Hold the automated refill until pharmacist DUR review and prescriber resolution per policy",
      "Disable all DUR permanently to maximize auto-refill enrollment",
      "Ship the statin and contact the prescriber after delivery"
    ),
    "Hold the automated refill until pharmacist DUR review and prescriber resolution per policy",
    `Automated refill systems do not waive prospective DUR and interaction management. Auto-shipment despite serious alerts, DUR disablement, or post-shipment prescriber contact for unresolved interactions violates patient safety and dispensing standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["pharmacy-automation", "auto-refill", "DUR", ...PE],
    }
  ),

  // ── Hawaii (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Honolulu presents a new prescription for oxycodone 10 mg tablets. Hawaii requires pharmacists to query the Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Hawaii PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Hawaii PMP, document the review, and apply corresponding-responsibility judgment",
    `Hawaii requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "HI",
      difficulty: 3,
      references: [HI_REF],
      tags: ["hawaii", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 46-year-old pharmacist licensed in Oregon begins dispensing at a Maui community pharmacy before receiving a Hawaii pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Hawaii licensure?",
    opts4(
      "Continue dispensing under the Oregon license until Hawaii approves",
      "Obtain a Hawaii pharmacist license before practicing in the state",
      "Register with DEA only and defer Hawaii board licensure",
      "Work as a pharmacy intern indefinitely without Hawaii licensure"
    ),
    "Obtain a Hawaii pharmacist license before practicing in the state",
    `Hawaii requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Hawaii pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "HI",
      difficulty: 2,
      references: [HI_REF],
      tags: ["hawaii", "licensure", ...PE],
    }
  ),

  // ── Alaska (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Anchorage presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Alaska requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Alaska PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the Alaska PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Alaska requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AK",
      difficulty: 3,
      references: [AK_REF],
      tags: ["alaska", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 64-year-old patient in Fairbanks picks up a new prescription at a community pharmacy. Alaska aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the pharmacy serves a remote population with limited staff"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Alaska community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or remote staffing limitations do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AK",
      difficulty: 2,
      references: [AK_REF],
      tags: ["alaska", "offer-to-counsel", ...PE],
    }
  ),

  // ── Montana (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Billings presents a new prescription for alprazolam 0.5 mg tablets. Montana requires Prescription Drug Registry review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Montana Prescription Drug Registry, document the review, and apply corresponding-responsibility judgment",
      "Skip registry review because benzodiazepines are not monitored",
      "Query the registry only when the patient pays cash",
      "Delegate registry review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the Montana Prescription Drug Registry, document the review, and apply corresponding-responsibility judgment",
    `Montana requires pharmacists to query and document Prescription Drug Registry review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist registry accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MT",
      difficulty: 3,
      references: [MT_REF],
      tags: ["montana", "PDMP", "prescription-drug-registry", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 55-year-old pharmacist relocates to Missoula and begins dispensing at an independent pharmacy before receiving a Montana pharmacist license, relying on an active Idaho license.`,
    "What is the pharmacist's most appropriate action regarding Montana licensure?",
    opts4(
      "Continue dispensing under the Idaho license until Montana renewal season",
      "Obtain a Montana pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Montana board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Montana pharmacist license through the board before practicing in the state",
    `Montana requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate the Montana Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MT",
      difficulty: 2,
      references: [MT_REF],
      tags: ["montana", "licensure", ...PE],
    }
  ),
];
