#!/usr/bin/env node
/**
 * Prints production env values for Vercel and checks /api/health after deploy.
 * Usage: node scripts/vercel-setup.mjs [production-url]
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const PROD_URL = (process.argv[2] ?? "https://any-exam-eas.vercel.app").replace(/\/$/, "");

function secret() {
  return randomBytes(32).toString("base64");
}

const nextauthSecret = secret();
const cronSecret = secret();

console.log(`
=== Any Exam Easy — Vercel production setup ===

1) Database (pick one)
   • Neon: https://console.neon.tech → create project → copy pooled connection string
   • Vercel Postgres: Project → Storage → Create Database → connect to project

2) Vercel → Project → Settings → Environment Variables
   Add each variable for Production AND Build:

   DATABASE_URL     = postgresql://...  (from Neon/Vercel; add ?sslmode=require for Neon)
   NEXTAUTH_URL     = ${PROD_URL}
   NEXTAUTH_SECRET  = ${nextauthSecret}
   CRON_SECRET      = ${cronSecret}
   RESEND_API_KEY   = (from https://resend.com — password reset emails)
   EMAIL_FROM       = your verified sender (e.g. noreply@yourdomain.com)

3) Deployments → latest → ⋯ → Redeploy

4) Verify:
   ${PROD_URL}/api/health  → "ok": true

5) Seed question bank (once, after health is ok):
   curl -H "Authorization: Bearer ${cronSecret}" \\
     "${PROD_URL}/api/cron/sync-question-bank"

Save CRON_SECRET somewhere safe (also used by Vercel Cron).
`);

async function checkHealth() {
  try {
    const res = await fetch(`${PROD_URL}/api/health`, { cache: "no-store" });
    const data = await res.json();
    console.log("Current health:", JSON.stringify(data, null, 2));
    if (data.ok) {
      console.log("Production is configured correctly.");
      return 0;
    }
    console.log("Production still needs env vars and a redeploy (see steps above).");
    return 1;
  } catch (e) {
    console.error("Could not reach health endpoint:", e instanceof Error ? e.message : e);
    return 1;
  }
}

const code = await checkHealth();
process.exit(code);
