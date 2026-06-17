import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import { hasPermission } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";
import { bulkUpdateAdminQuestions } from "@/lib/admin/question-bank-admin";
import { bulkActionSchema } from "@/lib/admin/question-admin-validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireInternalPermission("questions.edit");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = bulkActionSchema.parse(await req.json());

    // Tag changes only need edit; everything else is a publication action.
    const needsPublish = body.action !== "set_tags";
    if (needsPublish && !hasPermission(auth.role, "questions.publish")) {
      return NextResponse.json(
        { error: "You do not have permission to run this bulk action." },
        { status: 403 }
      );
    }

    const result = await bulkUpdateAdminQuestions(body.ids, body.action, {
      tags: body.tags,
    });

    void logAdminAction({
      actorId: auth.userId,
      action: "BULK_QUESTION_ACTION",
      targetType: "question_bank_item",
      metadata: { action: body.action, count: result.updated, ids: body.ids.slice(0, 200) },
      req,
    });

    return NextResponse.json({ ok: true, updated: result.updated });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message ?? "Invalid request." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Bulk action failed." }, { status: 500 });
  }
}
