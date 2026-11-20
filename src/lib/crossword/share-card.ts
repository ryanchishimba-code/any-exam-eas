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
const TEAL_DEEP = "#0d9488";
const NAVY = "#0f172a";
const MUTED = "#475569";
const INK = "#0f172a";

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
  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, "#f0fdfa");
  base.addColorStop(0.45, "#f8fafc");
  base.addColorStop(1, "#ffffff");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const orbA = ctx.createRadialGradient(width * 0.18, height * 0.12, 0, width * 0.18, height * 0.12, 280);
  orbA.addColorStop(0, "rgba(20, 184, 166, 0.22)");
  orbA.addColorStop(1, "rgba(20, 184, 166, 0)");
  ctx.fillStyle = orbA;
  ctx.fillRect(0, 0, width, height);

  const orbB = ctx.createRadialGradient(width * 0.88, height * 0.2, 0, width * 0.88, height * 0.2, 240);
  orbB.addColorStop(0, "rgba(56, 189, 248, 0.16)");
  orbB.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = orbB;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(13, 148, 136, 0.045)";
  ctx.lineWidth = 1;
  for (let x = 48; x < width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 48; y < height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function paintWide(ctx: CanvasRenderingContext2D, input: ShareCardInput, width: number, height: number) {
  const footer = 72;
  drawWordmark(ctx, 72, 52, 52);
  const pillW = 248;
  glassPill(ctx, 72, 124, pillW, 36);
  ctx.fillStyle = TEAL;
  ctx.font = font(700, 13);
  ctx.fillText("FREE DAILY CROSSWORD", 90, 148);

  ctx.fillStyle = NAVY;
  const titleSize = input.spokenName.length > 22 ? 40 : 52;
  ctx.font = font(800, titleSize);
  ctx.fillText(input.spokenName, 72, 214);
  ctx.fillStyle = MUTED;
  ctx.font = font(500, 22);
  ctx.fillText(`${input.dateLabel}  ·  ${input.examName}`, 72, 252);

  ctx.fillStyle = NAVY;
  ctx.font = font(800, 68);
  const time = input.complete ? input.elapsedLabel : "—";
  ctx.fillText(time, 72, 348);
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 16);
  ctx.fillText(input.complete ? "Solve time" : "Still solving", 74, 376);

  const streak = `${Math.max(0, input.streak)}-day streak`;
  const hints = input.hinted ? "Used hints" : "No hints";
  const chip = `${streak}   ·   ${hints}`;
  ctx.font = font(600, 18);
  const chipW = ctx.measureText(chip).width + 36;
  gradientPill(ctx, 72, 398, chipW, 40);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(chip, 90, 424);

  ctx.fillStyle = MUTED;
  ctx.font = font(500, 18);
  ctx.fillText("Spoiler-free. No answers on this card.", 72, 470);

  paintFooter(ctx, width, height, footer);
  const rows = input.cells.length;
  const cols = input.cells[0]?.length ?? 1;
  drawGrid(ctx, input, width - 80 - 300, 108, 300, rows, cols);
}

function paintSquare(ctx: CanvasRenderingContext2D, input: ShareCardInput, width: number, height: number) {
  const footer = 88;
  drawWordmark(ctx, 80, 64, 56);
  glassPill(ctx, 80, 148, 260, 38);
  ctx.fillStyle = TEAL;
  ctx.font = font(700, 14);
  ctx.fillText("FREE DAILY CROSSWORD", 100, 173);

  ctx.fillStyle = NAVY;
  const titleSize = input.spokenName.length > 22 ? 44 : 56;
  ctx.font = font(800, titleSize);
  ctx.fillText(input.spokenName, 80, 252);
  ctx.fillStyle = MUTED;
  ctx.font = font(500, 24);
  ctx.fillText(input.dateLabel, 80, 296);

  const time = input.complete ? input.elapsedLabel : "In progress";
  ctx.fillStyle = NAVY;
  ctx.font = font(800, 48);
  ctx.fillText(time, 80, 372);
  const chip = `${Math.max(0, input.streak)}-day streak  ·  ${input.hinted ? "Used hints" : "No hints"}`;
  ctx.font = font(600, 18);
  const chipW = Math.min(ctx.measureText(chip).width + 40, width - 160);
  gradientPill(ctx, 80, 392, chipW, 42);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(chip, 100, 419);

  const rows = input.cells.length;
  const cols = input.cells[0]?.length ?? 1;
  drawGrid(ctx, input, (width - 460) / 2, 470, 460, rows, cols);
  paintFooter(ctx, width, height, footer);
}

function paintFooter(ctx: CanvasRenderingContext2D, width: number, height: number, footer: number) {
  const y = height - footer;
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillRect(0, y, width, footer);
  ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.fillStyle = MUTED;
  ctx.font = font(500, 18);
  ctx.textAlign = "left";
  ctx.fillText("Practice, not a promise you'll pass", 72, y + footer / 2 + 6);
  ctx.fillStyle = TEAL_DEEP;
  ctx.font = font(600, 18);
  ctx.textAlign = "right";
  ctx.fillText("anyexameasy.com/crossword", width - 72, y + footer / 2 + 6);
  ctx.textAlign = "left";
}

function drawWordmark(ctx: CanvasRenderingContext2D, x: number, y: number, mark: number) {
  ctx.save();
  ctx.shadowColor = "rgba(13, 148, 136, 0.18)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  roundRect(ctx, x - 8, y - 6, mark + 16, mark + 12, 18);
  ctx.fill();
  ctx.restore();
  drawMark(ctx, x, y, mark);
  ctx.fillStyle = NAVY;
  ctx.font = font(800, Math.round(mark * 0.62));
  ctx.textBaseline = "middle";
  ctx.fillText("AnyExamEasy", x + mark + 18, y + mark / 2 + 1);
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

function glassPill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.shadowColor = "rgba(13, 148, 136, 0.12)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(13, 148, 136, 0.22)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.stroke();
}

function gradientPill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, "#14b8a6");
  gradient.addColorStop(0.55, "#0d9488");
  gradient.addColorStop(1, "#0891b2");
  ctx.save();
  ctx.shadowColor = "rgba(13, 148, 136, 0.28)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = gradient;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
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
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.1)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x - 28, y - 28, board + 56, board + 56, 32);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(15, 23, 42, 0.06)";
  roundRect(ctx, x - 28, y - 28, board + 56, board + 56, 32);
  ctx.stroke();

  const gap = 5;
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
      if (cellInfo.block) {
        ctx.fillStyle = "#0f172a";
      } else if (input.hints[`${r},${c}`]) {
        ctx.fillStyle = "#fbbf24";
      } else {
        const cellGradient = ctx.createLinearGradient(px, py, px, py + cell);
        cellGradient.addColorStop(0, "#2dd4bf");
        cellGradient.addColorStop(1, "#0d9488");
        ctx.fillStyle = cellGradient;
      }
      roundRect(ctx, px, py, cell, cell, 5);
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
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
