/** PANCE MSK + infectious disease — physician-educator batch 05. */
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-05";
const PE = ["physician-educator", BATCH, "pance", "pance-seed", "PANCE-2025"];

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_05 = [
  panceVignette(
    "musculoskeletal",
    `A 35-year-old runner presents with anterior knee pain worse when climbing stairs for 6 weeks. No trauma. BP 118/76 mm Hg, HR 72/min. Exam shows tenderness at the inferior patella with pain on resisted knee extension. X-ray is normal.`,
    "What is the most likely diagnosis?",
    [
      "Patellar tendinopathy",
      "Anterior cruciate ligament tear",
      "Septic arthritis",
      "Osteomyelitis",
    ],
    "Patellar tendinopathy",
    `Insidious anterior knee pain with inferior patellar tenderness and pain on resisted extension fits patellar tendinopathy. ACL tear presents with instability after pivot injury. Septic arthritis causes effusion, fever, and inability to bear weight.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "diagnosis",
      blueprintTopic: "overuse injury",
      difficulty: 3,
      tags: ["MSK", "knee", ...PE],
    }
  ),
  panceVignette(
    "musculoskeletal",
    `A 58-year-old warehouse worker presents with low back pain radiating to the left leg for 2 days after lifting a box. BP 132/84 mm Hg, HR 88/min. Straight leg raise is positive at 40° on the left. He has foot drop and decreased sensation over the lateral foot. Bladder function is normal.`,
    "What is the most appropriate next step?",
    [
      "Urgent MRI lumbar spine",
      "Bed rest for 4 weeks",
      "Oral opioid monotherapy",
      "Immediate surgical fusion",
    ],
    "Urgent MRI lumbar spine",
    `Progressive neurologic deficit (foot drop) with radicular pain warrants urgent imaging to evaluate cord/cauda equina compression. Bed rest alone risks permanent deficit. Surgery is not first-line without imaging and unless cauda equina is present.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "labs",
      blueprintTopic: "back pain",
      difficulty: 4,
      tags: ["radiculopathy", ...PE],
    }
  ),
  panceVignette(
    "musculoskeletal",
    `A 22-year-old man is brought in after a motorcycle crash with a closed tib-fib fracture. Pain is severe despite splinting. HR 118/min, BP 142/88 mm Hg. Distal pulses are present but the anterior compartment is firm and pain increases with passive toe extension.`,
    "What is the most appropriate immediate management?",
    [
      "Emergent fasciotomy",
      "Cast application and discharge",
      "Oral NSAIDs only",
      "Elevation and ice for 48 hours",
    ],
    "Emergent fasciotomy",
    `Pain out of proportion, firm compartment, and pain with passive stretch are compartment syndrome until proven otherwise — fasciotomy is emergent. Casting or discharge risks limb loss. NSAIDs and ice do not treat elevated compartment pressure.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "intervention",
      blueprintTopic: "compartment syndrome",
      difficulty: 5,
      tags: ["fracture", "compartment", ...PE],
    }
  ),
  panceVignette(
    "infectious-diseases",
    `A 30-year-old man who injects drugs presents with fever, neck stiffness, and photophobia. Temp 39.5°C, HR 118/min, BP 110/68 mm Hg. Kernig and Brudzinski signs are positive. WBC 18 × 10³/µL.`,
    "What is the most appropriate initial management?",
    [
      "Blood cultures, lumbar puncture, and empiric IV ceftriaxone plus vancomycin",
      "Oral amoxicillin and outpatient follow-up",
      "CT head only without antibiotics",
      "Acyclovir monotherapy",
    ],
    "Blood cultures, lumbar puncture, and empiric IV ceftriaxone plus vancomycin",
    `Suspected bacterial meningitis requires immediate blood cultures, LP (when safe), and empiric IV antibiotics covering S. pneumoniae and N. meningitidis — do not delay for CT unless focal neuro signs. Outpatient oral therapy is unsafe.`,
    {
      blueprintSystem: "infectious-diseases",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "meningitis",
      difficulty: 5,
      tags: ["meningitis", ...PE],
      related: { reviewModuleSlug: "infectious-disease" },
    }
  ),
  panceVignette(
    "infectious-diseases",
    `A 40-year-old man with HIV (CD4 180 cells/µL, not on ART) presents with 2 weeks of cough, night sweats, and 5-kg weight loss. Temp 38.2°C. Chest X-ray shows upper lobe cavitary infiltrate. Sputum AFB smear is positive.`,
    "What is the most appropriate initial treatment?",
    [
      "RIPE therapy (rifampin, isoniazid, pyrazinamide, ethambutol)",
      "Azithromycin monotherapy",
      "Fluconazole for 2 weeks",
      "Isoniazid monotherapy for 9 months",
    ],
    "RIPE therapy (rifampin, isoniazid, pyrazinamide, ethambutol)",
    `Active pulmonary TB with cavitary disease and positive AFB requires standard four-drug RIPE induction. Azithromycin treats atypical pneumonia, not TB. Fluconazole treats fungal infection. Isoniazid alone is latent TB treatment, not active disease.`,
    {
      blueprintSystem: "infectious-diseases",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "TB",
      difficulty: 4,
      tags: ["HIV", "TB", ...PE],
    }
  ),
  panceVignette(
    "infectious-diseases",
    `A 16-year-old healthy student has fever, sore throat, and posterior cervical lymphadenopathy for 5 days. Temp 38.5°C, HR 92/min. Exam shows tonsillar exudates and splenomegaly. Monospot is positive.`,
    "What is the most appropriate counseling regarding activity?",
    [
      "Avoid contact sports for at least 3–4 weeks due to splenic rupture risk",
      "Return to football immediately if afebrile",
      "Permanent activity restriction",
      "No restrictions needed",
    ],
    "Avoid contact sports for at least 3–4 weeks due to splenic rupture risk",
    `Infectious mononucleosis carries splenic rupture risk — contact sports should be avoided until splenomegaly resolves, typically 3–4 weeks minimum. Immediate return to collision sports is dangerous.`,
    {
      blueprintSystem: "infectious-diseases",
      taskCategory: "prevention",
      blueprintTopic: "EBV",
      difficulty: 3,
      tags: ["mono", ...PE],
    }
  ),
  panceVignette(
    "infectious-diseases",
    `A 55-year-old diabetic man has a warm, erythematous foot ulcer with purulent drainage. Temp 38.6°C, WBC 14.5 × 10³/µL, glucose 312 mg/dL. X-ray shows soft tissue gas.`,
    "What is the most appropriate management?",
    [
      "Broad-spectrum IV antibiotics and urgent surgical evaluation",
      "Topical antibiotic ointment only",
      "Oral cephalexin and wound care",
      "Observation with daily dressing changes",
    ],
    "Broad-spectrum IV antibiotics and urgent surgical evaluation",
    `Gas in soft tissues with systemic signs suggests necrotizing infection — requires IV antibiotics and surgical debridement. Topical or oral therapy alone is insufficient for limb-threatening infection.`,
    {
      blueprintSystem: "infectious-diseases",
      taskCategory: "intervention",
      blueprintTopic: "skin infections",
      difficulty: 5,
      tags: ["necrotizing", "diabetic-foot", ...PE],
      related: { reviewModuleSlug: "sepsis-shock", keyTakeaway: "Gas in soft tissue + systemic toxicity → surgical emergency." },
    }
  ),
  panceVignette(
    "musculoskeletal",
    `A 65-year-old woman presents with acute monoarticular knee pain and swelling. Temp 38.2°C. Synovial fluid shows WBC 85,000/µL with 90% neutrophils, no crystals, Gram stain negative.`,
    "What is the most appropriate management?",
    [
      "IV antibiotics pending culture and orthopedic drainage if no improvement",
      "Oral colchicine",
      "Intra-articular corticosteroid injection",
      "NSAIDs alone and follow-up in 2 weeks",
    ],
    "IV antibiotics pending culture and orthopedic drainage if no improvement",
    `Highly inflammatory synovial fluid in a febrile patient is septic arthritis until proven otherwise — empiric IV antibiotics and possible joint drainage. Colchicine treats gout (would show crystals). Steroids without ruling out infection worsen outcomes.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "septic arthritis",
      difficulty: 4,
      tags: ["septic-arthritis", ...PE],
    }
  ),
];
