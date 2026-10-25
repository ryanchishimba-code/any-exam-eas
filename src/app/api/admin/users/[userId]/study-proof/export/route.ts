import { NextResponse } from "next/server";
import { logAdminAction } from "@/lib/audit";
import { requireAdminPermission } from "@/lib/admin/auth";
import { loadAdminStudyProof, studyProofExportSummary } from "@/lib/engagement/admin-study-proof";

export const runtime = "nodejs";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdminPermission("analytics.export");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await ctx.params;
  const proof = await loadAdminStudyProof(userId);
  const summary = studyProofExportSummary(proof);

  void logAdminAction({
    actorId: auth.userId,
    action: "EXPORT_STUDY_PROOF",
    targetType: "user",
    targetId: userId,
    req: request,
  });

  const header = "timestamp_ct,type,detail,board\n";
  const rows = proof.timeline
    .map((row) =>
      [escapeCsv(row.at), escapeCsv(row.type), escapeCsv(row.detail), escapeCsv(row.board)].join(",")
    )
    .join("\n");

  const filenameBase = `study-proof-${userId}-${proof.generatedAt.slice(0, 10)}`;

  return NextResponse.json({
    csv: header + rows,
    summary,
    filenameBase,
  });
}
