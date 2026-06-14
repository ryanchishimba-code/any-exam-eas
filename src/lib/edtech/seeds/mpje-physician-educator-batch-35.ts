/**
 * Curated MPJE-style items — physician-educator batch 35.
 * Topics: PREP Act liability (deeper), lab interface critical values, therapeutic interchange,
 * whistleblower/mandatory reporting, TN/MO/MS state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-35";
const PE = ["physician-educator", BATCH, "mpje"];

const PREP = {
  label: "Public Readiness and Emergency Preparedness (PREP) Act",
  url: "https://aspr.hhs.gov/legal/PREPact/Pages/default.aspx",
};
const CLIA = {
  label: "Clinical Laboratory Improvement Amendments (CLIA)",
  url: "https://www.cms.gov/medicare/quality/clinical-laboratory-improvement-amendments",
};
const OIG = {
  label: "HHS Office of Inspector General",
  url: "https://oig.hhs.gov",
};
const TN_REF = {
  label: "Tennessee Pharmacy Practice Act",
  citation: "Tenn. Code Ann. § 63-10-101 et seq.",
};
const MO_REF = {
  label: "Missouri Pharmacy Practice Act",
  citation: "Mo. Rev. Stat. § 338 et seq.",
};
const MS_REF = {
  label: "Mississippi Pharmacy Practice Act",
  citation: "Miss. Code Ann. § 73-21-1 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_35: EnrichedBankItem[] = [
  // ── PREP Act Liability — Deeper (3) ───────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old pharmacist dispenses an FDA-authorized emergency use countermeasure oral antiviral to a 64-year-old patient during a declared public health emergency. The patient later alleges the pharmacy failed to provide the required EUA fact sheet and emergency use information at dispensing.`,
    "What is the pharmacist's most appropriate understanding of PREP Act and dispensing obligations?",
    opts4(
      "PREP Act immunity eliminates all patient counseling and EUA disclosure requirements",
      "Provide required EUA fact sheets and counseling at dispensing; PREP Act liability protections for covered persons do not eliminate mandatory EUA disclosure and documentation duties",
      "Refuse all EUA products because PREP Act immunity is unavailable at retail pharmacies",
      "Tell patients EUA products have the same labeling as fully approved drugs without additional disclosures"
    ),
    "Provide required EUA fact sheets and counseling at dispensing; PREP Act liability protections for covered persons do not eliminate mandatory EUA disclosure and documentation duties",
    `PREP Act immunity for covered countermeasures does not waive EUA fact sheet and counseling requirements at dispensing. Retail pharmacies may dispense authorized products with required disclosures — not immunity without documentation or misrepresenting EUA status.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [PREP],
      tags: ["PREP-Act", "EUA", "countermeasure", "counseling", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "PREP Act immunity does not eliminate EUA fact sheet and counseling requirements at dispensing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old pharmacy technician asks whether PREP Act protections apply when they independently select and bag OTC emergency countermeasure test kits for patient pickup without pharmacist verification during a declared emergency.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow technician-only countermeasure dispensing because PREP Act eliminates pharmacist duties",
      "Ensure pharmacist oversight, protocol compliance, and documentation for covered countermeasure dispensing; PREP Act does not authorize unverified technician-only dispensing of covered products",
      "Remove all countermeasures from the pharmacy because technicians cannot touch emergency stock",
      "Bill countermeasures as general merchandise to avoid PREP Act requirements"
    ),
    "Ensure pharmacist oversight, protocol compliance, and documentation for covered countermeasure dispensing; PREP Act does not authorize unverified technician-only dispensing of covered products",
    `PREP Act protections for covered countermeasures require appropriate professional oversight and protocol compliance — not technician-only dispensing, product removal, or merchandise misclassification to evade duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [PREP],
      tags: ["PREP-Act", "countermeasure", "technician-scope", "supervision", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old pharmacist administered covered PREP Act countermeasure immunizations during a declared emergency that ended six months ago. A patient now sues for alleged injection-site injury and asks whether PREP Act immunity still applies to that administration.`,
    "What is the pharmacist's most appropriate understanding?",
    opts4(
      "PREP Act immunity never applies after any emergency declaration ends for any prior act",
      "PREP Act immunity for covered countermeasure administration generally applies to eligible activities during the covered period when requirements were met; post-emergency routine vaccinations return to standard liability frameworks",
      "PREP Act immunity applies permanently to all vaccines once any emergency was declared",
      "PREP Act immunity requires the patient to sign a waiver releasing all documentation requirements"
    ),
    "PREP Act immunity for covered countermeasure administration generally applies to eligible activities during the covered period when requirements were met; post-emergency routine vaccinations return to standard liability frameworks",
    `PREP Act immunity attaches to covered countermeasures administered consistent with emergency authorization during applicable periods — not permanent blanket immunity, retroactive denial for all prior acts, or waiver-based documentation elimination.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [PREP],
      tags: ["PREP-Act", "countermeasure", "liability", "immunization", ...PE],
    }
  ),

  // ── Lab Interface Critical Values — Deeper (3) ────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient on lisinopril 40 mg daily and spironolactone 25 mg daily picks up refills. The pharmacy lab interface flags a critical potassium of 6.1 mEq/L from yesterday's hospital draw. The patient denies symptoms and wants to leave quickly.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense refills because the patient denies symptoms",
      "Withhold or delay dispensing as clinically indicated, urgently contact the prescriber regarding the critical hyperkalemia, and document the DUR intervention",
      "Discontinue both medications independently without prescriber contact",
      "Ignore the interface alert because outpatient pharmacies never act on inpatient labs"
    ),
    "Withhold or delay dispensing as clinically indicated, urgently contact the prescriber regarding the critical hyperkalemia, and document the DUR intervention",
    `Critical interfaced potassium values with ACE inhibitor and spironolactone therapy require urgent prescriber contact and documented intervention — not symptom-only dispensing, unilateral discontinuation, or ignoring available lab data.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CLIA],
      tags: ["clinical-laboratory", "critical-value", "potassium", "DUR", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Critical interfaced potassium with interacting therapy requires urgent prescriber contact — not silent refilling.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 54-year-old patient on atorvastatin 80 mg daily has an interfaced alert showing AST 220 U/L and ALT 310 U/L marked critical from a clinic draw this morning. The patient is due for a refill and reports mild fatigue but no abdominal pain.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the refill because the patient lacks abdominal pain",
      "Assess hepatic lab implications for statin therapy, contact the prescriber before dispensing if clinically indicated, and document the intervention",
      "Switch to a different statin independently without prescriber authorization",
      "Disable all lab interface alerts for statin patients to reduce workflow burden"
    ),
    "Assess hepatic lab implications for statin therapy, contact the prescriber before dispensing if clinically indicated, and document the intervention",
    `Critical hepatic enzyme elevations on statin therapy require clinical assessment and prescriber contact when indicated — not pain-only dispensing, independent statin switches, or alert disablement.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CLIA],
      tags: ["clinical-laboratory", "critical-value", "hepatotoxicity", "statin", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old MTM patient signed a form declining pharmacy access to electronic lab results, but the interface still delivers a critical INR of 5.8 for a patient on warfarin 7.5 mg daily with a refill due today.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore the result because the patient declined lab data sharing",
      "Treat the critical INR as a patient safety issue, attempt to reach the patient and prescriber per policy, withhold or adjust dispensing as indicated, and document the intervention",
      "Post the INR on the pharmacy pickup screen to notify other patients to help locate the patient",
      "Dispense warfarin and tell the patient to get labs next month"
    ),
    "Treat the critical INR as a patient safety issue, attempt to reach the patient and prescriber per policy, withhold or adjust dispensing as indicated, and document the intervention",
    `Critical safety values may require intervention even when general lab sharing is declined — not passive ignoring, public PHI display, or routine dispensing without action on supratherapeutic INR.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CLIA],
      tags: ["clinical-laboratory", "critical-value", "INR", "warfarin", ...PE],
    }
  ),

  // ── Therapeutic Interchange — Deeper (3) ────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 63-year-old patient presents a prescription for clopidogrel 75 mg daily. The pharmacy's expired therapeutic interchange protocol would have substituted generic prasugrel with prescriber notification, but the protocol renewal lapsed last month.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Substitute prasugrel because the protocol existed previously",
      "Dispense clopidogrel as written unless a current authorized interchange protocol or prescriber authorization supports substitution",
      "Substitute prasugrel without notification because the drugs are antiplatelets",
      "Refuse all antiplatelet dispensing until a new protocol is written"
    ),
    "Dispense clopidogrel as written unless a current authorized interchange protocol or prescriber authorization supports substitution",
    `Therapeutic interchange requires current authorized protocols — expired protocols do not authorize substitution. Silent class switching or blanket refusal violate dispensing and protocol standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["therapeutic-interchange", "protocol", "antiplatelet", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Expired therapeutic interchange protocols do not authorize substitution — dispense as written or obtain current authorization.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 56-year-old patient on omeprazole 20 mg daily through a health-system protocol is therapeutically interchanged to pantoprazole 40 mg daily. The patient also takes clopidogrel 75 mg daily for recent stent placement. The protocol requires prescriber notification within 24 hours.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Complete the interchange immediately without prescriber notification because PPIs are interchangeable",
      "Evaluate PPI-clopidogrel interaction implications, follow protocol prescriber notification requirements, and document the interchange decision",
      "Substitute ranitidine without prescriber contact because it avoids PPI interactions",
      "Cancel both omeprazole and clopidogrel without prescriber input"
    ),
    "Evaluate PPI-clopidogrel interaction implications, follow protocol prescriber notification requirements, and document the interchange decision",
    `Therapeutic interchange involving PPIs in patients on clopidogrel requires interaction assessment and protocol-compliant prescriber notification — not silent substitution, outdated H2 blocker switches, or unilateral multi-drug cancellation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["therapeutic-interchange", "protocol", "PPI", "clopidogrel", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old LTC patient profile shows a therapeutic interchange from brand to generic donepezil under facility protocol. The consultant pharmacist notes the prescriber was notified by fax but no acceptance documentation appears in the chart after 72 hours beyond the protocol's 48-hour window.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Assume prescriber acceptance because fax was sent",
      "Follow up on prescriber notification status, document non-response per protocol, and do not treat the interchange as authorized beyond protocol timeframes without resolution",
      "Reverse the interchange independently and stop all dementia medications",
      "Allow the nurse to authorize interchange acceptance without prescriber documentation"
    ),
    "Follow up on prescriber notification status, document non-response per protocol, and do not treat the interchange as authorized beyond protocol timeframes without resolution",
    `Facility therapeutic interchange requires documented prescriber notification and acceptance within protocol timeframes — not fax-only assumptions, independent medication cessation, or nurse authorization of prescriber acceptance.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["therapeutic-interchange", "protocol", "LTC", "documentation", ...PE],
    }
  ),

  // ── Whistleblower / Mandatory Reporting — Deeper (3) ────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 46-year-old PIC observes a colleague pharmacist appearing impaired at work with slurred speech and counting errors on controlled substances. The colleague admits to misusing leftover oxycodone tablets from patient returns. State law requires reporting suspected impairment and diversion.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Cover for the colleague because reporting may cost them their license",
      "Remove the impaired pharmacist from safety-sensitive duties, secure controlled substances, and report suspected impairment and diversion to the supervisor and board per mandatory reporting requirements",
      "Allow the colleague to finish the shift to avoid staffing disruption",
      "Post about the incident on social media to warn other pharmacies"
    ),
    "Remove the impaired pharmacist from safety-sensitive duties, secure controlled substances, and report suspected impairment and diversion to the supervisor and board per mandatory reporting requirements",
    `Suspected pharmacist impairment and diversion require immediate safety action and mandatory reporting — not colleague concealment, continued CS access, or public disclosure.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [OIG],
      tags: ["whistleblower", "mandatory-reporting", "impairment", "diversion", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Suspected pharmacist impairment and diversion require immediate safety action and mandatory reporting.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 39-year-old technician tells the pharmacist that a regular customer disclosed being forced to fill fraudulent prescriptions for a third party and appears fearful during pickup. The customer asks the pharmacy not to call police.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Honor the customer's request because pharmacy staff are not law enforcement",
      "Assess the situation safely, follow mandatory reporting and human-trafficking protocols if applicable, document observations, and contact appropriate authorities or hotlines per state law and policy",
      "Refuse all future prescriptions from the customer to avoid involvement",
      "Confront the suspected trafficker in the parking lot"
    ),
    "Assess the situation safely, follow mandatory reporting and human-trafficking protocols if applicable, document observations, and contact appropriate authorities or hotlines per state law and policy",
    `Suspected human trafficking may trigger mandatory reporting and safety protocols — not passive honor of silence requests, blanket prescription refusal, or direct confrontation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["whistleblower", "mandatory-reporting", "human-trafficking", "patient-safety", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 53-year-old billing coordinator instructs the pharmacist to upcode MTM encounters as comprehensive medication reviews when only brief pickup counseling occurred. The coordinator states internal compliance already reviewed and approved the practice.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue upcoding because compliance approved the billing pattern",
      "Refuse to document or bill services not performed, escalate through compliance, and report ongoing Medicare billing fraud if internal channels fail to stop the scheme",
      "Bill CMRs only on days when the coordinator is absent",
      "Delete MTM records to eliminate audit risk without reporting"
    ),
    "Refuse to document or bill services not performed, escalate through compliance, and report ongoing Medicare billing fraud if internal channels fail to stop the scheme",
    `Billing for undelivered MTM services is fraud regardless of internal approval claims. Pharmacists must refuse false documentation and escalate ongoing schemes — not selective compliance or record destruction.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [OIG],
      tags: ["whistleblower", "mandatory-reporting", "Medicare-fraud", "MTM", ...PE],
    }
  ),

  // ── Tennessee (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient requests an influenza vaccine at a Nashville pharmacy. The pharmacist completed Tennessee-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Tennessee protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Tennessee protocol requirements",
    `Tennessee authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Tennessee access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TN",
      difficulty: 2,
      references: [TN_REF],
      tags: ["tennessee", "immunization", "influenza", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Memphis presents a new prescription for tramadol 50 mg tablets. Tennessee requires Controlled Substance Monitoring Database (CSMD) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query CSMD, document the review, and apply corresponding-responsibility judgment",
      "Skip CSMD for patients with commercial insurance",
      "Query CSMD only for Schedule II drugs, not tramadol",
      "Delegate CSMD review and dispensing authorization to a technician"
    ),
    "Query CSMD, document the review, and apply corresponding-responsibility judgment",
    `Tennessee requires pharmacists to query and document CSMD review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Tramadol is controlled under federal and Tennessee schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TN",
      difficulty: 3,
      references: [TN_REF],
      tags: ["tennessee", "CSMD", "PDMP", ...PE],
    }
  ),

  // ── Missouri (2) ─────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in St. Louis presents a new prescription for oxycodone 5 mg tablets. Missouri requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Missouri PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients paying cash",
      "Query PDMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Missouri PDMP, document the review, and apply corresponding-responsibility judgment",
    `Missouri requires pharmacists to query and document PDMP review as part of corresponding responsibility before dispensing controlled substances. Cash payment does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MO",
      difficulty: 3,
      references: [MO_REF],
      tags: ["missouri", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Kansas City picks up a new prescription at a community pharmacy. Missouri aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Missouri community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MO",
      difficulty: 2,
      references: [MO_REF],
      tags: ["missouri", "offer-to-counsel", ...PE],
    }
  ),

  // ── Mississippi (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist licensed in Louisiana begins dispensing at a Jackson community pharmacy before obtaining a Mississippi pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Mississippi licensure?",
    opts4(
      "Continue dispensing under the Louisiana license until Mississippi approves",
      "Obtain a Mississippi pharmacist license before practicing in the state",
      "Register with DEA only and defer Mississippi board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Mississippi pharmacist license before practicing in the state",
    `Mississippi requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Mississippi pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 2,
      references: [MS_REF],
      tags: ["mississippi", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old patient requests a pneumococcal vaccine at a Biloxi pharmacy. The pharmacist completed Mississippi-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Mississippi protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
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
      tags: ["mississippi", "immunization", "pneumococcal", ...PE],
    }
  ),
];
