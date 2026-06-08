/** Prevent duplicate POST /api/full-exam/start under React Strict Mode remounts. */
const locks = new Set<string>();

export function acquireAutostartLock(key: string): boolean {
  if (locks.has(key)) return false;
  locks.add(key);
  return true;
}

export function releaseAutostartLock(key: string): void {
  locks.delete(key);
}
