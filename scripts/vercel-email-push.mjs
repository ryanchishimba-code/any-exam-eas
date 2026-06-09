#!/usr/bin/env node
/**
 * Push Resend email env vars from .env.local / .env to Vercel production.
 * Usage: node scripts/vercel-email-push.mjs [--redeploy]
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";
const PRODUCTION_FROM = "Any Exam Easy <noreply@anyexameasy.com>";

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

/** Merge .env then .env.local (local overrides). */
function loadProjectEnv() {
  const merged = {};
  for (const file of [".env", ".env.local"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    Object.assign(merged, parseEnv(readFileSync(path, "utf8")));
  }
  return merged;
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
  const env = loadProjectEnv();

  if (!env.RESEND_API_KEY?.trim()) {
    console.error("No RESEND_API_KEY in .env or .env.local.");
    console.error("Run: RESEND_API_KEY=re_xxx node scripts/resend-setup.mjs");
    process.exit(1);
  }

  let ok = true;

  for (const { key, sensitive, fallback } of KEYS) {
    let value = env[key]?.trim() || fallback;
    if (!value) {
      console.error(`Missing ${key}`);
      ok = false;
      continue;
    }

    // Sandbox sender only delivers to the Resend account owner — use verified domain in prod.
    if (key === "EMAIL_FROM" && /resend\.dev|onboarding@/i.test(value)) {
      console.warn(
        `⚠ ${key} uses Resend sandbox — pushing ${PRODUCTION_FROM} for production instead.`
      );
      console.warn("  Verify anyexameasy.com at https://resend.com/domains if not done yet.");
      value = PRODUCTION_FROM;
    }

    if (!runVercelEnvAdd(key, value, "production", sensitive)) ok = false;
  }

  if (!ok) process.exit(1);

  console.log("\n✓ Email env pushed to Vercel production.");
  console.log("  Redeploy for changes to take effect:");
  console.log("  npm run vercel:email:deploy\n");

  if (process.argv.includes("--redeploy")) {
    const r = spawnSync(VERCEL, ["--prod"], { cwd: root, stdio: "inherit" });
    process.exit(r.status ?? 1);
  }
}

main();
