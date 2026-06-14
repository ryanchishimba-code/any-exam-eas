#!/usr/bin/env node
/**
 * Download k6 into .tools/k6-bin (macOS arm64). Re-run after k6 version bumps.
 */
import { spawnSync } from "node:child_process";
import { chmodSync, createWriteStream, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const K6_VERSION = "v0.57.0";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolsDir = path.join(root, ".tools");
const outBin = path.join(toolsDir, "k6-bin");

const platform = process.platform;
const arch = process.arch;

const assetMap = {
  "darwin:arm64": `k6-${K6_VERSION}-macos-arm64.zip`,
  "darwin:x64": `k6-${K6_VERSION}-macos-amd64.zip`,
  "linux:x64": `k6-${K6_VERSION}-linux-amd64.tar.gz`,
  "linux:arm64": `k6-${K6_VERSION}-linux-arm64.tar.gz`,
};

const asset = assetMap[`${platform}:${arch}`];
if (!asset) {
  console.error(`Unsupported platform for auto-install: ${platform} ${arch}`);
  console.error("Install k6 manually: https://grafana.com/docs/k6/latest/set-up/install-k6/");
  process.exit(1);
}

const isZip = asset.endsWith(".zip");
const url = `https://github.com/grafana/k6/releases/download/${K6_VERSION}/${asset}`;

mkdirSync(toolsDir, { recursive: true });
const archivePath = path.join(toolsDir, asset);

console.log(`Downloading ${url}…`);

const res = await fetch(url);
if (!res.ok) {
  console.error(`Download failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

await pipeline(res.body, createWriteStream(archivePath));

if (isZip) {
  const unzip = spawnSync("unzip", ["-o", archivePath, "-d", toolsDir], { stdio: "inherit" });
  if (unzip.status !== 0) process.exit(unzip.status ?? 1);
  const folder = asset.replace(".zip", "");
  const extracted = path.join(toolsDir, folder, "k6");
  rmSync(outBin, { force: true });
  renameSync(extracted, outBin);
  rmSync(path.join(toolsDir, folder), { recursive: true, force: true });
} else {
  const extract = spawnSync("tar", ["-xzf", archivePath, "-C", toolsDir], { stdio: "inherit" });
  if (extract.status !== 0) process.exit(extract.status ?? 1);
  const folder = asset.replace(".tar.gz", "");
  const extracted = path.join(toolsDir, folder, "k6");
  rmSync(outBin, { force: true });
  renameSync(extracted, outBin);
  rmSync(path.join(toolsDir, folder), { recursive: true, force: true });
}

rmSync(archivePath, { force: true });
chmodSync(outBin, 0o755);

const ver = spawnSync(outBin, ["version"], { encoding: "utf8" });
console.log(ver.stdout?.trim() ?? "k6 installed");
console.log(`Binary: ${outBin}`);
