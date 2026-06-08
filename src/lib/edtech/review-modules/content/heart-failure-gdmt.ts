import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const HEART_FAILURE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Heart failure with reduced ejection fraction (HFrEF; LVEF ≤40%) is a cornerstone NAPLEX topic because pharmacists must know which drug classes reduce mortality and hospitalization versus those that only relieve symptoms. Guideline-directed medical therapy (GDMT) is the evidence-based foundation: four foundational pillars—RAAS inhibition, beta-blockade, MRA, and SGLT2 inhibition—each add independent survival benefit when titrated to target doses.",
        "Exam items frequently test drug selection in comorbid patients (CKD, diabetes, hyperkalemia), when to switch ACE inhibitor to ARNI, which beta-blockers are proven in HFrEF, and how diuretics fit into the regimen. HFpEF (LVEF ≥50%) has fewer mortality-proven options; SGLT2 inhibitors now carry a class indication for HF regardless of EF or diabetes status.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "GDMT targets neurohormonal activation driving progressive remodeling. RAAS inhibitors (ACEi, ARB, or ARNI) reduce afterload and block maladaptive signaling. Beta-blockers (carvedilol, metoprolol succinate, bisoprolol only) counteract chronic sympathetic drive once patients are euvolemic. MRAs (spironolactone, eplerenone) block aldosterone escape. SGLT2 inhibitors reduce HF hospitalization through mechanisms beyond glycemic control (natriuresis, metabolic shift, reduced interstitial congestion).",
      ],
      bullets: [
        "ACE inhibitors: first-line RAAS blockade; monitor Cr, K+, BP; contraindicated in pregnancy and bilateral renal artery stenosis",
        "ARBs: substitute for ACEi intolerance (cough, angioedema); do not combine ACEi + ARB (harm without added benefit)",
        "ARNI (sacubitril/valsartan): replaces ACEi/ARB in stable HFrEF; requires 36-hour ACEi washout before initiation to avoid angioedema",
        "Beta-blockers proven in HFrEF: carvedilol, metoprolol succinate (NOT tartrate), bisoprolol—start low, go slow once euvolemic",
        "MRAs: spironolactone or eplerenone when EF ≤35% and symptomatic despite ACEi/ARB + BB; monitor K+ closely",
        "SGLT2i (dapagliflozin, empagliflozin): indicated for HFrEF and HFpEF; hold perioperatively; counsel on genital mycotic infections and euglycemic DKA",
        "Loop diuretics (furosemide, bumetanide, torsemide): symptom relief for congestion; no mortality benefit—adjust to dry weight, not fixed dose",
        "Hydralazine + isosorbide dinitrate: add-on for self-identified Black patients with persistent symptoms on GDMT",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "New HFrEF diagnosis: start ACEi (or ARB) + beta-blocker when euvolemic; add MRA if EF ≤35% and NYHA II–IV; add SGLT2i regardless of diabetes",
        "Stable on ACEi with persistent symptoms: switch to sacubitril/valsartan after 36-hour washout if BP and renal function allow",
        "Acute decompensation: IV loop diuretic first; do not initiate or uptitrate beta-blocker during active congestion—resume GDMT once stable",
        "Hyperkalemia on ACEi + spironolactone: reduce MRA dose, dietary K+ restriction, consider patiromer or SPS; avoid ACEi + ARB + MRA triple RAAS blockade",
        "CKD stage 3–4: ACEi/ARB still indicated if Cr rise ≤30% from baseline; adjust loop diuretic for reduced GFR; SGLT2i may slow CKD progression",
        "HFpEF: focus on SGLT2i, diuretics for congestion, treat comorbid HTN/AF; no proven beta-blocker mortality benefit",
        "Ivabradine: add if sinus rhythm, HR ≥70 on maximally tolerated beta-blocker—does not replace beta-blocker",
        "Digoxin: rate control in HF + AF or symptom add-on when GDMT maximized; narrow therapeutic index; hypokalemia increases toxicity",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "HFrEF GDMT drug classes at a glance",
          headers: ["Class", "Mortality/Hosp Benefit", "Key Monitoring", "Major Contraindications/Cautions"],
          rows: [
            ["ACEi", "Yes", "Cr, K+, BP, cough", "Pregnancy, bilateral RAS, prior angioedema"],
            ["ARB", "Yes (ACEi substitute)", "Cr, K+, BP", "Pregnancy, bilateral RAS"],
            ["ARNI", "Yes (vs enalapril)", "Cr, K+, BP, angioedema history", "36h ACEi washout required; concurrent ACEi"],
            ["Beta-blocker (3 proven)", "Yes", "HR, BP, glucose", "Acute decompensation, severe bradycardia, decompensated asthma"],
            ["MRA", "Yes", "K+, Cr", "K+ >5.0, eGFR <30 (relative)"],
            ["SGLT2i", "Yes (hosp reduction)", "Volume status, genital infections", "Type 1 DM (DKA risk), eGFR thresholds per agent"],
            ["Loop diuretic", "Symptom only", "Weight, electrolytes, renal function", "Hypovolemia, ototoxicity at high IV doses"],
          ],
        },
        {
          caption: "ACEi vs ARB vs ARNI decision points",
          headers: ["Scenario", "Preferred Agent", "Rationale"],
          rows: [
            ["New HFrEF, no ACEi history", "ACEi (or ARNI if access/cost allows)", "Established first-line; ARNI superior in PARADIGM-HF"],
            ["ACEi cough", "Switch to ARB", "Bradykinin-mediated cough does not cross-react with ARB"],
            ["ACEi angioedema", "Avoid all RAAS agents including ARNI", "Cross-reactivity risk; consider hydralazine/ISDN"],
            ["Stable on ACEi, persistent symptoms", "Switch to ARNI after washout", "Additional natriuretic peptide benefit"],
            ["Intolerant to both ACEi and ARB", "Hydralazine + ISDN ± MRA", "Alternative vasodilator pathway"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "HFrEF GDMT pyramid: four foundational pillars (RAAS inhibitor → beta-blocker → MRA → SGLT2i) stacked with diuretics as a symptom-relief overlay—not a base pillar",
        "Neurohormonal cascade diagram: failing heart → SNS/RAAS activation → remodeling → worsening EF, with each drug class blocking a specific pathway",
        "Sacubitril/valsartan mechanism split-panel: valsartan blocking AT1 receptor + neprilysin inhibition increasing BNP/ANP with 36-hour ACEi washout timeline",
        "Titration timeline flowchart: euvolemia gate before beta-blocker uptitration; sequential addition of MRA and SGLT2i at 2–4 week intervals",
        "Volume status assessment graphic: daily weights, JVD, edema, crackles linked to loop diuretic adjustment algorithm (increase dose vs add second agent)",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Loop diuretics improve survival in HFrEF—they relieve congestion but do not reduce mortality; GDMT pillars do",
        "Any beta-blocker is appropriate in HFrEF—only carvedilol, metoprolol succinate, and bisoprolol have mortality data",
        "Start beta-blocker during acute pulmonary edema—wait until euvolemic; beta-blockade during decompensation worsens outcomes",
        "Combine ACEi + ARB for extra benefit—dual RAAS blockade increases hyperkalemia and renal dysfunction without survival gain",
        "ARNI can be started immediately after stopping ACEi—36-hour washout is mandatory to prevent life-threatening angioedema",
        "SGLT2 inhibitors are only for diabetic HF patients—class indication now includes non-diabetic HFrEF and HFpEF",
        "Metoprolol tartrate (immediate-release) equals metoprolol succinate in HFrEF—succinate ER formulation has the evidence base",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Four pillars mnemonic: 'RBS-S' — RAAS inhibitor, Beta-blocker, Spironolactone (MRA), SGLT2 inhibitor",
        "Rule of 30: acceptable ACEi/ARB-related Cr rise ≤30% from baseline; beyond that, evaluate renal artery stenosis or volume depletion",
        "Torsemide has more predictable bioavailability than furosemide—preferred in advanced HF or diuretic resistance",
        "ARNI is contraindicated with ACEi and within 36 hours of last ACEi dose—document washout in transitions of care",
        "Empagliflozin and dapagliflozin: start regardless of A1C in HF; eGFR thresholds differ—check current labeling",
        "Carvedilol blocks α1, β1, and β2—more BP drop than bisoprolol; useful when HTN coexists",
        "Ivabradine lowers HR via If channel blockade—only in sinus rhythm; ineffective if AF drives tachycardia",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "HFrEF GDMT = RAAS inhibitor (ACEi/ARB/ARNI) + proven beta-blocker + MRA + SGLT2i; titrate to target doses",
        "Diuretics treat congestion only; never substitute for GDMT pillars",
        "ARNI replaces ACEi/ARB after 36-hour washout in stable, symptomatic HFrEF",
        "Only carvedilol, metoprolol succinate, bisoprolol reduce mortality in HFrEF",
        "Monitor K+ and Cr when combining RAAS inhibitor + MRA; avoid triple RAAS blockade",
        "SGLT2i indicated for HF regardless of diabetes or EF category (HFrEF and HFpEF)",
        "Do not initiate or uptitrate beta-blocker during acute decompensation",
      ],
    },
  ],
};
