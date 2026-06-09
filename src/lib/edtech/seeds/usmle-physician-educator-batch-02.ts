/**
 * Curated USMLE-style vignettes — batch 02 (NBME/UWorld editorial tone).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { usmleVignette } from "@/lib/exam-prep/usmle-seed-factory";

const opts5 = (
  a: string,
  b: string,
  c: string,
  d: string,
  e: string
): [string, string, string, string, string] => [a, b, c, d, e];

const BATCH = "physician-educator-batch-02";

export const USMLE_PHYSICIAN_EDUCATOR_BATCH_02: EnrichedBankItem[] = [
  usmleVignette(
    "pulmonology",
    `A 62-year-old woman with recently diagnosed breast cancer is sent to the emergency department from oncology clinic because she became light-headed while waiting for labs. She reports two days of mild right calf aching but denies chest pain. She received her first dose of chemotherapy one week ago and has been less mobile. She does not smoke. Temperature 37.2°C (99.0°F), blood pressure 94/60 mm Hg, pulse 118/min, respirations 22/min, oxygen saturation 89% on room air. Lungs are clear. Heart sounds are tachycardic without murmurs. The right calf is swollen and tender. Laboratory studies show:
Hemoglobin 11.4 g/dL · WBC 6,800/mm³ · platelets 210,000/mm³ · creatinine 1.0 mg/dL · lactate 2.1 mmol/L · troponin I 0.04 ng/mL (reference <0.04)`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Ventilation-perfusion scan",
      "CT pulmonary angiography",
      "Lower extremity Doppler ultrasonography only",
      "Intravenous heparin infusion after confirming diagnosis with imaging",
      "Two sets of blood cultures and empiric antibiotics"
    ),
    "CT pulmonary angiography",
    `Active cancer, immobilization, unilateral leg swelling, tachycardia, hypoxemia, and hypotension make pulmonary embolism likely despite clear lungs. CTPA confirms PE and guides anticoagulation when contrast is feasible. V/Q scan is second-line if contrast is contraindicated. Leg Doppler alone does not evaluate the lungs. Anticoagulation follows diagnosis unless instability mandates immediate treatment while imaging is arranged. Blood cultures target sepsis, which is less likely here.`,
    {
      blueprintDomain: "Respiratory",
      stepLevel: "step2",
      difficulty: 5,
      tags: ["PE", "oncology", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "hepatology",
    `A 19-year-old man is evaluated for tremor and declining school performance over eight months. His sister was told she had "liver problems" as a teenager but details are unknown. He drinks alcohol only on weekends and denies illicit drugs. Exam shows a fine resting tremor, mild slurred speech, and subtle sunburst pigmentation at the limbus. AST 88 U/L, ALT 72 U/L, alkaline phosphatase 92 U/L, total bilirubin 1.1 mg/dL, albumin 3.6 g/dL, INR 1.1. Ceruloplasmin 8 mg/dL (reference 20–60). 24-hour urinary copper is elevated.`,
    "Which of the following is the most likely underlying defect?",
    opts5(
      "Deficient α1-antitrypsin activity",
      "Copper-transporting ATPase dysfunction",
      "HFE gene mutation",
      "Autoimmune destruction of intrahepatic bile ducts",
      "Hepatic uroporphyrinogen decarboxylase deficiency"
    ),
    "Copper-transporting ATPase dysfunction",
    `Low ceruloplasmin, elevated urinary copper, neuropsychiatric symptoms, and Kayser-Fleischer rings in a young patient indicate Wilson disease (ATP7B). α1-AT deficiency presents with emphysema/liver disease in different patterns. HFE hemochromatosis causes iron overload. Primary biliary cholangitis affects middle-aged women with AMA positivity. Porphyria cutanea tarda causes photosensitivity, not basal ganglia tremor.`,
    {
      blueprintDomain: "GI",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["Wilson", "genetics", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "pediatrics",
    `A 4-day-old boy is brought to the clinic because "he looks yellow." He was born at 38 weeks via spontaneous vaginal delivery and discharged at 36 hours. Breastfeeding has been difficult; he feeds every 2–3 hours but the mother feels he is sleepy at the breast. Stools are yellow and seedy; urine is dark yellow. Weight is 6% below birth weight. Exam shows jaundice to the knees. Sclerae are icteric; liver span is normal; no hepatosplenomegaly.
Total bilirubin 16.8 mg/dL · direct bilirubin 0.9 mg/dL · hematocrit 52% · reticulocyte count 0.8%`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Reassurance and follow-up in one week",
      "Phenobarbital to increase conjugation",
      "Phototherapy and increased feeding support",
      "Immediate exchange transfusion",
      "Discontinue breastfeeding permanently"
    ),
    "Phototherapy and increased feeding support",
    `Term infant day 4 with predominantly indirect hyperbilirubinemia at a level warranting phototherapy, poor feeding, weight loss, and concentrated urine suggesting inadequate milk transfer. Phototherapy lowers bilirubin; feeding support addresses the underlying cause. Reassurance is unsafe. Phenobarbital is not standard. Exchange transfusion is for much higher levels or acute bilirubin encephalopathy. Breastfeeding should be optimized, not stopped abruptly.`,
    {
      blueprintDomain: "Pediatrics",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["neonatal-jaundice", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "obgyn",
    `A 31-year-old woman, G1P0 at 34 weeks gestation, comes to labor and delivery with a headache she describes as "the worst of my life." She also notes right upper quadrant pain and sees "spots" in her vision. Blood pressure 168/112 mm Hg, pulse 92/min. Deep tendon reflexes are brisk with ankle clonus. Urinalysis shows 3+ protein. Platelet count 98,000/mm³, AST 210 U/L, ALT 198 U/L, creatinine 1.3 mg/dL.`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Oral labetalol and outpatient follow-up in 48 hours",
      "Magnesium sulfate and plan for delivery",
      "Immediate cesarean delivery without stabilization",
      "Expectant management until 37 weeks",
      "Low-dose aspirin initiation"
    ),
    "Magnesium sulfate and plan for delivery",
    `Severe preeclampsia at 34 weeks with severe BP, symptoms, thrombocytopenia, transaminitis, and renal involvement requires magnesium for seizure prophylaxis and delivery as definitive therapy. Outpatient therapy is unsafe. Cesarean may be needed but stabilization comes first. Expectant management is contraindicated with severe features. Aspirin is preventive, not acute treatment.`,
    {
      blueprintDomain: "Reproductive",
      stepLevel: "step2",
      difficulty: 5,
      tags: ["preeclampsia", "OB", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "pharmacology",
    `A 58-year-old man with hyperlipidemia and community-acquired pneumonia is prescribed azithromycin by his primary care physician. His other medications include atorvastatin 40 mg nightly, amlodipine, and omeprazole. Three days later he develops diffuse myalgias, dark urine, and weakness. Creatine kinase 12,400 U/L, potassium 5.6 mEq/L, creatinine 2.2 mg/dL (baseline 1.0).`,
    "Which of the following best explains this patient’s presentation?",
    opts5(
      "Direct hepatotoxicity from azithromycin causing acute liver failure",
      "Inhibition of CYP3A4 leading to increased statin levels and rhabdomyolysis",
      "Immune-mediated thrombotic microangiopathy from statin therapy",
      "Type IV hypersensitivity to amlodipine",
      "Pneumonia-related myositis from Mycoplasma infection alone"
    ),
    "Inhibition of CYP3A4 leading to increased statin levels and rhabdomyolysis",
    `Macrolides inhibit CYP3A4, raising statin exposure and causing rhabdomyolysis (marked CK elevation, myalgias, AKI). Azithromycin is a weaker inhibitor than erythromycin but interaction remains plausible. Hepatotoxicity would not explain CK >10,000. TTP shows schistocytes and neurologic findings. Amlodipine hypersensitivity is not this presentation. Mycoplasma myositis alone does not fit the statin-interaction timeline.`,
    {
      blueprintDomain: "General Principles",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["drug-interaction", "statin", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "neurology",
    `An 82-year-old man is found on the floor by his daughter after "tripping on the rug." He takes warfarin for atrial fibrillation. He was alert when EMS arrived but in the ED becomes progressively somnolent over two hours. Pupils are equal; he localizes to pain on the right and withdraws poorly on the left. CT head without contrast shows a crescent-shaped hypodense collection with midline shift.`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Observation and repeat CT in 24 hours",
      "Mannitol alone and neuro checks every 4 hours",
      "Neurosurgical evacuation",
      "Immediate tPA administration",
      "Lumbar puncture to exclude meningitis"
    ),
    "Neurosurgical evacuation",
    `Subdural hematoma with declining mental status and midline shift in an anticoagulated elderly patient requires urgent neurosurgical evaluation and likely evacuation. Observation risks herniation. Mannitol is temporizing only. tPA is contraindicated. LP is dangerous with mass effect.`,
    {
      blueprintDomain: "Nervous",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["subdural", "neurosurgery", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "psychiatry",
    `A 72-year-old woman is brought by her son because she has been "confused and wobbly" for a week. She started sertraline 25 mg daily two weeks ago for low mood after her husband's death. She takes hydrochlorothiazide for hypertension. Sodium 118 mEq/L, serum osmolality 265 mOsm/kg, urine osmolality 420 mOsm/kg, urine sodium 45 mEq/L. TSH normal. Adrenal axis normal.`,
    "Which of the following is the most likely diagnosis?",
    opts5(
      "Psychogenic polydipsia",
      "Syndrome of inappropriate ADH secretion",
      "Primary adrenal insufficiency",
      "Reset osmostat from chronic heart failure",
      "Hyperglycemic hyperosmolar state"
    ),
    "Syndrome of inappropriate ADH secretion",
    `Euvolemic hyponatremia with inappropriately concentrated urine after SSRI initiation is classic SIADH. Psychogenic polydipsia dilutes urine. Adrenal insufficiency shows hyperkalemia and hypotension. Heart failure is hypervolemic. HHS presents with marked hyperglycemia.`,
    {
      blueprintDomain: "Behavioral Health",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["SIADH", "SSRI", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "biostatistics",
    `A randomized trial of Drug X versus placebo for preventing stroke in 4,000 patients reports 40 strokes in the treatment group and 80 strokes in the placebo group over two years (2,000 patients per arm).`,
    "Which of the following is the most appropriate estimate of the number needed to treat (NNT) over two years to prevent one stroke?",
    opts5("25", "50", "100", "200", "400"),
    "50",
    `Treatment event rate 40/2000 = 2%; placebo 80/2000 = 4%. Absolute risk reduction = 2%. NNT = 1/0.02 = 50. Answer 25 implies 4% ARR; 100/200/400 overestimate NNT.`,
    {
      blueprintDomain: "General Principles",
      stepLevel: "step1",
      difficulty: 3,
      tags: ["biostatistics", "NNT", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "cardiology",
    `A 36-year-old man who injects heroin presents with two weeks of fevers, chills, and malaise. Temperature 38.7°C (101.7°F). Exam shows a new early diastolic murmur at the left sternal border, splinter hemorrhages, and tender nodules on finger pads. Blood cultures are pending. Transthoracic echocardiogram shows possible valvular vegetation; image quality is limited.`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Repeat blood cultures in one week if symptoms persist",
      "Start vancomycin and ceftriaxone after obtaining three blood culture sets, and obtain transesophageal echocardiography",
      "Oral amoxicillin for endocarditis prophylaxis",
      "Rheumatology referral for vasculitis workup first",
      "Immediate valve replacement without antibiotics"
    ),
    "Start vancomycin and ceftriaxone after obtaining three blood culture sets, and obtain transesophageal echocardiography",
    `High suspicion for infective endocarditis in an IVDU with fever, new murmur, and peripheral stigmata. Obtain multiple blood culture sets, start empiric IV antibiotics covering staphylococci and streptococci, and pursue TEE for vegetation assessment. Delaying treatment is harmful. Prophylaxis is not curative therapy. Vasculitis is less likely with this constellation. Surgery requires diagnosis and antibiotics first except in fulminant instability.`,
    {
      blueprintDomain: "Cardiovascular",
      stepLevel: "step2",
      difficulty: 5,
      tags: ["endocarditis", "IVDU", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "nephrology",
    `A 3-year-old girl develops bloody diarrhea after attending a cookout. Five days later she becomes pale and irritable. Exam shows mild abdominal tenderness without rebound. Hgb 7.2 g/dL, platelets 45,000/mm³, creatinine 2.8 mg/dL, LDH elevated. Peripheral smear shows schistocytes. Stool culture grows a Shiga-toxin–producing organism.`,
    "Which of the following is the most likely pathophysiology of her renal failure?",
    opts5(
      "Immune complex deposition in glomerular basement membrane",
      "Thrombotic microangiopathy from endothelial injury",
      "Acute tubular necrosis from prolonged hypotension only",
      "Post-infectious IgA mesangial proliferation",
      "Renal vein thrombosis from nephrotic syndrome"
    ),
    "Thrombotic microangiopathy from endothelial injury",
    `STEC-HUS presents with microangiopathic hemolytic anemia (schistocytes), thrombocytopenia, and AKI due to thrombotic microangiopathy from endothelial injury. Immune complex GN and IgA nephropathy do not fit the acute TMA picture. Isolated ATN does not explain schistocytes. Nephrotic syndrome is not the primary process.`,
    {
      blueprintDomain: "Renal/Urinary",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["HUS", "STEC", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "surgery",
    `A 70-year-old man with prior open cholecystectomy presents with crampy abdominal pain and bilious vomiting for 24 hours. He has not passed flatus for 12 hours. Abdomen is distended with high-pitched bowel sounds. Vital signs are stable. CT abdomen shows dilated small bowel loops with a transition point in the mid ileum and collapsed colon.`,
    "Which of the following is the most likely diagnosis?",
    opts5(
      "Ileus from opioid use",
      "Small bowel obstruction from adhesions",
      "Acute mesenteric ischemia",
      "Large bowel obstruction from sigmoid volvulus",
      "Perforated peptic ulcer"
    ),
    "Small bowel obstruction from adhesions",
    `Prior abdominal surgery, bilious vomiting, distension, and a transition point on CT indicate adhesive small bowel obstruction. Ileus lacks a transition point. Mesenteric ischemia often has pain out of proportion and ischemic CT findings. Sigmoid volvulus shows colonic dilation. Perforation shows free air.`,
    {
      blueprintDomain: "GI",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["SBO", "adhesions", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "ethics",
    `A 58-year-old man with newly diagnosed metastatic pancreatic cancer asks his oncologist, "Am I going to die soon?" He is alert, understands his diagnosis, and has no cognitive impairment. His wife asks the team not to tell him "anything upsetting" because "he doesn't handle stress well."`,
    "Which of the following is the most appropriate response?",
    opts5(
      "Tell the wife you will withhold prognosis details at her request",
      "Ask the patient what he wants to know about his illness and disclose information accordingly",
      "Refuse to discuss prognosis until the wife agrees",
      "Document the conversation and defer all discussions until psychiatry clears him",
      "Provide full statistical survival data without first exploring the patient's preferences"
    ),
    "Ask the patient what he wants to know about his illness and disclose information accordingly",
    `A capacitated patient has the right to information about his care. Ask-tell-ask respects autonomy and tailors disclosure. Family preferences do not override patient autonomy. Psychiatry is not indicated without cognitive impairment. Data dumping without exploring readiness harms the therapeutic relationship.`,
    {
      blueprintDomain: "Social Sciences",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["ethics", "communication", "physician-educator", BATCH],
    }
  ),
];
