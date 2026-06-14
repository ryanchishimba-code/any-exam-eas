/**
 * Curated MPJE-style items — physician-educator batch 15.
 * Topics: REMS follow-up, patient assistance programs, compounding hazard communication,
 * board discipline/probation, SD/NE/KS state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-15";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA = { label: "FDA REMS / Drug Safety", url: "https://www.fda.gov/drugs" };
const OSHA = {
  label: "OSHA Hazard Communication Standard (29 CFR 1910.1200)",
  url: "https://www.osha.gov/hazcom",
};
const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };
const SD_REF = {
  label: "South Dakota Pharmacy Practice Act",
  citation: "S.D. Codified Laws § 36-11 et seq.",
};
const NE_REF = {
  label: "Nebraska Pharmacy Practice Act",
  citation: "Neb. Rev. Stat. § 38-2869 et seq.",
};
const KS_REF = {
  label: "Kansas Pharmacy Act",
  citation: "Kan. Stat. § 65-1630 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_15: EnrichedBankItem[] = [
  // ── REMS Follow-Up (3) ──────────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 22-year-old female patient returns for a 30-day isotretinoin refill under iPLEDGE. The pharmacist notes the required monthly prescriber visit confirmation and negative pregnancy test documentation are missing from the REMS system, though the patient insists she completed labs yesterday.`,
    "What is the pharmacist's most appropriate action before dispensing the refill?",
    opts4(
      "Dispense because the patient completed labs and delays therapy is harmful",
      "Withhold dispensing until iPLEDGE REMS monthly follow-up requirements — including prescriber confirmation and required testing documentation — are verified in the program",
      "Dispense a 7-day supply without REMS verification to bridge therapy",
      "Allow the technician to override the REMS hold because the patient is a established user"
    ),
    "Withhold dispensing until iPLEDGE REMS monthly follow-up requirements — including prescriber confirmation and required testing documentation — are verified in the program",
    `iPLEDGE requires verified monthly follow-up elements before each isotretinoin dispense — not patient self-report, bridge supplies, or technician REMS overrides. Missing program documentation prohibits dispensing until REMS criteria are met.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["REMS", "iPLEDGE", "follow-up", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "iPLEDGE refills require verified monthly REMS follow-up in the system — not patient self-report alone.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 47-year-old patient presents a clozapine refill. The pharmacy's Clozapine REMS certification expired last week during staff turnover. Current ANC results and prescriber authorization appear acceptable in the chart.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because clinical monitoring labs are current",
      "Do not dispense until pharmacy Clozapine REMS certification is restored and program requirements are verified",
      "Dispense once and renew REMS certification next month",
      "Transfer accountability to the prescriber's office for dispensing"
    ),
    "Do not dispense until pharmacy Clozapine REMS certification is restored and program requirements are verified",
    `Clozapine REMS requires active certified pharmacy status — current ANC labs do not substitute for lapsed certification. One-time dispensing or prescriber-office transfer violates REMS and does not restore pharmacy compliance.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["REMS", "clozapine", "certification", "follow-up", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 56-year-old patient picks up a refill of extended-release oxycodone 20 mg tablets under the ER/LA opioid REMS. The patient received the medication guide at the initial fill three months ago and declines another copy, stating they already read it.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip the medication guide because the patient received it previously",
      "Provide required REMS medication guide and counseling documentation per program and REMS follow-up requirements",
      "Provide counseling only if the patient initiates questions",
      "Refuse the refill because the patient declined written materials"
    ),
    "Provide required REMS medication guide and counseling documentation per program and REMS follow-up requirements",
    `ER/LA opioid REMS requires ongoing patient counseling and medication guide provision per program rules — prior receipt does not permanently waive REMS documentation. Passive counseling-only-on-request or refill refusal solely for guide declination misapply REMS obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [FDA],
      tags: ["REMS", "opioid", "medication-guide", "follow-up", ...PE],
    }
  ),

  // ── Patient Assistance Programs (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old uninsured patient qualifies for a manufacturer patient assistance program (PAP) for a brand biologic. The pharmacy manager proposes billing the patient's Medicare Part D plan for the same fill and also submitting a PAP claim to maximize revenue.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill both Part D and PAP for the same dispensed quantity",
      "Follow program and payer rules — do not double-bill insurance and PAP for the same fill; use the appropriate authorized coverage pathway",
      "Bill Part D and donate the PAP supply to staff",
      "Submit PAP only and bill the patient cash copay as brand"
    ),
    "Follow program and payer rules — do not double-bill insurance and PAP for the same fill; use the appropriate authorized coverage pathway",
    `Patient assistance programs prohibit improper dual reimbursement with insurance for the same dispensed product. Double billing, internal diversion, or miscoded cash claims violate program integrity and fraud rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["patient-assistance", "PAP", "billing-compliance", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Do not double-bill insurance and PAP for the same fill — use one authorized coverage pathway.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests enrollment in a PAP for imatinib. The pharmacy has a partial application but lacks required income documentation and prescriber attestation. The patient needs therapy to start tomorrow.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense under PAP without complete enrollment documentation",
      "Complete required PAP eligibility documentation and prescriber attestation per program rules before dispensing under assistance",
      "Bill Medicare and retroactively apply PAP after enrollment",
      "Give a 90-day supply on credit without program authorization"
    ),
    "Complete required PAP eligibility documentation and prescriber attestation per program rules before dispensing under assistance",
    `PAP dispensing requires complete enrollment and eligibility documentation — urgency does not waive program requirements. Retroactive billing schemes or unauthorized credit supplies violate assistance program and payer rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["patient-assistance", "PAP", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 41-year-old patient uses a manufacturer copay card for a specialty drug while the pharmacy also applies a foundation grant toward the same fill. The grants manager asks the pharmacist to adjust claim timestamps so both benefits appear unrelated.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Adjust timestamps to maximize stacked benefits",
      "Apply copay assistance and grants only per each program's stacking rules and submit accurate claims without misrepresentation",
      "Bill full cash price and reimburse the patient informally",
      "Cancel the prescription if both programs cannot be stacked"
    ),
    "Apply copay assistance and grants only per each program's stacking rules and submit accurate claims without misrepresentation",
    `Copay cards and foundation grants must follow each program's permitted stacking and accurate adjudication rules — not timestamp manipulation, informal rebates, or abandonment without exploring lawful options.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["patient-assistance", "copay-card", "billing-compliance", ...PE],
    }
  ),

  // ── Compounding Hazard Communication (3) ────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 50-year-old compounding pharmacist prepares non-sterile hormone powder capsules. A new technician asks where to find safety data sheets (SDS) for progesterone USP powder and whether glove type matters.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the technician SDS are unnecessary for non-sterile compounding",
      "Ensure current SDS are accessible, train staff on hazard communication, and provide appropriate PPE per USP <795> and OSHA requirements",
      "Refer the technician to the product label only without SDS",
      "Allow compounding without PPE if the batch is small"
    ),
    "Ensure current SDS are accessible, train staff on hazard communication, and provide appropriate PPE per USP <795> and OSHA requirements",
    `Compounding personnel must have access to SDS and hazard communication training for chemical ingredients. Label-only references, absent PPE, and ignoring OSHA/USP <795> handling requirements create staff exposure and compliance violations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795, OSHA],
      tags: ["hazard-communication", "SDS", "compounding", "USP-795", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Compounding staff need accessible SDS, hazard communication training, and appropriate PPE.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 44-year-old pharmacy compounds methimazole tablets from bulk powder. Bulk containers lack GHS pictograms and the compounding bench has no posted hazard information. Staff report skin irritation after handling powder without gloves.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue compounding because methimazole is used therapeutically in patients",
      "Implement hazard communication controls — SDS access, labeling, PPE, and staff training — and assess exposure per OSHA and compounding standards",
      "Switch to open-bowl trituration without ventilation to finish faster",
      "Discharge the affected technician without documenting the exposure"
    ),
    "Implement hazard communication controls — SDS access, labeling, PPE, and staff training — and assess exposure per OSHA and compounding standards",
    `Bulk chemical compounding requires hazard communication including SDS, PPE, and training — therapeutic patient use does not eliminate staff exposure controls. Unsafe speed practices and undocumented exposure dismissal violate OSHA and professional duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795, OSHA],
      tags: ["hazard-communication", "GHS", "compounding", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 39-year-old inspector asks a compounding pharmacy for written hazard communication programs and proof that staff were trained on handling niacinamide and salicylic acid powders used in non-sterile preparations.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "State that hazard communication applies only to manufacturers, not pharmacies",
      "Provide the written hazard communication program, SDS, and training records for compounding chemicals per OSHA and board expectations",
      "Create training records retroactively dated before the inspection",
      "Refuse inspection of non-dispensing compounding records"
    ),
    "Provide the written hazard communication program, SDS, and training records for compounding chemicals per OSHA and board expectations",
    `Pharmacies handling hazardous chemical powders must maintain hazard communication programs and training — not claim manufacturer-only exemptions, fabricate records, or refuse lawful inspection of compounding compliance documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795, OSHA],
      tags: ["hazard-communication", "inspection", "training", ...PE],
    }
  ),

  // ── Board Discipline / Probation (3) ──────────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 48-year-old pharmacist receives a board consent order placing the license on probation requiring supervised practice, quarterly reports, and completion of ethics CE. The pharmacist is offered a PIC position at a new store starting next month.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the PIC role without notifying the board because probation is private",
      "Comply with all probation terms, disclose restrictions to employers and the board as required, and do not accept duties prohibited by the consent order",
      "Practice normally and submit reports only if the board contacts the pharmacy",
      "Surrender the license permanently instead of complying with probation terms"
    ),
    "Comply with all probation terms, disclose restrictions to employers and the board as required, and do not accept duties prohibited by the consent order",
    `Board probation imposes ongoing compliance, reporting, and practice restrictions. Concealed practice, selective reporting, or unnecessary surrender violate the consent order — PIC duties may be prohibited until terms allow.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "probation", "licensure", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Board probation requires full compliance and disclosure — prohibited duties cannot be accepted silently.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 55-year-old pharmacist's license was summarily suspended pending a diversion hearing. The pharmacist continues to verify prescriptions at a friend's independent pharmacy, stating the suspension is "being appealed."`,
    "What is the pharmacist's most appropriate action regarding practice?",
    opts4(
      "Continue verifying until the appeal is decided",
      "Cease all pharmacy practice prohibited by the suspension order until the board restores licensure privileges",
      "Work as an unregistered clerk performing pharmacist duties",
      "Sign prescriptions using the owner's credentials"
    ),
    "Cease all pharmacy practice prohibited by the suspension order until the board restores licensure privileges",
    `Summary suspension prohibits practice covered by the order — appeals do not automatically authorize continued dispensing. Unregistered clerk workarounds or credential misuse compound violations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "suspension", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 42-year-old pharmacist signed a board consent agreement after a medication error investigation requiring a practice monitor, error-reduction plan, and random chart audits for 12 months. The district manager removes audit time from the schedule to improve production metrics.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip monitored audits to meet production goals",
      "Fulfill all consent agreement requirements including monitored practice and audits; notify the board if employer interference prevents compliance",
      "Forgery audit documentation to show compliance",
      "Transfer to another state to avoid the consent agreement"
    ),
    "Fulfill all consent agreement requirements including monitored practice and audits; notify the board if employer interference prevents compliance",
    `Board consent agreements are binding independent of employer metrics. Skipping audits, fabricated documentation, or interstate relocation to evade terms violates board orders and may worsen discipline.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "consent-agreement", "probation", ...PE],
    }
  ),

  // ── South Dakota (2) ────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Sioux Falls presents a new prescription for oxycodone 10 mg tablets. South Dakota requires pharmacists to query the Prescription Drug Monitoring Program (PDMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the South Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with established local prescribers",
      "Query PDMP only for Schedule II drugs, not oxycodone",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the South Dakota PDMP, document the review, and apply corresponding-responsibility judgment",
    `South Dakota requires pharmacists to query and document PDMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SD",
      difficulty: 3,
      references: [SD_REF],
      tags: ["south-dakota", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 45-year-old pharmacist licensed in Minnesota begins dispensing at a Rapid City chain pharmacy before receiving a South Dakota pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding South Dakota licensure?",
    opts4(
      "Continue dispensing under the Minnesota license until South Dakota approves",
      "Obtain a South Dakota pharmacist license before practicing in the state",
      "Register with DEA only and defer South Dakota board licensure",
      "Work as a pharmacy intern indefinitely without South Dakota licensure"
    ),
    "Obtain a South Dakota pharmacist license before practicing in the state",
    `South Dakota requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates South Dakota pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SD",
      difficulty: 2,
      references: [SD_REF],
      tags: ["south-dakota", "licensure", ...PE],
    }
  ),

  // ── Nebraska (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Omaha presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Nebraska requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Nebraska PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the Nebraska PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Nebraska requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NE",
      difficulty: 3,
      references: [NE_REF],
      tags: ["nebraska", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Lincoln picks up a new prescription at a community pharmacy. Nebraska aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Nebraska community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NE",
      difficulty: 2,
      references: [NE_REF],
      tags: ["nebraska", "offer-to-counsel", ...PE],
    }
  ),

  // ── Kansas (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Wichita presents a new prescription for alprazolam 0.5 mg tablets. Kansas requires Prescription Drug Monitoring Program (K-TRACS) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query K-TRACS, document the review, and apply corresponding-responsibility judgment",
      "Skip K-TRACS because benzodiazepines are not monitored",
      "Query K-TRACS only when the patient pays cash",
      "Delegate K-TRACS review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query K-TRACS, document the review, and apply corresponding-responsibility judgment",
    `Kansas requires pharmacists to query and document K-TRACS review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PDMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KS",
      difficulty: 3,
      references: [KS_REF],
      tags: ["kansas", "K-TRACS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 54-year-old pharmacist relocates to Topeka and begins dispensing at an independent pharmacy before receiving a Kansas pharmacist license, relying on an active Missouri license.`,
    "What is the pharmacist's most appropriate action regarding Kansas licensure?",
    opts4(
      "Continue dispensing under the Missouri license until Kansas renewal season",
      "Obtain a Kansas pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Kansas board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Kansas pharmacist license through the board before practicing in the state",
    `Kansas requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate the Kansas Pharmacy Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KS",
      difficulty: 2,
      references: [KS_REF],
      tags: ["kansas", "licensure", ...PE],
    }
  ),
];
