import type { MemoryCard } from "../types";

function cards(
  moduleSlug: string,
  practiceTopicSlug: string,
  subject: string,
  items: Omit<MemoryCard, "examSlug" | "reviewModuleSlug" | "practiceTopicSlug" | "subject" | "sortOrder">[]
): MemoryCard[] {
  return items.map((item, i) => ({
    ...item,
    examSlug: "nclex" as const,
    reviewModuleSlug: moduleSlug,
    practiceTopicSlug,
    subject,
    sortOrder: i + 1,
  }));
}

export const NCLEX_STRATEGY_MEMORY_CARDS: MemoryCard[] = [
  ...cards("prioritization", "management-of-care", "Management of Care", [
    { id: "nclex-pri-abc-first", topic: "Prioritization", title: "ABC Before Everything", teaser: "Airway, breathing, circulation — then the rest.", kind: "pearl", tags: ["ABC", "priority"], body: "In acute vignettes, physiologic stability outranks teaching, documentation, and psychosocial support." },
    { id: "nclex-pri-see-first", topic: "Prioritization", title: "See First Red Flags", teaser: "SpO₂ <90%, active bleed, RR crisis, altered neuro.", kind: "fact", tags: ["triage"], body: "See first when findings suggest imminent airway, breathing, circulation, or neurologic threat.", bullets: ["Chest pain + diaphoresis", "RR 8 on opioids", "Fresh hemorrhage + hypotension"] },
    { id: "nclex-pri-assess-act", topic: "Prioritization", title: "Assess vs Act", teaser: "Life threat visible? Act. Stable? Assess.", kind: "mistake", tags: ["CJMM"], body: "NCLEX traps offer correct interventions that are not the FIRST action." },
    { id: "nclex-pri-trap-eventually", topic: "Prioritization", title: "Correct Eventually Trap", teaser: "Therapeutic ≠ first priority.", kind: "mistake", tags: ["trap"], body: "Eliminate options that are appropriate later but unsafe to prioritize now." },
    { id: "nclex-pri-room-parse", topic: "Prioritization", title: "Parse Assignment Rooms", teaser: "Score each client before picking.", kind: "pearl", tags: ["assignment"], body: "Underline vitals and new changes per room; rank acuity; choose highest ABC threat." },
    { id: "nclex-pri-transfusion", topic: "Prioritization", title: "Transfusion Reaction First", teaser: "Stop the transfusion.", kind: "fact", tags: ["blood"], body: "Stop transfusion immediately; maintain IV line with NS; notify provider; monitor ABCs." },
  ]),
  ...cards("postpartum", "maternal-child", "Maternal-Child", [
    { id: "nclex-mat-pph-fundus", topic: "Postpartum", title: "PPH: Boggy Fundus", teaser: "Massage, empty bladder, oxytocin.", kind: "pearl", tags: ["PPH"], body: "Postpartum hemorrhage with boggy fundus — fundus massage first, bladder scan, oxytocin, IV access." },
    { id: "nclex-mat-preeclampsia", topic: "Preeclampsia", title: "Severe Features", teaser: "BP, headache, vision, clonus, RUQ pain.", kind: "fact", tags: ["preeclampsia"], body: "Severe preeclampsia requires magnesium, seizure precautions, and provider notification." },
    { id: "nclex-mat-mag-toxicity", topic: "Magnesium", title: "Mag Toxicity Signs", teaser: "Lost reflexes, resp depression.", kind: "mistake", tags: ["magnesium"], body: "Absent deep tendon reflexes and respiratory depression signal magnesium toxicity — stop infusion." },
    { id: "nclex-mat-late-decel", topic: "FHR", title: "Late Decelerations", teaser: "Uteroplacental insufficiency.", kind: "fact", tags: ["FHR"], body: "Late decels → left lateral, O₂, IV fluids, notify provider; evaluate fetal status." },
    { id: "nclex-mat-variable-decel", topic: "FHR", title: "Variable Decels", teaser: "Cord compression.", kind: "fact", tags: ["FHR"], body: "Variable decelerations suggest cord compression — reposition, amnioinfusion per protocol." },
    { id: "nclex-mat-category-3", topic: "FHR", title: "Category III Tracing", teaser: "Immediate evaluation.", kind: "pearl", tags: ["FHR"], body: "Category III FHR requires immediate bedside evaluation and provider notification." },
  ]),
  ...cards("medication-safety", "pharmacology-nursing", "Pharmacology", [
    { id: "nclex-pharm-insulin-never", topic: "Insulin", title: "Never Delegate Insulin", teaser: "RN-only on NCLEX.", kind: "mistake", tags: ["insulin"], body: "Insulin administration is not delegated to UAP; verify glucose before dosing." },
    { id: "nclex-pharm-hypo-15", topic: "Hypoglycemia", title: "15 g Fast Carb", teaser: "Recheck in 15 minutes.", kind: "fact", tags: ["hypoglycemia"], body: "Conscious hypoglycemia: 15 g fast-acting carbohydrate, recheck glucose in 15 minutes." },
    { id: "nclex-pharm-pca-rr", topic: "Opioids", title: "PCA: RR Before Refill", teaser: "RR 8 = hold PCA.", kind: "pearl", tags: ["PCA", "opioid"], body: "Somnolence with RR ≤8 on PCA morphine — hold PCA, assess airway, naloxone if indicated." },
    { id: "nclex-pharm-k-never-push", topic: "Potassium", title: "Never IV Push K⁺", teaser: "Cardiac monitor; controlled rate.", kind: "mistake", tags: ["potassium"], body: "IV potassium is never given as IV push; use pump with cardiac monitoring per protocol." },
    { id: "nclex-pharm-warfarin-inr", topic: "Warfarin", title: "INR + Bleeding", teaser: "Nosebleed + tarry stools = escalate.", kind: "fact", tags: ["warfarin"], body: "Supratherapeutic INR with bleeding signs requires immediate provider notification and bleeding assessment." },
    { id: "nclex-pharm-calc-units", topic: "Calculations", title: "Label Every Unit", teaser: "mg vs mcg vs g.", kind: "pearl", tags: ["calculation"], body: "Dosage calc errors come from unit confusion — write units at each conversion step." },
  ]),
  ...cards("psychiatric", "psychosocial", "Psychosocial", [
    { id: "nclex-psych-suicide-ask", topic: "Suicide", title: "Ask Directly", teaser: "Plan, means, intent.", kind: "fact", tags: ["suicide"], body: "Assess suicidal ideation with direct questions; initiate safety precautions when risk present." },
    { id: "nclex-psych-no-secrecy", topic: "Suicide", title: "No Secret Promises", teaser: "Safety over confidentiality.", kind: "mistake", tags: ["suicide"], body: "Never promise confidentiality when client has active suicide plan with means and intent." },
    { id: "nclex-psych-therapeutic-open", topic: "Communication", title: "Open-Ended First", teaser: "Explore; don't advise.", kind: "pearl", tags: ["therapeutic"], body: "Therapeutic responses use open-ended questions and reflection — avoid false reassurance and advice." },
    { id: "nclex-psych-restraint-last", topic: "Restraints", title: "Least Restrictive", teaser: "Restraint is last resort.", kind: "fact", tags: ["restraint"], body: "Try de-escalation and environmental changes before restraints; provider order and 1-hour face-to-face required." },
    { id: "nclex-psych-ciwa", topic: "Withdrawal", title: "CIWA for Alcohol", teaser: "Benzo protocol; seizure watch.", kind: "fact", tags: ["withdrawal"], body: "Alcohol withdrawal — CIWA scoring, benzodiazepines per protocol, seizure precautions." },
    { id: "nclex-psych-lithium-monitor", topic: "Lithium", title: "Lithium Monitoring", teaser: "Level, renal, thyroid.", kind: "pearl", tags: ["lithium"], body: "Monitor lithium level, renal function, and thyroid; toxicity: tremor, confusion, GI upset." },
  ]),
  ...cards("electrolytes", "physiological-adaptation", "Physiological Adaptation", [
    { id: "nclex-elec-k-peaked-t", topic: "Potassium", title: "Peaked T Waves", teaser: "Hyperkalemia cardiac risk.", kind: "fact", tags: ["potassium"], body: "Peaked T waves and widened QRS suggest hyperkalemia — cardiac monitor and notify provider immediately." },
    { id: "nclex-elec-k-u-wave", topic: "Potassium", title: "U Waves = Hypokalemia", teaser: "Weakness + arrhythmia risk.", kind: "fact", tags: ["potassium"], body: "Hypokalemia causes muscle weakness, ileus, and U waves on ECG — replace per order." },
    { id: "nclex-elec-hyponatremia-slow", topic: "Sodium", title: "Correct Na⁺ Slowly", teaser: "Avoid rapid correction.", kind: "mistake", tags: ["sodium"], body: "Chronic hyponatremia requires gradual correction to prevent osmotic demyelination." },
    { id: "nclex-elec-chvostek", topic: "Calcium", title: "Chvostek & Trousseau", teaser: "Hypocalcemia signs.", kind: "pearl", tags: ["calcium"], body: "Positive Chvostek and Trousseau signs indicate hypocalcemia — check albumin and replace calcium." },
    { id: "nclex-elec-mg-reflexes", topic: "Magnesium", title: "Lost Reflexes", teaser: "Hypermagnesemia red flag.", kind: "fact", tags: ["magnesium"], body: "Absent deep tendon reflexes with magnesium therapy signal toxicity — stop and notify." },
    { id: "nclex-elec-dka-k-shift", topic: "DKA", title: "K⁺ Shifts in DKA", teaser: "Watch K⁺ when insulin starts.", kind: "pearl", tags: ["DKA"], body: "Insulin drives K⁺ intracellularly — monitor potassium closely during DKA treatment." },
  ]),
  ...cards("pediatrics", "pediatrics-nursing", "Pediatrics", [
    { id: "nclex-peds-infant-fever", topic: "Fever", title: "Infant Fever Emergency", teaser: "<3 months = workup.", kind: "fact", tags: ["fever", "infant"], body: "Fever in infant under 3 months requires urgent evaluation — do not dismiss as viral only." },
    { id: "nclex-peds-dehydration", topic: "Dehydration", title: "Ped Dehydration Signs", teaser: "Fontanel, tears, diapers.", kind: "pearl", tags: ["dehydration"], body: "Assess mucous membranes, fontanel, cap refill, urine output, and mental status for dehydration severity." },
    { id: "nclex-peds-weight-dose", topic: "Dosing", title: "Weight-Based Dosing", teaser: "Always verify kg.", kind: "mistake", tags: ["pediatrics"], body: "Pediatric medication doses are mg/kg — verify weight and concentration every time." },
    { id: "nclex-peds-no-aspirin", topic: "Safety", title: "No Aspirin in Viral Illness", teaser: "Reye syndrome risk.", kind: "mistake", tags: ["Reye"], body: "Avoid aspirin in children with viral illness due to Reye syndrome risk." },
    { id: "nclex-peds-abuse-report", topic: "Abuse", title: "Mandatory Reporting", teaser: "Document objectively.", kind: "fact", tags: ["abuse"], body: "Suspected child abuse requires mandatory reporting — objective documentation, no solo investigation." },
    { id: "nclex-peds-vs-adult-vitals", topic: "Vitals", title: "Age-Specific Vitals", teaser: "Tachycardia thresholds differ.", kind: "pearl", tags: ["vitals"], body: "Pediatric heart rate and BP normals vary by age — use age-appropriate ranges on NCLEX." },
  ]),
  ...cards("legal-ethical", "management-of-care", "Management of Care", [
    { id: "nclex-legal-consent-rn", topic: "Consent", title: "RN Witnesses Consent", teaser: "Provider obtains consent.", kind: "fact", tags: ["consent"], body: "Nurse confirms client understanding and witnesses signature — provider obtains informed consent for procedures." },
    { id: "nclex-legal-refuse-blood", topic: "Autonomy", title: "Competent Refusal", teaser: "Honor informed refusal.", kind: "pearl", tags: ["autonomy"], body: "Competent adults may refuse treatment including blood — document education and alternatives." },
    { id: "nclex-legal-mandatory-report", topic: "Reporting", title: "Mandatory Reporting", teaser: "Abuse trumps confidentiality.", kind: "fact", tags: ["reporting"], body: "Suspected abuse of vulnerable populations must be reported per state law — not optional." },
    { id: "nclex-legal-unsafe-assign", topic: "Assignment", title: "Refuse Unsafe Assignment", teaser: "Chain of command + document.", kind: "pearl", tags: ["advocacy"], body: "Nurses may refuse assignments that violate safe staffing — follow chain of command and document." },
    { id: "nclex-legal-hipaa-min", topic: "HIPAA", title: "Minimum Necessary", teaser: "Only info needed for care.", kind: "mistake", tags: ["HIPAA"], body: "Share only minimum necessary PHI for treatment, payment, or operations — no gossip." },
    { id: "nclex-legal-impaired-colleague", topic: "Impairment", title: "Impaired Colleague", teaser: "Patient safety first.", kind: "fact", tags: ["impairment"], body: "Report suspected colleague impairment to supervisor — patient safety overrides loyalty." },
  ]),
];
