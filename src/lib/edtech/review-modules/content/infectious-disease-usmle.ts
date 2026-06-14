import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const INFECTIOUS_DISEASE_USMLE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Infectious disease vignettes on USMLE Step 2 CK reward pattern recognition plus the correct next step—not exhaustive microbiology. The exam repeatedly tests empiric regimens (CAP, meningitis, febrile neutropenia), classic traps (daptomycin for MRSA pneumonia, metronidazole-first C. diff), HIV opportunistic infection thresholds, and vancomycin monitoring (AUC/MIC over trough chasing).",
        "Clinical judgment items often pair a sick patient with pending cultures: blood cultures before antibiotics when feasible, but never delay treatment beyond the hour-1 window in sepsis or meningitis. Know when to add ampicillin for Listeria, when to start dexamethasone before antibiotics in bacterial meningitis, and when oral vancomycin beats IV metronidazole for C. difficile.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "Empiric therapy targets the most likely pathogens for the syndrome and severity, then narrows when cultures return. CAP in the outpatient setting favors narrow beta-lactams or macrolides; inpatient CAP adds antipneumococcal beta-lactam plus atypical coverage. CNS infections require agents that cross the blood-brain barrier—ceftriaxone plus vancomycin for S. pneumoniae and N. meningitidis, with ampicillin added when Listeria is in the differential.",
      ],
      bullets: [
        "CAP outpatient (healthy, no comorbidities): amoxicillin, doxycycline, or macrolide if local resistance <25%",
        "CAP inpatient (non-ICU): ceftriaxone + azithromycin OR respiratory fluoroquinolone monotherapy",
        "CAP ICU or MRSA risk (prior MRSA, necrotizing pneumonia, empyema): add vancomycin or linezolid—never daptomycin for pneumonia",
        "Bacterial meningitis empiric: ceftriaxone + vancomycin + dexamethasone 0.15 mg/kg q6h ×4 doses before or with first antibiotic dose",
        "Add ampicillin to meningitis regimen if age >50, neonate, pregnant, or immunocompromised (Listeria coverage)",
        "MRSA serious infection: vancomycin first-line; daptomycin for bacteremia/endocarditis/skin—linezolid or ceftaroline for MRSA pneumonia",
        "Daptomycin trap: inactivated by pulmonary surfactant—will fail in MRSA pneumonia despite in vitro susceptibility",
        "C. diff first episode: oral vancomycin or fidaxomicin; stop inciting antibiotic; contact precautions",
        "HIV OI prophylaxis: TMP-SMX at CD4 <200 (PCP ± Toxoplasma if IgG+); azithromycin at CD4 <50 (MAC)",
        "Vancomycin AUC/MIC target 400–600 (traditional trough 15–20 mg/L is a surrogate); check level ~4th dose at steady state",
        "Febrile neutropenia (ANC <500, temp ≥38.3°C): blood cultures ×2, then anti-pseudomonal beta-lactam within 60 minutes",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "65-year-old with fever, productive cough, infiltrate, no ICU criteria: admit, blood cultures if severe, start ceftriaxone + azithromycin—next best step is empiric antibiotics, not wait for sputum culture",
        "Altered mental status, fever, nuchal rigidity, LP deferred for imaging: give dexamethasone, then ceftriaxone + vancomycin + ampicillin if >50 years—do not delay antibiotics for LP if meningitis is likely",
        "Health care worker with MRSA bacteremia from line: remove catheter, start vancomycin or daptomycin; echocography to rule out endocarditis—next step after cultures is source control plus MRSA-active agent",
        "MRSA pneumonia on ventilator with purulent sputum: vancomycin or linezolid—choosing daptomycin is the classic wrong answer despite susceptibility",
        "Diarrhea on recent clindamycin, WBC 18K, positive C. diff toxin: oral vancomycin 125 mg QID ×10 days—do not give IV metronidazole or loperamide",
        "HIV patient CD4 80 with dyspnea, hypoxia, diffuse interstitial infiltrates, elevated LDH: TMP-SMX ± prednisone if PaO₂ <70 mmHg—PCP, not bacterial CAP empiric alone",
        "HIV CD4 45 with headache, India ink positive LP: amphotericin B + flucytosine induction, then fluconazole consolidation—manage elevated ICP with serial LPs",
        "Chemotherapy patient ANC 200, temp 38.7°C: draw 2 blood culture sets, then IV cefepime or piperacillin-tazobactam—avoid oral step-down and avoid routine vancomycin unless line/MRSA skin source",
        "Vancomycin for MRSA bacteremia: loading 25–30 mg/kg (max 3 g), then maintenance by renal function; obtain AUC-guided level after ~4th dose—do not chase trough >20 mg/L alone (nephrotoxicity without benefit)",
        "Recurrent C. diff after oral vancomycin: fidaxomicin, bezlotoxumab, or fecal microbiota transplant—do not repeat metronidazole monotherapy",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "CAP empiric therapy by setting",
          headers: ["Setting", "Regimen", "Next-step trap"],
          rows: [
            ["Outpatient, healthy", "Amoxicillin, doxy, or macrolide", "Fluoroquinolone monotherapy when alternatives exist (resistance, C. diff risk)"],
            ["Inpatient, ward", "Ceftriaxone + azithromycin OR levofloxacin/moxifloxacin", "Macrolide monotherapy in severe CAP"],
            ["ICU / MRSA risk", "Beta-lactam + macrolide/FQ + vancomycin or linezolid", "Daptomycin for pneumonia coverage"],
            ["Aspiration concern", "Add anaerobic coverage (amp-sulbactam, pip-tazo) if empyema/loculated", "Routine anaerobic coverage for all CAP"],
          ],
        },
        {
          caption: "MRSA agent selection — the daptomycin trap",
          headers: ["Syndrome", "Preferred", "Avoid / trap"],
          rows: [
            ["Pneumonia (incl. HAP/VAP)", "Vancomycin, linezolid, ceftaroline", "Daptomycin (surfactant inactivation)"],
            ["Bacteremia", "Vancomycin, daptomycin", "Stopping therapy before repeat cultures clear and source controlled"],
            ["Endocarditis", "Vancomycin ± gentamicin; daptomycin alternative", "Linezolid as first-line (bacteriostatic)"],
            ["Skin/soft tissue (mild)", "TMP-SMX, doxycycline, clindamycin", "Vancomycin for uncomplicated outpatient cellulitis without MRSA risk"],
          ],
        },
        {
          caption: "Meningitis empiric coverage",
          headers: ["Pathogen", "Drug", "When to add"],
          rows: [
            ["S. pneumoniae", "Ceftriaxone + vancomycin", "All adult bacterial meningitis until sensitivities known"],
            ["N. meningitidis", "Ceftriaxone (± vanc until PCN MIC known)", "Prophylaxis for close contacts with rifampin/cipro/ceftriaxone"],
            ["Listeria", "Ampicillin", "Age >50, neonate, pregnancy, immunocompromised"],
            ["H. influenzae", "Ceftriaxone", "Unvaccinated or neonatal contexts"],
          ],
        },
        {
          caption: "C. difficile therapy & HIV OI prophylaxis",
          headers: ["Condition", "First-line", "Exam trap"],
          rows: [
            ["C. diff initial (non-fulminant)", "Oral vancomycin or fidaxomicin", "Metronidazole first-line (outdated)"],
            ["C. diff fulminant", "Oral/rectal vancomycin + IV metronidazole", "Antiperistaltics (loperamide) — ileus/toxic megacolon risk"],
            ["PCP prophylaxis", "TMP-SMX at CD4 <200", "Starting prophylaxis at CD4 250 without treatment indication"],
            ["MAC prophylaxis", "Azithromycin weekly at CD4 <50", "Fluconazole (does not cover MAC)"],
            ["Toxoplasma prophylaxis", "TMP-SMX if IgG+ at CD4 <100", "Pyrimethamine without folinic acid in maintenance"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "CAP decision tree: outpatient vs inpatient vs ICU branch with corresponding empiric regimens and MRSA add-on node",
        "Meningitis timeline: dexamethasone → antibiotics within 30 min → LP when safe; parallel blood cultures",
        "MRSA site map: lung icon crossed out for daptomycin; blood/heart/skin icons green for daptomycin",
        "HIV CD4 ladder: <200 (PCP prophylaxis), <100 (Toxo if IgG+), <50 (MAC)—link each to presenting OI vignette",
        "Febrile neutropenia hour-1 flow: fever + ANC <500 → cultures → cefepime/pip-tazo within 60 min → reassess at 48 h",
        "Vancomycin AUC/MIC curve vs trough-only monitoring: target area 400–600 under 24 h concentration curve",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Daptomycin treats MRSA pneumonia because the MIC is susceptible—surfactant inactivates daptomycin in the lung",
        "Wait for LP before antibiotics in suspected meningitis—delay worsens mortality; treat empirically after blood cultures if LP delayed",
        "Metronidazole is first-line for C. diff—guidelines favor oral vancomycin or fidaxomicin for initial episodes",
        "IV vancomycin for C. diff colitis—oral/rectal vancomycin achieves luminal concentrations; IV does not treat the colon",
        "Routine vancomycin in all febrile neutropenia—reserve for suspected line infection, skin/soft tissue MRSA, or known colonization",
        "Chasing vancomycin trough >20 mg/L without AUC guidance—increases nephrotoxicity without proven benefit over AUC/MIC 400–600",
        "Dexamethasone after antibiotics in meningitis—give before or with first dose for maximal benefit in pneumococcal meningitis",
        "TMP-SMX prophylaxis only when CD4 <100—PCP prophylaxis starts at CD4 <200 cells/µL",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Meningitis triad incomplete in elderly—have low threshold; add ampicillin if >50 for Listeria",
        "Dex + ceftriaxone + vanc before LP if delay expected; CT head first only if focal neuro deficit, immunocompromise, or seizure",
        "Daptomycin = 'Don't use for Pneumonia' — mnemonic for the surfactant trap",
        "CAP CURB-65 or PSI guides disposition; antibiotics should not wait for scoring in clearly ill patients",
        "C. diff: WBC >15K or Cr rise suggests severe disease—oral vanc 125 mg QID, consider ID consult",
        "PCP: bilateral ground-glass, elevated LDH, subacute dyspnea; add prednisone if PaO₂ <70 mmHg or A-a gradient ≥35",
        "Febrile neutropenia: '60-minute rule' — cefepime, meropenem, or pip-tazo after cultures; G-CSF not substitute for antibiotics",
        "Vancomycin loading: 25–30 mg/kg actual weight (cap 3 g)—calculate before default 1 g q12h",
        "Cryptococcal meningitis: amphotericin + flucytosine induction; fluconazole consolidation; control ICP before antifungal delay",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "CAP inpatient: ceftriaxone + macrolide or respiratory FQ; add vanc/linezolid for MRSA risk—never daptomycin for pneumonia",
        "Meningitis: dexamethasone + ceftriaxone + vancomycin; add ampicillin if >50 or immunocompromised (Listeria)",
        "MRSA pneumonia: vancomycin, linezolid, or ceftaroline—daptomycin fails despite susceptibility",
        "C. diff: oral vancomycin or fidaxomicin; stop offending antibiotic; no antiperistaltics",
        "HIV: TMP-SMX prophylaxis at CD4 <200; azithromycin at CD4 <50; treat PCP with TMP-SMX ± steroids if hypoxic",
        "Febrile neutropenia: cultures then anti-pseudomonal beta-lactam within 60 minutes",
        "Vancomycin: AUC/MIC 400–600; load 25–30 mg/kg; adjust interval for renal function",
      ],
    },
  ],
};
