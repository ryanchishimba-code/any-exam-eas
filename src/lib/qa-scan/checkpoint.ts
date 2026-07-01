import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { QaScanCheckpoint, QaScanItemResult } from "./types";

export function checkpointFilePath(outDir: string, exam: string): string {
  return path.join(outDir, `qa-scan-checkpoint-${exam}.json`);
}

export function loadCheckpoint(filePath: string): QaScanCheckpoint | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as QaScanCheckpoint;
  } catch {
    return null;
  }
}

export function saveCheckpoint(filePath: string, checkpoint: QaScanCheckpoint): void {
  writeFileSync(filePath, JSON.stringify(checkpoint, null, 2), "utf8");
}

export function mergeCheckpointResults(
  existing: QaScanItemResult[],
  incoming: QaScanItemResult[]
): QaScanItemResult[] {
  const byId = new Map(existing.map((r) => [r.id, r]));
  for (const row of incoming) byId.set(row.id, row);
  return [...byId.values()];
}

export function processedIdSet(checkpoint: QaScanCheckpoint | null): Set<string> {
  return new Set(checkpoint?.processedIds ?? []);
}
