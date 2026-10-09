/** Catalog attempt keys. Safe to import from the practice player (no Node crypto). */

export function ngnQuestionKey(id: string, version: number): string {
  return `ngn:${id}:v${version}`;
}

export function parseNgnQuestionKey(key: string): { id: string; version: number } | null {
  const match = /^ngn:([^:]+):v(\d+)$/.exec(key.trim());
  if (!match) return null;
  const version = Number(match[2]);
  if (!Number.isInteger(version) || version < 1) return null;
  return { id: match[1]!, version };
}
