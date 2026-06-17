import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { logAdminAction } from "@/lib/audit";
import {
  listAdminQuestions,
  type AdminQuestionFilters,
} from "@/lib/admin/question-bank-admin";

export const runtime = "nodejs";

function parseBool(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const auth = await requireInternalPermission("questions.view");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const p = url.searchParams;

  const baseFilters: AdminQuestionFilters = {
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
    sort: (p.get("sort") as AdminQuestionFilters["sort"]) ?? undefined,
    order: (p.get("order") as "asc" | "desc" | null) ?? undefined,
  };

  const header = [
    "id",
    "exam",
    "fieldId",
    "subjectId",
    "itemType",
    "difficulty",
    "reviewStatus",
    "qaPassed",
    "active",
    "source",
    "blueprintDomain",
    "blueprintTopic",
    "openReports",
    "createdAt",
    "updatedAt",
    "questionPreview",
  ];
  const lines: string[] = [header.join(",")];

  const pageSize = 100;
  const maxRows = 5000;
  let page = 1;
  let fetched = 0;

  for (;;) {
    const { items, total } = await listAdminQuestions({ ...baseFilters, page, pageSize });
    for (const item of items) {
      lines.push(
        [
          item.id,
          item.examName,
          item.fieldId,
          item.subjectId,
          item.itemType,
          item.difficulty ?? "",
          item.reviewStatus ?? "",
          item.qaPassed,
          item.active,
          item.source,
          item.blueprintDomain ?? "",
          item.blueprintTopic ?? "",
          item.openReports,
          item.createdAt,
          item.updatedAt,
          item.questionPreview,
        ]
          .map(csvCell)
          .join(",")
      );
    }
    fetched += items.length;
    if (items.length < pageSize || fetched >= total || fetched >= maxRows) break;
    page += 1;
  }

  void logAdminAction({
    actorId: auth.userId,
    action: "EXPORT_QUESTIONS",
    targetType: "question_bank_item",
    metadata: { rows: fetched, filters: baseFilters },
    req,
  });

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="questions-export-${Date.now()}.csv"`,
    },
  });
}
