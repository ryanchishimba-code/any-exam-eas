/**
 * Visible source treatment for citations already in a chapter.
 * Does not add sources that are not in the HTML.
 */

const AUTHORITY_HOST =
  /(?:^|\.)(?:ncsbn\.org|cdc\.gov|heart\.org|aha\.org|nabp\.pharmacy|nih\.gov|fda\.gov|who\.int|ncbi\.nlm\.nih\.gov|uspreventiveservicestask\.org|fsbpt\.org|nccpa\.net|aanpcert\.org)$/i;

function hostOf(href: string): string | null {
  try {
    return new URL(href, "https://anyexameasy.com").hostname;
  } catch {
    return null;
  }
}

export function isAuthorityCitationHref(href: string): boolean {
  const host = hostOf(href);
  return Boolean(host && AUTHORITY_HOST.test(host));
}

function markSourceLinks(html: string): string {
  return html.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    const hrefMatch = /\bhref="([^"]+)"/i.exec(attrs);
    if (!hrefMatch || !isAuthorityCitationHref(hrefMatch[1] ?? "")) return full;
    if (/\bsg-source-link\b/.test(attrs)) return full;
    if (/\bclass="/i.test(attrs)) {
      return `<a${attrs.replace(/\bclass="/i, 'class="sg-source-link ')}>`;
    }
    return `<a class="sg-source-link"${attrs}>`;
  });
}

function paragraphIsCitation(inner: string): boolean {
  const text = inner
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return false;
  if (/official source|source of truth|^source:/i.test(text)) return true;
  if (!/sg-source-link/.test(inner)) return false;
  // A short paragraph that exists to point at a source, not a clinical passage
  // that happens to mention a guideline.
  return text.length <= 280;
}

/**
 * Mark authority links and short source paragraphs already present in chapter HTML.
 * Idempotent: a second pass does not nest classes.
 */
export function presentChapterCitations(html: string): string {
  if (!html || html.includes("sg-citation")) {
    return markSourceLinks(html);
  }
  const linked = markSourceLinks(html);
  return linked.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs: string, inner: string) => {
    if (/\bsg-citation\b/.test(attrs) || /\bsg-offer\b/.test(attrs)) return full;
    if (!paragraphIsCitation(inner)) return full;
    if (/\bclass="/i.test(attrs)) {
      return `<p${attrs.replace(/\bclass="/i, 'class="sg-citation ')}>${inner}</p>`;
    }
    return `<p class="sg-citation"${attrs}>${inner}</p>`;
  });
}
