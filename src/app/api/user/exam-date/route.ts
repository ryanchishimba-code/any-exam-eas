import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata, getExamTestDate, setUserExamTestDate } from "@/lib/edtech/user-metadata";
import { requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const record = (body ?? {}) as { testDate?: unknown; examSlug?: unknown };

  // Resolve which exam the date applies to: explicit slug or the user's current preference.
  let examSlug: string | null = null;
  if (typeof record.examSlug === "string" && isExamSlug(record.examSlug)) {
    examSlug = record.examSlug;
  } else {
    const pref = await getUserExamPreference(guard.userId);
    examSlug = pref?.examSlug ?? null;
  }

  if (!examSlug) {
    return NextResponse.json(
      { ok: false, error: "Choose an exam before setting a test date." },
      { status: 400 }
    );
  }

  // null / empty clears the date; otherwise validate ISO format.
  const raw = record.testDate;
  let testDate: string | null;
  if (raw === null || raw === "" || typeof raw === "undefined") {
    testDate = null;
  } else if (typeof raw === "string" && ISO_DATE_RE.test(raw) && !Number.isNaN(Date.parse(raw))) {
    testDate = raw;
  } else {
    return NextResponse.json({ ok: false, error: "Enter a valid date." }, { status: 400 });
  }

  try {
    const meta = await setUserExamTestDate(guard.userId, examSlug, testDate);
    revalidatePath("/dashboard");
    return NextResponse.json({ ok: true, examSlug, testDate: getExamTestDate(meta, examSlug) });
  } catch (err) {
    console.error("[POST /api/user/exam-date]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save test date." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const pref = await getUserExamPreference(guard.userId);
  if (!pref) return NextResponse.json({ examSlug: null, testDate: null });

  const meta = await getUserEdtechMetadata(guard.userId);
  return NextResponse.json({
    examSlug: pref.examSlug,
    testDate: getExamTestDate(meta, pref.examSlug),
  });
}
