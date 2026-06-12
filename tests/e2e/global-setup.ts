import { execSync } from "node:child_process";
import fs from "node:fs";

function loadDotEnv(file: string): Record<string, string> {
  const filePath = `${process.cwd()}/${file}`;
  if (!fs.existsSync(filePath)) return {};

  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
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

/** Seeds the dev trial user when DATABASE_URL is available. */
export default async function globalSetup() {
  const dotenv = { ...loadDotEnv(".env"), ...loadDotEnv(".env.local") };
  const databaseUrl = process.env.DATABASE_URL ?? dotenv.DATABASE_URL;

  if (process.env.PLAYWRIGHT_SKIP_SEED === "1" || !databaseUrl) {
    return;
  }

  try {
    execSync("npm run db:seed-user", {
      stdio: "inherit",
      env: { ...process.env, ...dotenv, DATABASE_URL: databaseUrl },
    });
  } catch (error) {
    console.warn("[e2e] db:seed-user failed:", error);
  }
}
