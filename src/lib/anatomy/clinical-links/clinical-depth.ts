import type { AnatomyDiseaseLink, AnatomyDrugRationale } from "./types";

/** Dx / treatment / per-drug rationale overlays for high-yield curated disease threads. */
export type ClinicalDepthOverlay = {
  bestDiagnosis: string;
  treatmentRationale: string;
  drugRationales: Record<string, AnatomyDrugRationale>;
};

export const CLINICAL_DEPTH_BY_ID: Record<string, ClinicalDepthOverlay> = {
  "primary-hypothyroidism": {
    bestDiagnosis: "↑ TSH + low free T4; anti-TPO supports Hashimoto thyroiditis.",
    treatmentRationale: "Replace missing thyroid hormone to restore euthyroidism and normalize TSH feedback.",
    drugRationales: {
      "levothyroxine": {
        whyUsed: "Standard T4 replacement that converts peripherally to active T3 and is titrated to TSH.",
        briefMoa: "Synthetic T4; deiodinated to T3 → nuclear thyroid receptor activation.",
      },
      "liothyronine": {
        whyUsed: "Direct T3 when rapid effect or myxedema adjunct is needed — not routine first-line monotherapy.",
        briefMoa: "Synthetic T3 binds thyroid receptors directly (short half-life).",
      },
    },
  },
  "hyperthyroidism-graves": {
    bestDiagnosis: "Suppressed TSH + ↑ free T4/T3; TSH-receptor antibodies confirm Graves.",
    treatmentRationale: "Antithyroid drugs or definitive therapy treat hormone excess; β-blockers only blunt adrenergic symptoms.",
    drugRationales: {
      "propranolol": {
        whyUsed: "Controls tremor, tachycardia, and anxiety from excess thyroid hormone while definitive therapy starts.",
        briefMoa: "Nonselective β-blockade + partial inhibition of T4→T3 conversion.",
      },
    },
  },
  "type-2-diabetes": {
    bestDiagnosis: "A1c ≥6.5%, fasting glucose ≥126 mg/dL, or classic symptoms with random ≥200 mg/dL.",
    treatmentRationale: "Lower glucose and reduce cardiorenal risk — metformin first for most; add GLP-1 RA / SGLT2i when ASCVD, HF, or CKD dominate.",
    drugRationales: {
      "metformin": {
        whyUsed: "First-line glycemic agent with weight neutrality and proven safety when eGFR allows.",
        briefMoa: "AMPK activation → ↓ hepatic gluconeogenesis; ↑ insulin sensitivity.",
      },
      "semaglutide": {
        whyUsed: "Potent A1c and weight lowering plus MACE benefit in high ASCVD risk.",
        briefMoa: "GLP-1 receptor agonist → ↑ glucose-dependent insulin, ↓ glucagon, delayed gastric emptying.",
      },
      "empagliflozin": {
        whyUsed: "Adds HF/CKD/ASCVD outcome benefit beyond glucose lowering.",
        briefMoa: "SGLT2 inhibition → urinary glucose loss, natriuresis, hemodynamic kidney/heart effects.",
      },
      "glipizide": {
        whyUsed: "Inexpensive insulin secretagogue when cost/access limit newer agents — watch hypoglycemia.",
        briefMoa: "Sulfonylurea closes β-cell KATP channels → insulin release.",
      },
    },
  },
  "type-1-diabetes": {
    bestDiagnosis: "Hyperglycemia with absolute insulin deficiency; autoantibodies (GAD/IA-2) support T1DM; DKA common at onset.",
    treatmentRationale: "Lifelong insulin replacement (basal-bolus or pump) because endogenous insulin is absent.",
    drugRationales: {
      "insulin-regular": {
        whyUsed: "Prandial / IV insulin for acute hyperglycemia and DKA protocols.",
        briefMoa: "Binds insulin receptor → GLUT4 translocation and anabolic metabolism.",
      },
      "insulin-glargine": {
        whyUsed: "Long-acting basal coverage to suppress fasting hepatic glucose output.",
        briefMoa: "Basal insulin analog forming subcutaneous depot with near peakless profile.",
      },
    },
  },
  "heart-failure-hfref": {
    bestDiagnosis: "Clinical congestion + reduced EF on echo; BNP/NT-proBNP supports diagnosis.",
    treatmentRationale: "GDMT (ACEi/ARB/ARNI, evidence-based β-blocker, MRA, SGLT2i) cuts mortality; loop diuretics treat volume overload.",
    drugRationales: {
      "lisinopril": {
        whyUsed: "ACEi reduces afterload and remodeling — mortality benefit in HFrEF.",
        briefMoa: "ACE inhibition → ↓ angiotensin II and aldosterone; ↑ bradykinin.",
      },
      "metoprolol": {
        whyUsed: "Evidence-based β-blocker blunts sympathetic drive and improves survival in HFrEF.",
        briefMoa: "Selective β1 blockade → ↓ HR, contractility demand, and arrhythmia risk.",
      },
      "furosemide": {
        whyUsed: "Loop diuretic for congestion/edema — symptom relief, not disease-modifying alone.",
        briefMoa: "Inhibits NKCC2 in thick ascending limb → natriuresis and diuresis.",
      },
      "spironolactone": {
        whyUsed: "MRA reduces mortality and potassium wasting on loops.",
        briefMoa: "Aldosterone receptor antagonist in collecting duct and myocardium.",
      },
      "carvedilol": {
        whyUsed: "Nonselective β/α blocker alternative GDMT agent in HFrEF.",
        briefMoa: "β1/β2 + α1 blockade → ↓ afterload and sympathetic tone.",
      },
    },
  },
  "stemi-acs": {
    bestDiagnosis: "Ischemic symptoms + ST elevation in contiguous leads; rising/falling troponin confirms myocardial injury.",
    treatmentRationale: "Urgent reperfusion plus dual antiplatelet therapy and anticoagulation to open the infarct artery and prevent rethrombosis.",
    drugRationales: {
      "aspirin": {
        whyUsed: "Immediate antiplatelet therapy for all ACS — irreversible COX-1 blockade.",
        briefMoa: "Irreversible COX-1 inhibition → ↓ thromboxane A2 → ↓ platelet aggregation.",
      },
      "clopidogrel": {
        whyUsed: "P2Y12 inhibitor pairs with aspirin as DAPT until PCI/strategy completes.",
        briefMoa: "Prodrug P2Y12 ADP-receptor blockade on platelets.",
      },
      "metoprolol": {
        whyUsed: "Early β-blockade when hemodynamically stable to reduce ischemia and arrhythmia.",
        briefMoa: "β1 blockade ↓ myocardial O₂ demand.",
      },
      "atorvastatin": {
        whyUsed: "High-intensity statin started early for plaque stabilization and secondary prevention.",
        briefMoa: "HMG-CoA reductase inhibition → ↓ LDL and plaque inflammation.",
      },
    },
  },
  "hypertension-essential": {
    bestDiagnosis: "Office BP ≥130/80 on repeated measures (or confirmed ambulatory/home readings).",
    treatmentRationale: "Lower SVR/volume to prevent stroke, MI, HF, and CKD using first-line antihypertensives matched to comorbidities.",
    drugRationales: {
      "amlodipine": {
        whyUsed: "Dihydropyridine CCB — strong SBP lowering, useful in older adults and Black patients.",
        briefMoa: "L-type Ca²⁺ channel block in vascular smooth muscle → vasodilation.",
      },
      "lisinopril": {
        whyUsed: "ACEi preferred with diabetes, CKD, or HFrEF comorbidity.",
        briefMoa: "ACE inhibition → ↓ angiotensin II-mediated vasoconstriction.",
      },
      "hydrochlorothiazide": {
        whyUsed: "Thiazide diuretic reduces volume and softens SBP, often in combination regimens.",
        briefMoa: "Inhibits NCC in distal convoluted tubule → natriuresis.",
      },
    },
  },
  "atrial-fibrillation-stroke": {
    bestDiagnosis: "Irregularly irregular rhythm on ECG; CHA₂DS₂-VASc guides stroke risk and anticoagulation need.",
    treatmentRationale: "Anticoagulate to prevent cardioembolic stroke; rate/rhythm control addressed separately.",
    drugRationales: {
      "apixaban": {
        whyUsed: "DOAC first-line for most nonvalvular AF — fewer ICH than warfarin.",
        briefMoa: "Direct factor Xa inhibition → ↓ thrombin generation.",
      },
      "warfarin": {
        whyUsed: "VKA when DOAC unavailable, mechanical valve, or moderate-severe mitral stenosis.",
        briefMoa: "Vitamin K antagonist → ↓ factors II, VII, IX, X.",
      },
      "aspirin": {
        whyUsed: "Not adequate stroke prevention in AF — reserved if anticoagulation truly contraindicated.",
        briefMoa: "Antiplatelet via COX-1 inhibition (weak AF stroke prevention).",
      },
    },
  },
  "copd-chronic": {
    bestDiagnosis: "Post-bronchodilator FEV1/FVC <0.70 with smoking/exposure history and chronic dyspnea/cough.",
    treatmentRationale: "Bronchodilators relieve obstruction; dual therapy/ICS for exacerbators; smoking cessation is disease-modifying.",
    drugRationales: {
      "albuterol": {
        whyUsed: "Short-acting β2 agonist rescue for acute dyspnea.",
        briefMoa: "β2 agonism → bronchial smooth muscle relaxation.",
      },
      "ipratropium": {
        whyUsed: "SAMA bronchodilator often paired with albuterol in COPD exacerbations.",
        briefMoa: "Muscarinic (M3) antagonism → ↓ bronchoconstriction.",
      },
      "fluticasone-salmeterol": {
        whyUsed: "ICS/LABA for patients with frequent exacerbations or eosinophilic phenotype.",
        briefMoa: "ICS anti-inflammatory + LABA sustained β2 bronchodilation.",
      },
    },
  },
  "community-pneumonia": {
    bestDiagnosis: "Compatible syndrome plus infiltrate on CXR; severity scores guide site of care.",
    treatmentRationale: "Empiric antibiotics covering likely CAP pathogens; escalate for resistance risk or severity.",
    drugRationales: {
      "amoxicillin": {
        whyUsed: "High-dose outpatient coverage for susceptible S. pneumoniae.",
        briefMoa: "β-lactam inhibits peptidoglycan cross-linking.",
      },
      "azithromycin": {
        whyUsed: "Covers atypicals (Mycoplasma, Chlamydia, Legionella) often added to β-lactam.",
        briefMoa: "Macrolide binds 50S → inhibits bacterial protein synthesis.",
      },
      "levofloxacin": {
        whyUsed: "Respiratory FQ monotherapy when comorbidities or resistance risk.",
        briefMoa: "Fluoroquinolone inhibits DNA gyrase/topoisomerase IV.",
      },
    },
  },
  "pulmonary-embolism": {
    bestDiagnosis: "CT pulmonary angiography (or V/Q when CT contraindicated) after risk stratification; D-dimer to rule out low-risk.",
    treatmentRationale: "Immediate anticoagulation prevents clot propagation; thrombolysis only for massive PE with shock.",
    drugRationales: {
      "enoxaparin": {
        whyUsed: "LMWH bridge or initial therapy in hemodynamically stable PE.",
        briefMoa: "Accelerates antithrombin inhibition of factor Xa (and IIa).",
      },
      "heparin-unfractionated": {
        whyUsed: "Preferred when thrombolysis may be needed or severe renal impairment / unstable course.",
        briefMoa: "ATIII potentiation → inhibits Xa and thrombin; short half-life/reversible.",
      },
      "warfarin": {
        whyUsed: "Oral VKA continuation after parenteral bridge when DOAC not used.",
        briefMoa: "Vitamin K antagonism → ↓ clotting factors.",
      },
      "apixaban": {
        whyUsed: "DOAC option for many stable PE patients after initial period per label/guideline.",
        briefMoa: "Direct factor Xa inhibitor.",
      },
    },
  },
  "aki-prerenal": {
    bestDiagnosis: "Rise in creatinine with hypovolemia/low perfusion clues; FeNa <1% / BUN:Cr >20 supports prerenal when not on diuretics.",
    treatmentRationale: "Restore perfusion and stop nephrotoxins; diuretics only if volume overload after perfusion restored — not a fix for prerenal azotemia alone.",
    drugRationales: {
      "furosemide": {
        whyUsed: "Treats fluid overload complicating AKI — does not reverse prerenal injury by itself.",
        briefMoa: "Loop diuretic inhibiting NKCC2.",
      },
    },
  },
  "uti-uncomplicated": {
    bestDiagnosis: "Dysuria/frequency with pyuria (± nitrite); culture if complicated, recurrent, or pyelo suspected.",
    treatmentRationale: "Short-course antibiotics targeting common uropathogens; escalate for pyelonephritis or resistance.",
    drugRationales: {
      "nitrofurantoin": {
        whyUsed: "First-line uncomplicated cystitis when CrCl adequate — concentrates in urine.",
        briefMoa: "Bacterial enzyme-activated nitroreductase damage to DNA/proteins.",
      },
      "levofloxacin": {
        whyUsed: "Alternative/complicated UTI or when nitrofurantoin unsuitable.",
        briefMoa: "Fluoroquinolone DNA gyrase inhibition.",
      },
    },
  },
  "gerd-reflux": {
    bestDiagnosis: "Typical heartburn/regurgitation; PPI trial supports diagnosis; endoscopy for alarm features.",
    treatmentRationale: "Acid suppression heals mucosa and controls symptoms; lifestyle measures reduce reflux triggers.",
    drugRationales: {
      "omeprazole": {
        whyUsed: "PPI first-line acid suppression for GERD/esophagitis.",
        briefMoa: "Irreversible H+/K+-ATPase block in parietal cells.",
      },
      "pantoprazole": {
        whyUsed: "PPI alternative (including IV pathways in acute care).",
        briefMoa: "Proton pump inhibition → ↓ gastric acid.",
      },
    },
  },
  "bph-lut": {
    bestDiagnosis: "LUTS in older man; IPSS quantifies severity; rule out retention/infection/cancer red flags.",
    treatmentRationale: "α1-blockers relax prostatic smooth muscle to improve flow; 5α-reductase inhibitors for larger glands over months.",
    drugRationales: {
      "tamsulosin": {
        whyUsed: "Selective α1A blocker rapidly improves obstructive symptoms.",
        briefMoa: "α1A antagonism → prostate/bladder neck smooth muscle relaxation.",
      },
    },
  },
  "hyperlipidemia-ascvd": {
    bestDiagnosis: "Fasting lipid panel + ASCVD risk estimate or clinical ASCVD establishing secondary prevention.",
    treatmentRationale: "High-intensity statin lowers LDL and event risk; intensity matches risk tier.",
    drugRationales: {
      "atorvastatin": {
        whyUsed: "High-intensity statin cornerstone for ASCVD risk reduction.",
        briefMoa: "HMG-CoA reductase inhibition → ↑ hepatic LDL receptors → ↓ LDL-C.",
      },
    },
  },
  "adrenal-insufficiency": {
    bestDiagnosis: "Low AM cortisol ± failed ACTH stim; high ACTH and hyperpigmentation point to primary (Addison).",
    treatmentRationale: "Lifelong glucocorticoid (± mineralocorticoid) replacement; stress-dose for illness/surgery.",
    drugRationales: {
      "hydrocortisone": {
        whyUsed: "Physiologic glucocorticoid replacement mimicking diurnal cortisol.",
        briefMoa: "Glucocorticoid (± mineralocorticoid) receptor agonist.",
      },
      "prednisone": {
        whyUsed: "Longer-acting oral alternative for stable outpatient replacement.",
        briefMoa: "Synthetic glucocorticoid receptor agonist.",
      },
    },
  },
  "seizure-epilepsy": {
    bestDiagnosis: "Clinical seizure ± EEG support; always exclude reversible metabolic/structural triggers acutely.",
    treatmentRationale: "Benzodiazepines abort status; maintenance ASM prevents recurrence based on syndrome and comorbidities.",
    drugRationales: {
      "lorazepam": {
        whyUsed: "First-line IV benzo to terminate status epilepticus.",
        briefMoa: "GABA-A positive allosteric modulator → neuronal hyperpolarization.",
      },
      "levetiracetam": {
        whyUsed: "Broad-spectrum ASM with few interactions for new-onset seizures/load after status.",
        briefMoa: "Binds SV2A → modulates neurotransmitter release.",
      },
      "phenytoin": {
        whyUsed: "Classic status second-line load when other ASMs unavailable.",
        briefMoa: "Voltage-gated Na⁺ channel blockade prolongs inactivated state.",
      },
      "fosphenytoin": {
        whyUsed: "IV phenytoin prodrug preferred for safer parenteral loading.",
        briefMoa: "Converted to phenytoin → Na⁺ channel blockade.",
      },
    },
  },
  "ischemic-stroke-brain": {
    bestDiagnosis: "Sudden focal deficit + non-contrast CT excluding hemorrhage; vessel imaging for large-vessel occlusion.",
    treatmentRationale: "Time-critical reperfusion (tPA/thrombectomy) when eligible; antiplatelet + statin for secondary prevention after ICH excluded.",
    drugRationales: {
      "aspirin": {
        whyUsed: "Early antiplatelet secondary prevention for noncardioembolic ischemic stroke.",
        briefMoa: "Irreversible COX-1 inhibition → ↓ platelet aggregation.",
      },
      "clopidogrel": {
        whyUsed: "Alternative/additional antiplatelet per secondary prevention strategy.",
        briefMoa: "P2Y12 ADP receptor blockade.",
      },
      "atorvastatin": {
        whyUsed: "High-intensity statin for atherosclerotic secondary prevention.",
        briefMoa: "HMG-CoA reductase inhibition → ↓ LDL and plaque risk.",
      },
    },
  },
  "infective-endocarditis": {
    bestDiagnosis: "Diagnose from clinical pattern of infective endocarditis; confirm with the key study/lab that matches the mechanism: Microbial colonization of endocardium/valves → vegetation, emboli, valve destruction.",
    treatmentRationale: "Treatment aims: Sterilize infection; Prevent embolic complications.",
    drugRationales: {
      "nafcillin": {
        whyUsed: "Anti-staph penicillin for MSSA. Used here for Infective endocarditis.",
        briefMoa: "β-lactamase-stable cell-wall inhibition.",
      },
      "oxacillin": {
        whyUsed: "Anti-staph penicillin for MSSA. Used here for Infective endocarditis.",
        briefMoa: "Cell-wall inhibition (penicillinase-stable).",
      },
      "gentamicin": {
        whyUsed: "Aminoglycoside synergy in selected endocarditis. Used here for Infective endocarditis.",
        briefMoa: "30S misreading → bactericidal effect.",
      },
      "vancomycin": {
        whyUsed: "Gram-positive coverage including MRSA. Used here for Infective endocarditis.",
        briefMoa: "Binds D-Ala-D-Ala → blocks cell-wall synthesis.",
      },
    },
  },
  "pericardial-tamponade": {
    bestDiagnosis: "Diagnose from clinical pattern of cardiac tamponade; confirm with the key study/lab that matches the mechanism: Pericardial fluid ↑ intrapericardial pressure → impaired diastolic filling → shock.",
    treatmentRationale: "Treatment aims: Pericardiocentesis / drain; Hemodynamic support.",
    drugRationales: {
      "furosemide": {
        whyUsed: "Loop diuretic for volume overload. Used here for Cardiac tamponade.",
        briefMoa: "NKCC2 inhibition.",
      },
      "phenylephrine": {
        whyUsed: "Pure α1 vasopressor for selected hypotension. Used here for Cardiac tamponade.",
        briefMoa: "α1 agonism → vasoconstriction.",
      },
    },
  },
  "aortic-dissection": {
    bestDiagnosis: "Diagnose from clinical pattern of aortic dissection; confirm with the key study/lab that matches the mechanism: Intimal tear → blood in media → propagation along aortic wall.",
    treatmentRationale: "Treatment aims: ↓ shear stress; Type A → surgery; Type B → medical unless complicated.",
    drugRationales: {
      "esmolol": {
        whyUsed: "Ultrashort IV β-blocker for aortic syndromes / rate control. Used here for Aortic dissection.",
        briefMoa: "Selective β1 blockade (short t½).",
      },
      "labetalol": {
        whyUsed: "Combined α/β block for hypertensive emergencies / pheo prep adjunct. Used here for Aortic dissection.",
        briefMoa: "α1 + β blockade.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Aortic dissection.",
        briefMoa: "μ-opioid receptor agonism.",
      },
    },
  },
  "aortic-coarctation": {
    bestDiagnosis: "Diagnose from clinical pattern of coarctation of the aorta; confirm with the key study/lab that matches the mechanism: Congenital narrowing near ductus → upper-body HTN, lower-body hypoperfusion.",
    treatmentRationale: "Treatment aims: BP control; Definitive repair (surgical/percutaneous).",
    drugRationales: {
      "amlodipine": {
        whyUsed: "Vasodilating CCB for BP / afterload control. Used here for Coarctation of the aorta.",
        briefMoa: "L-type Ca²⁺ channel block in vessels.",
      },
      "hydralazine": {
        whyUsed: "Arterial vasodilator for selected hypertensive states. Used here for Coarctation of the aorta.",
        briefMoa: "Direct arteriolar smooth muscle relaxation.",
      },
      "clopidogrel": {
        whyUsed: "P2Y12 antiplatelet for arterial disease/ACS. Used here for Coarctation of the aorta.",
        briefMoa: "Irreversible P2Y12 blockade.",
      },
    },
  },
  "aortic-aneurysm": {
    bestDiagnosis: "Diagnose from clinical pattern of abdominal aortic aneurysm; confirm with the key study/lab that matches the mechanism: Degenerative wall weakening → focal dilation with rupture risk.",
    treatmentRationale: "Treatment aims: BP/smoking control; Elective repair when size threshold met.",
    drugRationales: {
      "amlodipine": {
        whyUsed: "Vasodilating CCB for BP / afterload control. Used here for Abdominal aortic aneurysm.",
        briefMoa: "L-type Ca²⁺ channel block in vessels.",
      },
      "atorvastatin": {
        whyUsed: "LDL lowering and plaque stabilization. Used here for Abdominal aortic aneurysm.",
        briefMoa: "HMG-CoA reductase inhibition.",
      },
      "clopidogrel": {
        whyUsed: "P2Y12 antiplatelet for arterial disease/ACS. Used here for Abdominal aortic aneurysm.",
        briefMoa: "Irreversible P2Y12 blockade.",
      },
    },
  },
  "carotid-stenosis": {
    bestDiagnosis: "Diagnose from clinical pattern of carotid stenosis; confirm with the key study/lab that matches the mechanism: Atherosclerotic plaque narrows carotid lumen → embolic stroke risk.",
    treatmentRationale: "Treatment aims: ASCVD risk reduction; Revascularization if symptomatic/high-grade.",
    drugRationales: {
      "atorvastatin": {
        whyUsed: "LDL lowering and plaque stabilization. Used here for Carotid stenosis.",
        briefMoa: "HMG-CoA reductase inhibition.",
      },
      "aspirin": {
        whyUsed: "Antiplatelet for arterial ischemic syndromes. Used here for Carotid stenosis.",
        briefMoa: "Irreversible COX-1 inhibition.",
      },
      "clopidogrel": {
        whyUsed: "P2Y12 antiplatelet for arterial disease/ACS. Used here for Carotid stenosis.",
        briefMoa: "Irreversible P2Y12 blockade.",
      },
    },
  },
  "carotid-dissection": {
    bestDiagnosis: "Diagnose from clinical pattern of carotid artery dissection; confirm with the key study/lab that matches the mechanism: Intimal tear in carotid → stroke from hemodynamic compromise or thrombus.",
    treatmentRationale: "Treatment aims: Prevent thromboembolism; Pain control.",
    drugRationales: {
      "aspirin": {
        whyUsed: "Antiplatelet for arterial ischemic syndromes. Used here for Carotid artery dissection.",
        briefMoa: "Irreversible COX-1 inhibition.",
      },
      "clopidogrel": {
        whyUsed: "P2Y12 antiplatelet for arterial disease/ACS. Used here for Carotid artery dissection.",
        briefMoa: "Irreversible P2Y12 blockade.",
      },
    },
  },
  "pneumothorax": {
    bestDiagnosis: "Diagnose from clinical pattern of pneumothorax; confirm with the key study/lab that matches the mechanism: Air in pleural space → lung collapse, V/Q mismatch.",
    treatmentRationale: "Treatment aims: Needle decompression if tension; Chest tube if large/symptomatic.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Pneumothorax.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Pneumothorax.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
      "ipratropium": {
        whyUsed: "Anticholinergic bronchodilation. Used here for Pneumothorax.",
        briefMoa: "Muscarinic antagonism in airways.",
      },
    },
  },
  "asthma-bronchospasm": {
    bestDiagnosis: "Diagnose from clinical pattern of acute bronchospasm / asthma; confirm with the key study/lab that matches the mechanism: Bronchial smooth muscle constriction + inflammation → airflow obstruction.",
    treatmentRationale: "Treatment aims: Bronchodilation; ↓ inflammation in exacerbation.",
    drugRationales: {
      "albuterol": {
        whyUsed: "Rapid bronchodilation for bronchospasm. Used here for Acute bronchospasm / asthma.",
        briefMoa: "β2 agonist → airway smooth muscle relaxation.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Acute bronchospasm / asthma.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
      "ipratropium": {
        whyUsed: "Anticholinergic bronchodilation. Used here for Acute bronchospasm / asthma.",
        briefMoa: "Muscarinic antagonism in airways.",
      },
    },
  },
  "bacterial-meningitis": {
    bestDiagnosis: "Diagnose from clinical pattern of bacterial meningitis; confirm with the key study/lab that matches the mechanism: Bacterial invasion of meninges → inflammation, ↑ ICP, sepsis.",
    treatmentRationale: "Treatment aims: Empiric antibiotics immediately (IDSA) — vancomycin + ceftriaxone preferred (ceftriaxone not in Top 500; cefuroxime shown as catalog proxy); Adjunct dexamethasone when indicated.",
    drugRationales: {
      "vancomycin": {
        whyUsed: "Gram-positive coverage including MRSA. Used here for Bacterial meningitis.",
        briefMoa: "Binds D-Ala-D-Ala → blocks cell-wall synthesis.",
      },
      "cefuroxime": {
        whyUsed: "2nd-gen cephalosporin for selected CNS/respiratory pathogens. Used here for Bacterial meningitis.",
        briefMoa: "β-lactam cell-wall inhibition.",
      },
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Bacterial meningitis.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "subdural-hematoma": {
    bestDiagnosis: "Diagnose from clinical pattern of subdural hematoma; confirm with the key study/lab that matches the mechanism: Bridging vein rupture → blood between dura and arachnoid.",
    treatmentRationale: "Treatment aims: ICP control; Neurosurgical evacuation if indicated.",
    drugRationales: {
      "mannitol": {
        whyUsed: "Osmotic agent to lower ICP. Used here for Subdural hematoma.",
        briefMoa: "Osmotic diuresis / brain water shift.",
      },
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Subdural hematoma.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "uncal-herniation": {
    bestDiagnosis: "Diagnose from clinical pattern of brain herniation; confirm with the key study/lab that matches the mechanism: ↑ ICP displaces brain tissue → brainstem compression.",
    treatmentRationale: "Treatment aims: ↓ ICP emergently; Neurosurgery.",
    drugRationales: {
      "mannitol": {
        whyUsed: "Osmotic agent to lower ICP. Used here for Brain herniation.",
        briefMoa: "Osmotic diuresis / brain water shift.",
      },
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Brain herniation.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "epidural-hematoma": {
    bestDiagnosis: "Diagnose from clinical pattern of epidural hematoma; confirm with the key study/lab that matches the mechanism: Middle meningeal artery bleed → lentiform hematoma, rapid expansion.",
    treatmentRationale: "Treatment aims: Emergent neurosurgical evacuation.",
    drugRationales: {
      "mannitol": {
        whyUsed: "Osmotic agent to lower ICP. Used here for Epidural hematoma.",
        briefMoa: "Osmotic diuresis / brain water shift.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Epidural hematoma.",
        briefMoa: "μ-opioid receptor agonism.",
      },
    },
  },
  "spinal-epidural-abscess": {
    bestDiagnosis: "Diagnose from clinical pattern of spinal epidural abscess; confirm with the key study/lab that matches the mechanism: Infection in epidural space → cord compression + sepsis.",
    treatmentRationale: "Treatment aims: Antibiotics + surgical decompression.",
    drugRationales: {
      "vancomycin": {
        whyUsed: "Gram-positive coverage including MRSA. Used here for Spinal epidural abscess.",
        briefMoa: "Binds D-Ala-D-Ala → blocks cell-wall synthesis.",
      },
      "piperacillin-tazobactam": {
        whyUsed: "Broad antipseudomonal β-lactam/β-lactamase inhibitor. Used here for Spinal epidural abscess.",
        briefMoa: "Cell-wall inhibition + BLI protection.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Spinal epidural abscess.",
        briefMoa: "μ-opioid receptor agonism.",
      },
    },
  },
  "cord-compression": {
    bestDiagnosis: "Diagnose from clinical pattern of spinal cord compression; confirm with the key study/lab that matches the mechanism: Mass effect on cord (tumor, abscess, disc) → motor/sensory/autonomic loss.",
    treatmentRationale: "Treatment aims: Urgent decompression; Treat underlying cause.",
    drugRationales: {
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Spinal cord compression.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Spinal cord compression.",
        briefMoa: "μ-opioid receptor agonism.",
      },
    },
  },
  "disc-herniation": {
    bestDiagnosis: "Diagnose from clinical pattern of lumbar disc herniation; confirm with the key study/lab that matches the mechanism: Nucleus protrudes → nerve root compression (e.g., L5 → foot drop).",
    treatmentRationale: "Treatment aims: Pain control; Surgery if cauda equina or refractory.",
    drugRationales: {
      "ibuprofen": {
        whyUsed: "NSAID analgesia/anti-inflammatory. Used here for Lumbar disc herniation.",
        briefMoa: "COX inhibition → ↓ prostaglandins.",
      },
      "gabapentin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Lumbar disc herniation.",
        briefMoa: "α2δ Ca channel ligand → ↓ excitatory release.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Lumbar disc herniation.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
      "pregabalin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Lumbar disc herniation.",
        briefMoa: "α2δ Ca channel ligand.",
      },
    },
  },
  "cauda-equina-syndrome": {
    bestDiagnosis: "Diagnose from clinical pattern of cauda equina syndrome; confirm with the key study/lab that matches the mechanism: Compression of lumbosacral nerve roots → saddle anesthesia, retention.",
    treatmentRationale: "Treatment aims: Emergent surgical decompression.",
    drugRationales: {
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Cauda equina syndrome.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
      "furosemide": {
        whyUsed: "Loop diuretic for volume overload. Used here for Cauda equina syndrome.",
        briefMoa: "NKCC2 inhibition.",
      },
      "propranolol": {
        whyUsed: "Nonselective β-blocker for thyrotoxic symptoms / variceal prophylaxis. Used here for Cauda equina syndrome.",
        briefMoa: "β1/β2 blockade (± ↓ T4→T3).",
      },
    },
  },
  "liver-cirrhosis": {
    bestDiagnosis: "Diagnose from clinical pattern of cirrhosis / portal hypertension; confirm with the key study/lab that matches the mechanism: Chronic hepatocyte injury → fibrosis, portal HTN, decompensation.",
    treatmentRationale: "Treatment aims: Treat complications; HCC surveillance.",
    drugRationales: {
      "lactulose": {
        whyUsed: "Treats hepatic encephalopathy by trapping NH3 as NH4+. Used here for Cirrhosis / portal hypertension.",
        briefMoa: "Osmotic cathartic + colonic acidification.",
      },
      "spironolactone": {
        whyUsed: "MRA for HF, ascites, hyperaldo. Used here for Cirrhosis / portal hypertension.",
        briefMoa: "Aldosterone receptor antagonism.",
      },
      "furosemide": {
        whyUsed: "Loop diuretic for volume overload. Used here for Cirrhosis / portal hypertension.",
        briefMoa: "NKCC2 inhibition.",
      },
      "propranolol": {
        whyUsed: "Nonselective β-blocker for thyrotoxic symptoms / variceal prophylaxis. Used here for Cirrhosis / portal hypertension.",
        briefMoa: "β1/β2 blockade (± ↓ T4→T3).",
      },
    },
  },
  "acute-cholecystitis": {
    bestDiagnosis: "Diagnose from clinical pattern of acute cholecystitis; confirm with the key study/lab that matches the mechanism: Cystic duct obstruction → inflammation/infection of gallbladder.",
    treatmentRationale: "Treatment aims: Antibiotics + cholecystectomy.",
    drugRationales: {
      "piperacillin-tazobactam": {
        whyUsed: "Broad antipseudomonal β-lactam/β-lactamase inhibitor. Used here for Acute cholecystitis.",
        briefMoa: "Cell-wall inhibition + BLI protection.",
      },
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Acute cholecystitis.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
      "metronidazole": {
        whyUsed: "Anaerobe / protozoal coverage. Used here for Acute cholecystitis.",
        briefMoa: "Nitroimidazole DNA damage under anaerobiosis.",
      },
    },
  },
  "choledocholithiasis": {
    bestDiagnosis: "Diagnose from clinical pattern of choledocholithiasis / cholangitis; confirm with the key study/lab that matches the mechanism: CBD stone → biliary obstruction ± ascending infection.",
    treatmentRationale: "Treatment aims: ERCP for stone removal; Antibiotics if cholangitis.",
    drugRationales: {
      "piperacillin-tazobactam": {
        whyUsed: "Broad antipseudomonal β-lactam/β-lactamase inhibitor. Used here for Choledocholithiasis / cholangitis.",
        briefMoa: "Cell-wall inhibition + BLI protection.",
      },
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Choledocholithiasis / cholangitis.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
    },
  },
  "acute-pancreatitis": {
    bestDiagnosis: "Diagnose from clinical pattern of acute pancreatitis; confirm with the key study/lab that matches the mechanism: Premature enzyme activation → autodigestion, inflammation, third-spacing.",
    treatmentRationale: "Treatment aims: Aggressive IV fluids; Treat gallstone/ETOH cause.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Acute pancreatitis.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "ondansetron": {
        whyUsed: "5-HT3 antiemetic. Used here for Acute pancreatitis.",
        briefMoa: "5-HT3 receptor antagonism.",
      },
    },
  },
  "peptic-ulcer-disease": {
    bestDiagnosis: "Diagnose from clinical pattern of peptic ulcer disease; confirm with the key study/lab that matches the mechanism: H. pylori and/or NSAIDs → mucosal break in stomach/duodenum.",
    treatmentRationale: "Treatment aims: H. pylori eradication if positive; PPI therapy.",
    drugRationales: {
      "omeprazole": {
        whyUsed: "PPI acid suppression. Used here for Peptic ulcer disease.",
        briefMoa: "Irreversible H+/K+-ATPase block.",
      },
      "amoxicillin": {
        whyUsed: "β-lactam antibiotic for susceptible organisms. Used here for Peptic ulcer disease.",
        briefMoa: "Inhibits cell-wall cross-linking.",
      },
      "metronidazole": {
        whyUsed: "Anaerobe / protozoal coverage. Used here for Peptic ulcer disease.",
        briefMoa: "Nitroimidazole DNA damage under anaerobiosis.",
      },
      "sucralfate": {
        whyUsed: "Mucosal protectant for ulcer healing adjunct. Used here for Peptic ulcer disease.",
        briefMoa: "Forms protective paste over ulcer beds.",
      },
    },
  },
  "acute-appendicitis": {
    bestDiagnosis: "Diagnose from clinical pattern of acute appendicitis; confirm with the key study/lab that matches the mechanism: Luminal obstruction → inflammation, perforation risk.",
    treatmentRationale: "Treatment aims: Appendectomy; Antibiotics if perforation.",
    drugRationales: {
      "piperacillin-tazobactam": {
        whyUsed: "Broad antipseudomonal β-lactam/β-lactamase inhibitor. Used here for Acute appendicitis.",
        briefMoa: "Cell-wall inhibition + BLI protection.",
      },
      "metronidazole": {
        whyUsed: "Anaerobe / protozoal coverage. Used here for Acute appendicitis.",
        briefMoa: "Nitroimidazole DNA damage under anaerobiosis.",
      },
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Acute appendicitis.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
    },
  },
  "esophageal-varices": {
    bestDiagnosis: "Diagnose from clinical pattern of esophageal varices bleed; confirm with the key study/lab that matches the mechanism: Portal HTN → dilated submucosal veins at GE junction.",
    treatmentRationale: "Treatment aims: Hemostasis (banding); Non-selective β-blocker for prophylaxis.",
    drugRationales: {
      "octreotide": {
        whyUsed: "Somatostatin analog for variceal bleed / secretory diarrhea. Used here for Esophageal varices bleed.",
        briefMoa: "Inhibits splanchnic vasodilators / hormone release.",
      },
      "propranolol": {
        whyUsed: "Nonselective β-blocker for thyrotoxic symptoms / variceal prophylaxis. Used here for Esophageal varices bleed.",
        briefMoa: "β1/β2 blockade (± ↓ T4→T3).",
      },
      "pantoprazole": {
        whyUsed: "PPI acid suppression. Used here for Esophageal varices bleed.",
        briefMoa: "Proton pump inhibition.",
      },
    },
  },
  "crohn-disease": {
    bestDiagnosis: "Diagnose from clinical pattern of crohn disease; confirm with the key study/lab that matches the mechanism: Transmural granulomatous inflammation — any GI segment, skip lesions.",
    treatmentRationale: "Treatment aims: Induce/maintain remission; Nutrition support.",
    drugRationales: {
      "mesalamine": {
        whyUsed: "5-ASA for mild-moderate UC (and selected Crohn colon). Used here for Crohn disease.",
        briefMoa: "Local anti-inflammatory in gut mucosa.",
      },
      "infliximab": {
        whyUsed: "Anti-TNF for IBD/autoimmune inflammation. Used here for Crohn disease.",
        briefMoa: "Monoclonal TNF-α neutralization.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Crohn disease.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "ulcerative-colitis": {
    bestDiagnosis: "Diagnose from clinical pattern of ulcerative colitis; confirm with the key study/lab that matches the mechanism: Continuous mucosal inflammation from rectum proximally.",
    treatmentRationale: "Treatment aims: Induce remission; Colon cancer surveillance.",
    drugRationales: {
      "mesalamine": {
        whyUsed: "5-ASA for mild-moderate UC (and selected Crohn colon). Used here for Ulcerative colitis.",
        briefMoa: "Local anti-inflammatory in gut mucosa.",
      },
      "infliximab": {
        whyUsed: "Anti-TNF for IBD/autoimmune inflammation. Used here for Ulcerative colitis.",
        briefMoa: "Monoclonal TNF-α neutralization.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Ulcerative colitis.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "diverticulitis": {
    bestDiagnosis: "Diagnose from clinical pattern of acute diverticulitis; confirm with the key study/lab that matches the mechanism: Microperforation of diverticulum → localized infection (often sigmoid).",
    treatmentRationale: "Treatment aims: Antibiotics (uncomplicated); Drain/surgery if complicated.",
    drugRationales: {
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Acute diverticulitis.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
      "metronidazole": {
        whyUsed: "Anaerobe / protozoal coverage. Used here for Acute diverticulitis.",
        briefMoa: "Nitroimidazole DNA damage under anaerobiosis.",
      },
      "sulfamethoxazole-trimethoprim": {
        whyUsed: "Folate-pathway antibiotic for UTI/PCP/selected GI. Used here for Acute diverticulitis.",
        briefMoa: "Sequential folate synthesis blockade.",
      },
    },
  },
  "nephrolithiasis": {
    bestDiagnosis: "Diagnose from clinical pattern of nephrolithiasis; confirm with the key study/lab that matches the mechanism: Crystal aggregation in urinary tract → colic, obstruction.",
    treatmentRationale: "Treatment aims: Pain control; Facilitate passage / urology if obstructing.",
    drugRationales: {
      "ibuprofen": {
        whyUsed: "NSAID analgesia/anti-inflammatory. Used here for Nephrolithiasis.",
        briefMoa: "COX inhibition → ↓ prostaglandins.",
      },
      "tamsulosin": {
        whyUsed: "α1A blocker for BPH/stone passage adjunct. Used here for Nephrolithiasis.",
        briefMoa: "Prostate smooth muscle relaxation.",
      },
      "acetazolamide": {
        whyUsed: "Carbonic anhydrase inhibitor — used for altitude/IIH or selected stone metabolic goals. Used here for Nephrolithiasis.",
        briefMoa: "Inhibits CA → bicarbonaturia and diuresis.",
      },
      "allopurinol": {
        whyUsed: "Xanthine oxidase inhibitor to lower uric acid / prevent stones. Used here for Nephrolithiasis.",
        briefMoa: "Blocks xanthine oxidase → ↓ uric acid.",
      },
    },
  },
  "acute-urinary-retention": {
    bestDiagnosis: "Diagnose from clinical pattern of acute urinary retention; confirm with the key study/lab that matches the mechanism: Outlet obstruction or detrusor failure → painful bladder distension.",
    treatmentRationale: "Treatment aims: Catheter decompression; Treat underlying cause.",
    drugRationales: {
      "tamsulosin": {
        whyUsed: "α1A blocker for BPH/stone passage adjunct. Used here for Acute urinary retention.",
        briefMoa: "Prostate smooth muscle relaxation.",
      },
      "bethanechol": {
        whyUsed: "Cholinergic agonist for selected urinary retention. Used here for Acute urinary retention.",
        briefMoa: "Muscarinic agonist → detrusor contraction.",
      },
    },
  },
  "acute-bacterial-prostatitis": {
    bestDiagnosis: "Diagnose from clinical pattern of acute bacterial prostatitis; confirm with the key study/lab that matches the mechanism: Bacterial infection of prostate → fever, dysuria, tender prostate.",
    treatmentRationale: "Treatment aims: Prolonged antibiotic course; Avoid vigorous DRE if septic.",
    drugRationales: {
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Acute bacterial prostatitis.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
      "sulfamethoxazole-trimethoprim": {
        whyUsed: "Folate-pathway antibiotic for UTI/PCP/selected GI. Used here for Acute bacterial prostatitis.",
        briefMoa: "Sequential folate synthesis blockade.",
      },
    },
  },
  "thyroid-cancer-suppression": {
    bestDiagnosis: "Diagnose from clinical pattern of differentiated thyroid cancer; confirm with the key study/lab that matches the mechanism: Thyroid malignancy — papillary/follicular most common; TSH suppression therapy post-thyroidectomy.",
    treatmentRationale: "Treatment aims: Surgical resection; TSH suppression; RAI if indicated.",
    drugRationales: {
      "levothyroxine": {
        whyUsed: "T4 replacement / TSH suppression in thyroid cancer. Used here for Differentiated thyroid cancer.",
        briefMoa: "Synthetic T4 → peripheral T3.",
      },
      "metformin": {
        whyUsed: "First-line T2DM agent. Used here for Differentiated thyroid cancer.",
        briefMoa: "↓ Hepatic gluconeogenesis via AMPK.",
      },
      "amlodipine": {
        whyUsed: "Vasodilating CCB for BP / afterload control. Used here for Differentiated thyroid cancer.",
        briefMoa: "L-type Ca²⁺ channel block in vessels.",
      },
    },
  },
  "cushing-syndrome": {
    bestDiagnosis: "Diagnose from clinical pattern of cushing syndrome; confirm with the key study/lab that matches the mechanism: Chronic glucocorticoid excess → central obesity, hyperglycemia, HTN.",
    treatmentRationale: "Treatment aims: Treat underlying source; Glucose/BP management.",
    drugRationales: {
      "ketoconazole": {
        whyUsed: "Off-label cortisol synthesis block in Cushing when used. Used here for Cushing syndrome.",
        briefMoa: "Inhibits adrenal steroidogenesis enzymes.",
      },
      "metformin": {
        whyUsed: "First-line T2DM agent. Used here for Cushing syndrome.",
        briefMoa: "↓ Hepatic gluconeogenesis via AMPK.",
      },
      "amlodipine": {
        whyUsed: "Vasodilating CCB for BP / afterload control. Used here for Cushing syndrome.",
        briefMoa: "L-type Ca²⁺ channel block in vessels.",
      },
    },
  },
  "pheochromocytoma": {
    bestDiagnosis: "Diagnose from clinical pattern of pheochromocytoma; confirm with the key study/lab that matches the mechanism: Catecholamine-secreting tumor → episodic HTN, tachycardia, sweating.",
    treatmentRationale: "Treatment aims: α-blockade before β-blockade; Surgical resection.",
    drugRationales: {
      "labetalol": {
        whyUsed: "Combined α/β block for hypertensive emergencies / pheo prep adjunct. Used here for Pheochromocytoma.",
        briefMoa: "α1 + β blockade.",
      },
      "doxazosin": {
        whyUsed: "α1 blockade for BP or pheochromocytoma prep (phenoxybenzamine preferred historically). Used here for Pheochromocytoma.",
        briefMoa: "α1 antagonist → vasodilation.",
      },
    },
  },
  "primary-hyperaldosteronism": {
    bestDiagnosis: "Diagnose from clinical pattern of primary hyperaldosteronism (conn); confirm with the key study/lab that matches the mechanism: Autonomous aldosterone → HTN, hypokalemia, metabolic alkalosis.",
    treatmentRationale: "Treatment aims: Confirm lateralization; Surgery or MRA therapy.",
    drugRationales: {
      "spironolactone": {
        whyUsed: "MRA for HF, ascites, hyperaldo. Used here for Primary hyperaldosteronism (Conn).",
        briefMoa: "Aldosterone receptor antagonism.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Primary hyperaldosteronism (Conn).",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Primary hyperaldosteronism (Conn).",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
    },
  },
  "hip-fracture-pain": {
    bestDiagnosis: "Diagnose from clinical pattern of hip fracture; confirm with the key study/lab that matches the mechanism: Femoral neck/intertrochanteric fracture — AVN risk at neck.",
    treatmentRationale: "Treatment aims: Analgesia; Early orthopedic fixation; DVT prophylaxis.",
    drugRationales: {
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Hip fracture.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Hip fracture.",
        briefMoa: "μ-opioid receptor agonism.",
      },
    },
  },
  "open-fracture-infection": {
    bestDiagnosis: "Diagnose from clinical pattern of open fracture / infection prophylaxis; confirm with the key study/lab that matches the mechanism: Open fracture exposes bone to contamination — osteomyelitis risk.",
    treatmentRationale: "Treatment aims: Urgent debridement; Antibiotics + stabilization.",
    drugRationales: {
      "nafcillin": {
        whyUsed: "Anti-staph penicillin for MSSA. Used here for Open fracture / infection prophylaxis.",
        briefMoa: "β-lactamase-stable cell-wall inhibition.",
      },
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Open fracture / infection prophylaxis.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Open fracture / infection prophylaxis.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Open fracture / infection prophylaxis.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
    },
  },
  "splenic-rupture": {
    bestDiagnosis: "Diagnose from clinical pattern of splenic rupture; confirm with the key study/lab that matches the mechanism: Capsular tear → intraperitoneal hemorrhage; Kehr referred shoulder pain.",
    treatmentRationale: "Treatment aims: Hemodynamic resuscitation; Splenectomy or embolization.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Splenic rupture.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Splenic rupture.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
    },
  },
  "hiatal-hernia-gerd": {
    bestDiagnosis: "Diagnose from clinical pattern of hiatal hernia; confirm with the key study/lab that matches the mechanism: Stomach herniates through esophageal hiatus → reflux symptoms.",
    treatmentRationale: "Treatment aims: Acid suppression; Lifestyle modification.",
    drugRationales: {
      "omeprazole": {
        whyUsed: "PPI acid suppression. Used here for Hiatal hernia.",
        briefMoa: "Irreversible H+/K+-ATPase block.",
      },
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Hiatal hernia.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
    },
  },
  "appendiceal-perforation": {
    bestDiagnosis: "Diagnose from clinical pattern of appendiceal perforation; confirm with the key study/lab that matches the mechanism: Appendiceal wall necrosis → intraperitoneal contamination and peritonitis.",
    treatmentRationale: "Treatment aims: Source control + antibiotics; Resuscitation.",
    drugRationales: {
      "piperacillin-tazobactam": {
        whyUsed: "Broad antipseudomonal β-lactam/β-lactamase inhibitor. Used here for Appendiceal perforation.",
        briefMoa: "Cell-wall inhibition + BLI protection.",
      },
      "metronidazole": {
        whyUsed: "Anaerobe / protozoal coverage. Used here for Appendiceal perforation.",
        briefMoa: "Nitroimidazole DNA damage under anaerobiosis.",
      },
      "ciprofloxacin": {
        whyUsed: "Fluoroquinolone for gram-negatives / selected GU-GI. Used here for Appendiceal perforation.",
        briefMoa: "DNA gyrase/topoisomerase inhibition.",
      },
    },
  },
  "intra-abdominal-abscess": {
    bestDiagnosis: "Diagnose from clinical pattern of intra-abdominal abscess; confirm with the key study/lab that matches the mechanism: Localized infection with walled-off pus after perforation or post-op complication.",
    treatmentRationale: "Treatment aims: Drainage + antibiotics; Source control.",
    drugRationales: {
      "piperacillin-tazobactam": {
        whyUsed: "Broad antipseudomonal β-lactam/β-lactamase inhibitor. Used here for Intra-abdominal abscess.",
        briefMoa: "Cell-wall inhibition + BLI protection.",
      },
      "metronidazole": {
        whyUsed: "Anaerobe / protozoal coverage. Used here for Intra-abdominal abscess.",
        briefMoa: "Nitroimidazole DNA damage under anaerobiosis.",
      },
    },
  },
  "sigmoid-volvulus": {
    bestDiagnosis: "Diagnose from clinical pattern of sigmoid volvulus; confirm with the key study/lab that matches the mechanism: Twisted bowel loop → obstruction and ischemia risk.",
    treatmentRationale: "Treatment aims: Decompression (sigmoidoscopy); Surgical fixation if recurrent.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Sigmoid volvulus.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "ondansetron": {
        whyUsed: "5-HT3 antiemetic. Used here for Sigmoid volvulus.",
        briefMoa: "5-HT3 receptor antagonism.",
      },
    },
  },
  "diaphragmatic-rupture": {
    bestDiagnosis: "Diagnose from clinical pattern of diaphragmatic rupture; confirm with the key study/lab that matches the mechanism: Traumatic diaphragm tear → herniation of abdominal viscera into thorax.",
    treatmentRationale: "Treatment aims: Surgical repair; Respiratory support.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Diaphragmatic rupture.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "furosemide": {
        whyUsed: "Loop diuretic for volume overload. Used here for Diaphragmatic rupture.",
        briefMoa: "NKCC2 inhibition.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Diaphragmatic rupture.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "small-bowel-obstruction": {
    bestDiagnosis: "Diagnose from clinical pattern of small bowel obstruction; confirm with the key study/lab that matches the mechanism: Mechanical or functional block → fluid sequestration, emesis, ischemia risk.",
    treatmentRationale: "Treatment aims: NG decompression; Surgery if strangulation/perforation.",
    drugRationales: {
      "ondansetron": {
        whyUsed: "5-HT3 antiemetic. Used here for Small bowel obstruction.",
        briefMoa: "5-HT3 receptor antagonism.",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Small bowel obstruction.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "metoclopramide": {
        whyUsed: "Prokinetic / antiemetic. Used here for Small bowel obstruction.",
        briefMoa: "D2 antagonism + 5-HT4 agonism.",
      },
    },
  },
  "achalasia": {
    bestDiagnosis: "Diagnose from clinical pattern of achalasia; confirm with the key study/lab that matches the mechanism: LES fails to relax + aperistalsis → progressive dysphagia.",
    treatmentRationale: "Treatment aims: LES relaxation; Definitive: pneumatic dilation / myotomy.",
    drugRationales: {
      "nifedipine": {
        whyUsed: "Dihydropyridine CCB. Used here for Achalasia.",
        briefMoa: "Vascular L-type Ca²⁺ blockade.",
      },
      "metoclopramide": {
        whyUsed: "Prokinetic / antiemetic. Used here for Achalasia.",
        briefMoa: "D2 antagonism + 5-HT4 agonism.",
      },
    },
  },
  "mallory-weiss-tear": {
    bestDiagnosis: "Diagnose from clinical pattern of mallory-weiss tear; confirm with the key study/lab that matches the mechanism: Mucosal tear at GE junction after forceful retching → upper GI bleed.",
    treatmentRationale: "Treatment aims: Hemostasis if ongoing; Acid suppression.",
    drugRationales: {
      "pantoprazole": {
        whyUsed: "PPI acid suppression. Used here for Mallory-Weiss tear.",
        briefMoa: "Proton pump inhibition.",
      },
      "ondansetron": {
        whyUsed: "5-HT3 antiemetic. Used here for Mallory-Weiss tear.",
        briefMoa: "5-HT3 receptor antagonism.",
      },
    },
  },
  "femoral-avn": {
    bestDiagnosis: "Diagnose from clinical pattern of avascular necrosis of femoral head; confirm with the key study/lab that matches the mechanism: Interrupted femoral head blood supply → subchondral collapse.",
    treatmentRationale: "Treatment aims: Pain control; Core decompression / arthroplasty.",
    drugRationales: {
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Avascular necrosis of femoral head.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
      "ibuprofen": {
        whyUsed: "NSAID analgesia/anti-inflammatory. Used here for Avascular necrosis of femoral head.",
        briefMoa: "COX inhibition → ↓ prostaglandins.",
      },
      "alendronate": {
        whyUsed: "Bisphosphonate to reduce fracture risk in osteoporosis. Used here for Avascular necrosis of femoral head.",
        briefMoa: "Inhibits osteoclast farnesyl pyrophosphate synthase.",
      },
    },
  },
  "scfe": {
    bestDiagnosis: "Diagnose from clinical pattern of slipped capital femoral epiphysis; confirm with the key study/lab that matches the mechanism: Femoral head slips on physis — adolescent orthopedic emergency.",
    treatmentRationale: "Treatment aims: Non-weight-bearing; Urgent pinning.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Slipped capital femoral epiphysis.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Slipped capital femoral epiphysis.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
    },
  },
  "cholelithiasis": {
    bestDiagnosis: "Diagnose from clinical pattern of cholelithiasis; confirm with the key study/lab that matches the mechanism: Gallstones in gallbladder → biliary colic when cystic duct obstructed.",
    treatmentRationale: "Treatment aims: Analgesia during colic; Elective cholecystectomy for recurrent symptoms.",
    drugRationales: {
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Cholelithiasis.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Cholelithiasis.",
        briefMoa: "μ-opioid receptor agonism.",
      },
    },
  },
  "radial-nerve-palsy": {
    bestDiagnosis: "Diagnose from clinical pattern of radial nerve palsy; confirm with the key study/lab that matches the mechanism: Radial nerve injury (often mid-shaft humerus fracture) → wrist drop.",
    treatmentRationale: "Treatment aims: Neuropathic pain control; Splinting + nerve recovery monitoring.",
    drugRationales: {
      "gabapentin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Radial nerve palsy.",
        briefMoa: "α2δ Ca channel ligand → ↓ excitatory release.",
      },
      "pregabalin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Radial nerve palsy.",
        briefMoa: "α2δ Ca channel ligand.",
      },
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Radial nerve palsy.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
    },
  },
  "viral-hepatitis": {
    bestDiagnosis: "Diagnose from clinical pattern of viral hepatitis; confirm with the key study/lab that matches the mechanism: Hepatocyte inflammation from viral or autoimmune injury → transaminitis.",
    treatmentRationale: "Treatment aims: Treat specific etiology (HBV/HCV/autoimmune); Avoid hepatotoxins.",
    drugRationales: {
      "tenofovir-disoproxil": {
        whyUsed: "NRTI for HBV/HIV. Used here for Viral hepatitis.",
        briefMoa: "Nucleotide reverse transcriptase inhibition.",
      },
      "elbasvir": {
        whyUsed: "Direct-acting antiviral component for HCV. Used here for Viral hepatitis.",
        briefMoa: "NS5A inhibitor (with grazoprevir regimens).",
      },
      "azathioprine": {
        whyUsed: "Immunosuppression for autoimmune/IBD steroid-sparing. Used here for Viral hepatitis.",
        briefMoa: "Purine antimetabolite → ↓ lymphocyte proliferation.",
      },
    },
  },
  "hepatocellular-carcinoma": {
    bestDiagnosis: "Diagnose from clinical pattern of hepatocellular carcinoma; confirm with the key study/lab that matches the mechanism: Primary liver malignancy, often on cirrhotic background.",
    treatmentRationale: "Treatment aims: Staging and transplant candidacy; Systemic therapy if advanced.",
    drugRationales: {
      "cisplatin": {
        whyUsed: "Cytotoxic chemotherapy for solid tumors. Used here for Hepatocellular carcinoma.",
        briefMoa: "DNA cross-linking → apoptosis.",
      },
      "fluorouracil": {
        whyUsed: "Antimetabolite chemotherapy. Used here for Hepatocellular carcinoma.",
        briefMoa: "Thymidylate synthase inhibition.",
      },
    },
  },
  "budd-chiari": {
    bestDiagnosis: "Diagnose from clinical pattern of budd-chiari syndrome; confirm with the key study/lab that matches the mechanism: Hepatic vein outflow obstruction → congestive hepatopathy.",
    treatmentRationale: "Treatment aims: Anticoagulation; Revascularization / transplant if fulminant.",
    drugRationales: {
      "warfarin": {
        whyUsed: "VKA anticoagulation. Used here for Budd-Chiari syndrome.",
        briefMoa: "Vitamin K epoxide reductase inhibition.",
      },
      "furosemide": {
        whyUsed: "Loop diuretic for volume overload. Used here for Budd-Chiari syndrome.",
        briefMoa: "NKCC2 inhibition.",
      },
      "spironolactone": {
        whyUsed: "MRA for HF, ascites, hyperaldo. Used here for Budd-Chiari syndrome.",
        briefMoa: "Aldosterone receptor antagonism.",
      },
    },
  },
  "insulinoma": {
    bestDiagnosis: "Diagnose from clinical pattern of insulinoma; confirm with the key study/lab that matches the mechanism: β-cell tumor secretes insulin → recurrent hypoglycemia.",
    treatmentRationale: "Treatment aims: Prevent hypoglycemia; Surgical resection.",
    drugRationales: {
      "octreotide": {
        whyUsed: "Somatostatin analog for variceal bleed / secretory diarrhea. Used here for Insulinoma.",
        briefMoa: "Inhibits splanchnic vasodilators / hormone release.",
      },
      "glucagon": {
        whyUsed: "Rescue hypoglycemia / selected GI motility contexts. Used here for Insulinoma.",
        briefMoa: "Raises glucose via hepatic glycogenolysis.",
      },
    },
  },
  "skull-fracture": {
    bestDiagnosis: "Diagnose from clinical pattern of skull fracture; confirm with the key study/lab that matches the mechanism: Calvarial fracture — base fractures risk CSF leak and neurovascular injury.",
    treatmentRationale: "Treatment aims: Neuro monitoring; Treat intracranial complications.",
    drugRationales: {
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Skull fracture.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Skull fracture.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Skull fracture.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "transverse-myelitis": {
    bestDiagnosis: "Diagnose from clinical pattern of transverse myelitis; confirm with the key study/lab that matches the mechanism: Inflammatory spinal cord lesion → bilateral motor/sensory/autonomic deficit.",
    treatmentRationale: "Treatment aims: High-dose steroids; Rule out compressive etiology.",
    drugRationales: {
      "methylprednisolone": {
        whyUsed: "IV glucocorticoid pulse for inflammation/edema. Used here for Transverse myelitis.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Transverse myelitis.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "hypersplenism": {
    bestDiagnosis: "Diagnose from clinical pattern of hypersplenism; confirm with the key study/lab that matches the mechanism: Splenic sequestration → cytopenias (anemia, thrombocytopenia, leukopenia).",
    treatmentRationale: "Treatment aims: Treat underlying cause; Splenectomy if severe cytopenias.",
    drugRationales: {
      "folic-acid": {
        whyUsed: "Replete folate stores / support MTX rescue contexts. Used here for Hypersplenism.",
        briefMoa: "Essential cofactor for one-carbon metabolism.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Hypersplenism.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "splenic-infarct": {
    bestDiagnosis: "Diagnose from clinical pattern of splenic infarction; confirm with the key study/lab that matches the mechanism: Splenic artery occlusion → wedge-shaped infarct, LUQ pain.",
    treatmentRationale: "Treatment aims: Anticoagulation if embolic; Analgesia.",
    drugRationales: {
      "apixaban": {
        whyUsed: "Oral anticoagulation via factor Xa inhibition. Used here for Splenic infarction.",
        briefMoa: "Direct factor Xa inhibitor.",
      },
      "warfarin": {
        whyUsed: "VKA anticoagulation. Used here for Splenic infarction.",
        briefMoa: "Vitamin K epoxide reductase inhibition.",
      },
    },
  },
  "sternal-io-access": {
    bestDiagnosis: "Diagnose from clinical pattern of intraosseous access (sternal); confirm with the key study/lab that matches the mechanism: Emergency vascular access via sternal marrow when peripheral/central access fails.",
    treatmentRationale: "Treatment aims: Rapid access for resuscitation drugs; Transition to definitive access.",
    drugRationales: {
      "lidocaine": {
        whyUsed: "Local anesthetic / class Ib antiarrhythmic. Used here for Intraosseous access (sternal).",
        briefMoa: "Voltage-gated Na⁺ channel block.",
      },
      "ketamine": {
        whyUsed: "Dissociative anesthetic / analgesia in selected trauma. Used here for Intraosseous access (sternal).",
        briefMoa: "NMDA receptor antagonism.",
      },
    },
  },
  "pyloric-stenosis": {
    bestDiagnosis: "Diagnose from clinical pattern of pyloric stenosis; confirm with the key study/lab that matches the mechanism: Hypertrophied pylorus in infant → gastric outlet obstruction.",
    treatmentRationale: "Treatment aims: Correct dehydration/electrolytes; Pyloromyotomy.",
    drugRationales: {
      "ondansetron": {
        whyUsed: "5-HT3 antiemetic. Used here for Pyloric stenosis.",
        briefMoa: "5-HT3 receptor antagonism.",
      },
      "metoclopramide": {
        whyUsed: "Prokinetic / antiemetic. Used here for Pyloric stenosis.",
        briefMoa: "D2 antagonism + 5-HT4 agonism.",
      },
    },
  },
  "tracheomalacia": {
    bestDiagnosis: "Diagnose from clinical pattern of tracheomalacia; confirm with the key study/lab that matches the mechanism: Tracheal cartilage weakness → dynamic airway collapse on expiration.",
    treatmentRationale: "Treatment aims: Airway support; Surgical stenting if severe.",
    drugRationales: {
      "albuterol": {
        whyUsed: "Rapid bronchodilation for bronchospasm. Used here for Tracheomalacia.",
        briefMoa: "β2 agonist → airway smooth muscle relaxation.",
      },
      "dexamethasone": {
        whyUsed: "Potent glucocorticoid for edema/inflammation/antiemesis. Used here for Tracheomalacia.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "spinal-stenosis": {
    bestDiagnosis: "Diagnose from clinical pattern of lumbar spinal stenosis; confirm with the key study/lab that matches the mechanism: Canal narrowing → neurogenic claudication (leg pain with walking, relieved by flexion).",
    treatmentRationale: "Treatment aims: Neuropathic pain control; Decompression if progressive deficit.",
    drugRationales: {
      "gabapentin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Lumbar spinal stenosis.",
        briefMoa: "α2δ Ca channel ligand → ↓ excitatory release.",
      },
      "pregabalin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Lumbar spinal stenosis.",
        briefMoa: "α2δ Ca channel ligand.",
      },
      "ibuprofen": {
        whyUsed: "NSAID analgesia/anti-inflammatory. Used here for Lumbar spinal stenosis.",
        briefMoa: "COX inhibition → ↓ prostaglandins.",
      },
    },
  },
  "compression-fracture": {
    bestDiagnosis: "Diagnose from clinical pattern of vertebral compression fracture; confirm with the key study/lab that matches the mechanism: Vertebral body collapse — osteoporosis or trauma.",
    treatmentRationale: "Treatment aims: Analgesia; Treat osteoporosis; Kyphoplasty if indicated.",
    drugRationales: {
      "acetaminophen": {
        whyUsed: "Analgesic/antipyretic for pain/fever when NSAIDs risky. Used here for Vertebral compression fracture.",
        briefMoa: "Central COX inhibition (weak anti-inflammatory).",
      },
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Vertebral compression fracture.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "alendronate": {
        whyUsed: "Bisphosphonate to reduce fracture risk in osteoporosis. Used here for Vertebral compression fracture.",
        briefMoa: "Inhibits osteoclast farnesyl pyrophosphate synthase.",
      },
    },
  },
  "celiac-disease": {
    bestDiagnosis: "Diagnose from clinical pattern of celiac disease; confirm with the key study/lab that matches the mechanism: Gluten-triggered autoimmune enteropathy → malabsorption.",
    treatmentRationale: "Treatment aims: Strict gluten-free diet; Replace deficiencies.",
    drugRationales: {
      "folic-acid": {
        whyUsed: "Replete folate stores / support MTX rescue contexts. Used here for Celiac disease.",
        briefMoa: "Essential cofactor for one-carbon metabolism.",
      },
      "prednisone": {
        whyUsed: "Systemic glucocorticoid for inflammation/autoimmune. Used here for Celiac disease.",
        briefMoa: "Glucocorticoid receptor agonism.",
      },
    },
  },
  "compartment-syndrome": {
    bestDiagnosis: "Diagnose from clinical pattern of compartment syndrome; confirm with the key study/lab that matches the mechanism: ↑ fascial compartment pressure → ischemia of muscles/nerves.",
    treatmentRationale: "Treatment aims: Emergent fasciotomy; Analgesia does not replace surgery.",
    drugRationales: {
      "morphine": {
        whyUsed: "Opioid analgesia for severe pain. Used here for Compartment syndrome.",
        briefMoa: "μ-opioid receptor agonism.",
      },
      "ketamine": {
        whyUsed: "Dissociative anesthetic / analgesia in selected trauma. Used here for Compartment syndrome.",
        briefMoa: "NMDA receptor antagonism.",
      },
    },
  },
  "mainstem-intubation": {
    bestDiagnosis: "Diagnose from clinical pattern of mainstem bronchus intubation; confirm with the key study/lab that matches the mechanism: ETT advanced into right mainstem → left lung collapse, hypoxemia.",
    treatmentRationale: "Treatment aims: Reposition ETT; Confirm with bilateral breath sounds + CXR.",
    drugRationales: {
      "albuterol": {
        whyUsed: "Rapid bronchodilation for bronchospasm. Used here for Mainstem bronchus intubation.",
        briefMoa: "β2 agonist → airway smooth muscle relaxation.",
      },
      "furosemide": {
        whyUsed: "Loop diuretic for volume overload. Used here for Mainstem bronchus intubation.",
        briefMoa: "NKCC2 inhibition.",
      },
    },
  },
  "bladder-cancer": {
    bestDiagnosis: "Diagnose from clinical pattern of bladder cancer; confirm with the key study/lab that matches the mechanism: Urothelial malignancy → painless hematuria most common presentation.",
    treatmentRationale: "Treatment aims: Staging with cystoscopy; Intravesical or systemic therapy by stage.",
    drugRationales: {
      "mitomycin": {
        whyUsed: "Cytotoxic antibiotic chemotherapy. Used here for Bladder cancer.",
        briefMoa: "DNA cross-linking alkylator.",
      },
      "cisplatin": {
        whyUsed: "Cytotoxic chemotherapy for solid tumors. Used here for Bladder cancer.",
        briefMoa: "DNA cross-linking → apoptosis.",
      },
    },
  },
  "prostate-cancer": {
    bestDiagnosis: "Diagnose from clinical pattern of prostate cancer; confirm with the key study/lab that matches the mechanism: Adenocarcinoma of prostate → local invasion and metastasis to bone.",
    treatmentRationale: "Treatment aims: Risk stratification; Androgen deprivation ± novel agents.",
    drugRationales: {
      "enzalutamide": {
        whyUsed: "Androgen receptor blockade in prostate cancer. Used here for Prostate cancer.",
        briefMoa: "AR signaling inhibitor.",
      },
      "leuprolide": {
        whyUsed: "GnRH agonist for hormone-sensitive cancers. Used here for Prostate cancer.",
        briefMoa: "Pituitary GnRH receptor downregulation after flare.",
      },
    },
  },
  "pancreatic-cancer": {
    bestDiagnosis: "Diagnose from clinical pattern of pancreatic adenocarcinoma; confirm with the key study/lab that matches the mechanism: Pancreatic ductal adenocarcinoma → obstructive jaundice, weight loss, thrombosis.",
    treatmentRationale: "Treatment aims: Resectability assessment; Palliative chemo if advanced.",
    drugRationales: {
      "gemcitabine": {
        whyUsed: "Antimetabolite chemotherapy. Used here for Pancreatic adenocarcinoma.",
        briefMoa: "Nucleoside analog → DNA synthesis inhibition.",
      },
      "fluorouracil": {
        whyUsed: "Antimetabolite chemotherapy. Used here for Pancreatic adenocarcinoma.",
        briefMoa: "Thymidylate synthase inhibition.",
      },
    },
  },
  "colorectal-cancer": {
    bestDiagnosis: "Diagnose from clinical pattern of colorectal cancer; confirm with the key study/lab that matches the mechanism: Adenomatous polyp progression → local invasion and metastasis.",
    treatmentRationale: "Treatment aims: Surgical resection; Adjuvant chemotherapy by stage.",
    drugRationales: {
      "fluorouracil": {
        whyUsed: "Antimetabolite chemotherapy. Used here for Colorectal cancer.",
        briefMoa: "Thymidylate synthase inhibition.",
      },
      "cisplatin": {
        whyUsed: "Cytotoxic chemotherapy for solid tumors. Used here for Colorectal cancer.",
        briefMoa: "DNA cross-linking → apoptosis.",
      },
    },
  },
  "gastric-cancer": {
    bestDiagnosis: "Diagnose from clinical pattern of gastric cancer; confirm with the key study/lab that matches the mechanism: Gastric adenocarcinoma — H. pylori and dietary risk factors.",
    treatmentRationale: "Treatment aims: HER2 testing; Surgery + perioperative chemo.",
    drugRationales: {
      "trastuzumab": {
        whyUsed: "HER2-targeted therapy in breast/gastric cancer. Used here for Gastric cancer.",
        briefMoa: "Anti-HER2 monoclonal antibody.",
      },
      "fluorouracil": {
        whyUsed: "Antimetabolite chemotherapy. Used here for Gastric cancer.",
        briefMoa: "Thymidylate synthase inhibition.",
      },
    },
  },
  "pkd": {
    bestDiagnosis: "Diagnose from clinical pattern of polycystic kidney disease; confirm with the key study/lab that matches the mechanism: Inherited cystic kidney disease → HTN, progressive CKD, berry aneurysms.",
    treatmentRationale: "Treatment aims: BP control; Monitor for aneurysm and CKD progression.",
    drugRationales: {
      "lisinopril": {
        whyUsed: "ACEi for HTN/HF/CKD proteinuria. Used here for Polycystic kidney disease.",
        briefMoa: "ACE inhibition.",
      },
      "amlodipine": {
        whyUsed: "Vasodilating CCB for BP / afterload control. Used here for Polycystic kidney disease.",
        briefMoa: "L-type Ca²⁺ channel block in vessels.",
      },
    },
  },
  "cavernous-sinus-thrombosis": {
    bestDiagnosis: "Diagnose from clinical pattern of cavernous sinus thrombosis; confirm with the key study/lab that matches the mechanism: Septic or aseptic thrombosis of cavernous sinus → cranial neuropathies.",
    treatmentRationale: "Treatment aims: Broad antibiotics + anticoagulation debate; Drain source infection.",
    drugRationales: {
      "vancomycin": {
        whyUsed: "Gram-positive coverage including MRSA. Used here for Cavernous sinus thrombosis.",
        briefMoa: "Binds D-Ala-D-Ala → blocks cell-wall synthesis.",
      },
      "cefuroxime": {
        whyUsed: "2nd-gen cephalosporin for selected CNS/respiratory pathogens. Used here for Cavernous sinus thrombosis.",
        briefMoa: "β-lactam cell-wall inhibition.",
      },
      "moxifloxacin": {
        whyUsed: "Respiratory fluoroquinolone. Used here for Cavernous sinus thrombosis.",
        briefMoa: "DNA gyrase inhibition.",
      },
    },
  },
  "cardiac-contusion": {
    bestDiagnosis: "Diagnose from clinical pattern of cardiac contusion; confirm with the key study/lab that matches the mechanism: Blunt chest trauma → myocardial injury, arrhythmia risk.",
    treatmentRationale: "Treatment aims: Telemetry monitoring; Treat arrhythmias.",
    drugRationales: {
      "metoprolol": {
        whyUsed: "β1 blocker for ischemia/HF/rate. Used here for Cardiac contusion.",
        briefMoa: "Selective β1 blockade.",
      },
      "aspirin": {
        whyUsed: "Antiplatelet for arterial ischemic syndromes. Used here for Cardiac contusion.",
        briefMoa: "Irreversible COX-1 inhibition.",
      },
    },
  },
  "brachial-plexus-injury": {
    bestDiagnosis: "Diagnose from clinical pattern of brachial plexus injury; confirm with the key study/lab that matches the mechanism: Traction/avulsion of brachial plexus → arm weakness/sensory loss.",
    treatmentRationale: "Treatment aims: Pain control; Neurosurgical evaluation if avulsion.",
    drugRationales: {
      "gabapentin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Brachial plexus injury.",
        briefMoa: "α2δ Ca channel ligand → ↓ excitatory release.",
      },
      "pregabalin": {
        whyUsed: "Neuropathic pain / seizure adjunct. Used here for Brachial plexus injury.",
        briefMoa: "α2δ Ca channel ligand.",
      },
      "baclofen": {
        whyUsed: "Spasmolytic for upper motor neuron spasticity. Used here for Brachial plexus injury.",
        briefMoa: "GABA-B agonist → ↓ excitatory transmission.",
      },
    },
  },
};

/** Merge clinical depth onto a disease link (does not overwrite richer hand-authored fields). */
export function applyClinicalDepth(link: AnatomyDiseaseLink): AnatomyDiseaseLink {
  const depth = CLINICAL_DEPTH_BY_ID[link.id];
  if (!depth) return link;
  return {
    ...link,
    bestDiagnosis: link.bestDiagnosis ?? depth.bestDiagnosis,
    treatmentRationale: link.treatmentRationale ?? depth.treatmentRationale,
    drugRationales: { ...depth.drugRationales, ...link.drugRationales },
  };
}

