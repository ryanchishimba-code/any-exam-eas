/** Pure decisions for the production student smoke. No network and no secrets. */

export function normalizeSha(value) {
  if (typeof value !== "string") return null;
  const sha = value.trim().toLowerCase();
  if (!/^[0-9a-f]{7,40}$/.test(sha)) return null;
  return sha;
}

export function shaMatches(expected, actual) {
  const left = normalizeSha(expected);
  const right = normalizeSha(actual);
  if (!left || !right) return false;
  return left === right || left.startsWith(right) || right.startsWith(left);
}

export function shaFromBuildResponse({ header, body } = {}) {
  return normalizeSha(header) || normalizeSha(body?.sha);
}

/**
 * @returns {{ action: "smoke" | "skip" | "fail" | "wait", message?: string }}
 */
export function liveCheckResult({ expectedSha, liveSha, timedOut }) {
  const expected = normalizeSha(expectedSha);
  if (!expected) {
    return {
      action: "fail",
      message: "No commit SHA to wait for. Smoke was not run and production was not changed.",
    };
  }
  if (shaMatches(expected, liveSha)) return { action: "smoke" };
  if (timedOut) {
    return {
      action: "skip",
      message:
        `www.anyexameasy.com is not serving ${expected}. ` +
        "Auto-promotion may be paused. Smoke skipped. Production was not changed.",
    };
  }
  return { action: "wait" };
}

/** Why rollback must not run. Null means the previous deployment can be restored. */
export function rollbackBlocker(state, { token, rollbackEnabled }) {
  if (rollbackEnabled === false) return "disabled";
  if (!token) return "missing_token";
  if (!state || state.aliasType !== "promote") return "not_promote";
  if (!state.fromId || state.fromId === state.liveId) return "no_previous";
  if (state.aliasTo && state.aliasTo !== state.liveId) return "alias_moved";
  return null;
}
