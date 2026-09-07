/**
 * NAPLEX teaching SVG payloads — high-contrast pharmacy exhibits.
 * Purpose: one unmistakable teaching cue per figure.
 */
import { svgDataUri } from "../exhibit-figure";
import { badge, FIG_FONT, figChrome, figFooter } from "../figure-svg";
import { INSULIN_PEAK_CHART } from "../nclex/figure-svgs";

/** Re-export NCLEX insulin timing chart for pharmacy catalog (same teaching cue). */
export { INSULIN_PEAK_CHART as NAPLEX_INSULIN_TIMING };

export const INHALER_MDI_STEPS = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 340" role="img" aria-label="MDI inhaler counseling steps">
  ${figChrome("Inhaler counseling — MDI", "Teach technique · spacer improves delivery", 760, "DEVICE")}
  <rect x="0" y="56" width="760" height="284" fill="#f8fafc"/>

  ${[
    { x: 16, n: "1", title: "Shake", sub: "5–10 sec upright", fill: "#ecfdf5", stroke: "#10b981", ink: "#065f46" },
    { x: 140, n: "2", title: "Exhale", sub: "away from device", fill: "#eff6ff", stroke: "#3b82f6", ink: "#1e40af" },
    { x: 264, n: "3", title: "Seal + press", sub: "lips · actuate once", fill: "#f5f3ff", stroke: "#8b5cf6", ink: "#5b21b6" },
    { x: 388, n: "4", title: "Inhale slow", sub: "deep over 3–5 s", fill: "#fff7ed", stroke: "#f97316", ink: "#9a3412" },
    { x: 512, n: "5", title: "Hold", sub: "10 sec if able", fill: "#fef2f2", stroke: "#ef4444", ink: "#991b1b" },
    { x: 636, n: "6", title: "Rinse", sub: "if ICS · spit", fill: "#f0fdf4", stroke: "#22c55e", ink: "#166534" },
  ]
    .map(
      (s) => `
  <g transform="translate(${s.x},78)">
    <rect width="112" height="168" rx="14" fill="${s.fill}" stroke="${s.stroke}" stroke-width="2"/>
    <circle cx="56" cy="36" r="18" fill="#fff" stroke="${s.stroke}" stroke-width="2"/>
    <text x="56" y="42" text-anchor="middle" font-family="${FIG_FONT}" font-size="16" font-weight="900" fill="${s.ink}">${s.n}</text>
    <text x="56" y="88" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="${s.ink}">${s.title}</text>
    <text x="56" y="112" text-anchor="middle" font-family="${FIG_FONT}" font-size="10" font-weight="600" fill="${s.ink}">${s.sub}</text>
  </g>`
    )
    .join("")}

  ${badge(20, 262, "Wait 30–60 s between puffs of same MDI", "info")}
  ${figFooter(760, 322, "DPI: do NOT shake · quick deep inhale · never exhale into device")}
</svg>
`);

export const VANCO_TDM_PATHWAY = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 370" role="img" aria-label="Vancomycin TDM trough and AUC action pathway">
  ${figChrome("Vancomycin TDM", "Level → interpret → act · teaching pathway", 760, "TDM")}
  <rect x="0" y="56" width="760" height="314" fill="#f8fafc"/>

  <rect x="220" y="72" width="320" height="50" rx="12" fill="#0f172a"/>
  <text x="380" y="94" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="#f8fafc">Steady-state trough / AUC</text>
  <text x="380" y="112" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#94a3b8">Draw trough before next dose (or AUC per protocol)</text>

  <path d="M380 122 V148" stroke="#64748b" stroke-width="3"/>
  <rect x="250" y="148" width="260" height="42" rx="10" fill="#fff" stroke="#2563eb" stroke-width="2"/>
  <text x="380" y="174" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="#1e40af">Within target?</text>

  <path d="M250 169 H120 V200" stroke="#64748b" stroke-width="3" fill="none"/>
  <path d="M510 169 H640 V200" stroke="#64748b" stroke-width="3" fill="none"/>
  <text x="160" y="164" font-family="${FIG_FONT}" font-size="12" font-weight="900" fill="#b91c1c">NO</text>
  <text x="560" y="164" font-family="${FIG_FONT}" font-size="12" font-weight="900" fill="#047857">YES</text>

  <rect x="30" y="200" width="220" height="100" rx="12" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
  <text x="140" y="228" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#991b1b">Low → underdosed</text>
  <text x="140" y="252" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#7f1d1d">↑ dose or shorten interval</text>
  <text x="140" y="276" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#b91c1c">Recheck per protocol</text>

  <rect x="270" y="200" width="220" height="100" rx="12" fill="#fff7ed" stroke="#f97316" stroke-width="2"/>
  <text x="380" y="228" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#9a3412">High → toxicity risk</text>
  <text x="380" y="252" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#9a3412">Hold / ↓ dose / stretch</text>
  <text x="380" y="276" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#c2410c">Check SCr · red man ≠ level</text>

  <rect x="510" y="200" width="220" height="100" rx="12" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="620" y="228" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#065f46">On target</text>
  <text x="620" y="252" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#047857">Continue regimen</text>
  <text x="620" y="276" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#059669">Monitor renal + levels</text>

  ${figFooter(760, 352, "Serious MRSA: AUC/MIC ~400–600 preferred when available · follow facility protocol")}
</svg>
`);

export const HIGH_ALERT_INSULIN = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" role="img" aria-label="ISMP high-alert insulin order verification">
  ${figChrome("High-alert — insulin order", "ISMP · independent double-check before dispense/admin", 700, "ISMP")}
  <rect x="0" y="56" width="700" height="344" fill="#f1f5f9"/>

  <rect x="20" y="72" width="660" height="248" rx="14" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
  <rect x="20" y="72" width="660" height="44" fill="#ea580c"/>
  <text x="36" y="100" font-family="${FIG_FONT}" font-size="15" font-weight="900" fill="#fff">HIGH-ALERT  ·  pharmacist + nurse double-check</text>

  <text x="36" y="148" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Patient</text>
  <text x="130" y="148" font-family="${FIG_FONT}" font-size="14" font-weight="700" fill="#0f172a">Rivera, Alex  ·  DOB 03/04/1979  ·  MRN 77102</text>

  <rect x="28" y="162" width="644" height="52" rx="10" fill="#fff7ed" stroke="#fb923c" stroke-width="1.5"/>
  <text x="44" y="184" font-family="${FIG_FONT}" font-size="12" fill="#9a3412">Drug / concentration</text>
  <text x="44" y="206" font-family="${FIG_FONT}" font-size="17" font-weight="900" fill="#0f172a">Insulin glargine U-100 · 28 units HS</text>

  <text x="36" y="244" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Verify</text>
  <text x="130" y="244" font-family="${FIG_FONT}" font-size="13" font-weight="700" fill="#0f172a">Product · concentration · dose · route · indication</text>

  <text x="36" y="276" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Trap</text>
  <text x="130" y="276" font-family="${FIG_FONT}" font-size="13" font-weight="700" fill="#b91c1c">U-500 ≠ U-100 · never abbreviate “U”</text>

  ${badge(400, 168, "Check current BG / A1c context", "warn")}
  ${figFooter(700, 382, "Before release: right patient + product + concentration + dose")}
</svg>
`);

export const CRCL_FORMULA_CARD = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" role="img" aria-label="Cockcroft-Gault creatinine clearance formula card">
  ${figChrome("CrCl — Cockcroft-Gault", "Estimate clearance for renal dose adjustment", 760, "CALC")}
  <rect x="0" y="56" width="760" height="264" fill="#f8fafc"/>

  <rect x="24" y="76" width="712" height="120" rx="14" fill="#fff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="40" y="108" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#0f172a">CrCl (mL/min) ≈</text>
  <text x="40" y="142" font-family="${FIG_FONT}" font-size="18" font-weight="900" fill="#1e40af">(140 − age) × weight(kg)</text>
  <text x="40" y="172" font-family="${FIG_FONT}" font-size="18" font-weight="900" fill="#1e40af">÷ (72 × SCr mg/dL)   × 0.85 if female</text>

  <rect x="24" y="212" width="230" height="56" rx="10" fill="#eff6ff" stroke="#60a5fa"/>
  <text x="139" y="236" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#1e40af">Use IBW or AdjBW</text>
  <text x="139" y="256" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#2563eb">per drug / obesity protocol</text>

  <rect x="266" y="212" width="230" height="56" rx="10" fill="#ecfdf5" stroke="#34d399"/>
  <text x="381" y="236" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#065f46">Stable SCr only</text>
  <text x="381" y="256" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#047857">AKI → mistrust estimate</text>

  <rect x="508" y="212" width="228" height="56" rx="10" fill="#fef2f2" stroke="#f87171"/>
  <text x="622" y="236" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#991b1b">Round doses safely</text>
  <text x="622" y="256" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#b91c1c">Match available strengths</text>
</svg>
`);
