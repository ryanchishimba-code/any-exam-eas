const BUILD_PLACEHOLDER =
  /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/;

export function isBuildPlaceholderDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return BUILD_PLACEHOLDER.test(url);
}

export function isSqliteDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return url.startsWith("file:");
}

export function assertRuntimeDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "";

  if (isSqliteDatabaseUrl(url) && process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL uses SQLite on Vercel. Set a Neon postgresql:// URL in Project → Environment Variables."
    );
  }

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run ./scripts/dev.sh or add a postgresql:// URL to .env (see .env.example)."
    );
  }

  if (isBuildPlaceholderDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL is still the build placeholder (127.0.0.1). Add your real Neon postgresql:// URL in Vercel or .env."
    );
  }
}
