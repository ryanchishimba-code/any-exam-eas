#!/usr/bin/env node
/**
 * Stripe test-mode setup: create subscription Prices for all billing intervals.
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

Never paste sk_test keys in chat or commit them to git.
`);
    process.exit(1);
  }

  const allConfigured = INTERVALS.every((i) => getEnvValue(envContent, i.key).startsWith("price_"));
  if (allConfigured && !force) {
    console.log("All Stripe price IDs already set. Use --force to recreate.");
    process.exit(0);
  }

  console.log("Connecting to Stripe (test mode)…");
  const stripe = new Stripe(secret);
  const account = await stripe.accounts.retrieve();
  console.log(`Account: ${account.id}`);

  const product = await stripe.products.create({
    name: "Any Exam Easy Pro",
    description: `${TRIAL_DAYS}-day free trial, then recurring board exam prep subscription`,
    metadata: { app: "any-exam-easy" },
  });
  console.log(`Product: ${product.id}`);

  envContent = setEnvValue(envContent, "STRIPE_SECRET_KEY", secret);
  envContent = setEnvValue(envContent, "STRIPE_TRIAL_INTRO_PRICE_ID", "");
  envContent = setEnvValue(envContent, "TRIAL_DAYS", String(TRIAL_DAYS));
  envContent = setEnvValue(envContent, "MONTHLY_PRICE_USD", String(MONTHLY_USD));

  for (const tier of INTERVALS) {
    const existing = getEnvValue(envContent, tier.key);
    if (existing.startsWith("price_") && !force) {
      console.log(`– ${tier.key} already set (${existing})`);
      continue;
    }

    const amountUsd = intervalTotalUsd(tier.months, tier.savings);
    const price = await stripe.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: Math.round(amountUsd * 100),
      recurring: tier.stripe,
      metadata: {
        interval: tier.interval,
        savings_percent: String(tier.savings),
      },
    });

    envContent = setEnvValue(envContent, tier.key, price.id);
    console.log(`✓ ${tier.label}: $${amountUsd.toFixed(2)} → ${tier.key}=${price.id}`);
  }

  const pub = getEnvValue(envContent, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  if (!pub.startsWith("pk_")) {
    console.warn(
      "\nWarning: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is empty.\n" +
        "Add pk_test_... from https://dashboard.stripe.com/test/apikeys\n"
    );
  }

  writeFileSync(ENV_PATH, envContent);

  console.log(`
Done. Updated .env with all billing interval prices.

Next steps:
  1. Enable Apple Pay / Google Pay in Stripe Dashboard → Settings → Payment methods
  2. Register domain for Apple Pay (anyexameasy.com + localhost for dev)
  3. Restart dev server: npm run dev
  4. Test: /checkout?plan=trial&interval=yearly (card 4242 4242 4242 4242)

Webhook (local):
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  → copy whsec_... to STRIPE_WEBHOOK_SECRET

Production:
  npm run vercel:stripe
`);
}

main().catch((e) => {
  console.error("Setup failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
