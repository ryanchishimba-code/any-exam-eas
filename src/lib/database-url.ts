const BUILD_PLACEHOLDER =
  /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/;

/** Neon pooled hostnames include `-pooler` */
const NEON_POOLER = /[.-]pooler[.-]|pooler\./i;

const DATABASE_URL_CANDIDATES = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "NEON_DATABASE_URL",
] as const;

/** Vercel Neon integration injects `{project}_DATABASE_URL` — often a stale branch. */
function isIntegrationPrefixedDatabaseKey(key: string): boolean {
  return /^[a-z0-9_-]+_(DATABASE_URL|POSTGRES_URL|POSTGRES_PRISMA_URL|POSTGRES_URL_NON_POOLING)$/.test(
    key
  );
}

function isUsableDatabaseUrl(url: string | undefined): url is string {
  if (!url?.trim()) return false;
  if (isBuildPlaceholderDatabaseUrl(url)) return false;
  return isPostgresDatabaseUrl(url) || isSqliteDatabaseUrl(url);
}

/**
 * Resolve Neon/Vercel database URL from common env var names.
 * Vercel Neon integrations sometimes inject POSTGRES_URL or prefixed vars
 * while DATABASE_URL remains empty.
 */
export function resolveDatabaseUrl(): string {
  for (const key of DATABASE_URL_CANDIDATES) {
    const value = process.env[key];
    if (isUsableDatabaseUrl(value)) return value;
  }

  // On Vercel, never fall back to integration-prefixed vars — they may point at the
  // wrong Neon branch while DATABASE_URL is the canonical production database.
  if (process.env.VERCEL) {
    return "";
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!value || !isUsableDatabaseUrl(value)) continue;
    if (isIntegrationPrefixedDatabaseKey(key)) {
      return value;
    }
    if (
      key.endsWith("_POSTGRES_URL") ||
      key.endsWith("_DATABASE_URL") ||
      key.endsWith("_POSTGRES_PRISMA_URL") ||
      key.endsWith("_POSTGRES_URL_NON_POOLING")
    ) {
      return value;
    }
  }

  return "";
}

function hasConfiguredBuildPlaceholder(): boolean {
  for (const key of DATABASE_URL_CANDIDATES) {
    const value = process.env[key];
    if (value?.trim() && isBuildPlaceholderDatabaseUrl(value)) return true;
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!value?.trim() || !isBuildPlaceholderDatabaseUrl(value)) continue;
    if (
      key.endsWith("_POSTGRES_URL") ||
      key.endsWith("_DATABASE_URL") ||
      key.endsWith("_POSTGRES_PRISMA_URL") ||
      key.endsWith("_POSTGRES_URL_NON_POOLING")
    ) {
      return true;
    }
  }

  return false;
}

/** Ensure process.env.DATABASE_URL is populated with pool params for Prisma/Drizzle. */
export function ensureDatabaseUrlEnv(): string {
  const resolved = resolveDatabaseUrl();
  if (!resolved) return resolved;
  const bounded = withPoolParams(resolved);
  if (process.env.DATABASE_URL !== bounded) {
    process.env.DATABASE_URL = bounded;
  }
  return bounded;
}

export function isBuildPlaceholderDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return BUILD_PLACEHOLDER.test(url);
}

export function isSqliteDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return url.startsWith("file:");
}

export function isPostgresDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return /^postgres(ql)?:\/\//.test(url);
}

export function isNeonPooledUrl(url = process.env.DATABASE_URL ?? "") {
  return isPostgresDatabaseUrl(url) && NEON_POOLER.test(url);
}

/**
 * Append Prisma connection pool hints for serverless (Neon recommended: pooled URL + low limit).
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
export function withPoolParams(url: string): string {
  if (!isPostgresDatabaseUrl(url)) return url;
  try {
    const parsed = new URL(url);
    const connectionLimit =
      process.env.PRISMA_CONNECTION_LIMIT ??
      (process.env.VERCEL ? "1" : "5");
    // Always enforce — Vercel Neon integration URLs often ship with limit=5.
    parsed.searchParams.set("connection_limit", connectionLimit);
    parsed.searchParams.set(
      "pool_timeout",
      process.env.PRISMA_POOL_TIMEOUT ?? (process.env.VERCEL ? "30" : "20")
    );
    parsed.searchParams.set(
      "connect_timeout",
      process.env.PRISMA_CONNECT_TIMEOUT ?? "10"
    );
    if (process.env.VERCEL) {
      parsed.searchParams.set("pgbouncer", "true");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function getRuntimeDatabaseUrl(): string {
  const raw = resolveDatabaseUrl();
  if (!raw) return raw;
  return withPoolParams(raw);
}

/**
 * Connection string for @neondatabase/serverless HTTP driver.
 * Uses the pooled Neon host but strips Prisma-only pool query params.
 */
export function getNeonHttpDatabaseUrl(): string {
  const raw = resolveDatabaseUrl();
  if (!raw || !isPostgresDatabaseUrl(raw)) return raw;
  try {
    const parsed = new URL(raw);
    for (const key of [
      "connection_limit",
      "pool_timeout",
      "connect_timeout",
      "pgbouncer",
    ]) {
      parsed.searchParams.delete(key);
    }
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

export function assertRuntimeDatabaseUrl() {
  const url = resolveDatabaseUrl();

  if (isSqliteDatabaseUrl(url) && process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL uses SQLite on Vercel. Set a Neon postgresql:// pooled URL in environment variables."
    );
  }

  if (!url) {
    if (hasConfiguredBuildPlaceholder()) {
      throw new Error(
        "DATABASE_URL is still the build placeholder. Set your real Neon postgresql:// URL in Vercel env."
      );
    }
    throw new Error(
      "DATABASE_URL is not set. Add your Neon pooled postgresql:// URL to .env (see docs/VERCEL_DATABASE.md)."
    );
  }

  if (process.env.NODE_ENV === "production" && isPostgresDatabaseUrl(url) && !isNeonPooledUrl(url)) {
    console.warn(
      "[db] DATABASE_URL may not use Neon pooler. For 3k+ MAU use the pooled connection string (-pooler hostname)."
    );
  }
}
