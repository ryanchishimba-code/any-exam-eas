import type { PublicCell } from "@/lib/crossword/types";

export type ShareCardInput = {
  spokenName: string;
  examName: string;
  dateLabel: string;
  elapsedLabel: string;
  streak: number;
  hinted: boolean;
  complete: boolean;
  cells: PublicCell[][];
  hints: Record<string, boolean>;
};

const TEAL = "#0f766e";
const TEAL_SOFT = "#ccfbf1";
const NAVY = "#0a2540";
const INK = "#0f172a";
const MUTED = "#475569";
const PAPER = "#f4fbfa";

export function drawShareCard(input: ShareCardInput, shape: "wide" | "square" = "wide"): HTMLCanvasElement {
  const width = shape === "wide" ? 1200 : 1080;
  const height = shape === "wide" ? 630 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  paintBackdrop(ctx, width, height);
  if (shape === "wide") paintWide(ctx, input, width, height);
  else paintSquare(ctx, input, width, height);
  return canvas;
}

function paintBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8fffd");
  gradient.addColorStop(0.55, PAPER);
  gradient.addColorStop(1, "#e7f6f3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = TEAL;
  ctx.fillRect(0, 0, width, 10);
}

function paintWide(ctx: CanvasRenderingContext2D, input: ShareCardInput, width: number, height: number) {
  const footer = 72;
  drawWordmark(ctx, 64, 48, 56);
  ctx.fillStyle = TEAL;
  ctx.font = font(700, 18);
  ctx.fillText("FREE DAILY CROSSWORD", 64, 148);
  ctx.fillStyle = NAVY;
  const titleSize = input.spokenName.length > 22 ? 40 : 52;
  ctx.font = font(800, titleSize);
  ctx.fillText(input.spokenName, 64, 206);
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 24);
  ctx.fillText(`${input.dateLabel}  ·  ${input.examName}`, 64, 248);

  ctx.fillStyle = NAVY;
  ctx.font = font(800, 64);
  const time = input.complete ? input.elapsedLabel : "—";
  ctx.fillText(time, 64, 360);
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 22);
  ctx.fillText(input.complete ? "Solve time" : "Still solving", 64, 392);

  const streak = `${Math.max(0, input.streak)}-day streak`;
  const hints = input.hinted ? "Used hints" : "No hints";
  ctx.fillStyle = TEAL;
  ctx.font = font(700, 26);
  ctx.fillText(`${streak}   ·   ${hints}`, 64, 450);
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 20);
  ctx.fillText("Spoiler-free. No answers on this card.", 64, 488);

  paintFooter(ctx, width, height, footer);
  const rows = input.cells.length;
  const cols = input.cells[0]?.length ?? 1;
  drawGrid(ctx, input, width - 72 - 340, 118, 340, rows, cols);
}

function paintSquare(ctx: CanvasRenderingContext2D, input: ShareCardInput, width: number, height: number) {
  const footer = 88;
  drawWordmark(ctx, 72, 56, 64);
  ctx.textAlign = "left";
  ctx.fillStyle = TEAL;
  ctx.font = font(700, 20);
  ctx.fillText("FREE DAILY CROSSWORD", 72, 176);
  ctx.fillStyle = NAVY;
  const titleSize = input.spokenName.length > 22 ? 42 : 54;
  ctx.font = font(800, titleSize);
  ctx.fillText(input.spokenName, 72, 242);
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 26);
  ctx.fillText(input.dateLabel, 72, 286);

  ctx.fillStyle = NAVY;
  ctx.font = font(800, 48);
  ctx.fillText(input.complete ? input.elapsedLabel : "In progress", 72, 360);
  ctx.fillStyle = TEAL;
  ctx.font = font(700, 26);
  ctx.fillText(
    `${Math.max(0, input.streak)}-day streak  ·  ${input.hinted ? "Used hints" : "No hints"}`,
    72,
    404,
  );

  const rows = input.cells.length;
  const cols = input.cells[0]?.length ?? 1;
  drawGrid(ctx, input, (width - 420) / 2, 450, 420, rows, cols);
  paintFooter(ctx, width, height, footer);
}

function paintFooter(ctx: CanvasRenderingContext2D, width: number, height: number, footer: number) {
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, height - footer, width, footer);
  ctx.fillStyle = TEAL_SOFT;
  ctx.font = font(700, 22);
  ctx.textAlign = "left";
  ctx.fillText("Practice, not a promise you'll pass", 64, height - footer / 2 + 8);
  ctx.textAlign = "right";
  ctx.fillText("anyexameasy.com/crossword", width - 64, height - footer / 2 + 8);
  ctx.textAlign = "left";
}

function drawWordmark(ctx: CanvasRenderingContext2D, x: number, y: number, mark: number) {
  drawMark(ctx, x, y, mark);
  ctx.fillStyle = NAVY;
  ctx.font = font(800, Math.round(mark * 0.72));
  ctx.textBaseline = "middle";
  ctx.fillText("AnyExamEasy", x + mark + 16, y + mark / 2 + 2);
  ctx.textBaseline = "alphabetic";
}

function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 40, size / 40);
  ctx.fillStyle = TEAL;
  ctx.fill(new Path2D("M6 16.5 20 10l14 6.5-14 6.5L6 16.5Z"));
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 1.8;
  ctx.stroke(new Path2D("M32.5 17.2v7.2c0 2.6-5.4 4.6-12.5 4.6S7.5 27 7.5 24.4v-7.2"));
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D("M14.5 22.2 18.2 26l7.3-8.4"));
  ctx.restore();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  input: ShareCardInput,
  x: number,
  y: number,
  board: number,
  rows: number,
  cols: number,
) {
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x - 28, y - 28, board + 56, board + 56, 28);
  ctx.fill();
  const gap = 4;
  const span = Math.max(rows, cols, 1);
  const cell = (board - gap * (span - 1)) / span;
  const gridW = cols * cell + (cols - 1) * gap;
  const gridH = rows * cell + (rows - 1) * gap;
  const x0 = x + (board - gridW) / 2;
  const y0 = y + (board - gridH) / 2;
  input.cells.forEach((row, r) => {
    row.forEach((cellInfo, c) => {
      const px = x0 + c * (cell + gap);
      const py = y0 + r * (cell + gap);
      ctx.fillStyle = cellInfo.block ? NAVY : input.hints[`${r},${c}`] ? "#fbbf24" : TEAL;
      roundRect(ctx, px, py, cell, cell, 4);
      ctx.fill();
    });
  });
}

function font(weight: number, size: number): string {
  const family =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim()
      : "";
  return `${weight} ${size}px ${family || "Plus Jakarta Sans"}, sans-serif`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
