import type { AnatomyStructure } from "../types";

/**
 * Clickable sub-regions nested under parent organs.
 * Each has its own mesh for Phase 2 zoom/highlight in the 3D explorer.
 */
export const ANATOMY_SUBREGION_STRUCTURES: AnatomyStructure[] = [
  // —— Heart ——
  {
    id: "heart-aortic-valve",
    parentId: "heart",
    name: "Aortic valve",
    system: "cardiovascular",
    layer: "organ",
    description:
      "Trileaflet valve between the left ventricle and ascending aorta. Systolic ejection murmur localizes here.",
    clinicalFacts: [
      "Aortic stenosis: crescendo-decrescendo murmur at RUSB, radiates to carotids",
      "Type A dissection can cause acute aortic regurgitation — emergent surgery",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "cardiovascular",
    highYieldTopicSlug: "cardiovascular",
    meshId: "heart-aortic-valve",
    keywords: ["aortic valve", "AS", "AR", "RUSB"],
  },
  {
    id: "heart-mitral-valve",
    parentId: "heart",
    name: "Mitral valve",
    system: "cardiovascular",
    layer: "organ",
    description:
      "Bicuspid valve between left atrium and left ventricle. Mitral regurgitation and stenosis are high-yield murmurs.",
    clinicalFacts: [
      "Mitral regurgitation: holosystolic murmur at apex radiating to axilla",
      "Rheumatic mitral stenosis → opening snap, diastolic rumble at apex",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "cardiovascular",
    highYieldTopicSlug: "cardiovascular",
    meshId: "heart-mitral-valve",
    keywords: ["mitral valve", "MR", "MS", "apex"],
  },
  {
    id: "heart-left-ventricle",
    parentId: "heart",
    name: "Left ventricle",
    system: "cardiovascular",
    layer: "organ",
    description:
      "Thick-walled chamber pumping oxygenated blood into the aorta. LV dysfunction drives heart failure and cardiogenic shock.",
    clinicalFacts: [
      "Anterior STEMI → LAD territory → LV anterior wall dysfunction",
      "Cardiogenic shock: cold clammy extremities, pulmonary edema, narrow pulse pressure",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stemi-path"],
    practiceTopicSlug: "cardiovascular",
    highYieldTopicSlug: "cardiovascular",
    meshId: "heart-left-ventricle",
    keywords: ["left ventricle", "LV", "STEMI", "heart failure"],
  },
  {
    id: "heart-coronary-arteries",
    parentId: "heart",
    name: "Coronary arteries",
    system: "cardiovascular",
    layer: "vascular",
    description:
      "LAD, LCx, and RCA supply the myocardium. Dominance (right vs left) determines collateral flow in ischemia.",
    clinicalFacts: [
      "LAD occlusion → anterior STEMI; RCA → inferior STEMI with bradycardia/AV block",
      "CABG uses LIMA to LAD for best long-term patency",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stemi-path", "usmle-acs-spectrum"],
    practiceTopicSlug: "cardiovascular",
    highYieldTopicSlug: "cardiovascular",
    meshId: "heart-coronary-arteries",
    keywords: ["LAD", "RCA", "LCx", "CABG", "PCI"],
  },
  // —— Lungs ——
  {
    id: "lung-right-upper",
    parentId: "lungs",
    name: "Right upper lobe",
    system: "respiratory",
    layer: "organ",
    description: "Superior segment of the right lung — common site for TB cavities and Pancoast tumors.",
    clinicalFacts: [
      "Right upper lobe consolidation on CXR — consider pneumonia vs malignancy in smokers",
      "Superior sulcus (Pancoast) tumors can invade brachial plexus → Horner syndrome",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "respiratory",
    meshId: "lung-right-upper",
    keywords: ["RUL", "lobectomy", "Pancoast"],
  },
  {
    id: "lung-right-lower",
    parentId: "lungs",
    name: "Right lower lobe",
    system: "respiratory",
    layer: "organ",
    description:
      "Most common aspiration site due to vertical right main bronchus — board favorite for pneumonia localization.",
    clinicalFacts: [
      "Aspiration pneumonia classically localizes to dependent segments (RLL supine, RUL upright drunk)",
      "PE with infarction can cause pleuritic chest pain and hemoptysis",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "respiratory",
    meshId: "lung-right-lower",
    keywords: ["RLL", "aspiration", "lobectomy"],
  },
  {
    id: "lung-left-upper",
    parentId: "lungs",
    name: "Left upper lobe",
    system: "respiratory",
    layer: "organ",
    description: "Left upper lobe includes the lingula — important for lobar pneumonia and surgical resection planning.",
    clinicalFacts: [
      "Left pneumonectomy reduces cardiac output reserve — monitor for post-op pulmonary edema",
      "VATS lobectomy is standard for early-stage lung cancer in fit patients",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "respiratory",
    meshId: "lung-left-upper",
    keywords: ["LUL", "lingula", "VATS"],
  },
  // —— Liver ——
  {
    id: "liver-right-lobe",
    parentId: "liver",
    name: "Right hepatic lobe",
    system: "digestive",
    layer: "organ",
    description:
      "Larger lobe containing segments V–VIII. Resection planning uses Couinaud segments for tumors and trauma.",
    clinicalFacts: [
      "Right hepatectomy for malignant tumors requires adequate future liver remnant volume",
      "Budd-Chiari affects hepatic venous outflow — painful hepatomegaly, ascites",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "liver-right-lobe",
    keywords: ["hepatectomy", "segments", "right lobe"],
  },
  {
    id: "liver-portal-hilum",
    parentId: "liver",
    name: "Porta hepatis",
    system: "digestive",
    layer: "organ",
    description:
      "Hilar plate where portal vein, hepatic artery, and common bile duct enter the liver — critical in hepatobiliary surgery.",
    clinicalFacts: [
      "Pringle maneuver clamps the hepatoduodenal ligament to control hepatic inflow during trauma",
      "Klatskin tumors arise at the hepatic duct bifurcation",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "liver-portal-hilum",
    keywords: ["porta hepatis", "Pringle", "Klatskin"],
  },
  // —— Gallbladder ——
  {
    id: "gallbladder-cystic-duct",
    parentId: "gallbladder",
    name: "Cystic duct",
    system: "digestive",
    layer: "organ",
    description:
      "Connects gallbladder to common bile duct. Critical view of safety in lap chole protects this structure.",
    clinicalFacts: [
      "CBD injury during cholecystectomy → bile leak, stricture — may need ERCP stent or hepaticojejunostomy",
      "Courvoisier sign: painless palpable gallbladder + jaundice suggests malignant obstruction",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "gallbladder-cystic-duct",
    keywords: ["cystic duct", "CBD injury", "cholecystectomy"],
  },
  // —— Pancreas ——
  {
    id: "pancreas-head",
    parentId: "pancreas",
    name: "Pancreatic head",
    system: "digestive",
    layer: "organ",
    description:
      "Head of pancreas nestled in the C-loop of duodenum. Ampulla drains bile and pancreatic secretions.",
    clinicalFacts: [
      "Pancreatic head adenocarcinoma → painless jaundice, weight loss, palpable gallbladder (Courvoisier)",
      "Whipple (pancreaticoduodenectomy) resects head, duodenum, distal stomach, and CBD",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "pancreas-head",
    keywords: ["Whipple", "pancreatic cancer", "ampulla"],
  },
  {
    id: "pancreas-tail",
    parentId: "pancreas",
    name: "Pancreatic tail",
    system: "digestive",
    layer: "organ",
    description: "Extends toward the splenic hilum — distal pancreatectomy risks splenic vessel injury.",
    clinicalFacts: [
      "Distal pancreatectomy ± splenectomy for tail lesions or chronic pancreatitis",
      "MEN1 can cause gastrinomas in the pancreas — refractory peptic ulcer disease",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "pancreas-tail",
    keywords: ["distal pancreatectomy", "splenic hilum"],
  },
  // —— Kidneys ——
  {
    id: "kidney-renal-pelvis",
    parentId: "kidneys",
    name: "Renal pelvis",
    system: "urinary",
    layer: "organ",
    description:
      "Collecting system funneling urine into the ureter. Urothelial carcinoma can arise here.",
    clinicalFacts: [
      "Painless gross hematuria → urothelial cancer until proven otherwise",
      "Staghorn calculi fill the pelvis — often infection-related struvite stones",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "renal",
    meshId: "kidney-renal-pelvis",
    keywords: ["renal pelvis", "hematuria", "nephrolithiasis"],
  },
  // —— Thyroid ——
  {
    id: "thyroid-isthmus",
    parentId: "thyroid",
    name: "Thyroid isthmus",
    system: "endocrine",
    layer: "organ",
    description:
      "Bridge between lobes crossing the trachea at cricoid level — midline landmark in thyroidectomy.",
    clinicalFacts: [
      "Recurrent laryngeal nerve runs in the tracheoesophageal groove — hoarseness post-op is a red flag",
      "Total thyroidectomy for cancer or Graves — lifelong levothyroxine replacement",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "endocrine",
    meshId: "thyroid-isthmus",
    keywords: ["thyroidectomy", "RLN", "isthmus"],
  },
  // —— Prostate ——
  {
    id: "prostate-peripheral-zone",
    parentId: "prostate",
    name: "Prostate peripheral zone",
    system: "urinary",
    layer: "organ",
    description:
      "Posterior/lateral zone where most adenocarcinomas arise — targeted in TRUS-guided biopsy.",
    clinicalFacts: [
      "Digital rectal exam palpates posterior peripheral zone — nodule raises cancer concern",
      "TURP treats BPH by resecting prostatic urethral tissue — not curative for cancer",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "genitourinary",
    meshId: "prostate-peripheral-zone",
    keywords: ["TURP", "prostate cancer", "biopsy"],
  },
  // —— Brain ——
  {
    id: "brain-frontal-lobe",
    parentId: "brain",
    name: "Frontal lobe",
    system: "nervous",
    layer: "organ",
    description:
      "Anterior cerebrum — executive function, motor planning (precentral gyrus), Broca area (dominant hemisphere).",
    clinicalFacts: [
      "Frontal lobe syndrome: disinhibition, apathy, urinary incontinence",
      "Broca aphasia: non-fluent speech with intact comprehension (dominant frontal lobe)",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stroke-tpa"],
    practiceTopicSlug: "neurology-stroke",
    highYieldTopicSlug: "neurology-stroke",
    meshId: "brain-frontal-lobe",
    keywords: ["frontal", "precentral", "Broca", "executive"],
  },
  {
    id: "brain-parietal-lobe",
    parentId: "brain",
    name: "Parietal lobe",
    system: "nervous",
    layer: "organ",
    description:
      "Superior and lateral postcentral cortex — primary somatosensory integration, spatial awareness, neglect when non-dominant.",
    clinicalFacts: [
      "Contralateral hemisensory loss with parietal stroke",
      "Hemispatial neglect after right parietal lesion — patient ignores left side of space",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stroke-tpa"],
    practiceTopicSlug: "neurology-stroke",
    highYieldTopicSlug: "neurology-stroke",
    meshId: "brain-parietal-lobe",
    keywords: ["parietal", "postcentral", "neglect", "somatosensory"],
  },
  {
    id: "brain-temporal-lobe",
    parentId: "brain",
    name: "Temporal lobe",
    system: "nervous",
    layer: "organ",
    description:
      "Lateral cerebrum — auditory cortex (Heschl gyrus), memory (hippocampus medial), Wernicke area (dominant).",
    clinicalFacts: [
      "Wernicke aphasia: fluent but nonsensical speech with impaired comprehension",
      "Temporal lobe epilepsy — déjà vu, lip smacking automatisms",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stroke-tpa", "usmle-meningitis-emergency"],
    practiceTopicSlug: "neurology-stroke",
    highYieldTopicSlug: "neurology-stroke",
    meshId: "brain-temporal-lobe",
    keywords: ["temporal", "Wernicke", "Heschl", "hippocampus"],
  },
  {
    id: "brain-occipital-lobe",
    parentId: "brain",
    name: "Occipital lobe",
    system: "nervous",
    layer: "organ",
    description: "Posterior cerebrum — primary visual cortex. Lesions cause contralateral homonymous hemianopia.",
    clinicalFacts: [
      "PCA stroke → contralateral homonymous hemianopia with macular sparing",
      "Anton's syndrome: cortical blindness with denial of deficit (bilateral occipital)",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stroke-tpa"],
    practiceTopicSlug: "neurology-stroke",
    highYieldTopicSlug: "neurology-stroke",
    meshId: "brain-occipital-lobe",
    keywords: ["occipital", "visual", "hemianopia", "PCA"],
  },
  {
    id: "brain-cerebellum",
    parentId: "brain",
    name: "Cerebellum",
    system: "nervous",
    layer: "organ",
    description:
      "Posterior fossa — coordinates movement, balance, and fine motor control. Vermis vs hemispheric syndromes differ.",
    clinicalFacts: [
      "Cerebellar stroke: vertigo, ataxia, dysmetria — can mimic peripheral vertigo",
      "Vermis lesions → truncal ataxia; hemispheric lesions → limb dysmetria ipsilateral",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stroke-tpa"],
    practiceTopicSlug: "neurology-stroke",
    highYieldTopicSlug: "neurology-stroke",
    meshId: "brain-cerebellum",
    keywords: ["cerebellum", "ataxia", "dysmetria", "posterior fossa"],
  },
  {
    id: "brain-insula",
    parentId: "brain",
    name: "Insula",
    system: "nervous",
    layer: "organ",
    description:
      "Deep cortex beneath the lateral sulcus — interoception, visceral sensation, and integration of autonomic responses.",
    clinicalFacts: [
      "Insular stroke can present with pain, autonomic instability, or speech disturbance",
      "Central to the salience network linking emotion and bodily state",
    ],
    highYield: false,
    memoryCardIds: [],
    practiceTopicSlug: "neurology-stroke",
    meshId: "brain-insula",
    keywords: ["insula", "interoception", "lateral sulcus"],
  },
  {
    id: "brain-brainstem",
    parentId: "brain",
    name: "Brainstem",
    system: "nervous",
    layer: "organ",
    description:
      "Midbrain, pons, and medulla — cranial nerve nuclei, respiratory/cardiovascular centers, and ascending/descending tracts.",
    clinicalFacts: [
      "Locked-in syndrome: conscious patient with only vertical eye movements — basilar artery stroke",
      "CN III palsy with down-and-out eye + ptosis — compressive aneurysm vs microvascular",
    ],
    highYield: true,
    memoryCardIds: ["usmle-stroke-tpa"],
    practiceTopicSlug: "neurology-stroke",
    highYieldTopicSlug: "neurology-stroke",
    meshId: "brain-brainstem",
    keywords: ["brainstem", "CN III", "basilar", "pons", "medulla"],
  },
  // —— Stomach ——
  {
    id: "stomach-pylorus",
    parentId: "stomach",
    name: "Pylorus",
    system: "digestive",
    layer: "organ",
    description:
      "Gastroduodenal junction guarded by the pyloric sphincter — site of peptic ulcer disease and gastric outlet obstruction.",
    clinicalFacts: [
      "H. pylori and NSAIDs cause peptic ulcer disease — test-and-treat before chronic PPI",
      "Billroth procedures alter gastric anatomy — watch for dumping and B12 deficiency",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "stomach-pylorus",
    keywords: ["pylorus", "PUD", "gastrectomy"],
  },
  // —— Colon ——
  {
    id: "colon-sigmoid",
    parentId: "colon",
    name: "Sigmoid colon",
    system: "digestive",
    layer: "organ",
    description:
      "S-shaped distal colon — common site for diverticulitis, volvulus, and colonoscopy screening.",
    clinicalFacts: [
      "Diverticulitis: LLQ pain, fever — CT shows colonic wall thickening; colonoscopy deferred in acute phase",
      "Screening colonoscopy starts age 45 (USPSTF) — polypectomy prevents progression to cancer",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "gastrointestinal",
    meshId: "colon-sigmoid",
    keywords: ["sigmoid", "diverticulitis", "colonoscopy"],
  },
  // —— Bladder ——
  {
    id: "bladder-trigone",
    parentId: "bladder",
    name: "Bladder trigone",
    system: "urinary",
    layer: "organ",
    description:
      "Ureteral orifices and urethral opening form the trigone — urothelial tumors often arise here.",
    clinicalFacts: [
      "Interstitial cystitis: bladder pain syndrome with negative urine culture",
      "Post-TURBT surveillance cystoscopy detects recurrence of non-muscle-invasive bladder cancer",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "genitourinary",
    meshId: "bladder-trigone",
    keywords: ["trigone", "TURBT", "cystoscopy"],
  },
  // —— Spleen ——
  {
    id: "spleen-hilum",
    parentId: "spleen",
    name: "Splenic hilum",
    system: "lymphatic",
    layer: "organ",
    description:
      "Splenic artery and vein enter at the hilum — ligation during splenectomy; tail of pancreas is adjacent.",
    clinicalFacts: [
      "Left upper quadrant tenderness after trauma → splenic injury until CT proves otherwise",
      "Howell-Jolly bodies on smear suggest hyposplenism after splenectomy",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "hematology",
    meshId: "spleen-hilum",
    keywords: ["splenic hilum", "splenectomy", "trauma"],
  },
  // —— Aorta ——
  {
    id: "aorta-ascending",
    parentId: "aorta",
    name: "Ascending aorta",
    system: "cardiovascular",
    layer: "vascular",
    description:
      "Proximal aorta from the aortic valve to the arch — type A dissection involves this segment.",
    clinicalFacts: [
      "Type A dissection: tearing chest pain to back, mediastinal widening — emergent surgical repair",
      "Marfan and bicuspid aortic valve increase risk of aortic root dilation and dissection",
    ],
    highYield: true,
    memoryCardIds: ["usmle-acs-spectrum"],
    practiceTopicSlug: "cardiovascular",
    highYieldTopicSlug: "cardiovascular",
    meshId: "aorta-ascending",
    keywords: ["ascending aorta", "dissection", "Marfan"],
  },
  // —— Trachea ——
  {
    id: "trachea-carina",
    parentId: "trachea",
    name: "Carina",
    system: "respiratory",
    layer: "organ",
    description:
      "Bifurcation of the trachea into main bronchi — landmark for bronchoscopy and ETT placement.",
    clinicalFacts: [
      "Double-lumen ETT or bronchoscopy localizes to carina for lung isolation",
      "Endobronchial intubation (right mainstem) causes left lung collapse on CXR",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "respiratory",
    meshId: "trachea-carina",
    keywords: ["carina", "bronchoscopy", "intubation"],
  },
  // —— Femur ——
  {
    id: "femur-neck",
    parentId: "femur",
    name: "Femoral neck",
    system: "skeletal",
    layer: "bone",
    description:
      "Intracapsular segment between head and shaft — hip fractures here risk AVN of the femoral head.",
    clinicalFacts: [
      "Displaced femoral neck fracture in elderly → hemiarthroplasty; ORIF in young active patients",
      "Intertrochanteric fracture is extracapsular — better blood supply, different fixation",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "anatomy",
    meshId: "femur-neck",
    keywords: ["hip fracture", "femoral neck", "AVN"],
  },
  // —— Spinal cord ——
  {
    id: "spinal-cord-cervical",
    parentId: "spinal-cord",
    name: "Cervical spinal cord",
    system: "nervous",
    layer: "nerve",
    description:
      "C3–C5 contribute phrenic nerve (diaphragm); high cervical injury threatens independent ventilation.",
    clinicalFacts: [
      "C5 level preserves biceps (C5–C6) but may lose hand function — ASIA grading guides prognosis",
      "Central cord syndrome: upper extremity weakness > lower after hyperextension injury",
    ],
    highYield: true,
    memoryCardIds: [],
    practiceTopicSlug: "neurology-stroke",
    meshId: "spinal-cord-cervical",
    keywords: ["cervical spine", "phrenic", "central cord"],
  },
];

export function getSubregionIds(): Set<string> {
  return new Set(ANATOMY_SUBREGION_STRUCTURES.map((s) => s.id));
}
