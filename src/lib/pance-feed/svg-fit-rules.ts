/**
 * Sentence-level checks for feed SVGs. Wrapping a finished sentence across
 * lines is fine. A line that stops mid-clause, a step that starts in lowercase,
 * or a heading cut shorter than its title is not.
 */

const DANGLING = new Set([
  "a",
  "an",
  "the",
  "to",
  "of",
  "for",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "that",
  "who",
  "which",
  "and",
  "or",
  "but",
  "if",
  "as",
  "into",
  "than",
  "via",
  "per",
  "every",
  "their",
  "its",
  "whose",
  "your",
]);

const STOP = new Set([
  ...DANGLING,
  "plus",
  "then",
  "not",
  "be",
  "is",
  "are",
  "was",
  "were",
  "this",
  "these",
  "those",
]);

export type CardCopy = {
  front: string;
  bottom: string;
  clue: string;
  treat: string;
  trap: string;
};

type Block = { x: number; y: number; text: string };

function decode(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9%≤≥±.'’-]+/g) ?? [];
}

function attr(source: string, name: string): number {
  const match = new RegExp(`\\b${name}="([\\d.-]+)"`).exec(source);
  return match ? Number(match[1]) : 0;
}

function visibleSvg(svg: string): string {
  return svg.replace(/<g\b[^>]*\bdisplay="none"[^>]*>[\s\S]*?<\/g>/gi, "");
}

export function textBlocks(svg: string): string[] {
  const blocks: Block[] = [];
  const pattern = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
  let match: RegExpExecArray | null;
  const source = visibleSvg(svg);
  while ((match = pattern.exec(source))) {
    const attrs = match[1] ?? "";
    const inner = match[2] ?? "";
    const spans = [...inner.matchAll(/<tspan\b[^>]*>([^<]*)<\/tspan>/gi)]
      .map((span) => decode(span[1] ?? ""))
      .filter((text) => text && !/^\d$/.test(text));
    const parts = spans.length ? spans : [decode(inner)].filter((text) => text && !/^\d$/.test(text));
    if (!parts.length) continue;
    blocks.push({ x: attr(attrs, "x"), y: attr(attrs, "y"), text: parts.join(" ") });
  }
  const lines: Block[] = [];
  const sorted = [...blocks].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const block of sorted) {
    const line = lines.find((item) => Math.abs(item.y - block.y) <= 4 && Math.abs(item.x - block.x) < 100);
    if (line) {
      line.text = block.x >= line.x ? `${line.text} ${block.text}` : `${block.text} ${line.text}`;
    } else {
      lines.push({ ...block });
    }
  }
  lines.sort((a, b) => a.y - b.y || a.x - b.x);
  const merged: Block[] = [];
  for (const block of lines) {
    const previous = merged[merged.length - 1];
    if (previous && Math.abs(block.x - previous.x) <= 8 && block.y - previous.y > 0 && block.y - previous.y <= 28) {
      previous.text = `${previous.text} ${block.text}`;
      previous.y = block.y;
    } else {
      merged.push({ ...block });
    }
  }
  return merged.map((block) => block.text);
}

function sourceSentences(copy: CardCopy | null): string[][] {
  if (!copy) return [];
  return [copy.clue, copy.treat, copy.trap].filter(Boolean).map(tokens);
}

function unfinishedPrefix(block: string, copy: CardCopy | null, svgText: string): boolean {
  const own = tokens(block);
  if (own.length < 4) return false;
  const present = new Set(tokens(svgText));
  for (const source of sourceSentences(copy)) {
    if (source.length <= own.length || source.slice(0, own.length).join(" ") !== own.join(" ")) continue;
    const rest = source.slice(own.length).filter((token) => token.length > 3 && !STOP.has(token));
    if (rest.some((token) => !present.has(token))) return true;
  }
  return false;
}

function stepStarts(svg: string): string[] {
  const source = visibleSvg(svg);
  const circles: Array<{ x: number; y: number }> = [];
  for (const match of source.matchAll(/<circle\b([^>]*)\/?>/gi)) {
    const attrs = match[1] ?? "";
    if (/transparent/i.test(attrs) || /\bclass="hit"/.test(attrs)) continue;
    const radius = attr(attrs, "r");
    if (radius < 8 || radius > 18) continue;
    circles.push({ x: attr(attrs, "cx"), y: attr(attrs, "cy") });
  }
  const problems: string[] = [];
  for (const match of source.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)) {
    const attrs = match[1] ?? "";
    const inner = match[2] ?? "";
    const first = decode(
      /<tspan\b[^>]*>([^<]*)<\/tspan>/i.exec(inner)?.[1] ?? inner,
    );
    if (!/^[a-z]/.test(first)) continue;
    const x = attr(attrs, "x");
    const y = attr(attrs, "y");
    if (circles.some((circle) => x - circle.x > 6 && x - circle.x < 140 && Math.abs(y - circle.y) < 18)) {
      problems.push(first);
    }
  }
  return problems;
}

export function languageProblems(svg: string, copy: CardCopy | null): string[] {
  const problems: string[] = [];
  const plain = !svg.includes('class="v3"');
  const svgText = textBlocks(svg).join(" ");
  for (const block of textBlocks(svg)) {
    const words = tokens(block);
    if (!words.length) continue;
    if (words.length === 1 && (words[0]!.length <= 2 || words[0] === "or")) continue;
    if (/\b(A|B|OR)$/.test(block.trim())) continue;
    const last = words[words.length - 1]!.replace(/[^a-z0-9]+/g, "");
    const finished = /[.!?)]$/.test(block.trim()) || /:\s*$/.test(block.trim());
    if (!finished && (block.trim().endsWith(",") || block.trim().endsWith(";") || DANGLING.has(last))) {
      problems.push(`fragment "${block.slice(0, 80)}"`);
    } else if (/^(and|or|but)\b/i.test(block) && words.length <= 6 && block.trim() !== block.trim().toUpperCase()) {
      problems.push(`fragment "${block.slice(0, 80)}"`);
    } else if (plain && unfinishedPrefix(block, copy, svgText)) {
      problems.push(`truncated "${block.slice(0, 80)}"`);
    }
  }
  for (const step of stepStarts(svg)) problems.push(`lowercase step "${step.slice(0, 60)}"`);
  const title = decode(/<title[^>]*>([^<]+)<\/title>/i.exec(svg)?.[1] ?? "");
  const titleTokens = tokens(title);
  if (titleTokens.length > 4) {
    for (const block of textBlocks(svg).slice(0, 3)) {
      const own = tokens(block);
      if (own.length >= 4 && titleTokens.length > own.length && titleTokens.slice(0, own.length).join(" ") === own.join(" ")) {
        problems.push(`title cut "${block.slice(0, 80)}"`);
        break;
      }
    }
  }
  return problems;
}
