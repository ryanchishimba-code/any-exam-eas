/**
 * AANP FNP figure asset catalog — primary-care teaching schematics.
 * Attach only when stem/question tests the figure's teaching point (purpose keywords).
 */
import {
  attachFigureRefToNgn as attachSharedFigureRef,
  type ExhibitFigureRef,
} from "../exhibit-figure";
import {
  AANP_DERM_ABCDE,
  AANP_ECG_AFIB,
  AANP_GROWTH_CHART,
  AANP_OTOSCOPY_OM,
  AANP_SPIROMETRY_OBSTRUCTIVE,
} from "./figure-svgs";

export type AanpFnpFigureRef = ExhibitFigureRef;

export const AANP_FNP_FIGURE_CATALOG: AanpFnpFigureRef[] = [
  {
    id: "aanp-ecg-afib",
    kind: "ecg",
    url: AANP_ECG_AFIB,
    alt: "Schematic ECG showing atrial fibrillation with irregular RR intervals and absent P waves",
    caption: "AFib — irregularly irregular · no P waves",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching strip — not a patient tracing",
    organSystem: "cardiovascular",
    topics: [
      "atrial-fibrillation-anticoagulation",
      "atrial-fibrillation",
      "cardiovascular",
    ],
    reviewStatus: "approved",
    reviewedAt: "2026-09-10",
  },
  {
    id: "aanp-derm-abcde",
    kind: "diagram",
    url: AANP_DERM_ABCDE,
    alt: "ABCDE melanoma warning signs teaching diagram for primary care skin exam",
    caption: "ABCDE — asymmetry, border, color, diameter, evolving",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching schematic — not clinical photography",
    organSystem: "dermatology-ent",
    topics: [
      "skin-cancer-detection",
      "common-rashes-eczema-psoriasis-acne",
      "dermatology-ent",
    ],
    reviewStatus: "approved",
    reviewedAt: "2026-09-10",
  },
  {
    id: "aanp-otoscopy-om",
    kind: "diagram",
    url: AANP_OTOSCOPY_OM,
    alt: "Side-by-side otoscopic comparison of normal tympanic membrane and acute otitis media",
    caption: "AOM — bulging erythematous TM · landmarks lost",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching schematic — not a patient photo",
    organSystem: "dermatology-ent",
    topics: [
      "otitis-hearing-loss",
      "common-pediatric-illnesses",
      "otitis-media",
    ],
    reviewStatus: "approved",
    reviewedAt: "2026-09-10",
  },
  {
    id: "aanp-spirometry-obstructive",
    kind: "diagram",
    url: AANP_SPIROMETRY_OBSTRUCTIVE,
    alt: "Spirometry teaching card showing obstructive FEV1/FVC pattern and scooped flow-volume loop",
    caption: "Obstruction — FEV₁/FVC < 0.70 · scooped loop",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching schematic — interpret with clinical context / GOLD-GINA",
    organSystem: "pulmonary",
    topics: ["asthma-gina-stepwise", "copd-gold-inhalers", "pulmonary"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-10",
  },
  {
    id: "aanp-growth-chart",
    kind: "diagram",
    url: AANP_GROWTH_CHART,
    alt: "Pediatric growth chart schematic highlighting downward crossing of major percentiles",
    caption: "Crossing ≥2 major percentiles — evaluate FTT",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching chart — not a CDC growth sheet facsimile",
    organSystem: "pediatrics",
    topics: [
      "well-child-developmental-milestones",
      "common-pediatric-illnesses",
      "pediatrics",
    ],
    reviewStatus: "approved",
    reviewedAt: "2026-09-10",
  },
];

const BY_ID = new Map(AANP_FNP_FIGURE_CATALOG.map((f) => [f.id, f]));

/**
 * Purpose keywords — attach only when the item tests what the figure teaches.
 * Ambient mentions ("history of AFib", "uses inhaler") are not enough.
 */
export const AANP_FNP_FIGURE_CONTENT_KEYWORDS: Record<string, string[]> = {
  "aanp-ecg-afib": [
    "atrial fibrillation",
    "atrial fib",
    "a-fib",
    "afib",
    "irregularly irregular",
    "absent p waves",
    "no p waves",
    "cha2ds2",
    "cha₂ds₂",
    "has-bled",
  ],
  "aanp-derm-abcde": [
    "abcde",
    "a-b-c-d-e",
    "ugly duckling",
    "melanoma",
    "suspicious mole",
    "suspicious lesion",
    "asymmetric lesion",
    "irregular border",
    "changing mole",
    "evolving lesion",
    "diameter greater than",
    ">6 mm",
    "greater than 6 mm",
  ],
  "aanp-otoscopy-om": [
    "otitis media",
    "acute otitis",
    "bulging tympanic",
    "bulging tm",
    "erythematous tm",
    "tympanic membrane",
    "otoscopic",
    "otoscopy",
    "middle ear effusion",
    "landmarks obscured",
    "absent light reflex",
  ],
  "aanp-spirometry-obstructive": [
    "spirometry",
    "fev1/fvc",
    "fev₁/fvc",
    "fev1 / fvc",
    "forced expiratory",
    "flow-volume",
    "flow volume loop",
    "obstructive pattern",
    "obstructive spirometry",
    "post-bronchodilator",
    "postbronchodilator",
    "gold criteria",
    "gina stepwise",
  ],
  "aanp-growth-chart": [
    "growth chart",
    "growth curve",
    "crossing percentiles",
    "crossed percentiles",
    "failure to thrive",
    "faltering growth",
    "percentile drop",
    "falls across",
    "two major percentiles",
    "weight-for-age",
    "weight for age",
    "length-for-age",
  ],
};

export function getApprovedAanpFnpFigureById(id: string): AanpFnpFigureRef | undefined {
  const fig = BY_ID.get(id);
  return fig?.reviewStatus === "approved" ? fig : undefined;
}

function slugifyTopic(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, "-");
}

export function findApprovedAanpFnpFiguresForTopic(
  topic: string | null | undefined
): AanpFnpFigureRef[] {
  const t = topic?.trim().toLowerCase() ?? "";
  if (!t) return [];
  const slug = slugifyTopic(t);
  return AANP_FNP_FIGURE_CATALOG.filter((f) => {
    if (f.reviewStatus !== "approved") return false;
    return f.topics.some((x) => {
      if (slug === x || t === x) return true;
      if (t.includes(x) && x.length >= 12) return true;
      if (slug.includes(x) && x.length >= 12) return true;
      return false;
    });
  });
}

export function itemTextForAanpFnpFigureFit(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
}): string {
  return [item.vignette, item.scenario, item.question].filter(Boolean).join("\n").toLowerCase();
}

export function aanpFnpFigureFitsItemText(figureId: string, text: string): boolean {
  const keys = AANP_FNP_FIGURE_CONTENT_KEYWORDS[figureId] ?? [];
  if (!keys.length) return false;
  const hay = text.toLowerCase();

  if (
    /\bfour patients\b/.test(hay) ||
    /\bfour clients\b/.test(hay) ||
    /\bwhich patient\b[\s\S]{0,80}\b(first|priority)\b/.test(hay)
  ) {
    return false;
  }

  return keys.some((k) => hay.includes(k.toLowerCase()));
}

export function aanpFnpFigureFitsItem(
  figure: AanpFnpFigureRef,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
  }
): boolean {
  return aanpFnpFigureFitsItemText(figure.id, itemTextForAanpFnpFigureFit(item));
}

export function selectAanpFnpFigureForItem(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
  blueprintTopic?: string | null;
  topicCategory?: string | null;
  tags?: string[] | null;
  ngnPayload?: Record<string, unknown> | null;
}): AanpFnpFigureRef | undefined {
  const fitting = AANP_FNP_FIGURE_CATALOG.filter(
    (f) => f.reviewStatus === "approved" && aanpFnpFigureFitsItem(f, item)
  );
  if (!fitting.length) return undefined;

  const topicCandidates = [
    item.blueprintTopic,
    typeof item.ngnPayload?.blueprintTopic === "string"
      ? item.ngnPayload.blueprintTopic
      : null,
    item.topicCategory,
    ...(item.tags ?? []),
  ]
    .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
    .filter(Boolean);

  fitting.sort((a, b) => {
    const score = (f: AanpFnpFigureRef) =>
      topicCandidates.some((t) =>
        f.topics.some((x) => t === x || t.includes(x) || slugifyTopic(t) === x)
      )
        ? 1
        : 0;
    return score(b) - score(a);
  });

  return fitting[0];
}

export function attachAanpFnpFigureRefToNgn(
  ngn: Record<string, unknown>,
  figure: AanpFnpFigureRef
): Record<string, unknown> {
  return attachSharedFigureRef(ngn, figure);
}

export function pruneMisfitAanpFnpMedia(
  ngn: Record<string, unknown>,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
  }
): Record<string, unknown> {
  if (!Array.isArray(ngn.media)) return ngn;
  const media = (ngn.media as AanpFnpFigureRef[]).filter((m) => {
    if (!m?.id?.startsWith("aanp-")) return true;
    return aanpFnpFigureFitsItem(m, item);
  });
  if (media.length === (ngn.media as unknown[]).length) return ngn;
  if (!media.length) {
    const { media: _drop, ...rest } = ngn;
    return rest;
  }
  return { ...ngn, media };
}
