import type { AnatomyLayer, AnatomyStructure } from "@/lib/anatomy/types";

export const sampleStructures: AnatomyStructure[] = [
  {
    id: "heart",
    name: "Heart",
    system: "cardiovascular",
    layer: "organ",
    meshId: "heart",
    highYield: true,
    description: "Muscular pump of the circulatory system.",
    clinicalFacts: ["Four chambers; left ventricle pumps systemic circulation."],
    memoryCardIds: [],
    practiceTopicSlug: "cardiovascular",
    keywords: ["heart", "cardiac"],
  },
  {
    id: "aorta",
    name: "Aorta",
    system: "cardiovascular",
    layer: "vascular",
    meshId: "aorta",
    highYield: false,
    description: "Largest artery in the body.",
    clinicalFacts: ["Ascending aorta arises from the left ventricle."],
    memoryCardIds: [],
    practiceTopicSlug: "cardiovascular",
    keywords: ["aorta", "artery"],
  },
];

export const defaultVisibleLayers = new Set<AnatomyLayer>([
  "skin",
  "muscle",
  "organ",
  "vascular",
  "nerve",
  "bone",
]);
