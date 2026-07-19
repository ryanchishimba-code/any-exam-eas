/**
 * Hard A+ SEO metadata budgets — titles ≤60, descriptions 140–160.
 * Use fitters in builders; assert in tests/CI so lengths cannot regress.
 */

export const SEO_TITLE_MAX = 60;
/** Soft floor — marketing pages should target 50–60; utility pages may be shorter. */
export const SEO_TITLE_MIN = 15;
export const SEO_TITLE_PREFERRED_MIN = 50;
export const SEO_DESC_MAX = 160;
export const SEO_DESC_MIN = 140;

export type MetaBudgetIssue = {
  field: "title" | "description";
  length: number;
  value: string;
  message: string;
};

export function metaTitleLength(title: string): number {
  return title.trim().length;
}

export function metaDescriptionLength(description: string): number {
  return description.trim().length;
}

export function validateMetaTitle(title: string): MetaBudgetIssue | null {
  const value = title.trim();
  const length = value.length;
  if (length > SEO_TITLE_MAX) {
    return {
      field: "title",
      length,
      value,
      message: `title ${length} > ${SEO_TITLE_MAX}`,
    };
  }
  if (length < SEO_TITLE_MIN) {
    return {
      field: "title",
      length,
      value,
      message: `title ${length} < ${SEO_TITLE_MIN}`,
    };
  }
  return null;
}

export function validateMetaDescription(description: string): MetaBudgetIssue | null {
  const value = description.trim();
  const length = value.length;
  if (length > SEO_DESC_MAX) {
    return {
      field: "description",
      length,
      value,
      message: `description ${length} > ${SEO_DESC_MAX}`,
    };
  }
  if (length < SEO_DESC_MIN) {
    return {
      field: "description",
      length,
      value,
      message: `description ${length} < ${SEO_DESC_MIN}`,
    };
  }
  return null;
}

export function assertMetaTitle(title: string, label = "title"): string {
  const issue = validateMetaTitle(title);
  if (issue) {
    throw new Error(`[seo-meta] ${label}: ${issue.message} — "${issue.value}"`);
  }
  return title.trim();
}

export function assertMetaDescription(description: string, label = "description"): string {
  const issue = validateMetaDescription(description);
  if (issue) {
    throw new Error(`[seo-meta] ${label}: ${issue.message} — "${issue.value}"`);
  }
  return description.trim();
}

/**
 * Join priority-ordered parts with a separator, dropping lowest-priority
 * segments from the end until under max length.
 */
export function fitMetaParts(
  parts: string[],
  max: number,
  separator = " — "
): string {
  const cleaned = parts.map((p) => p.trim()).filter(Boolean);
  if (cleaned.length === 0) return "";

  for (let n = cleaned.length; n >= 1; n--) {
    const candidate = cleaned.slice(0, n).join(separator);
    if (candidate.length <= max) return candidate;
  }

  // Last resort: hard truncate at word boundary
  const head = cleaned[0]!;
  if (head.length <= max) return head;
  const cut = head.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 20 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

export function fitMetaTitle(parts: string[], max = SEO_TITLE_MAX): string {
  return fitMetaParts(parts, max, " — ");
}

export function fitMetaDescription(parts: string[], max = SEO_DESC_MAX): string {
  return fitMetaParts(parts, max, " ");
}

/** Enforce budget in builders: throw in test/dev; truncate+warn in production. */
export function enforceMetaTitle(title: string, label = "title"): string {
  const trimmed = title.trim();
  const issue = validateMetaTitle(trimmed);
  if (!issue) return trimmed;

  if (process.env.NODE_ENV === "production" && issue.length > SEO_TITLE_MAX) {
    console.warn(`[seo-meta] ${label}: ${issue.message}; truncating`);
    return fitMetaTitle([trimmed], SEO_TITLE_MAX);
  }
  throw new Error(`[seo-meta] ${label}: ${issue.message} — "${trimmed}"`);
}

export function enforceMetaDescription(description: string, label = "description"): string {
  const trimmed = description.trim();
  const issue = validateMetaDescription(trimmed);
  if (!issue) return trimmed;

  if (process.env.NODE_ENV === "production") {
    if (issue.length > SEO_DESC_MAX) {
      console.warn(`[seo-meta] ${label}: ${issue.message}; truncating`);
      return fitMetaDescription([trimmed], SEO_DESC_MAX);
    }
    if (issue.length < SEO_DESC_MIN) {
      console.warn(`[seo-meta] ${label}: ${issue.message}; padding`);
      return clampMetaDescription(trimmed);
    }
  }
  throw new Error(`[seo-meta] ${label}: ${issue.message} — "${trimmed}"`);
}

const DESC_FILLERS = [
  "Includes Blueprint Roadmaps and Deep Dive review.",
  "Start a free trial — no credit card required.",
  "One Pro plan covers six board exams.",
  "Clinician-built Qbank for NCLEX, USMLE, NAPLEX, PANCE, FNP and NPTE.",
] as const;

/** Clamp title to ≤60 (prefer keeping full string when already in budget). */
export function clampMetaTitle(title: string): string {
  const trimmed = title.trim().replace(/\s+/g, " ");
  if (trimmed.length <= SEO_TITLE_MAX) return trimmed;
  return fitMetaTitle([trimmed], SEO_TITLE_MAX);
}

/**
 * Clamp description into 140–160: truncate when long, append fillers when short.
 * Never leaves an ellipsis mid-sentence — pads with whole words only.
 */
export function clampMetaDescription(description: string): string {
  let d = description.trim().replace(/\s+/g, " ");
  if (d.length > SEO_DESC_MAX) {
    d = fitMetaDescription([d], SEO_DESC_MAX);
  }
  if (d.length >= SEO_DESC_MIN && d.length <= SEO_DESC_MAX) return d;

  const joiner = /[.!?]$/.test(d) ? " " : ". ";
  let out = d;
  for (const filler of DESC_FILLERS) {
    if (out.length >= SEO_DESC_MIN) break;
    const room = SEO_DESC_MAX - out.length - (out === d ? joiner.length : 1);
    if (room < 8) break;
    const prefix = out === d ? joiner : " ";
    if (filler.length <= room) {
      out = `${out}${prefix}${filler}`;
    } else {
      // Take the longest whole-word prefix that fits the remaining room.
      const cut = filler.slice(0, room).replace(/\s+\S*$/, "").trimEnd();
      if (cut.length >= 8) out = `${out}${prefix}${cut}`;
      break;
    }
  }

  if (out.length > SEO_DESC_MAX) out = out.slice(0, SEO_DESC_MAX).replace(/\s+\S*$/, "").trimEnd();
  if (out.length < SEO_DESC_MIN) {
    const room = SEO_DESC_MAX - out.length;
    const need = SEO_DESC_MIN - out.length;
    const pad = " Free trial — no card.";
    out = `${out}${pad.slice(0, Math.min(room, Math.max(need, pad.length)))}`;
    if (out.length < SEO_DESC_MIN && out.length < SEO_DESC_MAX) {
      out = `${out}${" ·".repeat(SEO_DESC_MIN - out.length)}`.slice(0, SEO_DESC_MAX);
    }
  }
  return out.slice(0, SEO_DESC_MAX);
}
