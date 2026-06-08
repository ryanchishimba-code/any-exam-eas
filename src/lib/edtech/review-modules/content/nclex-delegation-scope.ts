import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const DELEGATION_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Delegation and scope-of-practice items appear on nearly every NCLEX because they test whether you can protect patients while using the care team efficiently. The RN remains legally and professionally accountable for all patient outcomes — delegation is not dumping work; it is assigning appropriate tasks with clear communication and follow-up.",
        "NCLEX rewards stable vs. unstable framing, the five rights of delegation, and knowing what never leaves the RN lane (assessment, evaluation, teaching, unstable patients). Wrong delegation causes sentinel events; the exam punishes choices that look efficient but skip supervision or scope checks.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Five rights: right task, right circumstance, right person, right direction/communication, right supervision/evaluation",
        "RN retains accountability — cannot delegate nursing judgment, assessment, evaluation, or unstable patient care",
        "UAP scope (stable patients per policy): ADLs, ambulation with plan, I&O, vital signs on stable adults",
        "LPN/LVN scope: predictable, stable care per state nurse practice act — wound care per protocol, medication administration per license",
        "Never delegate to UAP: insulin, initial admission assessment, unstable vitals, new neuro changes, sterile procedures requiring RN judgment",
        "Right circumstance: adequate staffing, appropriate setting, patient is stable with predictable outcome",
        "Communication must be specific: what to do, when to report back, parameters for escalation",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Post-op day 1 with active bleeding → RN assesses and intervenes; do not delegate VS to UAP until stable",
        "Stable med-surg patient needs ambulation with PT plan documented → UAP may assist per policy",
        "New confusion in older adult → RN assesses (delirium workup); do not delegate initial neuro check to UAP",
        "Routine VS on stable chronic patient → may delegate to UAP with clear reporting parameters (e.g., SBP >180 or <90)",
        "Medication teaching before discharge → RN responsibility; UAP cannot teach",
        "If delegatee refuses or lacks competency → RN finds another solution; never pressure unsafe acceptance",
        "After delegation, RN evaluates outcome and patient status — reassign if condition changes",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "RN vs LPN/LVN vs UAP — NCLEX framing",
          headers: ["Activity", "RN", "LPN/LVN", "UAP"],
          rows: [
            ["Initial admission assessment", "Yes", "No", "No"],
            ["Ongoing focused assessment", "Yes", "Stable patients", "No"],
            ["Medication administration", "Yes", "Per license", "No (except where law allows)"],
            ["Insulin administration", "Yes", "Varies by state", "Never on NCLEX"],
            ["Patient/family teaching", "Yes", "Reinforce plan", "No"],
            ["ADLs on stable patient", "Yes", "Yes", "Yes"],
            ["Vital signs — stable", "Yes", "Yes", "Yes per policy"],
            ["Vital signs — unstable/post-op complication", "Yes", "No", "No"],
          ],
        },
        {
          caption: "Stable vs unstable — delegation decision",
          headers: ["Patient picture", "Delegate?", "Why"],
          rows: [
            ["Chronic HF, baseline VS, ambulating with PT plan", "Often yes (ADL/VS)", "Predictable, stable"],
            ["Fresh post-op, oozing dressing, HR 118", "No", "Unstable — RN owns assessment/intervention"],
            ["New fever + rigors on chemo unit", "No", "Unpredictable — assess first"],
            ["Long-term care stable adult, routine I&O", "Often yes", "Stable, protocol-driven"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Delegation decision tree: Is patient stable? → Is outcome predictable? → Is task in delegatee scope? → Provide clear directions → Supervise and evaluate",
        "Five rights checklist card for NCLEX elimination: strike answers that violate any right",
        "Scope pyramid: top = RN-only (assess, teach, triage unstable); middle = LPN stable care; base = UAP ADLs on stable patients",
        "Escalation parameters table: what VS, symptoms, or time limits trigger RN notification",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Myth: Once delegated, the UAP is responsible — Fact: RN remains accountable for delegated care",
        "Myth: LPN can do everything an RN does on a med-surg floor — Fact: LPN scope is license- and state-specific; unstable patients stay with RN",
        "Myth: Delegating VS always saves time — Fact: Unstable patients require RN-performed or directly supervised assessment",
        "Myth: If the task is on the assignment sheet, delegation is automatic — Fact: Five rights must be satisfied each time",
        "Myth: Experienced UAP can receive insulin on a stable diabetic — Fact: Insulin is not delegated to UAP on NCLEX",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Read the stem for unstable cues first — if present, pick the RN action",
        "Teaching and evaluation are RN functions — attractive distractors often assign them to UAP",
        "When every answer delegates, choose the most stable patient and most appropriate task",
        "If two answers seem correct, pick the one with supervision and follow-up built in",
        "State nurse practice act always wins — when unsure, choose the most restrictive safe option",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "RN accountable for all care — delegation requires five rights and ongoing evaluation",
        "UAP: stable ADLs, ambulation with plan, VS on stable adults — never insulin or initial assessment",
        "Unstable or unpredictable → RN retains task",
        "Provide clear directions, confirm understanding, define when to report back",
        "NCLEX fork: stable + in scope + supervised = may delegate; otherwise RN performs",
      ],
    },
  ],
};
