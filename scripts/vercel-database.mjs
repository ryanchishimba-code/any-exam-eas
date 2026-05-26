#!/usr/bin/env node
/**
 * Apply Prisma migrations to Neon / Vercel Postgres using DATABASE_URL from .env
 * Usage: npm run vercel:db
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

function loadEnv() {
  if (!existsSync(".env")) {
    console.error("No .env file. Copy .env.example and set DATABASE_URL to your Neon URL.");
    console.error("Guide: docs/VERCEL_DATABASE.md");
    process.exit(1);
  }
  for (const line of readFileSync(".env", "utf8").split("\n")) {
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

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true, env: process.env });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

loadEnv();
const url = process.env.DATABASE_URL ?? "";

if (!url.startsWith("postgres")) {
  console.error("DATABASE_URL must be a postgresql:// URL (Neon). See docs/VERCEL_DATABASE.md");
  process.exit(1);
}

console.log("Using Neon/Postgres:", url.replace(/:[^:@]+@/, ":****@"));

run("node", ["scripts/set-prisma-provider.mjs", "postgresql"]);
run("npx", ["prisma", "generate"]);
console.log("\nApplying migrations…");
run("npx", ["prisma", "migrate", "deploy"]);

console.log("\n✓ Database schema is ready.");
console.log("Next: add DATABASE_URL to Vercel (Production + Build) and redeploy.");
console.log("Optional: npm run db:sync-questions  (large; can run on Vercel cron instead)");
