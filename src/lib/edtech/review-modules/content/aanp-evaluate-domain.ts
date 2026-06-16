import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AANPCB Domain IV — Evaluate (15% of FNP exam). */
export const AANP_EVALUATE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Evaluate is the smallest scored domain (~20 items) but tests a distinct skill: monitoring treatment response, recognizing adverse effects, and modifying plans after the initial visit.",
        "Items often present a follow-up visit — partial response, new side effect, lab abnormality, or readmission. The correct answer adjusts monitoring or therapy rather than repeating the initial workup.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Define treatment success criteria before changing therapy (symptoms, labs, function)",
        "Assess adherence and barriers before escalating medications",
        "Recognize adverse drug reactions vs disease progression",
        "Therapeutic drug monitoring intervals: INR, A1c, lithium, aminoglycosides/vancomycin",
        "Transition-of-care gaps: medication reconciliation, follow-up timing, patient education recall",
        "When to continue, adjust dose, switch class, or refer",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "HTN follow-up: recheck BP in 2–4 weeks; add agent if not at goal after lifestyle + monotherapy",
        "T2DM: A1c every 3 months until at goal; evaluate hypoglycemia before uptitrating insulin",
        "SSRI start: reassess at 1–2 weeks for activation, insomnia, suicide risk; full effect 4–6 weeks",
        "Statin: check hepatic enzymes only if symptoms; monitor muscle pain (rhabdo rare)",
        "Warfarin: INR target 2–3 for most; bleeding vs clotting balance; drug/food interactions",
        "CHF: daily weights, GDMT titration, diuretic adjustment for congestion — not repeat echo every visit",
        "Antibiotic course: assess clinical improvement at 48–72 h; de-escalate or switch if failing",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Evaluate vs re-diagnose — what to do next",
          headers: ["Follow-up scenario", "Evaluate action", "Wrong action"],
          rows: [
            ["BP still 148/92 on HCTZ × 4 weeks", "Add ACEi/ARB or CCB", "Repeat full secondary HTN workup"],
            ["A1c 8.2% on metformin max dose", "Add SGLT2i/GLP-1 RA if comorbidity; assess adherence", "Switch to insulin immediately without assessment"],
            ["SSRI week 2 — insomnia, jittery", "Reassure, consider dose timing; monitor suicide risk", "Stop SSRI and start benzo"],
            ["CAP day 3 — still febrile", "Switch antibiotic or evaluate complication", "Repeat same abx without reassessment"],
            ["INR 5.5, no bleeding", "Hold warfarin, lower dose, recheck INR", "Continue same dose"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "A1c monitoring timeline after therapy change (recheck at 3 months)",
        "SSRI follow-up schedule: 1–2 weeks early, 4–6 weeks efficacy, then q3 months stable",
        "CHF daily weight action plan: +2 lb/day or +5 lb/week → call clinic, adjust diuretic",
        "INR subtherapeutic vs supratherapeutic management algorithm",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Repeating initial diagnostic workup on follow-up instead of assessing response",
        "Escalating therapy without checking adherence or side effects",
        "Stopping statin for asymptomatic mild LFT elevation",
        "Adding benzodiazepine for SSRI activation instead of monitoring and dose adjustment",
        "Discharging CHF patient without daily weight and medication reconciliation plan",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Evaluate stems often include time since last visit — use it to pick monitoring interval",
        "Partial improvement → optimize current regimen before switching class",
        "Adverse effect answer may be hold drug, reduce dose, or switch — not always stop entirely",
        "Include patient education and return precautions in follow-up plan answers",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Evaluate = 15% — follow-up, monitoring, and plan modification",
        "Check adherence before intensifying therapy",
        "Know lab monitoring intervals for chronic meds",
        "Recognize treatment failure vs adverse effect vs new problem",
        "Adjust plan — do not restart from scratch unless diagnosis changed",
      ],
    },
  ],
};
