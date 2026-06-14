/**
 * Curated MPJE-style items — physician-educator batch 21.
 * Topics: PBM DIR fee audits, DEA take-back/disposal events, OBRA equivalent drug selection,
 * pharmacy liability/negligence, GA/SC/NC state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-21";
const PE = ["physician-educator", BATCH, "mpje"];

const CMS_DIR = {
  label: "CMS Medicare Part D / DIR Fee Guidance",
  url: "https://www.cms.gov/medicare/payment/part-d-plans/direct-and-indirect-remuneration-dir",
};
const DEA_DISPOSAL = {
  label: "DEA Drug Disposal and Take-Back Programs",
  url: "https://www.dea.gov/takebackday",
};
const OBRA = {
  label: "Omnibus Budget Reconciliation Act (OBRA '90) Pharmacy Provisions",
  url: "https://www.cms.gov/medicare/provider-enrollment-and-certification/guidanceforlawsandregulations/downloads/pharmacyobrafactsheet.pdf",
};
const GA_REF = {
  label: "Georgia Pharmacy Practice Act",
  citation: "O.C.G.A. § 26-4-1; Ga. BOP rules",
};
const SC_REF = {
  label: "South Carolina Pharmacy Practice Act",
  citation: "S.C. Code § 40-43-10 et seq.",
};
const NC_REF = {
  label: "North Carolina Pharmacy Practice Act",
  citation: "N.C.G.S. § 90-85 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_21: EnrichedBankItem[] = [
  // ── PBM DIR Fee Audits (3) ────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old Medicare Part D patient's generic claim from nine months ago is included in a PBM DIR reconciliation audit. The payer requests original adjudication records, proof of point-of-sale pricing, and pharmacy-PBM contract terms showing how DIR was disclosed at dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore the audit because DIR reconciliations are unenforceable after 90 days",
      "Gather authentic adjudication records, contract terms, and DIR-related documentation and respond accurately within the audit timeframe",
      "Recreate missing records with current pricing to match the audit request",
      "Bill the patient retroactively for all DIR shortfalls identified in the audit"
    ),
    "Gather authentic adjudication records, contract terms, and DIR-related documentation and respond accurately within the audit timeframe",
    `DIR reconciliation audits require authentic historical adjudication and contract documentation — not arbitrary deadlines ignored, backdated records, or retroactive patient surcharges beyond contracted cost sharing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "PBM", "payer-audit", "reconciliation", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "DIR audits require authentic historical records and timely accurate response — not recreated files.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old independent pharmacy owner discovers that retroactive DIR true-ups on Part D generic claims exceed initial reimbursement on 15 percent of fills last quarter. The owner asks the pharmacist to stop submitting accurate NDC data and instead use higher-reimbursement NDCs for future claims to offset anticipated DIR clawbacks.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Switch NDCs at adjudication to maximize reimbursement and offset DIR",
      "Maintain accurate NDC and claim submission; pursue lawful PBM appeals and contracting regarding DIR — not claim misrepresentation",
      "Stop dispensing all Part D generics until DIR is eliminated",
      "Bill all affected claims as cash to avoid DIR tracking"
    ),
    "Maintain accurate NDC and claim submission; pursue lawful PBM appeals and contracting regarding DIR — not claim misrepresentation",
    `DIR mitigation must not involve NDC or claim misrepresentation. Accurate adjudication with lawful appeals and contracting — not cash conversion or program abandonment — satisfies compliance obligations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "PBM", "NDC", "billing-compliance", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old pharmacy receives a DIR-related audit comparing star-measure documentation for medication adherence with actual refill dates on lisinopril therapy for a 70-year-old patient. The PBM alleges mismatched dates used to inflate quality metrics and reduce DIR exposure.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Alter refill dates in the dispensing system to match the PBM narrative",
      "Provide authentic dispensing, refill, and outreach records and respond factually; correct errors if identified without fabricating quality documentation",
      "Delete all adherence outreach records to simplify the audit response",
      "Accept all PBM findings without reviewing underlying records"
    ),
    "Provide authentic dispensing, refill, and outreach records and respond factually; correct errors if identified without fabricating quality documentation",
    `DIR and quality-metric audits require authentic refill and outreach documentation. Altering dates, destroying records, or blind acceptance without review violates program integrity and may constitute fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "PBM", "payer-audit", "star-measures", ...PE],
    }
  ),

  // ── DEA Take-Back / Disposal Events (3) ───────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 55-year-old PIC plans to host a DEA National Prescription Drug Take Back Day collection at the community pharmacy. Staff propose accepting controlled substances in unsecured grocery bags and storing them in the retail waiting area until an officer arrives next week.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept unsecured bags in the waiting area until law enforcement pickup",
      "Follow DEA take-back event requirements including secure collection, authorized personnel, and documented transfer to law enforcement or approved destruction",
      "Refuse all controlled substance returns because pharmacies cannot collect them",
      "Allow technicians to count and repackage returned opioids for inventory credit"
    ),
    "Follow DEA take-back event requirements including secure collection, authorized personnel, and documented transfer to law enforcement or approved destruction",
    `DEA take-back events require secure controlled collection and documented transfer — not unsecured public storage, blanket refusal of authorized programs, or repackaging returns into inventory.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA_DISPOSAL],
      tags: ["take-back", "DEA-disposal", "collection-event", ...PE],
      related: {
        reviewModuleSlug: "controlled-substances",
        keyTakeaway:
          "Take-back events require secure CS collection and documented law-enforcement transfer.",
      },
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old pharmacy registered as an authorized collector maintains a permanent DEA-compliant receptacle for unused prescriptions. A patient drops a bottle of mixed controlled and non-controlled tablets into the receptacle. The reverse distributor pickup is scheduled in two weeks.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Empty the receptacle into regular trash when full to avoid overflow",
      "Maintain the receptacle per DEA collector rules, secure contents until approved pickup/destruction, and document transfers",
      "Sort returned controlled substances back onto dispensable shelves if packaging is intact",
      "Allow patients to retrieve medications from the receptacle if they change their mind without logging access"
    ),
    "Maintain the receptacle per DEA collector rules, secure contents until approved pickup/destruction, and document transfers",
    `Authorized collection receptacles require secure storage, documented destruction or reverse-distributor transfer, and no restocking or unlogged patient retrieval. Regular trash disposal violates DEA collector requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA_DISPOSAL],
      tags: ["take-back", "DEA-disposal", "collection-receptacle", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 62-year-old hospice nurse asks the pharmacy to accept 40 partially used fentanyl patches from a deceased patient for destruction during a community take-back event tomorrow. The PIC is unsure whether patches require special handling beyond standard collection.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept patches in standard collection without special handling because all returns are identical",
      "Accept returns only through authorized take-back procedures with secure handling, product-specific counseling on patch disposal, and DEA-compliant destruction pathways",
      "Refuse all patch returns and instruct the nurse to flush them at home without guidance",
      "Return patches to wholesale inventory if seals appear intact"
    ),
    "Accept returns only through authorized take-back procedures with secure handling, product-specific counseling on patch disposal, and DEA-compliant destruction pathways",
    `Used fentanyl patches require secure authorized collection and product-specific disposal guidance — not undifferentiated handling, home flushing without counseling, or restocking returns.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA_DISPOSAL],
      tags: ["take-back", "DEA-disposal", "fentanyl", "patch", ...PE],
    }
  ),

  // ── OBRA Equivalent Drug Selection (3) ────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 67-year-old Medicaid patient presents a prescription for brand simvastatin 20 mg with no dispense-as-written notation. State law permits substitution with a therapeutically equivalent generic. The pharmacy's Medicaid contract requires use of the preferred generic unless the patient or prescriber selects otherwise.`,
    "What is the pharmacist's most appropriate action under OBRA and state substitution rules?",
    opts4(
      "Dispense brand automatically because Medicaid pays either product",
      "Dispense the appropriate therapeutically equivalent generic unless DAW or valid exception applies, document substitution, and offer counseling on the new prescription",
      "Substitute a different statin class member without prescriber approval",
      "Bill brand and dispense generic without documenting substitution"
    ),
    "Dispense the appropriate therapeutically equivalent generic unless DAW or valid exception applies, document substitution, and offer counseling on the new prescription",
    `OBRA-aligned Medicaid dispensing and state substitution law support therapeutically equivalent generic selection when permitted — with documentation and offer-to-counsel. Automatic brand dispensing, therapeutic class switches without approval, or undisclosed substitution violate rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [OBRA],
      tags: ["OBRA", "generic-substitution", "Medicaid", "equivalent-drug", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Permitted generic substitution requires documented equivalent product selection and offer-to-counsel.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 59-year-old patient refuses the pharmacist's selection of an A-rated generic substitute for metoprolol succinate 50 mg extended-release, stating the color change causes anxiety. The prescription has no DAW code and state law allows substitution when not prohibited.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Force generic substitution because state law permits it regardless of patient preference",
      "Document the patient's refusal, dispense as clinically and legally appropriate after discussing options with the patient and prescriber if needed, and offer counseling",
      "Dispense brand without contacting the prescriber and bill Medicaid as generic",
      "Cancel the prescription without documentation"
    ),
    "Document the patient's refusal, dispense as clinically and legally appropriate after discussing options with the patient and prescriber if needed, and offer counseling",
    `Patient refusal of generic substitution requires documentation and prescriber coordination when brand dispensing is requested — not forced substitution, misbilling, or undocumented cancellation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["OBRA", "generic-substitution", "patient-refusal", "equivalent-drug", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 74-year-old nursing home patient receives a new prescription for lisinopril 10 mg through a Medicaid vendor pharmacy. OBRA requires prospective drug use review before dispensing. The dispensing system flags a duplicate ACE inhibitor on the medication profile from another prescriber.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense immediately because the facility nurse confirmed the order",
      "Perform prospective DUR, resolve the duplicate therapy alert with prescriber or facility communication as needed, document the intervention, and dispense only when appropriate",
      "Override all alerts without review to meet delivery deadlines",
      "Substitute a different antihypertensive class without prescriber contact"
    ),
    "Perform prospective DUR, resolve the duplicate therapy alert with prescriber or facility communication as needed, document the intervention, and dispense only when appropriate",
    `OBRA Medicaid requirements mandate prospective DUR before dispensing. Duplicate therapy alerts require pharmacist resolution and documentation — not blind overrides, nurse-only confirmation, or unilateral therapeutic substitution.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["OBRA", "DUR", "Medicaid", "duplicate-therapy", ...PE],
    }
  ),

  // ── Pharmacy Liability / Negligence (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 71-year-old patient returns after taking a dispensed medication for three days and reports the tablets look different from prior fills. Profile review shows the pharmacy dispensed glyburide 5 mg instead of the prescribed glipizide 5 mg. The patient is asymptomatic but distressed.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the patient to continue the incorrect medication until the original prescriber returns from vacation",
      "Recognize the dispensing error, assess patient safety, notify the prescriber, document the event, provide correct therapy, and follow internal error-reporting and patient notification procedures",
      "Replace the product silently without documentation to avoid liability",
      "Blame the prescriber for unclear handwriting and take no further action"
    ),
    "Recognize the dispensing error, assess patient safety, notify the prescriber, document the event, provide correct therapy, and follow internal error-reporting and patient notification procedures",
    `Wrong-drug dispensing creates negligence exposure and patient harm risk. Pharmacists must assess safety, notify prescribers, document events, and correct therapy — not continue errors, conceal mistakes, or deflect without action.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["negligence", "dispensing-error", "standard-of-care", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Wrong-drug errors require safety assessment, prescriber notification, documentation, and correction.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 65-year-old patient on warfarin 5 mg daily and a new prescription for trimethoprim-sulfamethoxazole DS is dispensed without interaction screening. The patient develops bleeding requiring hospitalization. Chart review shows the interaction alert was overridden without pharmacist documentation.`,
    "What is the pharmacist's most appropriate action when this event is discovered?",
    opts4(
      "Delete the override record because the hospitalization already occurred",
      "Document the event, participate in quality review, implement corrective action, and cooperate with patient notification and risk-management processes per policy",
      "Assert that drug interactions are solely the prescriber's responsibility and take no internal action",
      "Refill warfarin early without addressing the adverse event"
    ),
    "Document the event, participate in quality review, implement corrective action, and cooperate with patient notification and risk-management processes per policy",
    `Failure to resolve significant DUR interactions may breach the standard of care. Discovered harm requires documentation, quality review, and corrective action — not record deletion, full prescriber deflection, or ignoring the adverse outcome.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["negligence", "DUR", "drug-interaction", "standard-of-care", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 58-year-old patient with low health literacy picks up a new high-risk medication. The pharmacy has no record that offer-to-counsel was provided. The patient later administers the drug incorrectly and suffers harm. State law and OBRA require offer-to-counsel documentation on new prescriptions.`,
    "What is the pharmacist's most appropriate action regarding the incident and future practice?",
    opts4(
      "Create a backdated counseling note stating the patient declined counseling",
      "Report and document the incident honestly, review counseling workflows, and ensure offer-to-counsel and documentation occur on all new prescriptions going forward",
      "Discontinue high-risk medications for patients who cannot read labels",
      "Delegate all counseling documentation to cashiers to improve throughput"
    ),
    "Report and document the incident honestly, review counseling workflows, and ensure offer-to-counsel and documentation occur on all new prescriptions going forward",
    `Failure to offer and document counseling on new prescriptions may support negligence claims when harm occurs. Backdated records, discriminatory refusal, and non-pharmacist documentation violate professional and legal standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OBRA],
      tags: ["negligence", "offer-to-counsel", "standard-of-care", ...PE],
    }
  ),

  // ── Georgia (2) ───────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 50-year-old pharmacist licensed in Alabama begins dispensing at an Atlanta chain pharmacy before obtaining a Georgia pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Georgia licensure?",
    opts4(
      "Continue dispensing under the Alabama license until Georgia approves",
      "Obtain a Georgia pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Georgia board licensure",
      "Work as an unregistered clerk to bypass licensure requirements"
    ),
    "Obtain a Georgia pharmacist license through the board before practicing in the state",
    `Georgia requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Georgia pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "GA",
      difficulty: 2,
      references: [GA_REF],
      tags: ["georgia", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 69-year-old patient requests a pneumococcal vaccine at a Savannah pharmacy. The pharmacist completed Georgia-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Georgia protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Georgia protocol requirements",
    `Georgia authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "GA",
      difficulty: 2,
      references: [GA_REF],
      tags: ["georgia", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── South Carolina (2) ────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Charleston picks up a new prescription for a high-risk medication. South Carolina community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `South Carolina community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SC",
      difficulty: 2,
      references: [SC_REF],
      tags: ["south-carolina", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient requests an influenza vaccine at a Columbia pharmacy. The pharmacist holds valid South Carolina immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per South Carolina protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per South Carolina protocol requirements",
    `South Carolina authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate South Carolina access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SC",
      difficulty: 2,
      references: [SC_REF],
      tags: ["south-carolina", "immunization", "influenza", ...PE],
    }
  ),

  // ── North Carolina (2) ────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 46-year-old pharmacist licensed in Virginia begins dispensing at a Charlotte retail pharmacy before receiving a North Carolina pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding North Carolina licensure?",
    opts4(
      "Continue dispensing under the Virginia license until North Carolina approves",
      "Obtain a North Carolina pharmacist license before practicing in the state",
      "Register with DEA only and defer North Carolina board licensure",
      "Work as a pharmacy intern indefinitely without North Carolina licensure"
    ),
    "Obtain a North Carolina pharmacist license before practicing in the state",
    `North Carolina requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates North Carolina pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NC",
      difficulty: 2,
      references: [NC_REF],
      tags: ["north-carolina", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient requests a shingles vaccine at a Raleigh pharmacy. The pharmacist holds valid North Carolina immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per North Carolina protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per North Carolina protocol requirements",
    `North Carolina authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NC",
      difficulty: 2,
      references: [NC_REF],
      tags: ["north-carolina", "immunization", "shingles", ...PE],
    }
  ),
];
