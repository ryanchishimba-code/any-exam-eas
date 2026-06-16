import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const SEPSIS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Sepsis and septic shock are board-exam priorities because they test clinical judgment under time pressure: recognize early, act in the first hour, and prioritize interventions that save lives. Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection; septic shock adds persistent hypotension requiring vasopressors despite adequate fluid resuscitation plus lactate >2 mmol/L.",
        "Board items reward ABCs, early antibiotics, fluid resuscitation, hemodynamic monitoring, and source control—not comfort measures or delayed diagnostics. Know the Surviving Sepsis Campaign hour-1 bundle and how bedside assessments (qSOFA, vital trends, urine output, mental status) trigger escalation.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "Sepsis pathophysiology involves pathogen-associated and damage-associated molecular patterns triggering cytokine release, vasodilation, capillary leak, and microvascular thrombosis. Early compensatory tachycardia and narrowed pulse pressure progress to hypotension, oliguria, altered mentation, and multi-organ failure. Lactate reflects tissue hypoperfusion; trending lactate guides resuscitation adequacy.",
      ],
      bullets: [
        "Sepsis-3 definition: infection + SOFA score increase ≥2 (organ dysfunction); qSOFA (RR ≥22, altered mentation, SBP ≤100) screens outside ICU",
        "Septic shock: sepsis + vasopressors needed for MAP ≥65 + lactate >2 despite fluids",
        "Hour-1 bundle: measure lactate; obtain blood cultures before antibiotics; administer broad-spectrum antibiotics; give 30 mL/kg crystalloid for hypotension or lactate ≥4",
        "First-line vasopressor: norepinephrine to maintain MAP ≥65 mmHg; add vasopressin or epinephrine as second-line",
        "Crystalloids (LR or NS) preferred over colloids for initial resuscitation; reassess fluid responsiveness",
        "Source control: drain abscess, remove infected lines/devices, debride necrotic tissue—essential within 6–12 h when feasible",
        "Broad-spectrum antibiotics within 1 hour of recognition; each hour delay increases mortality ~7%",
        "Corticosteroids (hydrocortisone 200 mg/day): consider if refractory shock despite fluids and vasopressors",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Priority 1: Airway/breathing—supplemental O₂, intubation if respiratory failure; do not delay antibiotics for CT scan",
        "Priority 2: Two sets of blood cultures from different sites, then IV antibiotics within 1 hour—cultures before abx but do not delay abx >1 h",
        "Priority 3: 30 mL/kg crystalloid bolus if hypotensive (SBP <90 or MAP <65) or lactate ≥4; reassess after each bolus",
        "Persistent hypotension after fluids: start norepinephrine; central line preferred but do not delay pressor via peripheral IV in emergency",
        "Monitor urine output ≥0.5 mL/kg/h, mental status, capillary refill, lactate clearance—signs of adequate perfusion",
        "Remove infected central line when feasible; send tip culture; place new line at different site if still needed",
        "Elevated lactate with normal BP: still sepsis—aggressive resuscitation; lactate normalization target within 24 h",
        "Post-resuscitation: lung-protective ventilation, DVT prophylaxis, stress ulcer prophylaxis, glucose control, daily sedation interruption",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Sepsis vs septic shock vs SIRS (legacy)",
          headers: ["Feature", "Sepsis", "Septic Shock", "SIRS (legacy)"],
          rows: [
            ["Definition", "Infection + organ dysfunction (SOFA ≥2)", "Sepsis + pressors + lactate >2", "≥2 of: T, HR, RR, WBC abnormalities"],
            ["BP", "May be normal early", "Hypotension despite fluids", "Non-specific"],
            ["Vasopressors", "Not required", "Required for MAP ≥65", "Not part of definition"],
            ["Lactate", "May be elevated", ">2 mmol/L despite fluids", "Not required"],
            ["Exam relevance", "Recognize + treat early", "Escalate pressors + ICU", "Know term but Sepsis-3 preferred"],
          ],
        },
        {
          caption: "Vasopressor selection in septic shock",
          headers: ["Agent", "Mechanism", "Role", "Clinical Considerations"],
          rows: [
            ["Norepinephrine", "α1 > β1", "First-line", "Extravasation risk—central line preferred; monitor distal perfusion"],
            ["Vasopressin", "V1 receptor", "Add-on (fixed dose 0.03 U/min)", "Do not titrate; ischemic risk at high doses"],
            ["Epinephrine", "α + β", "Second-line or refractory", "Tachycardia, arrhythmia, lactate may rise"],
            ["Dopamine", "Dose-dependent", "Avoid as first-line", "More arrhythmias vs norepinephrine; use only if bradycardia"],
            ["Phenylephrine", "Pure α1", "Alternative if tachyarrhythmia", "May reduce cardiac output; second-line only"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Hour-1 sepsis bundle timeline: 0 min recognition → lactate + cultures → antibiotics by 60 min → 30 mL/kg fluids → reassess MAP/lactate",
        "Hemodynamic escalation ladder: crystalloid bolus → norepinephrine → add vasopressin → consider epinephrine/hydrocortisone",
        "qSOFA vs SOFA comparison chart: bedside screening (qSOFA) vs ICU organ dysfunction scoring (SOFA components: PaO2/FiO2, platelets, bilirubin, MAP, GCS, creatinine)",
        "Capillary refill and urine output monitoring graphic linking perfusion endpoints to nursing reassessment frequency",
        "Source control algorithm: identify infection site (lung, abdomen, line, skin) → imaging/drainage/removal decision tree",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Wait for culture results before antibiotics—start empiric broad-spectrum within 1 hour; cultures first but never delay abx",
        "Normal BP excludes sepsis—early sepsis may be normotensive; watch lactate, mentation, urine output",
        "Dopamine is first-line for septic shock—norepinephrine is preferred; dopamine increases arrhythmia risk",
        "Give colloids first for faster volume—crystalloids are first-line per Surviving Sepsis Campaign",
        "Cooling blanket for fever is priority over antibiotics—treat source and give antipyretics; antibiotics save lives",
        "Hold fluids in hypotensive sepsis due to CHF history—30 mL/kg still indicated; monitor closely and escalate pressors early",
        "Lactate only matters if hypotensive—elevated lactate indicates tissue hypoperfusion even with compensatory hypertension",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Priority mnemonic: 'Cultures, Crystalloids, Coverage (antibiotics)'—in that sequence within hour 1",
        "MAP goal ≥65 mmHg—calculate MAP = DBP + 1/3(SBP − DBP); can be trended at the bedside",
        "Lactate ≥4 = severe sepsis signal—mandates fluid bolus even if BP appears stable",
        "Peripheral norepinephrine is acceptable briefly until central access—do not delay pressors",
        "Urine output <0.5 mL/kg/h for 2 h suggests inadequate perfusion—notify provider, reassess fluid status",
        "Broad-spectrum means cover likely source: ceftriaxone + metronidazole for abdominal; vanc + pip-tazo for unknown hospital source",
        "Reassess volume status after each bolus—look for JVD, crackles, worsening hypoxia indicating fluid overload",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Sepsis = infection + organ dysfunction; septic shock adds pressor-dependent hypotension + lactate >2",
        "Hour-1 bundle: lactate, cultures, antibiotics, 30 mL/kg crystalloid if hypotensive or lactate ≥4",
        "Norepinephrine first-line vasopressor for MAP ≥65",
        "Antibiotics within 1 hour—never wait for imaging or culture results",
        "Source control (drain, debride, remove line) is essential",
        "Trend lactate and urine output to assess resuscitation success",
        "Bottom line: ABCs → cultures + antibiotics → fluids → pressors → source control",
      ],
    },
  ],
};
