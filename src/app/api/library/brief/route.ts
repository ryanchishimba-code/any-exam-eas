import { NextResponse } from "next/server";
import { isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { generateLibraryStudyBrief } from "@/lib/library/generate-study-brief";
import type { ExamSlug } from "@/types/edtech";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { enforceUserRateLimit } = await import("@/lib/api-rate-limit");
  const limited = await enforceUserRateLimit(premium.userId, "reference-brief", 6, 60_000);
  if (limited) return limited;

  const url = new URL(req.url);
  const examParam = url.searchParams.get("exam");
  let examSlug: ExamSlug;

  if (examParam && isExamSlug(examParam)) {
    examSlug = examParam;
  } else {
    const pref = await getUserExamPreference(premium.userId);
    if (!pref) {
      return NextResponse.json({ error: "Select an exam first" }, { status: 400 });
    }
    examSlug = pref.examSlug;
  }

  const refresh = url.searchParams.get("refresh") === "1";

  try {
    const brief = await generateLibraryStudyBrief(premium.userId, examSlug, { refresh });
    return NextResponse.json(
      { brief },
      {
        headers: brief.cached ? { "X-Library-Brief-Cache": "hit" } : { "X-Library-Brief-Cache": "miss" },
      }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Brief generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
