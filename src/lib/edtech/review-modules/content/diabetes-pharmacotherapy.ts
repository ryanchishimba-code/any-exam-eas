import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const DIABETES_PHARMACOTHERAPY_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Diabetes pharmacotherapy is a core board domain because clinicians counsel on insulin technique, adjust non-insulin agents for renal function, prevent hypoglycemia, and recognize drug-induced emergencies (euglycemic DKA, lactic acidosis). Exam items test insulin kinetics, metformin hold rules, SGLT2 inhibitor and GLP-1 agonist benefits, sick-day management, and high-alert dosing errors such as U-500 insulin.",
        "Type 1 diabetes requires insulin from diagnosis; type 2 diabetes progresses from lifestyle ± metformin to combination therapy and often insulin. Pharmacists must match agent to comorbidity (ASCVD, HF, CKD), counsel on administration timing, and know when to hold agents around contrast, surgery, or acute illness.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "Insulins are classified by onset, peak, and duration. Rapid-acting analogs (lispro, aspart, glulisine) cover mealtime glucose; regular insulin has a slower peak suitable for IV drips and scheduled dosing; NPH is intermediate with a pronounced peak; basal analogs (glargine, detemir, degludec) provide flat background coverage without mixing with other insulins in the same syringe (especially glargine).",
      ],
      bullets: [
        "Rapid-acting analogs: onset ~15 min, peak ~1–2 h, duration ~3–5 h — give with or just before meals",
        "Regular insulin: onset ~30 min, peak 2–4 h, duration 5–8 h — IV compatible; do not mix with glargine",
        "NPH: onset 1–2 h, peak 4–12 h, duration 12–18 h — only insulin that can be mixed with regular in same syringe",
        "Glargine/detemir/degludec: long basal, minimal peak — glargine once daily; degludec ultra-long; never mix glargine with other insulins",
        "Metformin: first-line T2DM; inhibits hepatic gluconeogenesis; hold if eGFR <30; reduce/reassess at eGFR 30–45; hold 48 h before iodinated contrast",
        "SGLT2 inhibitors: block proximal tubule glucose reabsorption; CV and HF hospitalization benefit; slow CKD progression; euglycemic DKA risk; genital mycotic infections",
        "GLP-1 RAs (semaglutide, liraglutide): glucose-dependent insulin secretion, delayed gastric emptying, weight loss; titrate to limit nausea; contraindicated in MEN2/medullary thyroid carcinoma history",
        "DPP-4 inhibitors: weight neutral, low hypoglycemia risk; saxagliptin/alogliptin caution in HF",
        "TZDs (pioglitazone): insulin sensitizers; fluid retention/HF exacerbation; fracture risk; avoid in NYHA III–IV HF",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "New T2DM: lifestyle + metformin if eGFR ≥30; add SGLT2i or GLP-1 RA if ASCVD, HF, or CKD; avoid TZD in HF",
        "Basal-bolus regimen: basal (glargine/degludec) + rapid analog with meals; adjust basal for fasting glucose, bolus for postprandial",
        "Hypoglycemia (<70 mg/dL): 15-15 rule — 15 g fast-acting carbohydrate, recheck in 15 min, repeat until ≥70; glucagon IM/SC/intranasal if unable to swallow",
        "Severe hypoglycemia: glucagon 1 mg IM/SC or intranasal glucagon; IV dextrose if access available; never leave patient alone",
        "Sick-day rules: never stop insulin abruptly; check glucose and ketones q4h; stay hydrated; contact provider for persistent hyperglycemia, vomiting, or moderate/large ketones",
        "Perioperative SGLT2i: hold 3–4 days before elective surgery to reduce euglycemic DKA; resume when eating and clinically stable",
        "Contrast metformin: hold at time of contrast if eGFR 30–60 or other AKI risk; restart after 48 h if renal function stable",
        "U-500 insulin: 5× concentration of U-100 — use U-500 syringe or pen only; fatal overdoses occur with U-100 syringe",
        "DKA: IV fluids first; insulin only if K⁺ ≥3.3 mEq/L; add dextrose when glucose ~200 while closing gap; search for trigger",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Insulin types — onset, peak, duration",
          headers: ["Type", "Examples", "Onset", "Peak", "Duration"],
          rows: [
            ["Rapid analog", "Lispro, aspart, glulisine", "~15 min", "~1–2 h", "~3–5 h"],
            ["Regular", "Regular human", "~30 min", "2–4 h", "5–8 h"],
            ["NPH", "NPH", "1–2 h", "4–12 h", "12–18 h"],
            ["Basal analog", "Glargine, detemir, degludec", "1–4 h", "Minimal/none", "Up to 24–42 h"],
          ],
        },
        {
          caption: "Non-insulin T2DM agents — mechanism and key cautions",
          headers: ["Class", "Examples", "Key Benefit", "Major Caution"],
          rows: [
            ["Biguanide", "Metformin", "First-line; weight neutral", "eGFR <30 CI; lactic acidosis (rare); hold contrast"],
            ["SGLT2i", "Empagliflozin, dapagliflozin", "CV/HF/renal benefit", "Mycotic infections; euglycemic DKA; hold surgery"],
            ["GLP-1 RA", "Semaglutide, liraglutide", "A1C + weight loss", "Nausea; MEN2/MTC CI; pancreatitis warning"],
            ["DPP-4i", "Sitagliptin, linagliptin", "Low hypoglycemia risk", "Saxagliptin HF caution"],
            ["TZD", "Pioglitazone", "Insulin sensitizer", "Edema, HF exacerbation, fractures"],
            ["Sulfonylurea", "Glipizide, glyburide", "Low cost", "Hypoglycemia; glyburide long-acting risk in elderly"],
          ],
        },
        {
          caption: "Metformin renal and contrast hold rules",
          headers: ["eGFR (mL/min)", "Action"],
          rows: [
            ["≥45", "Continue; routine monitoring"],
            ["30–44", "Reduce dose; reassess benefits/risks; more frequent renal monitoring"],
            ["<30", "Contraindicated — hold/discontinue"],
            ["Contrast (eGFR 30–60 or AKI risk)", "Hold at time of procedure; restart after 48 h if stable"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Insulin time-action curve overlay: rapid, regular, NPH, and glargine on one timeline showing overlap of basal-bolus regimens",
        "Basal-bolus diagram: flat glargine line with mealtime lispro spikes; arrows showing which component to adjust for fasting vs postprandial hyperglycemia",
        "15-15 hypoglycemia flowchart: check glucose → 15 g carb → wait 15 min → recheck → repeat or complex snack if ≥70",
        "Sick-day checklist: glucose/ketone monitoring frequency, hydration, when to call provider, never stop insulin",
        "U-500 vs U-100 syringe comparison: same visual volume delivers 5× units — fatal dosing error illustration",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Mix glargine with rapid-acting insulin in one syringe — glargine precipitates; changes pharmacokinetics; use separate injections",
        "Stop all diabetes meds on sick days — never abruptly discontinue insulin; may need MORE insulin during illness",
        "SGLT2 inhibitors are only for glycemic control — empagliflozin and dapagliflozin have HF and renal indications independent of diabetes",
        "Metformin causes common lactic acidosis — incidence is very low; hold for renal failure, sepsis, hypoperfusion, contrast",
        "Any sulfonylurea is equivalent — glyburide has long duration and higher hypoglycemia risk in elderly/CKD vs glipizide",
        "Hypoglycemia always presents with tachycardia — beta-blockers blunt adrenergic symptoms; sweating may persist; rely on glucose checks",
        "U-100 and U-500 syringes are interchangeable — U-500 requires dedicated syringe or pen; standard syringe causes 5× overdose",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "15-15 rule mnemonic: 15 grams, 15 minutes — glucose tabs, juice, or hard candy; follow with snack if next meal >1 h away",
        "Glargine: do not shake vial; inject at same time daily; can cause injection-site irritation — rotate sites",
        "Empagliflozin/dapagliflozin: HF benefit regardless of diabetes — know dual indication for board combo questions",
        "Metformin XR: better GI tolerability; same renal hold rules as immediate-release",
        "Insulin storage: unopened refrigerated; opened vials/pens room temperature per labeling (typically 28–30 days)",
        "Euglycemic DKA: glucose may be <250 on SGLT2i — high anion gap with ketones; hold SGLT2i; treat with insulin and fluids",
        "Beta-blockers in diabetes: prefer cardioselective (metoprolol); mask tachycardia but not sweating — teach frequent glucose monitoring",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Rapid analogs with meals; basal analog once daily; never mix glargine with other insulins",
        "Metformin first-line; hold eGFR <30; reduce/reassess 30–45; hold 48 h around contrast if indicated",
        "SGLT2i: CV/HF/renal benefits; counsel on infections and euglycemic DKA; hold perioperatively",
        "Hypoglycemia: 15-15 rule; glucagon for severe/unconscious; IV dextrose in hospital",
        "Sick days: never stop insulin; monitor glucose/ketones; hydrate; call provider for red flags",
        "U-500 = 5× U-100 — dedicated syringe/pen only",
        "GLP-1 RAs for A1C + weight; titrate slowly; MEN2/MTC contraindication",
      ],
    },
  ],
};
