/** Capitalize a single name segment (handles hyphens and apostrophes). */
export function capitalizeWord(word: string): string {
  if (!word) return word;
  return word
    .split(/(['-])/)
    .map((part) => {
      if (part === "'" || part === "-") return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

/** Title-case a full display name — e.g. "ryan chishimba" → "Ryan Chishimba". */
export function formatDisplayName(name?: string | null): string | null {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/).map(capitalizeWord).join(" ");
}

/** First name for greetings — capitalized, with email-local fallback. */
export function displayFirstName(name?: string | null, email?: string): string {
  const formatted = formatDisplayName(name);
  if (formatted) return formatted.split(/\s+/)[0] ?? "there";

  if (email) {
    const local = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
    const first = local?.split(/\s+/)[0];
    return first ? capitalizeWord(first) : "there";
  }

  return "there";
}

/** Normalize name for persistence (signup, OAuth, profile updates). */
export function normalizeStoredName(name?: string | null): string | null {
  return formatDisplayName(name);
}
