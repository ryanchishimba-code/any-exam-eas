/**
 * Scroll every board flashcard feed in WebKit at a 390px iPhone viewport.
 * Mounts the real PanceFeed with the real decks and diagrams.
 *
 * A board fails when the page crashes, the scroll does not reach the end,
 * or the live DOM keeps the whole deck's blurred faces and diagrams mounted.
 * iPhone Safari jetsams that layer count ("A problem repeatedly occurred").
 */
import { createServer, type Server } from "node:http";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { devices, webkit, type Browser, type Page } from "@playwright/test";
import { loadStudyFeedCards, loadStudyFeedSvg, resetPanceFeedCardCache } from "../src/lib/pance-feed/load-cards";
import { STUDY_FEEDS, type StudyFeedExam } from "../src/lib/study-feed/catalog";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const boards = (process.env.FEED_BOARDS?.split(",").filter(Boolean) as StudyFeedExam[] | undefined) ?? [
  "pance",
  "nclex",
  "naplex",
  "aanp-fnp",
];

/** Visible window is 3 cards. Anything near a full deck fails the mobile budget. */
const FACE_BUDGET = 12;
const DIAGRAM_BUDGET = 6;

type Sample = {
  index: number;
  faces: number;
  orbs: number;
  diagrams: number;
  nodes: number;
  rssMb: number;
};

type BoardResult = {
  board: StudyFeedExam;
  cards: number;
  diagramsOnDisk: number;
  crashed: boolean;
  completed: boolean;
  error?: string;
  peakFaces: number;
  peakOrbs: number;
  peakDiagrams: number;
  peakNodes: number;
  peakRssMb: number;
  endFaces: number;
  endDiagrams: number;
  samples: Sample[];
  pass: boolean;
};

function browserPidOf(browser: Browser): number | undefined {
  const proc = (browser as unknown as { process?: unknown }).process;
  try {
    if (typeof proc === "function") return (proc as () => { pid?: number } | null).call(browser)?.pid;
    if (proc && typeof proc === "object" && "pid" in proc) return (proc as { pid?: number }).pid;
  } catch {
    return undefined;
  }
  return undefined;
}

function treeRssMb(pid: number | undefined): number {
  if (!pid) {
    try {
      const out = execSync("ps -eo rss=,cmd=", { encoding: "utf8" });
      let sum = 0;
      for (const line of out.split("\n")) {
        if (/WebKit|MiniBrowser|Playwright/.test(line)) sum += Number(line.trim().split(/\s+/)[0]) || 0;
      }
      return Math.round((sum / 1024) * 10) / 10;
    } catch {
      return 0;
    }
  }
  try {
    const out = execSync("ps -o pid=,ppid=,rss= -ax", { encoding: "utf8" });
    const rows = out
      .trim()
      .split("\n")
      .map((line) => {
        const [p, pp, rss] = line.trim().split(/\s+/);
        return { pid: Number(p), ppid: Number(pp), rss: Number(rss) };
      });
    const children = new Map<number, number[]>();
    const rss = new Map<number, number>();
    for (const row of rows) {
      rss.set(row.pid, row.rss);
      const list = children.get(row.ppid) ?? [];
      list.push(row.pid);
      children.set(row.ppid, list);
    }
    let sum = 0;
    const stack = [pid];
    const seen = new Set<number>();
    while (stack.length) {
      const id = stack.pop();
      if (id == null || seen.has(id)) continue;
      seen.add(id);
      sum += rss.get(id) ?? 0;
      for (const child of children.get(id) ?? []) stack.push(child);
    }
    return Math.round((sum / 1024) * 10) / 10;
  } catch {
    return 0;
  }
}

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("no port"));
        return;
      }
      resolve(address.port);
    });
  });
}

async function metrics(page: Page, index: number, browserPid: number | undefined): Promise<Sample> {
  const dom = await page.evaluate(() => ({
    faces: document.querySelectorAll(".pf-face").length,
    orbs: document.querySelectorAll(".pf-orb").length,
    diagrams: document.querySelectorAll(".pf-dia svg").length,
    nodes: document.querySelectorAll("*").length,
  }));
  return { index, ...dom, rssMb: treeRssMb(browserPid) };
}

async function scrollBoard(browser: Browser, origin: string, exam: StudyFeedExam): Promise<BoardResult> {
  resetPanceFeedCardCache();
  const cards = loadStudyFeedCards(exam);
  const svgs: Record<string, string> = {};
  for (const card of cards) {
    const svg = loadStudyFeedSvg(exam, card.id);
    if (svg) svgs[card.id] = svg;
  }
  const iphone = devices["iPhone 13"];
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: iphone.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    userAgent: iphone.userAgent,
  });
  const logs: string[] = [];
  page.on("pageerror", (error) => logs.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") logs.push(`${msg.type()}: ${msg.text()}`);
  });
  await page.addInitScript((key) => {
    localStorage.setItem(key, "1");
  }, `aee-feed-gesture-hint:${exam}`);
  const browserPid = browserPidOf(browser);

  let crashed = false;
  const onCrash = () => {
    crashed = true;
  };
  page.on("crash", onCrash);
  const result: BoardResult = {
    board: exam,
    cards: cards.length,
    diagramsOnDisk: Object.keys(svgs).length,
    crashed: false,
    completed: false,
    peakFaces: 0,
    peakOrbs: 0,
    peakDiagrams: 0,
    peakNodes: 0,
    peakRssMb: 0,
    endFaces: 0,
    endDiagrams: 0,
    samples: [],
    pass: false,
  };

  const note = (sample: Sample) => {
    result.samples.push(sample);
    result.peakFaces = Math.max(result.peakFaces, sample.faces);
    result.peakOrbs = Math.max(result.peakOrbs, sample.orbs);
    result.peakDiagrams = Math.max(result.peakDiagrams, sample.diagrams);
    result.peakNodes = Math.max(result.peakNodes, sample.nodes);
    result.peakRssMb = Math.max(result.peakRssMb, sample.rssMb);
  };

  try {
    await page.goto(`${origin}/?exam=${exam}`, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForSelector(".pf-q", { timeout: 15_000 });
    note(await metrics(page, 0, browserPid));

    const steps = cards.length;
    for (let index = 0; index <= steps; index += 1) {
      const needsDiagram = index < cards.length && Boolean(svgs[cards[index]!.id]);
      const front = index < cards.length ? cards[index]!.front : "";
      await page.evaluate((target) => {
        const feed = document.querySelector<HTMLElement>(".pf-feed");
        if (!feed) return;
        const slide = feed.querySelectorAll<HTMLElement>(".pf-slide")[target];
        if (!slide) return;
        feed.scrollTop = slide.offsetTop;
        feed.dispatchEvent(new Event("scroll"));
      }, index);
      await page.waitForFunction(
        ({ target, text, diagram }) => {
          const feed = document.querySelector<HTMLElement>(".pf-feed");
          if (!feed) return false;
          const slide = feed.querySelectorAll<HTMLElement>(".pf-slide")[target];
          if (!slide) return false;
          if (Math.abs(feed.scrollTop - slide.offsetTop) > 2) return false;
          if (target >= feed.querySelectorAll(".pf-slide").length - 1) {
            return Boolean(slide.querySelector("h2")?.textContent?.includes("Feed complete"));
          }
          const showing = slide.querySelector(".pf-q")?.textContent ?? "";
          if (showing !== text) return false;
          if (!diagram) return true;
          return Boolean(slide.querySelector(".pf-dia svg"));
        },
        { target: index, text: front, diagram: needsDiagram },
        { timeout: 8_000 }
      );
      if (index === 0 || index === Math.floor(cards.length / 2) || index === cards.length) {
        if (process.env.FEED_SHOTS === "1") {
          await page.screenshot({ path: `/tmp/feed-shot-${exam}-${index}.png` });
        }
        note(await metrics(page, index, browserPid));
      } else if (index % 25 === 0) {
        note(await metrics(page, index, browserPid));
      }
    }
    const end = await metrics(page, steps, browserPid);
    note(end);
    result.endFaces = end.faces;
    result.endDiagrams = end.diagrams;
    result.completed = true;
  } catch (error) {
    let body = "";
    try {
      body = await page.locator("body").innerText({ timeout: 1000 });
    } catch {
      body = "";
    }
    const reason = crashed ? "WebKit page crashed" : error instanceof Error ? error.message : String(error);
    result.error = [reason, logs.join("\n"), body.slice(0, 500)].filter(Boolean).join("\n");
    try {
      note(await metrics(page, -1, browserPid));
    } catch {
      result.crashed = true;
    }
  } finally {
    page.off("crash", onCrash);
    await page.close().catch(() => undefined);
  }

  result.crashed = result.crashed || crashed;
  result.pass =
    result.completed &&
    !result.crashed &&
    result.peakFaces <= FACE_BUDGET &&
    result.peakDiagrams <= DIAGRAM_BUDGET;
  return result;
}

function boardHtml(exam: StudyFeedExam): string {
  resetPanceFeedCardCache();
  const cards = loadStudyFeedCards(exam);
  const svgs: Record<string, string> = {};
  for (const card of cards) {
    const svg = loadStudyFeedSvg(exam, card.id);
    if (svg) svgs[card.id] = svg;
  }
  const boot = JSON.stringify({ exam, cards, svgs }).replace(/</g, "\\u003c");
  const css = fs.readFileSync(path.join(root, "src/components/pance-feed/pance-feed.css"), "utf8");
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style><style>html,body,#root{margin:0;height:100%;background:#04211f}</style></head><body><div id="root"></div><script>window.process={env:{NODE_ENV:"production"}};</script><script>window.__FEED__=${boot}</script><script type="module" src="/harness.js"></script></body></html>`;
}

async function main() {
  const outfile = path.join("/tmp", "feed-harness.js");
  await build({
    absWorkingDir: root,
    entryPoints: [path.join(root, "scripts/feed-memory-entry.tsx")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "browser",
    jsx: "automatic",
    plugins: [
      {
        name: "alias-at",
        setup(b) {
          b.onResolve({ filter: /^@\// }, (args) => {
            const base = path.join(root, "src", args.path.slice(2));
            for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
              if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return { path: candidate };
            }
            return { path: base };
          });
          b.onResolve({ filter: /^next\/link$/ }, () => ({
            path: path.join(root, "scripts/feed-memory-link.tsx"),
          }));
          b.onLoad({ filter: /\.css$/ }, () => ({ contents: "", loader: "js" }));
        },
      },
    ],
  });
  const harnessJs = fs.readFileSync(outfile);
  let pageHtml = "";
  const server = createServer((req, res) => {
    const url = req.url ?? "/";
    if (url.startsWith("/harness.js")) {
      res.setHeader("content-type", "text/javascript");
      res.end(harnessJs);
      return;
    }
    if (url.startsWith("/?")) {
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.end(pageHtml);
      return;
    }
    res.statusCode = 404;
    res.end("not found");
  });
  const port = await listen(server);
  const browser = await webkit.launch({ headless: true });
  const results: BoardResult[] = [];
  for (const exam of boards) {
    pageHtml = boardHtml(exam);
    const board = await scrollBoard(browser, `http://127.0.0.1:${port}`, exam);
    results.push(board);
    console.log(
      JSON.stringify({
        board: board.board,
        pass: board.pass,
        crashed: board.crashed,
        completed: board.completed,
        peakFaces: board.peakFaces,
        peakDiagrams: board.peakDiagrams,
        peakRssMb: board.peakRssMb,
        error: board.error ?? null,
      })
    );
  }
  await browser.close();
  server.close();
  fs.unlinkSync(outfile);
  const outPath = process.argv[2] ?? path.join(root, ".tmp-feed-webkit.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`wrote ${outPath}`);
  if (results.some((board) => !board.pass)) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
