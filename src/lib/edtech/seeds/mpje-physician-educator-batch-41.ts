/**
 * Curated MPJE-style items — physician-educator batch 41.
 * Topics: 340B duplicate discount / contract pharmacy (deeper), auxiliary labeling / LEP,
 * NPI enrollment fraud, prescription validity red flags, AR/LA/MS state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-41";
const PE = ["physician-educator", BATCH, "mpje"];

const HRSA_340B = {
  label: "HRSA 340B Drug Pricing Program",
  url: "https://www.hrsa.gov/340b",
};
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const CMS = { label: "CMS Medicare Provider Enrollment (NPI)", url: "https://www.cms.gov" };
const AR_REF = {
  label: "Arkansas Pharmacy Practice Act",
  citation: "Ark. Code Ann. § 17-92 et seq.",
};
const LA_REF = {
  label: "Louisiana Pharmacy Practice Act",
  citation: "La. Rev. Stat. § 37:1160 et seq.",
};
const MS_REF = {
  label: "Mississippi Pharmacy Practice Act",
  citation: "Miss. Code Ann. § 73-21 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_41: EnrichedBankItem[] = [
  // ── 340B Duplicate Discount / Contract Pharmacy — Deeper (3) ──────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old 340B-eligible patient at a contract pharmacy uses a manufacturer copay card on a specialty medication also acquired at 340B pricing. Billing staff propose submitting the claim to commercial insurance at undiscounted rates while applying the copay card and retaining 340B spread without checking duplicate-discount rules.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Process the claim because copay cards are patient assistance unrelated to 340B",
      "Verify HRSA duplicate-discount prohibitions, copay-card stacking policies, and payer rules before 340B billing and copay assistance application",
      "Bill all 340B specialty claims as cash to avoid audit",
      "Share 340B savings with the prescriber as a referral fee"
    ),
    "Verify HRSA duplicate-discount prohibitions, copay-card stacking policies, and payer rules before 340B billing and copay assistance application",
    `340B duplicate-discount rules may prohibit combining undiscounted payer billing, copay cards, and 340B acquisition on the same fill — verification is required. Cash conversion and prescriber kickbacks violate HRSA integrity standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [HRSA_340B],
      tags: ["340B", "duplicate-discount", "contract-pharmacy", "copay-assistance", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "340B fills with copay cards require duplicate-discount and stacking verification before billing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old covered entity child site refers patients to a contract pharmacy across town. Corporate policy instructs staff to treat every patient who mentions the clinic name as 340B-eligible without verifying outpatient encounter records or current patient definition requirements.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill all clinic-mention patients under 340B to maximize entity revenue",
      "Confirm current 340B patient definition and documented covered-entity relationship before 340B dispensing at the contract pharmacy",
      "Allow technicians to determine 340B eligibility from patient self-report alone",
      "Divert 340B inventory to non-eligible employees at employee pricing"
    ),
    "Confirm current 340B patient definition and documented covered-entity relationship before 340B dispensing at the contract pharmacy",
    `340B contract pharmacy dispensing requires verified patient definition and entity relationship — not clinic-name self-report alone, technician-only eligibility, or employee diversion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [HRSA_340B],
      tags: ["340B", "contract-pharmacy", "patient-eligibility", "child-site", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient receives a 340B specialty drug at a contract pharmacy with Medicaid carve-out billing. The state Medicaid program later invoices the pharmacy alleging a duplicate discount because the covered entity also received Medicaid reimbursement for the same outpatient encounter drug budget line.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore the invoice because 340B savings belong to the entity",
      "Review Medicaid carve-out/carve-in documentation, replenishment records, and HRSA duplicate-discount policies; respond accurately and remediate billing pathways if duplicate discounts occurred",
      "Destroy 340B invoices to prevent future duplicate-discount findings",
      "Bill future Medicaid 340B claims as cash without patient disclosure"
    ),
    "Review Medicaid carve-out/carve-in documentation, replenishment records, and HRSA duplicate-discount policies; respond accurately and remediate billing pathways if duplicate discounts occurred",
    `Medicaid 340B duplicate-discount allegations require record review and accurate remediation — not ignored invoices, record destruction, or undisclosed cash conversion.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [HRSA_340B],
      tags: ["340B", "Medicaid", "duplicate-discount", "contract-pharmacy", "audit", ...PE],
    }
  ),

  // ── Auxiliary Labeling / Limited English Proficiency (3) ────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old Spanish-speaking patient with limited English proficiency picks up a new warfarin prescription. The primary label is in English only and no auxiliary bleeding-risk labels are applied. The patient nods when asked if they understand but does not request an interpreter.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Release the prescription because the patient did not request an interpreter",
      "Offer a qualified interpreter or language-access services, apply required auxiliary labels, and provide counseling on bleeding risk and consistent timing before release",
      "Give the patient a translated pamphlet only without pharmacist counseling",
      "Allow the cashier to explain directions in informal Spanish without documentation"
    ),
    "Offer a qualified interpreter or language-access services, apply required auxiliary labels, and provide counseling on bleeding risk and consistent timing before release",
    `LEP patients require meaningful language access and high-risk auxiliary labeling — not passive acceptance of nods, pamphlet-only substitutes, or unqualified staff counseling without documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["auxiliary-label", "LEP", "counseling", "language-access", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "LEP patients need language access plus high-risk auxiliary labels — nods alone are insufficient.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old patient with limited English proficiency receives a refrigerated antibiotic suspension. The pharmacy has bilingual auxiliary label templates but staff skip them to save time during a busy shift, relying on the English directions line "shake well and refrigerate."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Skip translated auxiliary labels because the drug name indicates liquid form",
      "Apply appropriate auxiliary labels including refrigeration and shake-well warnings in an accessible format and counsel using language-access services when needed",
      "Refuse to dispense to LEP patients without a family translator present",
      "Print English-only labels and tell the patient to use a phone app later"
    ),
    "Apply appropriate auxiliary labels including refrigeration and shake-well warnings in an accessible format and counsel using language-access services when needed",
    `Refrigerated suspensions require auxiliary storage labels and accessible counseling for LEP patients — not English-only shortcuts, blanket refusal, or deferred app translation without pharmacist counseling.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["auxiliary-label", "LEP", "labeling", "counseling", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 44-year-old patient asks for prescription labels and auxiliary warnings in Vietnamese for a new methotrexate weekly regimen. The pharmacy can produce English auxiliary labels immediately but needs time to generate a verified translated label template.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense immediately with English-only labels because translation takes too long",
      "Use available language-access resources, provide verified translated labeling or qualified interpretation when feasible, and ensure high-risk counseling before release",
      "Tell the patient to return next week without any interim counseling",
      "Allow a bilingual technician to change the prescribed weekly directions to daily for easier translation"
    ),
    "Use available language-access resources, provide verified translated labeling or qualified interpretation when feasible, and ensure high-risk counseling before release",
    `High-risk medications require timely language access and accurate counseling — not English-only delay, abandonment without counseling, or unauthorized regimen changes for translation convenience.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["auxiliary-label", "LEP", "methotrexate", "language-access", ...PE],
    }
  ),

  // ── NPI / Provider Enrollment Fraud (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 51-year-old pharmacist discovers Part D immunization claims were submitted under the pharmacist's NPI for vaccine events at a new satellite clinic before CMS enrollment and state protocol approval were completed for that practice location.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Keep billing because the NPI belongs to the pharmacist personally",
      "Stop improper billing, complete required CMS and state enrollment for the practice location, and remediate or self-report inaccurate claims per compliance policy",
      "Bill under a technician's name until enrollment finishes",
      "Backdate enrollment forms to match prior claim dates"
    ),
    "Stop improper billing, complete required CMS and state enrollment for the practice location, and remediate or self-report inaccurate claims per compliance policy",
    `Medicare billing requires valid enrollment for the service location — not personal NPI ownership alone, technician attribution, or backdated enrollment forms.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CMS],
      tags: ["NPI", "Medicare", "enrollment", "billing-fraud", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Medicare billing requires valid enrollment at the service location — not NPI use before approval.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old pharmacy owner asks a relief pharmacist to remain listed as the enrolled Part D provider of record while the owner performs all clinical MTM services using the relief pharmacist's NPI because the owner's application was denied for prior compliance issues.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow NPI lending because the owner is clinically experienced",
      "Refuse to lend NPI credentials for services not personally performed; ensure enrollment and billing reflect the licensed pharmacist actually providing the service",
      "Bill under a random active NPI from another store in the chain",
      "Bill MTM as cash without any provider identifier"
    ),
    "Refuse to lend NPI credentials for services not personally performed; ensure enrollment and billing reflect the licensed pharmacist actually providing the service",
    `NPI and CMS enrollment require that billed services are performed by the enrolled licensed provider — not credential lending, random NPI use, or unidentifiable cash billing to hide fraud.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["NPI", "Medicare", "MTM", "enrollment", "billing-fraud", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old pharmacist receives a CMS revalidation notice for Medicare Part D provider enrollment. The pharmacy manager instructs staff to submit revalidation using the pharmacist's NPI while listing a non-pharmacist owner as the clinical services contact who will continue billing immunizations without pharmacist oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Submit revalidation as instructed because CMS rarely audits contacts",
      "Ensure revalidation accurately reflects licensed pharmacist oversight and services actually performed; refuse false attestation of non-pharmacist clinical billing authority",
      "Deactivate the pharmacy NPI and bill all services as cash permanently",
      "Transfer the NPI to the owner's relative without board approval"
    ),
    "Ensure revalidation accurately reflects licensed pharmacist oversight and services actually performed; refuse false attestation of non-pharmacist clinical billing authority",
    `CMS revalidation requires accurate representation of licensed oversight and services — not false contacts, permanent cash evasion, or unauthorized NPI transfer.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["NPI", "Medicare", "enrollment", "revalidation", "billing-fraud", ...PE],
    }
  ),

  // ── Prescription Validity Red Flags — Deeper (3) ────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 41-year-old patient presents a prescription for amphetamine/dextroamphetamine 30 mg tablets from a prescriber whose state medical license shows active status but DEA registration expired last month. The prescription is dated yesterday and transmitted as a traditional written order.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because the state medical license is active",
      "Withhold dispensing until valid DEA registration and prescription authenticity are verified with the prescriber or appropriate authority",
      "Dispense a 3-day supply because the patient is established",
      "Accept a screenshot of the prescriber's old DEA certificate"
    ),
    "Withhold dispensing until valid DEA registration and prescription authenticity are verified with the prescriber or appropriate authority",
    `Controlled substance prescriptions require valid prescriber DEA registration — active state licensure alone, partial dispensing, or outdated certificate images do not satisfy federal validity requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["prescription-validity", "red-flags", "DEA-registration", "C-II", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Expired prescriber DEA registration is a validity red flag — verify before dispensing controlled substances.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 36-year-old patient presents two new prescriptions for hydrocodone/acetaminophen from different prescribers dated the same day with overlapping quantities. PDMP shows fills at another pharmacy two days ago. The patient states one prescriber is a dentist and the other is primary care for unrelated pain.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense both because each prescription is individually valid",
      "Review PDMP data, assess duplicate therapy and validity red flags, contact prescribers as needed, and document corresponding-responsibility judgment before dispensing",
      "Dispense only the dentist prescription without further review",
      "Refuse all future prescriptions from either prescriber permanently without documentation"
    ),
    "Review PDMP data, assess duplicate therapy and validity red flags, contact prescribers as needed, and document corresponding-responsibility judgment before dispensing",
    `Same-day overlapping opioid prescriptions from multiple prescribers require PDMP review and prescriber clarification — not automatic dual dispensing, selective dispensing without review, or undocumented permanent bans.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["prescription-validity", "red-flags", "PDMP", "duplicate-therapy", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 7-year-old patient presents a handwritten prescription for amoxicillin oral suspension dosed at 90 mg/kg/day, which exceeds usual pediatric labeling for the child's weight documented on the prescription. The parent states the urgent care physician was rushing and cannot be reached tonight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense as written because the prescriber calculated the dose",
      "Contact the prescriber or covering provider to verify the unusual pediatric dose before dispensing; document professional judgment if verification is unsuccessful",
      "Reduce the dose independently to standard pediatric labeling",
      "Dispense half the quantity to reduce risk without prescriber contact"
    ),
    "Contact the prescriber or covering provider to verify the unusual pediatric dose before dispensing; document professional judgment if verification is unsuccessful",
    `Implausible pediatric dosing is a prescription validity red flag requiring prescriber verification — not blind dispensing, unilateral dose reduction, or partial quantity without clarification.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["prescription-validity", "red-flags", "pediatric", "dosing", ...PE],
    }
  ),

  // ── Arkansas (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 66-year-old patient requests a pneumococcal vaccine at a Little Rock pharmacy. The pharmacist completed Arkansas-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Arkansas protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Arkansas protocol requirements",
    `Arkansas authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate Arkansas access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AR",
      difficulty: 2,
      references: [AR_REF],
      tags: ["arkansas", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Fayetteville presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets. Arkansas requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Arkansas PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with commercial insurance",
      "Query PDMP only for Schedule II drugs, not hydrocodone combination products",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Arkansas PDMP, document the review, and apply corresponding-responsibility judgment",
    `Arkansas requires pharmacists to query and document PDMP review before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "AR",
      difficulty: 3,
      references: [AR_REF],
      tags: ["arkansas", "PDMP", "PMP", ...PE],
    }
  ),

  // ── Louisiana (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old patient requests an influenza vaccine at a New Orleans pharmacy. The pharmacist completed Louisiana-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Louisiana protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Louisiana protocol requirements",
    `Louisiana authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Louisiana access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "LA",
      difficulty: 2,
      references: [LA_REF],
      tags: ["louisiana", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient in Baton Rouge presents a new prescription for tramadol 50 mg tablets. Louisiana requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Louisiana PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients paying cash",
      "Query PMP only for Schedule II drugs, not tramadol",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Louisiana PMP, document the review, and apply corresponding-responsibility judgment",
    `Louisiana requires pharmacists to query and document PMP review before dispensing controlled substances. Cash payment does not waive monitoring. Tramadol is controlled under federal and Louisiana schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "LA",
      difficulty: 3,
      references: [LA_REF],
      tags: ["louisiana", "PMP", "PDMP", ...PE],
    }
  ),

  // ── Mississippi (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient requests an influenza vaccine at a Jackson pharmacy. The pharmacist completed Mississippi-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Mississippi protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Mississippi protocol requirements",
    `Mississippi authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 2,
      references: [MS_REF],
      tags: ["mississippi", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 46-year-old patient in Gulfport presents a new prescription for oxycodone 5 mg tablets. Mississippi requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Mississippi PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Mississippi PMP, document the review, and apply corresponding-responsibility judgment",
    `Mississippi requires pharmacists to query and document PMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 3,
      references: [MS_REF],
      tags: ["mississippi", "PMP", "PDMP", ...PE],
    }
  ),
];
