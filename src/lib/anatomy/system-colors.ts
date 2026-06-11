import type { AnatomySystem } from "./types";

/** Distinct accent colors per organ system — shared by 3D viewer and legacy overlays. */
export const ANATOMY_SYSTEM_COLORS: Record<AnatomySystem, string> = {
  cardiovascular: "#f87171",
  respiratory: "#60a5fa",
  nervous: "#c084fc",
  digestive: "#fbbf24",
  urinary: "#fde047",
  skeletal: "#e7e5e4",
  muscular: "#a8a29e",
  lymphatic: "#34d399",
  endocrine: "#f472b6",
};

/** Blend a base hex color toward a system accent (ratio 0–1). */
export function blendHexColor(base: string, accent: string, ratio: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ] as const;
  };
  const [r1, g1, b1] = parse(base);
  const [r2, g2, b2] = parse(accent);
  const t = Math.max(0, Math.min(1, ratio));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(r1 + (r2 - r1) * t))}${toHex(Math.round(g1 + (g2 - g1) * t))}${toHex(Math.round(b1 + (b2 - b1) * t))}`;
}
