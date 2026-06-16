import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import {
  applyQuestionReportFix,
  getQuestionReport,
  updateQuestionReportStatus,
} from "@/lib/question-reports/service";
import { patchQuestionReportSchema } from "@/lib/question-reports/validators";
import { logAdminAction } from "@/lib/audit";
import { hasPermission } from "@/lib/permissions";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const auth = await requireInternalPermission("feedback.view");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const report = await getQuestionReport(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json(report);
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const auth = await requireInternalPermission("feedback.view");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const body = patchQuestionReportSchema.parse(await req.json());

    if (body.applyFix) {
      if (!hasPermission(auth.role, "feedback.manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const result = await applyQuestionReportFix(id, auth.userId);
      if (!result.ok) {
        return NextResponse.json({ error: result.error ?? "Apply failed." }, { status: 400 });
      }
      void logAdminAction({
        actorId: auth.userId,
        action: "APPLY_QUESTION_REPORT_FIX",
        targetType: "question_report",
        targetId: id,
        req,
      });
      const report = await getQuestionReport(id);
      return NextResponse.json({ ok: true, report });
    }

    if (body.status) {
      if (!hasPermission(auth.role, "feedback.manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      await updateQuestionReportStatus(id, body.status, auth.userId);
      void logAdminAction({
        actorId: auth.userId,
        action: body.status === "resolved" ? "RESOLVE_QUESTION_REPORT" : "DISMISS_QUESTION_REPORT",
        targetType: "question_report",
        targetId: id,
        req,
      });
      const report = await getQuestionReport(id);
      return NextResponse.json({ ok: true, report });
    }

    return NextResponse.json({ error: "No action specified." }, { status: 400 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
