import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Stroke, seizures, and neurologic emergencies for USMLE Step 2 CK. */
export const STROKE_NEURO_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Neurologic emergencies are 'time is brain' vignettes: the correct next step depends on the last-known-well time, a non-contrast CT to exclude hemorrhage, and a blood-pressure target that changes the moment you decide to give thrombolytics. Small sequencing errors cause catastrophic, testable harm.",
        "Items reward excluding hemorrhage before any antithrombotic, recognizing thunderclap headache as subarachnoid hemorrhage until proven otherwise, treating status epilepticus on a strict clock, and never missing hypoglycemia or Wernicke encephalopathy as stroke mimics.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Ischemic stroke: non-contrast CT first to exclude hemorrhage → IV alteplase/tenecteplase within 4.5 h for eligible patients",
        "Large-vessel occlusion: mechanical thrombectomy up to 24 h with salvageable penumbra on advanced imaging",
        "Blood pressure: permissive hypertension (up to 220/120) if not lysing; lower to <185/110 before thrombolytics",
        "Hemorrhagic stroke (ICH): reverse coagulopathy (4-factor PCC for warfarin), control BP (SBP target ~140), neurosurgery for cerebellar bleed >3 cm or herniation",
        "Subarachnoid hemorrhage: thunderclap headache → CT (most sensitive <6 h) → LP for xanthochromia if CT negative; nimodipine prevents vasospasm",
        "Status epilepticus: IV lorazepam first-line (IM midazolam if no IV) → fosphenytoin/levetiracetam/valproate → anesthetic infusion",
        "Always check glucose in acute neuro change — hypoglycemia mimics stroke and causes seizures",
        "Wernicke encephalopathy (ophthalmoplegia, ataxia, confusion): give IV thiamine before glucose in at-risk patients",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "AF patient 2 h after aphasia and arm weakness, CT without hemorrhage, no anticoagulants: check the tPA checklist and give alteplase — not CTA or antiplatelet first",
        "BP 190/115 in an otherwise eligible stroke patient: lower to <185/110 before giving thrombolytics",
        "Worst-headache-of-life with a negative CT: perform LP for xanthochromia — do not discharge",
        "Seizing patient: give lorazepam, check glucose, and escalate to a second-line agent if seizures persist beyond ~5 minutes",
        "Alcohol-use or malnourished patient with confusion: give IV thiamine before dextrose",
        "New focal deficit after a seizure may be Todd paralysis — but exclude stroke before attributing it",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Ischemic vs hemorrhagic stroke management",
          headers: ["Feature", "Ischemic", "Hemorrhagic (ICH)"],
          rows: [
            ["First imaging", "Non-contrast CT", "Non-contrast CT"],
            ["Reperfusion", "tPA ≤4.5 h; thrombectomy ≤24 h (LVO)", "Not applicable"],
            ["BP target", "<185/110 before lysis; else permissive", "SBP ~140; aggressive control"],
            ["Anticoagulation", "Antithrombotics after hemorrhage excluded", "Reverse coagulopathy immediately"],
          ],
        },
        {
          caption: "Status epilepticus escalation",
          headers: ["Step", "Agent", "Note"],
          rows: [
            ["First-line", "Lorazepam IV (IM midazolam if no IV)", "Repeat once if needed"],
            ["Second-line", "Fosphenytoin, levetiracetam, or valproate", "Load promptly if benzodiazepines fail"],
            ["Refractory", "Propofol or midazolam infusion", "Intubation/ICU; continuous EEG"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Acute stroke pathway: last known well → non-contrast CT → exclude hemorrhage → tPA checklist/BP target → thrombectomy screen for LVO",
        "tPA exclusion checklist card: hemorrhage on CT, recent surgery, active bleeding, INR >1.7, platelets <100K, glucose <50 (correct first)",
        "Thunderclap-headache workup: CT (<6 h sensitive) → LP for xanthochromia if negative → CTA/angiography for aneurysm",
        "Status epilepticus clock: benzodiazepine now → second-line load by ~20 min → anesthetic infusion if refractory",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Give aspirin or anticoagulation before excluding hemorrhage — fatal in ICH; image first",
        "A negative CT rules out subarachnoid hemorrhage at any time — sensitivity falls after 6 h; do the LP",
        "Lower BP aggressively in every acute ischemic stroke — permissive hypertension applies unless you are lysing",
        "Give glucose before thiamine in an alcohol-use patient — this can precipitate Wernicke encephalopathy",
        "Wake-up strokes are always ineligible — advanced imaging may still qualify select patients for treatment",
        "Phenytoin is first-line for status epilepticus — benzodiazepines come first",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Non-contrast CT before any antithrombotic — exclude hemorrhage every time",
        "Thiamine before glucose in at-risk patients to prevent Wernicke encephalopathy",
        "Thunderclap headache with negative CT still needs an LP for xanthochromia",
        "Lower BP to <185/110 before tPA; otherwise allow permissive hypertension",
        "Check a fingerstick glucose in every acute neurologic change — it is a reversible mimic",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Ischemic stroke: CT → tPA ≤4.5 h → thrombectomy ≤24 h for LVO",
        "Exclude hemorrhage before antithrombotics; ICH → reverse coagulopathy + control BP",
        "SAH: thunderclap headache → CT → LP if negative; nimodipine for vasospasm",
        "Status epilepticus: lorazepam → fosphenytoin/levetiracetam → anesthetic infusion",
        "Always check glucose; give thiamine before glucose when malnutrition/alcohol use is possible",
      ],
    },
  ],
};
