#!/usr/bin/env node
/**
 * Push the local Neon DATABASE_URL to Vercel (Production + Preview + Development).
 * Uses the pooled URL from .env.local / .env — same DB that passes npm run vercel:db locally.
 *
 * Usage:
 *   node scripts/push-vercel-database-url.mjs
 *   node scripts/push-vercel-database-url.mjs --redeploy
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { withPoolParams } from "./resolve-database-url.mjs";

function loadEnvFiles() {
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

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function upsertEnv(name, value, environments) {
  for (const env of environments) {
    spawnSync("npx", ["vercel", "env", "rm", name, env, "--yes"], {
      stdio: "ignore",
    });
    console.log(`Setting ${name} on ${env}…`);
    run("npx", ["vercel", "env", "add", name, env, "--value", value, "--yes"]);
  }
}

loadEnvFiles();

const raw = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
if (!raw.startsWith("postgres")) {
  console.error("Set DATABASE_URL in .env.local to your Neon pooled postgresql:// URL first.");
  process.exit(1);
}

const databaseUrl = withPoolParams(raw).replace(
  /connection_limit=\d+/,
  "connection_limit=1"
);
process.env.PRISMA_CONNECTION_LIMIT = "1";

let host = "unknown";
try {
  host = new URL(databaseUrl).hostname;
} catch {
  /* ignore */
}

console.log(`Neon host: ${host}`);
console.log("Updating Vercel env (Production, Preview, Development)…\n");

const targets = ["production", "development"];
upsertEnv("DATABASE_URL", databaseUrl, targets);
upsertEnv("POSTGRES_URL", databaseUrl, targets);
upsertEnv("POSTGRES_PRISMA_URL", databaseUrl, targets);

console.log("\nNote: Preview env must be set in Vercel dashboard or via:");
console.log(`  npx vercel env add DATABASE_URL preview --value '<pooled-url>' --yes`);

console.log("\n✓ DATABASE_URL synced to Vercel.");
console.log("Redeploy production so lambdas pick up the new connection string.");

if (process.argv.includes("--redeploy")) {
  console.log("\nRedeploying production…");
  run("npx", ["vercel", "deploy", "--prod", "--yes"]);
}
