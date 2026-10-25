import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import { getFnpQuickBiteBySlug } from "@/lib/quick-bites/fnp-catalog";
import { getFnpQuickBiteQuiz } from "@/lib/quick-bites/fnp-quiz-data";
import { gradeQuickBiteAnswer, publicQuickBiteQuiz } from "@/lib/quick-bites/quiz-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCKED = {
  error: "A paid membership is required for Quick Bites: FNP quizzes.",
  code: "FNP_QUICK_BITES_LOCKED",
} as const;

const PRIVATE = { "Cache-Control": "private, no-store" };

async function requirePremiumPlayer(request: Request) {
  const authResult = await requireAuthenticatedApi(request);
  if (!authResult.ok) return authResult;
  if (!canPlayQuickBites(authResult.access)) {
    return { ok: false as const, response: NextResponse.json(LOCKED, { status: 403 }) };
  }
  return { ok: true as const };
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const gate = await requirePremiumPlayer(request);
  if (!gate.ok) return gate.response;

  const episode = getFnpQuickBiteBySlug(slug);
  if (!episode || episode.held) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }
  const quiz = getFnpQuickBiteQuiz(slug);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json(publicQuickBiteQuiz(quiz), { headers: PRIVATE });
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const gate = await requirePremiumPlayer(request);
  if (!gate.ok) return gate.response;

  const episode = getFnpQuickBiteBySlug(slug);
  if (!episode || episode.held) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }
  const quiz = getFnpQuickBiteQuiz(slug);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid quiz answer" }, { status: 400 });
  }

  const questionId =
    body && typeof body === "object" && "questionId" in body ? body.questionId : null;
  const selected = body && typeof body === "object" && "selected" in body ? body.selected : null;
  if (typeof questionId !== "string" || !Array.isArray(selected) || selected.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Invalid quiz answer" }, { status: 400 });
  }

  const question = quiz.questions.find((item) => item.id === questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const graded = gradeQuickBiteAnswer(question, selected);
  if (!graded) {
    return NextResponse.json({ error: "Invalid quiz answer" }, { status: 400 });
  }

  return NextResponse.json(graded, { headers: PRIVATE });
}
