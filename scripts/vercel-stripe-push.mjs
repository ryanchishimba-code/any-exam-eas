#!/usr/bin/env node
/**
 * Push Stripe env vars from .env to Vercel (production + preview + development).
 * Usage: node scripts/vercel-stripe-push.mjs [--redeploy]
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";
const TARGETS = process.argv.includes("--all-envs")
  ? ["production", "preview", "development"]
  : ["production"];

const KEYS = [
  { key: "STRIPE_SECRET_KEY", sensitive: true },
  { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", sensitive: false },
  { key: "STRIPE_PRICE_ID", sensitive: false },
  { key: "STRIPE_PRICE_ID_QUARTERLY", sensitive: false },
  { key: "STRIPE_PRICE_ID_SEMIANNUAL", sensitive: false },
  { key: "STRIPE_PRICE_ID_YEARLY", sensitive: false },
  { key: "STRIPE_TRIAL_INTRO_PRICE_ID", sensitive: false, optional: true },
  { key: "STRIPE_WEBHOOK_SECRET", sensitive: true, optional: true },
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

function removeVercelEnv(key, target) {
  const r = spawnSync(VERCEL, ["vercel", "env", "rm", key, target, "--yes"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (r.status === 0) return true;
  const out = `${r.stderr || ""}${r.stdout || ""}`;
  return /not found|does not exist|ENOENT/i.test(out);
}

async function ensureStripeWebhook(secretKey, webhookUrl) {
  if (!secretKey.startsWith("sk_")) return null;
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(secretKey);
  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = existing.data.find((w) => w.url === webhookUrl && w.status !== "disabled");
  if (match) {
    console.log(`Stripe webhook already exists: ${webhookUrl}`);
    return null;
  }
  const created = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "customer.subscription.trial_will_end",
      "invoice.paid",
      "invoice.payment_failed",
    ],
  });
  console.log(`Created Stripe webhook: ${webhookUrl}`);
  return created.secret;
}

async function main() {
  if (!existsSync(ENV_PATH)) {
    console.error("No .env file found.");
    process.exit(1);
  }

  const env = parseEnv(readFileSync(ENV_PATH, "utf8"));
  let ok = true;

  for (const { key, sensitive, optional } of KEYS) {
    const value = env[key]?.trim() ?? "";
    if (!value) {
      if (key === "STRIPE_TRIAL_INTRO_PRICE_ID") {
        for (const target of TARGETS) {
          removeVercelEnv(key, target);
        }
        console.log(`– cleared ${key} on Vercel (free trial mode)`);
        continue;
      }
      if (optional) {
        console.log(`– skipping ${key} (empty)`);
        continue;
      }
      console.error(`Missing ${key} in .env`);
      ok = false;
      continue;
    }
    for (const target of TARGETS) {
      if (!runVercelEnvAdd(key, value, target, sensitive)) ok = false;
    }
  }

  const webhookUrl = "https://www.anyexameasy.com/api/stripe/webhook";
  if (env.STRIPE_SECRET_KEY && !env.STRIPE_WEBHOOK_SECRET?.trim()) {
    try {
      const whsec = await ensureStripeWebhook(env.STRIPE_SECRET_KEY, webhookUrl);
      if (whsec) {
        for (const target of TARGETS) {
          runVercelEnvAdd("STRIPE_WEBHOOK_SECRET", whsec, target, true);
        }
      } else {
        console.log(
          "Note: existing webhook found but secret not retrievable. Copy whsec_ from Stripe Dashboard if needed."
        );
      }
    } catch (e) {
      console.warn("Could not auto-create Stripe webhook:", e instanceof Error ? e.message : e);
    }
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

  console.log("\nDone. Redeploy production for NEXT_PUBLIC_* vars to take effect.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
