import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const ANTIBIOTICS_STEWARDSHIP_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Infectious disease pharmacotherapy is among the highest-yield NAPLEX domains: empiric antibiotic selection, spectrum matching, renal dosing, resistance patterns, and stewardship principles appear repeatedly in case-based items. Pharmacists are expected to choose the narrowest effective agent, recognize classic traps (daptomycin for pneumonia, nitrofurantoin for pyelonephritis), and counsel on monitoring.",
        "Antimicrobial stewardship is not abstract policy—it is daily clinical judgment: de-escalate when cultures return, stop unnecessary broad-spectrum therapy, convert IV to oral when criteria are met, and prevent C. difficile and resistance. Master coverage tables, mnemonics, and guideline-backed regimens to excel on board-style vignettes.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "Beta-lactams (penicillins, cephalosporins, carbapenems) inhibit cell wall synthesis. Spectrum expands with generation (cephalosporins) or beta-lactamase inhibitors (clavulanate, tazobactam). Carbapenems cover ESBL-producing organisms but must be reserved. Glycopeptides (vancomycin), oxazolidinones (linezolid), lipopeptides (daptomycin), and lipoglycopeptides fill gram-positive gaps—each with tissue-specific limitations.",
      ],
      bullets: [
        "Empiric therapy: infection site + severity + patient risk factors + local antibiogram",
        "De-escalation: narrow spectrum once pathogen and sensitivities known (48–72 h culture review)",
        "Time-dependent killers (beta-lactams): maximize time > MIC — frequent dosing or prolonged infusion",
        "Concentration-dependent killers (aminoglycosides, FQs): maximize peak:MIC — once-daily aminoglycosides",
        "Post-antibiotic effect (PAE): aminoglycosides and fluoroquinolones suppress growth after levels fall below MIC",
        "MRSA: vancomycin first-line for most serious infections; daptomycin for bacteremia/skin — never pneumonia",
        "Pseudomonas: anti-pseudomonal beta-lactams (pip-tazo, cefepime, ceftazidime) ± aminoglycoside or FQ",
        "C. diff: oral vancomycin or fidaxomicin; stop inciting antibiotic; avoid metronidazole as first-line",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "CAP outpatient (healthy): amoxicillin, doxycycline, or macrolide if local resistance <25%",
        "CAP inpatient: ceftriaxone + azithromycin OR respiratory fluoroquinolone monotherapy; add vanc if MRSA risk",
        "Uncomplicated UTI: nitrofurantoin ×5 d, TMP-SMX ×3 d, or fosfomycin ×1 — avoid FQs when possible",
        "Pyelonephritis: ceftriaxone or fluoroquinolone; never nitrofurantoin or fosfomycin (inadequate tissue levels)",
        "Skin/soft tissue (non-purulent): cephalexin or dicloxacillin for MSSA; purulent/MRSA: TMP-SMX, doxy, or clindamycin",
        "Febrile neutropenia: empiric anti-pseudomonal beta-lactam (cefepime, meropenem, pip-tazo) — add vanc only if line infection/MRSA risk",
        "Meningitis empiric: ceftriaxone + vancomycin + ampicillin (if age >50 or immunocompromised — Listeria)",
        "Endocarditis (native valve): vancomycin + gentamicin if penicillin-allergic; penicillin/ceftriaxone + gent if susceptible",
        "Vancomycin loading: 25–30 mg/kg IV (max 3 g) for serious MRSA; calculate CrCl first to set maintenance interval",
        "Vancomycin monitoring: AUC/MIC 400–600; check level at steady state (~4th dose); infuse over ≥60 min",
        "IV-to-PO switch: afebrile 24 h, clinically stable, functioning GI tract, oral agent with good bioavailability",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Cephalosporin generation spectrum (mnemonic: 1-2-3-4-5 as GNR coverage climbs)",
          headers: ["Generation", "Examples", "Gram-positive", "Gram-negative"],
          rows: [
            ["1st", "Cefazolin, cephalexin", "MSSA, strep", "Limited"],
            ["2nd", "Cefuroxime, cefoxitin", "Strep, some H. flu", "Moderate; cefoxitin = anaerobes"],
            ["3rd", "Ceftriaxone, ceftazidime", "Strep", "Expanded GNR; ceftazidime = Pseudomonas"],
            ["4th", "Cefepime", "Strep", "Broad GNR + Pseudomonas; better ESBL stability"],
            ["5th", "Ceftaroline", "MRSA + strep", "Some GNR (incl. MRSA pneumonia niche)"],
          ],
        },
        {
          caption: "MRSA agent selection by infection site",
          headers: ["Infection", "Preferred", "Avoid"],
          rows: [
            ["Pneumonia", "Vancomycin, linezolid, ceftaroline", "Daptomycin (surfactant inactivation)"],
            ["Bacteremia", "Vancomycin, daptomycin", "—"],
            ["Skin/soft tissue", "TMP-SMX, doxy, clindamycin (mild); vanc/dap (severe)", "—"],
            ["Endocarditis", "Vancomycin ± gentamicin; daptomycin alternative", "Linezolid (bacteriostatic — not preferred)"],
          ],
        },
        {
          caption: "Vancomycin IV dosing & monitoring (serious MRSA)",
          headers: ["Parameter", "Target / action", "Exam trap"],
          rows: [
            ["Loading dose", "25–30 mg/kg IV (max 3 g)", "Calculate before cap — 150 kg × 25 = 3,750 → cap 3 g"],
            ["CrCl ≥50", "Start q8–12 h maintenance", "Use Cockcroft-Gault weight selection (ABW if obese)"],
            ["CrCl 30–49", "q12–24 h", "Extend interval — do not just reduce dose without monitoring"],
            ["CrCl 10–29", "q24–48 h", "High nephrotoxicity risk with pip-tazo or aminoglycosides"],
            ["AUC/MIC target", "400–600 mg·h/L (MIC = 1)", "Preferred over trough-only monitoring"],
            ["Steady state", "Level before 4th–5th dose", "Too early a trough misleads dose adjustment"],
            ["Red man syndrome", "Infuse over ≥60 min", "Rate-related histamine — not true allergy"],
          ],
        },
        {
          caption: "C. difficile treatment by episode",
          headers: ["Episode", "First-line", "Alternative"],
          rows: [
            ["Initial non-severe", "Oral vancomycin 125 mg QID ×10 d", "Fidaxomicin BID"],
            ["Initial severe", "Oral vancomycin 125 mg QID", "Fidaxomicin"],
            ["Fulminant", "Oral/rectal vanc 500 mg QID + IV metronidazole", "Surgery if megacolon"],
            ["First recurrence", "Fidaxomicin or tapered/pulsed PO vanc", "Bezlotoxumab adjunct if high risk"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Beta-lactam spectrum ladder: penicillins → cephalosporin generations → carbapenems with gram-negative reach expanding upward",
        "CAP decision tree: outpatient vs inpatient vs ICU branching to mono vs dual therapy with MRSA/Pseudomonas add-on nodes",
        "MRSA site map: lung icon → vanc/linezolid; blood icon → vanc/dap; skin icon → oral agents or dap",
        "Pseudomonas coverage wheel: pip-tazo, cefepime, ceftazidime, cipro, meropenem, aztreonam arranged by oral vs IV step-down",
        "HIV OI prophylaxis timeline: CD4 200 → PCP (TMP-SMX); 100 → toxo/MAC; 50 → MAC intensification + CrAg screen",
        "Stewardship cycle: empiric broad → culture at 48 h → de-escalate → IV-to-PO → defined duration → stop",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Daptomycin treats MRSA pneumonia — inactivated by pulmonary surfactant; use vancomycin or linezolid",
        "Nitrofurantoin treats pyelonephritis — does not achieve renal parenchyma concentrations",
        "Oral metronidazole is first-line for C. diff — current IDSA favors oral vancomycin or fidaxomicin",
        "All penicillin allergies prohibit cephalosporins — true IgE cross-reactivity is ~1–2%; many labels are inaccurate",
        "Fluoroquinolones are first-line for uncomplicated cystitis — reserve for when first-line agents fail (resistance + toxicity)",
        "Vancomycin trough 15–20 alone is optimal — AUC/MIC 400–600 is the guideline-preferred target for serious MRSA",
        "Tigecycline treats bacteremia and UTI — poor serum and urine penetration despite broad in-vitro spectrum",
        "Continuing empiric broad-spectrum therapy after narrow culture results — missed stewardship and C. diff risk",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Spectrum ladder mnemonic: '1-2-3-4-5 — generations climb, gram-negatives thrive'",
        "MRSA mnemonic: 'VAN-CO in blood; LINE for lungs; DAP-TOM for skin — DAP dissolves in surfactant'",
        "Fluoroquinolone mnemonic: 'CIPRO = CIP tendon ROPture' (CNS, glucose, QT; rupture, neuropathy, aortic)",
        "PAE pearl: 'Peak kills, trough chills' — aminoglycosides dosed once daily for concentration-dependent killing",
        "Penicillin allergy pearl: 'Aztreonam is alone' — no cross-reactivity with penicillins (monobactam)",
        "TMP-SMX pearl: 'One drug, two bugs' — DS daily covers PCP and toxoplasmosis prophylaxis when CD4 <200/100",
        "Rifampin pearl: 'Rifampin ruins INSTI levels' — double dolutegravir or use alternative with TB co-treatment",
        "Vancomycin pearl: 'LOAD–AUC–SLOW' — Loading dose (mg/kg) → AUC 400–600 → Slow infusion (≥60 min)",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Match empiric therapy to site, severity, and risk factors; de-escalate at 48–72 h",
        "MRSA pneumonia: vancomycin, linezolid, or ceftaroline — never daptomycin",
        "Uncomplicated UTI: nitrofurantoin, TMP-SMX, or fosfomycin — not fluoroquinolones first-line",
        "C. diff: oral vancomycin or fidaxomicin; stop the inciting antibiotic",
        "Pseudomonas: pip-tazo, cefepime, ceftazidime, meropenem, or cipro when susceptible",
        "Vancomycin serious MRSA: load 25–30 mg/kg (max 3 g); AUC/MIC 400–600; extend interval as CrCl falls",
        "Penicillin allergy: most labels wrong; ~1–2% cephalosporin cross-reactivity if true anaphylaxis",
        "HIV: INSTI-based ART first-line; adjust for rifampin interaction in TB co-infection",
      ],
    },
  ],
};
