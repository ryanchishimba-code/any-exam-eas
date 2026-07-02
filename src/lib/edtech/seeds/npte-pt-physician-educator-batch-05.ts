/**
 * Curated NPTE-PT musculoskeletal items — physician-educator batch 05 (2026 high-yield expansion).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-05";
const PE = ["physician-educator", BATCH, "npte-pt"];

const JOSPT = { label: "JOSPT Clinical Practice Guidelines", url: "https://www.jospt.org" };

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_05: EnrichedBankItem[] = [
  nptePtVignette(
    "musculoskeletal",
    `A 41-year-old computer programmer reports 4 weeks of neck pain radiating to the right thumb and index finger. Spurling test reproduces arm pain. Upper limb tension test (median bias) is positive at 30° elbow extension. Distal strength is 5/5, reflexes symmetric, and no myelopathic signs. Cervical rotation is limited to 50% right.`,
    "Which intervention is most appropriate for initial management?",
    [
      "High-velocity cervical thrust manipulation toward the symptomatic side without screening",
      "Cervical retraction and nerve gliding with postural education and graded mobility",
      "Complete cervical collar immobilization for 6 weeks",
      "Immediate surgical referral for all cervical radiculopathy",
    ],
    "Cervical retraction and nerve gliding with postural education and graded mobility",
    `Cervical radiculopathy without progressive neurologic deficit or myelopathy typically responds to directional preference exercises, nerve gliding, and postural modification. HVLA manipulation requires careful screening and is not first-line for all presentations. Immobilization promotes stiffness. Surgery is reserved for progressive deficit or failed conservative care.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "cervical-radiculopathy-stenosis",
      difficulty: 4,
      references: [JOSPT],
      tags: ["cervical", "radiculopathy", ...PE],
      related: { keyTakeaway: "Cervical radiculopathy without red flags: retraction, nerve glides, posture." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 16-year-old competitive runner reports anterior knee pain worse with stairs and prolonged sitting. Patellar grind test is mildly positive. Q-angle is 18° bilaterally. No effusion or instability. Hip abductor strength is 4/5 on the involved side.`,
    "Which finding best supports patellofemoral pain syndrome over meniscal pathology?",
    [
      "Positive McMurray test with joint line tenderness and locking",
      "Anterior knee pain with prolonged sitting and positive patellar grind without effusion",
      "Lachman test with increased anterior translation",
      "Positive Ober test only",
    ],
    "Anterior knee pain with prolonged sitting and positive patellar grind without effusion",
    `Patellofemoral pain presents with anterior knee pain, movie sign (pain with prolonged flexion), and patellar compressive tests without effusion or instability. McMurray suggests meniscus. Lachman suggests ACL. Ober relates to IT band.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "meniscus-patellofemoral",
      difficulty: 3,
      tags: ["patellofemoral", "knee", ...PE],
      related: { keyTakeaway: "PFPS: anterior pain, movie sign, grind test; no effusion/instability." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 29-year-old dancer reports deep groin pain with hip flexion beyond 90° and positive FADIR test. Hip flexor strength is 4+/5. X-ray shows normal joint space. No night pain or constitutional symptoms.`,
    "Which intervention is most appropriate initially?",
    [
      "Immediate total hip arthroplasty",
      "Activity modification, hip/core stabilization, and gradual ROM within irritability",
      "Aggressive hip flexion stretching into sharp groin pain 9/10",
      "Complete bed rest for 8 weeks",
    ],
    "Activity modification, hip/core stabilization, and gradual ROM within irritability",
    `Suspected hip labral pathology without acute surgical indication is managed conservatively with load modification, lumbopelvic and hip stability, and ROM within pain limits. THA is for end-stage OA. Aggressive painful stretching worsens symptoms.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "hip-labral-oa",
      difficulty: 4,
      tags: ["hip", "labral", ...PE],
      related: { keyTakeaway: "Hip labral pain: modify load, stabilize core/hip, ROM within irritability." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 35-year-old recreational tennis player has lateral ankle pain 2 weeks after inversion injury. Anterior drawer of the talocrural joint shows 4 mm increased translation. Talar tilt is negative. She can bear weight with mild pain. Peroneal strength is 4/5.`,
    "Which intervention is most appropriate?",
    [
      "Immediate cast immobilization for 6 weeks without mobilization",
      "Progressive peroneal strengthening, proprioceptive training, and graded return to sport",
      "High-velocity manipulation of the subtalar joint into inversion",
      "No weight bearing for 12 weeks",
    ],
    "Progressive peroneal strengthening, proprioceptive training, and graded return to sport",
    `Grade I–II lateral ankle sprains require early protected weight bearing, peroneal strengthening, and proprioception — not prolonged immobilization. Manipulation into inversion is inappropriate. Complete non-weight bearing for 12 weeks is excessive for this presentation.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "ankle-sprain-achilles",
      difficulty: 3,
      tags: ["ankle", "sprain", ...PE],
      related: { keyTakeaway: "Lateral ankle sprain: peroneal strength + proprioception + graded WB." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 68-year-old woman 4 days post unilateral TKA has knee flexion 65°, extension lag 8°, and quadriceps activation lag. Surgical protocol allows weight bearing as tolerated with walker. Pain 5/10 with ROM.`,
    "Which goal is the highest priority in the first postoperative week?",
    [
      "Deep squatting beyond 120° flexion immediately",
      "Full knee extension and quadriceps activation with swelling control",
      "Running program initiation",
      "Aggressive passive flexion into severe pain without extension focus",
    ],
    "Full knee extension and quadriceps activation with swelling control",
    `Early TKA rehab prioritizes extension restoration, quadriceps activation, and effusion control — extension lag predicts poor outcomes. Deep flexion and running are later-phase goals. Painful flexion-only focus neglects critical extension.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "knee-oa-tka",
      difficulty: 4,
      tags: ["TKA", "post-op", ...PE],
      related: { keyTakeaway: "Early TKA: extension + quad activation + swelling control first." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 14-year-old adolescent has right thoracic scoliosis with 22° Cobb angle on recent radiograph. Risser sign is 1. No neurologic deficits. Postural asymmetry with right rib prominence in forward bend.`,
    "Which intervention is most appropriate?",
    [
      "Immediate spinal fusion surgery",
      "Scoliosis-specific exercise and monitoring per orthopedic protocol; bracing if progression criteria met",
      "Heavy axial loading squats without medical clearance",
      "No activity and complete spinal immobilization",
    ],
    "Scoliosis-specific exercise and monitoring per orthopedic protocol; bracing if progression criteria met",
    `Adolescent idiopathic scoliosis in the mild-moderate range is managed with observation, scoliosis-specific exercises, and bracing when progression criteria are met — not immediate surgery. Activity modification follows orthopedic guidance.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "scoliosis-posture",
      difficulty: 4,
      tags: ["scoliosis", "pediatric", ...PE],
      related: { keyTakeaway: "AIS ~22°: monitor, scoliosis-specific exercise, brace if progressing." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 62-year-old woman with bilateral hand pain reports morning stiffness lasting 45 minutes, symmetric MCP swelling, and positive squeeze test of MCPs. X-rays show periarticular osteopenia without osteophytes. ESR is elevated.`,
    "Which PT intervention emphasis is most appropriate compared with primary osteoarthritis?",
    [
      "High-impact plyometrics to restore bone density only",
      "Joint protection, ROM within inflammation control, and energy conservation during flares",
      "Aggressive end-range stretching into inflamed joints during acute flare",
      "No hand use for 6 months",
    ],
    "Joint protection, ROM within inflammation control, and energy conservation during flares",
    `RA presentation (prolonged AM stiffness, symmetric MCP involvement, elevated ESR) requires inflammation-aware PT: joint protection, gentle ROM, and flare management — unlike OA where loading may be more aggressive. Plyometrics during flare are inappropriate.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "oa-vs-ra-arthritis",
      difficulty: 4,
      tags: ["RA", "arthritis", ...PE],
      related: { keyTakeaway: "RA vs OA: protect joints, control inflammation, gentle ROM in flares." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 70-year-old man 2 days post posterior-approach THA is ambulating with walker. Surgeon protocol prohibits hip flexion beyond 90°, adduction past midline, and internal rotation.`,
    "Which activity is contraindicated per standard posterior precautions?",
    [
      "Sleeping with a pillow between knees in semi-side-lying within flexion limit",
      "Sitting in a low soft couch requiring hip flexion beyond 90°",
      "Heel slides in supine within 80° flexion",
      "Ambulation with walker and toe-touch weight bearing as ordered",
    ],
    "Sitting in a low soft couch requiring hip flexion beyond 90°",
    `Posterior THA precautions restrict hip flexion >90°, adduction, and internal rotation to reduce dislocation risk. Low soft seating violates flexion limits. Pillow between knees, heel slides within limits, and walker ambulation are appropriate when within protocol.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "hip-fracture-tha",
      difficulty: 4,
      tags: ["THA", "precautions", ...PE],
      related: { keyTakeaway: "Posterior THA: avoid flexion >90°, adduction, IR — low seats violate precautions." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A PT student performs special testing on a patient with shoulder pain. Jobe (empty can) test reproduces pain without weakness. Hawkins-Kennedy is positive. External rotation strength is 5/5. Painful arc is present 60–120°.`,
    "Which interpretation is most accurate?",
    [
      "Findings strongly indicate full-thickness rotator cuff tear requiring surgery",
      "Findings suggest subacromial irritation/impingement; correlate with strength and imaging",
      "Negative impingement cluster — no further assessment needed",
      "Isolated adhesive capsulitis is the only diagnosis",
    ],
    "Findings suggest subacromial irritation/impingement; correlate with strength and imaging",
    `Painful arc, Hawkins-Kennedy, and painful empty can with preserved strength suggest impingement/subacromial irritation rather than full tear (which often shows weakness, drop arm). Capsulitis presents with global ROM loss. Cluster tests require clinical correlation.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "examination",
      blueprintTopic: "special-tests-shoulder-knee-spine",
      difficulty: 3,
      tags: ["special-tests", "shoulder", ...PE],
      related: { keyTakeaway: "Shoulder cluster: painful arc + Hawkins suggests impingement; check strength." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 55-year-old man post rotator cuff repair (medium tear) at 8 weeks has passive forward flexion 130° and pain 4/10 with active elevation. Surgeon cleared passive ROM and submaximal isometrics.`,
    "Which progression is most appropriate?",
    [
      "Immediate return to overhead throwing without restriction",
      "Gradual active-assisted to active ROM and progressive scapular and cuff loading per protocol",
      "No movement until 6 months post-op",
      "High-velocity end-range mobilization into pain 9/10",
    ],
    "Gradual active-assisted to active ROM and progressive scapular and cuff loading per protocol",
    `Post rotator cuff repair rehab follows phased tendon healing with gradual active motion and progressive loading per surgeon protocol — not immediate overhead sport or prolonged immobilization. Aggressive painful mobilization risks repair integrity.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "fracture-post-surgical-rehab",
      difficulty: 4,
      tags: ["rotator-cuff", "post-op", ...PE],
      related: { keyTakeaway: "Post RC repair: phased active ROM + progressive loading per protocol." },
    }
  ),
];
