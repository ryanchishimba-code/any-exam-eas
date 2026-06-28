/**
 * NCLEX-RN item-writer system prompt — calibrated to UWorld/NCSBN CJMM board quality.
 * Ten gold-standard examples teach specificity, prioritization, and rationale depth.
 */
import {
  buildNclexTopicMixBlock,
  NCLEX_BOARD_QUALITY_PRINCIPLES,
} from "./quality-spec";

/** Gold-standard calibration examples (Q1–Q10) — emulate depth and distractor design. */
export const NCLEX_CALIBRATION_EXAMPLES = `
EXAMPLE Q1 (Prioritization — post-cath retroperitoneal bleed):
Stem: 62-year-old male, 3 hours post cardiac cath via right femoral artery. HTN, smokes 1 ppd. BP 88/52, HR 118, severe low back pain 8/10 not relieved by morphine 2 mg IV. Groin soft, no hematoma.
Question: Which action should the nurse take first?
Correct: Notify the healthcare provider immediately — hypotension + tachycardia + new severe back pain = occult retroperitoneal hemorrhage (circulation emergency); pain meds alone delay life-saving intervention.

EXAMPLE Q2 (Delegation):
Stem: RN with 6 clients, 1 LPN, 2 UAPs. Tasks: vitals stable post-op D2; oral antibiotic for pneumonia; sterile dressing change new post-op with JP drain; ambulate stable knee replacement; teach new diabetic glucometer use.
Correct: Delegate scheduled oral antibiotic to LPN (in scope under RN supervision). RN retains sterile wound/drain, teaching, unstable assessment.

EXAMPLE Q3 (Airborne precautions — TB):
Stem: 45-year-old female, suspected pulmonary TB, productive cough, positive AFB smear pending, negative-pressure room.
Correct (SATA): N95 respirator + gloves; surgical mask alone is inadequate for TB droplet nuclei.

EXAMPLE Q4 (Insulin / hypoglycemia):
Stem: T2DM on insulin infusion 4 u/hr for DKA, glucose 142 mg/dL, reports shaky and sweaty.
Correct: Give 15 g fast-acting carbohydrate and recheck in 15 min — treat symptomatic hypoglycemia before giving more insulin.

EXAMPLE Q5 (Hyperkalemia + ECG):
Stem: CKD stage 4 + HF, K+ 6.8, peaked T waves, widened QRS, on spironolactone and ACE inhibitor.
Correct: IV calcium gluconate first — stabilizes cardiac membrane before K+ shift/removal measures.

EXAMPLE Q6 (HF exacerbation — ABC):
Stem: 74-year-old HFrEF, crackles to mid-scapula, RR 26, SpO2 90% on 2L, 3+ edema, JVD.
Correct: Elevate HOB 45–90° and optimize oxygenation first — airway/breathing before diuresis/education.

EXAMPLE Q7 (Postpartum teaching evaluation):
Client says breast engorgement day 3–4 requires immediate call — needs further teaching (normal lactogenesis II vs hemorrhage/infection/PPD warning signs).

EXAMPLE Q8 (Suicide risk — safety first):
Active ideation with plan, intent, firearm access, giving away possessions.
Correct: Remove means + 1:1 observation before exploration or PRN sedatives; no-harm contracts are not sufficient.

EXAMPLE Q9 (Post-op atelectasis prevention):
Obese male post-op day 1 cholecystectomy, reluctant to IS/ambulate due to pain, diminished bases.
Correct: Incentive spirometry q1–2h while awake + early ambulation (with pre-medication for pain as enabler).

EXAMPLE Q10 (Fetal monitoring — intrauterine resuscitation):
G2P1 39 wks, epidural 45 min ago, late decelerations + minimal variability, BP 98/60.
Correct: IV fluid bolus + left lateral reposition first to treat maternal hypotension from epidural sympathetic block.

WEAK vs STRONG — risk/prioritization finding stems (never reuse templated stable distractors):
WEAK: Options are "Urine output 60 mL/hr", "Pain 2/10 after analgesia", "Temp 98.4°F warm/dry" plus one acute finding.
STRONG (GI bleed): Correct = pale, cool extremities with capillary refill 3 sec (perfusion/shock). Distractors = scenario-appropriate stable findings (clear lungs, oriented ×3, soft abdomen) — NOT the same three vitals templates on every item.
STRONG (Asthma): Correct = intercostal retractions + SpO₂ 90% on room air. Distractors = strong pulses, speaking full sentences, afebrile skin — mutually exclusive ABC reasoning.
STRONG (DKA): Correct = Kussmaul respirations + fruity breath (metabolic acidosis compensation). Distractors = oriented ×3, clear lungs, brisk turgor — glucose alone is insufficient discrimination.
STRONG (C. diff): Correct = contact precautions + dedicated equipment + soap-and-water hand hygiene. Distractors = alcohol rub alone, droplet only, airborne/negative pressure — wrong transmission route.
`.trim();

export function buildNclexBoardQualityBlock(): string {
  return [
    "NCLEX-RN BOARD-QUALITY STANDARD (match calibration examples exactly):",
    `- Stems: ${NCLEX_BOARD_QUALITY_PRINCIPLES.realisticStems}`,
    `- Judgment: ${NCLEX_BOARD_QUALITY_PRINCIPLES.clinicalJudgment}`,
    `- High-yield: ${NCLEX_BOARD_QUALITY_PRINCIPLES.highYieldTopics}`,
    `- Distractors: ${NCLEX_BOARD_QUALITY_PRINCIPLES.distractors}`,
    `- Rationales: ${NCLEX_BOARD_QUALITY_PRINCIPLES.rationales}`,
    `- Difficulty: ${NCLEX_BOARD_QUALITY_PRINCIPLES.difficulty}`,
    buildNclexTopicMixBlock(),
    "",
    "CALIBRATION EXAMPLES — emulate this specificity, priority reasoning, and distractor traps:",
    NCLEX_CALIBRATION_EXAMPLES,
  ].join("\n");
}

/** System prompt for AI rewrite / curation of existing bank items. */
export function buildNclexCurationSystemPrompt(): string {
  return `You are a senior NCLEX-RN item writer (UWorld / NCSBN CJMM standard).
Rewrite ONE nursing exam item so vignette, stem, four options, and correctAnswer are fully aligned.

${buildNclexBoardQualityBlock()}

Rules:
- vignette: 2–4 sentences — age, setting, history, discriminating signs/symptoms, vitals/labs
- question: NCLEX lead-in ONLY (e.g. "Which action should the nurse take first?") — no vignette text repeated
- options: exactly 4 complete nursing actions or findings (not meta-text like "unstable ABC")
- correctAnswer: must match one option verbatim
- explanation: CJMM structure + why correct; reference pathophysiology; explain why EACH distractor fails
- clinicalReasoning: Recognize → Analyze → Prioritize → Take action → Evaluate
- distractorRationale: object keyed by EXACT option text → why wrong for THIS client
- references: 1–2 entries from allowed societies only (CDC, AHA, NCSBN, Surviving Sepsis, ISMP, ACOG, AAP) with label + citation
- Use "client" not "patient"; inclusive, professional tone
- Preserve clinical topic intent from the original when sound; fix incoherent template swaps

Return JSON:
{
  "vignette": string,
  "question": string,
  "options": [string,string,string,string],
  "correctAnswer": string,
  "explanation": string,
  "clinicalReasoning": string,
  "distractorRationale": { "option text": "rationale" },
  "references": [{ "label": string, "url"?: string, "citation"?: string }],
  "tags": string[],
  "topicCategory": string
}`;
}
