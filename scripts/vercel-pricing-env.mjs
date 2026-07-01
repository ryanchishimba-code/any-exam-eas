#!/usr/bin/env node
/**
 * Push pricing + trial display env vars to Vercel (production + preview).
 *
 * Usage:
 *   npm run vercel:pricing-env
 *   npm run vercel:pricing-env -- --redeploy
 *   npm run vercel:pricing-env -- --all-envs
 *
 * Auth (one of):
 *   - VERCEL_TOKEN in .env / .env.local
 *   - Vercel CLI logged in (`npx vercel login`)
 */
import { readFileSync, existsSync } from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERCEL = process.platform === "win32" ? "npx.cmd" : "npx";

const DEFAULT_PROJECT_ID = "prj_SE0xEweZIfBMYoNyBx6T9EcMx1IP";
const DEFAULT_TEAM_ID = "team_mkSkAoZA4a1JACXEk9sh4b5n";
const DEFAULT_PROJECT_NAME = "any-exam-eas";
const GITHUB_ORG = "ryanchishimba-code";
const GITHUB_REPO = "any-exam-eas";

const KEYS = [
  "PRO_MONTHLY_PRICE_USD",
  "PRO_YEARLY_PRICE_USD",
  "MONTHLY_PRICE_USD",
  "BASIC_MONTHLY_PRICE_USD",
  "BASIC_YEARLY_PRICE_USD",
  "TRIAL_DAYS",
  "TRIAL_LIFETIME_QUESTIONS",
];

const DEFAULTS = {
  PRO_MONTHLY_PRICE_USD: "34.99",
  PRO_YEARLY_PRICE_USD: "349.99",
  MONTHLY_PRICE_USD: "34.99",
  BASIC_MONTHLY_PRICE_USD: "34.99",
  BASIC_YEARLY_PRICE_USD: "349.99",
  TRIAL_DAYS: "3",
  TRIAL_LIFETIME_QUESTIONS: "150",
};

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
  const merged = { ...DEFAULTS };
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

function loadAuthToken() {
  const fromEnv =
    loadProjectEnv().VERCEL_TOKEN?.trim() || process.env.VERCEL_TOKEN?.trim();
  if (fromEnv) return fromEnv;

  const authPath = join(
    os.homedir(),
    "Library/Application Support/com.vercel.cli/auth.json"
  );
  if (!existsSync(authPath)) return null;
  try {
    const auth = JSON.parse(readFileSync(authPath, "utf8"));
    return auth.token?.trim() || null;
  } catch {
    return null;
  }
}

function resolveValues(env) {
  const values = {};
  for (const key of KEYS) {
    const value = env[key]?.trim() || DEFAULTS[key];
    if (!value) throw new Error(`Missing ${key}`);
    values[key] = value;
  }
  return values;
}

async function pushViaApi({ token, projectId, teamId, values, targets }) {
  const base = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`;
  for (const target of targets) {
    for (const key of KEYS) {
      const res = await fetch(base, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          value: values[key],
          type: "plain",
          target: [target],
        }),
      });
      const body = await res.text();
      if (!res.ok) {
        throw new Error(
          `Vercel API failed for ${key} (${target}): ${res.status} ${body.slice(0, 300)}`
        );
      }
      console.log(`✓ ${key}=${values[key]} → ${target}`);
    }
  }
}

function pushViaCli(values, targets) {
  let ok = true;
  for (const target of targets) {
    for (const key of KEYS) {
      const args = [
        "vercel",
        "env",
        "add",
        key,
        target,
        "--value",
        values[key],
        "--yes",
        "--force",
        "--no-sensitive",
      ];
      const r = spawnSync(VERCEL, args, { cwd: root, encoding: "utf8", stdio: "pipe" });
      if (r.status !== 0) {
        console.error(`Failed ${key} (${target}):`, r.stderr || r.stdout);
        ok = false;
      } else {
        console.log(`✓ ${key}=${values[key]} → ${target}`);
      }
    }
  }
  return ok;
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
  const r = spawnSync(VERCEL, ["vercel", "--prod", "--yes"], {
    cwd: root,
    stdio: "inherit",
  });
  return r.status === 0;
}

async function main() {
  const env = loadProjectEnv();
  const { projectId, teamId, projectName } = loadVercelMeta();
  const token = loadAuthToken();
  const targets = process.argv.includes("--all-envs")
    ? ["production", "preview", "development"]
    : ["production", "preview"];

  let values;
  try {
    values = resolveValues(env);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }

  console.log(`\nSyncing pricing/trial env → Vercel project ${projectName}`);
  console.log(`  Project: ${projectId}`);
  console.log(`  Targets: ${targets.join(", ")}\n`);

  if (token) {
    await pushViaApi({ token, projectId, teamId, values, targets });
  } else {
    console.log("No VERCEL_TOKEN — using Vercel CLI (run `npx vercel login` if this fails).\n");
    if (!pushViaCli(values, targets)) {
      console.error(`
Could not push env vars. Fix one of:
  A) Add VERCEL_TOKEN to .env (https://vercel.com/account/tokens) and re-run
  B) Run: npx vercel login
  C) Add vars manually in Vercel → Settings → Environment Variables
`);
      process.exit(1);
    }
  }

  if (process.argv.includes("--redeploy")) {
    console.log("\nTriggering production redeploy…\n");
    if (token) {
      await redeployViaApi({ token, projectId, teamId, projectName });
    } else {
      redeployViaCli();
    }
  } else {
    console.log("\nDone. Redeploy production for changes to appear on the site.");
    console.log("  npm run vercel:pricing-env -- --redeploy\n");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
