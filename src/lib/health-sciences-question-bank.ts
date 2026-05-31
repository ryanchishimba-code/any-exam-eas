/**
 * Stratified MCQ database for Medicine (USMLE-style), Nursing (NCLEX-style),
 * and Pharmacy (NAPLEX-style). Items are keyed by field → subject area id.
 * Content modeled on board exam content outlines and high-yield OER topics.
 */
import type { BankItem } from "./question-bank";
import { ANATOMY_QUESTION_BANK } from "./medicine-anatomy-question-bank";

function q(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  tags: string[] = []
): BankItem {
  return {
    subjectId,
    question,
    options,
    correctAnswer: correct,
    explanation,
    tags: [...tags, "high-yield"],
  };
}

export const HEALTH_QUESTION_BANK: Record<
  string,
  Record<string, BankItem[]>
> = {
  medicine: {
    anatomy: ANATOMY_QUESTION_BANK,
    physiology: [
      q("physiology", "End-systole corresponds to:", ["Lowest ventricular volume", "Maximal ventricular volume", "Mitral valve opening only", "Aortic valve opening only"], "Lowest ventricular volume", "Before diastolic filling begins.", ["cardiovascular"]),
      q("physiology", "ADH increases water reabsorption via:", ["Aquaporin-2 insertion", "Na/K pump blockade", "Aldosterone inhibition", "ANP release"], "Aquaporin-2 insertion", "Collecting duct permeability increases.", ["renal"]),
      q("physiology", "During exercise, ventilation increases primarily due to:", ["Hypercapnia and metabolic acidosis", "Hypoxemia alone", "Baroreceptor reset only", "Decreased sympathetic tone"], "Hypercapnia and metabolic acidosis", "Chemoreceptor-driven respiratory drive.", ["respiratory"]),
      q("physiology", "Glucagon raises blood glucose by:", ["Hepatic glycogenolysis", "Peripheral glucose uptake", "Insulin secretion", "Renal glucose excretion"], "Hepatic glycogenolysis", "Activates hepatic glycogen phosphorylase.", ["endocrine"]),
      q("physiology", "Typical resting membrane potential of a neuron is about:", ["-70 mV", "+30 mV", "0 mV", "-120 mV"], "-70 mV", "Dominated by K+ permeability.", ["neuro"]),
      q("physiology", "Residual volume cannot be measured by:", ["Simple spirometry alone", "Helium dilution", "Body plethysmography", "Peak flow meter"], "Simple spirometry alone", "RV remains after maximal expiration.", ["respiratory"]),
    ],
    pathology: [
      q("pathology", "Caseous necrosis is classic for:", ["Tuberculosis", "Acute pancreatitis", "Brain infarct", "Viral hepatitis"], "Tuberculosis", "Granulomatous inflammation pattern.", ["infection"]),
      q("pathology", "Reed-Sternberg cells indicate:", ["Hodgkin lymphoma", "Burkitt lymphoma", "Multiple myeloma", "CML"], "Hodgkin lymphoma", "Diagnostic owl-eye cells.", ["hematology"]),
      q("pathology", "Leading cause of community-acquired pneumonia in adults:", ["Streptococcus pneumoniae", "Mycoplasma only", "Pseudomonas only", "E. coli only"], "Streptococcus pneumoniae", "Most common bacterial CAP pathogen.", ["pulmonary"]),
      q("pathology", "Amyloid stains with Congo red showing:", ["Apple-green birefringence", "Prussian blue granules", "Gram positivity", "Acid-fast positivity"], "Apple-green birefringence", "Pathognomonic polarized light finding.", ["histology"]),
      q("pathology", "Dysplasia is best described as:", ["Disordered precancerous proliferation", "Reversible atrophy only", "Acute inflammation", "Normal metaplasia"], "Disordered precancerous proliferation", "Architectural and cytologic atypia.", ["neoplasia"]),
    ],
    pharmacology: [
      q("pharmacology", "Aspirin irreversibly inhibits:", ["COX-1 and COX-2", "Phospholipase A2 only", "Xanthine oxidase", "HMG-CoA reductase"], "COX-1 and COX-2", "Acetylation of cyclooxygenase enzymes.", ["NSAID"]),
      q("pharmacology", "Warfarin reduces synthesis of:", ["Factors II, VII, IX, X", "Factor VIII only", "Fibrinogen only", "Platelets"], "Factors II, VII, IX, X", "Vitamin K–dependent clotting factors.", ["anticoagulation"]),
      q("pharmacology", "Metformin lowers glucose primarily by:", ["Decreasing hepatic gluconeogenesis", "Stimulating insulin release", "Blocking SGLT2", "Increasing glucagon"], "Decreasing hepatic gluconeogenesis", "AMPK activation in liver.", ["diabetes"]),
      q("pharmacology", "Non-selective beta-blockers worsen asthma by:", ["Blocking β2 bronchodilation", "Increasing histamine", "Causing hyperkalemia", "Activating muscarinic receptors"], "Blocking β2 bronchodilation", "Bronchospasm risk in reactive airways.", ["respiratory"]),
      q("pharmacology", "Organophosphate poisoning is treated with atropine plus:", ["Pralidoxime", "Naloxone", "Flumazenil", "Physostigmine"], "Pralidoxime", "Reactivates acetylcholinesterase.", ["toxicology"]),
    ],
    biochemistry: [
      q("biochemistry", "Rate-limiting enzyme of glycolysis:", ["Phosphofructokinase-1", "Hexokinase only", "Pyruvate kinase only", "Aldolase"], "Phosphofructokinase-1", "Main regulated glycolytic step.", ["metabolism"]),
      q("biochemistry", "Von Gierke disease involves deficiency of:", ["Glucose-6-phosphatase", "Muscle phosphorylase", "Debranching enzyme", "Lysosomal maltase"], "Glucose-6-phosphatase", "Severe fasting hypoglycemia (GSD I).", ["genetics"]),
      q("biochemistry", "Urea cycle occurs primarily in:", ["Liver", "Kidney", "Muscle", "Pancreas"], "Liver", "Hepatic detoxification of ammonia.", ["metabolism"]),
      q("biochemistry", "Statins inhibit:", ["HMG-CoA reductase", "Lipoprotein lipase", "NPC1L1", "Cholesterol ester transfer protein"], "HMG-CoA reductase", "Rate-limiting step of cholesterol synthesis.", ["lipids"]),
    ],
    microbiology: [
      q("microbiology", "Staphylococcus aureus appears as:", ["Gram-positive cocci in clusters", "Gram-negative rods", "Acid-fast bacilli", "Spirochetes"], "Gram-positive cocci in clusters", "Catalase-positive, often coagulase-positive.", ["bacteriology"]),
      q("microbiology", "Type III hypersensitivity involves:", ["Immune complex deposition", "IgE mast cell degranulation only", "T-cell cytotoxicity only", "Complement deficiency only"], "Immune complex deposition", "Serum sickness, some GN patterns.", ["immunology"]),
      q("microbiology", "HIV primarily infects:", ["CD4+ T cells", "Neutrophils", "Erythrocytes", "Osteoclasts"], "CD4+ T cells", "gp120–CD4/co-receptor binding.", ["virology"]),
      q("microbiology", "Oral Sabin polio vaccine is:", ["Live attenuated", "Killed inactivated", "Subunit only", "Toxoid"], "Live attenuated", "OPV vs Salk IPV distinction.", ["vaccines"]),
    ],
    cardiology: [
      q("cardiology", "ST elevation in II, III, aVF suggests:", ["Inferior MI (usually RCA)", "Anteroseptal LAD infarct", "Lateral circumflex only", "RV strain only"], "Inferior MI (usually RCA)", "Inferior lead pattern.", ["ECG"]),
      q("cardiology", "Atrial fibrillation stroke risk is mainly from:", ["Left atrial thrombus", "Ventricular fibrillation", "Aortic dissection", "Pulmonary embolus only"], "Left atrial thrombus", "Stasis in atrium/appendage.", ["arrhythmia"]),
      q("cardiology", "Most sensitive early biomarker for MI:", ["Troponin", "LDH", "AST", "Amylase"], "Troponin", "High-sensitivity troponin standard.", ["ACS"]),
      q("cardiology", "Kussmaul respirations indicate:", ["Metabolic acidosis", "Metabolic alkalosis", "Hypercapnia without acidosis", "Opioid toxicity"], "Metabolic acidosis", "Deep rapid compensatory breathing.", ["clinical"]),
    ],
    pulmonology: [
      q("pulmonology", "Asthma pathophysiology centers on:", ["Bronchial hyperreactivity and inflammation", "Alveolar fibrosis only", "Pleural effusion only", "Pulmonary hypertension only"], "Bronchial hyperreactivity and inflammation", "Reversible airflow obstruction.", ["asthma"]),
      q("pulmonology", "V/Q mismatch in pulmonary embolism causes:", ["Increased dead space ventilation", "Shunt only", "Hyperventilation alkalosis only", "Restrictive pattern on PFT"], "Increased dead space ventilation", "Perfusion blocked, ventilation wasted.", ["PE"]),
      q("pulmonology", "Chronic CO2 retention in COPD leads to:", ["Compensated respiratory acidosis", "Metabolic alkalosis only", "Respiratory alkalosis", "Normal ABG always"], "Compensated respiratory acidosis", "Renal bicarbonate retention over time.", ["COPD"]),
    ],
    nephrology: [
      q("nephrology", "Most filtered glucose is reabsorbed in:", ["Proximal tubule", "Loop of Henle", "Distal tubule", "Collecting duct"], "Proximal tubule", "SGLT-mediated reabsorption.", ["renal"]),
      q("nephrology", "Metabolic acidosis with increased anion gap suggests:", ["Lactic acidosis or toxins", "Diarrhea only", "RTA type I only", "Hyperventilation"], "Lactic acidosis or toxins", "Unmeasured anions present.", ["acid-base"]),
      q("nephrology", "ACE inhibitors are contraindicated in bilateral renal artery stenosis because they:", ["Reduce GFR via efferent arteriole dilation", "Increase aldosterone only", "Cause hyperkalemia only", "Block ADH"], "Reduce GFR via efferent arteriole dilation", "Glomerular filtration pressure falls.", ["pharmacology"]),
    ],
    neurology: [
      q("neurology", "MLF lesion causes:", ["Internuclear ophthalmoplegia", "Homonymous hemianopia", "Facial nerve palsy only", "Cerebellar ataxia only"], "Internuclear ophthalmoplegia", "Impaired adduction on lateral gaze.", ["neuroanatomy"]),
      q("neurology", "Most common cause of ischemic stroke:", ["Large artery atherosclerosis or cardioembolism", "Subarachnoid hemorrhage", "Migraine only", "Vasculitis only"], "Large artery atherosclerosis or cardioembolism", "Etiology varies by population.", ["stroke"]),
      q("neurology", "First-line abortive for acute migraine:", ["Triptans (when no contraindication)", "Opioids routinely", "Antibiotics", "Benzodiazepines only"], "Triptans (when no contraindication)", "Serotonin agonists at 5-HT1B/1D.", ["headache"]),
    ],
    "internal-medicine": [
      q("internal-medicine", "First-line for uncomplicated HTN in many adults:", ["Thiazide, ACEi, ARB, or CCB", "Loop diuretic only", "Alpha blocker only", "Clonidine first"], "Thiazide, ACEi, ARB, or CCB", "Guideline-directed initial therapy.", ["hypertension"]),
      q("internal-medicine", "DKA features include:", ["Hyperglycemia, ketosis, anion gap acidosis", "Hypoglycemia only", "Hypernatremia only", "Respiratory alkalosis only"], "Hyperglycemia, ketosis, anion gap acidosis", "Insulin deficiency state.", ["endocrine"]),
      q("internal-medicine", "Cirrhosis with tense ascites — avoid:", ["Large-volume paracentesis without albumin if >5L", "Sodium restriction", "Spironolactone", "Lactulose for encephalopathy"], "Large-volume paracentesis without albumin if >5L", "Albumin replacement reduces circulatory dysfunction.", ["hepatology"]),
    ],
    pediatrics: [
      q("pediatrics", "Jaundice within first 24 hours of life suggests:", ["Hemolytic disease", "Physiologic jaundice", "Breast milk jaundice only", "Gilbert syndrome"], "Hemolytic disease", "Pathologic — evaluate hemolysis.", ["neonatal"]),
      q("pediatrics", "Epiglottitis classically associated with:", ["H. influenzae type b", "RSV only", "Rotavirus", "Adenovirus only"], "H. influenzae type b", "Reduced post-Hib vaccine but classic.", ["airway"]),
      q("pediatrics", "Kawasaki disease treatment includes:", ["IVIG and aspirin", "Antibiotics only", "Corticosteroids only", "No therapy"], "IVIG and aspirin", "Prevent coronary aneurysms.", ["rheumatology"]),
    ],
    obgyn: [
      q("obgyn", "Preeclampsia is defined by:", ["HTN after 20 weeks with proteinuria or end-organ damage", "HTN before pregnancy only", "Gestational diabetes only", "Placenta previa"], "HTN after 20 weeks with proteinuria or end-organ damage", "Pregnancy-specific hypertensive disorder.", ["obstetrics"]),
      q("obgyn", "First-line long-acting contraceptive with highest typical-use efficacy:", ["Implant or IUD", "Condoms only", "Spermicide only", "Withdrawal"], "Implant or IUD", "LARC methods most effective.", ["contraception"]),
      q("obgyn", "Postpartum hemorrhage most common cause:", ["Uterine atony", "Retained products only", "Cervical laceration only", "Coagulopathy only"], "Uterine atony", "Tone is leading cause (4 T's).", ["obstetrics"]),
    ],
    psychiatry: [
      q("psychiatry", "First-line pharmacotherapy for major depression often:", ["SSRI", "Benzodiazepine monotherapy", "Antipsychotic monotherapy", "Opioid"], "SSRI", "Guideline-supported initial antidepressant class.", ["mood"]),
      q("psychiatry", "Positive symptoms of schizophrenia include:", ["Hallucinations and delusions", "Flat affect only", "Avolition only", "Cognitive slowing only"], "Hallucinations and delusions", "Type I vs negative Type II symptoms.", ["psychosis"]),
      q("psychiatry", "Lithium requires monitoring for:", ["Renal and thyroid function", "Hearing only", "Liver failure only", "Platelet count only"], "Renal and thyroid function", "Nephrogenic DI and hypothyroidism risk.", ["bipolar"]),
    ],
    "emergency-medicine": [
      q("emergency-medicine", "Anaphylaxis first-line treatment:", ["IM epinephrine", "Oral antihistamine only", "IV antibiotics", "Observation only"], "IM epinephrine", "Alpha/beta effects reverse airway and hypotension.", ["allergy"]),
      q("emergency-medicine", "Tension pneumothorax immediate management:", ["Needle decompression", "Chest CT first", "ABG first", "Bronchodilator trial"], "Needle decompression", "Do not delay for imaging.", ["trauma"]),
      q("emergency-medicine", "ABCDE assessment prioritizes:", ["Airway first", "Circulation first", "Disability first", "Exposure first"], "Airway first", "Airway before breathing and circulation.", ["resuscitation"]),
    ],
  },
  nursing: {
    "management-of-care": [
      q("management-of-care", "When delegating to UAP, the nurse retains:", ["Accountability for overall care", "No responsibility", "Physician accountability only", "Pharmacy accountability"], "Accountability for overall care", "RN remains accountable; delegate appropriate tasks.", ["delegation"]),
      q("management-of-care", "Highest priority among four clients:", ["Unstable airway/breathing threat", "Routine medication refill", "Discharge teaching stable patient", "Chronic pain 2/10"], "Unstable airway/breathing threat", "Use ABCs and instability first.", ["prioritization"]),
      q("management-of-care", "Informed consent requires:", ["Understanding, voluntariness, capacity", "Only a signature", "Family agreement only", "Physician signature only"], "Understanding, voluntariness, capacity", "Elements of valid consent.", ["ethics"]),
    ],
    "safety-infection": [
      q("safety-infection", "Standard precautions apply to:", ["All patients regardless of diagnosis", "Only HIV patients", "Only isolation rooms", "Only surgical patients"], "All patients regardless of diagnosis", "Treat all blood/body fluids as potentially infectious.", ["infection"]),
      q("safety-infection", "C. difficile contact precautions emphasize:", ["Soap and water hand washing", "Alcohol gel alone", "No PPE", "Negative pressure only"], "Soap and water hand washing", "Spores resist alcohol; wash with soap/water.", ["isolation"]),
      q("safety-infection", "Sharps injury first action:", ["Wash area, report, evaluate exposure", "Ignore if minor", "Suture wound immediately", "Apply tourniquet"], "Wash area, report, evaluate exposure", "Institutional PEP protocols follow.", ["safety"]),
    ],
    "health-promotion": [
      q("health-promotion", "Adults 50+ routine screening includes:", ["Colorectal cancer screening", "Bone density every month", "Daily chest X-ray", "Weekly ECG"], "Colorectal cancer screening", "Age-appropriate preventive guidelines.", ["screening"]),
      q("health-promotion", "Motivational interviewing focuses on:", ["Client-centered change talk", "Authoritarian directives", "Punishment for nonadherence", "Avoiding goal setting"], "Client-centered change talk", "Elicit patient's own reasons for change.", ["counseling"]),
    ],
    psychosocial: [
      q("psychosocial", "Therapeutic communication with angry client:", ["Calm presence, active listening, set limits", "Argue to prove point", "Leave without handoff", "Minimize concerns"], "Calm presence, active listening, set limits", "De-escalation and safety.", ["communication"]),
      q("psychosocial", "Suspected intimate partner violence — nurse should:", ["Assess safety privately, offer resources", "Confront partner immediately", "Document vaguely only", "Ignore if patient denies"], "Assess safety privately, offer resources", "Mandatory reporting per state law; safety planning.", ["abuse"]),
    ],
    "pharmacology-nursing": [
      q("pharmacology-nursing", "Rights of medication administration include:", ["Right patient, drug, dose, route, time", "Right physician only", "Right pharmacy only", "Right cost"], "Right patient, drug, dose, route, time", "Five (or more) rights reduce errors.", ["medication"]),
      q("pharmacology-nursing", "Regular insulin given IV is:", ["Rapid acting", "Long acting", "Intermediate only", "Not usable IV"], "Rapid acting", "Only regular insulin is given IV.", ["insulin"]),
      q("pharmacology-nursing", "Warfarin teaching includes avoiding:", ["Sudden vitamin K intake changes", "All fluids", "Walking", "BP monitoring"], "Sudden vitamin K intake changes", "Diet consistency affects INR.", ["anticoagulation"]),
      q("pharmacology-nursing", "Opioid toxicity sign:", ["Respiratory depression", "Hypertension", "Tachycardia only", "Diuresis"], "Respiratory depression", "Have naloxone available per protocol.", ["opioid"]),
    ],
    "basic-care-comfort": [
      q("basic-care-comfort", "Pressure injury prevention includes:", ["Regular repositioning and moisture management", "Massage over bony prominences", "Restrict all fluids", "Keep patient in one position"], "Regular repositioning and moisture management", "Braden scale guides interventions.", ["skin"]),
      q("basic-care-comfort", "Sleep hygiene teaching includes:", ["Consistent schedule, limit caffeine", "Heavy meals before bed", "Bright screens at bedtime", "Irregular naps all day"], "Consistent schedule, limit caffeine", "Nonpharmacologic sleep promotion.", ["comfort"]),
    ],
    "reduction-risk": [
      q("reduction-risk", "Before thoracentesis, nurse verifies:", ["Informed consent and coagulation status", "Hair washed", "NPO for 24 hours always", "Chest X-ray after only"], "Informed consent and coagulation status", "Risk reduction before invasive procedure.", ["procedures"]),
      q("reduction-risk", "Post-op ileus suspicion — assess:", ["Absent bowel sounds, distension", "Brisk diarrhea only", "Hyperactive reflexes only", "Petechiae"], "Absent bowel sounds, distension", "Monitor return of bowel function.", ["postoperative"]),
    ],
    "physiological-adaptation": [
      q("physiological-adaptation", "Heart failure exacerbation — daily weight gain >2 lb suggests:", ["Fluid retention", "Muscle gain", "Dehydration", "Medication adherence only"], "Fluid retention", "Track fluid status at home.", ["heart failure"]),
      q("physiological-adaptation", "Septic shock early intervention includes:", ["IV fluids and antibiotics per protocol", "Oral fluids only", "Delay antibiotics for culture only", "Sedation without fluids"], "IV fluids and antibiotics per protocol", "Surviving sepsis bundles emphasize early treatment.", ["sepsis"]),
    ],
    fundamentals: [
      q("fundamentals", "First step in ABCDE is:", ["Airway", "Breathing", "Circulation", "Disability"], "Airway", "Airway patency before other interventions.", ["assessment"]),
      q("fundamentals", "Orthostatic vitals compare:", ["Supine, sitting, standing BP/HR", "Only one position", "Temperature only", "Pain scale only"], "Supine, sitting, standing BP/HR", "Detect volume depletion.", ["vitals"]),
    ],
    "med-surg": [
      q("med-surg", "Post-op deep breathing prevents:", ["Atelectasis", "Hypertension only", "Hyperglycemia only", "Constipation only"], "Atelectasis", "Incentive spirometry and coughing.", ["postoperative"]),
      q("med-surg", "Diabetic foot ulcer care emphasizes:", ["Offloading and glycemic control", "Warm soaks twice daily", "Tight shoes", "Ignore neuropathy"], "Offloading and glycemic control", "Multidisciplinary wound management.", ["diabetes"]),
    ],
    "maternal-child": [
      q("maternal-child", "Active labor with ruptured membranes — avoid:", ["Vaginal exams if not indicated / infection risk awareness", "Fetal monitoring", "IV access", "Position changes"], "Vaginal exams if not indicated / infection risk awareness", "Minimize infection risk; facility protocol.", ["labor"]),
      q("maternal-child", "Postpartum fundus should be:", ["Firm, at or below umbilicus early postpartum", "Above umbilicus and boggy", "Not palpable", "Laterally displaced always"], "Firm, at or below umbilicus early postpartum", "Boggy fundus suggests hemorrhage.", ["postpartum"]),
    ],
    "pediatrics-nursing": [
      q("pediatrics-nursing", "Febrile infant <60 days requires:", ["Urgent evaluation for serious bacterial infection", "Only tepid sponging at home", "Aspirin", "No assessment"], "Urgent evaluation for serious bacterial infection", "Age-specific fever guidelines.", ["pediatric"]),
      q("pediatrics-nursing", "Child dehydration — best early sign:", ["Decreased urine output, dry mucous membranes", "Hypertension", "Bradycardia only", "Weight gain"], "Decreased urine output, dry mucous membranes", "Assess hydration status.", ["fluids"]),
    ],
  },
  pharmacy: {
    pharmacokinetics: [
      q("pharmacokinetics", "First-pass metabolism occurs mainly in:", ["Liver", "Kidney", "Lung only", "Skin"], "Liver", "Reduces oral bioavailability.", ["ADME"]),
      q("pharmacokinetics", "Half-life is the time for:", ["Plasma concentration to fall 50%", "Complete elimination", "Peak level only", "Steady state in one dose"], "Plasma concentration to fall 50%", "One half-life = 50% remaining.", ["kinetics"]),
      q("pharmacokinetics", "Therapeutic drug monitoring is critical for:", ["Narrow therapeutic index drugs like digoxin", "All OTC vitamins", "Multivitamins only", "Topical hydrocortisone only"], "Narrow therapeutic index drugs like digoxin", "NTI drugs need level monitoring.", ["monitoring"]),
    ],
    pharmacology: [
      q("pharmacology", "Beta-1 selective blocker example:", ["Metoprolol", "Propranolol", "Carvedilol only non-selective", "Labetalol only"], "Metoprolol", "Cardioselective at low doses.", ["autonomic"]),
      q("pharmacology", "ACE inhibitor common dry cough due to:", ["Increased bradykinin", "Histamine only", "Zinc deficiency only", "Beta blockade"], "Increased bradykinin", "Switch to ARB if intolerable.", ["cardiovascular"]),
    ],
    pharmaceutics: [
      q("pharmaceutics", "Extended-release tablets should be:", ["Swallowed whole unless scored for splitting", "Crushed always", "Chewed for faster effect", "Dissolved in IV fluid routinely"], "Swallowed whole unless scored for splitting", "Crushing can dose-dump.", ["formulation"]),
      q("pharmaceutics", "Suspensions require:", ["Shake well before dispensing/use", "No labeling", "Refrigeration always", "Filter before shaking"], "Shake well before dispensing/use", "Uniform dose distribution.", ["compounding"]),
    ],
    "compounding-calculations": [
      q("compounding-calculations", "How many mg in 5 mL of 2% (w/v) solution?", ["100 mg", "10 mg", "50 mg", "200 mg"], "100 mg", "2 g/100 mL = 20 mg/mL × 5 mL = 100 mg.", ["dosing"]),
      q("compounding-calculations", "Alligation is used to:", ["Mix two strengths to target concentration", "Calculate renal clearance", "Determine protein binding", "Measure viscosity only"], "Mix two strengths to target concentration", "Pharmacy calculation method.", ["alligation"]),
    ],
    "cardiovascular-rx": [
      q("cardiovascular-rx", "HFrEF GDMT includes:", ["ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i", "CCB routine first line", "Thiazolidinedione first", "Alpha agonist first"], "ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i", "Guideline-directed medical therapy.", ["heart failure"]),
      q("cardiovascular-rx", "Warfarin interacts with foods rich in:", ["Vitamin K", "Vitamin C only", "Iron only", "Calcium only"], "Vitamin K", "Counsel consistent green vegetable intake.", ["interaction"]),
    ],
    "infectious-disease-rx": [
      q("infectious-disease-rx", "MRSA skin infection oral option may include:", ["TMP-SMX or doxycycline (context-dependent)", "Amoxicillin alone", "Metronidazole only", "Fluconazole"], "TMP-SMX or doxycycline (context-dependent)", "Local resistance patterns guide choice.", ["antibiotic"]),
      q("infectious-disease-rx", "Azithromycin Z-pack is commonly used for:", ["Community-acquired pneumonia (outpatient)", "MRSA bacteremia", "C. difficile", "Fungal infection"], "Community-acquired pneumonia (outpatient)", "Macrolide outpatient CAP therapy per guidelines.", ["respiratory"]),
    ],
    "endocrine-rx": [
      q("endocrine-rx", "Insulin glargine is:", ["Long-acting basal insulin", "Rapid bolus only", "Inhaled only", "Oral tablet"], "Long-acting basal insulin", "Once-daily basal coverage.", ["diabetes"]),
      q("endocrine-rx", "Metformin contraindicated with:", ["eGFR below guideline threshold", "Hypertension", "Hyperlipidemia", "Mild allergy"], "eGFR below guideline threshold", "Lactic acidosis risk in renal failure.", ["diabetes"]),
    ],
    "cns-rx": [
      q("cns-rx", "SSRI discontinuation syndrome prevented by:", ["Gradual taper", "Abrupt stop", "Doubling dose at end", "Adding MAOI immediately"], "Gradual taper", "Taper to reduce withdrawal.", ["psychiatric"]),
      q("cns-rx", "Benzodiazepines enhance GABA at:", ["GABA-A receptor", "GABA-B only", "NMDA receptor", "Mu opioid receptor"], "GABA-A receptor", "CNS sedative mechanism.", ["CNS"]),
    ],
    "oncology-rx": [
      q("oncology-rx", "Chemotherapy-induced emesis — 5-HT3 antagonist example:", ["Ondansetron", "Metformin", "Warfarin", "Atorvastatin"], "Ondansetron", "Antiemetic for CINV.", ["supportive"]),
      q("oncology-rx", "Febrile neutropenia requires:", ["Urgent antibiotics and evaluation", "OTC analgesic only", "Wait 1 week", "Stop all meds without contact"], "Urgent antibiotics and evaluation", "Oncologic emergency.", ["neutropenia"]),
    ],
    "otc-self-care": [
      q("otc-self-care", "Acetaminophen toxicity antidote:", ["N-acetylcysteine", "Naloxone", "Flumazenil", "Atropine"], "N-acetylcysteine", "Replenish glutathione within hours.", ["toxicology"]),
      q("otc-self-care", "First-generation antihistamines cause:", ["Sedation and anticholinergic effects", "No side effects", "Hypertension only", "Diuresis"], "Sedation and anticholinergic effects", "Counsel on driving and elderly risk.", ["OTC"]),
    ],
    "patient-counseling": [
      q("patient-counseling", "Teach-back method assesses:", ["Patient understanding", "Pharmacist spelling", "Insurance status", "Wholesale cost"], "Patient understanding", "Confirm comprehension of instructions.", ["communication"]),
      q("patient-counseling", "Inhaler technique — spacer improves:", ["Lung deposition and reduces oropharyngeal deposition", "Taste only", "Cost only", "Shelf life"], "Lung deposition and reduces oropharyngeal deposition", "Especially for ICS.", ["respiratory"]),
    ],
    "pharmacy-law": [
      q("pharmacy-law", "Schedule II controlled substances require:", ["Written/electronic prescription per federal/state rules", "No prescription", "Verbal refill unlimited", "OTC sale"], "Written/electronic prescription per federal/state rules", "No refills; strict documentation.", ["DEA"]),
      q("pharmacy-law", "HIPAA allows disclosure without authorization for:", ["Treatment, payment, operations (TPO)", "Marketing to third parties freely", "Social media posting", "Sale of data"], "Treatment, payment, operations (TPO)", "Privacy rule permitted uses.", ["privacy"]),
    ],
  },
};

/** Flatten all items for a field+subject */
export function getHealthBankItems(
  fieldId: string,
  subjectId: string
): BankItem[] {
  const field = HEALTH_QUESTION_BANK[fieldId];
  if (!field) return [];
  return field[subjectId] ?? [];
}

/** All subject ids that have at least one question */
export function getHealthBankSubjectIds(fieldId: string): string[] {
  const field = HEALTH_QUESTION_BANK[fieldId];
  if (!field) return [];
  return Object.keys(field).filter((k) => field[k].length > 0);
}
