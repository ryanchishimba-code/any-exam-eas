#!/usr/bin/env node
/**
 * Switch to standard $0 / 3-day trial (no $17.99 intro line item in Stripe Checkout).
 *
 * - Clears STRIPE_TRIAL_INTRO_PRICE_ID in .env
 * - Removes STRIPE_TRIAL_INTRO_PRICE_ID from Vercel (production) if present
 *
 * Usage: node scripts/stripe-free-trial.mjs [--redeploy]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";
const INTRO_KEY = "STRIPE_TRIAL_INTRO_PRICE_ID";

function setEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  return content.trimEnd() + `\n${line}\n`;
}

function removeVercelEnv(key, target) {
  const r = spawnSync(VERCEL, ["vercel", "env", "rm", key, target, "--yes"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (r.status === 0) {
    console.log(`✓ removed ${key} from Vercel (${target})`);
    return true;
  }
  const out = `${r.stderr || ""}${r.stdout || ""}`;
  if (/not found|does not exist|ENOENT/i.test(out)) {
    console.log(`– ${key} not set on Vercel (${target})`);
    return true;
  }
  console.warn(`Could not remove ${key} (${target}):`, out.trim());
  return false;
}

async function main() {
  if (!existsSync(ENV_PATH)) {
    console.error("No .env file found.");
    process.exit(1);
  }

  let envContent = readFileSync(ENV_PATH, "utf8");
  envContent = setEnvValue(envContent, INTRO_KEY, "");
  writeFileSync(ENV_PATH, envContent);
  console.log(`✓ cleared ${INTRO_KEY} in .env (free trial: $0 today, then $27.99/mo)`);

  for (const target of ["production", "preview", "development"]) {
    removeVercelEnv(INTRO_KEY, target);
  }

  if (process.argv.includes("--redeploy")) {
    console.log("\nRedeploying production…");
    const r = spawnSync(VERCEL, ["vercel", "--prod", "--yes"], {
      cwd: root,
      encoding: "utf8",
      stdio: "inherit",
    });
    process.exit(r.status ?? 1);
  }

  console.log("\nRestart dev server locally. Redeploy production for Stripe checkout to show $0.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
