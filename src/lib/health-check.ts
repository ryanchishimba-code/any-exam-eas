import {
  ensureDatabaseUrlEnv,
  isBuildPlaceholderDatabaseUrl,
  isPostgresDatabaseUrl,
  isSqliteDatabaseUrl,
  resolveDatabaseUrl,
} from "@/lib/database-url";

let bankCountCache: { count: number; at: number } | null = null;
const BANK_COUNT_TTL_MS = 30_000;

export type HealthReport = {
  ok: boolean;
  checks: Record<string, string>;
  env?: Record<string, string>;
  scaleReadiness?: import("@/lib/scale-readiness").ScaleReadinessReport;
  vercel: boolean;
};

export function isHealthDetailAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

/** Full internal health report (requires Bearer CRON_SECRET on the route). */
export async function runHealthChecks(): Promise<HealthReport> {
  ensureDatabaseUrlEnv();
  const url = resolveDatabaseUrl();

  const { appBaseUrl, getEmailFromAddress, isPasswordResetEmailReady } = await import(
    "@/lib/email/config"
  );

  const checks: Record<string, string> = {
    nextauthSecret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "ok" : "missing",
    passwordResetEmail:
      process.env.RESEND_API_KEY?.trim()
        ? process.env.EMAIL_FROM?.includes("resend.dev") || process.env.EMAIL_FROM?.includes("onboarding@")
          ? "resend-key-set-sandbox-from"
          : "ok"
        : "resend-key-missing",
    passwordResetDeliverable: isPasswordResetEmailReady() ? "yes" : "no",
    emailFrom: getEmailFromAddress(),
    resetBaseUrl: appBaseUrl(),
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
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("db_connect_timeout")), 8_000)
        ),
      ]);
      checks.prisma = "ok";
      const now = Date.now();
      if (!bankCountCache || now - bankCountCache.at > BANK_COUNT_TTL_MS) {
        const count = await Promise.race([
          prisma.questionBankItem.count({ where: { active: true } }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("bank_count_timeout")), 8_000)
          ),
        ]);
        bankCountCache = { count, at: now };
      }
      const count = bankCountCache.count;
      checks.questionBank = count > 0 ? `ok (${count} active)` : "empty-run-cron-sync";
    } catch (e) {
      checks.prisma = "error";
      const detail = e instanceof Error ? e.message : "error";
      if (process.env.NODE_ENV !== "production") {
        checks.prismaDetail = detail;
      } else {
        console.error("[health] prisma:", detail);
      }
    }

    if (checks.databaseUrl === "postgresql") {
      try {
        const { requireDb } = await import("@/db");
        const { examSessions } = await import("@/db/schema");
        const { count } = await import("drizzle-orm");
        const db = requireDb();
        await Promise.race([
          db.select({ n: count() }).from(examSessions).limit(1),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("drizzle_connect_timeout")), 8_000)
          ),
        ]);
        checks.drizzle = "ok";
      } catch {
        checks.drizzle = "error";
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
  const ok =
    checks.nextauthSecret === "ok" &&
    dbOk &&
    checks.prisma === "ok";

  let env: Record<string, string> | undefined;
  try {
    const { envSummary } = await import("@/lib/env");
    env = envSummary();
  } catch {
    env = undefined;
  }

  let scaleReadiness: HealthReport["scaleReadiness"];
  try {
    const { runScaleReadinessChecks } = await import("@/lib/scale-readiness");
    scaleReadiness = runScaleReadinessChecks();
  } catch {
    scaleReadiness = undefined;
  }

  return { ok, checks, env, scaleReadiness, vercel: !!process.env.VERCEL };
}
