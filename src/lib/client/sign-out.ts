import { signOut } from "next-auth/react";
import { clearReturningUserHint } from "./returning-user";

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

  try {
    if (redirect) {
      await signOut({ callbackUrl, redirect: true });
    } else {
      await signOut({ redirect: false });
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign out failed";
    return { ok: false, error: message };
  }
}
