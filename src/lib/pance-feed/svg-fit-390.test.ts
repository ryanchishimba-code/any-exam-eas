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
  return page.evaluate((source) => {
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
