/**
 * Shared stem exhibit figure ref — USMLE and NCLEX catalogs use the same shape.
 * Only reviewStatus=approved assets should reach the study UI.
 */
export type ExhibitFigureKind =
  | "ecg"
  | "cxr"
  | "histo"
  | "gross"
  | "pathway"
  | "lab_panel"
  | "diagram"
  | "fetal_strip"
  | "med_label"
  | "insulin_chart"
  | "ppe"
  | "wound";

export type ExhibitFigureRef = {
  id: string;
  kind: ExhibitFigureKind;
  /** data: SVG or https CDN URL */
  url: string;
  alt: string;
  caption?: string;
  license: string;
  sourceNote: string;
  /** Organ system or NCLEX client-needs bucket */
  organSystem: string;
  topics: string[];
  reviewStatus: "draft" | "approved" | "rejected";
  reviewedAt?: string;
};

export function attachFigureRefToNgn(
  ngn: Record<string, unknown>,
  figure: ExhibitFigureRef
): Record<string, unknown> {
  const media = Array.isArray(ngn.media) ? [...(ngn.media as ExhibitFigureRef[])] : [];
  if (media.some((m) => m.id === figure.id)) return ngn;
  media.push(figure);
  return {
    ...ngn,
    media,
  };
}

export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}
