import { NextResponse } from "next/server";
import { forbiddenResponse, getAdminSession } from "@/lib/admin/auth";
import { loadMarketingReport } from "@/lib/admin/marketing-report";
import { filterMarketingPasses, marketingPassesToCsv } from "@/lib/promo/marketing-phase";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return forbiddenResponse();

  const url = new URL(req.url);
  const report = await loadMarketingReport();
  const rows = filterMarketingPasses(report.passes, {
    audience: url.searchParams.get("audience"),
    status: url.searchParams.get("status"),
  });
  const csv = marketingPassesToCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": 'attachment; filename="marketing-phase-1.csv"',
    },
  });
}
