import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createExamSession } from "@/lib/exam-sessions/service";
import type { ExamSlug } from "@/lib/exams/catalog";
import { getExamHub } from "@/lib/exams/catalog";

export const runtime = "nodejs";

const SLUGS = new Set(["nclex", "usmle", "naplex", "top500"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const examType = String(body.examType ?? "") as ExamSlug;
  if (!SLUGS.has(examType) || !getExamHub(examType)) {
    return NextResponse.json({ error: "Invalid exam type" }, { status: 400 });
  }

  try {
    const id = await createExamSession(session.user.id, examType, {
      questionCount: Number(body.questionCount) || 40,
      timeLimitSec: Number(body.timeLimitSec) || 3600,
      title: body.title,
    });

    return NextResponse.json({ sessionId: id, redirectUrl: `/exam/${examType}/${id}` });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not start exam session";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
