/**
 * Curated MPJE-style items — physician-educator batch 40.
 * Topics: Ryan Haight in-person exam exceptions (deeper), USP <795> BUD/stability,
 * PBM DIR clawbacks (deeper), emergency preparedness, IA/MN/WI state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-40";
const PE = ["physician-educator", BATCH, "mpje"];

const RYAN_HAIGHT = {
  label: "Ryan Haight Online Pharmacy Consumer Protection Act",
  url: "https://www.dea.gov/press-releases/2023/05/09/dea-announces-extension-telemedicine-flexibilities",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const USP795 = { label: "USP <795> Nonsterile Compounding", citation: "USP-NF <795>" };
const CMS_DIR = {
  label: "CMS Medicare Part D / DIR Fee Guidance",
  url: "https://www.cms.gov/medicare/payment/part-d-plans/direct-and-indirect-remuneration-dir",
};
const IA_REF = {
  label: "Iowa Pharmacy Practice Act",
  citation: "Iowa Code § 155A et seq.",
};
const MN_REF = {
  label: "Minnesota Pharmacy Practice Act",
  citation: "Minn. Stat. § 151.01 et seq.",
};
const WI_REF = {
  label: "Wisconsin Pharmacy Practice Act",
  citation: "Wis. Stat. § 450.01 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_40: EnrichedBankItem[] = [
  // ── Ryan Haight In-Person Exam Exceptions — Deeper (3) ──────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 56-year-old hospice patient presents an EPCS prescription for morphine oral solution from a palliative care prescriber who has never examined the patient in person. The prescriber documents that the patient is homebound under hospice and cites a Ryan Haight hospice-related exception.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because hospice patients are exempt from all Ryan Haight requirements",
      "Verify whether a valid Ryan Haight or applicable telemedicine exception authorizes the prescription and confirm prescriber registration and hospice documentation before dispensing",
      "Require an in-person exam by the dispensing pharmacist before release",
      "Transfer the patient to an out-of-state mail-order pharmacy to avoid verification"
    ),
    "Verify whether a valid Ryan Haight or applicable telemedicine exception authorizes the prescription and confirm prescriber registration and hospice documentation before dispensing",
    `Hospice-related Ryan Haight exceptions require verification of applicable federal rules and documentation — not blanket hospice exemption, pharmacist in-person exams, or interstate transfer evasion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "telemedicine", "hospice", "in-person-exam", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Hospice CS prescribing may qualify for Ryan Haight exceptions — verify current federal rules and documentation before dispensing.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 42-year-old patient presents an EPCS prescription for testosterone cypionate from a telehealth clinic. The patient had an in-person evaluation with a referring primary care physician in the same state two months ago, but the telehealth prescriber who issued the controlled substance prescription has never seen the patient in person.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because any in-person exam by any physician satisfies Ryan Haight permanently",
      "Verify whether the referring in-person evaluation and current Ryan Haight telemedicine rules authorize the prescribing relationship before dispensing",
      "Dispense a 90-day supply to reduce telehealth paperwork",
      "Accept a patient-signed attestation that an in-person exam occurred without prescriber verification"
    ),
    "Verify whether the referring in-person evaluation and current Ryan Haight telemedicine rules authorize the prescribing relationship before dispensing",
    `Ryan Haight requires verification that applicable in-person evaluation and telemedicine rules support the prescribing relationship — not any prior in-person visit alone, extended supplies, or patient attestations without verification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "telemedicine", "in-person-exam", "referral", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 38-year-old patient at a Department of Veterans Affairs clinic in another state presents an EPCS prescription for alprazolam 0.5 mg tablets issued after a video visit with a VA prescriber. The patient has no documented prior in-person VA evaluation but states VA telehealth rules differ from civilian practice.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because all federal facility prescriptions are automatically valid in community pharmacies",
      "Verify prescriber authority, applicable Ryan Haight and federal telemedicine rules for the controlled substance, and state dispensing requirements before release",
      "Refuse all VA prescriptions without board permission",
      "Dispense half the quantity because the visit was virtual"
    ),
    "Verify prescriber authority, applicable Ryan Haight and federal telemedicine rules for the controlled substance, and state dispensing requirements before release",
    `Federal facility prescriptions still require verification of prescriber authority and Ryan Haight/telemedicine compliance — not automatic validity, blanket refusal, or partial dispensing without authorization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [RYAN_HAIGHT, DEA],
      tags: ["Ryan-Haight", "telemedicine", "federal-facility", "C-IV", ...PE],
    }
  ),

  // ── USP <795> Non-Sterile BUD / Stability (3) ───────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 59-year-old patient receives a non-sterile oral suspension compounded today in a water-containing vehicle. After compounding, staff add grape flavoring containing additional water without updating stability assumptions. The label still shows the default 14-day refrigerated BUD assigned before flavoring.`,
    "What is the pharmacist's most appropriate action regarding beyond-use dating?",
    opts4(
      "Leave the original BUD because flavoring is a minor change",
      "Reassess and assign BUD per USP <795> for the final formulation including added water and flavoring; do not use pre-flavoring dating",
      "Extend BUD to 90 days because flavoring improves palatability",
      "Remove the BUD from the label because the patient will use it quickly"
    ),
    "Reassess and assign BUD per USP <795> for the final formulation including added water and flavoring; do not use pre-flavoring dating",
    `Adding water-containing flavoring to non-sterile suspensions requires BUD reassessment for the final formulation — not unchanged default dating, arbitrary extension, or unlabeled BUD.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", "stability", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Post-compounding changes such as water-containing flavoring require USP <795> BUD reassessment.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 48-year-old compounding pharmacist prepares a 500 mL batch of non-sterile topical gel and repackages it into ten patient-specific jars three days later without new sterility or stability testing. Staff propose keeping the original batch BUD on all jars.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Apply the original batch BUD to all repackaged jars without reassessment",
      "Assign BUD per USP <795> based on repackaging time, container characteristics, and formulation limits; document the repackaging event",
      "Extend BUD on repackaged jars because the bulk batch remains unexpired",
      "Ship jars interstate without updating compounding records"
    ),
    "Assign BUD per USP <795> based on repackaging time, container characteristics, and formulation limits; document the repackaging event",
    `Repackaging non-sterile compounds requires BUD reassessment and documentation — not original batch dating alone, bulk-expiration extension, or undocumented interstate shipment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", "repackaging", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 65-year-old patient needs a non-sterile compounded capsule filled with crushed tablets of a commercially available product as the starting material. The pharmacist proposes a 180-day room-temperature BUD based solely on the commercial product expiration date.`,
    "What is the pharmacist's most appropriate beyond-use date assignment?",
    opts4(
      "Assign BUD per USP <795> category limits for the compounded dosage form and manipulations — not commercial product expiration alone",
      "Use the commercial expiration date because the API is identical",
      "Assign 24-month BUD because capsules are dry",
      "Omit BUD labeling because the patient is picking up today"
    ),
    "Assign BUD per USP <795> category limits for the compounded dosage form and manipulations — not commercial product expiration alone",
    `Non-sterile BUD for manipulated commercial products depends on compounding category and dosage form — not source product expiration alone, arbitrary long dating, or omitted labels.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP795],
      tags: ["USP-795", "BUD", "nonsterile", "manipulation", ...PE],
    }
  ),

  // ── PBM DIR Clawbacks — Deeper (3) ────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old Medicare Part D patient picks up a generic maintenance medication. Nine months later the pharmacy receives a DIR clawback reducing net reimbursement below zero on that claim. The PBM cites generic effective rate true-ups and requests proof the pharmacy did not collect excess patient cost sharing at the original point of sale.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill the patient retroactively for the full clawback amount",
      "Respond with authentic point-of-sale records, patient cost-sharing documentation, and lawful PBM appeal channels — do not impose prohibited retroactive patient surcharges",
      "Delete the original claim to eliminate the clawback",
      "Switch future fills to cash without informing the patient to avoid DIR"
    ),
    "Respond with authentic point-of-sale records, patient cost-sharing documentation, and lawful PBM appeal channels — do not impose prohibited retroactive patient surcharges",
    `Retroactive DIR clawbacks require authentic records and lawful appeals — not retroactive patient billing, claim deletion, or undisclosed cash conversion to evade DIR.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CMS_DIR],
      tags: ["DIR-fees", "PBM", "clawback", "generic-effective-rate", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Retroactive DIR clawbacks require authentic POS records and lawful appeals — not retroactive patient surcharges.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old pharmacy manager compares two therapeutically equivalent generic products for a Part D statin. One generic has lower point-of-sale reimbursement but historically lower retroactive DIR clawbacks. The manager instructs staff to default to the higher-reimbursement generic at adjudication while telling patients both are identical.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Default to the higher-reimbursement generic without disclosure because DIR is a business decision",
      "Select generics based on therapeutic equivalence, formulary, and patient need; address DIR through lawful contracting and appeals — not undisclosed reimbursement-driven product steering",
      "Counsel all patients to pay cash to avoid DIR entirely",
      "Bill the lower-DIR generic but dispense the higher-reimbursement product"
    ),
    "Select generics based on therapeutic equivalence, formulary, and patient need; address DIR through lawful contracting and appeals — not undisclosed reimbursement-driven product steering",
    `Generic selection must prioritize therapeutic equivalence and patient need — not undisclosed DIR optimization, mandatory cash conversion, or NDC/product mismatch fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "PBM", "clawback", "generic-substitution", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old independent pharmacy owner receives a quarterly PBM statement showing DIR fees exceeded initial generic reimbursement on 22 percent of Part D claims. The owner asks the pharmacist to create after-the-fact MTM and adherence documentation for those claims to reduce clawbacks in the next audit.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Create backdated MTM and adherence notes to match the PBM metrics",
      "Refuse falsified documentation; maintain contemporaneous records and pursue lawful DIR appeals and contract review with authentic data",
      "Stop dispensing all Part D generics until DIR is eliminated",
      "Destroy claims from the affected quarter to prevent audit exposure"
    ),
    "Refuse falsified documentation; maintain contemporaneous records and pursue lawful DIR appeals and contract review with authentic data",
    `DIR clawback mitigation requires contemporaneous authentic records and lawful appeals — not backdated MTM notes, program abandonment, or record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_DIR],
      tags: ["DIR-fees", "PBM", "clawback", "documentation", "fraud-prevention", ...PE],
    }
  ),

  // ── Emergency Preparedness / Disaster Supply (3) ──────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 70-year-old community pharmacy in a hurricane evacuation zone must close for 72 hours under mandatory order. Patients request emergency maintenance refills of antihypertensives and insulin. The PIC has mutual aid contact with a neighboring pharmacy but no board-approved disaster protocol on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense unlimited emergency refills without prescription verification",
      "Follow state board emergency/disaster procedures, coordinate authorized mutual aid or transfers when available, and document limited emergency supply per applicable rules",
      "Refuse all requests because the pharmacy is closed",
      "Allow technicians to authorize emergency refills independently"
    ),
    "Follow state board emergency/disaster procedures, coordinate authorized mutual aid or transfers when available, and document limited emergency supply per applicable rules",
    `Disaster closure requires board emergency procedures and documented limited supply — not unlimited unverified refills, blanket refusal, or technician-only authorization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-preparedness", "disaster", "continuity-of-care", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Disaster closure requires board emergency procedures and documented limited supply — not unlimited unverified refills.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old PIC must relocate critical prescription files and controlled substances during a wildfire evacuation. Cloud backups exist but the on-site server may be destroyed. Staff propose leaving paper CS perpetual inventory in the vault because relocation will take too long.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave controlled-substance records and inventory documentation behind to speed evacuation",
      "Secure and relocate controlled substances and critical dispensing records per the emergency plan and DEA/board requirements, using backups when on-site records are unavailable",
      "Abandon Schedule II inventory without documentation to reduce transport burden",
      "Transfer CS accountability verbally to the nearest open pharmacy without records"
    ),
    "Secure and relocate controlled substances and critical dispensing records per the emergency plan and DEA/board requirements, using backups when on-site records are unavailable",
    `Disaster evacuation requires securing CS and critical records — not leaving documentation behind, abandoning inventory, or verbal CS transfers without records.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["emergency-preparedness", "disaster", "controlled-substances", "records", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old pharmacy reopens after a flood damaged non-controlled inventory but left the refrigerator offline for 48 hours. Staff propose returning unaffected-looking insulin and biologics to saleable stock after wiping outer cartons.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Return wiped products to saleable stock if cartons appear dry",
      "Quarantine temperature-sensitive products, document the excursion, and follow manufacturer and CDC guidance before any restock or dispensing",
      "Donate all refrigerated drugs to staff to reduce waste",
      "Sell affected biologics at a discount to recover costs"
    ),
    "Quarantine temperature-sensitive products, document the excursion, and follow manufacturer and CDC guidance before any restock or dispensing",
    `Post-disaster cold-chain recovery requires quarantine and manufacturer/CDC guidance — not cosmetic wiping, staff donation, or discounted sale of potentially compromised biologics.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["emergency-preparedness", "disaster", "cold-chain", "inventory", ...PE],
    }
  ),

  // ── Iowa (2) ──────────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient requests a shingles vaccine at a Des Moines pharmacy. The pharmacist completed Iowa-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Iowa protocol requirements",
      "Refuse because shingles vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Iowa protocol requirements",
    `Iowa authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Iowa access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IA",
      difficulty: 2,
      references: [IA_REF],
      tags: ["iowa", "immunization", "shingles", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Cedar Rapids presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets. Iowa requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Iowa PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with commercial insurance",
      "Query PMP only for Schedule II drugs, not hydrocodone combination products",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Iowa PMP, document the review, and apply corresponding-responsibility judgment",
    `Iowa requires pharmacists to query and document PMP review before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "IA",
      difficulty: 3,
      references: [IA_REF],
      tags: ["iowa", "PMP", "PDMP", ...PE],
    }
  ),

  // ── Minnesota (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 68-year-old patient requests a pneumococcal vaccine at a Minneapolis pharmacy. The pharmacist completed Minnesota-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Minnesota protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Minnesota protocol requirements",
    `Minnesota authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MN",
      difficulty: 2,
      references: [MN_REF],
      tags: ["minnesota", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Rochester presents a new prescription for tramadol 50 mg tablets. Minnesota requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Minnesota PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients paying cash",
      "Query PMP only for Schedule II drugs, not tramadol",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Minnesota PMP, document the review, and apply corresponding-responsibility judgment",
    `Minnesota requires pharmacists to query and document PMP review before dispensing controlled substances. Cash payment does not waive monitoring. Tramadol is controlled under federal and Minnesota schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MN",
      difficulty: 3,
      references: [MN_REF],
      tags: ["minnesota", "PMP", "PDMP", ...PE],
    }
  ),

  // ── Wisconsin (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 60-year-old patient requests an influenza vaccine at a Milwaukee pharmacy. The pharmacist completed Wisconsin-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Wisconsin protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Wisconsin protocol requirements",
    `Wisconsin authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Wisconsin access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WI",
      difficulty: 2,
      references: [WI_REF],
      tags: ["wisconsin", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old patient in Madison presents a new prescription for oxycodone 5 mg tablets. Wisconsin requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Wisconsin PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with local prescribers",
      "Query PDMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Wisconsin PDMP, document the review, and apply corresponding-responsibility judgment",
    `Wisconsin requires pharmacists to query and document PDMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WI",
      difficulty: 3,
      references: [WI_REF],
      tags: ["wisconsin", "PDMP", ...PE],
    }
  ),
];
