#!/usr/bin/env node
/**
 * Push Resend email env vars from .env to Vercel production.
 * Usage: node scripts/vercel-email-push.mjs [--redeploy]
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";

const KEYS = [
  { key: "RESEND_API_KEY", sensitive: true },
  { key: "EMAIL_FROM", sensitive: false },
  { key: "NEXTAUTH_URL", sensitive: false, fallback: "https://www.anyexameasy.com" },
  { key: "NEXT_PUBLIC_SITE_URL", sensitive: false, fallback: "https://www.anyexameasy.com" },
];

function parseEnv(content) {
  const out = {};
  for (const line of content.split("\n")) {
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
    out[key] = val;
  }
  return out;
}

function runVercelEnvAdd(key, value, target, sensitive) {
  const args = [
    "vercel",
    "env",
    "add",
    key,
    target,
    "--value",
    value,
    "--yes",
    "--force",
  ];
  if (sensitive) args.push("--sensitive");
  else args.push("--no-sensitive");

  const r = spawnSync(VERCEL, args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  if (r.status !== 0) {
    console.error(`Failed ${key} (${target}):`, r.stderr || r.stdout);
    return false;
  }
  console.log(`✓ ${key} → ${target}`);
  return true;
}

function main() {
  if (!existsSync(ENV_PATH)) {
    console.error("No .env file. Run: node scripts/resend-setup.mjs first.");
    process.exit(1);
  }

  const env = parseEnv(readFileSync(ENV_PATH, "utf8"));
  let ok = true;

  for (const { key, sensitive, fallback } of KEYS) {
    const value = env[key]?.trim() || fallback;
    if (!value) {
      console.error(`Missing ${key} in .env`);
      ok = false;
      continue;
    }
    if (!runVercelEnvAdd(key, value, "production", sensitive)) ok = false;
  }

  if (!ok) process.exit(1);

  console.log("\n✓ Email env pushed to Vercel production.");
  console.log("  Redeploy for changes to take effect:");
  console.log("  npx vercel --prod\n");

  if (process.argv.includes("--redeploy")) {
    const r = spawnSync(VERCEL, ["--prod"], { cwd: root, stdio: "inherit" });
    process.exit(r.status ?? 1);
  }
}

main();
