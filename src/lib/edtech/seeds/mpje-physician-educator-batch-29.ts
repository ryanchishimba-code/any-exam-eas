/**
 * Curated MPJE-style items — physician-educator batch 29.
 * Topics: USP <800> hazardous drug handling (deeper), pharmacist conscience/refusal,
 * partial-fill C-II LTC, mail-order/central fill liability, MN/WI/IN state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-29";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const USP800 = { label: "USP <800> Hazardous Drugs", citation: "USP-NF <800>" };
const MN_REF = {
  label: "Minnesota Pharmacy Practice Act",
  citation: "Minn. Stat. § 151 et seq.",
};
const WI_REF = {
  label: "Wisconsin Pharmacy Examining Board",
  citation: "Wis. Stat. § 450 et seq.",
};
const IN_REF = {
  label: "Indiana Pharmacy Practice Act",
  citation: "Ind. Code § 25-26 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_29: EnrichedBankItem[] = [
  // ── USP <800> Hazardous Drug Handling — Deeper (3) ───────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 47-year-old technician drops a bottle of oral methotrexate 2.5 mg tablets on the dispensing counter during counting. Several intact tablets scatter across the laminate surface near open patient counseling materials.`,
    "What is the pharmacist's most appropriate immediate action under USP <800> hazardous drug handling requirements?",
    opts4(
      "Sweep tablets into regular trash and continue dispensing without decontamination",
      "Follow hazardous drug spill procedures including PPE, containment, decontamination of the affected area, and proper waste disposal per USP <800>",
      "Allow the technician to finish counting from the same counter without cleaning",
      "Return scattered tablets to the stock bottle for future dispensing"
    ),
    "Follow hazardous drug spill procedures including PPE, containment, decontamination of the affected area, and proper waste disposal per USP <800>",
    `Oral antineoplastics such as methotrexate are hazardous drugs requiring spill containment, decontamination, and segregated waste — not routine trash disposal, uncleaned continued use, or returned contaminated stock.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "spill", "decontamination", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "HD spills require PPE, containment, decontamination, and proper waste disposal per USP <800>.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 34-year-old pregnant pharmacy technician routinely counts and bottles oral cyclophosphamide tablets. The PIC has not assessed whether reassignment or additional controls are needed under USP <800> reproductive risk policies.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue assignments unchanged because oral tablets are low risk",
      "Assess reproductive risk, consider reassignment or additional controls for pregnant or breastfeeding staff handling hazardous drugs per USP <800>",
      "Terminate the employee to avoid exposure liability",
      "Allow the technician to wear standard latex gloves only without further assessment"
    ),
    "Assess reproductive risk, consider reassignment or additional controls for pregnant or breastfeeding staff handling hazardous drugs per USP <800>",
    `USP <800> requires assessment of reproductive risk for personnel handling hazardous drugs, including reassignment or enhanced controls when indicated — not unchanged exposure, termination, or gloves alone without risk evaluation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "reproductive-risk", "personnel", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 61-year-old cancer patient receives home delivery of oral capecitabine tablets shipped in a standard non-insulated mailer with no hazardous drug labeling on the outer package. The delivery driver left the package on the porch in direct sunlight for six hours.`,
    "What is the pharmacist's most appropriate action regarding dispensing and delivery standards?",
    opts4(
      "Ship hazardous oral chemotherapy in standard mailers without special labeling because the patient signed for delivery",
      "Ensure hazardous drug shipments use appropriate containment, labeling, and delivery protocols per USP <800> and assess product integrity before patient use",
      "Instruct patients to discard all mail-order medications without pharmacist review",
      "Relabel outer packaging as vitamins to reduce theft concerns"
    ),
    "Ensure hazardous drug shipments use appropriate containment, labeling, and delivery protocols per USP <800> and assess product integrity before patient use",
    `Hazardous drug home delivery requires appropriate containment and labeling with integrity assessment after temperature or handling excursions — not unlabeled standard mailers, blanket patient discard without review, or misbranding.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP800],
      tags: ["USP-800", "hazardous-drug", "mail-order", "delivery", ...PE],
    }
  ),

  // ── Pharmacist Conscience / Refusal (3) ───────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 38-year-old patient presents a valid prescription for mifepristone in a state that permits pharmacist refusal on moral grounds when certain access requirements are met. Another pharmacist at the same store can dispense within 30 minutes. The objecting pharmacist asks whether personal refusal ends all professional duties.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse and provide no further assistance because moral objection ends all duties",
      "Decline to dispense personally but ensure timely patient access through another on-duty pharmacist or appropriate referral per state law",
      "Dispense despite personal objection because another pharmacist is available later",
      "Require the prescriber to cancel the prescription to resolve the conflict"
    ),
    "Decline to dispense personally but ensure timely patient access through another on-duty pharmacist or appropriate referral per state law",
    `Permitted conscientious refusal does not eliminate duties to facilitate timely access when another qualified pharmacist is available or referral is required — not abandonment, mandatory personal dispensing, or prescriber cancellation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["conscience", "refusal", "patient-access", "ethics", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Permitted conscientious refusal still requires facilitating timely access — not patient abandonment.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 42-year-old pharmacy owner instructs all staff pharmacists to dispense every valid prescription regardless of individual moral objections, stating that store policy overrides personal conscience. A pharmacist asks about documentation when refusing a non-controlled prescription they find clinically inappropriate but not forged.`,
    "What is the pharmacist's most appropriate understanding?",
    opts4(
      "Store policy always overrides individual pharmacist judgment and permitted state refusal frameworks",
      "Distinguish permitted conscientious refusal under state law from clinical/inappropriate dispensing concerns; document professional judgment and follow applicable board rules for each situation",
      "Refuse all prescriptions silently without documentation to avoid owner conflict",
      "Report the owner to law enforcement for every policy disagreement"
    ),
    "Distinguish permitted conscientious refusal under state law from clinical/inappropriate dispensing concerns; document professional judgment and follow applicable board rules for each situation",
    `Employer policy does not universally override permitted conscientious refusal or corresponding-responsibility clinical judgment. Pharmacists must distinguish moral refusal frameworks from forgery or safety concerns and document actions per board rules — not silent refusal or automatic law enforcement reporting.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["conscience", "refusal", "employer-policy", "ethics", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 29-year-old patient requests a valid prescription for hormonal contraception. The pharmacist has a sincerely held moral objection in a state requiring written notice of refusal and referral to another accessible pharmacy. The patient is the only customer in line and the nearest alternative pharmacy is closed until morning.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Provide written notice of refusal if required, take reasonable steps to ensure access such as transfer or emergency coverage when feasible, and document the interaction",
      "Refuse verbally and send the patient away without documentation or referral",
      "Dispense despite objection because the alternative pharmacy is closed",
      "Post the patient's name in the store to warn other pharmacists"
    ),
    "Provide written notice of refusal if required, take reasonable steps to ensure access such as transfer or emergency coverage when feasible, and document the interaction",
    `States permitting conscientious refusal often require written notice and reasonable referral or transfer steps. Documentation and access facilitation remain professional duties — not undocumented dismissal, mandatory personal dispensing, or public patient identification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["conscience", "refusal", "contraception", "referral", ...PE],
    }
  ),

  // ── Partial-Fill C-II LTC — Deeper (3) ────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: An 85-year-old nursing home resident has a written prescription for morphine sulfate immediate-release 15 mg tablets, quantity 90, dated today. The nurse requests a 10-day supply only. The prescriber did not note that partial fills are permitted for LTC or terminally ill patients.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the partial quantity because LTC patients always qualify for C-II partial fills",
      "Contact the prescriber to obtain required partial-fill authorization notation or dispense the full quantity if partial fills are not authorized under federal rules",
      "Destroy the prescription after the partial fill and require a new order",
      "Allow the nurse to pick up the balance without pharmacist involvement"
    ),
    "Contact the prescriber to obtain required partial-fill authorization notation or dispense the full quantity if partial fills are not authorized under federal rules",
    `21 CFR § 1306.13 permits C-II partial fills only for qualifying LTC or terminally ill patients when the prescriber notes partial fills are allowed. LTC status alone without prescriber notation does not authorize partial dispensing — contact prescriber or full fill required.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "partial-fill", "LTC", "prescriber-notation", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "C-II partial fills for LTC require prescriber notation authorizing partial fills — LTC status alone is insufficient.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 77-year-old hospice patient received a partial fill of oxycodone 5 mg tablets from a valid C-II prescription with prescriber notation "partial fills permitted — hospice" 62 days ago. The patient now requests the remaining authorized quantity.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the balance because hospice patients have unlimited partial-fill windows",
      "Refuse further dispensing on the original prescription because the 60-day federal window from the date written has expired; contact the prescriber for a new prescription if therapy continues",
      "Dispense the balance because only 62 days have passed and hospice overrides all limits",
      "Transfer the remaining quantity to another pharmacy without documentation"
    ),
    "Refuse further dispensing on the original prescription because the 60-day federal window from the date written has expired; contact the prescriber for a new prescription if therapy continues",
    `Qualifying C-II partial fills must be completed within 60 days of the date written under 21 CFR § 1306.13. After 60 days, no further dispensing is permitted on the original prescription — hospice status does not create unlimited windows or transfer exceptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "partial-fill", "hospice", "60-day-limit", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 80-year-old LTC resident has an EPCS prescription for hydromorphone 2 mg tablets, quantity 60, with prescriber notation "LTCF — partial fills allowed." The pharmacist dispenses 20 tablets today via electronic prescribing but the system does not record the partial quantity remaining on the electronic prescription record.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense without partial-fill documentation because EPCS eliminates paper requirements",
      "Correct and document the partial fill on the electronic prescription record and patient profile per DEA and state partial-fill requirements",
      "Dispense the full remaining quantity tomorrow without updating records",
      "Delete the EPCS audit trail to simplify future refills"
    ),
    "Correct and document the partial fill on the electronic prescription record and patient profile per DEA and state partial-fill requirements",
    `EPCS partial fills for qualifying LTC C-II orders require documentation of quantity dispensed and remaining balance on the electronic record — not undocumented dispensing, future full fills without records, or audit trail deletion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-II", "partial-fill", "LTC", "EPCS", "documentation", ...PE],
    }
  ),

  // ── Mail-Order / Central Fill Liability — Deeper (3) ────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 71-year-old patient calls the spoke pharmacy because a mail-order shipment of insulin glargine arrived with an ice pack melted and vials warm to the touch after sitting on the porch for eight hours in summer heat.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the patient to refrigerate and use the product because insulin is expensive",
      "Assess cold-chain integrity, quarantine or replace product per policy if temperature excursion compromised stability, document the incident, and report to the mail-order hub",
      "Bill the patient again without investigating the shipment",
      "Return warm insulin to resale inventory without assessment"
    ),
    "Assess cold-chain integrity, quarantine or replace product per policy if temperature excursion compromised stability, document the incident, and report to the mail-order hub",
    `Mail-order pharmacies bear liability for cold-chain integrity. Temperature-excursion products require assessment, quarantine or replacement, and documentation — not patient reuse of compromised product, silent rebilling, or returned resale without review.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["mail-order", "central-fill", "cold-chain", "liability", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Mail-order cold-chain failures require product assessment, quarantine or replacement, and documented hub notification.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 65-year-old patient's mail-order bag of chronic medications is delivered to the wrong address listed in the hub system. A neighbor opens the package and calls the pharmacy. The bag contains another patient's name, drug names, and limited controlled-substance information on the label.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ask the neighbor to deliver the bag to the correct patient without pharmacy involvement",
      "Retrieve or secure the mispackaged shipment, investigate the addressing error with the hub, notify affected patients as required, and document the privacy and dispensing breach",
      "Discard the medications silently to avoid HIPAA reporting",
      "Re-ship the same bag to the intended patient without verifying contents"
    ),
    "Retrieve or secure the mispackaged shipment, investigate the addressing error with the hub, notify affected patients as required, and document the privacy and dispensing breach",
    `Wrong-address mail-order delivery creates dispensing and privacy breaches requiring retrieval, investigation, patient notification, and documentation — not neighbor handoff, silent discard, or unverified reshipment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["mail-order", "central-fill", "dispensing-error", "HIPAA", "liability", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient's maintenance medication is filled at a central fill hub and delivered to a retail spoke for pickup. The hub label verification was performed, but the spoke pharmacist notices the quantity dispensed does not match the prescription and the DSCSA product tracing data is incomplete on the shipment manifest.`,
    "What is the pharmacist's most appropriate action before patient release?",
    opts4(
      "Release the product because the hub pharmacist already verified the label",
      "Withhold release until quantity and DSCSA tracing discrepancies are resolved with the hub per federal supply chain requirements",
      "Allow the technician to release the bag to reduce wait times",
      "Accept incomplete tracing because maintenance drugs are exempt from all DSCSA rules"
    ),
    "Withhold release until quantity and DSCSA tracing discrepancies are resolved with the hub per federal supply chain requirements",
    `Spoke pharmacists retain dispensing accountability before patient release. Hub label verification does not waive quantity reconciliation or applicable DSCSA tracing requirements — not technician release or blanket tracing exemptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["mail-order", "central-fill", "DSCSA", "hub-and-spoke", "liability", ...PE],
    }
  ),

  // ── Minnesota (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old patient requests an influenza vaccine at a Minneapolis pharmacy. The pharmacist completed Minnesota-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Minnesota protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Minnesota protocol requirements",
    `Minnesota authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Minnesota access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MN",
      difficulty: 2,
      references: [MN_REF],
      tags: ["minnesota", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 49-year-old pharmacist licensed in Wisconsin begins dispensing at a Duluth community pharmacy before obtaining a Minnesota pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Minnesota licensure?",
    opts4(
      "Continue dispensing under the Wisconsin license until Minnesota approves",
      "Obtain a Minnesota pharmacist license before practicing in the state",
      "Register with DEA only and defer Minnesota board licensure",
      "Work as a pharmacy intern indefinitely without Minnesota licensure"
    ),
    "Obtain a Minnesota pharmacist license before practicing in the state",
    `Minnesota requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Minnesota pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MN",
      difficulty: 2,
      references: [MN_REF],
      tags: ["minnesota", "licensure", ...PE],
    }
  ),

  // ── Wisconsin (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient requests a pneumococcal vaccine at a Milwaukee pharmacy. The pharmacist completed Wisconsin-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Wisconsin protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Wisconsin protocol requirements",
    `Wisconsin authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WI",
      difficulty: 2,
      references: [WI_REF],
      tags: ["wisconsin", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Madison picks up a new prescription at a community pharmacy. Wisconsin aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Wisconsin community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WI",
      difficulty: 2,
      references: [WI_REF],
      tags: ["wisconsin", "offer-to-counsel", ...PE],
    }
  ),

  // ── Indiana (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist licensed in Illinois begins dispensing at an Indianapolis community pharmacy before obtaining an Indiana pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Indiana licensure?",
    opts4(
      "Continue dispensing under the Illinois license until Indiana approves",
      "Obtain an Indiana pharmacist license before practicing in the state",
      "Register with DEA only and defer Indiana board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain an Indiana pharmacist license before practicing in the state",
    `Indiana requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Indiana pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IN",
      difficulty: 2,
      references: [IN_REF],
      tags: ["indiana", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests a shingles vaccine at a Fort Wayne pharmacy. The pharmacist completed Indiana-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Indiana protocol requirements",
      "Refuse because shingles vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Indiana protocol requirements",
    `Indiana authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate Indiana access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IN",
      difficulty: 2,
      references: [IN_REF],
      tags: ["indiana", "immunization", "shingles", ...PE],
    }
  ),
];
