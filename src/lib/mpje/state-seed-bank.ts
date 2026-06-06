/**
 * State-specific MPJE high-yield seeds — Oklahoma (primary), plus major states.
 */
import type { BankItem } from "@/lib/question-bank";

type MpjeSeedOpts = {
  stateCode: string;
  tags?: string[];
};

function stateMpje(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  { stateCode, tags = [] }: MpjeSeedOpts
): BankItem {
  return {
    subjectId,
    stateCode,
    question,
    options,
    correctAnswer: correct,
    explanation,
    tags: ["mpje", "high-yield", `state-${stateCode}`, ...tags],
  };
}

const OK: BankItem[] = [
  stateMpje(
    "state-practice-act",
    "Under Oklahoma law, the pharmacist-in-charge (PIC) is responsible for:",
    [
      "Legal compliance and supervision of all pharmacy operations",
      "Marketing campaigns only",
      "Wholesale purchasing exclusively",
      "IT system maintenance only",
    ],
    "Legal compliance and supervision of all pharmacy operations",
    "The Oklahoma PIC ensures the pharmacy operates per the Oklahoma Pharmacy Act and Board of Pharmacy rules.",
    { stateCode: "OK", tags: ["oklahoma", "PIC", "licensure"] }
  ),
  stateMpje(
    "state-practice-act",
    "An Oklahoma pharmacist seeks to administer influenza vaccines. Which is required?",
    [
      "Board-authorized immunization training and compliant protocols",
      "No documentation if OTC products are used",
      "Technician-only administration",
      "Physician on-site for every dose",
    ],
    "Board-authorized immunization training and compliant protocols",
    "Oklahoma allows pharmacist immunizations under board rules with training, protocols, and reporting.",
    { stateCode: "OK", tags: ["oklahoma", "immunization"] }
  ),
  stateMpje(
    "dispensing-procedures",
    "An Oklahoma pharmacist receives a prescription with an obvious therapeutic duplication. The pharmacist should:",
    [
      "Contact the prescriber and document DUR intervention before dispensing",
      "Dispense both without comment",
      "Ask the patient to choose one medication",
      "Destroy the prescription",
    ],
    "Contact the prescriber and document DUR intervention before dispensing",
    "Oklahoma dispensing standards require pharmacist intervention for clinically significant DUR alerts.",
    { stateCode: "OK", tags: ["oklahoma", "DUR", "dispensing"] }
  ),
  stateMpje(
    "controlled-substances",
    "An Oklahoma pharmacy dispenses a Schedule II prescription. Under federal and Oklahoma rules, refills are:",
    [
      "Not permitted — a new prescription is required",
      "Unlimited with patient request",
      "Five refills within one year",
      "Three refills within six months",
    ],
    "Not permitted — a new prescription is required",
    "Schedule II substances cannot be refilled; Oklahoma follows federal DEA scheduling for refill limits.",
    { stateCode: "OK", tags: ["oklahoma", "DEA", "C-II"] }
  ),
  stateMpje(
    "pharmacy-operations",
    "During an Oklahoma Board of Pharmacy inspection, the inspector may review:",
    [
      "Prescription records, CS logs, policies, and compounding documentation",
      "Employee personal social media only",
      "Unrelated financial investments",
      "Patient entertainment preferences",
    ],
    "Prescription records, CS logs, policies, and compounding documentation",
    "Board inspections verify record retention, controlled substance accountability, and operational compliance.",
    { stateCode: "OK", tags: ["oklahoma", "inspection", "records"] }
  ),
  stateMpje(
    "pharmacy-operations",
    "An Oklahoma pharmacy technician labels a prescription. The supervising pharmacist must:",
    [
      "Verify accuracy and assume responsibility for the final product",
      "Allow unsupervised technician verification for all drugs",
      "Delegate only controlled substance counseling to technicians",
      "Skip verification for refills",
    ],
    "Verify accuracy and assume responsibility for the final product",
    "Technicians may perform supportive tasks but pharmacists retain verification and counseling responsibility.",
    { stateCode: "OK", tags: ["oklahoma", "technician", "supervision"] }
  ),
  stateMpje(
    "patient-privacy",
    "An Oklahoma patient requests a copy of their pharmacy records. The pharmacy should:",
    [
      "Provide access per HIPAA and Oklahoma privacy rules with proper identification",
      "Deny all requests without a court order",
      "Charge a punitive fee to discourage requests",
      "Send records to any family member who asks",
    ],
    "Provide access per HIPAA and Oklahoma privacy rules with proper identification",
    "Patients have rights to access PHI; pharmacies must verify identity and follow minimum necessary principles.",
    { stateCode: "OK", tags: ["oklahoma", "HIPAA", "privacy"] }
  ),
  stateMpje(
    "dispensing-procedures",
    "An Oklahoma pharmacist receives an emergency oral prescription for a non-controlled drug. The pharmacist should:",
    [
      "Document required elements and obtain written/electronic follow-up within permitted time",
      "Refuse because oral orders are never allowed",
      "Dispense a one-year supply without records",
      "Allow technician to accept the order without documentation",
    ],
    "Document required elements and obtain written/electronic follow-up within permitted time",
    "Emergency oral prescriptions are permitted with strict documentation and quantity limits under Oklahoma rules.",
    { stateCode: "OK", tags: ["oklahoma", "prescription", "emergency"] }
  ),
  stateMpje(
    "pharmacy-ethics",
    "An Oklahoma pharmacist believes a colleague is diverting controlled substances. The pharmacist should:",
    [
      "Report to the PIC and board/law enforcement per mandatory reporting duties",
      "Ignore to protect the colleague",
      "Confront the patient line only",
      "Post publicly online",
    ],
    "Report to the PIC and board/law enforcement per mandatory reporting duties",
    "Diversion threatens patient safety; pharmacists must report suspected theft or impairment per board and DEA expectations.",
    { stateCode: "OK", tags: ["oklahoma", "ethics", "controlled substances"] }
  ),
  stateMpje(
    "compounding-regulations",
    "An Oklahoma pharmacy compounds non-sterile preparations. The pharmacist must follow:",
    [
      "USP <795> standards and Oklahoma board compounding rules",
      "No documentation for batches under five units",
      "Only FDA OTC labeling rules",
      "Hospital-only standards regardless of setting",
    ],
    "USP <795> standards and Oklahoma board compounding rules",
    "Non-sterile compounding requires USP <795> compliance incorporated into state board expectations.",
    { stateCode: "OK", tags: ["oklahoma", "compounding", "USP"] }
  ),
  stateMpje(
    "state-practice-act",
    "A pharmacist licensed in another state wants to practice in Oklahoma. They must:",
    [
      "Obtain an Oklahoma pharmacist license from the Oklahoma Board of Pharmacy",
      "Practice immediately with any active license",
      "Register only with DEA",
      "Complete only a technician exam",
    ],
    "Obtain an Oklahoma pharmacist license from the Oklahoma Board of Pharmacy",
    "Pharmacists must hold an active Oklahoma license; reciprocity/endorsement follows board procedures.",
    { stateCode: "OK", tags: ["oklahoma", "licensure", "reciprocity"] }
  ),
  stateMpje(
    "dispensing-procedures",
    "When counseling an Oklahoma patient on a new high-risk medication, the pharmacist should:",
    [
      "Offer counseling and document refusal if the patient declines",
      "Skip counseling for all refills and new prescriptions",
      "Counsel only if the physician requests it",
      "Provide counseling only in writing mailed later",
    ],
    "Offer counseling and document refusal if the patient declines",
    "Patient counseling is a core pharmacist duty; offer and document when patients decline.",
    { stateCode: "OK", tags: ["oklahoma", "counseling", "patient care"] }
  ),
];

function majorStateSeeds(
  stateCode: string,
  stateName: string,
  boardHighlight: string,
  extras: BankItem[]
): BankItem[] {
  const base: BankItem[] = [
    stateMpje(
      "state-practice-act",
      `Under ${stateName} pharmacy law, the pharmacist-in-charge is primarily responsible for:`,
      [
        `Compliance with the ${stateName} Pharmacy Practice Act and board rules`,
        "Wholesale inventory ordering only",
        "Social media management",
        "Physician diagnosis of patients",
      ],
      `Compliance with the ${stateName} Pharmacy Practice Act and board rules`,
      `${boardHighlight} The PIC oversees legal compliance and pharmacy operations.`,
      { stateCode, tags: [stateName.toLowerCase(), "PIC"] }
    ),
    stateMpje(
      "controlled-substances",
      `A ${stateName} pharmacist dispenses a Schedule II prescription. Refills are:`,
      [
        "Not allowed — requires a new prescription",
        "Unlimited with patient consent",
        "Five refills in six months",
        "One refill within 30 days",
      ],
      "Not allowed — requires a new prescription",
      "Federal DEA rules prohibit C-II refills; state law aligns for Schedule II dispensing.",
      { stateCode, tags: [stateName.toLowerCase(), "DEA"] }
    ),
    stateMpje(
      "pharmacy-operations",
      `${stateName} pharmacies participating in controlled substance dispensing must typically:`,
      [
        "Comply with PDMP/prescription monitoring query and reporting rules where applicable",
        "Ignore PDMP if the prescriber is well known",
        "Report only Schedule I drugs",
        "Avoid all CS recordkeeping",
      ],
      "Comply with PDMP/prescription monitoring query and reporting rules where applicable",
      "Most states require PDMP access/documentation for controlled substance dispensing per state law.",
      { stateCode, tags: [stateName.toLowerCase(), "PDMP"] }
    ),
    stateMpje(
      "dispensing-procedures",
      `A ${stateName} pharmacist identifies a critical drug interaction during DUR. The pharmacist should:`,
      [
        "Intervene, contact the prescriber if needed, and document",
        "Dispense without intervention",
        "Delegate to cashier staff",
        "Cancel the patient's insurance",
      ],
      "Intervene, contact the prescriber if needed, and document",
      "DUR intervention is a universal pharmacist responsibility enforced by state boards.",
      { stateCode, tags: [stateName.toLowerCase(), "DUR"] }
    ),
    stateMpje(
      "state-practice-act",
      `Pharmacist immunization authority in ${stateName} generally requires:`,
      [
        "Board-approved training and protocol compliance",
        "No training for pharmacists with ten years' experience",
        "Technician-only vaccine administration",
        "Hospital employment only",
      ],
      "Board-approved training and protocol compliance",
      "States authorize pharmacist vaccines with training, protocols, and reporting requirements.",
      { stateCode, tags: [stateName.toLowerCase(), "immunization"] }
    ),
    stateMpje(
      "patient-privacy",
      `A law enforcement officer requests patient Rx records in ${stateName} without a warrant or patient authorization. The pharmacist should:`,
      [
        "Follow HIPAA/state rules — disclose only if a permitted exception applies",
        "Provide all records immediately",
        "Post records on the pharmacy website",
        "Ask the officer to survey waiting patients",
      ],
      "Follow HIPAA/state rules — disclose only if a permitted exception applies",
      "HIPAA limits law enforcement disclosures; state privacy laws may add requirements.",
      { stateCode, tags: [stateName.toLowerCase(), "HIPAA"] }
    ),
  ];
  return [...base, ...extras];
}

const TX = majorStateSeeds(
  "TX",
  "Texas",
  "Texas State Board of Pharmacy regulates pharmacy practice.",
  [
    stateMpje(
      "dispensing-procedures",
      "A Texas pharmacist receives an emergency prescription refill for a maintenance medication. Texas rules generally require:",
      [
        "Limited emergency supply with documentation and prescriber follow-up per board rules",
        "A one-year supply without contacting the prescriber",
        "No documentation for any emergency supply",
        "Technician-only authorization",
      ],
      "Limited emergency supply with documentation and prescriber follow-up per board rules",
      "Texas allows limited emergency refills with pharmacist judgment and documentation requirements.",
      { stateCode: "TX", tags: ["texas", "emergency refill"] }
    ),
  ]
);

const CA = majorStateSeeds(
  "CA",
  "California",
  "California uses its own pharmacy law exam and B&P Code provisions.",
  [
    stateMpje(
      "compounding-regulations",
      "A California pharmacy performs sterile compounding. The pharmacist must comply with:",
      [
        "USP <797>, California board sterile compounding requirements, and licensing standards",
        "No documentation for batches under three units",
        "Only federal OTC rules",
        "Technician-only verification",
      ],
      "USP <797>, California board sterile compounding requirements, and licensing standards",
      "California strictly regulates sterile compounding with USP <797> and state board oversight.",
      { stateCode: "CA", tags: ["california", "compounding", "USP-797"] }
    ),
  ]
);

const NY = majorStateSeeds(
  "NY",
  "New York",
  "New York Education Law Article 137 governs pharmacy practice.",
  [
    stateMpje(
      "dispensing-procedures",
      "Under New York I-STOP requirements, controlled substance prescriptions generally must be:",
      [
        "Electronically prescribed with limited exceptions",
        "Verbal only from any caller",
        "Faxed without authentication always",
        "Dispensed without prescriber identification",
      ],
      "Electronically prescribed with limited exceptions",
      "New York mandates e-prescribing for controlled substances under I-STOP with narrow exceptions.",
      { stateCode: "NY", tags: ["new york", "I-STOP", "e-prescribing"] }
    ),
  ]
);

const FL = majorStateSeeds(
  "FL",
  "Florida",
  "Florida Board of Pharmacy enforces Chapter 465 pharmacy law.",
  [
    stateMpje(
      "pharmacy-operations",
      "A Florida pharmacy dispenses controlled substances. E-FORCSE (Florida PDMP) rules typically require:",
      [
        "Reporting and/or querying per Florida PDMP statutes and board rules",
        "No PDMP use for Schedule III-V",
        "PDMP access only for physicians",
        "Monthly paper reports only",
      ],
      "Reporting and/or querying per Florida PDMP statutes and board rules",
      "Florida's E-FORCSE PDMP integrates with dispensing workflow for controlled substances.",
      { stateCode: "FL", tags: ["florida", "PDMP", "E-FORCSE"] }
    ),
  ]
);

/** Flat list of all state-coded MPJE seeds. */
export const MPJE_STATE_SEED_ITEMS: BankItem[] = [...OK, ...TX, ...CA, ...NY, ...FL];

/** Group state seeds by subject id for HEALTH_QUESTION_BANK merge. */
export function mergeStateSeedsIntoBank(
  bank: Record<string, BankItem[]>
): Record<string, BankItem[]> {
  const merged = { ...bank };
  for (const item of MPJE_STATE_SEED_ITEMS) {
    const sid = item.subjectId ?? "state-practice-act";
    if (!merged[sid]) merged[sid] = [];
    merged[sid].push(item);
  }
  return merged;
}
