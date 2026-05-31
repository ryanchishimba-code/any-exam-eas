/** Client-only hints for returning visitors (localStorage). */

export type LoginMethod = "google" | "apple" | "email" | "magic";

export type ReturningUserHint = {
  email: string;
  name?: string;
  lastMethod?: LoginMethod;
  lastVisitAt?: string;
  readinessScore?: number;
  studyStreakDays?: number;
};

const STORAGE_KEY = "aee_returning_user";

export function loadReturningUserHint(): ReturningUserHint | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReturningUserHint;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveReturningUserHint(partial: ReturningUserHint): void {
  if (typeof window === "undefined") return;
  const existing = loadReturningUserHint();
  const next: ReturningUserHint = {
    ...existing,
    ...partial,
    email: partial.email.toLowerCase(),
    lastVisitAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function touchReturningVisit(): void {
  const hint = loadReturningUserHint();
  if (!hint) return;
  saveReturningUserHint(hint);
}

/** Persist email as the user types (returning-user UX). */
export function rememberEmail(
  email: string,
  extra?: Pick<ReturningUserHint, "name" | "lastMethod">
): void {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
  saveReturningUserHint({
    email: trimmed,
    ...extra,
  });
}

export function isReturningUser(): boolean {
  return loadReturningUserHint() !== null;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function firstName(name?: string | null, email?: string): string {
  if (name?.trim()) return name.trim().split(/\s+/)[0] ?? "there";
  if (email) return email.split("@")[0]?.replace(/[._]/g, " ") ?? "there";
  return "there";
}
