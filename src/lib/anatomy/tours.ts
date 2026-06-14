import type { ExamSlug } from "@/types/edtech";
import type { AnatomyQuizQuestion, AnatomyTour } from "./types";
import { ANATOMY_PROCEDURE_TOURS } from "./procedure-tours";

export const ANATOMY_TOURS: AnatomyTour[] = [
  {
    id: "usmle-heart-anatomy",
    title: "High-Yield Heart Anatomy",
    subtitle: "USMLE Step 1 cardiovascular localization",
    examFocus: "USMLE Step 1",
    steps: [
      {
        structureId: "heart",
        narration:
          "Start with the heart — know chamber flow, valve locations, and coronary dominance for STEMI localization.",
      },
      {
        structureId: "aorta",
        narration:
          "Trace the aorta from the left ventricle through the arch. Coarctation and dissection are classic board presentations.",
      },
      {
        structureId: "lungs",
        narration:
          "The lungs sit flanking the heart. Remember right main bronchus anatomy for aspiration and V/Q physiology.",
      },
      {
        structureId: "diaphragm",
        narration:
          "The diaphragm separates thorax from abdomen. Phrenic nerve (C3–C5) and hiatal hernia sites are high-yield.",
      },
    ],
  },
  {
    id: "nclex-respiratory-basics",
    title: "Respiratory Essentials for NCLEX",
    subtitle: "Airway anatomy and clinical red flags",
    examFocus: "NCLEX-RN",
    steps: [
      {
        structureId: "lungs",
        narration:
          "Right lung has three lobes and a more vertical main bronchus — key for aspiration pneumonia patterns.",
      },
      {
        structureId: "diaphragm",
        narration:
          "Diaphragmatic irritation causes referred shoulder pain — think splenic rupture or ectopic pregnancy.",
      },
      {
        structureId: "heart",
        narration:
          "Heart borders and auscultation sites help correlate murmurs with valve pathology on clinical items.",
      },
    ],
  },
  {
    id: "neuro-stroke-localization",
    title: "Neuroanatomy for Stroke Workup",
    subtitle: "Brain, cord, and vascular territories",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "brain",
        narration:
          "MCA territory strokes cause contralateral face/arm weakness; dominant hemisphere → aphasia.",
      },
      {
        structureId: "carotid-artery",
        narration:
          "Carotid disease is a major stroke source — know anterior circulation vs vertebrobasilar symptoms.",
      },
      {
        structureId: "skull",
        narration:
          "Skull fracture patterns predict complications — epidural (middle meningeal) vs subdural (bridging veins).",
      },
      {
        structureId: "spinal-cord",
        narration:
          "Brown-Séquard and complete cord syndromes test your knowledge of tract anatomy and level localization.",
      },
    ],
  },
  {
    id: "gi-hepatobiliary",
    title: "GI & Hepatobiliary Essentials",
    subtitle: "RUQ anatomy for boards and wards",
    examFocus: "USMLE Step 2 / NCLEX",
    steps: [
      {
        structureId: "liver",
        narration:
          "Portal hypertension from cirrhosis drives varices, ascites, and splenomegaly — trace the portal system.",
      },
      {
        structureId: "gallbladder",
        narration:
          "Murphy sign and RUQ pain localize acute cholecystitis; Courvoisier suggests malignant biliary obstruction.",
      },
      {
        structureId: "pancreas",
        narration:
          "Epigastric pain radiating to the back — pancreatitis. Head tumors cause painless jaundice.",
      },
      {
        structureId: "appendix",
        narration:
          "RLQ tenderness at McBurney point is classic appendicitis; retrocecal position can mask signs.",
      },
    ],
  },
  {
    id: "renal-urinary",
    title: "Renal & Urinary Tract",
    subtitle: "Fluids, electrolytes, and obstruction",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "kidneys",
        narration:
          "Know nephron physiology for AKI workup — prerenal vs intrinsic vs postrenal patterns.",
      },
      {
        structureId: "bladder",
        narration:
          "Acute retention is painful and needs catheterization; painless hematuria raises concern for malignancy.",
      },
      {
        structureId: "aorta",
        narration:
          "Renal arteries branch from the aorta — renovascular disease can cause refractory hypertension.",
      },
    ],
  },
  {
    id: "msk-extremities",
    title: "MSK Extremity Landmarks",
    subtitle: "Fractures, nerves, and compartment red flags",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "humerus",
        narration:
          "Surgical neck fractures threaten the axillary nerve; spiral groove fractures affect the radial nerve.",
      },
      {
        structureId: "femur",
        narration:
          "Hip fractures present shortened, externally rotated leg — AVN risk highest with femoral neck fractures.",
      },
      {
        structureId: "tibia",
        narration:
          "Tibial shaft fractures carry compartment syndrome risk — pain with passive stretch is an emergency.",
      },
      {
        structureId: "biceps-brachii",
        narration:
          "Biceps reflex tests C5–C6; musculocutaneous nerve injury weakens flexion and forearm supination.",
      },
    ],
  },
  {
    id: "endocrine-hormones",
    title: "Endocrine Landmarks",
    subtitle: "Thyroid, adrenal, and hormone emergencies",
    examFocus: "USMLE Step 2 / NAPLEX",
    steps: [
      {
        structureId: "thyroid",
        narration:
          "Thyroid surgery risks recurrent laryngeal nerve injury — hoarseness is a red flag post-op.",
      },
      {
        structureId: "adrenal-glands",
        narration:
          "Adrenal cortex vs medulla — Cushing, Addison, and pheochromocytoma are classic board presentations.",
      },
      {
        structureId: "pancreas",
        narration:
          "Endocrine pancreas (islets) vs exocrine enzymes — DKA/HHS tie glucose physiology to anatomy.",
      },
    ],
  },
  {
    id: "nclex-trauma-chest",
    title: "Trauma & Chest Emergencies",
    subtitle: "Prioritization and perfusion anatomy",
    examFocus: "NCLEX-RN",
    steps: [
      {
        structureId: "sternum",
        narration:
          "Sternal fractures suggest significant blunt chest trauma — assess for cardiac contusion and rib injuries.",
      },
      {
        structureId: "spleen",
        narration:
          "Splenic rupture after abdominal trauma — Kehr sign and hemodynamic instability require rapid response.",
      },
      {
        structureId: "diaphragm",
        narration:
          "Referred shoulder pain from diaphragmatic irritation links abdominal catastrophe to chest assessment.",
      },
      {
        structureId: "aorta",
        narration:
          "Tearing chest pain radiating to the back — think aortic dissection until proven otherwise.",
      },
    ],
  },
  ...ANATOMY_PROCEDURE_TOURS,
];

export const ANATOMY_QUIZ_QUESTIONS: AnatomyQuizQuestion[] = [
  {
    id: "q-heart",
    prompt: "Click the structure that contains the SA node and four chambers.",
    structureId: "heart",
    distractorIds: ["lungs", "aorta", "liver"],
  },
  {
    id: "q-lungs",
    prompt: "Which structure has three lobes on the right and is the primary site of gas exchange?",
    structureId: "lungs",
    distractorIds: ["heart", "diaphragm", "stomach"],
  },
  {
    id: "q-brain",
    prompt: "Click the central organ where MCA territory strokes cause contralateral weakness.",
    structureId: "brain",
    distractorIds: ["spinal-cord", "skull", "thyroid"],
  },
  {
    id: "q-kidneys",
    prompt: "Select the retroperitoneal organs that filter blood via nephrons.",
    structureId: "kidneys",
    distractorIds: ["liver", "spleen", "stomach"],
  },
  {
    id: "q-diaphragm",
    prompt: "Click the muscle innervated by the phrenic nerve (C3–C5).",
    structureId: "diaphragm",
    distractorIds: ["biceps-brachii", "heart", "femur"],
  },
  {
    id: "q-spleen",
    prompt: "Which organ in the LUQ can rupture with Kehr sign (referred shoulder pain)?",
    structureId: "spleen",
    distractorIds: ["liver", "kidneys", "stomach"],
  },
  {
    id: "q-liver",
    prompt: "Click the largest organ in the RUQ with dual hepatic and portal blood supply.",
    structureId: "liver",
    distractorIds: ["spleen", "stomach", "pancreas"],
  },
  {
    id: "q-pancreas",
    prompt: "Select the retroperitoneal gland whose head lies in the duodenal C-loop.",
    structureId: "pancreas",
    distractorIds: ["gallbladder", "appendix", "bladder"],
  },
  {
    id: "q-gallbladder",
    prompt: "Click the bile storage organ tested with Murphy sign in the RUQ.",
    structureId: "gallbladder",
    distractorIds: ["liver", "stomach", "spleen"],
  },
  {
    id: "q-trachea",
    prompt: "Which cartilaginous airway bifurcates at the carina (T4–T5)?",
    structureId: "trachea",
    distractorIds: ["thyroid", "aorta", "esophagus"],
  },
  {
    id: "q-carotid",
    prompt: "Click the neck arteries whose internal branch supplies anterior cerebral circulation.",
    structureId: "carotid-artery",
    distractorIds: ["aorta", "thyroid", "trachea"],
  },
  {
    id: "q-bladder",
    prompt: "Select the pelvic reservoir for urine with a trigone at its base.",
    structureId: "bladder",
    distractorIds: ["kidneys", "appendix", "stomach"],
  },
  {
    id: "q-femur",
    prompt: "Click the longest bone — common site of hip fracture in older adults.",
    structureId: "femur",
    distractorIds: ["humerus", "tibia", "sternum"],
  },
  {
    id: "q-humerus",
    prompt: "Which upper-extremity bone fracture can injure the axillary nerve at the surgical neck?",
    structureId: "humerus",
    distractorIds: ["femur", "tibia", "skull"],
  },
  {
    id: "q-appendix",
    prompt: "Click the RLQ structure associated with McBurney point tenderness.",
    structureId: "appendix",
    distractorIds: ["gallbladder", "bladder", "spleen"],
  },
  {
    id: "q-thyroid",
    prompt: "Click the butterfly-shaped gland anterior to the trachea that produces T3/T4.",
    structureId: "thyroid",
    distractorIds: ["trachea", "esophagus", "carotid-artery"],
  },
  {
    id: "q-aorta",
    prompt: "Select the largest artery — dissection presents with tearing chest pain radiating to the back.",
    structureId: "aorta",
    distractorIds: ["carotid-artery", "heart", "esophagus"],
  },
  {
    id: "q-skull",
    prompt: "Click the bony structure — epidural hematoma often follows middle meningeal artery injury.",
    structureId: "skull",
    distractorIds: ["brain", "vertebral-column", "sternum"],
  },
  {
    id: "q-esophagus",
    prompt: "Which muscular tube passes through the esophageal hiatus at T10?",
    structureId: "esophagus",
    distractorIds: ["trachea", "stomach", "duodenum"],
  },
  {
    id: "q-adrenal",
    prompt: "Click the paired suprarenal glands — pheochromocytoma arises from the medulla.",
    structureId: "adrenal-glands",
    distractorIds: ["kidneys", "pancreas", "thyroid"],
  },
  {
    id: "q-prostate",
    prompt: "Select the male gland encircling the urethra below the bladder.",
    structureId: "prostate",
    distractorIds: ["bladder", "appendix", "duodenum"],
  },
  {
    id: "q-vertebral",
    prompt: "Click the column of vertebrae protecting the spinal cord.",
    structureId: "vertebral-column",
    distractorIds: ["spinal-cord", "sternum", "femur"],
  },
  {
    id: "q-sternum",
    prompt: "Which flat midline chest bone is the target landmark for CPR compressions?",
    structureId: "sternum",
    distractorIds: ["clavicle", "scapula", "diaphragm"],
  },
  {
    id: "q-colonoscopy",
    prompt: "Which large bowel segment is the classic site for screening colonoscopy and sigmoid diverticulitis?",
    structureId: "colon-sigmoid",
    distractorIds: ["colon", "appendix", "duodenum"],
  },
  {
    id: "q-carina",
    prompt: "Click the airway bifurcation landmark used in bronchoscopy and mainstem intubation checks.",
    structureId: "trachea-carina",
    distractorIds: ["trachea", "lungs", "diaphragm"],
  },
  {
    id: "q-femur-neck",
    prompt: "Select the intracapsular hip segment where fractures risk AVN and often need arthroplasty in elderly patients.",
    structureId: "femur-neck",
    distractorIds: ["femur", "tibia", "humerus"],
  },
];

export function getTourById(id: string): AnatomyTour | undefined {
  return ANATOMY_TOURS.find((t) => t.id === id);
}

function tourExamRelevance(tour: AnatomyTour, examSlug: ExamSlug): number {
  const focus = tour.examFocus.toLowerCase();
  if (examSlug === "usmle") {
    if (focus.includes("usmle") && !focus.includes("nclex")) return 0;
    if (focus.includes("usmle / nclex") || focus.includes("usmle/nclex")) return 1;
    if (focus.includes("nclex")) return 2;
  }
  if (examSlug === "nclex") {
    if (focus.includes("nclex") && !focus.includes("usmle")) return 0;
    if (focus.includes("usmle / nclex") || focus.includes("usmle/nclex")) return 1;
    if (focus.includes("usmle")) return 2;
  }
  return 0;
}

/** Tours sorted by relevance to the active exam (naplex/mpje show all, default order). */
export function getToursForExam(examSlug: ExamSlug): AnatomyTour[] {
  if (examSlug !== "usmle" && examSlug !== "nclex") {
    return ANATOMY_TOURS;
  }
  return [...ANATOMY_TOURS].sort(
    (a, b) => tourExamRelevance(a, examSlug) - tourExamRelevance(b, examSlug)
  );
}
