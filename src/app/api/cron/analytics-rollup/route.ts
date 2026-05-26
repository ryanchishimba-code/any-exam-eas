import { NextResponse } from "next/server";
import { rollupDailySummaries } from "@/lib/analytics/aggregate";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await rollupDailySummaries();
  return NextResponse.json({ ok: true, metricsWritten: count });
}
