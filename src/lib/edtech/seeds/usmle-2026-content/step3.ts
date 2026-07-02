import type { Usmle2026StudyContent } from "./types";

/** Step 3 — management, CCS, biostatistics, ethics. */
export const USMLE_2026_CONTENT_STEP3: Record<string, Usmle2026StudyContent> = {
  "ambulatory-chronic-care": {
    overview: "Longitudinal management of diabetes, HTN, hyperlipidemia in outpatient setting.",
    summary:
      "Step 3 ambulatory vignettes test guideline-concordant chronic care: HbA1c targets individualized, statin by ASCVD risk, BP goal <130/80 in many diabetics per ACC/AHA. Screen for complications annually — retinal exam, urine albumin, foot exam.\n\nMedication adherence, cost, and social barriers affect outcomes — address SDOH when non-adherence.",
    keyConcepts: [
      "Diabetes: metformin first unless contraindicated; GLP-1/SGLT2i for ASCVD/HF/CKD",
      "Hypertension: thiazide/ACEi/ARB/CCB — combine classes for control",
      "Statin intensity by 10-year ASCVD risk",
      "Annual influenza vaccine; pneumococcal per schedule",
      "Referral thresholds: uncontrolled BP on 3 drugs, A1c persistently above goal on triple therapy",
    ],
    mustKnowFacts: [
      "ACEi/ARB for diabetic nephropathy with albuminuria even if normotensive historically",
    ],
    pearls: [
      "Type 2 DM + ASCVD history → add SGLT2i or GLP-1 with proven CV benefit regardless of A1c.",
    ],
    pitfalls: [
      "Adding third agent without assessing adherence and cost",
    ],
  },
  "inpatient-orders": {
    overview: "Admission orders, VTE prophylaxis, diet, activity, and monitoring.",
    summary:
      "Standard admission orders: vitals frequency, activity, diet, DVT prophylaxis (unless bleeding risk), fall precautions, code status. Insulin: basal-bolus or correction scale — never sliding scale alone in Type 1.\n\nTelemetry indication: active arrhythmia, ACS, electrolyte abnormality. IS and O (ins and outs) for heart failure and AKI.",
    keyConcepts: [
      "Pharmacologic VTE prophylaxis in hospitalized medical patients unless contraindicated",
      "NPO after midnight for procedures — verify glucose plan for diabetics",
      "Bowel regimen with opioids",
      "Code status and surrogate documented",
      "Medication reconciliation on admission and discharge",
    ],
    mustKnowFacts: [
      "Heparin-induced thrombocytopenia — stop heparin, start alternative anticoagulant if thrombosis",
    ],
    pearls: [
      "Admit CHF patient: daily weights, 2 g sodium diet, strict I&O, standing diuretic dose adjustment plan.",
    ],
    pitfalls: [
      "No DVT prophylaxis in immobile medical patient without documented contraindication",
    ],
  },
  "next-best-step": {
    overview: "Prioritize single best immediate action in clinical vignettes.",
    summary:
      "Step 3 'next best step' items reward stabilizing, diagnosing, or treating the life-threatening problem first. Unstable → ABCs. Stable → most sensitive/specific test or first-line therapy.\n\nAvoid options that are correct eventually but delayed, incomplete, or contraindicated for this patient.",
    keyConcepts: [
      "Airway/breathing/circulation before elective workup",
      "Treat symptomatic hypoglycemia before adjusting long-acting insulin",
      "Antibiotics before LP delay in bacterial meningitis with sepsis",
      "Definitive care vs temporizing — chest tube before OR for tension PTX",
      "Patient-specific contraindications (pregnancy, allergy, renal function)",
    ],
    mustKnowFacts: [
      "When two answers seem correct, choose the one that happens first and is most complete for acuity",
    ],
    pearls: [
      "STEMI vignette: activate reperfusion beats arranging outpatient stress test.",
    ],
    pitfalls: [
      "Choosing comprehensive workup when single emergent intervention needed",
    ],
  },
  "lab-interpretation": {
    overview: "Trend labs, critical values, and action thresholds.",
    summary:
      "Interpret labs in clinical context — trending K⁺ in DKA, creatinine rise after contrast, troponin serially in ACS. Critical values require immediate action: K⁺ >6.5, glucose <40, Ca²⁺ critical low/high, INR supratherapeutic with bleeding.\n\nPre-analytic errors: hemolyzed K⁺ falsely elevated; lipemia affects some assays.",
    keyConcepts: [
      "Corrected calcium for albumin: Ca + 0.8 × (4 − albumin)",
      "Anion gap and delta gap in acid-base",
      "Troponin rise and fall distinguishes MI from chronic elevation",
      "BNP supports HF but elevated in renal failure too",
      "Peripheral smear for schistocytes, malaria, spherocytes",
    ],
    mustKnowFacts: [
      "Critical hyperkalemia with ECG changes → calcium gluconate first",
    ],
    pearls: [
      "Rising creatinine day 3 post-contrast in diabetic → contrast nephropathy; hold nephrotoxins, hydrate.",
    ],
    pitfalls: [
      "Treating lab without repeating hemolyzed potassium specimen",
    ],
  },
  "cost-effective-care": {
    overview: "High-value testing and resource-conscious management.",
    summary:
      "Avoid low-yield imaging: uncomplicated low back pain <6 weeks without red flags — no MRI. Routine pre-op labs in healthy young patients often unnecessary.\n\nGeneric medications, right site of care (outpatient vs observation vs admission), and guideline-concordant screening prevent waste.",
    keyConcepts: [
      "Choosing Wisely recommendations — avoid routine tests without indication",
      "Observation vs admission for chest pain low risk HEART score",
      "Step-up therapy in asthma/COPD before adding expensive biologics",
      "Do not repeat recent imaging unless clinical change",
      "Palliative care reduces hospital utilization when aligned with goals",
    ],
    mustKnowFacts: [
      "US health system Step 3 may explicitly test unnecessary MRI/CT options as wrong answers",
    ],
    pearls: [
      "Healthy 25-year-old pre-op cholecystectomy → no routine ECG/CXR unless symptoms.",
    ],
    pitfalls: [
      "Ordering CT pan-scan in stable trauma patient with clear mechanism and normal exam per ATLS selective imaging",
    ],
  },
  "emergency-management": {
    overview: "ED stabilization sequences for common emergencies.",
    summary:
      "Chest pain → ECG in 10 min. Stroke → CT, glucose, tPA window. Anaphylaxis → IM epinephrine. Sepsis → cultures and antibiotics. Status asthmaticus → continuous nebulized albuterol + steroids.\n\nDisposition: ICU for vasopressor requirement, airway protection, or frequent monitoring.",
    keyConcepts: [
      "Dual antiplatelet + anticoagulation balance in ACS",
      "Stroke mimics: hypoglycemia, Todd paralysis, conversion",
      "Epiglottitis — do not agitate child; OR for airway",
      "Ectopic pregnancy unstable → OR; stable → methotrexate if criteria met",
      "Acute angle-closure glaucoma: IOP lowering emergent",
    ],
    mustKnowFacts: [
      "Epinephrine IM lateral thigh for anaphylaxis — not subcutaneous",
    ],
    pearls: [
      "Unstable narrow-complex tachycardia → synchronized cardioversion before adenosine if unstable.",
    ],
    pitfalls: [
      "Discharging moderate-risk chest pain without stress test or observation protocol",
    ],
  },
  "post-op-fever": {
    overview: "Timing-based differential and targeted workup.",
    summary:
      "Day 0–1: atelectasis, aspiration. Day 3–5: UTI, pneumonia, wound infection. Day 5–7: anastomotic leak, abscess. Day 7+: deep abscess, DVT/PE, drug fever.\n\nWorkup: exam, urinalysis, chest X-ray, wound inspection, blood cultures if septic. CT if localized signs or persistent fever.",
    keyConcepts: [
      "Wind/water/wound/walk/wonder drugs mnemonic",
      "Anastomotic leak: tachycardia may precede fever",
      "POD#1 fever often atelectasis — IS and ambulation",
      "Catheter-associated UTI — remove Foley if possible",
      "C. diff after recent antibiotics — diarrhea and leukocytosis",
    ],
    mustKnowFacts: [
      "Post-op day 1 fever rarely needs extensive sepsis workup if atelectasis likely",
    ],
    pearls: [
      "Tachycardia POD 3 colorectal anastomosis → CT with contrast for leak before only treating pneumonia.",
    ],
    pitfalls: [
      "Repeated broad antibiotics without source identification on POD 5+",
    ],
  },
  "acute-abdomen-ccs": {
    overview: "CCS sequence for RLQ pain, peritonitis, and surgical consult.",
    summary:
      "Initial: NPO, IV fluids, labs (CBC, CMP, lipase, UA, beta-hCG), type & cross if surgical concern. Imaging: US for biliary/pregnancy; CT for appendicitis when unclear.\n\nSerial exams; antibiotics if perforation suspected; surgery consult early for peritonitis.",
    keyConcepts: [
      "Female reproductive age → pregnancy test before CT",
      "Appendicitis score guides imaging",
      "Peritonitis = surgical abdomen until proven otherwise",
      "NG decompression for obstruction",
      "Analgesia does not mask surgical diagnosis significantly — treat pain",
    ],
    mustKnowFacts: [
      "Free air on XR → perforation — surgery and antibiotics",
    ],
    pearls: [
      "RLQ pain + migration from periumbilical + anorexia → appendicitis pathway; NPO, IV abx, surgery consult.",
    ],
    pitfalls: [
      "Discharging peritoneal signs without surgical evaluation",
    ],
  },
  "ccs-initial-workup": {
    overview: "First CCS time block — stabilization, history, and targeted diagnostics.",
    summary:
      "Open CCS cases with ABCs and focused history/physical orders before broad testing. Place vital signs, IV access, labs directed by presentation, and imaging that changes immediate management.\n\nAvoid shotgun ordering — each initial workup should answer: what is life-threatening now, and what is the most likely diagnosis?",
    keyConcepts: [
      "Stabilize before elective testing",
      "Order set matches chief complaint — chest pain gets ECG and troponin stat",
      "Review allergies, medications, and pregnancy status early",
      "Type & screen when transfusion possible",
      "Consult early when specialty input needed for time-sensitive conditions",
    ],
    mustKnowFacts: [
      "CCS initial block sets trajectory — missing ECG in chest pain is heavily penalized",
    ],
    pearls: [
      "Dyspnea CCS: pulse ox, CXR, BNP/D-dimer as indicated — not CT head first.",
    ],
    pitfalls: [
      "Ordering CT whole body before basic labs and exam in stable patient",
    ],
  },
  "ccs-monitoring-escalation": {
    overview: "Timed reassessment and escalation in CCS simulations.",
    summary:
      "After initial treatment, advance clock and reassess vitals, symptoms, labs. Worsening → escalate care level (floor to ICU), consult specialty, or proceed to OR.\n\nImprovement → de-escalate oxygen, transition PO meds, plan discharge with follow-up.",
    keyConcepts: [
      "Set monitoring frequency matched to acuity",
      "Repeat lactate in sepsis — clearance goal",
      "Transfer to ICU for vasopressors or invasive ventilation",
      "Failure of medical management → procedural/surgical intervention",
      "Document rationale for each escalation",
    ],
    mustKnowFacts: [
      "CCS punishes failure to act on worsening vitals at next time interval",
    ],
    pearls: [
      "Pneumonia patient fever day 2 despite antibiotics → broaden coverage or drain empyema; do not discharge.",
    ],
    pitfalls: [
      "Advancing time without placing any new orders when patient deteriorated",
    ],
  },
  "ccs-discharge-planning": {
    overview: "Safe discharge criteria, prescriptions, and follow-up.",
    summary:
      "Discharge when hemodynamically stable, oral intake tolerated, pain controlled on PO regimen, able to care for self or has support. Provide prescriptions, return precautions, follow-up appointment.\n\nHigh-risk discharges: CHF (weight monitoring), DKA (insulin teaching), PE (anticoagulation adherence).",
    keyConcepts: [
      "Medication reconciliation and patient education",
      "Follow-up within appropriate window (e.g., CHF 7 days)",
      "Return precautions: chest pain, dyspnea, fever, confusion",
      "DVT prophylaxis duration at discharge for PE",
      "Ensure insurance/access for prescribed meds",
    ],
    mustKnowFacts: [
      "Discharge on warfarin requires INR follow-up plan and drug interaction counseling",
    ],
    pearls: [
      "DKA resolved gap → switch to basal-bolus SQ insulin overlap before stopping drip.",
    ],
    pitfalls: [
      "Discharging sepsis patient still on vasopressors — inappropriate level of care",
    ],
  },
  "ccs-orders-sequence": {
    overview: "Logical order timing in multi-step case simulations.",
    summary:
      "Place orders in sequence that mirrors real care: type & cross before OR, antibiotics before cultures only when delay harmful (sepsis — cultures then abx rapidly), NPO before sedation procedures.\n\nAvoid duplicate harmful orders — repeat CT with contrast in AKI, sedating unstable patient without airway plan.",
    keyConcepts: [
      "Stat vs routine order timing affects CCS scoring",
      "Consults placed early when specialty input needed",
      "Remove unnecessary Foley to reduce UTI",
      "DVT prophylaxis unless bleeding",
      "Advance diet as ileus resolves post-op",
    ],
    mustKnowFacts: [
      "One thoughtful order set per time block often better than shotgun ordering",
    ],
    pearls: [
      "Chest pain CCS: ECG → troponin → aspirin → heparin → cardiology before elective tests.",
    ],
    pitfalls: [
      "Ordering CT angiography before stabilizing BP in obvious STEMI",
    ],
  },
  "nnt-arr": {
    overview: "Calculate NNT, NNH, ARR, and RRR from trial data.",
    summary:
      "ARR = control event rate − treatment event rate. NNT = 1/ARR (round up). RRR = ARR/control rate — can look impressive with small absolute benefit.\n\nNNH = 1/ARI for harm. Number needed to screen incorporates prevalence and test characteristics.",
    keyConcepts: [
      "Always report ARR alongside RRR",
      "NNT 100 means 100 treated for one to benefit over control period",
      "Confidence interval for NNT when ARR CI crosses zero",
      "Absolute risk increase for side effects — NNH",
      "Lifetime vs trial duration affects interpretation",
    ],
    mustKnowFacts: [
      "50% RRR with 2% → 1% event rate = NNT 100 — clinically contextualize",
    ],
    pearls: [
      "Drug ad: '50% reduction' with 2% control and 1% treatment → counsel NNT 100.",
    ],
    pitfalls: [
      "Choosing therapy based on RRR alone in low baseline risk population",
    ],
  },
  "sensitivity-specificity-lr": {
    overview: "Likelihood ratios and Bayesian application on Step 3.",
    summary:
      "LR+ = sensitivity/(1−specificity); LR− = (1−sensitivity)/specificity. Pre-test odds × LR = post-test odds.\n\nHigh LR+ (>10) strongly increases probability; low LR− (<0.1) strongly decreases. Useful when prevalence intermediate.",
    keyConcepts: [
      "Sequential testing multiplies likelihood ratios",
      "SnNout/SpPin mnemonics for rule-out/in tests",
      "ROC curve: AUC summarizes discrimination",
      "Cutoff selection shifts sensitivity/specificity tradeoff",
      "Predictive values prevalence-dependent — not intrinsic test properties",
    ],
    mustKnowFacts: [
      "LR+ of 1 provides no information",
    ],
    pearls: [
      "Negative D-dimer with low Wells score → LR− low enough to rule out PE.",
    ],
    pitfalls: [
      "Applying screening test PPV to low-prevalence ED population without adjustment",
    ],
  },
  "study-design-appraisal": {
    overview: "Critique RCTs, cohort studies, and meta-analyses on Step 3.",
    summary:
      "Assess randomization, blinding, allocation concealment, loss to follow-up, and intention-to-treat. Cohort: selection bias, confounding. Case-control: recall bias.\n\nMeta-analysis: heterogeneity (I²), funnel plot for publication bias. Surrogate endpoints may not translate to patient outcomes.",
    keyConcepts: [
      "Allocation concealment prevents selection bias in RCT",
      "Loss to follow-up >20% threatens validity",
      "Per-protocol vs ITT — ITT preferred for policy",
      "Confounding by indication in observational studies",
      "Lead-time bias inflates screening survival without mortality benefit",
    ],
    mustKnowFacts: [
      "Statistical significance ≠ clinical importance",
    ],
    pearls: [
      "Abstract claims benefit — check absolute event rates in results table.",
    ],
    pitfalls: [
      "Accepting surrogate marker (LDL lowering) without hard outcome when outcomes missing",
    ],
  },
  "informed-consent-capacity": {
    overview: "Elements of consent and capacity assessment.",
    summary:
      "Valid consent: disclosure, understanding, voluntariness, capacity. Emergencies permit implied consent for life-saving treatment.\n\nCapacity is decision-specific — assess four abilities: understand, appreciate, reason, communicate. Surrogate hierarchy when incapacitated.",
    keyConcepts: [
      "Minors: parental consent except emancipated, mature minor statutes for specific care",
      "Blood transfusion refusal in competent adult Jehovah's Witness honored",
      "Therapeutic privilege rarely justifies withholding diagnosis",
      "Documentation of consent process",
      "Research consent additional safeguards — IRB",
    ],
    mustKnowFacts: [
      "Pregnant minor consent for own prenatal care in many jurisdictions",
    ],
    pearls: [
      "Intoxicated trauma patient needs emergent surgery — implied consent; document later.",
    ],
    pitfalls: [
      "Assuming lack of agreement equals incapacity",
    ],
  },
  "confidentiality-reporting": {
    overview: "HIPAA, Tarasoff, and mandatory reporting obligations.",
    summary:
      "Confidentiality default; exceptions: patient permission, treatable harm to self (involuntary hold criteria), duty to warn identifiable third party of imminent violence, mandatory reporting of abuse and certain diseases.\n\nTeen confidentiality for STI, contraception, mental health varies by state — know vignette jurisdiction implications.",
    keyConcepts: [
      "Tarasoff: warn/protect when specific threat to identifiable victim",
      "Child/elder abuse reporting mandatory — examine in private",
      "Partner notification for HIV/syphilis per public health law",
      "Minors: balance safety and confidentiality in abuse suspicion",
      "HIPAA minimum necessary standard",
    ],
    mustKnowFacts: [
      "Gunshot wound reporting required in many jurisdictions",
    ],
    pearls: [
      "Patient states plan to kill named ex-partner with gun → breach confidentiality to warn and notify law enforcement per duty.",
    ],
    pitfalls: [
      "Notifying family of adult patient's HIV status without permission",
    ],
  },
  "end-of-life-ethics": {
    overview: "Advance directives, DNR, and palliative sedation.",
    summary:
      "Advance directive/living will expresses wishes; healthcare proxy names decision-maker. DNR/DNI orders must be honored — discuss code status.\n\nDouble effect: treating pain with opioids acceptable even if rare respiratory depression risk when intent is comfort. Physician-assisted dying legal only in select states — know ethics vignette framing.",
    keyConcepts: [
      "Substituted judgment vs best interest standard",
      "POLST translates preferences into actionable orders",
      "Hospice eligibility: prognosis ≤6 months if disease runs usual course",
      "Family cannot override capacitated patient refusal",
      "Palliative care compatible with disease-directed therapy",
    ],
    mustKnowFacts: [
      "No ethical requirement to provide futile treatment — discuss goals of care",
    ],
    pearls: [
      "Terminal cancer with intractable pain — increase opioids for comfort; not euthanasia when intent is symptom relief.",
    ],
    pitfalls: [
      "Full code on patient with clear DNR document without resolving discrepancy",
    ],
  },
  "well-child-preventive": {
    overview: "Pediatric preventive visits, growth, and anticipatory guidance.",
    summary:
      "Track height/weight/BMI percentiles, developmental screening, vision/hearing at intervals. Immunizations per ACIP. Anticipatory guidance: safety (car seats, guns), nutrition, screen time, dental care.\n\nLead screening in high-risk areas; anemia screening infancy; lipid screening selected adolescents.",
    keyConcepts: [
      "WHO vs CDC growth charts — CDC for US children >2",
      "Red flags on developmental screening → referral",
      "Fluoride varnish dental caries prevention",
      "Adolescent confidential time for sensitive topics",
      "Depression screening adolescents PHQ-A",
    ],
    mustKnowFacts: [
      "Back to sleep reduces SIDS — supine positioning",
    ],
    pearls: [
      "2-year-old crossing 2 major weight percentiles downward → evaluate failure to thrive.",
    ],
    pitfalls: [
      "Missing autism screening at 18/24 month visits",
    ],
  },
  "pediatric-ccs": {
    overview: "CCS scenarios in dehydration, asthma, and febrile infant.",
    summary:
      "Pediatric CCS emphasizes weight-based dosing, fluid resuscitation 20 mL/kg boluses, and age-specific fever workup. Asthma: continuous albuterol, magnesium, admit if poor response.\n\nDehydration: ORT if mild-moderate and tolerating PO; IV if severe shock.",
    keyConcepts: [
      "Maintenance fluids 4-2-1 rule",
      "Hypoglycemia in infant — check glucose early",
      "Bronchiolitis supportive — no bronchodilators routinely",
      "Epiglottitis — call anesthesia/ENT, no tongue blade exam",
      "Child abuse skeletal survey in infant with suspicious injury",
    ],
    mustKnowFacts: [
      "Isotonic bolus 20 mL/kg in pediatric shock — repeat as needed",
    ],
    pearls: [
      "Febrile neonate CCS: blood culture, LP, UA, ampicillin + gentamicin/cefotaxime — admit.",
    ],
    pitfalls: [
      "Hypotonic maintenance fluid alone in DKA child — use isotonic resuscitation first",
    ],
  },
  "ob-labor-ccs": {
    overview: "Labor management, FHR tracing response, and delivery decisions.",
    summary:
      "Admit in active labor; monitor FHR and contractions. Category II tracings require evaluation and possible intrauterine resuscitation (position, fluids, O₂, stop oxytocin).\n\nProlonged second stage criteria differ nullipara vs multipara — operative delivery if criteria met.",
    keyConcepts: [
      "Category III → expeditious delivery",
      "Amnioinfusion for recurrent variables",
      "Chorioamnionitis: fever, uterine tenderness, fetal tachycardia — antibiotics and delivery",
      "Shoulder dystocia maneuvers",
      "Postpartum hemorrhage protocol ready",
    ],
    mustKnowFacts: [
      "Fetal bradycardia persistent → emergent cesarean if not recovering with resuscitation",
    ],
    pearls: [
      "Oxytocin infusion + recurrent late decelerations → stop oxytocin, left lateral, IV fluids, reassess tracing.",
    ],
    pitfalls: [
      "Continuing oxytocin despite Category III tracing",
    ],
  },
  "postpartum-complications": {
    overview: "Hemorrhage, endometritis, mastitis, and postpartum mood disorders.",
    summary:
      "PPH: uterine atony most common — massage, oxytocin, misoprostol, tranexamic acid, surgery if refractory. Endometritis: fever, uterine tenderness, foul lochia — clindamycin + gentamicin.\n\nPostpartum blues vs depression vs psychosis — psychosis medical emergency with infanticide risk.",
    keyConcepts: [
      "Retained products suspected with tissue passage and bleeding",
      "Mastitis: flu-like illness, wedge-shaped breast erythema — continue breastfeeding + dicloxacillin",
      "Postpartum thyroiditis biphasic hyper then hypo",
      "Venous thromboembolism risk elevated postpartum",
      "Baby blues peak day 3–5 — resolves 2 weeks",
    ],
    mustKnowFacts: [
      "Postpartum psychosis requires hospitalization — do not discharge with baby alone",
    ],
    pearls: [
      "Day 2 postpartum heavy bleeding + boggy uterus → atony protocol before OR unless retained placenta.",
    ],
    pitfalls: [
      "Attributing postpartum fever only to mastitis without uterine exam",
    ],
  },
  "psychiatric-hospitalization": {
    overview: "Criteria for inpatient psychiatry and involuntary hold.",
    summary:
      "Hospitalize when danger to self, danger to others, or grave disability unable to care for basic needs. Involuntary hold when refuses but meets criteria — jurisdiction-specific duration.\n\nVoluntary admission preferred when patient agrees; safety plan insufficient for active suicide plan with means.",
    keyConcepts: [
      "Emergency hold for evaluation — not indefinite treatment without process",
      "Elopement risk on inpatient unit",
      "Medical clearance before psych admission — rule out delirium, tox",
      "One-to-one observation for high suicide risk",
      "Discharge planning with outpatient follow-up within days",
    ],
    mustKnowFacts: [
      "Contract for safety alone inadequate for high-risk suicide",
    ],
    pearls: [
      "Active suicide plan with firearm access → involuntary hold and means restriction.",
    ],
    pitfalls: [
      "Discharging psychotic patient with command hallucinations to harm others",
    ],
  },
  "medication-monitoring": {
    overview: "Lithium, clozapine, antipsychotic metabolic monitoring.",
    summary:
      "Lithium: levels, TSH, creatinine q6–12 months. Clozapine: ANC weekly then less frequent per protocol. Antipsychotics: weight, glucose, lipids, EPS assessment.\n\nValproate: LFTs, platelets; pregnancy test. MAOI dietary tyramine restrictions.",
    keyConcepts: [
      "Clozapine only for treatment-resistant schizophrenia with ANC monitoring",
      "Metabolic syndrome with second-generation antipsychotics — lifestyle intervention",
      "Lithium toxicity with dehydration, NSAIDs, ACEi",
      "Tardive dyskinesia with chronic typical antipsychotics",
      "Drug levels: phenytoin, carbamazepine, valproate in epilepsy",
    ],
    mustKnowFacts: [
      "Agranulocytosis on clozapine — stop and never rechallenge if severe",
    ],
    pearls: [
      "Patient on lithium vomiting with tremor and confusion → check level; hold dose, hydrate.",
    ],
    pitfalls: [
      "Starting clozapine without baseline ANC and registry enrollment",
    ],
  },
};
