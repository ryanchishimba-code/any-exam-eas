/**
 * Curated MPJE-style items — physician-educator batch 05.
 * Topics: partial fills/LTC/hospice, prescription validity, immunizations, GA/PA/NJ depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-05";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const GA_REF = { label: "Georgia Pharmacy Practice Act", citation: "O.C.G.A. § 26-4-1; Ga. BOP rules" };
const PA_REF = { label: "Pennsylvania Pharmacy Act / PDMP", citation: "63 P.S. § 390-8; PA PDMP Act" };
const NJ_REF = { label: "New Jersey Pharmacy Practice Act", citation: "N.J.S.A. 45:14-23 et seq." };

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_05: EnrichedBankItem[] = [
  // ── Partial Fills / LTC / Hospice (4) ───────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 74-year-old terminally ill home hospice patient presents a written prescription for morphine sulfate immediate-release 15 mg tablets, quantity 120. The prescriber wrote "partial fills permitted — hospice." The patient requests a 14-day supply today. The prescription is dated today.`,
    "What is the pharmacist's most appropriate action under federal Schedule II partial-fill rules?",
    opts4(
      "Dispense the full quantity and decline the patient's request for a partial supply",
      "Dispense a partial quantity, record the partial fill on the prescription and in pharmacy records, and dispense the balance within 60 days if still needed",
      "Dispense 30 tablets now and require a new prescription for any remaining balance regardless of timeframe",
      "Contact the DEA before any partial fill of a Schedule II opioid regardless of patient status"
    ),
    "Dispense a partial quantity, record the partial fill on the prescription and in pharmacy records, and dispense the balance within 60 days if still needed",
    `21 CFR § 1306.13 permits partial filling of Schedule II prescriptions for terminally ill or LTCF patients when the prescriber notes partial fills are allowed. The pharmacist must document "partial fill" and complete the balance within 60 days of the date written. Full-only dispensing ignores permitted federal flexibility; a new Rx is not required for the balance when criteria are met. DEA pre-authorization is not required.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "partial-fill", "hospice", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "C-II partial fills for terminally ill/LTC patients require prescriber notation, documentation, and balance completion within 60 days.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: An 82-year-old nursing home resident has a valid written prescription for oxycodone 5 mg tablets, quantity 60, with prescriber notation "LTCF — partial fills allowed." The facility nurse requests only a 7-day supply because the patient is being discharged to hospice tomorrow.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because Schedule II prescriptions must always be filled in full at one time",
      "Dispense the requested partial quantity, document the partial fill, and retain the prescription for any remaining authorized quantity within federal time limits",
      "Destroy the prescription after the partial fill and require a new order for hospice",
      "Allow the nurse to pick up the balance without pharmacist involvement"
    ),
    "Dispense the requested partial quantity, document the partial fill, and retain the prescription for any remaining authorized quantity within federal time limits",
    `Long-term care facility patients qualify for Schedule II partial fills when the prescriber authorizes partial dispensing. Pharmacists must document partial fills on the prescription and in records and may dispense the balance within 60 days. Full-fill-only and prescription destruction misapply § 1306.13. Balance release requires pharmacist accountability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "partial-fill", "LTC", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 68-year-old hospice patient received a partial fill of fentanyl transdermal patches 25 mcg/hr from a valid C-II prescription 45 days ago. The prescriber's original order authorized partial fills for hospice. The patient now needs the remaining patches.`,
    "What is the pharmacist's most appropriate action regarding the remaining quantity?",
    opts4(
      "Dispense the balance if within 60 days of the date written and the original partial-fill criteria still apply",
      "Dispense the balance at any time because hospice patients have unlimited partial-fill windows",
      "Require a new C-II prescription because 21 days have passed since the date written",
      "Transfer the remaining quantity to another pharmacy without documentation"
    ),
    "Dispense the balance if within 60 days of the date written and the original partial-fill criteria still apply",
    `For qualifying terminally ill/LTC partial fills, the remaining portion of a Schedule II prescription may be dispensed within 60 days of the date written — not the 21-day initial dispensing rule for standard C-II orders. Unlimited windows and C-II transfers are incorrect. After 60 days, no further dispensing is allowed on that prescription.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "partial-fill", "hospice", "fentanyl", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 59-year-old patient on chronic gabapentin therapy requests a partial fill of a 90-day non-controlled prescription because of a planned vacation. The prescription is valid and refills remain. State law follows common partial-fill practices for non-controlled medications when documented.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse any partial fill of non-controlled prescriptions regardless of patient request",
      "Dispense the requested partial quantity if permitted by state law and pharmacy policy, document the partial fill, and retain the balance on the prescription",
      "Dispense the full 90-day supply and tell the patient to discard unused medication",
      "Create a new prescription without prescriber authorization to split the supply"
    ),
    "Dispense the requested partial quantity if permitted by state law and pharmacy policy, document the partial fill, and retain the balance on the prescription",
    `Non-controlled partial fills are generally permitted under many state practice acts when documented, unlike the strict federal C-II framework. Pharmacists should follow state rules, document quantity dispensed, and maintain the remaining authorized amount. Blanket refusal, forced full fills, or unauthorized new prescriptions violate professional and legal standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["partial-fill", "non-controlled", ...PE],
    }
  ),

  // ── Prescription Validity (4) ───────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 47-year-old patient presents a handwritten prescription for amoxicillin 500 mg capsules. The drug, strength, quantity, directions, and prescriber signature are present, but the prescription lacks a date.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense and add today's date in the pharmacy computer only",
      "Contact the prescriber to obtain the missing date or a corrected prescription before dispensing",
      "Dispense because the date is optional for non-controlled antibiotics",
      "Ask the patient to write in the date they remember"
    ),
    "Contact the prescriber to obtain the missing date or a corrected prescription before dispensing",
    `A valid prescription generally requires a date of issuance under uniform MPJE and state practice standards. Pharmacists cannot unilaterally invent dates or accept patient-written dates. Missing elements require prescriber clarification before dispensing to ensure validity and record integrity.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["prescription-validity", "required-elements", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Missing prescription elements (including date) require prescriber clarification — never dispense with pharmacist- or patient-added dates.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 55-year-old patient presents a written prescription for Adderall 20 mg tablets, quantity 60, dated 25 days ago. The prescription has never been partially filled. The patient states they were traveling and could not fill it sooner.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the full quantity because the patient provides a reasonable explanation",
      "Refuse to fill because more than 21 days have passed since the date written for this Schedule II prescription",
      "Partially fill 30 tablets and annotate the rest for later pickup within 60 days",
      "Contact the DEA for permission to fill late C-II prescriptions"
    ),
    "Refuse to fill because more than 21 days have passed since the date written for this Schedule II prescription",
    `Federal rules require Schedule II prescriptions to be dispensed within 21 days of the date written (for standard orders). A prescription dated 25 days ago is expired for initial dispensing. Patient travel explanations do not extend the federal window. Partial-fill 60-day rules apply only to qualifying LTC/hospice orders with prescriber notation — not standard C-II orders.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-II", "prescription-validity", "21-day-rule", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 43-year-old patient presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg from a clinic prescriber. The pharmacist's verification shows the prescriber's DEA registration expired last month according to the DEA registry.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the prescription was written before expiration",
      "Refuse to dispense controlled substances until valid prescriber DEA registration is confirmed",
      "Dispense a 3-day supply while waiting for renewal",
      "Accept the prescription if the patient has filled from this prescriber previously"
    ),
    "Refuse to dispense controlled substances until valid prescriber DEA registration is confirmed",
    `Controlled substances may be prescribed only by registrants with valid DEA registration at the time of prescribing and dispensing. Expired DEA registration invalidates the prescriber's authority for CS dispensing. Prior fill history and arbitrary short supplies do not cure invalid registration.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["DEA", "prescriber-validity", "corresponding-responsibility", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 36-year-old patient needs an antibiotic tonight after a telehealth visit. The prescriber calls in an oral emergency prescription for a non-controlled medication to the pharmacy. State law permits emergency oral orders with documentation and written/electronic follow-up within the allowed timeframe.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse all oral prescriptions because only electronic orders are valid",
      "Accept the oral order with required documentation, dispense a limited quantity if permitted, and obtain written or electronic follow-up within the required timeframe",
      "Dispense a 90-day supply without records if the prescriber is well known",
      "Allow the technician to accept the order without pharmacist involvement"
    ),
    "Accept the oral order with required documentation, dispense a limited quantity if permitted, and obtain written or electronic follow-up within the required timeframe",
    `Emergency oral prescriptions for non-controlled drugs are permitted in many jurisdictions with pharmacist documentation, quantity limits, and prescriber follow-up within defined timeframes. Blanket refusal, excessive quantity without records, and technician-only acceptance violate typical state and professional requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-prescription", "oral-order", "prescription-validity", ...PE],
    }
  ),

  // ── Immunizations (4) ─────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 65-year-old patient requests a herpes zoster vaccine at a community pharmacy. The pharmacist completed board-approved immunization training two years ago, but the pharmacy's standing protocol expired last month and has not been renewed.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine because prior training never expires",
      "Do not administer until a current protocol or authorization meeting state requirements is in place",
      "Allow a certified technician to administer the vaccine while the pharmacist verifies inventory",
      "Administer if the patient signs a waiver replacing protocol requirements"
    ),
    "Do not administer until a current protocol or authorization meeting state requirements is in place",
    `Pharmacist immunization authority in most states requires board-approved training plus a current protocol, standing order, or prescriber authorization. Expired protocols do not authorize vaccination. Technicians cannot independently administer vaccines. Patient waivers do not replace statutory protocol requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["immunization", "protocol", "vaccine", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Pharmacist immunizations require valid training plus current protocol/authorization — expired protocols block administration.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient receives an influenza vaccine from a pharmacist. Within five minutes the patient reports throat tightness and hives. The pharmacist has epinephrine and emergency protocol available on site.`,
    "What is the pharmacist's most appropriate immediate action?",
    opts4(
      "Send the patient home to monitor because mild reactions are expected",
      "Activate emergency response per protocol, assess and treat the reaction, and document and report the adverse event as required",
      "Administer a second vaccine dose to complete the series",
      "Document the reaction only if the patient returns the next day"
    ),
    "Activate emergency response per protocol, assess and treat the reaction, and document and report the adverse event as required",
    `Suspected anaphylaxis after vaccination requires immediate emergency management per immunization protocol, including epinephrine when indicated, EMS activation if needed, and documentation/reporting to VAERS and applicable state requirements. Dismissal, additional dosing, or delayed documentation endanger patient safety and violate immunization standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["immunization", "adverse-event", "anaphylaxis", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 42-year-old pharmacy technician discovers that the refrigerator storing vaccines dipped above 8°C overnight during a power outage. Several influenza and pneumococcal vaccine doses were exposed.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccines immediately before they expire further",
      "Quarantine affected vaccines, follow manufacturer and CDC cold-chain guidance, and do not administer until viability is confirmed or doses are discarded per policy",
      "Return the vaccines to the wholesaler without documentation",
      "Move the vaccines to the freezer to compensate for the warm excursion"
    ),
    "Quarantine affected vaccines, follow manufacturer and CDC cold-chain guidance, and do not administer until viability is confirmed or doses are discarded per policy",
    `Vaccine cold-chain breaches require quarantine, temperature monitoring review, and manufacturer/CDC guidance before use. Administering potentially compromised vaccines, undocumented returns, or improper freezing violate immunization storage standards and patient safety obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["immunization", "cold-chain", "vaccine-storage", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 19-year-old college student requests a meningococcal ACWY vaccine at a pharmacy in a state that allows pharmacist administration under protocol. The pharmacist is trained and the protocol is current, but the student has no insurance card today.`,
    "What is the pharmacist's most appropriate action regarding immunization eligibility?",
    opts4(
      "Refuse all vaccines without insurance regardless of state protocol",
      "Evaluate protocol eligibility, screen for contraindications, obtain required consent, and administer if state protocol and clinical criteria are met",
      "Allow the technician to screen and inject without pharmacist presence",
      "Administer only if the student brings a physician's prescription for every vaccine dose"
    ),
    "Evaluate protocol eligibility, screen for contraindications, obtain required consent, and administer if state protocol and clinical criteria are met",
    `Pharmacist-administered vaccines under standing protocol do not universally require a separate physician prescription or insurance card at time of service. Pharmacists must follow protocol eligibility, screening, consent, and documentation requirements. Technicians cannot independently administer. Insurance absence alone does not bar lawful protocol-based vaccination.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["immunization", "protocol", "meningococcal", ...PE],
    }
  ),

  // ── Georgia (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Atlanta presents a new prescription for oxycodone 10 mg tablets. Georgia requires PDMP (GRx) review before dispensing applicable controlled substances. The pharmacist has not queried the system.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Georgia PDMP (GRx), document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with no prior fills at this pharmacy",
      "Query PDMP only for Schedule II drugs, not oxycodone combinations",
      "Delegate PDMP review and dispensing to the technician on duty"
    ),
    "Query the Georgia PDMP (GRx), document the review, and apply corresponding-responsibility judgment",
    `Georgia requires pharmacists to access and document PDMP (GRx) review as part of corresponding responsibility before dispensing controlled substances. New-to-pharmacy status does not waive monitoring. Oxycodone is a controlled substance subject to PDMP rules. Technicians cannot perform final CS dispensing decisions.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "GA",
      difficulty: 3,
      references: [GA_REF],
      tags: ["georgia", "PDMP", "GRx", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 64-year-old patient in Savannah needs an emergency oral non-controlled prescription after hours when the prescriber's office is closed. Georgia permits limited emergency oral orders with documentation and follow-up requirements.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Document the oral order with required elements and obtain written or electronic follow-up within the permitted Georgia timeframe",
      "Refuse all oral prescriptions in Georgia regardless of circumstance",
      "Dispense a one-year supply without prescriber follow-up",
      "Require the patient to wait until the prescriber mails a paper prescription"
    ),
    "Document the oral order with required elements and obtain written or electronic follow-up within the permitted Georgia timeframe",
    `Georgia allows emergency oral prescriptions for non-controlled medications with pharmacist documentation, limited quantities, and prescriber hard copy or electronic follow-up within board-defined timeframes. Blanket refusal ignores authorized emergency access. Excessive supply without follow-up violates dispensing rules.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "GA",
      difficulty: 3,
      references: [GA_REF],
      tags: ["georgia", "emergency-prescription", "oral-order", ...PE],
    }
  ),

  // ── Pennsylvania (2) ──────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 56-year-old pharmacist is designated PIC at a Pittsburgh chain pharmacy. A district manager who is not a pharmacist instructs the PIC to sign controlled-substance invoices and delegate all DUR to technicians to improve metrics.`,
    "What is the pharmacist's most appropriate action as Pennsylvania PIC?",
    opts4(
      "Delegate CS accountability and DUR to technicians per corporate metrics",
      "Maintain pharmacist responsibility for controlled-substance accountability and clinical review; technicians remain within board-defined scope",
      "Resign as PIC but continue signing CS documents unofficially",
      "Close the pharmacy permanently to avoid board scrutiny"
    ),
    "Maintain pharmacist responsibility for controlled-substance accountability and clinical review; technicians remain within board-defined scope",
    `The Pennsylvania PIC ensures compliance with the Pharmacy Act and board rules. Controlled substance ordering/receiving accountability and DUR remain pharmacist responsibilities and cannot be delegated to technicians or non-pharmacist managers. Unofficial signing or closure to evade duties violates professional and legal obligations.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 3,
      references: [PA_REF],
      tags: ["pennsylvania", "PIC", "technician-scope", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 71-year-old patient requests a pneumococcal vaccine at a Philadelphia pharmacy. The pharmacist completed Pennsylvania-required immunization training and the store operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Pennsylvania protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist counts inventory",
      "Require a new written prescription for each vaccine despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Pennsylvania protocol requirements",
    `Pennsylvania authorizes pharmacist-administered immunizations under board-approved training and protocol/prescriber oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid standing protocols may authorize vaccination without a separate Rx per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 2,
      references: [PA_REF],
      tags: ["pennsylvania", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── New Jersey (2) ────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 44-year-old patient in Newark presents a prescription lacking the prescriber's address on the order. All other elements appear valid for a non-controlled medication under New Jersey dispensing standards.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because address is never required on any prescription",
      "Contact the prescriber or obtain required missing elements per New Jersey and uniform validity standards before dispensing",
      "Add a nearby address independently to complete the record",
      "Refuse all future prescriptions from the prescriber permanently"
    ),
    "Contact the prescriber or obtain required missing elements per New Jersey and uniform validity standards before dispensing",
    `Prescription validity under New Jersey and uniform MPJE patterns requires core prescriber identification elements, often including address depending on jurisdiction and order type. Pharmacists must clarify missing elements with the prescriber — not invent data or impose permanent bans for correctable deficiencies.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 3,
      references: [NJ_REF],
      tags: ["new-jersey", "prescription-validity", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old patient requests a shingles vaccine at a Jersey City pharmacy. The pharmacist holds valid New Jersey immunization training and the pharmacy has a current protocol. The patient asks whether a technician can give the injection to shorten wait time.`,
    "What is the pharmacist's most appropriate response?",
    opts4(
      "Allow technician administration if the pharmacist is in the building",
      "Administer the vaccine as a pharmacist-only function under New Jersey immunization authority and protocol",
      "Refuse all vaccines in community pharmacy settings",
      "Require hospital referral for every adult vaccine"
    ),
    "Administer the vaccine as a pharmacist-only function under New Jersey immunization authority and protocol",
    `New Jersey pharmacist immunization authority requires pharmacist administration under approved training and protocol; vaccine injection is not within technician scope even with pharmacist on site. Community pharmacy vaccination is authorized when protocol requirements are met. Universal hospital referral misstates New Jersey access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 2,
      references: [NJ_REF],
      tags: ["new-jersey", "immunization", "technician-scope", ...PE],
    }
  ),
];
