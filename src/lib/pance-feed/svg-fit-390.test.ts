import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { describe, expect, it } from "vitest";
import { languageProblems, type CardCopy } from "./svg-fit-rules";

/**
 * Every feed card is rendered at 390px. Text that leaves the graphic or its
 * box, a line that stops mid-clause, and a step that starts in lowercase fail.
 * Before this round, 366 cards failed the sentence check and 4 more overflowed
 * a box. The count after the redraw is zero.
 */

type CardFile = { id: string; svg: string | null; copy: CardCopy };

function loadCards(): CardFile[] {
  const cards: CardFile[] = [];
  const root = path.join(process.cwd(), "content");
  for (const exam of ["pance-feed", "nclex-feed", "naplex-feed", "fnp-feed"]) {
    const folder = path.join(root, exam, "cards");
    for (const name of readdirSync(folder).filter((file) => file.endsWith(".json"))) {
      const data = JSON.parse(readFileSync(path.join(folder, name), "utf8")) as Array<{
        id?: string;
        front?: string;
        bottom?: string;
        bullets?: { clue?: string; treat?: string; trap?: string };
        diagram?: { file?: string } | null;
      }>;
      if (!Array.isArray(data)) continue;
      for (const card of data) {
        if (!card?.id) continue;
        const bullets = card.bullets ?? {};
        const file = card.diagram?.file;
        const svgPath = file ? path.join(root, exam, file) : path.join(root, exam, "svg", `${card.id}.svg`);
        let svg: string | null = null;
        try {
          svg = readFileSync(svgPath, "utf8");
        } catch {
          svg = file ? "" : null;
        }
        cards.push({
          id: card.id,
          svg,
          copy: {
            front: card.front ?? "",
            bottom: card.bottom ?? "",
            clue: bullets.clue ?? "",
            treat: bullets.treat ?? "",
            trap: bullets.trap ?? "",
          },
        });
      }
    }
  }
  return cards;
}

async function launch(): Promise<Browser> {
  try {
    return await chromium.launch({ headless: true });
  } catch {
    return chromium.launch({
      headless: true,
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
  }
}

async function overflowLines(page: Page, svg: string): Promise<string[]> {
  return page.evaluate(async (source) => {
    const host = document.getElementById("host");
    if (!host) return ["missing host"];
    host.innerHTML = source.replace("<svg", "<svg style=\"width:390px;height:auto;display:block\"");
    const root = host.querySelector("svg");
    if (!root) return ["missing svg"];
    const box = root.getBoundingClientRect();
    const rects = [...root.querySelectorAll("rect")]
      .map((node) => node.getBoundingClientRect())
      .filter((rect) => rect.width > 24 && rect.height > 18 && rect.width < box.width - 2);
    const problems: string[] = [];
    root.querySelectorAll("text").forEach((node) => {
      for (const line of node.getClientRects()) {
        if (line.width < 1 || line.height < 1) continue;
        const outside =
          line.left < box.left - 1 ||
          line.right > box.right + 1 ||
          line.top < box.top - 1 ||
          line.bottom > box.bottom + 1;
        const anchorX = line.left + Math.min(6, line.width / 2);
        const anchorY = line.top + line.height / 2;
        const container = rects
          .filter(
            (rect) =>
              anchorX >= rect.left &&
              anchorX <= rect.right &&
              anchorY >= rect.top &&
              anchorY <= rect.bottom,
          )
          .sort((a, b) => a.width * a.height - b.width * b.height)[0];
        const spills =
          container &&
          (line.right > container.right + 3 ||
            line.bottom > container.bottom + 3 ||
            line.left < container.left - 3);
        if (outside || spills) problems.push((node.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60));
      }
    });

    function lum(hex: string): number {
      const raw = hex.replace("#", "");
      const full = raw.length === 3 ? raw.split("").map((ch) => ch + ch).join("") : raw.slice(0, 6);
      const channels = [0, 2, 4].map((index) => {
        const channel = parseInt(full.slice(index, index + 2), 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
    }
    const probe = root.cloneNode(true) as SVGSVGElement;
    probe.querySelectorAll("text,tspan").forEach((node) => node.setAttribute("fill", "none"));
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(probe)], { type: "image/svg+xml;charset=utf-8" }));
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("svg image"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.ceil(box.width));
    canvas.height = Math.max(1, Math.ceil(box.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) return problems;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    root.querySelectorAll("text").forEach((node) => {
      const painted = [...node.querySelectorAll("[fill]")].find((el) => (el.getAttribute("fill") || "").startsWith("#")) || node;
      const fill = painted.getAttribute("fill") || node.getAttribute("fill") || "";
      if (!fill.startsWith("#")) return;
      const size = parseFloat(node.getAttribute("font-size") || "16");
      const weight = parseInt(node.getAttribute("font-weight") || painted.getAttribute("font-weight") || "400", 10);
      const minimum = size >= 24 || (weight >= 700 && size >= 18.67) ? 3 : 4.5;
      const line = [...node.getClientRects()].find((rect) => rect.width > 2 && rect.height > 2);
      if (!line) return;
      const x = Math.min(canvas.width - 1, Math.max(0, Math.round(line.left - box.left + 3)));
      const y = Math.min(canvas.height - 1, Math.max(0, Math.round(line.top - box.top + line.height / 2)));
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const bg = `#${[pixel[0]!, pixel[1]!, pixel[2]!].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
      const ratio = (Math.max(lum(fill), lum(bg)) + 0.05) / (Math.min(lum(fill), lum(bg)) + 0.05);
      if (ratio + 0.05 < minimum) {
        problems.push(`contrast ${(node.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40)}`);
      }
    });
    return problems;
  }, svg);
}

describe("feed graphics at 390px", () => {
  it("keeps every card's text inside the graphic and in finished sentences", async () => {
    const cards = loadCards();
    expect(cards).toHaveLength(800);
    const language: string[] = [];
    const graphics = cards.filter((card) => card.svg);
    for (const card of cards) {
      if (card.svg === "") language.push(`${card.id}: missing graphic`);
    }
    for (const card of graphics) {
      if (!card.svg) continue;
      for (const problem of languageProblems(card.svg, card.copy)) language.push(`${card.id}: ${problem}`);
    }
    expect(language).toEqual([]);

    const browser = await launch();
    const page = await browser.newPage({ viewport: { width: 420, height: 800 } });
    await page.setContent("<div id='host'></div>");
    const overflow: string[] = [];
    try {
      for (const card of graphics) {
        if (!card.svg) continue;
        const lines = await overflowLines(page, card.svg);
        for (const line of lines) overflow.push(`${card.id}: ${line}`);
      }
    } finally {
      await browser.close();
    }
    expect(overflow).toEqual([]);
  }, 180000);

  it("hides the question badges that covered the COPD and smear labels", () => {
    for (const id of ["pance-004", "pance-017"]) {
      const svg = readFileSync(path.join(process.cwd(), "content/pance-feed/svg", `${id}.svg`), "utf8");
      expect(svg).toContain('class="q" display="none"');
      expect(svg.replace(/<g\b[^>]*\bdisplay="none"[^>]*>[\s\S]*?<\/g>/gi, "")).not.toContain('class="q"');
    }
  });
});
