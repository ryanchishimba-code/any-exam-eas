import { describe, expect, it } from "vitest";
import { isThemeMode, resolveTheme } from "@/lib/theme/config";

describe("theme config", () => {
  it("resolves explicit modes", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows system preference in system mode", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("validates stored theme modes", () => {
    expect(isThemeMode("system")).toBe(true);
    expect(isThemeMode("auto")).toBe(false);
  });
});
