/**
 * NCLEX All-questions mix of published NGN cases and standalones.
 *
 * Off unless NCLEX_ALL_NGN_MIX or NEXT_PUBLIC_NCLEX_ALL_NGN_MIX is "true" or "1".
 * The questions API reads this on the server. When it is off, format=all is unchanged.
 */
export const NCLEX_ALL_NGN_MIX_ENV = "NCLEX_ALL_NGN_MIX";

export function isNclexAllNgnMixEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  const raw = (env.NEXT_PUBLIC_NCLEX_ALL_NGN_MIX ?? env.NCLEX_ALL_NGN_MIX ?? "")
    .trim()
    .toLowerCase();
  return raw === "true" || raw === "1";
}
