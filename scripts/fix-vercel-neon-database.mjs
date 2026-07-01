#!/usr/bin/env node
/**
 * Point Vercel DATABASE_URL at the canonical Neon database (from .env / .env.local).
 *
 * Fixes split-brain when Vercel's Neon integration (exameasy_*) points at a stale
 * branch while local .env uses the real production database.
 *
 * Usage:
 *   node scripts/fix-vercel-neon-database.mjs
 *   node scripts/fix-vercel-neon-database.mjs --redeploy
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  ensureDatabaseUrlEnv,
  loadEnvFiles,
  resolveDatabaseUrl,
} from "./resolve-database-url.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["production", "preview", "development"];
const GITHUB_ORG = "ryanchishimba-code";
const GITHUB_REPO = "any-exam-eas";
const PRODUCTION_URL = "https://www.anyexameasy.com";

function loadAuth() {
  const authPath = path.join(
    os.homedir(),
    "Library/Application Support/com.vercel.cli/auth.json"
  );
  if (!fs.existsSync(authPath)) {
    throw new Error("Vercel auth not found. Run: npx vercel login");
  }
  const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
  if (!auth.token) throw new Error("Vercel auth.json missing token");
  return auth.token;
}

function loadProject() {
  const repo = JSON.parse(fs.readFileSync(path.join(ROOT, ".vercel/repo.json"), "utf8"));
  const project = repo.projects?.[0];
  if (!project?.id || !project?.orgId || !project?.name) {
    throw new Error("Missing project metadata in .vercel/repo.json");
  }
  return {
    projectId: project.id,
    teamId: project.orgId,
    projectName: project.name,
  };
}

function describeUrl(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      database: u.pathname.slice(1),
      pooled: /pooler/i.test(u.hostname),
    };
  } catch {
    return { host: "invalid", database: "", pooled: false };
  }
}

async function listEnv(token, projectId, teamId) {
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`list env failed: ${res.status}`);
  const data = await res.json();
  return data.envs ?? [];
}

async function deleteEnv(token, projectId, teamId, id) {
  await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/env/${id}?teamId=${teamId}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
  );
}

async function decryptEnv(token, projectId, teamId, id) {
  const res = await fetch(
    `https://api.vercel.com/v1/projects/${projectId}/env/${id}?decrypt=true&teamId=${teamId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return "";
  const data = await res.json();
  const raw = data.value ?? data.decrypted ?? "";
  return typeof raw === "string" ? raw.trim() : String(raw ?? "").trim();
}

async function upsertEnvVar(token, projectId, teamId, existing, key, url, target) {
  const matches = existing.filter((e) => e.key === key && e.target?.includes(target));
  for (const entry of matches) {
    await deleteEnv(token, projectId, teamId, entry.id);
    existing.splice(existing.indexOf(entry), 1);
  }

  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value: url,
        type: "encrypted",
        target: [target],
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed ${key} (${target}): ${data.error?.message ?? res.status}`);
  }
  existing.push({ id: data.created?.id ?? data.id, key, target: [target] });
}

async function upsertDatabaseUrl(token, projectId, teamId, existing, url, target) {
  for (const key of ["DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL"]) {
    await upsertEnvVar(token, projectId, teamId, existing, key, url, target);
  }
}

async function redeployViaApi({ token, projectId, teamId, projectName }) {
  const res = await fetch(
    `https://api.vercel.com/v13/deployments?teamId=${teamId}`,
    {
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
    }
  );
  const body = await res.text();
  if (!res.ok) {
    console.warn(`Redeploy failed (${res.status}): ${body.slice(0, 300)}`);
    console.warn("Redeploy manually: Vercel Dashboard → Deployments → Redeploy");
    return false;
  }
  let json = {};
  try {
    json = JSON.parse(body);
  } catch {
    /* ignore */
  }
  console.log(`✓ Production redeploy triggered${json.url ? `: ${json.url}` : ""}`);
  return true;
}

async function verifyProductionEnv(token, projectId, teamId, canonical) {
  const envs = await listEnv(token, projectId, teamId);
  const entry = envs.find(
    (e) => e.key === "DATABASE_URL" && e.target?.includes("production")
  );
  if (!entry) {
    console.error("✗ Production DATABASE_URL not set in Vercel");
    return false;
  }
  const productionUrl = await decryptEnv(token, projectId, teamId, entry.id);
  const production = describeUrl(productionUrl);
  const match =
    production.host === canonical.host && production.database === canonical.database;
  if (match) {
    console.log(`✓ Production DATABASE_URL matches canonical (${canonical.host}/${canonical.database})`);
  } else {
    console.error("✗ Production DATABASE_URL mismatch:");
    console.error(`  production: ${production.host}/${production.database}`);
    console.error(`  canonical:  ${canonical.host}/${canonical.database}`);
  }
  return match;
}

async function verifyPublicHealth() {
  try {
    const res = await fetch(`${PRODUCTION_URL}/api/health`, { cache: "no-store" });
    const body = await res.json().catch(() => ({}));
    const ok = res.status === 200 && body.ok === true;
    console.log(`${ok ? "✓" : "✗"} Public health: HTTP ${res.status} ok=${body.ok ?? false}`);
    return ok;
  } catch (error) {
    console.error("✗ Public health request failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
async function verifyProductionQuestionCount(token, projectId, teamId, expectedHost) {
  const envs = await listEnv(token, projectId, teamId);
  const cronEntry = envs.find(
    (e) => e.key === "CRON_SECRET" && e.target?.includes("production")
  );
  if (!cronEntry) {
    console.log("Skip post-deploy verify: no production CRON_SECRET in Vercel");
    return;
  }
  const cronSecret = await decryptEnv(token, projectId, teamId, cronEntry.id);
  if (!cronSecret) return;

  for (let attempt = 1; attempt <= 12; attempt++) {
    await new Promise((r) => setTimeout(r, attempt === 1 ? 5000 : 15000));
    try {
      const res = await fetch(`${PRODUCTION_URL}/api/health`, {
        headers: { Authorization: `Bearer ${cronSecret}` },
        cache: "no-store",
      });
      const report = await res.json();
      const qb = report.checks?.questionBank ?? "unknown";
      const db = report.checks?.databaseUrl ?? "unknown";
      console.log(`Health attempt ${attempt}: ok=${report.ok} db=${db} bank=${qb}`);
      if (report.checks?.prisma === "ok" && String(qb).includes("ok")) {
        if (expectedHost && !String(qb).includes("empty")) {
          console.log("✓ Production is using the populated Neon database.");
        }
        return;
      }
    } catch (e) {
      console.log(`Health attempt ${attempt} failed:`, e instanceof Error ? e.message : e);
    }
  }
  console.warn("Production health did not confirm question bank yet — check again in a few minutes.");
}

async function main() {
  loadEnvFiles();
  const databaseUrl = ensureDatabaseUrlEnv() || resolveDatabaseUrl();
  if (!databaseUrl?.startsWith("postgres")) {
    throw new Error(
      "No canonical DATABASE_URL in .env / .env.local. Set your Neon pooled postgresql:// URL first."
    );
  }

  const canonical = describeUrl(databaseUrl);
  if (!canonical.pooled) {
    console.warn("Warning: DATABASE_URL hostname may not be Neon pooler (-pooler).");
  }

  const verifyOnly = process.argv.includes("--verify");
  const token = loadAuth();
  const { projectId, teamId, projectName } = loadProject();
  const existing = await listEnv(token, projectId, teamId);

  if (verifyOnly) {
    console.log("Verify-only — no Vercel env writes.\n");
    const envOk = await verifyProductionEnv(token, projectId, teamId, canonical);
    const healthOk = await verifyPublicHealth();
    process.exit(envOk && healthOk ? 0 : 1);
  }

  const integrationEntry = existing.find((e) => e.key === "exameasy_DATABASE_URL");
  if (integrationEntry) {
    const integrationUrl = await decryptEnv(
      token,
      projectId,
      teamId,
      integrationEntry.id
    );
    const integration = describeUrl(integrationUrl);
    if (integration.host !== canonical.host || integration.database !== canonical.database) {
      console.log("Detected Vercel Neon integration on a different database:");
      console.log(`  integration: ${integration.host}/${integration.database}`);
      console.log(`  canonical:   ${canonical.host}/${canonical.database}`);
      console.log("Setting DATABASE_URL on all Vercel targets (overrides integration fallback).\n");
    }
  }

  console.log(`Canonical Neon: ${canonical.host}/${canonical.database} (pooled=${canonical.pooled})`);

  for (const target of TARGETS) {
    await upsertDatabaseUrl(token, projectId, teamId, existing, databaseUrl, target);
    console.log(`✓ DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL → ${target}`);
  }

  console.log("");
  await verifyProductionEnv(token, projectId, teamId, canonical);
  await verifyPublicHealth();

  if (process.argv.includes("--redeploy")) {
    console.log("\nTriggering production redeploy…");
    const ok = await redeployViaApi({ token, projectId, teamId, projectName });
    if (ok) {
      console.log("\nWaiting for deploy, then verifying question bank…");
      await verifyProductionQuestionCount(token, projectId, teamId, canonical.host);
    }
  } else {
    console.log("\nRedeploy for runtime to pick up env changes:");
    console.log("  node scripts/fix-vercel-neon-database.mjs --redeploy");
    console.log("  or Vercel Dashboard → Deployments → Redeploy");
  }

  console.log(`\nVerify: ${PRODUCTION_URL}/api/health (Bearer CRON_SECRET for details)`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
