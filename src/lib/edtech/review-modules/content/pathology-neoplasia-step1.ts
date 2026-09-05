import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const PATHOLOGY_NEOPLASIA_STEP1_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Pathology is ~18% of Step 1 and appears in almost every organ-system vignette as mechanism-of-disease questions. Boards test inflammation patterns, neoplasia hallmarks, and hemodynamic consequences — not rare esoteric diagnoses.",
        "Recognition of granulomatous inflammation, dysplasia vs invasion, and shock physiology unlocks hundreds of basic-science items linked to clinical stems.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Acute inflammation: vasodilation, permeability, neutrophil margination and chemotaxis, fibrin exudate",
        "Chronic inflammation: mononuclear infiltrate, angiogenesis, fibrosis; granuloma = activated macrophages ± giant cells",
        "Caseating granuloma (central necrosis) — TB classic; non-caseating — sarcoid, foreign body",
        "Neoplasia hallmarks: growth signal autonomy, evasion of suppressors, apoptosis resistance, immortalization, angiogenesis, invasion/metastasis",
        "Carcinoma (epithelial) vs sarcoma (mesenchymal); grading (differentiation) vs staging (spread)",
        "Paraneoplastic syndromes: ectopic ACTH (small cell), hypercalcemia (PTHrP squamous), migratory thrombophlebitis (Trousseau)",
        "Edema: ↑ hydrostatic (HF), ↓ oncotic (nephrotic/cirrhosis), lymphatic obstruction, inflammatory permeability",
        "Infarction: pale in solid organs; hemorrhagic in dual-supply or reperfused tissue",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Biopsy with basement membrane invasion → malignant carcinoma, not in situ disease",
        "PPD positivity reflects cell-mediated immunity to TB antigens — not antibody response",
        "DIC: widespread microthrombi + bleeding; treat cause; platelets/FFP/cryo for active hemorrhage",
        "Trousseau sign in pancreatic cancer — migratory superficial thrombophlebitis",
        "Shock classification guides resuscitation: fluids for hypovolemic/septic early; pressors when fluids insufficient",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Metaplasia vs dysplasia vs neoplasia",
          headers: ["Process", "Reversible?", "Key feature"],
          rows: [
            ["Metaplasia", "Often yes", "One differentiated cell type replaces another"],
            ["Dysplasia", "May progress", "Disordered growth within epithelium"],
            ["Neoplasia", "No (clonal)", "Uncontrolled growth; invasion defines malignancy"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Caseating granuloma: central necrosis + Langhans giant cells → TB until proven otherwise",
        "Auer rods in blasts → AML lineage clue",
        "Red vs pale infarct: dual vs single arterial supply tissues",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "All granulomas are TB — sarcoid and foreign body granulomas are non-caseating",
        "Metaplasia is reversible adaptive change — not synonymous with dysplasia",
        "Benign tumors can be life-threatening by location ( meningioma compression) despite no metastasis",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Keratin pearls + intercellular bridges → squamous cell carcinoma",
        "Giant cells: Langhans (peripheral horseshoe nuclei) in TB; foreign body type with haphazard nuclei",
        "Red infarct in lung because dual blood supply and loose tissue permit hemorrhage",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Inflammation type → cell predominance → chronicity",
        "Malignancy = invasion ± metastasis, not size alone",
        "Edema and shock = hemodynamic mechanism questions",
      ],
    },
  ],
};
