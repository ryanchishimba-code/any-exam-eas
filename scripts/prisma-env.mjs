import { resolveDatabaseUrl } from "./resolve-database-url.mjs";

export const BUILD_PLACEHOLDER_DATABASE_URL =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

const BUILD_PLACEHOLDER_RE =
  /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/;

/** @returns {boolean} true if using the build-time placeholder (not a real DB) */
export function isPlaceholderDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return !url || url === BUILD_PLACEHOLDER_DATABASE_URL || BUILD_PLACEHOLDER_RE.test(url);
}

/** Resolve Neon/Vercel env vars, or fall back to build placeholder for prisma generate. */
export function ensureDatabaseUrl() {
  const resolved = resolveDatabaseUrl();
  if (resolved) {
    process.env.DATABASE_URL = resolved;
    delete process.env.PRISMA_DATABASE_URL_PLACEHOLDER;
    return false;
  }

  process.env.DATABASE_URL = BUILD_PLACEHOLDER_DATABASE_URL;
  process.env.PRISMA_DATABASE_URL_PLACEHOLDER = "1";
  console.warn(
    "Warning: DATABASE_URL is not set. Using a build-time placeholder."
  );
  console.warn(
    "Add your PostgreSQL URL (Neon pooled postgresql://) in environment variables."
  );
  return true;
}

/** Production Neon endpoint. Preview and local builds must not migrate this host. */
export const PRODUCTION_DATABASE_HOST_MARKER = "ep-small-resonance-apmf4kiq";

export function databaseHostname(url = "") {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function isProductionDatabaseHost(url = "") {
  return databaseHostname(url).includes(PRODUCTION_DATABASE_HOST_MARKER);
}

/**
 * Preview (and any non-production Vercel env) must never migrate production.
 * Production deploys are allowed. Local runs with no VERCEL_ENV are allowed
 * only when the caller is not on Vercel; the build script still blocks them
 * when VERCEL_ENV is preview.
 */
export function migrationBlockedBecauseProduction(url = "", vercelEnv = process.env.VERCEL_ENV ?? "") {
  if (!vercelEnv || vercelEnv === "production") return false;
  return isProductionDatabaseHost(url);
}

export function shouldRunMigrations() {
  if (process.env.PRISMA_DATABASE_URL_PLACEHOLDER === "1") return false;
  const url = process.env.DATABASE_URL ?? "";
  if (isPlaceholderDatabaseUrl(url)) return false;
  if (migrationBlockedBecauseProduction(url)) return false;
  return /^postgres(ql)?:\/\//.test(url);
}
