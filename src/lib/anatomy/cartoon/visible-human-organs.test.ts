import { describe, expect, it } from "vitest";
import {
  getVisibleHumanPreloadUrls,
  hasVisibleHumanOrgan,
  LOCAL_VH_BASE,
  resolveVolumeOrganCompanionUrlCandidates,
  resolveVolumeOrganUrlCandidates,
  VISIBLE_HUMAN_ORGANS,
} from "@/lib/anatomy/cartoon/visible-human-organs";
import { hasVolumeOrganAsset } from "@/lib/anatomy/cartoon/volume-organ-registry";

describe("visible-human-organs", () => {
  it("registers thoracic rib-cage organs from Visible Human male", () => {
    expect(Object.keys(VISIBLE_HUMAN_ORGANS)).toEqual(
      expect.arrayContaining(["heart", "lungs", "liver", "spleen", "pancreas"])
    );
    expect(VISIBLE_HUMAN_ORGANS.heart.fileName).toBe("VH_M_Heart.glb");
  });

  it("defaults to jsDelivr CDN for fresh-clone stability", () => {
    const urls = resolveVolumeOrganUrlCandidates("heart");
    expect(urls[0]).toMatch(/cdn\.jsdelivr\.net\/gh\/hubmapconsortium\/ccf-releases/);
    expect(urls[0]).toContain("VH_M_Heart.glb");
  });

  it("prefers local with CDN fallback when NEXT_PUBLIC_VOLUME_ORGAN_BASE=local", () => {
    const prev = process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE;
    process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE = "local";
    try {
      const urls = resolveVolumeOrganUrlCandidates("heart");
      expect(urls[0]).toBe(`${LOCAL_VH_BASE}/VH_M_Heart.glb`);
      expect(urls[1]).toMatch(/cdn\.jsdelivr\.net/);
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE;
      else process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE = prev;
    }
  });

  it("resolves paired kidney companion candidates", () => {
    expect(resolveVolumeOrganCompanionUrlCandidates("kidneys")[0]).toContain("VH_M_Kidney_R.glb");
    expect(resolveVolumeOrganCompanionUrlCandidates("heart")).toEqual([]);
  });

  it("exposes preload list for scene warm-up", () => {
    const urls = getVisibleHumanPreloadUrls();
    expect(urls.length).toBeGreaterThanOrEqual(8);
    expect(urls.every((u) => u.endsWith(".glb"))).toBe(true);
  });

  it("volume registry delegates to visible human catalog", () => {
    expect(hasVisibleHumanOrgan("heart")).toBe(true);
    expect(hasVolumeOrganAsset("heart")).toBe(true);
    expect(hasVolumeOrganAsset("trachea")).toBe(false);
  });
});
