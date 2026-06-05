import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateAndStoreQuestions } from "@/lib/ai/generation-service";
import type { ExamSlug } from "@/lib/exams/catalog";

export const runtime = "nodejs";
export const maxDuration = 120;

const SLUGS = new Set(["nclex", "usmle", "naplex", "mpje", "top500"]);

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const examType = String(body.examType ?? "") as ExamSlug;
  const topic = String(body.topic ?? "").trim();

  if (!SLUGS.has(examType) || !topic) {
    return NextResponse.json({ error: "examType and topic are required" }, { status: 400 });
  }

  try {
    const result = await generateAndStoreQuestions({
      userId: session.user.id,
      examType,
      topic,
      questionCount: Number(body.questionCount) || 5,
      source: body.source === "textbook" ? "textbook" : "topic",
      textbookExcerpt: body.textbookExcerpt,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
