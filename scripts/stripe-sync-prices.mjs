#!/usr/bin/env node
/**
 * Align Stripe Price objects with MONTHLY_PRICE_USD / billing intervals.
 * Creates new prices when amounts drift (Stripe prices are immutable).
 *
 * Usage:
 *   node scripts/stripe-sync-prices.mjs
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-sync-prices.mjs
 *   node scripts/stripe-sync-prices.mjs --push-vercel   # after sync, push .env → Vercel production
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Stripe = require("stripe").default;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(root, ".env");

const MONTHLY_USD = Number(process.env.MONTHLY_PRICE_USD ?? "32.99");
const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "7");

const INTERVALS = [
  {
    key: "STRIPE_PRICE_ID",
    interval: "monthly",
    label: "Monthly",
    months: 1,
    savings: 0,
    stripe: { interval: "month", interval_count: 1 },
  },
  {
    key: "STRIPE_PRICE_ID_QUARTERLY",
    interval: "quarterly",
    label: "Every 3 months",
    months: 3,
    savings: 5,
    stripe: { interval: "month", interval_count: 3 },
  },
  {
    key: "STRIPE_PRICE_ID_SEMIANNUAL",
    interval: "semiannual",
    label: "Every 6 months",
    months: 6,
    savings: 10,
    stripe: { interval: "month", interval_count: 6 },
  },
  {
    key: "STRIPE_PRICE_ID_YEARLY",
    interval: "yearly",
    label: "Yearly",
    months: 12,
    savings: 20,
    stripe: { interval: "year", interval_count: 1 },
  },
];

function intervalTotalUsd(months, savings) {
  const full = MONTHLY_USD * months;
  return Math.round(full * (1 - savings / 100) * 100) / 100;
}

function loadEnvFile() {
  if (!existsSync(ENV_PATH)) {
    console.error("No .env file found.");
    process.exit(1);
  }
  return readFileSync(ENV_PATH, "utf8");
}

function getEnvValue(content, key) {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!match) return "";
  let v = match[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

function setEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  return content.trimEnd() + `\n${line}\n`;
}

async function resolveProductId(stripe, envContent) {
  const monthlyId = getEnvValue(envContent, "STRIPE_PRICE_ID");
  if (monthlyId.startsWith("price_")) {
    const price = await stripe.prices.retrieve(monthlyId);
    if (typeof price.product === "string") return price.product;
  }

  const product = await stripe.products.create({
    name: "Any Exam Easy Pro",
    description: `${TRIAL_DAYS}-day free trial, then recurring board exam prep subscription`,
    metadata: { app: "any-exam-easy" },
  });
  console.log(`Created product ${product.id}`);
  return product.id;
}

async function syncPrice(stripe, productId, tier, envContent) {
  const expectedUsd = intervalTotalUsd(tier.months, tier.savings);
  const expectedCents = Math.round(expectedUsd * 100);
  const existingId = getEnvValue(envContent, tier.key);

  if (existingId.startsWith("price_")) {
    const existing = await stripe.prices.retrieve(existingId);
    if ((existing.unit_amount ?? 0) === expectedCents && existing.active) {
      console.log(`✓ ${tier.label}: ${existingId} already $${expectedUsd.toFixed(2)}`);
      return { envContent, changed: false };
    }
    if (existing.active) {
      await stripe.prices.update(existingId, { active: false });
      console.log(`– Deactivated outdated ${tier.label} price ${existingId} ($${((existing.unit_amount ?? 0) / 100).toFixed(2)})`);
    }
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: expectedCents,
    recurring: tier.stripe,
    nickname: `Any Exam Easy — ${tier.label}`,
    metadata: {
      interval: tier.interval,
      savings_percent: String(tier.savings),
      monthly_anchor_usd: String(MONTHLY_USD),
    },
  });

  envContent = setEnvValue(envContent, tier.key, price.id);
  console.log(`✓ ${tier.label}: $${expectedUsd.toFixed(2)} → ${tier.key}=${price.id}`);
  return { envContent, changed: true };
}

async function main() {
  let envContent = loadEnvFile();
  const secret =
    process.env.STRIPE_SECRET_KEY?.trim() || getEnvValue(envContent, "STRIPE_SECRET_KEY");

  if (!secret?.startsWith("sk_")) {
    console.error("STRIPE_SECRET_KEY required (sk_test_... or sk_live_...).");
    process.exit(1);
  }

  console.log(`Syncing Stripe prices to MONTHLY_PRICE_USD=$${MONTHLY_USD.toFixed(2)}, TRIAL_DAYS=${TRIAL_DAYS}…`);
  const stripe = new Stripe(secret);
  const account = await stripe.accounts.retrieve();
  console.log(`Account: ${account.id} (${secret.startsWith("sk_live_") ? "live" : "test"})`);

  const productId = await resolveProductId(stripe, envContent);
  await stripe.products.update(productId, {
    name: "Any Exam Easy Pro",
    description: `${TRIAL_DAYS}-day free trial, then from $${MONTHLY_USD.toFixed(2)}/mo — NCLEX, USMLE, NAPLEX, MPJE`,
  });

  envContent = setEnvValue(envContent, "MONTHLY_PRICE_USD", String(MONTHLY_USD));
  envContent = setEnvValue(envContent, "TRIAL_DAYS", String(TRIAL_DAYS));

  let anyChanged = false;
  for (const tier of INTERVALS) {
    const result = await syncPrice(stripe, productId, tier, envContent);
    envContent = result.envContent;
    anyChanged = anyChanged || result.changed;
  }

  writeFileSync(ENV_PATH, envContent);

  if (!anyChanged) {
    console.log("\nAll Stripe prices already match config.");
  } else {
    console.log("\nUpdated .env with new price IDs. Restart dev server and redeploy production.");
  }

  if (process.argv.includes("--push-vercel")) {
    console.log("\nPushing billing env to Vercel production…");
    const r = spawnSync("node", ["scripts/vercel-stripe-push.mjs", "--redeploy"], {
      cwd: root,
      stdio: "inherit",
    });
    process.exit(r.status ?? 1);
  }

  console.log("\nNext: npm run vercel:stripe   (or re-run with --push-vercel)");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
