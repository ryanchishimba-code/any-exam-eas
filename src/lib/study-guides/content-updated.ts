import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const CHICAGO = "America/Chicago";

/** Calendar day in America/Chicago, as YYYY-MM-DD. */
export function chicagoCalendarDate(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CHICAGO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Never return a Chicago day later than today. */
export function clampChicagoDate(iso: string, now = new Date()): string {
  const today = chicagoCalendarDate(now);
  return iso > today ? today : iso;
}

export function formatChicagoDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!, 18)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: CHICAGO,
  });
}

function newestFileMtime(relativeDirs: string[]): Date | null {
  let newest = 0;
  for (const relative of relativeDirs) {
    const dir = path.join(process.cwd(), relative);
    let names: string[] = [];
    try {
      const stat = statSync(dir);
      if (stat.isFile()) {
        newest = Math.max(newest, stat.mtimeMs);
        continue;
      }
      names = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!name.endsWith(".md") && !name.endsWith(".ts")) continue;
      try {
        newest = Math.max(newest, statSync(path.join(dir, name)).mtimeMs);
      } catch {
        /* skip a file that disappears mid-read */
      }
    }
  }
  return newest > 0 ? new Date(newest) : null;
}

function newestGitCommit(relativeDirs: string[]): Date | null {
  const result = spawnSync("git", ["log", "-1", "--format=%cI", "--", ...relativeDirs], {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 4000,
  });
  const raw = result.status === 0 ? result.stdout.trim() : "";
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Last time the manuscript files changed, as a Chicago calendar day.
 * Git commit time wins over checkout mtime. A day after today is clamped.
 */
export function contentUpdatedOn(relativeDirs: string[], now = new Date()): { iso: string; label: string } {
  const revised = newestGitCommit(relativeDirs) ?? newestFileMtime(relativeDirs) ?? now;
  const iso = clampChicagoDate(chicagoCalendarDate(revised), now);
  return { iso, label: formatChicagoDate(iso) };
}
