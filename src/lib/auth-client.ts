/** Map NextAuth client errors to user-friendly copy (avoids cryptic browser/parse messages). */
export function messageForSignInError(error?: string | null): string {
  if (!error) return "Invalid email or password.";
  if (error === "Configuration") {
    return "Sign-in is unavailable because the server is missing auth or database configuration.";
  }
  if (error === "CredentialsSignin") {
    return "Invalid email or password.";
  }
  return "Could not sign in. Please try again.";
}

export async function fetchAuthHealthWarning(): Promise<string | null> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    const data = (await res.json()) as {
      ok?: boolean;
      checks?: { nextauthSecret?: string; databaseUrl?: string };
    };
    if (data.ok) return null;

    const missing: string[] = [];
    if (data.checks?.nextauthSecret === "missing") missing.push("NEXTAUTH_SECRET");
    if (data.checks?.databaseUrl === "missing") missing.push("DATABASE_URL");
    if (missing.length > 0) {
      return `This deployment is missing required settings: ${missing.join(", ")}. Run \`npm run vercel:setup\` for copy-paste values, add them in Vercel → Environment Variables (Production + Build), then redeploy.`;
    }
    return "This deployment is not fully configured yet. Check /api/health or redeploy after setting environment variables.";
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
