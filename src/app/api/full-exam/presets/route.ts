import { NextResponse } from "next/server";
import { requirePremiumApi } from "@/lib/api-access";
import { isExamSlug } from "@/lib/edtech/exams";
import { listPresetExamsForSlug } from "@/lib/exam-prep/load-preset-exam";
import { PRESET_EXAM_MAX } from "@/lib/exam-prep/preset-exam-config";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const examSlug = new URL(req.url).searchParams.get("examSlug") ?? "";
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
  }

  const exams = await listPresetExamsForSlug(examSlug);
  return NextResponse.json({ exams, maxPresets: PRESET_EXAM_MAX });
}
