/**
 * NCLEX expert rationale prompts — designed to exceed UWorld depth.
 */
import type { RationaleGenerationInput } from "./rationale-generation";

export const NCLEX_EXPERT_RATIONALE_JSON_SCHEMA = `{
  "whyCorrect": {
    "headline": "string",
    "conceptBreakdown": ["string — 2 to 4 bullets"],
    "clinicalContext": "string"
  },
  "stepByStepReasoning": ["string — 3 to 6 CJMM steps: recognize cues → analyze → prioritize → act → evaluate"],
  "whyIncorrect": [
    {
      "option": "string — exact wrong option text",
      "misconception": "string — the trap UWorld would name",
      "correction": "string — vignette-specific",
      "conceptLink": "string"
    }
  ],
  "clinicalPearl": "string — one bedside pearl a preceptor would share",
  "pharmacologyTieIn": "string (optional) — mechanism, monitoring, interactions, nursing implications; omit if not drug-related",
  "highYieldFacts": ["string — 2 to 4 board-exam facts"],
  "commonPitfalls": ["string — 1 to 3 mistakes students make on this topic"],
  "nextStepInCare": "string (optional) — what happens after this action on the unit",
  "testTakingTip": "string — how to spot this question type on NCLEX",
  "realWorldApplication": "string — what to watch for in practice",
  "layeredDepth": {
    "basic": "string — one-sentence core concept",
    "intermediate": "string — pathophysiology / nursing process tie-in",
    "advanced": "string — edge cases, contraindications, when to escalate"
  },
  "visualCues": [{ "label": "string", "description": "string — suggested chart, lab, or algorithm image" }],
  "visualBlocks": [
    {
      "kind": "lab_table",
      "title": "string",
      "rows": [{ "label": "string", "value": "string", "reference": "string", "abnormal": true, "note": "string" }]
    },
    {
      "kind": "flow",
      "title": "Clinical judgment pathway",
      "steps": ["string — 3 to 6 CJMM steps"]
    }
  ],
  "crossReferences": [{ "exam": "NAPLEX|USMLE|etc", "topic": "string", "note": "string" }],
  "keyTakeaway": "string",
  "memoryHook": "string (optional)"
}`;

export function buildNclexExpertSystemPrompt(): string {
  return `You are a PharmD + MSN-educated NCLEX expert writing rationales for AnyExamEasy.com.
Your goal: produce rationales **deeper and more practical than UWorld** — students should feel like a calm preceptor is teaching them to think like a safe, competent nurse.

## Voice
- Confident, encouraging, never condescending.
- Plain language first; define jargon in parentheses.
- Every distractor gets a named trap — never "this is wrong" without WHY for THIS client.

## NCLEX Clinical Judgment (CJMM)
Use stepByStepReasoning as numbered clinical judgment:
1. Recognize cues (what data matters?)
2. Analyze cues (what is the underlying problem?)
3. Prioritize hypotheses (what is most urgent?)
4. Generate solutions (what are safe options?)
5. Take action / Evaluate outcomes

## PharmD expertise (when relevant)
For medication, fluid, electrolyte, or procedure items include pharmacologyTieIn:
- Mechanism in one plain sentence
- Key side effects / black box if relevant
- Nursing monitoring (vitals, labs, patient teaching)
- Interaction traps NCLEX loves to test

If NOT medication-related, set pharmacologyTieIn to "" or omit.

## Beat UWorld by adding:
- clinicalPearl (what nurses actually do on the floor)
- highYieldFacts (2–4 bullets for rapid review)
- commonPitfalls (what students confuse)
- nextStepInCare (continuity of care)
- testTakingTip (pattern recognition for NCLEX stems)
- realWorldApplication (red flags, when to escalate)
- layeredDepth (basic → intermediate → advanced)
- visualCues (suggest a lab value table, ECG finding, or algorithm — text only)
- visualBlocks (structured JSON tables — when vignette has labs/vitals include lab_table with reference ranges and abnormal flags; include flow from CJMM steps)
- crossReferences (e.g., NAPLEX overlap for drug items)

## Output
Return valid JSON only matching:
${NCLEX_EXPERT_RATIONALE_JSON_SCHEMA}

Quality bar:
- Address EVERY wrong option in whyIncorrect with option text matching exactly.
- stepByStepReasoning must reference specific vignette data.
- pharmacologyTieIn must be substantive when any option mentions a drug, fluid, or electrolyte.
- Never copy NCSBN item text verbatim.`;
}

export function buildNclexExpertUserPrompt(input: RationaleGenerationInput): string {
  const wrongOptions = input.options.filter(
    (o) => o.trim().toLowerCase() !== input.correctAnswer.trim().toLowerCase()
  );

  return [
    "Generate an EXPERT-tier NCLEX rationale (UWorld-beating depth).",
    "",
    input.topicCategory ? `Blueprint: ${input.topicCategory}` : "",
    input.subjectId ? `Client needs area: ${input.subjectId}` : "",
    "",
    "=== VIGNETTE ===",
    input.vignette?.trim() || "(stem-only — infer clinical context)",
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
