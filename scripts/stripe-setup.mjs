#!/usr/bin/env node
/**
 * One-time Stripe test-mode setup: create products/prices and update .env.
 *
 * Usage (paste your sk_test_ key once — do not commit .env):
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
 *
 * Or export first:
 *   export STRIPE_SECRET_KEY=sk_test_...
 *   node scripts/stripe-setup.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Stripe = require("stripe").default;

const ENV_PATH = ".env";
const MONTHLY_USD = Number(process.env.MONTHLY_PRICE_USD ?? "29.99");
const INTRO_USD = Number(process.env.TRIAL_INTRO_PRICE_USD ?? "17.99");

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
  if (re.test(content)) {
    return content.replace(re, line);
  }
  return content.trimEnd() + `\n${line}\n`;
}

async function main() {
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

  const existingPrice = getEnvValue(envContent, "STRIPE_PRICE_ID");
  if (existingPrice.startsWith("price_")) {
    console.log(`STRIPE_PRICE_ID already set (${existingPrice}). Skipping product creation.`);
    if (!secretFromFile && secretFromEnv) {
      envContent = setEnvValue(envContent, "STRIPE_SECRET_KEY", secret);
      writeFileSync(ENV_PATH, envContent);
      console.log("Updated STRIPE_SECRET_KEY in .env");
    }
    process.exit(0);
  }

  console.log("Connecting to Stripe (test mode)…");
  const stripe = new Stripe(secret);
  const account = await stripe.accounts.retrieve();
  console.log(`Account: ${account.id}`);

  console.log(`Creating product + $${MONTHLY_USD}/mo subscription price…`);
  const monthlyProduct = await stripe.products.create({
    name: "Any Exam Easy — Monthly",
    description: "Full access to board exam prep after trial",
    metadata: { app: "any-exam-easy" },
  });

  const monthlyPrice = await stripe.prices.create({
    product: monthlyProduct.id,
    currency: "usd",
    unit_amount: Math.round(MONTHLY_USD * 100),
    recurring: { interval: "month" },
    metadata: { plan: "monthly" },
  });

  console.log(`Creating $${INTRO_USD} one-time intro price (trial checkout)…`);
  const introProduct = await stripe.products.create({
    name: "Any Exam Easy — Trial Intro",
    description: "One-time trial starter fee",
    metadata: { app: "any-exam-easy" },
  });

  const introPrice = await stripe.prices.create({
    product: introProduct.id,
    currency: "usd",
    unit_amount: Math.round(INTRO_USD * 100),
    metadata: { plan: "trial_intro" },
  });

  envContent = setEnvValue(envContent, "STRIPE_SECRET_KEY", secret);
  envContent = setEnvValue(envContent, "STRIPE_PRICE_ID", monthlyPrice.id);
  envContent = setEnvValue(envContent, "STRIPE_TRIAL_INTRO_PRICE_ID", introPrice.id);

  const pub = getEnvValue(envContent, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  if (!pub.startsWith("pk_")) {
    console.warn(
      "\nWarning: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is still empty.\n" +
        "Add pk_test_... from https://dashboard.stripe.com/test/apikeys\n"
    );
  }

  writeFileSync(ENV_PATH, envContent);

  console.log(`
Done. Updated .env:

  STRIPE_SECRET_KEY=sk_test_... (hidden)
  STRIPE_PRICE_ID=${monthlyPrice.id}
  STRIPE_TRIAL_INTRO_PRICE_ID=${introPrice.id}

Next steps:
  1. Restart dev server: npm run dev
  2. Verify: npm run test:payments
  3. Test checkout: /checkout?plan=trial (card 4242 4242 4242 4242)

Optional webhook (local):
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  → copy whsec_... to STRIPE_WEBHOOK_SECRET in .env
`);
}

main().catch((e) => {
  console.error("Setup failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
