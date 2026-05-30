const BUILD_PLACEHOLDER =
  /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/;

/** Neon pooled hostnames include `-pooler` */
const NEON_POOLER = /[.-]pooler[.-]|pooler\./i;

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
    if (!parsed.searchParams.has("connection_limit")) {
      parsed.searchParams.set("connection_limit", process.env.PRISMA_CONNECTION_LIMIT ?? "5");
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", "20");
    }
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "10");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function getRuntimeDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "";
  if (!raw || isBuildPlaceholderDatabaseUrl(raw)) return raw;
  return withPoolParams(raw);
}

export function assertRuntimeDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "";

  if (isSqliteDatabaseUrl(url) && process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL uses SQLite on Vercel. Set a Neon postgresql:// pooled URL in environment variables."
    );
  }

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon pooled postgresql:// URL to .env (see docs/VERCEL_DATABASE.md)."
    );
  }

  if (isBuildPlaceholderDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL is still the build placeholder. Set your real Neon postgresql:// URL in Vercel env."
    );
  }

  if (process.env.NODE_ENV === "production" && isPostgresDatabaseUrl(url) && !isNeonPooledUrl(url)) {
    console.warn(
      "[db] DATABASE_URL may not use Neon pooler. For 3k+ MAU use the pooled connection string (-pooler hostname)."
    );
  }
}
