#!/usr/bin/env node
/**
 * Start local dev with the repo-bundled Node (no global npm required).
 * Usage: ./start-local.sh  OR  node scripts/local-dev.mjs
 */
import { spawn, spawnSync, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clearNextCacheIfNeeded, forceClearNextCache } from "./next-cache-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeDir = path.join(root, ".tools", "node-v22.14.0-darwin-arm64", "bin");
const npm = path.join(nodeDir, "npm");
const node = path.join(nodeDir, "node");
const npx = path.join(nodeDir, "npx");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const ensureDevCache = path.join(root, "scripts", "ensure-dev-cache.mjs");
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "127.0.0.1";

if (!existsSync(node)) {
  console.error(
    "Bundled Node not found at .tools/node-v22.14.0-darwin-arm64\n" +
      "Install Node 20+ (brew install node) or run: npm install && npm run dev"
  );
  process.exit(1);
}

if (!existsSync(nextBin)) {
  console.error("node_modules missing. Run: npm install");
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
  let pids = [];
  try {
    const out = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8" }).trim();
    pids = out ? out.split("\n").filter(Boolean) : [];
  } catch {
    return;
  }

  for (const pid of pids) {
    console.log(`Stopping stale process ${pid} on port ${port}…`);
    try {
      process.kill(Number(pid), "SIGTERM");
    } catch {
      /* already gone */
    }
  }

  if (pids.length === 0) return;

  try {
    execSync("sleep 0.8");
  } catch {
    /* ignore */
  }

  try {
    const out = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8" }).trim();
    for (const pid of out.split("\n").filter(Boolean)) {
      console.log(`Force-stopping process ${pid} on port ${port}…`);
      try {
        process.kill(Number(pid), "SIGKILL");
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* port is free */
  }
}

function cleanNextCache() {
  if (process.env.SKIP_NEXT_CLEAN === "1") {
    return;
  }

  if (clearNextCacheIfNeeded(root)) return;
  forceClearNextCache(root);
}

console.log("Any Exam Easy — local dev\n");
console.log(`  URL:      http://${HOST}:${PORT}`);
console.log("  Login:    http://localhost:3000/login");
console.log("  Dev user: dev@anyexameasy.test / DevPassword1!");
console.log("  Tip:      SEED=1 ./start-local.sh to refresh dev admin account");
console.log("  Tip:      SKIP_NEXT_CLEAN=1 ./start-local.sh to keep .next between restarts");
console.log("");

freePort(PORT);
await sleep(600);
cleanNextCache();
await sleep(200);

console.log("Generating Prisma client…");
spawnSync(node, [ensureDevCache], { cwd: root, env, stdio: "inherit" });
const gen = spawnSync(npx, ["prisma", "generate"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

if (gen.status !== 0) {
  console.error("\nPrisma generate failed — fix prisma/schema.prisma and retry.");
  process.exit(gen.status ?? 1);
}

if (process.env.SEED === "1") {
  console.log("\nEnsuring dev admin account…");
  const seed = spawnSync(npm, ["run", "db:seed-admin"], {
    cwd: root,
    env,
    stdio: "inherit",
    shell: false,
    timeout: 30_000,
  });
  if (seed.status !== 0) {
    console.warn("Seed skipped or failed — check DATABASE_URL in .env");
  }
}

console.log(`\nStarting Next.js on http://${HOST}:${PORT}…\n`);

const child = spawn(node, [nextBin, "dev", "--hostname", HOST, "--port", String(PORT)], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
