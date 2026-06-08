import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const ACS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Acute coronary syndrome (ACS)—unstable angina (UA), NSTEMI, and STEMI—is a high-frequency USMLE topic because management is time-critical and algorithm-driven. The exam tests reperfusion decisions, antiplatelet/anticoagulant selection, contraindications to fibrinolysis, and post-MI secondary prevention.",
        "Differentiating STEMI (ST elevation or new LBBB with ischemic symptoms) from NSTEMI/UA drives the pathway: immediate reperfusion (PCI preferred, fibrinolysis if PCI unavailable) versus early invasive strategy with medical stabilization. Know door-to-balloon (<90 min) and door-to-needle (<30 min) targets.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "ACS results from plaque rupture or erosion with thrombus formation in a coronary artery. STEMI implies total occlusion requiring emergent reperfusion to salvage myocardium. NSTEMI shows troponin elevation without ST elevation; UA has ischemic symptoms without troponin rise. All ACS shares antiplatelet and anticoagulant therapy; intensity and timing of invasive strategy vary by risk.",
      ],
      bullets: [
        "Universal ACS meds: aspirin 162–325 mg chewed, then 81 mg daily indefinitely; P2Y12 inhibitor (ticagrelor, prasugrel, or clopagrel) per strategy",
        "STEMI reperfusion: primary PCI if door-to-balloon ≤120 min achievable; otherwise fibrinolysis within 30 min if no contraindications",
        "Fibrinolysis agents: alteplase (tPA), tenecteplase, reteplase—contraindicated if prior ICH, ischemic stroke <3 mo, active bleeding, aortic dissection",
        "NSTEMI/UA: anticoagulation (UFH, enoxaparin, fondaparinux, or bivalirudin) + dual antiplatelet; early invasive if high TIMI/GRACE score",
        "Beta-blocker within 24 h if no contraindications (no cardiogenic shock, no advanced heart block); ACE inhibitor within 24 h if EF reduced or HTN/diabetes",
        "High-intensity statin (atorvastatin 80 mg or rosuvastatin 40 mg) regardless of baseline LDL",
        "Oxygen only if SpO₂ <90%—routine O₂ in normoxic patients does not improve outcomes",
        "Morphine cautiously—may delay P2Y12 absorption; use only for refractory pain",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "STEMI inferior wall (II, III, aVF): check right-sided leads (V4R); if RV infarct, avoid nitrates and aggressive preload reduction—fluids may be needed",
        "STEMI anterior: large territory at risk; fastest reperfusion; watch for cardiogenic shock and ventricular arrhythmias",
        "Cardiogenic shock (SBP <90, cool extremities, elevated JVP): do NOT give beta-blocker; emergent PCI; consider IABP or mechanical support",
        "NSTEMI with ongoing chest pain despite medical therapy: urgent angiography within 2 h (urgent invasive strategy)",
        "NSTEMI high-risk features (recurrent pain, ST depression, elevated troponin, hemodynamic instability): early invasive within 24 h",
        "Post-fibrinolysis: transfer to PCI-capable center for angiography within 3–24 h (pharmaco-invasive strategy)",
        "Ticagrelor vs clopidogrel: ticagrelor faster onset, stronger platelet inhibition; causes dyspnea; avoid in prior ICH or high bleed risk",
        "Prasugrel: more potent than clopidogrel; contraindicated if prior stroke/TIA or age >75/weight <60 kg (relative)",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "STEMI vs NSTEMI vs unstable angina",
          headers: ["Feature", "STEMI", "NSTEMI", "Unstable Angina"],
          rows: [
            ["ECG", "ST elevation ≥1 mm or new LBBB", "ST depression, T-wave changes, or normal", "Normal or nonspecific changes"],
            ["Troponin", "Elevated", "Elevated", "Normal"],
            ["Reperfusion", "Immediate (PCI or lysis)", "Early/late invasive based on risk", "Medical + risk-stratified invasive"],
            ["Antiplatelet", "DAPT + anticoagulant", "DAPT + anticoagulant", "DAPT (aspirin + P2Y12 if invasive planned)"],
            ["Time target", "Door-to-balloon <90 min", "Angiography within 24–72 h", "Risk-stratify with TIMI/GRACE"],
          ],
        },
        {
          caption: "P2Y12 inhibitor selection in ACS",
          headers: ["Agent", "Loading Dose", "Key Advantage", "Key Limitation"],
          rows: [
            ["Ticagrelor", "180 mg", "Fastest onset; PLATO mortality benefit", "Dyspnea; bid dosing; avoid in ICH history"],
            ["Prasugrel", "60 mg", "Potent; TRITON benefit in PCI", "Contraindicated if prior stroke/TIA"],
            ["Clopidogrel", "600 mg (or 300 mg)", "Widely available; once daily", "Slow onset; CYP2C19 poor metabolizers"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "ACS management algorithm: chest pain → ECG in 10 min → STEMI branch (PCI vs lysis) vs NSTEMI/UA branch (risk stratify → invasive timing)",
        "Coronary territory ECG map: anterior (V1–V4), lateral (I, aVL, V5–V6), inferior (II, III, aVF) with reciprocal change patterns",
        "Fibrinolysis contraindications checklist: absolute (prior ICH, dissection, active bleed) vs relative (recent surgery, pregnancy)",
        "Door-to-balloon vs door-to-needle clock graphic with 90-min and 30-min targets and transfer decision points",
        "Post-MI secondary prevention bundle: DAPT duration timeline + statin + ACEi/ARB + beta-blocker + cardiac rehab referral",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "All chest pain gets fibrinolysis—only STEMI (or equivalent) within time window; NSTEMI does not receive lysis",
        "Nitrates are always first-line in ACS—contraindicated in RV infarct, hypotension (SBP <90), and recent PDE-5 inhibitor use",
        "Beta-blocker immediately in all ACS—hold if cardiogenic shock, bradycardia, or advanced AV block",
        "Clopidogrel is equivalent to ticagrelor/prasugrel in ACS—potent P2Y12 inhibitors preferred when PCI planned (unless bleed risk)",
        "Routine supplemental oxygen improves outcomes—only if SpO₂ <90%; hyperoxia may be harmful",
        "Wait for troponin peak before reperfusion in STEMI—reperfuse based on ECG, not troponin kinetics",
        "Morphine is mandatory for all ACS pain—use cautiously; may delay oral P2Y12 absorption and mask hemodynamic deterioration",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "MONA-B updated: Morphine (cautious), Oxygen (if hypoxic), Nitrates (if no RV infarct/hypotension), Aspirin, Beta-blocker, anticoagulation, statin",
        "New LBBB + ischemic symptoms = STEMI equivalent—activate cath lab",
        "Right ventricular infarct triad: hypotension, clear lungs, JVD—give fluids, avoid nitrates/diuretics",
        "TIMI score for NSTEMI/UA: age, risk factors, CAD severity, aspirin use, angina frequency, ECG changes, troponin—≥3 favors early invasive",
        "DAPT duration post-ACS: typically 12 months (ticagrelor/prasugrel/clopidogrel + aspirin); balance bleed vs thrombosis risk",
        "Statin within 24 h regardless of LDL—high-intensity statin reduces recurrent events",
        "Fondaparinux in NSTEMI: excellent anticoagulant but guide catheter thrombosis risk—give UFH bolus at time of PCI",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "STEMI: immediate reperfusion—PCI if ≤120 min, else fibrinolysis within 30 min",
        "NSTEMI/UA: DAPT + anticoagulant; early invasive if high TIMI/GRACE or refractory symptoms",
        "Aspirin + potent P2Y12 (ticagrelor/prasugrel preferred for PCI) + anticoagulation for all ACS",
        "RV infarct: fluids yes, nitrates no; check V4R in inferior STEMI",
        "Hold beta-blocker in cardiogenic shock; start within 24 h when stable",
        "High-intensity statin regardless of baseline LDL",
        "O₂ only if SpO₂ <90%; morphine cautiously for refractory pain",
      ],
    },
  ],
};
