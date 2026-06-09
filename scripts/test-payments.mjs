#!/usr/bin/env node
/**
 * Stripe / checkout integration checks.
 *
 * Usage:
 *   node scripts/test-payments.mjs
 *   node scripts/test-payments.mjs --live http://localhost:3000
 *
 * Requires .env with Stripe test-mode keys for full API checks.
 */
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv();

const REQUIRED = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_PRICE_ID",
];

const OPTIONAL = [
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID_YEARLY",
  "STRIPE_TRIAL_INTRO_PRICE_ID",
];

const liveArg = process.argv.indexOf("--live");
const baseUrl =
  liveArg >= 0 ? process.argv[liveArg + 1] ?? "http://localhost:3000" : null;

let passed = 0;
let failed = 0;
let skipped = 0;

function ok(label, detail = "") {
  passed++;
  console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  failed++;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function skip(label, detail = "") {
  skipped++;
  console.log(`  ○ ${label}${detail ? ` — ${detail}` : ""}`);
}

function keyMode(key) {
  if (!key) return "missing";
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) return "live";
  if (key.startsWith("pk_test_")) return "test";
  if (key.startsWith("pk_live_")) return "live";
  return "unknown";
}

console.log("\nAny Exam Easy — payment system check\n");

console.log("Environment");
for (const k of REQUIRED) {
  if (process.env[k]) ok(k, "set");
  else fail(k, "missing");
}
for (const k of OPTIONAL) {
  if (process.env[k]) ok(k, "set");
  else skip(k, "optional — not set");
}

const secret = process.env.STRIPE_SECRET_KEY ?? "";
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const secretMode = keyMode(secret);
const pubMode = keyMode(publishable);

if (secret && publishable) {
  if (secretMode === pubMode && secretMode !== "unknown") {
    ok("Key mode match", `${secretMode} secret + publishable`);
  } else {
    fail("Key mode match", `secret=${secretMode}, publishable=${pubMode}`);
  }
}

const configured = REQUIRED.every((k) => Boolean(process.env[k]));

if (!configured) {
  console.log("\nStripe API");
  skip("API validation", "configure REQUIRED env vars first");
} else {
  console.log("\nStripe API");
  try {
    const Stripe = require("stripe").default;
    const stripe = new Stripe(secret);

    const account = await stripe.accounts.retrieve();
    ok("Account reachable", account.id);

    const priceId = process.env.STRIPE_PRICE_ID;
    const price = await stripe.prices.retrieve(priceId);
    if (price.active) ok("STRIPE_PRICE_ID", `${priceId} active (${price.currency} ${(price.unit_amount ?? 0) / 100})`);
    else fail("STRIPE_PRICE_ID", "price exists but inactive");

    if (price.type === "recurring") {
      ok("Price type", `recurring / ${price.recurring?.interval ?? "?"}`);
    } else {
      fail("Price type", `expected recurring, got ${price.type}`);
    }

    if (process.env.STRIPE_TRIAL_INTRO_PRICE_ID) {
      const intro = await stripe.prices.retrieve(process.env.STRIPE_TRIAL_INTRO_PRICE_ID);
      ok("STRIPE_TRIAL_INTRO_PRICE_ID", intro.active ? "active" : "inactive");
    }

    if (process.env.STRIPE_PRICE_ID_YEARLY) {
      const yearly = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID_YEARLY);
      ok("STRIPE_PRICE_ID_YEARLY", yearly.active ? "active" : "inactive");
    }

    // Smoke-create embedded checkout sessions (matches src/lib/stripe.ts params)
    const sessionParams = {
      mode: "subscription",
      ui_mode: "embedded",
      return_url: "http://localhost:3000/checkout/return?session_id={CHECKOUT_SESSION_ID}",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { userId: "payment-test-script", plan: "subscribe" },
      },
      metadata: { userId: "payment-test-script", plan: "subscribe" },
      payment_method_types: ["card", "link"],
      payment_method_collection: "always",
      payment_method_options: {
        card: { request_three_d_secure: "automatic" },
      },
      billing_address_collection: "auto",
      saved_payment_method_options: {
        payment_method_save: "enabled",
        payment_method_remove: "disabled",
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (session.client_secret) {
      ok("Embedded checkout session", `created ${session.id}`);
      await stripe.checkout.sessions.expire(session.id);
      ok("Session cleanup", "expired test session");
    } else {
      fail("Embedded checkout session", "no client_secret returned");
    }

    const trialSession = await stripe.checkout.sessions.create({
      ...sessionParams,
      subscription_data: {
        metadata: { userId: "payment-test-script", plan: "trial" },
        trial_period_days: Number(process.env.TRIAL_DAYS ?? 3),
      },
      metadata: { userId: "payment-test-script", plan: "trial" },
      payment_method_collection: "always",
    });
    if (trialSession.client_secret) {
      ok("Trial checkout session", `created ${trialSession.id}`);
      await stripe.checkout.sessions.expire(trialSession.id);
    } else {
      fail("Trial checkout session", "no client_secret returned");
    }
  } catch (e) {
    fail("Stripe API", e instanceof Error ? e.message : String(e));
  }
}

if (baseUrl) {
  console.log(`\nHTTP (${baseUrl})`);
  try {
    const configRes = await fetch(`${baseUrl}/api/stripe/config`);
    if (configRes.ok) {
      const data = await configRes.json();
      if (data.configured) ok("/api/stripe/config", "configured=true");
      else fail("/api/stripe/config", "configured=false");
      if (data.publishableKey?.startsWith("pk_")) ok("Publishable key exposed", "valid prefix");
      else fail("Publishable key exposed", "missing or invalid");
    } else {
      fail("/api/stripe/config", `HTTP ${configRes.status}`);
    }

    const checkoutPage = await fetch(`${baseUrl}/checkout`, { redirect: "manual" });
    const checkoutStatus = checkoutPage.status;
    if (checkoutStatus === 307 || checkoutStatus === 302) {
      ok("/checkout", `redirects unauthenticated (${checkoutStatus})`);
    } else if (checkoutStatus === 200) {
      ok("/checkout", "page reachable");
    } else {
      fail("/checkout", `HTTP ${checkoutStatus}`);
    }

    const checkoutApi = await fetch(`${baseUrl}/api/stripe/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedded: true, plan: "trial" }),
    });
    if (checkoutApi.status === 401) {
      ok("POST /api/stripe/checkout", "requires auth (401)");
    } else {
      fail("POST /api/stripe/checkout", `expected 401, got ${checkoutApi.status}`);
    }
  } catch (e) {
    fail("HTTP checks", e instanceof Error ? e.message : String(e));
  }
} else {
  console.log("\nHTTP");
  skip("Live server checks", "pass --live http://localhost:3000 with dev server running");
}

console.log(`\nResult: ${passed} passed, ${failed} failed, ${skipped} skipped\n`);
process.exit(failed > 0 ? 1 : 0);
