/**
 * Curated MPJE-style items — physician-educator batch 07.
 * Topics: generic substitution, DUR/interventions, emergency C-II, LTC consultant, NC/MA/WA depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-07";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const NC_REF = { label: "North Carolina Pharmacy Practice Act", citation: "N.C.G.S. § 90-85 et seq." };
const MA_REF = { label: "Massachusetts Pharmacy Act", citation: "MGL c. 112 §§ 27–42B" };
const WA_REF = {
  label: "Washington Pharmacy Quality Assurance Commission",
  citation: "RCW 18.64 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_07: EnrichedBankItem[] = [
  // ── Generic Substitution (3) ────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 66-year-old patient presents a prescription for brand-name levothyroxine 100 mcg with prescriber notation "DAW 1 — brand medically necessary." State law permits generic substitution when the prescriber does not prohibit it. The patient's insurance prefers generic.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Substitute generic levothyroxine automatically to reduce cost",
      "Dispense the brand as written and document DAW per prescriber instruction and state substitution law",
      "Substitute generic but label the product as brand for insurance billing",
      "Refuse the prescription and tell the patient to obtain a new order without DAW"
    ),
    "Dispense the brand as written and document DAW per prescriber instruction and state substitution law",
    `Dispense-as-written (DAW) instructions prohibit automatic generic substitution when valid under state law. Narrow therapeutic index drugs like levothyroxine often require prescriber and patient alignment on brand vs. generic. Mislabeling for insurance or refusing valid DAW orders violates substitution and fraud rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["generic-substitution", "DAW", "levothyroxine", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Valid DAW instructions require dispensing the brand as written — automatic generic substitution is prohibited.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 58-year-old patient receives a prescription for atorvastatin 40 mg with no DAW notation. State law allows pharmacist generic substitution of therapeutically equivalent products. The pharmacy stocks a generic atorvastatin from a different manufacturer than the patient used last year.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the therapeutically equivalent generic, notify the patient of substitution as required by state law, and document on the prescription record",
      "Dispense brand only unless the patient pays cash",
      "Refuse substitution because the patient prefers the prior manufacturer's generic",
      "Substitute a different statin without prescriber authorization"
    ),
    "Dispense the therapeutically equivalent generic, notify the patient of substitution as required by state law, and document on the prescription record",
    `When DAW is absent and state law permits, pharmacists may substitute FDA-approved therapeutically equivalent generics with required patient notification and documentation. Brand-only dispensing without indication, therapeutic class switches, or ignoring valid substitution law are inappropriate.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["generic-substitution", "therapeutic-equivalence", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 72-year-old patient on chronic warfarin 5 mg presents a new prescription with no DAW code. The pharmacist plans generic substitution but notes the patient recently had a supratherapeutic INR after a prior generic switch.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Substitute generic automatically because no DAW is present",
      "Perform DUR, contact the prescriber if clinically indicated, document intervention, and dispense per prescriber direction and state law",
      "Refuse all warfarin dispensing permanently",
      "Dispense brand and bill as generic to satisfy both parties"
    ),
    "Perform DUR, contact the prescriber if clinically indicated, document intervention, and dispense per prescriber direction and state law",
    `Generic substitution may be legally permitted without DAW, but pharmacists must still conduct DUR for narrow therapeutic index drugs. Recent INR instability warrants prescriber communication and documented clinical judgment — not automatic substitution, refusal, or misbilling.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["generic-substitution", "warfarin", "DUR", ...PE],
    }
  ),

  // ── DUR / Interventions (3) ───────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 64-year-old patient picks up a new prescription for clarithromycin 500 mg. The profile shows active simvastatin 40 mg daily. The clinical system flags a serious drug–drug interaction increasing statin toxicity risk.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense both medications without comment because the prescriber wrote the order",
      "Contact the prescriber to discuss the interaction, document the DUR intervention, and resolve before dispensing or per prescriber direction",
      "Ask the patient to choose which drug to stop",
      "Dispense clarithromycin only and discontinue simvastatin independently"
    ),
    "Contact the prescriber to discuss the interaction, document the DUR intervention, and resolve before dispensing or per prescriber direction",
    `Prospective DUR is a core pharmacist responsibility. Serious interactions require prescriber contact and documented resolution — not passive dispensing, patient-directed cessation, or unilateral discontinuation of another prescriber's therapy.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["DUR", "drug-interaction", "intervention", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Serious DUR alerts require prescriber contact, documented intervention, and resolution before dispensing.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 59-year-old patient presents new prescriptions for lisinopril 20 mg and losartan 50 mg from the same prescriber on the same day. The pharmacist identifies duplicate angiotensin-pathway therapy without documented indication for dual therapy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense both because duplicate therapy alerts are always false positives",
      "Clarify the therapeutic duplication with the prescriber, document DUR, and withhold or adjust per resolution",
      "Dispense the newer drug and discard the older order silently",
      "Ask the technician to select one drug randomly"
    ),
    "Clarify the therapeutic duplication with the prescriber, document DUR, and withhold or adjust per resolution",
    `Duplicate therapy screening is a required DUR element. Unexplained duplication of ACE inhibitor and ARB therapy requires prescriber clarification and documentation — not automatic override, silent changes, or technician clinical decisions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["DUR", "duplicate-therapy", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 70-year-old patient on methotrexate 15 mg weekly for rheumatoid arthritis receives a new prescription for trimethoprim-sulfamethoxazole DS for a urinary tract infection. The pharmacist flags potential serious interaction and toxicity risk.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the antibiotic because the infection is urgent and DUR can wait until refill",
      "Immediately contact the prescriber regarding the interaction, document intervention, and coordinate safe therapy before dispensing",
      "Counsel the patient to skip methotrexate doses without prescriber input",
      "Dispense half quantities of both drugs to reduce toxicity"
    ),
    "Immediately contact the prescriber regarding the interaction, document intervention, and coordinate safe therapy before dispensing",
    `High-risk interactions involving methotrexate and trimethoprim require urgent prescriber coordination. Delayed DUR, patient-directed dose changes, or arbitrary dose splitting without prescriber authorization are unsafe and violate DUR standards.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["DUR", "methotrexate", "interaction", ...PE],
    }
  ),

  // ── Emergency C-II (3) ────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 48-year-old postoperative patient arrives at a hospital outpatient pharmacy Saturday evening. The surgeon calls in an oral emergency prescription for oxycodone 5 mg tablets, quantity 12, until a follow-up visit Monday. The pharmacist verifies DEA registration. No written Rx exists yet.`,
    "What is the pharmacist's most appropriate action under federal DEA emergency oral C-II rules?",
    opts4(
      "Refuse because Schedule II drugs may never be prescribed orally",
      "Dispense a limited quantity after documenting the oral order and ensure a signed written prescription is received within 7 days",
      "Dispense a 30-day supply to avoid repeat calls",
      "Require the patient to obtain a pharmacy-generated prescription form"
    ),
    "Dispense a limited quantity after documenting the oral order and ensure a signed written prescription is received within 7 days",
    `21 CFR § 1306.11 permits emergency oral C-II prescriptions when immediate need exists and written Rx is impractical before dispensing. Quantity must be limited to the emergency period; written follow-up is required within 7 days. Blanket refusal, 30-day supplies, and pharmacy-generated Rx are incorrect.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "oral-order", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 55-year-old patient received an emergency oral Schedule II prescription for hydromorphone tablets dispensed 5 days ago. The pharmacist documented the oral order, but no signed written prescription has arrived and the prescriber's office is unresponsive.`,
    "What is the pharmacist's most appropriate action on day 8 after the oral order?",
    opts4(
      "Continue refilling the emergency prescription until the prescriber responds",
      "Notify the DEA area office that the written prescription was not received within 7 days as required",
      "Destroy patient records related to the fill to avoid scrutiny",
      "Accept a fax from the patient's family member as permanent replacement without prescriber authentication"
    ),
    "Notify the DEA area office that the written prescription was not received within 7 days as required",
    `When written follow-up for emergency oral C-II orders is not received within 7 days, the pharmacist must notify the DEA area office. Continued dispensing, record destruction, or unverified fax substitutes violate federal requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "DEA-notification", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 62-year-old hospice patient experiences breakthrough pain on Sunday night. The hospice nurse requests an emergency oral order for morphine sulfate immediate-release 15 mg tablets, quantity sufficient for 48 hours, until the attending physician can send a written prescription.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the limited emergency quantity after oral order verification, documentation, and required written follow-up within 7 days",
      "Refuse all oral C-II orders in hospice settings",
      "Dispense a 90-day supply because the patient is terminally ill",
      "Allow the nurse to sign DEA Form 222 for the emergency supply"
    ),
    "Dispense the limited emergency quantity after oral order verification, documentation, and required written follow-up within 7 days",
    `Emergency oral C-II rules apply in hospice when immediate need and impracticality of written Rx are met — with limited quantity and 7-day written follow-up. Hospice status does not permit unlimited supplies or nurse DEA ordering authority.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "hospice", ...PE],
    }
  ),

  // ── LTC Consultant Pharmacist (3) ─────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 79-year-old nursing home resident receives nine scheduled psychoactive medications. The facility's consultant pharmacist has not performed a monthly drug regimen review for two months due to staffing shortages.`,
    "What is the consultant pharmacist's most appropriate action under federal LTC requirements?",
    opts4(
      "Skip reviews until the facility hires more nurses",
      "Perform the required monthly drug regimen review, document recommendations, and communicate clinically significant issues to the medical director and care team",
      "Delegate the entire regimen review to a certified technician",
      "Review only controlled substances and ignore other classes"
    ),
    "Perform the required monthly drug regimen review, document recommendations, and communicate clinically significant issues to the medical director and care team",
    `OBRA and CMS requirements mandate consultant pharmacists conduct monthly drug regimen reviews in LTC facilities, including psychotropic and clinically significant findings communicated to prescribers and the interdisciplinary team. Staffing shortages do not waive the obligation; technicians cannot perform consultant functions.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["LTC", "consultant-pharmacist", "drug-regimen-review", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "LTC consultant pharmacists must complete monthly drug regimen reviews and communicate significant findings to the care team.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: During a drug regimen review, a 83-year-old LTC resident's consultant pharmacist identifies duplicate anticholinergic therapy contributing to confusion and falls. The attending physician is unaware of the overlap from multiple specialists.`,
    "What is the consultant pharmacist's most appropriate action?",
    opts4(
      "Document the finding only in the pharmacy file without contacting the facility",
      "Document the intervention and communicate recommendations promptly to the prescriber and interdisciplinary team per LTC standards",
      "Discontinue one medication independently without prescriber involvement",
      "Wait until the annual survey to mention the issue"
    ),
    "Document the intervention and communicate recommendations promptly to the prescriber and interdisciplinary team per LTC standards",
    `Consultant pharmacists must communicate clinically significant DUR findings to the medical director/prescribers and the care team — not merely internal documentation. Independent discontinuation exceeds consultant scope; delayed action until survey jeopardizes patient safety.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["LTC", "consultant-pharmacist", "DUR", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 76-year-old LTC resident on antipsychotic therapy lacks documented behavioral indication and non-pharmacologic attempts in the chart. The consultant pharmacist is completing a monthly review required under CMS F-tag psychotropic medication requirements.`,
    "What is the consultant pharmacist's most appropriate recommendation?",
    opts4(
      "Recommend continued therapy indefinitely without chart review",
      "Recommend evaluation of indication, dose, duration, and attempts at gradual dose reduction or discontinuation when clinically appropriate per CMS psychotropic guidelines",
      "Recommend immediate cessation of all psychotropics without prescriber assessment",
      "Recommend transferring the resident to avoid documentation"
    ),
    "Recommend evaluation of indication, dose, duration, and attempts at gradual dose reduction or discontinuation when clinically appropriate per CMS psychotropic guidelines",
    `CMS LTC requirements and consultant pharmacist duties include monitoring psychotropic use for appropriate indication, behavioral interventions, and periodic GDR attempts when safe. Indefinite use without review, abrupt independent cessation, or resident transfer to evade standards are inappropriate.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["LTC", "consultant-pharmacist", "psychotropic", "CMS", ...PE],
    }
  ),

  // ── North Carolina (2) ──────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old patient in Charlotte presents a new prescription for oxycodone 10 mg tablets. North Carolina requires CSRS (Controlled Substances Reporting System) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query CSRS, document the review, and apply corresponding-responsibility judgment",
      "Skip CSRS for patients paying with insurance",
      "Query CSRS only for Schedule II drugs, not oxycodone",
      "Delegate CSRS review and dispensing authorization to a technician"
    ),
    "Query CSRS, document the review, and apply corresponding-responsibility judgment",
    `North Carolina requires pharmacists to query and document CSRS review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Oxycodone is a controlled substance. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NC",
      difficulty: 3,
      references: [NC_REF],
      tags: ["north-carolina", "CSRS", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Raleigh picks up a new prescription at a community pharmacy. North Carolina aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling for all refill-only pickup windows"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `North Carolina community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or conflating new Rx requirements with refills fail OBRA-aligned compliance.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NC",
      difficulty: 2,
      references: [NC_REF],
      tags: ["north-carolina", "offer-to-counsel", ...PE],
    }
  ),

  // ── Massachusetts (2) ───────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 52-year-old patient in Boston presents a prescription for alprazolam 0.5 mg tablets. Massachusetts requires MassPAT (Prescription Monitoring Program) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query MassPAT, document the review, and exercise corresponding responsibility before dispensing",
      "Skip MassPAT because benzodiazepines are not monitored",
      "Query MassPAT once per year for each patient",
      "Allow an intern to dispense without pharmacist PDMP review"
    ),
    "Query MassPAT, document the review, and exercise corresponding responsibility before dispensing",
    `Massachusetts requires PDMP (MassPAT) review and documentation for controlled substance dispensing. Benzodiazepines are controlled and monitored. Annual-only review and intern-only dispensing without pharmacist PDMP accountability violate state requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MA",
      difficulty: 3,
      references: [MA_REF],
      tags: ["massachusetts", "MassPAT", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 44-year-old pharmacist relocates to Worcester and begins dispensing at a chain pharmacy before receiving a Massachusetts license, relying on an active license from another state.`,
    "What is the pharmacist's most appropriate action regarding Massachusetts licensure?",
    opts4(
      "Continue dispensing under the out-of-state license until renewal season",
      "Obtain a Massachusetts pharmacist license through the board before practicing in the state",
      "Register with DEA only and defer state licensure indefinitely",
      "Work as a pharmacy intern indefinitely without Massachusetts application"
    ),
    "Obtain a Massachusetts pharmacist license through the board before practicing in the state",
    `Massachusetts requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Working without licensure or indefinite intern status violates the Pharmacy Act.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MA",
      difficulty: 2,
      references: [MA_REF],
      tags: ["massachusetts", "licensure", ...PE],
    }
  ),

  // ── Washington (2) ────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 49-year-old patient in Seattle presents a new prescription for hydrocodone 5 mg/acetaminophen 325 mg. Washington requires Prescription Monitoring Program (PMP) review before dispensing controlled substances when applicable.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Query the Washington PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for combination hydrocodone products",
      "Query PMP only when the patient pays cash",
      "Delegate PMP review to delivery drivers for mail orders without pharmacist oversight"
    ),
    "Query the Washington PMP, document the review, and apply corresponding-responsibility judgment",
    `Washington requires pharmacists to query and document PMP review before dispensing controlled substances. Combination hydrocodone is controlled. Cash payment does not waive monitoring. Mail-order models still require pharmacist PDMP accountability — not driver delegation.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WA",
      difficulty: 3,
      references: [WA_REF],
      tags: ["washington", "PMP", "PDMP", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 61-year-old patient in Spokane requests pharmacist-initiated dispensing of naloxone under Washington's standing order authority. The pharmacist completed required training and the pharmacy participates in an authorized take-home naloxone program.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense naloxone under the authorized Washington standing order/protocol after screening, consent, and documentation",
      "Refuse because naloxone always requires an individual prescription in Washington",
      "Dispense only to patients already receiving opioid prescriptions",
      "Allow technicians to dispense naloxone without pharmacist involvement"
    ),
    "Dispense naloxone under the authorized Washington standing order/protocol after screening, consent, and documentation",
    `Washington authorizes pharmacist dispensing of naloxone under standing orders and collaborative protocols with required training and documentation. Bystander and community access is permitted when program requirements are met — not limited to active opioid patients or technician-only dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "WA",
      difficulty: 3,
      references: [WA_REF],
      tags: ["washington", "naloxone", "standing-order", ...PE],
    }
  ),
];
