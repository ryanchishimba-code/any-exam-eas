import { NextResponse } from "next/server";
import { isHealthDetailAuthorized, runHealthChecks } from "@/lib/health-check";

export const dynamic = "force-dynamic";

/** Uptime / load-balancer check — public body is `{ ok }` only; details require Bearer CRON_SECRET. */
export async function GET(req: Request) {
  const report = await runHealthChecks();

  if (isHealthDetailAuthorized(req)) {
    return NextResponse.json(report, { status: report.ok ? 200 : 503 });
  }

  return NextResponse.json({ ok: report.ok }, { status: report.ok ? 200 : 503 });
}
