/**
 * Curated MPJE-style items — physician-educator batch 16.
 * Topics: FDA drug recalls, opioid disposal/take-back, clinical laboratory interface,
 * relief pharmacist duties, IA/AR/CT state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-16";
const PE = ["physician-educator", BATCH, "mpje"];

const FDA = { label: "FDA Drug Recalls and Safety Alerts", url: "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" };
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const IA_REF = {
  label: "Iowa Pharmacy Practice Act",
  citation: "Iowa Code § 155 et seq.",
};
const AR_REF = {
  label: "Arkansas Pharmacy Practice Act",
  citation: "Ark. Code Ann. § 17-92-101 et seq.",
};
const CT_REF = {
  label: "Connecticut Pharmacy Practice Act",
  citation: "Conn. Gen. Stat. § 20-570 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_16: EnrichedBankItem[] = [
  // ── FDA Drug Recalls (3) ──────────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 64-year-old patient's maintenance medication is subject to an FDA Class I recall for a specific lot due to serious contamination risk. The pharmacy identifies three remaining bottles from the recalled lot on the shelf and four patients who received the lot in the past two weeks.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue dispensing remaining stock until inventory is depleted",
      "Quarantine recalled lot inventory, stop dispensing, notify affected patients and follow FDA/manufacturer recall procedures",
      "Return recalled product to the shelf after visual inspection",
      "Sell recalled lot at a discount to reduce loss"
    ),
    "Quarantine recalled lot inventory, stop dispensing, notify affected patients and follow FDA/manufacturer recall procedures",
    `Class I recalls involve serious health hazards requiring immediate quarantine, cessation of dispensing, and patient notification per recall procedures. Visual inspection, discount sales, or continued dispensing violate FDA recall and patient safety obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["FDA-recall", "patient-safety", "quarantine", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Class I recalls require quarantine, stop dispense, and patient notification — never continue or discount recalled stock.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 58-year-old patient returns an unopened bottle from a lot later added to an FDA Class II recall for labeling errors. The patient asks whether the pharmacy can exchange it for a non-recalled lot today.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Exchange immediately without documenting the recall lot",
      "Quarantine the returned recalled product, document the return, and replace only with non-recalled inventory per recall and pharmacy policy",
      "Restock the returned bottle if the seal is intact",
      "Tell the patient to discard the product at home without pharmacy documentation"
    ),
    "Quarantine the returned recalled product, document the return, and replace only with non-recalled inventory per recall and pharmacy policy",
    `Recalled products must be quarantined and documented — not restocked or exchanged without recall tracking. Patient home disposal without documentation may fail recall accountability and patient counseling duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [FDA],
      tags: ["FDA-recall", "returns", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 47-year-old pharmacist-in-charge receives a manufacturer notification that only certain serial/lot numbers of an injectable biologic are recalled. Technicians propose removing all brands of the drug from the shelf to save time.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Remove all brands and strengths of the drug class from inventory",
      "Identify and quarantine only affected lot/serial numbers, verify dispensing records, and continue dispensing non-recalled inventory",
      "Ignore the notice if no patients have complained",
      "Continue dispensing recalled lots until the wholesaler picks them up next month"
    ),
    "Identify and quarantine only affected lot/serial numbers, verify dispensing records, and continue dispensing non-recalled inventory",
    `Targeted recalls require lot/serial-specific quarantine and record review — not class-wide removal, complaint-driven inaction, or continued dispensing of recalled units.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA],
      tags: ["FDA-recall", "lot-tracking", "inventory", ...PE],
    }
  ),

  // ── Opioid Disposal / Take-Back (3) ───────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient asks how to dispose of unused oxycodone 5 mg tablets remaining after surgery. The patient proposes flushing them down the toilet because the household trash seems unsafe.`,
    "What is the pharmacist's most appropriate counseling?",
    opts4(
      "Recommend flushing all unused opioids without further discussion",
      "Counsel on authorized disposal options such as DEA take-back locations or pharmacy collection programs when available, and follow FDA/DEA disposal guidance for the specific product",
      "Tell the patient to keep unused opioids for future personal use",
      "Accept unused tablets back into dispensable inventory if sealed"
    ),
    "Counsel on authorized disposal options such as DEA take-back locations or pharmacy collection programs when available, and follow FDA/DEA disposal guidance for the specific product",
    `Unused controlled opioids should be disposed through authorized take-back or approved methods — not routine trash, indiscriminate flushing without product-specific guidance, personal retention, or restocking patient returns.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [DEA, FDA],
      tags: ["opioid-disposal", "take-back", "counseling", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Counsel patients on authorized opioid take-back/disposal — not trash, hoarding, or restocking returns.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old community pharmacy participates in an authorized controlled-substance collection receptacle program. A patient deposits multiple schedule II–IV unused medications with names removed from containers.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Empty the receptacle into regular waste at close of business",
      "Manage the collection receptacle per DEA and program rules, including secure maintenance, documentation, and authorized destruction pathways",
      "Sort returned controlled substances back onto the shelf by therapeutic class",
      "Allow technicians to process collected controlled substances without pharmacist oversight"
    ),
    "Manage the collection receptacle per DEA and program rules, including secure maintenance, documentation, and authorized destruction pathways",
    `Authorized take-back receptacles require secure management and documented destruction — not regular waste disposal, restocking, or technician-only CS processing without pharmacist accountability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["opioid-disposal", "take-back", "collection-receptacle", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 70-year-old hospice patient’s caregiver asks about disposing of used fentanyl transdermal patches. The caregiver read conflicting advice about folding patches and using take-back versus product-specific FDA flush guidance.`,
    "What is the pharmacist's most appropriate counseling?",
    opts4(
      "Discard used patches in household trash without counseling",
      "Provide product-specific FDA disposal guidance, counsel on safe handling (e.g., folding used patches), and recommend authorized take-back when available",
      "Tell the caregiver to burn used patches at home",
      "Collect used patches for pharmacy resale if visually intact"
    ),
    "Provide product-specific FDA disposal guidance, counsel on safe handling (e.g., folding used patches), and recommend authorized take-back when available",
    `Used fentanyl patches require product-specific disposal counseling and safe handling — not unsecured trash, home burning, or reuse. Take-back programs supplement FDA guidance where available.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA, DEA],
      tags: ["opioid-disposal", "fentanyl", "patch", "counseling", ...PE],
    }
  ),

  // ── Clinical Laboratory Interface (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old patient enrolled in pharmacist MTM has a serum potassium of 5.8 mEq/L uploaded to the pharmacy's clinical interface while taking lisinopril 40 mg and spironolactone 25 mg daily. The patient feels well and is picking up refills today.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense refills silently because the patient is asymptomatic",
      "Perform clinical review, contact the prescriber about the elevated potassium and duplicate therapy, document the intervention, and resolve before dispensing or per prescriber direction",
      "Discontinue both drugs independently at the pharmacy",
      "Ignore the lab because pharmacists cannot use laboratory results"
    ),
    "Perform clinical review, contact the prescriber about the elevated potassium and duplicate therapy, document the intervention, and resolve before dispensing or per prescriber direction",
    `Pharmacists may use clinical laboratory data for DUR and MTM interventions. Hyperkalemia with ACE inhibitor and spironolactone requires prescriber contact and documentation — not silent dispensing, unilateral discontinuation, or ignoring available lab data.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["clinical-laboratory", "MTM", "DUR", "potassium", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Use lab data for DUR — contact prescriber and document before dispensing when clinically significant.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient's electronic health record sends a critical INR of 6.2 to the pharmacy interface for a patient on warfarin 7.5 mg daily seen at MTM yesterday. The prescriber office is closed and the patient is en route to pick up today's warfarin refill.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the warfarin refill on schedule because the prescriber ordered it",
      "Withhold or adjust dispensing per clinical judgment and protocol, urgently contact the prescriber or direct the patient to emergency care as indicated, and document the intervention",
      "Double the warfarin dose to stabilize INR",
      "Ignore the critical value because the lab interface is informational only"
    ),
    "Withhold or adjust dispensing per clinical judgment and protocol, urgently contact the prescriber or direct the patient to emergency care as indicated, and document the intervention",
    `Critical laboratory values in the pharmacy interface trigger urgent clinical action — not routine dispensing, unauthorized dose changes, or ignoring interfaced results. Patient safety and prescriber contact take priority.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["clinical-laboratory", "INR", "warfarin", "critical-value", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old pharmacist operating under a collaborative practice agreement for diabetes management receives point-of-care A1c results of 9.8% for a patient on metformin 1000 mg twice daily. The CPA authorizes pharmacist assessment and prescriber notification within defined parameters.`,
    "What is the pharmacist's most appropriate action under the CPA?",
    opts4(
      "Ignore the A1c because laboratory review is outside pharmacy scope",
      "Review the result within CPA scope, document assessment, notify the collaborating prescriber, and recommend or implement authorized therapy adjustments per protocol",
      "Start insulin independently without prescriber collaboration because A1c is elevated",
      "Share the patient's A1c on social media to promote MTM services"
    ),
    "Review the result within CPA scope, document assessment, notify the collaborating prescriber, and recommend or implement authorized therapy adjustments per protocol",
    `Clinical laboratory and point-of-care results may inform CPA interventions when authorized — not be ignored, used for unauthorized prescribing, or disclosed publicly in violation of privacy rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["clinical-laboratory", "CPA", "A1c", "diabetes", ...PE],
    }
  ),

  // ── Relief Pharmacist Duties (3) ──────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 46-year-old relief pharmacist arrives at an unfamiliar chain store for a single shift. The regular PIC is absent and no interim PIC designation was filed with the board. Controlled substance invoices and DEA Form 222 require signature today.`,
    "What is the relief pharmacist's most appropriate action?",
    opts4(
      "Sign CS documents as acting PIC without board designation",
      "Ensure proper PIC designation or authorized pharmacist oversight is in place before assuming PIC-level controlled-substance accountability",
      "Allow the senior technician to sign DEA Form 222",
      "Refuse all pharmacy work and leave the store closed"
    ),
    "Ensure proper PIC designation or authorized pharmacist oversight is in place before assuming PIC-level controlled-substance accountability",
    `Relief pharmacists cannot assume PIC controlled-substance accountability without proper designation. Technician signatures and store closure without arranging lawful coverage violate DEA and board requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["relief-pharmacist", "PIC", "controlled-substances", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Relief pharmacists need proper PIC designation before CS ordering/receiving accountability.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 43-year-old relief pharmacist covers a busy store and discovers the perpetual controlled-substance inventory format differs from the pharmacist's home store. A technician says, "We never update it here — just sign at month end."`,
    "What is the relief pharmacist's most appropriate action?",
    opts4(
      "Follow the local shortcut to avoid slowing production",
      "Implement required controlled-substance recordkeeping and perpetual inventory updates per DEA and board rules regardless of prior local practice",
      "Ignore inventory because the relief shift is only one day",
      "Transfer CS accountability to the district manager"
    ),
    "Implement required controlled-substance recordkeeping and perpetual inventory updates per DEA and board rules regardless of prior local practice",
    `Relief pharmacists maintain the same CS accountability duties as regular staff. Local shortcuts, single-shift exceptions, and non-pharmacist accountability transfer violate DEA recordkeeping requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["relief-pharmacist", "inventory", "DEA-records", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 50-year-old relief pharmacist's license expired yesterday; renewal is pending. The staffing agency asks the pharmacist to complete a 12-hour shift at a retail pharmacy because no other pharmacist is available.`,
    "What is the relief pharmacist's most appropriate action?",
    opts4(
      "Work the shift because renewal is pending and patients need medications",
      "Do not perform pharmacist duties until the license is active; notify the agency and store so lawful coverage can be arranged",
      "Work as an uncredentialed technician while telling patients you are the pharmacist",
      "Sign the previous pharmacist's name on verification records"
    ),
    "Do not perform pharmacist duties until the license is active; notify the agency and store so lawful coverage can be arranged",
    `An expired pharmacist license prohibits practice — pending renewal does not authorize dispensing. Misrepresentation as technician or forged verification violates licensure and fraud rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["relief-pharmacist", "licensure", ...PE],
    }
  ),

  // ── Iowa (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 54-year-old patient in Des Moines presents a new prescription for oxycodone 10 mg tablets. Iowa requires pharmacists to query the Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Iowa PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Iowa PMP, document the review, and apply corresponding-responsibility judgment",
    `Iowa requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IA",
      difficulty: 3,
      references: [IA_REF],
      tags: ["iowa", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist licensed in Nebraska begins dispensing at a Cedar Rapids chain pharmacy before receiving an Iowa pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Iowa licensure?",
    opts4(
      "Continue dispensing under the Nebraska license until Iowa approves",
      "Obtain an Iowa pharmacist license before practicing in the state",
      "Register with DEA only and defer Iowa board licensure",
      "Work as a pharmacy intern indefinitely without Iowa licensure"
    ),
    "Obtain an Iowa pharmacist license before practicing in the state",
    `Iowa requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Iowa pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IA",
      difficulty: 2,
      references: [IA_REF],
      tags: ["iowa", "licensure", ...PE],
    }
  ),

  // ── Arkansas (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient in Little Rock presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Arkansas requires Prescription Drug Monitoring Program (PDMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Arkansas PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP for combination hydrocodone products",
      "Query PDMP once per calendar year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist PDMP review"
    ),
    "Query the Arkansas PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Arkansas requires PDMP query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AR",
      difficulty: 3,
      references: [AR_REF],
      tags: ["arkansas", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 65-year-old patient in Fayetteville picks up a new prescription at a community pharmacy. Arkansas aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Arkansas community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AR",
      difficulty: 2,
      references: [AR_REF],
      tags: ["arkansas", "offer-to-counsel", ...PE],
    }
  ),

  // ── Connecticut (2) ─────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Hartford presents a new prescription for alprazolam 0.5 mg tablets. Connecticut requires Prescription Monitoring Program (PMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Connecticut PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP because benzodiazepines are not monitored",
      "Query PMP only when the patient pays cash",
      "Delegate PMP review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the Connecticut PMP, document the review, and apply corresponding-responsibility judgment",
    `Connecticut requires pharmacists to query and document PMP review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CT",
      difficulty: 3,
      references: [CT_REF],
      tags: ["connecticut", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 56-year-old pharmacist relocates to New Haven and begins dispensing at an independent pharmacy before receiving a Connecticut pharmacist license, relying on an active Massachusetts license.`,
    "What is the pharmacist's most appropriate action regarding Connecticut licensure?",
    opts4(
      "Continue dispensing under the Massachusetts license until Connecticut renewal season",
      "Obtain a Connecticut pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Connecticut board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Connecticut pharmacist license through the board before practicing in the state",
    `Connecticut requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate Connecticut pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CT",
      difficulty: 2,
      references: [CT_REF],
      tags: ["connecticut", "licensure", ...PE],
    }
  ),
];
