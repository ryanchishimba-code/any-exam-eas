#!/usr/bin/env node
/**
 * Register checkout domains with Stripe for Apple Pay, Google Pay, and Link.
 *
 * Required for Embedded Checkout wallets on your own domain (anyexameasy.com).
 * Also ensure public/.well-known/apple-developer-merchantid-domain-association is deployed.
 *
 * Usage:
 *   node scripts/stripe-register-domains.mjs
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-register-domains.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Stripe = require("stripe").default;

const ENV_PATH = ".env";

const DEFAULT_DOMAINS = [
  "www.anyexameasy.com",
  "anyexameasy.com",
];

function loadEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

function parseDomains(argv, env) {
  const fromArgs = argv.filter((a) => a.includes(".") && !a.startsWith("-"));
  if (fromArgs.length > 0) return fromArgs;

  const fromEnv = env.STRIPE_CHECKOUT_DOMAINS?.split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  if (fromEnv?.length) return fromEnv;

  return DEFAULT_DOMAINS;
}

async function registerDomain(stripe, domain) {
  const existing = await stripe.paymentMethodDomains.list({ limit: 100 });
  const match = existing.data.find((d) => d.domain_name === domain);
  if (match) {
    if (!match.enabled) {
      await stripe.paymentMethodDomains.update(match.id, { enabled: true });
    }
    return match;
  }
  return stripe.paymentMethodDomains.create({ domain_name: domain });
}

async function main() {
  const env = loadEnv();
  const secret = process.env.STRIPE_SECRET_KEY?.trim() || env.STRIPE_SECRET_KEY;
  if (!secret?.startsWith("sk_")) {
    console.error("STRIPE_SECRET_KEY required.");
    process.exit(1);
  }

  const domains = parseDomains(process.argv.slice(2), env);
  const stripe = new Stripe(secret);
  const mode = secret.startsWith("sk_live_") ? "live" : "test";

  console.log(`Registering ${domains.length} domain(s) with Stripe (${mode})…\n`);

  let ok = true;
  for (const domain of domains) {
    try {
      const result = await registerDomain(stripe, domain);
      const apple = result.apple_pay?.status ?? "unknown";
      const google = result.google_pay?.status ?? "unknown";
      const link = result.link?.status ?? "unknown";
      const icon = apple === "active" ? "✓" : "⚠";
      console.log(`${icon} ${domain}`);
      console.log(`   Apple Pay: ${apple} · Google Pay: ${google} · Link: ${link}`);
      if (apple !== "active") {
        console.log(
          `   → Deploy public/.well-known/apple-developer-merchantid-domain-association and re-run.`
        );
        ok = false;
      }
    } catch (e) {
      ok = false;
      console.error(`✗ ${domain}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`
Apple Pay appears in Embedded Checkout on Safari/iOS when:
  • Domain is registered (above) with status active
  • Customer has Apple Pay set up on their device
  • Site is served over HTTPS (not localhost)

Run again with sk_live_... before switching production to live Stripe keys.
`);

  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
