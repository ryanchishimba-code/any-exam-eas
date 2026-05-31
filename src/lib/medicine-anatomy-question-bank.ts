/**
 * USMLE Step 1 high-yield gross anatomy — 20 clinical vignette MCQs.
 * Seeded via health-sciences-question-bank → sync-question-bank.
 */
import type { BankItem } from "./question-bank";

function anatomy(
  question: string,
  options: [string, string, string, string],
  correctAnswer: string,
  explanation: string,
  tags: string[]
): BankItem {
  return {
    subjectId: "anatomy",
    question,
    options,
    correctAnswer,
    explanation,
    tags: [...tags, "high-yield", "USMLE"],
  };
}

export const ANATOMY_QUESTION_BANK: BankItem[] = [
  anatomy(
    "A 19-year-old linebacker is tackled with his neck laterally flexed and shoulder depressed. He cannot abduct the arm beyond 15° and has weak elbow flexion with numbness over the lateral shoulder. Wrist extension is intact. Which structure is most likely injured?",
    [
      "Axillary nerve",
      "Musculocutaneous nerve",
      "Long thoracic nerve",
      "Upper trunk of the brachial plexus (C5–C6)",
    ],
    "Upper trunk of the brachial plexus (C5–C6)",
    "Erb-Duchenne palsy: C5–C6 → weak abduction (deltoid/supraspinatus), weak elbow flexion (biceps), lateral shoulder numbness. Wrist extension (C7+) is spared. Axillary nerve alone causes a flat deltoid patch without biceps weakness.",
    ["upper limb", "brachial plexus", "Medium"]
  ),
  anatomy(
    "A 45-year-old man has a right groin bulge that appears when coughing and reduces when supine. The bulge is above the inguinal ligament and lateral to the pubic tubercle. Through which region does the hernia sac most likely pass?",
    [
      "Hesselbach triangle (direct inguinal)",
      "Inguinal canal via the deep inguinal ring (indirect inguinal)",
      "Femoral canal below the inguinal ligament",
      "Superficial inguinal ring only without canal involvement",
    ],
    "Inguinal canal via the deep inguinal ring (indirect inguinal)",
    "Above the inguinal ligament + lateral to pubic tubercle → indirect inguinal hernia through the deep ring and inguinal canal. Direct hernias protrude through Hesselbach triangle (medial to epigastric vessels). Femoral hernias are below the inguinal ligament.",
    ["abdomen", "groin", "Easy"]
  ),
  anatomy(
    "A 58-year-old woman has progressive headaches and bitemporal hemianopia. MRI shows a sellar mass compressing the optic chiasm. Which fibers are most compressed at the chiasm?",
    [
      "Temporal retinal fibers (nasal visual field)",
      "Nasal retinal fibers (temporal visual field)",
      "Superior retinal fibers only",
      "Optic tract fibers posterior to the chiasm",
    ],
    "Nasal retinal fibers (temporal visual field)",
    "Nasal retinal fibers decussate at the chiasm; a midline suprasellar mass compresses them → bitemporal hemianopia. Optic tract lesions cause homonymous hemianopia, not bitemporal loss.",
    ["neuroanatomy", "head/neck", "Medium"]
  ),
  anatomy(
    "During thoracentesis for a large left pleural effusion, a needle is inserted in the mid-axillary line at the 8th intercostal space. The patient becomes hypotensive with distended neck veins and muffled heart sounds. Which complication is most likely?",
    [
      "Left phrenic nerve injury",
      "Cardiac tamponade from myocardial/pericardial puncture",
      "Left recurrent laryngeal nerve injury",
      "Pneumothorax without hemodynamic compromise",
    ],
    "Cardiac tamponade from myocardial/pericardial puncture",
    "Beck triad (hypotension, JVD, muffled heart sounds) after thoracentesis suggests cardiac puncture/tamponade. Phrenic injury causes hemidiaphragm paralysis, not tamponade.",
    ["thorax", "Hard"]
  ),
  anatomy(
    "A 62-year-old multiparous woman leaks urine when coughing. Exam shows cystocele and weak pubococcygeus tone. Which structure primarily supports the bladder neck during increased intra-abdominal pressure?",
    [
      "Obturator internus",
      "Levator ani (pubococcygeus portion)",
      "Piriformis",
      "Round ligament of the uterus",
    ],
    "Levator ani (pubococcygeus portion)",
    "The levator ani forms the pelvic floor sling supporting the bladder and urethra. Weakness contributes to stress incontinence and prolapse. The external urethral sphincter aids continence but does not provide primary bladder neck support.",
    ["pelvis", "Medium"]
  ),
  anatomy(
    "After a right-sided spinal cord knife injury at T10, a patient has right leg loss of proprioception, left leg loss of pain and temperature, and right leg spastic paralysis below the lesion. Which pattern best explains these findings?",
    [
      "Bilateral anterior spinal artery occlusion",
      "Brown-Séquard syndrome (hemisection)",
      "Central cord syndrome",
      "Cauda equina syndrome",
    ],
    "Brown-Séquard syndrome (hemisection)",
    "Hemisection: ipsilateral corticospinal (spastic paralysis) + dorsal column (proprioception/vibration) loss; contralateral spinothalamic pain/temperature loss 1–2 levels below. Anterior spinal artery occlusion causes bilateral motor and pain/temp loss with spared dorsal columns.",
    ["neuroanatomy", "spinal cord", "Hard"]
  ),
  anatomy(
    "A carpenter has tingling in the ring and small fingers, weak finger abduction, and hypothenar weakness. Symptoms worsen with prolonged elbow flexion. Which nerve is injured?",
    [
      "Median nerve at the carpal tunnel",
      "Ulnar nerve at the cubital tunnel",
      "Radial nerve in the spiral groove",
      "Musculocutaneous nerve",
    ],
    "Ulnar nerve at the cubital tunnel",
    "Ulnar nerve compression at the cubital tunnel → ulnar 1½ digits, interossei weakness, hypothenar involvement, worse with elbow flexion. Median nerve at the carpal tunnel affects thumb/index/middle and thenar muscles.",
    ["upper limb", "Medium"]
  ),
  anatomy(
    "A newborn has scaphoid abdomen, respiratory distress, and bowel sounds in the left chest. Chest X-ray shows bowel in the thorax with mediastinal shift. Failure of which embryologic process most likely caused this?",
    [
      "Vitelline duct obliteration",
      "Closure of the pleuroperitoneal canals (Bochdalek hernia)",
      "Midgut rotation only",
      "Patent ductus arteriosus",
    ],
    "Closure of the pleuroperitoneal canals (Bochdalek hernia)",
    "Congenital diaphragmatic hernia results from failure of pleuroperitoneal canal closure (usually left posterolateral), allowing abdominal viscera into the thorax and pulmonary hypoplasia.",
    ["embryology", "respiratory", "Medium"]
  ),
  anatomy(
    "After a fibular neck fracture, a patient cannot dorsiflex the foot or extend the toes. Sensation is decreased over the dorsum of the foot and anterolateral leg. Which nerve is injured?",
    [
      "Tibial nerve",
      "Common fibular (peroneal) nerve",
      "Femoral nerve",
      "Sural nerve",
    ],
    "Common fibular (peroneal) nerve",
    "Common fibular nerve wraps the fibular neck → foot drop (dorsiflexion/eversion loss) and anterolateral leg/dorsum foot sensory loss. Tibial nerve injury affects plantarflexion and sole sensation.",
    ["lower limb", "Medium"]
  ),
  anatomy(
    "A 55-year-old man has ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded in a right-dominant circulation?",
    [
      "Left anterior descending artery",
      "Left circumflex artery",
      "Right coronary artery",
      "Posterior descending artery from LCx only",
    ],
    "Right coronary artery",
    "Inferior leads (II, III, aVF) usually reflect RCA territory in right-dominant hearts (~80%). LAD supplies anteroseptal (V1–V4); LCx supplies lateral leads.",
    ["cardiovascular", "Easy"]
  ),
  anatomy(
    "A 50-year-old painter cannot initiate arm abduction and has a positive empty-can test. Supraspinatus atrophy is noted. Which structure is most likely torn?",
    [
      "Subscapularis tendon",
      "Supraspinatus tendon",
      "Infraspinatus tendon only",
      "Teres minor tendon only",
    ],
    "Supraspinatus tendon",
    "Supraspinatus initiates abduction (first 15°) and is tested with the empty-can (Jobe) test. Subscapularis → internal rotation (lift-off/belly-press). Infraspinatus/teres minor → external rotation.",
    ["upper limb", "Medium"]
  ),
  anatomy(
    "During upper abdominal surgery, a surgeon ligates the celiac trunk. Which arterial supply is eliminated?",
    [
      "Superior mesenteric artery only",
      "Left gastric, splenic, and common hepatic arteries",
      "Inferior mesenteric artery branches",
      "Cystic artery only",
    ],
    "Left gastric, splenic, and common hepatic arteries",
    "Celiac trunk trifurcates into left gastric, splenic, and common hepatic arteries (foregut supply). SMA supplies midgut; IMA supplies hindgut.",
    ["abdomen", "Medium"]
  ),
  anatomy(
    "A 65-year-old man with a ruptured anterior communicating artery aneurysm. Which vascular structure is most commonly involved in anterior circulation aneurysms at the circle of Willis?",
    [
      "Posterior communicating artery",
      "Anterior communicating artery",
      "Basilar artery tip",
      "Vertebral artery",
    ],
    "Anterior communicating artery",
    "ACom aneurysms are among the most common intracranial aneurysms at the anterior circle of Willis. PCom aneurysms are also common but ACom is classic board answer for anterior communicating rupture presentation.",
    ["neuroanatomy", "Medium"]
  ),
  anatomy(
    "An infection spreads from the scalp through emissary veins to the intracranial venous sinuses. Which scalp layer contains the loose areolar connective tissue that allows this dangerous spread?",
    [
      "Skin",
      "Dense connective tissue (galea aponeurotica)",
      "Loose areolar layer (danger zone)",
      "Pericranium",
    ],
    "Loose areolar layer (danger zone)",
    "Scalp layers: SCALP — Skin, Connective tissue, Aponeurosis, Loose areolar (danger zone with emissary veins), Periosteum. Infection can spread intracranially through emissary veins in the loose layer.",
    ["head/neck", "Medium"]
  ),
  anatomy(
    "A patient with a left neck knife wound has chylous drainage from the wound. Which duct is most likely injured?",
    [
      "Right lymphatic duct",
      "Thoracic duct (left)",
      "Cisterna chyli only without duct injury",
      "Bronchomediastinal trunk on the right",
    ],
    "Thoracic duct (left)",
    "The thoracic duct drains most of the body, ascends through the posterior mediastinum, and empties at the left venous angle (junction of left subclavian and internal jugular). Injury causes chyle leak. Right duct drains right upper quadrant only.",
    ["thorax", "lymphatics", "Hard"]
  ),
  anatomy(
    "A 22-year-old runner feels a snap in the groin during a pivot. MRI shows an avulsion at the ischial tuberosity. Which muscle group is most likely injured?",
    [
      "Quadriceps (rectus femoris)",
      "Hamstrings (biceps femoris, semitendinosus, semimembranosus)",
      "Adductor longus only",
      "Iliopsoas",
    ],
    "Hamstrings (biceps femoris, semitendinosus, semimembranosus)",
    "Hamstrings originate from the ischial tuberosity; sprinting/pivoting can avulse the common hamstring origin. Rectus femoris originates from the anterior inferior iliac spine/acetabulum.",
    ["lower limb", "Medium"]
  ),
  anatomy(
    "A patient with an ankle inversion injury has tenderness over the anterior talofibular ligament. Which ligament is most commonly torn first in inversion sprains?",
    [
      "Deltoid ligament",
      "Anterior talofibular ligament",
      "Spring ligament",
      "Tibiofibular syndesmosis only",
    ],
    "Anterior talofibular ligament",
    "Inversion injuries tear the lateral ligament complex in order: ATFL first, then calcaneofibular, then posterior talofibular. Deltoid (medial) is injured with eversion.",
    ["lower limb", "Easy"]
  ),
  anatomy(
    "A dental block is planned through the foramen ovale. Which structure passes through this foramen?",
    [
      "Maxillary division of CN V (V2)",
      "Mandibular division of CN V (V3)",
      "Facial nerve (CN VII)",
      "Hypoglossal nerve (CN XII)",
    ],
    "Mandibular division of CN V (V3)",
    "Foramen ovale transmits V3 (mandibular nerve). Foramen rotundum → V2; superior orbital fissure → V1 branches. CN VII exits via the stylomastoid foramen.",
    ["head/neck", "cranial nerves", "Easy"]
  ),
  anatomy(
    "After thyroid surgery, a patient has hoarseness and breathy voice. The recurrent laryngeal nerve was most likely injured on which side if this followed a left thyroid lobectomy?",
    [
      "Left recurrent laryngeal nerve",
      "Right recurrent laryngeal nerve",
      "External branch of superior laryngeal nerve only",
      "Glossopharyngeal nerve (CN IX)",
    ],
    "Left recurrent laryngeal nerve",
    "Recurrent laryngeal nerves innervate all intrinsic laryngeal muscles except cricothyroid. Left RLN loops under the aortic arch and is vulnerable during left thyroid surgery → unilateral vocal cord paralysis and hoarseness.",
    ["head/neck", "Medium"]
  ),
  anatomy(
    "A surgeon notes that the esophagus passes through the diaphragm at which vertebral level?",
    [
      "T8 (inferior vena cava)",
      "T10 (esophagus)",
      "T12 (aorta/thoracic duct/azygos)",
      "L1 (no structure)",
    ],
    "T10 (esophagus)",
    "Diaphragm openings: T8 = IVC; T10 = esophagus + vagus trunks; T12 = aorta, thoracic duct, azygos vein. 'At 8, 10, 12 the structures pass through heaven.'",
    ["thorax", "abdomen", "Easy"]
  ),
];
