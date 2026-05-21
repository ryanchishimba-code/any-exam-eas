import { spawnSync } from "node:child_process";
import { ensureDatabaseUrl, shouldRunMigrations } from "./prisma-env.mjs";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("node", ["scripts/set-prisma-provider.mjs", "postgresql"]);
ensureDatabaseUrl();
run("npx", ["prisma", "generate"]);

if (shouldRunMigrations()) {
  console.log("Applying database migrations...");
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log(
    "Skipping prisma migrate deploy until a real DATABASE_URL is set on Vercel."
  );
}

run("npx", ["next", "build"]);
