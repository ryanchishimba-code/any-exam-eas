/**
 * AANP FNP teaching SVG payloads — primary-care board-style exhibits.
 * One unmistakable teaching cue per figure; schematics only (not clinical photos).
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

export const AANP_ECG_AFIB = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" role="img" aria-label="Atrial fibrillation ECG with irregular RR intervals and no P waves">
  ${figChrome("ECG — atrial fibrillation", "Irregularly irregular · no discrete P waves · primary-care recognition", 760, "ECG")}
  ${ecgPaper(760, 186, 56)}
  ${ecgCalib(18, 205)}

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

  <line x1="142" y1="78" x2="285" y2="78" stroke="#2563eb" stroke-width="3"/>
  <line x1="142" y1="74" x2="142" y2="82" stroke="#2563eb" stroke-width="2"/>
  <line x1="285" y1="74" x2="285" y2="82" stroke="#2563eb" stroke-width="2"/>
  <text x="214" y="72" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#1d4ed8">longer RR</text>

  <line x1="285" y1="98" x2="465" y2="98" stroke="#dc2626" stroke-width="3"/>
  <line x1="285" y1="94" x2="285" y2="102" stroke="#dc2626" stroke-width="2"/>
  <line x1="465" y1="94" x2="465" y2="102" stroke="#dc2626" stroke-width="2"/>
  <text x="375" y="92" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#b91c1c">shorter RR</text>

  ${badge(500, 230, "No P waves · f waves", "danger")}
  ${figFooter(760, 306, "AFib → rate control + CHA₂DS₂-VASc for anticoagulation")}
</svg>
`);

export const AANP_DERM_ABCDE = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 400" role="img" aria-label="ABCDE melanoma warning signs teaching diagram">
  ${figChrome("Skin lesion — ABCDE", "Melanoma red flags · teach patients + document thoroughly", 760, "DERM")}
  <rect x="0" y="56" width="760" height="344" fill="#f8fafc"/>

  ${[
    { letter: "A", title: "Asymmetry", note: "One half ≠ other", cx: 90, tone: "danger" as const },
    { letter: "B", title: "Border", note: "Irregular / notched", cx: 230, tone: "warn" as const },
    { letter: "C", title: "Color", note: "Multiple hues", cx: 370, tone: "info" as const },
    { letter: "D", title: "Diameter", note: ">6 mm or growing", cx: 510, tone: "warn" as const },
    { letter: "E", title: "Evolving", note: "Change over time", cx: 650, tone: "danger" as const },
  ]
    .map(
      (c) => `
  <circle cx="${c.cx}" cy="150" r="48" fill="#fff" stroke="#0f172a" stroke-width="2.5"/>
  <text x="${c.cx}" y="158" text-anchor="middle" font-family="${FIG_FONT}" font-size="28" font-weight="900" fill="#0f172a">${c.letter}</text>
  <text x="${c.cx}" y="230" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#0f172a">${c.title}</text>
  <text x="${c.cx}" y="250" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#64748b">${c.note}</text>`
    )
    .join("")}

  <rect x="40" y="280" width="680" height="70" rx="14" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="380" y="310" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#7f1d1d">Ugly duckling + any ABCDE → biopsy / derm referral</text>
  <text x="380" y="332" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" fill="#991b1b">Schematic teaching aid — not clinical photography</text>

  ${figFooter(760, 382, "Skin cancer detection is a high-yield FNP primary-care skill")}
</svg>
`);

export const AANP_OTOSCOPY_OM = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 380" role="img" aria-label="Otoscopic view comparing normal tympanic membrane and acute otitis media">
  ${figChrome("Otoscopy — acute otitis media", "Bulging · erythematous TM · landmarks obscured", 760, "ENT")}
  <rect x="0" y="56" width="760" height="324" fill="#f8fafc"/>

  <!-- Normal -->
  <text x="190" y="90" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#065f46">Normal TM</text>
  <circle cx="190" cy="200" r="95" fill="#fef3c7" stroke="#0f172a" stroke-width="3"/>
  <ellipse cx="160" cy="175" rx="28" ry="18" fill="none" stroke="#0369a1" stroke-width="2.5"/>
  <text x="160" y="180" text-anchor="middle" font-family="${FIG_FONT}" font-size="10" font-weight="700" fill="#0369a1">light</text>
  <path d="M190 120 L190 260" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="210" y="150" font-family="${FIG_FONT}" font-size="11" font-weight="700" fill="#334155">malleus</text>
  ${badge(120, 300, "Pearly gray · mobile", "ok")}

  <!-- AOM -->
  <text x="560" y="90" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#7f1d1d">Acute OM</text>
  <circle cx="560" cy="200" r="95" fill="#fecaca" stroke="#b91c1c" stroke-width="3"/>
  <ellipse cx="560" cy="200" rx="70" ry="78" fill="#ef4444" opacity="0.55"/>
  <text x="560" y="195" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#7f1d1d">bulging</text>
  <text x="560" y="215" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="700" fill="#991b1b">erythema</text>
  ${badge(470, 300, "Landmarks lost", "danger")}

  ${figFooter(760, 362, "AOM diagnosis = middle-ear effusion + acute inflammation signs")}
</svg>
`);

export const AANP_SPIROMETRY_OBSTRUCTIVE = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 400" role="img" aria-label="Spirometry flow-volume loops comparing normal and obstructive patterns">
  ${figChrome("Spirometry — obstructive pattern", "FEV₁/FVC ↓ · scooped flow-volume loop", 760, "PULM")}
  <rect x="0" y="56" width="760" height="344" fill="#f8fafc"/>

  <text x="40" y="95" font-family="${FIG_FONT}" font-size="13" font-weight="800" fill="#0f172a">Flow–volume loop</text>
  <rect x="40" y="110" width="340" height="220" rx="10" fill="#fff" stroke="#e2e8f0"/>
  <line x1="70" y1="300" x2="350" y2="300" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="70" y1="300" x2="70" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="210" y="320" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#64748b">Volume →</text>
  <text x="55" y="210" transform="rotate(-90 55 210)" font-family="${FIG_FONT}" font-size="11" fill="#64748b">Flow</text>

  <!-- Normal loop -->
  <path d="M90 300 C140 140 220 140 280 300" fill="none" stroke="#16a34a" stroke-width="3"/>
  <text x="200" y="145" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#166534">Normal</text>

  <!-- Obstructive scooped -->
  <path d="M100 300 C130 250 180 270 260 300" fill="none" stroke="#dc2626" stroke-width="3.5"/>
  <text x="200" y="275" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#b91c1c">Obstructive scoop</text>

  <rect x="410" y="110" width="310" height="220" rx="14" fill="#0f172a"/>
  <text x="565" y="145" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="800" fill="#f8fafc">Key ratios</text>
  <text x="430" y="185" font-family="${FIG_FONT}" font-size="13" fill="#94a3b8">Obstructive (asthma/COPD)</text>
  <text x="430" y="210" font-family="${FIG_FONT}" font-size="18" font-weight="900" fill="#f87171">FEV₁/FVC &lt; 0.70</text>
  <text x="430" y="250" font-family="${FIG_FONT}" font-size="13" fill="#94a3b8">Restrictive</text>
  <text x="430" y="275" font-family="${FIG_FONT}" font-size="16" font-weight="800" fill="#86efac">FEV₁/FVC normal · ↓ TLC</text>
  <text x="430" y="310" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Confirm with clinical context + GOLD/GINA</text>

  ${figFooter(760, 382, "Obstruction = reduced FEV₁/FVC — not just a low FEV₁ alone")}
</svg>
`);

export const AANP_GROWTH_CHART = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 400" role="img" aria-label="Pediatric growth chart with crossing percentiles flagged">
  ${figChrome("Growth chart — crossing percentiles", "Crossing ≥2 major percentiles = evaluate failure to thrive", 760, "PEDS")}
  <rect x="0" y="56" width="760" height="344" fill="#f8fafc"/>

  <rect x="50" y="90" width="520" height="250" rx="8" fill="#fff" stroke="#e2e8f0"/>
  ${[0, 1, 2, 3, 4, 5]
    .map((i) => {
      const y = 110 + i * 40;
      const label = ["97th", "75th", "50th", "25th", "10th", "3rd"][i];
      return `<line x1="70" y1="${y}" x2="540" y2="${y}" stroke="#e2e8f0"/><text x="555" y="${y + 4}" font-family="${FIG_FONT}" font-size="11" fill="#64748b">${label}</text>`;
    })
    .join("")}

  <!-- Age axis -->
  ${[0, 1, 2, 3, 4]
    .map((i) => {
      const x = 90 + i * 100;
      return `<text x="${x}" y="355" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#64748b">${i + 1}y</text>`;
    })
    .join("")}

  <!-- Healthy tracking ~50th -->
  <path d="M90 190 L190 188 L290 192 L390 186 L490 190" fill="none" stroke="#16a34a" stroke-width="3"/>
  <text x="290" y="175" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="700" fill="#166534">tracks 50th</text>

  <!-- Crossing down -->
  <path d="M90 150 L190 170 L290 210 L390 250 L490 290" fill="none" stroke="#dc2626" stroke-width="3.5"/>
  <circle cx="390" cy="250" r="7" fill="#dc2626"/>
  <text x="420" y="255" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#b91c1c">crossing ↓</text>

  ${badge(580, 120, "Flag: ≥2 major lines", "danger")}
  ${badge(580, 160, "Assess calories / illness", "warn")}
  ${badge(580, 200, "Plot length + weight", "info")}

  ${figFooter(760, 382, "Always plot serial measurements — one point is not a trend")}
</svg>
`);
