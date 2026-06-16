import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Endocrine emergencies — DKA/HHS, thyroid, and adrenal crises for USMLE Step 2 CK. */
export const ENDOCRINE_EMERGENCIES_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Endocrine emergencies are high-frequency board vignettes because they are time-critical, algorithm-driven, and reward the correct sequence of actions over the correct final diagnosis. DKA, HHS, thyroid storm, myxedema coma, and adrenal crisis all kill quickly when the order of interventions is wrong.",
        "Items test the next best step: fluids before insulin, potassium before insulin, thiamine before glucose, steroids before confirmatory testing in adrenal crisis. Mastering the triggers, the labs, and the correction targets lets you avoid the classic traps that distinguish a passing answer from a fatal one.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "DKA: glucose >250, anion-gap metabolic acidosis (pH <7.3, HCO₃ <18), positive ketones — usually type 1 but increasingly type 2",
        "DKA sequence: isotonic fluids → check K⁺ → insulin drip only once K⁺ ≥3.3 mEq/L → add dextrose at glucose ~200 until the gap closes",
        "HHS: glucose often >600, serum osm >320, minimal ketones, profound dehydration, higher mortality — fluids are the priority, insulin doses lower",
        "Resolution of DKA is anion-gap closure (normalized bicarbonate), not glucose normalization — overlap SQ insulin before stopping the drip",
        "Thyroid storm: fever, tachyarrhythmia, CNS and GI dysfunction — beta-blocker, then PTU/methimazole, then iodine ≥1 h after thionamide, plus hydrocortisone",
        "Myxedema coma: hypothermia, bradycardia, hyponatremia, altered mentation — IV levothyroxine ± T3 plus stress-dose hydrocortisone",
        "Adrenal crisis: hypotension/shock in a steroid-dependent or Addison patient — IV hydrocortisone 100 mg now, then 50 mg q8h, with saline resuscitation",
        "Pheochromocytoma: alpha-blockade (phenoxybenzamine) before any beta-blocker to avoid unopposed alpha vasoconstriction",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Hyperglycemic crisis with K⁺ 3.0: replace potassium first — starting insulin drives K⁺ intracellularly and risks fatal arrhythmia",
        "Search for a trigger in every DKA/HHS case: infection, missed insulin, MI, new-onset diabetes, or an SGLT2 inhibitor (euglycemic DKA)",
        "Thyroid storm: give propranolol for rate control and to block peripheral T4→T3 conversion; never give iodine before a thionamide (Jod-Basedow effect)",
        "Suspected adrenal crisis: draw a cortisol if feasible but give hydrocortisone immediately — do not delay for the ACTH stimulation test",
        "Stressed patient on chronic steroids with refractory hypotension after surgery: treat empirically for adrenal crisis with stress-dose steroids",
        "Correct HHS hyperosmolarity and sodium slowly to avoid cerebral edema; monitor potassium and glucose closely during treatment",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "DKA vs HHS",
          headers: ["Feature", "DKA", "HHS"],
          rows: [
            ["Glucose", "Often >250", "Often >600"],
            ["Ketones / anion gap", "Present / wide gap", "Minimal / little or no gap"],
            ["Serum osmolality", "Variable", "Markedly elevated (>320)"],
            ["Mental status", "Usually alert unless severe", "Often obtunded"],
            ["Priority", "Insulin after K⁺ safe + fluids", "Aggressive fluids first; lower insulin doses"],
          ],
        },
        {
          caption: "Thyroid storm vs myxedema coma",
          headers: ["Feature", "Thyroid storm", "Myxedema coma"],
          rows: [
            ["Temperature", "Hyperthermia", "Hypothermia"],
            ["Heart rate", "Tachyarrhythmia", "Bradycardia"],
            ["First drugs", "Beta-blocker → PTU/methimazole → iodine; hydrocortisone", "IV levothyroxine ± T3; hydrocortisone"],
            ["Sodium", "Variable", "Hyponatremia"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "DKA order-of-operations timeline: fluids → potassium check → insulin (if K⁺ ≥3.3) → dextrose at glucose ~200 → stop drip when gap closes with SQ overlap",
        "Potassium decision gate: K⁺ <3.3 hold insulin and replace; 3.3–5.2 give insulin + KCl; >5.2 give insulin and recheck",
        "Thyroid storm drug-sequence diagram: block synthesis (thionamide) → block release (iodine 1 h later) → block conversion/symptoms (propranolol, steroids)",
        "Primary vs secondary adrenal insufficiency map: ACTH high + hyperpigmentation + hyperkalemia (primary) vs ACTH low, normal K⁺ (secondary)",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Start insulin immediately in DKA — fluids and a safe potassium come first; insulin with K⁺ <3.3 can be fatal",
        "Stop the insulin drip when glucose normalizes — continue with added dextrose until the anion gap closes",
        "Normal glucose rules out DKA — SGLT2 inhibitors cause euglycemic DKA; check the gap and ketones",
        "Give iodine first in thyroid storm — iodine before a thionamide can worsen hyperthyroidism (Jod-Basedow)",
        "Wait for cortisol/ACTH results before treating adrenal crisis — give hydrocortisone now",
        "Beta-block a pheochromocytoma first — unopposed alpha effect precipitates hypertensive crisis; alpha-block first",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Potassium before insulin: if K⁺ <3.3 mEq/L, replace it before starting the insulin drip",
        "Thiamine before glucose in malnourished/alcohol-use patients to prevent precipitating Wernicke encephalopathy",
        "Add dextrose to fluids at glucose ~200 in DKA so you can keep the insulin running until the gap closes",
        "Hydrocortisone covers possible concurrent adrenal insufficiency in myxedema coma — give it alongside thyroid hormone",
        "Euglycemic DKA: hold the SGLT2 inhibitor, treat the gap, and counsel on sick-day rules",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "DKA = gap acidosis + ketones; fluids → K⁺ → insulin → dextrose; resolve = gap closes",
        "HHS = extreme hyperglycemia + hyperosmolarity, minimal ketones; fluids are the priority",
        "Thyroid storm: beta-blocker → thionamide → iodine (1 h later) + steroids",
        "Myxedema coma: IV thyroid hormone + stress-dose hydrocortisone + supportive care",
        "Adrenal crisis: IV hydrocortisone immediately — do not wait for testing",
        "Pheochromocytoma: alpha-blockade before beta-blockade",
      ],
    },
  ],
};
