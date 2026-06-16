/** PANCE reproductive, endocrine, hematologic — physician-educator batch 07. */
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-07";
const PE = ["physician-educator", BATCH, "pance", "pance-seed", "PANCE-2025"];

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_07 = [
  panceVignette(
    "reproductive",
    `A 24-year-old sexually active woman presents with lower abdominal pain, cervical motion tenderness, and mucopurulent discharge. Temp 38.1°C, WBC 13.2 × 10³/µL. Urine pregnancy test is negative.`,
    "What is the most appropriate empiric treatment?",
    [
      "Ceftriaxone IM plus doxycycline with metronidazole",
      "Azithromycin monotherapy",
      "Metronidazole alone",
      "Oral contraceptive pill",
    ],
    "Ceftriaxone IM plus doxycycline with metronidazole",
    `PID requires coverage for gonorrhea, chlamydia, and anaerobes — ceftriaxone + doxycycline + metronidazole per CDC. Monotherapy regimens are inadequate for PID.`,
    {
      blueprintSystem: "reproductive",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "STIs",
      difficulty: 4,
      tags: ["PID", ...PE],
    }
  ),
  panceVignette(
    "reproductive",
    `A 17-year-old requests contraception. She has migraine with aura and smokes 10 cigarettes per day. BP 118/72 mm Hg, HR 76/min.`,
    "What is the most appropriate contraceptive recommendation?",
    [
      "Progestin-only method or nonhormonal IUD",
      "Combined estrogen-progestin oral contraceptive",
      "Transdermal estrogen patch",
      "Depo-medroxyprogesterone is absolutely contraindicated",
    ],
    "Progestin-only method or nonhormonal IUD",
    `Combined hormonal contraception is contraindicated with migraine with aura and smoking in women ≥35 (and caution in younger smokers) — progestin-only or copper IUD is safer. Depo-progestin is not absolutely contraindicated here.`,
    {
      blueprintSystem: "reproductive",
      taskCategory: "prevention",
      blueprintTopic: "contraception",
      difficulty: 3,
      tags: ["contraception", ...PE],
    }
  ),
  panceVignette(
    "endocrine",
    `A 50-year-old woman presents with fatigue, cold intolerance, weight gain, and constipation. TSH 18 mIU/L (normal 0.4–4.0), free T4 0.6 ng/dL (normal 0.8–1.8 ng/dL). BP 108/68 mm Hg.`,
    "What is the most appropriate treatment?",
    [
      "Levothyroxine",
      "Methimazole",
      "Propylthiouracil",
      "Observation only",
    ],
    "Levothyroxine",
    `Elevated TSH with low free T4 confirms primary hypothyroidism — treat with levothyroxine. Methimazole and PTU treat hyperthyroidism. Observation delays treatment of symptomatic hypothyroidism.`,
    {
      blueprintSystem: "endocrine",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "hypothyroidism",
      difficulty: 3,
      tags: ["hypothyroid", ...PE],
    }
  ),
  panceVignette(
    "endocrine",
    `A 44-year-old obese man presents with polyuria and polydipsia. Random glucose 286 mg/dL, HbA1c 9.8%. BMP shows glucose 286 mg/dL, no ketones, bicarbonate 24 mEq/L.`,
    "What is the most appropriate initial pharmacotherapy?",
    [
      "Metformin plus lifestyle modification",
      "Insulin sliding scale only",
      "Sulfonylurea monotherapy in all patients",
      "No medication until HbA1c >10%",
    ],
    "Metformin plus lifestyle modification",
    `Newly diagnosed type 2 diabetes with HbA1c ~10% without DKA — metformin plus lifestyle is first-line unless contraindicated. Insulin may be added if symptomatic hyperglycemia persists but is not the sole initial step for stable T2DM.`,
    {
      blueprintSystem: "endocrine",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "diabetes",
      difficulty: 3,
      tags: ["diabetes", ...PE],
    }
  ),
  panceVignette(
    "hematologic",
    `A 26-year-old woman presents with heavy menstrual bleeding and fatigue. Hgb 8.2 g/dL, MCV 68 fL, ferritin 6 ng/mL, TIBC elevated.`,
    "What is the most likely diagnosis?",
    [
      "Iron deficiency anemia",
      "Vitamin B12 deficiency",
      "Aplastic anemia",
      "Hemolytic anemia",
    ],
    "Iron deficiency anemia",
    `Microcytic anemia with low ferritin and high TIBC is iron deficiency — often from menstrual blood loss in reproductive-age women. B12 deficiency causes macrocytosis. Aplastic anemia causes pancytopenia.`,
    {
      blueprintSystem: "hematologic",
      taskCategory: "diagnosis",
      blueprintTopic: "anemia",
      difficulty: 3,
      tags: ["anemia", ...PE],
    }
  ),
  panceVignette(
    "hematologic",
    `A 65-year-old man on warfarin for atrial fibrillation presents with nosebleeds and gum bleeding. INR 8.2. He is hemodynamically stable, Hgb 12.1 g/dL.`,
    "What is the most appropriate management?",
    [
      "Hold warfarin; consider oral vitamin K if bleeding persists",
      "Continue warfarin at same dose",
      "Fresh frozen plasma for all supratherapeutic INRs",
      "Protamine sulfate",
    ],
    "Hold warfarin; consider oral vitamin K if bleeding persists",
    `Supratherapeutic INR with minor bleeding — hold warfarin and give vitamin K if needed. FFP is for serious bleeding. Protamine reverses heparin, not warfarin.`,
    {
      blueprintSystem: "hematologic",
      taskCategory: "intervention",
      blueprintTopic: "coagulopathy",
      difficulty: 4,
      tags: ["warfarin", "INR", ...PE],
    }
  ),
  panceVignette(
    "reproductive",
    `A 29-year-old G1P0 at 10 weeks gestation has nausea and vomiting 8–10 times daily with 3-kg weight loss. Ketones are present in urine. BMP: Na 132 mEq/L, K 3.2 mEq/L, bicarbonate 18 mEq/L.`,
    "What is the most appropriate initial management?",
    [
      "IV fluids, thiamine, and antiemetics; admit if unable to tolerate PO",
      "Oral prenatal vitamins only",
      "Immediate termination of pregnancy",
      "Hyperemesis requires no treatment until third trimester",
    ],
    "IV fluids, thiamine, and antiemetics; admit if unable to tolerate PO",
    `Hyperemesis gravidarum with dehydration, ketosis, and electrolyte abnormalities requires IV rehydration, thiamine, and antiemetics — hospitalize when oral intake fails.`,
    {
      blueprintSystem: "reproductive",
      taskCategory: "intervention",
      blueprintTopic: "pregnancy complications",
      difficulty: 4,
      tags: ["hyperemesis", ...PE],
    }
  ),
  panceVignette(
    "endocrine",
    `A 38-year-old man presents with sudden severe headache, diaphoresis, and BP 210/118 mm Hg. HR 124/min. After IV labetalol, BP remains 195/110 mm Hg with ongoing symptoms.`,
    "What is the most appropriate diagnostic test?",
    [
      "Plasma free metanephrines",
      "TSH",
      "Random cortisol",
      "Hemoglobin A1c",
    ],
    "Plasma free metanephrines",
    `Episodic hypertension with headache and tachycardia suggests pheochromocytoma — plasma or urine metanephrines are the screening test. TSH, cortisol, and A1c do not evaluate catecholamine excess.`,
    {
      blueprintSystem: "endocrine",
      taskCategory: "labs",
      blueprintTopic: "adrenal disorders",
      difficulty: 4,
      tags: ["pheochromocytoma", ...PE],
      related: { reviewModuleSlug: "dka-management" },
    }
  ),
];
