import { describe, expect, it } from "vitest";
import {
  CT_ORGAN_HU,
  CT_WINDOWS,
  CT_WINDOW_ORDER,
  blendHuTintHex,
  huToHex,
  huToIntensity,
  isCtAtlasEnabled,
} from "./ct-windows";

describe("ct-windows", () => {
  it("defines four teaching window presets in display order", () => {
    expect(CT_WINDOW_ORDER).toEqual(["soft", "bone", "lung", "contrast"]);
    expect(CT_WINDOWS.soft.label).toBe("Soft tissue");
    expect(CT_WINDOWS.lung.level).toBeLessThan(0);
  });

  it("maps HU through window width and level", () => {
    const soft = CT_WINDOWS.soft;
    expect(huToIntensity(soft.level, soft)).toBeCloseTo(0.5, 2);
    expect(huToIntensity(soft.level - soft.width / 2, soft)).toBe(0);
    expect(huToIntensity(soft.level + soft.width / 2, soft)).toBe(1);
  });

  it("renders greyscale hex from windowed intensity", () => {
    expect(huToHex(40, CT_WINDOWS.soft)).toMatch(/^#[0-9a-f]{6}$/i);
    expect(huToHex(-600, CT_WINDOWS.lung)).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("blends organ tint into windowed greyscale", () => {
    const grey = huToHex(40, CT_WINDOWS.soft);
    const tinted = blendHuTintHex(40, "#E63946", CT_WINDOWS.soft, 0.5);
    expect(tinted).not.toBe(grey);
    expect(tinted).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("assigns organ HU keys for atlas entries", () => {
    expect(CT_ORGAN_HU.lungs).toBeLessThan(0);
    expect(CT_ORGAN_HU["blood-vasculature"]).toBeGreaterThan(50);
  });

  it("respects NEXT_PUBLIC_ANATOMY_CT_MODE opt-out", () => {
    const prev = process.env.NEXT_PUBLIC_ANATOMY_CT_MODE;
    delete process.env.NEXT_PUBLIC_ANATOMY_CT_MODE;
    expect(isCtAtlasEnabled()).toBe(true);
    process.env.NEXT_PUBLIC_ANATOMY_CT_MODE = "0";
    expect(isCtAtlasEnabled()).toBe(false);
    if (prev === undefined) delete process.env.NEXT_PUBLIC_ANATOMY_CT_MODE;
    else process.env.NEXT_PUBLIC_ANATOMY_CT_MODE = prev;
  });
});
