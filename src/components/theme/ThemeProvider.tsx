"use client";

import {
 createContext,
 useCallback,
 useContext,
 useEffect,
 useMemo,
 useState,
} from "react";
import {
 applyThemeToDocument,
 readStoredThemeMode,
 resolveTheme,
 THEME_STORAGE_KEY,
 type ResolvedTheme,
 type ThemeMode,
} from "@/lib/theme/config";

type ThemeContextValue = {
 mode: ThemeMode;
 resolved: ResolvedTheme;
 setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
 const [mode, setModeState] = useState<ThemeMode>("system");
 const [systemDark, setSystemDark] = useState(false);

 useEffect(() => {
 setModeState(readStoredThemeMode());
 const mq = window.matchMedia("(prefers-color-scheme: dark)");
 setSystemDark(mq.matches);
 const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
 mq.addEventListener("change", onChange);
 return () => mq.removeEventListener("change", onChange);
 }, []);

 const resolved = resolveTheme(mode, systemDark);

 useEffect(() => {
 applyThemeToDocument(resolved);
 }, [resolved]);

 const setMode = useCallback((next: ThemeMode) => {
 setModeState(next);
 try {
 localStorage.setItem(THEME_STORAGE_KEY, next);
 } catch {
 /* ignore */
 }
 }, []);

 const value = useMemo(
 () => ({ mode, resolved, setMode }),
 [mode, resolved, setMode]
 );

 return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
 const ctx = useContext(ThemeContext);
 if (!ctx) {
 throw new Error("useTheme must be used within ThemeProvider");
 }
 return ctx;
}
