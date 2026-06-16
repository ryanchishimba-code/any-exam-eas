/**
 * Curated NPTE-PT cardiovascular & pulmonary items — physician-educator batch 03.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-03";
const PE = ["physician-educator", BATCH, "npte-pt"];

const APTA_CARDIOPULM = { label: "APTA Cardiovascular & Pulmonary Section Guidelines", url: "https://cardiopulmonaryapta.org" };
const AACVPR = { label: "AACVPR Pulmonary Rehabilitation Guidelines", url: "https://www.aacvpr.org" };

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03: EnrichedBankItem[] = [
  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 62-year-old man with COPD (FEV₁ 42% predicted, GOLD stage III) reports dyspnea 6/10 walking 100 m. SpO₂ is 88% on room air during exertion, improving to 92% at rest. RR 24/min. He uses tiotropium and salbutamol PRN. HR 96/min at rest, 118/min after 100 m walk.`,
    "Which intervention is most appropriate to improve functional capacity?",
    [
      "Pulmonary rehabilitation with interval aerobic training, breathing retraining, and energy conservation",
      "Complete bed rest to preserve oxygen saturation",
      "High-intensity continuous running until SpO₂ reaches 80%",
      "Avoid all exercise because FEV₁ is below 50%",
    ],
    "Pulmonary rehabilitation with interval aerobic training, breathing retraining, and energy conservation",
    `COPD GOLD III benefits from pulmonary rehabilitation including interval training, breathing strategies, and energy conservation — exercise improves dyspnea and function despite low FEV₁. Bed rest causes deconditioning. Exercising to severe desaturation without monitoring is unsafe.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "COPD pulmonary rehabilitation",
      difficulty: 4,
      references: [AACVPR],
      tags: ["COPD", "pulmonary-rehab", ...PE],
      related: { keyTakeaway: "COPD: pulmonary rehab with interval training + breathing retraining." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 70-year-old woman with HFrEF (EF 30%) 4 weeks post hospitalization for acute decompensation is cleared for cardiac rehab phase II. BP 108/68 mm Hg, HR 78/min, SpO₂ 96%. She reports fatigue 4/10 on 6-minute walk of 280 m. RPE 11/20 at end test.`,
    "Which exercise prescription is most appropriate?",
    [
      "Continuous moderate-intensity aerobic exercise at 40–70% peak HR with BP and symptom monitoring",
      "Maximal sprint intervals to 95% peak HR without monitoring",
      "No exercise until EF improves above 50%",
      "Heavy Valsalva weightlifting at maximal load",
    ],
    "Continuous moderate-intensity aerobic exercise at 40–70% peak HR with BP and symptom monitoring",
    `Stable HFrEF phase II cardiac rehab uses monitored moderate aerobic exercise at guideline intensities with symptom and hemodynamic monitoring — not maximal sprints or Valsalva lifting. Exercise is indicated despite reduced EF when clinically stable.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "heart failure cardiac rehabilitation",
      difficulty: 4,
      references: [APTA_CARDIOPULM],
      tags: ["CHF", "cardiac-rehab", ...PE],
      related: { keyTakeaway: "Stable HFrEF cardiac rehab: monitored moderate aerobic exercise 40–70% peak HR." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 58-year-old man 10 days post uncomplicated STEMI treated with PCI is in inpatient cardiac rehab. Resting HR 72/min, BP 124/76 mm Hg. MET level on prior treadmill test was 4.2. He asks when he can drive.`,
    "Which criterion is most appropriate before returning to driving?",
    [
      "Physician clearance based on functional capacity, symptom stability, and absence of distracting symptoms from medications",
      "Immediate driving day 2 post-PCI regardless of symptoms",
      "Permanent driving restriction after any MI",
      "Driving allowed only after running a marathon",
    ],
    "Physician clearance based on functional capacity, symptom stability, and absence of distracting symptoms from medications",
    `Post-MI driving return follows physician guidance considering functional capacity, symptom control, and medication effects — typically days to weeks for uncomplicated PCI when stable. Permanent restriction or immediate day-2 driving without assessment is inappropriate.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "post-MI activity guidelines",
      difficulty: 3,
      tags: ["MI", "activity-guidelines", ...PE],
      related: { keyTakeaway: "Post-MI driving: MD clearance based on capacity, symptoms, medications." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 45-year-old woman post CABG ×3 (day 5) reports sternal pain 4/10 with coughing. Sternotomy incision well approximated without drainage. HR 88/min, BP 118/72 mm Hg. Surgeon cleared incentive spirometry and ambulation with sternal precautions.`,
    "Which activity is most appropriate?",
    [
      "Supported coughing and huffing with splinting, incentive spirometry to 750 mL goal, and progressive ambulation",
      "Avoid all upper extremity movement for 8 weeks",
      "Bench press 50 lb to strengthen chest",
      "Complete bed rest without spirometry",
    ],
    "Supported coughing and huffing with splinting, incentive spirometry to 750 mL goal, and progressive ambulation",
    `Early post-CABG care includes splinted coughing, IS, and progressive ambulation with sternal precautions — not complete UE immobilization or heavy lifting. Bed rest without pulmonary hygiene increases atelectasis risk.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "post-CABG early mobilization",
      difficulty: 3,
      tags: ["CABG", "post-op", ...PE],
      related: { keyTakeaway: "Post-CABG early: splinted cough + IS + ambulation with sternal precautions." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 66-year-old man with COPD on 2 L/min nasal cannula at rest has SpO₂ 90% at rest and 84% during treadmill at 2 mph. HR rises from 82 to 112/min. RR increases from 18 to 28/min. He reports moderate dyspnea (Borg 4).`,
    "Which action is most appropriate during exercise?",
    [
      "Continue at current intensity because desaturation is expected in all COPD patients",
      "Reduce intensity, consider supplemental O₂ titration per physician protocol, and monitor SpO₂ maintaining ≥88–90%",
      "Stop all exercise permanently when SpO₂ drops below 95%",
      "Increase speed to 4 mph to improve conditioning faster",
    ],
    "Reduce intensity, consider supplemental O₂ titration per physician protocol, and monitor SpO₂ maintaining ≥88–90%",
    `Exertional desaturation in COPD requires intensity adjustment and O₂ titration per protocol targeting SpO₂ ≥88–90% during activity — not ignoring desaturation or permanent exercise cessation at any drop below 95%. Increasing speed worsens hypoxemia.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "oxygen titration during exercise",
      difficulty: 4,
      tags: ["COPD", "oxygen", "exercise", ...PE],
      related: { keyTakeaway: "COPD exercise desaturation: reduce intensity + titrate O₂ to SpO₂ ≥88–90%." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 52-year-old woman with asthma reports exercise-induced bronchospasm. Pre-exercise FEV₁ is 88% predicted. After 6 minutes on treadmill, FEV₁ drops to 72% with wheezing. SpO₂ remains 95%. She uses albuterol PRN.`,
    "Which recommendation is most appropriate before aerobic exercise?",
    [
      "Pre-treatment with short-acting bronchodilator per physician plan and warm-up before higher intensity",
      "Avoid all physical activity permanently",
      "Exercise only in cold dry air to challenge lungs",
      "Use only high-intensity exercise without bronchodilator",
    ],
    "Pre-treatment with short-acting bronchodilator per physician plan and warm-up before higher intensity",
    `Exercise-induced bronchospasm is managed with pre-exercise bronchodilator (when prescribed), gradual warm-up, and monitored progression — not permanent activity avoidance or cold dry air exposure that triggers bronchospasm.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "exercise-induced bronchospasm",
      difficulty: 3,
      tags: ["asthma", "EIB", ...PE],
      related: { keyTakeaway: "EIB: pre-exercise bronchodilator + gradual warm-up before intensity." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 74-year-old man with idiopathic pulmonary fibrosis has SpO₂ 91% at rest on 2 L O₂, Borg dyspnea 5/10 after 200 m ambulation. DLCO is 38% predicted. He is referred for pulmonary rehab.`,
    "Which training approach is most appropriate?",
    [
      "Low-intensity interval or continuous aerobic training with O₂ and Borg monitoring, plus energy conservation",
      "Maximal high-intensity training to 95% peak HR regardless of symptoms",
      "No activity because DLCO is reduced",
      "Only inspiratory muscle training without any ambulation",
    ],
    "Low-intensity interval or continuous aerobic training with O₂ and Borg monitoring, plus energy conservation",
    `IPF pulmonary rehab uses carefully monitored low-to-moderate intensity aerobic training with O₂ and dyspnea monitoring plus energy conservation — not maximal training ignoring symptoms or complete inactivity.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "pulmonary fibrosis rehabilitation",
      difficulty: 4,
      tags: ["IPF", "pulmonary-rehab", ...PE],
      related: { keyTakeaway: "IPF rehab: monitored low-moderate aerobic training + energy conservation." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 48-year-old woman 6 weeks post pulmonary embolism on rivaroxaban has dyspnea on exertion. SpO₂ 95% at rest, 93% after 3-minute step test. HR 76/min rest, 108/min post step. D-dimer normalized. Echo shows RV function normalized.`,
    "Which exercise progression is most appropriate?",
    [
      "Gradual aerobic conditioning with symptom monitoring per physician clearance on anticoagulation",
      "Immediate competitive marathon training",
      "Complete bed rest for 6 months",
      "Stop anticoagulation before any walking",
    ],
    "Gradual aerobic conditioning with symptom monitoring per physician clearance on anticoagulation",
    `Post-PE recovery includes gradual reconditioning when medically cleared while continuing anticoagulation — not bed rest for months or stopping anticoagulation for walking. High-intensity competition requires individual clearance.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "post-pulmonary embolism rehabilitation",
      difficulty: 3,
      tags: ["PE", "anticoagulation", ...PE],
      related: { keyTakeaway: "Post-PE: gradual reconditioning when cleared; continue anticoagulation." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 55-year-old man with cystic fibrosis has productive cough with thick secretions. FEV₁ 55% predicted. Postural drainage and percussion are planned. SpO₂ 94% at rest. HR 82/min.`,
    "Which airway clearance technique is most appropriate?",
    [
      "Active cycle of breathing technique (ACBT) with huffing and autogenic drainage as tolerated",
      "High-frequency chest wall oscillation only without patient active breathing",
      "Avoid all airway clearance to prevent coughing",
      "Perform percussion only in Trendelenburg without monitoring",
    ],
    "Active cycle of breathing technique (ACBT) with huffing and autogenic drainage as tolerated",
    `CF airway clearance combines active breathing techniques (ACBT, autogenic drainage) with adjuncts as prescribed — patient-active huffing mobilizes secretions. Avoiding clearance worsens obstruction. Percussion-only passive approaches are incomplete.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "cystic fibrosis airway clearance",
      difficulty: 4,
      tags: ["CF", "airway-clearance", ...PE],
      related: { keyTakeaway: "CF airway clearance: ACBT/autogenic drainage + adjuncts as prescribed." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 68-year-old woman with pacemaker (demand mode) in cardiac rehab has resting HR 62/min. During exercise HR rises to 98/min without symptoms. BP 128/74 mm Hg. Pacemaker lower rate set at 60/min.`,
    "Which exercise monitoring principle is most appropriate?",
    [
      "Use RPE and symptoms alongside HR, recognizing pacemaker may limit HR response",
      "Ignore RPE because pacemaker controls all cardiovascular response",
      "Stop exercise whenever HR exceeds 62/min",
      "No monitoring needed with pacemaker",
    ],
    "Use RPE and symptoms alongside HR, recognizing pacemaker may limit HR response",
    `Pacemaker patients may have blunted HR response — RPE, BP, and symptoms guide intensity alongside HR. Stopping at 62/min is inappropriate. Ignoring symptoms assumes normal chronotropic response.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "pacemaker exercise monitoring",
      difficulty: 3,
      tags: ["pacemaker", "cardiac-rehab", ...PE],
      related: { keyTakeaway: "Pacemaker exercise: use RPE + symptoms; HR response may be blunted." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 59-year-old man post valve replacement (mechanical aortic, day 7) on warfarin (INR 2.5) is learning sternal precautions. Surgeon cleared walking and breathing exercises. He reports fatigue walking 150 m, HR 92/min, BP 116/70 mm Hg.`,
    "Which precaution is most important during rehab?",
    [
      "Avoid Valsalva and heavy lifting; monitor anticoagulation-related bleeding with fall precautions",
      "No walking until INR is below 1.5",
      "Immediate return to contact sports",
      "Ignore sternal precautions after day 3",
    ],
    "Avoid Valsalva and heavy lifting; monitor anticoagulation-related bleeding with fall precautions",
    `Post mechanical valve rehab requires sternal precautions, avoiding Valsalva/heavy lifting, and fall precautions on anticoagulation — not contact sports or ignoring precautions. Walking is typically encouraged when cleared.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "post-valve surgery rehabilitation",
      difficulty: 4,
      tags: ["valve-replacement", "anticoagulation", ...PE],
      related: { keyTakeaway: "Post valve surgery: sternal precautions + avoid Valsalva + fall precautions on warfarin." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 43-year-old woman with ARDS recovered and is weaning from supplemental O₂. Room air SpO₂ 92%, RR 20/min. Six-minute walk distance is 320 m with Borg 3/10. She has proximal weakness after ICU stay (MRC sum score 48/60).`,
    "Which intervention priority addresses post-ICU syndrome?",
    [
      "Combined aerobic reconditioning and progressive resistance training for ICU-acquired weakness",
      "Only ankle pumps without any walking",
      "High-intensity weightlifting to failure on day 1",
      "Permanent ventilator dependence assumed without trial",
    ],
    "Combined aerobic reconditioning and progressive resistance training for ICU-acquired weakness",
    `Post-ICU syndrome with deconditioning and ICU-AW requires combined aerobic and resistance reconditioning — not isolated ankle pumps or maximal day-1 lifting. O₂ weaning continues alongside functional training.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "post-ICU deconditioning",
      difficulty: 4,
      tags: ["ICU", "ICU-AW", "deconditioning", ...PE],
      related: { keyTakeaway: "Post-ICU syndrome: aerobic + resistance reconditioning for ICU-AW." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 77-year-old man with peripheral arterial disease (ABI 0.62 right, 0.58 left) reports claudication after 80 m. Ankle pressures drop 40 mm Hg post exercise. He is on antiplatelet therapy and statin.`,
    "Which exercise prescription is evidence-based for claudication?",
    [
      "Supervised treadmill walking to near-maximal claudication pain, rest, repeat (3–5 days/week)",
      "Complete non-weight-bearing to avoid any leg pain",
      "Sprint intervals until severe pain 9/10 then stop permanently",
      "Only upper extremity ergometry without any leg walking",
    ],
    "Supervised treadmill walking to near-maximal claudication pain, rest, repeat (3–5 days/week)",
    `Intermittent claudication rehabilitation uses supervised treadmill walking to near-maximal claudication with rest intervals — improves walking tolerance. Avoiding all walking or unsupervised sprinting to severe pain without structure is inferior.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "intermittent claudication",
      difficulty: 4,
      tags: ["PAD", "claudication", ...PE],
      related: { keyTakeaway: "Claudication: supervised treadmill to near-max pain, rest, repeat." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 36-year-old woman post COVID-19 pneumonia (8 weeks ago) reports persistent dyspnea and fatigue. SpO₂ 96% at rest, 94% after 6MWT. DLCO mildly reduced. CXR cleared. HR response normal. She fails to return to prior job as postal carrier.`,
    "Which approach is most appropriate for post-COVID deconditioning?",
    [
      "Graded activity pacing, symptom-limited aerobic progression, and monitoring for red flags (chest pain, severe desaturation)",
      "Immediate return to full work hours without conditioning",
      "Permanent disability without rehabilitation trial",
      "High-intensity training ignoring all symptoms",
    ],
    "Graded activity pacing, symptom-limited aerobic progression, and monitoring for red flags (chest pain, severe desaturation)",
    `Post-COVID deconditioning uses paced, symptom-limited progressive activity with red flag monitoring — not immediate full return or ignoring symptoms. Rehab trial precedes permanent disability determination.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "post-COVID pulmonary rehabilitation",
      difficulty: 3,
      tags: ["post-COVID", "deconditioning", ...PE],
      related: { keyTakeaway: "Post-COVID deconditioning: paced symptom-limited progression + red flag monitoring." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 65-year-old man on mechanical ventilation in ICU (FiO₂ 40%, PEEP 8 cm H₂O) has RSBI of 65 (f/VT). MIP −35 cm H₂O. He is alert and following commands. Physician plans spontaneous breathing trial.`,
    "Which PT intervention supports ventilator weaning?",
    [
      "Early mobilization when hemodynamically stable, secretion management, and progressive sitting/standing tolerance",
      "Complete bed rest until extubation",
      "Maximal lower extremity resistance before any breathing trial",
      "No PT until fully weaned from ventilator for 2 weeks",
    ],
    "Early mobilization when hemodynamically stable, secretion management, and progressive sitting/standing tolerance",
    `ICU ventilator weaning is supported by early mobilization, secretion clearance, and progressive upright tolerance when stable — not bed rest until extubation. RSBI and MIP guide weaning; PT complements medical management.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "ventilator weaning mobilization",
      difficulty: 5,
      tags: ["ventilator", "ICU", "weaning", ...PE],
      related: { keyTakeaway: "Ventilator weaning: early mobilization + secretion management when stable." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 54-year-old woman with hypertension (BP 148/92 mm Hg on medication) begins cardiac risk reduction exercise program. Resting HR 78/min. No cardiac history. Physician cleared moderate exercise.`,
    "Which intensity guideline is most appropriate for initial aerobic training?",
    [
      "40–59% VO₂ reserve or moderate RPE 11–13 with gradual progression",
      "Maximal effort to 100% HR reserve on first session",
      "No exercise because BP is elevated on medication",
      "Only static stretching without aerobic component",
    ],
    "40–59% VO₂ reserve or moderate RPE 11–13 with gradual progression",
    `Primary prevention cardiac exercise starts at moderate intensity (40–59% VO₂R or RPE 11–13) with progression when cleared — not maximal first session. Controlled hypertension on medication is not a contraindication to moderate exercise.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "hypertension exercise prescription",
      difficulty: 3,
      tags: ["hypertension", "exercise-prescription", ...PE],
      related: { keyTakeaway: "Hypertension exercise: moderate intensity 40–59% VO₂R, gradual progression." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 71-year-old man with COPD uses pursed-lip breathing during exertion. RR decreases from 32 to 24/min and SpO₂ improves from 87% to 90% during walking when he uses the technique.`,
    "Which explanation best describes the mechanism of pursed-lip breathing?",
    [
      "Prolongs exhalation, reduces air trapping, and improves gas exchange",
      "Increases inspiratory flow rate and hyperventilation",
      "Eliminates need for bronchodilators permanently",
      "Raises blood pressure through Valsalva",
    ],
    "Prolongs exhalation, reduces air trapping, and improves gas exchange",
    `Pursed-lip breathing prolongs exhalation, reduces dynamic hyperinflation, and can improve SpO₂ — it does not replace bronchodilators or primarily work via Valsalva/hyperventilation.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "pursed-lip breathing",
      difficulty: 3,
      tags: ["COPD", "breathing-retraining", ...PE],
      related: { keyTakeaway: "Pursed-lip breathing: prolongs exhalation, reduces air trapping." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 49-year-old man s/p lung transplantation (3 months) has FEV₁ 72% of personal best. Immunosuppression includes tacrolimus. HR max during exercise limited to 85% predicted due to denervated heart. SpO₂ 95% on room air.`,
    "Which exercise consideration is most important?",
    [
      "RPE-based monitoring due to blunted HR response from cardiac denervation",
      "Standard age-predicted max HR formula without modification",
      "Avoid all exercise due to immunosuppression",
      "High-intensity contact sports immediately",
    ],
    "RPE-based monitoring due to blunted HR response from cardiac denervation",
    `Lung transplant recipients often have cardiac denervation — RPE and prescribed HR limits guide intensity, not standard max HR formulas alone. Exercise is encouraged when cleared; contact sports require individual guidance.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "lung transplant rehabilitation",
      difficulty: 5,
      tags: ["lung-transplant", "cardiac-denervation", ...PE],
      related: { keyTakeaway: "Lung transplant exercise: RPE-based monitoring; denervated heart blunts HR." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 60-year-old woman with obstructive sleep apnea on CPAP reports daytime fatigue affecting rehab participation. AHI on CPAP download is 2 events/hour. Epworth Sleepiness Scale improved from 14 to 7 with CPAP use 6 hours/night.`,
    "Which recommendation supports cardiopulmonary rehab adherence?",
    [
      "Encourage consistent CPAP use and schedule rehab sessions when alertness is optimal",
      "Discontinue CPAP during exercise to improve breathing",
      "Avoid all exercise because of OSA history",
      "Ignore sleep status in exercise planning",
    ],
    "Encourage consistent CPAP use and schedule rehab sessions when alertness is optimal",
    `Treated OSA with good CPAP adherence supports rehab participation — schedule sessions when alert and reinforce CPAP. Discontinuing CPAP or ignoring sleep undermines recovery and safety.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "OSA and rehabilitation",
      difficulty: 3,
      tags: ["OSA", "CPAP", ...PE],
      related: { keyTakeaway: "Treated OSA: reinforce CPAP + schedule rehab when alert." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 56-year-old man with pleural effusion s/p thoracentesis (500 mL removed) reports improved dyspnea. SpO₂ improved from 89% to 94%. RR 18/min. Physician cleared ambulation same day with monitoring.`,
    "Which monitoring is most important during first ambulation post-thoracentesis?",
    [
      "SpO₂, RR, dyspnea, and signs of re-expansion pulmonary edema or pneumothorax",
      "Only ankle ROM",
      "No monitoring because effusion was removed",
      "Blood glucose only",
    ],
    "SpO₂, RR, dyspnea, and signs of re-expansion pulmonary edema or pneumothorax",
    `Post-thoracentesis ambulation requires respiratory monitoring for hypoxemia, pneumothorax, or re-expansion pulmonary edema — not assuming safety without monitoring.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "examination",
      blueprintTopic: "post-thoracentesis monitoring",
      difficulty: 4,
      tags: ["pleural-effusion", "monitoring", ...PE],
      related: { keyTakeaway: "Post-thoracentesis ambulation: monitor SpO₂, RR, dyspnea, complications." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 63-year-old woman with stable angina (Canadian Class II) achieves 7 METs on exercise stress test without ischemic ECG changes on current medications. BP response normal. She wants to start a walking program.`,
    "Which activity level is most appropriate?",
    [
      "Regular moderate walking 30 minutes most days, staying below symptom threshold and using nitroglycerin PRN per physician plan",
      "Competitive powerlifting only",
      "Complete activity restriction despite 7 MET capacity",
      "Sprint training daily to maximal angina pain",
    ],
    "Regular moderate walking 30 minutes most days, staying below symptom threshold and using nitroglycerin PRN per physician plan",
    `Stable angina Class II with adequate stress test capacity supports regular moderate aerobic activity below symptom threshold with PRN nitroglycerin per plan — not complete restriction or training to angina.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "stable angina exercise",
      difficulty: 3,
      tags: ["angina", "exercise", ...PE],
      related: { keyTakeaway: "Stable angina: moderate aerobic activity below symptom threshold." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 42-year-old man with hypertrophic cardiomyopathy (physician cleared low-moderate activity) asks about resistance training. Resting HR 68/min, BP 118/76 mm Hg. No history of syncope. Echo shows LVOT gradient 30 mm Hg at rest.`,
    "Which resistance training guideline is most appropriate?",
    [
      "Low-to-moderate load, avoid Valsalva and maximal lifts, emphasize controlled breathing",
      "Maximal 1-repetition maximum bench press weekly",
      "No resistance exercise ever with HCM",
      "Heavy isometric leg press with breath holding",
    ],
    "Low-to-moderate load, avoid Valsalva and maximal lifts, emphasize controlled breathing",
    `HCM resistance training when cleared uses low-moderate loads, avoids Valsalva/maximal lifts that increase LVOT gradient — not 1RM testing or heavy isometrics with breath holding.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "hypertrophic cardiomyopathy exercise",
      difficulty: 5,
      tags: ["HCM", "exercise-precautions", ...PE],
      related: { keyTakeaway: "HCM resistance training: low-moderate load, avoid Valsalva/maximal lifts." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 75-year-old woman hospitalized for acute COPD exacerbation is day 3 on steroids and antibiotics. SpO₂ 93% on 1 L O₂, RR 22/min. She walks 20 m with rolling walker and moderate assist, Borg 5/10.`,
    "Which inpatient PT goal is most appropriate before discharge?",
    [
      "Progress ambulation tolerance, teach energy conservation and breathing techniques, and assess home O₂ needs",
      "Train for marathon within hospital stay",
      "Bed rest until FEV₁ normalizes",
      "Discharge without any mobility assessment",
    ],
    "Progress ambulation tolerance, teach energy conservation and breathing techniques, and assess home O₂ needs",
    `Inpatient COPD exacerbation PT focuses on safe mobility progression, self-management strategies, and discharge planning including O₂ — not bed rest or discharge without mobility assessment.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "COPD exacerbation inpatient PT",
      difficulty: 3,
      tags: ["COPD", "exacerbation", "inpatient", ...PE],
      related: { keyTakeaway: "COPD exacerbation inpatient: ambulation + breathing strategies + O₂ planning." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 50-year-old firefighter post mild myocarditis (resolved per cardiology) returns to work evaluation. Resting ECG normalized. Stress test negative for ischemia. LV function normal (EF 58%). He is deconditioned after 8 weeks off work.`,
    "Which return-to-work progression is most appropriate?",
    [
      "Graduated exercise testing and job-specific conditioning simulating work demands with cardiology clearance milestones",
      "Immediate return to full structural firefighting without conditioning",
      "Permanent job change without functional testing",
      "No exercise until 2 years post-illness",
    ],
    "Graduated exercise testing and job-specific conditioning simulating work demands with cardiology clearance milestones",
    `Return to demanding work after myocarditis requires graduated functional conditioning and cardiology clearance at milestones — not immediate full duty or indefinite restriction without assessment.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "return to work cardiac",
      difficulty: 4,
      tags: ["myocarditis", "return-to-work", ...PE],
      related: { keyTakeaway: "Post-myocarditis return to work: graduated job-specific conditioning + MD clearance." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 67-year-old man with bilateral knee OA and COPD (FEV₁ 48%) completes 6MWT: distance 310 m, SpO₂ nadir 86%, Borg 6/10. Knee pain 5/10 limited pace.`,
    "Which factor most limits his walk distance?",
    [
      "Requires integrated assessment — both pulmonary desaturation and musculoskeletal pain contribute; address both in plan",
      "Only knee OA because COPD is mild",
      "Only COPD because knee pain is irrelevant",
      "Neither factor; patient is malingering",
    ],
    "Requires integrated assessment — both pulmonary desaturation and musculoskeletal pain contribute; address both in plan",
    `Multi-morbidity requires identifying all limiting factors — here both COPD desaturation (SpO₂ 86%) and knee pain contribute to reduced 6MWD. Attributing limitation to one system alone misses treatable contributors.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "multi-morbidity assessment",
      difficulty: 4,
      tags: ["COPD", "comorbidity", "6MWT", ...PE],
      related: { keyTakeaway: "Multi-morbidity 6MWT: assess pulmonary AND MSK contributors." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 44-year-old woman with primary pulmonary hypertension on sildenafil has resting SpO₂ 94%, HR 88/min. BP 102/68 mm Hg. Physician cleared low-intensity supervised exercise. She reports dizziness if she bends quickly.`,
    "Which exercise modification is most important?",
    [
      "Avoid rapid postural changes, use graded upright progression, and monitor BP/SpO₂/symptoms",
      "High-intensity interval training to maximal dyspnea",
      "Complete bed rest indefinitely",
      "Hot yoga in heated room to 105°F",
    ],
    "Avoid rapid postural changes, use graded upright progression, and monitor BP/SpO₂/symptoms",
    `Pulmonary hypertension exercise uses low-intensity supervised activity with orthostatic precautions and monitoring — not high-intensity training, bed rest, or heated environments that stress cardiovascular system.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "pulmonary hypertension exercise",
      difficulty: 5,
      tags: ["pulmonary-hypertension", "exercise-precautions", ...PE],
      related: { keyTakeaway: "Pulmonary HTN exercise: low intensity, orthostatic precautions, close monitoring." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 72-year-old man post lobectomy (right upper, 2 weeks) reports incision pain 3/10. SpO₂ 95% room air. Surgeon cleared upper extremity ROM below 90° flexion on operative side and walking program. He guards operative arm during gait.`,
    "Which intervention is most appropriate?",
    [
      "Scapular mobilization within precautions, supported arm during ambulation, and progressive shoulder ROM per protocol",
      "Immediate overhead press with 15 lb on operative side",
      "No arm movement for 12 weeks",
      "Ignore operative side during all activity",
    ],
    "Scapular mobilization within precautions, supported arm during ambulation, and progressive shoulder ROM per protocol",
    `Post-lobectomy rehab includes scapular mobility and progressive UE ROM within surgeon precautions plus supported ambulation — not heavy lifting or complete immobilization.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "post-lobectomy rehabilitation",
      difficulty: 3,
      tags: ["lobectomy", "post-op", ...PE],
      related: { keyTakeaway: "Post-lobectomy: scapular/shoulder ROM within precautions + supported ambulation." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 38-year-old woman with exercise-induced arterial hypoxemia (SpO₂ drops to 88% at peak exercise, normal at rest) is otherwise healthy. Physician prescribed supplemental O₂ during high-intensity training only.`,
    "Which monitoring approach is most appropriate during training?",
    [
      "Continuous pulse oximetry during sessions with O₂ per prescription at higher intensities",
      "No SpO₂ monitoring because rest values are normal",
      "Avoid all exercise permanently",
      "Train only at altitude above 8000 ft without O₂",
    ],
    "Continuous pulse oximetry during sessions with O₂ per prescription at higher intensities",
    `Exercise-induced hypoxemia requires exertional SpO₂ monitoring and supplemental O₂ as prescribed — rest SpO₂ does not reflect exercise response.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "examination",
      blueprintTopic: "exercise-induced hypoxemia",
      difficulty: 4,
      tags: ["hypoxemia", "exercise-monitoring", ...PE],
      related: { keyTakeaway: "Exercise-induced hypoxemia: monitor SpO₂ during exertion, O₂ as prescribed." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 61-year-old man in outpatient cardiac rehab reports chest pressure 6/10 during treadmill at 3.5 mph. HR 102/min, BP 138/82 mm Hg. Symptoms resolve within 2 minutes of stopping. He had CABG 8 weeks ago.`,
    "Which action is most appropriate?",
    [
      "Stop exercise, notify cardiac rehab staff/physician per protocol, and document symptoms",
      "Increase speed to 5 mph to work through discomfort",
      "Ignore symptoms because BP is normal",
      "Discharge from rehab without notification",
    ],
    "Stop exercise, notify cardiac rehab staff/physician per protocol, and document symptoms",
    `Chest pressure during cardiac rehab requires stopping exercise and protocol-based notification — not pushing through or ignoring because BP appears normal. Documentation supports medical follow-up.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "cardiac rehab symptom response",
      difficulty: 4,
      tags: ["cardiac-rehab", "chest-pain", "safety", ...PE],
      related: { keyTakeaway: "Chest pressure in cardiac rehab: stop, notify per protocol, document." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 53-year-old woman with bronchiectasis produces 30 mL sputum daily. FEV₁ 60% predicted. Postural drainage in side-lying with affected side up is planned. SpO₂ 95% at rest.`,
    "Which positioning rationale is correct for left lower lobe drainage?",
    [
      "Right side-lying with head down (Trendelenburg) targeting left lower lobe segments",
      "Supine flat only regardless of lobe",
      "Standing without any positioning for drainage",
      "Prone with head up 45° only for all lobes",
    ],
    "Right side-lying with head down (Trendelenburg) targeting left lower lobe segments",
    `Postural drainage positions place affected segments uppermost — left lower lobe typically drained in right side-lying with appropriate head elevation/Trendelenburg per segment. Flat supine or generic standing does not target specific lobes.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "bronchiectasis postural drainage",
      difficulty: 4,
      tags: ["bronchiectasis", "airway-clearance", ...PE],
      related: { keyTakeaway: "Postural drainage: position affected segment uppermost." },
    }
  ),

  nptePtVignette(
    "cardiovascular-pulmonary",
    `A 69-year-old man with atrial fibrillation (rate controlled on metoprolol) in cardiac rehab has irregular HR 78–92/min during exercise. BP stable. No anticoagulation held for exercise. He reports no palpitations.`,
    "Which monitoring approach is most appropriate?",
    [
      "Use RPE and BP primarily; note irregular HR pattern; follow anticoagulation and fall precautions per medical plan",
      "Stop exercise whenever HR is irregular",
      "Ignore anticoagulation status during balance activities",
      "Require HR to be perfectly regular before any activity",
    ],
    "Use RPE and BP primarily; note irregular HR pattern; follow anticoagulation and fall precautions per medical plan",
    `Controlled AF in cardiac rehab uses RPE/BP monitoring with awareness of irregular rhythm — irregular HR alone is not a stop criterion when rate-controlled. Anticoagulation fall precautions apply.`,
    {
      blueprintSystem: "cardiovascular-pulmonary",
      taskCategory: "interventions",
      blueprintTopic: "atrial fibrillation exercise",
      difficulty: 3,
      tags: ["atrial-fibrillation", "cardiac-rehab", ...PE],
      related: { keyTakeaway: "Rate-controlled AF in rehab: RPE/BP monitoring + anticoagulation fall precautions." },
    }
  ),
];
