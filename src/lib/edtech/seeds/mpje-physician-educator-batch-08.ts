/**
 * Curated MPJE-style items — physician-educator batch 08.
 * Topics: e-prescribing/EPCS, returns/reuse, whistleblower/mandatory reporting,
 * inventory/biennial, AZ/CO/MN state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-08";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const EPCS = {
  label: "DEA Electronic Prescriptions for Controlled Substances (21 CFR Part 1311)",
  url: "https://www.dea.gov/drug-information/drug-scheduling/electronic-prescriptions-controlled-substances",
};
const AZ_REF = {
  label: "Arizona State Board of Pharmacy",
  citation: "A.R.S. § 32-1901 et seq.",
};
const CO_REF = {
  label: "Colorado Pharmacy Laws / DORA",
  citation: "C.R.S. § 12-22-101 et seq.",
};
const MN_REF = {
  label: "Minnesota Pharmacy Practice Act",
  citation: "Minn. Stat. § 151.01 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_08: EnrichedBankItem[] = [
  // ── E-Prescribing / EPCS (3) ────────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 58-year-old patient presents at the pharmacy counter with a printed copy of an electronic prescription for oxycodone 10 mg tablets that was transmitted through a certified EPCS application. The printout lacks the two-factor authentication audit trail required under DEA Part 1311.`,
    "What is the pharmacist's most appropriate action before dispensing this Schedule II prescription?",
    opts4(
      "Dispense because the patient has a paper printout with the drug name and quantity",
      "Verify the prescription through the EPCS system or prescriber per DEA and state requirements before dispensing; do not rely on an unverified printout alone",
      "Convert the printout to a verbal order and dispense immediately",
      "Accept a faxed copy of the printout as equivalent to an original EPCS transmission"
    ),
    "Verify the prescription through the EPCS system or prescriber per DEA and state requirements before dispensing; do not rely on an unverified printout alone",
    `Schedule II electronic prescriptions must meet DEA Part 1311 EPCS requirements, including certified software and prescriber two-factor authentication. Patient-held printouts are not independently valid dispensing records. Verifying through the EPCS network or prescriber confirms authenticity. Verbal conversion or unverified fax substitutes violate federal controlled-substance prescribing rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA, EPCS],
      tags: ["e-prescribing", "EPCS", "C-II", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "C-II EPCS must be verified through certified systems — patient printouts alone are not valid dispensing authority.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 63-year-old patient needs a refill of alprazolam 0.5 mg tablets (Schedule IV). The prescriber's office transmits a new prescription electronically through DEA-compliant EPCS software with two-factor authentication. State law permits e-prescribing for this schedule.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Require a wet-ink handwritten prescription because benzodiazepines cannot be e-prescribed",
      "Accept and dispense the DEA-compliant electronic prescription if all federal and state validity elements are present",
      "Accept the e-prescription only if the patient also brings a signed paper copy",
      "Refuse e-prescriptions for all controlled substances regardless of schedule"
    ),
    "Accept and dispense the DEA-compliant electronic prescription if all federal and state validity elements are present",
    `DEA-compliant EPCS is valid for controlled substances when federal Part 1311 and applicable state requirements are met. Schedule IV benzodiazepines are not categorically excluded from e-prescribing. Requiring duplicate paper copies or refusing all electronic CS prescriptions contradicts current federal standards when software and authentication are compliant.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [DEA, EPCS],
      tags: ["e-prescribing", "EPCS", "C-IV", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 71-year-old hospice patient receives hydromorphone via EPCS. The receiving pharmacy's software shows the prescription was altered after transmission — the quantity field differs from the prescriber's EPCS audit log. The patient is in acute pain.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the higher quantity to treat pain and document the discrepancy later",
      "Withhold dispensing, verify the prescription with the prescriber through the EPCS system, and dispense only a valid unaltered order",
      "Dispense a partial quantity without prescriber contact to avoid delay",
      "Accept the patient's verbal request to increase the dose"
    ),
    "Withhold dispensing, verify the prescription with the prescriber through the EPCS system, and dispense only a valid unaltered order",
    `Altered or tampered e-prescriptions must not be dispensed. Pharmacists must verify discrepancies with the prescriber and rely on the authenticated EPCS record. Pain urgency does not waive corresponding responsibility. Partial dispensing or verbal dose changes without valid prescriber authorization violate controlled-substance and EPCS integrity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA, EPCS],
      tags: ["e-prescribing", "EPCS", "tampering", "red-flags", ...PE],
    }
  ),

  // ── Returns / Reuse (3) ─────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old patient returns an unopened bottle of amoxicillin 500 mg capsules three days after pickup, stating the prescriber changed therapy. The bottle remained in the patient's possession outside pharmacy control since dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Restock the unopened bottle on the shelf for the next patient because it appears sealed",
      "Accept the return for disposal or credit per policy but do not restock or redispense the prescription drug",
      "Give the bottle to another patient waiting for the same antibiotic to reduce waste",
      "Return the product to the wholesaler shelf-stock bin without documentation"
    ),
    "Accept the return for disposal or credit per policy but do not restock or redispense the prescription drug",
    `Once dispensed, prescription drugs cannot be guaranteed for integrity, storage, or chain of custody. Most state boards and USP standards prohibit restocking or redispensing returned prescription medications even if unopened. Internal reuse, patient-to-patient transfer, or undocumented wholesaler returns violate product-integrity and traceability rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["returns", "product-integrity", "reuse", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Returned prescription drugs must not be restocked or redispensed — chain of custody cannot be verified.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient attempts to return unused oxycodone 5 mg tablets from a partially filled prescription picked up yesterday. The patient claims the prescriber discontinued the drug. The tablets are in the original pharmacy vial with the pharmacy label intact.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Restock the tablets into pharmacy inventory because the vial is labeled and sealed",
      "Accept the return for documented destruction or authorized disposal per DEA and board rules; do not return controlled substances to active inventory",
      "Give the tablets to the prescriber's office for redistribution",
      "Allow the patient to keep them for future personal use without documentation"
    ),
    "Accept the return for documented destruction or authorized disposal per DEA and board rules; do not return controlled substances to active inventory",
    `Patient-returned controlled substances cannot re-enter dispensable inventory. DEA and state rules require documented destruction or authorized take-back/disposal pathways. Restocking, office redistribution, or undocumented patient retention creates diversion risk and violates accountability requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["returns", "C-II", "destruction", "reuse", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 62-year-old patient's spouse returns a sealed bag of refrigerated biologic prefilled syringes that were left in a hot car for several hours. The product appears unopened but may have exceeded labeled storage temperature.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Restock and redispense because the packaging is intact",
      "Quarantine the product, do not restock or redispense, and follow manufacturer and board guidance for temperature excursion returns",
      "Sell the product at a discount to another cash-paying patient",
      "Return the product to the manufacturer credit program and immediately restock replacement units on the shelf"
    ),
    "Quarantine the product, do not restock or redispense, and follow manufacturer and board guidance for temperature excursion returns",
    `Temperature-sensitive biologics with suspected cold-chain breach cannot be restocked or redispensed regardless of sealed appearance. Quarantine, manufacturer/board guidance, and documented disposal or credit processes protect patient safety. Discount resale or immediate shelf restock without excursion review violates product-integrity standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["returns", "cold-chain", "biologics", "reuse", ...PE],
    }
  ),

  // ── Whistleblower / Mandatory Reporting (3) ─────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 42-year-old staff pharmacist discovers recurring unexplained shrinkage of hydrocodone tablets in the will-call bin. Security footage suggests a technician may be removing product after hours. The pharmacy manager instructs staff to "handle it internally" without board or DEA contact.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Follow the manager's directive and avoid external reporting to protect the store",
      "Secure inventory, restrict access, document findings, notify the PIC, and report suspected diversion to the board and DEA as required",
      "Confront the technician publicly at the register during peak hours",
      "Ignore the discrepancy unless the dollar value exceeds $10,000"
    ),
    "Secure inventory, restrict access, document findings, notify the PIC, and report suspected diversion to the board and DEA as required",
    `Suspected controlled-substance diversion requires immediate security measures, documentation, and reporting to appropriate authorities — not internal suppression. Public confrontation risks safety and privacy violations. Dollar thresholds do not waive legal reporting duties for CS theft or diversion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["whistleblower", "diversion", "mandatory-reporting", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Suspected CS diversion must be secured, documented, and reported — internal cover-up violates DEA and board duties.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 37-year-old billing technician shows a staff pharmacist evidence that the pharmacy owner routinely submits false claims for brand drugs while dispensing generics and splits the insurance overpayment with select prescribers.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Participate briefly to meet payroll targets, then stop next quarter",
      "Refuse participation, document concerns, and report suspected fraud to appropriate regulatory, board, and compliance authorities",
      "Post allegations anonymously on social media to pressure the owner",
      "Accept the arrangement if patients are not harmed clinically"
    ),
    "Refuse participation, document concerns, and report suspected fraud to appropriate regulatory, board, and compliance authorities",
    `Insurance fraud and kickback schemes violate federal and state law regardless of clinical harm. Pharmacists must refuse participation and report through proper regulatory channels. Delayed complicity, social media accusations, and "no patient harm" rationalizations do not satisfy professional or legal obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["whistleblower", "fraud", "anti-kickback", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 34-year-old pharmacy technician notices patterned bruising on a 6-year-old accompanying an adult during a pickup. The child discloses that an adult at home "gets mad and hits" when medications run out. The adult denies any problem and demands the technician stop asking questions.`,
    "What is the pharmacist's most appropriate action under typical mandatory reporting laws?",
    opts4(
      "Ignore the disclosure to avoid offending the adult customer",
      "Report suspected child abuse or neglect to the designated state hotline or agency as required by mandatory reporter laws",
      "Detain the family in the pharmacy until police arrive without reporting",
      "Tell the child to discuss the issue with the school nurse only"
    ),
    "Report suspected child abuse or neglect to the designated state hotline or agency as required by mandatory reporter laws",
    `Pharmacists and pharmacy staff are mandatory reporters in many states when child abuse or neglect is suspected. Required reporting goes to designated state agencies — not silent avoidance, unlawful detention, or deferral to non-mandatory third parties. Patient/customer service does not override child protection statutes.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["mandatory-reporting", "child-abuse", "ethics", ...PE],
    }
  ),

  // ── Inventory / Biennial (3) ────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old pharmacist-in-charge prepares the pharmacy's DEA biennial inventory. The prior inventory was taken at the close of business on June 1 two years ago. Staff propose taking the new inventory at opening on June 3 because deliveries arrive later that morning.`,
    "What is the pharmacist's most appropriate action regarding the biennial inventory?",
    opts4(
      "Take the inventory at opening on June 3 because the date is within the two-year window",
      "Conduct the inventory at close of business on or near the same biennial date, consistent with the prior inventory method",
      "Skip the biennial inventory if perpetual records are maintained",
      "Estimate all Schedule II counts without opening containers"
    ),
    "Conduct the inventory at close of business on or near the same biennial date, consistent with the prior inventory method",
    `DEA biennial inventories must occur on or near the same date every two years and use a consistent method — either opening or close of business. Switching timing methods can invalidate comparability. Perpetual records supplement but do not replace biennial inventory. Schedule II requires exact counts, not estimates.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["inventory", "biennial", "DEA-records", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "Biennial DEA inventories must use the same opening/closing method and occur on or near the same date every two years.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A newly opened community pharmacy receives its initial DEA registration for Schedules II–V. The owner asks whether the first inventory can wait until the biennial cycle because wholesaler deliveries begin next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Defer all inventory until the first biennial date two years later",
      "Conduct an initial inventory on the date controlled substances are first received or dispensed, then maintain required ongoing records",
      "Maintain only a perpetual inventory without an initial count",
      "Rely on wholesaler invoices as a substitute for the initial inventory"
    ),
    "Conduct an initial inventory on the date controlled substances are first received or dispensed, then maintain required ongoing records",
    `DEA requires an initial inventory when a new registration is issued and CS are first received or dispensed — not deferred to the biennial cycle. Perpetual records and wholesaler invoices supplement accountability but do not replace the mandated initial inventory.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [DEA],
      tags: ["inventory", "initial-inventory", "DEA-records", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: During a biennial inventory, a 46-year-old pharmacist counts an opened bottle of tramadol 50 mg tablets (Schedule IV) containing 980 tablets. An unopened factory-sealed bottle of the same product contains 1,000 tablets.`,
    "What is the pharmacist's most appropriate inventory method for these Schedule IV products?",
    opts4(
      "Estimate the opened bottle and exact-count only Schedule II substances",
      "Perform an exact count of the opened tramadol bottle and may estimate the unopened sealed bottle per DEA biennial inventory rules",
      "Estimate both bottles because Schedule IV does not require inventory",
      "Exact-count every Schedule III–V container regardless of seal status"
    ),
    "Perform an exact count of the opened tramadol bottle and may estimate the unopened sealed bottle per DEA biennial inventory rules",
    `DEA biennial inventory rules require exact counts for Schedule II and for opened containers of other schedules; unopened commercial containers of III–V may be estimated if certain quantity thresholds are met. Estimating opened bottles or skipping III–V inventory violates federal recordkeeping requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["inventory", "biennial", "C-IV", ...PE],
    }
  ),

  // ── Arizona (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 53-year-old patient in Phoenix presents a new prescription for oxycodone 10 mg tablets. Arizona requires pharmacists to query the Controlled Substances Prescription Monitoring Program (PMP) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Arizona PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with established local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Arizona PMP, document the review, and apply corresponding-responsibility judgment",
    `Arizona requires pharmacists to query and document PMP review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is a controlled substance subject to PMP review. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AZ",
      difficulty: 3,
      references: [AZ_REF],
      tags: ["arizona", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 45-year-old pharmacist licensed only in New Mexico begins working at a Tucson chain pharmacy, dispensing prescriptions while waiting for Arizona license application processing.`,
    "What is the pharmacist's most appropriate action regarding Arizona licensure?",
    opts4(
      "Continue dispensing under the New Mexico license until Arizona approves the application",
      "Obtain an Arizona pharmacist license before practicing pharmacy in the state",
      "Register with DEA only and defer Arizona board licensure",
      "Work as a pharmacy intern indefinitely without Arizona licensure"
    ),
    "Obtain an Arizona pharmacist license before practicing pharmacy in the state",
    `Arizona requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates the Arizona Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AZ",
      difficulty: 2,
      references: [AZ_REF],
      tags: ["arizona", "licensure", ...PE],
    }
  ),

  // ── Colorado (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 57-year-old patient in Denver presents a prescription for morphine sulfate extended-release 30 mg tablets. Colorado requires Prescription Drug Monitoring Program (PDMP) review before dispensing opioids when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Colorado PDMP, document the review, and exercise corresponding responsibility before dispensing",
      "Skip PDMP review because extended-release opioids are exempt",
      "Query PDMP only when the patient pays cash",
      "Allow an intern to dispense morphine without pharmacist PDMP review"
    ),
    "Query the Colorado PDMP, document the review, and exercise corresponding responsibility before dispensing",
    `Colorado requires PDMP query and documentation before dispensing applicable opioid prescriptions. Extended-release morphine is not exempt. Cash payment does not waive PDMP obligations. Controlled-substance dispensing requires pharmacist accountability for PDMP review.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CO",
      difficulty: 3,
      references: [CO_REF],
      tags: ["colorado", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 39-year-old patient in Colorado Springs requests pharmacist-initiated naloxone under the state's standing order and protocol. The pharmacist completed required training and the pharmacy participates in an authorized take-home naloxone program.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense naloxone under the authorized Colorado standing order/protocol after screening, consent, and documentation",
      "Refuse because naloxone always requires an individual prescription in Colorado",
      "Dispense only to patients already receiving opioid prescriptions",
      "Allow technicians to dispense naloxone without pharmacist involvement"
    ),
    "Dispense naloxone under the authorized Colorado standing order/protocol after screening, consent, and documentation",
    `Colorado authorizes pharmacist dispensing of naloxone under standing orders and collaborative protocols with required training and documentation. Community and bystander access is permitted when program requirements are met — not limited to active opioid patients or technician-only dispensing without pharmacist oversight.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "CO",
      difficulty: 3,
      references: [CO_REF],
      tags: ["colorado", "naloxone", "standing-order", ...PE],
    }
  ),

  // ── Minnesota (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Minneapolis presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets. Minnesota requires Prescription Monitoring Program (PMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Minnesota PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for combination hydrocodone products",
      "Query PMP once per calendar year for each patient",
      "Delegate PMP review to delivery staff for mail orders without pharmacist oversight"
    ),
    "Query the Minnesota PMP, document the review, and apply corresponding-responsibility judgment",
    `Minnesota requires pharmacists to query and document PMP review before dispensing controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and non-pharmacist delegation for mail orders do not satisfy state PDMP and corresponding-responsibility requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MN",
      difficulty: 3,
      references: [MN_REF],
      tags: ["minnesota", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old patient in St. Paul picks up a new prescription at a community pharmacy. Minnesota aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient has filled at this pharmacy before"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Minnesota community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or prior fill history do not waive OBRA-aligned offer-to-counsel requirements for new prescriptions.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MN",
      difficulty: 2,
      references: [MN_REF],
      tags: ["minnesota", "offer-to-counsel", ...PE],
    }
  ),
];
