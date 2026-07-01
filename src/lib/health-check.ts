import {
  ensureDatabaseUrlEnv,
  isBuildPlaceholderDatabaseUrl,
  isPostgresDatabaseUrl,
  isSqliteDatabaseUrl,
  resolveDatabaseUrl,
} from "@/lib/database-url";

let bankCountCache: { count: number; at: number } | null = null;
const BANK_COUNT_TTL_MS = 30_000;

let databasePingCache: { ok: boolean; at: number } | null = null;
const DATABASE_PING_TTL_MS = 30_000;
const DB_PING_TIMEOUT_MS = 5_000;
const PRISMA_PING_TIMEOUT_MS = 10_000;
const DB_RETRY_ATTEMPTS = 2;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label}_timeout`)), ms)
    ),
  ]);
}

async function pingPostgresViaNeon(): Promise<void> {
  const { getNeonSql } = await import("@/db");
  const sql = getNeonSql();
  await withTimeout(sql`SELECT 1 as n`, DB_PING_TIMEOUT_MS, "neon_ping");
}

async function pingViaPrisma(): Promise<void> {
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  await withTimeout(prisma.$queryRaw`SELECT 1`, PRISMA_PING_TIMEOUT_MS, "prisma_ping");
}

async function pingDatabase(
  dbKind: "postgresql" | "sqlite-local"
): Promise<"ok" | "error"> {
  const now = Date.now();
  if (databasePingCache && now - databasePingCache.at < DATABASE_PING_TTL_MS) {
    return databasePingCache.ok ? "ok" : "error";
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < DB_RETRY_ATTEMPTS; attempt++) {
    try {
      if (dbKind === "postgresql") {
        await pingPostgresViaNeon();
      } else {
        await pingViaPrisma();
      }
      databasePingCache = { ok: true, at: Date.now() };
      return "ok";
    } catch (error) {
      lastError = error;
      if (attempt + 1 < DB_RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }

  databasePingCache = { ok: false, at: Date.now() };
  console.error(
    "[health] databasePing:",
    lastError instanceof Error ? lastError.message : lastError
  );
  return "error";
}

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

function isDatabaseConfigured(checks: Record<string, string>): boolean {
  return checks.databaseUrl === "postgresql" || checks.databaseUrl === "sqlite-local";
}

function buildBaseChecks(url: string): Record<string, string> {
  const checks: Record<string, string> = {
    databaseUrl: "unknown",
    databasePing: "unknown",
  };

  if (!url) checks.databaseUrl = "missing";
  else if (isSqliteDatabaseUrl(url))
    checks.databaseUrl = process.env.VERCEL
      ? "sqlite-not-supported-on-vercel"
      : "sqlite-local";
  else if (isBuildPlaceholderDatabaseUrl(url)) checks.databaseUrl = "build-placeholder";
  else if (isPostgresDatabaseUrl(url)) checks.databaseUrl = "postgresql";

  return checks;
}

/** Fast public liveness — Neon HTTP ping (serverless-safe), cached 30s. */
export async function runPublicHealthCheck(): Promise<Pick<HealthReport, "ok" | "checks">> {
  ensureDatabaseUrlEnv();
  const url = resolveDatabaseUrl();
  const checks = buildBaseChecks(url);
  checks.nextauthSecret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "ok" : "missing";

  if (isDatabaseConfigured(checks)) {
    checks.databasePing = await pingDatabase(
      checks.databaseUrl === "sqlite-local" ? "sqlite-local" : "postgresql"
    );
  } else {
    checks.databasePing = "skipped";
  }

  const ok =
    checks.nextauthSecret === "ok" &&
    isDatabaseConfigured(checks) &&
    checks.databasePing === "ok";

  return { ok, checks };
}

/** Full internal health report (requires Bearer CRON_SECRET on the route). */
export async function runHealthChecks(): Promise<HealthReport> {
  ensureDatabaseUrlEnv();
  const url = resolveDatabaseUrl();

  const { appBaseUrl, getEmailFromAddress, isPasswordResetEmailReady } = await import(
    "@/lib/email/config"
  );

  const checks: Record<string, string> = {
    ...buildBaseChecks(url),
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
    prisma: "unknown",
    drizzle: "unknown",
    questionBank: "unknown",
  };

  if (isDatabaseConfigured(checks)) {
    checks.databasePing = await pingDatabase(
      checks.databaseUrl === "sqlite-local" ? "sqlite-local" : "postgresql"
    );

    const [prismaResult, drizzleResult, bankResult] = await Promise.allSettled([
      pingViaPrisma().then(() => "ok" as const),
      checks.databaseUrl === "postgresql"
        ? (async () => {
            const { requireDb } = await import("@/db");
            const { examSessions } = await import("@/db/schema");
            const { count } = await import("drizzle-orm");
            const db = requireDb();
            await withTimeout(
              db.select({ n: count() }).from(examSessions).limit(1),
              DB_PING_TIMEOUT_MS,
              "drizzle_ping"
            );
            return "ok" as const;
          })()
        : Promise.resolve("skipped" as const),
      (async () => {
        if (checks.databasePing !== "ok") return "skipped" as const;
        const { getPrisma } = await import("@/lib/prisma");
        const prisma = getPrisma();
        const now = Date.now();
        if (!bankCountCache || now - bankCountCache.at > BANK_COUNT_TTL_MS) {
          const count = await withTimeout(
            prisma.questionBankItem.count({ where: { active: true } }),
            PRISMA_PING_TIMEOUT_MS,
            "bank_count"
          );
          bankCountCache = { count, at: now };
        }
        const count = bankCountCache.count;
        return count > 0 ? (`ok (${count} active)` as const) : ("empty-run-cron-sync" as const);
      })(),
    ]);

    if (prismaResult.status === "fulfilled") {
      checks.prisma = prismaResult.value;
    } else {
      checks.prisma = "error";
      const detail =
        prismaResult.reason instanceof Error ? prismaResult.reason.message : "error";
      if (process.env.NODE_ENV !== "production") {
        checks.prismaDetail = detail;
      } else {
        console.error("[health] prisma:", detail);
      }
    }

    if (drizzleResult.status === "fulfilled") {
      checks.drizzle = drizzleResult.value;
    } else {
      checks.drizzle = checks.databaseUrl === "postgresql" ? "error" : "skipped";
    }

    if (bankResult.status === "fulfilled") {
      checks.questionBank = bankResult.value;
    } else {
      checks.questionBank = "timeout";
      const detail =
        bankResult.reason instanceof Error ? bankResult.reason.message : "error";
      console.error("[health] questionBank:", detail);
    }
  } else {
    checks.databasePing = "skipped";
    checks.prisma = "skipped";
    checks.drizzle = "skipped";
    checks.questionBank = "skipped";
  }

  const ok =
    checks.nextauthSecret === "ok" &&
    isDatabaseConfigured(checks) &&
    checks.databasePing === "ok";

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
