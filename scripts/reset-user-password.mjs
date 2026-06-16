#!/usr/bin/env node
/** @deprecated Use `npm run db:reset-user-password` */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync("npx", ["tsx", "scripts/reset-user-password.mts"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
