/**
 * Shared SVG building blocks for board-style teaching exhibits.
 * Higher bar: strong contrast, exam-strip grids, one unmistakable teaching point.
 */

export const FIG_FONT =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Classic ECG paper — pink minor / red major grid. */
export function ecgPaper(
  width: number,
  height: number,
  y0 = 0,
  opts?: { dark?: boolean }
): string {
  const minor = 6;
  const lines: string[] = [];
  const minorC = opts?.dark ? "#3f3f46" : "#fecdd3";
  const majorC = opts?.dark ? "#52525b" : "#fb7185";
  for (let x = 0; x <= width; x += minor) {
    const major = x % (minor * 5) === 0;
    lines.push(
      `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + height}" stroke="${major ? majorC : minorC}" stroke-width="${major ? 1.15 : 0.55}"/>`
    );
  }
  for (let y = 0; y <= height; y += minor) {
    const major = y % (minor * 5) === 0;
    lines.push(
      `<line x1="0" y1="${y0 + y}" x2="${width}" y2="${y0 + y}" stroke="${major ? majorC : minorC}" stroke-width="${major ? 1.15 : 0.55}"/>`
    );
  }
  return [
    `<rect x="0" y="${y0}" width="${width}" height="${height}" fill="${opts?.dark ? "#18181b" : "#fff1f2"}"/>`,
    `<g aria-hidden="true">${lines.join("")}</g>`,
  ].join("\n");
}

export function figChrome(
  title: string,
  subtitle: string,
  width: number,
  kind: string
): string {
  return `
  <rect width="${width}" height="56" fill="#0f172a"/>
  <rect x="0" y="0" width="6" height="56" fill="#38bdf8"/>
  <text x="20" y="24" font-family="${FIG_FONT}" font-size="15" font-weight="800" fill="#f8fafc">${title}</text>
  <text x="20" y="44" font-family="${FIG_FONT}" font-size="11" fill="#94a3b8">${subtitle}</text>
  <rect x="${width - 118}" y="16" width="100" height="24" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="${width - 68}" y="32" text-anchor="middle" font-family="${FIG_FONT}" font-size="10" font-weight="700" letter-spacing="0.06em" fill="#94a3b8">${kind}</text>`;
}

export function figFooter(width: number, y: number, cue: string): string {
  return `
  <rect x="12" y="${y - 18}" width="${width - 24}" height="28" rx="8" fill="#f1f5f9" stroke="#e2e8f0"/>
  <text x="24" y="${y}" font-family="${FIG_FONT}" font-size="11" font-weight="600" fill="#0f172a">${cue}</text>
  <text x="${width - 24}" y="${y}" text-anchor="end" font-family="${FIG_FONT}" font-size="9" fill="#94a3b8">AnyExamEasy</text>`;
}

export function badge(
  x: number,
  y: number,
  label: string,
  tone: "danger" | "info" | "ok" | "warn" = "danger"
): string {
  const tones = {
    danger: { fill: "#fef2f2", stroke: "#f87171", text: "#991b1b" },
    info: { fill: "#eff6ff", stroke: "#60a5fa", text: "#1e40af" },
    ok: { fill: "#ecfdf5", stroke: "#34d399", text: "#065f46" },
    warn: { fill: "#fffbeb", stroke: "#fbbf24", text: "#92400e" },
  }[tone];
  const w = Math.max(92, Math.min(280, 14 + label.length * 7.1));
  return `
  <rect x="${x}" y="${y}" width="${w}" height="26" rx="7" fill="${tones.fill}" stroke="${tones.stroke}" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + 17}" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="${tones.text}">${label}</text>`;
}

/** Small calibration corner for ECG strips. */
export function ecgCalib(x: number, y: number): string {
  return `
  <path d="M${x} ${y} h10 v-20 h10 v40 h10 v-20 h10" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <text x="${x}" y="${y + 28}" font-family="${FIG_FONT}" font-size="8" fill="#64748b">25 mm/s</text>`;
}
