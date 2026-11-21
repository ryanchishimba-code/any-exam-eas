import { NextResponse } from "next/server";
import { getMedmathEpisode } from "@/lib/quick-bites/medmath-catalog";
import { requireMedmathPlayer } from "@/lib/quick-bites/medmath-playback";
import { getMedmathQuiz } from "@/lib/quick-bites/medmath-quiz-data";
import { gradeQuickBiteAnswer, publicQuickBiteQuiz } from "@/lib/quick-bites/quiz-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "private, no-store" };

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const gate = await requireMedmathPlayer(request);
  if (!gate.ok) return gate.response;
  const episode = getMedmathEpisode(slug);
  const quiz = episode && !episode.held ? getMedmathQuiz(slug) : null;
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  return NextResponse.json(publicQuickBiteQuiz(quiz), { headers: PRIVATE });
}

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const gate = await requireMedmathPlayer(request);
  if (!gate.ok) return gate.response;
  const quiz = getMedmathEpisode(slug) ? getMedmathQuiz(slug) : null;
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid quiz answer" }, { status: 400 });
  }
  const questionId = body && typeof body === "object" && "questionId" in body ? body.questionId : null;
  const selected = body && typeof body === "object" && "selected" in body ? body.selected : null;
  if (typeof questionId !== "string" || !Array.isArray(selected) || selected.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Invalid quiz answer" }, { status: 400 });
  }
  const question = quiz.questions.find((item) => item.id === questionId);
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
  const graded = gradeQuickBiteAnswer(question, selected);
  if (!graded) return NextResponse.json({ error: "Invalid quiz answer" }, { status: 400 });
  return NextResponse.json(graded, { headers: PRIVATE });
}
