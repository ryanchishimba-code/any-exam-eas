/**
 * Curated AANP FNP Assess domain items — physician-educator batch 01.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { aanpFnpVignette } from "@/lib/exam-prep/aanp-fnp-seed-factory";

const BATCH = "physician-educator-batch-assess";
const PE = ["physician-educator", BATCH, "aanp-fnp-seed"];

const USPSTF = { label: "USPSTF Screening Recommendations", url: "https://www.uspreventiveservicestaskforce.org" };
const BRIGHT = { label: "Bright Futures Guidelines", url: "https://brightfutures.aap.org" };

export const AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_ASSESS: EnrichedBankItem[] = [
  aanpFnpVignette(
    "assess",
    `A 52-year-old woman presents for a wellness visit. She has no chronic conditions, takes no medications, and has a BMI of 31. Family history is significant for colon cancer in her father at age 58. BP 128/78 mm Hg, HR 72/min. She last had a Pap smear 4 years ago and has never had colorectal cancer screening.`,
    "Which screening test is most appropriate at this visit?",
    [
      "Repeat Pap smear only",
      "Colonoscopy",
      "Low-dose CT chest for lung cancer",
      "DEXA scan",
    ],
    "Colonoscopy",
    `Average-risk colorectal cancer screening begins at age 45 per USPSTF. This patient is 52 with a family history of CRC — colonoscopy is appropriate. Pap smear interval depends on prior results and age; she is due but CRC screening is the priority gap. LDCT is for high-risk smokers. DEXA is indicated at 65+ or earlier with risk factors, not as the primary screening need here.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "womens-health",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "screening",
      difficulty: 3,
      references: [USPSTF],
      tags: ["screening", "CRC", ...PE],
      related: {
        reviewModuleSlug: "aanp-assess-domain",
        memoryCardIds: ["fnp-assess-screening-uspstf"],
        keyTakeaway: "CRC screening starts at 45 for average risk.",
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 2-week-old breastfed male infant is brought to the pediatric clinic for a well-newborn follow-up with chief concern of mild jaundice. He was born at term via spontaneous vaginal delivery with no neonatal complications. Birth weight was 3.4 kg; today weight is 3.2 kg. The infant feeds every 2–3 hours, has 6 wet diapers daily, and is alert. Temp 36.8°C, HR 136/min. Physical exam shows mild jaundice to the face only. Mother reports no fever, vomiting, or poor feeding.`,
    "What is the most appropriate next step in assessment?",
    [
      "Immediate hospital admission for sepsis workup",
      "Check bilirubin level and plot on nomogram",
      "Switch to formula feeding",
      "Order head ultrasound",
    ],
    "Check bilirubin level and plot on nomogram",
    `A 5% weight loss from birth is within expected range for breastfed newborns at 2 weeks. The infant is feeding well with adequate output — this is not failure to thrive. Mild jaundice at 14 days warrants bilirubin measurement and plotting on the Bhutani nomogram to guide phototherapy vs observation. Sepsis workup is not indicated without fever or ill appearance. Formula switch is premature without lactation assessment.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "newborn",
      blueprintTopic: "newborn assessment",
      difficulty: 3,
      references: [BRIGHT],
      tags: ["newborn", "jaundice", ...PE],
      related: {
        reviewModuleSlug: "aanp-pediatrics-high-yield",
        memoryCardIds: ["fnp-assess-next-best-test"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 78-year-old man with mild cognitive impairment lives alone. His daughter reports he has lost 8 lb over 3 months, has new urinary incontinence, and was found wandering at night. BP 142/88 mm Hg, HR 88/min. He is oriented to person only. No focal neurologic deficits. UA shows nitrites and WBCs.`,
    "Which assessment finding most requires immediate intervention?",
    [
      "Mild cognitive impairment progression",
      "Unintentional weight loss",
      "Positive urinalysis with acute behavioral change",
      "Isolated nocturnal wandering",
    ],
    "Positive urinalysis with acute behavioral change",
    `Acute change in mental status plus urinary symptoms in an older adult suggests delirium secondary to UTI until proven otherwise — treat promptly. While weight loss and wandering warrant comprehensive geriatric assessment, the acute delirium presentation with pyuria requires immediate evaluation and empiric treatment. This is a classic geriatric atypical infection presentation.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "geriatrics",
      patientAgeGroup: "older-adult",
      blueprintTopic: "geriatric assessment",
      difficulty: 4,
      tags: ["delirium", "UTI", "geriatrics", ...PE],
      related: {
        reviewModuleSlug: "aanp-geriatrics-high-yield",
        memoryCardIds: ["fnp-delirium-workup", "fnp-diagnose-delirium-vs-dementia"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 28-year-old G1P0 woman at 10 weeks gestation presents for her first prenatal visit. She has no chronic medical conditions and takes no medications. Family history is negative for genetic disorders. BP 118/72 mm Hg. BMI 24. She reports mild nausea but no bleeding or cramping. She asks what labs are needed today.`,
    "Which initial prenatal laboratory panel is most appropriate?",
    [
      "CBC, blood type/Rh, antibody screen, rubella immunity, hepatitis B, HIV, syphilis, UA, and urine culture",
      "Amniocentesis for chromosomal analysis",
      "Glucose tolerance test",
      "Group B strep culture",
    ],
    "CBC, blood type/Rh, antibody screen, rubella immunity, hepatitis B, HIV, syphilis, UA, and urine culture",
    `First prenatal labs include CBC, blood type and antibody screen, infectious disease screening (HIV, syphilis, hepatitis B), rubella immunity, UA, and urine culture. GBS culture is done at 36–37 weeks. GTT is at 24–28 weeks (or earlier if high risk). Amniocentesis is diagnostic, not routine initial assessment.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "womens-health",
      patientAgeGroup: "young-adult",
      blueprintTopic: "prenatal assessment",
      difficulty: 3,
      tags: ["prenatal", "OB", ...PE],
      related: {
        reviewModuleSlug: "aanp-assess-domain",
        memoryCardIds: ["fnp-assess-prenatal-labs"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 9-month-old male infant is seen for a well-child visit with parental concern about developmental regression. He was born full term with an uncomplicated neonatal course and normal newborn metabolic screen. History includes normal development until 6 months when he could sit with support and babble. Parents now report he cannot sit, has stopped babbling, and no longer reaches for toys. Weight 8.2 kg (15th percentile). Head circumference is unchanged from 3 months ago.`,
    "Which finding is most concerning and requires urgent referral?",
    [
      "Absence of pincer grasp",
      "Loss of previously acquired sitting ability with absent babbling",
      "Not walking independently",
      "Single palmar crease on exam",
    ],
    "Loss of previously acquired sitting ability with absent babbling",
    `Regression of motor skills with loss of babbling at 9 months suggests neurodevelopmental delay or neurologic disorder requiring urgent evaluation. Pincer grasp and independent walking are not expected at 9 months. Isolated single palmar crease may be normal variant unless associated with other dysmorphic features.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "infant",
      blueprintTopic: "developmental milestones",
      difficulty: 4,
      references: [BRIGHT],
      tags: ["development", "red flags", ...PE],
      related: {
        reviewModuleSlug: "aanp-pediatrics-high-yield",
        memoryCardIds: ["fnp-development-milestones"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 45-year-old man with a 30-pack-year smoking history who quit 2 years ago presents for a health maintenance visit. He is asymptomatic. BP 132/84 mm Hg, BMI 27, SpO₂ 98%.`,
    "Which screening test is most appropriate?",
    [
      "Low-dose CT chest annually",
      "Chest X-ray every 6 months",
      "Sputum cytology",
      "No lung cancer screening needed",
    ],
    "Low-dose CT chest annually",
    `USPSTF recommends annual LDCT for adults 50–80 with ≥20 pack-year history who currently smoke or quit within 15 years. This patient is 45 — technically below age threshold, but at 45 with 30 pack-years who quit 2 years ago, LDCT should be discussed and offered per evolving practice when high-risk. Among options, LDCT is the evidence-based lung cancer screening modality. Chest X-ray and sputum cytology are not recommended for screening.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "pulmonary",
      patientAgeGroup: "middle-adult",
      blueprintTopic: "lung cancer screening",
      difficulty: 4,
      references: [USPSTF],
      tags: ["screening", "lung cancer", ...PE],
      related: {
        reviewModuleSlug: "aanp-assess-domain",
        memoryCardIds: ["fnp-assess-screening-uspstf"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 2-year-old boy with a history of mild intermittent asthma is brought to urgent care with 1 day of barking cough and stridor at rest. He is fully immunized. Temp 38.2°C. He is alert, with mild suprasternal retractions. SpO₂ 97%. He has had croup twice before, always improving with dexamethasone. No drooling or toxic appearance.`,
    "What is the most appropriate initial assessment before treatment?",
    [
      "Lateral neck X-ray to rule out epiglottitis",
      "Immediate intubation",
      "Assess Westley croup score and airway status",
      "CT chest",
    ],
    "Assess Westley croup score and airway status",
    `Croup with stridor at rest requires airway assessment (Westley score) and monitoring while preparing treatment. Typical croup in a vaccinated, alert child with known recurrent croup and no drooling or toxic appearance does not require emergent imaging. Lateral neck film is for suspected epiglottitis (toxic, drooling, no cough). Intubation is reserved for impending failure.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "pediatrics",
      patientAgeGroup: "toddler",
      blueprintTopic: "pediatric respiratory assessment",
      difficulty: 3,
      tags: ["croup", "pediatrics", ...PE],
      related: {
        reviewModuleSlug: "aanp-pediatrics-high-yield",
        memoryCardIds: ["fnp-assess-next-best-test"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 34-year-old woman presents with 6 weeks of fatigue and cold intolerance. She has no prior medical history. BP 108/68 mm Hg, HR 58/min. Skin is dry. TSH 12.4 mIU/L (elevated), free T4 0.6 ng/dL (low).`,
    "Which additional assessment is most important before initiating treatment?",
    [
      "Thyroid ultrasound",
      "Anti-TPO antibodies and lipid panel",
      "Thyroid scan with radioactive iodine",
      "Fine-needle aspiration",
    ],
    "Anti-TPO antibodies and lipid panel",
    `Primary hypothyroidism requires TSH and free T4 confirmation. Anti-TPO antibodies help identify Hashimoto thyroiditis; lipid panel assesses secondary dyslipidemia common in hypothyroidism. Ultrasound/FNA are for nodules, not uncomplicated hypothyroidism. Thyroid scan is for hyperthyroidism workup.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "endocrine",
      patientAgeGroup: "young-adult",
      blueprintTopic: "hypothyroidism workup",
      difficulty: 3,
      tags: ["thyroid", "hypothyroidism", ...PE],
      related: {
        reviewModuleSlug: "aanp-assess-domain",
        memoryCardIds: ["fnp-assess-next-best-test"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `An 82-year-old woman falls at home. She takes warfarin, metoprolol, donepezil, and oxybutynin. BP 156/90 mm Hg supine, 118/72 mm Hg standing. HR 62 supine, 68 standing. She reports dizziness on standing. No head strike or loss of consciousness.`,
    "Which medication is the highest priority to reassess for deprescribing?",
    [
      "Metoprolol",
      "Donepezil",
      "Oxybutynin",
      "Warfarin",
    ],
    "Oxybutynin",
    `Anticholinergics (oxybutynin) are on Beers Criteria — strongly associated with falls, delirium, and cognitive worsening in older adults. Orthostatic vitals suggest contributing hypotension, but anticholinergic burden is the highest-yield deprescribing target. Metoprolol may contribute to orthostasis but is often indicated. Donepezil treats dementia. Warfarin has clear indication if atrial fibrillation.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "geriatrics",
      patientAgeGroup: "older-adult",
      blueprintTopic: "medication review",
      difficulty: 4,
      tags: ["Beers", "falls", "polypharmacy", ...PE],
      related: {
        reviewModuleSlug: "aanp-geriatrics-high-yield",
        memoryCardIds: ["fnp-beers-criteria", "fnp-assess-geriatric-falls"],
      },
    }
  ),

  aanpFnpVignette(
    "assess",
    `A 16-year-old presents alone requesting contraception. She is sexually active with one partner, uses condoms inconsistently, and has no medical history. BP 112/70 mm Hg, BMI 22.`,
    "What is the most appropriate initial assessment?",
    [
      "Require parental consent before any discussion",
      "Pregnancy test, STI screening, and blood pressure — then discuss contraceptive options",
      "Pelvic exam mandatory before prescribing",
      "Prescribe combined OCP without assessment",
    ],
    "Pregnancy test, STI screening, and blood pressure — then discuss contraceptive options",
    `Adolescents may consent to contraceptive services confidentially in most states. Initial assessment includes pregnancy test, STI risk screening, BP (for estrogen-containing methods), and shared decision-making. Pelvic exam is not required to initiate contraception in asymptomatic teens. Parental consent is not required for contraceptive counseling.`,
    {
      blueprintDomain: "assess",
      clinicalSystem: "womens-health",
      patientAgeGroup: "adolescent",
      blueprintTopic: "adolescent health",
      difficulty: 3,
      tags: ["contraception", "adolescent", ...PE],
      related: {
        reviewModuleSlug: "aanp-pediatrics-high-yield",
        memoryCardIds: ["fnp-adolescent-confidentiality", "fnp-plan-contraception"],
      },
    }
  ),
];
