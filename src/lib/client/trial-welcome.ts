import { TRIAL_DAYS } from "@/lib/billing-config";

/** Client-side flag set after login for active trial subscribers. */
export const TRIAL_WELCOME_STORAGE_KEY = "aee_trial_welcome";

export type TrialWelcomePayload = {
  daysRemaining: number;
  shownAt: number;
};

export function markTrialWelcomePending(daysRemaining: number): void {
  if (typeof window === "undefined") return;
  const payload: TrialWelcomePayload = {
    daysRemaining,
    shownAt: Date.now(),
  };
  sessionStorage.setItem(TRIAL_WELCOME_STORAGE_KEY, JSON.stringify(payload));
}

export function peekTrialWelcomePending(): TrialWelcomePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TRIAL_WELCOME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TrialWelcomePayload;
    if (typeof parsed.daysRemaining !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearTrialWelcomePending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TRIAL_WELCOME_STORAGE_KEY);
}

/** @deprecated Prefer peek + clear for instant welcome UI */
export function consumeTrialWelcomePending(): TrialWelcomePayload | null {
  const pending = peekTrialWelcomePending();
  if (pending) clearTrialWelcomePending();
  return pending;
}

function hasTrialWelcomeParam(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("welcome") === "trial";
}

/** Instant signal for post-login welcome — no API wait. */
export function shouldShowTrialWelcome(): boolean {
  return hasTrialWelcomeParam() || peekTrialWelcomePending() !== null;
}

export function initialTrialDaysRemaining(): number {
  return peekTrialWelcomePending()?.daysRemaining ?? TRIAL_DAYS;
}
