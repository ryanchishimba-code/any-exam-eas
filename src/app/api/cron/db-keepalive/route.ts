import { NextResponse } from "next/server";
import { warmNeonCompute } from "@/lib/neon-warmup";

export const maxDuration = 30;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const cronHeader = req.headers.get("x-vercel-cron");
  return cronHeader === "1" && Boolean(process.env.VERCEL);
}

/**
 * Keep Neon compute from autosuspending between user traffic.
 * Free/launch tiers sleep after ~5 minutes idle; that causes P1001 storms on
 * the next Prisma TCP request (especially hourly billing-reminders).
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warm = await warmNeonCompute("cron.db-keepalive");

  let prismaMs: number | null = null;
  let prismaOk = false;
  if (warm.ok) {
    const t0 = Date.now();
    try {
      const { getPrisma } = await import("@/lib/prisma");
      await getPrisma().$queryRaw`SELECT 1`;
      prismaOk = true;
      prismaMs = Date.now() - t0;
    } catch (error) {
      prismaMs = Date.now() - t0;
      console.warn(
        "[cron/db-keepalive] prisma ping failed:",
        error instanceof Error ? error.message : error
      );
    }
  }

  const ok = warm.ok && prismaOk;
  return NextResponse.json(
    {
      ok,
      neonHttpMs: warm.ms,
      prismaMs,
      warmed: warm.ok,
    },
    {
      status: ok ? 200 : 503,
      headers: ok ? undefined : { "Retry-After": "30" },
    }
  );
}
