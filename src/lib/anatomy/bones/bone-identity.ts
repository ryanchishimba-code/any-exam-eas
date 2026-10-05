/**
 * Bone names for study links and the structure catalog.
 * World-space placement stays in instances.ts, which imports three.js.
 * Study pages only need id, name, region, and kind.
 */
import { FINGER_SPECS, THUMB_SPEC, TOE_SPECS } from "../cartoon/digit-proportions";

export type BoneSide = "right" | "left" | "midline";
export type BoneRegion =
  | "cranium"
  | "face"
  | "ossicles"
  | "hyoid"
  | "vertebral"
  | "thorax"
  | "pelvis"
  | "upper-limb"
  | "hand"
  | "lower-limb"
  | "foot";

export type BoneKind = "long" | "short" | "flat" | "irregular" | "sesamoid";

/** Standard adult count. Placement code in instances.ts re-exports this. */
export const ADULT_BONE_COUNT = 206;

export type BoneIdentity = {
  id: string;
  name: string;
  region: BoneRegion;
  kind: BoneKind;
  highYield?: boolean;
};

const CARPAL_NAMES = [
  "scaphoid",
  "lunate",
  "triquetrum",
  "pisiform",
  "trapezium",
  "trapezoid",
  "capitate",
  "hamate",
] as const;

const TARSAL_NAMES = [
  "calcaneus",
  "talus",
  "navicular",
  "cuboid",
  "medial-cuneiform",
  "intermediate-cuneiform",
  "lateral-cuneiform",
] as const;

const OSSICLE_NAMES = ["malleus", "incus", "stapes"] as const;

const SIDES = ["right", "left"] as const;

function titleWord(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function sideLetter(side: "right" | "left"): string {
  return side[0]!.toUpperCase();
}

function bone(
  id: string,
  name: string,
  region: BoneRegion,
  kind: BoneKind,
  highYield?: boolean
): BoneIdentity {
  return highYield ? { id, name, region, kind, highYield } : { id, name, region, kind };
}

function skullBones(): BoneIdentity[] {
  const cranial: [string, string, boolean?][] = [
    ["frontal-bone", "Frontal bone", true],
    ["parietal-bone-r", "Parietal bone (R)"],
    ["parietal-bone-l", "Parietal bone (L)"],
    ["temporal-bone-r", "Temporal bone (R)"],
    ["temporal-bone-l", "Temporal bone (L)"],
    ["occipital-bone", "Occipital bone"],
    ["sphenoid-bone", "Sphenoid bone"],
    ["ethmoid-bone", "Ethmoid bone"],
  ];
  const facial: [string, string][] = [
    ["mandible", "Mandible"],
    ["maxilla-r", "Maxilla (R)"],
    ["maxilla-l", "Maxilla (L)"],
    ["zygomatic-r", "Zygomatic bone (R)"],
    ["zygomatic-l", "Zygomatic bone (L)"],
    ["nasal-r", "Nasal bone (R)"],
    ["nasal-l", "Nasal bone (L)"],
    ["lacrimal-r", "Lacrimal bone (R)"],
    ["lacrimal-l", "Lacrimal bone (L)"],
    ["palatine-r", "Palatine bone (R)"],
    ["palatine-l", "Palatine bone (L)"],
    ["nasal-concha-r", "Inferior nasal concha (R)"],
    ["nasal-concha-l", "Inferior nasal concha (L)"],
    ["vomer", "Vomer"],
  ];
  return [
    ...cranial.map(([id, name, highYield]) => bone(id, name, "cranium", "flat", highYield)),
    ...facial.map(([id, name]) => bone(id, name, "face", "flat")),
  ];
}

function ossiclesAndHyoid(): BoneIdentity[] {
  const bones: BoneIdentity[] = [bone("hyoid", "Hyoid bone", "hyoid", "irregular", true)];
  for (const side of SIDES) {
    const mark = sideLetter(side);
    for (const name of OSSICLE_NAMES) {
      bones.push(
        bone(
          `${name}-${side[0]}`,
          `${titleWord(name)} (${mark})`,
          "ossicles",
          "short"
        )
      );
    }
  }
  return bones;
}

function vertebralBones(): BoneIdentity[] {
  const bones: BoneIdentity[] = [];
  const regions: { prefix: string; name: string; count: number }[] = [
    { prefix: "c", name: "Cervical", count: 7 },
    { prefix: "t", name: "Thoracic", count: 12 },
    { prefix: "l", name: "Lumbar", count: 5 },
  ];
  for (const { prefix, name, count } of regions) {
    for (let i = 0; i < count; i++) {
      bones.push(
        bone(
          `${prefix}${i + 1}-vertebra`,
          `${name} vertebra ${i + 1}`,
          "vertebral",
          "irregular",
          prefix === "c" && i === 0 ? true : undefined
        )
      );
    }
  }
  bones.push(
    bone("sacrum", "Sacrum", "vertebral", "irregular", true),
    bone("coccyx", "Coccyx", "vertebral", "irregular")
  );
  return bones;
}

function thoraxBones(): BoneIdentity[] {
  const bones: BoneIdentity[] = [];
  for (let i = 0; i < 12; i++) {
    for (const side of SIDES) {
      const mark = sideLetter(side);
      bones.push(bone(`rib-${i + 1}-${side[0]}`, `Rib ${i + 1} (${mark})`, "thorax", "flat"));
    }
  }
  bones.push(bone("sternum-bone", "Sternum", "thorax", "flat", true));
  return bones;
}

function pelvisBones(): BoneIdentity[] {
  return SIDES.map((side) =>
    bone(
      `innominate-${side[0]}`,
      `Hip bone / innominate (${sideLetter(side)})`,
      "pelvis",
      "irregular",
      true
    )
  );
}

function handBones(side: "right" | "left"): BoneIdentity[] {
  const mark = sideLetter(side);
  const letter = side[0];
  const bones: BoneIdentity[] = CARPAL_NAMES.map((name) =>
    bone(`${name}-${letter}`, `${titleWord(name)} (${mark})`, "hand", "short")
  );

  for (let m = 1; m <= 5; m++) {
    if (m === 1) {
      bones.push(
        bone(`mc-1-${letter}`, `Metacarpal 1 / thumb (${mark})`, "hand", "long")
      );
      const labels = ["Proximal", "Distal"];
      THUMB_SPEC.phalanges.forEach((_, pi) => {
        bones.push(
          bone(
            `phalanx-1-${pi + 1}-${letter}`,
            `${labels[pi]} phalanx 1 (${mark})`,
            "hand",
            "long"
          )
        );
      });
      continue;
    }
    const spec = FINGER_SPECS[5 - m]!;
    bones.push(bone(`mc-${m}-${letter}`, `Metacarpal ${m} (${mark})`, "hand", "long"));
    const labels = ["Proximal", "Middle", "Distal"];
    spec.phalanges.forEach((_, pi) => {
      bones.push(
        bone(
          `phalanx-${m}-${pi + 1}-${letter}`,
          `${labels[pi]} phalanx ${m} (${mark})`,
          "hand",
          "long"
        )
      );
    });
  }
  return bones;
}

function upperLimbBones(): BoneIdentity[] {
  const bones: BoneIdentity[] = [];
  for (const side of SIDES) {
    const mark = sideLetter(side);
    const letter = side[0];
    bones.push(
      bone(`clavicle-${letter}`, `Clavicle (${mark})`, "upper-limb", "long", true),
      bone(`scapula-${letter}`, `Scapula (${mark})`, "upper-limb", "flat", true),
      bone(`humerus-${letter}`, `Humerus (${mark})`, "upper-limb", "long", true),
      bone(`radius-${letter}`, `Radius (${mark})`, "upper-limb", "long"),
      bone(`ulna-${letter}`, `Ulna (${mark})`, "upper-limb", "long"),
      ...handBones(side)
    );
  }
  return bones;
}

function lowerLimbBones(): BoneIdentity[] {
  const bones: BoneIdentity[] = [];
  for (const side of SIDES) {
    const mark = sideLetter(side);
    const letter = side[0];
    bones.push(
      bone(`femur-${letter}`, `Femur (${mark})`, "lower-limb", "long", true),
      bone(`patella-${letter}`, `Patella (${mark})`, "lower-limb", "sesamoid", true),
      bone(`tibia-${letter}`, `Tibia (${mark})`, "lower-limb", "long", true),
      bone(`fibula-${letter}`, `Fibula (${mark})`, "lower-limb", "long")
    );
    for (const name of TARSAL_NAMES) {
      bones.push(
        bone(
          `${name}-${letter}`,
          `${name.split("-").map(titleWord).join(" ")} (${mark})`,
          "foot",
          "short"
        )
      );
    }
    TOE_SPECS.forEach((spec, ti) => {
      bones.push(
        bone(`mt-${ti + 1}-${letter}`, `Metatarsal ${ti + 1} (${mark})`, "foot", "long")
      );
      spec.phalanges.forEach((_, pi) => {
        bones.push(
          bone(
            `toe-phalanx-${ti + 1}-${pi + 1}-${letter}`,
            `Toe ${ti + 1} phalanx ${pi + 1} (${mark})`,
            "foot",
            "long"
          )
        );
      });
    });
  }
  return bones;
}

/** Same bones, in the same order, as buildBoneInstances(), without mesh placement. */
export function listBoneIdentities(): BoneIdentity[] {
  return [
    ...skullBones(),
    ...ossiclesAndHyoid(),
    ...vertebralBones(),
    ...thoraxBones(),
    ...pelvisBones(),
    ...upperLimbBones(),
    ...lowerLimbBones(),
  ];
}
