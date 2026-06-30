#!/usr/bin/env node
/**
 * Stripe test-mode setup: create Pro subscription Prices for all billing intervals.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs --force
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Stripe = require("stripe").default;

const ENV_PATH = ".env";
const TRIAL_DAYS = Number(process.env.TRIAL_DAYS ?? "3");

const TIERS = {
  pro: {
    productName: "Any Exam Easy Pro",
    monthlyUsd: Number(process.env.PRO_MONTHLY_PRICE_USD ?? process.env.MONTHLY_PRICE_USD ?? "34"),
    yearlyUsd: Number(process.env.PRO_YEARLY_PRICE_USD ?? process.env.YEARLY_PRICE_USD ?? "340"),
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
    console.error("No .env file found. Copy .env.example to .env first.");
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

async function main() {
  const force = process.argv.includes("--force");
  let envContent = loadEnvFile();

  const secretFromEnv = process.env.STRIPE_SECRET_KEY?.trim();
  const secretFromFile = getEnvValue(envContent, "STRIPE_SECRET_KEY");
  const secret = secretFromEnv || secretFromFile;

  if (!secret || !secret.startsWith("sk_")) {
    console.error(`
Stripe secret key required.

1. Open https://dashboard.stripe.com/test/apikeys
2. Reveal "Secret key" (sk_test_...)
3. Run:

   STRIPE_SECRET_KEY=sk_test_YOUR_KEY node scripts/stripe-setup.mjs
`);
    process.exit(1);
  }

  console.log("Connecting to Stripe (test mode)…");
  const stripe = new Stripe(secret);
  const account = await stripe.accounts.retrieve();
  console.log(`Account: ${account.id}`);

  envContent = setEnvValue(envContent, "STRIPE_SECRET_KEY", secret);
  envContent = setEnvValue(envContent, "TRIAL_DAYS", String(TRIAL_DAYS));
  envContent = setEnvValue(envContent, "PRO_MONTHLY_PRICE_USD", String(TIERS.pro.monthlyUsd));
  envContent = setEnvValue(envContent, "PRO_YEARLY_PRICE_USD", String(TIERS.pro.yearlyUsd));

  for (const tierKey of Object.keys(TIERS)) {
    const tier = TIERS[tierKey];
    const product = await stripe.products.create({
      name: tier.productName,
      description: `${TRIAL_DAYS}-day free trial, then recurring board exam prep`,
      metadata: { app: "any-exam-easy", tier: tierKey },
    });
    console.log(`\n${tier.productName}: ${product.id}`);

    for (const spec of INTERVALS) {
      const envKey = `${tier.envPrefix}_${spec.suffix}`;
      const existing = getEnvValue(envContent, envKey);
      if (existing.startsWith("price_") && !force) {
        console.log(`– ${envKey} already set (${existing})`);
        continue;
      }

      const amountUsd = intervalTotalUsd(tierKey, spec);
      const price = await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: Math.round(amountUsd * 100),
        recurring: spec.stripe,
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
      console.log(`✓ ${spec.label}: $${amountUsd.toFixed(2)} → ${envKey}=${price.id}`);
    }
  }

  writeFileSync(ENV_PATH, envContent);

  console.log(`
Done. Updated .env with Pro billing prices.

Next: npm run dev → /signup?plan=trial&tier=pro&interval=yearly
Webhook: stripe listen --forward-to localhost:3000/api/stripe/webhook
`);
}

main().catch((e) => {
  console.error("Setup failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
