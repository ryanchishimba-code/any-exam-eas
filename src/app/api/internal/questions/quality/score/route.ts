import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireInternalPermission } from "@/lib/internal/auth";
import { prisma } from "@/lib/prisma";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import {
  assessBankItem,
  buildQuestionImprovementPrompt,
  shouldAutoImprove,
} from "@/lib/questions/quality-improve";
import { qualityScoreToMeta } from "@/lib/questions/quality-rubric";

function rowToBankItem(row: {
  id: string;
  subjectId: string;
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  difficulty: number | null;
  topicCategory: string | null;
  blueprintDomain: string | null;
  blueprintTopic: string | null;
  itemType: string;
  source: string;
  reviewStatus: string | null;
  tags: string | null;
  generationMeta: unknown;
}): BankItem {
  const meta = (row.generationMeta ?? {}) as Record<string, unknown>;
  return {
    id: row.id,
    subjectId: row.subjectId,
    question: row.question,
    scenario: row.scenario ?? undefined,
    options: parseBankOptions(row.options).options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    difficulty: row.difficulty ?? undefined,
    topicCategory: row.topicCategory ?? undefined,
    blueprintDomain: row.blueprintDomain ?? undefined,
    blueprintTopic: row.blueprintTopic ?? undefined,
    itemType: row.itemType,
    source: row.source,
    reviewStatus: (row.reviewStatus as BankItem["reviewStatus"]) ?? undefined,
    tags: row.tags?.split(",").map((t) => t.trim()).filter(Boolean),
    clinicalReasoning: typeof meta.clinicalReasoning === "string" ? meta.clinicalReasoning : undefined,
    distractorRationale:
      meta.distractorRationale && typeof meta.distractorRationale === "object"
        ? (meta.distractorRationale as Record<string, string>)
        : undefined,
  };
}

/** POST /api/internal/questions/quality/score — rate a bank item (staff). */
export async function POST(req: Request) {
  const auth = await requireInternalPermission("questions.edit");
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => ({}))) as { id?: string; persist?: boolean };
  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const row = await prisma.questionBankItem.findUnique({ where: { id: body.id } });
  if (!row) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const item = rowToBankItem(row);
  const rating = assessBankItem(item);
  const improvementPrompt = buildQuestionImprovementPrompt({
    item,
    rating,
    fieldId: row.fieldId,
  });

  if (body.persist) {
    const existingMeta =
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        generationMeta: {
          ...existingMeta,
          qualityRubric: qualityScoreToMeta(rating),
        } as Prisma.InputJsonValue,
      },
    });
  }

  return NextResponse.json({
    rating,
    autoImproveRecommended: shouldAutoImprove(rating),
    improvementPrompt,
  });
}
