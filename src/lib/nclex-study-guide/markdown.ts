/**
 * Minimal markdown → HTML for study guide ingest.
 * Headings (h1–h6), paragraphs, ul/ol, images, blockquotes, tables,
 * inline code/bold/italic. Does not invent clinical content.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function inlineFormatPlain(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  return s;
}

function inlineFormat(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    const a = escapeHtml(String(alt));
    const u = escapeHtml(String(src).trim());
    return `<img src="${u}" alt="${a}" loading="eager" decoding="async" />`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    return `<a href="${escapeHtml(String(href).trim())}" rel="noopener noreferrer">${inlineFormatPlain(String(label))}</a>`;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  return s;
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line.trim());
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

export type MarkdownImageSize = { width: number; height: number };

export type MarkdownOptions = {
  /**
   * Intrinsic size for an image `src`. When supplied, `width`/`height` are
   * stamped onto the tag so the browser reserves the right box before the file
   * loads — without it, every figure reflows the chapter as it decodes.
   */
  imageSize?: (src: string) => MarkdownImageSize | undefined;
};

/**
 * One pass over the emitted <img> tags: stamp intrinsic dimensions, and hand
 * every figure after the first to the lazy loader.
 */
function finalizeImages(html: string, imageSize?: MarkdownOptions["imageSize"]): string {
  let seen = 0;
  return html.replace(/<img\s+[^>]*?src="([^"]+)"[^>]*?\/>/g, (match, src: string) => {
    seen += 1;

    // Only the lead figure is worth blocking on. Eager-loading the rest makes a
    // six-figure chapter fetch and decode everything at once, which competes
    // with the main thread exactly when the reader starts scrolling.
    let tag = seen === 1 ? match : match.replace('loading="eager"', 'loading="lazy"');

    const size = imageSize?.(src);
    if (size) {
      tag = tag.replace(
        /\s*\/>$/,
        ` width="${size.width}" height="${size.height}" class="sg-img--sized" />`
      );
    }
    return tag;
  });
}

export function markdownToSimpleHtml(md: string, opts?: MarkdownOptions): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let inUl = false;
  let inOl = false;
  let inBq = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };
  const closeBq = () => {
    if (inBq) {
      out.push("</blockquote>");
      inBq = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      closeLists();
      closeBq();
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      closeLists();
      closeBq();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        code.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeLists();
      closeBq();
      out.push("<hr />");
      i += 1;
      continue;
    }

    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1] ?? "")
    ) {
      closeLists();
      closeBq();
      const header = parseTableRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? "").includes("|") && (lines[i] ?? "").trim()) {
        rows.push(parseTableRow(lines[i] ?? ""));
        i += 1;
      }
      out.push("<table><thead><tr>");
      for (const h of header) out.push(`<th>${inlineFormat(h)}</th>`);
      out.push("</tr></thead><tbody>");
      for (const row of rows) {
        out.push("<tr>");
        for (const cell of row) out.push(`<td>${inlineFormat(cell)}</td>`);
        out.push("</tr>");
      }
      out.push("</tbody></table>");
      continue;
    }

    const onlyImg = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
    if (onlyImg) {
      closeLists();
      closeBq();
      const alt = onlyImg[1] ?? "";
      const src = String(onlyImg[2] ?? "").trim();
      out.push(
        `<figure class="sg-figure"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="eager" decoding="async" />` +
          (alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : "") +
          `</figure>`
      );
      i += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeLists();
      closeBq();
      const level = heading[1]!.length;
      const title = heading[2]!.trim();
      const id = slugify(title);
      out.push(`<h${level} id="${id}">${inlineFormat(title)}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      closeLists();
      if (!inBq) {
        out.push("<blockquote>");
        inBq = true;
      }
      out.push(`<p>${inlineFormat(trimmed.replace(/^>\s?/, ""))}</p>`);
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      closeBq();
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        out.push("<ul>");
        inUl = true;
      }
      const item = trimmed.replace(/^[-*]\s+/, "");
      const task = /^\[([ xX])\]\s+(.*)$/.exec(item);
      if (task) {
        const checked = task[1]!.toLowerCase() === "x";
        out.push(
          `<li class="sg-task" data-checked="${checked ? "1" : "0"}">${inlineFormat(task[2] ?? "")}</li>`
        );
      } else {
        out.push(`<li>${inlineFormat(item)}</li>`);
      }
      i += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      closeBq();
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${inlineFormat(trimmed.replace(/^\d+\.\s+/, ""))}</li>`);
      i += 1;
      continue;
    }

    closeLists();
    closeBq();
    out.push(`<p>${inlineFormat(trimmed)}</p>`);
    i += 1;
  }

  closeLists();
  closeBq();
  return finalizeImages(out.join(""), opts?.imageSize);
}
