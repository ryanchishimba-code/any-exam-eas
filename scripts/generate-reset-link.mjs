#!/usr/bin/env node
/**
 * Generate a password reset link (prints to terminal — for admin/dev use).
 *
 * Usage:
 *   NEXTAUTH_URL=https://www.anyexameasy.com npm run email:reset-link -- user@email.com
 */
import { readFileSync, existsSync } from "node:fs";

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

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run email:reset-link -- <email>");
  process.exit(1);
}

const base =
  process.env.NEXTAUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

process.env.NODE_ENV = process.env.NODE_ENV ?? "development";

const { requestPasswordReset } = await import("../src/lib/password-reset");

console.log(`\nGenerating reset link for: ${email}`);
console.log(`Base URL: ${base.replace(/\/$/, "")}\n`);

const outcome = await requestPasswordReset(email);

if (!outcome.userFound) {
  console.error("No account found for that email.");
  process.exit(1);
}

if (outcome.devResetUrl) {
  console.log("\nReset link (copy and open in browser — expires in 1 hour):\n");
  console.log(outcome.devResetUrl);
  if (outcome.emailDelivered) {
    console.log("\nAn email was also sent via Resend.");
  } else {
    console.log("\nNo email was sent (RESEND_API_KEY not configured or delivery failed).");
    console.log("Fix: RESEND_API_KEY=re_xxx node scripts/resend-setup.mjs && npm run vercel:email:deploy");
  }
} else {
  console.log("Reset token created. Check your email inbox.");
}
