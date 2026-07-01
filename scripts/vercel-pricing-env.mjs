#!/usr/bin/env node
/**
 * Push pricing + trial display env vars to Vercel production.
 *
 * Requires VERCEL_TOKEN in .env (or shell) and a linked project.
 *
 * Usage:
 *   npm run vercel:pricing-env
 *   npm run vercel:pricing-env -- --redeploy
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";

const KEYS = [
  "PRO_MONTHLY_PRICE_USD",
  "PRO_YEARLY_PRICE_USD",
  "MONTHLY_PRICE_USD",
  "BASIC_MONTHLY_PRICE_USD",
  "BASIC_YEARLY_PRICE_USD",
  "TRIAL_DAYS",
  "TRIAL_LIFETIME_QUESTIONS",
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

function runVercelEnvAdd(key, value) {
  const args = [
    "vercel",
    "env",
    "add",
    key,
    "production",
    "--value",
    value,
    "--yes",
    "--force",
    "--no-sensitive",
  ];
  const r = spawnSync(VERCEL, args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  if (r.status !== 0) {
    console.error(`Failed ${key}:`, r.stderr || r.stdout);
    return false;
  }
  console.log(`✓ ${key}=${value} → production`);
  return true;
}

function main() {
  if (!process.env.VERCEL_TOKEN?.trim()) {
    console.error(
      "Missing VERCEL_TOKEN. Add it to .env (see .env.example) then re-run npm run vercel:pricing-env"
    );
    process.exit(1);
  }

  if (!existsSync(ENV_PATH)) {
    console.error("No .env file found.");
    process.exit(1);
  }

  const env = parseEnv(readFileSync(ENV_PATH, "utf8"));
  let ok = true;

  for (const key of KEYS) {
    const value = env[key]?.trim() ?? "";
    if (!value) {
      console.error(`Missing ${key} in .env`);
      ok = false;
      continue;
    }
    if (!runVercelEnvAdd(key, value)) ok = false;
  }

  if (!ok) process.exit(1);

  if (process.argv.includes("--redeploy")) {
    console.log("\nRedeploying production…");
    const r = spawnSync(VERCEL, ["vercel", "--prod", "--yes"], {
      cwd: root,
      encoding: "utf8",
      stdio: "inherit",
    });
    process.exit(r.status ?? 1);
  }

  console.log("\nDone. Redeploy production for changes to appear on the site.");
}

main();
