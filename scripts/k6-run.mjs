#!/usr/bin/env node
/**
 * Run k6 using the repo-local binary (.tools/k6-bin) when present,
 * otherwise fall back to `k6` on PATH.
 *
 * Usage: node scripts/k6-run.mjs [k6 run args…]
 * Example: npm run test:load:k6:smoke
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const localBin = path.join(root, ".tools", "k6-bin");
const k6Args = ["run", ...process.argv.slice(2)];

function resolveK6Binary() {
  if (existsSync(localBin)) return localBin;
  return "k6";
}

const bin = resolveK6Binary();

if (bin === "k6" && !existsSync(localBin)) {
  console.warn(
    "Local k6 not found at .tools/k6-bin — using `k6` from PATH.\n" +
      "Install locally: npm run test:load:k6:install"
  );
}

const result = spawnSync(bin, k6Args, {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

if (result.error?.code === "ENOENT") {
  console.error(
    "\nk6 is not installed. Run: npm run test:load:k6:install\n" +
      "Or see loadtests/k6/README.md"
  );
  process.exit(127);
}

process.exit(result.status ?? 1);
