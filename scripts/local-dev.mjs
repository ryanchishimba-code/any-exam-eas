#!/usr/bin/env node
/**
 * Start local dev with the repo-bundled Node (no global npm required).
 * Usage: node scripts/local-dev.mjs
 */
import { spawn, spawnSync, execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeDir = path.join(root, ".tools", "node-v22.14.0-darwin-arm64", "bin");
const npm = path.join(nodeDir, "npm");
const node = path.join(nodeDir, "node");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "127.0.0.1";

if (!existsSync(node)) {
  console.error(
    "Bundled Node not found at .tools/node-v22.14.0-darwin-arm64\n" +
      "Install Node 20+ (brew install node) or run: npm install && npm run dev"
  );
  process.exit(1);
}

const env = {
  ...process.env,
  PATH: `${nodeDir}:${process.env.PATH ?? ""}`,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? `http://${HOST}:${PORT}`,
  AUTH_URL: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? `http://${HOST}:${PORT}`,
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function freePort(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8" }).trim();
    if (!out) return;
    const pids = out.split("\n").filter(Boolean);
    for (const pid of pids) {
      console.log(`Stopping stale process ${pid} on port ${port}…`);
      try {
        process.kill(Number(pid), "SIGTERM");
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* port is free */
  }
}

function cleanNextCache() {
  const nextDir = path.join(root, ".next");
  if (!existsSync(nextDir)) return;
  console.log("Clearing stale .next cache (fixes auth/zod module errors after build)…");
  rmSync(nextDir, { recursive: true, force: true });
}

console.log("Any Exam Easy — local dev\n");
console.log(`  URL:      http://${HOST}:${PORT}`);
console.log("  Login:    http://localhost:3000/login");
console.log("  Admin:    http://localhost:3000/admin/login");
console.log("  Dev user: dev@anyexameasy.test / DevPassword1!");
console.log("");

cleanNextCache();
freePort(PORT);
await sleep(400);

console.log("Ensuring dev admin account…");
const seed = spawnSync(npm, ["run", "db:seed-admin"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

if (seed.status !== 0) {
  console.warn("Seed skipped or failed — check DATABASE_URL in .env");
}

console.log("\nGenerating Prisma client…");
const gen = spawnSync(npm, ["run", "predev"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

if (gen.status !== 0) {
  console.error("Prisma generate failed.");
  process.exit(gen.status ?? 1);
}

console.log(`\nStarting Next.js on http://${HOST}:${PORT}…\n`);

const child = spawn(node, [nextBin, "dev", "--hostname", HOST, "--port", String(PORT)], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
