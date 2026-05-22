import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
  else if (url.startsWith("file:")) checks.databaseUrl = "sqlite-not-supported-on-vercel";
  else if (/build:build@127\.0\.0\.1/.test(url)) checks.databaseUrl = "build-placeholder";
  else if (/^postgres(ql)?:\/\//.test(url)) checks.databaseUrl = "postgresql";

  if (checks.databaseUrl === "postgresql") {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      checks.prisma = "ok";
      const count = await prisma.questionBankItem.count({ where: { active: true } });
      checks.questionBank = count > 0 ? `ok (${count} active)` : "empty-run-cron-sync";
    } catch (e) {
      checks.prisma = e instanceof Error ? e.message : "error";
    }
  } else {
    checks.prisma = "skipped";
    checks.questionBank = "skipped";
  }

  const ok =
    checks.nextauthSecret === "ok" &&
    checks.databaseUrl === "postgresql" &&
    checks.prisma === "ok";

  return NextResponse.json(
    { ok, checks, vercel: !!process.env.VERCEL },
    { status: ok ? 200 : 503 }
  );
}
