import { and, desc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { generatedQuestions } from "@/db/schema";
import { createId } from "@/lib/id";
import { generateExam, type ExamQuestion } from "@/lib/ai";
import { gatherStudyMaterial } from "@/lib/research";
import { getExamHub, type ExamSlug } from "@/lib/exams/catalog";
import { BATCH_DIVERSITY_USER_REMINDER } from "@/lib/engine/prompts/batch-diversity";

const EXAM_SYSTEM_PROMPTS: Record<ExamSlug, string> = {
  nclex:
    "You are an NCLEX expert. Generate high-yield clinical judgment items with CJMM-aligned rationales. Include bow-tie, matrix, SATA, and unfolding case formats when appropriate. Prioritize patient safety and ABCs.",
  usmle:
    "You are a USMLE item writer. Create clinical vignettes with mechanism, pathophysiology, and next-best-step logic. Distractors must be competitive and educationally valuable. No consecutive similar style, answer choices, or clinical presentation; every batch of 10 must vary format and structure.",
  naplex:
    "You are a NAPLEX expert. Emphasize calculations, patient cases, drug interactions, and counseling. Show work for math items and cite monitoring parameters. No consecutive similar style, answer choices, or clinical presentation; every batch of 10 must vary format and structure.",
  pance:
    "You are a PANCE item writer. Create clinical vignettes aligned to the NCCPA blueprint — cardiovascular, pulmonary, GI, MSK, ID, neurology, psychiatry, reproductive, endocrine, and professional practice. Emphasize next-best diagnostic step and first-line management. No consecutive similar style, answer choices, or clinical presentation; every batch of 10 must vary format and structure.",
  top500:
    "You are a pharmacology educator. Generate high-yield drug flashcard-style MCQs for the Top 300/500 medications with brand/generic, class, indication, and adverse effects.",
};

export type GenerateQuestionsInput = {
  userId: string;
  examType: ExamSlug;
  topic: string;
  questionCount?: number;
  source?: "topic" | "textbook" | "weak_areas";
  textbookExcerpt?: string;
};

function mapExamQuestion(q: ExamQuestion, index: number) {
  return {
    questionText: q.vignette ? `${q.vignette}\n\n${q.question}` : q.question,
    options: q.options ?? [],
    answer: q.correctAnswer,
    explanation: q.explanation,
    metadata: {
      type: q.type,
      ngnFormat: q.ngnFormat,
      topicCategory: q.topicCategory,
      index,
    },
  };
}

export async function generateAndStoreQuestions(input: GenerateQuestionsInput) {
  const hub = getExamHub(input.examType);
  if (!hub) throw new Error("Invalid exam type");

  const field = hub.fieldId;
  const count = Math.min(20, Math.max(3, input.questionCount ?? 5));

  const notesBlock = input.textbookExcerpt
    ? `\n\nTEXTBOOK EXCERPT:\n${input.textbookExcerpt.slice(0, 12_000)}`
    : "";

  const { sources, researchBrief } = await gatherStudyMaterial(field, input.topic).catch(() => ({
    sources: [],
    researchBrief: input.topic,
  }));

  const enrichedBrief = `${researchBrief}${notesBlock}\n\n${EXAM_SYSTEM_PROMPTS[input.examType]}\n${BATCH_DIVERSITY_USER_REMINDER}`;

  const exam = await generateExam({
    field,
    topic: input.topic,
    difficulty: "medium",
    questionCount: count,
    sources,
    researchBrief: enrichedBrief,
  });

  const db = requireDb();
  const stored = [];

  for (let i = 0; i < exam.questions.length; i++) {
    const mapped = mapExamQuestion(exam.questions[i], i);
    const id = createId();
    await db.insert(generatedQuestions).values({
      id,
      userId: input.userId,
      examType: input.examType,
      topic: input.topic,
      questionText: mapped.questionText,
      options: mapped.options,
      answer: mapped.answer,
      explanation: mapped.explanation,
      source: input.source ?? "topic",
      metadata: mapped.metadata,
    });
    stored.push({ id, ...mapped });
  }

  return { questions: stored, examTitle: exam.title };
}

export async function listGeneratedQuestions(userId: string, examType: string, limit = 50) {
  const db = requireDb();
  return db
    .select()
    .from(generatedQuestions)
    .where(
      and(eq(generatedQuestions.userId, userId), eq(generatedQuestions.examType, examType))
    )
    .orderBy(desc(generatedQuestions.createdAt))
    .limit(limit);
}
