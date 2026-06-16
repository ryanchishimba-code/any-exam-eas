/**
 * Curated NPTE-PT mixed non-systems & smaller body-system items — physician-educator batch 04.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-04";
const PE = ["physician-educator", BATCH, "npte-pt"];

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04: EnrichedBankItem[] = [
  nptePtVignette(
    "integumentary",
    `A 78-year-old nursing home resident with limited mobility has a Stage III pressure injury over the sacrum measuring 4 cm × 3 cm × 1.5 cm depth with moderate serous exudate. Wound bed is 70% granulation tissue. Braden score is 12. She spends 14 hours/day in a wheelchair.`,
    "Which intervention is the highest priority?",
    [
      "Pressure redistribution with repositioning schedule, support surface optimization, and offloading the sacrum",
      "Apply heat packs directly to the open wound bed",
      "Encourage prolonged sitting without repositioning to build tolerance",
      "Sharp debridement by PT without wound care team coordination",
    ],
    "Pressure redistribution with repositioning schedule, support surface optimization, and offloading the sacrum",
    `Stage III pressure injuries require addressing causative pressure/shear through repositioning, support surfaces, and offloading — without these, topical care fails. Heat on open wounds is contraindicated. Sharp debridement requires appropriate certification and team coordination.`,
    {
      blueprintSystem: "integumentary",
      taskCategory: "interventions",
      blueprintTopic: "pressure injury management",
      difficulty: 4,
      tags: ["pressure-ulcer", "wound-care", ...PE],
      related: { keyTakeaway: "Stage III PI: pressure redistribution and offloading are highest priority." },
    }
  ),

  nptePtVignette(
    "integumentary",
    `A 45-year-old man with partial-thickness burns covering 12% TBSA (anterior chest and arms) 5 days post-injury is cleared for ROM. Wound areas are graft-ready with minimal exudate. Pain is 6/10 with shoulder flexion to 120°.`,
    "Which intervention is most appropriate?",
    [
      "Pain-modulated ROM and positioning to prevent contracture, with scar management planning",
      "Immobilize all affected joints until grafting complete without any ROM",
      "Aggressive stretching into pain 10/10 hourly",
      "Avoid all upper extremity movement permanently",
    ],
    "Pain-modulated ROM and positioning to prevent contracture, with scar management planning",
    `Burn rehabilitation emphasizes early pain-modulated ROM and anti-contracture positioning — immobilization causes contractures. Aggressive painful stretching increases trauma. Permanent immobilization is inappropriate when cleared for ROM.`,
    {
      blueprintSystem: "integumentary",
      taskCategory: "interventions",
      blueprintTopic: "burn rehabilitation",
      difficulty: 4,
      tags: ["burns", "ROM", ...PE],
      related: { keyTakeaway: "Burn rehab: early pain-modulated ROM + anti-contracture positioning." },
    }
  ),

  nptePtVignette(
    "metabolic-endocrine",
    `A 58-year-old man with type 2 diabetes (HbA1c 8.2%) begins supervised exercise. Pre-exercise capillary glucose is 248 mg/dL, he feels well, ketones negative on strip. BP 132/84 mm Hg, HR 78/min.`,
    "Which action is most appropriate before aerobic exercise?",
    [
      "Proceed with moderate exercise with hydration and glucose monitoring, or brief delay with snack per protocol if symptomatic",
      "Begin maximal sprinting immediately without glucose check",
      "Cancel all exercise permanently when glucose exceeds 200 mg/dL",
      "Administer insulin bolus independently without physician protocol",
    ],
    "Proceed with moderate exercise with hydration and glucose monitoring, or brief delay with snack per protocol if symptomatic",
    `Hyperglycemia without ketones and without symptoms often permits moderate exercise with monitoring per diabetes exercise guidelines — not automatic cancellation or unsupervised insulin. Maximal sprinting without assessment is unsafe.`,
    {
      blueprintSystem: "metabolic-endocrine",
      taskCategory: "interventions",
      blueprintTopic: "diabetes exercise precautions",
      difficulty: 4,
      tags: ["diabetes", "exercise", ...PE],
      related: { keyTakeaway: "DM exercise: hyperglycemia without ketones may allow moderate exercise with monitoring." },
    }
  ),

  nptePtVignette(
    "metabolic-endocrine",
    `A 67-year-old woman with osteoporosis (T-score −3.0 lumbar spine) and prior vertebral fracture attends PT for balance and strengthening. She has no acute fracture on recent imaging. Pain 2/10 at rest.`,
    "Which exercise modification is most important?",
    [
      "Avoid end-range spinal flexion under load; emphasize extension, hip strengthening, and balance training",
      "Repeated maximal sit-ups and toe touches with weighted vest",
      "High-impact jumping plyometrics daily",
      "No physical activity due to osteoporosis diagnosis",
    ],
    "Avoid end-range spinal flexion under load; emphasize extension, hip strengthening, and balance training",
    `Osteoporosis with prior VCF requires avoiding loaded flexion while promoting weight-bearing, resistance, and balance exercise — sit-ups, toe touches, and high-impact loading increase fracture risk.`,
    {
      blueprintSystem: "metabolic-endocrine",
      taskCategory: "interventions",
      blueprintTopic: "osteoporosis exercise",
      difficulty: 3,
      tags: ["osteoporosis", "fracture-prevention", ...PE],
      related: { keyTakeaway: "Osteoporosis: avoid loaded flexion; emphasize WB, hip strength, balance." },
    }
  ),

  nptePtVignette(
    "gastrointestinal",
    `A 52-year-old woman 3 days post laparoscopic colectomy reports incision pain 4/10. Surgeon cleared ambulation and deep breathing; no lifting >10 lb. She has not ambulated beyond bathroom. RR 18/min, HR 82/min, BP 118/74 mm Hg.`,
    "Which intervention is most appropriate?",
    [
      "Progressive ambulation several times daily, diaphragmatic breathing, and gentle trunk mobility within precautions",
      "Complete bed rest until 6 weeks post-op",
      "Immediate heavy deadlifting to restore core strength",
      "Avoid all walking to protect the incision",
    ],
    "Progressive ambulation several times daily, diaphragmatic breathing, and gentle trunk mobility within precautions",
    `Early post-abdominal surgery mobilization reduces pulmonary complications and ileus risk — progressive ambulation and breathing within surgeon restrictions. Bed rest and avoiding walking increase complications.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "interventions",
      blueprintTopic: "post-abdominal surgery mobilization",
      difficulty: 3,
      tags: ["post-op", "GI-surgery", ...PE],
      related: { keyTakeaway: "Post-abdominal surgery: early ambulation + breathing within surgeon precautions." },
    }
  ),

  nptePtVignette(
    "genitourinary",
    `A 62-year-old woman reports stress urinary incontinence with coughing and lifting. She completes 3 pads daily. Pelvic floor contraction hold is 3 seconds, strength appears weak on digital assessment. BMI 29. No neurologic deficits.`,
    "Which intervention is most appropriate as first-line?",
    [
      "Supervised pelvic floor muscle training with progressive hold duration and functional integration",
      "Immediate surgical referral without trial of conservative care",
      "Avoid all fluid intake to prevent leakage",
      "High-impact jumping exercises to strengthen pelvic floor",
    ],
    "Supervised pelvic floor muscle training with progressive hold duration and functional integration",
    `Stress incontinence first-line management is supervised pelvic floor muscle training — surgery follows failed conservative care. Fluid restriction is unhealthy. High-impact jumping may worsen leakage initially.`,
    {
      blueprintSystem: "genitourinary",
      taskCategory: "interventions",
      blueprintTopic: "stress urinary incontinence",
      difficulty: 3,
      tags: ["pelvic-floor", "incontinence", ...PE],
      related: { keyTakeaway: "Stress incontinence: supervised pelvic floor muscle training first-line." },
    }
  ),

  nptePtVignette(
    "lymphatic",
    `A 55-year-old woman 6 months post left mastectomy with axillary dissection has left arm circumference 5 cm greater than right at the forearm. Stemmer sign positive. Skin pitting absent. She reports heaviness and tightness rating 6/10.`,
    "Which intervention is most appropriate?",
    [
      "Complete decongestive therapy including manual lymph drainage, compression bandaging, skin care, and remedial exercise",
      "Aggressive resistance exercise with blood pressure cuff on the arm",
      "Avoid all arm movement permanently",
      "Apply heat packs only without compression",
    ],
    "Complete decongestive therapy including manual lymph drainage, compression bandaging, skin care, and remedial exercise",
    `Secondary lymphedema post-mastectomy is managed with CDT (MLD, compression, skin care, exercise) — not BP cuff on affected limb or permanent immobilization. Heat without compression is incomplete.`,
    {
      blueprintSystem: "lymphatic",
      taskCategory: "interventions",
      blueprintTopic: "post-mastectomy lymphedema",
      difficulty: 4,
      tags: ["lymphedema", "CDT", ...PE],
      related: { keyTakeaway: "Secondary lymphedema: CDT (MLD, compression, skin care, exercise)." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `A 74-year-old man with COPD (FEV₁ 40%) and HFrEF (EF 28%) reports dyspnea walking 50 m. SpO₂ 89% on exertion, HR 104/min, BP 98/62 mm Hg. Borg 6/10. Knee OA pain 4/10 also present.`,
    "Which exercise prescription approach is most appropriate?",
    [
      "Low-intensity interval training with close monitoring of SpO₂, BP, and symptoms; coordinate with cardiopulmonary team",
      "Maximal high-intensity continuous training ignoring hypotension",
      "No exercise because two organ systems are involved",
      "Only knee strengthening without addressing cardiopulmonary limits",
    ],
    "Low-intensity interval training with close monitoring of SpO₂, BP, and symptoms; coordinate with cardiopulmonary team",
    `Multi-system cardiopulmonary disease requires integrated low-intensity monitored exercise addressing primary limiting factors — not avoidance of all activity or isolated joint exercise ignoring dyspnea/hypotension.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "COPD and heart failure comorbidity",
      difficulty: 5,
      tags: ["comorbidity", "COPD", "CHF", ...PE],
      related: { keyTakeaway: "COPD + HF: low-intensity monitored exercise, address cardiopulmonary limits." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `A 68-year-old woman on 8 medications including beta-blocker, diuretic, and opioid for chronic pain reports dizziness on standing. Supine BP 128/76 mm Hg drops to 92/58 mm Hg standing with HR increase from 62 to 88/min after 3 minutes.`,
    "Which PT action is most appropriate?",
    [
      "Educate on orthostatic precautions, slow transitions, hydration, and coordinate with physician regarding polypharmacy contribution",
      "Proceed with maximal treadmill testing without orthostatic assessment",
      "Ignore BP changes because supine values are normal",
      "Discontinue all medications independently",
    ],
    "Educate on orthostatic precautions, slow transitions, hydration, and coordinate with physician regarding polypharmacy contribution",
    `Orthostatic hypotension in polypharmacy requires PT education on transitions and medical coordination — not ignoring standing hypotension or independent medication changes.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "polypharmacy and orthostatic hypotension",
      difficulty: 4,
      tags: ["polypharmacy", "orthostatic", ...PE],
      related: { keyTakeaway: "Orthostatic hypotension + polypharmacy: PT education + MD coordination." },
    }
  ),

  nptePtVignette(
    "equipment-devices",
    `A 56-year-old man with T10 paraplegia (AIS A) uses a manual wheelchair full time. Seat width appears 2 inches too narrow causing hip discomfort. Popliteal height is 20 inches; current seat depth is 18 inches. Shoulder pain 5/10 after propulsion.`,
    "Which wheelchair fit issue is most likely contributing to discomfort?",
    [
      "Seat depth may be too short and width too narrow — referral for seating evaluation recommended",
      "Wheelchair is always one-size-fits-all; no adjustments needed",
      "Only tire pressure affects seating comfort",
      "Seat height is irrelevant to propulsion biomechanics",
    ],
    "Seat depth may be too short and width too narrow — referral for seating evaluation recommended",
    `Wheelchair fit requires appropriate seat width (allow lateral clearance) and depth (support thigh without popliteal pressure) — narrow width and improper depth cause skin and shoulder issues. Propulsion biomechanics depend on seat height and setup.`,
    {
      blueprintSystem: "equipment-devices",
      taskCategory: "examination",
      blueprintTopic: "wheelchair seating evaluation",
      difficulty: 4,
      tags: ["wheelchair", "seating", ...PE],
      related: { keyTakeaway: "WC fit: seat width, depth, and height affect comfort and propulsion." },
    }
  ),

  nptePtVignette(
    "equipment-devices",
    `A 72-year-old woman post hip fracture uses a standard walker. She is 5'2" (158 cm) and reports forward-flexed posture and back pain 5/10 when ambulating 100 m. Walker handgrip height is at the level of her iliac crest.`,
    "Which adjustment is most appropriate?",
    [
      "Raise handgrips to wrist crease height when standing upright with elbows flexed ~20–30°",
      "Lower handgrips to mid-thigh to increase forward lean",
      "Remove walker and ambulate without device immediately",
      "No adjustment possible for walkers",
    ],
    "Raise handgrips to wrist crease height when standing upright with elbows flexed ~20–30°",
    `Walker height should allow upright posture with handgrips at wrist crease and slight elbow flexion — grips at iliac crest are too low, causing flexed posture and back pain.`,
    {
      blueprintSystem: "equipment-devices",
      taskCategory: "interventions",
      blueprintTopic: "walker fit",
      difficulty: 3,
      tags: ["walker", "assistive-device", ...PE],
      related: { keyTakeaway: "Walker height: wrist crease level, ~20–30° elbow flexion for upright posture." },
    }
  ),

  nptePtVignette(
    "equipment-devices",
    `A 34-year-old man with transtibial amputation is learning prosthetic gait. He reports pistoning (vertical movement of stump in socket) 2 cm during stance. Socket fit was checked; suspension appears loose. Energy cost during 2-minute walk is elevated at 110% predicted.`,
    "Which issue should be addressed first?",
    [
      "Socket fit and suspension system adjustment before advancing gait training",
      "Increase walking speed to compensate for pistoning",
      "Ignore pistoning if patient can walk any distance",
      "Immediate surgical revision without prosthetic adjustment trial",
    ],
    "Socket fit and suspension system adjustment before advancing gait training",
    `Prosthetic pistoning indicates poor socket fit or suspension — must be corrected before advanced gait training. Increasing speed or ignoring fit issues causes skin breakdown and inefficient gait.`,
    {
      blueprintSystem: "equipment-devices",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "prosthetic gait pistoning",
      difficulty: 4,
      tags: ["prosthetics", "amputation", ...PE],
      related: { keyTakeaway: "Prosthetic pistoning: correct socket fit/suspension before advancing gait." },
    }
  ),

  nptePtVignette(
    "therapeutic-modalities",
    `A 48-year-old woman with acute lateral ankle sprain (48 hours post-injury) has moderate swelling and pain 6/10. Skin intact, no open wounds. Surgeon cleared PT including modalities.`,
    "Which modality application is most appropriate at this stage?",
    [
      "Cryotherapy 15–20 minutes with compression and elevation",
      "Ultrasound at 1.5 W/cm² continuously over acutely swollen area for 10 minutes",
      "Therapeutic heat for 30 minutes to increase blood flow acutely",
      "High-voltage pulsed current over open abrasion nearby",
    ],
    "Cryotherapy 15–20 minutes with compression and elevation",
    `Acute sprain (first 48–72 hours) uses cryotherapy, compression, and elevation — not heat which increases swelling. US parameters and HVPC require appropriate phase and intact skin without contraindications.`,
    {
      blueprintSystem: "therapeutic-modalities",
      taskCategory: "interventions",
      blueprintTopic: "acute inflammation cryotherapy",
      difficulty: 3,
      tags: ["cryotherapy", "acute-sprain", ...PE],
      related: { keyTakeaway: "Acute sprain 48h: cryotherapy + compression + elevation, not heat." },
    }
  ),

  nptePtVignette(
    "therapeutic-modalities",
    `A 55-year-old man with chronic rotator cuff tendinopathy has intact skin over the shoulder. Prior acute phase resolved 6 weeks ago. Goal is tissue healing promotion before progressive loading.`,
    "Which ultrasound parameter set is most appropriate?",
    [
      "Pulsed US 1:4 duty cycle, 1.0 W/cm², 5 minutes over supraspinatus tendon",
      "Continuous US 3.0 W/cm² for 15 minutes over bony prominence with no coupling gel",
      "US over area with metal implant without physician clearance",
      "US applied over numb skin region with absent sensation without monitoring",
    ],
    "Pulsed US 1:4 duty cycle, 1.0 W/cm², 5 minutes over supraspinatus tendon",
    `Subacute tendinopathy may use pulsed US at moderate intensity with proper coupling over target tissue — not continuous high intensity over bone, over metal without clearance, or insensate skin without monitoring.`,
    {
      blueprintSystem: "therapeutic-modalities",
      taskCategory: "interventions",
      blueprintTopic: "ultrasound tendinopathy",
      difficulty: 4,
      tags: ["ultrasound", "tendinopathy", ...PE],
      related: { keyTakeaway: "Subacute tendinopathy US: pulsed moderate intensity with proper coupling." },
    }
  ),

  nptePtVignette(
    "therapeutic-modalities",
    `A 62-year-old woman with knee OA has a cardiac pacemaker on the ipsilateral side. Physician cleared NMES for quadriceps strengthening with specific precautions.`,
    "Which precaution is most important when applying NMES near the pacemaker?",
    [
      "Avoid placing electrodes over or near the pacemaker generator; follow physician-specific clearance and monitor response",
      "Place electrodes directly over the pacemaker to strengthen chest muscles",
      "Maximal tetanic contraction intensity without monitoring",
      "No precautions needed for any electrical modality with pacemaker",
    ],
    "Avoid placing electrodes over or near the pacemaker generator; follow physician-specific clearance and monitor response",
    `NMES near pacemakers requires avoiding electrode placement over the device and following physician clearance — direct placement over generator may interfere with device function.`,
    {
      blueprintSystem: "therapeutic-modalities",
      taskCategory: "interventions",
      blueprintTopic: "NMES pacemaker precautions",
      difficulty: 4,
      tags: ["NMES", "pacemaker", "contraindications", ...PE],
      related: { keyTakeaway: "NMES with pacemaker: avoid electrodes over device; follow MD clearance." },
    }
  ),

  nptePtVignette(
    "safety-protection",
    `A 79-year-old woman in skilled nursing facility has fallen twice in the past month. TUG is 18 seconds, Berg 38/56. She uses a walker inconsistently and has orthostatic BP drop of 22 mm Hg systolic. Room has loose rugs and poor lighting.`,
    "Which fall prevention strategy is most comprehensive?",
    [
      "Multifactorial intervention: environment modification, consistent walker use, orthostatic training, balance exercises, and staff education",
      "Restraints in wheelchair to prevent all falls",
      "Remove walker to force independent balance",
      "Ignore environmental hazards because patient has walker",
    ],
    "Multifactorial intervention: environment modification, consistent walker use, orthostatic training, balance exercises, and staff education",
    `Fall prevention in frail elders requires multifactorial approaches — environment, devices, orthostatic management, and exercise. Restraints cause injury and decline. Removing assistive devices increases falls.`,
    {
      blueprintSystem: "safety-protection",
      taskCategory: "interventions",
      blueprintTopic: "fall prevention multifactorial",
      difficulty: 4,
      tags: ["falls", "geriatric", ...PE],
      related: { keyTakeaway: "Falls: multifactorial approach — environment, devices, orthostasis, balance." },
    }
  ),

  nptePtVignette(
    "safety-protection",
    `A PT aide sustained a needlestick while disposing of a used syringe found in the bathroom after treating a 72-year-old patient. The source patient's HIV/hepatitis status is unknown. The aide washed the wound with soap and water immediately and reports puncture depth of 2 mm.`,
    "Which next step is most appropriate per bloodborne pathogen protocol?",
    [
      "Report to supervisor immediately, complete incident documentation, and follow occupational health post-exposure prophylaxis protocol",
      "Ignore incident if wound is small",
      "Wait 2 weeks to see if symptoms develop before reporting",
      "Continue working without telling anyone to avoid paperwork",
    ],
    "Report to supervisor immediately, complete incident documentation, and follow occupational health post-exposure prophylaxis protocol",
    `Needlestick injuries require immediate reporting, documentation, and occupational health evaluation for PEP — delay reduces prophylaxis efficacy. Ignoring or delaying violates BBP protocols.`,
    {
      blueprintSystem: "safety-protection",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "bloodborne pathogen exposure",
      difficulty: 3,
      tags: ["BBP", "needlestick", "OSHA", ...PE],
      related: { keyTakeaway: "Needlestick: immediate report + occupational health PEP protocol." },
    }
  ),

  nptePtVignette(
    "safety-protection",
    `A 65-year-old man weighing 220 lb (100 kg) requires transfer from bed to wheelchair with moderate assist. The PT weighs 140 lb (64 kg) and has no mechanical lift available. He is partial weight-bearing at 50% on the right lower extremity per surgeon orders.`,
    "Which action best protects the therapist from injury?",
    [
      "Use a mechanical lift or additional trained staff per facility policy; do not perform unsafe manual transfer alone",
      "Attempt solo drag transfer using trunk rotation without equipment",
      "Ask the patient to jump to the wheelchair independently",
      "Use a gait belt alone to lift the entire body weight vertically",
    ],
    "Use a mechanical lift or additional trained staff per facility policy; do not perform unsafe manual transfer alone",
    `Body mechanics and patient safety require appropriate equipment and staffing for transfers exceeding safe manual limits — solo unsafe transfers risk injury to both parties. Gait belts assist not lift full body weight.`,
    {
      blueprintSystem: "safety-protection",
      taskCategory: "interventions",
      blueprintTopic: "safe patient handling",
      difficulty: 3,
      tags: ["body-mechanics", "transfers", ...PE],
      related: { keyTakeaway: "Unsafe transfer weight: use lift/additional staff per policy." },
    }
  ),

  nptePtVignette(
    "professional-responsibilities",
    `A physical therapist discovers documentation errors in a colleague's notes that could affect Medicare billing compliance. The colleague is a friend who asks the therapist not to report it.`,
    "What is the most appropriate professional action?",
    [
      "Address through proper channels per facility compliance policy and APTA ethical obligations — document concerns and notify appropriate supervisor/compliance officer",
      "Ignore errors to protect the friendship",
      "Publicly confront the colleague in the waiting room",
      "Alter the colleague's documentation without their knowledge",
    ],
    "Address through proper channels per facility compliance policy and APTA ethical obligations — document concerns and notify appropriate supervisor/compliance officer",
    `APTA Code of Ethics requires addressing fraud/error through proper institutional and professional channels — not ignoring, public confrontation, or unauthorized alteration of records.`,
    {
      blueprintSystem: "professional-responsibilities",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "ethics and billing compliance",
      difficulty: 4,
      tags: ["ethics", "documentation", ...PE],
      related: { keyTakeaway: "Documentation/billing errors: report through proper compliance channels." },
    }
  ),

  nptePtVignette(
    "professional-responsibilities",
    `A PTA has completed 500 clinical hours in a jurisdiction requiring PT supervision for all PTA services. The supervising PT is off-site at a conference but available by phone. A new evaluation is scheduled for a complex neurologic patient.`,
    "Which action is within appropriate scope?",
    [
      "PTA may treat established patients per plan of care with available PT supervision per state practice act; new evaluation must be performed by PT",
      "PTA performs initial evaluation independently because PT is reachable by phone",
      "PTA may supervise a PT student performing evaluations",
      "No supervision required for any PTA service in all jurisdictions",
    ],
    "PTA may treat established patients per plan of care with available PT supervision per state practice act; new evaluation must be performed by PT",
    `PTAs cannot perform initial examinations/evaluations — that is PT scope. Supervision requirements vary by state; phone availability may suffice for established care in some jurisdictions but not for new evals.`,
    {
      blueprintSystem: "professional-responsibilities",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "PTA supervision and scope",
      difficulty: 4,
      tags: ["scope-of-practice", "PTA", "supervision", ...PE],
      related: { keyTakeaway: "PTA cannot perform initial evaluation; supervision per state practice act." },
    }
  ),

  nptePtVignette(
    "research-evidence",
    `A clinic wants to adopt a new balance outcome measure. Measure A has sensitivity 0.92 and specificity 0.65 for predicting falls. Measure B has sensitivity 0.70 and specificity 0.90. The priority is identifying patients at high fall risk who need intervention.`,
    "Which measure is most appropriate for this screening priority?",
    [
      "Measure A — higher sensitivity better identifies true fall-risk patients (fewer false negatives)",
      "Measure B — higher specificity is always preferred for screening",
      "Neither measure provides useful information",
      "Choose the shorter measure regardless of psychometrics",
    ],
    "Measure A — higher sensitivity better identifies true fall-risk patients (fewer false negatives)",
    `When screening to identify patients needing intervention, higher sensitivity minimizes false negatives (missed fall-risk patients). Specificity reduces false positives — important when confirmatory testing is costly or invasive.`,
    {
      blueprintSystem: "research-evidence",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "sensitivity and specificity",
      difficulty: 4,
      tags: ["EBP", "psychometrics", "falls", ...PE],
      related: { keyTakeaway: "Screening for risk: prioritize sensitivity to minimize missed cases." },
    }
  ),

  nptePtVignette(
    "research-evidence",
    `A randomized controlled trial reports that supervised exercise reduced pain by 2.5 points on a 10-point scale (95% CI 1.8–3.2, p<0.001) in knee OA compared with education alone. Minimal clinically important difference is 2.0 points.`,
    "Which conclusion is most supported?",
    [
      "Supervised exercise produces a statistically and clinically meaningful pain reduction",
      "Results are statistically significant but never clinically meaningful",
      "P-value alone proves exercise is harmful",
      "Confidence interval crossing zero indicates no effect",
    ],
    "Supervised exercise produces a statistically and clinically meaningful pain reduction",
    `Mean reduction 2.5 exceeds MCID of 2.0 and CI (1.8–3.2) excludes zero — statistically significant and clinically meaningful. p-value supports significance; CI does not cross zero.`,
    {
      blueprintSystem: "research-evidence",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "interpreting RCT results",
      difficulty: 3,
      tags: ["EBP", "RCT", "MCID", ...PE],
      related: { keyTakeaway: "Effect exceeds MCID with CI excluding zero → clinically meaningful." },
    }
  ),

  nptePtVignette(
    "integumentary",
    `A 83-year-old man with diabetes and peripheral neuropathy has a plantar foot ulcer Wagner grade 1. Wound measures 1.5 cm × 1 cm × 0.3 cm. ABI is 0.95. Offloading cast applied by wound care team.`,
    "Which PT intervention complements wound healing?",
    [
      "Non-weight-bearing gait training with offloading device, balance training, and lower extremity strengthening within precautions",
      "Weight-bearing treadmill walking without offloading",
      "Sharp scalpel debridement to bone by PT without certification",
      "Hot whirlpool immersion of the open ulcer",
    ],
    "Non-weight-bearing gait training with offloading device, balance training, and lower extremity strengthening within precautions",
    `Diabetic foot ulcer PT supports offloading adherence, safe mobility, and conditioning — not weight-bearing against offloading or inappropriate debridement/soaks on open wounds.`,
    {
      blueprintSystem: "integumentary",
      taskCategory: "interventions",
      blueprintTopic: "diabetic foot ulcer",
      difficulty: 4,
      tags: ["diabetic-ulcer", "offloading", ...PE],
      related: { keyTakeaway: "Diabetic foot ulcer: support offloading + safe NWB mobility + conditioning." },
    }
  ),

  nptePtVignette(
    "gastrointestinal",
    `A 38-year-old woman with chronic constipation and pelvic floor dyssynergia shows paradoxical pelvic floor contraction during simulated defecation on biofeedback assessment. She reports straining for 10+ minutes daily.`,
    "Which intervention is most appropriate?",
    [
      "Pelvic floor biofeedback training to coordinate relaxation during defecation plus bowel habit modification",
      "High-intensity abdominal crunches to 200 repetitions daily",
      "Permanent bed rest to avoid straining",
      "Ignore pelvic floor coordination and only prescribe laxatives",
    ],
    "Pelvic floor biofeedback training to coordinate relaxation during defecation plus bowel habit modification",
    `Pelvic floor dyssynergia responds to biofeedback for coordinated relaxation and bowel retraining — not excessive crunches, bed rest, or laxatives alone without addressing coordination.`,
    {
      blueprintSystem: "gastrointestinal",
      taskCategory: "interventions",
      blueprintTopic: "pelvic floor dyssynergia",
      difficulty: 4,
      tags: ["pelvic-floor", "constipation", ...PE],
      related: { keyTakeaway: "Pelvic floor dyssynergia: biofeedback for coordinated relaxation + bowel habits." },
    }
  ),

  nptePtVignette(
    "genitourinary",
    `A 70-year-old man 4 weeks post radical prostatectomy reports urinary leakage with exertion. He completes 2 pads daily. Pelvic floor contraction is weak; he cannot sustain hold >2 seconds.`,
    "Which intervention is most appropriate?",
    [
      "Progressive pelvic floor muscle training with functional integration during activities that trigger leakage",
      "Immediate permanent indwelling catheter without rehab trial",
      "Avoid all physical activity including walking",
      "Only abdominal strengthening without pelvic floor focus",
    ],
    "Progressive pelvic floor muscle training with functional integration during activities that trigger leakage",
    `Post-prostatectomy stress incontinence is managed with progressive pelvic floor training integrated into functional activities — not permanent catheter or activity avoidance without rehab trial.`,
    {
      blueprintSystem: "genitourinary",
      taskCategory: "interventions",
      blueprintTopic: "post-prostatectomy incontinence",
      difficulty: 3,
      tags: ["prostatectomy", "pelvic-floor", ...PE],
      related: { keyTakeaway: "Post-prostatectomy leakage: progressive PFM training + functional integration." },
    }
  ),

  nptePtVignette(
    "lymphatic",
    `A 48-year-old man with primary lymphedema of the right lower extremity wears compression stockings 20–30 mm Hg. Stemmer sign positive. He asks about exercise with compression.`,
    "Which recommendation is most appropriate?",
    [
      "Exercise with compression garment in place; progressive aerobic and resistance training as tolerated",
      "Avoid all exercise because of lymphedema diagnosis",
      "Exercise only without compression to allow swelling",
      "High-impact only exercise without monitoring limb volume",
    ],
    "Exercise with compression garment in place; progressive aerobic and resistance training as tolerated",
    `Lymphedema management supports exercise with compression to minimize fluid accumulation — exercise is encouraged, not avoided. Removing compression during exercise increases swelling risk.`,
    {
      blueprintSystem: "lymphatic",
      taskCategory: "interventions",
      blueprintTopic: "lymphedema and exercise",
      difficulty: 3,
      tags: ["lymphedema", "exercise", "compression", ...PE],
      related: { keyTakeaway: "Lymphedema: exercise with compression garment; progressive loading." },
    }
  ),

  nptePtVignette(
    "equipment-devices",
    `A 65-year-old woman learning axillary crutches bears 50% weight on the right lower extremity post ORIF tibia. She places crutches 12 inches ahead and steps with affected leg first while leaning heavily through axillae causing arm pain 7/10.`,
    "Which crutch gait training correction is most appropriate?",
    [
      "Teach partial weight-bearing gait with crutches adjusted to wrist crease height, weight through hands not axillae, and proper sequence per prescription",
      "Continue axillary loading because it feels more stable",
      "Use crutches 6 inches too long to reduce bending",
      "Jump on unaffected leg only without crutches",
    ],
    "Teach partial weight-bearing gait with crutches adjusted to wrist crease height, weight through hands not axillae, and proper sequence per prescription",
    `Axillary crutch use requires weight through hands with proper height (wrist crease) — axillary loading causes nerve compression and pain. Proper PWB sequence follows physician weight-bearing status.`,
    {
      blueprintSystem: "equipment-devices",
      taskCategory: "interventions",
      blueprintTopic: "axillary crutch training",
      difficulty: 3,
      tags: ["crutches", "gait-training", ...PE],
      related: { keyTakeaway: "Axillary crutches: weight through hands, wrist crease height, not axillae." },
    }
  ),

  nptePtVignette(
    "therapeutic-modalities",
    `A 40-year-old man with superficial partial-thickness burn on the forearm (healed epithelium, no open areas) has hypertrophic scarring with itching rated 6/10. Physician cleared silicone and pressure therapy.`,
    "Which modality approach is most appropriate for scar management?",
    [
      "Silicone gel sheeting and pressure garment as prescribed plus ROM to prevent contracture",
      "Direct ice application causing frostbite on scar",
      "High-intensity UV exposure to the scar",
      "Deep friction massage into open wound areas",
    ],
    "Silicone gel sheeting and pressure garment as prescribed plus ROM to prevent contracture",
    `Hypertrophic scar management uses silicone, pressure, and ROM — not frostbite-inducing ice, UV, or massage on non-healed areas.`,
    {
      blueprintSystem: "therapeutic-modalities",
      taskCategory: "interventions",
      blueprintTopic: "scar management",
      difficulty: 3,
      tags: ["scar", "burn", ...PE],
      related: { keyTakeaway: "Hypertrophic scar: silicone + pressure + ROM per prescription." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `A 71-year-old woman with obesity (BMI 38), knee OA, and type 2 diabetes (HbA1c 9.1%) wants to start community walking program. Resting BP 142/88 mm Hg, HR 84/min. She walks 150 m before knee and dyspnea limit.`,
    "Which integrated plan element is most important?",
    [
      "Low-impact progressive walking, dietary referral coordination, glucose monitoring plan, and knee strengthening",
      "Marathon training program starting week 1",
      "Address only knee OA and ignore diabetes and obesity",
      "No exercise until HbA1c is below 5.5%",
    ],
    "Low-impact progressive walking, dietary referral coordination, glucose monitoring plan, and knee strengthening",
    `Multi-morbidity exercise planning integrates low-impact activity, medical coordination (diabetes, BP), and MSK strengthening — not single-system focus or unrealistic HbA1c thresholds before any activity.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "obesity diabetes OA integration",
      difficulty: 4,
      tags: ["comorbidity", "obesity", "diabetes", "OA", ...PE],
      related: { keyTakeaway: "Obesity + DM + OA: integrated low-impact plan + medical coordination." },
    }
  ),

  nptePtVignette(
    "safety-protection",
    `During CPR on an unresponsive 58-year-old man in the clinic, the AED advises shock. HR on monitor shows ventricular fibrillation at 180/min. Two team members are present: a PT and a PTA. Chest compressions are in progress at 110/min.`,
    "Which role assignment follows emergency response best practice?",
    [
      "One rescuer continues compressions while AED pads are placed; clear patient before shock; rotate compressions every 2 minutes to limit fatigue",
      "Stop all compressions permanently and wait for EMS without AED use",
      "Both rescuers leave the patient to find documentation forms",
      "Apply AED pads while patient is being touched during shock delivery",
    ],
    "One rescuer continues compressions while AED pads are placed; clear patient before shock; rotate compressions every 2 minutes to limit fatigue",
    `AED use requires continued compressions until pads applied, clear contact before shock, and compressor rotation to maintain quality — not delaying AED or shocking while touching patient.`,
    {
      blueprintSystem: "safety-protection",
      taskCategory: "interventions",
      blueprintTopic: "AED and CPR team response",
      difficulty: 4,
      tags: ["CPR", "AED", "emergency", ...PE],
      related: { keyTakeaway: "AED: compressions until pads on, clear before shock, rotate compressors." },
    }
  ),

  nptePtVignette(
    "professional-responsibilities",
    `A patient requests a copy of their physical therapy records. The clinic policy allows release with written authorization. The patient provides signed HIPAA authorization form.`,
    "Which action is most appropriate?",
    [
      "Provide records per policy timeline and authorization scope; maintain documentation of release",
      "Refuse all record access because records belong to the clinic exclusively",
      "Release only verbal summary without written records",
      "Charge punitive fees prohibited by state law without disclosure",
    ],
    "Provide records per policy timeline and authorization scope; maintain documentation of release",
    `HIPAA grants patients access to their health records with proper authorization — clinics must release per policy and document the transaction. Refusal or verbal-only summary violates patient rights.`,
    {
      blueprintSystem: "professional-responsibilities",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "HIPAA records access",
      difficulty: 3,
      tags: ["HIPAA", "documentation", ...PE],
      related: { keyTakeaway: "HIPAA: release records per authorization; document the release." },
    }
  ),

  nptePtVignette(
    "research-evidence",
    `A systematic review of 12 RCTs (n=1,840) concludes that telerehabilitation is equivalent to in-clinic PT for post-TKA outcomes at 12 weeks. One included trial had high dropout rate (35%) and incomplete blinding.`,
    "Which appraisal consideration is most important?",
    [
      "Evaluate overall review quality (GRADE/Cochrane), individual trial risk of bias including attrition, and applicability to local practice",
      "Accept conclusion without examining individual trial quality",
      "Reject all telerehabilitation because one trial had dropouts",
      "Assume systematic reviews are always low quality",
    ],
    "Evaluate overall review quality (GRADE/Cochrane), individual trial risk of bias including attrition, and applicability to local practice",
    `EBP requires appraising systematic review methodology, attrition bias in included trials, and local applicability — not blanket acceptance or rejection based on single limitations.`,
    {
      blueprintSystem: "research-evidence",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "systematic review appraisal",
      difficulty: 4,
      tags: ["EBP", "systematic-review", "telerehab", ...PE],
      related: { keyTakeaway: "Appraise systematic reviews: methodology, attrition bias, applicability." },
    }
  ),
];
