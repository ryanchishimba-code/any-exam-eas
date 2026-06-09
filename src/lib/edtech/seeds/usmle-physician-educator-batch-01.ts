/**
 * Curated USMLE-style vignettes — physician-educator tone, import-ready via sync-question-bank.
 * fieldId: usmle-step-1 | usmle-step-2 (see stepLevel on each item)
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

export const USMLE_PHYSICIAN_EDUCATOR_BATCH_01: EnrichedBankItem[] = [
  usmleVignette(
    "nephrology",
    `A 68-year-old man with type 2 diabetes and hypertension is brought from a skilled nursing facility because he has been "sleepier than usual" for two days. His nurse noticed he missed two dialysis sessions last week while recovering from a urinary tract infection treated with trimethoprim-sulfamethoxazole. He takes lisinopril, amlodipine, and insulin glargine. On arrival he is oriented only to person. Blood pressure 102/58 mm Hg, pulse 58/min, respirations 22/min. Lungs are clear. There is 2+ pitting edema to the mid-shin. Laboratory studies show:
Na⁺ 134 mEq/L · K⁺ 6.8 mEq/L · Cl⁻ 98 mEq/L · HCO₃⁻ 16 mEq/L · BUN 89 mg/dL · creatinine 4.1 mg/dL (baseline 1.9) · glucose 142 mg/dL
ECG: peaked T waves, widened QRS`,
    "Which of the following is the most appropriate immediate management?",
    opts5(
      "Intravenous calcium gluconate",
      "Oral sodium polystyrene sulfonate",
      "Intravenous furosemide alone",
      "Emergent hemodialysis without stabilization",
      "Subcutaneous insulin and dextrose only"
    ),
    "Intravenous calcium gluconate",
    `This patient has life-threatening hyperkalemia (K⁺ 6.8, ECG changes) on top of AKI in a dialysis-dependent context. Membrane stabilization with IV calcium is the first step before shifting K⁺ intracellularly (insulin/dextrose, β-agonist) or removing K⁺ (diuretics if urine output exists, patiromer/PSP if appropriate, dialysis). Furosemide alone will not act quickly enough with probable oliguria. Dialysis is likely needed but not before stabilizing the myocardium.`,
    {
      blueprintDomain: "Renal/Urinary",
      stepLevel: "step2",
      difficulty: 5,
      tags: ["hyperkalemia", "dialysis", "AKI", "ECG", "physician-educator"],
    }
  ),

  usmleVignette(
    "pharmacology",
    `A 34-year-old woman with rheumatoid arthritis comes to clinic for a medication check. She was started on methotrexate 15 mg orally once weekly and folic acid 1 mg daily six weeks ago. She reports painful mouth sores and increased fatigue but denies fever, cough, or dysuria. Exam shows several shallow oral ulcers and mild splenomegaly. Labs:
WBC 3.2 × 10³/µL · Hgb 10.8 g/dL · MCV 98 fL · platelets 118 × 10³/µL · AST 62 U/L · ALT 58 U/L · creatinine 0.9 mg/dL
Chest radiograph: clear`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Increase folic acid to 5 mg daily",
      "Add trimethoprim-sulfamethoxazole prophylaxis",
      "Hold methotrexate and obtain hepatitis serologies",
      "Switch to leflunomide immediately",
      "Administer folinic acid rescue and continue methotrexate unchanged"
    ),
    "Hold methotrexate and obtain hepatitis serologies",
    `Methotrexate commonly causes stomatitis and cytopenias; holding the drug while evaluating for toxicity vs intercurrent infection is appropriate. Folic acid reduces but does not eliminate MTX mucosal toxicity—dose adjustment/hold comes first. TMP-SMX plus MTX increases pancytopenia risk and is not indicated without PCP prophylaxis indication. Folinic acid rescue is for high-dose MTX regimens, not low-dose RA therapy. Hepatitis serologies are part of baseline/monitoring when LFTs rise.`,
    {
      blueprintDomain: "Musculoskeletal",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["methotrexate", "RA", "toxicity", "physician-educator"],
    }
  ),

  usmleVignette(
    "pediatrics",
    `A 3-year-old boy is brought to the office in December with three days of runny nose and cough. His mother says he "sounds wheezy at night." He attends daycare and several classmates are sick. He has no fever today, is drinking well, and is playful in the exam room. Temperature 37.4°C (99.3°F), RR 28/min, O₂ sat 98% on room air. TMs mildly dull without bulging. Throat mildly erythematous. Scattered expiratory wheezes; no retractions. Rapid influenza A/B: negative. Rapid strep: negative.`,
    "Which of the following is the most appropriate management?",
    opts5(
      "Azithromycin for 5 days",
      "Amoxicillin-clavulanate for 10 days",
      "Albuterol inhaler with spacer as needed",
      "Oral prednisolone for 5 days",
      "Chest radiograph and blood cultures"
    ),
    "Albuterol inhaler with spacer as needed",
    `Well-appearing child with viral upper respiratory symptoms and mild reactive airways (expiratory wheeze, no hypoxia/distress) — supportive care with bronchodilator PRN is standard. Antibiotics are not indicated without bacterial focus (otitis with bulging TM, pneumonia, strep pharyngitis). Prednisone is reserved for moderate-severe wheeze or asthma exacerbation, not mild viral wheeze in a comfortable toddler.`,
    {
      blueprintDomain: "Pediatrics",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["bronchiolitis", "viral-URI", "wheeze", "physician-educator"],
    }
  ),

  usmleVignette(
    "hematology",
    `A 22-year-old college student develops dark urine and fatigue two days after eating at a campus buffet while visiting friends in Nigeria. He denies recent medications except ibuprofen for a headache. Exam: scleral icterus, no hepatomegaly. Labs:
Hgb 9.4 g/dL · reticulocytes 4.2% · LDH 420 U/L · haptoglobin undetectable · indirect bilirubin 3.8 mg/dL · AST 32 · ALT 28
Peripheral smear: bite cells and Heinz bodies`,
    "Which of the following is the most likely underlying defect?",
    opts5(
      "Spectrin deficiency",
      "Glucose-6-phosphate dehydrogenase deficiency",
      "Factor V Leiden mutation",
      "ADAMTS13 deficiency",
      "Pyruvate kinase deficiency"
    ),
    "Glucose-6-phosphate dehydrogenase deficiency",
    `Oxidant stress (fava beans/classically, infection, sulfa drugs, antimalarials) triggering intravascular hemolysis with bite cells/Heinz bodies is classic G6PD. Spectrin/hereditary spherocytosis shows spherocytes without Heinz bodies. ADAMTS13 causes TTP (schistocytes, neuro symptoms). Factor V Leiden is thrombophilia, not hemolysis.`,
    {
      blueprintDomain: "Blood/Lymph",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["G6PD", "hemolysis", "bite-cells", "physician-educator"],
    }
  ),

  usmleVignette(
    "obgyn",
    `A 26-year-old woman, G2P1, at 7 weeks gestation by last menstrual period presents with sharp left lower quadrant pain and light vaginal spotting for six hours. She has no medical problems. Last pregnancy was an uncomplicated vaginal delivery. BP 118/72, pulse 88/min. Abdomen soft with left adnexal tenderness; no guarding. Transvaginal ultrasound: empty uterus; left adnexal mass 2.1 cm with surrounding free fluid; no intrauterine gestational sac. β-hCG 2,400 mIU/mL (discriminatory zone)`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Repeat β-hCG in 48 hours and reassess",
      "Methotrexate intramuscular injection",
      "Diagnostic laparoscopy",
      "Expectant management with bed rest",
      "Dilation and curettage"
    ),
    "Methotrexate intramuscular injection",
    `Stable patient with unruptured ectopic pregnancy, β-hCG below common protocol thresholds, mass <3.5–4 cm, no fetal cardiac activity — criteria often met for systemic methotrexate. Laparoscopy is for rupture, hemodynamic instability, or MTX failure/contraindication. Repeat β-hCG alone delays treatment when ectopic is already suspected with empty uterus and adnexal mass. D&C does not treat ectopic.`,
    {
      blueprintDomain: "Reproductive",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["ectopic", "OB", "methotrexate", "physician-educator"],
    }
  ),

  usmleVignette(
    "surgery",
    `A 19-year-old woman comes to the emergency department with 18 hours of periumbilical pain that now localizes to the right lower quadrant. She has nausea and one episode of vomiting; last menstrual period was two weeks ago. Temperature 38.1°C (100.6°F), pulse 96/min. RLQ tenderness with guarding; positive psoas sign. WBC 13.8 × 10³/µL. Urine pregnancy test: negative. CT abdomen/pelvis with contrast: appendix 9 mm, periappendiceal fat stranding, no abscess.`,
    "Which of the following is the most appropriate management?",
    opts5(
      "Discharge with ciprofloxacin and metronidazole",
      "Observation and repeat CT in 24 hours",
      "Intravenous antibiotics and appendectomy",
      "Percutaneous drainage",
      "Pelvic ultrasound only"
    ),
    "Intravenous antibiotics and appendectomy",
    `Uncomplicated acute appendicitis (diameter >6 mm, periappendiceal inflammation, compatible exam) in a non-pregnant adult — operative management (typically laparoscopic appendectomy) with perioperative antibiotics. Medical management alone is not standard first-line in uncomplicated disease in the US. No abscess → no drainage. Observation risks perforation.`,
    {
      blueprintDomain: "GI",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["appendicitis", "acute-abdomen", "physician-educator"],
    }
  ),

  usmleVignette(
    "psychiatry",
    `An 81-year-old man is hospitalized after hip repair. On postoperative day 2 the nurse calls because he pulled at his IV lines overnight and tried to climb out of bed. He alternates between drowsiness and agitation, does not know the month, and believes the nurse is his daughter. Baseline: mild cognitive impairment at home, independent in ADLs. Vitals stable. No focal neurologic deficits. Na⁺ 128 mEq/L (132 on admission), urinalysis positive for nitrites.`,
    "Which of the following is the most likely diagnosis?",
    opts5(
      "Alzheimer disease acute exacerbation",
      "Delirium",
      "Major depressive disorder with psychosis",
      "Schizophrenia",
      "Normal pressure hydrocephalus"
    ),
    "Delirium",
    `Acute fluctuating attention and awareness with inattention, new perceptual disturbance, precipitant (surgery, possible UTI, hyponatremia) — delirium until proven otherwise in hospitalized elders. Dementia alone does not wax and wane hour-to-hour. New-onset schizophrenia at 81 is unlikely. NPH presents with chronic triad (gait, urinary, cognitive), not acute postop agitation.`,
    {
      blueprintDomain: "Behavioral Health",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["delirium", "geriatrics", "postop", "physician-educator"],
    }
  ),

  usmleVignette(
    "microbiology",
    `A 7-year-old girl develops fever and a sore throat. Temperature 38.4°C (101.1°F). Exam shows tonsillar exudates and tender anterior cervical lymphadenopathy. Rapid strep antigen: positive. Mother asks whether her 4-year-old brother, who feels fine, needs treatment.`,
    "Which of the following best explains why the brother should not receive antibiotics at this time?",
    opts5(
      "Group A strep colonization does not occur in children under 5",
      "Antibiotics prevent post-strep glomerulonephritis but not rheumatic fever",
      "Asymptomatic contacts do not require treatment because treatment does not prevent secondary spread in household contacts who remain asymptomatic",
      "Penicillin is contraindicated in household contacts",
      "The brother will develop lifelong immunity after exposure"
    ),
    "Asymptomatic contacts do not require treatment because treatment does not prevent secondary spread in household contacts who remain asymptomatic",
    `Treat symptomatic GAS pharyngitis to shorten symptoms and prevent rheumatic fever; routine treatment of asymptomatic household contacts is not recommended because colonization is common and treatment of asymptomatic carriers does not meaningfully prevent illness in contacts. Rheumatic fever prevention applies to the index case. Post-strep GN is not prevented by antibiotics.`,
    {
      blueprintDomain: "General Principles",
      stepLevel: "step1",
      difficulty: 3,
      tags: ["strep", "pharyngitis", "public-health", "physician-educator"],
    }
  ),

  usmleVignette(
    "ethics",
    `A 16-year-old girl requests contraceptive counseling. She is sexually active with one partner and asks that her parents not be informed. She demonstrates understanding of risks and benefits. State law permits confidential reproductive services for minors. Her mother, who accompanied her to the waiting room, demands to know what was discussed.`,
    "Which of the following is the most appropriate response?",
    opts5(
      "Disclose the visit details to the mother because the patient is a minor",
      "Refuse contraception until parental consent is obtained",
      "Respect confidentiality and discuss contraception with the patient alone",
      "Report the patient to child protective services for sexual activity",
      "Schedule a family meeting and require the patient to disclose first"
    ),
    "Respect confidentiality and discuss contraception with the patient alone",
    `Mature minor/emancipated reproductive health statutes in many jurisdictions allow confidential contraceptive care when the adolescent demonstrates capacity. Breaching confidentiality without consent violates trust and may deter care. Parental notification is not legally required here. CPS reporting is for abuse, not consensual peer activity. Refusing care pending parental consent is inappropriate when law permits confidential services.`,
    {
      blueprintDomain: "Social Sciences",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["ethics", "confidentiality", "adolescent", "physician-educator"],
    }
  ),

  usmleVignette(
    "pathology",
    `A 29-year-old man who emigrated from India five years ago has two months of low-grade fever, night sweats, and a 6-kg (13-lb) weight loss. Chest radiograph shows a right upper lobe cavitary lesion. Sputum acid-fast stain is positive. Biopsy of a cervical lymph node shows granulomas with central caseation.`,
    "Which of the following is the most likely mechanism of cell death in the center of these granulomas?",
    opts5(
      "Apoptosis regulated by caspases",
      "Coagulative necrosis from ischemia",
      "Liquefactive necrosis from proteases",
      "Enzymatic fat necrosis",
      "Macrophage-mediated tissue destruction with persistent mycobacterial antigen"
    ),
    "Macrophage-mediated tissue destruction with persistent mycobacterial antigen",
    `Caseating granulomas in TB reflect type IV HSR: persistent antigen (M. tuberculosis) drives macrophage aggregation and central necrosis — a distinctive pattern, not simple ischemic coagulative necrosis. Liquefactive necrosis is typical of abscess/bacterial brain. Fat necrosis involves pancreatic lipases. Pure apoptosis does not produce caseous centers.`,
    {
      blueprintDomain: "Respiratory",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["TB", "granuloma", "type-IV-HSR", "physician-educator"],
    }
  ),

  usmleVignette(
    "cardiology",
    `A 72-year-old man with HFrEF (EF 30%) on lisinopril, carvedilol, spironolactone, and furosemide is seen for routine follow-up. He has no chest pain or orthopnea. BP 108/68, pulse 58/min, weight stable. Labs: K⁺ 5.9 mEq/L, creatinine 1.8 (baseline 1.5), BNP improved from prior. eGFR 32 mL/min/1.73 m².`,
    "Which of the following is the most appropriate medication adjustment?",
    opts5(
      "Stop carvedilol",
      "Stop lisinopril",
      "Stop spironolactone",
      "Increase furosemide dose",
      "Add amlodipine"
    ),
    "Stop spironolactone",
    `Hyperkalemia with worsening renal function on triple neurohormonal blockade — MRA (spironolactone) is often held first while maintaining ACEi/ARB and beta-blocker when possible for mortality benefit. Stopping beta-blocker or ACEi prematurely harms outcomes unless absolute contraindication. Increasing diuretic may worsen prerenal azotemia. Amlodipine does not address hyperkalemia.`,
    {
      blueprintDomain: "Cardiovascular",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["HFrEF", "GDMT", "hyperkalemia", "physician-educator"],
    }
  ),

  usmleVignette(
    "neurology",
    `A 35-year-old man comes to the clinic reporting six weeks of recurrent severe headaches. Attacks wake him from sleep at 1–2 AM, last about 45 minutes, and occur almost nightly for two weeks then remit. During attacks he paces around the room and occasionally hits his head against the wall. Between episodes he is headache-free. Exam between attacks is normal. MRI brain: normal.`,
    "Which of the following is the most appropriate prophylactic treatment?",
    opts5(
      "Sumatriptan at headache onset only",
      "Topiramate",
      "Verapamil",
      "Indomethacin",
      "High-flow oxygen during attacks only"
    ),
    "Verapamil",
    `Cluster headache — circadian/seasonal pattern, autonomic features, restlessness (algophobia), male predominance. Acute: high-flow O₂ or triptans. Prophylaxis: verapamil first-line (with ECG monitoring). Indomethacin is specific for paroxysmal hemicrania. Topiramate is migraine prophylaxis. Sumatriptan/O₂ treat acute attacks but prophylaxis is needed for frequent cycles.`,
    {
      blueprintDomain: "Nervous",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["cluster-headache", "neurology", "physician-educator"],
    }
  ),
];
