#!/usr/bin/env node
/**
 * Decides whether a production deployment is actually live, and rolls it
 * back to the deployment it replaced when the student smoke fails.
 *
 * Rollback target is lastAliasRequest.fromDeploymentId — the deployment that
 * held production just before this promote. A newer build that was already
 * rolled off (and is no longer the alias source) is not selected.
 *
 * Commands:
 *   prepare   Write smoke-guard.json and set GitHub outputs.
 *             Exit 0 = run the smoke test.
 *             Exit 2 = skip (disabled, or this build is not the live alias).
 *             Exit 1 = missing token or an unreadable project. Do not roll back.
 *   rollback  Point production at fromDeploymentId. Only when the live
 *             alias was a promote. A failed smoke of an existing rollback
 *             stays put, so a bad deploy is not promoted back.
 *
 * Disable: repository variable PRODUCTION_SMOKE_ROLLBACK=false
 *   or Actions → Production student smoke → Disable workflow.
 */
import { readFileSync, writeFileSync } from "node:fs";

const PROJECT_ID = "prj_SE0xEweZIfBMYoNyBx6T9EcMx1IP";
const TEAM_ID = "team_mkSkAoZA4a1JACXEk9sh4b5n";
const PRODUCTION_HOST = "www.anyexameasy.com";
const STATE_PATH = "smoke-guard.json";

const token = process.env.VERCEL_TOKEN ?? "";
const command = process.argv[2];

function githubOutput(name, value) {
  const path = process.env.GITHUB_OUTPUT;
  if (!path) return;
  writeFileSync(path, `${name}=${value}\n`, { flag: "a" });
}

function summary(text) {
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path) {
    console.log(text);
    return;
  }
  writeFileSync(path, `${text}\n`, { flag: "a" });
}

function fail(message) {
  console.error(message);
  summary(message);
  process.exit(1);
}

async function vercel(path, { method = "GET", body } = {}) {
  const url = new URL(path, "https://api.vercel.com");
  if (!url.searchParams.has("teamId")) url.searchParams.set("teamId", TEAM_ID);
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!response.ok) {
    const detail = json?.error?.message || text.slice(0, 300);
    throw new Error(`${method} ${url.pathname} ${response.status}: ${detail}`);
  }
  return json;
}

function eventDeploymentHint() {
  if (process.env.GITHUB_EVENT_NAME === "workflow_dispatch") return null;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) return null;
  const event = JSON.parse(readFileSync(eventPath, "utf8"));
  const payload = event.deployment?.payload ?? {};
  const idCandidates = [
    payload.id,
    payload.deploymentId,
    payload.deployment?.id,
    payload.meta?.deploymentId,
  ];
  const id = idCandidates.find((value) => typeof value === "string" && value.startsWith("dpl_"));
  if (id) return { id };

  const status = event.deployment_status ?? {};
  const urls = [status.target_url, status.environment_url, status.log_url, payload.url];
  for (const raw of urls) {
    if (typeof raw !== "string" || !raw.startsWith("http")) continue;
    let host = "";
    try {
      host = new URL(raw).hostname;
    } catch {
      continue;
    }
    if (!host.endsWith(".vercel.app")) continue;
    if (host.startsWith("any-exam-eas-") || host.startsWith("any-exam-eas.")) continue;
    return { host };
  }
  return null;
}

async function liveDeployment() {
  const json = await vercel(`/v13/deployments/${PRODUCTION_HOST}`);
  const deployment = json?.deployment ?? json;
  const id = deployment?.id;
  if (!id) throw new Error(`No deployment id for ${PRODUCTION_HOST}`);
  return { id, url: deployment.url ?? null };
}

async function aliasRequest() {
  const project = await vercel(`/v9/projects/${PROJECT_ID}?rollbackInfo=true`);
  const request = project?.lastAliasRequest ?? null;
  if (!request) return null;
  return {
    type: request.type ?? null,
    jobStatus: request.jobStatus ?? null,
    fromDeploymentId: request.fromDeploymentId ?? null,
    toDeploymentId: request.toDeploymentId ?? null,
  };
}

async function prepare() {
  if ((process.env.PRODUCTION_SMOKE_ROLLBACK ?? "true").toLowerCase() === "false") {
    summary("Production student smoke is disabled (PRODUCTION_SMOKE_ROLLBACK=false).");
    githubOutput("should_smoke", "false");
    process.exit(0);
  }
  if (!token) {
    fail("VERCEL_TOKEN is not set. Smoke was not run and production was not changed.");
  }

  const hint = eventDeploymentHint();
  let wanted = hint?.id ?? null;
  if (!wanted && hint?.host) {
    const resolved = await vercel(`/v13/deployments/${hint.host}`);
    wanted = resolved?.deployment?.id ?? resolved?.id ?? null;
    if (!wanted) fail(`Could not resolve deployment host ${hint.host}. Production was not changed.`);
  }
  if (process.env.GITHUB_EVENT_NAME === "deployment_status" && !wanted) {
    summary(
      "This production deployment status did not include a Vercel deployment id or URL. Smoke skipped. Production was not changed."
    );
    githubOutput("should_smoke", "false");
    process.exit(0);
  }

  let live = await liveDeployment();
  const deadline = Date.now() + 3 * 60 * 1000;
  while (wanted && live.id !== wanted && Date.now() < deadline) {
    console.log(`Live deployment is ${live.id}; waiting for ${wanted}`);
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    live = await liveDeployment();
  }

  if (wanted && live.id !== wanted) {
    summary(
      `Deployment ${wanted} is not serving ${PRODUCTION_HOST} (live is ${live.id}). ` +
        "Auto-promotion is paused or this build was not assigned. Smoke skipped. Production was not changed."
    );
    githubOutput("should_smoke", "false");
    process.exit(0);
  }

  const alias = await aliasRequest();
  const state = {
    liveId: live.id,
    liveUrl: live.url,
    fromId: alias?.fromDeploymentId ?? null,
    aliasType: alias?.type ?? null,
    aliasStatus: alias?.jobStatus ?? null,
    aliasTo: alias?.toDeploymentId ?? null,
  };
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  console.log(
    `Live ${state.liveId}. Last alias ${state.aliasType ?? "unknown"} ` +
      `${state.fromId ?? "?"} -> ${state.aliasTo ?? "?"}`
  );
  githubOutput("should_smoke", "true");
  githubOutput("live_id", state.liveId);
}

async function rollback() {
  if ((process.env.PRODUCTION_SMOKE_ROLLBACK ?? "true").toLowerCase() === "false") {
    fail("Smoke failed and PRODUCTION_SMOKE_ROLLBACK=false, so production was left as-is.");
  }
  if (!token) {
    fail("Smoke failed and VERCEL_TOKEN is not set, so production was left as-is.");
  }

  const state = JSON.parse(readFileSync(STATE_PATH, "utf8"));
  if (state.aliasType !== "promote") {
    fail(
      `Smoke failed on ${state.liveId}, which became live via ${state.aliasType ?? "an unknown alias change"} ` +
        "rather than a promote. Production was left as-is so a previous rollback is not undone."
    );
  }
  if (!state.fromId || state.fromId === state.liveId) {
    fail(`Smoke failed on ${state.liveId}, and there is no previous deployment to restore.`);
  }
  if (state.aliasTo && state.aliasTo !== state.liveId) {
    fail(
      `Smoke failed, but the last alias target is ${state.aliasTo} rather than live ${state.liveId}. Production was left as-is.`
    );
  }

  const description = "Student smoke failed; restoring the previous production deployment";
  console.log(`Rolling production back from ${state.liveId} to ${state.fromId}`);
  try {
    await vercel(
      `/v1/projects/${PROJECT_ID}/rollback/${state.fromId}?description=${encodeURIComponent(description)}`,
      { method: "POST", body: {} }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes(" 404:")) throw error;
    await vercel(
      `/v9/projects/${PROJECT_ID}/rollback/${state.fromId}?description=${encodeURIComponent(description)}`,
      { method: "POST", body: {} }
    );
  }

  const deadline = Date.now() + 3 * 60 * 1000;
  let live = await liveDeployment();
  while (live.id !== state.fromId && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    live = await liveDeployment();
  }
  if (live.id !== state.fromId) {
    fail(
      `Rollback to ${state.fromId} was requested, but ${PRODUCTION_HOST} is still ${live.id}. ` +
        "Auto-assignment of new production builds stays paused until a deployment is promoted."
    );
  }

  summary(
    `Student smoke failed on \`${state.liveId}\`. Production was rolled back to \`${state.fromId}\` ` +
      `(${PRODUCTION_HOST}). Auto-assignment of new main builds is paused until that deployment is promoted.`
  );
  console.log(`Rolled back to ${state.fromId}`);
  process.exit(1);
}

try {
  if (command === "prepare") await prepare();
  else if (command === "rollback") await rollback();
  else fail("Usage: production-smoke-guard.mjs <prepare|rollback>");
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
