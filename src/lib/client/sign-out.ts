import { signOut } from "next-auth/react";
import { clearReturningUserHint } from "./returning-user";
import { clearExamTransientClientState } from "./exam-switch-reset";

/** Clears client-side access cache after sign-out. */
export function clearUserAccessCache(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aee:clear-access-cache"));
  }
}

export type SignOutOptions = {
  callbackUrl?: string;
  redirect?: boolean;
};

/**
 * Sign out and clear client-side session hints (returning-user localStorage, etc.).
 */
export async function signOutAndCleanup(
  options: SignOutOptions = {}
): Promise<{ ok: boolean; error?: string }> {
  const { callbackUrl = "/", redirect = true } = options;

  clearReturningUserHint();
  clearUserAccessCache();
  clearExamTransientClientState();

  try {
    await signOut({ redirect: false });

    if (redirect && typeof window !== "undefined") {
      // Always land on the current origin — production deploys must not send users to
      // localhost when NEXTAUTH_URL was mis-set during a Vercel env push.
      const target = callbackUrl.startsWith("/")
        ? callbackUrl
        : callbackUrl.startsWith(window.location.origin)
          ? callbackUrl.slice(window.location.origin.length) || "/"
          : "/";
      window.location.assign(target);
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign out failed";
    return { ok: false, error: message };
  }
}
