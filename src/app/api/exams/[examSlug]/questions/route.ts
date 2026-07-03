import { NextResponse } from "next/server";
import { isExamSlug } from "@/lib/edtech/exams";
import {
  enforceUserExamSlugAccess,
  resolveCanonicalPracticeFieldId,
} from "@/lib/edtech/question-bank-scope";
import { filterBankItemsForPracticeField } from "@/lib/edtech/exam-item-scope";
import { sampleQuestionBankItems, sampleQuestionBankItemsForField } from "@/lib/question-bank-db";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ examSlug: string }> };

const MAX_PAGE_SIZE = 50;

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/** Paginated question slice — lite fields by default; explanations optional. */
export async function GET(req: Request, { params }: RouteParams) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { examSlug } = await params;
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Unknown exam" }, { status: 404 });
  }

  const slugAccess = await enforceUserExamSlugAccess(premium.userId, examSlug);
  if (!slugAccess.ok) return slugAccess.response;

  const url = new URL(req.url);
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const limit = Math.min(parsePositiveInt(url.searchParams.get("limit"), 20), MAX_PAGE_SIZE);
  const subjectId = url.searchParams.get("subjectId")?.trim() || null;
  const includeExplanation = url.searchParams.get("includeExplanation") === "1";

  const fieldId = await resolveCanonicalPracticeFieldId(premium.userId, examSlug);

  const { enforceQuestionBankFieldAccess } = await import("@/lib/edtech/question-bank-scope");
  const access = await enforceQuestionBankFieldAccess(premium.userId, fieldId);
  if (!access.ok) return access.response;

  try {
    const pull = Math.min(limit * 3, 120);
    const items = filterBankItemsForPracticeField(
      subjectId
        ? await sampleQuestionBankItems({ fieldId, subjectId, count: pull })
        : await sampleQuestionBankItemsForField({ fieldId, count: pull, skipEnsure: true }),
      fieldId
    );

    const offset = (page - 1) * limit;
    const slice = items.slice(offset, offset + limit);

    const questions = slice.map((item, i) => {
      const subject = item.subjectId ?? subjectId ?? "general";
      const raw = bankItemToSessionRaw(fieldId, fieldId, subject, item, offset + i);
      return {
        id: item.id,
        subjectId: subject,
        type: raw.type,
        question: raw.question,
        vignette: raw.vignette ?? null,
        options: raw.options,
        correctAnswer: includeExplanation ? raw.correctAnswer : undefined,
        explanation: includeExplanation ? raw.explanation : undefined,
        difficultyLabel: raw.difficultyLabel ?? null,
        topicCategory: item.topicCategory ?? null,
      };
    });

    return NextResponse.json(
      {
        examSlug,
        fieldId,
        subjectId,
        page,
        limit,
        returned: questions.length,
        hasMore: slice.length === limit && items.length > offset + limit,
        questions,
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  } catch (error) {
    console.error("[api/exams/[examSlug]/questions] failed:", error);
    return NextResponse.json(
      { error: "Could not load questions for this page." },
      { status: 503 }
    );
  }
}
