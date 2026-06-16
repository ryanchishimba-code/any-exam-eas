import { NextResponse } from "next/server";
import { requirePremiumApi } from "@/lib/api-access";
import { isExamSlug } from "@/lib/edtech/exams";
import { listNclexFullPracticeExams } from "@/lib/exam-prep/nclex/load-preset-exam";
import { listUsmleFullPracticeExams } from "@/lib/exam-prep/usmle/load-preset-exam";
import { listNptePtFullPracticeExams } from "@/lib/exam-prep/npte-pt/load-preset-exam";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const examSlug = new URL(req.url).searchParams.get("examSlug") ?? "";
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
  }

  if (examSlug === "nclex") {
    const exams = await listNclexFullPracticeExams();
    return NextResponse.json({ exams });
  }

  if (examSlug === "usmle") {
    const exams = await listUsmleFullPracticeExams();
    return NextResponse.json({ exams });
  }

  if (examSlug === "npte-pt") {
    const exams = await listNptePtFullPracticeExams();
    return NextResponse.json({ exams });
  }

  return NextResponse.json({ exams: [] });
}
