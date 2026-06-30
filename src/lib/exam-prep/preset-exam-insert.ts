/**
 * Insert QA-validated preset exams (link existing bank rows only).
 */
import type { PrismaClient } from "@prisma/client";
import { presetStepLevelForComposeSlug } from "./preset-exam-config";

export type PresetExamInsertParams = {
  examSlug: string;
  examNumber: number;
  title: string;
  questionCount: number;
  questionIds: string[];
  batchId: string;
  qaPassed: boolean;
  qaReport?: unknown;
  blueprintSummary?: Record<string, number>;
};

export type PresetExamInsertResult = {
  examId: string;
  linked: number;
};

export async function insertValidatedPresetExam(
  prisma: PrismaClient,
  params: PresetExamInsertParams
): Promise<PresetExamInsertResult> {
  const links = params.questionIds
    .map((questionBankItemId, index) => ({
      sortOrder: index + 1,
      questionBankItemId,
    }))
    .filter((l) => l.questionBankItemId);

  const common = {
    title: params.title,
    questionCount: params.questionCount,
    batchId: params.batchId,
    qaPassed: params.qaPassed,
    qaReport: params.qaReport ?? { source: "exam-qa-engine" },
    active: params.qaPassed && links.length === params.questionCount,
  };

  switch (params.examSlug) {
    case "nclex": {
      const exam = await prisma.nclexFullPracticeExam.upsert({
        where: { examNumber: params.examNumber },
        create: {
          examNumber: params.examNumber,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
        update: {
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
      });
      await prisma.nclexFullPracticeExamQuestion.deleteMany({ where: { examId: exam.id } });
      if (links.length) {
        await prisma.nclexFullPracticeExamQuestion.createMany({
          data: links.map((l) => ({ examId: exam.id, ...l })),
        });
      }
      return { examId: exam.id, linked: links.length };
    }
    case "naplex": {
      const exam = await prisma.naplexFullPracticeExam.upsert({
        where: { examNumber: params.examNumber },
        create: {
          examNumber: params.examNumber,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
        update: {
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
      });
      await prisma.naplexFullPracticeExamQuestion.deleteMany({ where: { examId: exam.id } });
      if (links.length) {
        await prisma.naplexFullPracticeExamQuestion.createMany({
          data: links.map((l) => ({ examId: exam.id, ...l })),
        });
      }
      return { examId: exam.id, linked: links.length };
    }
    case "usmle-step-1":
    case "usmle-step-2":
    case "usmle-step-3": {
      const stepLevel = presetStepLevelForComposeSlug(params.examSlug) ?? "step2";
      const exam = await prisma.usmleFullPracticeExam.upsert({
        where: { examNumber: params.examNumber },
        create: {
          examNumber: params.examNumber,
          stepLevel,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
        update: {
          stepLevel,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
      });
      await prisma.usmleFullPracticeExamQuestion.deleteMany({ where: { examId: exam.id } });
      if (links.length) {
        await prisma.usmleFullPracticeExamQuestion.createMany({
          data: links.map((l) => ({ examId: exam.id, ...l })),
        });
      }
      return { examId: exam.id, linked: links.length };
    }
    case "npte-pt": {
      const exam = await prisma.nptePtFullPracticeExam.upsert({
        where: { examNumber: params.examNumber },
        create: {
          examNumber: params.examNumber,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
        update: {
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
      });
      await prisma.nptePtFullPracticeExamQuestion.deleteMany({ where: { examId: exam.id } });
      if (links.length) {
        await prisma.nptePtFullPracticeExamQuestion.createMany({
          data: links.map((l) => ({ examId: exam.id, ...l })),
        });
      }
      return { examId: exam.id, linked: links.length };
    }
    case "pance": {
      const exam = await prisma.panceFullPracticeExam.upsert({
        where: { examNumber: params.examNumber },
        create: {
          examNumber: params.examNumber,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
        update: {
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
      });
      await prisma.panceFullPracticeExamQuestion.deleteMany({ where: { examId: exam.id } });
      if (links.length) {
        await prisma.panceFullPracticeExamQuestion.createMany({
          data: links.map((l) => ({ examId: exam.id, ...l })),
        });
      }
      return { examId: exam.id, linked: links.length };
    }
    case "aanp-fnp": {
      const exam = await prisma.aanpFnpFullPracticeExam.upsert({
        where: { examNumber: params.examNumber },
        create: {
          examNumber: params.examNumber,
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
        update: {
          blueprintSummary: params.blueprintSummary,
          ...common,
        },
      });
      await prisma.aanpFnpFullPracticeExamQuestion.deleteMany({ where: { examId: exam.id } });
      if (links.length) {
        await prisma.aanpFnpFullPracticeExamQuestion.createMany({
          data: links.map((l) => ({ examId: exam.id, ...l })),
        });
      }
      return { examId: exam.id, linked: links.length };
    }
    default:
      throw new Error(`No preset exam table for slug "${params.examSlug}".`);
  }
}
