/**
 * Curated MPJE-style items — physician-educator batch 39.
 * Topics: workers' comp / MSA billing (deeper), veterinary compounding,
 * reverse distributor CS returns, social media / advertising compliance, NE/KS/OK state depth.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { mpjeCase } from "@/lib/exam-prep/mpje-seed-factory";

const BATCH = "physician-educator-batch-39";
const PE = ["physician-educator", BATCH, "mpje"];

const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };
const FTC = {
  label: "FTC Advertising / Endorsement Guides",
  url: "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides",
};
const FDA503A = {
  label: "FDA Section 503A Compounding",
  url: "https://www.fda.gov/drugs/human-drug-compounding/compounding-laws-and-policies",
};
const NE_REF = {
  label: "Nebraska Pharmacy Practice Act",
  citation: "Neb. Rev. Stat. § 38-2860 et seq.",
};
const KS_REF = {
  label: "Kansas Pharmacy Practice Act",
  citation: "Kan. Stat. § 65-1626 et seq.",
};
const OK_REF = {
  label: "Oklahoma Pharmacy Practice Act",
  citation: "Okla. Stat. tit. 59 § 535 et seq.",
};

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const MPJE_PHYSICIAN_EDUCATOR_BATCH_39: EnrichedBankItem[] = [
  // ── Workers' Comp / MSA Billing — Deeper (3) ──────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 58-year-old injured worker with a settled workers' compensation claim presents a prescription for ongoing gabapentin therapy. The patient's attorney states a Medicare Set-Aside (MSA) account now funds future injury-related medications and asks the pharmacy to bill the workers' comp payer directly to avoid MSA paperwork.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill workers' comp directly because the injury is work-related",
      "Verify current payer of record, MSA or post-settlement funding rules, and required billing documentation before dispensing; do not bill the wrong payer to avoid MSA compliance",
      "Bill Medicare Part D because the patient is Medicare-eligible",
      "Dispense without billing until the attorney resolves the settlement informally"
    ),
    "Verify current payer of record, MSA or post-settlement funding rules, and required billing documentation before dispensing; do not bill the wrong payer to avoid MSA compliance",
    `Post-settlement injury medications may require MSA or designated funding pathways — not workers' comp billing after closure, improper Medicare crossover, or unbilled dispensing to bypass compliance.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["workers-comp", "MSA", "billing", "Medicare-Set-Aside", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Post-settlement work-injury meds may require MSA funding — verify payer of record before billing.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 52-year-old patient with an approved workers' compensation MSA allocation presents a new prescription for a high-cost brand biologic not listed in the MSA medication projection. The prescriber insists the drug is injury-related and should be covered immediately.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Bill the MSA administrator or designated payer only after verifying coverage, required authorization, and documentation for drugs outside the original MSA projection",
      "Dispense and bill Medicare Part D because the MSA list is outdated",
      "Bill commercial insurance without documenting the work-injury relationship",
      "Provide the biologic as samples to avoid payer contact"
    ),
    "Bill the MSA administrator or designated payer only after verifying coverage, required authorization, and documentation for drugs outside the original MSA projection",
    `MSA-covered therapy outside original projections requires verification and authorization — not Medicare crossover, undisclosed commercial billing, or sample diversion to avoid payer rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      tags: ["workers-comp", "MSA", "billing", "prior-authorization", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 61-year-old injured worker asks the pharmacist to backdate workers' compensation billing for three months of refills so the claim administrator pays before the claim formally closes Friday. The prescriptions were previously billed to commercial insurance.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Rebill the prior fills to workers' comp with corrected dates to help the patient",
      "Refuse backdated or improper payer rebilling; maintain accurate dispensing and billing records and bill only valid claims to the appropriate payer prospectively",
      "Bill both commercial insurance and workers' comp for the same historical fills",
      "Destroy prior billing records to allow clean workers' comp submission"
    ),
    "Refuse backdated or improper payer rebilling; maintain accurate dispensing and billing records and bill only valid claims to the appropriate payer prospectively",
    `Workers' compensation billing must reflect accurate dates and appropriate payers — not backdated rebilling, dual reimbursement, or record destruction to force claim payment.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["workers-comp", "MSA", "billing", "fraud-prevention", ...PE],
    }
  ),

  // ── Veterinary Compounding — Patient-Specific (3) ───────────────────────────
  mpjeCase(
    "compounding-regulations",
    `Scenario: A 47-year-old veterinarian sends a prescription to compound flavored amoxicillin suspension for a 6-year-old golden retriever named in the order. The owner also requests enough extra suspension for the family's second dog without a separate veterinary prescription.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Compound one batch for both dogs because the drug and dose are similar",
      "Compound only for the animal named on the valid veterinary prescription; require separate veterinary prescriptions for additional animals",
      "Use a human prescription from the owner to cover the second dog",
      "Decline all veterinary compounding because the pharmacy is retail-only"
    ),
    "Compound only for the animal named on the valid veterinary prescription; require separate veterinary prescriptions for additional animals",
    `Veterinary compounding requires patient-specific veterinary prescriptions for each animal — not multi-pet batches, human prescription workarounds, or blanket refusal without evaluating lawful orders.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["veterinary", "compounding", "patient-specific", "503A", ...PE],
      related: {
        reviewModuleSlug: "compounding-regulations",
        keyTakeaway:
          "Veterinary compounding requires a valid prescription for each named animal patient.",
      },
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 55-year-old cat owner presents a human prescriber's prescription for omeprazole capsules and asks the pharmacist to compound them into a tuna-flavored liquid for easier administration. No veterinarian has evaluated the cat or issued a veterinary prescription.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Compound the flavored liquid from the human prescription because omeprazole is the same drug",
      "Decline to compound for animal use without a valid veterinary prescription and appropriate veterinary compounding documentation",
      "Sell OTC omeprazole and tell the owner to mix it with tuna at home",
      "Compound using the human prescription and label the product for veterinary use only"
    ),
    "Decline to compound for animal use without a valid veterinary prescription and appropriate veterinary compounding documentation",
    `Animal patients require valid veterinary prescriptions and compliant compounding records — not repurposed human orders, home manipulation, or veterinary-only labeling of human Rx compounding.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["veterinary", "compounding", "prescription-validity", "patient-specific", ...PE],
    }
  ),

  mpjeCase(
    "compounding-regulations",
    `Scenario: A 42-year-old veterinarian orders a patient-specific transdermal methimazole gel for a hyperthyroid cat. The pharmacist notes the order specifies a concentration and vehicle appropriate for the cat but requests a 90-day bulk batch to supply the clinic's other feline patients prophylactically.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Prepare the 90-day bulk batch because the formulation is identical",
      "Compound only the patient-specific quantity for the named cat per the veterinary prescription; decline unauthorized bulk clinic stock without lawful office-use authorization",
      "Prepare bulk stock and label with only the clinic name",
      "Substitute a human generic tablet for the owner to crush at home"
    ),
    "Compound only the patient-specific quantity for the named cat per the veterinary prescription; decline unauthorized bulk clinic stock without lawful office-use authorization",
    `Veterinary compounding must match patient-specific orders — not bulk clinic stock from one prescription, clinic-only labeling, or unsafe home crushing substitutes.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FDA503A],
      tags: ["veterinary", "compounding", "patient-specific", "office-use", ...PE],
    }
  ),

  // ── Reverse Distributor Controlled-Substance Returns (3) ────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 53-year-old patient returns a partially used bottle of oxycodone 5 mg tablets after a therapy change. The pharmacist quarantines the return and prepares controlled-substance disposal through the pharmacy's DEA-registered reverse distributor.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Add the returned tablets to the next saleable return shipment for credit",
      "Document the patient return, maintain quarantine, and transfer the controlled substance to the reverse distributor with required DEA inventory and destruction records",
      "Flush the tablets and note disposal on a sticky pad",
      "Restock the bottle if the seal appears intact"
    ),
    "Document the patient return, maintain quarantine, and transfer the controlled substance to the reverse distributor with required DEA inventory and destruction records",
    `Patient-returned controlled substances require quarantine and documented reverse-distributor or lawful destruction pathways — not saleable returns, undocumented flushing, or restock of returned CS.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["reverse-distributor", "controlled-substances", "returns", "quarantine", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Returned controlled substances require quarantine and documented reverse-distributor transfer — never restock or saleable return.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 49-year-old PIC receives a reverse distributor pickup manifest listing 120 dosage units of mixed Schedule II-IV returns. The pharmacy perpetual inventory shows 98 units transferred, and two bottles of alprazolam are missing chain-of-custody signatures from technician handoff.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Sign the manifest as-is to avoid delaying the pickup",
      "Reconcile the discrepancy, complete chain-of-custody documentation, correct inventory records, and resolve missing signatures before releasing controlled substances to the reverse distributor",
      "Discard the two bottles in regular trash to match the manifest",
      "Add non-controlled outdated stock to the CS tote to maximize pickup value"
    ),
    "Reconcile the discrepancy, complete chain-of-custody documentation, correct inventory records, and resolve missing signatures before releasing controlled substances to the reverse distributor",
    `Reverse distributor CS transfers require accurate inventory reconciliation and chain-of-custody documentation — not manifest-only signing, trash disposal, or mixing non-controlled product into CS totes.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 4,
      references: [DEA],
      tags: ["reverse-distributor", "controlled-substances", "inventory", "chain-of-custody", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 57-year-old pharmacy using an authorized collection receptacle accumulates consumer-dropped controlled and non-controlled medications for reverse distributor destruction. A staff member proposes sorting controlled tablets out of the receptacle for resale because some appear in sealed bottles.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Resell sealed controlled substances to offset disposal costs",
      "Prohibit resale of collected controlled substances; maintain secure receptacle contents and transfer all collected drugs to the reverse distributor or lawful destruction per DEA collector requirements",
      "Return collected drugs to wholesaler saleable inventory if unexpired",
      "Allow technicians to take home unexpired non-controlled products only"
    ),
    "Prohibit resale of collected controlled substances; maintain secure receptacle contents and transfer all collected drugs to the reverse distributor or lawful destruction per DEA collector requirements",
    `Authorized collection receptacle contents cannot be resold or restocked — secure transfer to reverse distributor or lawful destruction is required. Wholesaler returns and staff take-home diversion violate DEA collector rules.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [DEA],
      tags: ["reverse-distributor", "controlled-substances", "collection-receptacle", "disposal", ...PE],
    }
  ),

  // ── Social Media / Advertising Compliance (3) ─────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 36-year-old pharmacy pays a local social media influencer to post a video praising the store's weight-loss counseling program without disclosing the paid partnership. The influencer also states the program is "doctor-approved for everyone."`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave the post online because influencer marketing is standard",
      "Require clear paid-partnership disclosure and accurate, substantiated claims consistent with FTC endorsement and pharmacy advertising rules",
      "Move the promotion to the influencer's personal page to avoid pharmacy accountability",
      "Add a disclaimer only if the board asks about the post"
    ),
    "Require clear paid-partnership disclosure and accurate, substantiated claims consistent with FTC endorsement and pharmacy advertising rules",
    `Paid influencer promotions require disclosure and substantiated claims — not undisclosed sponsorship, personal-page evasion, or reactive disclaimers only after regulatory inquiry.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FTC],
      tags: ["social-media", "marketing", "advertising", "FTC", ...PE],
      related: {
        reviewModuleSlug: "pharmacy-operations",
        keyTakeaway:
          "Paid influencer posts require FTC disclosure and substantiated claims — not hidden sponsorship.",
      },
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 44-year-old pharmacy owner posts on the store's social media that the pharmacy has "the lowest Adderall prices in town, guaranteed lower than [named competitor]." No price survey or substantiation supports the claim, and the post includes a stock photo of tablets.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Keep the post because competitive pricing attracts patients",
      "Remove or correct unsubstantiated comparative pricing claims and avoid misleading controlled-substance advertising inconsistent with professional and FTC standards",
      "Repost the claim as a paid advertisement without review",
      "Add a comment that prices may vary and leave the comparative claim unchanged"
    ),
    "Remove or correct unsubstantiated comparative pricing claims and avoid misleading controlled-substance advertising inconsistent with professional and FTC standards",
    `Comparative pricing and controlled-substance advertising require substantiation and professional compliance — not unsupported competitor claims, unreviewed paid posts, or weak comment disclaimers.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      references: [FTC],
      tags: ["social-media", "marketing", "advertising", "false-claims", ...PE],
    }
  ),

  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 39-year-old pharmacist posts a TikTok video in uniform at the pharmacy describing "crazy controlled-substance patients" seen that day, with the store logo visible and enough detail for local viewers to identify recent prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Leave the video online because no full names were used",
      "Remove the post, avoid disclosing patient or practice information on social media, and reinforce workforce policies on PHI and professional conduct",
      "Repost on a personal account because it is not the official pharmacy page",
      "Disable comments instead of removing the video"
    ),
    "Remove the post, avoid disclosing patient or practice information on social media, and reinforce workforce policies on PHI and professional conduct",
    `Social media posts with identifiable practice details about controlled-substance patients violate privacy and professional standards — even without full names. Personal-account reposting and comment disabling do not cure the disclosure.`,
    {
      blueprintDomain: "umpje-uniform",
      difficulty: 3,
      tags: ["social-media", "marketing", "HIPAA", "professional-conduct", ...PE],
    }
  ),

  // ── Nebraska (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 67-year-old patient requests a pneumococcal vaccine at an Omaha pharmacy. The pharmacist completed Nebraska-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Nebraska protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist verifies inventory",
      "Require emergency department referral for every adult vaccine"
    ),
    "Administer the vaccine after screening, consent, and documentation per Nebraska protocol requirements",
    `Nebraska authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer vaccines. Universal hospital-only rules misstate Nebraska access laws.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NE",
      difficulty: 2,
      references: [NE_REF],
      tags: ["nebraska", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 50-year-old patient in Lincoln presents a new prescription for hydrocodone 7.5 mg/acetaminophen 325 mg tablets. Nebraska requires Prescription Drug Monitoring Program (PDMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Nebraska PDMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PDMP review for patients with commercial insurance",
      "Query PDMP only for Schedule II drugs, not hydrocodone combination products",
      "Delegate PDMP review and dispensing authorization to a technician"
    ),
    "Query the Nebraska PDMP, document the review, and apply corresponding-responsibility judgment",
    `Nebraska requires pharmacists to query and document PDMP review before dispensing controlled substances. Insurance status does not waive monitoring. Hydrocodone combination products are controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "NE",
      difficulty: 3,
      references: [NE_REF],
      tags: ["nebraska", "PDMP", "PMP", ...PE],
    }
  ),

  // ── Kansas (2) ────────────────────────────────────────────────────────────
  mpjeCase(
    "dispensing-procedures",
    `Scenario: A 69-year-old patient in Wichita picks up a new prescription at a community pharmacy. Kansas aligns with federal OBRA requirements for offer-to-counsel on new prescriptions.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Offer counseling on the new prescription and document acceptance or declination",
      "Provide counseling only if the patient specifically asks",
      "Allow the cashier to offer counseling without pharmacist availability",
      "Skip counseling because the patient picked up at the drive-through window"
    ),
    "Offer counseling on the new prescription and document acceptance or declination",
    `Kansas community pharmacies must offer pharmacist counseling on new prescriptions and document the patient's response. Passive counseling, non-pharmacist offers, or drive-through pickup do not waive OBRA-aligned offer-to-counsel requirements.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KS",
      difficulty: 2,
      references: [KS_REF],
      tags: ["kansas", "offer-to-counsel", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 47-year-old patient in Topeka presents a new prescription for tramadol 50 mg tablets. Kansas requires K-TRACS (Prescription Drug Monitoring Program) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query K-TRACS, document the review, and apply corresponding-responsibility judgment",
      "Skip K-TRACS review for patients paying cash",
      "Query K-TRACS only for Schedule II drugs, not tramadol",
      "Delegate K-TRACS review and dispensing authorization to a technician"
    ),
    "Query K-TRACS, document the review, and apply corresponding-responsibility judgment",
    `Kansas requires pharmacists to query and document K-TRACS review before dispensing controlled substances. Cash payment does not waive monitoring. Tramadol is controlled under federal and Kansas schedules. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "KS",
      difficulty: 3,
      references: [KS_REF],
      tags: ["kansas", "K-TRACS", "PDMP", ...PE],
    }
  ),

  // ── Oklahoma (2) ──────────────────────────────────────────────────────────
  mpjeCase(
    "pharmacy-operations",
    `Scenario: A 63-year-old patient requests a pneumococcal vaccine at a Tulsa pharmacy. The pharmacist completed Oklahoma-required immunization training and the pharmacy operates under a valid protocol with prescriber oversight.`,
    "What is the pharmacist's most appropriate action?",
    opts4(
      "Administer the vaccine after screening, consent, and documentation per Oklahoma protocol requirements",
      "Refuse because pneumococcal vaccines may only be given in hospitals",
      "Allow a technician to administer while the pharmacist is in the building",
      "Require a new written prescription for each dose despite standing protocol"
    ),
    "Administer the vaccine after screening, consent, and documentation per Oklahoma protocol requirements",
    `Oklahoma authorizes pharmacist-administered immunizations under board-approved training and protocol oversight. Community pharmacy administration is permitted when requirements are met. Technicians cannot administer. Valid protocols may authorize vaccination without a separate prescription per dose when rules are satisfied.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 2,
      references: [OK_REF],
      tags: ["oklahoma", "immunization", "pneumococcal", ...PE],
    }
  ),

  mpjeCase(
    "controlled-substances",
    `Scenario: A 45-year-old patient in Oklahoma City presents a new prescription for oxycodone 5 mg tablets. Oklahoma requires Prescription Monitoring Program (PMP) review before dispensing applicable controlled substances.`,
    "What is the pharmacist's most appropriate action before dispensing?",
    opts4(
      "Query the Oklahoma PMP, document the review, and apply corresponding-responsibility judgment",
      "Skip PMP review for patients with local prescribers",
      "Query PMP only for Schedule II drugs, not oxycodone tablets",
      "Delegate PMP review and dispensing authorization to a technician"
    ),
    "Query the Oklahoma PMP, document the review, and apply corresponding-responsibility judgment",
    `Oklahoma requires pharmacists to query and document PMP review before dispensing controlled substances. Local prescriber status does not waive monitoring. Oxycodone is controlled. Technicians cannot authorize CS dispensing.`,
    {
      blueprintDomain: "mpje-jurisprudence",
      stateCode: "OK",
      difficulty: 3,
      references: [OK_REF],
      tags: ["oklahoma", "PMP", "PDMP", ...PE],
    }
  ),
];
