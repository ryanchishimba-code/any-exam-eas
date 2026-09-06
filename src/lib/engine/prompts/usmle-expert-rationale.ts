/**
 * USMLE expert rationale prompts — attending-level depth for Steps 1–3.
 */
import type { RationaleGenerationInput } from "./rationale-generation";
import { listWrongBankOptions } from "../rationale/validate-rationale";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";

export const USMLE_EXPERT_RATIONALE_JSON_SCHEMA = `{
  "whyCorrect": {
    "headline": "string — one crisp sentence naming the diagnosis or next step",
    "conceptBreakdown": ["string — 2 to 4 bullets: mechanism or clinical logic"],
    "clinicalContext": "string — tie the vignette data to the correct answer"
  },
  "stepByStepReasoning": ["string — 3 to 6 Step-aware reasoning steps (see system prompt)"],
  "whyIncorrect": [
    {
      "option": "string — exact wrong option text",
      "misconception": "string — the named trap (e.g. confusing similar organisms, premature closure)",
      "correction": "string — vignette-specific why this fails HERE",
      "conceptLink": "string — the high-yield concept that separates this from correct"
    }
  ],
  "clinicalPearl": "string — one bedside pearl a chief resident would underline",
  "pharmacologyTieIn": "string (optional) — MOA, kinetics, key AE, when relevant; omit if not drug-related",
  "highYieldFacts": ["string — 2 to 4 board-exam facts"],
  "commonPitfalls": ["string — 1 to 3 mistakes students make on this topic"],
  "nextStepInCare": "string (optional) — what follows after this answer in real management",
  "testTakingTip": "string — how NBME-style stems signal this concept",
  "realWorldApplication": "string — what to watch for on wards / in clinic",
  "layeredDepth": {
    "basic": "string — one-sentence core concept",
    "intermediate": "string — pathophysiology or differential tie-in",
    "advanced": "string — edge cases, contraindications, when to escalate"
  },
  "visualCues": [{ "label": "string", "description": "string — suggested lab table, pathway, or comparison" }],
  "visualBlocks": [
    {
      "kind": "lab_table",
      "title": "string",
      "rows": [{ "label": "string", "value": "string", "reference": "string", "abnormal": true, "note": "string" }]
    },
    {
      "kind": "flow",
      "title": "Clinical reasoning pathway",
      "steps": ["string — 3 to 6 reasoning steps"]
    }
  ],
  "crossReferences": [{ "exam": "Step1|Step2CK|Step3|NCLEX|NAPLEX", "topic": "string", "note": "string" }],
  "keyTakeaway": "string",
  "memoryHook": "string (optional)"
}`;

export type UsmleExpertStepTone = "step1" | "step2" | "step3";

export function resolveUsmleExpertStepTone(fieldId: string): UsmleExpertStepTone {
  if (fieldId === "usmle-step-1") return "step1";
  if (fieldId === "usmle-step-3") return "step3";
  return "step2";
}

function stepReasoningSpine(tone: UsmleExpertStepTone): string {
  switch (tone) {
    case "step1":
      return `## Step 1 reasoning spine (stepByStepReasoning)
1. Anatomy / physiology baseline relevant to the vignette
2. Pathogenesis / mechanism of disease or drug action
3. How that mechanism produces the presentation / lab / histo finding
4. Why the correct option uniquely matches that chain
5. (Optional) Classic correlate students confuse with this entity`;
    case "step3":
      return `## Step 3 reasoning spine (stepByStepReasoning) — CCS-style management
1. Urgency / stability (ABCs, time-sensitive threats)
2. Immediate workup or stabilizing action
3. Targeted management sequence (orders that matter now)
4. Monitoring / response criteria
5. Disposition or follow-up / when to escalate
Use nextStepInCare for what happens after this decision.`;
    default:
      return `## Step 2 CK reasoning spine (stepByStepReasoning)
1. Recognize key cues in the vignette
2. Build a focused differential
3. Identify the most likely diagnosis or problem
4. Choose the next best diagnostic or therapeutic step
5. (Optional) Anticipated complication or follow-up`;
  }
}

export function buildUsmleExpertSystemPrompt(fieldId: string): string {
  const tone = resolveUsmleExpertStepTone(fieldId);
  const step =
    isUsmleFieldId(fieldId) ? usmleStepDefinition(fieldId) : undefined;
  const examLabel = step?.name ?? "USMLE";

  return `You are a board-certified physician and decorated medical educator writing expert rationales for AnyExamEasy.com (${examLabel}).
Your goal: produce rationales **deeper and more clinically precise than UWorld** — students should feel like an attending is teaching at the whiteboard after rounds.

## Voice
- Attending-level: precise, calm, never condescending.
- Plain language first; define jargon in parentheses.
- Anchor every claim to THIS vignette (ages, labs, timeline, exam findings).
- Every distractor gets a **named trap** — never "this is wrong" without WHY for THIS patient.
- Do not claim affiliation with NBME/FSMB or predict exam pass/fail.

${stepReasoningSpine(tone)}

## Pharmacology (when relevant)
For drug, toxin, or electrolyte items include pharmacologyTieIn:
- Mechanism in one plain sentence
- Key adverse effects / contraindications if tested
- Monitoring or interaction traps boards love
If NOT medication-related, set pharmacologyTieIn to "" or omit.

## Beat thin explanations by adding:
- clinicalPearl (one chief-resident bedside fact)
- highYieldFacts (2–4 bullets for rapid review)
- commonPitfalls (what students confuse)
- nextStepInCare (continuity of management — especially Step 2/3)
- testTakingTip (how NBME-style stems telegraph this concept)
- realWorldApplication (ward/clinic red flags)
- layeredDepth (basic → intermediate → advanced)
- visualCues / visualBlocks when labs or algorithms help (text only)
- crossReferences (other Steps or related boards when useful)

## Output
Return valid JSON only matching:
${USMLE_EXPERT_RATIONALE_JSON_SCHEMA}

Quality bar:
- Address EVERY wrong option in whyIncorrect with option text matching exactly.
- stepByStepReasoning must reference specific vignette data.
- whyCorrect.clinicalContext must explain why THIS patient matches the correct answer.
- clinicalPearl must be a concrete bedside fact, not a restatement of the headline.
- Never invent labs or findings not present in the vignette.`;
}

export function buildUsmleExpertUserPrompt(input: RationaleGenerationInput): string {
  const wrongOptions = listWrongBankOptions(input.options, input.correctAnswer);
  const tone = resolveUsmleExpertStepTone(input.fieldId);
  const stepLabel =
    tone === "step1" ? "Step 1" : tone === "step3" ? "Step 3" : "Step 2 CK";

  return [
    `Generate an EXPERT-tier ${stepLabel} rationale (attending-level depth).`,
    "",
    input.topicCategory ? `Organ system / topic: ${input.topicCategory}` : "",
    input.subjectId ? `Subject: ${input.subjectId}` : "",
    `Field: ${input.fieldId}`,
    "",
    "=== VIGNETTE ===",
    input.vignette?.trim() || "(stem-only — infer clinical context carefully)",
    "",
    "=== STEM ===",
    input.question.trim(),
    "",
    "=== OPTIONS ===",
    ...input.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
    "",
    "=== CORRECT ANSWER ===",
    input.correctAnswer.trim(),
    "",
    "=== WRONG OPTIONS (each required in whyIncorrect) ===",
    wrongOptions.map((o) => `- ${o}`).join("\n"),
    input.existingExplanation
      ? `\n=== EXISTING RATIONALE (preserve accurate clinical facts; expand depth) ===\n${input.existingExplanation.slice(0, 2000)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
