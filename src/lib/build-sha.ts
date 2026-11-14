/** Public git commit of this build. Not a secret. */
export function publicBuildSha(env: Record<string, string | undefined> = process.env): string | null {
  for (const key of ["VERCEL_GIT_COMMIT_SHA", "GITHUB_SHA"] as const) {
    const sha = (env[key] ?? "").trim().toLowerCase();
    if (/^[0-9a-f]{7,40}$/.test(sha)) return sha;
  }
  return null;
}
