import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const ANTICOAGULATION_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Anticoagulation pharmacotherapy spans initiation, monitoring, perioperative management, and emergency reversal—each layer appears on NAPLEX. Pharmacists must distinguish warfarin (INR-guided, vitamin K antagonist) from direct oral anticoagulants (DOACs: factor Xa or thrombin inhibitors), and unfractionated heparin (UFH) from low-molecular-weight heparin (LMWH).",
        "Reversal agents are high-stakes: wrong agent wastes time in bleeding emergencies; missing heparin-induced thrombocytopenia (HIT) causes catastrophic thrombosis. Know specific antidotes, their onset/limitations, and when supportive care alone suffices.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "Warfarin inhibits vitamin K epoxide reductase, depleting functional factors II, VII, IX, X and proteins C/S. Onset is delayed (days) because existing factors must clear; bridging with parenteral anticoagulation is required for acute VTE. DOACs have predictable pharmacokinetics, fixed dosing, and shorter half-lives but require renal dose adjustment and lack universal reversal until specific antidotes are given.",
      ],
      bullets: [
        "Warfarin monitoring: target INR 2–3 (most indications); 2.5–3.5 for mechanical mitral valve",
        "Warfarin reversal ladder: minor bleed → hold + low-dose PO vitamin K; major/life-threatening → 4-factor PCC + IV vitamin K; FFP if PCC unavailable",
        "DOACs—factor Xa inhibitors: apixaban, rivaroxaban, edoxaban; reversal agent andexanet alfa (limited availability, re-anticoagulation risk)",
        "DOACs—direct thrombin inhibitor: dabigatran; reversal idarucizumab (Praxbind); dialyzable",
        "UFH: potentiates antithrombin; monitor aPTT or anti-Xa; reversal with protamine sulfate (1 mg per 100 units UFH given in prior 2–3 h, max 50 mg)",
        "LMWH (enoxaparin): anti-Xa monitoring in renal impairment/obesity; protamine partially reverses (~60%)",
        "HIT: immune-mediated; platelets fall 5–10 days after heparin exposure (or sooner if prior exposure); STOP all heparin including flushes; start non-heparin anticoagulant (argatroban, bivalirudin, fondaparinux)",
        "4Ts score screens for HIT probability before ordering serotonin release assay (SRA) or PF4 antibody",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "New VTE: start UFH/LMWH/DOAC immediately; if warfarin chosen, overlap minimum 5 days AND until INR ≥2 on 2 consecutive days",
        "Warfarin initiation causes transient hypercoagulability (protein C/S fall first)—always bridge with parenteral anticoagulant for acute VTE/AF initiation",
        "Supratherapeutic INR 4.5–10 without bleeding: hold 1–2 doses, consider 1–2.5 mg PO vitamin K if high bleed risk",
        "Major bleeding on warfarin: 4-factor PCC 25–50 units/kg + 10 mg IV vitamin K; recheck INR in 6–12 h",
        "Major bleeding on dabigatran: idarucizumab 5 g IV (two 2.5 g vials); hemodialysis alternative if antidote unavailable",
        "Major bleeding on factor Xa DOAC: andexanet alfa if available; otherwise PCC 50 units/kg (off-label) + supportive care",
        "Perioperative warfarin: hold 5 days before surgery; bridge with LMWH only if high thrombotic risk (mechanical mitral valve, recent VTE, high CHA₂DS₂-VASc with recent stroke)",
        "HIT confirmed: argatroban (hepatic metabolism) or bivalirudin (PCI); transition to warfarin only after platelet recovery >150K and overlap with non-heparin agent",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Anticoagulant reversal agents",
          headers: ["Anticoagulant", "Reversal Agent", "Onset", "Key Limitations"],
          rows: [
            ["Warfarin", "4-factor PCC + IV vitamin K", "PCC: minutes; VK: 6–24 h", "FFP slower, volume overload; INR may rebound without vitamin K"],
            ["Dabigatran", "Idarucizumab 5 g IV", "Minutes", "Hemodialysis also effective; no routine monitoring needed pre-bleed"],
            ["Apixaban/Rivaroxaban/Edoxaban", "Andexanet alfa", "Minutes", "Limited access; prothrombotic risk; high cost"],
            ["UFH", "Protamine sulfate", "Minutes", "Hypotension, anaphylactoid reactions; incomplete LMWH reversal"],
            ["LMWH", "Protamine (partial)", "Minutes", "~60% anti-Xa neutralization; higher doses for enoxaparin"],
            ["Fondaparinux", "No specific antidote", "—", "rFVIIa or PCC off-label; supportive care"],
          ],
        },
        {
          caption: "Warfarin vs DOACs — pharmacist decision points",
          headers: ["Factor", "Warfarin", "DOACs"],
          rows: [
            ["Monitoring", "INR required", "No routine monitoring (renal/hepatic dose adjust)"],
            ["Reversal", "PCC + vitamin K (established)", "Specific antidotes (dabigatran) or andexanet (Xa)"],
            ["Drug interactions", "Many (CYP2C9, CYP3A4)", "Fewer but P-gp/CYP3A4 interactions exist"],
            ["Mechanical mitral valve", "Required", "Contraindicated (RE-ALIGN, others)"],
            ["Severe renal impairment", "Usable with monitoring", "Dose limits or contraindicated per agent"],
            ["Perioperative plan", "Hold + bridge if high risk", "Hold 1–2 days (CrCl-dependent)"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Coagulation cascade with anticoagulant targets: warfarin (multiple factors), heparin (antithrombin), Xa inhibitors, dabigatran (thrombin)—each with reversal arrow",
        "Warfarin reversal algorithm flowchart: bleeding severity → hold warfarin → PCC vs vitamin K alone vs FFP pathway",
        "HIT timeline: heparin exposure → platelet nadir day 5–10 → thrombosis risk → STOP heparin → alternative anticoagulant branch",
        "DOAC reversal decision tree: identify agent (dabigatran vs Xa) → idarucizumab vs andexanet vs PCC/supportive",
        "Perioperative anticoagulation bridge diagram: thrombotic risk stratification (CHADS-VASc, valve type, recent VTE) vs bleed risk → bridge or no bridge",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "FFP is first-line for warfarin reversal—4-factor PCC is preferred for major bleeding (faster, smaller volume, more complete factor replacement)",
        "Start warfarin alone for acute DVT—without parenteral overlap, warfarin initially promotes clot propagation",
        "All DOACs share one reversal agent—idarucizumab is dabigatran-specific; andexanet is for factor Xa inhibitors",
        "Continue heparin flush in a patient with suspected HIT—any heparin exposure worsens HIT; use alternative flush",
        "Protamine fully reverses enoxaparin—only partial (~60%) anti-Xa neutralization; may need repeat dosing",
        "Normal aPTT rules out therapeutic UFH—aPTT can be falsely normal with high factor VIII; use anti-Xa in obesity or prolonged therapy",
        "Andexanet alfa is universally stocked—availability is limited; know PCC off-label fallback for Xa inhibitor bleeding",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Bridge mnemonic: 'Bridge the clot, not the gap'—warfarin alone in acute VTE without heparin/DOAC overlap causes harm",
        "Vitamin K 10 mg IV reverses warfarin in 6–24 h but takes longer than PCC—always give both for life-threatening bleed",
        "Dabigatran: check eGFR; reduce dose if CrCl 15–30; contraindicated if CrCl <15 on dialysis per labeling",
        "Apixaban dose reduction: 2 of 3 criteria (age ≥80, weight ≤60 kg, SCr ≥1.5)—exam favorite",
        "HIT: platelet drop >50% from baseline or to <150K is the trigger; 4Ts score ≥4 warrants empiric non-heparin anticoagulation while awaiting labs",
        "Warfarin interacts with acetaminophen (>2 g/day), TMP-SMX, amiodarone, azoles—monitor INR closely",
        "DOACs contraindicated in mechanical heart valves and moderate-severe mitral stenosis—warfarin remains standard",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Warfarin major bleed: 4-factor PCC + 10 mg IV vitamin K; FFP if PCC unavailable",
        "Dabigatran reversal: idarucizumab 5 g IV; dialyzable",
        "Factor Xa DOAC reversal: andexanet alfa (if available) or PCC 50 units/kg off-label",
        "UFH reversal: protamine 1 mg per 100 units (max 50 mg); LMWH only partially reversed",
        "HIT: stop ALL heparin; start argatroban/bivalirudin; never give warfarin until platelets recover",
        "Acute VTE on warfarin: overlap parenteral anticoagulant ≥5 days until INR therapeutic",
        "Mechanical mitral valve: warfarin required; DOACs contraindicated",
      ],
    },
  ],
};
