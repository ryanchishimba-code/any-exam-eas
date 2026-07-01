import { NextResponse } from "next/server";
import {
  isHealthDetailAuthorized,
  runHealthChecks,
  runPublicHealthCheck,
} from "@/lib/health-check";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

/** Uptime / load-balancer check — public body is `{ ok }` only; details require Bearer CRON_SECRET. */
export async function GET(req: Request) {
  try {
    const detailed = isHealthDetailAuthorized(req);
    const report = detailed ? await runHealthChecks() : await runPublicHealthCheck();

    if (detailed) {
      return NextResponse.json(report, { status: report.ok ? 200 : 503 });
    }

    return NextResponse.json({ ok: report.ok }, { status: report.ok ? 200 : 503 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "health check failed";
    console.error("[health]", message);
    return NextResponse.json({ ok: false, error: "health_check_failed" }, { status: 503 });
  }
}
