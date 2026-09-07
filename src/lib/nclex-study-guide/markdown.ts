/**
 * Minimal markdown → HTML for study guide ingest.
 * Intentionally small — headings, paragraphs, lists, images, blockquotes,
 * tables (simple), inline code/bold/italic. Does not invent clinical content.
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

function inlineFormat(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    const a = String(alt);
    const u = String(src).trim();
    return `<img src="${escapeHtml(u)}" alt="${a}" loading="lazy" />`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    return `<a href="${escapeHtml(String(href).trim())}" rel="noopener noreferrer">${inlineFormatPlain(String(label))}</a>`;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  return s;
}

function inlineFormatPlain(text: string): string {
  let s = escapeHtml(text);
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

export function markdownToSimpleHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let inUl = false;
  let inBq = false;

  const closeUl = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
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
      closeUl();
      closeBq();
      i += 1;
      continue;
    }

    // Fenced code skip (keep as pre)
    if (trimmed.startsWith("```")) {
      closeUl();
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

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeUl();
      closeBq();
      out.push("<hr />");
      i += 1;
      continue;
    }

    // Table
    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1] ?? "")
    ) {
      closeUl();
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

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeUl();
      closeBq();
      const level = heading[1]!.length;
      const title = heading[2]!.trim();
      const id = slugify(title);
      out.push(`<h${level} id="${id}">${inlineFormat(title)}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      closeUl();
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
      if (!inUl) {
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${inlineFormat(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      i += 1;
      continue;
    }

    closeUl();
    closeBq();
    out.push(`<p>${inlineFormat(trimmed)}</p>`);
    i += 1;
  }

  closeUl();
  closeBq();
  return out.join("");
}
