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
      "DATABASE_URL uses SQLite on Vercel. Set a postgresql:// URL (Neon or AWS RDS) in environment variables."
    );
  }

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add an AWS RDS or PostgreSQL URL to .env (see docs/AWS_RDS.md)."
    );
  }

  if (isBuildPlaceholderDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL is still the build placeholder. Set your real RDS postgresql:// URL in .env or Secrets Manager."
    );
  }
}
