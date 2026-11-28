/** Server-side HTML tweaks. Crawlers see the same markup the browser paints. */

export function demoteDocumentH1(html: string): string {
  return html.replace(/<h1\b/, "<h2").replace(/<\/h1>/, "</h2>");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Fill a missing or tiny alt with the figure file name and the guide phrase. */
export function withDescriptiveAlts(html: string, query: string): string {
  return html.replace(/<img\b([^>]*)>/g, (tag, attrs: string) => {
    const alt = /alt="([^"]*)"/.exec(attrs)?.[1]?.trim() ?? "";
    if (alt.length >= 8) return tag;
    const src = /src="([^"]+)"/.exec(attrs)?.[1] ?? "";
    const name = decodeURIComponent(src.split("/").pop() ?? "diagram")
      .replace(/\.(svg|png|webp|jpe?g|gif)$/i, "")
      .replace(/[-_]+/g, " ")
      .trim();
    const next = `${query} diagram: ${name || "figure"}`;
    if (/alt="/.test(attrs)) return tag.replace(/alt="[^"]*"/, `alt="${escapeAttr(next)}"`);
    return tag.replace("<img", `<img alt="${escapeAttr(next)}"`);
  });
}

/** Group each H2 and the content under it so a card can hold the section. */
export function wrapGuideSections(html: string): string {
  const parts = html.split(/(?=<h2\b)/);
  return parts
    .map((part) => {
      if (!part.startsWith("<h2")) return part;
      const heading = part.slice(0, 240);
      const kind = /pitfall|trap|mistake|avoid/i.test(heading)
        ? "pitfall"
        : /high-yield|must know|pearl|tip|highlight/i.test(heading)
          ? "tip"
          : "section";
      return `<section class="psg-card psg-card--${kind}">${part}</section>`;
    })
    .join("");
}

const TOC_SKIP =
  /study-aid|disclaimer|how to use this|table of contents|pairing with|reference book|front matter|back matter|read this/i;

/** Book headings become guide headings. The id stays so in-page links keep working. */
export function retitleGuideHeadings(html: string): string {
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g, (full, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const next = text
      .replace(/^\s*chapter\s+\d+\s*[—–:-]\s*/i, "")
      .replace(/\s*\(part\s+[ivx0-9]+\)\s*/gi, " ")
      .replace(/\s*\(plain english\)\s*/gi, "")
      .replace(/\bthis book\b/gi, "this guide")
      .replace(/\bthis chapter\b/gi, "this section")
      .replace(/\bthe book\b/gi, "the guide")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!next || next === text) return full;
    return `<h2${attrs}>${escapeAttr(next)}</h2>`;
  });
}

export function guideSectionToc(html: string): { id: string; text: string }[] {
  const items: { id: string; text: string }[] = [];
  for (const match of html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
    const text = (match[2] ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!match[1] || !text || TOC_SKIP.test(text) || text.length > 72) continue;
    items.push({ id: match[1], text });
  }
  return items.slice(0, 16);
}

function callout(kind: "tip" | "pitfall" | "remember", inner: string): string {
  const label = kind === "tip" ? "High-yield" : kind === "pitfall" ? "Pitfall" : "Important to remember";
  return `<aside class="psg-callout psg-callout--${kind}"><p class="psg-callout__label">${label}</p>${inner}</aside>`;
}

/** A quote that is only dashed lines becomes a real list inside the box. */
function rememberBody(inner: string): string {
  const stripped = inner
    .replace(/<p>\s*<strong>\s*Important to remember:?\s*<\/strong>\s*<\/p>/gi, "")
    .replace(/(<p>\s*)<strong>\s*Important to remember:?\s*<\/strong>\s*/gi, "$1");
  const paragraphs = [...stripped.matchAll(/<p>([\s\S]*?)<\/p>/gi)].map((match) => match[1] ?? "");
  const filled = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
  const items = filled.filter((paragraph) => /^[-–]\s+/.test(paragraph.replace(/<[^>]+>/g, "")));
  if (items.length >= 1 && items.length === filled.length) {
    const list = items.map((paragraph) => `<li>${paragraph.replace(/^[-–]\s+/, "")}</li>`).join("");
    return `<ul>${list}</ul>`;
  }
  return stripped;
}

/** Turn the manuscript's labeled quotes into callout boxes. */
export function promoteCallouts(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (full, inner: string) => {
    if (/important to remember/i.test(inner)) return callout("remember", rememberBody(inner));
    if (/trap|pitfall|avoid/i.test(inner)) return callout("pitfall", inner);
    if (/must know|highlight|high-yield|pearl/i.test(inner)) return callout("tip", inner);
    return full;
  });
}

/** Keep wide comparison tables scrollable without collapsing the columns. */
export function scrollableTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => `<div class="sg-table-scroll">${table}</div>`);
}

export function readingMinutes(html: string, extra = ""): number {
  const words = `${html.replace(/<[^>]+>/g, " ")} ${extra}`.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "182 min read" becomes "About 3 hours to read". Under an hour stays in minutes. */
export function readingTimeLabel(minutes: number): string {
  const hours = Math.round(minutes / 60);
  if (hours >= 1) return hours === 1 ? "About 1 hour to read" : `About ${hours} hours to read`;
  const count = Math.max(1, minutes);
  return count === 1 ? "About 1 minute to read" : `About ${count} minutes to read`;
}

export function presentGuideHtml(html: string, query: string): string {
  return scrollableTables(
    wrapGuideSections(
      promoteCallouts(withDescriptiveAlts(retitleGuideHeadings(demoteDocumentH1(html)), query))
    )
  );
}
