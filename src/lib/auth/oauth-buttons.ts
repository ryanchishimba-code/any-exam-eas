type PublicAuthEnv = {
  NEXT_PUBLIC_GOOGLE_AUTH_ENABLED?: string;
  NEXT_PUBLIC_APPLE_AUTH_ENABLED?: string;
};

/**
 * Public flags only. The server still refuses to register a provider when its
 * client id or secret is empty. Leave both flags unset until those exist.
 * "true" is the only on value.
 *
 * Client bundles only inline `process.env.NEXT_PUBLIC_*` when that member is
 * read directly, so the default path must not go through a copied env object.
 */
export function isGoogleAuthButtonEnabled(env?: PublicAuthEnv): boolean {
  const value = env
    ? env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED
    : process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED;
  return value === "true";
}

export function isAppleAuthButtonEnabled(env?: PublicAuthEnv): boolean {
  const value = env
    ? env.NEXT_PUBLIC_APPLE_AUTH_ENABLED
    : process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED;
  return value === "true";
}
