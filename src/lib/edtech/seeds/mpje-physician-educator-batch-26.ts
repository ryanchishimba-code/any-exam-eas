/**
 * Curated MPJE-style items — physician-educator batch 26.
 * Topics: USP <797> sterile BUD, FDA personal importation, PBM clawback appeals,
 * patient assistance program compliance, NV/ND/SD state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-26";
const PE = ["physician-educator", BATCH, "mpje"];

const USP797 = { label: "USP <797> Sterile Compounding", citation: "USP-NF <797>" };
const FDA_IMPORT = {
  label: "FDA Personal Importation Policy",
  url: "https://www.fda.gov/industry/import-basics/personal-importation",
};
const CMS_PBM = {
  label: "CMS Medicare Part D / PBM Oversight",
  url: "https://www.cms.gov/medicare/prescription-drug-coverage",
};
const NV_REF = {
  label: "Nevada Pharmacy Laws",
  citation: "Nev. Rev. Stat. § 639 et seq.",
};
const ND_REF = {
  label: "North Dakota Pharmacy Practice Act",
  citation: "N.D. Cent. Code § 19-03.1-01 et seq.",
};
const SD_REF = {
  label: "South Dakota Pharmacy Practice Act",
  citation: "S.D. Codified Laws § 36-11 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_26: EnrichedBankItem[] = [
  // ── USP <797> Sterile BUD (3) ───────────────────────────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 59-year-old hospital pharmacist discovers a batch of refrigerated sterile compounded preparations labeled with a 45-day beyond-use date was stored in a patient-care unit refrigerator that averaged 12°C for 72 hours during a weekend equipment failure.`,
    "What is the pharmacist's most appropriate action under USP <797>?",
    opts4(
      "Continue dispensing because the labeled BUD has not expired",
      "Quarantine the batch, assess the temperature excursion against BUD and stability assumptions, and do not dispense until compliance is confirmed or the batch is discarded",
      "Relabel with a new BUD without stability review",
      "Transfer the batch to another unit to simplify documentation"
    ),
    "Quarantine the batch, assess the temperature excursion against BUD and stability assumptions, and do not dispense until compliance is confirmed or the batch is discarded",
    `USP <797> BUD depends on labeled storage conditions being maintained. Temperature excursions require quarantine and assessment — not dispensing based on unexpired labels alone, arbitrary relabeling, or unit transfers to avoid documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP797],
      tags: ["USP-797", "BUD", "sterile", "cold-chain", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Sterile CSP BUD requires maintained storage conditions — excursions trigger quarantine and reassessment.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 48-year-old compounding supervisor assigns a 13-day room-temperature beyond-use date to a medium-risk sterile preparation prepared in an ISO Class 5 PEC without completing required sterility testing or Category 3 stability documentation. Staff cite a similar hospital using 30-day dating.`,
    "What is the pharmacist's most appropriate BUD assignment?",
    opts4(
      "Match the other hospital's 30-day label to stay competitive",
      "Assign BUD within applicable USP <797> default limits for the compounding category unless valid supporting stability data justify extended dating",
      "Omit BUD because the product will be used within one week",
      "Use API manufacturer expiration dates for the final CSP label"
    ),
    "Assign BUD within applicable USP <797> default limits for the compounding category unless valid supporting stability data justify extended dating",
    `USP <797> BUD must reflect compounding risk category and supporting data — not competitor labels, use-within-a-week assumptions, or bulk API expiration alone.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP797],
      tags: ["USP-797", "BUD", "sterile", "medium-risk", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 52-year-old board inspector requests media-fill and personnel competency records for staff preparing sterile syringes. One technician failed the most recent media fill but continued compounding yesterday because of staffing shortages.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow continued compounding because media fills are optional in staffing emergencies",
      "Remove the failing technician from sterile compounding duties, investigate affected batches, and complete remediation per USP <797> and board rules",
      "Backdate a passing media fill result to avoid batch waste",
      "Transfer the technician to non-sterile compounding without documentation"
    ),
    "Remove the failing technician from sterile compounding duties, investigate affected batches, and complete remediation per USP <797> and board rules",
    `Failed media fills prohibit sterile compounding until remediation — not emergency exceptions, backdated records, or silent role changes without investigation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [USP797],
      tags: ["USP-797", "media-fill", "sterile", "competency", ...PE],
    }
  ),

  // ── FDA Personal Importation (3) ──────────────────────────────────────────
  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 67-year-old patient asks the pharmacy to dispense a three-month supply of a maintenance drug imported from an online Canadian pharmacy. The product arrives in original foreign labeling without a U.S. prescription and the patient has no valid domestic prescription on file.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the imported drug because personal importation is always legal for seniors",
      "Decline to dispense or transfer foreign product without valid U.S. prescription and lawful sourcing; counsel on obtaining a valid domestic prescription and lawful access pathways",
      "Relabel the foreign product as a generic substitute without prescriber contact",
      "Bill the patient's Medicare plan using a U.S. NDC for the foreign product"
    ),
    "Decline to dispense or transfer foreign product without valid U.S. prescription and lawful sourcing; counsel on obtaining a valid domestic prescription and lawful access pathways",
    `FDA personal importation policies are limited and do not authorize pharmacies to dispense unverified foreign product without valid U.S. prescriptions. Relabeling, NDC misbilling, and blanket senior exemptions violate federal and payer rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_IMPORT],
      tags: ["personal-importation", "FDA", "foreign-product", ...PE],
      related: {
        reviewModuleSlug: "federal-pharmacy-law",
        keyTakeaway:
          "Pharmacies cannot dispense unverified imported drug without valid U.S. Rx and lawful sourcing.",
      },
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 44-year-old patient presents a U.S. prescription for an unapproved foreign-version insulin pen purchased abroad while traveling. The patient requests the pharmacy replace the foreign device with U.S. product using the same prescription.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Swap foreign insulin for U.S. product without verifying prescription validity and product-specific prescribing",
      "Verify the prescription, assess whether substitution to an FDA-approved product requires prescriber clarification, and dispense only lawful U.S.-approved product per prescription and state law",
      "Dispense the foreign insulin because the patient already paid for it",
      "Import additional foreign insulin for the patient through the pharmacy wholesale account"
    ),
    "Verify the prescription, assess whether substitution to an FDA-approved product requires prescriber clarification, and dispense only lawful U.S.-approved product per prescription and state law",
    `Foreign unapproved products are not interchangeable with U.S. approved products without prescriber-directed substitution. Pharmacy wholesale import of foreign product for patients violates federal drug approval and import rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_IMPORT],
      tags: ["personal-importation", "FDA", "insulin", "unapproved-drug", ...PE],
    }
  ),

  mpjeCase(
    "federal-pharmacy-law",
    `Scenario: A 55-year-old patient asks the pharmacist to receive and store a mail shipment of prescription medication from an unlicensed overseas internet pharmacy until the patient returns from travel. The shipment lacks U.S. pedigree and valid domestic dispensing records.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Store the shipment in the pharmacy will-call area as a favor",
      "Decline to accept or dispense unverified imported prescription drug shipments lacking lawful U.S. distribution documentation",
      "Repackage the foreign drug into U.S. vials to simplify pickup",
      "Bill insurance for the foreign shipment using a staff member's NPI"
    ),
    "Decline to accept or dispense unverified imported prescription drug shipments lacking lawful U.S. distribution documentation",
    `Pharmacies cannot serve as holding sites for unverified imported prescription drugs. Repackaging foreign product or insurance billing with misattributed NPIs violates federal import and fraud standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA_IMPORT],
      tags: ["personal-importation", "FDA", "internet-pharmacy", ...PE],
    }
  ),

  // ── PBM Clawback Appeals (3) ──────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 53-year-old independent pharmacy receives a PBM recoupment letter alleging MAC underpayment on 40 generic claims from eight months ago. The letter cites contract appeal deadlines that expire in 10 days. Purchase invoices show the pharmacy acquisition cost exceeded reimbursed MAC.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore the letter because recoupments older than six months are void",
      "Gather acquisition invoices, claim records, and contract terms and submit a timely MAC appeal per PBM procedures",
      "Backdate counseling notes to justify higher reimbursement",
      "Bill affected patients retroactively for the recouped amount"
    ),
    "Gather acquisition invoices, claim records, and contract terms and submit a timely MAC appeal per PBM procedures",
    `PBM MAC recoupments may be appealed with supporting acquisition documentation within contract deadlines — not ignored by arbitrary age limits, fabricated clinical records, or patient retro-billing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_PBM],
      tags: ["PBM", "clawback", "MAC-appeal", "recoupment", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "MAC recoupments require timely appeals with acquisition invoices — not patient retro-billing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old pharmacy manager receives a clawback demand for brand-drug claims where the PBM alleges available generic substitution was not used on 25 lisinopril-hydrochlorothiazide fills. Dispensing records show DAW codes and prescriber brand instructions on each claim.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the clawback because generics are always required",
      "Appeal with dispensing records, DAW documentation, and prescriber instructions demonstrating compliant brand billing",
      "Change historical claims in the system to generic NDCs without documentation",
      "Stop dispensing all combination antihypertensives to avoid future clawbacks"
    ),
    "Appeal with dispensing records, DAW documentation, and prescriber instructions demonstrating compliant brand billing",
    `PBM generic substitution clawbacks can be appealed with valid DAW and prescriber documentation — not blind acceptance, retroactive claim alteration, or therapeutic class abandonment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_PBM],
      tags: ["PBM", "clawback", "generic-substitution", "appeal", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old PIC missed a 30-day PBM appeal window for $12,000 in retroactive DIR-related recoupments on Part D claims. The PBM offers a 50 percent settlement if the pharmacy waives all future disputes on similar claims.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the settlement and waive all future dispute rights permanently",
      "Evaluate whether any late appeal or administrative review remains available, document the miss, and implement processes to meet future appeal deadlines — avoid broad waiver of legitimate dispute rights without counsel review",
      "Ignore the settlement because DIR is illegal",
      "Bill patients for the full recouped amount to recover losses"
    ),
    "Evaluate whether any late appeal or administrative review remains available, document the miss, and implement processes to meet future appeal deadlines — avoid broad waiver of legitimate dispute rights without counsel review",
    `Missed PBM appeal deadlines require documented remediation and careful evaluation of remaining options — not permanent waiver of dispute rights, blanket DIR illegality claims, or patient surcharges for payer recoupments.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS_PBM],
      tags: ["PBM", "clawback", "DIR-fees", "appeal", ...PE],
    }
  ),

  // ── Patient Assistance Program Compliance (3) ───────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old commercially insured patient uses a manufacturer copay card for a specialty biologic while enrolled in the pharmacy's patient assistance program (PAP) for the same medication. The manager proposes billing insurance for the full amount and applying both copay card and PAP credit on each fill.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill insurance, copay card, and PAP together on every fill to minimize patient cost",
      "Follow program and payer rules prohibiting impermissible copay card and PAP stacking or double recovery for the same fill",
      "Bill cash only and hide PAP enrollment from the payer",
      "Use the copay card for staff family members to exhaust fund balances"
    ),
    "Follow program and payer rules prohibiting impermissible copay card and PAP stacking or double recovery for the same fill",
    `Copay assistance and PAP benefits must comply with program anti-stacking rules — not triple recovery, concealed payer billing, or diversion to ineligible recipients.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["patient-assistance", "PAP", "copay-card", "stacking", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "PAP and copay card stacking on the same fill may violate program and payer rules.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 56-year-old patient on a manufacturer PAP for an oncology drug returns for refill. The pharmacy has no documentation of required annual income re-verification due this month. The patient states nothing changed financially.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the patient verbally confirms eligibility",
      "Complete required annual PAP re-verification documentation per program rules before dispensing under assistance",
      "Bill Medicare and update PAP status later",
      "Provide a 90-day bridge supply without program contact"
    ),
    "Complete required annual PAP re-verification documentation per program rules before dispensing under assistance",
    `PAP refills require current program re-verification when due — not verbal assurances alone, retroactive billing schemes, or undocumented bridge supplies.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["patient-assistance", "PAP", "re-verification", "documentation", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old uninsured patient needs a brand inhaler tonight. A manufacturer representative tells staff to dispense under PAP using a partial enrollment form and complete missing physician attestation after the weekend.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense tonight under incomplete PAP enrollment because the patient is symptomatic",
      "Complete required PAP enrollment and prescriber attestation per program rules before dispensing under assistance, or use other lawful access pathways",
      "Bill the patient full cash price without discussing assistance options",
      "Substitute a different inhaler class without prescriber contact and bill PAP"
    ),
    "Complete required PAP enrollment and prescriber attestation per program rules before dispensing under assistance, or use other lawful access pathways",
    `PAP dispensing requires complete enrollment documentation — urgency does not waive attestation requirements. Full cash billing without assistance discussion or unilateral therapeutic substitution with PAP billing violate program and professional standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["patient-assistance", "PAP", "enrollment", "attestation", ...PE],
    }
  ),

  // ── Nevada (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Las Vegas picks up a new prescription for a high-risk medication. Nevada community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Nevada community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NV",
      difficulty: 2,
      references: [NV_REF],
      tags: ["nevada", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests an influenza vaccine at a Reno pharmacy. The pharmacist holds valid Nevada immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Nevada protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Nevada protocol requirements",
    `Nevada authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Nevada access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NV",
      difficulty: 2,
      references: [NV_REF],
      tags: ["nevada", "immunization", "influenza", ...PE],
    }
  ),

  // ── North Dakota (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 50-year-old pharmacist licensed in Minnesota begins dispensing at a Fargo retail pharmacy before obtaining a North Dakota pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding North Dakota licensure?",
    opts4(
      "Continue dispensing under the Minnesota license until North Dakota approves",
      "Obtain a North Dakota pharmacist license before practicing in the state",
      "Register with DEA only and defer North Dakota board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a North Dakota pharmacist license before practicing in the state",
    `North Dakota requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate North Dakota pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ND",
      difficulty: 2,
      references: [ND_REF],
      tags: ["north-dakota", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old patient requests a pneumococcal vaccine at a Bismarck pharmacy. The pharmacist completed North Dakota-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per North Dakota protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per North Dakota protocol requirements",
    `North Dakota authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "ND",
      difficulty: 2,
      references: [ND_REF],
      tags: ["north-dakota", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── South Dakota (2) ──────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Sioux Falls picks up a new prescription at a community pharmacy. South Dakota aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `South Dakota community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SD",
      difficulty: 2,
      references: [SD_REF],
      tags: ["south-dakota", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests a shingles vaccine at a Rapid City pharmacy. The pharmacist holds valid South Dakota immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per South Dakota protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per South Dakota protocol requirements",
    `South Dakota authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SD",
      difficulty: 2,
      references: [SD_REF],
      tags: ["south-dakota", "immunization", "shingles", ...PE],
    }
  ),
];
