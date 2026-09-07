/**
 * NCLEX teaching SVG payloads — high-contrast board-style exhibits.
 * One unmistakable teaching cue per figure.
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

export const FETAL_LATE_DECELS = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 380" role="img" aria-label="Fetal monitor teaching strip showing late decelerations">
  ${figChrome("Fetal monitor — late decelerations", "Category II–III pattern · teaching strip, not a patient tracing", 760, "FHR / TOCO")}
  <rect x="0" y="56" width="760" height="324" fill="#fff7ed"/>

  <rect x="48" y="78" width="690" height="110" rx="4" fill="#fffbeb" stroke="#fdba74"/>
  <g stroke="#fed7aa" stroke-width="0.7">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${60 + i * 28}" y1="78" x2="${60 + i * 28}" y2="188"/>`).join("")}
    ${Array.from({ length: 5 }, (_, i) => `<line x1="48" y1="${90 + i * 22}" x2="738" y2="${90 + i * 22}"/>`).join("")}
  </g>
  <text x="56" y="74" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#0f172a">FHR</text>
  <text x="90" y="74" font-family="${FIG_FONT}" font-size="11" font-weight="600" fill="#9a3412">bpm · baseline ~140</text>
  <text x="56" y="102" font-family="${FIG_FONT}" font-size="9" fill="#78716c">160</text>
  <text x="56" y="136" font-family="${FIG_FONT}" font-size="9" fill="#78716c">140</text>
  <text x="56" y="170" font-family="${FIG_FONT}" font-size="9" fill="#78716c">110</text>

  <path d="M70 134 L160 132 L230 136 L280 134
    C310 134 335 175 365 182 C395 186 415 150 435 136
    L510 134
    C540 134 565 178 595 185 C625 188 645 152 665 136
    L720 134"
    fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <rect x="48" y="210" width="690" height="95" rx="4" fill="#eff6ff" stroke="#93c5fd"/>
  <g stroke="#bfdbfe" stroke-width="0.7">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${60 + i * 28}" y1="210" x2="${60 + i * 28}" y2="305"/>`).join("")}
  </g>
  <text x="56" y="206" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#1e40af">UC</text>
  <text x="88" y="206" font-family="${FIG_FONT}" font-size="11" font-weight="600" fill="#1d4ed8">uterine contractions</text>
  <path d="M70 285 L160 285
    C190 285 215 225 250 218 C285 214 305 265 330 285
    L430 285
    C460 285 485 222 520 216 C555 212 575 265 600 285
    L720 285"
    fill="none" stroke="#0369a1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <line x1="250" y1="88" x2="250" y2="290" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3"/>
  <line x1="365" y1="88" x2="365" y2="290" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>
  <line x1="520" y1="88" x2="520" y2="290" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3"/>
  <line x1="595" y1="88" x2="595" y2="290" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>

  <text x="250" y="318" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="700" fill="#0369a1">① UC peak</text>
  <text x="365" y="318" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#b91c1c">② FHR nadir</text>
  <text x="520" y="334" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="700" fill="#0369a1">① peak</text>
  <text x="595" y="334" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#b91c1c">② nadir</text>

  ${badge(560, 64, "KEY: ② happens AFTER ①", "danger")}
  ${figFooter(760, 362, "Action: left side · O₂ · stop oxytocin · notify provider")}
</svg>
`);

export const INSULIN_PEAK_CHART = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 400" role="img" aria-label="Insulin timing chart highlighting regular insulin peak hypoglycemia window">
  ${figChrome("Insulin timing", "Hypoglycemia risk = PEAK window · know onset → peak → duration", 760, "PHARM")}
  <rect x="0" y="56" width="760" height="344" fill="#f8fafc"/>

  <line x1="190" y1="88" x2="730" y2="88" stroke="#94a3b8" stroke-width="1.5"/>
  ${["0", "2 h", "4 h", "8 h", "12 h", "24 h"]
    .map((t, i) => {
      const x = 190 + i * 108;
      return `<circle cx="${x}" cy="88" r="3" fill="#475569"/><text x="${x}" y="80" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="700" fill="#334155">${t}</text>`;
    })
    .join("")}

  <!-- legend -->
  <rect x="24" y="68" width="12" height="12" rx="2" fill="#86efac"/><text x="42" y="78" font-family="${FIG_FONT}" font-size="10" fill="#475569">onset→peak</text>
  <rect x="120" y="68" width="12" height="12" rx="2" fill="#bbf7d0"/><text x="138" y="78" font-family="${FIG_FONT}" font-size="10" fill="#475569">tail</text>

  <!-- Rapid -->
  <text x="24" y="120" font-family="${FIG_FONT}" font-size="13" font-weight="800" fill="#0f172a">Rapid</text>
  <text x="24" y="136" font-family="${FIG_FONT}" font-size="10" fill="#64748b">lispro / aspart</text>
  <rect x="190" y="112" width="70" height="26" rx="6" fill="#86efac" stroke="#16a34a"/>
  <text x="225" y="130" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#14532d">peak 1–2h</text>
  <rect x="260" y="112" width="50" height="26" rx="6" fill="#bbf7d0"/>
  <text x="320" y="130" font-family="${FIG_FONT}" font-size="11" fill="#475569">~3–5 h</text>

  <!-- Regular EMPHASIS -->
  <rect x="16" y="156" width="728" height="88" rx="14" fill="#fef2f2" stroke="#f87171" stroke-width="2.5"/>
  <text x="28" y="186" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="#7f1d1d">Short / regular</text>
  <text x="28" y="206" font-family="${FIG_FONT}" font-size="11" fill="#991b1b">onset 30–60 min</text>
  <rect x="190" y="178" width="40" height="36" rx="6" fill="#fecaca" stroke="#f87171"/>
  <text x="210" y="200" text-anchor="middle" font-family="${FIG_FONT}" font-size="10" font-weight="700" fill="#7f1d1d">onset</text>
  <rect x="230" y="178" width="160" height="36" rx="6" fill="#ef4444"/>
  <text x="310" y="201" text-anchor="middle" font-family="${FIG_FONT}" font-size="13" font-weight="900" fill="#fff">PEAK 2–4 h</text>
  <rect x="390" y="178" width="90" height="36" rx="6" fill="#fecaca"/>
  <text x="435" y="201" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="700" fill="#7f1d1d">to 5–8 h</text>
  ${badge(520, 166, "Watch glucose here", "danger")}
  <text x="28" y="230" font-family="${FIG_FONT}" font-size="11" font-weight="700" fill="#b91c1c">Exam trap: hypo risk = peak, not onset</text>

  <!-- NPH -->
  <text x="24" y="280" font-family="${FIG_FONT}" font-size="13" font-weight="800" fill="#0f172a">NPH</text>
  <text x="24" y="296" font-family="${FIG_FONT}" font-size="10" fill="#64748b">intermediate</text>
  <rect x="190" y="270" width="80" height="26" rx="6" fill="#fde68a" stroke="#d97706"/>
  <text x="230" y="288" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#78350f">onset</text>
  <rect x="270" y="270" width="220" height="26" rx="6" fill="#fbbf24" stroke="#d97706"/>
  <text x="380" y="288" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#78350f">peak 4–12 h · lasts 12–18 h</text>

  <!-- Long -->
  <text x="24" y="336" font-family="${FIG_FONT}" font-size="13" font-weight="800" fill="#0f172a">Long-acting</text>
  <text x="24" y="352" font-family="${FIG_FONT}" font-size="10" fill="#64748b">glargine / detemir</text>
  <rect x="190" y="326" width="520" height="26" rx="6" fill="#60a5fa" stroke="#2563eb"/>
  <text x="450" y="344" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="800" fill="#1e3a8a">no peak · ~24 h basal coverage</text>

  ${figFooter(760, 386, "Regular insulin: check BG during the 2–4 h peak window")}
</svg>
`);

export const MAR_MED_LABEL = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 410" role="img" aria-label="High-alert MAR excerpt with six rights checklist">
  ${figChrome("MAR — high-alert order", "Teaching label · verify every right before giving", 700, "SAFETY")}
  <rect x="0" y="56" width="700" height="354" fill="#f1f5f9"/>

  <rect x="20" y="72" width="660" height="262" rx="14" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
  <rect x="20" y="72" width="660" height="44" fill="#ea580c"/>
  <text x="36" y="100" font-family="${FIG_FONT}" font-size="15" font-weight="900" fill="#fff">HIGH-ALERT  ·  independent double-check required</text>

  <text x="36" y="148" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Patient</text>
  <text x="130" y="148" font-family="${FIG_FONT}" font-size="14" font-weight="700" fill="#0f172a">Doe, Jane  ·  DOB 01/12/1988  ·  MRN 48291</text>

  <rect x="28" y="162" width="644" height="52" rx="10" fill="#fff7ed" stroke="#fb923c" stroke-width="1.5"/>
  <text x="44" y="184" font-family="${FIG_FONT}" font-size="12" fill="#9a3412">Drug / dose</text>
  <text x="44" y="206" font-family="${FIG_FONT}" font-size="18" font-weight="900" fill="#0f172a">Insulin regular 10 units</text>

  <text x="36" y="244" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Route / time</text>
  <text x="130" y="244" font-family="${FIG_FONT}" font-size="14" font-weight="700" fill="#0f172a">SUBQ  ·  due 0730  ·  AC breakfast</text>

  <text x="36" y="276" font-family="${FIG_FONT}" font-size="12" fill="#64748b">Prescriber</text>
  <text x="130" y="276" font-family="${FIG_FONT}" font-size="14" font-weight="600" fill="#0f172a">Dr. Lee</text>

  <text x="36" y="308" font-family="${FIG_FONT}" font-size="13" font-weight="800" fill="#0f172a">Confirm six rights</text>
  <g font-family="${FIG_FONT}" font-size="12" font-weight="700">
    <rect x="36" y="316" width="95" height="28" rx="8" fill="#d1fae5" stroke="#10b981"/><text x="83" y="335" text-anchor="middle" fill="#065f46">Patient</text>
    <rect x="140" y="316" width="78" height="28" rx="8" fill="#d1fae5" stroke="#10b981"/><text x="179" y="335" text-anchor="middle" fill="#065f46">Drug</text>
    <rect x="228" y="316" width="78" height="28" rx="8" fill="#d1fae5" stroke="#10b981"/><text x="267" y="335" text-anchor="middle" fill="#065f46">Dose</text>
    <rect x="316" y="316" width="82" height="28" rx="8" fill="#d1fae5" stroke="#10b981"/><text x="357" y="335" text-anchor="middle" fill="#065f46">Route</text>
    <rect x="408" y="316" width="78" height="28" rx="8" fill="#d1fae5" stroke="#10b981"/><text x="447" y="335" text-anchor="middle" fill="#065f46">Time</text>
    <rect x="496" y="316" width="120" height="28" rx="8" fill="#d1fae5" stroke="#10b981"/><text x="556" y="335" text-anchor="middle" fill="#065f46">Document</text>
  </g>

  ${badge(480, 168, "Check current BG first", "warn")}
  ${figFooter(700, 392, "Before insulin: right patient + dose + current BG")}
</svg>
`);

export const ECG_VT_SCHEMATIC = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 310" role="img" aria-label="Ventricular tachycardia ECG teaching strip">
  ${figChrome("ECG — ventricular tachycardia", "Lead II · monomorphic wide-complex tachycardia", 760, "ECG")}
  ${ecgPaper(760, 196, 56)}
  ${ecgCalib(20, 210)}

  <!-- Wide bizarre QRS repeating ~every 33px (~180/min teaching rate) -->
  <path d="M85 210
    L100 210 L108 95 L118 255 L128 175 L138 230 L148 210
    L163 210 L171 92 L181 258 L191 172 L201 232 L211 210
    L226 210 L234 96 L244 254 L254 174 L264 228 L274 210
    L289 210 L297 90 L307 260 L317 170 L327 234 L337 210
    L352 210 L360 94 L370 256 L380 173 L390 230 L400 210
    L415 210 L423 92 L433 258 L443 172 L453 232 L463 210
    L478 210 L486 96 L496 254 L506 174 L516 228 L526 210
    L541 210 L549 90 L559 260 L569 170 L579 234 L589 210
    L604 210 L612 94 L622 256 L632 173 L642 230 L652 210
    L667 210 L675 92 L685 258 L695 172 L705 232 L715 210
    L735 210"
    fill="none" stroke="#0f172a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- Width callout on one complex -->
  <line x1="297" y1="78" x2="337" y2="78" stroke="#dc2626" stroke-width="2.5"/>
  <line x1="297" y1="74" x2="297" y2="82" stroke="#dc2626" stroke-width="2"/>
  <line x1="337" y1="74" x2="337" y2="82" stroke="#dc2626" stroke-width="2"/>
  <text x="317" y="72" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" font-weight="800" fill="#b91c1c">wide</text>

  ${badge(380, 68, "Wide QRS", "danger")}
  ${badge(500, 68, "No P waves", "danger")}
  ${badge(620, 68, "~180/min", "info")}
  ${badge(520, 240, "Check pulse FIRST", "warn")}

  ${figFooter(760, 296, "Pulseless VT → defibrillate · pulse + unstable → synchronized cardioversion")}
</svg>
`);

export const PRESSURE_INJURY_STAGES = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 390" role="img" aria-label="Pressure injury stages I to IV by tissue depth">
  ${figChrome("Pressure injury staging", "Depth decides the stage · teaching cross-sections", 760, "SKIN")}
  <rect x="0" y="56" width="760" height="334" fill="#f8fafc"/>

  <!-- shared layer legend -->
  <g font-family="${FIG_FONT}" font-size="10" font-weight="700">
    <rect x="24" y="68" width="14" height="10" fill="#fca5a5"/><text x="42" y="77" fill="#64748b">epidermis</text>
    <rect x="110" y="68" width="14" height="10" fill="#fdba74"/><text x="128" y="77" fill="#64748b">dermis</text>
    <rect x="180" y="68" width="14" height="10" fill="#fde68a"/><text x="198" y="77" fill="#64748b">fat</text>
    <rect x="232" y="68" width="14" height="10" fill="#cbd5e1"/><text x="250" y="77" fill="#64748b">bone / support</text>
  </g>

  ${[
    {
      x: 24,
      title: "Stage I",
      detail: "Intact · non-blanchable",
      layers: `
        <rect x="28" y="56" width="116" height="18" fill="#fca5a5"/>
        <rect x="28" y="74" width="116" height="28" fill="#fdba74"/>
        <rect x="28" y="102" width="116" height="34" fill="#fde68a"/>
        <rect x="28" y="136" width="116" height="18" fill="#e2e8f0"/>
        <rect x="28" y="56" width="116" height="18" fill="#ef4444" opacity="0.55"/>
        <text x="86" y="172" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c" font-family="${FIG_FONT}">red intact skin</text>`,
    },
    {
      x: 206,
      title: "Stage II",
      detail: "Partial thickness",
      layers: `
        <rect x="28" y="56" width="116" height="18" fill="#fca5a5"/>
        <rect x="28" y="74" width="116" height="28" fill="#fdba74"/>
        <rect x="28" y="102" width="116" height="34" fill="#fde68a"/>
        <rect x="28" y="136" width="116" height="18" fill="#e2e8f0"/>
        <path d="M40 56 H132 V70 H100 L72 96 H40 Z" fill="#991b1b"/>
        <text x="86" y="172" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c" font-family="${FIG_FONT}">into dermis</text>`,
    },
    {
      x: 388,
      title: "Stage III",
      detail: "Full thickness → fat",
      layers: `
        <rect x="28" y="56" width="116" height="18" fill="#fca5a5"/>
        <rect x="28" y="74" width="116" height="28" fill="#fdba74"/>
        <rect x="28" y="102" width="116" height="34" fill="#fde68a"/>
        <rect x="28" y="136" width="116" height="18" fill="#e2e8f0"/>
        <path d="M40 56 H132 V70 H105 L68 128 H40 Z" fill="#7f1d1d"/>
        <text x="86" y="172" text-anchor="middle" font-size="11" font-weight="800" fill="#7f1d1d" font-family="${FIG_FONT}">fat visible · not bone</text>`,
    },
    {
      x: 570,
      title: "Stage IV",
      detail: "Bone / tendon / muscle",
      layers: `
        <rect x="28" y="56" width="116" height="18" fill="#fca5a5"/>
        <rect x="28" y="74" width="116" height="28" fill="#fdba74"/>
        <rect x="28" y="102" width="116" height="34" fill="#fde68a"/>
        <rect x="28" y="136" width="116" height="18" fill="#cbd5e1"/>
        <path d="M40 56 H132 V70 H110 L62 148 H40 Z" fill="#450a0a"/>
        <text x="86" y="149" text-anchor="middle" font-size="10" font-weight="900" fill="#334155" font-family="${FIG_FONT}">bone</text>
        <text x="86" y="172" text-anchor="middle" font-size="11" font-weight="800" fill="#450a0a" font-family="${FIG_FONT}">exposed support</text>`,
    },
  ]
    .map(
      (s) => `
  <g transform="translate(${s.x},90)">
    <rect width="172" height="230" rx="14" fill="#fff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="86" y="28" text-anchor="middle" font-family="${FIG_FONT}" font-size="16" font-weight="900" fill="#0f172a">${s.title}</text>
    <text x="86" y="48" text-anchor="middle" font-family="${FIG_FONT}" font-size="11" fill="#64748b">${s.detail}</text>
    ${s.layers}
  </g>`
    )
    .join("")}

  ${figFooter(760, 372, "Intact red = I · blister/shallow = II · fat = III · bone/tendon = IV")}
</svg>
`);

export const PPE_DONNING = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" role="img" aria-label="PPE donning order gown mask eye protection gloves">
  ${figChrome("PPE donning order", "Gown → mask/respirator → eye protection → gloves last", 760, "PPE")}
  <rect x="0" y="56" width="760" height="264" fill="#f8fafc"/>

  ${[
    {
      x: 28,
      n: "1",
      title: "Gown",
      sub: "cover torso / cuffs",
      fill: "#ecfdf5",
      stroke: "#10b981",
      ink: "#065f46",
      icon: `<path d="M78 28 L58 40 L52 78 H104 L98 40 Z" fill="#fff" stroke="#10b981" stroke-width="2"/>
        <path d="M58 40 L48 55 M98 40 L108 55" stroke="#10b981" stroke-width="2" fill="none"/>`,
    },
    {
      x: 212,
      n: "2",
      title: "Mask",
      sub: "or N95 respirator",
      fill: "#eff6ff",
      stroke: "#3b82f6",
      ink: "#1e40af",
      icon: `<ellipse cx="78" cy="48" rx="28" ry="18" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
        <path d="M50 48 H106 M55 42 H101 M55 54 H101" stroke="#93c5fd" stroke-width="1.5"/>
        <path d="M50 40 L42 28 M106 40 L114 28" stroke="#3b82f6" stroke-width="2"/>`,
    },
    {
      x: 396,
      n: "3",
      title: "Eyes",
      sub: "goggles / shield",
      fill: "#f5f3ff",
      stroke: "#8b5cf6",
      ink: "#5b21b6",
      icon: `<rect x="48" y="34" width="60" height="28" rx="10" fill="#fff" stroke="#8b5cf6" stroke-width="2"/>
        <line x1="78" y1="34" x2="78" y2="62" stroke="#8b5cf6" stroke-width="2"/>
        <path d="M48 40 L40 32 M108 40 L116 32" stroke="#8b5cf6" stroke-width="2"/>`,
    },
    {
      x: 580,
      n: "4",
      title: "Gloves",
      sub: "LAST · over cuffs",
      fill: "#fff7ed",
      stroke: "#f97316",
      ink: "#9a3412",
      icon: `<path d="M62 58 V38 C62 30 70 28 74 34 L78 28 C82 22 90 26 88 34 L92 30 C96 24 104 30 100 38 V58 Z" fill="#fff" stroke="#f97316" stroke-width="2"/>`,
    },
  ]
    .map(
      (s) => `
  <g transform="translate(${s.x},78)">
    <rect width="156" height="170" rx="16" fill="${s.fill}" stroke="${s.stroke}" stroke-width="2.5"/>
    <circle cx="28" cy="28" r="16" fill="#fff" stroke="${s.stroke}" stroke-width="2"/>
    <text x="28" y="34" text-anchor="middle" font-family="${FIG_FONT}" font-size="14" font-weight="900" fill="${s.ink}">${s.n}</text>
    ${s.icon}
    <text x="78" y="118" text-anchor="middle" font-family="${FIG_FONT}" font-size="16" font-weight="900" fill="${s.ink}">${s.title}</text>
    <text x="78" y="142" text-anchor="middle" font-family="${FIG_FONT}" font-size="12" font-weight="600" fill="${s.ink}">${s.sub}</text>
  </g>`
    )
    .join("")}

  <path d="M188 160 H208 M372 160 H392 M556 160 H576" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <polygon points="208,160 200,154 200,166" fill="#475569"/>
  <polygon points="392,160 384,154 384,166" fill="#475569"/>
  <polygon points="576,160 568,154 568,166" fill="#475569"/>
  ${figFooter(760, 302, "Donning: gloves last · Doffing: gloves first (most contaminated)")}
</svg>
`);
