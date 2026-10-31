import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Layout check at a 390px card width. Feed SVGs scale uniformly, so a text
 * box that leaves the viewBox or covers another text box is clipped or
 * overlapping on a phone.
 */
const VIEW_WIDTH = 390;
const CHAR_WIDTH = 0.58;

type Box = { name: string; x: number; y: number; w: number; h: number };

function attr(source: string, name: string): string | undefined {
  return new RegExp(`\\b${name}="([^"]*)"`, "i").exec(source)?.[1];
}

function num(source: string, name: string): number | undefined {
  const value = attr(source, name);
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function decode(value: string): string {
  return value.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
}

function textBoxes(svg: string, scale: number): Box[] {
  const boxes: Box[] = [];
  const pattern = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(svg))) {
    const attrs = match[1] ?? "";
    const inner = match[2] ?? "";
    const size = num(attrs, "font-size") ?? 16;
    const anchor = attr(attrs, "text-anchor") ?? "start";
    const baseX = num(attrs, "x") ?? 0;
    const baseY = num(attrs, "y") ?? 0;
    const tspans = [...inner.matchAll(/<tspan\b([^>]*)>((?:(?!<tspan\b)[\s\S])*?)<\/tspan>/gi)];
    const lines = tspans.length
      ? tspans.map((tspan) => ({
          attrs: tspan[1] ?? "",
          text: decode(tspan[2] ?? ""),
          x: num(tspan[1] ?? "", "x") ?? baseX,
          y: baseY,
        }))
      : [{ attrs: "", text: decode(inner), x: baseX, y: baseY }];
    let y = baseY;
    for (const line of lines) {
      const dy = num(line.attrs, "dy");
      y = dy == null ? line.y : y + dy;
      if (!line.text) continue;
      const width = line.text.length * size * CHAR_WIDTH;
      const left = anchor === "middle" ? line.x - width / 2 : anchor === "end" ? line.x - width : line.x;
      boxes.push({
        name: line.text.slice(0, 42),
        x: left * scale,
        y: (y - size) * scale,
        w: width * scale,
        h: size * scale,
      });
    }
  }
  return boxes;
}

function circleHits(svg: string, scale: number, texts: Box[]): string[] {
  const problems: string[] = [];
  const pattern = /<circle\b([^>]*)\/?>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(svg))) {
    const chunk = match[0];
    if (/display="none"/.test(chunk)) continue;
    const radius = num(match[1] ?? "", "r") ?? 0;
    const fill = attr(match[1] ?? "", "fill") ?? "";
    if (radius < 8 || fill === "transparent" || /\bclass="hit"/.test(match[1] ?? "")) continue;
    const cx = (num(match[1] ?? "", "cx") ?? 0) * scale;
    const cy = (num(match[1] ?? "", "cy") ?? 0) * scale;
    for (const text of texts) {
      const nearestX = Math.max(text.x, Math.min(cx, text.x + text.w));
      const nearestY = Math.max(text.y, Math.min(cy, text.y + text.h));
      const dx = cx - nearestX;
      const dy = cy - nearestY;
      const centerInText = cx >= text.x && cx <= text.x + text.w && cy >= text.y && cy <= text.y + text.h;
      if (text.name.trim().length <= 2 && centerInText) continue;
      if (dx * dx + dy * dy < (radius * scale) ** 2) {
        problems.push(`badge covers "${text.name}"`);
      }
    }
  }
  return problems;
}

function problemsFor(file: string, svg: string): string[] {
  const visibleSvg = svg.replace(/<g\b[^>]*\bdisplay="none"[^>]*>[\s\S]*?<\/g>/gi, "");
  svg = visibleSvg;
  const view = /viewBox="\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"/i.exec(svg);
  const width = view ? Number(view[1]) : num(svg.slice(0, 400), "width");
  const height = view ? Number(view[2]) : num(svg.slice(0, 400), "height");
  if (!width || !height) return ["missing viewBox"];
  const scale = VIEW_WIDTH / width;
  const texts = textBoxes(svg, scale);
  const problems: string[] = [];
  for (const box of texts) {
    if (box.x < -1 || box.y < -1 || box.x + box.w > VIEW_WIDTH + 1 || box.y + box.h > height * scale + 1) {
      problems.push(`clipped "${box.name}"`);
    }
  }
  for (let i = 0; i < texts.length; i += 1) {
    for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i]!;
      const b = texts[j]!;
      const overlapW = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapH = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      const sameLine = Math.abs(a.y - b.y) < 3;
      if (!sameLine && overlapW > 6 && overlapH > 6) problems.push(`overlap "${a.name}" / "${b.name}"`);
    }
  }
  problems.push(...circleHits(svg, scale, texts));
  return problems.map((problem) => `${path.basename(file)}: ${problem}`);
}

const exams = ["pance-feed", "nclex-feed", "naplex-feed", "fnp-feed"] as const;

describe("feed graphics at 390px", () => {
  it("keeps text inside the card and off other text", () => {
    const failures: string[] = [];
    for (const exam of exams) {
      const dir = path.join(process.cwd(), "content", exam, "svg");
      for (const name of readdirSync(dir).filter((file) => file.endsWith(".svg"))) {
        const file = path.join(dir, name);
        const svg = readFileSync(file, "utf8");
        if (!svg.includes('width="420"')) continue;
        failures.push(...problemsFor(file, svg));
      }
    }
    expect(failures.slice(0, 20)).toEqual([]);
  });

  it("hides the question badges that covered the COPD and smear labels", () => {
    for (const id of ["pance-004", "pance-017"]) {
      const svg = readFileSync(path.join(process.cwd(), "content/pance-feed/svg", `${id}.svg`), "utf8");
      expect(svg).toContain('class="q" display="none"');
      expect(svg.replace(/<g\b[^>]*\bdisplay="none"[^>]*>[\s\S]*?<\/g>/gi, "")).not.toContain('class="q"');
    }
  });

  it("does not leave a lowercase serotonin-syndrome step", () => {
    const svg = readFileSync(path.join(process.cwd(), "content/nclex-feed/svg/nclex-140.svg"), "utf8");
    expect(svg).not.toMatch(/>teach early warning signs/);
    expect(svg).toMatch(/Teach early warning signs/);
  });
});
