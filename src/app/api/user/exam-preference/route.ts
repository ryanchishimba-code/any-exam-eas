import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference, setUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import type { ExamSlug } from "@/types/edtech";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ examSlug: null });
  }

  const pref = await getUserExamPreference(session.user.id);
  const meta = pref ? await getUserEdtechMetadata(session.user.id) : null;
  return NextResponse.json({
    examSlug: pref?.examSlug ?? null,
    mpjeStateCode: meta?.mpjeStateCode ?? null,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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
    await setUserExamPreference(session.user.id, examSlug as ExamSlug);
    revalidatePath("/dashboard");
    revalidatePath("/study-hub");
    revalidatePath("/select-exam");
    return NextResponse.json({ ok: true, examSlug });
  } catch (err) {
    console.error("[POST /api/user/exam-preference]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save exam preference" },
      { status: 500 }
    );
  }
}
