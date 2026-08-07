/**
 * Coerce bank/API option payloads to string[].
 * Never spread a raw JSON string into characters (that freezes NGN/MCQ UIs).
 */
export function coerceOptionList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? "")).filter((s) => s.length > 0);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v ?? "")).filter((s) => s.length > 0);
      }
      if (parsed && typeof parsed === "object") {
        const opts = (parsed as { options?: unknown }).options;
        if (Array.isArray(opts)) {
          return opts.map((v) => String(v ?? "")).filter((s) => s.length > 0);
        }
      }
    } catch {
      /* plain string option — not JSON */
    }
    return [trimmed];
  }
  return [];
}
