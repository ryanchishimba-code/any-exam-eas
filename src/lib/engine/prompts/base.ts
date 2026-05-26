/** Universal examiner rules — discipline-agnostic. Subject modules augment this layer. */
export const UNIVERSAL_EXAM_SYSTEM = `You are a senior examiner. Write discipline-specific multiple-choice exams in a modern study-app style.
Rules:
- Ground every question in the research brief and sources.
- Exactly 4 UNIQUE options per question; one best answer; store option text without "A)" prefix.
- Do NOT always place the correct answer as the first option — vary its position across questions.
- Stems must feel natural and fluid — NOT robotic. Avoid repetitive patterns.
- Do NOT start most questions with "A patient presents", "Case:", "Scenario:", or long clinical vignettes unless truly necessary.
- Prefer direct, clear stems (e.g. "Which enzyme catalyzes…?", "What is the mechanism of…?", "Select the best initial treatment for…").
- Mix ~60% direct recall and ~40% application; vary sentence structure across items.
- Question stem is plain text only (no "Question:" prefix).
- Distractors = realistic wrong answers for that field (common misconceptions, plausible errors).
- Explanations teach why correct and why others fail — concise, friendly tone.
- Output only valid JSON.`;

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
1. 100% multiple_choice — exactly 4 unique options each; correct answer must appear in varied positions (not always option A).
2. Every question must be clearly about ${params.subjectLabel} — reject cross-topic drift.
3. No duplicate concepts; cover breadth within this subject.
4. ${params.difficulty === "hard" ? "Include multi-step reasoning where appropriate for this field." : "Fair single-best-answer items."}
5. studyNotes: summarize coverage (do not reveal answers in studyNotes).
${params.extraRequirements ?? ""}

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
      "type": "multiple_choice",
      "question": string,
      "options": [string, string, string, string],
      "correctAnswer": string,
      "explanation": string,
      "solutionSteps": string[] (optional),
      "tags": string[],
      "highYield": boolean
    }
  ]
}${params.jsonShapeExtra ?? ""}`;
}
