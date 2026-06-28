import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference, setUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import type { ExamSlug } from "@/types/edtech";
import { optionalSessionGuard, requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const guard = await optionalSessionGuard(req);
  if (!guard.ok) return guard.response;
  if (!guard.userId) {
    return NextResponse.json({ examSlug: null });
  }

  const pref = await getUserExamPreference(guard.userId);
  const meta = pref ? await getUserEdtechMetadata(guard.userId) : null;
  return NextResponse.json({
    examSlug: pref?.examSlug ?? null,
    mpjeStateCode: meta?.mpjeStateCode ?? null,
  });
}

export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const examSlug =
    typeof body === "object" && body !== null && "examSlug" in body
      ? (body as { examSlug?: unknown }).examSlug
      : undefined;

  if (typeof examSlug !== "string" || !isExamSlug(examSlug)) {
    return NextResponse.json({ ok: false, error: "Invalid exam selection" }, { status: 400 });
  }

  try {
    await setUserExamPreference(guard.userId, examSlug as ExamSlug);
    revalidatePath("/dashboard", "layout");
    revalidatePath("/question-bank", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/study-hub");
    revalidatePath("/select-exam");
    revalidatePath("/question-bank");
    revalidatePath("/study/practice");
    return NextResponse.json({ ok: true, examSlug });
  } catch (err) {
    console.error("[POST /api/user/exam-preference]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save exam preference" },
      { status: 500 }
    );
  }
}
