import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import { logAdminAction } from "@/lib/audit";
import {
  listAdminQuestions,
  createAdminQuestion,
  type AdminQuestionFilters,
} from "@/lib/admin/question-bank-admin";
import { createQuestionSchema } from "@/lib/admin/question-admin-validators";

export const runtime = "nodejs";

function parseBool(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export async function GET(req: Request) {
  const auth = await requireInternalPermission("questions.view");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const p = url.searchParams;

  const filters: AdminQuestionFilters = {
    search: p.get("search") ?? undefined,
    fieldId: p.get("fieldId") ?? undefined,
    reviewStatus: p.get("reviewStatus") ?? undefined,
    qaPassed: parseBool(p.get("qaPassed")),
    active: parseBool(p.get("active")),
    difficulty: p.get("difficulty") ? Number(p.get("difficulty")) : undefined,
    itemType: p.get("itemType") ?? undefined,
    source: p.get("source") ?? undefined,
    blueprint: p.get("blueprint") ?? undefined,
    reportedOnly: p.get("reportedOnly") === "true",
    dateField: (p.get("dateField") as "createdAt" | "updatedAt" | null) ?? undefined,
    dateFrom: p.get("dateFrom") ? new Date(p.get("dateFrom") as string) : undefined,
    dateTo: p.get("dateTo") ? new Date(p.get("dateTo") as string) : undefined,
    sort: (p.get("sort") as AdminQuestionFilters["sort"]) ?? undefined,
    order: (p.get("order") as "asc" | "desc" | null) ?? undefined,
    page: p.get("page") ? Number(p.get("page")) : undefined,
    pageSize: p.get("pageSize") ? Number(p.get("pageSize")) : undefined,
  };

  const result = await listAdminQuestions(filters);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const auth = await requireInternalPermission("questions.edit");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = createQuestionSchema.parse(await req.json());
    const result = await createAdminQuestion(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    void logAdminAction({
      actorId: auth.userId,
      action: "CREATE_QUESTION",
      targetType: "question_bank_item",
      targetId: result.id,
      metadata: { fieldId: body.fieldId, draft: body.draft ?? false },
      req,
    });

    return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message ?? "Invalid request." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Create failed." }, { status: 500 });
  }
}
