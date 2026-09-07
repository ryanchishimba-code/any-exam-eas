/**
 * NCLEX figure asset catalog — board-style teaching schematics (not patient tracings/photos).
 * Attach by blueprint topic; serve only reviewStatus=approved.
 */
import {
  attachFigureRefToNgn as attachSharedFigureRef,
  type ExhibitFigureRef,
} from "../exhibit-figure";
import {
  ECG_VT_SCHEMATIC,
  FETAL_LATE_DECELS,
  INSULIN_PEAK_CHART,
  MAR_MED_LABEL,
  PPE_DONNING,
  PRESSURE_INJURY_STAGES,
} from "./figure-svgs";

export type NclexFigureRef = ExhibitFigureRef;

export const NCLEX_FIGURE_CATALOG: NclexFigureRef[] = [
  {
    id: "nclex-fetal-late-decels",
    kind: "fetal_strip",
    url: FETAL_LATE_DECELS,
    alt: "Schematic fetal heart rate strip showing late decelerations after contractions",
    caption: "Late decelerations — FHR nadir AFTER contraction peak",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Board-style schematic — not a patient tracing",
    organSystem: "health-promotion",
    topics: ["labor-fetal-monitoring", "fetal-monitoring", "obstetrics", "maternity"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "nclex-insulin-timing",
    kind: "insulin_chart",
    url: INSULIN_PEAK_CHART,
    alt: "Insulin onset peak and duration teaching chart with regular insulin peak highlighted",
    caption: "Insulin timing — peak = hypoglycemia risk window",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Verify peaks with current drug references / facility protocol",
    organSystem: "pharmacological",
    topics: ["endocrine-meds", "insulin", "dosage-calculations", "diabetes"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "nclex-mar-high-alert",
    kind: "med_label",
    url: MAR_MED_LABEL,
    alt: "Medication administration record label showing high-alert insulin order and six rights",
    caption: "MAR — high-alert insulin + six rights checklist",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching label for medication rights — not a real MAR",
    organSystem: "safety",
    topics: [
      "medication-error-prevention",
      "blood-products-transfusion",
      "high-alert",
      "medication-administration",
    ],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "nclex-ecg-vt-schematic",
    kind: "ecg",
    url: ECG_VT_SCHEMATIC,
    alt: "Schematic ECG showing wide-complex ventricular tachycardia without P waves",
    caption: "VT — wide QRS, no P waves, rate ~170–180",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching strip — not a patient tracing",
    organSystem: "physiological",
    topics: ["cardiac-emergencies", "dysrhythmias", "ecg", "telemetry"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "nclex-pressure-injury-stages",
    kind: "wound",
    url: PRESSURE_INJURY_STAGES,
    alt: "Cross-section diagrams of pressure injury stages I through IV by tissue depth",
    caption: "Pressure injury stages by depth (I–IV)",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching diagram — not clinical photography",
    organSystem: "physiological",
    topics: ["pressure-injury-staging", "skin-integrity", "wound-care"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "nclex-ppe-donning",
    kind: "ppe",
    url: PPE_DONNING,
    alt: "PPE donning sequence: gown, mask, eye protection, gloves",
    caption: "PPE donning — gloves last; doffing reverses",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Follow current CDC / facility sequence for doffing separately",
    organSystem: "safety",
    topics: ["ppe-donning-doffing", "transmission-based-precautions", "infection-control"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
];

const BY_ID = new Map(NCLEX_FIGURE_CATALOG.map((f) => [f.id, f]));

/**
 * Purpose keywords — figure attaches only when the item tests what the figure teaches.
 * Ambient domain mentions (e.g. "insulin", "fetal heart tones", "contact precautions")
 * are NOT enough; the stem/question must need that exhibit to answer or learn the cue.
 */
export const NCLEX_FIGURE_CONTENT_KEYWORDS: Record<string, string[]> = {
  "nclex-fetal-late-decels": [
    "late decel",
    "late deceler",
    "prolonged late",
  ],
  "nclex-insulin-timing": [
    "insulin peak",
    "peak of",
    "peaks in",
    "peak effect",
    "onset and peak",
    "onset, peak",
    "onset peak",
    "peak and duration",
    "peak / duration",
    "hypoglycemia risk",
    "risk for hypoglycemia",
    "greatest risk for hypoglycemia",
    "when to expect hypoglycemia",
    "hours after insulin",
    "hours after administration",
    "when does the",
    "peak action",
    "peak time",
  ],
  "nclex-mar-high-alert": [
    "high-alert",
    "high alert",
    "five rights",
    "six rights",
    "6 rights",
    "medication rights",
    "look-alike",
    "sound-alike",
    "independent double check",
    "independent double-check",
    "wrong dose",
    "wrong medication",
    "wrong drug",
  ],
  "nclex-ecg-vt-schematic": [
    "ventricular tachycardia",
    "v-tach",
    "vtach",
    "wide-complex",
    "wide complex",
    "pulseless vt",
    "monomorphic vt",
  ],
  "nclex-pressure-injury-stages": [
    "stage i pressure",
    "stage 1 pressure",
    "stage ii pressure",
    "stage 2 pressure",
    "stage iii pressure",
    "stage 3 pressure",
    "stage iv pressure",
    "stage 4 pressure",
    "pressure injury staging",
    "pressure ulcer staging",
    "stage the pressure",
    "staging of the pressure",
    "non-blanchable",
    "nonblanchable",
    "partial-thickness",
    "partial thickness",
    "full-thickness",
    "full thickness",
  ],
  "nclex-ppe-donning": [
    "donning",
    "doffing",
    "don ppe",
    "doff ppe",
    "order of ppe",
    "ppe order",
    "sequence for ppe",
    "ppe sequence",
    "put on ppe",
    "remove ppe",
    "gloves last",
    "gown first",
    "which item of ppe",
    "personal protective equipment in which order",
    "order should the nurse don",
    "order should the nurse put on",
  ],
};

export function getApprovedNclexFigureById(id: string): NclexFigureRef | undefined {
  const fig = BY_ID.get(id);
  return fig?.reviewStatus === "approved" ? fig : undefined;
}

function slugifyTopic(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Topic match — exact slug or full catalog topic contained in candidate (not short substring). */
export function findApprovedNclexFiguresForTopic(
  topic: string | null | undefined
): NclexFigureRef[] {
  const t = topic?.trim().toLowerCase() ?? "";
  if (!t) return [];
  const slug = slugifyTopic(t);
  return NCLEX_FIGURE_CATALOG.filter((f) => {
    if (f.reviewStatus !== "approved") return false;
    return f.topics.some((x) => {
      if (slug === x || t === x) return true;
      // Allow "labor-fetal-monitoring" when candidate is that full slug only.
      if (t.includes(x) && x.length >= 12) return true;
      if (slug.includes(x) && x.length >= 12) return true;
      return false;
    });
  });
}

export function itemTextForNclexFigureFit(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
  blueprintTopic?: string | null;
  tags?: string[] | null;
}): string {
  // Stem text only — blueprintTopic/tags caused false attaches (topic ≠ exhibit).
  return [item.vignette, item.scenario, item.question].filter(Boolean).join("\n").toLowerCase();
}

export function nclexFigureFitsItemText(
  figureId: string,
  text: string
): boolean {
  const keys = NCLEX_FIGURE_CONTENT_KEYWORDS[figureId] ?? [];
  if (!keys.length) return false;
  const hay = text.toLowerCase();

  // Delegation / multi-room stems mention many topics — never auto-attach exhibits.
  if (
    /\bfour clients\b/.test(hay) ||
    /\bwhich client\b[\s\S]{0,80}\b(first|priority)\b/.test(hay) ||
    (/\broom\s*\d{2,3}\b/.test(hay) &&
      (hay.match(/\broom\s*\d{2,3}\b/g)?.length ?? 0) >= 2)
  ) {
    return false;
  }

  // Purpose gate: at least one teaching-point keyword must appear.
  return keys.some((k) => hay.includes(k.toLowerCase()));
}

export function nclexFigureFitsItem(
  figure: NclexFigureRef,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
    blueprintTopic?: string | null;
    tags?: string[] | null;
  }
): boolean {
  return nclexFigureFitsItemText(figure.id, itemTextForNclexFigureFit(item));
}

/**
 * Pick at most one approved figure that clinically fits the stem.
 * Topic rank is a preference only — content keywords are required.
 */
export function selectNclexFigureForItem(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
  blueprintTopic?: string | null;
  topicCategory?: string | null;
  tags?: string[] | null;
  ngnPayload?: Record<string, unknown> | null;
}): NclexFigureRef | undefined {
  const fitting = NCLEX_FIGURE_CATALOG.filter(
    (f) => f.reviewStatus === "approved" && nclexFigureFitsItem(f, item)
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
    const score = (f: NclexFigureRef) =>
      topicCandidates.some((t) =>
        f.topics.some((x) => t === x || t.includes(x) || slugifyTopic(t) === x)
      )
        ? 1
        : 0;
    return score(b) - score(a);
  });

  return fitting[0];
}

export function attachNclexFigureRefToNgn(
  ngn: Record<string, unknown>,
  figure: NclexFigureRef
): Record<string, unknown> {
  // Preserve existing NGN kinds (bow_tie, matrix, etc.) — do not force exhibit.
  return attachSharedFigureRef(ngn, figure);
}

/** Drop NCLEX catalog media that no longer fits the stem (keep non-catalog / CDN assets). */
export function pruneMisfitNclexMedia(
  ngn: Record<string, unknown>,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
    blueprintTopic?: string | null;
    tags?: string[] | null;
  }
): Record<string, unknown> {
  if (!Array.isArray(ngn.media)) return ngn;
  const media = (ngn.media as NclexFigureRef[]).filter((m) => {
    if (!m?.id?.startsWith("nclex-")) return true;
    return nclexFigureFitsItem(m, item);
  });
  if (media.length === (ngn.media as unknown[]).length) return ngn;
  if (!media.length) {
    const { media: _drop, ...rest } = ngn;
    return rest;
  }
  return { ...ngn, media };
}
