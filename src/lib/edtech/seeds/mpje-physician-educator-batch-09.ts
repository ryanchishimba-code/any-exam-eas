/**
 * Curated MPJE-style items — physician-educator batch 09.
 * Topics: telepharmacy, hazardous waste/disposal, technician registration,
 * inspection readiness, SC/TN/KY state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-09";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const EPA = {
  label: "EPA Resource Conservation and Recovery Act (RCRA)",
  url: "https://www.epa.gov/hw",
};
const SC_REF = {
  label: "South Carolina Pharmacy Practice Act",
  citation: "S.C. Code § 40-43-10 et seq.",
};
const TN_REF = {
  label: "Tennessee Pharmacy Practice Act",
  citation: "Tenn. Code Ann. § 63-10-101 et seq.",
};
const KY_REF = {
  label: "Kentucky Pharmacy Laws",
  citation: "KRS § 315.010 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_09: EnrichedBankItem[] = [
  // ── Telepharmacy (3) ────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 64-year-old patient at a rural telepharmacy site picks up a new prescription for warfarin 5 mg. The on-site technician completed data entry and product selection. The supervising pharmacist is located at a central hub 40 miles away reviewing prescriptions via secure video link.`,
    "What is the pharmacist's most appropriate action before the prescription is released to the patient?",
    opts4(
      "Allow the technician to perform final verification because the pharmacist is on video elsewhere",
      "Perform pharmacist final verification and offer required counseling through an approved telepharmacy protocol before release",
      "Mail the prescription without pharmacist review because the site is remote",
      "Skip counseling because telepharmacy sites are exempt from OBRA requirements"
    ),
    "Perform pharmacist final verification and offer required counseling through an approved telepharmacy protocol before release",
    `Telepharmacy models require pharmacist final verification and offer-to-counsel through board-approved protocols — not technician-only release. Remote location does not waive pharmacist accountability. OBRA-aligned counseling obligations generally apply to new prescriptions unless a specific lawful exemption exists.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["telepharmacy", "verification", "counseling", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Telepharmacy still requires pharmacist final verification and offer-to-counsel under approved protocols.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old chain proposes opening a telepharmacy kiosk in a grocery store with no licensed pharmacist on premises. Technicians would accept prescriptions, select product, and release medication after a hub pharmacist reviews images of labels once daily.`,
    "What is the pharmacist's most appropriate action regarding this telepharmacy proposal?",
    opts4(
      "Proceed because daily batch review satisfies supervision requirements",
      "Ensure the model complies with state telepharmacy statutes, real-time pharmacist oversight, security, and recordkeeping before operation",
      "Operate as a technician-only site until patient volume justifies a pharmacist",
      "Use telepharmacy status to bypass controlled-substance recordkeeping"
    ),
    "Ensure the model complies with state telepharmacy statutes, real-time pharmacist oversight, security, and recordkeeping before operation",
    `Telepharmacy is permitted only under specific state frameworks with defined pharmacist oversight, often real-time verification, counseling access, and security controls. Daily batch review, technician-only dispensing, or CS recordkeeping waivers do not satisfy typical board and federal requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["telepharmacy", "supervision", "operations", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 71-year-old patient at a licensed telepharmacy site asks detailed questions about a new insulin pen device. The on-site technician offers to answer all clinical questions because the remote pharmacist's video connection dropped during a storm.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow the technician to provide complete clinical counseling on insulin administration",
      "Restore pharmacist communication or arrange timely pharmacist counseling before release; technicians cannot replace pharmacist counseling on clinical device training",
      "Provide only a printed pamphlet and refuse further questions",
      "Defer all counseling until the patient's next refill in 90 days"
    ),
    "Restore pharmacist communication or arrange timely pharmacist counseling before release; technicians cannot replace pharmacist counseling on clinical device training",
    `New prescription counseling — especially for complex devices like insulin pens — requires pharmacist involvement or offer of counseling. Technology outages do not authorize technician-only clinical counseling. Printed materials supplement but do not replace required pharmacist counseling obligations for new prescriptions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["telepharmacy", "counseling", "insulin", ...PE],
    }
  ),

  // ── Hazardous Waste / Disposal (3) ──────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old pharmacist-in-charge reviews waste streams at a community pharmacy. Staff have been placing unused oral chemotherapy tablets, warfarin tablets, and empty insulin syringes with needles attached into the same open trash bin in the break room.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue combined disposal because all items are pharmacy waste",
      "Segregate hazardous pharmaceutical waste, controlled-substance waste, and sharps into appropriate containers and disposal pathways per EPA, DEA, and state rules",
      "Flush all unused tablets down the toilet to avoid storage",
      "Return sharps with attached needles to the OTC shelf for reuse after rinsing"
    ),
    "Segregate hazardous pharmaceutical waste, controlled-substance waste, and sharps into appropriate containers and disposal pathways per EPA, DEA, and state rules",
    `Pharmaceutical waste requires segregation: RCRA hazardous waste (e.g., certain antineoplastics, warfarin), controlled-substance wastage with witnessed destruction, and sharps in approved sharps containers. Commingled open trash, sewer disposal, and sharps reuse violate EPA, DEA, OSHA, and board disposal standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [EPA, DEA],
      tags: ["hazardous-waste", "disposal", "sharps", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Pharmacy waste must be segregated — hazardous drugs, controlled substances, and sharps each follow distinct disposal rules.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 47-year-old pharmacist must destroy 30 expired oxycodone 5 mg tablets removed from inventory during a quarterly audit. A technician asks to discard them in the regular pharmaceutical waste bin without documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Place the tablets in regular trash to avoid paperwork",
      "Perform witnessed destruction or authorized take-back per DEA and board rules and document the controlled-substance wastage",
      "Return expired tablets to the wholesaler for resale",
      "Allow the technician to destroy controlled substances without pharmacist witness"
    ),
    "Perform witnessed destruction or authorized take-back per DEA and board rules and document the controlled-substance wastage",
    `Controlled-substance wastage requires documented destruction — often with pharmacist witness — per DEA and state rules. Regular trash disposal, wholesaler resale of expired CS, and unwitnessed technician destruction create diversion risk and inspection violations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["hazardous-waste", "disposal", "C-II", "wastage", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old independent pharmacy accumulates partial bottles of outdated non-controlled prescription drugs. The owner proposes shipping all outdated stock to a reverse distributor without inventory reconciliation or hazardous waste determination.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ship all outdated drugs together without sorting or records",
      "Inventory outdated products, determine hazardous vs. non-hazardous waste classification, and use authorized reverse distribution or disposal vendors with required documentation",
      "Donate outdated prescription drugs to staff families to reduce waste volume",
      "Burn outdated inventory on-site behind the pharmacy"
    ),
    "Inventory outdated products, determine hazardous vs. non-hazardous waste classification, and use authorized reverse distribution or disposal vendors with required documentation",
    `Outdated drug disposal requires inventory reconciliation, hazardous waste determination where applicable, and authorized reverse distribution or disposal with documentation. Commingled undocumented shipments, staff donation of prescription drugs, and on-site burning violate federal and state waste and drug distribution laws.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [EPA],
      tags: ["hazardous-waste", "disposal", "reverse-distribution", ...PE],
    }
  ),

  // ── Technician Registration (3) ───────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 38-year-old pharmacy technician's state registration expired two weeks ago, but the technician continues to perform prescription data entry and insurance billing. The pharmacist-in-charge has not verified current registration for any technician this quarter.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow continued work because expiration was recent and renewal is pending",
      "Restrict the technician from performing registration-required duties until active registration is verified and maintain current registration records for all staff",
      "Convert the technician to volunteer status to avoid registration rules",
      "Allow data entry only if the technician promises to renew within six months"
    ),
    "Restrict the technician from performing registration-required duties until active registration is verified and maintain current registration records for all staff",
    `Most states require active technician registration or certification for pharmacy practice. Expired registration generally prohibits performing regulated technician duties. PICs must verify and maintain current registration records — not informal grace periods, volunteer relabeling, or open-ended renewal promises.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["technician-registration", "PIC", "supervision", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Technicians must hold active state registration — expired credentials prohibit regulated pharmacy duties.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old newly hired pharmacy technician presents a national certification card but has not yet completed state board technician registration required before working in the dispensing area. The store manager asks the pharmacist to schedule the technician on the production line immediately due to staffing shortages.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Allow immediate dispensing-area duties based on national certification alone",
      "Ensure required state technician registration is completed before assigning registration-required duties per board rules",
      "Register the technician as a pharmacist intern to bypass technician rules",
      "Assign the technician as acting pharmacist-in-charge until registration arrives"
    ),
    "Ensure required state technician registration is completed before assigning registration-required duties per board rules",
    `National certification does not substitute for state board technician registration where required. Staffing pressure does not waive licensure/registration rules. Misclassification as intern or acting PIC violates practice act requirements and creates liability.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["technician-registration", "certification", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 56-year-old pharmacist-in-charge receives a board notice that technician continuing education (CE) records are incomplete for three staff members whose registrations renew next month. The technicians claim they completed CE online but have no certificates.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Ignore CE documentation because technicians self-attest at renewal",
      "Require verification of completed CE, assist staff in obtaining missing certificates, and maintain records per board technician registration rules",
      "Forgery CE certificates to meet the renewal deadline",
      "Terminate all technicians without attempting compliance verification"
    ),
    "Require verification of completed CE, assist staff in obtaining missing certificates, and maintain records per board technician registration rules",
    `Technician registration renewal typically requires documented CE compliance. PICs should verify and maintain records — not rely on uncorroborated self-attestation, fabricate certificates, or reflex termination without compliance review.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["technician-registration", "continuing-education", "records", ...PE],
    }
  ),

  // ── Inspection Readiness (3) ────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old pharmacist-in-charge learns a routine state board inspection is scheduled tomorrow. A technician proposes resetting the refrigerator temperature log to hide several weeks of missing entries for vaccine and insulin storage.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Approve log falsification to avoid a citation",
      "Restore accurate temperature monitoring records, implement corrective action, and ensure retrievable logs are available for inspection",
      "Remove all vaccines and insulin from the pharmacy before the inspector arrives",
      "Refuse all board inspections without a court order"
    ),
    "Restore accurate temperature monitoring records, implement corrective action, and ensure retrievable logs are available for inspection",
    `Falsifying temperature logs constitutes record fraud and may worsen enforcement outcomes. Corrective action and accurate ongoing monitoring are required. Removing stock to evade inspection or refusing lawful board visits violates operational and cooperation requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["inspection", "temperature-logs", "PIC", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Inspection readiness requires accurate records — falsifying temperature logs is record fraud.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old DEA investigator arrives at a community pharmacy for an unannounced controlled-substance audit. The perpetual inventory is current, but the pharmacist-in-charge cannot locate the most recent biennial inventory or signed receiving invoices for Schedule II orders from the past month.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Tell the investigator to return in 30 days after records are recreated",
      "Produce all retrievable required DEA records promptly, document gaps, and initiate immediate reconciliation of missing biennial inventory and receiving documentation",
      "Provide only perpetual inventory because biennial records are optional",
      "Shred incomplete records before the investigator reviews them"
    ),
    "Produce all retrievable required DEA records promptly, document gaps, and initiate immediate reconciliation of missing biennial inventory and receiving documentation",
    `DEA inspections require prompt production of perpetual inventory, biennial inventory, and receiving records for controlled substances. Delay tactics, claiming biennial records are optional, or destroying records constitute serious violations.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["inspection", "DEA-records", "inventory", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old state inspector requests the pharmacy's current pharmacist and technician licenses, policy manual, and prescription files for the past two years. The pharmacy's posted license wall display shows an expired pharmacist license for the relief pharmacist on duty today.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Continue dispensing because the relief pharmacist is almost renewed",
      "Ensure only properly licensed personnel practice, update posted licenses, and provide requested inspection documents per board retention rules",
      "Hide the expired license and substitute an older valid copy from another pharmacist",
      "Direct the inspector to corporate headquarters for all records"
    ),
    "Ensure only properly licensed personnel practice, update posted licenses, and provide requested inspection documents per board retention rules",
    `Only actively licensed pharmacists may practice. Expired licenses, concealed credentials, or redirecting inspectors away from required on-site records violate board rules. Inspection readiness includes current posted licenses and retrievable policy and prescription files.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["inspection", "licensure", "records", ...PE],
    }
  ),

  // ── South Carolina (2) ──────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 54-year-old patient in Charleston presents a new prescription for oxycodone 10 mg tablets. South Carolina requires pharmacists to query the prescription monitoring program (SCRIPTS) before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query SCRIPTS, document the review, and apply corresponding-responsibility judgment",
      "Skip SCRIPTS for patients with local prescribers",
      "Query SCRIPTS only for Schedule II drugs, not oxycodone",
      "Delegate SCRIPTS review and dispensing authorization to a technician"
    ),
    "Query SCRIPTS, document the review, and apply corresponding-responsibility judgment",
    `South Carolina requires pharmacists to query and document SCRIPTS review before dispensing controlled substances. Prescriber familiarity does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize controlled-substance dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SC",
      difficulty: 3,
      references: [SC_REF],
      tags: ["south-carolina", "SCRIPTS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 43-year-old pharmacist licensed in Georgia begins dispensing at a Columbia chain pharmacy while waiting for South Carolina licensure approval.`,
    "What is the pharmacist's most appropriate action regarding South Carolina licensure?",
    opts4(
      "Continue dispensing under the Georgia license until South Carolina approves",
      "Obtain a South Carolina pharmacist license before practicing in the state",
      "Register with DEA only and defer state board licensure",
      "Work as a pharmacy intern indefinitely without South Carolina licensure"
    ),
    "Obtain a South Carolina pharmacist license before practicing in the state",
    `South Carolina requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates the Pharmacy Practice Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "SC",
      difficulty: 2,
      references: [SC_REF],
      tags: ["south-carolina", "licensure", ...PE],
    }
  ),

  // ── Tennessee (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 51-year-old patient in Nashville presents a prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Tennessee requires Controlled Substance Monitoring Database (CSMD) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query CSMD, document the review, and exercise corresponding responsibility before dispensing",
      "Skip CSMD for combination hydrocodone products",
      "Query CSMD once per year for each patient",
      "Allow an intern to dispense hydrocodone without pharmacist CSMD review"
    ),
    "Query CSMD, document the review, and exercise corresponding responsibility before dispensing",
    `Tennessee requires PDMP (CSMD) query and documentation before dispensing applicable controlled substances. Combination hydrocodone is controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TN",
      difficulty: 3,
      references: [TN_REF],
      tags: ["tennessee", "CSMD", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient in Memphis picks up a new prescription at a community pharmacy. Tennessee aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Tennessee community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TN",
      difficulty: 2,
      references: [TN_REF],
      tags: ["tennessee", "offer-to-counsel", ...PE],
    }
  ),

  // ── Kentucky (2) ────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old patient in Louisville presents a new prescription for alprazolam 0.5 mg tablets. Kentucky requires KASPER (Kentucky All Schedule Prescription Electronic Reporting) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query KASPER, document the review, and apply corresponding-responsibility judgment",
      "Skip KASPER because benzodiazepines are not monitored",
      "Query KASPER only when the patient pays cash",
      "Delegate KASPER review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query KASPER, document the review, and apply corresponding-responsibility judgment",
    `Kentucky requires pharmacists to query and document KASPER review before dispensing controlled substances. Benzodiazepines are controlled and monitored. Cash payment does not waive PDMP obligations. Mail-order models still require pharmacist PDMP accountability.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KY",
      difficulty: 3,
      references: [KY_REF],
      tags: ["kentucky", "KASPER", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 57-year-old pharmacist relocates to Lexington and begins dispensing at an independent pharmacy before receiving a Kentucky pharmacist license, relying on an active Indiana license.`,
    "What is the pharmacist's most appropriate action regarding Kentucky licensure?",
    opts4(
      "Continue dispensing under the Indiana license until Kentucky renewal season",
      "Obtain a Kentucky pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Kentucky board licensure indefinitely",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Kentucky pharmacist license through the board before practicing in the state",
    `Kentucky requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unlicensed clerk workarounds violate the Kentucky Pharmacy Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KY",
      difficulty: 2,
      references: [KY_REF],
      tags: ["kentucky", "licensure", ...PE],
    }
  ),
];
