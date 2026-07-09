/**
 * NAPLEX Pharmaceutics Batch 01 — 30 premium board-style items.
 * Domains: Dosage Forms, Biopharmaceutics, USP <797>/<800>, Excipients/Stability.
 * Tone aligned with physician-educator NAPLEX seeds.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import {
  naplexCalcCase,
  naplexCase,
  naplexMcq,
  naplexOrdered,
  naplexSata,
} from "@/lib/exam-prep/naplex-seed-factory";

const DISP = "naplex-2026-medication-dispensing" as const;
const PHARM = "naplex-2026-pharmacotherapy" as const;
const TASKS = "naplex-2026-pharmacist-tasks" as const;

const BATCH = "pharmaceutics-batch-01";
const TAGS = ["pharmaceutics", "physician-educator", BATCH] as const;

const USP797 = {
  label: "USP <797> Pharmaceutical Compounding — Sterile Preparations",
  url: "https://www.usp.org",
};
const USP800 = {
  label: "USP <800> Hazardous Drugs — Handling in the Healthcare Setting",
  url: "https://www.usp.org",
};
const USP795 = {
  label: "USP <795> Pharmaceutical Compounding — Nonsterile Preparations",
  url: "https://www.usp.org",
};
const FDA = { label: "FDA prescribing information / Orange Book", url: "https://www.fda.gov/drugs" };
const ICH = { label: "ICH Q stability / quality guidance", url: "https://www.ich.org" };

const o = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const NAPLEX_PHARMACEUTICS_BATCH_01: EnrichedBankItem[] = [
  // ── 1. Dosage Forms & Drug Delivery (8) ──────────────────────────────────

  naplexCase(
    "pharmaceutics",
    `Chart: M.A., 68 y/o woman | New Rx: metoprolol succinate 100 mg PO daily | PMH: HFrEF, dysphagia after CVA | Nurse asks whether to crush the tablet and give via PEG tube`,
    "Which action is most appropriate?",
    [
      "Do not crush; contact the prescriber for an immediate-release alternative or liquid formulation appropriate for tube administration",
      "Crush and mix with water; succinate ER tablets may be crushed if given promptly",
      "Open the tablet and sprinkle contents into the PEG tube flush",
      "Switch to metoprolol tartrate 100 mg once daily without contacting the prescriber",
    ],
    "Do not crush; contact the prescriber for an immediate-release alternative or liquid formulation appropriate for tube administration",
    `Correct: Metoprolol succinate is an extended-release matrix/bead product; crushing destroys controlled release and can cause dose dumping and hypotension. Wrong: Crushing or sprinkling ER succinate is unsafe. Empirically substituting tartrate 100 mg once daily is not therapeutically equivalent (tartrate is typically BID) and requires a new order.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "dosage-forms", "extended-release", "enteral-tube"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Outpatient pharmacy | Patient picking up fentanyl 25 mcg/h transdermal patch | Counseling request`,
    "Which counseling point is most important for safe use?",
    o(
      "Apply to intact, non-irritated skin; avoid heat sources (heating pads, hot baths) that can increase absorption and overdose risk",
      "Cut the patch in half if 12.5 mcg/h is desired",
      "Place a heating pad over the patch to improve analgesia onset",
      "Apply only to the same site each time to improve adhesion"
    ),
    "Apply to intact, non-irritated skin; avoid heat sources (heating pads, hot baths) that can increase absorption and overdose risk",
    `Correct: Heat increases cutaneous blood flow and fentanyl delivery, raising overdose risk; rotate sites on intact skin. Wrong: Cutting reservoir/matrix patches can alter dose delivery. Heat pads are contraindicated. Repeated same-site application increases irritation.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "transdermal", "opioids", "counseling"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `ED | Child 4 y/o, 16 kg | Order: ondansetron ODT 4 mg | Parent reports child cannot swallow tablets | Pharmacy stocks ondansetron ODT and oral solution`,
    "Which dispensing approach is most appropriate?",
    [
      "Dispense ODT with counseling to allow the tablet to dissolve on the tongue without water; do not crush conventional tablets as a substitute without verifying formulation",
      "Crush a film-coated ondansetron tablet and mix with applesauce",
      "Give IV ondansetron orally because bioavailability is identical",
      "Refuse ODT because ODTs must be swallowed whole with a full glass of water",
    ],
    "Dispense ODT with counseling to allow the tablet to dissolve on the tongue without water; do not crush conventional tablets as a substitute without verifying formulation",
    `Correct: ODTs are designed to disintegrate on the tongue and are preferred when swallowing is difficult. Wrong: Crushing film-coated tablets may alter taste/stability and is not equivalent to an ODT. IV product orally is not automatically bioequivalent. ODTs should not be swallowed with a large water volume as if they were conventional tablets.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "ODT", "pediatric", "dosage-forms"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `Ambulatory care | Patient with COPD starting tiotropium HandiHaler | Pharmacist reviewing device technique`,
    "Which counseling points are appropriate for the HandiHaler device? (Select all that apply.)",
    [
      "Place one capsule into the device chamber; do not swallow the capsule",
      "Pierce the capsule using the device button before inhaling",
      "Inhale forcefully and deeply through the mouthpiece; a second inhalation from the same capsule is often recommended to empty remaining powder",
      "Wash the device in the dishwasher after each use",
      "Store capsules in the blister until use to protect from moisture",
    ],
    [
      "Place one capsule into the device chamber; do not swallow the capsule",
      "Pierce the capsule using the device button before inhaling",
      "Inhale forcefully and deeply through the mouthpiece; a second inhalation from the same capsule is often recommended to empty remaining powder",
      "Store capsules in the blister until use to protect from moisture",
    ],
    `Correct: Capsules are for inhalation only; piercing is required; deep inhalation ± second breath empties powder; moisture protection preserves dose. Wrong: Dishwasher cleaning can damage the device; follow manufacturer cleaning with water and air-dry.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "inhaler", "DPI", "device-technique", "SATA"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Hospital | Order: phenytoin 100 mg IV q8h | Nurse asks to administer undiluted IV push into a peripheral line running D5W`,
    "Which concern is most critical?",
    [
      "Phenytoin is poorly soluble at physiologic pH and incompatible with D5W; use NS diluent, filter as labeled, and avoid rapid peripheral push due to purple glove / cardiotoxicity risk",
      "Phenytoin is freely water-soluble; undiluted peripheral push is preferred",
      "Mix phenytoin with dopamine in the same Y-site to reduce line access",
      "Dilute only in D5W because NS precipitates phenytoin",
    ],
    "Phenytoin is poorly soluble at physiologic pH and incompatible with D5W; use NS diluent, filter as labeled, and avoid rapid peripheral push due to purple glove / cardiotoxicity risk",
    `Correct: Parenteral phenytoin requires careful dilution (typically NS), in-line filtration per labeling, and controlled infusion rates; D5W incompatibility and extravasation injury are classic risks. Wrong: It is not freely soluble for casual undiluted push. Y-site mixing with vasoactives is unsafe. NS—not D5W—is the usual diluent.`,
    {
      blueprintDomain: PHARM,
      difficulty: 5,
      references: [FDA],
      tags: [...TAGS, "parenteral", "compatibility", "phenytoin"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Community pharmacy | Patient asks why nifedipine IR capsules were replaced with an ER tablet for hypertension`,
    "Which pharmaceutics rationale best explains the change?",
    o(
      "IR nifedipine can cause rapid vasodilation and reflex tachycardia; ER formulations provide smoother plasma levels for chronic HTN",
      "ER tablets always have higher bioavailability than IR capsules",
      "IR capsules are Schedule II and ER tablets are not",
      "ER nifedipine must be taken only as needed for chest pain"
    ),
    "IR nifedipine can cause rapid vasodilation and reflex tachycardia; ER formulations provide smoother plasma levels for chronic HTN",
    `Correct: Immediate-release nifedipine is generally avoided for chronic hypertension because of abrupt hypotensive peaks. Wrong: ER does not universally increase bioavailability. Controlled-substance scheduling is unrelated. ER nifedipine for HTN is scheduled daily, not PRN angina dosing.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "modified-release", "cardiovascular"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Oncology clinic | Order: leuprolide depot IM | Technician prepares a multidose vial of leuprolide solution labeled for daily SC use`,
    "What is the pharmacist’s best action?",
    [
      "Do not substitute; depot microsphere/suspension products are not interchangeable with daily solution formulations—verify the exact depot product and reconstitution instructions",
      "Give the daily solution IM at an equivalent monthly milligram total",
      "Filter the daily solution through a 0.22-µm filter to create a depot",
      "Dilute the daily solution in oil to mimic depot kinetics",
    ],
    "Do not substitute; depot microsphere/suspension products are not interchangeable with daily solution formulations—verify the exact depot product and reconstitution instructions",
    `Correct: Depot injectables rely on specific polymer/oil matrices; daily solutions lack depot kinetics and are not dose-interchangeable by simple arithmetic. Wrong: Milligram totals do not create depot release. Filtration or oil dilution does not manufacture a licensed depot.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "depot", "parenteral", "product-selection"],
    }
  ),

  naplexOrdered(
    "pharmaceutics",
    `Inpatient | Preparing a new insulin glargine pen for first use | Nurse requests pharmacist verification of priming sequence`,
    "Order the steps for preparing a new multi-dose insulin pen for the first dose:",
    [
      "Attach a new needle",
      "Prime per manufacturer instructions (typically dial 2 units and expel until a drop appears)",
      "Dial the prescribed dose",
      "Inject subcutaneously and hold as directed",
      "Remove and safely discard the needle after injection",
    ],
    [
      "Attach a new needle",
      "Prime per manufacturer instructions (typically dial 2 units and expel until a drop appears)",
      "Dial the prescribed dose",
      "Inject subcutaneously and hold as directed",
      "Remove and safely discard the needle after injection",
    ],
    `Correct sequence ensures needle patency and dose accuracy before dialing the therapeutic dose; leaving needles attached increases air entry and contamination risk.`,
    {
      blueprintDomain: TASKS,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "insulin-pen", "device", "ordered"],
    }
  ),

  // ── 2. Biopharmaceutics (8) ──────────────────────────────────────────────

  naplexMcq(
    "pharmaceutics",
    `Formulary review | New oral anticancer agent labeled BCS Class II | Team discusses formulation strategy`,
    "Which statement best describes BCS Class II implications?",
    o(
      "Low solubility, high permeability — dissolution/solubilization strategies often limit absorption",
      "High solubility, high permeability — formulation rarely affects absorption",
      "Low solubility, low permeability — only IV administration is feasible",
      "High solubility, low permeability — food always decreases AUC"
    ),
    "Low solubility, high permeability — dissolution/solubilization strategies often limit absorption",
    `Correct: BCS II drugs are dissolution-rate limited; particle size reduction, salts, lipids, or amorphous solid dispersions are common. Wrong: That describes BCS I. BCS IV is low/low, not an automatic IV-only rule. Food effects are drug-specific, not universal for BCS III.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA, ICH],
      tags: [...TAGS, "BCS", "biopharmaceutics", "solubility"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Clinic | Patient on levothyroxine 100 mcg daily | TSH rises after switching from one AB-rated tablet to another and starting a high-fiber diet with calcium carbonate at the same time each morning`,
    "Which biopharmaceutic factor is the most likely contributor to reduced absorption?",
    [
      "Chelation/adsorption with calcium and fiber when co-administered; separate levothyroxine from cations and bulk fiber",
      "Complete first-pass hepatic extraction unique to AB-rated generics",
      "Mandatory refrigeration of all levothyroxine tablets after opening",
      "Conversion of T4 to reverse T3 by tablet excipients"
    ],
    "Chelation/adsorption with calcium and fiber when co-administered; separate levothyroxine from cations and bulk fiber",
    `Correct: Polyvalent cations and fiber reduce levothyroxine bioavailability when taken together. Wrong: AB-rated products meet BE standards; first-pass is not the differentiator here. Tablets are not universally refrigerated. Excipients do not convert T4 to rT3 in vivo as a primary mechanism.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "bioavailability", "food-drug", "levothyroxine"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Student question | Defining bioequivalence for a generic IR oral solid vs RLD`,
    "Which criterion best matches FDA bioequivalence expectations for most systemic IR products?",
    o(
      "90% CI for test/reference geometric mean ratios of AUC and Cmax within 80–125%",
      "Mean Tmax must be identical to the minute",
      "Dissolution at pH 1.2 only must be superimposable",
      "Urinary recovery must exceed 95% of the dose"
    ),
    "90% CI for test/reference geometric mean ratios of AUC and Cmax within 80–125%",
    `Correct: Standard average BE uses 80–125% limits on AUC and Cmax (log-transformed). Wrong: Tmax is supportive, not typically a strict identical-minute criterion. Single-pH dissolution alone does not define BE. Urinary recovery thresholds are not the general BE standard.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "bioequivalence", "Orange-Book", "AUC"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `HIV clinic | Patient on rilpivirine fails therapy after switching to taking the dose with a protein shake only, having previously taken it with a full meal`,
    "Which counseling correction is most accurate?",
    [
      "Rilpivirine requires a substantial caloric meal for adequate absorption; a low-calorie shake may markedly reduce bioavailability",
      "Rilpivirine must be taken strictly on an empty stomach",
      "Food decreases rilpivirine AUC; skip meals on dosing days",
      "Crushing the tablet and mixing with water improves absorption regardless of food"
    ],
    "Rilpivirine requires a substantial caloric meal for adequate absorption; a low-calorie shake may markedly reduce bioavailability",
    `Correct: Rilpivirine absorption is food-dependent; inadequate calories lower exposure and risk resistance. Wrong: Empty-stomach dosing is incorrect for rilpivirine. Food increases—not decreases—exposure. Crushing does not replace the meal requirement.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "food-effect", "bioavailability", "antiretroviral"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `Formulation science huddle | Factors that increase dissolution rate of a poorly soluble weak base per Noyes–Whitney principles`,
    "Which changes would be expected to increase dissolution rate? (Select all that apply.)",
    [
      "Decreasing particle size (increasing surface area)",
      "Using a more soluble salt form",
      "Increasing diffusion-layer thickness by highly viscous vehicles without other changes",
      "Maintaining sink conditions in the dissolution medium",
      "Switching to a less soluble polymorph with identical particle size"
    ],
    [
      "Decreasing particle size (increasing surface area)",
      "Using a more soluble salt form",
      "Maintaining sink conditions in the dissolution medium",
    ],
    `Correct: Rate ∝ surface area × solubility gradient; salts and sink conditions help. Wrong: Thicker diffusion layers slow dissolution. Less soluble polymorphs decrease Cs and slow dissolution.`,
    {
      blueprintDomain: PHARM,
      difficulty: 5,
      references: [ICH],
      tags: [...TAGS, "dissolution", "Noyes-Whitney", "preformulation", "SATA"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Anticoagulation clinic | Patient asks why dabigatran capsules must not be opened and sprinkled`,
    "Which biopharmaceutic reason is most accurate?",
    o(
      "Opening increases oral bioavailability substantially and elevates bleeding risk",
      "The pellets are inactive until crushed",
      "Sprinkling is required for bioequivalence to warfarin",
      "Capsules contain a prodrug that is destroyed only if swallowed whole"
    ),
    "Opening increases oral bioavailability substantially and elevates bleeding risk",
    `Correct: Dabigatran etexilate bioavailability rises markedly if pellets are taken outside the capsule shell. Wrong: Pellets are active as designed inside the capsule. Sprinkling is not a warfarin BE strategy. The issue is increased—not destroyed—exposure when opened.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "bioavailability", "capsule", "dabigatran"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Inpatient | Order: ciprofloxacin 500 mg PO | Patient receiving continuous enteral nutrition via NG tube; nurse plans to crush IR tablets and give with feeds`,
    "Which recommendation is best?",
    [
      "Hold feeds around the dose and flush the tube; avoid co-administration with multivalent cation-containing feeds that chelate fluoroquinolones",
      "Mix crushed ciprofloxacin directly into the enteral bag for continuous infusion over 24 hours",
      "Substitute ciprofloxacin ophthalmic drops orally milliliter-for-milliliter",
      "Give with calcium carbonate to improve dissolution"
    ],
    "Hold feeds around the dose and flush the tube; avoid co-administration with multivalent cation-containing feeds that chelate fluoroquinolones",
    `Correct: Chelation with Ca/Mg/Al/Fe in feeds reduces FQ absorption; separate administration and flush. Wrong: Continuous admixture prolongs chelation. Ophthalmic drops are not oral dose equivalents. Calcium worsens chelation.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "chelation", "enteral", "fluoroquinolone"],
    }
  ),

  naplexCalcCase(
    "pharmaceutics",
    `BE study review | Reference AUC = 100 ng·h/mL | Test product mean AUC ratio point estimate = 0.92 | Assume the 90% CI falls entirely within 80–125%`,
    "What is the test product AUC as a percentage of reference? (Round to nearest whole number.)",
    "92",
    "%",
    `0.92 × 100% = 92% of reference AUC. Point estimate within 80–125% is necessary but the 90% CI must also lie within limits for average BE.`,
    {
      blueprintDomain: PHARM,
      references: [FDA],
      tags: [...TAGS, "bioequivalence", "calculation"],
    },
    ["Ratio 0.92 → 92% of reference AUC", "Confirm 90% CI within 80–125%"]
  ),

  // ── 3. Sterile Compounding USP <797>/<800> (8) ───────────────────────────

  naplexCase(
    "pharmaceutics",
    `IV room | Technician prepares a Category 2 CSP from sterile starting components in an ISO Class 5 PEC within an ISO 7 cleanroom | No sterility testing performed | Storage refrigerated`,
    "Which beyond-use date framework is most consistent with current USP <797> principles?",
    [
      "Assign BUD based on CSP category, starting components, and storage conditions per <797>—not a universal 30-day refrigerated default",
      "Automatically assign 30 days refrigerated for any ISO 5 preparation",
      "Use manufacturer vial expiration as the CSP BUD even after puncture and admixture",
      "Assign BUD of 1 year if the PEC pressure is positive"
    ],
    "Assign BUD based on CSP category, starting components, and storage conditions per <797>—not a universal 30-day refrigerated default",
    `Correct: <797> BUDs depend on category (1 vs 2), whether nonsterile components were used, sterility testing, and storage temperature. Wrong: There is no blanket 30-day rule. Vial labeled expiry ≠ compounded BUD. PEC pressure alone does not grant 1-year BUDs.`,
    {
      blueprintDomain: TASKS,
      difficulty: 5,
      references: [USP797],
      tags: [...TAGS, "USP797", "BUD", "sterile-compounding"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `New cleanroom onboarding | Garbing for sterile compounding entering the buffer room`,
    "Which garbing practices align with USP <797> expectations? (Select all that apply.)",
    [
      "Don dedicated shoes or shoe covers and hair covers before entering the buffer area",
      "Perform hand hygiene and don sterile gloves with appropriate disinfection technique for the PEC",
      "Wear cosmetics and artificial nails if covered by gloves",
      "Remove jewelry that can shed particles before compounding",
      "Reuse a visibly soiled gown for the entire shift to reduce waste"
    ],
    [
      "Don dedicated shoes or shoe covers and hair covers before entering the buffer area",
      "Perform hand hygiene and don sterile gloves with appropriate disinfection technique for the PEC",
      "Remove jewelry that can shed particles before compounding",
    ],
    `Correct: Particle control and hand hygiene are foundational. Wrong: Cosmetics/artificial nails increase contamination risk. Soiled gowns must be replaced.`,
    {
      blueprintDomain: TASKS,
      difficulty: 3,
      references: [USP797],
      tags: [...TAGS, "USP797", "garbing", "aseptic", "SATA"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Oncology pharmacy | Preparing cyclophosphamide IV | Only a positive-pressure PEC is available in a positive-pressure room`,
    "Which USP <800> assessment is most accurate?",
    [
      "Hazardous drug sterile compounding requires containment primary engineering controls (e.g., BSC or CACI) and appropriate negative-pressure containment secondary engineering controls—do not prepare in a positive-pressure PEC/room setup",
      "Any laminar flow hood is acceptable if the technician double-gloves",
      "Cyclophosphamide is non-hazardous once diluted, so <800> no longer applies",
      "Positive pressure is preferred to keep HD vapors inside the room"
    ],
    "Hazardous drug sterile compounding requires containment primary engineering controls (e.g., BSC or CACI) and appropriate negative-pressure containment secondary engineering controls—do not prepare in a positive-pressure PEC/room setup",
    `Correct: <800> mandates containment engineering controls for sterile HDs. Wrong: Gloves alone do not replace C-PEC/C-SEC. Dilution does not remove HD status. Positive pressure is inappropriate for HD containment rooms.`,
    {
      blueprintDomain: TASKS,
      difficulty: 5,
      references: [USP800],
      tags: [...TAGS, "USP800", "hazardous-drugs", "chemo"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `IV admixture | Order: calcium gluconate and phosphate in the same TPN bag | Pharmacist reviewing sequence and concentrations`,
    "Which practice best reduces precipitation risk?",
    o(
      "Add phosphate first, mix thoroughly, add calcium last with adequate volume and follow institutional calcium-phosphate limits; inspect for precipitates",
      "Add calcium and phosphate concentrated together before any other additives",
      "Heat the bag to 40°C to keep salts dissolved",
      "Filter is unnecessary because TPN precipitates are always visible"
    ),
    "Add phosphate first, mix thoroughly, add calcium last with adequate volume and follow institutional calcium-phosphate limits; inspect for precipitates",
    `Correct: Order of mixing, dilution, pH, amino acid brand, and Ca×P product affect dibasic calcium phosphate precipitation. Wrong: Concentrated co-addition raises risk. Heating can worsen precipitation on cooling. Microprecipitates may be invisible—use limits and filters per policy.`,
    {
      blueprintDomain: PHARM,
      difficulty: 5,
      references: [USP797, FDA],
      tags: [...TAGS, "TPN", "compatibility", "calcium-phosphate"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Cleanroom | Media-fill test fails for one technician; surface sampling in the PEC shows actionable CFU counts`,
    "Which immediate quality response is most appropriate?",
    [
      "Quarantine affected CSPs as indicated, remove the technician from compounding until retraining/competency is documented, investigate, clean/disinfect, and document CAPA before resuming",
      "Ignore the media-fill failure if finger-tip sampling was clean last month",
      "Double the BUD of recently prepared CSPs to compensate for delays",
      "Switch to nonsterile compounding garb only"
    ],
    "Quarantine affected CSPs as indicated, remove the technician from compounding until retraining/competency is documented, investigate, clean/disinfect, and document CAPA before resuming",
    `Correct: Failed media-fill and actionable EM require stop-and-fix under a quality system. Wrong: Prior fingertip results do not nullify a failed media-fill. Extending BUDs increases risk. Garb changes do not address aseptic failure.`,
    {
      blueprintDomain: TASKS,
      difficulty: 4,
      references: [USP797],
      tags: [...TAGS, "USP797", "media-fill", "QA", "CAPA"],
    }
  ),

  naplexOrdered(
    "pharmaceutics",
    `Hazardous drug spill in the pharmacy | Spill kit available | No injury`,
    "Order the initial response steps:",
    [
      "Alert others and restrict access to the area",
      "Don appropriate HD PPE from the spill kit",
      "Contain and decontaminate per kit/institution protocol",
      "Dispose of waste as hazardous",
      "Document the spill and restock the kit"
    ],
    [
      "Alert others and restrict access to the area",
      "Don appropriate HD PPE from the spill kit",
      "Contain and decontaminate per kit/institution protocol",
      "Dispose of waste as hazardous",
      "Document the spill and restock the kit"
    ],
    `Correct: Protect people first, then PPE before contact, then contain/clean, hazardous disposal, and documentation/restock for readiness.`,
    {
      blueprintDomain: TASKS,
      difficulty: 3,
      references: [USP800],
      tags: [...TAGS, "USP800", "spill", "ordered"],
    }
  ),

  naplexCalcCase(
    "pharmaceutics",
    `IV room | Cefazolin 2 g in NS 100 mL to infuse over 30 minutes`,
    "What pump rate should be set (mL/hr)? (Round to nearest whole number.)",
    "200",
    "mL/hr",
    `100 mL ÷ 0.5 h = 200 mL/hr. Verify line compatibility and residual volume policies.`,
    {
      blueprintDomain: DISP,
      references: [USP797],
      tags: [...TAGS, "IV-rate", "calculation", "sterile"],
    },
    ["30 min = 0.5 h", "100 ÷ 0.5 = 200 mL/hr"]
  ),

  naplexMcq(
    "pharmaceutics",
    `USP <797> concept check | Differentiating Category 1 vs Category 2 CSPs`,
    "Which statement is most accurate?",
    o(
      "Category 1 CSPs have shorter BUDs and may be prepared in a PEC without a full cleanroom suite; Category 2 generally requires a cleanroom suite and allows longer BUDs when conditions are met",
      "Category 2 CSPs never require a cleanroom",
      "Category 1 CSPs always require sterility testing before release",
      "Categories are based only on whether the drug is hazardous"
    ),
    "Category 1 CSPs have shorter BUDs and may be prepared in a PEC without a full cleanroom suite; Category 2 generally requires a cleanroom suite and allows longer BUDs when conditions are met",
    `Correct: Category assignment drives facility requirements and BUDs. Wrong: Category 2 typically needs a suite. Sterility testing is not universal for Category 1. Hazardous status is governed primarily by <800>, not the Category 1/2 definition alone.`,
    {
      blueprintDomain: TASKS,
      difficulty: 4,
      references: [USP797],
      tags: [...TAGS, "USP797", "CSP-category"],
    }
  ),

  // ── 4. Excipients, Incompatibilities & Stability (6) ─────────────────────

  naplexCase(
    "pharmaceutics",
    `Pediatrics | Infant with known severe allergy to propylene glycol | Order: IV lorazepam infusion using a propylene glycol–containing formulation`,
    "Which pharmacist action is best?",
    [
      "Contact the prescriber to select an alternative agent/formulation without propylene glycol and discuss risk of PG toxicity/metabolic acidosis in infants",
      "Proceed because propylene glycol is inactive and never causes harm",
      "Increase the infusion rate to clear propylene glycol faster",
      "Add Intralipid to bind propylene glycol in-line"
    ],
    "Contact the prescriber to select an alternative agent/formulation without propylene glycol and discuss risk of PG toxicity/metabolic acidosis in infants",
    `Correct: PG can accumulate in infants and cause toxicity; formulation review is a core safety role. Wrong: Excipients can be harmful. Faster infusion worsens exposure. Lipid does not antidote PG in-line.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "excipients", "propylene-glycol", "pediatrics", "safety"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `IV compatibility | Nurse wants to Y-site phenytoin with D5W and dopamine`,
    "Which statement is most accurate?",
    o(
      "Phenytoin has multiple Y-site incompatibilities and precipitates in D5W; do not co-infuse without verified compatibility data",
      "All vasoactive drugs are compatible with phenytoin at any concentration",
      "Precipitation risk is eliminated if the line is opaque",
      "Compatibility is guaranteed if both drugs are clear solutions"
    ),
    "Phenytoin has multiple Y-site incompatibilities and precipitates in D5W; do not co-infuse without verified compatibility data",
    `Correct: Visual clarity does not equal compatibility; phenytoin is a classic precipitative risk in D5W and with many Y-site partners. Wrong: Vasoactives are not universally compatible. Opaque tubing hides precipitates. Clarity ≠ compatibility.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "incompatibility", "Y-site", "phenytoin"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `Stability teaching | Mechanisms that commonly degrade drug products`,
    "Which are common chemical degradation pathways pharmacists should consider? (Select all that apply.)",
    [
      "Hydrolysis of esters/amides",
      "Oxidation of catecholamines and unsaturated lipids",
      "Photolysis of light-sensitive compounds",
      "Radioactive decay of all organic tablets",
      "Racemization of some chiral drugs in solution"
    ],
    [
      "Hydrolysis of esters/amides",
      "Oxidation of catecholamines and unsaturated lipids",
      "Photolysis of light-sensitive compounds",
      "Racemization of some chiral drugs in solution",
    ],
    `Correct: Hydrolysis, oxidation, photolysis, and racemization are classic pathways informing storage (pH, antioxidants, light protection). Wrong: Ordinary tablets are not managed via radioactive decay.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [ICH],
      tags: [...TAGS, "stability", "degradation", "SATA"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `OR pharmacy | Sodium nitroprusside infusion prepared | Bag left under bright OR lights without opaque cover for 4 hours`,
    "Which concern is most appropriate?",
    [
      "Protect from light; photodegradation can release cyanide—discard if improperly stored per policy and prepare a light-protected bag",
      "Light exposure increases potency, so reduce the dose by half",
      "Nitroprusside is photostable indefinitely at room light",
      "Add sodium thiosulfate to the bag only after light exposure to reverse degradation"
    ],
    "Protect from light; photodegradation can release cyanide—discard if improperly stored per policy and prepare a light-protected bag",
    `Correct: Nitroprusside requires light protection; degradation products include cyanide. Wrong: Light does not safely “increase potency.” It is not photostable under bright light. Thiosulfate is a cyanide antidote strategy in toxicity management, not a fix for an improperly stored bag.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "photolysis", "nitroprusside", "storage"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Compounding lab | Preparing an emulsion; choosing an emulsifier using HLB`,
    "Which principle is most correct?",
    o(
      "Match emulsifier HLB to the required HLB of the oil phase for a stable o/w or w/o emulsion",
      "Highest HLB emulsifiers always make the most stable w/o emulsions",
      "HLB is irrelevant if the mixture is shaken once",
      "Only anionic surfactants can emulsify oils"
    ),
    "Match emulsifier HLB to the required HLB of the oil phase for a stable o/w or w/o emulsion",
    `Correct: Required HLB concept guides emulsifier selection. Wrong: High HLB favors o/w, not w/o. Shaking once does not replace formulation science. Nonionic emulsifiers are widely used.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [USP795],
      tags: [...TAGS, "emulsions", "HLB", "excipients"],
    }
  ),

  naplexCalcCase(
    "pharmaceutics",
    `Compounding | Prepare 240 mL of 0.9% w/v sodium chloride irrigation from 23.4% w/v NaCl stock`,
    "How many mL of 23.4% stock are required? (Round to one decimal place.)",
    "9.2",
    "mL",
    `C1V1 = C2V2 → (23.4)(V1) = (0.9)(240) → V1 = 216 / 23.4 ≈ 9.23 → 9.2 mL. QS with sterile water to 240 mL.`,
    {
      blueprintDomain: DISP,
      references: [USP795],
      tags: [...TAGS, "alligation-dilution", "calculation", "tonicity"],
    },
    ["0.9 × 240 = 216", "216 ÷ 23.4 ≈ 9.2 mL stock"]
  ),
];
