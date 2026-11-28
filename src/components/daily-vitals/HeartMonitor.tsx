import { ecgPath } from "@/lib/daily-vitals/wave";
import type { MonitorReading } from "@/lib/daily-vitals/vitals";

const COLOR = {
  alarm: "#F45B69",
  warn: "#FFC400",
  ok: "#00B8A9",
} as const;

export function HeartMonitor({ reading }: { reading: MonitorReading }) {
  const color = COLOR[reading.tone];
  const intensity = reading.tone === "alarm" ? 1 : reading.tone === "warn" ? 0.62 : 0.34;
  const path = ecgPath(340, 64, intensity);

  return (
    <div className={`dv-mon ${reading.tone}`} aria-live="polite">
      <svg viewBox="0 0 340 64" preserveAspectRatio="none" aria-hidden="true">
        <path d={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="dv-stat">
        <div className="k">HR</div>
        <div className="v">{reading.hr}</div>
        <div className="s">{reading.label}</div>
      </div>
    </div>
  );
}
