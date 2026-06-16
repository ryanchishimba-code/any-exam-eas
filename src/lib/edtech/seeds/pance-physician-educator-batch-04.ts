/** PANCE GI / nutrition — physician-educator batch 04. */
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-04";
const PE = ["physician-educator", BATCH, "pance", "pance-seed", "PANCE-2025"];

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_04 = [
  panceVignette(
    "gastrointestinal",
    `A 52-year-old man with a history of heavy alcohol use presents with severe epigastric pain radiating to the back for 24 hours. Temp 38.4°C, HR 112/min, BP 98/60 mm Hg. Abdomen is tender epigastrically without peritoneal signs. Lipase 1,840 U/L (normal <60), AST 210 U/L, ALT 98 U/L, WBC 16.2 × 10³/µL.`,
    "What is the most likely diagnosis?",
    [
      "Acute pancreatitis",
      "Acute cholecystitis",
      "Peptic ulcer perforation",
      "Mesenteric ischemia",
    ],
    "Acute pancreatitis",
    `Epigastric pain radiating to the back with lipase >3× ULN in a patient with alcohol use is acute pancreatitis. Cholecystitis typically presents with RUQ pain and Murphy sign. Perforated ulcer would show free air and peritoneal signs. Mesenteric ischemia presents with pain out of proportion to exam.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "diagnosis",
      blueprintTopic: "pancreatitis",
      difficulty: 4,
      tags: ["pancreatitis", ...PE],
    }
  ),
  panceVignette(
    "gastrointestinal",
    `A 45-year-old woman with long-standing GERD reports dysphagia to solids for 3 months and 4-kg weight loss. She denies odynophagia. Hgb 11.2 g/dL. She has not had endoscopy in 10 years.`,
    "What is the most appropriate next step?",
    [
      "Upper endoscopy",
      "Trial of PPI for 8 weeks before any testing",
      "Barium swallow only",
      "Outpatient H. pylori serology",
    ],
    "Upper endoscopy",
    `Progressive dysphagia to solids and weight loss in chronic GERD warrants endoscopy to exclude malignancy and assess for stricture/Barrett esophagus. Empiric PPI alone delays diagnosis. Barium swallow is inferior for mucosal disease and biopsy.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "labs",
      blueprintTopic: "GERD",
      difficulty: 4,
      tags: ["GERD", "dysphagia", ...PE],
    }
  ),
  panceVignette(
    "gastrointestinal",
    `A 28-year-old man presents with bloody diarrhea, crampy abdominal pain, and tenesmus for 2 weeks. Temp 37.8°C. Stool studies are negative for pathogens. Colonoscopy shows continuous inflammation from rectum to sigmoid with friable mucosa.`,
    "What is the most likely diagnosis?",
    [
      "Ulcerative colitis",
      "Crohn disease",
      "Infectious colitis",
      "Ischemic colitis",
    ],
    "Ulcerative colitis",
    `Continuous colonic inflammation beginning at the rectum with bloody diarrhea suggests ulcerative colitis. Crohn disease has skip lesions and often spares the rectum. Negative stool studies and endoscopic pattern distinguish from infection.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "diagnosis",
      blueprintTopic: "IBD",
      difficulty: 4,
      tags: ["IBD", "colitis", ...PE],
    }
  ),
  panceVignette(
    "gastrointestinal",
    `A 62-year-old man with cirrhosis presents with hematemesis and melena. BP 82/50 mm Hg, HR 124/min. Hemoglobin 6.8 g/dL. After IV access and fluid resuscitation, he remains hypotensive.`,
    "What is the most appropriate immediate intervention?",
    [
      "Emergent upper endoscopy after resuscitation",
      "Oral proton pump inhibitor only",
      "CT abdomen before any endoscopy",
      "Discharge after normal saline bolus",
    ],
    "Emergent upper endoscopy after resuscitation",
    `Hemodynamically unstable GI bleed in cirrhosis requires resuscitation and urgent endoscopy for variceal banding or sclerotherapy. PPI alone does not address variceal hemorrhage. CT delays definitive hemostasis.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "intervention",
      blueprintTopic: "GI bleeding",
      difficulty: 5,
      tags: ["variceal-bleed", "cirrhosis", ...PE],
    }
  ),
  panceVignette(
    "gastrointestinal",
    `A 19-year-old college student presents with jaundice, fatigue, and dark urine for 1 week. AST 1,240 U/L, ALT 1,580 U/L, total bilirubin 6.2 mg/dL. Anti-HAV IgM is positive.`,
    "What is the most appropriate management?",
    [
      "Supportive care and counseling on transmission",
      "Immediate antiviral therapy with tenofovir",
      "Liver biopsy before treatment",
      "Isolation with ribavirin prophylaxis for contacts",
    ],
    "Supportive care and counseling on transmission",
    `Acute hepatitis A is self-limited; management is supportive with hygiene counseling. Tenofovir treats HBV, not HAV. Biopsy is not indicated for typical acute viral hepatitis. Ribavirin prophylaxis is not standard for HAV contacts.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "prevention",
      blueprintTopic: "hepatitis",
      difficulty: 3,
      tags: ["hepatitis-A", ...PE],
    }
  ),
  panceVignette(
    "gastrointestinal",
    `A 70-year-old nursing home resident with dementia has lost 8 kg over 3 months. BMI 17. Albumin 2.6 g/dL. She eats only half of offered meals and has difficulty swallowing thin liquids.`,
    "What is the most appropriate initial nutritional intervention?",
    [
      "Speech therapy evaluation and modified diet texture",
      "Immediate total parenteral nutrition",
      "High-calorie supplements without swallow assessment",
      "NPO until peg tube placement",
    ],
    "Speech therapy evaluation and modified diet texture",
    `Unintentional weight loss with dysphagia requires swallow evaluation and texture-modified diet before invasive feeding. TPN is not first-line in chronic malnutrition with functional gut. NPO pending peg tube is overly aggressive without assessment.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "intervention",
      blueprintTopic: "malnutrition",
      difficulty: 3,
      tags: ["nutrition", "dysphagia", ...PE],
    }
  ),
];
