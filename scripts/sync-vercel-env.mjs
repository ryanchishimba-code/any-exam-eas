#!/usr/bin/env node
/**
 * Sync required auth/db env vars to Vercel preview + development.
 * Uses the Vercel REST API (preview CLI prompts for a git branch in CI).
 */
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PULL_PATH = process.env.VERCEL_ENV_PULL_PATH ?? "/tmp/vercel-prod-env.txt";
const TARGETS = (process.env.VERCEL_ENV_TARGETS ?? "preview,development")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function runVercel(args) {
  return spawnSync("npx", ["vercel", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parseEnvFile(text) {
  const out = {};
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function loadAuth() {
  const authPath = path.join(
    os.homedir(),
    "Library/Application Support/com.vercel.cli/auth.json"
  );
  if (!fs.existsSync(authPath)) {
    throw new Error(`Vercel auth not found at ${authPath}. Run: npx vercel login`);
  }
  const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
  if (!auth.token) throw new Error("Vercel auth.json missing token");
  return auth.token;
}

function loadProject() {
  const repo = JSON.parse(fs.readFileSync(path.join(ROOT, ".vercel/repo.json"), "utf8"));
  const project = repo.projects?.[0];
  if (!project?.id || !project?.orgId) {
    throw new Error("Missing project id/orgId in .vercel/repo.json");
  }
  return { projectId: project.id, teamId: project.orgId };
}

async function listEnv(token, projectId, teamId) {
  const url = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`list env failed: ${res.status}`);
  const data = await res.json();
  return data.envs ?? [];
}

async function deleteEnv(token, projectId, teamId, id) {
  const url = `https://api.vercel.com/v9/projects/${projectId}/env/${id}?teamId=${teamId}`;
  await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

async function upsertEnv(token, projectId, teamId, existing, spec) {
  const { key, value, target, type = "encrypted" } = spec;
  if (!value?.trim()) {
    console.log(`SKIP ${key} ${target} (empty)`);
    return true;
  }

  const matches = existing.filter((e) => e.key === key && e.target?.includes(target));
  for (const m of matches) {
    await deleteEnv(token, projectId, teamId, m.id);
  }

  const url = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, value, type, target: [target] }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`FAIL ${key} ${target}`, data.error?.message ?? res.status);
    return false;
  }
  console.log(`OK ${key} ${target}`);
  existing.push({ id: data.created?.id ?? data.id, key, target: [target] });
  return true;
}

function secret() {
  return randomBytes(32).toString("base64");
}

console.log("Pulling production env reference…");
const pull = runVercel(["env", "pull", PULL_PATH, "--environment=production", "--yes"]);
if (pull.status !== 0) {
  console.error((pull.stderr || pull.stdout || "").trim());
  process.exit(1);
}

const env = parseEnvFile(fs.readFileSync(PULL_PATH, "utf8"));
const { loadEnvFiles, resolveDatabaseUrl } = await import("./resolve-database-url.mjs");
loadEnvFiles();
const localDb = resolveDatabaseUrl();
const pulledDb =
  env.DATABASE_URL?.trim() ||
  env.exameasy_DATABASE_URL?.trim() ||
  env.exameasy_POSTGRES_URL?.trim() ||
  "";
// Prefer local .env when production pull is empty or still on a stale integration DB.
const db = localDb?.startsWith("postgres") ? localDb : pulledDb;
const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.anyexameasy.com";
const authUrl = env.NEXTAUTH_URL?.trim() || siteUrl;
const authSecret = env.NEXTAUTH_SECRET?.trim() || secret();
const cronSecret = env.CRON_SECRET?.trim() || secret();

const token = loadAuth();
const { projectId, teamId } = loadProject();
const existing = await listEnv(token, projectId, teamId);

const specs = [];
for (const target of TARGETS) {
  specs.push(
    { key: "DATABASE_URL", value: db, target, type: "encrypted" },
    { key: "NEXTAUTH_SECRET", value: authSecret, target, type: "encrypted" },
    { key: "CRON_SECRET", value: cronSecret, target, type: "encrypted" },
    { key: "NEXTAUTH_URL", value: authUrl, target, type: "plain" },
    { key: "NEXT_PUBLIC_SITE_URL", value: siteUrl, target, type: "plain" }
  );
}

let ok = true;
for (const spec of specs) {
  if (!(await upsertEnv(token, projectId, teamId, existing, spec))) ok = false;
}

process.exit(ok ? 0 : 1);
