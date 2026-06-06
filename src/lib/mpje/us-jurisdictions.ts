import { MPJE_STATES, type MpjeState } from "./config";

/** 50 US states + District of Columbia (excludes territories). */
export const MPJE_US_JURISDICTIONS: MpjeState[] = MPJE_STATES.filter(
  (s) => !s.isTerritory
);

export const MPJE_DEFAULT_STATE_CODE = "OK";

export function isMpjeUsJurisdiction(code: string): boolean {
  return MPJE_US_JURISDICTIONS.some(
    (s) => s.code.toUpperCase() === code.trim().toUpperCase()
  );
}
