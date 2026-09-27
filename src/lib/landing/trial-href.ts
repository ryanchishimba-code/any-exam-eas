export const LANDING_TRIAL_HREF = "/signup?plan=trial&interval=monthly&tier=pro";

export function landingTrialHrefForExam(examSlug?: string): string {
  if (!examSlug) return LANDING_TRIAL_HREF;
  return `${LANDING_TRIAL_HREF}&exam=${encodeURIComponent(examSlug)}`;
}
