#!/usr/bin/env python3
"""Generate the two corrected NCLEX figures as SVG.

Written in pure ASCII with XML numeric character references so the output is
byte-safe regardless of editor or shell encoding. Replaces the raster versions
of abg-interpretation-ladder and burn-rule-of-nines, both of which shipped with
clinically wrong content.
"""

from pathlib import Path

OUT = Path("public/nclex-study-guide/visuals")

# Entities keep this source ASCII-only.
EM = "&#8212;"   # em dash
EN = "&#8211;"   # en dash
SUB2 = "&#8322;"  # subscript 2
SUP_MINUS = "&#8315;"  # superscript minus
DN = "&#8595;"   # down arrow
UP = "&#8593;"   # up arrow
LR = "&#8596;"   # left-right arrow
RARR = "&#8594;"  # right arrow
APPROX = "&#8776;"  # almost equal
RSQUO = "&#8217;"  # right single quote

CO2 = f"CO{SUB2}"
HCO3 = f"HCO{SUB2}{SUP_MINUS}"

STYLE = """
    .bg      { fill: #ffffff; }
    .ink     { fill: #0f2e42; }
    .teal    { fill: #0d7f8c; }
    .muted   { fill: #4a6a7b; }
    .white   { fill: #ffffff; }
    .panel   { fill: #f2f8f9; }
    .navy    { fill: #0f2e42; }
    .amber   { fill: #fdf5e6; }
    .card    { fill: #ffffff; stroke: #cfe0e5; stroke-width: 1.5; }
    .hair    { stroke: #cfe0e5; stroke-width: 1.5; fill: none; }
    text     { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
    .h1      { font-size: 31px; font-weight: 700; }
    .step    { font-size: 15px; font-weight: 700; letter-spacing: 1.2px; }
    .stepno  { font-size: 34px; font-weight: 700; }
    .lead    { font-size: 19px; font-weight: 700; }
    .body    { font-size: 14px; }
    .small   { font-size: 12.5px; }
    .tiny    { font-size: 11.5px; }
    .hdr     { font-size: 13px; font-weight: 700; letter-spacing: 0.8px; }
    .val     { font-size: 15px; font-weight: 700; }
    .footer  { font-size: 15px; font-weight: 600; }
"""

FOOTER = """
  <rect class="navy" x="0" y="686" width="1100" height="74"/>
  <text class="footer white" x="550" y="730" text-anchor="middle">Study aid &#8212; AnyExam<tspan fill="#5ec8d4">Easy</tspan></text>
</svg>
"""


def abg() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 760" width="1100" height="760" role="img" aria-labelledby="abgTitle abgDesc">
  <title id="abgTitle">ABG Interpretation Ladder</title>
  <desc id="abgDesc">Three-step method for interpreting arterial blood gases. Step one, read the pH for direction. Step two, carbon dioxide moving opposite to pH indicates a primary respiratory disorder, while bicarbonate moving with the pH indicates a primary metabolic disorder. Step three, the other value shifts to compensate.</desc>
  <style>{STYLE}</style>

  <rect class="bg" width="1100" height="760"/>

  <text class="h1 ink" x="550" y="48" text-anchor="middle">ABG Interpretation Ladder</text>
  <line class="hair" x1="310" y1="66" x2="790" y2="66"/>

  <rect class="teal" x="46" y="92" width="13" height="536" rx="6"/>
  <rect class="teal" x="132" y="92" width="13" height="536" rx="6"/>
  <rect class="navy" x="40" y="214" width="111" height="13" rx="6"/>
  <rect class="navy" x="40" y="392" width="111" height="13" rx="6"/>

  <!-- STEP 1 -->
  <text class="step ink" x="95" y="130" text-anchor="middle">STEP</text>
  <text class="stepno ink" x="95" y="170" text-anchor="middle">1</text>

  <rect class="card" x="172" y="94" width="888" height="106" rx="10"/>
  <text class="lead teal" x="196" y="126">Read the pH</text>
  <text class="body muted" x="196" y="150">Gives the direction of the</text>
  <text class="body muted" x="196" y="170">disturbance, not the cause.</text>

  <rect class="navy" x="516" y="110" width="172" height="30" rx="5"/>
  <rect class="teal" x="694" y="110" width="172" height="30" rx="5"/>
  <rect class="navy" x="872" y="110" width="172" height="30" rx="5"/>
  <text class="hdr white" x="602" y="130" text-anchor="middle">ACIDEMIA</text>
  <text class="hdr white" x="780" y="130" text-anchor="middle">NORMAL</text>
  <text class="hdr white" x="958" y="130" text-anchor="middle">ALKALEMIA</text>

  <rect class="panel" x="516" y="140" width="172" height="48"/>
  <rect class="panel" x="694" y="140" width="172" height="48"/>
  <rect class="panel" x="872" y="140" width="172" height="48"/>
  <text class="val ink" x="602" y="163" text-anchor="middle">pH &lt; 7.35</text>
  <text class="val ink" x="780" y="163" text-anchor="middle">pH 7.35 {EN} 7.45</text>
  <text class="val ink" x="958" y="163" text-anchor="middle">pH &gt; 7.45</text>
  <text class="small muted" x="602" y="181" text-anchor="middle">Acidic {DN}</text>
  <text class="small muted" x="780" y="181" text-anchor="middle">Balanced {LR}</text>
  <text class="small muted" x="958" y="181" text-anchor="middle">Alkaline {UP}</text>

  <!-- STEP 2 -->
  <text class="step ink" x="95" y="304" text-anchor="middle">STEP</text>
  <text class="stepno ink" x="95" y="344" text-anchor="middle">2</text>

  <rect class="card" x="172" y="216" width="888" height="164" rx="10"/>
  <text class="lead teal" x="196" y="248">Find the cause</text>
  <text class="body muted" x="196" y="272">Compare each value against</text>
  <text class="body muted" x="196" y="292">the direction of the pH.</text>

  <rect class="navy" x="470" y="232" width="284" height="30" rx="5"/>
  <rect class="teal" x="762" y="232" width="284" height="30" rx="5"/>
  <text class="hdr white" x="612" y="252" text-anchor="middle">RESPIRATORY {EM} {CO2}</text>
  <text class="hdr white" x="904" y="252" text-anchor="middle">METABOLIC {EM} {HCO3}</text>

  <rect class="panel" x="470" y="262" width="284" height="100"/>
  <rect class="panel" x="762" y="262" width="284" height="100"/>
  <text class="small muted" x="612" y="283" text-anchor="middle">Normal 35 {EN} 45 mmHg</text>
  <text class="small muted" x="904" y="283" text-anchor="middle">Normal 22 {EN} 26 mEq/L</text>

  <text class="body ink" x="612" y="313" text-anchor="middle">If {CO2} moves <tspan font-weight="700" fill="#b3402c">OPPOSITE</tspan> to</text>
  <text class="body ink" x="612" y="332" text-anchor="middle">the pH {RARR}</text>
  <text class="val teal" x="612" y="353" text-anchor="middle">Primary Respiratory</text>

  <text class="body ink" x="904" y="313" text-anchor="middle">If {HCO3} moves <tspan font-weight="700" fill="#0d7f8c">WITH</tspan></text>
  <text class="body ink" x="904" y="332" text-anchor="middle">the pH {RARR}</text>
  <text class="val teal" x="904" y="353" text-anchor="middle">Primary Metabolic</text>

  <!-- STEP 3 -->
  <text class="step ink" x="95" y="482" text-anchor="middle">STEP</text>
  <text class="stepno ink" x="95" y="522" text-anchor="middle">3</text>

  <rect class="card" x="172" y="396" width="888" height="164" rx="10"/>
  <text class="lead teal" x="196" y="428">Check compensation</text>
  <text class="body muted" x="196" y="452">The other value shifts to</text>
  <text class="body muted" x="196" y="472">pull the pH back toward normal.</text>

  <rect class="navy" x="424" y="412" width="308" height="28" rx="5"/>
  <rect class="teal" x="740" y="412" width="306" height="28" rx="5"/>
  <text class="hdr white" x="578" y="431" text-anchor="middle">PRIMARY RESPIRATORY</text>
  <text class="hdr white" x="893" y="431" text-anchor="middle">PRIMARY METABOLIC</text>

  <rect class="panel" x="424" y="440" width="150" height="102"/>
  <rect class="panel" x="582" y="440" width="150" height="102"/>
  <rect class="panel" x="740" y="440" width="149" height="102"/>
  <rect class="panel" x="897" y="440" width="149" height="102"/>

  <text class="val ink" x="499" y="466" text-anchor="middle">{UP} {CO2}</text>
  <text class="tiny muted" x="499" y="486" text-anchor="middle">Respiratory acidosis</text>
  <text class="tiny muted" x="499" y="514" text-anchor="middle">Kidneys retain</text>
  <text class="small ink" x="499" y="532" text-anchor="middle" font-weight="700">{HCO3} {UP}</text>

  <text class="val ink" x="657" y="466" text-anchor="middle">{DN} {CO2}</text>
  <text class="tiny muted" x="657" y="486" text-anchor="middle">Respiratory alkalosis</text>
  <text class="tiny muted" x="657" y="514" text-anchor="middle">Kidneys excrete</text>
  <text class="small ink" x="657" y="532" text-anchor="middle" font-weight="700">{HCO3} {DN}</text>

  <text class="val ink" x="814" y="466" text-anchor="middle">{DN} {HCO3}</text>
  <text class="tiny muted" x="814" y="486" text-anchor="middle">Metabolic acidosis</text>
  <text class="tiny muted" x="814" y="514" text-anchor="middle">Lungs blow off</text>
  <text class="small ink" x="814" y="532" text-anchor="middle" font-weight="700">{CO2} {DN}</text>

  <text class="val ink" x="971" y="466" text-anchor="middle">{UP} {HCO3}</text>
  <text class="tiny muted" x="971" y="486" text-anchor="middle">Metabolic alkalosis</text>
  <text class="tiny muted" x="971" y="514" text-anchor="middle">Lungs retain</text>
  <text class="small ink" x="971" y="532" text-anchor="middle" font-weight="700">{CO2} {UP}</text>

  <rect class="panel" x="172" y="578" width="888" height="56" rx="8"/>
  <text class="hdr teal" x="196" y="601">REMEMBER {EM} ROME</text>
  <text class="small ink" x="196" y="622"><tspan font-weight="700">R</tspan>espiratory <tspan font-weight="700">O</tspan>pposite, <tspan font-weight="700">M</tspan>etabolic <tspan font-weight="700">E</tspan>qual</text>
  <text class="small muted" x="470" y="601">pH gives direction. {CO2} vs {HCO3} gives the cause.</text>
  <text class="small muted" x="470" y="622">pH back in range with both values abnormal = fully compensated.</text>
{FOOTER}"""


def nines() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 760" width="1100" height="760" role="img" aria-labelledby="ronTitle ronDesc">
  <title id="ronTitle">Burn Assessment {EM} Rule of Nines (Adult)</title>
  <desc id="ronDesc">Adult Rule of Nines with percentages split per body view. Head 4.5 percent per view, each arm 4.5 percent per view, each leg 9 percent per view, anterior trunk 18 percent, posterior trunk 18 percent, perineum 1 percent. Front and back each total 50 percent for a whole-body total of 100 percent.</desc>
  <style>{STYLE}
    .bodyfill {{ fill: #dff0f2; stroke: #0d7f8c; stroke-width: 2; stroke-linejoin: round; }}
    .seam   {{ stroke: #0d7f8c; stroke-width: 1.4; stroke-dasharray: 5 4; fill: none; }}
    .leadl  {{ stroke: #7fa3b0; stroke-width: 1.2; fill: none; }}
    .viewhd {{ font-size: 14px; font-weight: 700; letter-spacing: 1.4px; }}
    .lbl    {{ font-size: 13px; font-weight: 700; }}
    .pct    {{ font-size: 16px; font-weight: 700; }}
    .total  {{ font-size: 14px; font-weight: 700; }}
  </style>

  <rect class="bg" width="1100" height="760"/>

  <circle class="navy" cx="70" cy="44" r="24"/>
  <text class="pct white" x="70" y="51" text-anchor="middle">9%</text>
  <text class="h1 ink" x="110" y="41">Burn Assessment {EM} <tspan class="teal">Rule of Nines</tspan> (Adult)</text>
  <text class="body muted" x="112" y="64">Each view carries half of its region. Front and back together total 100%.</text>

  {_figure(175, "ANTERIOR (FRONT)", anterior=True)}
  {_figure(495, "POSTERIOR (BACK)", anterior=False)}

  <rect class="card" x="680" y="98" width="380" height="238" rx="10"/>
  <rect class="teal" x="680" y="98" width="380" height="30" rx="10"/>
  <rect class="teal" x="680" y="118" width="380" height="10"/>
  <text class="hdr white" x="700" y="118">KEY POINTS</text>
  <text class="body ink" x="700" y="152">{_b("Halve the region for a single view")} {EM} the</text>
  <text class="body ink" x="700" y="170">front of one arm is 4.5%, not 9%.</text>
  <text class="body ink" x="700" y="198">Count {_b("partial-thickness and full-thickness")}</text>
  <text class="body ink" x="700" y="216">burns. <tspan font-weight="700" fill="#b3402c">Superficial (first-degree) burns</tspan></text>
  <text class="body ink" x="700" y="234"><tspan font-weight="700" fill="#b3402c">are NOT counted</tspan> toward TBSA.</text>
  <text class="body ink" x="700" y="262">Do not double-count overlapping areas.</text>
  <text class="body ink" x="700" y="290">TBSA drives fluid resuscitation {EM} an</text>
  <text class="body ink" x="700" y="308">overestimate means over-resuscitation.</text>

  <rect class="panel" x="680" y="354" width="380" height="96" rx="10"/>
  <text class="hdr teal" x="700" y="380">CHECK YOUR MATH</text>
  <text class="small ink" x="700" y="404">Head 9 + arms 18 + legs 36 + trunk 36</text>
  <text class="small ink" x="700" y="422">+ perineum 1 = {_b("100% whole body")}</text>
  <text class="small muted" x="700" y="441">Over 100%? You counted a whole region on one view.</text>

  <rect class="amber" x="680" y="468" width="380" height="152" rx="10"/>
  <rect class="navy" x="680" y="468" width="380" height="30" rx="10"/>
  <rect class="navy" x="680" y="488" width="380" height="10"/>
  <text class="hdr white" x="700" y="488">NOTE</text>
  <text class="body ink" x="700" y="522">The Rule of Nines is for {_b("ADULTS")}.</text>
  <text class="body ink" x="700" y="546">Children have proportionally larger heads {EM}</text>
  <text class="body ink" x="700" y="564">use the {_b("Lund" + EN + "Browder chart")} for pediatrics.</text>
  <text class="body ink" x="700" y="592">The {_b("palm method")} (client{RSQUO}s palm {APPROX} 1%)</text>
  <text class="body ink" x="700" y="610">helps with scattered or irregular burns.</text>
{FOOTER}"""


def _b(s: str) -> str:
    return f'<tspan font-weight="700">{s}</tspan>'


def _figure(cx: int, heading: str, anterior: bool) -> str:
    """One body view, centred on `cx`.

    The silhouette is drawn in local coordinates and scaled down so the callout
    columns on either side have room; at full size the inner labels of the two
    views collide.
    """
    scale = 0.68
    # Local y 144 (top of head) lands at screen y 150.
    dy = 150 - 144 * scale
    lx = cx - 62  # right edge of the left-hand callout column
    rx = cx + 62  # left edge of the right-hand callout column
    arm_x = round(48 * scale / 0.68)  # horizontal reach of the arm leader lines
    near = "RIGHT" if anterior else "LEFT"
    far = "LEFT" if anterior else "RIGHT"
    trunk = "ANTERIOR" if anterior else "POSTERIOR"

    body = f"""  <g transform="translate({cx} {dy:.1f}) scale({scale})">
    <ellipse class="bodyfill" cx="0" cy="176" rx="27" ry="32"/>
    <path class="bodyfill" d="M-8 206 h16 v14 h-16 z"/>
    <path class="bodyfill" d="M0 218 c-30 0 -52 10 -56 22 l-6 74 c-1 14 2 26 6 34 h112 c4 -8 7 -20 6 -34 l-6 -74 c-4 -12 -26 -22 -56 -22 z"/>
    <path class="bodyfill" d="M-56 242 c-14 4 -22 14 -25 28 l-12 76 c-2 12 -1 22 3 30 l14 -2 c2 -10 4 -20 6 -30 l16 -70 z"/>
    <path class="bodyfill" d="M56 242 c14 4 22 14 25 28 l12 76 c2 12 1 22 -3 30 l-14 -2 c-2 -10 -4 -20 -6 -30 l-16 -70 z"/>
    <path class="bodyfill" d="M-50 348 l4 88 c1 30 4 62 8 88 l6 44 h26 l2 -44 c1 -28 2 -60 2 -88 l2 -88 z"/>
    <path class="bodyfill" d="M50 348 l-4 88 c-1 30 -4 62 -8 88 l-6 44 h-26 l-2 -44 c-1 -28 -2 -60 -2 -88 l-2 -88 z"/>
    <line class="seam" x1="-56" y1="242" x2="56" y2="242"/>
    <line class="seam" x1="-54" y1="348" x2="54" y2="348"/>
    {'<line class="seam" x1="0" y1="240" x2="0" y2="348"/>' if not anterior else ''}
  </g>"""

    perineum = (
        f"""
  <text class="lbl ink" x="{lx}" y="424" text-anchor="end">PERINEUM</text>
  <text class="pct teal" x="{lx}" y="442" text-anchor="end">1%</text>
  <line class="leadl" x1="{lx + 4}" y1="430" x2="{cx - 10}" y2="285"/>"""
        if anterior
        else ""
    )

    return f"""
  <rect class="navy" x="{cx - 112}" y="98" width="224" height="28" rx="5"/>
  <text class="viewhd white" x="{cx}" y="117" text-anchor="middle">{heading}</text>

{body}

  <text class="lbl ink" x="{lx}" y="166" text-anchor="end">HEAD</text>
  <text class="pct teal" x="{lx}" y="184" text-anchor="end">4.5%</text>
  <line class="leadl" x1="{lx + 4}" y1="172" x2="{cx - 19}" y2="172"/>

  <text class="lbl ink" x="{lx}" y="250" text-anchor="end">{near} ARM</text>
  <text class="pct teal" x="{lx}" y="268" text-anchor="end">4.5%</text>
  <line class="leadl" x1="{lx + 4}" y1="256" x2="{cx - arm_x}" y2="256"/>

  <text class="lbl ink" x="{lx}" y="359" text-anchor="end">{near} LEG</text>
  <text class="pct teal" x="{lx}" y="377" text-anchor="end">9%</text>
  <line class="leadl" x1="{lx + 4}" y1="365" x2="{cx - 22}" y2="365"/>

  <text class="lbl ink" x="{rx}" y="186">{trunk}</text>
  <text class="lbl ink" x="{rx}" y="202">TRUNK</text>
  <text class="pct teal" x="{rx}" y="222">18%</text>
  <line class="leadl" x1="{rx - 4}" y1="211" x2="{cx + 22}" y2="242"/>

  <text class="lbl ink" x="{rx}" y="262">{far} ARM</text>
  <text class="pct teal" x="{rx}" y="280">4.5%</text>
  <line class="leadl" x1="{rx - 4}" y1="268" x2="{cx + arm_x}" y2="258"/>

  <text class="lbl ink" x="{rx}" y="369">{far} LEG</text>
  <text class="pct teal" x="{rx}" y="387">9%</text>
  <line class="leadl" x1="{rx - 4}" y1="375" x2="{cx + 22}" y2="368"/>
{perineum}

  <rect class="panel" x="{cx - 112}" y="470" width="224" height="30" rx="5"/>
  <text class="total ink" x="{cx}" y="490" text-anchor="middle">{"Front" if anterior else "Back"} total = 50%</text>
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, svg in (
        ("abg-interpretation-ladder.svg", abg()),
        ("burn-rule-of-nines.svg", nines()),
    ):
        path = OUT / name
        path.write_bytes(svg.encode("ascii"))
        print(f"wrote {path} ({path.stat().st_size:,} bytes, ascii-clean)")


if __name__ == "__main__":
    main()
