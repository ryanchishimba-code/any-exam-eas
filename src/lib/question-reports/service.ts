import { prisma } from "@/lib/prisma";
import { getExam } from "@/lib/edtech/exams";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { bankItemPassesIngestGate } from "@/lib/exam-prep/bank-ingest-gate";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { analyzeReportedQuestion } from "./analyzer";
import type {
  QuestionReportDetail,
  QuestionReportListItem,
  QuestionReportProposedFix,
  QuestionReportSystemIssue,
  SubmitQuestionReportInput,
} from "./types";

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toListItem(row: {
  id: string;
  createdAt: Date;
  status: string;
  analysisStatus: string;
  reason: string;
  message: string | null;
  fieldId: string;
  examSlug: string | null;
  subjectId: string | null;
  stemPreview: string | null;
  issueSummary: string | null;
  issueCodes: string | null;
  bankItemId: string | null;
  user: { email: string } | null;
}): QuestionReportListItem {
  const exam = row.examSlug ? getExam(row.examSlug) : null;
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    status: row.status as QuestionReportListItem["status"],
    analysisStatus: row.analysisStatus as QuestionReportListItem["analysisStatus"],
    reason: row.reason,
    message: row.message,
    fieldId: row.fieldId,
    examSlug: row.examSlug,
    examName: exam?.name ?? null,
    subjectId: row.subjectId,
    stemPreview: row.stemPreview,
    issueSummary: row.issueSummary,
    issueCodes: parseJson<string[]>(row.issueCodes, []),
    bankItemId: row.bankItemId,
    userEmail: row.user?.email ?? null,
  };
}

function toDetail(row: Awaited<ReturnType<typeof fetchReportById>>): QuestionReportDetail | null {
  if (!row) return null;
  const base = toListItem(row);
  return {
    ...base,
    questionKey: row.questionKey,
    sessionId: row.sessionId,
    sessionMode: row.sessionMode,
    selectedAnswer: row.selectedAnswer,
    optionsSnapshot: parseJson<string[] | null>(row.optionsSnapshot, null),
    correctAnswerSnapshot: row.correctAnswerSnapshot,
    systemIssues: parseJson<QuestionReportSystemIssue[]>(row.systemIssues, []),
    proposedFix: parseJson<QuestionReportProposedFix | null>(row.proposedFix, null),
    generationNotes: row.generationNotes,
    appliedAt: row.appliedAt?.toISOString() ?? null,
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
  };
}

async function fetchReportById(id: string) {
  return prisma.questionReport.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });
}

export async function createQuestionReport(
  input: SubmitQuestionReportInput,
  opts: { userId?: string }
): Promise<{ id: string }> {
  let bankItem = null;
  if (input.bankItemId) {
    const row = await prisma.questionBankItem.findUnique({ where: { id: input.bankItemId } });
    if (row) bankItem = enrichBankItemFromRow(row);
  }

  const analysis = analyzeReportedQuestion(input, bankItem);

  const report = await prisma.questionReport.create({
    data: {
      userId: opts.userId ?? null,
      bankItemId: input.bankItemId ?? null,
      questionKey: input.questionKey,
      fieldId: input.fieldId,
      examSlug: input.examSlug ?? null,
      subjectId: input.subjectId ?? null,
      sessionId: input.sessionId ?? null,
      sessionMode: input.sessionMode ?? null,
      reason: input.reason,
      message: input.message?.trim() || null,
      selectedAnswer: input.selectedAnswer ?? null,
      stemPreview: input.stemPreview?.slice(0, 500) ?? null,
      optionsSnapshot: input.options?.length ? JSON.stringify(input.options) : null,
      correctAnswerSnapshot: input.correctAnswer ?? null,
      analysisStatus: "complete",
      issueSummary: analysis.issueSummary,
      issueCodes: JSON.stringify(analysis.issueCodes),
      systemIssues: JSON.stringify(analysis.systemIssues),
      proposedFix: JSON.stringify(analysis.proposedFix),
      generationNotes: analysis.generationNotes,
    },
  });

  return { id: report.id };
}

export async function listQuestionReports(params: {
  status?: string;
  fieldId?: string;
  examSlug?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: QuestionReportListItem[]; total: number }> {
  const where = {
    ...(params.status ? { status: params.status } : {}),
    ...(params.fieldId ? { fieldId: params.fieldId } : {}),
    ...(params.examSlug ? { examSlug: params.examSlug } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.questionReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params.limit ?? 50,
      skip: params.offset ?? 0,
      include: { user: { select: { email: true } } },
    }),
    prisma.questionReport.count({ where }),
  ]);

  return { items: rows.map(toListItem), total };
}

export async function getQuestionReport(id: string): Promise<QuestionReportDetail | null> {
  const row = await fetchReportById(id);
  return toDetail(row);
}

export async function applyQuestionReportFix(
  id: string,
  actorId: string
): Promise<{ ok: boolean; error?: string }> {
  const row = await prisma.questionReport.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "Report not found." };
  if (!row.bankItemId) return { ok: false, error: "No bank item linked — manual fix only." };

  const proposedFix = parseJson<QuestionReportProposedFix | null>(row.proposedFix, null);
  if (!proposedFix?.autoApplicable || !proposedFix.changes) {
    return { ok: false, error: "No auto-applicable fix — edit the bank item manually." };
  }

  const bankRow = await prisma.questionBankItem.findUnique({ where: { id: row.bankItemId } });
  if (!bankRow) return { ok: false, error: "Bank item no longer exists." };

  const item = enrichBankItemFromRow(bankRow);
  const merged = {
    ...item,
    question: proposedFix.changes.question ?? item.question,
    scenario: proposedFix.changes.scenario ?? item.scenario,
    vignette: proposedFix.changes.scenario ?? item.vignette,
    options: proposedFix.changes.options ?? item.options,
    correctAnswer: proposedFix.changes.correctAnswer ?? item.correctAnswer,
    explanation: proposedFix.changes.explanation ?? item.explanation,
  };

  if (!bankItemPassesIngestGate(bankRow.fieldId, merged, bankRow.source)) {
    return { ok: false, error: "Proposed fix still fails ingest gate — manual edit required." };
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.questionBankItem.update({
      where: { id: bankRow.id },
      data: {
        question: merged.question,
        scenario: merged.scenario ?? merged.vignette ?? null,
        options: serializeBankOptions(merged),
        correctAnswer: merged.correctAnswer,
        explanation: merged.explanation,
        qaPassed: true,
        qaAuditedAt: now,
        updatedAt: now,
      },
    }),
    prisma.questionReport.update({
      where: { id },
      data: {
        status: "applied",
        appliedAt: now,
        appliedById: actorId,
      },
    }),
  ]);

  return { ok: true };
}

export async function updateQuestionReportStatus(
  id: string,
  status: "resolved" | "dismissed",
  actorId: string
): Promise<void> {
  await prisma.questionReport.update({
    where: { id },
    data: {
      status,
      resolvedAt: new Date(),
      resolvedById: actorId,
    },
  });
}

export async function countOpenQuestionReports(): Promise<number> {
  return prisma.questionReport.count({ where: { status: "open" } });
}
