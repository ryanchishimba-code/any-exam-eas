/**
 * NAPLEX Pharmaceutics Batch 02 — 30 premium board-style items.
 * Domains: Preformulation, Manufacturing/QA, Modified Delivery,
 * USP <795>, Packaging/Storage, Pharmaceutics Calculations.
 * Tone aligned with Batch 01 / physician-educator NAPLEX seeds.
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

const BATCH = "pharmaceutics-batch-02";
const TAGS = ["pharmaceutics", "physician-educator", BATCH] as const;

const USP795 = {
  label: "USP <795> Pharmaceutical Compounding — Nonsterile Preparations",
  url: "https://www.usp.org",
};
const USP797 = {
  label: "USP <797> Pharmaceutical Compounding — Sterile Preparations",
  url: "https://www.usp.org",
};
const FDA = { label: "FDA prescribing information / Orange Book", url: "https://www.fda.gov/drugs" };
const ICH = { label: "ICH Q stability / quality guidance", url: "https://www.ich.org" };
const CGMP = {
  label: "FDA cGMP / 21 CFR Parts 210–211",
  url: "https://www.fda.gov/drugs",
};

const o = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const NAPLEX_PHARMACEUTICS_BATCH_02: EnrichedBankItem[] = [
  // ── 5. Preformulation & Physicochemical Properties (6) ───────────────────

  naplexMcq(
    "pharmaceutics",
    `Formulation huddle | Candidate API is a weak acid with pKa 4.5 | Team discusses ionization at intestinal pH ~6.5`,
    "Using Henderson–Hasselbalch reasoning, which statement is most accurate?",
    o(
      "At pH 6.5 (≈2 units above pKa), the weak acid is predominantly ionized (A−), which can reduce membrane permeation relative to the unionized form",
      "At pH 6.5 the weak acid is almost entirely unionized HA",
      "pKa is irrelevant to GI absorption for weak acids",
      "Weak acids are always best absorbed from the stomach because they are fully ionized there"
    ),
    "At pH 6.5 (≈2 units above pKa), the weak acid is predominantly ionized (A−), which can reduce membrane permeation relative to the unionized form",
    `Correct: For weak acids, pH > pKa favors A−; ~2 pH units above pKa ≈ 99% ionized. Wrong: Unionized predominates when pH ≪ pKa. pKa strongly influences absorption. Stomach acidity favors unionized HA, not full ionization.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [ICH],
      tags: [...TAGS, "pKa", "Henderson-Hasselbalch", "ionization", "preformulation"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `R&D consult | Two polymorphs of the same API: Form I (stable, lower solubility) and Form II (metastable, higher solubility) | Dissolution-limited BCS II compound`,
    "Which pharmaceutics concern is most important if Form II converts to Form I during storage?",
    [
      "Bioavailability may fall as the more soluble metastable form converts to the less soluble stable polymorph",
      "Polymorph conversion always increases potency by 50%",
      "Only color changes; dissolution is unaffected for BCS II drugs",
      "Metastable forms never convert once compressed into tablets",
    ],
    "Bioavailability may fall as the more soluble metastable form converts to the less soluble stable polymorph",
    `Correct: Polymorph transitions can change solubility/dissolution and exposure for dissolution-limited drugs. Wrong: Conversion does not reliably increase potency. BCS II drugs are sensitive to dissolution changes. Compression does not permanently freeze metastable forms.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [ICH, FDA],
      tags: [...TAGS, "polymorphism", "solubility", "stability", "preformulation"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Student question | Interpreting log P for oral absorption risk`,
    "Which statement best describes a drug with very high log P (highly lipophilic)?",
    o(
      "May dissolve poorly in aqueous GI fluids and show dissolution-limited absorption despite high membrane affinity",
      "Always has complete oral bioavailability",
      "Cannot cross lipid membranes",
      "Must be formulated only as an IV solution"
    ),
    "May dissolve poorly in aqueous GI fluids and show dissolution-limited absorption despite high membrane affinity",
    `Correct: Extreme lipophilicity often means poor aqueous solubility → dissolution limits absorption. Wrong: High log P does not guarantee F. Lipophilic drugs cross membranes readily when dissolved. Many high-log-P drugs are oral solids with enabling formulations.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [ICH],
      tags: [...TAGS, "logP", "lipophilicity", "preformulation"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `Preformulation checklist | Properties that commonly affect solid oral product performance`,
    "Which physicochemical factors should the pharmacist/formulator prioritize? (Select all that apply.)",
    [
      "Particle size / surface area (dissolution rate)",
      "Hygroscopicity (moisture uptake and stability)",
      "Polymorphic form",
      "Tablet color preference of the CEO",
      "pKa and solubility–pH profile",
    ],
    [
      "Particle size / surface area (dissolution rate)",
      "Hygroscopicity (moisture uptake and stability)",
      "Polymorphic form",
      "pKa and solubility–pH profile",
    ],
    `Correct: Particle size, moisture sensitivity, polymorph, and ionization/solubility drive performance and stability. Wrong: Executive color preference is not a scientific critical quality attribute.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [ICH],
      tags: [...TAGS, "preformulation", "particle-size", "hygroscopicity", "SATA"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Compounding lab | Preparing a poorly soluble antifungal as a micellar solution using a nonionic surfactant above its CMC`,
    "Which statement best explains the pharmaceutics rationale?",
    [
      "Above the critical micelle concentration, surfactant micelles can solubilize lipophilic drug in their hydrophobic cores",
      "Surfactants only work below the CMC",
      "Micelles permanently covalently bind the drug, eliminating the need for dosing adjustments",
      "CMC is unrelated to solubilization capacity",
    ],
    "Above the critical micelle concentration, surfactant micelles can solubilize lipophilic drug in their hydrophobic cores",
    `Correct: Micellar solubilization requires surfactant ≥ CMC. Wrong: Below CMC, micelles are not present. Solubilization is equilibrium partitioning, not covalent binding. CMC is central to micelle formation.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [USP795],
      tags: [...TAGS, "micelles", "solubilization", "surfactant", "preformulation"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `IV admixture teaching | Chelation concern with tetracycline and polyvalent cations`,
    "Which pharmaceutics principle best explains reduced oral absorption when taken with calcium?",
    o(
      "Complexation/chelation forms poorly absorbed complexes, lowering free drug available for absorption",
      "Calcium irreversibly destroys the tetracycline nucleus by oxidation",
      "Calcium increases first-pass CYP3A4 extraction only",
      "All antibiotics require empty-stomach dosing solely because of taste"
    ),
    "Complexation/chelation forms poorly absorbed complexes, lowering free drug available for absorption",
    `Correct: Classic cation–tetracycline chelation reduces bioavailability. Wrong: Not primarily oxidative destruction. CYP induction is not the mechanism. Taste is not the universal reason for empty-stomach rules.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "chelation", "complexation", "tetracycline", "preformulation"],
    }
  ),

  // ── 6. Manufacturing Processes & QA (4) ──────────────────────────────────

  naplexMcq(
    "pharmaceutics",
    `Manufacturing tour | Wet granulation vs direct compression for a moisture-sensitive API`,
    "Which process choice is most appropriate?",
    o(
      "Prefer direct compression or dry granulation to avoid water exposure that can degrade a moisture-sensitive API",
      "Always use wet granulation because water improves chemical stability",
      "Skip all granulation and ship bulk powder in open drums",
      "Coat only after dissolving the API completely in water overnight"
    ),
    "Prefer direct compression or dry granulation to avoid water exposure that can degrade a moisture-sensitive API",
    `Correct: Wet granulation introduces water/heat that can harm moisture-labile APIs; dry processes are preferred. Wrong: Water does not stabilize moisture-sensitive drugs. Open drums violate cGMP. Dissolving overnight is not a standard solid-dose strategy here.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [CGMP],
      tags: [...TAGS, "granulation", "manufacturing", "cGMP"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `QA review | Batch fails content uniformity (high RSD of assay across dosage units) | Blend appeared visually homogeneous`,
    "What is the most appropriate interpretation?",
    [
      "Visual homogeneity does not guarantee content uniformity; investigate blend segregation, sampling, or process controls before release",
      "Release the batch because color looks even",
      "Content uniformity testing is optional for oral solids",
      "Increase the label claim on the bottle to match the highest unit assayed",
    ],
    "Visual homogeneity does not guarantee content uniformity; investigate blend segregation, sampling, or process controls before release",
    `Correct: CU is a critical quality attribute; visual checks are insufficient. Wrong: Appearance ≠ assay uniformity. CU is required for many oral solids. Changing label claim to match outliers is fraudulent.`,
    {
      blueprintDomain: TASKS,
      difficulty: 4,
      references: [CGMP, ICH],
      tags: [...TAGS, "content-uniformity", "QA", "cGMP"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `cGMP refresher | Elements expected in a robust pharmaceutical quality system`,
    "Which belong in manufacturing quality systems? (Select all that apply.)",
    [
      "Process validation and ongoing process verification",
      "Deviation investigation and CAPA",
      "Documented batch records and change control",
      "Skipping environmental monitoring when production is busy",
      "Impurity and residual solvent controls per ICH guidance",
    ],
    [
      "Process validation and ongoing process verification",
      "Deviation investigation and CAPA",
      "Documented batch records and change control",
      "Impurity and residual solvent controls per ICH guidance",
    ],
    `Correct: Validation, CAPA, documentation/change control, and impurity controls are core. Wrong: Busy schedules do not justify skipping monitoring.`,
    {
      blueprintDomain: TASKS,
      difficulty: 3,
      references: [CGMP, ICH],
      tags: [...TAGS, "cGMP", "CAPA", "validation", "SATA"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Dissolution lab | IR tablet shows slow dissolution at pH 1.2 but rapid dissolution at pH 6.8 | Weak base API`,
    "Which interpretation is most consistent?",
    o(
      "Ionization/solubility of a weak base often improves as pH decreases; investigate formulation, coating, or method—do not assume failure is irrelevant",
      "Dissolution media pH never matters for weak bases",
      "Slow acid-stage dissolution always proves the product is therapeutically inert",
      "Only alkaline media are valid for all oral solids"
    ),
    "Ionization/solubility of a weak base often improves as pH decreases; investigate formulation, coating, or method—do not assume failure is irrelevant",
    `Correct: Weak bases are generally more soluble in acid; anomalous profiles need investigation (method, coating, polymorphism). Wrong: pH is critical. A single medium result does not alone prove clinical inertness. Multi-pH profiles are used thoughtfully, not “alkaline only.”`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA, ICH],
      tags: [...TAGS, "dissolution", "weak-base", "QA"],
    }
  ),

  // ── 7. Modified & Novel Drug Delivery (6) ────────────────────────────────

  naplexCase(
    "pharmaceutics",
    `Inpatient | Order: nifedipine osmotic pump (OROS) ER tablet | Nurse asks to crush for NG tube`,
    "Which action is most appropriate?",
    [
      "Do not crush; osmotic pump tablets must be swallowed whole—crushing destroys the rate-controlling membrane and risks dose dumping",
      "Crush and flush; OROS tablets are designed to be opened",
      "Dissolve the tablet in hot water to speed onset",
      "Cut the tablet in half to create an IR dose",
    ],
    "Do not crush; osmotic pump tablets must be swallowed whole—crushing destroys the rate-controlling membrane and risks dose dumping",
    `Correct: OROS relies on an intact semipermeable membrane and laser-drilled orifice. Wrong: Crushing/cutting/hot dissolution defeats controlled release and can cause dangerous peaks.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "OROS", "osmotic-pump", "modified-release", "do-not-crush"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Oncology | Liposomal doxorubicin vs conventional doxorubicin discussion`,
    "Which pharmaceutics advantage is most associated with PEGylated liposomal formulations?",
    o(
      "Altered distribution with prolonged circulation and reduced peak free-drug exposure in some tissues, changing toxicity profile vs conventional solution",
      "Identical tissue distribution to free drug at all times",
      "Complete elimination of all cardiotoxicity in every patient",
      "Ability to crush capsules for NG administration"
    ),
    "Altered distribution with prolonged circulation and reduced peak free-drug exposure in some tissues, changing toxicity profile vs conventional solution",
    `Correct: Liposomes/PEGylation change PK/distribution and toxicity patterns; products are not interchangeable milligram-for-milligram without labeling. Wrong: Distribution is not identical. Cardiotoxicity is reduced in pattern/risk but not magically zero. These are IV products, not crushable capsules.`,
    {
      blueprintDomain: PHARM,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "liposome", "PEGylation", "nanoparticle", "oncology"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Pain clinic | Abuse-deterrent ER opioid tablet | Patient asks why it cannot be snorted easily`,
    "Which formulation strategy best matches common abuse-deterrent design?",
    o(
      "Polymer matrices that resist crushing/extraction and/or form viscous gels when manipulated with solvents",
      "Adding candy flavoring to discourage misuse",
      "Making tablets larger so they cannot fit in a pill organizer",
      "Removing all opioid from the tablet core"
    ),
    "Polymer matrices that resist crushing/extraction and/or form viscous gels when manipulated with solvents",
    `Correct: ADF opioids use physical/chemical barriers to manipulation. Wrong: Flavor and size are not ADF mechanisms. Removing opioid would eliminate analgesia, not define ADF design.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "abuse-deterrent", "modified-release", "opioids"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Ambulatory | Patient on methylphenidate osmotic ER (Concerta-type) reports seeing “ghost tablets” in stool`,
    "Which counseling point is most accurate?",
    [
      "The empty insoluble shell may appear in stool; drug has usually been released—this does not mean the dose failed if symptoms are controlled",
      "Ghost tablets mean zero absorption; double the next dose",
      "Ghost tablets indicate the patient must chew all future doses",
      "Stop therapy immediately because shells are toxic",
    ],
    "The empty insoluble shell may appear in stool; drug has usually been released—this does not mean the dose failed if symptoms are controlled",
    `Correct: Osmotic shells are excreted intact after release. Wrong: Do not double doses empirically. Chewing defeats ER. Shells are expected, not a toxicity alarm by themselves.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "osmotic-pump", "ghost-tablet", "counseling"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `Formulary | Mechanisms used in oral modified-release design`,
    "Which are recognized ER/CR/DR strategies? (Select all that apply.)",
    [
      "Hydrophilic/hydrophobic matrix erosion or diffusion",
      "Reservoir membrane-coated pellets/tablets",
      "Osmotic pump systems",
      "Enteric coating for delayed release in intestine",
      "Randomly omitting half the labeled milligrams from each tablet",
    ],
    [
      "Hydrophilic/hydrophobic matrix erosion or diffusion",
      "Reservoir membrane-coated pellets/tablets",
      "Osmotic pump systems",
      "Enteric coating for delayed release in intestine",
    ],
    `Correct: Matrix, reservoir, osmotic, and enteric DR are standard. Wrong: Underfilling tablets is adulteration, not a release mechanism.`,
    {
      blueprintDomain: PHARM,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "matrix", "reservoir", "enteric", "modified-release", "SATA"],
    }
  ),

  naplexOrdered(
    "pharmaceutics",
    `Device teaching | First use of a new implantable subcutaneous drug pump refill (clinic protocol overview)`,
    "Order the high-level pharmacist safety sequence for a pump refill visit:",
    [
      "Verify patient, product, concentration, and residual volume against pump records",
      "Aseptically access the pump reservoir per device protocol",
      "Remove residual medication and document volume wasted/returned",
      "Instill the prescribed refill volume of the correct concentration",
      "Program/confirm pump settings and counsel on alarm/follow-up",
    ],
    [
      "Verify patient, product, concentration, and residual volume against pump records",
      "Aseptically access the pump reservoir per device protocol",
      "Remove residual medication and document volume wasted/returned",
      "Instill the prescribed refill volume of the correct concentration",
      "Program/confirm pump settings and counsel on alarm/follow-up",
    ],
    `Correct: Identity/concentration verification precedes access; residual removal prevents mixing errors; refill then programming/counseling completes the safety loop.`,
    {
      blueprintDomain: TASKS,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "implantable-pump", "ordered", "device"],
    }
  ),

  // ── 8. Non-sterile Compounding & USP <795> (6) ───────────────────────────

  naplexCase(
    "pharmaceutics",
    `Community compounding | Nonsterile aqueous oral suspension compounded from crushed tablets | Stored at controlled room temperature | No water activity data`,
    "Per USP <795> risk-aware practice, which BUD approach is most appropriate?",
    [
      "Assign a conservative BUD consistent with <795> for aqueous nonsterile preparations (commonly ≤14 days refrigerated when applicable) unless stability data support longer—and document the basis",
      "Use a 1-year BUD because commercial tablets were used",
      "Omit a BUD if the patient promises to finish the bottle",
      "Use the manufacturer’s bottle expiration date unchanged for the compounded suspension",
    ],
    "Assign a conservative BUD consistent with <795> for aqueous nonsterile preparations (commonly ≤14 days refrigerated when applicable) unless stability data support longer—and document the basis",
    `Correct: Compounded aqueous nonsteriles have limited default BUDs under <795>; commercial expiry does not transfer. Wrong: 1-year default is inappropriate. BUD cannot be omitted. Manufacturer dating applies to the intact commercial product, not the new preparation.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [USP795],
      tags: [...TAGS, "USP795", "BUD", "suspension", "nonsterile"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Compounding technique | Mixing a potent powder into an ointment base`,
    "Which method best ensures uniform distribution of a small powder quantity?",
    o(
      "Geometric dilution: mix powder with an equal portion of base, then successively dilute with equal portions until uniform",
      "Dump all powder on top and stir once",
      "Heat the base to boiling with the powder uncovered for 30 minutes",
      "Shake the closed jar of base without opening to “mix by vibration”"
    ),
    "Geometric dilution: mix powder with an equal portion of base, then successively dilute with equal portions until uniform",
    `Correct: Geometric dilution is the standard for potent/small-quantity powders. Wrong: Single stir causes hot spots. Boiling can degrade drugs and alter base. Closed-jar vibration does not disperse powder into ointment.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [USP795],
      tags: [...TAGS, "geometric-dilution", "USP795", "ointment"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `USP <795> documentation | Required elements before releasing a compounded nonsterile preparation`,
    "Which should be documented? (Select all that apply.)",
    [
      "Master formulation record / compounding record with ingredients and quantities",
      "Assigned BUD and storage conditions",
      "Compounder identity and quality checks (e.g., appearance, weight)",
      "Patient counseling that BUDs are optional suggestions only",
      "Prescription/order information linking the preparation to the patient",
    ],
    [
      "Master formulation record / compounding record with ingredients and quantities",
      "Assigned BUD and storage conditions",
      "Compounder identity and quality checks (e.g., appearance, weight)",
      "Prescription/order information linking the preparation to the patient",
    ],
    `Correct: Records, BUD/storage, identity/QC, and order linkage are core. Wrong: BUDs are not optional suggestions.`,
    {
      blueprintDomain: TASKS,
      difficulty: 3,
      references: [USP795],
      tags: [...TAGS, "USP795", "documentation", "SATA"],
    }
  ),

  naplexCase(
    "pharmaceutics",
    `Compounding | Capsule filling | Calculated fill weight for #1 capsules is consistently 10% under target after packing`,
    "What is the pharmacist’s best next step?",
    [
      "Recalibrate technique/equipment, verify powder density/tapped volume, and adjust fill method or capsule size before releasing underfilled units",
      "Release the batch and counsel that underfill improves safety",
      "Add random extra powder to some capsules only",
      "Ignore weight checks because capsules look full",
    ],
    "Recalibrate technique/equipment, verify powder density/tapped volume, and adjust fill method or capsule size before releasing underfilled units",
    `Correct: Content/fill accuracy is a quality requirement; investigate density and process. Wrong: Systematic underfill is not a safety feature. Spot-adding powder worsens variability. Appearance ≠ assay.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [USP795],
      tags: [...TAGS, "capsules", "powder-volume", "USP795", "QA"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Topical compounding | Patient needs a hydrophilic drug in a greasy occlusive base for dry plaque psoriasis`,
    "Which base selection principle is most appropriate?",
    o(
      "Match drug solubility/release needs and skin condition—occlusive oleaginous bases can enhance penetration for some topicals on dry lesions but may hinder release of highly hydrophilic drugs unless formulated appropriately",
      "Any base is interchangeable if the percent strength matches",
      "Always use alcohol as the only vehicle for psoriasis",
      "Water-washable creams never deliver drug to skin"
    ),
    "Match drug solubility/release needs and skin condition—occlusive oleaginous bases can enhance penetration for some topicals on dry lesions but may hinder release of highly hydrophilic drugs unless formulated appropriately",
    `Correct: Base selection is a biopharmaceutic decision (partitioning, occlusion, lesion type). Wrong: % strength alone ignores release. Alcohol-only is not universal. Creams can deliver drug effectively.`,
    {
      blueprintDomain: DISP,
      difficulty: 4,
      references: [USP795],
      tags: [...TAGS, "topical-base", "ointment", "USP795"],
    }
  ),

  naplexOrdered(
    "pharmaceutics",
    `Nonsterile compounding | Preparing a divided powder (chartulae) from a potent API using geometric dilution`,
    "Order the steps:",
    [
      "Calculate individual and total powder quantities including diluent",
      "Triturate potent API with an equal portion of diluent (geometric dilution)",
      "Continue geometric dilution until the entire blend is uniform",
      "Divide the blend into equal labeled powder papers/packets by weight",
      "Assign BUD, label, and document the compounding record",
    ],
    [
      "Calculate individual and total powder quantities including diluent",
      "Triturate potent API with an equal portion of diluent (geometric dilution)",
      "Continue geometric dilution until the entire blend is uniform",
      "Divide the blend into equal labeled powder papers/packets by weight",
      "Assign BUD, label, and document the compounding record",
    ],
    `Correct: Accurate calculation precedes dilution; geometric mixing precedes equal division; labeling/BUD closes the process.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [USP795],
      tags: [...TAGS, "powders", "geometric-dilution", "ordered", "USP795"],
    }
  ),

  // ── 9. Packaging, Labeling & Storage (4) ─────────────────────────────────

  naplexCase(
    "pharmaceutics",
    `Outpatient | Dispensing nitroglycerin sublingual tablets | Patient asks to move tablets into a weekly pill organizer for convenience`,
    "Which counseling point is most important?",
    [
      "Keep SL NTG in the original glass container, tightly closed, protected from heat/moisture; do not transfer to pillboxes that can adsorb drug and reduce potency",
      "Pill organizers improve NTG stability by increasing air exposure",
      "Store SL NTG in the bathroom for humidity conditioning",
      "Freeze SL NTG tablets to extend dating indefinitely",
    ],
    "Keep SL NTG in the original glass container, tightly closed, protected from heat/moisture; do not transfer to pillboxes that can adsorb drug and reduce potency",
    `Correct: NTG volatilizes/adsorbs; original packaging is critical. Wrong: Pillboxes and bathroom humidity harm stability. Freezing is not appropriate indefinite dating.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "packaging", "nitroglycerin", "storage", "stability"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Specialty pharmacy | Monoclonal antibody arrives with temperature logger showing 2-hour excursion to 28°C`,
    "What is the pharmacist’s best action?",
    o(
      "Quarantine the product, review manufacturer excursion guidance/stability data, and do not dispense until disposition is documented per policy",
      "Dispense immediately because brief warmth always improves biologics",
      "Shake vigorously to “re-cool” the protein",
      "Ignore the logger if the box feels cool now"
    ),
    "Quarantine the product, review manufacturer excursion guidance/stability data, and do not dispense until disposition is documented per policy",
    `Correct: Cold-chain excursions require documented evaluation against product-specific data. Wrong: Warmth does not improve biologics. Shaking can denature proteins. Current feel does not erase excursion history.`,
    {
      blueprintDomain: TASKS,
      difficulty: 4,
      references: [FDA],
      tags: [...TAGS, "cold-chain", "excursion", "biologics", "storage"],
    }
  ),

  naplexSata(
    "pharmaceutics",
    `Packaging selection | Light- and moisture-sensitive oral solid`,
    "Which packaging/storage controls are appropriate? (Select all that apply.)",
    [
      "Amber or opaque containers to limit photodegradation",
      "Desiccant when moisture sensitivity is documented",
      "Tightly closed containers protecting from humidity",
      "Repack into clear unlabeled sandwich bags for patients",
      "Storage at labeled temperature range",
    ],
    [
      "Amber or opaque containers to limit photodegradation",
      "Desiccant when moisture sensitivity is documented",
      "Tightly closed containers protecting from humidity",
      "Storage at labeled temperature range",
    ],
    `Correct: Light, moisture, closure, and temperature controls protect sensitive solids. Wrong: Clear unlabeled bags fail light/moisture/labeling requirements.`,
    {
      blueprintDomain: DISP,
      difficulty: 3,
      references: [USP795, FDA],
      tags: [...TAGS, "light-protection", "moisture", "packaging", "SATA"],
    }
  ),

  naplexMcq(
    "pharmaceutics",
    `Dispensing | Child-resistant container (CRC) request | Adult patient with severe rheumatoid arthritis cannot open CRC`,
    "Which action best balances safety and access?",
    o(
      "Document a patient request for non–child-resistant packaging when permitted, counsel on safe storage away from children, and dispense accordingly",
      "Refuse all non-CRC packaging in every circumstance",
      "Leave the vial uncapped to improve access",
      "Transfer into an unmarked baggie without labeling"
    ),
    "Document a patient request for non–child-resistant packaging when permitted, counsel on safe storage away from children, and dispense accordingly",
    `Correct: Patients may request non-CRC packaging with documentation and counseling. Wrong: Blanket refusal ignores access needs. Uncapped/unlabeled dispensing is unsafe and noncompliant.`,
    {
      blueprintDomain: TASKS,
      difficulty: 3,
      references: [FDA],
      tags: [...TAGS, "child-resistant", "labeling", "packaging"],
    }
  ),

  // ── 10. Pharmaceutics Calculations (4) ───────────────────────────────────

  naplexCalcCase(
    "pharmaceutics",
    `Alligation | Prepare 120 mL of 15% w/v dextrose using 50% and 5% stock solutions`,
    "How many mL of 50% dextrose are required? (Round to the nearest whole mL.)",
    "27",
    "mL",
    `Alligation: 50 − 15 = 35 parts of 5%; 15 − 5 = 10 parts of 50%; total 45 parts. Volume of 50% = (10/45) × 120 = 26.67 ≈ 27 mL.`,
    {
      blueprintDomain: DISP,
      references: [USP795],
      tags: [...TAGS, "alligation", "calculation", "dextrose"],
    },
    ["Parts 50%: 15 − 5 = 10", "Parts 5%: 50 − 15 = 35", "(10/45) × 120 ≈ 27 mL"]
  ),

  naplexCalcCase(
    "pharmaceutics",
    `Isotonicity | Prepare 30 mL of 1% w/v drug solution isotonic with NS | E-value (NaCl eq) of drug = 0.18 | NS = 0.9% NaCl`,
    "How many milligrams of NaCl must be added? (Round to the nearest whole mg.)",
    "216",
    "mg",
    `NaCl needed for isotonicity of 30 mL = 0.9% × 30 mL = 270 mg. NaCl contribution of drug = 1% × 30 mL × 0.18 = 54 mg. NaCl to add = 270 − 54 = 216 mg.`,
    {
      blueprintDomain: DISP,
      references: [USP795],
      tags: [...TAGS, "isotonicity", "E-value", "calculation"],
    },
    ["0.9 × 30 = 270 mg NaCl for blank", "1% × 30 × 0.18 = 54 mg eq", "270 − 54 = 216 mg NaCl"]
  ),

  naplexCalcCase(
    "pharmaceutics",
    `Percent strength | A cream is labeled 2% w/w hydrocortisone | Pharmacist compounds 45 g total`,
    "How many milligrams of hydrocortisone are in the entire preparation? (Round to nearest whole mg.)",
    "900",
    "mg",
    `2% w/w = 2 g/100 g = 0.02 × 45 g = 0.9 g = 900 mg.`,
    {
      blueprintDomain: DISP,
      references: [USP795],
      tags: [...TAGS, "percent-strength", "w/w", "calculation"],
    },
    ["0.02 × 45 g = 0.9 g", "0.9 g = 900 mg"]
  ),

  naplexCalcCase(
    "pharmaceutics",
    `Multi-dose vial | Insulin glargine 100 units/mL, 10 mL vial | Patient uses 28 units SC daily | Beyond-use after first puncture: 28 days refrigerated per labeling`,
    "What is the maximum days’ supply supported by both contents and in-use dating if started today? (Whole days.)",
    "28",
    "days",
    `Content days = (100 units/mL × 10 mL) / 28 units/day = 1000/28 ≈ 35.7 days. In-use BUD = 28 days. Limiting factor = 28 days.`,
    {
      blueprintDomain: DISP,
      references: [FDA],
      tags: [...TAGS, "BUD", "multi-dose-vial", "calculation", "insulin"],
    },
    ["1000 units ÷ 28 ≈ 35.7 content days", "In-use dating 28 days limits supply"]
  ),
];
