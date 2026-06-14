import { NextResponse } from "next/server";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { buildDailyAssignment } from "@/lib/edtech/learning-hub";
import { getLearningProfileSnapshot } from "@/lib/learning/profile-service";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { requireSessionGuard } from "@/lib/session-guard";

export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const pref = await getUserExamPreference(guard.userId);
  const examSlug = pref?.examSlug ?? "usmle";
  const fieldId = EXAM_CATALOG[examSlug].fieldId;

  let weakTopicSlugs: string[] = [];
  try {
    const profile = await getLearningProfileSnapshot(guard.userId);
    weakTopicSlugs = profile.weakestConcepts
      .filter((c) => c.fieldId === fieldId || profile.weakestConcepts.length <= 8)
      .slice(0, 3)
      .map((c) => c.conceptKey.replace(/^(tag|subject):/, ""));
  } catch {
    /* non-fatal */
  }

  const plan = buildDailyAssignment(examSlug, weakTopicSlugs);
  return NextResponse.json({ plan });
}
