/** Parse a Quick Bites caption time (`m:ss`) into seconds. */
export function parseVideoTimestamp(value: string): number | null {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
