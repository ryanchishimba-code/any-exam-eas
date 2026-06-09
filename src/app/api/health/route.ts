import { NextResponse } from "next/server";
import {
  ensureDatabaseUrlEnv,
  isBuildPlaceholderDatabaseUrl,
  isPostgresDatabaseUrl,
  isSqliteDatabaseUrl,
  resolveDatabaseUrl,
} from "@/lib/database-url";

export const dynamic = "force-dynamic";

let bankCountCache: { count: number; at: number } | null = null;
const BANK_COUNT_TTL_MS = 30_000;

/** Lightweight check for Vercel / uptime monitors (no secrets returned). */
export async function GET() {
  ensureDatabaseUrlEnv();
  const url = resolveDatabaseUrl();

  const checks: Record<string, string> = {
    nextauthSecret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "ok" : "missing",
    passwordResetEmail:
      process.env.RESEND_API_KEY?.trim()
        ? process.env.EMAIL_FROM?.includes("resend.dev")
          ? "resend-key-set-sandbox-from"
          : "ok"
        : "resend-key-missing",
    databaseUrl: "unknown",
    prisma: "unknown",
    drizzle: "unknown",
    questionBank: "unknown",
  };

  if (!url) checks.databaseUrl = "missing";
  else if (isSqliteDatabaseUrl(url))
    checks.databaseUrl = process.env.VERCEL
      ? "sqlite-not-supported-on-vercel"
      : "sqlite-local";
  else if (isBuildPlaceholderDatabaseUrl(url)) checks.databaseUrl = "build-placeholder";
  else if (isPostgresDatabaseUrl(url)) checks.databaseUrl = "postgresql";

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

    if (checks.databaseUrl === "postgresql") {
      try {
        const { requireDb } = await import("@/db");
        const { examSessions } = await import("@/db/schema");
        const { count } = await import("drizzle-orm");
        const db = requireDb();
        await db.select({ n: count() }).from(examSessions).limit(1);
        checks.drizzle = "ok";
      } catch (e) {
        checks.drizzle = e instanceof Error ? e.message : "error";
      }
    } else {
      checks.drizzle = "skipped";
    }
  } else {
    checks.prisma = "skipped";
    checks.drizzle = "skipped";
    checks.questionBank = "skipped";
  }

  const dbOk =
    checks.databaseUrl === "postgresql" || checks.databaseUrl === "sqlite-local";
  const emailOk =
    process.env.NODE_ENV !== "production" || checks.passwordResetEmail === "ok";

  const ok =
    checks.nextauthSecret === "ok" &&
    dbOk &&
    checks.prisma === "ok" &&
    (checks.drizzle === "ok" || checks.drizzle === "skipped") &&
    emailOk;

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
