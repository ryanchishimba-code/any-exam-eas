#!/usr/bin/env node
/**
 * Align Stripe Price objects with Pro billing config.
 * Creates new prices when amounts drift (Stripe prices are immutable).
 *
 * Usage:
 *   node scripts/stripe-sync-prices.mjs
 *   node scripts/stripe-sync-prices.mjs --push-vercel
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

const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "5");

const TIERS = {
  pro: {
    productName: "Any Exam Easy Pro",
    monthlyUsd: Number(process.env.PRO_MONTHLY_PRICE_USD ?? process.env.MONTHLY_PRICE_USD ?? "27.99"),
    yearlyUsd: Number(process.env.PRO_YEARLY_PRICE_USD ?? process.env.YEARLY_PRICE_USD ?? "279.97"),
    envPrefix: "STRIPE_PRO_PRICE_ID",
    legacyKeys: {
      monthly: "STRIPE_PRICE_ID",
      quarterly: "STRIPE_PRICE_ID_QUARTERLY",
      semiannual: "STRIPE_PRICE_ID_SEMIANNUAL",
      yearly: "STRIPE_PRICE_ID_YEARLY",
    },
  },
};

const INTERVALS = [
  { interval: "monthly", label: "Monthly", months: 1, savings: 0, stripe: { interval: "month", interval_count: 1 }, suffix: "MONTHLY" },
  { interval: "quarterly", label: "Every 3 months", months: 3, savings: 5, stripe: { interval: "month", interval_count: 3 }, suffix: "QUARTERLY" },
  { interval: "semiannual", label: "Every 6 months", months: 6, savings: 12, stripe: { interval: "month", interval_count: 6 }, suffix: "SEMIANNUAL" },
  { interval: "yearly", label: "Yearly", months: 12, savings: 20, stripe: { interval: "year", interval_count: 1 }, suffix: "YEARLY" },
];

function intervalTotalUsd(tierKey, spec) {
  const tier = TIERS[tierKey];
  if (spec.interval === "yearly") return tier.yearlyUsd;
  const full = tier.monthlyUsd * spec.months;
  return Math.round(full * (1 - spec.savings / 100) * 100) / 100;
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

async function resolveProductId(stripe, envContent, tierKey) {
  const tier = TIERS[tierKey];
  const monthlyKey = `${tier.envPrefix}_MONTHLY`;
  const monthlyId = getEnvValue(envContent, monthlyKey);
  if (monthlyId.startsWith("price_")) {
    const price = await stripe.prices.retrieve(monthlyId);
    if (typeof price.product === "string") return price.product;
  }

  const product = await stripe.products.create({
    name: tier.productName,
    description: `${TRIAL_DAYS}-day free trial (payment at checkout), then recurring board exam prep`,
    metadata: { app: "any-exam-easy", tier: tierKey },
  });
  console.log(`Created product ${tier.productName}: ${product.id}`);
  return product.id;
}

async function syncPrice(stripe, productId, tierKey, spec, envContent) {
  const tier = TIERS[tierKey];
  const envKey = `${tier.envPrefix}_${spec.suffix}`;
  const expectedUsd = intervalTotalUsd(tierKey, spec);
  const expectedCents = Math.round(expectedUsd * 100);
  const existingId = getEnvValue(envContent, envKey);

  if (existingId.startsWith("price_")) {
    const existing = await stripe.prices.retrieve(existingId);
    if ((existing.unit_amount ?? 0) === expectedCents && existing.active) {
      console.log(`✓ ${tierKey} ${spec.label}: ${existingId} ($${expectedUsd.toFixed(2)})`);
      return { envContent, changed: false };
    }
    if (existing.active) {
      await stripe.prices.update(existingId, { active: false });
      console.log(
        `– Deactivated ${tierKey} ${spec.label} ${existingId} ($${((existing.unit_amount ?? 0) / 100).toFixed(2)})`
      );
    }
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: expectedCents,
    recurring: spec.stripe,
    nickname: `${tier.productName} — ${spec.label}`,
    metadata: {
      tier: tierKey,
      interval: spec.interval,
      savings_percent: String(spec.savings),
    },
  });

  envContent = setEnvValue(envContent, envKey, price.id);
  if (tier.legacyKeys?.[spec.interval]) {
    envContent = setEnvValue(envContent, tier.legacyKeys[spec.interval], price.id);
  }
  console.log(`✓ ${tierKey} ${spec.label}: $${expectedUsd.toFixed(2)} → ${envKey}=${price.id}`);
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

  console.log(`Syncing Pro Stripe prices (TRIAL_DAYS=${TRIAL_DAYS})…`);
  const stripe = new Stripe(secret);
  const account = await stripe.accounts.retrieve();
  console.log(`Account: ${account.id} (${secret.startsWith("sk_live_") ? "live" : "test"})`);

  envContent = setEnvValue(envContent, "TRIAL_DAYS", String(TRIAL_DAYS));
  envContent = setEnvValue(envContent, "PRO_MONTHLY_PRICE_USD", String(TIERS.pro.monthlyUsd));
  envContent = setEnvValue(envContent, "PRO_YEARLY_PRICE_USD", String(TIERS.pro.yearlyUsd));
  envContent = setEnvValue(envContent, "STRIPE_TRIAL_INTRO_PRICE_ID", "");

  let anyChanged = false;
  for (const tierKey of Object.keys(TIERS)) {
    const tier = TIERS[tierKey];
    const productId = await resolveProductId(stripe, envContent, tierKey);
    await stripe.products.update(productId, {
      name: tier.productName,
      description: `${TRIAL_DAYS}-day free trial — payment method required at checkout, charged when trial ends`,
    });

    for (const spec of INTERVALS) {
      const result = await syncPrice(stripe, productId, tierKey, spec, envContent);
      envContent = result.envContent;
      anyChanged = anyChanged || result.changed;
    }
  }

  writeFileSync(ENV_PATH, envContent);

  if (!anyChanged) {
    console.log("\nAll Stripe prices already match config.");
  } else {
    console.log("\nUpdated .env with new price IDs.");
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
