/** Small HTML builders for the blog upgrade catalog. Content is authored, not user input. */

export function p(html: string): string {
  return `<p>${html}</p>`;
}

export function h2(text: string): string {
  return `<h2>${text}</h2>`;
}

export function h3(text: string): string {
  return `<h3>${text}</h3>`;
}

export function ul(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

export function ol(items: string[]): string {
  return `<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
}

export function a(href: string, label: string, external = false): string {
  if (external) {
    return `<a href="${href}" rel="noopener noreferrer">${label}</a>`;
  }
  return `<a href="${href}">${label}</a>`;
}

export function table(headers: string[], rows: string[][]): string {
  const head = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
  const body = `<tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<div class="aee-blog-table-wrap"><table>${head}${body}</table></div>`;
}

export function faq(items: { q: string; a: string }[]): string {
  const blocks = items.map((item) => `${h3(item.q)}${p(item.a)}`).join("");
  return `<section class="aee-faq">${h2("Frequently asked questions")}${blocks}</section>`;
}

export function wordsInHtml(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").length;
}

/** About 230 words a minute, matching a careful read of short paragraphs. */
export function readMinutes(html: string): number {
  return Math.max(1, Math.round(wordsInHtml(html) / 230));
}
