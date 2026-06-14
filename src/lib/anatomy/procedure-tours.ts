import type { AnatomyTour } from "../types";

/** Guided procedure tours — zoom to organ sub-regions and walk through named surgeries. */
export const ANATOMY_PROCEDURE_TOURS: AnatomyTour[] = [
  {
    id: "proc-cardiac-interventions",
    kind: "procedure",
    title: "Cardiac Procedures Tour",
    subtitle: "CABG, PCI, valves, and devices",
    examFocus: "USMLE Step 2 / NCLEX",
    steps: [
      {
        structureId: "heart",
        subregionId: "heart-coronary-arteries",
        procedureId: "pci",
        narration:
          "PCI reopens occluded coronaries — door-to-balloon <90 min for STEMI. Know LAD vs RCA territory for ECG localization.",
      },
      {
        structureId: "heart",
        subregionId: "heart-coronary-arteries",
        procedureId: "cabg",
        narration:
          "CABG bypasses stenotic vessels — LIMA to LAD has the best long-term patency. Indicated for left main or complex multivessel disease.",
      },
      {
        structureId: "heart",
        subregionId: "heart-aortic-valve",
        procedureId: "aortic-valve-replacement",
        narration:
          "Severe aortic stenosis with symptoms → AVR. TAVR is an option for high surgical risk — watch for complete heart block.",
      },
      {
        structureId: "heart",
        subregionId: "heart-mitral-valve",
        procedureId: "mitral-valve-repair",
        narration:
          "Mitral regurgitation holosystolic at the apex — repair preferred when feasible to preserve ventricular function.",
      },
      {
        structureId: "heart",
        subregionId: "heart-left-ventricle",
        procedureId: "pacemaker-icd",
        narration:
          "ICD for EF ≤35% on optimal therapy — distinct from pacemaker for bradycardia/heart block.",
      },
    ],
  },
  {
    id: "proc-hepatobiliary",
    kind: "procedure",
    title: "Hepatobiliary Surgery Tour",
    subtitle: "Cholecystectomy, ERCP, liver resection",
    examFocus: "USMLE Step 2 / NCLEX",
    steps: [
      {
        structureId: "gallbladder",
        subregionId: "gallbladder-cystic-duct",
        procedureId: "lap-chole",
        narration:
          "Lap chole is first-line for symptomatic stones — critical view of safety prevents CBD injury.",
      },
      {
        structureId: "pancreas",
        subregionId: "pancreas-head",
        procedureId: "ercp-sphincterotomy",
        narration:
          "ERCP with sphincterotomy for choledocholithiasis — Charcot triad suggests cholangitis needing urgent drainage.",
      },
      {
        structureId: "pancreas",
        subregionId: "pancreas-head",
        procedureId: "whipple",
        narration:
          "Painless jaundice + weight loss → pancreatic head cancer. Whipple resects head, duodenum, and distal stomach.",
      },
      {
        structureId: "liver",
        subregionId: "liver-portal-hilum",
        procedureId: "hepatectomy",
        narration:
          "Partial hepatectomy requires adequate future liver remnant — Pringle maneuver controls inflow during resection.",
      },
    ],
  },
  {
    id: "proc-acute-abdomen",
    kind: "procedure",
    title: "Acute Abdomen Procedures",
    subtitle: "Appendectomy, splenectomy, colectomy",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "appendix",
        procedureId: "appendectomy",
        narration:
          "RLQ tenderness at McBurney point — lap appendectomy for uncomplicated appendicitis; source control if perforated.",
      },
      {
        structureId: "spleen",
        procedureId: "splenectomy",
        narration:
          "Traumatic splenic rupture after abdominal trauma — Kehr sign and hemodynamic instability. Vaccinate for encapsulated organisms post-op.",
      },
      {
        structureId: "colon",
        procedureId: "colectomy",
        narration:
          "Right hemicolectomy for cecal cancer; Hartmann procedure for diverticular perforation with feculent peritonitis.",
      },
    ],
  },
  {
    id: "proc-thoracic",
    kind: "procedure",
    title: "Thoracic Procedures Tour",
    subtitle: "Lobectomy, chest tubes, thoracentesis",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "lungs",
        subregionId: "lung-right-upper",
        procedureId: "lobectomy",
        narration:
          "VATS lobectomy for early lung cancer — same oncologic principles as open thoracotomy with faster recovery.",
      },
      {
        structureId: "lungs",
        procedureId: "chest-tube",
        narration:
          "Tension pneumothorax → needle decompression then chest tube. Insert above the rib to avoid the neurovascular bundle.",
      },
      {
        structureId: "lungs",
        procedureId: "thoracentesis",
        narration:
          "Diagnostic thoracentesis — Light criteria distinguish exudate (malignancy, infection) from transudate (heart failure).",
      },
    ],
  },
  {
    id: "proc-urologic",
    kind: "procedure",
    title: "Urologic Procedures Tour",
    subtitle: "TURP, nephrectomy, bladder tumor resection",
    examFocus: "USMLE Step 2",
    steps: [
      {
        structureId: "prostate",
        subregionId: "prostate-peripheral-zone",
        procedureId: "turp",
        narration:
          "TURP treats BPH obstruction — retrograde ejaculation is common. Prostate cancer is in the peripheral zone, biopsied separately.",
      },
      {
        structureId: "kidneys",
        subregionId: "kidney-renal-pelvis",
        procedureId: "nephrectomy",
        narration:
          "Painless hematuria → urothelial or renal cell cancer. Nephron-sparing partial nephrectomy when oncologically equivalent.",
      },
      {
        structureId: "bladder",
        procedureId: "turbt",
        narration:
          "TURBT diagnoses and stages bladder cancer — muscle-invasive disease may need radical cystectomy.",
      },
    ],
  },
  {
    id: "proc-thyroid-neck",
    kind: "procedure",
    title: "Thyroid & Neck Surgery",
    subtitle: "Thyroidectomy and carotid endarterectomy",
    examFocus: "USMLE Step 2 / NCLEX",
    steps: [
      {
        structureId: "thyroid",
        subregionId: "thyroid-isthmus",
        procedureId: "thyroidectomy",
        narration:
          "Total thyroidectomy for cancer or Graves — watch for recurrent laryngeal nerve injury (hoarseness) and hypocalcemia.",
      },
      {
        structureId: "carotid-artery",
        procedureId: "carotid-endarterectomy",
        narration:
          "Symptomatic high-grade carotid stenosis → CEA to prevent stroke. Perioperative stroke risk is the key outcome metric.",
      },
    ],
  },
  {
    id: "proc-neuro-emergency",
    kind: "procedure",
    title: "Neurosurgical Emergencies",
    subtitle: "Craniotomy, thrombectomy, ICP management",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "brain",
        subregionId: "brain-brainstem",
        procedureId: "mechanical-thrombectomy",
        narration:
          "Large-vessel stroke → thrombectomy when available. tPA has hemorrhage exclusions — time is brain.",
      },
      {
        structureId: "skull",
        procedureId: "craniotomy",
        narration:
          "Epidural hematoma = lucid interval + lens-shaped bleed — emergent craniotomy. Subdural = crescent in elderly.",
      },
      {
        structureId: "brain",
        procedureId: "evd-vp-shunt",
        narration:
          "Hydrocephalus with declining mental status → EVD for ICP control and CSF drainage.",
      },
    ],
  },
  {
    id: "proc-msk-trauma",
    kind: "procedure",
    title: "MSK Trauma Procedures",
    subtitle: "Fractures, hips, and compartment syndrome",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "femur",
        subregionId: "femur-neck",
        procedureId: "hip-hemiarthroplasty",
        narration:
          "Displaced femoral neck fracture in elderly → shortened, externally rotated leg. Hemiarthroplasty vs ORIF depends on age and displacement.",
      },
      {
        structureId: "femur",
        subregionId: "femur-neck",
        procedureId: "total-hip-arthroplasty",
        narration:
          "THA for end-stage osteoarthritis or AVN — posterior approach precautions prevent early dislocation.",
      },
      {
        structureId: "tibia",
        procedureId: "orif-long-bone",
        narration:
          "Open fracture = antibiotics, tetanus, urgent debridement — Gustilo classification guides management.",
      },
      {
        structureId: "tibia",
        procedureId: "fasciotomy",
        narration:
          "Compartment syndrome: pain out of proportion, pain with passive stretch — fasciotomy is emergent, not optional.",
      },
    ],
  },
  {
    id: "proc-vascular",
    kind: "procedure",
    title: "Vascular Surgery Tour",
    subtitle: "Aorta, carotid, and portal hypertension",
    examFocus: "USMLE Step 2",
    steps: [
      {
        structureId: "aorta",
        subregionId: "aorta-ascending",
        procedureId: "aortic-repair-open",
        narration:
          "Type A dissection = surgery; Type B uncomplicated = medical unless malperfusion. Tearing pain radiating to the back.",
      },
      {
        structureId: "aorta",
        procedureId: "evar",
        narration:
          "EVAR for infrarenal AAA with suitable neck anatomy — lifelong surveillance for endoleak.",
      },
      {
        structureId: "carotid-artery",
        procedureId: "carotid-endarterectomy",
        narration:
          "Symptomatic high-grade stenosis → CEA to reduce stroke risk. Perioperative stroke rate is the key outcome.",
      },
      {
        structureId: "liver",
        subregionId: "liver-portal-hilum",
        procedureId: "tips",
        narration:
          "TIPS for refractory variceal bleed or ascites — watch for hepatic encephalopathy after shunting portal flow.",
      },
    ],
  },
  {
    id: "proc-gi-endoscopy",
    kind: "procedure",
    title: "GI Endoscopy & Access",
    subtitle: "Colonoscopy, PEG, bronchoscopy",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "colon",
        subregionId: "colon-sigmoid",
        procedureId: "colonoscopy",
        narration:
          "Screening colonoscopy from age 45 — remove adenomatous polyps to prevent colorectal cancer.",
      },
      {
        structureId: "stomach",
        subregionId: "stomach-pylorus",
        procedureId: "peg-tube",
        narration:
          "PEG for enteral access >4 weeks — still assess aspiration risk and goals of care.",
      },
      {
        structureId: "trachea",
        subregionId: "trachea-carina",
        procedureId: "bronchoscopy",
        narration:
          "Carina divides main bronchi — bronchoscopy for hemoptysis, BAL, and endobronchial biopsy.",
      },
      {
        structureId: "bladder",
        subregionId: "bladder-trigone",
        procedureId: "cystoscopy",
        narration:
          "Painless gross hematuria → cystoscopy. TURBT diagnoses and treats non-muscle-invasive bladder tumors.",
      },
    ],
  },
];
