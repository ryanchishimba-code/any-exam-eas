const BUILD_PLACEHOLDER =
  /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/;

export function isBuildPlaceholderDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return BUILD_PLACEHOLDER.test(url);
}

export function assertRuntimeDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon Postgres URL in Vercel → Settings → Environment Variables, then redeploy."
    );
  }
  if (isBuildPlaceholderDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL is still the build placeholder (127.0.0.1). Add your real Neon postgresql:// URL in Vercel → Settings → Environment Variables, then redeploy."
    );
  }
}
