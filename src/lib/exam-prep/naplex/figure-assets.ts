/**
 * NAPLEX figure asset catalog — pharmacy teaching schematics.
 * Attach only when stem/question tests the figure's teaching point (purpose keywords).
 */
import {
  attachFigureRefToNgn as attachSharedFigureRef,
  type ExhibitFigureRef,
} from "../exhibit-figure";
import {
  CRCL_FORMULA_CARD,
  HIGH_ALERT_INSULIN,
  INHALER_MDI_STEPS,
  NAPLEX_INSULIN_TIMING,
  VANCO_TDM_PATHWAY,
} from "./figure-svgs";

export type NaplexFigureRef = ExhibitFigureRef;

export const NAPLEX_FIGURE_CATALOG: NaplexFigureRef[] = [
  {
    id: "naplex-inhaler-mdi-steps",
    kind: "diagram",
    url: INHALER_MDI_STEPS,
    alt: "MDI inhaler counseling steps: shake, exhale, seal and press, inhale, hold, rinse if ICS",
    caption: "MDI technique — spacer improves delivery; rinse after ICS",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching schematic — follow product labeling / facility counseling",
    organSystem: "respiratory",
    topics: ["asthma-copd-inhalers", "asthma", "copd", "inhalers"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "naplex-vanco-tdm-pathway",
    kind: "pathway",
    url: VANCO_TDM_PATHWAY,
    alt: "Vancomycin TDM pathway: interpret trough or AUC then adjust dose",
    caption: "Vanco TDM — low ↑ dose · high hold/↓ · on target continue",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Follow facility AUC/trough protocol — teaching pathway only",
    organSystem: "infectious-disease",
    topics: ["tdm-monitoring", "tdm-vancomycin-aminoglycosides", "vancomycin"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "naplex-mar-high-alert",
    kind: "med_label",
    url: HIGH_ALERT_INSULIN,
    alt: "ISMP high-alert insulin order requiring independent double-check",
    caption: "High-alert insulin — verify concentration and dose",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching label — not a real MAR",
    organSystem: "medication-safety",
    topics: ["medication-safety-ismp", "ismp-high-alert-meds", "high-alert"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "naplex-crcl-formula",
    kind: "diagram",
    url: CRCL_FORMULA_CARD,
    alt: "Cockcroft-Gault creatinine clearance formula card for renal dosing",
    caption: "CrCl ≈ (140−age)×wt / (72×SCr) × 0.85 if female",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Estimate only — use IBW/AdjBW per protocol; unstable SCr unreliable",
    organSystem: "renal",
    topics: [
      "calculations-creatinine-clearance",
      "renal-ckd-pharmacotherapy",
      "creatinine-clearance",
    ],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "naplex-insulin-timing",
    kind: "insulin_chart",
    url: NAPLEX_INSULIN_TIMING,
    alt: "Insulin onset peak duration chart highlighting hypoglycemia at peak",
    caption: "Insulin timing — hypoglycemia risk = peak window",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Verify peaks with current references / product labeling",
    organSystem: "endocrine",
    topics: ["insulin-diabetes-management", "endocrine-meds", "insulin"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
];

const BY_ID = new Map(NAPLEX_FIGURE_CATALOG.map((f) => [f.id, f]));

/**
 * Purpose keywords — attach only when the item tests what the figure teaches.
 * Ambient mentions (tiotropium refill, “on insulin”) are not enough.
 */
export const NAPLEX_FIGURE_CONTENT_KEYWORDS: Record<string, string[]> = {
  "naplex-inhaler-mdi-steps": [
    "inhaler technique",
    "counseling on inhaler",
    "how to use the inhaler",
    "how to use her inhaler",
    "how to use his inhaler",
    "mdi technique",
    "metered-dose",
    "metered dose",
    "use a spacer",
    "with a spacer",
    "prime the inhaler",
    "shake the inhaler",
    "breath-hold",
    "breath hold",
    "rinse her mouth",
    "rinse his mouth",
    "rinse the mouth",
    "correct order for using",
    "steps for using the inhaler",
    "demonstrate inhaler",
  ],
  "naplex-vanco-tdm-pathway": [
    "vancomycin trough",
    "vanco trough",
    "trough concentration",
    "trough level",
    "auc/mic",
    "auc-mic",
    "auc guided",
    "adjust the vancomycin",
    "vancomycin dose adjustment",
    "supratherapeutic trough",
    "subtherapeutic trough",
    "redraw the trough",
  ],
  "naplex-mar-high-alert": [
    "high-alert",
    "high alert",
    "ismp",
    "independent double check",
    "independent double-check",
    "u-500",
    "u500",
    "wrong concentration",
    "insulin concentration",
  ],
  "naplex-crcl-formula": [
    "cockcroft",
    "creatinine clearance",
    "calculate crcl",
    "calculate the crcl",
    "crcl of",
    "estimated crcl",
    "renal dose adjustment",
    "adjust the dose for renal",
    "dose adjust for crcl",
  ],
  "naplex-insulin-timing": [
    "insulin peak",
    "peak of",
    "peaks in",
    "peak effect",
    "onset and peak",
    "onset, peak",
    "onset peak",
    "peak and duration",
    "hypoglycemia risk",
    "risk for hypoglycemia",
    "greatest risk for hypoglycemia",
    "peak action",
    "peak time",
  ],
};

export function getApprovedNaplexFigureById(id: string): NaplexFigureRef | undefined {
  const fig = BY_ID.get(id);
  return fig?.reviewStatus === "approved" ? fig : undefined;
}

function slugifyTopic(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, "-");
}

export function findApprovedNaplexFiguresForTopic(
  topic: string | null | undefined
): NaplexFigureRef[] {
  const t = topic?.trim().toLowerCase() ?? "";
  if (!t) return [];
  const slug = slugifyTopic(t);
  return NAPLEX_FIGURE_CATALOG.filter((f) => {
    if (f.reviewStatus !== "approved") return false;
    return f.topics.some((x) => {
      if (slug === x || t === x) return true;
      if (t.includes(x) && x.length >= 12) return true;
      if (slug.includes(x) && x.length >= 12) return true;
      return false;
    });
  });
}

export function itemTextForNaplexFigureFit(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
}): string {
  return [item.vignette, item.scenario, item.question].filter(Boolean).join("\n").toLowerCase();
}

export function naplexFigureFitsItemText(figureId: string, text: string): boolean {
  const keys = NAPLEX_FIGURE_CONTENT_KEYWORDS[figureId] ?? [];
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

export function naplexFigureFitsItem(
  figure: NaplexFigureRef,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
  }
): boolean {
  return naplexFigureFitsItemText(figure.id, itemTextForNaplexFigureFit(item));
}

export function selectNaplexFigureForItem(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
  blueprintTopic?: string | null;
  topicCategory?: string | null;
  tags?: string[] | null;
  ngnPayload?: Record<string, unknown> | null;
}): NaplexFigureRef | undefined {
  const fitting = NAPLEX_FIGURE_CATALOG.filter(
    (f) => f.reviewStatus === "approved" && naplexFigureFitsItem(f, item)
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
    const score = (f: NaplexFigureRef) =>
      topicCandidates.some((t) =>
        f.topics.some((x) => t === x || t.includes(x) || slugifyTopic(t) === x)
      )
        ? 1
        : 0;
    return score(b) - score(a);
  });

  return fitting[0];
}

export function attachNaplexFigureRefToNgn(
  ngn: Record<string, unknown>,
  figure: NaplexFigureRef
): Record<string, unknown> {
  return attachSharedFigureRef(ngn, figure);
}

export function pruneMisfitNaplexMedia(
  ngn: Record<string, unknown>,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
  }
): Record<string, unknown> {
  if (!Array.isArray(ngn.media)) return ngn;
  const media = (ngn.media as NaplexFigureRef[]).filter((m) => {
    if (!m?.id?.startsWith("naplex-")) return true;
    return naplexFigureFitsItem(m, item);
  });
  if (media.length === (ngn.media as unknown[]).length) return ngn;
  if (!media.length) {
    const { media: _drop, ...rest } = ngn;
    return rest;
  }
  return { ...ngn, media };
}
