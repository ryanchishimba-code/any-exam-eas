/**
 * Curated MPJE-style items — physician-educator batch 02.
 * Topics: DEA/controlled substances, HIPAA, USP <797>, NY/PA/NJ state law.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-02";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const HIPAA = { label: "HIPAA Privacy Rule", url: "https://www.hhs.gov/hipaa" };
const USP797 = { label: "USP <797> Sterile Compounding", citation: "USP-NF <797>" };
const NY_REF = { label: "NY Education Law Art. 137 / I-STOP", citation: "NY Educ. Law § 6800; PHL § 334-I" };
const PA_REF = { label: "Pennsylvania Pharmacy Act / PDMP", citation: "63 P.S. § 390-8; PA PDMP Act" };
const NJ_REF = { label: "New Jersey Pharmacy Practice Act", citation: "N.J.S.A. 45:14-23 et seq." };

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_02: EnrichedBankItem[] = [
  // ── DEA / Controlled Substances (4) ───────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient arrives at an urgent care clinic pharmacy window on Sunday morning after dental surgery. The dentist called in an oral emergency prescription for hydrocodone 5 mg/acetaminophen 325 mg, quantity 12 tablets. The pharmacist verifies the prescriber's DEA registration. No written prescription has been received.`,
    "What is the pharmacist's most appropriate action under federal DEA rules?",
    opts4(
      "Refuse because Schedule II controlled substances may never be prescribed orally",
      "Dispense after documenting the oral order and ensure a signed written prescription is received within 7 days",
      "Dispense a 30-day supply because the patient is in acute pain",
      "Require the patient to return Monday with a pharmacy-generated prescription form only"
    ),
    "Dispense after documenting the oral order and ensure a signed written prescription is received within 7 days",
    `Under 21 CFR § 1306.11, an oral emergency prescription for a Schedule II controlled substance is permitted when immediate administration is necessary and it is impractical to obtain a written prescription before dispensing. The quantity must be limited to the emergency period. The pharmacist must reduce the order to writing, and the prescriber must deliver a signed written prescription within 7 days or the pharmacist must notify the DEA area office. A 30-day supply exceeds emergency limits. Blanket refusal ignores the limited federal emergency exception.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "DEA", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "Emergency oral C-II orders require limited quantity, pharmacist documentation, and prescriber written follow-up within 7 days.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 45-year-old patient at a hospital outpatient window needs alprazolam 0.5 mg tablets (Schedule IV), quantity 30, with 5 refills authorized over 6 months. A valid electronic prescription is on file; the prescriber's DEA number validates in the state registry. PDMP review shows no red flags.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept and dispense per the valid e-prescription; up to 5 refills within 6 months is permitted for C-IV",
      "Refuse because benzodiazepines may not be transmitted electronically under federal law",
      "Accept only if the patient signs a chronic opioid agreement before dispensing",
      "Limit dispensing to a 7-day supply regardless of the written quantity"
    ),
    "Accept and dispense per the valid e-prescription; up to 5 refills within 6 months is permitted for C-IV",
    `Schedule IV controlled substances may be prescribed by DEA-compliant electronic prescribing when federal and state requirements are met. Federal law permits up to five refills within six months for C-III–V substances when authorized on the prescription. Benzodiazepines are not categorically barred from e-prescribing. Patient agreements may be policy-driven but are not a universal federal prerequisite. Arbitrary 7-day caps are not required for all C-IV orders absent state law.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-IV", "e-prescribing", "refills", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: Overnight, a 34-year-old night pharmacist discovers that 40 tablets of oxycodone 15 mg are missing from the pharmacy vault. Security footage is inconclusive. The perpetual inventory has not been reconciled since the prior week.`,
    "What is the pharmacist-in-charge's most appropriate immediate action?",
    opts4(
      "Adjust inventory silently to match physical count and monitor future shifts",
      "Report the loss to DEA on Form 106, secure records, and notify appropriate authorities per federal and state rules",
      "Wait until the biennial inventory to report the discrepancy",
      "Notify the wholesaler only and reorder stock to replace missing tablets"
    ),
    "Report the loss to DEA on Form 106, secure records, and notify appropriate authorities per federal and state rules",
    `Significant theft or loss of controlled substances requires prompt DEA notification on Form 106 and cooperation with investigators. Perpetual inventory must be reconciled and secured; silent adjustment constitutes record falsification. Biennial inventory timing does not delay theft reporting. Wholesaler notification does not satisfy DEA loss-reporting obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["theft", "Form-106", "inventory", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 61-year-old patient presents a written prescription for testosterone gel 1% (Schedule III), quantity sufficient for 90 days, with 2 refills noted. The prescription is dated today and all validity elements appear present. The pharmacy uses compliant e-prescribing for refills when authorized.`,
    "What is the pharmacist's most appropriate action regarding refills for this Schedule III prescription under federal DEA rules?",
    opts4(
      "No refills — a new prescription is required for each fill of Schedule III",
      "Up to 5 refills within 6 months of the date written if authorized on the prescription",
      "Unlimited refills within one year if the patient is established",
      "One refill only within 30 days regardless of prescriber authorization"
    ),
    "Up to 5 refills within 6 months of the date written if authorized on the prescription",
    `21 CFR Part 1306 permits up to five refills within six months from the date written for Schedule III–V controlled substances when refills are authorized on the original prescription. Schedule II cannot be refilled. Unlimited or one-refill-only rules misstate federal scheduling requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-III", "refills", ...PE],
    }
  ),

  // ── HIPAA & Privacy (4) ───────────────────────────────────────────────
  mpjeCase(
    "patient-privacy",
    `Scenario: A 48-year-old patient's employer calls the pharmacy requesting a complete medication profile and refill dates to verify a workers' compensation claim. The caller provides the patient's name and date of birth but no signed HIPAA authorization. The patient has not been notified.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Release the profile because the employer funds the prescription benefit plan",
      "Release only drug names and withhold dates and quantities",
      "Decline disclosure unless a permitted HIPAA exception applies or valid patient authorization is obtained",
      "Fax the profile if the employer sends company letterhead"
    ),
    "Decline disclosure unless a permitted HIPAA exception applies or valid patient authorization is obtained",
    `HIPAA generally requires patient authorization before disclosing PHI to employers. Payment operations exceptions are limited and do not allow indiscriminate release of full profiles to employers without authorization or a specific permitted disclosure. Partial release without authorization still violates minimum necessary and authorization rules. Letterhead alone is not HIPAA authorization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "PHI", "authorization", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 70-year-old patient submits a written request for an accounting of disclosures of their pharmacy records for the past three years. The pharmacy maintains electronic dispensing records and has made routine treatment, payment, and health care operations disclosures.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Deny the request because patients may never review pharmacy disclosure history",
      "Provide the accounting of disclosures as required by HIPAA within the permitted timeframe and scope",
      "Provide only disclosures made to law enforcement regardless of other categories",
      "Charge a punitive fee to discourage future privacy requests"
    ),
    "Provide the accounting of disclosures as required by HIPAA within the permitted timeframe and scope",
    `HIPAA grants patients the right to receive an accounting of certain disclosures of PHI made by the covered entity during the applicable look-back period, with standard exceptions for treatment, payment, health care operations, and other defined categories. Denying the request or limiting to law enforcement only violates patient rights. Reasonable cost-based fees may apply in limited circumstances, not punitive charges.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "accounting-of-disclosures", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 29-year-old patient picks up a HIV antiretroviral prescription at a busy chain pharmacy. A pharmacy technician calls the patient's name and medication name loudly across the waiting area. The patient complains about confidentiality at the pickup counter.`,
    "What is the pharmacist's most appropriate action to comply with HIPAA and professional standards?",
    opts4(
      "Continue current practice because all patients receive the same announcement",
      "Implement reasonable safeguards such as confidential pickup, lower voice, or written notification for sensitive medications",
      "Require all sensitive prescriptions to be mailed and refuse counter pickup",
      "Post the patient's medication name on a public screen to improve workflow"
    ),
    "Implement reasonable safeguards such as confidential pickup, lower voice, or written notification for sensitive medications",
    `HIPAA requires reasonable administrative, physical, and technical safeguards to protect PHI, including avoiding unnecessary audible disclosure in public areas. Equal treatment that routinely exposes sensitive diagnoses fails the minimum necessary and safeguards standard. Mailing-only or public display worsens privacy violations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [HIPAA],
      tags: ["HIPAA", "minimum-necessary", "counseling", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A software vendor that hosts the pharmacy's dispensing system requests access to prescription and demographic data for a 58-year-old pilot cohort to develop refill reminders. No business associate agreement (BAA) is in place.`,
    "What is the pharmacist's most appropriate action before sharing any patient data?",
    opts4(
      "Share data immediately because the vendor supports pharmacy operations",
      "Execute a HIPAA business associate agreement and limit disclosure to the minimum necessary before any PHI access",
      "Share only medication names because diagnoses are not PHI",
      "Allow technician discretion to export patient lists without pharmacist review"
    ),
    "Execute a HIPAA business associate agreement and limit disclosure to the minimum necessary before any PHI access",
    `Vendors that create, receive, maintain, or transmit PHI on behalf of a covered entity are business associates requiring a BAA under HIPAA. Medication names linked to patients are PHI. Technician export without oversight violates workforce and security rule requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "BAA", "vendor", ...PE],
    }
  ),

  // ── USP <797> Compounding (4) ─────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 62-year-old ICU patient needs patient-specific sterile compounded bags of norepinephrine infusion. The hospital pharmacy prepares them in a segregated compounding area without ISO-classified primary engineering controls. The pharmacist plans to ship bags to nursing units with a 90-day beyond-use date.`,
    "What is the pharmacist's most appropriate action under USP <797> standards?",
    opts4(
      "Proceed because small-batch hospital preparations are exempt from all USP <797> requirements",
      "Prepare only in compliant ISO-classified primary engineering controls, assign BUD per <797>, and document garbing and training",
      "Use a 90-day BUD for all sterile CSPs if refrigerated",
      "Delegate sterile compounding verification entirely to certified technicians without pharmacist oversight"
    ),
    "Prepare only in compliant ISO-classified primary engineering controls, assign BUD per <797>, and document garbing and training",
    `USP <797> requires compliant facilities (including ISO-classified primary engineering controls for sterile compounding), garbing, hand hygiene, training, and scientifically justified beyond-use dating — not arbitrary 90-day dating. Hospital settings are not exempt from core sterile compounding standards. Pharmacist oversight of sterile compounding remains mandatory; technicians cannot replace pharmacist verification responsibilities.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP797],
      tags: ["USP-797", "sterile", "BUD", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A compounding pharmacist in a cleanroom notes that a certified compounding technician entered the ISO 5 buffer area without changing garb after leaving to answer a phone call in the anteroom. Several low-risk sterile preparations are in progress.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow completion of the batch because the phone call was brief",
      "Stop the process, assess contamination risk, repeat garbing/hand hygiene as required, and document the breach per policy and USP <797>",
      "Discard all inventory company-wide regardless of batch status",
      "Continue compounding but reduce BUD to 24 hours without documentation"
    ),
    "Stop the process, assess contamination risk, repeat garbing/hand hygiene as required, and document the breach per policy and USP <797>",
    `USP <797> personnel requirements mandate proper garbing and hand hygiene before entering ISO-classified spaces. Re-entry after leaving without regowning creates contamination risk requiring assessment, corrective action, and documentation. Ignoring the breach or undocumented BUD changes fail compounding quality standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP797],
      tags: ["USP-797", "garbing", "contamination", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 44-year-old oncology patient needs a patient-specific sterile compounded syringe of hydromorphone for home hospice use. The pharmacy uses Category 3 stability data supporting a 45-day refrigerated BUD for this exact formulation in a closed-system transfer device.`,
    "What is the pharmacist's most appropriate beyond-use date assignment?",
    opts4(
      "Assign 45 days refrigerated based on compliant stability data and <797> category rules, not exceeding component expirations",
      "Assign 12 months because hydromorphone is stable in all vehicles",
      "Use 24 hours for all patient-specific sterile CSPs regardless of stability data",
      "Omit BUD labeling if the patient will use the product within one week"
    ),
    "Assign 45 days refrigerated based on compliant stability data and <797> category rules, not exceeding component expirations",
    `USP <797> BUD assignment depends on compounding category, storage conditions, and supporting stability data — not API stability alone. When valid Category 3 data support extended dating in defined containers, BUD may exceed default short dating if standards are met. BUD labeling is always required for dispensed CSPs; omitting labels violates compounding practice standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP797],
      tags: ["USP-797", "BUD", "hospice", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 55-year-old patient's physician office requests that a retail pharmacy purchase large quantities of a sterile injectable product from an outsourcing facility (503B) and repackage it into patient-specific syringes for in-office administration without individual patient prescriptions on file.`,
    "What is the pharmacist's most appropriate action under federal compounding law and USP <797>?",
    opts4(
      "Proceed because any pharmacy may repackage 503B products for office stock",
      "Ensure the activity complies with FDA outsourcing facility requirements, applicable prescriptions, state board rules, and <797> standards before dispensing",
      "Treat 503B products as OTC items exempt from prescription requirements",
      "Compound identical copies from bulk API without sterility testing to save cost"
    ),
    "Ensure the activity complies with FDA outsourcing facility requirements, applicable prescriptions, state board rules, and <797> standards before dispensing",
    `503B outsourcing facilities are regulated by FDA under distinct requirements from traditional 503A pharmacy compounding. Repackaging and office-use distribution must comply with federal drug law, valid prescribing/distribution rules, state board regulations, and USP <797>. 503B products are not OTC. Copying with non-compliant compounding violates federal and quality standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [USP797, { label: "FDA 503B outsourcing facilities", url: "https://www.fda.gov/drugs" }],
      tags: ["USP-797", "503B", "office-use", ...PE],
    }
  ),

  // ── NY / PA / NJ State Law (6) ────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 56-year-old patient presents a handwritten prescription for oxycodone 5 mg tablets at a Buffalo, New York community pharmacy. The prescription is on tamper-resistant paper but was not transmitted electronically. The prescriber claims a blanket waiver from e-prescribing.`,
    "What is the pharmacist's most appropriate action under New York I-STOP requirements?",
    opts4(
      "Accept any paper C-II prescription if the prescriber is known to the pharmacy",
      "Verify that the prescription meets I-STOP e-prescribing requirements or a valid statutory exception before dispensing",
      "Refuse all controlled substances in New York regardless of format",
      "Convert the paper prescription to an internal e-prescription generated by the pharmacy"
    ),
    "Verify that the prescription meets I-STOP e-prescribing requirements or a valid statutory exception before dispensing",
    `New York I-STOP generally requires electronic prescribing of controlled substances with narrow exceptions (e.g., certain emergencies or technical failures documented per rule). Pharmacists must verify lawful format and prescriber authenticity; known prescriber status does not override I-STOP. Pharmacy-generated prescriptions without prescriber authorization are invalid.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NY",
      difficulty: 4,
      references: [NY_REF],
      tags: ["new-york", "I-STOP", "C-II", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient in Manhattan requests emergency dispensing of a maintenance lisinopril prescription after the prescriber's e-prescribing system failed. New York law permits limited emergency dispensing when documented. The patient has a stable fill history.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense a limited emergency supply per applicable New York protocol with documentation and prescriber follow-up",
      "Refuse because New York prohibits any emergency supply without a wet-ink prescription",
      "Dispense a 90-day supply and bill insurance without records",
      "Transfer the patient out of state to avoid New York rules"
    ),
    "Dispense a limited emergency supply per applicable New York protocol with documentation and prescriber follow-up",
    `New York allows limited emergency dispensing under defined conditions with documentation and prescriber contact requirements. Blanket refusal ignores authorized emergency protocols. Excessive quantity without documentation violates dispensing standards. Transfer for evasion is inappropriate.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NY",
      difficulty: 3,
      references: [NY_REF],
      tags: ["new-york", "emergency-supply", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 41-year-old patient presents a new prescription for oxycodone 10 mg tablets at a Philadelphia community pharmacy. Pennsylvania law requires PDMP review before dispensing controlled substances. The pharmacist has not yet queried the PDMP record.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Pennsylvania PDMP, document the review, and proceed only after corresponding-responsibility assessment",
      "Skip PDMP review for patients paying cash",
      "Query PDMP once annually for established patients",
      "Delegate PDMP review and dispensing decision entirely to a technician"
    ),
    "Query the Pennsylvania PDMP, document the review, and proceed only after corresponding-responsibility assessment",
    `Pennsylvania requires pharmacists to query and document PDMP review as part of corresponding responsibility before dispensing controlled substances. Cash payment does not waive monitoring requirements. Annual-only review and technician delegation of clinical CS decisions violate state PDMP and supervision rules.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 3,
      references: [PA_REF],
      tags: ["pennsylvania", "PDMP", "C-II", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 37-year-old bystander requests naloxone nasal spray at a Pittsburgh pharmacy without a patient-specific prescription. Pennsylvania authorizes pharmacist dispensing under standing order or protocol in many settings.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense naloxone under an authorized standing order or protocol if Pennsylvania requirements are met",
      "Refuse because naloxone always requires an individual prescription in Pennsylvania",
      "Dispense only to licensed first responders",
      "Require hospital discharge paperwork for every naloxone request"
    ),
    "Dispense naloxone under an authorized standing order or protocol if Pennsylvania requirements are met",
    `Pennsylvania expanded naloxone access through pharmacist dispensing authority under standing orders/protocols subject to training and documentation rules. Community pharmacists may dispense to at-risk individuals and bystanders when protocol requirements are satisfied. Universal prescription-only or first-responder-only rules misstate Pennsylvania access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "PA",
      difficulty: 3,
      references: [PA_REF],
      tags: ["pennsylvania", "naloxone", "standing-order", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient presents a prescription for tramadol 50 mg tablets at a Newark, New Jersey pharmacy. State rules require NJPMP access before dispensing controlled substance prescriptions in applicable contexts.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query NJPMP and document the review before dispensing as required by New Jersey rules",
      "Skip monitoring because tramadol is not a controlled substance in any state",
      "Query NJPMP only if the patient appears suspicious",
      "Allow technicians to complete CS dispensing without pharmacist PDMP review"
    ),
    "Query NJPMP and document the review before dispensing as required by New Jersey rules",
    `Tramadol is a controlled substance federally and in New Jersey. NJPMP (New Jersey Prescription Monitoring Program) review and documentation are part of corresponding responsibility before dispensing. Suspicion-only or technician-only approaches fail mandatory monitoring and supervision requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 3,
      references: [NJ_REF],
      tags: ["new-jersey", "NJPMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A relief pharmacist at a Jersey City chain is asked to supervise two pharmacy technicians while the PIC is at lunch. One technician proposes performing final verification of new prescriptions to reduce wait times.`,
    "What is the pharmacist's most appropriate action under New Jersey pharmacy practice standards?",
    opts4(
      "Allow technician final verification for non-controlled medications only",
      "Prohibit technician final verification; the pharmacist must perform pharmacist-only duties including final review",
      "Allow final verification if the technician has five years of experience",
      "Delegate all counseling and verification whenever the PIC is off-site"
    ),
    "Prohibit technician final verification; the pharmacist must perform pharmacist-only duties including final review",
    `New Jersey, like most jurisdictions, restricts final verification, clinical judgment, and counseling to licensed pharmacists. Technicians may perform supportive tasks under supervision but cannot assume pharmacist-only responsibilities regardless of experience. Off-site PIC status does not expand technician scope.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NJ",
      difficulty: 2,
      references: [NJ_REF],
      tags: ["new-jersey", "technician-scope", "supervision", ...PE],
    }
  ),
];
