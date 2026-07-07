import { buildNclexReviewModule } from "./nclex-module-builder";

export const SATA_MASTERY_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Select-all-that-apply (SATA) items are NGN staples — partial credit psychology makes them harder than single-answer MCQs. NCLEX rewards systematic option evaluation: treat each choice as true/false independent of others.",
  ],
  concepts: [
    "Each option stands alone — do not let one correct answer convince you another unrelated option is correct",
    "Identify the stem constraint: FIRST, MOST, BEST, INITIAL, CONTRAINDICATED, EXPECTED",
    "Safety options often multiple correct: assess, notify, monitor, implement protocol steps",
    "Teaching/counseling SATA: multiple independent teaching points may all be correct",
    "Avoid 'all of the above' thinking — NCLEX rarely uses that format but clustered guessing fails",
    "Eliminate clearly wrong options first using ABC and scope of practice",
    "If torn between two similar options, check whether stem asks inclusive (all that apply) vs exclusive",
    "Time management: mark and return only if platform allows — on NCLEX commit when confident per option",
  ],
  clinical: [
    "Postpartum PPH SATA: fundal massage, IV access, notify provider, type & cross — all may be correct simultaneous actions",
    "Infection control SATA: hand hygiene, PPE, dedicated equipment, room placement — multiple standard + transmission precautions",
    "Diabetes teaching SATA: foot care, sick-day rules, hypoglycemia treatment, medication timing — independent valid points",
    "Delegation SATA: tasks appropriate for UAP vs LPN vs RN — evaluate each option against scope independently",
  ],
  tables: [
    {
      caption: "SATA evaluation method",
      headers: ["Step", "Action"],
      rows: [
        ["1", "Read stem twice — note FIRST/MOST/ALL"],
        ["2", "Cover options — predict answers"],
        ["3", "Label each option T/F independently"],
        ["4", "Recheck eliminated options once"],
      ],
    },
  ],
  visual: [
    "True/false grid per option",
    "Stem keyword highlighter: ALL / FIRST / CONTRAINDICATED",
    "Scope of practice fork per delegatee option",
  ],
  misconceptions: [
    "Selecting options because they 'sound good together' without independent verification",
    "Leaving options unchecked because 'too many seem right' — multiple correct is intentional",
    "Applying prioritization FIRST logic to SATA that asks all appropriate interventions",
    "Changing answers without re-evaluating each line item",
  ],
  pearls: [
    "Odd number of correct answers is common but not a rule — ignore test-taking myths",
    "Contraindication SATA: any absolute contraindication option is a strong true if accurate",
    "Assessment + intervention both correct when stem asks for appropriate nursing actions (not FIRST)",
  ],
  summary: [
    "Treat each SATA option as its own true/false question",
    "Read stem constraints carefully",
    "Multiple correct answers are expected — do not under-select from doubt",
    "Use ABC and scope to eliminate wrong options quickly",
  ],
});

export const BOW_TIE_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Bow-tie and trend-analysis NGN items require linking actions, conditions to monitor, and potential complications in one clinical picture — mirroring the Clinical Judgment Measurement Model (Recognize Cues → Analyze → Prioritize → Generate Solutions → Evaluate).",
  ],
  concepts: [
    "Bow-tie center: focal clinical problem (e.g., sepsis, DKA, postpartum hemorrhage)",
    "Left wing: actions to take (assessments and interventions)",
    "Right wing: parameters to monitor and potential complications",
    "Trend tables: compare day 1 vs day 3 labs/vitals — identify improving vs worsening trajectories",
    "CJMM loop: gather cues → prioritize hypotheses → take action → evaluate outcomes",
    "When trend shows declining urine output + rising creatinine → prerenal vs ATN fork",
    "When glucose trending down after insulin → watch for hypoglycemia next interval",
    "Documentation trends support escalation — single snapshot misses trajectory",
  ],
  clinical: [
    "Sepsis bow-tie: center sepsis — actions lactate, cultures, antibiotics, fluids — monitor BP, UOP, mental status — complications shock, AKI",
    "DKA bow-tie: center DKA — actions fluids, insulin after K⁺, glucose checks — monitor K⁺, glucose, mental status — complications hypokalemia, cerebral edema if corrected too fast",
    "Trend: K⁺ 4.2 → 3.4 → 2.9 on diuretics — anticipate arrhythmia risk, replacement, hold contributing meds",
    "Trend: post-op RR 14 → 10 → 8 on PCA — opioid toxicity trend — hold opioid, naloxone readiness",
  ],
  tables: [
    {
      caption: "CJMM → bow-tie mapping",
      headers: ["CJMM step", "Bow-tie element"],
      rows: [
        ["Recognize cues", "Trend data + center problem"],
        ["Analyze", "Link labs/vitals to pathophysiology"],
        ["Prioritize hypotheses", "Select most likely center diagnosis"],
        ["Generate solutions", "Left wing actions"],
        ["Evaluate", "Right wing monitoring + complications"],
      ],
    },
  ],
  visual: [
    "Bow-tie diagram: actions ← problem → monitor/complications",
    "Trend arrow labs/vitals over time",
    "CJMM circular loop overlay",
  ],
  misconceptions: [
    "Picking actions that are correct in isolation but unrelated to center problem",
    "Ignoring trend direction (improving vs worsening)",
    "Monitoring parameters that do not match the focal problem",
    "Missing complication wing when obvious downstream risk exists (bleeding after anticoagulation)",
  ],
  pearls: [
    "Center problem must match the vignette anchor phrase",
    "If glucose trending down rapidly, hypoglycemia belongs on complication wing",
    "UOP trend is highest-yield renal perfusion cue post-op",
  ],
  summary: [
    "Anchor the center clinical problem first",
    "Left = do; right = watch and prevent",
    "Trend direction beats single value",
    "Use CJMM to structure NGN complex items",
  ],
});

export const CASE_STUDY_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Unfolding case study NGN sets present 6 linked items on one patient over time — early answers constrain later options. Consistency, trending, and escalation when status changes are essential for first-attempt pass rates.",
  ],
  concepts: [
    "Read entire case overview before item 1 — note age, diagnosis, allergies, baseline vitals",
    "Item 1–2 often assessment/priority; later items assume prior actions were taken",
    "If you prioritized infection control in item 1, later items should not contradict isolation status",
    "New abnormal finding in item 4 resets priority — do not anchor on item 1 answer if patient decompensated",
    "Medication reconciliation carries through — allergy documented early applies to item 6",
    "Time progression: post-op day 1 vs day 3 changes expected findings and complications",
    "Delegate appropriately across items — RN role consistent unless patient becomes unstable",
    "Evaluate outcomes: last items often ask re-assessment after intervention",
  ],
  clinical: [
    "L&D case: labor monitoring → epidural → late decelerations → reposition/O₂/notify — each item builds",
    "Med-surg case: post-op day 1 IS teaching → day 2 fever/crackles → pneumonia workup priority shift",
    "Psych case: admission suicide assessment → milieu safety → medication teaching after stabilization",
    "Peds case: dehydration assessment → fluid plan → discharge teaching when stable",
  ],
  tables: [
    {
      caption: "Case study navigation",
      headers: ["Item #", "Typical focus"],
      rows: [
        ["1–2", "Assessment, priority, safety"],
        ["3–4", "Intervention, delegation, teaching"],
        ["5–6", "Evaluation, complication, discharge"],
      ],
    },
  ],
  visual: [
    "Timeline bar under patient header",
    "Sticky note allergies + isolation + devices",
    "Status change flag when new vitals/labs provided",
  ],
  misconceptions: [
    "Treating each item as unrelated MCQ — ignoring case continuity",
    "Failing to escalate when new data shows decompensation",
    "Contradicting earlier isolation or fall precaution decisions",
    "Skipping allergy contraindication on later medication item",
  ],
  pearls: [
    "When case adds 'notify provider was called' — next item assumes MD aware",
    "Worsening vitals in item 5 trumps stable plan from item 2",
    "Document mentally: what changed since last item?",
  ],
  summary: [
    "Preview full case; track allergies and isolation",
    "Later items assume earlier nursing actions completed",
    "Re-prioritize when patient status changes mid-case",
    "Last items often test evaluation and teaching readiness",
  ],
});
