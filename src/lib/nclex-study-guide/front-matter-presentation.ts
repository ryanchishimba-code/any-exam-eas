/**
 * Opening-spread layout for an already-ingested front-matter chapter.
 *
 * The stored HTML stays the manuscript (ingest is unchanged). This only
 * rearranges that HTML so the cover, title, and the existing trial sentence
 * share the first screen. Offer wording is not rewritten. Clinical chapters
 * must not be passed in — call `presentFrontMatter` only for `front-matter`.
 */

const COVER_RE =
  /<figure class="sg-figure">\s*<img\b[^>]*\balt="[^"]*cover"[^>]*\/?>\s*(?:<figcaption>[\s\S]*?<\/figcaption>\s*)?<\/figure>/i;

function sectionBounds(
  html: string,
  idPrefix: string
): { start: number; end: number } | null {
  const re = new RegExp(`<h2\\b[^>]*\\bid="${idPrefix}[^"]*"[^>]*>`, "i");
  const match = re.exec(html);
  if (!match) return null;
  const start = match.index;
  const from = start + match[0].length;
  const next = html.slice(from).search(/<h2\b/i);
  return { start, end: next === -1 ? html.length : from + next };
}

/** Drop a separator rule that belongs to the following heading, not this block. */
function withoutTrailingHr(html: string, start: number, end: number): number {
  const tail = html.slice(start, end).match(/\s*<hr\s*\/?>\s*$/i);
  return tail ? end - tail[0].length : end;
}

/** The rule sitting directly above a heading is a section divider — remove it with the move. */
function withoutLeadingHr(html: string, start: number): number {
  const lead = html.slice(0, start).match(/<hr\s*\/?>\s*$/i);
  return lead ? start - lead[0].length : start;
}

function withOfferClass(paragraph: string): string {
  // Only the opening <p> — a search <mark class> inside the sentence must stay a hit.
  return paragraph.replace(/^<p\b([^>]*)>/i, (_match, attrs: string) => {
    if (/\bclass="/.test(attrs)) {
      return `<p${attrs.replace(/\bclass="/, 'class="sg-offer ')}>`;
    }
    return `<p class="sg-offer"${attrs}>`;
  });
}

/**
 * Lift the trial sentence out of the pairing section so it can sit under the
 * title. The heading and comparison table stay together, words unchanged.
 */
function takeOffer(sectionHtml: string): { offer: string; rest: string } {
  const paragraphs = sectionHtml.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi);
  for (const paragraph of paragraphs) {
    if (!/\$27\.99|free trial|soft cta|start free/i.test(paragraph[0])) continue;
    if (paragraph.index == null) break;
    return {
      offer: withOfferClass(paragraph[0]),
      rest:
        sectionHtml.slice(0, paragraph.index) +
        sectionHtml.slice(paragraph.index + paragraph[0].length),
    };
  }
  return { offer: "", rest: sectionHtml };
}

function markCover(figureHtml: string): string {
  if (figureHtml.includes("sg-cover")) return figureHtml;
  return figureHtml.replace('class="sg-figure"', 'class="sg-figure sg-cover"');
}

/**
 * Build the opening spread. Returns the input unchanged when the chapter
 * doesn't have the cover + how-to-use + pairing trio (so a partial manuscript
 * can't lose a section).
 */
export function presentFrontMatter(html: string): string {
  if (!html || html.includes("sg-front-spread")) return html;

  const cover = COVER_RE.exec(html);
  const howTo = sectionBounds(html, "how-to-use-this-book");
  const pairing = sectionBounds(html, "pairing-with-anyexameasy");
  if (!cover || !howTo || !pairing || !/<h1\b/i.test(html)) {
    if (cover && !cover[0].includes("sg-cover")) {
      return html.replace(cover[0], markCover(cover[0]));
    }
    return html;
  }

  const ranges = [
    {
      start: cover.index,
      end: cover.index + cover[0].length,
      keep: markCover(cover[0]),
      kind: "cover" as const,
    },
    {
      start: withoutLeadingHr(html, howTo.start),
      end: withoutTrailingHr(html, howTo.start, howTo.end),
      keep: html.slice(howTo.start, withoutTrailingHr(html, howTo.start, howTo.end)),
      kind: "how" as const,
    },
    {
      start: withoutLeadingHr(html, pairing.start),
      end: withoutTrailingHr(html, pairing.start, pairing.end),
      keep: html.slice(pairing.start, withoutTrailingHr(html, pairing.start, pairing.end)),
      kind: "pair" as const,
    },
  ].sort((a, b) => a.start - b.start);

  for (let i = 1; i < ranges.length; i += 1) {
    if (ranges[i]!.start < ranges[i - 1]!.end) return html;
  }

  let rest = "";
  let cursor = 0;
  let coverHtml = "";
  let howHtml = "";
  let pairHtml = "";
  for (const range of ranges) {
    rest += html.slice(cursor, range.start);
    if (range.kind === "cover") coverHtml = range.keep;
    else if (range.kind === "how") howHtml = range.keep;
    else pairHtml = range.keep;
    cursor = range.end;
  }
  rest += html.slice(cursor);

  const h1 = /<h1\b[^>]*>[\s\S]*?<\/h1>/i.exec(rest);
  if (!h1) return html;
  const afterH1 = h1.index + h1[0].length;
  const subtitle = /^\s*(<p\b[^>]*>[\s\S]*?<\/p>)/i.exec(rest.slice(afterH1));
  let scan = subtitle ? afterH1 + subtitle[0].length : afterH1;
  const meta: string[] = [];
  let nextMeta = /^\s*(<p\b[^>]*>[\s\S]*?<\/p>)/i.exec(rest.slice(scan));
  while (nextMeta) {
    meta.push(nextMeta[1]!);
    scan += nextMeta[0].length;
    nextMeta = /^\s*(<p\b[^>]*>[\s\S]*?<\/p>)/i.exec(rest.slice(scan));
  }

  const { offer, rest: pairingRest } = takeOffer(pairHtml);
  const copy = `${h1[0]}${subtitle?.[1] ?? ""}${offer}${pairingRest}${howHtml}`;
  const metaHtml = meta.length
    ? `<div class="sg-front-spread__meta">${meta.join("")}</div>`
    : "";
  const spread =
    `<div class="sg-front-spread">` +
    `<div class="sg-front-spread__copy">${copy}</div>` +
    `<div class="sg-front-spread__side">${coverHtml}${metaHtml}</div>` +
    `</div>`;
  const remainder = rest.slice(0, h1.index) + rest.slice(scan);
  return spread + remainder;
}
