/**
 * Master prompts and schemas for board-exam rationale generation.
 * Used at generation time, curation, and on-demand enrichment.
 */
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { listWrongBankOptions } from "../rationale/validate-rationale";

/** Structured rationale returned by the AI — single source of truth before storage. */
export type StructuredRationale = {
  whyCorrect: {
    /** One clear sentence: why this is the best answer. */
    headline: string;
    /** 2–4 short bullets breaking down the core logic. */
    conceptBreakdown: string[];
    /** Real-world / bedside relevance — "why this matters in practice". */
    clinicalContext: string;
  };
  whyIncorrect: Array<{
    /** Must match an actual wrong option text exactly. */
    option: string;
    /** What trap or misconception leads students here. */
    misconception: string;
    /** Gentle, specific correction. */
    correction: string;
    /** Tie back to the core concept being tested. */
    conceptLink: string;
  }>;
  /** One memorable sentence — the single thing to remember. */
  keyTakeaway: string;
  /** Optional mnemonic, analogy, or simple rule. */
  memoryHook?: string;
};

export const STRUCTURED_RATIONALE_JSON_SCHEMA = `{
  "whyCorrect": {
    "headline": "string — one clear sentence why the keyed answer is correct",
    "conceptBreakdown": ["string — 2 to 4 short bullets, plain language"],
    "clinicalContext": "string — why this matters at the bedside / in practice"
  },
  "whyIncorrect": [
    {
      "option": "string — exact wrong option text from the question",
      "misconception": "string — common trap or wrong thinking",
      "correction": "string — why this option fails here",
      "conceptLink": "string — link back to the core concept"
    }
  ],
  "keyTakeaway": "string — one bold, memorable sentence",
  "memoryHook": "string (optional) — mnemonic, analogy, or simple rule"
}`;

const EXAM_VOICE: Record<string, string> = {
  nursing:
    "NCLEX-RN: prioritize safety, ABCs, nursing scope, delegation boundaries, and Clinical Judgment (recognize → analyze → prioritize → act). Use patient-centered language.",
  pharmacy:
    "NAPLEX: emphasize mechanism → indication → monitoring → interaction traps. Clarify when an option is true in general but wrong for this patient.",
  "usmle-step-1":
    "USMLE Step 1: link pathophysiology and mechanism to the finding. Define jargon briefly when used.",
  "usmle-step-2":
    "USMLE Step 2 CK: next-best-step and management priority. Explain why a true statement is not the single best answer.",
  "usmle-step-3":
    "USMLE Step 3: ambulatory / CCMS context, disposition, and first-line management under time pressure.",
  pance: "PANCE: organ-system diagnosis and first-line treatment in primary care.",
  "aanp-fnp": "AANP FNP: outpatient primary care, scope, and guideline-aligned management.",
  "npte-pt": "NPTE-PT: intervention choice, contraindications, and functional goals.",
};

function resolveExamVoice(fieldId: string): string {
  const normalized = normalizeFieldId(fieldId);
  return EXAM_VOICE[normalized] ?? EXAM_VOICE[fieldId] ?? "Board exam: test application, not trivia.";
}

/**
 * Master system prompt — use for every rationale generation call site.
 */
export function buildRationaleMasterSystemPrompt(fieldId: string): string {
  const examVoice = resolveExamVoice(fieldId);

  return `You are a world-class nursing, pharmacy, and medical educator writing rationales for AnyExamEasy.com — a licensure exam prep platform.

Your job is to help stressed students LEARN, not just see an answer key. Every rationale must feel like a calm, expert tutor sitting beside them.

## Exam context
${examVoice}

## Non-negotiable process (think before you write)
1. Read the FULL vignette, stem, every option, and the keyed correct answer.
2. Identify the ONE concept being tested (e.g., perfusion priority, drug interaction, scope of practice).
3. For each wrong option, name the specific misconception — never write "this is incorrect" without saying WHY.
4. Verify clinical accuracy. If uncertain, state the safest board-style reasoning.

## Required output structure (JSON only)
Return a single JSON object matching this schema:
${STRUCTURED_RATIONALE_JSON_SCHEMA}

## Section rules

### 1. Why the correct answer is right (whyCorrect)
- headline: Direct, confident, plain English. No hedging.
- conceptBreakdown: 2–4 bullets. Bold key terms with **double asterisks** inside strings when helpful.
- clinicalContext: 1–2 sentences on real practice ("On the unit, this means…").

### 2. Why each wrong option is wrong (whyIncorrect) — MOST IMPORTANT
- Include EVERY wrong option from the question (all options except the correct answer).
- option text must match the provided option string EXACTLY.
- misconception: Name the trap ("Students pick this because…").
- correction: Specific to THIS patient/scenario — not generic.
- conceptLink: One sentence tying the distractor back to the lesson.

### 3. Key takeaway
- One sentence the student can recall on exam day.
- Start with an action or rule when possible ("When you see X, think Y first.").

### 4. Memory hook (optional but encouraged)
- Short mnemonic, analogy, or if/then rule. Skip if nothing natural fits.

## Tone & style
- Encouraging, never condescending. Students are tired and anxious.
- Short paragraphs. Bullets welcome in conceptBreakdown only.
- Reading level: clear college / early professional — define jargon in parentheses on first use.
- Never copy real NCSBN/NBME/NABP item text verbatim.
- NEVER use: "Obviously", "Simply", "As you know", or vague phrases like "does not apply here" without explanation.

## Quality bar — reject your own draft if:
- Any wrong option is missing from whyIncorrect.
- Any correction could apply to a different question (too generic).
- The key takeaway repeats the headline word-for-word.
- Jargon appears without a brief plain-language gloss.

Return valid JSON only. No markdown fences.`;
}

export type RationaleGenerationInput = {
  fieldId: string;
  vignette?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  /** Existing explanation to preserve facts from (optional). */
  existingExplanation?: string;
  topicCategory?: string;
  subjectId?: string;
  itemType?: string;
  tags?: string[];
};

export function buildRationaleUserPrompt(input: RationaleGenerationInput): string {
  const wrongOptions = listWrongBankOptions(input.options, input.correctAnswer);

  return [
    "Generate a complete structured rationale for this item.",
    "",
    input.topicCategory ? `Blueprint / topic: ${input.topicCategory}` : "",
    input.subjectId ? `Subject: ${input.subjectId}` : "",
    input.itemType ? `Format: ${input.itemType}` : "",
    input.tags?.length ? `Tags: ${input.tags.join(", ")}` : "",
    "",
    "=== VIGNETTE ===",
    input.vignette?.trim() || "(none — stem-only item)",
    "",
    "=== STEM ===",
    input.question.trim(),
    "",
    "=== OPTIONS ===",
    ...input.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
    "",
    `=== CORRECT ANSWER ===`,
    input.correctAnswer.trim(),
    "",
    `=== WRONG OPTIONS (address each in whyIncorrect) ===`,
    wrongOptions.map((o) => `- ${o}`).join("\n"),
    input.existingExplanation
      ? `\n=== EXISTING RATIONALE (preserve accurate facts; improve clarity) ===\n${input.existingExplanation.slice(0, 1200)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function rationaleInputFromExamQuestion(
  question: ExamQuestion,
  fieldId: string
): RationaleGenerationInput {
  return {
    fieldId,
    vignette: question.vignette,
    question: question.question,
    options: question.options ?? [],
    correctAnswer: question.correctAnswer,
    existingExplanation: question.explanation,
    topicCategory: question.topicCategory,
    tags: question.tags,
    itemType: question.type,
  };
}

export function rationaleInputFromBankItem(item: BankItem, fieldId: string): RationaleGenerationInput {
  return {
    fieldId,
    vignette: item.vignette ?? item.scenario ?? undefined,
    question: item.question,
    options: item.options ?? [],
    correctAnswer: item.correctAnswer,
    existingExplanation: item.explanation,
    topicCategory: item.topicCategory,
    subjectId: item.subjectId,
    itemType: item.itemType,
    tags: item.tags,
  };
}
