import { spawnSync } from "node:child_process";
import { ensureDatabaseUrl } from "./prisma-env.mjs";

ensureDatabaseUrl();

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status === 0 ? 0 : 1);
