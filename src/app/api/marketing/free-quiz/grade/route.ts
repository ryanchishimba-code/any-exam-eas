import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import {
  getFreeQuizBank,
  gradeFreeQuizAnswers,
  isFreeQuizBoardSlug,
  type FreeQuizBoardSlug,
  type FreeQuizGradeAnswer,
} from "@/lib/marketing/free-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GradeBody = {
  board?: string;
  rotationKey?: string;
  answers?: FreeQuizGradeAnswer[];
};

export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "marketing-free-quiz-grade", 40, 60_000);
  if (limited) return limited;

  let body: GradeBody;
  try {
    body = (await req.json()) as GradeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const boardParam = body.board?.trim().toLowerCase() ?? "";
  if (!isFreeQuizBoardSlug(boardParam)) {
    return NextResponse.json({ error: "Unknown board." }, { status: 400 });
  }
  const board = boardParam as FreeQuizBoardSlug;

  const rotationKey = body.rotationKey?.trim() ?? "";
  if (!rotationKey) {
    return NextResponse.json({ error: "Missing rotation key." }, { status: 400 });
  }

  const answers = body.answers;
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > 20) {
    return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
  }

  try {
    const bank = await getFreeQuizBank(board);
    const graded = gradeFreeQuizAnswers(bank, rotationKey, answers);
    if (!graded.ok) {
      return NextResponse.json({ error: graded.error }, { status: graded.status });
    }
    return NextResponse.json(graded.payload);
  } catch (error) {
    console.error("[api/marketing/free-quiz/grade]", error);
    return NextResponse.json({ error: "Could not grade the quiz." }, { status: 503 });
  }
}
