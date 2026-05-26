import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let bankCountCache: { count: number; at: number } | null = null;
const BANK_COUNT_TTL_MS = 30_000;

/** Lightweight check for Vercel / uptime monitors (no secrets returned). */
export async function GET() {
  const checks: Record<string, string> = {
    nextauthSecret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "ok" : "missing",
    databaseUrl: "unknown",
    prisma: "unknown",
    questionBank: "unknown",
  };

  const url = process.env.DATABASE_URL ?? "";
  if (!url) checks.databaseUrl = "missing";
  else if (url.startsWith("file:"))
    checks.databaseUrl = process.env.VERCEL
      ? "sqlite-not-supported-on-vercel"
      : "sqlite-local";
  else if (/build:build@127\.0\.0\.1/.test(url)) checks.databaseUrl = "build-placeholder";
  else if (/^postgres(ql)?:\/\//.test(url)) checks.databaseUrl = "postgresql";

  if (checks.databaseUrl === "postgresql" || checks.databaseUrl === "sqlite-local") {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      checks.prisma = "ok";
      const now = Date.now();
      if (!bankCountCache || now - bankCountCache.at > BANK_COUNT_TTL_MS) {
        const count = await prisma.questionBankItem.count({
          where: { active: true },
        });
        bankCountCache = { count, at: now };
      }
      const count = bankCountCache.count;
      checks.questionBank = count > 0 ? `ok (${count} active)` : "empty-run-cron-sync";
    } catch (e) {
      checks.prisma = e instanceof Error ? e.message : "error";
    }
  } else {
    checks.prisma = "skipped";
    checks.questionBank = "skipped";
  }

  const dbOk =
    checks.databaseUrl === "postgresql" || checks.databaseUrl === "sqlite-local";
  const ok = checks.nextauthSecret === "ok" && dbOk && checks.prisma === "ok";

  let env: Record<string, string> | undefined;
  try {
    const { envSummary } = await import("@/lib/env");
    env = envSummary();
  } catch {
    env = undefined;
  }

  return NextResponse.json(
    { ok, checks, env, vercel: !!process.env.VERCEL },
    { status: ok ? 200 : 503 }
  );
}
