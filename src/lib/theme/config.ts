export type ThemeMode = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "aee-theme";

/**
 * The site stays light. System night mode and the stored preference do not
 * swap tokens; that partial dark theme made text disappear.
 */
export function resolveTheme(
  _mode: ThemeMode,
  _systemDark: boolean
): ResolvedTheme {
  return "light";
}

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function readStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(raw) ? raw : "system";
  } catch {
    return "system";
  }
}

export function applyThemeToDocument(_theme: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = "light";
  root.style.colorScheme = "light";
}
