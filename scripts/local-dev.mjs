#!/usr/bin/env node
/**
 * Start local dev with cache repair, port cleanup, and stable auth URLs.
 * Usage: npm run dev  OR  ./start-local.sh
 */
import { spawn, spawnSync, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEV_DEFAULT_HOST,
  DEV_DEFAULT_PORT,
  devServerUrl,
  resolveDevRuntime,
} from "./dev-runtime.mjs";
import { clearNextCacheIfNeeded, forceClearNextCache } from "./next-cache-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtime = resolveDevRuntime();
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const ensureDevCache = path.join(root, "scripts", "ensure-dev-cache.mjs");
const PORT = Number(process.env.PORT ?? DEV_DEFAULT_PORT);
const HOST = process.env.HOST ?? DEV_DEFAULT_HOST;
const baseUrl = devServerUrl(HOST, PORT);

if (!existsSync(nextBin)) {
  console.error("node_modules missing. Run: npm install");
  process.exit(1);
}

if (runtime.source === "system") {
  console.log("Using system Node (bundled .tools Node not found).\n");
}

const env = {
  ...process.env,
  PATH: runtime.binDir ? `${runtime.binDir}:${process.env.PATH ?? ""}` : process.env.PATH,
  HOST,
  PORT: String(PORT),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? baseUrl,
  AUTH_URL: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? baseUrl,
  WATCHPACK_POLLING: process.env.WATCHPACK_POLLING ?? "true",
  CHOKIDAR_USEPOLLING: process.env.CHOKIDAR_USEPOLLING ?? "true",
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
  if (clearNextCacheIfNeeded(root)) return;
  if (process.env.SKIP_NEXT_CLEAN === "1") return;
  forceClearNextCache(root);
}

console.log("Any Exam Easy — local dev\n");
console.log(`  URL:      ${baseUrl}`);
console.log(`  Login:    ${baseUrl}/login`);
console.log("  Dev user: dev@anyexameasy.test / DevPassword1!");
console.log("  Tip:      SEED=1 npm run dev to refresh dev admin account");
console.log("  Tip:      SKIP_NEXT_CLEAN=1 npm run dev to keep .next between restarts");
console.log("  Tip:      npm run dev:fresh after npm run build if you see chunk errors");
console.log("");

freePort(PORT);
await sleep(600);
cleanNextCache();
await sleep(200);

console.log("Checking dev cache…");
spawnSync(runtime.node, [ensureDevCache], { cwd: root, env, stdio: "inherit" });

console.log("Generating Prisma client…");
const gen = spawnSync(runtime.npx, ["prisma", "generate"], {
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
  const seed = spawnSync(runtime.npm, ["run", "db:seed-admin"], {
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

console.log(`\nStarting Next.js on ${baseUrl}…\n`);

const child = spawn(runtime.node, [nextBin, "dev", "--hostname", HOST, "--port", String(PORT)], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
