import { DAILY_VITALS_SHARE_LABEL } from "@/lib/daily-vitals/schedule";
import type { TileMark } from "@/lib/daily-vitals/types";
import { ecgPath } from "@/lib/daily-vitals/wave";

export type ShareCardInput = {
  format: "story" | "square";
  boardLabel: string;
  dayNumber: number;
  streak: number;
  solved: boolean;
  guessesUsed: number;
  marks: TileMark[][];
  clue: string;
  legalLines: string[];
  fontFamily: string;
};

const NAVY = "#0B1B3A";
const TEAL = "#00B8A9";
const GOLD = "#FFC400";
const INK = "#F4F7FB";
const MUTED = "#8B9BB8";
const TILE_NAVY = "#243A66";

export function shareCardSize(format: ShareCardInput["format"]): { width: number; height: number } {
  return format === "story" ? { width: 1080, height: 1920 } : { width: 1080, height: 1080 };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawShareCard(ctx: CanvasRenderingContext2D, input: ShareCardInput) {
  const { width, height } = shareCardSize(input.format);
  const story = input.format === "story";
  const font = input.fontFamily || "Inter, Arial, sans-serif";
  const pad = story ? 80 : 64;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width / 2, story ? 520 : 280, 40, width / 2, story ? 520 : 280, 520);
  glow.addColorStop(0, "rgba(0,184,169,0.22)");
  glow.addColorStop(1, "rgba(0,184,169,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(0,184,169,0.05)";
  ctx.lineWidth = 1;
  for (let y = 0; y < height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  let y = story ? 110 : 64;
  ctx.font = `600 18px ${font}`;
  const easy = "EASY";
  const anyExam = "ANYEXAM";
  const easyWidth = ctx.measureText(easy).width;
  const anyWidth = ctx.measureText(anyExam).width;
  const brandX = width / 2 - (anyWidth + easyWidth) / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.fillText(anyExam, brandX, y);
  ctx.fillStyle = TEAL;
  ctx.fillText(easy, brandX + anyWidth, y);

  y += story ? 64 : 46;
  ctx.font = `700 ${story ? 52 : 40}px ${font}`;
  const title = "DAILY VITALS";
  const dot = ".";
  const titleWidth = ctx.measureText(title).width;
  const dotWidth = ctx.measureText(dot).width;
  const titleX = width / 2 - (titleWidth + dotWidth) / 2;
  ctx.fillStyle = INK;
  ctx.fillText(title, titleX, y);
  ctx.fillStyle = TEAL;
  ctx.fillText(dot, titleX + titleWidth, y);
  ctx.textAlign = "center";

  y += story ? 36 : 28;
  const chips = [`${input.boardLabel}`, `DAY ${input.dayNumber}`];
  if (!story && input.streak > 0) chips.push(`${input.streak}-DAY STREAK`);
  drawChips(ctx, chips, width / 2, y, font);
  y += story ? 28 : 18;

  const waveH = story ? 220 : 100;
  ctx.save();
  ctx.translate(0, y);
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = story ? 6 : 4;
  ctx.shadowColor = "rgba(0,184,169,0.7)";
  ctx.shadowBlur = 16;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke(new Path2D(ecgPath(width, waveH, input.solved ? 0.34 : 0.7)));
  ctx.restore();
  y += waveH + (story ? 10 : 0);

  ctx.textAlign = "center";
  ctx.fillStyle = input.solved ? TEAL : GOLD;
  ctx.font = `700 ${story ? 20 : 16}px ${font}`;
  ctx.fillText(input.solved ? "PATIENT STABLE" : "STILL UNSTABLE", width / 2, y);
  y += story ? 36 : 26;
  ctx.fillStyle = INK;
  ctx.font = `650 ${story ? 28 : 20}px ${font}`;
  ctx.fillText(input.solved ? "SAVED IN" : "MISSED IN", width / 2, y);
  y += story ? 188 : 92;
  const score = input.solved ? String(input.guessesUsed) : "6";
  const scorePx = story ? 200 : 96;
  const sidePx = story ? 108 : 52;
  ctx.font = `800 ${scorePx}px ${font}`;
  ctx.fillStyle = TEAL;
  ctx.shadowColor = "rgba(0,184,169,0.45)";
  ctx.shadowBlur = 24;
  const scoreWidth = ctx.measureText(score).width;
  ctx.font = `500 ${sidePx}px ${font}`;
  const slashWidth = ctx.measureText("/").width;
  ctx.font = `700 ${sidePx}px ${font}`;
  const sixWidth = ctx.measureText("6").width;
  ctx.font = `800 ${scorePx}px ${font}`;
  const total = scoreWidth + slashWidth + sixWidth + 16;
  let x = width / 2 - total / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = TEAL;
  ctx.fillText(score, x, y);
  x += scoreWidth + 8;
  const sideY = y - (scorePx - sidePx) * 0.34;
  ctx.font = `500 ${sidePx}px ${font}`;
  ctx.fillStyle = "rgba(244,247,251,0.28)";
  ctx.shadowBlur = 0;
  ctx.fillText("/", x, sideY);
  x += slashWidth + 8;
  ctx.font = `700 ${sidePx}px ${font}`;
  ctx.fillStyle = "rgba(244,247,251,0.82)";
  ctx.fillText("6", x, sideY);
  ctx.shadowBlur = 0;
  ctx.textAlign = "center";

  y += story ? 64 : 44;
  if (input.streak > 0) {
    ctx.fillStyle = GOLD;
    ctx.font = `700 ${story ? 26 : 20}px ${font}`;
    ctx.fillText(`🔥  ${input.streak}-DAY STREAK`, width / 2, y);
    y += story ? 36 : 28;
  }

  const cols = input.marks[0]?.length ?? 5;
  const rows = input.marks.length;
  const gap = story ? 14 : 10;
  const maxTile = story ? (rows > 4 ? 96 : 120) : rows > 4 ? 52 : rows > 3 ? 64 : 78;
  const tile = Math.min(maxTile, Math.floor((width - pad * 2 - gap * (cols - 1)) / cols));
  const gridW = cols * tile + (cols - 1) * gap;
  y += 8;
  ctx.fillStyle = MUTED;
  ctx.font = `700 ${story ? 14 : 13}px ${font}`;
  ctx.fillText("TODAY'S GUESSES", width / 2, y);
  y += story ? 22 : 16;
  input.marks.forEach((row, rowIndex) => {
    row.forEach((mark, col) => {
      const tx = width / 2 - gridW / 2 + col * (tile + gap);
      const ty = y + rowIndex * (tile + gap);
      paintTile(ctx, tx, ty, tile, mark, rowIndex === rows - 1 && input.solved);
    });
  });
  y += rows * (tile + gap) + (story ? 20 : 10);

  const boxW = width - pad * 2;
  ctx.font = `500 ${story ? 26 : 18}px ${font}`;
  const clueLines = wrap(ctx, input.clue, boxW - 56).slice(0, story ? 4 : 3);
  const boxH = (story ? 78 : 58) + clueLines.length * (story ? 34 : 24);
  roundRect(ctx, pad, y, boxW, boxH, story ? 24 : 16);
  ctx.fillStyle = "rgba(20,45,90,0.92)";
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.fillRect(pad, y + 16, 4, boxH - 32);
  ctx.textAlign = "left";
  ctx.fillStyle = GOLD;
  ctx.font = `700 ${story ? 13 : 12}px ${font}`;
  ctx.fillText("TODAY'S CASE", pad + 24, y + (story ? 36 : 28));
  ctx.fillStyle = INK;
  ctx.font = `500 ${story ? 26 : 18}px ${font}`;
  clueLines.forEach((line, index) => {
    ctx.fillText(line, pad + 24, y + (story ? 74 : 54) + index * (story ? 34 : 24));
  });
  y += boxH + (story ? 36 : 18);

  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `700 ${story ? 42 : 32}px ${font}`;
  ctx.fillText("Can you beat me?", width / 2, y);
  y += story ? 40 : 30;
  ctx.fillStyle = TEAL;
  ctx.font = `650 ${story ? 26 : 22}px ${font}`;
  ctx.fillText(DAILY_VITALS_SHARE_LABEL, width / 2, y);

  ctx.fillStyle = MUTED;
  ctx.font = `500 ${story ? 16 : 14}px ${font}`;
  const legalY = height - (story ? 72 : 48);
  input.legalLines.slice(0, 2).forEach((line, index) => {
    ctx.fillText(line, width / 2, legalY + index * (story ? 22 : 18));
  });
}

function drawChips(ctx: CanvasRenderingContext2D, labels: string[], center: number, y: number, font: string) {
  ctx.font = `650 16px ${font}`;
  const pads = labels.map((label) => ctx.measureText(label).width + 36);
  const gap = 12;
  const total = pads.reduce((sum, width) => sum + width, 0) + gap * (labels.length - 1);
  let x = center - total / 2;
  labels.forEach((label, index) => {
    const w = pads[index]!;
    const gold = label.includes("STREAK");
    const teal = label.includes("®") || label.startsWith("NCLEX") || label.startsWith("NAPLEX") || label.startsWith("PANCE");
    roundRect(ctx, x, y - 16, w, 36, 18);
    ctx.fillStyle = gold ? "rgba(255,196,0,0.12)" : teal ? "rgba(0,184,169,0.12)" : "rgba(20,45,90,0.7)";
    ctx.fill();
    ctx.strokeStyle = gold ? "rgba(255,196,0,0.35)" : teal ? "rgba(0,184,169,0.35)" : "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = gold ? GOLD : teal ? TEAL : "#C5D0E4";
    ctx.textAlign = "center";
    ctx.fillText(label, x + w / 2, y + 6);
    x += w + gap;
  });
}

function paintTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  mark: TileMark,
  lastRow: boolean,
) {
  roundRect(ctx, x, y, size, size, Math.max(12, size * 0.16));
  if (mark === "correct") {
    const g = ctx.createLinearGradient(x, y, x, y + size);
    g.addColorStop(0, "#1CD4C4");
    g.addColorStop(1, "#00A094");
    ctx.fillStyle = g;
    ctx.shadowColor = lastRow ? "rgba(0,184,169,0.85)" : "rgba(0,184,169,0.55)";
    ctx.shadowBlur = lastRow ? 28 : 16;
  } else if (mark === "present") {
    const g = ctx.createLinearGradient(x, y, x, y + size);
    g.addColorStop(0, "#FFD54A");
    g.addColorStop(1, "#E0AC00");
    ctx.fillStyle = g;
    ctx.shadowColor = "rgba(255,196,0,0.45)";
    ctx.shadowBlur = 12;
  } else {
    ctx.fillStyle = TILE_NAVY;
    ctx.shadowBlur = 0;
  }
  ctx.fill();
  ctx.shadowBlur = 0;
}
