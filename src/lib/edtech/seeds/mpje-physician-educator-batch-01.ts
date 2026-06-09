/**
 * Curated MPJE-style items — physician-educator batch 01 (federal / UMPJE baseline).
 * fieldId: mpje via collectHighYieldSeedRows; stateCode null for uniform/federal scope.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase, mpjeMcq } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-01";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const HIPAA = { label: "HIPAA Privacy Rule", url: "https://www.hhs.gov/hipaa" };
const FDA = { label: "FDA compounding guidance", url: "https://www.fda.gov/drugs" };
const CSA = { label: "Controlled Substances Act", citation: "21 U.S.C. § 801 et seq." };

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_01: EnrichedBankItem[] = [
  mpjeCase(
    "controlled-substances",
    `Scenario: A 58-year-old patient presents a written prescription for oxycodone 10 mg tablets, quantity 60, dated 22 days ago. The prescription has not been partially filled. The patient states they delayed starting therapy after surgery.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the remaining tablets after pharmacist verification of patient identity",
      "Refuse to fill because the prescription is more than 21 days old",
      "Contact the prescriber for a new dated prescription only if the patient insists on same-day service",
      "Partially fill 30 tablets now and annotate the balance for a future fill within 21 days"
    ),
    "Refuse to fill because the prescription is more than 21 days old",
    `Federal rules limit dispensing of Schedule II controlled substances from a written prescription to within 21 days of the date written (unless limited partial-fill exceptions apply in specific contexts). A prescription dated 22 days ago is no longer valid for initial dispensing. The pharmacist must refuse and request a new prescription; partial fill does not revive an expired C-II order.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA, CSA],
      tags: ["C-II", "prescription-validity", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A valid electronic prescription (eRx) arrives for testosterone cypionate 200 mg/mL (Schedule III), quantity sufficient for 30 days, with 5 refills authorized over 6 months. The prescriber's DEA number validates. No state-specific prohibition applies.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the electronic prescription and dispense per the order",
      "Require a wet-ink paper prescription for all Schedule III orders",
      "Refuse because testosterone may not be prescribed electronically",
      "Accept only if the patient signs a controlled-substance agreement before dispensing"
    ),
    "Accept the electronic prescription and dispense per the order",
    `Schedule III controlled substances may be transmitted by DEA-compliant electronic prescribing when all federal and state requirements are met, including valid prescriber authentication and DEA registration. Five refills within 6 months is permissible for C-III. Wet-ink paper is not required when e-prescribing is valid. Patient agreements may be policy-driven but are not a federal prerequisite to accept a lawful eRx.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-III", "e-prescribing", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: A 72-year-old patient's adult daughter calls the pharmacy requesting a complete medication profile, refill history, and counseling notes. She states she is "handling Mom's affairs" but provides no documentation. The patient has not signed a HIPAA authorization on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Release the medication profile to the daughter as next of kin without further steps",
      "Deny all requests from family members under HIPAA without exception",
      "Ask the patient for permission or verify documented consent before releasing PHI",
      "Provide a limited profile excluding controlled-substance history only"
    ),
    "Ask the patient for permission or verify documented consent before releasing PHI",
    `HIPAA treats medication profiles and counseling documentation as protected health information. Family relationship alone is not authorization. The pharmacist should obtain patient permission or verify a valid HIPAA authorization/power of attorney before disclosure. Blanket denial ignores permitted disclosures with authorization; partial release without consent still violates minimum-necessary and authorization rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "PHI", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: During a busy lunch hour, a certified pharmacy technician receives a new e-prescription for lisinopril 10 mg for a 62-year-old patient, enters prescriber and drug data, and queues the Rx for pharmacist verification before dispensing. No clinical judgment has been applied yet.`,
    "Which action is most appropriate under typical technician scope rules?",
    opts4(
      "Allow the technician to enter and accept the prescription; pharmacist verifies before release",
      "Prohibit technicians from any prescription intake or data-entry activities",
      "Require the pharmacist to personally answer the phone for every new prescription",
      "Allow the technician to perform final verification if backlog exceeds two hours"
    ),
    "Allow the technician to enter and accept the prescription; pharmacist verifies before release",
    `Technicians may perform non-judgment tasks such as data entry and initial intake under pharmacist supervision, but final verification and clinical review remain pharmacist responsibilities. Prohibiting all technician intake is impractical and not required. Final verification cannot be delegated to technicians regardless of workload.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["technician-scope", "supervision", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 76-year-old hospice patient presents a valid written prescription for morphine sulfate immediate-release 15 mg tablets, quantity 120. The patient requests only a 14-day supply today because of cost and storage concerns. Federal partial-fill rules for Schedule II apply.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the full quantity and decline the patient's request for a partial supply",
      "Record the partial fill on the prescription per federal and state partial-fill rules",
      "Create a new verbal order from the prescriber for the partial amount only",
      "Transfer the unfilled balance to another pharmacy without documentation on the original Rx"
    ),
    "Record the partial fill on the prescription per federal and state partial-fill rules",
    `Schedule II partial fills are permitted in limited circumstances (e.g., terminally ill or LTC patients when noted by prescriber). The pharmacist must document the partial quantity dispensed on the face of the prescription (or electronic record per state rule), retain the balance if allowed, and follow day-supply and refill prohibitions. Verbal orders cannot replace required written C-II documentation for partial fills.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA, CSA],
      tags: ["C-II", "partial-fill", "hospice", ...PE],
    }
  ),

  mpjeMcq(
    "compounding-regulations",
    "",
    "A compounding pharmacy plans to produce large batches of a non-patient-specific injectable product and ship interstate to clinic stockrooms without individual prescriptions. Under federal compounding policy, which consideration is most appropriate?",
    opts4(
      "Compound and ship under 503A patient-specific exemptions without limitation",
      "Evaluate 503B outsourcing/manufacturing requirements; routine bulk interstate distribution may not qualify as traditional compounding",
      "Ship as dietary supplements if labeling includes 'for office use only'",
      "Proceed if the receiving state does not inspect out-of-state pharmacies"
    ),
    "Evaluate 503B outsourcing/manufacturing requirements; routine bulk interstate distribution may not qualify as traditional compounding",
    `503A traditional compounding generally requires patient-specific prescriptions and limits interstate distribution. Large-batch, office-use interstate shipment aligns with 503B outsourcing facility/manufacturing frameworks, not unlimited 503A compounding. Mislabeling as a dietary supplement violates FDA drug definitions. Another state's inspection practices do not override federal compounding requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [FDA],
      tags: ["503A", "503B", "compounding", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient brings a prescription for warfarin 5 mg daily with "DAW" (dispense as written) noted. The payer prefers generic warfarin. The patient asks whether a less expensive generic is available.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Substitute generic warfarin automatically under state generic substitution law without prescriber contact",
      "Refuse the prescription and return it to the patient without counseling",
      "Perform DUR, consult the prescriber as required, and document in the patient record",
      "Dispense brand warfarin but bill the insurance using the generic product code"
    ),
    "Perform DUR, consult the prescriber as required, and document in the patient record",
    `DAW and narrow therapeutic index anticoagulants require pharmacist judgment. Automatic generic substitution may be prohibited when DAW is present or when prescriber approval is required. The pharmacist should conduct drug utilization review, contact the prescriber if substitution is clinically and legally appropriate, and document the interaction. Billing fraud by miscoding brand as generic is prohibited.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["DUR", "generic-substitution", "warfarin", ...PE],
    }
  ),

  mpjeMcq(
    "controlled-substances",
    "",
    "Regarding the perpetual inventory of controlled substances required under DEA regulations, which practice is required?",
    opts4(
      "Update the perpetual inventory once annually during the DEA inspection cycle",
      "Update the perpetual inventory upon each receipt and each dispensing of controlled substances",
      "Maintain the perpetual inventory on a biennial basis if no thefts occur",
      "Record only Schedule II substances in the perpetual inventory"
    ),
    "Update the perpetual inventory upon each receipt and each dispensing of controlled substances",
    `DEA regulations require a perpetual inventory updated each time controlled substances are received or dispensed (for schedules required in the inventory). Annual-only or biennial updates are insufficient. Inventories must include relevant schedules per DEA rules, not C-II alone. Failure to maintain current perpetual inventory is a common inspection deficiency.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["inventory", "DEA-records", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A customer attempts to purchase pseudoephedrine products. NPLEX logs show the customer already reached the federal daily gram limit earlier the same calendar day at another store. The customer offers to split the purchase across two transactions at your register.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Split the sale across two register transactions to remain under the per-transaction limit",
      "Deny the sale because the requested quantity exceeds the daily NPLEX limit",
      "Complete the sale with pharmacist counseling only",
      "Require a prescription for any pseudoephedrine product regardless of quantity"
    ),
    "Deny the sale because the requested quantity exceeds the daily NPLEX limit",
    `The Combat Methamphetamine Epidemic Act limits pseudoephedrine sales tracked via NPLEX (daily and monthly gram limits). Splitting transactions to evade limits is prohibited. Counseling does not override legal sales caps. Prescription is not universally required for all PSE products within legal limits, but this sale exceeds the daily limit and must be denied.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["NPLEX", "PSE", "CMEA", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A community pharmacy's pharmacist-in-charge (PIC) transfers to another store. A senior technician asks to sign DEA Form 222 and controlled-substance invoices "temporarily" until corporate assigns a new PIC next month.`,
    "What is the most appropriate action regarding controlled-substance accountability?",
    opts4(
      "Allow the designated technician to sign DEA Form 222 as acting PIC",
      "Designate a pharmacist-in-charge; controlled-substance accountability remains pharmacist responsibility",
      "Suspend all Schedule II dispensing until a new DEA registration certificate arrives by mail",
      "Delegate perpetual inventory duties exclusively to senior technicians without pharmacist oversight"
    ),
    "Designate a pharmacist-in-charge; controlled-substance accountability remains pharmacist responsibility",
    `Only a licensed pharmacist may serve as PIC; controlled-substance ordering, receiving, and accountability cannot be delegated to technicians. DEA Form 222 and invoice signatures require pharmacist authority. Operations may continue when a new PIC is promptly designated; suspending all C-II dispensing is unnecessary if a pharmacist supervisor is assigned. Inventory remains pharmacist-supervised.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["PIC", "technician-scope", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 45-year-old patient runs out of levothyroxine 100 mcg on a Friday evening. The prescriber's office is closed until Monday. The patient has a stable history on this dose with refills exhausted on the profile. State law follows common emergency refill protocols.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse any supply without a new prescription",
      "Provide an emergency refill per applicable state protocol for a limited supply until prescriber contact",
      "Dispense a 90-day supply using therapeutic substitution",
      "Transfer the prescription to a 24-hour pharmacy without documentation"
    ),
    "Provide an emergency refill per applicable state protocol for a limited supply until prescriber contact",
    `Many states allow pharmacists to provide a limited emergency supply of essential maintenance medications (including levothyroxine) when prescriber contact is temporarily impossible, with documentation and follow-up required. Blanket refusal ignores patient access and authorized emergency protocols. A 90-day supply exceeds typical emergency limits; transfer requires valid prescription status.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-refill", "maintenance-med", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: An electronic prescription for alprazolam 0.5 mg tablets (Schedule IV) is received from a physician assistant (PA) with a valid DEA number authorized for the PA in your state. The prescription meets all validity elements.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse because physician assistants may not prescribe benzodiazepines under federal law",
      "Dispense if the prescriber is authorized under federal and state law and the DEA number is valid for that practitioner",
      "Require a co-signature from a supervising physician on every PA benzodiazepine order",
      "Dispense only if the PA holds a separate institutional Schedule II DEA number in every state"
    ),
    "Dispense if the prescriber is authorized under federal and state law and the DEA number is valid for that practitioner",
    `Prescriptive authority for Schedule IV benzodiazepines depends on state scope-of-practice laws and valid practitioner DEA registration. PAs authorized in the state with valid DEA numbers may prescribe alprazolam when all prescription elements are met. Federal law does not categorically bar PA benzodiazepine prescribing. Universal co-signature or separate C-II institutional DEA numbers are not federal requirements for this scenario.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescriptive-authority", "C-IV", "PA", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old patient returns an unopened insulin glargine pen 10 days after pickup, stating it was kept refrigerated and never used. Store policy and board rules address returns of temperature-sensitive products.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Restock and redispense the pen if the packaging appears unopened",
      "Accept the return for disposal or credit per policy but do not restock or redispense the product",
      "Refuse the return and instruct the patient to discard the product at home only",
      "Return the product to the wholesaler for credit without quarantine documentation"
    ),
    "Accept the return for disposal or credit per policy but do not restock or redispense the product",
    `Once a prescription drug leaves pharmacy control, chain of custody and storage conditions cannot be guaranteed for insulin and similar products. Standard practice and most board rules prohibit restocking/redispensing returned prescription drugs even if unopened. Patient assistance with disposal may be offered, but resale is prohibited. Wholesaler credit requires documented quarantine/return policies, not silent restock.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["returns", "insulin", "product-integrity", ...PE],
    }
  ),

  mpjeCase(
    "patient-privacy",
    `Scenario: You observe a pharmacy colleague accessing a well-known individual's medication profiles and histories without a treatment, payment, or operations purpose. The colleague admits curiosity after you question the behavior.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Confront the colleague privately and take no further action if they apologize",
      "Ignore the incident unless the patient files a complaint",
      "Report the privacy breach through the designated privacy officer or institutional policy",
      "Post an internal warning on the staff message board without formal reporting"
    ),
    "Report the privacy breach through the designated privacy officer or institutional policy",
    `Unauthorized access to PHI ("snooping") is a HIPAA violation requiring investigation and potential breach notification workflows. Internal apology alone is insufficient; covered entities must address workforce violations through privacy officer reporting, disciplinary action, and documentation. Waiting for patient complaint or informal warnings fails mandatory compliance duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HIPAA],
      tags: ["HIPAA", "workforce", "breach", ...PE],
    }
  ),
];
