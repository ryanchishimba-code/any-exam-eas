import type { Usmle2026StudyContent } from "./types";

/** Step 1 — mechanism, pathophysiology, and basic science vignettes. */
export const USMLE_2026_CONTENT_STEP1: Record<string, Usmle2026StudyContent> = {
  "atherosclerosis-mechanisms": {
    overview: "Plaque formation, rupture, and thrombosis linking lipid biology to ACS.",
    summary:
      "Atherosclerosis begins with endothelial dysfunction and LDL accumulation in the intima. Macrophages ingest oxidized LDL → foam cells → fatty streak. Smooth muscle migration and fibrous cap formation create stable plaques; thin-cap fibroatheromas rupture and trigger platelet-rich thrombosis (ACS).\n\nRisk factors: hypertension, diabetes, smoking, dyslipidemia, Lp(a). Statins stabilize plaques by lowering LDL and reducing inflammation. HDL promotes reverse cholesterol transport.",
    keyConcepts: [
      "Foam cells from oxidized LDL — not native LDL alone",
      "Stable vs vulnerable plaque: thick fibrous cap vs thin cap + large lipid core",
      "Plaque rupture → exposure of tissue factor → thrombin generation",
      "MI can occur from rupture of non-obstructive plaques",
      "Homocysteine, smoking, and diabetes accelerate endothelial injury",
    ],
    mustKnowFacts: [
      "Familial hypercholesterolemia: LDL receptor defect → premature ASCVD and tendon xanthomas",
    ],
    pearls: [
      "Sudden death in young smoker with LDL 220 → think FH and early atherosclerotic rupture.",
    ],
    pitfalls: [
      "Assuming severe stenosis is required for MI — many MIs arise from previously mild lesions",
    ],
  },
  "heart-failure-pathophysiology": {
    overview: "HFrEF vs HFpEF hemodynamics, neurohormonal activation, and remodeling.",
    summary:
      "HFrEF: reduced contractility → decreased forward output → RAAS and SNS activation → sodium/water retention and afterload increase → vicious cycle of remodeling. Ventricular dilation and eccentric hypertrophy.\n\nHFpEF: stiff ventricle with preserved EF — diastolic dysfunction, impaired filling, pulmonary congestion at elevated pressures. Common in elderly women with HTN, obesity, AF.",
    keyConcepts: [
      "Frank-Starling compensates until decompensation",
      "Neurohormonal activation (ACE/Ang II/aldosterone) worsens long-term outcomes",
      "Eccentric hypertrophy (volume overload) vs concentric (pressure overload)",
      "BNP release from ventricular stretch",
      "Cardiorenal syndrome: renal hypoperfusion worsens diuresis response",
    ],
    mustKnowFacts: [
      "Digoxin increases contractility but does not reduce mortality in chronic HFrEF",
    ],
    pearls: [
      "Hypertensive elderly woman with EF 55% and elevated filling pressures → HFpEF, not 'normal heart.'",
    ],
    pitfalls: [
      "Calling HFpEF 'diastolic heart failure' without assessing filling pressures and comorbidities",
    ],
  },
  "hypertension-mechanisms": {
    overview: "Primary vs secondary HTN, end-organ damage, and RAAS role.",
    summary:
      "Primary HTN: multifactorial — increased SVR, salt sensitivity, sympathetic tone, vascular stiffness. Secondary causes to remember: renal artery stenosis, primary aldosteronism, pheochromocytoma, OSA, coarctation, Cushing.\n\nChronic HTN causes concentric LV hypertrophy, nephrosclerosis, retinopathy, and lacunar strokes. Malignant HTN: papilledema, encephalopathy, acute kidney injury.",
    keyConcepts: [
      "Renovascular HTN: bruit, flash pulmonary edema, creatinine rise with ACEi",
      "Primary aldosteronism: HTN + hypokalemia (not always present)",
      "Pheochromocytoma: episodic HTN, headache, sweating — alpha block before beta",
      "Coarctation: upper extremity HTN, radio-femoral delay",
      "Hypertensive emergency vs urgency: end-organ damage defines emergency",
    ],
    mustKnowFacts: [
      "First-line in uncomplicated HTN: thiazide, ACEi/ARB, CCB, or thiazide-like per JNC/AHA",
    ],
    pearls: [
      "Young woman with refractory HTN + hypokalemia → screen aldosterone/renin ratio.",
    ],
    pitfalls: [
      "Starting beta-blocker alone as first-line in uncomplicated primary HTN without compelling indication",
    ],
  },
  "acs-pathophysiology": {
    overview: "STEMI, NSTEMI, and UA on the spectrum of plaque thrombosis.",
    summary:
      "UA/NSTEMI: partial or transient occlusion — subendocardial ischemia, troponin elevation without ST elevation. STEMI: transmural ischemia with ST elevation from complete occlusion.\n\nReperfusion injury and stunned myocardium occur after restoration of flow. Cardiac biomarkers: troponin I/T most sensitive; CK-MB useful for reinfarction timing.",
    keyConcepts: [
      "Troponin rises within 3–6 h, peaks 24 h, remains elevated 7–10 days",
      "STEMI territory: anterior (LAD), inferior (RCA), lateral (LCx)",
      "Post-MI complications by timing: arrhythmia early, papillary muscle rupture 2–7 days, ventricular aneurysm late",
      "Dressler syndrome: autoimmune pericarditis weeks post-MI",
      "Reinfarction: new troponin rise with recurrent ischemic symptoms",
    ],
    mustKnowFacts: [
      "New LBBB with ischemic symptoms treated as STEMI equivalent",
    ],
    pearls: [
      "Inferior STEMI + hypotension → check right-sided leads for RV infarction.",
    ],
    pitfalls: [
      "Attributing chest pain to GI cause without ECG in at-risk patient",
    ],
  },
  "arrhythmia-electrophysiology": {
    overview: "Action potential phases, reentry, and channelopathies.",
    summary:
      "Normal conduction: SA → AV → bundle of His → Purkinje. Phase 0 (Na⁺ influx) in ventricular myocytes; phase 4 automaticity in pacemaker cells (funny current).\n\nReentrant tachycardias need dual pathways and unidirectional block (AVNRT, AVRT with accessory pathway). Long QT → torsades from delayed repolarization (hERG block). Brugada: Na channel mutation → V1–V3 ST elevation.",
    keyConcepts: [
      "Phase 0 blocked by Class I antiarrhythmics; phase 3 by Class III (K⁺ block)",
      "Accessory pathway (WPW): delta wave, short PR — avoid AV nodal blockers in pre-excited AF",
      "Torsades: prolonged QT, U waves, 'twisting' — magnesium",
      "Hyperkalemia: peaked T, widened QRS; hypokalemia: U waves, flat T",
      "Sick sinus syndrome and AV blocks progress with conduction disease",
    ],
    mustKnowFacts: [
      "WPW + AF → do not give verapamil/diltiazem/adenosine — can precipitate VF",
    ],
    pearls: [
      "Polymorphic VT with QT 520 ms after erythromycin → acquired torsades; stop drug, give Mg.",
    ],
    pitfalls: [
      "Missing WPW on ECG before treating SVT with AV nodal blockers",
    ],
  },
  "valvular-disease-mechanisms": {
    overview: "Pressure vs volume overload and murmur hemodynamics.",
    summary:
      "Aortic stenosis: fixed obstruction → concentric hypertrophy → angina, syncope, HF. Aortic regurgitation: volume overload → wide pulse pressure, bounding pulses, eccentric hypertrophy.\n\nMitral stenosis (rheumatic): diastolic gradient, left atrial enlargement, AF, pulmonary hypertension. Mitral regurgitation: holosystolic murmur; acute MR from papillary muscle rupture causes flash pulmonary edema.",
    keyConcepts: [
      "AS murmur: crescendo-decrescendo at RUSB, radiates to carotids; soft S2",
      "MR murmur: holosystolic at apex radiating to axilla",
      "MS: opening snap after S2; diastolic rumble best heard in LLD",
      "Carvallo sign: MR louder with expiration (left-sided)",
      "HOCM: dynamic obstruction — murmur increases with Valsalva/standing",
    ],
    mustKnowFacts: [
      "Symptomatic severe AS has poor prognosis without valve replacement",
    ],
    pearls: [
      "MVP click moves earlier with standing (reduced preload).",
    ],
    pitfalls: [
      "Confusing AS radiation to neck with carotid bruit — AS murmur peaks at RUSB",
    ],
  },
  "ards-pathology": {
    overview: "Diffuse alveolar damage, hyaline membranes, and V/Q mismatch.",
    summary:
      "ARDS: acute onset, bilateral infiltrates, PaO₂/FiO₂ ≤300, not fully explained by cardiac failure. Exudative phase: alveolar-capillary leak, hyaline membranes. Fibroproliferative phase in severe disease.\n\nCauses: sepsis, aspiration, trauma, pancreatitis, transfusion-related. Pathophysiology: surfactant loss, atelectasis, shunt physiology.",
    keyConcepts: [
      "Berlin criteria define ARDS severity by P/F ratio",
      "Low tidal volume ventilation (6 mL/kg IBW) reduces mortality",
      "Prone positioning improves oxygenation in moderate-severe ARDS",
      "Shunt physiology: hypoxemia poorly responsive to supplemental O₂ alone",
      "DAD on biopsy: hyaline membranes lining alveoli",
    ],
    mustKnowFacts: [
      "ARDS is a clinical-radiographic syndrome — treat underlying cause and lung-protective ventilation",
    ],
    pearls: [
      "Septic patient with PaO₂ 55 on 100% O₂ and bilateral opacities → ARDS, not cardiogenic edema alone.",
    ],
    pitfalls: [
      "Overhydrating septic patient worsens non-cardiogenic pulmonary edema",
    ],
  },
  "asthma-copd-pathology": {
    overview: "Reactive airways vs emphysema/chronic bronchitis destruction.",
    summary:
      "Asthma: type I hypersensitivity and eosinophilic inflammation → bronchospasm, mucus plugging, reversible obstruction. COPD: smoking-related neutrophilic inflammation; emphysema (loss of elastic recoil, centrilobular/ panlobular) vs chronic bronchitis (hypersecretion, blue bloater).\n\nAlpha-1 antitrypsin deficiency → panlobular emphysema in young non-smokers.",
    keyConcepts: [
      "Asthma: ↑ IgE, eosinophils, reversible FEV1 with bronchodilator",
      "COPD: largely irreversible obstruction; FEV1/FVC <0.7 post-bronchodilator",
      "Centrilobular emphysema from smoking; panlobular from A1AT deficiency",
      "Chronic bronchitis: productive cough ≥3 months × 2 years",
      "Cor pulmonale in advanced COPD from pulmonary hypertension",
    ],
    mustKnowFacts: [
      "A1AT: PiZZ genotype; low serum A1AT — treat with avoidance of smoking and augmentation therapy",
    ],
    pearls: [
      "40-year-old non-smoker with basilar emphysema → check A1AT level.",
    ],
    pitfalls: [
      "Labeling all wheezing as asthma in long-term smoker — consider COPD overlap (ACO)",
    ],
  },
  "glomerular-diseases": {
    overview: "Nephritic vs nephrotic patterns and complement pathways.",
    summary:
      "Nephritic: inflammation → hematuria with RBC casts, HTN, oliguria, ↓GFR. Nephrotic: podocyte injury → massive proteinuria, hypoalbuminemia, edema, hyperlipidemia, thrombotic risk.\n\nPost-strep GN: immune complex, low C3, self-limited. MPGN: tram-track basement membrane. Minimal change: effacement on EM, selective proteinuria in children.",
    keyConcepts: [
      "RBC casts pathognomonic for glomerulonephritis",
      "Nephrotic state hypercoagulable — renal vein thrombosis risk",
      "IgA nephropathy: synpharyngitic hematuria; normal complement",
      "Anti-GBM (Goodpasture): linear IgG on IF; pulmonary hemorrhage",
      "Diabetic nephropathy: Kimmelstiel-Wilson nodules",
    ],
    mustKnowFacts: [
      "Minimal change disease responds to corticosteroids in children",
    ],
    pearls: [
      "Cola urine + periorbital edema in child after strep pharyngitis → post-strep GN with low C3.",
    ],
    pitfalls: [
      "Missing anti-GBM in young smoker with hemoptysis and renal failure",
    ],
  },
  "acid-base-physiology": {
    overview: "Henderson-Hasselbalch, compensation rules, and anion gap.",
    summary:
      "pH = 6.1 + log([HCO₃]/0.03×PaCO₂). Primary respiratory disorder: acute vs chronic compensation differs (renal for chronic resp). Metabolic acidosis: calculate anion gap = Na − (Cl + HCO₃).\n\nMUDPILES for gap acidosis. Normal gap acidosis: RTA, diarrhea, ureterosigmoidostomy. Winter formula estimates expected PaCO₂ compensation in metabolic acidosis.",
    keyConcepts: [
      "Acute resp acidosis: HCO₃ rises 1 mEq/L per 10 mmHg ↑PaCO₂",
      "Metabolic alkalosis: volume depletion + chloride loss common",
      "RTA type I: cannot acidify urine, hypokalemia, stones",
      "RTA type IV: hyperkalemia, hypoaldosteronism",
      "Delta-delta gap evaluates concurrent disorders",
    ],
    mustKnowFacts: [
      "Salicylate overdose: mixed respiratory alkalosis + anion gap metabolic acidosis",
    ],
    pearls: [
      "Gap 22 + pH 7.25 → MUDPILES workup; if ketones positive think DKA/alcoholic ketoacidosis.",
    ],
    pitfalls: [
      "Ignoring concurrent respiratory and metabolic disorders when compensation 'doesn't fit'",
    ],
  },
  "aki-mechanisms": {
    overview: "Prerenal, intrinsic, postrenal physiology and ATN ischemic/toxic.",
    summary:
      "Prerenal: ↓ renal perfusion → avid Na/H₂O reabsorption → FeNa <1%, BUN:Cr >20, bland sediment. ATN: tubular cell death → muddy brown casts, FeNa >2%. Postrenal: obstruction → hydronephrosis.\n\nIschemic ATN follows prolonged prerenal; toxic ATN from aminoglycosides, contrast, myoglobin, ethylene glycol.",
    keyConcepts: [
      "Myoglobinuria: tea-colored urine, ↑ CK, tubular casts",
      "Contrast nephropathy peaks 3–5 days post-exposure",
      "RPGN: crescents on biopsy — not ATN",
      "FeUrea useful when on diuretics",
      "Recovery phase ATN: polyuric with wasting of electrolytes",
    ],
    mustKnowFacts: [
      "Bilateral ureteral obstruction can cause AKI — always consider postrenal",
    ],
    pearls: [
      "Prostate cancer + rising Cr + hydronephrosis on US → postrenal AKI; relieve obstruction.",
    ],
    pitfalls: [
      "Continuing nephrotoxins in oliguric patient without adjusting dose",
    ],
  },
  "pe-pathophysiology": {
    overview: "Virchow triad, hemodynamic consequences, and V/Q mismatch.",
    summary:
      "PE obstructs pulmonary arterial flow → ↑ dead space ventilation, hypoxemia, RV strain. Large PE → acute cor pulmonale and cardiovascular collapse.\n\nVirchow: stasis (immobility), endothelial injury (surgery, trauma), hypercoagulability (factor V Leiden, OCP, malignancy). Saddle PE can cause sudden death.",
    keyConcepts: [
      "RV dilation on echo/CT = RV strain",
      "Hypoxemia from ↑ dead space and reflex bronchoconstriction",
      "D-dimer sensitive but not specific — use with pretest probability",
      "Chronic thromboembolic pulmonary hypertension from unresolved PE",
      "Fat emboli after long bone fracture — petechial rash, confusion",
    ],
    mustKnowFacts: [
      "Massive PE: systemic hypotension — thrombolysis if no contraindication",
    ],
    pearls: [
      "Clear chest X-ray + sudden dyspnea + hypoxemia → PE on differential.",
    ],
    pitfalls: [
      "Attributing PE symptoms to anxiety without workup in high-risk patient",
    ],
  },
  "liver-pathology": {
    overview: "Cirrhosis, hepatitis patterns, and bilirubin metabolism.",
    summary:
      "Cirrhosis: bridging fibrosis and regenerative nodules → portal HTN, ascites, varices, hepatic encephalopathy. Alcoholic liver disease: steatosis → alcoholic hepatitis (Mallory bodies) → cirrhosis.\n\nViral hepatitis: HAV/HEV fecal-oral acute; HBV/HCV blood-borne chronic risk; HDV requires HBV. Wilson: copper accumulation; hemochromatosis: iron overload.",
    keyConcepts: [
      "AST:ALT >2 suggests alcoholic liver disease",
      "HBsAg + anti-HBc IgM = acute HBV; HBsAg + anti-HBc IgG = chronic",
      "Primary biliary cholangitis: anti-mitochondrial antibody, ↑ alk phos",
      "Budd-Chiari: hepatic vein thrombosis — painful hepatomegaly, ascites",
      "Alpha-1 antitrypsin: PAS-positive globules in hepatocytes",
    ],
    mustKnowFacts: [
      "Acetaminophen toxicity: centrilobular necrosis — NAC within 8 h most effective",
    ],
    pearls: [
      "Young patient with tremor, low ceruloplasmin, Kayser-Fleischer rings → Wilson disease.",
    ],
    pitfalls: [
      "Missing HBV reactivation before starting anti-CD20 or TNF inhibitor",
    ],
  },
  "ibd-mechanisms": {
    overview: "Crohn transmural inflammation vs UC mucosal continuous disease.",
    summary:
      "UC: continuous colonic involvement, crypt abscesses, pseudopolyps, toxic megacolon risk. Crohn: skip lesions, transmural, non-caseating granulomas, fistulas, strictures.\n\nBoth involve dysregulated immune response to gut microbiota in genetically susceptible hosts (NOD2 in Crohn). Extraintestinal manifestations: uveitis, ankylosing spondylitis, erythema nodosum, primary sclerosing cholangitis (UC).",
    keyConcepts: [
      "Crohn anywhere mouth to anus; terminal ileum classic",
      "UC limited to colon; no fistulas typically",
      "PSC association with UC — monitor LFTs and MRCP",
      "Toxic megacolon: colon >6 cm, systemic toxicity — IV steroids, surgery if no improvement",
      "Anti-TNF and anti-integrin biologics for moderate-severe disease",
    ],
    mustKnowFacts: [
      "Long-standing UC increases colon cancer risk — surveillance colonoscopy",
    ],
    pearls: [
      "Perianal fistula + terminal ileum inflammation on CT → Crohn, not UC.",
    ],
    pitfalls: [
      "Giving anti-motility agents in bloody diarrhea — risk toxic megacolon in IBD",
    ],
  },
  "malabsorption": {
    overview: "Celiac, tropical sprue, Whipple, and pancreatic insufficiency.",
    summary:
      "Malabsorption presents with steatorrhea, weight loss, deficiencies (B12, D, K, iron). Celiac: anti-tTG/IgA, villous atrophy on duodenal biopsy; gluten-free diet treatment.\n\nTropical sprue: similar histology in endemic areas. Whipple: PAS-positive macrophages in lamina propria, arthralgias, neurologic symptoms. Pancreatic insufficiency: low fecal elastase, fat-soluble vitamin deficiencies.",
    keyConcepts: [
      "Celiac: dermatitis herpetiformis, ↑ risk T-cell lymphoma if untreated",
      "D-xylose test distinguishes mucosal vs pancreatic cause (historical)",
      "Bacterial overgrowth: post-surgical blind loops, bloating after meals",
      "Short bowel syndrome: diarrhea, electrolyte losses",
      "Lactose intolerance: osmotic diarrhea, not true malabsorption of all nutrients",
    ],
    mustKnowFacts: [
      "Check IgA level before anti-tTG — IgA deficiency causes false-negative celiac serology",
    ],
    pearls: [
      "Iron + folate + B12 deficiency together → think celiac or tropical sprue.",
    ],
    pitfalls: [
      "Starting gluten-free diet before biopsy — histology may normalize and miss diagnosis",
    ],
  },
  "pancreatitis-enzymes": {
    overview: "Autodigestion, etiologies, and severity markers.",
    summary:
      "Acute pancreatitis: premature activation of trypsin within acinar cells → autodigestion. Gallstones (ampulla obstruction) and alcohol most common. Lipase more specific than amylase.\n\nSevere: necrosis, organ failure, SIRS. Chronic: calcifications, exocrine/endocrine insufficiency (diabetes, steatorrhea).",
    keyConcepts: [
      "Diagnosis: 2 of 3 — epigastric pain, lipase >3× ULN, imaging",
      "Grey-Turner and Cullen signs indicate severe hemorrhagic pancreatitis",
      "Hypertriglyceridemia-induced pancreatitis: insulin, plasmapheresis if very high",
      "Pseudocyst: fluid collection after 4 weeks; may need drainage if symptomatic",
      "Autoimmune pancreatitis: IgG4, sausage-shaped pancreas on CT",
    ],
    mustKnowFacts: [
      "ERCP can cause post-ERCP pancreatitis — prophylactic rectal indomethacin in high-risk cases",
    ],
    pearls: [
      "Lipase stays elevated longer than amylase — preferred biomarker.",
    ],
    pitfalls: [
      "Normal lipase on day 5 does not exclude pancreatitis if presentation was delayed",
    ],
  },
  "gi-bleeding-sources": {
    overview: "Upper vs lower sources and vascular lesions.",
    summary:
      "Upper GIB: peptic ulcer (posterior duodenal → gastroduodenal artery), varices, Mallory-Weiss tear, gastritis, Dieulafoy lesion. Lower: diverticulosis most common, angiodysplasia (right colon, elderly), ischemic colitis, hemorrhoids.\n\nMeckel diverticulum: ectopic gastric mucosa in rule of 2s — painless lower GIB in child/young adult.",
    keyConcepts: [
      "H. pylori and NSAIDs major PUD causes",
      "Varices from portal hypertension in cirrhosis",
      "Ischemic colitis: watershed areas, crampy pain + bloody diarrhea",
      "Dieulafoy: submucosal arterial malformation — brisk bleeding",
      "Occult GI bleed workup: colonoscopy + EGD; capsule if unrevealing",
    ],
    mustKnowFacts: [
      "Brisk upper GIB can present as hematochezia if massive",
    ],
    pearls: [
      "Painless bright red blood in elderly → diverticulosis or angiodysplasia.",
    ],
    pitfalls: [
      "Missing variceal bleed in cirrhotic — octreotide and antibiotics early",
    ],
  },
  "hepatitis-serology": {
    overview: "Interpret HBV panel and acute vs chronic viral hepatitis.",
    summary:
      "HBV: HBsAg (infection), anti-HBs (immunity from vaccine or recovery), anti-HBc IgM (acute), anti-HBc IgG (past or chronic). HBeAg indicates high replication; anti-HBe suggests lower replication.\n\nHCV: anti-HCV screening; HCV RNA confirms active infection. HDV requires HBsAg. HEV: fecal-oral, dangerous in pregnancy.",
    keyConcepts: [
      "Window period: HBsAg negative but anti-HBc IgM positive during seroconversion",
      "Isolated anti-HBc: prior infection, false positive, or occult HBV",
      "Vaccine response: anti-HBs alone positive",
      "HCV chronic infection → cirrhosis and HCC risk; DAA cure",
      "Autoimmune hepatitis: anti-smooth muscle, anti-LKM1, ↑ IgG",
    ],
    mustKnowFacts: [
      "HBV + HDV coinfection can cause fulminant hepatitis",
    ],
    pearls: [
      "HBsAg+, anti-HBc IgM−, HBeAg+ → chronic active HBV with high infectivity.",
    ],
    pitfalls: [
      "Interpreting isolated anti-HBc without HBV DNA in immunosuppressed patient",
    ],
  },
  "diabetes-pathophysiology": {
    overview: "Type 1 autoimmune beta-cell destruction vs type 2 insulin resistance.",
    summary:
      "Type 1: autoimmune (anti-GAD, anti-islet cell) → absolute insulin deficiency → DKA risk. Type 2: insulin resistance + relative insulin secretory failure; associated with obesity, metabolic syndrome.\n\nDKA: insulin deficiency → lipolysis → ketogenesis → anion gap acidosis. HHS: profound hyperglycemia, hyperosmolarity, minimal ketosis — higher mortality in elderly.",
    keyConcepts: [
      "DKA: glucose often >250, ketones, gap acidosis",
      "HHS: glucose often >600, altered mental status, severe dehydration",
      "Microvascular complications: retinopathy, nephropathy, neuropathy",
      "Macrovascular: ASCVD risk equivalent",
      "MODY: monogenic diabetes — autosomal dominant, young onset",
    ],
    mustKnowFacts: [
      "SGLT2 inhibitors can cause euglycemic DKA perioperatively",
    ],
    pearls: [
      "Thin adolescent with gap acidosis and glucose 350 → type 1 DKA, not HHS.",
    ],
    pitfalls: [
      "Stopping insulin in type 1 when NPO without glucose-ketone monitoring plan",
    ],
  },
  "thyroid-disorders": {
    overview: "Hyperthyroidism, hypothyroidism, and thyroid hormone synthesis.",
    summary:
      "Graves: TSH receptor stimulating antibodies, diffuse uptake on scan, ophthalmopathy. Toxic multinodular goiter and toxic adenoma: autonomous nodules.\n\nHashimoto: anti-TPO/Tg antibodies, lymphocytic infiltration, hypothyroidism. Myxedema coma: severe hypothyroid crisis. Thyroid storm: extreme thyrotoxicosis with multiorgan dysfunction.",
    keyConcepts: [
      "TSH is most sensitive screening test",
      "Graves ophthalmopathy may persist despite euthyroid state",
      "Subacute thyroiditis: painful thyroid post-viral, hyper then hypo phase",
      "Medullary thyroid carcinoma: calcitonin, MEN2 association — RET mutation",
      "Amiodarone affects thyroid function (hypo or hyper)",
    ],
    mustKnowFacts: [
      "Pregnancy: target lower TSH in hypothyroidism; PTU preferred first trimester for hyperthyroidism historically",
    ],
    pearls: [
      "Suppressed TSH + diffuse uptake on scan in young woman → Graves.",
    ],
    pitfalls: [
      "Treating subclinical hyperthyroidism in elderly without symptoms or AF risk",
    ],
  },
  "adrenal-disorders": {
    overview: "Cushing, Addison, pheochromocytoma, and congenital adrenal hyperplasia.",
    summary:
      "Primary adrenal insufficiency (Addison): low cortisol + high ACTH, hyperpigmentation, hyperkalemia. Secondary: low ACTH, no hyperpigmentation.\n\nCushing syndrome: cortisol excess — central obesity, striae, hypertension, hyperglycemia. Pheochromocytoma: catecholamine excess — episodic HTN, headache, sweating.",
    keyConcepts: [
      "Addison crisis: hypotension, hyponatremia, hyperkalemia — IV hydrocortisone",
      "21-hydroxylase deficiency CAH: virilization, salt wasting",
      "Dexamethasone suppression test for Cushing workup",
      "Pheochromocytoma: 24 h urine/ plasma metanephrines",
      "Alpha blockade before beta blockade in pheo",
    ],
    mustKnowFacts: [
      "Meningococcemia can cause Waterhouse-Friderichsen adrenal hemorrhage",
    ],
    pearls: [
      "Chronic steroid use → adrenal suppression — stress-dose steroids for surgery.",
    ],
    pitfalls: [
      "Beta-blocker before alpha block in pheochromocytoma → hypertensive crisis",
    ],
  },
  "pcos-endocrine": {
    overview: "Hyperandrogenism, anovulation, and polycystic ovaries.",
    summary:
      "Rotterdam criteria (2 of 3): oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovaries on US. Insulin resistance central to pathophysiology.\n\nLong-term risks: type 2 diabetes, endometrial hyperplasia (unopposed estrogen), cardiovascular disease. Treatment: lifestyle, OCPs for cycle regulation, metformin, fertility agents if desired.",
    keyConcepts: [
      "Exclude thyroid disease, prolactinoma, CAH, Cushing before diagnosis",
      "↑ LH:FSH ratio classically described",
      "Hirsutism, acne, male-pattern hair loss",
      "Anovulatory infertility — clomiphene/letrozole",
      "Endometrial protection with progestin if no OCPs",
    ],
    mustKnowFacts: [
      "PCOS is diagnosis of exclusion for hyperandrogenic anovulation",
    ],
    pearls: [
      "Irregular cycles + hirsutism + obese adolescent → PCOS workup.",
    ],
    pitfalls: [
      "Missing non-classic CAH (17-OH progesterone elevated)",
    ],
  },
  "preeclampsia-mechanism": {
    overview: "Placental malperfusion, endothelial dysfunction, and vasospasm.",
    summary:
      "Preeclampsia: abnormal placentation → deficient spiral artery remodeling → placental ischemia → release of anti-angiogenic factors (sFlt-1) → maternal endothelial dysfunction → HTN, proteinuria, end-organ injury.\n\nHELLP: microangiopathic hemolysis, liver injury, thrombocytopenia. Eclampsia: CNS hyperexcitability → seizures.",
    keyConcepts: [
      "After 20 weeks gestation in previously normotensive patient",
      "Risk factors: nulliparity, chronic HTN, diabetes, multifetal gestation",
      "Magnesium prevents/treats eclampsia — not phenytoin first line",
      "Delivery only definitive cure",
      "Fetal growth restriction from placental insufficiency",
    ],
    mustKnowFacts: [
      "Postpartum preeclampsia can occur up to 6 weeks after delivery",
    ],
    pearls: [
      "Headache + visual changes in third trimester → check BP, urine protein, LFTs, platelets.",
    ],
    pitfalls: [
      "Confusing HELLP with acute fatty liver of pregnancy or TTP",
    ],
  },
  "contraception-pharmacology": {
    overview: "Estrogen-progestin MOA, contraindications, and emergency contraception.",
    summary:
      "Combined OCPs: suppress ovulation, thicken cervical mucus. Progestin-only: ovulation inhibition variable, mainly mucus changes. Contraindications to estrogen: migraine with aura, smoking >35, history VTE, estrogen-sensitive cancer.\n\nEmergency contraception: levonorgestrel or copper IUD (most effective). Depo medroxyprogesterone: bone density concern with long use.",
    keyConcepts: [
      "Absolute estrogen contraindications — ACHES warning (Abdominal pain, Chest pain, Headache severe, Eye problems, Severe leg pain)",
      "Copper IUD prevents fertilization and implantation — emergency use up to 5 days",
      "Progestin-only safe in breastfeeding and many estrogen contraindications",
      "OCP failure with enzyme inducers (rifampin, phenytoin, carbamazepine)",
      "LARC (IUD, implant) highest typical-use efficacy",
    ],
    mustKnowFacts: [
      "Smoking + OCPs in women >35 increases VTE and stroke risk substantially",
    ],
    pearls: [
      "Migraine with aura → avoid combined OCP; progestin-only or non-hormonal methods.",
    ],
    pitfalls: [
      "Prescribing combined OCP in active VTE history",
    ],
  },
  "leukemia-classification": {
    overview: "Acute vs chronic, lymphoid vs myeloid, and key markers.",
    summary:
      "ALL: children and older adults bimodal; lymphoblasts, TdT+, CD10+ (B-ALL). AML: Auer rods, myeloperoxidase+, t(15;17) APL responds to ATRA.\n\nCLL: older adults, smudge cells, CD5+ B cells, often indolent. CML: t(9;22) BCR-ABL, Philadelphia chromosome — tyrosine kinase inhibitors.",
    keyConcepts: [
      "APL (M3): DIC, t(15;17), ATRA + arsenic — treat emergently",
      "CML: bcr-abl, leukocyte alkaline phosphatase low",
      "Hairy cell leukemia: TRAP positive, cladribine treatment",
      "AML with Auer rods — myeloperoxidase stain",
      "Burkitt lymphoma/leukemia: t(8;14), starry sky histology, high-grade",
    ],
    mustKnowFacts: [
      "APL coagulopathy worsens with chemotherapy before ATRA — start ATRA immediately when suspected",
    ],
    pearls: [
      "Young patient with DIC + promyelocytes → APL until proven otherwise; start ATRA.",
    ],
    pitfalls: [
      "Delaying ATRA in suspected APL pending cytogenetics",
    ],
  },
  "anemia-workup": {
    overview: "MCV-based differential and hemolysis labs.",
    summary:
      "Microcytic: iron deficiency (↓ ferritin), anemia of chronic disease, thalassemia (↑ RBC count), sideroblastic. Macrocytic: B12/folate deficiency, alcohol, hypothyroidism, meds (hydroxyurea).\n\nHemolysis: ↑ LDH, indirect bilirubin, ↓ haptoglobin, reticulocytosis. Intravascular vs extravascular — schistocytes suggest microangiopathy (TTP/HUS/DIC).",
    keyConcepts: [
      "Iron studies: ferritin low in deficiency; high in inflammation",
      "Thalassemia trait: microcytosis with normal/high RBC count",
      "Schistocytes on smear → MAHA workup",
      "Direct Coombs positive → autoimmune hemolytic anemia",
      "Reticulocyte index corrects for anemia severity",
    ],
    mustKnowFacts: [
      "B12 deficiency causes neurologic symptoms — subacute combined degeneration",
    ],
    pearls: [
      "Microcytosis + normal ferritin + chronic illness → anemia of chronic disease.",
    ],
    pitfalls: [
      "Treating B12 deficiency without checking folate — can unmask subacute combined degeneration progression",
    ],
  },
  "tumor-markers": {
    overview: "Screening, monitoring, and paraneoplastic syndromes.",
    summary:
      "Tumor markers are generally for monitoring, not screening (except PSA with shared decision, AFP in HCC surveillance in cirrhosis). PSA elevated in BPH and prostatitis too.\n\nParaneoplastic: SIADH (small cell lung), hypercalcemia (PTHrP in squamous cell), Lambert-Eaton (small cell), hypertrophic osteoarthropathy.",
    keyConcepts: [
      "AFP: hepatocellular carcinoma, yolk sac tumor",
      "CA-125: ovarian cancer monitoring, not screening",
      "CEA: colorectal cancer monitoring post-treatment",
      "PSA: prostate — interpret with age and prostate size",
      "Beta-hCG: choriocarcinoma, germ cell tumors",
    ],
    mustKnowFacts: [
      "Small cell lung cancer associated with multiple paraneoplastic syndromes",
    ],
    pearls: [
      "Hypercalcemia + low PTH + squamous lung mass → PTHrP-mediated humoral hypercalcemia.",
    ],
    pitfalls: [
      "Using CA-125 to screen average-risk ovarian cancer — low specificity",
    ],
  },
  "hypersensitivity": {
    overview: "Types I–IV with examples and mediators.",
    summary:
      "Type I (IgE): immediate — anaphylaxis, allergic rhinitis, asthma. Type II (IgG/IgM against cell surface): AIHA, Goodpasture, ABO transfusion reaction. Type III (immune complexes): SLE, post-strep GN, serum sickness. Type IV (T cell delayed): contact dermatitis, TB skin test, granulomas.\n\nAnaphylaxis: mast cell degranulation → histamine, leukotrienes — urticaria, bronchospasm, hypotension.",
    keyConcepts: [
      "Type I: tryptase elevated after anaphylaxis",
      "Type II: direct Coombs, complement activation",
      "Type III: complement consumption, soluble complexes",
      "Type IV: PPD, poison ivy — not antibody mediated",
      "Graft rejection: hyperacute (II), acute (IV), chronic (IV/fibrosis)",
    ],
    mustKnowFacts: [
      "Penicillin allergy history — clarify if true IgE vs intolerance; cross-reactivity with cephalosporins low but exists",
    ],
    pearls: [
      "Contact dermatitis from nickel or poison ivy → type IV, not IgE allergy.",
    ],
    pitfalls: [
      "Labeling all drug rash as allergy — limits future antibiotic options",
    ],
  },
  "transplant-immunology": {
    overview: "Rejection types, immunosuppression, and GVHD.",
    summary:
      "Hyperacute rejection: preformed antibodies minutes to hours — vascular thrombosis. Acute cellular rejection: T cell mediated days to weeks. Chronic rejection: fibrosis, vasculopathy months to years.\n\nGVHD: donor T cells attack host — skin rash, liver, GI after allogeneic bone marrow transplant. Immunosuppressants: calcineurin inhibitors (tacrolimus), antimetabolites (mycophenolate), steroids.",
    keyConcepts: [
      "Crossmatch prevents hyperacute rejection",
      "Acute rejection treated with high-dose steroids or antilymphocyte globulin",
      "Cyclosporine/tacrolimus nephrotoxicity and HTN",
      "Opportunistic infections on chronic immunosuppression — CMV, PCP, BK virus",
      "GVHD prophylaxis: methotrexate + tacrolimus in allo-BMT",
    ],
    mustKnowFacts: [
      "Live vaccines contraindicated in immunosuppressed transplant recipients",
    ],
    pearls: [
      "Rising creatinine in renal transplant + fever → rejection vs infection vs drug toxicity.",
    ],
    pitfalls: [
      "Missing drug interaction raising tacrolimus levels (azole antifungals)",
    ],
  },
  "coagulation-cascade": {
    overview: "Intrinsic vs extrinsic pathway and clinical bleeding disorders.",
    summary:
      "PT (extrinsic VII) and PTT (intrinsic VIII, IX, XI, XII). Common pathway: X, V, II (prothrombin), fibrinogen. Hemophilia A (VIII deficiency), B (IX) — deep tissue bleeding, hemarthroses.\n\nVon Willebrand disease: mucocutaneous bleeding, ↓ vWF and possibly factor VIII. DIC: widespread activation → consumption coagulopathy.",
    keyConcepts: [
      "Hemophilia: prolonged PTT, normal PT; treat with factor replacement/desmopressin",
      "Vitamin K deficiency: prolonged PT first (factor VII shortest half-life)",
      "Liver failure: ↓ synthesis of clotting factors",
      "Antiphospholipid syndrome: prolonged PTT in vitro but prothrombotic in vivo",
      "Platelet vs coagulation bleed: petechiae vs hemarthrosis",
    ],
    mustKnowFacts: [
      "Warfarin inhibits vitamin K epoxide reductase — factors II, VII, IX, X affected",
    ],
    pearls: [
      "Prolonged PTT that does not correct on mixing study → factor inhibitor (lupus anticoagulant or acquired hemophilia).",
    ],
    pitfalls: [
      "Giving platelets in TTP — contraindicated",
    ],
  },
  "rheumatoid-arthritis": {
    overview: "Synovitis, pannus formation, and autoantibody pathogenesis.",
    summary:
      "Autoimmune synovitis → pannus destroys cartilage and bone → symmetric polyarthritis of MCP/PIP/wrist. Anti-CCP highly specific; RF less specific.\n\nExtra-articular: rheumatoid nodules, interstitial lung disease, Felty syndrome (splenomegaly, neutropenia), atlantoaxial subluxation.",
    keyConcepts: [
      "Morning stiffness >1 hour",
      "Anti-CCP predicts erosive disease",
      "Methotrexate anchor DMARD — folic acid supplementation",
      "TNF inhibitors require TB screening",
      "Cervical spine instability before intubation in long-standing RA",
    ],
    mustKnowFacts: [
      "Methotrexate teratogenic — contraception mandatory",
    ],
    pearls: [
      "Symmetric MCP swelling + anti-CCP+ → RA; start DMARD early to prevent erosions.",
    ],
    pitfalls: [
      "NSAIDs alone without DMARD allow joint destruction to continue",
    ],
  },
  "lupus-pathology": {
    overview: "SLE autoimmunity, immune complexes, and organ involvement.",
    summary:
      "Loss of self-tolerance → ANA, anti-dsDNA, anti-Smith. Immune complex deposition → glomerulonephritis, serositis, skin rash. Discoid lupus: scarring rash, less systemic.\n\nDrug-induced lupus: anti-histone antibodies (procainamide, hydralazine, isoniazid) — usually resolves off drug.",
    keyConcepts: [
      "Malar rash sparing nasolabial folds",
      "Lupus nephritis classes I–VI on biopsy guide therapy",
      "Antiphospholipid antibodies → thrombosis and pregnancy loss",
      "Libman-Sacks endocarditis — sterile vegetations",
      "Hydroxychloroquine reduces flares and mortality",
    ],
    mustKnowFacts: [
      "Sun exposure triggers cutaneous lupus flares",
    ],
    pearls: [
      "Young woman with arthritis, oral ulcers, low C3/C4, proteinuria → SLE nephritis workup.",
    ],
    pitfalls: [
      "Missing antiphospholipid syndrome in lupus patient with stroke",
    ],
  },
  "gout-crystals": {
    overview: "Urate crystal deposition and pseudogout CPPD.",
    summary:
      "Hyperuricemia → monosodium urate crystals in joint → intense inflammation. Risk: renal disease, diuretics, alcohol, purine-rich diet. Tophi in chronic gout.\n\nPseudogout: calcium pyrophosphate dihydrate crystals — rhomboid, weakly positive birefringence; often knee in elderly.",
    keyConcepts: [
      "Gout crystals: needle-shaped, negative birefringence under polarized light",
      "Acute treatment: NSAIDs, colchicine, or steroids — not starting urate-lowering during acute flare traditionally",
      "Allopurinol or febuxostat for chronic urate lowering",
      "Tumor lysis syndrome causes acute hyperuricemia",
      "Pseudogout associated with hemochromatosis, hyperparathyroidism",
    ],
    mustKnowFacts: [
      "Allopurinol started too early during acute attack may worsen flare — debatable practice varies",
    ],
    pearls: [
      "First MTP podagra in middle-aged man after beer → gout; aspirate for crystals.",
    ],
    pitfalls: [
      "Treating septic arthritis as gout without joint aspiration",
    ],
  },
  "osteoporosis-bone": {
    overview: "Remodeling imbalance, fracture risk, and secondary causes.",
    summary:
      "Bone resorption (osteoclasts) exceeds formation (osteoblasts) → low BMD, fragility fractures (hip, vertebral, wrist). Primary postmenopausal (estrogen loss) and senile.\n\nSecondary: hyperparathyroidism, glucocorticoids, malabsorption, hyperthyroidism. Bisphosphonates inhibit osteoclasts; teriparatide builds bone (anabolic).",
    keyConcepts: [
      "DEXA T-score ≤ −2.5 defines osteoporosis",
      "Vertebral compression fracture may be painless",
      "Glucocorticoids major cause secondary osteoporosis",
      "Calcium + vitamin D supplementation baseline",
      "Atypical femur fracture risk with long bisphosphonate use",
    ],
    mustKnowFacts: [
      "Denosumab discontinuation can cause rebound vertebral fractures — transition carefully",
    ],
    pearls: [
      "Height loss >1 inch + back pain in elderly → vertebral fracture; check spine imaging.",
    ],
    pitfalls: [
      "Missing hyperparathyroidism as cause of low BMD before starting bisphosphonate",
    ],
  },
  "myopathies": {
    overview: "Inflammatory, dystrophic, and metabolic muscle disease.",
    summary:
      "Polymyositis: endomysial CD8+ T cell infiltration, proximal weakness. Dermatomyositis: heliotrope rash, Gottron papules, perimysial inflammation, malignancy association in adults.\n\nDuchenne MD: X-linked, dystrophin mutation, calf pseudohypertrophy, elevated CK. Statins can cause myopathy — check CK if symptomatic.",
    keyConcepts: [
      "Proximal > distal weakness pattern in myositis",
      "Anti-Jo-1 in antisynthetase syndrome — mechanic's hands, ILD",
      "EMG: myopathic potentials",
      "Muscle biopsy gold standard for inflammatory myopathy",
      "Malignancy screen in adult dermatomyositis",
    ],
    mustKnowFacts: [
      "Duchenne: Gower sign, wheelchair by early teens",
    ],
    pearls: [
      "Heliotrope rash + proximal weakness + ↑ CK → dermatomyositis; age-appropriate cancer screening.",
    ],
    pitfalls: [
      "Attributing statin myalgia to polymyositis without stopping statin and rechecking",
    ],
  },
  "collagen-disorders": {
    overview: "Ehlers-Danlos, Marfan, osteogenesis imperfecta.",
    summary:
      "Marfan: fibrillin-1 mutation → aortic root dilation, lens dislocation upward, arachnodactyly, pneumothorax. Ehlers-Danlos: hyperextensible skin/joints, vascular type (IV) has arterial rupture risk.\n\nOsteogenesis imperfecta: type I collagen defect → brittle bones, blue sclerae, hearing loss.",
    keyConcepts: [
      "Marfan: aortic dissection risk — beta-blockers to reduce wall stress",
      "EDS vascular type: avoid invasive procedures if possible",
      "OI: multiple fractures with minimal trauma in child",
      "Homocystinuria mimics Marfan — lens dislocation downward, intellectual disability",
      "Scurvy: vitamin C deficiency — bleeding gums, poor wound healing",
    ],
    mustKnowFacts: [
      "Marfan aortic root >4.5 cm — prophylactic aortic root replacement considered",
    ],
    pearls: [
      "Tall patient with pectus excavatum + murmur of aortic regurgitation → echo for root diameter.",
    ],
    pitfalls: [
      "Missing homocystinuria — check homocysteine in marfanoid habitus with downward lens dislocation",
    ],
  },
  "stroke-localization": {
    overview: "Anterior vs posterior circulation and lacunar syndromes.",
    summary:
      "Middle cerebral artery: contralateral face/arm weakness, aphasia (dominant hemisphere). ACA: leg weakness. Posterior circulation: vertigo, ataxia, crossed findings, homonymous hemianopia.\n\nLacunar strokes: small vessel disease — pure motor, pure sensory, dysarthria-clumsy hand from hypertension/diabetes.",
    keyConcepts: [
      "Broca aphasia: frontal lobe — nonfluent; Wernicke: fluent nonsense",
      "Horner syndrome + arm pain → Pancoast tumor or carotid dissection",
      "Wallenberg (PICA): ipsilateral face pain loss, contralateral body, vertigo, dysphagia",
      "Locked-in: basilar artery — consciousness preserved, only vertical gaze",
      "Amaurosis fugax: retinal ischemia from carotid emboli",
    ],
    mustKnowFacts: [
      "Time last known well determines acute intervention eligibility",
    ],
    pearls: [
      "Crossed sensory/motor deficit (face one side, body other) → brainstem lesion.",
    ],
    pitfalls: [
      "Confusing peripheral vertigo (HINTS exam) with posterior stroke",
    ],
  },
  "ms-pathology": {
    overview: "Demyelination, plaques, and immunopathogenesis.",
    summary:
      "Autoimmune CNS demyelination with relapses and remissions. Periventricular plaques, oligoclonal bands in CSF not in serum. Optic neuritis common presenting feature.\n\nProgressive forms: primary progressive MS without clear relapses. MRI: Dawson fingers perpendicular to ventricles.",
    keyConcepts: [
      "Lhermitte sign: electric shock down spine on neck flexion",
      "Internuclear ophthalmoplegia: MLF lesion — impaired adduction ipsilateral eye",
      "Disease-modifying therapies: interferon, glatiramer, natalizumab (PML risk with JC virus)",
      "Uhthoff phenomenon: heat worsens symptoms",
      "MS mimics: NMO (aquaporin-4), neurosarcoid, vitamin B12 deficiency",
    ],
    mustKnowFacts: [
      "NMO (Devic) — longitudinally extensive transverse myelitis, severe optic neuritis; anti-AQP4",
    ],
    pearls: [
      "Young woman with optic neuritis + periventricular white matter lesions → MS workup with CSF oligoclonal bands.",
    ],
    pitfalls: [
      "Starting natalizumab without JC virus antibody stratification",
    ],
  },
  "neurodegenerative": {
    overview: "Alzheimer, Parkinson, Huntington pathology and genetics.",
    summary:
      "Alzheimer: amyloid plaques (Aβ) and neurofibrillary tangles (hyperphosphorylated tau) → hippocampal atrophy. Parkinson: Lewy bodies (alpha-synuclein) in substantia nigra → bradykinesia, rigidity, resting tremor.\n\nHuntington: CAG trinucleotide repeat expansion in HTT — chorea, psychiatric symptoms, caudate atrophy.",
    keyConcepts: [
      "Alzheimer: episodic memory loss earliest; low acetylcholine",
      "Parkinson: asymmetric onset, shuffling gait, masked facies",
      "Lewy body dementia: visual hallucinations, fluctuating cognition, parkinsonism",
      "Frontotemporal dementia: personality/behavior change young onset",
      "Huntington anticipation with paternal transmission",
    ],
    mustKnowFacts: [
      "Antipsychotics worsen parkinsonism in Lewy body dementia",
    ],
    pearls: [
      "Resting pill-rolling tremor + cogwheel rigidity + micrographia → Parkinson; respond to levodopa.",
    ],
    pitfalls: [
      "Treating Lewy body psychosis with typical antipsychotics — severe sensitivity",
    ],
  },
  "seizure-mechanisms": {
    overview: "Excitatory/inhibitory imbalance and epilepsy syndromes.",
    summary:
      "Seizure: paroxysmal synchronous neuronal discharge. Focal vs generalized onset. Status epilepticus: continuous or repetitive seizures without recovery — neuronal injury if prolonged.\n\nAbsence seizures: 3 Hz spike-and-wave, brief staring, childhood. Temporal lobe epilepsy: aura (déjà vu), automatisms.",
    keyConcepts: [
      "Benzodiazepines increase GABAergic inhibition — first-line status",
      "Phenytoin/carbamazepine block sodium channels — focal epilepsy",
      "Ethosuximide for absence — avoids worsening generalized tonic-clonic",
      "Mesial temporal sclerosis common cause refractory focal epilepsy",
      "SUDEP: sudden unexpected death in epilepsy",
    ],
    mustKnowFacts: [
      "Status epilepticus >5 min — treat immediately",
    ],
    pearls: [
      "3 Hz spike-wave on EEG during 10 sec staring spell in child → childhood absence epilepsy.",
    ],
    pitfalls: [
      "Phenytoin in absence epilepsy — may worsen seizures",
    ],
  },
  "cranial-nerve-lesions": {
    overview: "CN deficits localize lesions from nucleus to periphery.",
    summary:
      "CN III palsy: ptosis, down-and-out eye, pupil involvement suggests compressive lesion (PCom aneurysm) vs microvascular (diabetes — pupil spared classically). CN VI: abducens — longest intracranial course, vulnerable to ↑ICP.\n\nCN VII: LMN vs UMN facial weakness — forehead involvement distinguishes (UMN spares forehead). CN XII: tongue deviates toward lesion.",
    keyConcepts: [
      "Bell palsy: idiopathic LMN VII — treat with steroids ± antivirals if severe",
      "CN III compression: pupil-involving → aneurysm until proven otherwise",
      "Internuclear ophthalmoplegia: CN VI nucleus + MLF",
      "Acoustic neuroma: CN VIII at cerebellopontine angle — hearing loss, tinnitus",
      "Horner: CN interruption — ptosis, miosis, anhidrosis",
    ],
    mustKnowFacts: [
      "Painful CN III palsy with pupil involvement → emergent vascular imaging",
    ],
    pearls: [
      "Diabetes CN III palsy: pupil often spared; painful pupil-involving III → aneurysm workup.",
    ],
    pitfalls: [
      "Missing PCom aneurysm by assuming all painful III palsies are microvascular",
    ],
  },
  "psychiatric-pharmacology": {
    overview: "Antidepressants, antipsychotics, mood stabilizers — MOA and tox.",
    summary:
      "SSRIs: ↑ synaptic serotonin — fluoxetine long half-life. SNRIs: serotonin + norepinephrine. TCAs: anticholinergic, sodium channel blockade in overdose (wide QRS).\n\nTypical antipsychotics: D2 block — EPS. Atypical: D2 + 5HT2A — metabolic syndrome risk. Lithium: narrow therapeutic index, renal and thyroid monitoring.",
    keyConcepts: [
      "MAOI + SSRI → serotonin syndrome — 2-week washout (5 weeks fluoxetine)",
      "Clozapine: agranulocytosis monitoring; best for treatment-resistant schizophrenia",
      "Lithium toxicity: tremor, confusion, coarse tremor; levels ↑ with dehydration, NSAIDs, ACEi",
      "Bupropion lowers seizure threshold; aids smoking cessation",
      "Valproate: neural tube defects — avoid in pregnancy if possible",
    ],
    mustKnowFacts: [
      "TCA overdose: sodium bicarbonate for QRS >100 ms",
    ],
    pearls: [
      "Amitriptyline overdose + wide QRS → bicarbonate bolus before arrhythmia progresses.",
    ],
    pitfalls: [
      "Starting SSRI in bipolar patient without mood stabilizer — mania risk",
    ],
  },
  "drug-moa-side-effects": {
    overview: "Receptor targets, therapeutic indices, and classic adverse effects.",
    summary:
      "Board favorites link drug class to mechanism and signature toxicity: ACEi cough/angioedema, statin myopathy, metformin lactic acidosis (rare, renal risk), aminoglycoside ototoxicity/nephrotoxicity.\n\nTherapeutic index narrow drugs: lithium, digoxin, phenytoin, warfarin, theophylline, chemotherapeutics.",
    keyConcepts: [
      "Beta-blockers: bronchospasm in asthma, mask hypoglycemia",
      "Fluoroquinolones: QT prolongation, tendon rupture, avoid in aortic aneurysm",
      "Amiodarone: pulmonary fibrosis, thyroid dysfunction, corneal deposits",
      "Methotrexate: folate antagonist — mucositis, hepatotoxicity",
      "Cisplatin: nephrotoxicity, ototoxicity — hydrate aggressively",
    ],
    mustKnowFacts: [
      "ACE inhibitor angioedema can occur years after starting — do not rechallenge",
    ],
    pearls: [
      "Dry cough on enalapril → ACEi-induced; switch to ARB if needed.",
    ],
    pitfalls: [
      "Adding NSAID to ACEi + diuretic in elderly → AKI triad",
    ],
  },
  "autonomic-pharmacology": {
    overview: "Sympathetic and parasympathetic receptors and clinical drugs.",
    summary:
      "Alpha-1: vasoconstriction (phenylephrine). Beta-1: ↑HR/contractility. Beta-2: bronchodilation. Muscarinic: SLUD (salivation, lacrimation, urination, defecation).\n\nOrganophosphates inhibit AChE → cholinergic crisis — atropine (muscarinic) + pralidoxime (reactivate AChE if early).",
    keyConcepts: [
      "Beta-blocker overdose: glucagon if refractory bradycardia/hypotension",
      "Atropine blocks muscarinic — not nicotinic muscle weakness in organophosphate poisoning",
      "Clonidine and alpha-2 agonists cause rebound HTN if stopped abruptly",
      "Pheochromocytoma: alpha before beta blockade",
      "Scopolamine: antiemetic anticholinergic — confusion in elderly",
    ],
    mustKnowFacts: [
      "Cocaine chest pain: benzodiazepines; avoid pure beta-blockade",
    ],
    pearls: [
      "Farm worker with miosis, bronchorrhea, bradycardia → organophosphate; atropine until secretions dry.",
    ],
    pitfalls: [
      "Using beta-blocker alone in thyroid storm before beta-blockade after thionamide and adequate alpha effect if tachy with HTN crisis",
    ],
  },
  "antibiotic-mechanisms": {
    overview: "Cell wall, protein synthesis, DNA, and folate pathway inhibitors.",
    summary:
      "Beta-lactams (penicillins, cephalosporins, carbapenems): cell wall synthesis — bactericidal. Aminoglycosides: 30S ribosome — bactericidal, concentration-dependent killing. Macrolides/tetracyclines: 30S/50S — bacteriostatic.\n\nFluoroquinolones: DNA gyrase/topoisomerase IV. Metronidazole: DNA damage in anaerobes. Vancomycin: cell wall in Gram-positive.",
    keyConcepts: [
      "MRSA: vancomycin, daptomycin (not pneumonia), linezolid",
      "Pseudomonas: anti-pseudomonal beta-lactams, aminoglycosides, fluoroquinolones",
      "C. diff: oral vancomycin or fidaxomicin — IV vancomycin not effective in gut",
      "Beta-lactam allergy: cross-reactivity with cephalosporins lower than historically taught",
      "Time-dependent vs concentration-dependent killing guides dosing",
    ],
    mustKnowFacts: [
      "Aminoglycosides require therapeutic monitoring — nephro/ototoxicity",
    ],
    pearls: [
      "Meningitis empiric: ceftriaxone + vancomycin + dexamethasone before antibiotics if pneumococcal suspected.",
    ],
    pitfalls: [
      "Daptomycin for MRSA pneumonia — inactivated by surfactant",
    ],
  },
  "antiviral-agents": {
    overview: "HIV, HSV, influenza, and hepatitis antivirals.",
    summary:
      "HIV: NRTIs, NNRTIs, PIs, integrase inhibitors — combination ART. HSV/VZV: acyclovir (viral thymidine kinase activation). Influenza: neuraminidase inhibitors (oseltamivir).\n\nHepatitis C: direct-acting antivirals cure most genotypes. CMV: ganciclovir — bone marrow suppression.",
    keyConcepts: [
      "Acyclovir requires viral TK — resistance via TK mutation",
      "Integrase inhibitors (dolutegravir) highly effective component of ART",
      "Tenofovir also active against HBV",
      "Oseltamivir within 48 h of symptom onset — still give if severe hospitalized influenza",
      "Ganciclovir valganciclovir for CMV in immunocompromised",
    ],
    mustKnowFacts: [
      "Abacavir hypersensitivity — HLA-B*5701 screening before use",
    ],
    pearls: [
      "Immunocompromised patient with retinitis + pizza-pie fundus → CMV; treat with valganciclovir.",
    ],
    pitfalls: [
      "Single-drug HIV therapy → rapid resistance — always combination ART",
    ],
  },
  "gram-positive-organisms": {
    overview: "Staph, Strep, Clostridia, and atypical G+ rods.",
    summary:
      "Staph aureus: coagulase+, catalase+, MRSA mecA gene. Strep pyogenes (GAS): bacitracin sensitive, ASO after pharyngitis, toxic shock syndromes. Strep agalactiae (GBS): bacitracin resistant, neonatal sepsis.\n\nClostridium perfringens: gas gangrene; C. diff: pseudomembranous colitis; C. tetani: tetanospasmin blocks inhibitory neurotransmitters.",
    keyConcepts: [
      "Staph epidermidis: biofilm on prosthetic devices",
      "Enterococcus: VRE vancomycin resistance; ampicillin often still works for E. faecalis",
      "Listeria: gram-positive rod, cold growth, neonatal/meningitis in elderly/immunocompromised — ampicillin",
      "Bacillus anthracis: black eschar, widened mediastinum",
      "Nocardia: weakly acid-fast, sulfonamides treatment",
    ],
    mustKnowFacts: [
      "Listeria meningitis: ampicillin added to empiric regimen in neonates, >50, immunocompromised",
    ],
    pearls: [
      "Foodborne outbreak + bloody diarrhea + HUS in child → E. coli O157:H7 (Gram-negative but classic pairing).",
    ],
    pitfalls: [
      "Using ceftriaxone alone for Listeria — intrinsically resistant",
    ],
  },
  "gram-negative-fungi-parasites": {
    overview: "Enteric rods, Neisseria, anaerobes, fungi, and protozoa.",
    summary:
      "E. coli UTI most common; EHEC O157 → HUS, avoid antibiotics. Pseudomonas: blue-green pigment, opportunistic in CF, burns. Neisseria meningitidis: petechial rash, complement deficiency risk.\n\nCandida: yeast, germ tubes (albicans). Aspergillus: septate hyphae, angioinvasion in neutropenia. Plasmodium: ring forms, periodic fevers; Toxoplasma: HIV brain abscess.",
    keyConcepts: [
      "Klebsiella: alcoholics, currant jelly sputum in pneumonia",
      "Legionella: urinary antigen, hyponatremia, GI symptoms",
      "Giardia: foul-smelling fatty stools, campers — metronidazole",
      "Cryptosporidium: AIDS chronic diarrhea, acid-fast stool stain",
      "Tapeworm neurocysticercosis: seizures in immigrant — albendazole + steroids",
    ],
    mustKnowFacts: [
      "Do not treat E. coli O157 with antibiotics — increases HUS risk",
    ],
    pearls: [
      "Neutropenic fever → cover Pseudomonas with antipseudomonal beta-lactam.",
    ],
    pitfalls: [
      "Missing TB in immigrant with meningitis — always consider alongside bacterial causes",
    ],
  },
  "metabolic-pathways": {
    overview: "Glycolysis, gluconeogenesis, TCA cycle, and fed/fasting states.",
    summary:
      "Glycolysis cytoplasm → pyruvate; anaerobic → lactate. Gluconeogenesis bypasses irreversible glycolysis steps (pyruvate carboxylase, PEPCK, fructose-1,6-bisphosphatase, G6Pase) mainly in liver.\n\nTCA cycle and oxidative phosphorylation in mitochondria — 36 ATP per glucose aerobically. Insulin promotes anabolic pathways; glucagon/cortisol/epinephrine promote catabolism.",
    keyConcepts: [
      "Hexokinase vs glucokinase — glucokinase in liver low affinity high capacity",
      "PFK-1 rate-limiting step of glycolysis — inhibited by ATP, activated by AMP",
      "Pyruvate dehydrogenase deficiency → lactic acidosis, neurologic issues — high-fat diet",
      "Odd-chain fatty acids yield propionyl-CoA → succinyl-CoA (gluconeogenic)",
      "Carnitine shuttle transports long-chain FA into mitochondria for beta-oxidation",
    ],
    mustKnowFacts: [
      "Arsenic inhibits lipoic acid — pyruvate dehydrogenase failure → lactic acidosis",
    ],
    pearls: [
      "Fasting hypoglycemia in child + lactic acidosis → consider GSD or PDH deficiency.",
    ],
    pitfalls: [
      "Confusing glycolysis (cytoplasm) with beta-oxidation (mitochondria) location",
    ],
  },
  "inborn-errors": {
    overview: "Enzyme defects linking substrate accumulation to disease phenotypes.",
    summary:
      "Classic board pairs: phenylketonuria (phenylalanine hydroxylase — musty odor, intellectual disability, diet restriction), galactosemia (galactose-1-P uridyltransferase — jaundice, E. coli sepsis), maple syrup urine disease (branched-chain ketoacid dehydrogenase — sweet urine).\n\nG6PD deficiency: hemolysis after oxidant stress (fava beans, sulfa drugs, infection).",
    keyConcepts: [
      "PKU: low phenylalanine diet prevents intellectual disability",
      "Galactosemia: avoid lactose/galactose — cataracts, liver failure in neonate",
      "MSUD: restrict leucine, isoleucine, valine",
      "Homocystinuria: marfanoid, downward lens dislocation, thrombosis — pyridoxine if B6-responsive",
      "Alkaptonuria: homogentisic acid — ochronosis, dark urine on standing",
    ],
    mustKnowFacts: [
      "Newborn screening detects PKU, galactosemia, hypothyroidism, SCID, and others",
    ],
    pearls: [
      "Neonate jaundice after breastfeeding + E. coli sepsis → galactosemia; stop galactose.",
    ],
    pitfalls: [
      "Missing G6PD on hemolysis workup after sulfa exposure",
    ],
  },
  "lysosomal-storage": {
    overview: "Sphingolipidoses and mucopolysaccharidoses.",
    summary:
      "Tay-Sachs: hexosaminidase A deficiency — cherry-red macula, neurodegeneration, Ashkenazi screening. Gaucher: glucocerebrosidase — hepatosplenomegaly, bone crises, Gaucher cells.\n\nNiemann-Pick: sphingomyelinase. Hurler syndrome (MPS I): coarse facies, corneal clouding, developmental delay.",
    keyConcepts: [
      "Tay-Sachs: no hepatosplenomegaly (vs Niemann-Pick)",
      "Gaucher: most common lysosomal storage disease; enzyme replacement available",
      "Fabry: alpha-galactosidase A — angiokeratomas, renal failure, neuropathic pain",
      "Krabbe: galactocerebrosidase — peripheral neuropathy, developmental regression",
      "I-cell disease: defect in phosphorylation of lysosomal enzymes",
    ],
    mustKnowFacts: [
      "Tay-Sachs carrier screening in Ashkenazi Jewish couples preconception",
    ],
    pearls: [
      "Cherry-red spot + hypotonia + startle in 6-month infant → Tay-Sachs.",
    ],
    pitfalls: [
      "Confusing Tay-Sachs (no organomegaly) with Niemann-Pick (splenomegaly)",
    ],
  },
  "dna-repair-genetics": {
    overview: "Inherited cancer syndromes and trinucleotide repeat disorders.",
    summary:
      "Xeroderma pigmentosum: nucleotide excision repair defect — UV sensitivity, skin cancers. Lynch syndrome: mismatch repair — colorectal and endometrial cancer. BRCA1/2: breast and ovarian cancer.\n\nHuntington: CAG repeats anticipation. Fragile X: CGG repeats — macro-orchidism, intellectual disability.",
    keyConcepts: [
      "Autosomal dominant: one mutated allele sufficient — Huntington, NF1, Marfan",
      "Autosomal recessive: two alleles — CF, sickle cell, PKU",
      "X-linked recessive: males affected — hemophilia, Duchenne, G6PD",
      "Imprinting: Prader-Willi (paternal deletion) vs Angelman (maternal)",
      "Mosaicism and anticipation modify classic Mendelian patterns",
    ],
    mustKnowFacts: [
      "BRCA carriers may consider risk-reducing salpingo-oophorectomy and enhanced breast screening",
    ],
    pearls: [
      "Young woman with breast cancer + family history ovarian cancer → BRCA testing.",
    ],
    pitfalls: [
      "Missing Lynch syndrome in young colon cancer — test tumor MMR proteins",
    ],
  },
  "study-designs": {
    overview: "RCT, cohort, case-control, and cross-sectional strengths/limitations.",
    summary:
      "RCT: gold standard for intervention — randomization minimizes confounding. Cohort: exposure → follow outcome (relative risk). Case-control: outcome → look back for exposure (odds ratio). Cross-sectional: prevalence snapshot.\n\nSystematic review/meta-analysis pools RCTs. Case series lowest evidence for causation.",
    keyConcepts: [
      "Randomization balances known and unknown confounders",
      "Cohort: prospective follows exposed/unexposed forward in time",
      "Case-control: efficient for rare diseases; recall bias risk",
      "Cross-sectional cannot establish temporal relationship for causation",
      "Intention-to-treat analysis preserves randomization intent",
    ],
    mustKnowFacts: [
      "Ecologic fallacy: group-level data does not prove individual-level association",
    ],
    pearls: [
      "Rare outcome + expensive exposure → case-control more feasible than cohort.",
    ],
    pitfalls: [
      "Inferring causation from cross-sectional association alone",
    ],
  },
  "sensitivity-specificity": {
    overview: "Test characteristics, predictive values, and screening math.",
    summary:
      "Sensitivity = TP/(TP+FN) — detects disease. Specificity = TN/(TN+FP). PPV and NPV depend on prevalence — same test has lower PPV when disease is rare.\n\nLikelihood ratios combine sensitivity and specificity for Bayesian updating. ROC curve plots sensitivity vs 1-specificity.",
    keyConcepts: [
      "SnNout: high sensitivity test negative → rules out",
      "SpPin: high specificity test positive → rules in",
      "PPV increases with prevalence",
      "Screening test needs high sensitivity; confirmatory test needs high specificity",
      "LR+ = sensitivity/(1-specificity); LR− = (1-sensitivity)/specificity",
    ],
    mustKnowFacts: [
      "Lowering cutoff increases sensitivity but decreases specificity",
    ],
    pearls: [
      "HIV screening in low-risk population: many false positives despite good test — confirm with Western blot/ RNA.",
    ],
    pitfalls: [
      "Using PPV as if it equals sensitivity",
    ],
  },
};
