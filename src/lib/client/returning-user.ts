/** Client-only hints for returning visitors (localStorage). */

export type LoginMethod = "google" | "email" | "apple" | "magic" | "linkedin";

export type ReturningUserHint = {
  email: string;
  name?: string;
  lastMethod?: LoginMethod;
  lastVisitAt?: string;
  readinessScore?: number;
  studyStreakDays?: number;
};

const STORAGE_KEY = "aee_returning_user";

/** Stable snapshot for useSyncExternalStore — must not return new objects each call. */
let cachedRaw: string | null | undefined;
let cachedHint: ReturningUserHint | null = null;

function parseReturningHint(raw: string | null): ReturningUserHint | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ReturningUserHint;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function syncReturningHintCache(): ReturningUserHint | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedHint;
  cachedRaw = raw;
  cachedHint = parseReturningHint(raw);
  return cachedHint;
}

export function loadReturningUserHint(): ReturningUserHint | null {
  return syncReturningHintCache();
}

/** Client store subscription for returning-user hint (cross-tab + same-tab). */
export function subscribeReturningUserHint(onStoreChange: () => void): () => void {
  const onChange = () => {
    cachedRaw = undefined;
    onStoreChange();
  };
  window.addEventListener("storage", onChange);
  window.addEventListener("aee:returning-hint-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("aee:returning-hint-change", onChange);
  };
}

export function getReturningUserHintSnapshot(): ReturningUserHint | null {
  return syncReturningHintCache();
}

function notifyReturningHintChange(): void {
  if (typeof window === "undefined") return;
  cachedRaw = undefined;
  window.dispatchEvent(new Event("aee:returning-hint-change"));
}

export function saveReturningUserHint(partial: ReturningUserHint): void {
  if (typeof window === "undefined") return;
  const existing = loadReturningUserHint();
  const next: ReturningUserHint = {
    ...(existing ?? {}),
    ...partial,
    email: partial.email.toLowerCase(),
    lastVisitAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notifyReturningHintChange();
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

/** Clear stored returning-user hint (call on sign-out). */
export function clearReturningUserHint(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyReturningHintChange();
  } catch {
    /* ignore storage errors */
  }
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
