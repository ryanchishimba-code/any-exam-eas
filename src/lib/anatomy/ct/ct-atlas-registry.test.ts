import { describe, expect, it } from "vitest";
import { LOCAL_VH_BASE } from "@/lib/anatomy/cartoon/visible-human-organs";
import { createCtClipPlanes, formatCtSliceLabel, getFigureClipCenter } from "./ct-atlas-fit";
import {
  CT_ATLAS_ORGANS,
  CT_CLIP_PLANES,
  entryMatchesMeshId,
  getAtlasEntryForMeshId,
  getCtAtlasPreloadUrls,
  meshIdsForAtlasEntry,
  resolveCtAtlasUrl,
  resolveCtAtlasUrlCandidates,
  resolveStructureIdForAtlasEntry,
  resolveStructureIdForMeshId,
} from "./ct-atlas-registry";

describe("ct-atlas-registry", () => {
  it("registers Allen brain with head-anchored fit", () => {
    const brain = CT_ATLAS_ORGANS.find((o) => o.id === "brain");
    expect(brain?.fileName).toBe("Allen_M_Brain.glb");
    expect(brain?.fit).toBe("head");
    expect(resolveStructureIdForMeshId("brain")).toBe("brain");
  });

  it("registers full VH male atlas with shared coordinate space", () => {
    expect(CT_ATLAS_ORGANS.length).toBeGreaterThanOrEqual(14);
    expect(CT_ATLAS_ORGANS.map((o) => o.fileName)).toEqual(
      expect.arrayContaining([
        "VH_M_Skin.glb",
        "VH_M_Blood_Vasculature.glb",
        "VH_M_Small_Intestine.glb",
        "VH_M_Urinary_Bladder.glb",
        "VH_M_Prostate.glb",
        "VH_M_Thymus.glb",
      ])
    );
  });

  it("registers VH bone GLBs on the bone layer", () => {
    expect(CT_ATLAS_ORGANS.map((o) => o.fileName)).toEqual(
      expect.arrayContaining(["VH_M_Pelvis.glb", "VH_M_Knee_L.glb", "VH_M_Knee_R.glb"])
    );
    const pelvis = CT_ATLAS_ORGANS.find((o) => o.id === "pelvis");
    expect(pelvis?.layer).toBe("bone");
    const kneeL = CT_ATLAS_ORGANS.find((o) => o.id === "knee-l");
    expect(kneeL?.aliasMeshIds).toContain("patella-l");
  });

  it("defaults to local-first with CDN fallback for atlas GLBs", () => {
    const urls = resolveCtAtlasUrlCandidates("VH_M_Heart.glb");
    expect(urls[0]).toBe(`${LOCAL_VH_BASE}/VH_M_Heart.glb`);
    expect(urls[1]).toMatch(/cdn\.jsdelivr\.net\/gh\/hubmapconsortium\/ccf-releases/);
    expect(resolveCtAtlasUrl("VH_M_Heart.glb")).toBe(urls[0]);
  });

  it("uses CDN only when NEXT_PUBLIC_VOLUME_ORGAN_BASE=cdn", () => {
    const prev = process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE;
    process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE = "cdn";
    try {
      expect(resolveCtAtlasUrlCandidates("VH_M_Liver.glb")).toEqual([
        expect.stringMatching(/cdn\.jsdelivr\.net/),
      ]);
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE;
      else process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE = prev;
    }
  });

  it("prefers local base when NEXT_PUBLIC_VOLUME_ORGAN_BASE=local", () => {
    const prev = process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE;
    process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE = "local";
    try {
      expect(resolveCtAtlasUrl("VH_M_Liver.glb")).toBe(`${LOCAL_VH_BASE}/VH_M_Liver.glb`);
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE;
      else process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE = prev;
    }
  });

  it("matches mesh ids including aliases", () => {
    const vasculature = getAtlasEntryForMeshId("aorta");
    expect(vasculature?.id).toBe("blood-vasculature");
    expect(entryMatchesMeshId(vasculature!, "carotid-artery")).toBe(true);

    const colon = getAtlasEntryForMeshId("appendix");
    expect(colon?.id).toBe("colon");
  });

  it("resolves catalog structure ids by meshId (not structure id misuse)", () => {
    expect(resolveStructureIdForMeshId("heart")).toBe("heart");
    expect(resolveStructureIdForMeshId("carotid-artery")).toBe("carotid-artery");
    const intestine = CT_ATLAS_ORGANS.find((e) => e.id === "small-intestine")!;
    expect(meshIdsForAtlasEntry(intestine)).toContain("stomach");
    expect(resolveStructureIdForAtlasEntry(intestine)).toBe("small-intestine");
  });

  it("exposes MPR clip plane presets and scrollable slice offset", () => {
    expect(CT_CLIP_PLANES.map((p) => p.id)).toEqual(["off", "axial", "coronal", "sagittal"]);
    expect(createCtClipPlanes("off")).toHaveLength(0);
    expect(createCtClipPlanes("axial")).toHaveLength(1);
    expect(Math.abs(createCtClipPlanes("axial", -1)[0].distanceToPoint(getFigureClipCenter()))).toBeGreaterThan(0.5);
    expect(formatCtSliceLabel("axial", 0)).toContain("50%");
  });

  it("places clip center on standing figure midline", () => {
    const center = getFigureClipCenter();
    expect(center.x).toBe(0);
    expect(center.y).toBeGreaterThan(0);
  });

  it("lists primary preload URL per atlas organ", () => {
    const urls = getCtAtlasPreloadUrls();
    expect(urls.length).toBe(CT_ATLAS_ORGANS.length);
    expect(urls.every((u) => u.endsWith(".glb"))).toBe(true);
  });
});
