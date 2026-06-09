#!/usr/bin/env node
/**
 * Configure Resend for password reset emails.
 *
 * 1. Create account: https://resend.com/signup
 * 2. API Keys: https://resend.com/api-keys
 * 3. For production: verify domain at https://resend.com/domains
 *    Then set EMAIL_FROM=Any Exam Easy <noreply@anyexameasy.com>
 * 4. For quick testing: onboarding@resend.dev only sends to YOUR Resend signup email.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/resend-setup.mjs
 *   node scripts/resend-setup.mjs   # reads from .env
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ENV_FILES = [".env.local", ".env"];

function loadEnvFile() {
  for (const file of ENV_FILES) {
    if (existsSync(file)) return { content: readFileSync(file, "utf8"), path: file };
  }
  return { content: "", path: ".env.local" };
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
  const { content: initialContent, path: envPath } = loadEnvFile();
  let envContent = initialContent;
  const apiKey = (process.env.RESEND_API_KEY ?? getEnvValue(envContent, "RESEND_API_KEY")).trim();
  const from =
    process.env.EMAIL_FROM?.trim() ||
    getEnvValue(envContent, "EMAIL_FROM") ||
    "Any Exam Easy <noreply@anyexameasy.com>";

  if (!apiKey || !apiKey.startsWith("re_")) {
    console.error(`
Resend API key required.

1. Sign up: https://resend.com/signup
2. Create API key: https://resend.com/api-keys
3. Run:
   RESEND_API_KEY=re_xxxx node scripts/resend-setup.mjs

For production (anyexameasy.com):
  - Verify domain: https://resend.com/domains
  - Set EMAIL_FROM=Any Exam Easy <noreply@anyexameasy.com>

For quick test (sandbox only):
  - EMAIL_FROM=onboarding@resend.dev sends ONLY to your Resend account email.
`);
    process.exit(1);
  }

  console.log("\nResend setup — testing API key…\n");

  const domainsRes = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (domainsRes.status === 401) {
    console.error("Invalid RESEND_API_KEY (401 Unauthorized).");
    process.exit(1);
  }

  if (domainsRes.ok) {
    const domains = await domainsRes.json();
    const list = domains.data ?? [];
    console.log(`Verified domains: ${list.length ? list.map((d) => d.name).join(", ") : "(none yet)"}`);
    if (!list.length) {
      console.log("  → Add anyexameasy.com at https://resend.com/domains for production email.");
    }
  }

  envContent = setEnvValue(envContent, "RESEND_API_KEY", apiKey);
  envContent = setEnvValue(envContent, "EMAIL_FROM", from);
  writeFileSync(envPath, envContent);

  console.log(`\n✓ Saved RESEND_API_KEY and EMAIL_FROM to ${envPath}`);
  console.log(`  EMAIL_FROM=${from}`);
  console.log("\nNext steps:");
  console.log("  Local:  npm run email:test-reset -- your@email.com");
  console.log("  Vercel: npm run vercel:email");
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
