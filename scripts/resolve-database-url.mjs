/**
 * Resolve Neon DATABASE_URL for CLI scripts (.env.local + Vercel fallbacks).
 */
import { readFileSync, existsSync } from "node:fs";

const BUILD_PLACEHOLDER =
  /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/;

const CANDIDATES = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "NEON_DATABASE_URL",
];

export function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

function isUsable(url) {
  if (!url?.trim()) return false;
  if (BUILD_PLACEHOLDER.test(url)) return false;
  return url.startsWith("postgres") || url.startsWith("file:");
}

/**
 * Bound the Prisma connection pool for CLI scripts. Without this, each
 * `new PrismaClient()` opens Prisma's default pool (num_cpus*2+1 connections),
 * so several concurrent generation jobs exhaust Neon's connection limit.
 * Mirrors withPoolParams() in src/lib/database-url.ts.
 */
export function withPoolParams(url) {
  if (!url || !/^postgres(ql)?:\/\//.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connection_limit")) {
      parsed.searchParams.set(
        "connection_limit",
        process.env.PRISMA_CONNECTION_LIMIT ?? "5"
      );
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", process.env.PRISMA_POOL_TIMEOUT ?? "20");
    }
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "10");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function resolveDatabaseUrl() {
  for (const key of CANDIDATES) {
    const value = process.env[key];
    if (isUsable(value)) return value;
  }

  if (process.env.VERCEL) {
    return "";
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!isUsable(value)) continue;
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

export function ensureDatabaseUrlEnv() {
  const resolved = resolveDatabaseUrl();
  if (!resolved) return resolved;
  const bounded = withPoolParams(resolved);
  if (process.env.DATABASE_URL !== bounded) {
    process.env.DATABASE_URL = bounded;
  }
  return bounded;
}
