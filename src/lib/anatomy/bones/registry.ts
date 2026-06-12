import { ORGAN_COLORS } from "../cartoon/organ-colors";
import type { AnatomyModuleDef } from "../modules/types";
import { buildBoneInstances, getBoneFocusDistance } from "./instances";

export function getBoneModules(): AnatomyModuleDef[] {
  return buildBoneInstances().map((bone) => ({
    id: bone.id,
    layer: "bone" as const,
    position: bone.focus,
    scale: [1, 1, 1] as [number, number, number],
    color: ORGAN_COLORS.boneAccent,
    geometry: "capsule" as const,
    profile: "long-bone" as const,
    focusDistance: bone.focusDistance ?? getBoneFocusDistance(bone.id),
    opacity: 0.95,
  }));
}
