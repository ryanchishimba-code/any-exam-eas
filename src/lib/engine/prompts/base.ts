/** Universal examiner rules — discipline-agnostic. Subject modules augment this layer. */
export const UNIVERSAL_EXAM_SYSTEM = `You are an expert exam creator with 20+ years experience writing high-stakes test questions (SAT, MCAT, GRE, NCLEX, NAPLEX, INBDE, professional certifications).

Generate high-quality practice questions grounded in the research brief and sources.

Rules:
- Questions must test understanding, not just recall. Use Bloom's taxonomy: remember, understand, apply, analyze — most board items should be apply or analyze.
- For MCQs: exactly 4 UNIQUE options, 1 correct, 3 plausible distractors rooted in common misconceptions or exam traps.
- Every item needs a detailed rationale: explanation, clinicalReasoning (when clinical), and distractorRationale for each wrong option.
- Use clinical vignettes (2–5 sentences) for the majority of items in clinical disciplines.
- Vary difficulty as requested; ensure items are original — do not copy real exam questions verbatim.
- Ground every question in the research brief and sources; cite references.
- Store option text without "A)" prefix; vary correct-answer position across questions.
- Mix NGN-style formats for nursing; clinical vignettes for medicine, pharmacy, and dentistry.
- Output only valid JSON.`;

export type QuestionTypePreference = "multiple_choice" | "true_false" | "short_answer";

export function buildExpertExamUserPrompt(params: {
  topicOrNotes: string;
  questionCount: number;
  difficulty: string;
  questionTypes?: QuestionTypePreference[];
  subjectExam?: string;
  fieldBlock?: string;
  scopeBlock?: string;
  researchBrief?: string;
  context?: string;
}): string {
  const types =
    params.questionTypes?.length
      ? params.questionTypes.join(", ")
      : "multiple_choice (primary), true_false or short_answer if requested";

  return `Generate ${params.questionCount} high-quality practice questions.

User topic / notes:
${params.topicOrNotes}

Number of questions: ${params.questionCount}
Difficulty: ${params.difficulty}
Question types: ${types}
Subject / exam: ${params.subjectExam ?? "General"}

${params.fieldBlock ?? ""}
${params.scopeBlock ?? ""}

${params.researchBrief ? `RESEARCH BRIEF:\n${params.researchBrief}\n` : ""}
${params.context ? `SOURCES:\n${params.context}\n` : ""}

Requirements:
1. Original items only — no copied real exam questions.
2. MCQ: 4 options, 1 correct, distractors = plausible misconceptions.
3. True/false: unambiguous stem; explanation clarifies the principle.
4. Short answer: concise acceptable answer key in correctAnswer.
5. Tag each question with bloomLevel: "remember" | "understand" | "apply" | "analyze".

Return valid JSON:
{
  "title": string,
  "field": string,
  "topic": string,
  "studyNotes": string,
  "sourcesReviewed": number,
  "questions": [
    {
      "id": number,
      "type": "multiple_choice" | "true_false" | "short_answer",
      "question": string,
      "options": [string, string, string, string] | [{ "text": string, "isCorrect": boolean }],
      "correctAnswer": string,
      "explanation": string,
      "bloomLevel": string,
      "tags": string[],
      "highYield": boolean
    }
  ]
}`;
}

export function buildUniversalScopeBlock(params: {
  subjectLabel: string;
  field: string;
  topic: string;
  textbookRefs: string;
  examFocus: string;
}): string {
  return `
STRICT SUBJECT SCOPE (mandatory):
- Subject: ${params.subjectLabel}
- ONLY generate questions about this subject. Do NOT include questions from other subjects in ${params.field}.
- Textbooks to align with: ${params.textbookRefs}
- Exam focus for this subject: ${params.examFocus}
- Optional sub-focus within subject: ${params.topic}`;
}

export function buildUniversalExamUserPrompt(params: {
  questionCount: number;
  difficulty: string;
  fieldBlock: string;
  scopeBlock: string;
  researchBrief: string;
  sourceCount: number;
  context: string;
  subjectLabel: string;
  extraRequirements?: string;
  jsonShapeExtra?: string;
}): string {
  return `Create a ${params.questionCount}-question practice exam.

Difficulty: ${params.difficulty}
${params.fieldBlock}
${params.scopeBlock}

RESEARCH BRIEF (synthesized from OER textbooks + web — treat as primary guide):
${params.researchBrief}

RAW SOURCES (${params.sourceCount} documents reviewed):
${params.context}

Requirements:
1. Follow HIGH-YIELD BOARD EXAM REQUIREMENTS below — blueprint weights, vignettes, distractors, rationales, and NGN mix.
2. Every question must be clearly about ${params.subjectLabel} — reject cross-topic drift.
3. No duplicate concepts; cover breadth within this subject per blueprint allocation.
4. ${params.difficulty === "hard" ? "Include multi-step clinical reasoning and competing-priority scenarios." : "Fair single-best-answer items with strong but fair distractors."}
5. studyNotes: summarize coverage (do not reveal answers in studyNotes).
6. Tag each question with bloomLevel: remember | understand | apply | analyze.
${params.extraRequirements ?? ""}

Return valid JSON:
{
  "title": string,
  "field": string,
  "topic": string,
  "studyNotes": string,
  "sourcesReviewed": number
${params.jsonShapeExtra ?? `,
  "questions": [
    {
      "id": number,
      "type": "multiple_choice",
      "question": string,
      "options": [string, string, string, string],
      "correctAnswer": string,
      "explanation": string,
      "bloomLevel": string (optional),
      "solutionSteps": string[] (optional),
      "tags": string[],
      "highYield": boolean
    }
  ]`}
}`;
}
