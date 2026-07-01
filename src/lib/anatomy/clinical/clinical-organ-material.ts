import type { Plane } from "three";
import { Color, DoubleSide, FrontSide, MeshPhysicalMaterial } from "three";
import type { CtAtlasOrganEntry } from "@/lib/anatomy/ct/ct-atlas-registry";
import { CT_ORGAN_HU, CT_WINDOWS, huToDisplayIntensity } from "@/lib/anatomy/ct/ct-windows";
import { TISSUE_PBR, type TissueKind } from "@/lib/anatomy/cartoon/palette";
import type { AnatomyLayer } from "@/lib/anatomy/types";

function layerToTissue(layer: AnatomyLayer): TissueKind {
  if (layer === "vascular") return "vessel";
  if (layer === "skin") return "skin";
  if (layer === "nerve") return "nerve";
  if (layer === "bone") return "bone";
  if (layer === "muscle") return "muscle";
  return "organ";
}

/** Blend organ tint with soft-tissue HU luminance for CT-adjacent realism. */
export function blendClinicalTint(tintHex: string, hu: number, blend = 0.54): Color {
  const window = CT_WINDOWS.soft;
  const lum = huToDisplayIntensity(hu, window);
  const tint = new Color(tintHex);
  const clinical = new Color(lum, lum, lum);
  return tint.lerp(clinical, blend);
}

export function createClinicalOrganMaterial(opts: {
  entry: CtAtlasOrganEntry;
  tintColor: string;
  emphasized: boolean;
  selected: boolean;
  dimmed: boolean;
  clippingPlanes?: Plane[];
}): MeshPhysicalMaterial {
  const hu = CT_ORGAN_HU[opts.entry.id] ?? CT_ORGAN_HU[opts.entry.meshId] ?? 40;
  const color = blendClinicalTint(opts.tintColor, hu);
  if (opts.dimmed) color.multiplyScalar(0.52);

  const tissue = layerToTissue(opts.entry.layer);
  const pbr = TISSUE_PBR[tissue];
  const baseOpacity = opts.entry.opacity ?? (opts.entry.layer === "skin" ? 0.26 : 0.98);
  const opacity = opts.dimmed ? baseOpacity * 0.32 : baseOpacity;

  const emissive = opts.selected ? "#67e8f9" : opts.emphasized ? "#22d3ee" : "#000000";
  const emissiveIntensity = opts.selected ? 0.72 : opts.emphasized ? 0.38 : 0;

  return new MeshPhysicalMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness: pbr.roughness,
    metalness: pbr.metalness,
    clearcoat: pbr.clearcoat,
    clearcoatRoughness: pbr.clearcoatRoughness,
    sheen: pbr.sheen,
    sheenRoughness: pbr.sheenRoughness,
    sheenColor: color,
    envMapIntensity: pbr.envMapIntensity * 1.35,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity > 0.5 && !opts.dimmed,
    side: opts.entry.layer === "skin" ? DoubleSide : FrontSide,
    clippingPlanes: opts.clippingPlanes,
  });
}
