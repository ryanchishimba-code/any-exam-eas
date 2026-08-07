import { NextResponse } from "next/server";
import { warmNeonCompute } from "@/lib/neon-warmup";

export const maxDuration = 60;
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
 * Neon scale-to-zero sleeps after ~5 minutes idle; this cron runs every
 * 3 minutes (see vercel.json) so compute stays warm ahead of study traffic.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warm = await warmNeonCompute("cron.db-keepalive");

  // Always attempt Prisma even if HTTP warm failed — either path can wake compute.
  const t0 = Date.now();
  let prismaMs: number | null = null;
  let prismaOk = false;
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

  // Success if either path reached Postgres — both keep the endpoint awake.
  const ok = warm.ok || prismaOk;
  return NextResponse.json(
    {
      ok,
      neonHttpMs: warm.ms,
      prismaMs,
      warmed: warm.ok,
      prismaOk,
    },
    {
      status: ok ? 200 : 503,
      headers: ok ? undefined : { "Retry-After": "30" },
    }
  );
}
