#!/usr/bin/env node
/**
 * Test password-reset email delivery (Resend).
 * Usage: node scripts/test-reset-email.mjs you@example.com
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

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/test-reset-email.mjs <email>");
  process.exit(1);
}

const base =
  process.env.NEXTAUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

console.log("\nPassword reset email check\n");
console.log(`Target:     ${email}`);
console.log(`RESEND:     ${process.env.RESEND_API_KEY ? "set" : "MISSING"}`);
console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM ?? "(default onboarding@resend.dev)"}`);
console.log(`Base URL:   ${base.replace(/\/$/, "")}`);
console.log("");

if (!process.env.RESEND_API_KEY) {
  console.log("RESEND_API_KEY is not set — emails will NOT be sent in production.");
  console.log("Add RESEND_API_KEY and a verified EMAIL_FROM to .env or Vercel.\n");
}

try {
  const res = await fetch(`${base.replace(/\/$/, "")}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  console.log(`API status: ${res.status}`);
  console.log(`Message:    ${data.message ?? data.error ?? "(none)"}`);
  if (data.devResetUrl) {
    console.log(`\nDev reset link:\n${data.devResetUrl}`);
  }
  console.log("");
  if (res.ok) {
    console.log(process.env.RESEND_API_KEY
      ? "If the account exists, check the inbox (and spam) for the reset email."
      : "No email was sent — configure RESEND_API_KEY first.");
  }
} catch (e) {
  console.error("Request failed:", e instanceof Error ? e.message : e);
  console.log("\nIs the dev server running? Try: npm run dev");
  process.exit(1);
}
