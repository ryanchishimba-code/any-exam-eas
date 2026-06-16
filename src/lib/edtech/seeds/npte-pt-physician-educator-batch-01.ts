/**
 * Curated NPTE-PT musculoskeletal items — physician-educator batch 01.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-01";
const PE = ["physician-educator", BATCH, "npte-pt"];

const APTA_ORTHO = { label: "APTA Orthopaedic Section Clinical Guidelines", url: "https://www.orthopt.org" };
const JOSPT = { label: "JOSPT Clinical Practice Guidelines", url: "https://www.jospt.org" };

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01: EnrichedBankItem[] = [
  nptePtVignette(
    "musculoskeletal",
    `A 54-year-old warehouse worker reports 6 weeks of right shoulder pain worse when reaching overhead and at night. Active abduction is limited to 110° with a painful arc between 60° and 120°. Empty can test and Hawkins-Kennedy test are positive. Strength is 4/5 in external rotation. MRI shows partial-thickness supraspinatus tearing without full-thickness rupture.`,
    "Which intervention is most appropriate for initial management?",
    [
      "Immediate surgical rotator cuff repair",
      "Progressive scapular stabilization and rotator cuff strengthening",
      "Complete immobilization in a sling for 6 weeks",
      "High-velocity grade V glenohumeral mobilization",
    ],
    "Progressive scapular stabilization and rotator cuff strengthening",
    `Nontraumatic partial-thickness rotator cuff tears without acute traumatic full-thickness rupture typically respond to conservative PT emphasizing scapular control, posterior capsule mobility, and progressive cuff loading. Surgery is reserved for failed conservative care or full-thickness tears in active patients. Prolonged immobilization promotes stiffness. Aggressive high-grade mobilization is inappropriate in acute painful impingement.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "rotator cuff",
      difficulty: 4,
      references: [APTA_ORTHO],
      tags: ["rotator-cuff", "shoulder", ...PE],
      related: { keyTakeaway: "Partial RC tear without acute full-thickness rupture → conservative PT first." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 22-year-old collegiate soccer player sustained a noncontact knee injury 10 days ago. She reports a pop at injury with immediate swelling. Lachman test shows 5 mm increased anterior translation with soft end-feel. Anterior drawer is 8 mm compared with the contralateral side. Pivot shift is positive. MRI confirms midsubstance ACL tear.`,
    "Which finding best supports the need for prehabilitation before surgical reconstruction?",
    [
      "Quadriceps strength index of 92% and full extension lag of 0°",
      "Effusion of 2+ with quadriceps strength index of 58% and 8° extension lag",
      "Negative Lachman test at 2 weeks post-injury",
      "Isolated medial joint line tenderness without effusion",
    ],
    "Effusion of 2+ with quadriceps strength index of 58% and 8° extension lag",
    `ACL prehabilitation targets effusion control, full extension restoration, and quadriceps activation (often ≥80–90% limb symmetry) before reconstruction. Persistent effusion, extension lag, and quadriceps weakness predict poorer postoperative outcomes. A negative Lachman would contradict the diagnosis. Isolated meniscal tenderness does not define prehab readiness.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "ACL rehabilitation",
      difficulty: 4,
      references: [JOSPT],
      tags: ["ACL", "knee", "prehab", ...PE],
      related: { keyTakeaway: "ACL prehab: control effusion, restore extension, activate quadriceps." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 47-year-old office worker presents with 3 months of low back pain radiating to the left lateral thigh to the knee. Straight leg raise is positive at 40° on the left. Lumbar flexion is 50% of normal with central low back pain. Distal strength is 5/5, reflexes symmetric, and sensation intact. MRI shows a 6 mm L4–L5 paracentral disc protrusion contacting the traversing L5 nerve root without cauda equina compression.`,
    "Which examination finding is most important to monitor before progressing aggressive lumbar flexion exercises?",
    [
      "Hamstring flexibility limited to 70°",
      "Progressive left foot drop with strength declining to 3/5 in EHL",
      "Pain with single-leg stance lasting 30 seconds",
      "Positive Patrick (FABER) test reproducing groin pain",
    ],
    "Progressive left foot drop with strength declining to 3/5 in EHL",
    `Radiculopathy from disc herniation requires monitoring for progressive neurologic deficit (motor weakness, especially foot drop), saddle anesthesia, or bowel/bladder dysfunction — red flags warranting urgent referral. Hamstring tightness and groin pain with FABER suggest alternate pathology. Transient pain with stance is less concerning than progressive motor loss.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "examination",
      blueprintTopic: "lumbar radiculopathy",
      difficulty: 4,
      tags: ["low-back-pain", "radiculopathy", ...PE],
      related: { keyTakeaway: "Monitor progressive motor deficit in lumbar radiculopathy — urgent referral if worsening." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 68-year-old woman 6 weeks status post right total knee arthroplasty has active knee flexion of 95° and extension lag of 5°. Incision is well healed. Patellar mobility is adequate. She ambulates with a rolling walker, 150 m before rest due to anterior knee pain rated 6/10. Knee flexion contracture was 10° preoperatively.`,
    "Which intervention should be prioritized to improve functional ambulation distance?",
    [
      "Aggressive sustained knee flexion stretching into 130° immediately",
      "Quadriceps setting, terminal extension emphasis, and gait training with appropriate assistive device weaning",
      "Continuous passive motion 8 hours daily regardless of pain",
      "Avoid all weight bearing for 2 additional weeks",
    ],
    "Quadriceps setting, terminal extension emphasis, and gait training with appropriate assistive device weaning",
    `Early TKA rehab prioritizes extension (minimize lag), quadriceps activation, patellar mobility, and progressive ambulation. Flexion gains are important but aggressive forced flexion with high pain can increase effusion. CPM alone without active control underperforms structured exercise. TKA patients are weight-bearing as tolerated per surgeon protocol at 6 weeks.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "total knee arthroplasty",
      difficulty: 3,
      tags: ["TKA", "post-op", ...PE],
      related: { keyTakeaway: "TKA early rehab: extension, quadriceps activation, progressive WB gait." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 35-year-old runner reports anterior knee pain for 8 weeks worse with stairs and prolonged sitting. Q-angle is 18° bilaterally. Patellar grind test is positive. Single-leg squat shows dynamic knee valgus and femoral internal rotation. IT band flexibility is reduced with Ober test positive at 5°.`,
    "Which diagnosis is most likely?",
    [
      "Patellofemoral pain syndrome",
      "Patellar tendon rupture",
      "Posterior cruciate ligament tear",
      "Medial meniscus bucket-handle tear",
    ],
    "Patellofemoral pain syndrome",
    `Anterior knee pain aggravated by loading (stairs, prolonged flexion), positive patellar grind, and dynamic malalignment (valgus, femoral IR) are classic for patellofemoral pain syndrome. Tendon rupture presents with acute inability to extend. PCL injuries typically follow direct posterior force. Bucket-handle tears often cause locking and joint line pain with specific meniscal tests.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "patellofemoral pain",
      difficulty: 3,
      tags: ["patellofemoral", "knee", ...PE],
      related: { keyTakeaway: "PFPS: anterior knee pain + malalignment + positive patellar grind." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 28-year-old man rolled his right ankle playing basketball 48 hours ago. Swelling is moderate over the lateral malleolus. He can bear weight with mild pain. Anterior drawer of the talus shows 3 mm increased translation. Talar tilt test is negative. Ottawa ankle rules imaging was negative for fracture.`,
    "Which intervention is most appropriate at this stage?",
    [
      "Immediate return to sport with ankle taping only",
      "Protection, elevation, compression, early ROM within tolerance, and progressive proprioceptive training",
      "Cast immobilization for 4 weeks",
      "High-grade talocrural distraction manipulation under anesthesia",
    ],
    "Protection, elevation, compression, early ROM within tolerance, and progressive proprioceptive training",
    `Grade I–II lateral ankle sprains without fracture benefit from early protected mobilization, swelling control, and progressive proprioception and strength — not prolonged immobilization. Immediate return to sport risks reinjury. Manipulation under anesthesia is not indicated for uncomplicated sprains.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "ankle sprain",
      difficulty: 3,
      tags: ["ankle-sprain", "proprioception", ...PE],
      related: { keyTakeaway: "Lateral ankle sprain: early protected ROM + progressive proprioception." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 61-year-old woman with adhesive capsulitis of the left shoulder has passive forward flexion of 95°, abduction 85°, and external rotation 20° with end-range capsular pain. Symptoms began 4 months ago and are in the "frozen" phase. Diabetes is well controlled (HbA1c 6.8%).`,
    "Which intervention is most appropriate during the frozen phase?",
    [
      "Aggressive grade IV posterior glides into high pain levels daily",
      "Gentle capsular stretching, pain-modulated mobilization, and home exercise within irritability limits",
      "Immediate manipulation under anesthesia without trial of conservative care",
      "Complete cessation of all shoulder movement for 6 weeks",
    ],
    "Gentle capsular stretching, pain-modulated mobilization, and home exercise within irritability limits",
    `Adhesive capsulitis in the frozen phase requires pain-modulated mobilization and stretching — aggressive high-pain techniques can worsen inflammation. MUA is considered after failed conservative care. Complete immobilization promotes further stiffness. Diabetes is a risk factor but does not change the phased approach.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "adhesive capsulitis",
      difficulty: 4,
      tags: ["frozen-shoulder", "shoulder", ...PE],
      related: { keyTakeaway: "Frozen phase capsulitis: pain-modulated mobilization, not aggressive forcing." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 72-year-old man 4 days status post right total hip arthroplasty (posterior approach) ambulates with a front-wheeled walker, 200 m with supervision. Hip flexion is 85°, abduction 25°. He reports no hip dislocation. Surgeon protocol includes posterior hip precautions for 6 weeks.`,
    "Which activity should be avoided per standard posterior-approach precautions?",
    [
      "Heel slides in supine with hip in neutral rotation",
      "Hip flexion beyond 90° combined with internal rotation",
      "Isometric gluteal sets in side-lying with abduction pillow",
      "Weight-bearing as tolerated gait training on level surfaces",
    ],
    "Hip flexion beyond 90° combined with internal rotation",
    `Posterior-approach THA precautions typically restrict hip flexion past 90°, adduction past midline, and internal rotation — combinations that increase dislocation risk. Heel slides in neutral, isometric gluteal sets with abduction pillow, and WB gait on level surfaces are commonly permitted per protocol.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "total hip arthroplasty",
      difficulty: 3,
      tags: ["THA", "hip-precautions", ...PE],
      related: { keyTakeaway: "Posterior THA: avoid >90° flexion + adduction + IR." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 44-year-old computer programmer reports neck pain and paresthesia in the right index and middle fingers for 5 weeks. Spurling test reproduces radicular symptoms to the right C7 dermatome. Distal grip strength is 4+/5 on the right. Cervical rotation is 60° bilaterally with pain at end range. Cervical spine X-ray shows mild degenerative changes without instability.`,
    "Which finding would most strongly indicate need for immediate physician referral?",
    [
      "Painful cervical rotation limited to 60°",
      "Positive Spurling test reproducing arm symptoms",
      "Unilateral Hoffmann sign with new lower extremity hyperreflexia and gait ataxia",
      "4+/5 grip strength with otherwise intact sensation",
    ],
    "Unilateral Hoffmann sign with new lower extremity hyperreflexia and gait ataxia",
    `Upper motor neuron signs (Hoffmann, hyperreflexia, gait ataxia) suggest cervical myelopathy — a neurosurgical emergency requiring urgent referral. Spurling and mild strength loss can occur in radiculopathy managed conservatively with monitoring. Limited rotation alone is nonspecific.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "cervical radiculopathy",
      difficulty: 5,
      tags: ["cervical", "myelopathy", "red-flags", ...PE],
      related: { keyTakeaway: "Cervical myelopathy signs (UMN findings) → urgent referral." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 76-year-old woman with lumbar spinal stenosis reports bilateral leg heaviness and numbness after walking 100 m, relieved by sitting and leaning forward (shopping cart sign). Neuro exam is normal at rest. Flexion-based walking tolerance improves to 400 m when she uses a rolling walker and maintains slight forward flexion.`,
    "Which intervention is most appropriate to improve community ambulation?",
    [
      "Aggressive lumbar extension exercises in standing",
      "Flexion-biased conditioning, hip strengthening, and assistive device training with pacing strategies",
      "High-impact running program to build cardiovascular endurance",
      "Bed rest with avoidance of all walking for 4 weeks",
    ],
    "Flexion-biased conditioning, hip strengthening, and assistive device training with pacing strategies",
    `Neurogenic claudication from lumbar stenosis often improves with flexion (opens canal) — flexion-biased exercise, pacing, and assistive devices that promote slight forward lean are appropriate. Extension-biased loading can worsen symptoms. High-impact activity and bed rest are not indicated.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "lumbar spinal stenosis",
      difficulty: 4,
      tags: ["spinal-stenosis", "neurogenic-claudication", ...PE],
      related: { keyTakeaway: "Lumbar stenosis: flexion-biased activity and pacing improve tolerance." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 41-year-old manual laborer reports lateral elbow pain for 6 weeks with gripping and lifting. Resisted wrist extension with the elbow extended reproduces pain over the lateral epicondyle. Grip strength is 22 kg on the affected side versus 38 kg on the unaffected side. No neck symptoms or neural tension signs.`,
    "Which intervention has the strongest evidence for initial management?",
    [
      "Corticosteroid injection without exercise",
      "Progressive eccentric wrist extensor loading and activity modification",
      "Complete elbow immobilization for 3 weeks",
      "Cervical traction three times weekly",
    ],
    "Progressive eccentric wrist extensor loading and activity modification",
    `Lateral epicondylalgia responds best to load management including eccentric tyler twist or progressive wrist extensor strengthening plus activity modification. Steroid injections may provide short-term relief but inferior long-term outcomes versus exercise. Immobilization deconditions the tendon. No cervical involvement is described.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "lateral epicondylalgia",
      difficulty: 3,
      references: [JOSPT],
      tags: ["elbow", "tendinopathy", ...PE],
      related: { keyTakeaway: "Lateral epicondylalgia: eccentric loading + activity modification." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 52-year-old woman reports 4 months of achilles tendon pain 2 cm proximal to the insertion with morning stiffness. Single-leg heel raise test reproduces pain; she completes 8 repetitions versus 18 on the unaffected side. Ultrasound shows midportion tendinopathy with increased AP diameter of 8 mm (normal ~6 mm).`,
    "Which loading strategy is most appropriate?",
    [
      "Complete rest with non-weight-bearing for 8 weeks",
      "Progressive achilles tendon loading program (isometric → isotonic → energy storage)",
      "Immediate surgical debridement",
      "Stretching-only program without strengthening",
    ],
    "Progressive achilles tendon loading program (isometric → isotonic → energy storage)",
    `Midportion achilles tendinopathy is managed with progressive tendon loading — Alfredson eccentric protocol or updated isometric-to-plyometric progressions. Complete rest reduces load capacity. Surgery is for failed conservative care or rupture. Stretching alone does not restore load tolerance.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "achilles tendinopathy",
      difficulty: 4,
      tags: ["achilles", "tendinopathy", ...PE],
      related: { keyTakeaway: "Achilles tendinopathy: progressive loading, not rest or stretch-only." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 38-year-old pianist reports 10 weeks of numbness and tingling in the right median nerve distribution, worse at night. Phalen test is positive at 30 seconds. Tinel sign is positive at the wrist. Thenar eminence strength is 4/5. Two-point discrimination is 8 mm in the index finger (normal ≤5 mm).`,
    "Which finding best supports a diagnosis of carpal tunnel syndrome?",
    [
      "Positive Spurling test with neck pain",
      "Positive Phalen and Tinel at the wrist with thenar weakness and sensory changes in median distribution",
      "Pain with resisted wrist ulnar deviation only",
      "Swelling over the dorsal wrist with positive Finkelstein test",
    ],
    "Positive Phalen and Tinel at the wrist with thenar weakness and sensory changes in median distribution",
    `CTS presents with median nerve distribution symptoms, positive Phalen/Tinel at the wrist, thenar weakness, and impaired two-point discrimination. Spurling suggests cervical radiculopathy. Finkelstein indicates de Quervain tenosynovitis. Isolated ulnar deviation pain is nonspecific.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "carpal tunnel syndrome",
      difficulty: 3,
      tags: ["CTS", "wrist", ...PE],
      related: { keyTakeaway: "CTS: median distribution + Phalen/Tinel at wrist + thenar involvement." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 19-year-old football player reports locking and medial knee pain rated 6/10 after a twisting injury. McMurray test reproduces click with pain at the medial joint line. Joint effusion is 2+. Lachman and pivot shift are negative. MRI shows a vertical tear of the posterior horn of the medial meniscus.`,
    "Which intervention is most appropriate if he wishes to return to sport this season and the surgeon recommends conservative trial first?",
    [
      "Immediate meniscectomy without rehabilitation",
      "Quadriceps activation, swelling control, and sport-specific progression when ROM and strength criteria are met",
      "Complete knee immobilization for 6 weeks",
      "Aggressive open-chain knee extension to 0° against maximal resistance daily",
    ],
    "Quadriceps activation, swelling control, and sport-specific progression when ROM and strength criteria are met",
    `Meniscal tears without mechanical locking that fail to resolve may need surgery, but conservative trial includes effusion management, quadriceps activation, ROM restoration, and criteria-based return to sport. Immobilization delays recovery. Heavy open-chain extensions early post-injury may increase patellofemoral stress.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "meniscal injury",
      difficulty: 4,
      tags: ["meniscus", "knee", ...PE],
      related: { keyTakeaway: "Meniscal tear conservative trial: control effusion, restore quadriceps, criteria-based RTS." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 29-year-old dancer reports anterior hip pain and occasional catching with deep flexion and rotation. FABER test reproduces deep groin pain. FADIR test is positive. Hip flexion is 115° with pain at end range. X-ray shows normal joint space; MRI arthrogram suggests labral tear at 2 o'clock.`,
    "Which intervention is most appropriate for initial conservative management?",
    [
      "Immediate hip arthroscopy without trial of PT",
      "Hip core stabilization, activity modification avoiding impingement positions, and progressive hip strengthening",
      "Prolonged bed rest for 8 weeks",
      "High-velocity lumbar manipulation only",
    ],
    "Hip core stabilization, activity modification avoiding impingement positions, and progressive hip strengthening",
    `Femoroacetabular impingement and labral pathology often trial conservative care with hip strengthening, motor control, and activity modification before surgery. Immediate arthroscopy skips conservative trial unless mechanical symptoms fail to improve. Bed rest and isolated lumbar manipulation do not address hip pathology.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "hip labral pathology",
      difficulty: 4,
      tags: ["hip", "FAI", "labrum", ...PE],
      related: { keyTakeaway: "Hip labral/FAI: conservative hip strengthening and activity modification first." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 16-year-old female competitive gymnast has right wrist pain with weight-bearing. She reports 4 months of gradual onset. Tenderness is over the radial aspect of the distal radius growth plate. X-ray shows widening of the physis without fracture line. Rest from impact for 4 weeks reduced pain from 7/10 to 3/10.`,
    "Which recommendation is most appropriate for return to sport progression?",
    [
      "Immediate return to full tumbling without restrictions",
      "Gradual loading progression with wrist strengthening, technique modification, and pain monitoring below 3/10 during activity",
      "Permanent retirement from gymnastics",
      "Cast immobilization for 6 months regardless of symptoms",
    ],
    "Gradual loading progression with wrist strengthening, technique modification, and pain monitoring below 3/10 during activity",
    `Physeal stress injuries in adolescent athletes require graduated return with load management, strengthening, and symptom monitoring — not immediate full return or prolonged unnecessary immobilization. Permanent retirement is excessive if symptoms resolve with load management.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "physeal injury",
      difficulty: 4,
      tags: ["pediatric", "wrist", "physeal", ...PE],
      related: { keyTakeaway: "Adolescent physeal stress: graduated loading with symptom monitoring." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 63-year-old woman with osteoporosis (T-score −2.8 at lumbar spine) wants to start exercise after a vertebral compression fracture 8 weeks ago that was managed conservatively. Pain at rest is 1/10. She has no neurologic deficits. Physician cleared her for PT with no acute fracture on recent imaging.`,
    "Which exercise approach is most appropriate?",
    [
      "High-load spinal extension exercises with maximal compression",
      "Weight-bearing and resistance training targeting hip and spine extensors with proper form, avoiding end-range flexion under load",
      "Complete avoidance of all resistance exercise permanently",
      "Only pool exercise with no land-based loading ever",
    ],
    "Weight-bearing and resistance training targeting hip and spine extensors with proper form, avoiding end-range flexion under load",
    `Osteoporosis rehabilitation includes weight-bearing and progressive resistance exercise to improve BMD and reduce fall risk, with precautions for flexion under load post-VCF. High compression flexion is contraindicated. Complete avoidance of resistance training misses proven benefits. Pool exercise can supplement but land-based loading is important.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "osteoporosis exercise",
      difficulty: 4,
      tags: ["osteoporosis", "VCF", ...PE],
      related: { keyTakeaway: "Osteoporosis: progressive WB/resistance exercise; avoid loaded flexion post-VCF." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 25-year-old man 8 weeks status post ORIF of a displaced midshaft humerus fracture is cleared for PT. Active shoulder flexion is 110°, elbow flexion full. Wrist and hand strength 5/5. X-ray shows bridging callus. Surgeon allows progressive ROM and strengthening without resistance at the fracture site until 12 weeks.`,
    "Which intervention is most appropriate at this stage?",
    [
      "Maximal biceps curling with 20 lb dumbbells through full ROM",
      "Pendulum exercises, AAROM/PROM for shoulder/elbow, and scapular stabilization without torsion at the healing fracture",
      "Overhead press with barbell at maximal load",
      "No movement of the upper extremity until 6 months",
    ],
    "Pendulum exercises, AAROM/PROM for shoulder/elbow, and scapular stabilization without torsion at the healing fracture",
    `Midshaft humerus fracture rehab at 8 weeks with callus formation emphasizes gentle ROM, pendulums, and proximal stabilization while avoiding torsion and heavy loading at the fracture site until cleared. Heavy curls and overhead press create unacceptable torsion. Complete immobilization causes adhesive capsulitis.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "humerus fracture rehabilitation",
      difficulty: 3,
      tags: ["fracture", "upper-extremity", ...PE],
      related: { keyTakeaway: "Healing humerus shaft: gentle ROM and scapular control; avoid torsion/heavy load." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 57-year-old construction worker 12 weeks status post L4–L5 posterolateral fusion reports low back stiffness but leg symptoms resolved. Fusion is solid on imaging. Flexion is limited to 40% of pre-injury with fear-avoidance on bending. Oswestry score is 38%.`,
    "Which intervention is most appropriate?",
    [
      "Aggressive repeated lumbar flexion beyond fusion limits daily",
      "Graded activity exposure, hip and core stabilization within surgeon restrictions, and cardiovascular conditioning",
      "Permanent use of rigid lumbar brace for all activities",
      "Bed rest until Oswestry score reaches 0%",
    ],
    "Graded activity exposure, hip and core stabilization within surgeon restrictions, and cardiovascular conditioning",
    `Post-fusion rehab focuses on hip/core stabilization, graded activity to address fear-avoidance, and conditioning within surgeon ROM restrictions — not forced flexion beyond limits or indefinite bracing. Bed rest worsens deconditioning. Residual disability is common early; gradual improvement expected.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "spinal fusion rehabilitation",
      difficulty: 4,
      tags: ["spinal-fusion", "low-back", ...PE],
      related: { keyTakeaway: "Post-fusion: core/hip stability, graded activity, conditioning within MD restrictions." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 48-year-old woman with rheumatoid arthritis and bilateral wrist synovitis has grip strength of 12 kg (norm 28 kg) and ulnar drift at the MCP joints. Pain is 5/10 at rest, 7/10 with gripping. Disease activity is moderate on physician assessment. Splinting at night reduced morning stiffness from 90 to 45 minutes.`,
    "Which PT intervention is most appropriate alongside medical management?",
    [
      "High-resistance powerlifting for grip only",
      "Joint protection education, adaptive equipment, ROM within pain limits, and isometric strengthening",
      "Complete immobilization of both wrists indefinitely",
      "Aggressive passive stretching into high pain at inflamed joints daily",
    ],
    "Joint protection education, adaptive equipment, ROM within pain limits, and isometric strengthening",
    `Inflammatory arthritis PT emphasizes joint protection, energy conservation, splinting, gentle ROM, and isometric strengthening during flares — not aggressive stretching into pain or heavy loading. Immobilization increases disability. Medical disease-modifying therapy is primary; PT supports function.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "inflammatory arthritis",
      difficulty: 4,
      tags: ["RA", "hand", ...PE],
      related: { keyTakeaway: "Inflammatory arthritis: joint protection, gentle ROM, isometrics — avoid aggressive stretch." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 33-year-old CrossFit athlete reports sharp posterior shoulder pain during overhead lifts. O'Brien test is positive (pain relief with external rotation during resisted flexion). Jobe relocation test reduces apprehension. Active IR strength is 4/5. MRI shows SLAP type II lesion.`,
    "Which intervention should be prioritized before return to overhead lifting?",
    [
      "Immediate return to snatches at prior weight",
      "Scapular dyskinesis correction, rotator cuff and biceps loading progression, and thrower's ten program",
      "Only bench press with maximal load",
      "Complete shoulder immobilization for 12 weeks",
    ],
    "Scapular dyskinesis correction, rotator cuff and biceps loading progression, and thrower's ten program",
    `SLAP lesions in overhead athletes require scapular control, rotator cuff and biceps tendons strengthening (thrower's ten), and graded return to overhead activity. Immediate heavy overhead loading risks re-injury. Bench press alone neglects scapular and cuff needs. Prolonged immobilization is detrimental.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "SLAP lesion",
      difficulty: 4,
      tags: ["shoulder", "SLAP", "overhead-athlete", ...PE],
      related: { keyTakeaway: "SLAP/overhead athlete: scapular control + cuff/biceps program before return." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 70-year-old man fell onto an outstretched hand and has wrist pain. Anatomic snuffbox tenderness is present. Initial X-ray is negative. Pain persists at 10 days with snuffbox tenderness and reduced grip (8 kg vs 22 kg contralateral).`,
    "What is the most appropriate next step?",
    [
      "Discharge with no follow-up because X-ray was negative",
      "Recommend repeat imaging (MRI or CT) to evaluate for occult scaphoid fracture",
      "Begin aggressive wrist manipulation",
      "Apply heat packs only for 6 weeks without further assessment",
    ],
    "Recommend repeat imaging (MRI or CT) to evaluate for occult scaphoid fracture",
    `Scaphoid fractures may be occult on initial X-ray; persistent snuffbox tenderness warrants advanced imaging to prevent nonunion and AVN. Discharge without follow-up misses occult fracture. Manipulation is contraindicated. Heat alone does not address potential fracture.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "scaphoid fracture",
      difficulty: 4,
      tags: ["wrist", "fracture", "FOOSH", ...PE],
      related: { keyTakeaway: "Snuffbox tenderness + negative X-ray → image for occult scaphoid fracture." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 45-year-old obese man (BMI 34) with knee osteoarthritis reports pain 6/10 with walking 300 m. Knee flexion 125°, mild varus alignment. Kellgren-Lawrence grade 3 changes on X-ray. No effusion. Quadriceps strength index is 65%.`,
    "Which intervention is most likely to improve walking tolerance?",
    [
      "Arthroscopic lavage alone without exercise",
      "Quadriceps strengthening, weight management counseling, and low-impact aerobic conditioning",
      "High-impact plyometric training",
      "Complete non-weight-bearing for 8 weeks",
    ],
    "Quadriceps strengthening, weight management counseling, and low-impact aerobic conditioning",
    `Knee OA management includes quadriceps strengthening (strongest modifiable factor), weight loss, and low-impact aerobic exercise. Arthroscopic lavage lacks efficacy for OA. Plyometrics increase joint loading. Non-WB causes deconditioning.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "knee osteoarthritis",
      difficulty: 3,
      references: [APTA_ORTHO],
      tags: ["OA", "knee", ...PE],
      related: { keyTakeaway: "Knee OA: quadriceps strengthening + weight management + low-impact aerobic." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 12-year-old boy reports knee pain rated 5/10 after a growth spurt. No trauma. Tenderness at the tibial tubercle with pain on resisted knee extension. Radiographs show open apophyses with soft tissue swelling over the tubercle but no fracture.`,
    "Which diagnosis is most likely?",
    [
      "Osgood-Schlatter disease",
      "ACL rupture",
      "Patellar dislocation",
      "Osteosarcoma",
    ],
    "Osgood-Schlatter disease",
    `Adolescent with open apophyses, tibial tubercle tenderness, and pain with resisted extension suggests Osgood-Schlatter (tibial tubercle apophysitis). ACL rupture follows trauma with hemarthrosis. Patellar dislocation is acute with patellar maltracking. Osteosarcoma presents with rest pain, systemic signs, and destructive bone lesions.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "Osgood-Schlatter disease",
      difficulty: 3,
      tags: ["pediatric", "knee", "apophysitis", ...PE],
      related: { keyTakeaway: "Osgood-Schlatter: adolescent + tubercle tenderness + resisted extension pain." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 55-year-old woman 2 weeks status post open reduction internal fixation of a bimalleolar ankle fracture is non-weight-bearing per surgeon. Active ankle ROM is limited: dorsiflexion 0°, plantarflexion 15°. Incision healed. Toes warm with capillary refill <2 seconds.`,
    "Which intervention is most appropriate while non-weight-bearing?",
    [
      "Immediate full weight-bearing gait training",
      "Active and passive ROM within surgical precautions, edema control, and proximal hip/knee strengthening",
      "No movement of the ankle until 12 weeks",
      "High-velocity talocrural manipulation",
    ],
    "Active and passive ROM within surgical precautions, edema control, and proximal hip/knee strengthening",
    `Post-ORIF ankle fracture rehab during NWB includes ROM within precautions, swelling management, and proximal strengthening to prevent deconditioning. Early WB violates surgical protocol. Complete immobilization causes stiffness. Manipulation is contraindicated early post-ORIF.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "ankle fracture rehabilitation",
      difficulty: 3,
      tags: ["ankle-fracture", "post-op", ...PE],
      related: { keyTakeaway: "NWB ankle ORIF: ROM within precautions + edema control + proximal strengthening." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 40-year-old secretary reports thumb pain at the radial wrist for 5 weeks. Finkelstein test is positive. Grip strength 15 kg affected vs 28 kg unaffected. No numbness in the hand. Pain 6/10 with ulnar deviation against resistance.`,
    "Which intervention is most appropriate?",
    [
      "Cervical traction",
      "Thumb spica splinting, activity modification, and progressive tendon loading when irritability decreases",
      "Immediate carpal tunnel release",
      "Aggressive passive thumb abduction stretching into high pain",
    ],
    "Thumb spica splinting, activity modification, and progressive tendon loading when irritability decreases",
    `De Quervain tenosynovitis is managed with splinting, activity modification, and progressive loading — not cervical traction (no cervical signs) or carpal tunnel surgery (different nerve distribution). Aggressive stretching worsens tenosynovitis.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "de Quervain tenosynovitis",
      difficulty: 3,
      tags: ["wrist", "thumb", ...PE],
      related: { keyTakeaway: "De Quervain: spica splint + activity mod + progressive loading." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 65-year-old man with a Colles fracture treated with closed reduction and cast 3 weeks ago has finger swelling and pain. Capillary refill is 3 seconds in the index finger. Pain with passive extension of the fingers is 8/10. Compartment pressures were not measured.`,
    "What is the most appropriate action?",
    [
      "Continue cast and schedule follow-up in 4 weeks",
      "Urgent physician referral to evaluate for acute compartment syndrome or cast-related vascular compromise",
      "Begin aggressive hand therapy exercises inside the tight cast",
      "Apply ice and elevate for 2 weeks without notifying the physician",
    ],
    "Urgent physician referral to evaluate for acute compartment syndrome or cast-related vascular compromise",
    `Pain with passive stretch, delayed capillary refill, and increasing swelling in a casted extremity are warning signs for compartment syndrome or vascular compromise — urgent medical evaluation required. Continuing cast or delaying referral risks permanent damage.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "compartment syndrome red flags",
      difficulty: 5,
      tags: ["fracture", "red-flags", "compartment-syndrome", ...PE],
      related: { keyTakeaway: "Cast + pain with passive stretch + delayed cap refill → urgent MD eval." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 30-year-old rock climber has finger pain at the A2 pulley of the right ring finger after a crimping injury. No deformity. Pain 5/10 with resisted finger flexion. Ultrasound shows A2 pulley thickening without complete rupture.`,
    "Which intervention is most appropriate?",
    [
      "Immediate return to maximal crimping",
      "Relative rest from crimping, gradual tendon gliding and strengthening, and technique modification to open-hand grips",
      "Surgical pulley reconstruction without conservative trial",
      "Complete immobilization of all fingers for 8 weeks",
    ],
    "Relative rest from crimping, gradual tendon gliding and strengthening, and technique modification to open-hand grips",
    `Pulley injuries in climbers typically manage with activity modification away from crimping, progressive loading, and technique changes. Immediate crimping risks rupture. Surgery reserved for complete ruptures or failed conservative care. Prolonged immobilization stiffens digits.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "finger pulley injury",
      difficulty: 4,
      tags: ["hand", "climbing", ...PE],
      related: { keyTakeaway: "Pulley injury: rest from crimping + gradual loading + technique modification." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 58-year-old woman with forward head posture and chronic neck pain has cervical flexion ROM of 45° and deep neck flexor endurance of 12 seconds on craniocervical flexion test (norm >30 s). Upper trapezius activation is dominant during arm elevation.`,
    "Which intervention target is most appropriate?",
    [
      "High-velocity cervical thrust manipulation only",
      "Deep neck flexor endurance training and scapular stabilization with postural re-education",
      "Complete cervical collar wear for 6 weeks",
      "Only passive traction without active exercise",
    ],
    "Deep neck flexor endurance training and scapular stabilization with postural re-education",
    `Cervicogenic/postural neck pain with poor deep neck flexor endurance responds to motor control training (craniocervical flexion), scapular stabilization, and postural education. Manipulation alone without motor control misses key deficits. Collars and traction-only approaches are inferior to active retraining.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "neck pain motor control",
      difficulty: 3,
      tags: ["cervical", "posture", ...PE],
      related: { keyTakeaway: "Postural neck pain: deep neck flexor + scapular control training." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 42-year-old warehouse worker lifted a heavy box and felt a pop in the low back. He has right buttock pain without leg radiation below the knee. FABER reproduces buttock pain. SI compression test is positive. Lumbar spine exam is benign. Patrick test asymmetry is 5°.`,
    "Which diagnosis is most likely?",
    [
      "Sacroiliac joint dysfunction",
      "Cauda equina syndrome",
      "Hip osteoarthritis",
      "Achilles tendon rupture",
    ],
    "Sacroiliac joint dysfunction",
    `Unilateral buttock pain after lifting with positive SI cluster tests (FABER, compression) and benign lumbar exam suggests SIJ dysfunction. Cauda equina includes bilateral leg symptoms and bowel/bladder dysfunction. Hip OA presents with groin pain and limited internal rotation. Achilles rupture is unrelated.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "sacroiliac joint dysfunction",
      difficulty: 3,
      tags: ["SIJ", "pelvis", ...PE],
      related: { keyTakeaway: "SIJ dysfunction: buttock pain + positive SI cluster tests + benign lumbar exam." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 50-year-old runner has plantar heel pain worst with first steps in the morning. Pain is 7/10 after 5 km runs. Windlass test is positive. Ankle dorsiflexion with knee extended is 5° (norm 10°). BMI is 28.`,
    "Which intervention combination is most appropriate?",
    [
      "Corticosteroid injection only without addressing flexibility",
      "Gastrocnemius/soleus stretching, plantar fascia loading exercises, footwear modification, and activity modification",
      "Complete cessation of all walking permanently",
      "High-heeled shoes only for all activities",
    ],
    "Gastrocnemius/soleus stretching, plantar fascia loading exercises, footwear modification, and activity modification",
    `Plantar fasciitis management includes calf flexibility (limited dorsiflexion contributes), progressive fascia loading, footwear, and load management. Injection-only approaches have short-term benefit. Permanent activity cessation is unnecessary. High heels alter mechanics but are not comprehensive treatment.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "plantar fasciitis",
      difficulty: 3,
      tags: ["foot", "plantar-fasciitis", ...PE],
      related: { keyTakeaway: "Plantar fasciitis: calf stretch + fascia loading + footwear + load management." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 27-year-old volleyball player has anterior knee pain and a palpable defect with inability to perform a straight-leg raise after landing awkwardly. Knee effusion is 3+. Patellar tendon is tender with gap palpated 2 cm below the patella. X-ray shows patella alta.`,
    "Which action is most appropriate?",
    [
      "Begin eccentric quadriceps exercises immediately",
      "Urgent orthopedic referral for likely patellar tendon rupture",
      "Ice and return to competition within 48 hours",
      "Patellar taping only for 6 weeks",
    ],
    "Urgent orthopedic referral for likely patellar tendon rupture",
    `Patellar tendon rupture presents with pop, hemarthrosis, palpable defect, inability to SLR, and patella alta — surgical referral is urgent. Eccentric exercise and taping are inappropriate for complete rupture.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "patellar tendon rupture",
      difficulty: 4,
      tags: ["knee", "tendon-rupture", ...PE],
      related: { keyTakeaway: "Patellar tendon rupture: defect + no SLR + patella alta → urgent ortho referral." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 60-year-old golfer reports left hip groin pain with rotation. Hip internal rotation is 20° (right 35°), FABER positive for groin pain. Trendelenburg sign is negative. X-ray shows joint space narrowing and osteophytes. Pain 4/10 at rest, 7/10 with rotation.`,
    "Which intervention is most appropriate for hip osteoarthritis?",
    [
      "Immediate total hip arthroplasty without conservative trial",
      "Hip strengthening, manual therapy as tolerated, aquatic exercise, and assistive device education if needed",
      "High-impact running to maintain cartilage",
      "Complete hip immobilization",
    ],
    "Hip strengthening, manual therapy as tolerated, aquatic exercise, and assistive device education if needed",
    `Hip OA is managed conservatively first with strengthening, low-impact exercise, and gait aids as needed. THA is for failed conservative care with functional limitation. High-impact activity worsens OA. Immobilization reduces function.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "hip osteoarthritis",
      difficulty: 3,
      tags: ["hip", "OA", ...PE],
      related: { keyTakeaway: "Hip OA: strengthening + low-impact exercise before surgical referral." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 34-year-old pregnant woman at 28 weeks gestation reports posterior pelvic pain with single-leg activities. Pain is 6/10 with walking 200 m. ASLR test is positive bilaterally. Lumbar flexion is full without radicular symptoms.`,
    "Which intervention is most appropriate?",
    [
      "Aggressive lumbar extension manipulation",
      "Pelvic girdle stabilization exercises, activity modification (avoid single-leg loading), and support belt as needed",
      "Complete bed rest until delivery",
      "High-intensity plyometric training",
    ],
    "Pelvic girdle stabilization exercises, activity modification (avoid single-leg loading), and support belt as needed",
    `Pregnancy-related pelvic girdle pain responds to stabilization exercises, avoiding asymmetric loading, and optional support belt. Manipulation is used cautiously in pregnancy. Bed rest is not indicated. Plyometrics increase pelvic load.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "pregnancy pelvic girdle pain",
      difficulty: 3,
      tags: ["pelvic-girdle", "pregnancy", ...PE],
      related: { keyTakeaway: "Pregnancy PGP: stabilization + avoid single-leg loading + optional belt." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 46-year-old man with a desk job has thoracic kyphosis and interscapular pain after 8 hours of computer work. Thoracic extension ROM is 15° (norm 25–30°). Scapular retraction endurance is 20 seconds (norm >60 s). No red flags on exam.`,
    "Which intervention is most appropriate?",
    [
      "Thoracic extension mobility, scapular retraction/endurance training, and ergonomic workstation modification",
      "Only cervical traction without thoracic or scapular work",
      "Permanent thoracic brace for 12 hours daily",
      "Complete work cessation without ergonomic changes",
    ],
    "Thoracic extension mobility, scapular retraction/endurance training, and ergonomic workstation modification",
    `Postural thoracic pain with reduced extension and scapular endurance benefits from thoracic mobility, scapular strengthening, and ergonomics. Cervical traction alone misses thoracic/scapular contributors. Bracing and work cessation are excessive without trial of targeted intervention.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "thoracic postural dysfunction",
      difficulty: 3,
      tags: ["thoracic", "posture", "ergonomics", ...PE],
      related: { keyTakeaway: "Thoracic postural pain: extension mobility + scapular endurance + ergonomics." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 23-year-old male lacrosse player has groin pain for 6 weeks. Adductor squeeze test is positive at 45° hip flexion. Pain 5/10 with cutting maneuvers. Hip flexor strength is 5/5. No urinary symptoms. MRI shows adductor longus tendinopathy without avulsion.`,
    "Which intervention is most appropriate?",
    [
      "Immediate adductor tenotomy",
      "Progressive Copenhagen adductor strengthening and sport-specific return when strength and pain criteria met",
      "Complete avoidance of all lower extremity activity for 6 months",
      "Only ice application without exercise",
    ],
    "Progressive Copenhagen adductor strengthening and sport-specific return when strength and pain criteria met",
    `Adductor-related groin pain (athletic pubalgia spectrum) is managed with progressive adductor strengthening (Copenhagen protocol) and graded return to sport. Surgery is for failed conservative care or avulsion. Prolonged inactivity and ice-only are inadequate.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "adductor tendinopathy",
      difficulty: 4,
      tags: ["groin", "adductor", "sports", ...PE],
      related: { keyTakeaway: "Adductor tendinopathy: Copenhagen strengthening + criteria-based return to sport." },
    }
  ),

  nptePtVignette(
    "musculoskeletal",
    `A 59-year-old woman underwent reverse total shoulder arthroplasty 4 weeks ago for rotator cuff tear arthropathy. Surgeon cleared passive ROM only. Passive forward flexion is 90°. She reports mild anterior shoulder discomfort 3/10 with PROM.`,
    "Which precaution is most important during early rehabilitation?",
    [
      "Avoid active shoulder extension and adduction against resistance that stresses the deltoid lever arm prematurely",
      "Perform aggressive end-range internal rotation stretches daily into pain 8/10",
      "Begin immediate overhead lifting with 10 lb weights",
      "No shoulder movement of any kind for 12 weeks",
    ],
    "Avoid active shoulder extension and adduction against resistance that stresses the deltoid lever arm prematurely",
    `Reverse TSA early rehab emphasizes passive ROM while protecting the construct — avoiding premature active extension/adduction loading per surgeon protocol. Aggressive painful stretching and early lifting violate precautions. Complete immobilization causes excessive stiffness.`,
    {
      blueprintSystem: "musculoskeletal",
      taskCategory: "interventions",
      blueprintTopic: "reverse total shoulder arthroplasty",
      difficulty: 5,
      tags: ["shoulder", "RTSA", "post-op", ...PE],
      related: { keyTakeaway: "Early reverse TSA: PROM within protocol; protect from premature active loading." },
    }
  ),
];
