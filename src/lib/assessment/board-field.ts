/**
 * Board profile → practice field. Plumbing stays generic: a profile is served
 * on the field it is registered to. NCLEX-RN is the only registered profile.
 */
const FIELD_BY_PROFILE: Record<string, string> = {
  "nclex-rn-2026": "nursing",
};

export function fieldIdForBoardProfile(boardProfile: string): string | null {
  const fieldId = FIELD_BY_PROFILE[boardProfile.trim()];
  return fieldId ?? null;
}

export function boardProfilesForField(fieldId: string): string[] {
  const id = fieldId.trim();
  return Object.entries(FIELD_BY_PROFILE)
    .filter(([, field]) => field === id)
    .map(([profile]) => profile);
}
