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
 *   prepare   Poll the public site for this deployment's commit, then write
 *             smoke-guard.json. Does not need VERCEL_TOKEN.
 *             Exit 0 and should_smoke=true = run the signed-in smoke.
 *             Exit 0 and should_smoke=false = skip (disabled, or this commit
 *             is not what www.anyexameasy.com is serving).
 *             Exit 1 = no commit SHA to wait for. Do not roll back.
 *   rollback  Point production at fromDeploymentId. Needs VERCEL_TOKEN.
 *             Without it, fail loudly and leave production as-is.
 *             Only when the live alias was a promote. A failed smoke of an
 *             existing rollback stays put, so a bad deploy is not promoted back.
 *
 * Disable: repository variable PRODUCTION_SMOKE_ROLLBACK=false
 *   or Actions → Production student smoke → Disable workflow.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { liveCheckResult, rollbackBlocker, shaFromBuildResponse } from "./production-smoke-live.mjs";

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

async function readLiveSha(origin) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(new URL("/api/build", origin), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const body = await response.json().catch(() => null);
    return shaFromBuildResponse({
      header: response.headers.get("x-aee-build-sha"),
      body,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function prepare() {
  if ((process.env.PRODUCTION_SMOKE_ROLLBACK ?? "true").toLowerCase() === "false") {
    summary("Production student smoke is disabled (PRODUCTION_SMOKE_ROLLBACK=false).");
    githubOutput("should_smoke", "false");
    process.exit(0);
  }

  const origin = process.env.PRODUCTION_SMOKE_ORIGIN ?? `https://${PRODUCTION_HOST}`;
  const expectedSha = process.env.EXPECTED_SHA ?? "";
  const deadline = Date.now() + 3 * 60 * 1000;
  let liveSha = null;
  let timedOut = false;
  while (true) {
    liveSha = await readLiveSha(origin);
    const decision = liveCheckResult({ expectedSha, liveSha, timedOut: false });
    if (decision.action === "fail") fail(decision.message ?? "No commit SHA to wait for.");
    if (decision.action === "smoke") break;
    if (Date.now() >= deadline) {
      timedOut = true;
      break;
    }
    console.log(`Live commit is ${liveSha ?? "unknown"}; waiting for ${expectedSha.trim().toLowerCase()}`);
    await new Promise((resolve) => setTimeout(resolve, 10_000));
  }

  const decision = liveCheckResult({ expectedSha, liveSha, timedOut });
  if (decision.action === "fail") fail(decision.message ?? "No commit SHA to wait for.");
  if (decision.action !== "smoke") {
    summary(decision.message ?? "Smoke skipped. Production was not changed.");
    githubOutput("should_smoke", "false");
    process.exit(0);
  }

  const state = {
    liveSha,
    expectedSha: expectedSha.trim().toLowerCase(),
    liveId: null,
    liveUrl: null,
    fromId: null,
    aliasType: null,
    aliasStatus: null,
    aliasTo: null,
  };

  if (token) {
    try {
      const live = await liveDeployment();
      const alias = await aliasRequest();
      state.liveId = live.id;
      state.liveUrl = live.url;
      state.fromId = alias?.fromDeploymentId ?? null;
      state.aliasType = alias?.type ?? null;
      state.aliasStatus = alias?.jobStatus ?? null;
      state.aliasTo = alias?.toDeploymentId ?? null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Could not record a rollback target (${message}). The smoke will still run.`);
    }
  } else {
    console.log("VERCEL_TOKEN is not set. The signed-in smoke will run. Rollback will be unavailable.");
  }

  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  console.log(
    `Live commit ${state.liveSha}. Last alias ${state.aliasType ?? "unknown"} ` +
      `${state.fromId ?? "?"} -> ${state.aliasTo ?? "?"}`
  );
  githubOutput("should_smoke", "true");
  if (state.liveId) githubOutput("live_id", state.liveId);
}

async function rollback() {
  const enabled = (process.env.PRODUCTION_SMOKE_ROLLBACK ?? "true").toLowerCase() !== "false";
  let state = {};
  try {
    state = JSON.parse(readFileSync(STATE_PATH, "utf8"));
  } catch {
    state = {};
  }
  const blocker = rollbackBlocker(state, { token, rollbackEnabled: enabled });
  if (blocker === "disabled") {
    fail("Smoke failed and PRODUCTION_SMOKE_ROLLBACK=false, so production was left as-is.");
  }
  if (blocker === "missing_token") {
    fail(
      "Smoke failed and VERCEL_TOKEN is not set, so production was left as-is. " +
        "Add the VERCEL_TOKEN secret to roll a failed student smoke back."
    );
  }
  if (blocker === "not_promote") {
    fail(
      `Smoke failed on ${state.liveId ?? state.liveSha ?? "this deploy"}, which became live via ${state.aliasType ?? "an unknown alias change"} ` +
        "rather than a promote. Production was left as-is so a previous rollback is not undone."
    );
  }
  if (blocker === "no_previous") {
    fail(`Smoke failed on ${state.liveId}, and there is no previous deployment to restore.`);
  }
  if (blocker === "alias_moved") {
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
