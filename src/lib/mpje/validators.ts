import { z } from "zod";
import { resolveMpjeStateCode } from "./config";
import { isMpjeUsJurisdiction, MPJE_DEFAULT_STATE_CODE } from "./us-jurisdictions";

export const mpjeStateQuerySchema = z
  .string()
  .trim()
  .toUpperCase()
  .max(2)
  .optional()
  .transform((code) => {
    if (!code) return MPJE_DEFAULT_STATE_CODE;
    return isMpjeUsJurisdiction(code) ? code : resolveMpjeStateCode(code);
  });

export function parseMpjeStateParam(
  state: string | null | undefined,
  mpjeState?: string | null
): string {
  const raw = state ?? mpjeState;
  return mpjeStateQuerySchema.parse(raw ?? MPJE_DEFAULT_STATE_CODE);
}
