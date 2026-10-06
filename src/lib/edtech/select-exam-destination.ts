export type SelectExamDestination = "login" | "unverified" | "chooser" | "reactivate";

/**
 * Bare /select-exam shows the chooser. Switch mode does too.
 * A signed-in user with no app access still goes to reactivate.
 */
export function selectExamDestination(input: {
  signedIn: boolean;
  emailUnverified: boolean;
  hasPreference: boolean;
  switchMode: boolean;
  hasAppAccess: boolean;
}): SelectExamDestination {
  if (!input.signedIn) return "login";
  if (input.emailUnverified) return "unverified";
  if (input.hasPreference && !input.switchMode && !input.hasAppAccess) return "reactivate";
  return "chooser";
}
