/**
 * AANP FNP expert rationale prompts — BoardVitals/APEA-caliber depth, NP voice.
 */
import type { RationaleGenerationInput } from "./rationale-generation";
import { listWrongBankOptions } from "../rationale/validate-rationale";

export const AANP_FNP_EXPERT_RATIONALE_JSON_SCHEMA = `{
  "whyCorrect": {
    "headline": "string",
    "conceptBreakdown": ["string — 2 to 4 bullets"],
    "clinicalContext": "string"
  },
  "stepByStepReasoning": ["string — 3 to 6 steps using Assess → Diagnose → Plan → Evaluate"],
  "whyIncorrect": [
    {
      "option": "string — exact wrong option text",
      "misconception": "string — the trap students fall into",
      "correction": "string — vignette-specific",
      "conceptLink": "string"
    }
  ],
  "clinicalPearl": "string — one preceptor pearl for primary care NP practice",
  "pharmacologyTieIn": "string (optional) — mechanism, monitoring, interactions, prescribing implications; omit if not drug-related",
  "highYieldFacts": ["string — 2 to 4 board-exam facts with guideline cues when relevant"],
  "commonPitfalls": ["string — 1 to 3 mistakes FNP candidates make on this topic"],
  "nextStepInCare": "string (optional) — follow-up, referral, or monitoring after this decision",
  "testTakingTip": "string — how to spot this question type on AANP FNP",
  "realWorldApplication": "string — red flags, when to escalate or refer",
  "layeredDepth": {
    "basic": "string — one-sentence core concept",
    "intermediate": "string — guideline / differential tie-in",
    "advanced": "string — lifespan edge cases, comorbidities, when not to treat empirically"
  },
  "visualCues": [{ "label": "string", "description": "string — suggested ECG, derm map, otoscopy, lab table, or algorithm" }],
  "visualBlocks": [
    {
      "kind": "lab_table",
      "title": "string",
      "rows": [{ "label": "string", "value": "string", "reference": "string", "abnormal": true, "note": "string" }]
    },
    {
      "kind": "flow",
      "title": "NP clinical pathway",
      "steps": ["string — 3 to 6 Assess→Diagnose→Plan→Evaluate steps"]
    },
    {
      "kind": "comparison",
      "title": "string",
      "headers": ["Feature", "A", "B"],
      "rows": [["string", "string", "string"]]
    }
  ],
  "crossReferences": [{ "exam": "NCLEX|USMLE|NAPLEX|etc", "topic": "string", "note": "string" }],
  "keyTakeaway": "string",
  "memoryHook": "string (optional)"
}`;

export function buildAanpFnpExpertSystemPrompt(): string {
  return `You are an experienced Family Nurse Practitioner (FNP) educator and board-prep author writing rationales for AnyExamEasy.com.
Your goal: produce rationales that match or beat BoardVitals / APEA MyQBank depth — students should feel a calm NP preceptor teaching safe, guideline-aware primary care.

## Voice
- Confident, practical, never condescending.
- Speak as an FNP: Assess → Diagnose → Plan → Evaluate across the lifespan.
- Plain language first; define jargon briefly.
- Every distractor gets a named trap — never "this is wrong" without WHY for THIS patient.

## AANP FNP clinical reasoning
Use stepByStepReasoning as numbered NP process:
1. Assess (what history/exam/labs matter?)
2. Diagnose / prioritize differentials (what is most likely / most urgent?)
3. Plan (first-line Rx, non-pharm, counseling — cite guideline families when relevant: ADA, ACC/AHA, GINA/GOLD, USPSTF, IDSA, CDC)
4. Evaluate / follow-up (monitoring, red flags, referral thresholds)

Do NOT invent official AANPCB item text or claim AANP endorsement. Do NOT invent precise guideline year numbers unless you are highly confident; prefer "current ADA / ACC guidance" style.

## Pharmacology (when relevant)
For medication items include pharmacologyTieIn:
- Mechanism in one plain sentence
- Key adverse effects / black box if relevant
- Monitoring (labs, vitals, follow-up)
- Prescribing traps AANP loves (renal dose, Beers, pregnancy, interactions)

If NOT medication-related, set pharmacologyTieIn to "" or omit.

## Beat commodity QBanks by adding:
- clinicalPearl (what NPs actually do in clinic)
- highYieldFacts (2–4 bullets for rapid review)
- commonPitfalls (what FNP candidates confuse)
- nextStepInCare (continuity / referral)
- testTakingTip (stem patterns for AANP-style items)
- realWorldApplication (red flags, when to escalate)
- layeredDepth (basic → intermediate → advanced)
- visualCues / visualBlocks (labs, comparison tables, ADPE flow)
- crossReferences (NCLEX overlap for nursing safety; USMLE for pathophysiology)

## Output
Return valid JSON only matching:
${AANP_FNP_EXPERT_RATIONALE_JSON_SCHEMA}

Quality bar:
- Address EVERY wrong option in whyIncorrect with option text matching exactly.
- stepByStepReasoning must reference specific vignette data (age, findings, meds, labs).
- pharmacologyTieIn must be substantive when any option mentions a drug.
- Prefer lifespan-aware teaching (peds / adult / geri / women's health) when the vignette provides age/sex context.
- Never copy proprietary AANPCB or competitor item text.`;
}

export function buildAanpFnpExpertUserPrompt(input: RationaleGenerationInput): string {
  const wrongOptions = listWrongBankOptions(input.options, input.correctAnswer);

  return [
    "Generate an EXPERT-tier AANP FNP rationale (BoardVitals/APEA-caliber depth).",
    "",
    input.topicCategory ? `Blueprint / topic: ${input.topicCategory}` : "",
    input.subjectId ? `Clinical system / subject: ${input.subjectId}` : "",
    "",
    "=== VIGNETTE ===",
    input.vignette?.trim() || "(stem-only — infer primary-care context)",
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
    "=== WRONG OPTIONS TO ADDRESS (exact text) ===",
    ...wrongOptions.map((o) => `- ${o}`),
    "",
    "Return JSON only.",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
