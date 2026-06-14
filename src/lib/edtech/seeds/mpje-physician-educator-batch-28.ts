/**
 * Curated MPJE-style items — physician-educator batch 28.
 * Topics: LTC consultant pharmacy (deeper), emergency C-II supply, interstate prescription transfer,
 * pharmacy robbery/security, OR/MA/NH state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-28";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const CMS = { label: "CMS Long-Term Care Requirements", url: "https://www.cms.gov" };
const OR_REF = {
  label: "Oregon Pharmacy Practice Act",
  citation: "ORS § 689 et seq.",
};
const MA_REF = { label: "Massachusetts Pharmacy Act", citation: "MGL c. 112 §§ 27–42B" };
const NH_REF = {
  label: "New Hampshire Pharmacy Practice Act",
  citation: "RSA § 318 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_28: EnrichedBankItem[] = [
  // ── LTC Consultant Pharmacy — Deeper (3) ──────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 81-year-old nursing home resident has received oral levofloxacin 750 mg daily for 14 days for asymptomatic bacteriuria without documented indication, culture results, or planned duration review. The consultant pharmacist is completing the monthly drug regimen review.`,
    "What is the consultant pharmacist's most appropriate recommendation?",
    opts4(
      "Recommend continued antibiotic therapy indefinitely without prescriber contact",
      "Recommend evaluation of indication, culture data, duration, and antibiotic stewardship principles with communication to the prescriber and care team",
      "Discontinue the antibiotic independently without notifying the facility",
      "Defer review until the annual CMS survey"
    ),
    "Recommend evaluation of indication, culture data, duration, and antibiotic stewardship principles with communication to the prescriber and care team",
    `Consultant pharmacists must identify inappropriate antibiotic use during monthly drug regimen reviews and communicate stewardship recommendations to prescribers and the interdisciplinary team — not passive continuation, independent discontinuation, or survey-delayed action.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CMS],
      tags: ["LTC", "consultant-pharmacist", "antibiotic-stewardship", "drug-regimen-review", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "LTC consultant pharmacists must flag inappropriate antibiotic use and communicate stewardship recommendations to the care team.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: During a monthly review, a 77-year-old LTC resident on warfarin 5 mg daily also receives aspirin 325 mg and ibuprofen 600 mg three times daily from multiple prescribers. The consultant pharmacist notes elevated bleeding risk and absent INR monitoring documentation for two months.`,
    "What is the consultant pharmacist's most appropriate action?",
    opts4(
      "Document the finding only in the pharmacy file without facility communication",
      "Document the DUR finding and promptly communicate anticoagulation and NSAID interaction concerns to the prescriber and interdisciplinary team",
      "Change all anticoagulation orders independently",
      "Recommend transferring the resident to avoid documentation"
    ),
    "Document the DUR finding and promptly communicate anticoagulation and NSAID interaction concerns to the prescriber and interdisciplinary team",
    `Consultant pharmacists must communicate clinically significant anticoagulation and bleeding-risk findings during drug regimen review — not internal-only documentation, independent order changes, or resident transfer to evade oversight.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [CMS],
      tags: ["LTC", "consultant-pharmacist", "anticoagulation", "DUR", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 74-year-old skilled nursing facility contracts with a pharmacy that employs the consultant pharmacist. The consultant identifies that facility staff routinely administer medications from outdated MAR sheets and the pharmacy has not received updated orders for two weeks.`,
    "What is the consultant pharmacist's most appropriate action?",
    opts4(
      "Ignore chart discrepancies because the pharmacy contract creates a conflict of interest",
      "Document the medication administration discrepancies, communicate findings to the medical director and QAPI process, and coordinate order reconciliation despite the contractual relationship",
      "Terminate the pharmacy contract unilaterally without notifying the board",
      "Recommend stopping all consultant services to avoid liability"
    ),
    "Document the medication administration discrepancies, communicate findings to the medical director and QAPI process, and coordinate order reconciliation despite the contractual relationship",
    `Consultant pharmacists must report clinically significant chart and administration discrepancies through QAPI and prescriber communication — contractual pharmacy relationships do not waive CMS consultant duties or permit ignored errors.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [CMS],
      tags: ["LTC", "consultant-pharmacist", "QAPI", "MAR", ...PE],
    }
  ),

  // ── Emergency C-II Supply — Deeper (3) ────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient presents at a community pharmacy Saturday night after dental surgery. The oral surgeon phones in an emergency oral prescription for hydrocodone 5 mg/acetaminophen 325 mg tablets, quantity 12, for 48 hours until a written prescription can be sent. The pharmacist verifies prescriber DEA registration.`,
    "What is the pharmacist's most appropriate action under federal emergency oral C-II rules?",
    opts4(
      "Refuse because community pharmacies may never accept oral Schedule II orders",
      "Dispense the limited emergency quantity after documenting the oral order and ensure a signed written prescription is received within 7 days",
      "Dispense a 30-day supply to avoid repeat weekend calls",
      "Require the patient to obtain a pharmacy-printed prescription form before any dispensing"
    ),
    "Dispense the limited emergency quantity after documenting the oral order and ensure a signed written prescription is received within 7 days",
    `21 CFR § 1306.11 permits emergency oral C-II orders in retail settings when immediate need exists and written Rx is impractical before dispensing. Quantity must be limited to the emergency period with written follow-up within 7 days — not blanket refusal, extended supplies, or pharmacy-generated Rx forms.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "oral-order", "after-hours", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 58-year-old hospice patient needs morphine sulfate immediate-release 15 mg tablets for breakthrough pain. The hospice nurse relays an oral emergency order from the attending physician on a holiday when the hospice cannot fax a written prescription until the next business day.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Dispense the limited quantity sufficient for the emergency period after oral verification, documentation, and required written follow-up within 7 days",
      "Refuse all oral C-II orders because the patient is not in an inpatient hospital",
      "Dispense a 90-day supply because the patient is terminally ill",
      "Accept a verbal order from the patient's family member without prescriber authentication"
    ),
    "Dispense the limited quantity sufficient for the emergency period after oral verification, documentation, and required written follow-up within 7 days",
    `Emergency oral C-II rules apply in hospice and community settings when immediate need and impracticality of written Rx are documented — with limited quantity and 7-day written follow-up. Terminating illness does not authorize 90-day supplies or unverified family orders.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "hospice", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 45-year-old patient received an emergency oral oxycodone 5 mg tablet prescription dispensed 6 days ago from an emergency department physician. The pharmacist documented the oral order but the written prescription received today is unsigned and lacks the prescriber's DEA number.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the unsigned fax as permanent documentation because 6 days have passed",
      "Contact the prescriber to obtain a properly signed written prescription meeting federal requirements before the 7-day deadline; notify DEA if not received in time",
      "Destroy dispensing records to avoid regulatory scrutiny",
      "Continue refilling the emergency prescription until the prescriber responds"
    ),
    "Contact the prescriber to obtain a properly signed written prescription meeting federal requirements before the 7-day deadline; notify DEA if not received in time",
    `Emergency oral C-II orders require valid signed written follow-up within 7 days. Deficient documentation must be corrected promptly; if not received in time, DEA notification is required — not unsigned fax acceptance, record destruction, or continued dispensing.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["C-II", "emergency-prescription", "DEA-notification", "documentation", ...PE],
    }
  ),

  // ── Interstate Prescription Transfer (3) ──────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 53-year-old patient relocating from Oregon to Idaho asks your Idaho pharmacy to accept transfer of a remaining refill on alprazolam 0.5 mg tablets (Schedule IV) from an Oregon pharmacy. The Oregon pharmacy confirms one prior transfer of this prescription occurred three months ago but was never filled at the receiving pharmacy.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the interstate transfer because the prior transfer was never filled",
      "Refuse the transfer because Schedule III–V prescriptions generally may be transferred only once between pharmacies under federal law",
      "Accept the transfer if the patient pays cash to avoid PDMP review",
      "Require a new prescription only if the drug is Schedule II"
    ),
    "Refuse the transfer because Schedule III–V prescriptions generally may be transferred only once between pharmacies under federal law",
    `Federal law permits only one transfer of Schedule III–V prescriptions between pharmacies when all conditions are met. A prior transfer generally bars a second transfer regardless of whether the first was filled. Cash payment does not override federal transfer limits.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescription-transfer", "interstate", "C-IV", ...PE],
      related: {
        reviewModuleSlug: "dispensing-procedures",
        keyTakeaway:
          "Schedule III–V prescriptions may be transferred only once between pharmacies — a prior transfer bars a second transfer.",
      },
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 61-year-old patient requests transfer of a lisinopril 20 mg prescription with two refills remaining from a Massachusetts pharmacy to your New Hampshire store. Both states permit non-controlled transfers when properly documented between licensed pharmacies.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Refuse all interstate transfers regardless of documentation",
      "Accept the documented interstate transfer if federal and both states' board requirements for non-controlled prescriptions are satisfied",
      "Require the patient to obtain a new prescription in New Hampshire for every transfer",
      "Accept the transfer only if the patient picks up the medication in Massachusetts first"
    ),
    "Accept the documented interstate transfer if federal and both states' board requirements for non-controlled prescriptions are satisfied",
    `Non-controlled prescription transfers between states are permitted when properly documented and consistent with applicable board rules in both jurisdictions — not blanket refusal, universal new Rx requirements, or in-person pickup in the original state when lawful transfer is authorized.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["prescription-transfer", "interstate", "non-controlled", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 49-year-old patient asks Pharmacy B to receive a transfer of remaining fills on oxycodone/acetaminophen 5/325 mg tablets (Schedule II) from Pharmacy A in the same state. Pharmacy A confirms partial fills remain on the original prescription.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Accept the transfer with pharmacist-to-pharmacist documentation",
      "Refuse the transfer because Schedule II prescriptions generally may not be transferred between pharmacies under federal law",
      "Accept the transfer if both pharmacies are owned by the same chain",
      "Accept the transfer if the patient provides a copy of the original written prescription"
    ),
    "Refuse the transfer because Schedule II prescriptions generally may not be transferred between pharmacies under federal law",
    `21 CFR § 1306.25 prohibits transfer of Schedule II prescriptions between pharmacies. A new prescription is required at the receiving pharmacy. Common ownership, patient-held copies, or partial-fill status do not create an exception to federal C-II transfer prohibition.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["prescription-transfer", "C-II", ...PE],
    }
  ),

  // ── Pharmacy Robbery / Security — Deeper (3) ──────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old pharmacy experiences an armed robbery during business hours. After the suspect leaves, staff are shaken but uninjured. Controlled substances were taken from the register area. The PIC asks whether to reopen immediately and resume dispensing.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Reopen immediately and resume dispensing to avoid lost revenue",
      "Secure the scene, ensure staff and patient safety, notify law enforcement, report controlled-substance loss to DEA on Form 106, reconcile inventory, and reopen only after required notifications and safety review",
      "Wait until the next biennial inventory to report missing controlled substances",
      "Pursue the suspect before calling authorities to recover inventory"
    ),
    "Secure the scene, ensure staff and patient safety, notify law enforcement, report controlled-substance loss to DEA on Form 106, reconcile inventory, and reopen only after required notifications and safety review",
    `Post-robbery response requires safety prioritization, law enforcement notification, DEA Form 106 reporting, and inventory reconciliation before normal operations resume — not immediate reopening, delayed biennial reporting, or suspect pursuit over safety.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["security", "robbery", "DEA-106", "theft", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 39-year-old technician triggers the silent alarm during a suspected robbery, but the incident is determined to be an aggressive shoplifter without controlled-substance theft. The PIC asks whether the alarm activation requires any follow-up documentation.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Take no action because no controlled substances were stolen",
      "Document the incident, debrief staff on security protocols, and cooperate with law enforcement if contacted regardless of whether controlled substances were taken",
      "Discipline the technician for false alarm activation",
      "Disable the silent alarm to prevent future false activations"
    ),
    "Document the incident, debrief staff on security protocols, and cooperate with law enforcement if contacted regardless of whether controlled substances were taken",
    `Security incidents require documentation and staff debrief even when no controlled substances are lost. Alarm activation during credible threats is appropriate — not automatic technician discipline, alarm disablement, or undocumented dismissal.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      tags: ["security", "robbery", "alarm", "staff-safety", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old relief pharmacist working alone at a 24-hour pharmacy proposes storing Schedule II bottles in an unlocked drawer behind the register for faster access during overnight shifts. The location has no recent robbery history.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Approve unlocked register storage because no robberies have occurred",
      "Maintain required controlled-substance security including locked storage, limited access, and policy compliance regardless of shift or convenience",
      "Allow the technician to hold the vault key during overnight shifts",
      "Reduce inventory to zero overnight by discarding remaining tablets"
    ),
    "Maintain required controlled-substance security including locked storage, limited access, and policy compliance regardless of shift or convenience",
    `Controlled-substance security requires locked storage and restricted access at all times — not unlocked register drawers, technician vault keys, or inventory destruction for convenience. Absence of prior robberies does not waive security requirements.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 2,
      references: [DEA],
      tags: ["security", "controlled-substances", "overnight", "vault", ...PE],
    }
  ),

  // ── Oregon (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "controlled-substances",
    `Scenario: A 46-year-old patient in Portland presents a new prescription for oxycodone 10 mg tablets. Oregon requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Oregon PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with commercial insurance",
      "Query PDMP only for Schedule II drugs, not oxycodone combination products",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Oregon PDMP, document the review, and apply corresponding-responsibility judgment",
    `Oregon requires pharmacists to query and document PDMP review as part of corresponding responsibility before dispensing controlled substances. Insurance status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OR",
      difficulty: 3,
      references: [OR_REF],
      tags: ["oregon", "PDMP", "PMP", ...PE],
    }
  ),

  mpjeCase(
    "state-practice-act",
    `Scenario: A 43-year-old pharmacist licensed in California begins dispensing at a Eugene community pharmacy before obtaining an Oregon pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding Oregon licensure?",
    opts4(
      "Continue dispensing under the California license until Oregon approves",
      "Obtain an Oregon pharmacist license before practicing in the state",
      "Register with DEA only and defer Oregon board licensure",
      "Work as a pharmacy intern indefinitely without Oregon licensure"
    ),
    "Obtain an Oregon pharmacist license before practicing in the state",
    `Oregon requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Indefinite intern status without proper licensure violates Oregon pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OR",
      difficulty: 2,
      references: [OR_REF],
      tags: ["oregon", "licensure", ...PE],
    }
  ),

  // ── Massachusetts (2) ─────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 62-year-old patient requests a pneumococcal vaccine at a Boston pharmacy. The pharmacist completed Massachusetts-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Massachusetts protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in physician offices",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Massachusetts protocol requirements",
    `Massachusetts authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy vaccination is permitted when requirements are met. Technicians cannot administer vaccines. Universal physician-only rules misstate Massachusetts access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MA",
      difficulty: 2,
      references: [MA_REF],
      tags: ["massachusetts", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 68-year-old patient in Worcester picks up a new prescription at a community pharmacy. Massachusetts aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Massachusetts community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "MA",
      difficulty: 2,
      references: [MA_REF],
      tags: ["massachusetts", "offer-to-counsel", ...PE],
    }
  ),

  // ── New Hampshire (2) ─────────────────────────────────────────────────────
  mpjeCase(
    "state-practice-act",
    `Scenario: A 51-year-old pharmacist licensed in Vermont begins dispensing at a Manchester community pharmacy before obtaining a New Hampshire pharmacist license.`,
    "What is the pharmacist's most appropriate action regarding New Hampshire licensure?",
    opts4(
      "Continue dispensing under the Vermont license until New Hampshire approves",
      "Obtain a New Hampshire pharmacist license before practicing in the state",
      "Register with DEA only and defer New Hampshire board licensure",
      "Work as a pharmacy clerk without registration to bypass licensure"
    ),
    "Obtain a New Hampshire pharmacist license before practicing in the state",
    `New Hampshire requires an active state pharmacist license before dispensing. Out-of-state licenses and DEA registration alone do not authorize practice. Unregistered clerk workarounds violate New Hampshire pharmacy law.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NH",
      difficulty: 2,
      references: [NH_REF],
      tags: ["new-hampshire", "licensure", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 59-year-old patient requests a shingles vaccine at a Concord pharmacy. The pharmacist completed New Hampshire-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per New Hampshire protocol requirements",
      "Refuse because shingles vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per New Hampshire protocol requirements",
    `New Hampshire authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NH",
      difficulty: 2,
      references: [NH_REF],
      tags: ["new-hampshire", "immunization", "shingles", ...PE],
    }
  ),
];
