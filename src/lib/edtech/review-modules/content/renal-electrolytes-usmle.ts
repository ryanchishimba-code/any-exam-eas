import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AKI, dialysis indications, and electrolyte emergencies for USMLE Step 2 CK. */
export const RENAL_ELECTROLYTES_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Renal and electrolyte vignettes are dense, recurring board material because the next best step hinges on a few discriminating numbers — FeNa, BUN:Cr ratio, the potassium ECG, and the sodium correction rate. Getting the category right (prerenal vs intrinsic vs postrenal) drives the entire management pathway.",
        "Items reward recognizing dialysis indications, stabilizing the myocardium in hyperkalemia before shifting or removing potassium, and correcting sodium slowly to avoid osmotic demyelination. These are high-fidelity, rule-based decisions that are easy to test and easy to get wrong under time pressure.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "AKI definition: creatinine rise ≥0.3 mg/dL in 48 h or ≥1.5× baseline in 7 days, or urine output <0.5 mL/kg/h",
        "Prerenal: BUN:Cr >20, FeNa <1%, bland sediment, responds to a fluid challenge",
        "Intrinsic (ATN most common): FeNa >2%, muddy-brown granular casts; ischemic or nephrotoxic",
        "Postrenal: obstruction with hydronephrosis — relieve with a Foley, stent, or nephrostomy",
        "Dialysis indications (AEIOU): refractory Acidosis, Electrolytes (hyperkalemia), Ingestions (methanol, ethylene glycol, salicylates, lithium), Overload, Uremia (pericarditis, encephalopathy)",
        "Hyperkalemia ladder: calcium stabilizes the myocardium → insulin+dextrose/albuterol shift → diuretics/binders/dialysis remove",
        "Hyponatremia: classify by volume status; SIADH is euvolemic with urine osm >100 and urine Na >40",
        "Correct chronic hyponatremia ≤8 mEq/L/24 h to avoid osmotic demyelination (central pontine myelinolysis)",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Oliguria with BUN:Cr 33 and FeNa 0.4% post-op: prerenal AKI — give a fluid bolus and reassess, not a diuretic or dialysis",
        "FeNa is unreliable on diuretics — use FEUrea (<35% suggests prerenal) instead",
        "Hyperkalemia with peaked T waves or a widening QRS: give IV calcium first, then insulin+dextrose, then removal therapy",
        "Replace magnesium in refractory hypokalemia — potassium repletion fails until magnesium is corrected",
        "Symptomatic/seizing hyponatremia: 3% hypertonic saline in small aliquots; stop once symptoms resolve or Na rises 4–6 mEq/L",
        "SIADH: fluid restrict ± salt tablets/vaptans; isotonic saline can paradoxically worsen Na when urine Na > serum Na",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "AKI categories",
          headers: ["Category", "BUN:Cr", "FeNa", "Key clue"],
          rows: [
            ["Prerenal", ">20", "<1%", "Volume responsive; bland sediment"],
            ["Intrinsic (ATN)", "~10–15", ">2%", "Muddy-brown casts; nephrotoxin/ischemia"],
            ["Postrenal", "Variable", "Variable", "Hydronephrosis; relieved by drainage"],
          ],
        },
        {
          caption: "Hyperkalemia treatment sequence",
          headers: ["Goal", "Agent", "Onset"],
          rows: [
            ["Stabilize myocardium", "Calcium gluconate/chloride", "Minutes"],
            ["Shift intracellular", "Insulin + dextrose; albuterol; bicarbonate if acidemic", "~30 min"],
            ["Remove from body", "Loop diuretic, patiromer/SZC, dialysis", "Hours"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "AKI decision tree: history/volume → FeNa or FEUrea → sediment → renal ultrasound for obstruction",
        "Hyperkalemia ECG progression: peaked T waves → PR prolongation → widened QRS → sine wave → VF",
        "AEIOU dialysis-indication card linking each letter to a refractory threshold",
        "Hyponatremia volume-status algorithm: hypovolemic → saline; euvolemic (SIADH) → restrict; hypervolemic → restrict + treat cause",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Give furosemide for oliguric prerenal AKI — diuretics worsen prerenal states; give fluids first",
        "Trust FeNa on a patient taking diuretics — use FEUrea instead",
        "Treat hyperkalemia by jumping straight to dialysis — stabilize and shift first; dialysis for refractory cases",
        "Correct chronic hyponatremia quickly — rapid correction causes osmotic demyelination; cap at ~8 mEq/L/24 h",
        "Give isotonic saline for SIADH — it can worsen hyponatremia; fluid restriction is first-line",
        "Replace potassium alone in refractory hypokalemia — correct magnesium too",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Calcium first for hyperkalemia with ECG changes — it buys time while shifting and removal work",
        "Hypomagnesemia drives refractory hypokalemia — replace magnesium concurrently",
        "A fluid challenge both diagnoses and treats prerenal AKI",
        "Cap chronic hyponatremia correction at ~8 mEq/L per 24 hours to protect the pons",
        "Hold nephrotoxins (NSAIDs, contrast, aminoglycosides) and renally dose drugs in AKI/CKD",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Classify AKI: prerenal (FeNa <1%, BUN:Cr >20), ATN (FeNa >2%, casts), postrenal (obstruction)",
        "Dialysis = AEIOU when refractory to medical therapy",
        "Hyperkalemia: calcium → insulin/dextrose → removal",
        "Hyponatremia: classify by volume; correct slowly (≤8 mEq/L/24 h)",
        "SIADH: euvolemic, urine osm >100, urine Na >40 — fluid restrict",
        "Replace magnesium to fix refractory hypokalemia",
      ],
    },
  ],
};
