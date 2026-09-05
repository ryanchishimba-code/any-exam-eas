import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Safety, red flags, and referral — heavily tested NPTE-PT cross-cutting domain. */
export const NPTE_SAFETY_RED_FLAGS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Safety and red-flag recognition is tested across every NPTE-PT category. Items require knowing when to refer to a physician, contraindications to exercise and modalities, and infection control in clinical practice.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Red flags in spine: progressive neurologic deficit, cauda equina, fever with spine pain, trauma",
        "Red flags in headache: thunderclap onset, fever, neurologic signs, new onset >50",
        "Exercise contraindications: unstable angina, uncontrolled hypertension, acute systemic infection",
        "Modality contraindications: malignancy, pregnancy (US over fetus), impaired sensation, acute hemorrhage",
        "Fall risk tools: TUG, Berg, Morse — interpret and act on results",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Lumbar radiculopathy: monitor EHL strength, saddle anesthesia, bowel/bladder — urgent referral if present",
        "Cardiac rehab: know absolute vs relative contraindications to exercise testing",
        "Standard precautions: hand hygiene first; PPE by anticipated exposure",
        "Bloodborne pathogens: treat all blood/body fluids as potentially infectious",
        "Documentation: objective findings that justify referral and medical necessity",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Refer urgently vs modify PT plan",
          headers: ["Finding", "Action"],
          rows: [
            ["Progressive foot drop", "Stop progression; urgent medical referral"],
            ["Thunderclap headache + fever", "Do not treat; emergency referral"],
            ["Stable radiculopathy, 5/5 strength", "Monitor; graded PT with neurologic checks"],
            ["Mild OA flare, no red flags", "Modify intensity; continue within irritability"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Red-flag decision tree: systemic signs → hold PT → refer; local mechanical signs → proceed with caution",
        "Contact precautions: gown + gloves; airborne: N95; droplet: surgical mask",
        "Stop-exercise cues: chest pain, unexplained dyspnea, neuro deficit, unstable vitals",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "PTs treat all patients who walk in — screening for red flags is mandatory before intervention",
        "Gloves replace hand hygiene — wash or sanitize before and after glove use",
        "Pain alone always contraindicates exercise — distinguish acceptable discomfort from harmful activity",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Document screening findings even when clearing for treatment",
        "When in doubt on spinal cord or cauda equina signs — do not mobilize; escalate",
        "Infection control is part of every session, not only isolation rooms",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Screen → clear or refer before dosing exercise",
        "Match PPE to transmission route; hygiene always",
        "Stop for systemic or neurologic red flags immediately",
      ],
    },
  ],
};
