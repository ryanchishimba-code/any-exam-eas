import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isExamSlug } from "@/lib/edtech/exams";
import { getExamTestDate, getUserEdtechMetadata, setUserExamTestDate } from "@/lib/edtech/user-metadata";
import {
  EXAM_OUTCOME_RESULT,
  type ExamOutcomeResult,
} from "@/lib/learning/readiness-check/thresholds";
import { recordExamOutcome, resolveReadinessBoard } from "@/lib/learning/readiness-check/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isResult(value: unknown): value is ExamOutcomeResult {
  return (
    value === EXAM_OUTCOME_RESULT.passed ||
    value === EXAM_OUTCOME_RESULT.not_yet ||
    value === EXAM_OUTCOME_RESULT.not_taken
  );
}

export async function POST(req: Request) {
  const { requireAuthenticatedApi } = await import("@/lib/api-access");
  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult.response;

  let result: ExamOutcomeResult | null = null;
  let examDate: string | null | undefined;
  let examSlugRaw: unknown;
  try {
    const body = (await req.json()) as {
      result?: unknown;
      examDate?: unknown;
      examSlug?: unknown;
    };
    if (!isResult(body.result)) {
      return NextResponse.json({ error: "Choose how the exam went." }, { status: 400 });
    }
    result = body.result;
    examSlugRaw = body.examSlug;
    if (body.examDate === null || body.examDate === "") examDate = null;
    else if (typeof body.examDate === "string" && ISO_DATE_RE.test(body.examDate)) examDate = body.examDate;
    else if (typeof body.examDate === "undefined") examDate = undefined;
    else return NextResponse.json({ error: "Enter a valid date." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const board = await resolveReadinessBoard(authResult.userId);
    if (!board) return NextResponse.json({ error: "Choose an exam first." }, { status: 400 });
    if (typeof examSlugRaw === "string" && isExamSlug(examSlugRaw) && examSlugRaw !== board.examSlug) {
      return NextResponse.json({ error: "Switch to that exam before recording a result." }, { status: 400 });
    }
    const slug = board.examSlug;
    const fieldId = board.fieldId;

    let storedDate = examDate;
    if (typeof examDate === "string" || examDate === null) {
      const meta = await setUserExamTestDate(authResult.userId, slug, examDate);
      storedDate = getExamTestDate(meta, slug);
    } else {
      const meta = await getUserEdtechMetadata(authResult.userId);
      storedDate = getExamTestDate(meta, slug);
    }

    const saved = await recordExamOutcome({
      userId: authResult.userId,
      examSlug: slug,
      fieldId,
      result: result!,
      examDate: storedDate,
    });
    revalidatePath("/dashboard");
    revalidatePath("/readiness");
    revalidatePath("/settings");
    return NextResponse.json({ ok: true, ...saved, examDate: storedDate });
  } catch (error) {
    console.error("[readiness] outcome", error);
    return NextResponse.json({ error: "Could not save that result." }, { status: 500 });
  }
}
