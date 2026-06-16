import { ACCOUNT_IP_LIMIT_MESSAGE, IP_REQUIRED_MESSAGE } from "@/lib/account-ip-limit";

/** Map NextAuth client errors to user-friendly copy (avoids cryptic browser/parse messages). */
export function messageForSignInError(error?: string | null): string {
  if (!error) return "Invalid email or password.";
  if (error === "too_many_ips") return ACCOUNT_IP_LIMIT_MESSAGE;
  if (error === "ip_required") return IP_REQUIRED_MESSAGE;
  if (error === "oauth_only") {
    return "This email uses Google or Apple sign-in. Use those buttons above, or reset your password if you previously set one.";
  }
  if (error === "password_reset_required") {
    return "Your password needs to be reset before you can sign in. Use Forgot Password below.";
  }
  if (error === "Configuration") {
    return "Sign-in is unavailable because the server is missing auth or database configuration.";
  }
  if (error === "CredentialsSignin") {
    return "Invalid email or password.";
  }
  if (error === "OAuthAccountNotLinked") {
    return "This email is registered with a password. Sign in with email and password, or link Google/Apple from account settings when available.";
  }
  return "Could not sign in. Please try again.";
}

export async function fetchAuthHealthWarning(): Promise<string | null> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    const data = (await res.json()) as { ok?: boolean };

    if (!data.ok) {
      return "This deployment is not fully configured yet. Redeploy after setting required environment variables in Vercel.";
    }
    return null;
  } catch {
    return null;
  }
}

export function messageFromUnknownAuthError(err: unknown): string {
  const text = err instanceof Error ? err.message : String(err);
  if (/did not match the expected pattern/i.test(text)) {
    return "Sign-in failed because the auth service returned an unexpected response (usually missing NEXTAUTH_SECRET or DATABASE_URL on Vercel).";
  }
  if (/fetch|network|failed to load/i.test(text)) {
    return "Could not reach the sign-in service. Check your connection and try again.";
  }
  return text || "Could not sign in.";
}
