#!/usr/bin/env node
/**
 * Resolve Node/npm/npx for local dev — bundled .tools Node when present, else system PATH.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const BUNDLED_CANDIDATES = [
  "node-v22.14.0-darwin-arm64",
  "node-v22.14.0-darwin-x64",
  "node-v22.14.0-linux-x64",
];

export function resolveDevRuntime() {
  for (const dir of BUNDLED_CANDIDATES) {
    const binDir = path.join(root, ".tools", dir, "bin");
    const node = path.join(binDir, "node");
    const npm = path.join(binDir, "npm");
    const npx = path.join(binDir, "npx");
    if (existsSync(node) && existsSync(npm)) {
      return { root, node, npm, npx, binDir, source: "bundled" };
    }
  }

  return {
    root,
    node: "node",
    npm: "npm",
    npx: "npx",
    binDir: null,
    source: "system",
  };
}

export const DEV_DEFAULT_HOST = "localhost";
export const DEV_DEFAULT_PORT = 3000;

export function devServerUrl(host = DEV_DEFAULT_HOST, port = DEV_DEFAULT_PORT) {
  return `http://${host}:${port}`;
}
