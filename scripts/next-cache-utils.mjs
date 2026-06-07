#!/usr/bin/env node
/**
 * Detect and clear corrupted or stale `.next` output before `next dev`.
 */
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const CHUNK_REQUIRE = /require\s*\(\s*["']\.\/(\d+)\.js["']\s*\)/g;

/** @returns {string | null} human-readable reason to wipe cache */
export function getNextCacheClearReason(nextDir) {
  if (!existsSync(nextDir)) return null;

  if (process.env.DEV_CLEAN === "1") {
    return "DEV_CLEAN=1";
  }

  if (existsSync(path.join(nextDir, ".production-build"))) {
    return "production build marker (use next dev, not next start, after npm run build)";
  }

  if (hasBrokenWebpackChunks(nextDir)) {
    return "missing webpack chunk files";
  }

  return null;
}

export function clearNextCacheIfNeeded(root) {
  const nextDir = path.join(root, ".next");
  const reason = getNextCacheClearReason(nextDir);
  if (!reason) return false;

  console.log(`Clearing stale .next cache (${reason})…`);
  rmSync(nextDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
  return true;
}

function hasBrokenWebpackChunks(nextDir) {
  const serverDir = path.join(nextDir, "server");
  if (!existsSync(serverDir)) return false;

  const broken = [];
  walkJsFiles(serverDir, (filePath) => {
    const relDir = path.dirname(filePath);
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(CHUNK_REQUIRE)) {
      const chunkPath = path.join(relDir, `${match[1]}.js`);
      if (!existsSync(chunkPath)) {
        broken.push(chunkPath);
        if (broken.length >= 3) return true;
      }
    }
    return false;
  });

  return broken.length > 0;
}

function walkJsFiles(dir, visitor, depth = 0) {
  if (depth > 8) return false;

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (walkJsFiles(fullPath, visitor, depth + 1)) return true;
      continue;
    }
    if (!entry.name.endsWith(".js")) continue;
    try {
      if (statSync(fullPath).size > 2_000_000) continue;
    } catch {
      continue;
    }
    if (visitor(fullPath)) return true;
  }

  return false;
}
