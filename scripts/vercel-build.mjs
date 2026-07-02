import { spawnSync } from "node:child_process";
import { ensureDatabaseUrl, shouldRunMigrations } from "./prisma-env.mjs";

/** Vercel builders have ~8GB RAM; Next.js/webpack needs explicit heap headroom. */
function ensureBuildHeap() {
  if (process.env.NODE_OPTIONS?.includes("max-old-space-size")) return;
  const extra = process.env.VERCEL ? "--max-old-space-size=6144" : "--max-old-space-size=8192";
  process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, extra].filter(Boolean).join(" ").trim();
}

function run(command, args, { allowFail = false } = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
  if (result.status !== 0 && !allowFail) process.exit(result.status ?? 1);
  return result.status ?? 1;
}

function sleepMs(ms) {
  spawnSync("sleep", [String(Math.max(1, Math.ceil(ms / 1000)))], { stdio: "ignore" });
}

/** Neon + concurrent Vercel deploys often hit P1002 advisory-lock timeouts. */
function runMigrateDeploy() {
  const attempts = process.env.VERCEL ? 3 : 1;
  for (let i = 1; i <= attempts; i++) {
    const status = run("npx", ["prisma", "migrate", "deploy"], { allowFail: true });
    if (status === 0) return;
    if (i < attempts) {
      console.warn(`migrate deploy attempt ${i}/${attempts} failed — retrying in 8s…`);
      sleepMs(8000);
    }
  }
  if (process.env.VERCEL) {
    console.warn(
      "migrate deploy failed after retries (Neon advisory lock / cold start). Continuing build — migrations are likely already applied."
    );
    return;
  }
  process.exit(1);
}

run("node", ["scripts/set-prisma-provider.mjs", "postgresql"]);
ensureDatabaseUrl();
run("npx", ["prisma", "generate"]);

if (shouldRunMigrations()) {
  console.log("Applying database migrations...");
  runMigrateDeploy();
  // Bulk sync (~78k rows) is too heavy for Vercel build; use cron or manual trigger after deploy.
  if (!process.env.VERCEL) {
    console.log("Syncing question bank into database (may take 1–3 minutes)...");
    const syncStatus = run("node", ["scripts/sync-question-bank.mjs"], {
      allowFail: true,
    });
    if (syncStatus !== 0) {
      console.warn(
        "Question bank sync failed during build. Run npm run db:sync-questions or the cron endpoint after deploy."
      );
    }
  } else {
    console.log(
      "Skipping question bank sync during Vercel build. After deploy, call GET /api/cron/sync-question-bank with Authorization: Bearer $CRON_SECRET"
    );
  }
} else {
  console.log(
    "Skipping prisma migrate deploy: set DATABASE_URL (postgresql://…) for Production AND Build in Vercel env settings."
  );
}

ensureBuildHeap();
run("npx", ["next", "build"]);
run("node", ["scripts/mark-production-build.mjs"]);
