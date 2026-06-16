#!/usr/bin/env node
/**
 * Push Resend + auth URL env vars to Vercel (production + preview).
 *
 * Usage:
 *   npm run vercel:email              # push env only
 *   npm run vercel:email:deploy       # push env + trigger production redeploy
 *
 * Requires ONE of:
 *   - VERCEL_TOKEN in .env.local (create at https://vercel.com/account/tokens)
 *   - Vercel CLI logged in (`npx vercel login`)
 *
 * Reads RESEND_API_KEY from .env.local / .env
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";
const PRODUCTION_FROM = "Any Exam Easy <noreply@anyexameasy.com>";
const PRODUCTION_URL = "https://www.anyexameasy.com";

const DEFAULT_PROJECT_ID = "prj_SE0xEweZIfBMYoNyBx6T9EcMx1IP";
const DEFAULT_TEAM_ID = "team_mkSkAoZA4a1JACXEk9sh4b5n";
const DEFAULT_PROJECT_NAME = "any-exam-eas";
const GITHUB_ORG = "ryanchishimba-code";
const GITHUB_REPO = "any-exam-eas";

const ENV_SPECS = [
  { key: "RESEND_API_KEY", sensitive: true },
  { key: "EMAIL_FROM", sensitive: false },
  { key: "NEXTAUTH_URL", sensitive: false, fallback: PRODUCTION_URL },
  { key: "NEXT_PUBLIC_SITE_URL", sensitive: false, fallback: PRODUCTION_URL },
];

const TARGETS = ["production", "preview"];

function parseEnv(content) {
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadProjectEnv() {
  const merged = {};
  for (const file of [".env", ".env.local"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    Object.assign(merged, parseEnv(readFileSync(path, "utf8")));
  }
  return merged;
}

function loadVercelMeta() {
  const merged = loadProjectEnv();
  let projectId = merged.VERCEL_PROJECT_ID;
  let teamId = merged.VERCEL_TEAM_ID;
  let projectName = DEFAULT_PROJECT_NAME;

  for (const file of [".vercel/project.json", ".vercel/repo.json"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    try {
      const json = JSON.parse(readFileSync(path, "utf8"));
      if (json.projectId) projectId = json.projectId;
      if (json.orgId) teamId = json.orgId;
      if (json.project?.name) projectName = json.project.name;
      if (Array.isArray(json.projects) && json.projects[0]) {
        projectId = projectId ?? json.projects[0].id;
        teamId = teamId ?? json.projects[0].orgId;
        projectName = json.projects[0].name ?? projectName;
      }
    } catch {
      /* ignore */
    }
  }

  return {
    projectId: projectId ?? DEFAULT_PROJECT_ID,
    teamId: teamId ?? DEFAULT_TEAM_ID,
    projectName,
  };
}

function resolveValues(env) {
  const values = {};
  for (const spec of ENV_SPECS) {
    let value = env[spec.key]?.trim() || spec.fallback;
    if (!value) {
      throw new Error(`Missing ${spec.key} in .env.local`);
    }
    if (spec.key === "EMAIL_FROM" && /resend\.dev|onboarding@/i.test(value)) {
      console.warn(
        `⚠ EMAIL_FROM uses Resend sandbox locally — pushing ${PRODUCTION_FROM} to Vercel.`
      );
      console.warn("  Domain must be Verified in Resend: https://resend.com/domains");
      value = PRODUCTION_FROM;
    }
    if (
      (spec.key === "NEXTAUTH_URL" || spec.key === "NEXT_PUBLIC_SITE_URL") &&
      /localhost|127\.0\.0\.1/i.test(value)
    ) {
      console.warn(
        `⚠ ${spec.key} is ${value} locally — pushing ${PRODUCTION_URL} to Vercel instead.`
      );
      value = PRODUCTION_URL;
    }
    values[spec.key] = value;
  }
  return values;
}

async function pushViaApi({ token, projectId, teamId, values }) {
  const base = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`;

  for (const target of TARGETS) {
    for (const spec of ENV_SPECS) {
      const value = values[spec.key];
      const type =
        spec.sensitive && target !== "development" ? "sensitive" : "encrypted";

      const res = await fetch(base, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: spec.key,
          value,
          type,
          target: [target],
        }),
      });

      const body = await res.text();
      if (!res.ok) {
        throw new Error(
          `Vercel API failed for ${spec.key} (${target}): ${res.status} ${body.slice(0, 300)}`
        );
      }
      console.log(`✓ ${spec.key} → ${target} (API)`);
    }
  }
}

function pushViaCli(values) {
  const results = { production: true, preview: true };
  for (const target of TARGETS) {
    for (const spec of ENV_SPECS) {
      const value = values[spec.key];
      const args = [
        "vercel",
        "env",
        "add",
        spec.key,
        target,
        "--value",
        value,
        "--yes",
        "--force",
      ];
      if (spec.sensitive) args.push("--sensitive");
      else args.push("--no-sensitive");

      const r = spawnSync(VERCEL, args, { cwd: root, encoding: "utf8", stdio: "pipe" });
      if (r.status !== 0) {
        console.error(`Failed ${spec.key} (${target}):`, r.stderr || r.stdout);
        results[target] = false;
      } else {
        console.log(`✓ ${spec.key} → ${target} (CLI)`);
      }
    }
  }
  return results;
}

async function redeployViaApi({ token, projectId, teamId, projectName }) {
  const url = `https://api.vercel.com/v13/deployments?teamId=${teamId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      project: projectId,
      target: "production",
      gitSource: {
        type: "github",
        org: GITHUB_ORG,
        repo: GITHUB_REPO,
        ref: "main",
      },
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    console.warn(`Redeploy via API failed (${res.status}): ${body.slice(0, 300)}`);
    console.warn("Redeploy manually: Vercel Dashboard → Deployments → Redeploy");
    return false;
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = {};
  }
  console.log(`✓ Production redeploy triggered${json.url ? `: ${json.url}` : ""}`);
  return true;
}

function redeployViaCli() {
  const r = spawnSync(VERCEL, ["--prod"], { cwd: root, stdio: "inherit" });
  return r.status === 0;
}

async function main() {
  const env = loadProjectEnv();
  const { projectId, teamId, projectName } = loadVercelMeta();
  const token = env.VERCEL_TOKEN?.trim() || process.env.VERCEL_TOKEN?.trim();

  if (!env.RESEND_API_KEY?.trim()) {
    console.error("\nNo RESEND_API_KEY in .env.local");
    console.error("1. Get a key: https://resend.com/api-keys");
    console.error("2. Run: RESEND_API_KEY=re_xxx node scripts/resend-setup.mjs");
    console.error("3. Re-run: npm run vercel:email:deploy\n");
    process.exit(1);
  }

  let values;
  try {
    values = resolveValues(env);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }

  console.log(`\nConnecting forgot-password email → Vercel project ${projectName}`);
  console.log(`  Project: ${projectId}`);
  console.log(`  Targets: ${TARGETS.join(", ")}\n`);

  if (token) {
    await pushViaApi({ token, projectId, teamId, values });
  } else {
    console.log("No VERCEL_TOKEN — using Vercel CLI (run `npx vercel login` if this fails).\n");
    const cliResults = pushViaCli(values);
    if (!cliResults.production) {
      console.error(`
Could not push production env vars. Fix one of:
  A) Add VERCEL_TOKEN to .env.local (https://vercel.com/account/tokens) and re-run
  B) Run: npx vercel login
  C) Add vars manually in Vercel → Settings → Environment Variables
`);
      process.exit(1);
    }
    if (!cliResults.preview) {
      console.warn("\n⚠ Preview env push failed — production vars were updated.");
      console.warn("  Preview is optional; continue with production redeploy.\n");
    }
  }

  console.log("\n✓ Email env pushed to Vercel (production).");

  if (process.argv.includes("--redeploy")) {
    console.log("\nTriggering production redeploy…\n");
    if (token) {
      await redeployViaApi({ token, projectId, teamId, projectName });
    } else {
      redeployViaCli();
    }
  } else {
    console.log("\nRedeploy for changes to apply:");
    console.log("  npm run vercel:email:deploy\n");
  }

  console.log("Verify after deploy (~2 min):");
  console.log(`  curl -s ${PRODUCTION_URL}/api/health | grep resend`);
  console.log('  expect: "resend":"set" and passwordResetEmail ok\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
