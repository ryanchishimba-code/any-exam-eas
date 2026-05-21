export const BUILD_PLACEHOLDER_DATABASE_URL =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

/** @returns {boolean} true if using the build-time placeholder (not a real DB) */
export function isPlaceholderDatabaseUrl(url = process.env.DATABASE_URL ?? "") {
  return (
    !url ||
    url === BUILD_PLACEHOLDER_DATABASE_URL ||
    /^postgres(ql)?:\/\/build:build@127\.0\.0\.1:5432\/build/.test(url)
  );
}

/** @returns {boolean} true if using the build-time placeholder (not a real DB) */
export function ensureDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = BUILD_PLACEHOLDER_DATABASE_URL;
    process.env.PRISMA_DATABASE_URL_PLACEHOLDER = "1";
    console.warn(
      "Warning: DATABASE_URL is not set. Using a build-time placeholder."
    );
    console.warn(
      "Add your Neon Postgres URL in Vercel → Settings → Environment Variables."
    );
    return true;
  }

  if (isPlaceholderDatabaseUrl()) {
    process.env.PRISMA_DATABASE_URL_PLACEHOLDER = "1";
    return true;
  }

  return false;
}

export function shouldRunMigrations() {
  if (process.env.PRISMA_DATABASE_URL_PLACEHOLDER === "1") return false;
  const url = process.env.DATABASE_URL ?? "";
  if (isPlaceholderDatabaseUrl(url)) return false;
  return /^postgres(ql)?:\/\//.test(url);
}
