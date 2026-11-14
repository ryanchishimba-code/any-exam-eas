import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { publicBuildSha } from "@/lib/build-sha";
import {
  liveCheckResult,
  rollbackBlocker,
  shaFromBuildResponse,
  shaMatches,
} from "../../scripts/production-smoke-live.mjs";

const SHA = "58a36e794ffff1451672217a6bf99e4edca363ae";

describe("public build sha", () => {
  it("publishes the Vercel git commit and nothing else", () => {
    expect(publicBuildSha({ VERCEL_GIT_COMMIT_SHA: SHA.toUpperCase() })).toBe(SHA);
    expect(publicBuildSha({ GITHUB_SHA: SHA })).toBe(SHA);
    expect(publicBuildSha({ VERCEL_GIT_COMMIT_SHA: "not-a-sha", GITHUB_SHA: SHA })).toBe(SHA);
    expect(publicBuildSha({})).toBeNull();
  });
});

describe("production smoke live check", () => {
  it("treats the public commit as live when it matches the deployment", () => {
    expect(shaFromBuildResponse({ header: SHA, body: { sha: "other" } })).toBe(SHA);
    expect(shaFromBuildResponse({ body: { sha: SHA.slice(0, 12) } })).toBe(SHA.slice(0, 12));
    expect(shaMatches(SHA, SHA.slice(0, 7))).toBe(true);
    expect(liveCheckResult({ expectedSha: SHA, liveSha: SHA, timedOut: false }).action).toBe("smoke");
  });

  it("skips when production is still on another commit and does not require a token", () => {
    const result = liveCheckResult({
      expectedSha: SHA,
      liveSha: "f60a3d629bf6a9c9c3df74b3c8c0c5df94bf5b41",
      timedOut: true,
    });
    expect(result.action).toBe("skip");
    expect(result.message).toContain("Auto-promotion may be paused");
    expect(result.message).toContain("Production was not changed");
  });

  it("fails closed when there is no commit to wait for", () => {
    expect(liveCheckResult({ expectedSha: "", liveSha: null, timedOut: true }).action).toBe("fail");
  });

  it("refuses rollback without a token and still allows it when the promote is known", () => {
    const state = {
      liveId: "dpl_new",
      fromId: "dpl_old",
      aliasType: "promote",
      aliasTo: "dpl_new",
    };
    expect(rollbackBlocker(state, { token: "", rollbackEnabled: true })).toBe("missing_token");
    expect(rollbackBlocker(state, { token: "present", rollbackEnabled: true })).toBeNull();
    expect(rollbackBlocker(state, { token: "present", rollbackEnabled: false })).toBe("disabled");
    expect(
      rollbackBlocker({ ...state, aliasType: "rollback" }, { token: "present", rollbackEnabled: true })
    ).toBe("not_promote");
  });

  it("does not make the live check depend on VERCEL_TOKEN", () => {
    const workflow = readFileSync(".github/workflows/production-student-smoke.yml", "utf8");
    const guard = readFileSync("scripts/production-smoke-guard.mjs", "utf8");
    expect(workflow).toContain("EXPECTED_SHA");
    expect(workflow).toContain("github.event.deployment.sha");
    expect(guard).toContain("liveCheckResult");
    expect(guard).not.toContain("VERCEL_TOKEN is not set. Smoke was not run");
    expect(guard).toContain("VERCEL_TOKEN is not set, so production was left as-is");
  });
});
