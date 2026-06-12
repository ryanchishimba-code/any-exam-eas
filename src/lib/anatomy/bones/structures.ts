import type { AnatomyStructure } from "../types";
import {
  ADULT_BONE_COUNT,
  buildBoneInstances,
  type BoneInstance,
  type BoneRegion,
} from "./instances";

const REGION_LABELS: Record<BoneRegion, string> = {
  cranium: "Cranium",
  face: "Facial bones",
  ossicles: "Ear ossicles",
  hyoid: "Hyoid",
  vertebral: "Vertebral column",
  thorax: "Thorax",
  pelvis: "Pelvis",
  "upper-limb": "Upper limb",
  hand: "Hand",
  "lower-limb": "Lower limb",
  foot: "Foot",
};

/** High-yield legacy ids — keep rich copy in structures.ts; skip duplicate generated entry. */
const LEGACY_BONE_IDS = new Set([
  "skull",
  "femur",
  "humerus",
  "tibia",
  "clavicle",
  "scapula",
  "sternum",
  "vertebral-column",
]);

function boneStructure(bone: BoneInstance): AnatomyStructure {
  const regionLabel = REGION_LABELS[bone.region];
  return {
    id: bone.id,
    name: bone.name,
    system: "skeletal",
    layer: "bone",
    description: `${bone.name} — ${regionLabel}. Part of the adult skeleton (${ADULT_BONE_COUNT} bones).`,
    clinicalFacts: [
      `Region: ${regionLabel}`,
      bone.kind === "long" ? "Long bone — shaft with flared epiphyses at joints." : `Bone type: ${bone.kind}.`,
    ],
    pathologies: ["Fracture", "Avascular necrosis", "Osteoporosis"],
    highYield: Boolean(bone.highYield),
    memoryCardIds: [],
    practiceTopicSlug: "anatomy",
    meshId: bone.id,
    keywords: [bone.name.toLowerCase(), bone.region, bone.kind, "bone", "skeleton"],
  };
}

export function generateBoneStructures(): AnatomyStructure[] {
  return buildBoneInstances().map(boneStructure);
}

export function getBoneRegionLabel(region: BoneRegion): string {
  return REGION_LABELS[region];
}

export { LEGACY_BONE_IDS };
