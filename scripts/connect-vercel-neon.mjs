#!/usr/bin/env node
/**
 * Prepare env vars to connect Neon → Vercel.
 * Usage: npm run vercel:connect-neon
 *
 * Option A (easiest): Vercel Dashboard → Storage → Neon → Connect
 * Option B: Copy values printed here into Settings → Environment Variables
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { randomBytes as rb } from "node:crypto";

const PROD_URL = (process.env.VERCEL_URL ?? "https://anyexameasy.com").replace(
  /\/$/,
  ""
);

function secret() {
  return rb(32).toString("base64");
}

function getNeonUrl() {
  const r = spawnSync("npx", ["neonctl@latest", "connection-string", "--pooled"], {
    encoding: "utf8",
    shell: true,
  });
  if (r.status !== 0) {
    console.error("Run: npx neonctl@latest auth");
    console.error(r.stderr || r.stdout);
    process.exit(1);
  }
  let url = r.stdout.trim().split("\n").pop().trim();
  // Prisma/Vercel: sslmode=require is enough; drop channel_binding if present
  url = url.replace(/&channel_binding=require/g, "");
  if (!url.includes("sslmode=")) {
    url += url.includes("?") ? "&sslmode=require" : "?sslmode=require";
  }
  return url;
}

const databaseUrl = getNeonUrl();
const nextauthSecret = secret();
const cronSecret = secret();

const envVars = {
  DATABASE_URL: databaseUrl,
  NEXTAUTH_URL: PROD_URL,
  NEXTAUTH_SECRET: nextauthSecret,
  CRON_SECRET: cronSecret,
};

writeFileSync(
  "scripts/.vercel-neon-env.json",
  JSON.stringify(envVars, null, 2),
  "utf8"
);

console.log(`
=== Connect Neon to Vercel ===

Your Neon project is ready. Values saved to scripts/.vercel-neon-env.json (do not commit).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTION A — Official integration (recommended, ~2 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open: https://vercel.com/dashboard
2. Select project: any-exam-eas
3. Go to: Storage tab → Create Database → Neon → Connect
   OR: Settings → Integrations → Neon → Add Integration
4. Link your Neon project: any-exam-easy
5. Vercel auto-adds DATABASE_URL (and often POSTGRES_URL)

6. Still add manually (Settings → Environment Variables → Production + Preview + Build):
   - NEXTAUTH_URL     = ${PROD_URL}
   - NEXTAUTH_SECRET  = (use value below)
   - CRON_SECRET      = (use value below)

7. Deployments → Redeploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTION B — Paste env vars manually
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vercel → Project → Settings → Environment Variables
Enable: Production, Preview, AND Build for each.

DATABASE_URL
${databaseUrl}

NEXTAUTH_URL
${PROD_URL}

NEXTAUTH_SECRET
${nextauthSecret}

CRON_SECRET
${cronSecret}

Then Redeploy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTION C — Vercel CLI (after: npx vercel login)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd ${process.cwd()}
npx vercel link
npx vercel env add DATABASE_URL production preview development < scripts/.vercel-neon-env.json
# Or add each var interactively from scripts/.vercel-neon-env.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verify
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${PROD_URL}/api/health  →  "ok": true, "databaseUrl": "postgresql"

Question bank (once):
curl -H "Authorization: Bearer ${cronSecret}" \\
  "${PROD_URL}/api/cron/sync-question-bank"
`);