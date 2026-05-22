import { spawnSync } from "node:child_process";
import { ensureDatabaseUrl, shouldRunMigrations } from "./prisma-env.mjs";

function run(command, args, { allowFail = false } = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
  if (result.status !== 0 && !allowFail) process.exit(result.status ?? 1);
  return result.status ?? 1;
}

run("node", ["scripts/set-prisma-provider.mjs", "postgresql"]);
ensureDatabaseUrl();
run("npx", ["prisma", "generate"]);

if (shouldRunMigrations()) {
  console.log("Applying database migrations...");
  run("npx", ["prisma", "migrate", "deploy"]);
  console.log("Syncing question bank into database (may take 1–3 minutes)...");
  const syncStatus = run("node", ["scripts/sync-question-bank.mjs"], {
    allowFail: true,
  });
  if (syncStatus !== 0) {
    console.warn(
      "Question bank sync failed during build. After deploy, call GET /api/cron/sync-question-bank with Authorization: Bearer $CRON_SECRET"
    );
  }
} else {
  console.log(
    "Skipping prisma migrate deploy: set DATABASE_URL (postgresql://…) for Production AND Build in Vercel env settings."
  );
}

run("npx", ["next", "build"]);
