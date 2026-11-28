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

export function presentGuideHtml(html: string, query: string): string {
  return wrapGuideSections(withDescriptiveAlts(demoteDocumentH1(html), query));
}
