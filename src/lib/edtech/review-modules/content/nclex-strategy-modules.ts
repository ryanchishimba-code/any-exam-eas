import { buildNclexReviewModule } from "./nclex-module-builder";

export const PRIORITIZATION_WORKSHOP_MODULE = buildNclexReviewModule({
  why: [
    "Prioritization is the single highest-yield NCLEX skill — most vignettes present multiple correct nursing actions and ask which comes first. Passing on the first attempt requires automatic ABC framing, acuity sorting, and recognizing trap distractors that are therapeutic but not immediate.",
    "NCLEX rewards seeing the sickest patient first, assessing before intervening when safe, and choosing stabilization over teaching or documentation when they compete.",
  ],
  concepts: [
    "ABCs: airway → breathing → circulation before psychosocial or comfort needs in acute settings",
    "See first: new acute change, unstable vitals, active bleeding, SpO₂ <90%, altered mental status, chest pain with diaphoresis",
    "Assess vs act: assess first when safe; act immediately in obvious life threats (anaphylaxis, hemorrhage, complete airway obstruction)",
    "Maslow in acute care: physiologic needs before belonging/self-esteem interventions",
    "Actual problems before 'risk for' when acuity differs",
    "Trend over isolated value: urine output falling, neuro decline, pain escalation",
    "Cluster care without delaying emergencies — never defer ABC for routine tasks",
    "Assignment-style items: parse each room/client; score urgency; pick highest acuity system first",
  ],
  clinical: [
    "Four-room med-surg: post-op RR 8 on PCA morphine beats stable HF daily weight — opioid respiratory depression is ABC",
    "ED triage: stridor/anaphylaxis before stable psych admission with contract for safety",
    "L&D: severe preeclampsia with clonus before routine postpartum teaching",
    "Pediatric ED: retractions + SpO₂ 88% before school-age well-child vaccine counseling",
    "When every option is an assessment, choose the assessment addressing highest acuity",
    "When every option is an intervention, choose the one that stabilizes ABC first",
    "Transfusion reaction: stop transfusion first — then notify provider and maintain IV line",
    "UGIB: hemodynamic assessment and IV access before diet teaching",
  ],
  tables: [
    {
      caption: "See first — acuity ladder",
      headers: ["Priority", "Findings", "Why first"],
      rows: [
        ["1 — Airway", "Stridor, complete obstruction, anaphylaxis", "Minutes to death"],
        ["2 — Breathing", "SpO₂ <90%, RR extremes, silent chest", "Respiratory failure"],
        ["3 — Circulation", "Active hemorrhage, SBP <90, HR >120 with hypotension", "Shock"],
        ["4 — Neuro", "New confusion, seizure, GCS drop", "Brain threat / secondary ABC risk"],
        ["5 — Stable chronic", "Routine meds, teaching, scheduling", "Important but not first"],
      ],
    },
  ],
  visual: [
    "ABC pyramid with examples at each tier",
    "Assignment vignette parser: underline vitals + new changes per room → rank → pick highest",
    "Assess vs act fork: life threat visible? → act; unclear but stable? → assess",
    "Trap label: 'correct eventually, wrong for FIRST action'",
  ],
  misconceptions: [
    "Choosing psychosocial support before physiologic instability",
    "Picking documentation or teaching when another client is actively decompensating",
    "Selecting a correct intervention that is second priority after a more urgent ABC issue",
    "Assuming all assessments are equal — rank by acuity system affected",
    "Deferring emergency treatment to complete wellness screening",
  ],
  pearls: [
    "NCLEX keyword: FIRST, INITIAL, PRIORITY, IMMEDIATE → ABC + acuity sort",
    "Two clients both 'sick'? Circulation/active bleeding usually beats stable hypoxemia without shock",
    "New confusion in older adult = treat as acute until proven otherwise",
    "If distractors mention flu vaccine, colonoscopy, or eye exam on acute vignette — elimination trap",
  ],
  summary: [
    "Sort by ABC and acuity before anything else",
    "See the patient with imminent physiologic threat first",
    "Assess when safe; act immediately in obvious emergencies",
    "Trap answers are often correct nursing actions at the wrong time",
    "Parse assignment rooms systematically — don't skim",
  ],
});

export const MATERNAL_NEWBORN_MODULE = buildNclexReviewModule({
  why: [
    "Maternal-newborn items combine high acuity (hemorrhage, preeclampsia, fetal distress) with nuanced normal findings. First-attempt passers know FHR patterns, postpartum red flags, and when to escalate before comfort measures.",
  ],
  concepts: [
    "Postpartum hemorrhage: boggy fundus, heavy bleeding, tachycardia, hypotension — massage fundus, oxytocin, IV access, notify provider",
    "Preeclampsia severe features: BP ≥160/110, headache, vision changes, RUQ pain, clonus, low platelets — magnesium, delivery planning, seizure precautions",
    "Eclampsia: magnesium sulfate first-line; airway and seizure safety",
    "FHR categories: Category I reassuring; Category II indeterminate — continue monitoring; Category III ominous — immediate evaluation",
    "Late decelerations: uteroplacental insufficiency — reposition, O₂, IV fluids, notify provider",
    "Variable decelerations: cord compression — maternal position change, amnioinfusion per order",
    "Newborn transition: warmth, dry, stimulate, APGAR; priority is airway and temperature",
    "Rh incompatibility: RhIg (RhoGAM) timing for Rh-negative mother",
  ],
  clinical: [
    "Fundus above umbilicus and deviated — bladder distention vs hemorrhage; assess and empty bladder, massage fundus",
    "Postpartum day 1 fever with foul lochia — endometritis workup; cultures, antibiotics",
    "Magnesium toxicity: absent reflexes, respiratory depression — stop mag, calcium gluconate ready",
    "Labor patient with epidural — monitor BP and fetal heart rate closely",
    "Newborn with retractions and grunting — respiratory distress; warmth and notify NICU/pediatrics",
    "Breastfeeding jaundice vs breast milk jaundice timing and management differ",
  ],
  tables: [
    {
      caption: "FHR pattern quick reference",
      headers: ["Pattern", "Meaning", "Action"],
      rows: [
        ["Category I", "Reassuring baseline + variability", "Continue routine monitoring"],
        ["Late decels", "Uteroplacental insufficiency", "Left lateral, O₂, fluids, notify"],
        ["Variables", "Cord compression", "Reposition, amnioinfusion per protocol"],
        ["Prolonged brady", "Hypoxia until proven otherwise", "Immediate bedside evaluation"],
      ],
    },
  ],
  visual: [
    "Postpartum fundus height chart by day",
    "FHR strip labeling: baseline, variability, decels",
    "Preeclampsia severe-feature checklist",
    "Magnesium toxicity monitoring ladder",
  ],
  misconceptions: [
    "Massaging a firm fundus when bleeding continues — investigate uterine atony vs laceration",
    "Delaying provider notification for Category III tracing",
    "Giving magnesium without seizure and respiratory monitoring plan",
    "Treating all jaundice the same in newborn period",
  ],
  pearls: [
    "PPH pearl: 'Boggy + bleeding + tachycardia' → fundus first, then meds and fluids",
    "Preeclampsia pearl: 'Clonus or vision changes' → magnesium territory",
    "FHR pearl: 'Late = placental; Variable = cord'",
    "Always pair maternal instability with fetal monitoring actions",
  ],
  summary: [
    "PPH and preeclampsia/eclampsia are top L&D emergencies",
    "Know FHR categories and deceleration types",
    "Magnesium requires reflexes, RR, urine output monitoring",
    "Newborn ABCs: warmth, airway, glucose when indicated",
  ],
});

export const PHARM_HIGH_ALERT_MODULE = buildNclexReviewModule({
  why: [
    "Pharmacological therapies are 13–19% of NCLEX. High-alert meds (insulin, heparin, opioids, electrolytes) and dosage calculations cause preventable errors — the exam tests rights of medication administration, antidote knowledge, and calculation safety.",
  ],
  concepts: [
    "Six rights: right patient, drug, dose, route, time, documentation — plus reason and response for high-alert meds",
    "Insulin: never delegate to UAP; verify blood glucose; know hypoglycemia treatment (15 g fast carb, recheck)",
    "Heparin vs enoxaparin: aPTT vs anti-Xa monitoring; bleeding reversal — protamine for heparin",
    "Warfarin: INR therapeutic range; bleeding signs; vitamin K for reversal; interact with many drugs",
    "Opioids: respiratory depression, naloxone, PCA monitoring (RR, sedation, pain balance)",
    "Digoxin toxicity: nausea, vision changes, arrhythmias; hold drug, check K⁺/Mg²⁺/dig level",
    "Potassium IV: never IV push; max rate per protocol; cardiac monitoring",
    "Dosage calc: desired/over have × quantity; weight-based mg/kg; mL/hr drip conversions",
  ],
  clinical: [
    "Patient on sliding-scale insulin — check glucose before dose; hold if hypoglycemic per protocol",
    "Heparin drip — aPTT out of range: hold and notify; no bolus without order",
    "Morphine PCA RR 6 — hold PCA, stimulate, naloxone if indicated, airway",
    "Digoxin + furosemide — hypokalemia increases toxicity risk; monitor K⁺",
    "Calculate mL/hr for IV drip given mg/mL and ordered mcg/kg/min",
    "Pediatric weight-based dose — double-check concentration and route",
  ],
  tables: [
    {
      caption: "High-alert meds — monitor & antidote",
      headers: ["Drug", "Monitor", "Red flag / antidote"],
      rows: [
        ["Insulin", "BG, signs of hypo/hyperglycemia", "Hypo: 15 g carb; severe: glucagon"],
        ["Heparin", "aPTT, bleeding", "Protamine sulfate"],
        ["Warfarin", "INR, bleeding", "Vitamin K, PCC if major bleed"],
        ["Opioids/PCA", "RR, sedation score", "Naloxone for respiratory depression"],
        ["Digoxin", "HR, K⁺, dig level", "Hold drug; digoxin Fab for severe toxicity"],
      ],
    },
  ],
  visual: [
    "Drip calculation formula strip",
    "Insulin syringe U-100 vs U-500 caution",
    "PCA monitoring flowsheet",
    "Rights of med admin checklist",
  ],
  misconceptions: [
    "Delegating insulin administration to UAP",
    "IV pushing potassium concentrate",
    "Assuming all heparin products use same lab monitoring",
    "Treating opioid sedation without assessing RR first",
  ],
  pearls: [
    "Calc pearl: label units at every step (mg vs mcg vs g)",
    "Insulin pearl: 'Check sugar before every dose'",
    "Opioid pearl: 'RR before refill'",
    "Warfarin pearl: 'INR + bleeding beats diet teaching'",
  ],
  summary: [
    "High-alert meds require extra verification and monitoring",
    "Know antidotes and hold parameters",
    "Master weight-based and drip calculations with unit discipline",
    "Never delegate insulin or unstable patient medication decisions",
  ],
});

export const PSYCH_THERAPEUTIC_MODULE = buildNclexReviewModule({
  why: [
    "Psychosocial integrity items test therapeutic communication, crisis intervention, and legal holds — not deep psychotherapy. First-attempt students win by recognizing boundaries, suicide risk protocols, and de-escalation before medication trivia.",
  ],
  concepts: [
    "Therapeutic techniques: open-ended questions, reflection, clarifying, summarizing — avoid giving advice, false reassurance, or why questions early",
    "Suicide risk: direct assessment (plan, means, intent); one-to-one observation; remove harmful items; never promise confidentiality when safety at risk",
    "Restraint/seclusion: least restrictive alternative first; provider order; face-to-face within 1 hour; debrief after",
    "Mania: limit stimulation, consistent limits, monitor sleep and nutrition, medication adherence",
    "Depression: assess suicide; encourage ADLs; watch for SSRI activation early in treatment",
    "Schizophrenia: therapeutic presence; don't argue with delusions; monitor for extrapyramidal effects",
    "Substance withdrawal: CIWA for alcohol; benzodiazepine protocol; seizure precautions",
    "Personality disorders: set clear limits; remain calm; avoid power struggles",
  ],
  clinical: [
    "Client states 'I want to die' — assess plan/intent/means; initiate suicide precautions per protocol",
    "Agitated client throwing objects — ensure staff safety, clear environment, offer PRN per order, document behavior",
    "Client on lithium — monitor level, thyroid, renal function; toxicity: coarse tremor, confusion, GI",
    "Anxiety attack — stay with client, short simple directions, slow breathing coaching",
    "Alcohol withdrawal tremors and HR 118 — CIWA score, benzodiazepine per protocol, seizure precautions",
  ],
  tables: [
    {
      caption: "Therapeutic vs non-therapeutic responses",
      headers: ["Situation", "Therapeutic", "Non-therapeutic"],
      rows: [
        ["Client angry at nurse", "Acknowledge feeling; explore trigger", "'Calm down'; 'You shouldn't feel that'"],
        ["Suicidal ideation", "Direct assessment; safety plan", "Promise secrecy; change subject"],
        ["Hallucination", "Acknowledge experience; reality orientation gently", "Argue with delusion"],
        ["Mania pressured speech", "Set limits on one topic at a time", "Lengthy reasoning debates"],
      ],
    },
  ],
  visual: [
    "Suicide assessment mnemonic: ideation → plan → means → intent",
    "De-escalation steps ladder",
    "Restraint documentation timeline",
  ],
  misconceptions: [
    "Promising confidentiality for active suicide plan",
    "Using restraints as first intervention for agitation",
    "Giving false reassurance ('Everything will be fine')",
    "Leaving suicidal client alone to 'respect privacy'",
  ],
  pearls: [
    "Best response often validates emotion then assesses safety",
    "Silence can be therapeutic — allow pauses",
    "Limit-setting is therapeutic in mania and borderline presentations",
    "Medication teaching comes after safety and rapport",
  ],
  summary: [
    "Safety and suicide assessment trump all other psych actions",
    "Use therapeutic communication techniques; avoid advice and false reassurance",
    "Restraints are last resort with strict documentation",
    "Know withdrawal monitoring basics (CIWA, seizures)",
  ],
});

export const FLUIDS_ELECTROLYTES_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Fluid, electrolyte, and acid-base disturbances appear across med-surg, renal, and critical care vignettes. NCLEX tests recognition patterns (K⁺, Na⁺, Ca²⁺, Mg²⁺) and safe nursing actions — not nephrology fellowship detail.",
  ],
  concepts: [
    "Hypokalemia: weak pulse, muscle weakness, U waves, ileus — replace K⁺ orally/IV per order; never IV push",
    "Hyperkalemia: peaked T waves, widened QRS — cardiac monitor; kayexalate, insulin/glucose, calcium gluconate per order",
    "Hyponatremia: confusion, seizures — correct slowly to avoid osmotic demyelination",
    "Hypernatremia: thirst, altered mental status — free water deficit; gradual correction",
    "Hypocalcemia: Chvostek/Trousseau, prolonged QT — calcium replacement; check albumin",
    "Hypermagnesemia: absent reflexes, respiratory depression — stop mag, calcium gluconate",
    "Third-spacing vs dehydration: hemoconcentration, hypotension, poor perfusion",
    "Acid-base: respiratory vs metabolic; compensation limits; clinical context drives priority",
  ],
  clinical: [
    "Post-op ileus with K⁺ 3.0 — monitor rhythm, replace potassium, hold digoxin if ordered until K⁺ corrected",
    "Dialysis patient missed session with K⁺ 6.2 — ECG, notify provider, prepare emergency meds",
    "Burn patient — fluid resuscitation formulas (Parkland) nursing monitoring: urine output goals",
    "SIADH: fluid restriction; hyponatremia management",
    "Diabetes DKA: fluid then insulin; watch K⁺ shifts during treatment",
  ],
  tables: [
    {
      caption: "Electrolyte red flags",
      headers: ["Electrolyte", "Low signs", "High signs"],
      rows: [
        ["K⁺", "Weakness, U waves, ileus", "Peaked T, arrhythmias"],
        ["Na⁺", "Confusion, seizures", "Agitation, neuro changes"],
        ["Ca²⁺", "Tetany, Chvostek", "Stones, bones, groans, moans"],
        ["Mg²⁺", "Tremor, arrhythmias", "Absent reflexes, resp depression"],
      ],
    },
  ],
  visual: [
    "ECG changes by K⁺ level strip",
    "Fluid balance diagram: intake/output/third spacing",
    "Acid-base compass (respiratory vs metabolic)",
  ],
  misconceptions: [
    "Rapidly correcting chronic hyponatremia",
    "IV push potassium",
    "Ignoring K⁺ when starting insulin in DKA",
    "Treating numbers without assessing perfusion and mental status",
  ],
  pearls: [
    "K⁺ pearl: 'Peaked T = protect the heart first'",
    "Always check Mg²⁺ when K⁺ won't correct",
    "Urine output trend beats single I&O value in shock/resuscitation",
  ],
  summary: [
    "Link electrolyte shifts to ECG, neuro, and muscle findings",
    "Replace safely — rate and route matter",
    "Context: renal failure, diuretics, DKA, GI losses",
    "Perfuse before you polish numbers in shock",
  ],
});

export const PEDIATRICS_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Pediatric NCLEX items test age-specific norms, immunization rules, dehydration assessment, and family-centered care. Students fail by applying adult vital sign thresholds and missing developmental communication cues.",
  ],
  concepts: [
    "Pediatric vitals vary by age — tachycardia thresholds differ from adults",
    "Dehydration assessment: fontanel, mucous membranes, cap refill, urine output, mental status",
    "Febrile infant <3 months — medical emergency; full sepsis workup",
    "Immunization: live vaccines contraindications (severe immunocompromise, pregnancy for some contacts)",
    "Growth milestones: red flags for delayed speech, motor skills",
    "Poisoning: syrup of ipecac obsolete — activated charcoal per poison control",
    "Child abuse: document objectively; mandatory reporting; separate interviews per protocol",
    "Family-centered care: include caregiver in teaching; developmentally appropriate explanations",
  ],
  clinical: [
    "6-month-old fever 38.8°C — assess feeding, lethargy, full VS; notify provider for young infant fever protocol",
    "Toddler dehydration — skin turgor, tears, wet diapers; oral rehydration if stable",
    "School-age child asthma exacerbation — SpO₂, accessory muscles, peak flow; bronchodilator first",
    "Adolescent confidentiality: balance privacy laws with safety (suicide, abuse)",
    "IM injection site by age: vastus lateralis infant; deltoid older child",
  ],
  tables: [
    {
      caption: "Dehydration severity (clinical)",
      headers: ["Severity", "Findings", "Priority"],
      rows: [
        ["Mild", "Dry mucous membranes, alert", "Oral rehydration, monitor"],
        ["Moderate", "Tachycardia, decreased urine", "IV access, fluids per order"],
        ["Severe", "Lethargy, hypotension, cap refill delayed", "Immediate resuscitation pathway"],
      ],
    },
  ],
  visual: [
    "Pediatric VS ranges by age table",
    "Immunization schedule overview (CDC)",
    "Developmental milestone timeline",
  ],
  misconceptions: [
    "Using adult hypotension cutoff in infants",
    "Delaying report of suspected abuse",
    "Giving aspirin to child with viral illness (Reye syndrome)",
    "Assuming child can verbalize pain like adult",
  ],
  pearls: [
    "Infant fever = treat seriously until proven benign",
    "Weight-based dosing always — verify kg",
    "Non-verbal pain cues: irritability, poor feeding, posture",
  ],
  summary: [
    "Age-specific norms drive assessment and intervention",
    "Dehydration and respiratory illness are high-yield",
    "Know immunization contraindications and reporting laws",
    "Include caregivers in safety planning",
  ],
});

export const LEGAL_ETHICAL_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Management of Care includes advocacy, informed consent, confidentiality, and mandatory reporting. These items feel subjective but have rule-based answers — know the nurse's legal duty first.",
  ],
  concepts: [
    "Informed consent: capacity, voluntary, disclosure — nurse witnesses signature and confirms understanding; surgeon/provider obtains consent",
    "Advance directives: honor valid DNR/POLST; clarify code status before procedures",
    "Mandatory reporting: abuse (child, elder, vulnerable adult), certain communicable diseases, impaired colleague per state law",
    "HIPAA: minimum necessary disclosure; signed authorization for release",
    "Assignment despite objection: nurse may refuse unsafe assignment; follow chain of command; document",
    "Client rights: privacy, dignity, refuse treatment (if competent), access to records",
    "Ethical principles: autonomy, beneficence, nonmaleficence, justice — apply to conflict vignettes",
    "Incident reporting: internal risk management; not substitute for mandatory external reports when required",
  ],
  clinical: [
    "Competent adult refuses blood transfusion — honor refusal; document education and alternatives",
    "Suspected elder abuse in home health — report per state law; do not confront alleged abuser alone",
    "Minor needs emergent surgery — consent from guardian; life-threatening exception per law",
    "Colleague appears impaired at work — report to supervisor/nurse manager; patient safety first",
    "Client requests record copy — follow facility HIPAA process",
  ],
  tables: [
    {
      caption: "Consent & capacity quick rules",
      headers: ["Scenario", "Action"],
      rows: [
        ["Competent adult refuses", "Honor; document; ensure understanding"],
        ["Unconscious emergency", "Implied consent for life-saving care"],
        ["Minor routine care", "Guardian consent"],
        ["Suspected abuse", "Report; do not investigate alone"],
      ],
    },
  ],
  visual: [
    "Ethical decision tree: safety → autonomy → justice",
    "Mandatory reporting flowchart",
  ],
  misconceptions: [
    "Nurse obtains surgical informed consent (provider role)",
    "Promising client confidentiality when law requires reporting",
    "Accepting assignment that exceeds safe capacity without escalation",
    "Breaking HIPAA to gossip — only minimum necessary for care",
  ],
  pearls: [
    "When law and ethics conflict on NCLEX, patient safety and mandatory reporting usually win",
    "Document objectively after abuse suspicion — quotes and observations",
    "Refusing unsafe assignment is professional, not abandonment, when follow proper process",
  ],
  summary: [
    "Know consent, capacity, and advance directive basics",
    "Mandatory reporting trumps confidentiality",
    "Advocate and escalate unsafe situations",
    "HIPAA minimum necessary always",
  ],
});
