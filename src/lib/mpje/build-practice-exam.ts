import type { BankItem } from "@/lib/question-bank";
import { buildBulkQuestion } from "@/lib/bulk-question-generator";
import { prepareMpjeBankItems } from "@/lib/mpje/prepare-items";
import { MPJE_SUBJECTS } from "@/lib/subjects/mpje/subjects";
import { ensureStaticSeedsForField } from "@/lib/ensure-field-seeds";
import { sampleMpjeQuestionBankItems } from "@/lib/mpje/sample-bank";
import {
  MPJE_PRACTICE_EXAM_PRETEST_COUNT,
  MPJE_PRACTICE_EXAM_QUESTION_COUNT,
  type MpjeExamDifficulty,
  type MpjePracticeExamQuestion,
} from "./practice-exam-config";
import { getMpjeState } from "./config";

const SUBJECT_LABELS = Object.fromEntries(
  MPJE_SUBJECTS.map((s) => [s.id, s.label])
) as Record<string, string>;

const DIFFICULTY_BY_SUBJECT: Record<string, MpjeExamDifficulty> = {
  "pharmacy-ethics": "easy",
  "patient-privacy": "easy",
  "uniform-mpje": "medium",
  "dispensing-procedures": "medium",
  "pharmacy-operations": "medium",
  "federal-pharmacy-law": "hard",
  "controlled-substances": "hard",
  "compounding-regulations": "hard",
  "state-practice-act": "hard",
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function assignMpjeDifficulty(subjectId: string): MpjeExamDifficulty {
  return DIFFICULTY_BY_SUBJECT[subjectId] ?? "medium";
}

/** Adaptive-style ordering: easier items first, harder later; last 20 marked pretest. */
export function orderMpjeExamQuestions(
  items: BankItem[],
  total = MPJE_PRACTICE_EXAM_QUESTION_COUNT
): MpjePracticeExamQuestion[] {
  const buckets: Record<MpjeExamDifficulty, BankItem[]> = {
    easy: [],
    medium: [],
    hard: [],
  };

  for (const item of items) {
    const sid = item.subjectId ?? "uniform-mpje";
    buckets[assignMpjeDifficulty(sid)].push(item);
  }

  const easyCount = Math.round(total * 0.35);
  const mediumCount = Math.round(total * 0.35);
  const hardCount = total - easyCount - mediumCount;

  const ordered = [
    ...shuffle(buckets.easy).slice(0, easyCount),
    ...shuffle(buckets.medium).slice(0, mediumCount),
    ...shuffle(buckets.hard).slice(0, hardCount),
  ];

  while (ordered.length < total) {
    const pool = [...buckets.easy, ...buckets.medium, ...buckets.hard];
    ordered.push(...shuffle(pool));
    if (ordered.length > total * 2) break;
  }

  const slice = ordered.slice(0, total);
  const pretestStart = total - MPJE_PRACTICE_EXAM_PRETEST_COUNT;

  return slice.map((item, index) => {
    const subjectId = item.subjectId ?? "uniform-mpje";
    return {
      id: item.id ?? `mpje-exam-${index}`,
      subjectId,
      subjectLabel: SUBJECT_LABELS[subjectId] ?? subjectId,
      difficulty: assignMpjeDifficulty(subjectId),
      isPretest: index >= pretestStart,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      stateCode: item.stateCode ?? null,
    };
  });
}

async function fillExamPool(stateCode: string, want: number): Promise<BankItem[]> {
  await ensureStaticSeedsForField("mpje");

  const { items: sampled } = await sampleMpjeQuestionBankItems({
    stateCode,
    count: want,
  });

  const pool = [...sampled];
  const seen = new Set(pool.map((i) => i.question.trim().toLowerCase()));

  let guard = 0;
  while (pool.length < want && guard < 800) {
    const subject = MPJE_SUBJECTS[guard % MPJE_SUBJECTS.length]!;
    const generated = buildBulkQuestion("mpje", subject, guard + pool.length);
    const key = generated.question.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      if (!generated.stateCode && guard % 4 === 0) {
        generated.stateCode = stateCode;
      }
      pool.push(generated);
    }
    guard++;
  }

  const state = getMpjeState(stateCode);
  const label = state ? `${state.name} MPJE` : "MPJE pharmacy law";
  return prepareMpjeBankItems(
    pool.slice(0, want),
    { variant: "state", stateCode },
    label
  );
}

export async function buildMpjePracticeExam(
  stateCode: string
): Promise<MpjePracticeExamQuestion[]> {
  const pool = await fillExamPool(stateCode, MPJE_PRACTICE_EXAM_QUESTION_COUNT);
  return orderMpjeExamQuestions(pool);
}

export function toPublicExamQuestions(
  questions: MpjePracticeExamQuestion[]
): Omit<MpjePracticeExamQuestion, "correctAnswer" | "explanation">[] {
  return questions.map((q) => {
    const { correctAnswer: _omitA, explanation: _omitE, ...rest } = q;
    void _omitA;
    void _omitE;
    return rest;
  });
}
