/**
 * USMLE teaching SVG payloads — high-contrast board-style exhibits.
 * One unmistakable teaching cue per figure; waveforms favor exam recognition over realism.
 */
import { svgDataUri } from "../exhibit-figure";
import {
  badge,
  ecgCalib,
  ecgPaper,
  FIG_FONT,
  figChrome,
  figFooter,
} from "../figure-svg";

/** One NSR beat: P → QRS → T starting at (x, baselineY). */
function nsrBeat(x: number, y: number): string {
  return `M${x} ${y}
    L${x + 10} ${y} L${x + 18} ${y - 14} L${x + 28} ${y}
    L${x + 36} ${y} L${x + 42} ${y + 8} L${x + 50} ${y - 78} L${x + 58} ${y + 42} L${x + 68} ${y}
    L${x + 82} ${y} L${x + 98} ${y - 22} L${x + 118} ${y}`;
}

export const ECG_ANTERIOR_STEMI = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" role="img" aria-label="Anterior STEMI ECG with clear ST elevation in V2–V4 pattern">
  ${figChrome("ECG — anterior STEMI", "Leads V2–V4 · ST segment stays UP after the QRS", 760, "ECG")}
  ${ecgPaper(760, 204, 56)}
  ${ecgCalib(18, 220)}

  <!-- Two clear “tombstone” STEMI beats + neighbors -->
  <path d="M70 220
    L95 220 L105 206 L118 220 L128 145 L142 255 L155 200
    L155 145 L210 138 L225 200 L240 220
    L275 220 L285 206 L298 220 L308 130 L322 260 L335 188
    L335 128 L400 120 L418 188 L435 220
    L475 220 L485 206 L498 220 L508 138 L522 255 L535 200
    L535 145 L590 138 L605 200 L620 220
    L680 220"
    fill="none" stroke="#0f172a" stroke-width="2.9" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- Highlight elevated ST plateaus -->
  <path d="M155 200 L155 145 L210 138 L225 200" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>
  <path d="M335 188 L335 128 L400 120 L418 188" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>

  <line x1="155" y1="220" x2="155" y2="145" stroke="#f87171" stroke-width="1.5" stroke-dasharray="3 3"/>
  <text x="182" y="168" font-family="${FIG_FONT}" font-size="12" font-weight="900" fill="#b91c1c">ST↑</text>
  <text x="360" y="152" font-family="${FIG_FONT}" font-size="12" font-weight="900" fill="#b91c1c">ST↑</text>

  ${badge(250, 68, "ST elevation", "danger")}
  ${badge(400, 68, "Anterior V2–V4", "info")}
  ${badge(20, 258, "ASA + emergent reperfusion (PCI)", "ok")}

  ${figFooter(760, 306, "STEMI = ST-elevation MI → time-critical cath lab")}
</svg>
`);

export const ECG_SINUS = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" role="img" aria-label="Normal sinus rhythm with labeled P QRS T">
  ${figChrome("ECG — normal sinus rhythm", "Lead II · regular · P before every QRS", 760, "ECG")}
  ${ecgPaper(760, 186, 56)}
  ${ecgCalib(18, 205)}

  <path d="${[70, 200, 330, 460, 590].map((x) => nsrBeat(x, 205)).join(" ")} L720 205"
    fill="none" stroke="#0f172a" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- Callout on first beat -->
  <text x="88" y="178" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="#0369a1">P</text>
  <text x="118" y="118" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="#0f172a">QRS</text>
  <text x="168" y="172" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="#b45309">T</text>
  <path d="M88 182 L88 198" stroke="#0369a1" stroke-width="1.5"/>
  <path d="M120 122 L120 140" stroke="#0f172a" stroke-width="1.5"/>
  <path d="M168 176 L168 190" stroke="#b45309" stroke-width="1.5"/>

  ${badge(480, 68, "Rate ~75 · regular", "ok")}
  ${figFooter(760, 286, "Comparison strip: every QRS has a preceding P wave")}
</svg>
`);

export const ECG_AFIB = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 310" role="img" aria-label="Atrial fibrillation with irregular RR intervals and no P waves">
  ${figChrome("ECG — atrial fibrillation", "Irregularly irregular · no discrete P waves", 760, "ECG")}
  ${ecgPaper(760, 186, 56)}
  ${ecgCalib(18, 205)}

  <!-- Fibrillatory baseline + irregular QRS -->
  <path d="M70 200
    Q78 192 86 200 Q94 208 102 199 Q110 191 118 201
    L128 118 L142 252 L154 200
    Q166 190 178 202 Q190 210 205 198 Q218 188 232 201 Q244 208 258 197
    L270 112 L285 255 L298 200
    Q318 188 340 204 Q360 212 378 196 Q392 188 410 202 Q422 210 438 198
    L450 120 L465 250 L478 200
    Q500 188 530 204 Q555 214 575 192 Q590 186 608 200
    L620 115 L635 252 L648 200
    Q665 190 685 202 Q702 210 720 198 Q735 190 748 200"
    fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- RR brackets ABOVE the strip, clear of footer -->
  <line x1="142" y1="78" x2="285" y2="78" stroke="#2563eb" stroke-width="3"/>
  <line x1="142" y1="74" x2="142" y2="82" stroke="#2563eb" stroke-width="2"/>
  <line x1="285" y1="74" x2="285" y2="82" stroke="#2563eb" stroke-width="2"/>
  <text x="214" y="72" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#1d4ed8">longer RR</text>

  <line x1="285" y1="98" x2="465" y2="98" stroke="#dc2626" stroke-width="3"/>
  <line x1="285" y1="94" x2="285" y2="102" stroke="#dc2626" stroke-width="2"/>
  <line x1="465" y1="94" x2="465" y2="102" stroke="#dc2626" stroke-width="2"/>
  <text x="375" y="92" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#b91c1c">shorter RR</text>

  ${badge(500, 230, "No P waves · f waves", "danger")}
  ${figFooter(760, 296, "Irregularly irregular + absent P waves = AFib")}
</svg>
`);

export const PATHWAY_ACS = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 380" role="img" aria-label="ACS pathway STEMI versus NSTE-ACS">
  ${figChrome("ACS — initial pathway", "Decision tree for the first minutes", 760, "PATHWAY")}
  <rect x="0" y="56" width="760" height="324" fill="#f8fafc"/>

  <rect x="220" y="76" width="320" height="58" rx="14" fill="#0f172a"/>
  <text x="380" y="102" text-anchor="middle" font-family="${FIG_FONT}" font-size="15" font-weight="900" fill="#f8fafc">Chest pain + 12-lead ECG</text>
  <text x="380" y="122" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#94a3b8">+ chewable ASA 162–325 mg now</text>

  <path d="M380 134 V158" stroke="#64748b" stroke-width="3"/>
  <rect x="260" y="158" width="240" height="48" rx="12" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
  <text x="380" y="188" text-anchor="middle" font-family="${FIG_FONT}" font-size="16" font-weight="900" fill="#1e40af">STEMI on ECG?</text>

  <path d="M260 182 H130 V228" stroke="#64748b" stroke-width="3" fill="none"/>
  <path d="M500 182 H630 V228" stroke="#64748b" stroke-width="3" fill="none"/>
  <text x="175" y="176" font-family="${FIG_FONT}" font-size="12" font-weight="900" fill="#b91c1c">YES</text>
  <text x="555" y="176" font-family="${FIG_FONT}" font-size="12" font-weight="900" fill="#1d4ed8">NO</text>

  <rect x="30" y="228" width="220" height="96" rx="14" fill="#fef2f2" stroke="#ef4444" stroke-width="2.5"/>
  <text x="140" y="262" text-anchor="middle" font-family="${FIG_FONT}" font-size="15" font-weight="900" fill="#991b1d">STEMI</text>
  <text x="140" y="286" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="700" fill="#7f1d1d">Emergent reperfusion</text>
  <text x="140" y="308" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#b91c1c">PCI preferred (door-to-balloon)</text>

  <rect x="510" y="228" width="220" height="96" rx="14" fill="#eff6ff" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="620" y="262" text-anchor="middle" font-family="${FIG_FONT}" font-size="15" font-weight="900" fill="#1e40af">NSTE-ACS</text>
  <text x="620" y="286" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="700" fill="#1e3a8a">ASA + anticoagulation</text>
  <text x="620" y="308" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#2563eb">Risk-stratify · early invasive?</text>

  ${badge(230, 340, "Do not delay ASA for more history", "ok")}
</svg>
`);

export const CXR_SCHEMATIC_PTX = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 460" role="img" aria-label="Right pneumothorax CXR schematic — patient right on viewer left">
  ${figChrome("CXR — right pneumothorax", "PA view · patient RIGHT = viewer LEFT", 700, "CXR")}
  <rect x="0" y="56" width="700" height="404" fill="#09090b"/>

  <!-- thoracic outline -->
  <ellipse cx="350" cy="265" rx="220" ry="155" fill="none" stroke="#a1a1aa" stroke-width="3.5"/>
  <!-- clavicles hint -->
  <path d="M180 145 Q260 125 340 140" fill="none" stroke="#71717a" stroke-width="2"/>
  <path d="M360 140 Q440 125 520 145" fill="none" stroke="#71717a" stroke-width="2"/>

  <!-- heart / mediastinum -->
  <path d="M350 145 Q420 265 350 385 Q280 265 350 145" fill="#27272a" stroke="#d4d4d8" stroke-width="2"/>
  <text x="350" y="272" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#a1a1aa">heart</text>

  <!-- LEFT lung (viewer right) = normal vascular markings -->
  <g stroke="#71717a" stroke-width="1.35" fill="none">
    <path d="M430 175 L500 210 M440 210 L520 250 M445 250 L515 295 M435 295 L500 335 M450 185 L480 230"/>
  </g>
  <text x="545" y="265" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#a1a1aa">L</text>

  <!-- RIGHT lung (viewer left) = collapsed edge + peripheral air -->
  <path d="M310 160 Q250 265 310 370" fill="none" stroke="#fafafa" stroke-width="4"/>
  <text x="175" y="220" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#f87171">visceral</text>
  <text x="175" y="238" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#f87171">pleural line</text>
  <text x="155" y="285" font-family="${FIG_FONT}" font-size="18" font-weight="900" fill="#fca5a5">AIR</text>
  <text x="130" y="308" font-family="${FIG_FONT}" font-size="12" font-weight="700" fill="#f87171">no lung markings</text>
  <text x="120" y="265" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#f87171">R</text>

  <!-- arrow from periphery to line -->
  <path d="M145 340 L250 340 L250 300" fill="none" stroke="#f87171" stroke-width="2" marker-end="none"/>
  <polygon points="250,288 244,300 256,300" fill="#f87171"/>

  ${badge(20, 72, "Absent peripheral markings", "danger")}
  ${badge(20, 106, "Line = collapsed lung edge", "danger")}

  ${figFooter(700, 442, "Sudden dyspnea + unilateral ↓ BS → PTX · tension = trachea away")}
</svg>
`);
