import { z } from "zod";
import { getMpjeState } from "./config";
import { isMpjeUsJurisdiction } from "./us-jurisdictions";

/** Optional state code from query/body — empty means federal-only (no default state). */
export function parseOptionalMpjeStateParam(
  state: string | null | undefined,
  mpjeState?: string | null
): string | undefined {
  const raw = (state ?? mpjeState)?.trim();
  if (!raw) return undefined;
  const code = raw.toUpperCase();
  if (isMpjeUsJurisdiction(code)) return code;
  return getMpjeState(raw)?.code;
}

export const mpjeStateQuerySchema = z
  .string()
  .trim()
  .optional()
  .transform((raw) => parseOptionalMpjeStateParam(raw, null));

/** @deprecated Prefer parseOptionalMpjeStateParam — no longer defaults to OK. */
export function parseMpjeStateParam(
  state: string | null | undefined,
  mpjeState?: string | null
): string | undefined {
  return parseOptionalMpjeStateParam(state, mpjeState);
}
