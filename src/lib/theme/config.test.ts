import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { isThemeMode, resolveTheme } from "@/lib/theme/config";

describe("theme config", () => {
  it("stays light in every mode, including system night mode", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("light");
    expect(resolveTheme("dark", true)).toBe("light");
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("pins the document to a light color scheme", () => {
    const css = fs.readFileSync("src/app/globals.css", "utf8");
    const script = fs.readFileSync("src/components/theme/ThemeScript.tsx", "utf8");
    const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
    expect(css).not.toContain("color-scheme: light dark");
    expect(css).toContain("color-scheme: light");
    expect(script).toContain('dataset.theme = "light"');
    expect(script).not.toContain("prefers-color-scheme");
    expect(layout).toContain('name="color-scheme" content="light"');
  });

  it("validates stored theme modes", () => {
    expect(isThemeMode("system")).toBe(true);
    expect(isThemeMode("auto")).toBe(false);
  });
});
