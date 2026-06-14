/**
 * Curated MPJE-style items — physician-educator batch 17.
 * Topics: FDA 503A office-use, prescription expiration dating, social media/marketing,
 * DUR documentation, DE/RI/VT state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-17";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const FDA503A = { label: "FDA Section 503A Compounding", url: "https://www.fda.gov/drugs" };
const FTC = {
  label: "FTC Advertising / Marketing Standards",
  url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
};
const DE_REF = {
  label: "Delaware Pharmacy Act",
  citation: "24 Del. C. § 2501 et seq.",
};
const RI_REF = {
  label: "Rhode Island Pharmacy Act",
  citation: "R.I. Gen. Laws § 5-19.1 et seq.",
};
const VT_REF = {
  label: "Vermont Pharmacy Laws",
  citation: "26 V.S.A. § 2021 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_17: EnrichedBankItem[] = [
  // ── FDA 503A Office-Use (3) ───────────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 48-year-old physician requests 150 unit-dose non-sterile capsules of a hormone preparation for in-office administration without patient-specific prescriptions. The community pharmacist proposes batch compounding under FDA 503A for physician office stock.`,
    "What is the pharmacist's most appropriate action under federal 503A compounding law?",
    opts4(
      "Compound unlimited office stock because USP <795> applies to all non-sterile compounding",
      "Evaluate whether the order complies with FDA 503A patient-specific requirements and applicable state office-use rules before compounding",
      "Proceed if the physician agrees to keep the stock in the clinic refrigerator",
      "Label the product as a dietary supplement to avoid drug compounding rules"
    ),
    "Evaluate whether the order complies with FDA 503A patient-specific requirements and applicable state office-use rules before compounding",
    `503A traditional compounding generally requires patient-specific prescriptions; office-use batch compounding is restricted under federal law and varies by state. Storage location and dietary supplement mislabeling do not waive 503A limits.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["503A", "office-use", "compounding", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "503A office-use compounding requires compliance with patient-specific and state office-use limits.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 55-year-old prescriber in a neighboring state orders patient-specific 503A compounded topical preparations to be shipped in bulk to their clinic for unnamed future patients. The pharmacist notes interstate distribution of office stock.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ship interstate under 503A because the prescriber is licensed",
      "Determine that large-batch interstate office-use distribution likely exceeds 503A limits and may require 503B or other lawful pathways",
      "Ship if each jar is labeled with the prescriber's name only",
      "Ship as OTC cosmetic products to avoid compounding oversight"
    ),
    "Determine that large-batch interstate office-use distribution likely exceeds 503A limits and may require 503B or other lawful pathways",
    `503A compounding limits interstate distribution and generally requires patient-specific prescriptions — not prescriber licensure alone, prescriber-only labeling, or cosmetic misbranding.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA503A],
      tags: ["503A", "office-use", "interstate", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 42-year-old compounding pharmacy prepares the same non-sterile formulation as patient-specific prescriptions in the morning and as unlabeled office-use syringes for a local clinic in the afternoon using shared equipment without line clearance.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue shared production because the formulation is identical",
      "Segregate patient-specific and office-use compounding workflows, ensure lawful authorization for each type, and maintain separate labeling and records per 503A and USP <795>",
      "Label all units as office-use to simplify inventory",
      "Skip master formulation records for office-use batches"
    ),
    "Segregate patient-specific and office-use compounding workflows, ensure lawful authorization for each type, and maintain separate labeling and records per 503A and USP <795>",
    `Patient-specific and office-use compounding require lawful authorization, distinct labeling, and complete records — not commingled workflows, blanket office-use relabeling, or omitted documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["503A", "office-use", "USP-795", "documentation", ...PE],
    }
  ),

  // ── Prescription Expiration Dating (3) ────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 59-year-old patient presents a written prescription for oxycodone 10 mg tablets, quantity 60, dated 19 days ago with no partial fills. The patient delayed starting post-operative pain therapy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the prescription is within 21 days of the date written",
      "Refuse to fill because the prescription will exceed the 21-day federal dispensing window before completion",
      "Dispense a 7-day supply and annotate the balance for later",
      "Accept a verbal extension from the patient's family member"
    ),
    "Dispense because the prescription is within 21 days of the date written",
    `Schedule II written prescriptions generally must be dispensed within 21 days of the date written. A prescription dated 19 days ago remains valid for dispensing if other validity elements are met. Partial annotation does not extend expired orders; verbal extensions are invalid.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescription-validity", "C-II", "expiration", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "C-II written prescriptions must be dispensed within 21 days of the date written.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient requests the fifth refill on a tramadol 50 mg tablet prescription (Schedule IV) dated seven months ago. The prescription authorized five refills within six months of the date written.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the fifth refill because refills remain on the original prescription",
      "Refuse the refill because Schedule III–V refills must be dispensed within six months of the date written",
      "Dispense if the patient pays cash",
      "Transfer the prescription to another pharmacy to obtain the refill"
    ),
    "Refuse the refill because Schedule III–V refills must be dispensed within six months of the date written",
    `Federal law limits C-III–V refills to six months from the date written. Remaining authorized refills do not extend beyond that window. Cash payment or transfer does not revive expired refill authority.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescription-validity", "C-IV", "refills", "expiration", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient presents a non-controlled prescription for prednisone 10 mg tablets dated four months ago. The prescriber wrote "Do not fill after 90 days" on the face of the prescription.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because non-controlled prescriptions never expire",
      "Refuse to dispense because the prescriber's explicit beyond-use date on the prescription has passed",
      "Dispense a 7-day supply without contacting the prescriber",
      "Dispense if the patient signs a waiver of expiration"
    ),
    "Refuse to dispense because the prescriber's explicit beyond-use date on the prescription has passed",
    `Prescriber-specified "do not fill after" dates limit validity even for non-controlled drugs. Patient waivers and arbitrary short supplies without prescriber authorization do not override explicit prescription expiration notations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["prescription-validity", "expiration", "non-controlled", ...PE],
    }
  ),

  // ── Social Media / Marketing Compliance (3) ─────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 38-year-old pharmacy marketing coordinator posts a before-and-after photo of a patient's acne treatment on the store's social media account with the patient's first name and city visible. The patient did not sign a marketing release.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave the post online because the patient thanked the staff in store",
      "Remove the post and ensure future marketing uses proper patient authorization without identifiable PHI",
      "Blur only the patient's eyes and repost the same photo",
      "Ask followers to share the post to increase engagement"
    ),
    "Remove the post and ensure future marketing uses proper patient authorization without identifiable PHI",
    `Using identifiable patient images or PHI in marketing without authorization violates HIPAA and professional ethics. Partial de-identification and viral promotion do not cure unauthorized disclosure.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["social-media", "marketing", "HIPAA", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Marketing posts require patient authorization — identifiable PHI without consent violates HIPAA.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 46-year-old pharmacy owner asks staff to advertise on social media that the store sells a "FDA-approved miracle weight-loss compound" that is actually a non-FDA-evaluated dietary supplement blend compounded in-house.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Approve the claim because dietary supplements are always FDA-approved drugs",
      "Refuse false or misleading FDA approval claims and ensure advertising complies with FTC and FDA marketing rules",
      "Post the claim only on personal employee accounts, not the pharmacy page",
      "Add a small disclaimer in the comments after posting"
    ),
    "Refuse false or misleading FDA approval claims and ensure advertising complies with FTC and FDA marketing rules",
    `Misleading FDA approval claims for supplements or compounded products violate FTC/FDA advertising standards. Personal account posting and post-hoc disclaimers do not eliminate pharmacy accountability for false marketing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FTC, FDA503A],
      tags: ["social-media", "marketing", "false-claims", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 33-year-old technician posts internal screenshots of the pharmacy's discounted cash prices for controlled substances on a public forum to attract customers. The post includes prescriber names from the queue screen.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore the post because technicians manage social media independently",
      "Remove the unauthorized post, address workforce policy violations, and protect prescriber and patient information from public disclosure",
      "Repost the prices officially to compete with other pharmacies",
      "Discipline the technician but leave the post online for traffic"
    ),
    "Remove the unauthorized post, address workforce policy violations, and protect prescriber and patient information from public disclosure",
    `Unauthorized public disclosure of pricing tied to identifiable prescriber workflow information violates privacy and professional standards. Official adoption or leaving harmful posts online compounds the violation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["social-media", "marketing", "workforce", "HIPAA", ...PE],
    }
  ),

  // ── DUR Documentation (3) ─────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 64-year-old patient picks up a new clarithromycin prescription while taking simvastatin 40 mg daily. The computer flags a serious interaction. The pharmacist contacts the prescriber, who approves temporary simvastatin hold, but no note is placed on the prescription record.`,
    "What is the pharmacist's most appropriate action regarding DUR documentation?",
    opts4(
      "Dispense without documentation because the prescriber approved verbally",
      "Document the DUR alert, prescriber contact, intervention, and resolution on the prescription/patient record before dispensing",
      "Clear the alert permanently so it never appears again",
      "Ask the patient to document the prescriber call in a personal notebook only"
    ),
    "Document the DUR alert, prescriber contact, intervention, and resolution on the prescription/patient record before dispensing",
    `Prospective DUR requires documented intervention and resolution — verbal prescriber approval alone is insufficient. Permanent alert suppression and patient-only notes fail professional and legal documentation standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["DUR", "documentation", "drug-interaction", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "DUR interventions require documented alert, contact, and resolution — not verbal approval alone.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 58-year-old patient's profile shows duplicate angiotensin-pathway therapy after a new refill is entered. The pharmacist overrides the alert as a "false positive" without reviewing labs or contacting the prescriber because the patient is late for pickup.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Override and dispense without documentation to maintain workflow",
      "Review the clinical significance of the alert, contact the prescriber if warranted, and document override rationale or intervention before dispensing",
      "Permanently disable duplicate therapy alerts storewide",
      "Ask the technician to select the override reason at random"
    ),
    "Review the clinical significance of the alert, contact the prescriber if warranted, and document override rationale or intervention before dispensing",
    `DUR overrides require pharmacist clinical review and documented rationale — not silent overrides, global alert disablement, or technician random reason codes for clinically significant duplicate therapy.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["DUR", "documentation", "duplicate-therapy", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 71-year-old patient receives a new prescription for methotrexate weekly dosing. The profile flags active daily trimethoprim-sulfamethoxazole without documented DUR review on prior fills. The state board audit sample requests DUR documentation for the past 90 days.`,
    "What is the pharmacist's most appropriate action going forward?",
    opts4(
      "Create backdated DUR notes for the audit period",
      "Perform prospective DUR on the new prescription, document interaction review and prescriber resolution, and maintain contemporaneous DUR records per state and professional standards",
      "Refuse all audits because DUR is clinical judgment",
      "Disable methotrexate alerts to simplify future dispensing"
    ),
    "Perform prospective DUR on the new prescription, document interaction review and prescriber resolution, and maintain contemporaneous DUR records per state and professional standards",
    `Serious interaction pairs require contemporaneous DUR documentation — not backdated notes, audit refusal, or alert disablement. New prescriptions trigger fresh prospective review obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["DUR", "documentation", "audit", "methotrexate", ...PE],
    }
  ),

  // ── Delaware (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Wilmington presents a new prescription for oxycodone 10 mg tablets. Delaware requires pharmacists to query the Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Delaware PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Delaware PMP, document the review, and apply corresponding-responsibility judgment",
    `Delaware requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "DE",
      difficulty: 3,
      references: [DE_REF],
      tags: ["delaware", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 45-year-old pharmacist licensed in Pennsylvania begins dispensing at a Dover chain pharmacy before receiving a Delaware pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Delaware licensure?",
    opts4(
      "Continue dispensing under the Pennsylvania license until Delaware approves",
      "Obtain a Delaware pharmacist license before practicing in the state",
      "Register with DEA only and defer Delaware board licensure",
      "Work as a pharmacy intern indefinitely without Delaware licensure"
    ),
    "Obtain a Delaware pharmacist license before practicing in the state",
    `Delaware requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Delaware pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "DE",
      difficulty: 2,
      references: [DE_REF],
      tags: ["delaware", "licensure", ...PE],
    }
  ),

  // ── Rhode Island (2) ────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Providence presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Rhode Island requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Rhode Island PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the Rhode Island PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Rhode Island requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "RI",
      difficulty: 3,
      references: [RI_REF],
      tags: ["rhode-island", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Warwick picks up a new prescription at a community pharmacy. Rhode Island aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Rhode Island community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "RI",
      difficulty: 2,
      references: [RI_REF],
      tags: ["rhode-island", "offer-to-counsel", ...PE],
    }
  ),

  // ── Vermont (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Burlington presents a new prescription for alprazolam 0.5 mg tablets. Vermont requires Prescription Monitoring System (VMS) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Vermont Prescription Monitoring System, document the review, and apply corresponding-responsibility judgment",
      "Skip VMS because benzodiazepines are not monitored",
      "Query VMS only when the patient pays cash",
      "Delegate VMS review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the Vermont Prescription Monitoring System, document the review, and apply corresponding-responsibility judgment",
    `Vermont requires pharmacists to query and document VMS review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VT",
      difficulty: 3,
      references: [VT_REF],
      tags: ["vermont", "VMS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 54-year-old pharmacist relocates to Montpelier and begins dispensing at an independent pharmacy before receiving a Vermont pharmacist license, relying on an active New Hampshire license.`,
    "What is the pharmacist's most appropriate action regarding Vermont licensure?",
    opts4(
      "Continue dispensing under the New Hampshire license until Vermont renewal season",
      "Obtain a Vermont pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Vermont board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Vermont pharmacist license through the board before practicing in the state",
    `Vermont requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate Vermont pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "VT",
      difficulty: 2,
      references: [VT_REF],
      tags: ["vermont", "licensure", ...PE],
    }
  ),
];
