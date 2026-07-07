import { buildNclexReviewModule } from "./nclex-module-builder";

export const DISASTER_TRIAGE_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Disaster and mass casualty triage items test START principles, resource allocation, and ethical triage categories — who gets treated first when demand exceeds capacity.",
  ],
  concepts: [
    "START triage: Immediate (red), Delayed (yellow), Minimal (green), Expectant (black), Dead (white/gray)",
    "Immediate: life-threatening but salvageable with rapid intervention — airway, major hemorrhage control",
    "Delayed: stable enough to wait hours — open fractures without bleeding, stable vitals",
    "Minimal: ambulatory 'walking wounded' — can self-direct to minor treatment",
    "Expectant: injuries incompatible with survival given resources — comfort measures if possible",
    "RPM tags: Respirations, Perfusion (cap refill/mental status), Motor (follow commands)",
    "Reverse triage for evacuations — move those who can survive transport first when infrastructure fails",
    "RN role: triage officer, resource coordination, not individual prolonged care during MCI",
  ],
  clinical: [
    "Explosion MCI: apneic adult → open airway maneuver once; if still apneic, expectant/black in START unless pediatric protocol differs",
    "Multiple casualties, one RN — tag and move, do not provide extended ICU care at scene",
    "Radiation MCI: decontamination before entry to treatment area when feasible",
    "Pandemic surge: allocate vents by ethical frameworks per institution — document",
  ],
  tables: [
    {
      caption: "START quick sort",
      headers: ["Tag", "Criteria pearl"],
      rows: [
        ["Red", "Needs immediate life save"],
        ["Yellow", "Serious, can delay"],
        ["Green", "Minor injuries"],
        ["Black", "Deceased or expectant"],
      ],
    },
  ],
  visual: ["START flowchart RPM", "Tag color wheel", "MCI scene zones: triage/treat/transport"],
  misconceptions: [
    "Treating closest patient first regardless of survivability",
    "Spending prolonged time on one expectant patient during MCI",
    "Moving contaminated patients into clean treatment zone without decon",
  ],
  pearls: [
    "Greatest good for greatest number — harsh but tested ethically",
    "Walking wounded tagged green can help logistics",
    "Document triage tag and time",
  ],
  summary: [
    "Use START RPM for rapid sort",
    "Red = immediate life threats salvageable",
    "Do not over-invest in one patient during MCI",
    "Know expectant category exists",
  ],
});

export const CRITICAL_LABS_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Critical lab value items bridge Reduction of Risk Potential and Physiological Adaptation — nurses must notify, repeat, and act on dangerous values without treating numbers in isolation.",
  ],
  concepts: [
    "Critical K⁺ high/low: ECG changes, hold contributing meds, replacement or kayexalate per order",
    "Critical Na⁺: mental status changes; correct chronic hyponatremia slowly",
    "Glucose <70 hypoglycemia; >400 with ketones suggests DKA/HHS workup",
    "Hgb critical low: transfuse symptomatic per order; assess bleeding",
    "INR critical high on warfarin: hold, assess bleeding, reversal per order",
    "Troponin elevated: ACS protocol, serial troponins, ECG",
    "WBC critical low (neutropenia): infection precautions, avoid rectal temps, report fever",
    "ABG: pH, PaCO₂, HCO₃⁻ — respiratory vs metabolic; compensate using clinical context",
  ],
  clinical: [
    "K⁺ 6.8 with peaked T waves — cardiac monitor, notify provider, emergency meds per protocol",
    "Na⁺ 118 chronic — slow correction; seizure precautions",
    "Troponin rising ×2 with chest pain — ACS pathway",
    "ANC 400 on chemo — neutropenic precautions, fever = emergency",
  ],
  tables: [
    {
      caption: "Lab + action pairs (institutional ranges vary)",
      headers: ["Lab", "Nursing action"],
      rows: [
        ["Critical K⁺", "ECG, hold K⁺ meds, notify, treat per order"],
        ["Critical Hgb", "Assess perfusion, transfuse per order"],
        ["Critical INR", "Hold warfarin, bleeding assessment"],
        ["Critical glucose low", "15-15 rule or D50 per order"],
      ],
    },
  ],
  visual: ["Critical lab call pathway", "ECG-K⁺ correlation strip", "ABG interpretation compass"],
  misconceptions: [
    "Treating asymptomatic critical value without assessing patient",
    "Rapid sodium correction in chronic hyponatremia",
    "Ignoring trending troponin because first value 'borderline'",
  ],
  pearls: [
    "Trend beats single value — compare prior results",
    "Always correlate lab with clinical picture",
    "Document notification and repeat lab per protocol",
  ],
  summary: [
    "Critical labs require notify + monitor + treat per order",
    "ECG with potassium always",
    "Trend troponin and glucose in acute presentations",
    "Neutropenic fever is emergency",
  ],
});

export const IMMUNIZATION_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Immunization items cover contraindications, live vs inactivated vaccines, pregnancy rules, and CDC schedule milestones — common in Health Promotion and Pediatrics.",
  ],
  concepts: [
    "Live attenuated vaccines (MMR, varicella, LAIV, rotavirus): contraindicated in pregnancy and severe immunocompromise",
    "Inactivated vaccines generally safe in immunocompromised (may have reduced response)",
    "Give influenza vaccine annually; egg allergy history — most can receive flu vaccine per current guidance",
    "HPV series adolescents; catch-up schedules through age 26 (guidelines evolve — know general principles)",
    "Storage and handling: cold chain; do not use expired vials",
    "Document lot number, site, VIS provided",
    "Report adverse events (anaphylaxis) — emergency kit epinephrine available at clinic",
    "Post-exposure prophylaxis timelines (hepatitis B, tetanus, rabies) are high-yield",
  ],
  clinical: [
    "Pregnant patient needs varicella immunity — do not give live vaccine; verify immunity, postpartum vaccinate if needed",
    "Immunocompromised child needs MMR — defer live vaccines; vaccinate household contacts when appropriate",
    "Needle stick HCW without Hep B immunity — HBIG + vaccine series per protocol",
    "Infant 2-month visit — DTaP, IPV, Hib, PCV13, rotavirus per schedule",
  ],
  tables: [
    {
      caption: "Live vs inactivated pearl",
      headers: ["Live attenuated examples", "Inactivated examples"],
      rows: [
        ["MMR, varicella, LAIV", "Tdap, IPV, flu shot (injected), Hep B"],
      ],
    },
  ],
  visual: ["CDC schedule age bands", "Live vaccine contraindication circle: pregnancy/immunocompromise"],
  misconceptions: [
    "Giving MMR in pregnancy",
    "Assuming all egg-allergic patients cannot receive flu vaccine",
    "Using live vaccines in active chemotherapy without specialist guidance",
  ],
  pearls: [
    "Tdap each pregnancy 27–36 weeks for pertussis immunity in newborn",
    "Rotavirus oral — handle spill as live virus",
    "Document education and consent",
  ],
  summary: [
    "No live vaccines in pregnancy or severe immunosuppression",
    "Know schedule milestones for infant series",
    "Post-exposure prophylaxis timelines matter",
    "Document lot, site, VIS",
  ],
});

export const GI_EMERGENCIES_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "GI emergencies — upper/lower GI bleed, pancreatitis, liver failure, bowel obstruction — test prioritization, NG tube management, and complication monitoring on NCLEX med-surg items.",
  ],
  concepts: [
    "Upper GI bleed: melena, hematemesis, hypotension — NPO, IV access, type & cross, PPI/octreotide per order, monitor Hgb",
    "Lower GI bleed: hematochezia — often less acute but monitor hemodynamics",
    "NG tube to low intermittent suction for obstruction or ileus per order — monitor electrolytes",
    "Acute pancreatitis: NPO, IV fluids, pain control, monitor glucose and calcium",
    "Hepatic encephalopathy: lactulose/rifaximin per order, safety, avoid sedatives, monitor mental status",
    "Ascites: paracentesis care, sodium/fluid restriction, daily weights",
    "Bowel obstruction: high-pitched bowel sounds early, absent later; strict NPO, NG decompression",
    "C. diff colitis: contact precautions — distinct from other GI bleeds",
  ],
  clinical: [
    "Coffee-ground emesis and BP 90/60 — NPO, IV fluids, notify provider, prepare for endoscopy",
    "Pancreatitis patient with decreasing calcium and rising glucose — monitor for complications",
    "Cirrhosis patient confused and asterixis — hepatic encephalopathy precautions, lactulose, fall safety",
    "NG tube output increasing with abdominal distension — obstruction vs ileus workup",
  ],
  tables: [
    {
      caption: "GI bleed nursing priorities",
      headers: ["Finding", "Action"],
      rows: [
        ["Hemodynamic instability", "IV access, fluids, monitor Hgb, notify"],
        ["Active hematemesis", "NPO, airway readiness, HOB elevated"],
        ["On anticoagulant", "Hold/reversal per order"],
      ],
    },
  ],
  visual: ["Upper vs lower GI bleed symptom fork", "Pancreatitis NPO + fluids pathway"],
  misconceptions: [
    "Feeding patient with suspected obstruction",
    "Sedating encephalopathic patient without airway plan",
    "Missing C. diff precautions in infectious diarrhea",
  ],
  pearls: [
    "Orthostatic vitals catch early GI blood loss",
    "Lactulose goal soft stools — not explosive diarrhea",
    "Melena = upper GI until proven otherwise",
  ],
  summary: [
    "GI bleed: hemodynamic support, NPO, monitor Hgb",
    "Pancreatitis: NPO, fluids, pain, glucose/calcium watch",
    "Encephalopathy: lactulose, safety, reduce ammonia triggers",
    "C. diff = contact precautions",
  ],
});

export const PRENATAL_LABOR_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Prenatal and intrapartum items cover fetal monitoring, preeclampsia screening, and labor progression — high-yield Health Promotion content paired with maternal-newborn emergencies.",
  ],
  concepts: [
    "Prenatal visits: fundal height, BP, urine protein, glucose screening, fetal heart tones",
    "Preeclampsia signs: BP elevation, proteinuria, headache, vision changes, RUQ pain, hyperreflexia/clonus",
    "FHR baseline 110–160; variability moderate; accelerations reassuring",
    "Early decelerations: head compression — usually benign",
    "Late decelerations: uteroplacental insufficiency — reposition, O₂, IV fluids, notify, possible delivery",
    "Variable decelerations: cord compression — position change, amnioinfusion per order",
    "Prolonged deceleration >2 min — emergency evaluation",
    "Labor stages: active pushing when fully dilated; monitor maternal fatigue and fetal status",
  ],
  clinical: [
    "32 weeks BP 152/96, headache — preeclampsia workup, notify provider, seizure precautions if severe",
    "FHR 90 with late decelerations — left lateral, O₂, IV fluids, notify provider, prepare for delivery",
    "Variable decels with nuchal cord suspected — maternal position, consider amnioinfusion per order",
    "ROM with green meconium — monitor FHR closely, notify provider",
  ],
  tables: [
    {
      caption: "FHR deceleration types",
      headers: ["Type", "Cause", "Action"],
      rows: [
        ["Early", "Head compression", "Monitor, continue labor if reassuring"],
        ["Late", "Uteroplacental insuff", "Reposition, O₂, notify, delivery readiness"],
        ["Variable", "Cord compression", "Position, fluid bolus/amnioinfusion per order"],
      ],
    },
  ],
  visual: ["FHR strip pattern examples", "Preeclampsia severe features checklist"],
  misconceptions: [
    "Ignoring late decelerations as 'normal'",
    "Ambulating patient with active heavy bleeding or non-reassuring FHR without monitoring",
    "Missing preeclampsia headache as tension headache",
  ],
  pearls: [
    "Category III FHR = ominous — immediate evaluation",
    "Magnesium for seizure prophylaxis in severe preeclampsia — monitor reflexes and RR",
    "Count fetal movement teaching in third trimester",
  ],
  summary: [
    "Know deceleration types and actions",
    "Preeclampsia severe features require escalation",
    "Baseline FHR 110–160 with moderate variability reassuring",
    "Late decels = uteroplacital insufficiency until proven otherwise",
  ],
});
