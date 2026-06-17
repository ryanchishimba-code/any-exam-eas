import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import { hasPermission } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";
import {
  getAdminQuestion,
  updateAdminQuestion,
  type AdminQuestionUpdate,
} from "@/lib/admin/question-bank-admin";
import { updateQuestionSchema } from "@/lib/admin/question-admin-validators";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const auth = await requireInternalPermission("questions.view");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const question = await getAdminQuestion(id);
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
  return NextResponse.json(question);
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const auth = await requireInternalPermission("questions.edit");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const body = updateQuestionSchema.parse(await req.json());

    // Status / publication changes require the elevated permission.
    const touchesPublication =
      "reviewStatus" in body || "active" in body || "qaPassed" in body;
    if (touchesPublication && !hasPermission(auth.role, "questions.publish")) {
      return NextResponse.json(
        { error: "You do not have permission to approve, archive, or publish questions." },
        { status: 403 }
      );
    }

    const { note, ...rest } = body;
    const patch = rest as AdminQuestionUpdate;

    const result = await updateAdminQuestion(id, patch);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    if (Object.keys(result.changes).length > 0) {
      void logAdminAction({
        actorId: auth.userId,
        action: "EDIT_QUESTION",
        targetType: "question_bank_item",
        targetId: id,
        metadata: { changes: result.changes, note: note ?? null },
        req,
      });
    }

    const question = await getAdminQuestion(id);
    return NextResponse.json({ ok: true, question });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message ?? "Invalid request." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
