import { ROUTES } from "@/lib/routes";

/** Canonical login path (avoids `/login` → `/auth/login` redirect hop). */
export const AUTH_LOGIN_PATH = "/auth/login";

export function loginWithVerifyQuery(state: "invalid" | "missing"): string {
  return `${AUTH_LOGIN_PATH}?verify=${state}`;
}

export function dashboardVerifiedUrl(): string {
  return `${ROUTES.dashboard}?verified=1`;
}
