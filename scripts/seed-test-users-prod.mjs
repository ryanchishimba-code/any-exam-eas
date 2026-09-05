#!/usr/bin/env node
/**
 * Seed QA test users against the production Neon DB.
 * Prefers DATABASE_URL from .env.local, then Vercel-pulled env files.
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadEnvFiles, resolveDatabaseUrl } from "./resolve-database-url.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readPulledUrl() {
  const pulled = join(root, ".env.vercel.pulled");
  if (!existsSync(pulled)) return "";
  const text = readFileSync(pulled, "utf8");
  for (const key of [
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "exameasy_POSTGRES_PRISMA_URL",
    "exameasy_DATABASE_URL",
  ]) {
    const match = text.match(new RegExp(`^${key}="?([^"\\n]+)"?`, "m"));
    if (match?.[1]?.startsWith("postgres")) return match[1];
  }
  return "";
}

loadEnvFiles();
const databaseUrl = resolveDatabaseUrl() || readPulledUrl();

if (!databaseUrl) {
  console.error(
    "No production DATABASE_URL found. Set .env.local or run: vercel env pull .env.vercel.pulled"
  );
  process.exit(1);
}

try {
  const u = new URL(databaseUrl.replace(/^postgres:/, "postgresql:"));
  console.log(`Seeding QA users on ${u.host}${u.pathname}`);
} catch {
  console.log("Seeding QA users (host parse failed)");
}

const env = { ...process.env, DATABASE_URL: databaseUrl };
const result = spawnSync("npx", ["tsx", "scripts/seed-test-users.mjs"], {
  cwd: root,
  env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
