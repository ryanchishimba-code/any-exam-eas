/**
 * Student-facing citations. A title is always shown. A link is shown when the
 * bank stored an http(s) URL.
 */

export type StudyCitation = {
  title: string;
  url?: string;
};

const URL_IN_TEXT = /https?:\/\/[^\s)]+/i;

export function safeCitationUrl(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function titleBesideUrl(text: string, url: string): string {
  const stripped = text
    .replace(url, "")
    .replace(URL_IN_TEXT, "")
    .replace(/[\s·|–—,:;-]+$/g, "")
    .replace(/^[\s·|–—,:;-]+/g, "")
    .trim();
  return stripped || url;
}

export function parseStudyCitation(value: unknown): StudyCitation | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text || /^references:?$/i.test(text)) return null;
    const found = text.match(URL_IN_TEXT)?.[0];
    const url = safeCitationUrl(found);
    if (!url) return { title: text };
    return { title: titleBesideUrl(text, found ?? url), url };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const label = typeof record.label === "string" ? record.label.trim() : "";
  const citation = typeof record.citation === "string" ? record.citation.trim() : "";
  const titleField = typeof record.title === "string" ? record.title.trim() : "";
  const title =
    titleField ||
    (label && citation && !label.includes(citation) ? `${label} · ${citation}` : label || citation);
  if (!title) return null;
  const url = safeCitationUrl(typeof record.url === "string" ? record.url : undefined);
  return url ? { title, url } : { title };
}

export function studyCitationsFromList(values: unknown): StudyCitation[] {
  if (!Array.isArray(values)) return [];
  const out: StudyCitation[] = [];
  const indexByTitle = new Map<string, number>();
  for (const value of values) {
    const citation = parseStudyCitation(value);
    if (!citation?.title) continue;
    const key = citation.title.toLowerCase();
    const existing = indexByTitle.get(key);
    if (existing == null) {
      indexByTitle.set(key, out.length);
      out.push(citation);
      continue;
    }
    if (!out[existing]?.url && citation.url) out[existing] = citation;
  }
  return out;
}

/** References on the item, plus the provenance line when it is not already listed. */
export function visibleStudyCitations(input: {
  citations?: StudyCitation[] | null;
  references?: unknown;
  sourceLabel?: string | null;
  sourceUrl?: string | null;
}): StudyCitation[] {
  const listed = studyCitationsFromList([...(input.citations ?? []), ...(Array.isArray(input.references) ? input.references : [])]);
  const label = input.sourceLabel?.trim() ?? "";
  if (!label) return listed;
  const url = safeCitationUrl(input.sourceUrl);
  const key = label.toLowerCase();
  if (listed.some((row) => row.title.toLowerCase() === key || (url && row.url === url))) {
    return listed.map((row) => (row.title.toLowerCase() === key && !row.url && url ? { ...row, url } : row));
  }
  return [...listed, url ? { title: label, url } : { title: label }];
}
