#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pulled = join(root, ".env.vercel.pulled");

if (!existsSync(pulled)) {
  console.error("Missing .env.vercel.pulled — run: vercel env pull .env.vercel.pulled");
  process.exit(1);
}

const text = readFileSync(pulled, "utf8");
const match = text.match(/^exameasy_POSTGRES_PRISMA_URL="([^"]+)"/m);
if (!match) {
  console.error("exameasy_POSTGRES_PRISMA_URL not found in .env.vercel.pulled");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: match[1] };
const result = spawnSync("npx", ["tsx", "scripts/seed-test-users.mjs"], {
  cwd: root,
  env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
