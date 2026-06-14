/**
 * Curated MPJE-style items — physician-educator batch 30.
 * Topics: FDA drug recalls (deeper), immunization adverse events, EPCS fraud/red flags,
 * workers' comp billing, IL/MI/OH state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-30";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA = {
  label: "FDA Drug Recalls and Safety Alerts",
  url: "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const EPCS = {
  label: "DEA Electronic Prescriptions for Controlled Substances (21 CFR Part 1311)",
  url: "https://www.dea.gov/drug-information/drug-scheduling/electronic-prescriptions-controlled-substances",
};
const IL_REF = {
  label: "Illinois Pharmacy Practice Act",
  citation: "225 ILCS 85 et seq.",
};
const MI_REF = {
  label: "Michigan Pharmacy Practice Act",
  citation: "MCL § 333.17701 et seq.",
};
const OH_REF = {
  label: "Ohio Pharmacy Practice Act",
  citation: "ORC § 4729 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_30: EnrichedBankItem[] = [
  // ── FDA Drug Recalls — Deeper (3) ─────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 59-year-old patient returns an unopened bottle from a lot subject to an FDA Class III recall for minor packaging defects with no known safety hazard. The patient asks whether the pharmacy can simply exchange it for a different lot without documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Exchange without documentation because Class III recalls are not serious",
      "Quarantine the returned recalled product, document the lot and return, and replace with non-recalled inventory per recall and pharmacy policy",
      "Restock the returned bottle if the seal is intact",
      "Tell the patient to discard the product at home without pharmacy involvement"
    ),
    "Quarantine the returned recalled product, document the lot and return, and replace with non-recalled inventory per recall and pharmacy policy",
    `All FDA recall classes require quarantine, documentation, and proper replacement procedures — Class III does not waive accountability. Restocking returned recalled units or undocumented home disposal fails recall tracking and professional duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [FDA],
      tags: ["FDA-recall", "Class-III", "returns", "documentation", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "All recall classes require quarantine and documentation — Class III does not waive tracking.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 67-year-old patient calls after learning a voluntary manufacturer market withdrawal was announced for a specific extended-release tablet lot due to dissolution variability. The patient took the product for two weeks and asks whether they need medical follow-up.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the patient no action is needed because market withdrawals are optional",
      "Counsel on the withdrawal, review patient records for affected lot dispensing, advise prescriber follow-up as clinically indicated, and quarantine remaining affected inventory",
      "Continue dispensing the same lot until official FDA Class I designation",
      "Discourage prescriber contact to avoid alarm"
    ),
    "Counsel on the withdrawal, review patient records for affected lot dispensing, advise prescriber follow-up as clinically indicated, and quarantine remaining affected inventory",
    `Market withdrawals and safety alerts require patient counseling, record review, prescriber follow-up when indicated, and inventory quarantine — not passive dismissal, continued dispensing of affected lots, or discouraging medical contact.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["FDA-recall", "market-withdrawal", "patient-counseling", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 51-year-old compounding pharmacist learns that a bulk chemical lot used in non-sterile preparations was added to an FDA recall list for particulate contamination. Finished compounded units from that lot remain in the will-call bin.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue dispensing finished units because compounding transforms the ingredient",
      "Quarantine affected bulk chemical and finished compounded products from the recalled lot, stop dispensing, notify affected patients, and follow recall and board reporting requirements",
      "Use the remaining bulk chemical for new batches after visual inspection",
      "Discard bulk chemical silently without patient notification"
    ),
    "Quarantine affected bulk chemical and finished compounded products from the recalled lot, stop dispensing, notify affected patients, and follow recall and board reporting requirements",
    `Recalled compounding ingredients require quarantine of bulk and finished products, cessation of dispensing, and patient notification — not assumption that compounding eliminates hazard, visual-only reuse, or silent discard without patient contact.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA],
      tags: ["FDA-recall", "compounding", "quarantine", "patient-notification", ...PE],
    }
  ),

  // ── Immunization Adverse Events (3) ───────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 45-year-old patient receives a shingles vaccine and faints within two minutes, striking their head on a chair. The pharmacist has epinephrine available but the patient is awake with a scalp laceration and normal breathing.`,
    "What is the pharmacist's most appropriate immediate action?",
    opts4(
      "Send the patient home because syncope is benign and requires no follow-up",
      "Provide immediate care per protocol including injury assessment, EMS activation if indicated, post-vaccination monitoring, and documentation with adverse event reporting as required",
      "Administer epinephrine IM to every syncope patient regardless of symptoms",
      "Document the event only if the patient returns the next day"
    ),
    "Provide immediate care per protocol including injury assessment, EMS activation if indicated, post-vaccination monitoring, and documentation with adverse event reporting as required",
    `Post-vaccination syncope with injury requires immediate assessment, appropriate emergency response, monitoring, and adverse event documentation and reporting — not dismissal, universal epinephrine without indication, or delayed documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["immunization", "adverse-event", "syncope", "VAERS", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Post-vaccination syncope with injury requires assessment, monitoring, and adverse event reporting.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old patient received an influenza vaccine three days ago at the pharmacy. The patient now reports persistent high fever, diffuse rash, and joint pain and asks whether these symptoms require reporting.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the patient delayed symptoms are never reportable because vaccination is complete",
      "Assess severity, advise appropriate medical evaluation, document the interaction, and report to VAERS and applicable state requirements when indicated",
      "Administer a second influenza dose to complete immunity",
      "Refer the patient only to the vaccine manufacturer and take no pharmacy documentation"
    ),
    "Assess severity, advise appropriate medical evaluation, document the interaction, and report to VAERS and applicable state requirements when indicated",
    `Delayed post-vaccination adverse events may require medical evaluation and VAERS reporting when indicated — not blanket non-reportability, additional dosing, or manufacturer-only referral without pharmacy documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["immunization", "adverse-event", "VAERS", "delayed-reaction", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 38-year-old patient develops localized swelling and warmth at the injection site six hours after a pneumococcal vaccine. The patient denies systemic symptoms. The pharmacist must decide monitoring and documentation obligations.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Document the local reaction, provide appropriate counseling on expected versus concerning symptoms, and report to VAERS if criteria for reportable events are met",
      "Ignore local reactions because only anaphylaxis is reportable",
      "Prescribe oral antibiotics without prescriber involvement",
      "Administer epinephrine for all injection-site swelling"
    ),
    "Document the local reaction, provide appropriate counseling on expected versus concerning symptoms, and report to VAERS if criteria for reportable events are met",
    `Local injection-site reactions require documentation, patient counseling, and VAERS reporting when reportable event criteria are met — not dismissal of all local reactions, independent antibiotic prescribing, or universal epinephrine.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["immunization", "adverse-event", "local-reaction", "VAERS", ...PE],
    }
  ),

  // ── EPCS Fraud / Red Flags (3) ────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 41-year-old patient presents an EPCS prescription for oxycodone 30 mg tablets, quantity 180, from an out-of-state prescriber. The EPCS audit log shows the prescription was signed at 2:14 a.m. on a Sunday. The patient lives locally and has no documented pain specialty relationship.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because EPCS authentication guarantees validity",
      "Withhold dispensing, verify prescriber legitimacy and patient relationship through EPCS records and direct contact, query PDMP, and resolve red flags before dispensing",
      "Dispense a 30-day supply to reduce risk while investigating",
      "Accept a patient-provided screenshot of the e-prescription as sufficient proof"
    ),
    "Withhold dispensing, verify prescriber legitimacy and patient relationship through EPCS records and direct contact, query PDMP, and resolve red flags before dispensing",
    `EPCS authentication does not eliminate corresponding-responsibility red flags such as unusual quantity, timing, and out-of-state prescribers. Pharmacists must verify and resolve concerns before dispensing — not partial dispensing or screenshot substitutes.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA, EPCS],
      tags: ["EPCS", "red-flags", "corresponding-responsibility", "PDMP", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "EPCS does not waive red-flag verification — unusual quantity, timing, and prescriber patterns require resolution before dispensing.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old pharmacy receives three EPCS Schedule IV benzodiazepine prescriptions within one hour for different patient names but identical home addresses, phone numbers, and payment methods. All prescriptions originate from the same out-of-state telehealth prescriber.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense all three because each prescription is individually transmitted through EPCS",
      "Withhold dispensing, investigate potential diversion or fraud patterns, verify prescriber and patient identity, query PDMP, and report suspected fraud if confirmed",
      "Dispense only one prescription and discard the others silently",
      "Bill all three as cash to avoid payer scrutiny"
    ),
    "Withhold dispensing, investigate potential diversion or fraud patterns, verify prescriber and patient identity, query PDMP, and report suspected fraud if confirmed",
    `Clustered EPCS orders with shared identifiers and telehealth prescribers are diversion red flags requiring investigation, PDMP review, and fraud reporting when confirmed — not automatic dispensing, silent partial release, or cash-only evasion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA, EPCS],
      tags: ["EPCS", "red-flags", "diversion", "fraud", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 55-year-old patient requests early refill of an EPCS hydrocodone prescription. The pharmacy EPCS system shows the prescriber's digital certificate expired two days before the transmission date, but the prescription displays a valid two-factor authentication stamp in the patient portal printout.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense based on the patient portal printout because it shows authentication",
      "Withhold dispensing until prescriber and EPCS validity are verified through the certified system; do not rely on patient printouts with expired credentials",
      "Convert the order to a verbal refill because the patient is in pain",
      "Dispense half the quantity to reduce liability"
    ),
    "Withhold dispensing until prescriber and EPCS validity are verified through the certified system; do not rely on patient printouts with expired credentials",
    `Expired prescriber digital certificates invalidate EPCS integrity. Pharmacists must verify through certified systems — not patient printouts, verbal refills, or arbitrary partial dispensing when credential validity is in question.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA, EPCS],
      tags: ["EPCS", "red-flags", "digital-certificate", "authentication", ...PE],
    }
  ),

  // ── Workers' Compensation Billing (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old injured worker presents a workers' compensation prescription for brand-name celecoxib 200 mg when the payer formulary mandates generic substitution unless documented medical necessity. No DAW or medical necessity documentation is present.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill brand as written because the prescriber selected the product",
      "Verify workers' comp formulary requirements, contact the prescriber for generic substitution or medical necessity documentation, and document billing resolution before dispensing",
      "Bill the prescription to the patient's commercial insurance instead",
      "Dispense generic but label and bill as brand for formulary compliance"
    ),
    "Verify workers' comp formulary requirements, contact the prescriber for generic substitution or medical necessity documentation, and document billing resolution before dispensing",
    `Workers' compensation formularies often mandate generic substitution unless medical necessity is documented. Pharmacists must verify payer rules and obtain documentation — not brand-only billing, insurance crossover, or mislabeling.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "billing", "formulary", "generic-substitution", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Workers' comp formularies may mandate generic substitution — verify payer rules and obtain medical necessity documentation when required.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old patient injured at work presents a valid workers' compensation prescription but asks the pharmacist to bill it to commercial insurance because the workers' comp claim is pending and the copay is lower.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill commercial insurance as requested to help the patient save money",
      "Bill the claim appropriately to workers' compensation when the prescription is for a work-related injury, document billing accurately, and explain payer rules to the patient",
      "Dispense without billing any payer to avoid conflict",
      "Bill both workers' comp and commercial insurance for the same fill"
    ),
    "Bill the claim appropriately to workers' compensation when the prescription is for a work-related injury, document billing accurately, and explain payer rules to the patient",
    `Work-related injury prescriptions must be billed to the appropriate workers' compensation payer when applicable — not commercial insurance substitution for copay savings, unbilled dispensing, or dual billing of the same fill.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "billing", "payer-rules", "fraud-prevention", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old injured worker presents a workers' compensation prescription for a compounded topical pain cream with a claim number. The payer requires prior authorization and specific injury-date documentation before coverage. The prescription lacks both.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill workers' comp immediately because the claim number is present",
      "Verify payer prior authorization and injury-date requirements, contact prescriber or payer as needed, and document resolution attempts before release",
      "Compound and dispense as cash-only without attempting authorization",
      "Bill Medicare Part D because the patient is over 55"
    ),
    "Verify payer prior authorization and injury-date requirements, contact prescriber or payer as needed, and document resolution attempts before release",
    `Workers' compensation compounded claims often require prior authorization and injury documentation beyond claim numbers. Pharmacists must verify payer requirements and document resolution — not claim-number-only billing, cash evasion, or improper Medicare crossover.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "billing", "prior-authorization", "compounding", ...PE],
    }
  ),

  // ── Illinois (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient requests an influenza vaccine at a Chicago pharmacy. The pharmacist completed Illinois-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Illinois protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Illinois protocol requirements",
    `Illinois authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Illinois access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IL",
      difficulty: 2,
      references: [IL_REF],
      tags: ["illinois", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient in Springfield picks up a new prescription at a community pharmacy. Illinois aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Illinois community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IL",
      difficulty: 2,
      references: [IL_REF],
      tags: ["illinois", "offer-to-counsel", ...PE],
    }
  ),

  // ── Michigan (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient requests a pneumococcal vaccine at a Detroit pharmacy. The pharmacist completed Michigan-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Michigan protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Michigan protocol requirements",
    `Michigan authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MI",
      difficulty: 2,
      references: [MI_REF],
      tags: ["michigan", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 71-year-old patient in Ann Arbor picks up a new prescription at a community pharmacy. Michigan aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Michigan community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MI",
      difficulty: 2,
      references: [MI_REF],
      tags: ["michigan", "offer-to-counsel", ...PE],
    }
  ),

  // ── Ohio (2) ──────────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 46-year-old pharmacist licensed in Kentucky begins dispensing at a Columbus community pharmacy before obtaining an Ohio pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Ohio licensure?",
    opts4(
      "Continue dispensing under the Kentucky license until Ohio approves",
      "Obtain an Ohio pharmacist license before practicing in the state",
      "Register with DEA only and defer Ohio board licensure",
      "Work as a pharmacy intern indefinitely without Ohio licensure"
    ),
    "Obtain an Ohio pharmacist license before practicing in the state",
    `Ohio requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Ohio pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OH",
      difficulty: 2,
      references: [OH_REF],
      tags: ["ohio", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 58-year-old patient in Cleveland picks up a new prescription at a community pharmacy. Ohio aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Ohio community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OH",
      difficulty: 2,
      references: [OH_REF],
      tags: ["ohio", "offer-to-counsel", ...PE],
    }
  ),
];
