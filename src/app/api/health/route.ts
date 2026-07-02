import { NextResponse } from "next/server";
import {
  isHealthDetailAuthorized,
  runAuthConfigCheck,
  runHealthChecks,
  runPublicHealthCheck,
} from "@/lib/health-check";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

/** Uptime / load-balancer check — public body is `{ ok }` only; details require Bearer CRON_SECRET. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("config") === "1") {
      const { ok } = runAuthConfigCheck();
      return NextResponse.json({ ok }, { status: ok ? 200 : 503 });
    }

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
