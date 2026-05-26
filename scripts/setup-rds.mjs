#!/usr/bin/env node
/**
 * Configure Prisma for PostgreSQL and apply migrations against AWS RDS.
 *
 * Prerequisites:
 *   - DATABASE_URL in .env pointing at RDS (see .env.rds.example)
 *
 * Usage:
 *   npm run db:rds
 *   npm run db:rds -- --sync
 *   npm run db:rds -- --seed-admin
 *   npm run db:rds -- --sync --seed-admin
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const args = new Set(process.argv.slice(2));
const withSync = args.has("--sync");
const withSeedAdmin = args.has("--seed-admin");

function loadEnvFile() {
  if (!existsSync(".env")) {
    console.error("Missing .env — copy .env.rds.example to .env and set DATABASE_URL.");
    process.exit(1);
  }
  const text = readFileSync(".env", "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function run(label, command, cmdArgs, opts = {}) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, cmdArgs, {
    stdio: "inherit",
    shell: true,
    env: process.env,
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`\nFailed: ${label}`);
    process.exit(result.status ?? 1);
  }
}

function assertRdsUrl() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }
  if (url.startsWith("file:")) {
    console.error(
      "DATABASE_URL still uses SQLite (file:). Set an RDS postgresql:// URL — see docs/AWS_RDS.md"
    );
    process.exit(1);
  }
  if (/build:build@127\.0\.0\.1/.test(url)) {
    console.error("DATABASE_URL is the build placeholder. Set your real RDS URL.");
    process.exit(1);
  }
  if (!/^postgres(ql)?:\/\//.test(url)) {
    console.error("DATABASE_URL must start with postgresql://");
    process.exit(1);
  }
  if (!url.includes("sslmode=")) {
    console.warn(
      "Tip: append ?sslmode=require to DATABASE_URL for AWS RDS (see docs/AWS_RDS.md)"
    );
  }
  const host = url.match(/@([^:/]+)/)?.[1] ?? "unknown";
  console.log(`Target database host: ${host}`);
}

loadEnvFile();
assertRdsUrl();

console.log("Setting up Any Exam Easy for AWS RDS PostgreSQL…");

run("Set Prisma provider → postgresql", "node", [
  "scripts/set-prisma-provider.mjs",
  "postgresql",
]);
run("Generate Prisma client", "npx", ["prisma", "generate"]);
run("Apply migrations (migrate deploy)", "npx", ["prisma", "migrate", "deploy"]);

if (withSync) {
  console.log("\nSyncing question bank (may take 10–30 minutes on first run)…");
  run("Sync question bank", "node", ["scripts/sync-question-bank.mjs"], {
    allowFail: false,
  });
} else {
  console.log(
    "\nSkipped question bank sync. Run: npm run db:sync-questions  or  npm run db:rds -- --sync"
  );
}

if (withSeedAdmin) {
  run("Seed admin user", "node", ["scripts/seed-dev-user.mjs"], {
    env: { ...process.env, DEV_USER_ROLE: "admin" },
  });
}

console.log("\n✓ RDS setup complete.");
console.log("  Verify: npm run dev  →  curl http://localhost:3000/api/health");
console.log("  Docs:   docs/AWS_RDS.md");
