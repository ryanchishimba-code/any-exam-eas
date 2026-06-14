/**
 * Curated MPJE-style items — physician-educator batch 23.
 * Topics: PREP Act / emergency countermeasures, clinical laboratory interface,
 * therapeutic interchange protocols, board consent / probation, TN/MO/MS state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-23";
const PE = ["physician-educator", BATCH, "mpje"];

const PREP = {
  label: "Public Readiness and Emergency Preparedness (PREP) Act",
  url: "https://www.hhs.gov/about/agencies/ogc/prep-act",
};
const CLIA = {
  label: "Clinical Laboratory Improvement Amendments (CLIA)",
  url: "https://www.cms.gov/medicare/quality/clinical-laboratory-improvement-amendments",
};
const TN_REF = {
  label: "Tennessee Pharmacy Practice Act",
  citation: "Tenn. Code Ann. § 63-10-101 et seq.",
};
const MO_REF = {
  label: "Missouri Pharmacy Act",
  citation: "RSMo § 338.010 et seq.; 20 CSR 2220",
};
const MS_REF = {
  label: "Mississippi Pharmacy Practice Act",
  citation: "Miss. Code § 73-21-1 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_23: EnrichedBankItem[] = [
  // ── PREP Act / Emergency Countermeasures (3) ──────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old pharmacist administers an authorized emergency countermeasure vaccine during a declared public health emergency under a standing order. A patient later alleges shoulder injury and asks whether standard malpractice or PREP Act protections apply.`,
    "What is the pharmacist's most appropriate understanding and action?",
    opts4(
      "PREP Act immunity applies to all pharmacy services regardless of emergency status",
      "Document administration per protocol; PREP Act liability protections apply to covered countermeasures administered consistent with emergency authorization — routine non-emergency services remain under standard negligence law",
      "Refuse all emergency vaccines because PREP Act eliminates quality standards",
      "Tell the patient PREP Act immunity means no documentation is required"
    ),
    "Document administration per protocol; PREP Act liability protections apply to covered countermeasures administered consistent with emergency authorization — routine non-emergency services remain under standard negligence law",
    `PREP Act immunity covers authorized countermeasures during declared emergencies when requirements are met — not all pharmacy practice. Documentation and protocol compliance remain mandatory. PREP does not eliminate quality standards or documentation duties.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [PREP],
      tags: ["PREP-Act", "countermeasure", "immunization", "emergency", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "PREP immunity applies to covered emergency countermeasures — routine practice remains under standard negligence law.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 55-year-old pharmacy stores federally allocated pandemic antiviral countermeasures in a non-refrigerated closet for two weeks after a power outage. Staff propose dispensing the stock because PREP Act protections apply to the product.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense because PREP Act immunity covers any use of countermeasures",
      "Quarantine compromised countermeasures, follow manufacturer and public health storage guidance, and do not dispense product with integrity concerns despite PREP availability",
      "Donate expired countermeasures to staff families to avoid waste",
      "Relabel countermeasures as OTC supplements to bypass storage rules"
    ),
    "Quarantine compromised countermeasures, follow manufacturer and public health storage guidance, and do not dispense product with integrity concerns despite PREP availability",
    `PREP Act liability protections do not override product integrity and storage requirements. Compromised countermeasures must be quarantined — not dispensed, diverted to staff, or relabeled to evade standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [PREP],
      tags: ["PREP-Act", "countermeasure", "cold-chain", "quarantine", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 48-year-old out-of-state pharmacist volunteer asks to administer emergency countermeasure immunizations at a mass clinic without verifying Tennessee authorization, training, or PREP Act eligibility requirements.`,
    "What is the pharmacist's most appropriate action before participating?",
    opts4(
      "Volunteer immediately because PREP Act eliminates all licensure and training requirements",
      "Verify applicable PREP Act authorization, state emergency practice rules, training, and supervision requirements before administering countermeasures",
      "Allow technician volunteers to administer countermeasures under PREP Act blanket immunity",
      "Administer only to family members to avoid regulatory review"
    ),
    "Verify applicable PREP Act authorization, state emergency practice rules, training, and supervision requirements before administering countermeasures",
    `PREP Act and emergency countermeasure programs require verification of authorization, training, and applicable state rules — not blanket immunity without licensure review, technician administration, or selective family-only dispensing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [PREP],
      tags: ["PREP-Act", "countermeasure", "volunteer", "licensure", ...PE],
    }
  ),

  // ── Clinical Laboratory Interface (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old patient picking up metformin 1000 mg twice daily hands the pharmacist direct-to-consumer lab results showing a new serum creatinine of 2.4 mg/dL and eGFR of 28 mL/min. The patient feels fine and wants refills today without contacting the prescriber.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense refills because the patient provided lab results voluntarily",
      "Review the results, assess renal function implications for metformin therapy, contact the prescriber before dispensing if clinically indicated, and document the intervention",
      "Refuse all future prescriptions from the patient permanently",
      "Adjust the metformin dose independently without prescriber contact"
    ),
    "Review the results, assess renal function implications for metformin therapy, contact the prescriber before dispensing if clinically indicated, and document the intervention",
    `Patient-provided and interfaced laboratory data may inform DUR. Declining renal function on metformin requires clinical review and prescriber contact when indicated — not silent dispensing, permanent refusal, or unilateral dose changes.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CLIA],
      tags: ["clinical-laboratory", "DUR", "metformin", "renal-function", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Use patient-provided lab data for DUR — contact prescriber when renal function affects therapy.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old pharmacy receives an unsolicited fax of laboratory results for a patient not in the dispensing system from an unknown direct-to-consumer testing company. The fax lists a critical glucose of 42 mg/dL for a patient the pharmacy has never served.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Add the patient to the profile and adjust diabetes therapy from the fax",
      "Treat as a patient safety issue: attempt to reach the patient or reporting provider per policy and HIPAA minimum necessary principles; do not initiate therapy changes without verified patient relationship and prescriber authorization",
      "Discard the fax because the pharmacy has no obligation to unknown patients",
      "Post the patient's name and result on social media to locate them quickly"
    ),
    "Treat as a patient safety issue: attempt to reach the patient or reporting provider per policy and HIPAA minimum necessary principles; do not initiate therapy changes without verified patient relationship and prescriber authorization",
    `Unsolicited critical lab values may require good-faith patient safety follow-up within policy — not unauthorized therapy changes, passive discard of critical values, or public PHI disclosure.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CLIA],
      tags: ["clinical-laboratory", "critical-value", "direct-to-consumer", "LDT", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 66-year-old patient in a pharmacist MTM program has a pharmacy interface alert showing TSH of 0.1 mIU/L on levothyroxine 112 mcg daily. The patient reports palpitations and is due for a refill today. The prescriber office line is busy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the refill on time because the prescriber previously authorized the dose",
      "Assess symptoms and lab data, urgently contact the prescriber or direct care as indicated, withhold or adjust dispensing per clinical judgment, and document the intervention",
      "Stop levothyroxine permanently without prescriber input",
      "Ignore the interface alert because thyroid labs are outside pharmacy scope"
    ),
    "Assess symptoms and lab data, urgently contact the prescriber or direct care as indicated, withhold or adjust dispensing per clinical judgment, and document the intervention",
    `Interfaced thyroid results with symptomatic suppression on levothyroxine require urgent clinical action and prescriber contact — not routine refilling, unilateral discontinuation, or ignoring available lab data.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["clinical-laboratory", "MTM", "levothyroxine", "critical-value", ...PE],
    }
  ),

  // ── Therapeutic Interchange Protocols (3) ───────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 60-year-old hospitalized patient is discharged on lisinopril 20 mg daily. The hospital therapeutic interchange protocol permits substitution to enalapril 20 mg daily with prescriber notification within 24 hours. The community pharmacist receives the discharge order written for lisinopril.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Substitute enalapril automatically in community pharmacy because the hospital uses interchange",
      "Dispense lisinopril as written unless a valid community protocol or prescriber authorization supports interchange; hospital protocols do not automatically bind community pharmacies",
      "Substitute enalapril and destroy the lisinopril prescription without documentation",
      "Refuse all ACE inhibitor dispensing because interchange is illegal"
    ),
    "Dispense lisinopril as written unless a valid community protocol or prescriber authorization supports interchange; hospital protocols do not automatically bind community pharmacies",
    `Therapeutic interchange requires authorized protocols and prescriber notification rules applicable to the dispensing setting. Hospital protocols do not automatically authorize community pharmacy class substitution without local authorization and documentation.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["therapeutic-interchange", "protocol", "ACE-inhibitor", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Hospital interchange protocols do not automatically authorize community pharmacy substitution.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 55-year-old patient presents a prescription for atorvastatin 40 mg. The pharmacy's health-system protocol allows therapeutic interchange to simvastatin 40 mg with same-class substitution and documented prescriber notification. The patient prefers atorvastatin because of prior muscle symptoms on simvastatin.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Force simvastatin substitution because the protocol always applies",
      "Document patient preference and prior intolerance, dispense atorvastatin as prescribed or contact the prescriber per protocol exceptions, and offer counseling",
      "Substitute simvastatin without telling the patient to save cost",
      "Cancel the prescription without documentation"
    ),
    "Document patient preference and prior intolerance, dispense atorvastatin as prescribed or contact the prescriber per protocol exceptions, and offer counseling",
    `Therapeutic interchange protocols generally allow documented exceptions for patient intolerance or preference. Forced silent substitution, undisclosed switching, or undocumented cancellation violate protocol and counseling standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["therapeutic-interchange", "protocol", "statin", "patient-preference", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 72-year-old nursing home patient profile shows a therapeutic interchange from brand to generic donepezil under a facility protocol. The consultant pharmacist must verify notification to the prescriber and document acceptance within protocol timeframes before the interchange takes effect.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Implement the interchange immediately without prescriber notification to meet formulary deadlines",
      "Follow the authorized interchange protocol including prescriber notification, documentation, and timeframe requirements before substituting",
      "Substitute memantine instead because it treats the same disease",
      "Allow facility nurses to authorize interchange without pharmacist documentation"
    ),
    "Follow the authorized interchange protocol including prescriber notification, documentation, and timeframe requirements before substituting",
    `Facility therapeutic interchange requires protocol-compliant prescriber notification and documentation — not immediate silent substitution, cross-class switches without authorization, or nurse-only authorization.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["therapeutic-interchange", "protocol", "LTC", "documentation", ...PE],
    }
  ),

  // ── Board Consent / Probation (3) ─────────────────────────────────────────
  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 46-year-old pharmacist arrested for off-duty DUI receives a board consent order requiring self-reporting, substance monitoring, and a restriction from handling Schedule II controlled substances. The pharmacist is scheduled as the only verifier on the controlled substance shift tomorrow.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Work the controlled substance shift because the DUI was off duty",
      "Comply with consent order restrictions, disclose limitations to the employer, and do not perform prohibited controlled-substance duties until the board modifies the order",
      "Have a technician verify controlled substances in the pharmacist's place",
      "Resign silently and practice at another pharmacy without reporting the order"
    ),
    "Comply with consent order restrictions, disclose limitations to the employer, and do not perform prohibited controlled-substance duties until the board modifies the order",
    `Board consent orders impose specific practice restrictions regardless of off-duty conduct. Technician verification of CS, concealed relocation, and ignoring Schedule II prohibitions violate the consent agreement and scope rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "consent-agreement", "probation", "controlled-substances", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-ethics",
        keyTakeaway:
          "Consent order CS restrictions must be followed — technicians cannot substitute for prohibited duties.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 53-year-old pharmacist voluntarily surrendered a license during a substance use investigation and now applies for reinstatement. The pharmacist begins staffing weekends at a retail pharmacy while the reinstatement application is pending because the store is short-staffed.`,
    "What is the pharmacist's most appropriate action regarding practice?",
    opts4(
      "Continue working until reinstatement is approved because the store needs coverage",
      "Refrain from pharmacist practice until the board grants reinstatement and any conditions are satisfied",
      "Work under another pharmacist's credentials with verbal permission",
      "Register as a technician indefinitely without board action"
    ),
    "Refrain from pharmacist practice until the board grants reinstatement and any conditions are satisfied",
    `Voluntary surrender prohibits pharmacist practice until board reinstatement. Staffing shortages, credential borrowing, and indefinite technician status do not authorize dispensing without an active license.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "reinstatement", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-ethics",
    `Scenario: A 50-year-old pharmacist on board probation with a geographic restriction limiting practice to one county accepts a relief shift in a neighboring county without requesting board approval. The employer says the restriction is "just paperwork."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Work the relief shift because employer scheduling overrides board orders",
      "Decline practice outside the geographic restriction unless the board approves modification; comply with all probation terms",
      "Use a coworker's license number for the shift",
      "Ignore the restriction because relief shifts are temporary"
    ),
    "Decline practice outside the geographic restriction unless the board approves modification; comply with all probation terms",
    `Probation geographic restrictions are binding regardless of employer views or shift length. Credential misuse and temporary practice outside authorized areas violate board orders and may worsen discipline.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["board-discipline", "probation", "consent-agreement", "licensure", ...PE],
    }
  ),

  // ── Tennessee (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 49-year-old pharmacist licensed in Kentucky begins dispensing at a Memphis retail pharmacy before obtaining a Tennessee pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Tennessee licensure?",
    opts4(
      "Continue dispensing under the Kentucky license until Tennessee approves",
      "Obtain a Tennessee pharmacist license before practicing in the state",
      "Register with DEA only and defer Tennessee board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a Tennessee pharmacist license before practicing in the state",
    `Tennessee requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Tennessee pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TN",
      difficulty: 2,
      references: [TN_REF],
      tags: ["tennessee", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old patient requests a pneumococcal vaccine at a Nashville pharmacy. The pharmacist completed Tennessee-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Tennessee protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Tennessee protocol requirements",
    `Tennessee authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "TN",
      difficulty: 2,
      references: [TN_REF],
      tags: ["tennessee", "immunization", "pneumococcal", ...PE],
    }
  ),

  // ── Missouri (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 47-year-old pharmacist licensed in Illinois begins dispensing at a St. Louis chain pharmacy before receiving a Missouri pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Missouri licensure?",
    opts4(
      "Continue dispensing under the Illinois license until Missouri renewal season",
      "Obtain a Missouri pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer Missouri board licensure indefinitely",
      "Work as an unregistered clerk to bypass licensure requirements"
    ),
    "Obtain a Missouri pharmacist license through the board before practicing in the state",
    `Missouri requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate Missouri pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MO",
      difficulty: 2,
      references: [MO_REF],
      tags: ["missouri", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests an influenza vaccine at a Kansas City pharmacy. The pharmacist holds valid Missouri immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Missouri protocol requirements",
      "Refuse because influenza vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Missouri protocol requirements",
    `Missouri authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Missouri access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MO",
      difficulty: 2,
      references: [MO_REF],
      tags: ["missouri", "immunization", "influenza", ...PE],
    }
  ),

  // ── Mississippi (2) ───────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Jackson picks up a new prescription for a high-risk medication. Mississippi community pharmacies align with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Mississippi community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 2,
      references: [MS_REF],
      tags: ["mississippi", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 56-year-old patient requests a shingles vaccine at a Biloxi pharmacy. The pharmacist holds valid Mississippi immunization training and the pharmacy has a current protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Mississippi protocol requirements",
      "Refuse because adult vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Mississippi protocol requirements",
    `Mississippi authorizes pharmacist-administered immunizations under approved training and protocol requirements. Community pharmacy vaccination is permitted when rules are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MS",
      difficulty: 2,
      references: [MS_REF],
      tags: ["mississippi", "immunization", "shingles", ...PE],
    }
  ),
];
