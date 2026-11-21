import type { ReactNode } from "react";
import catalog from "../../../content/usmle-quickbites/diagrams.json";

/**
 * Small diagrams for USMLE Quick Bites. A bite names one only when the picture
 * is the fact. Colors match the Quick Bites ink and accent tokens.
 */

function Frame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 420 168" role="img" aria-label={label} className="h-auto w-full">
      <rect width="420" height="168" fill="var(--color-surface)" />
      <rect x="0" y="0" width="6" height="168" fill="var(--color-accent)" />
      {children}
    </svg>
  );
}

function Text({
  x,
  y,
  size = 13,
  weight = 600,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  weight?: number;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill="var(--color-ink)"
      fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
      fontSize={size}
      fontWeight={weight}
    >
      {children}
    </text>
  );
}

type CatalogRow = { title: string; rows: string[] };

function catalogPicture(id: string, alt: string): ReactNode | null {
  const row = (catalog as Record<string, CatalogRow>)[id];
  if (!row) return null;
  const ys = [58, 88, 118, 148];
  return (
    <Frame label={alt}>
      <Text x={20} y={28} size={14} weight={700}>
        {row.title}
      </Text>
      {row.rows.slice(0, 4).map((line, index) => (
        <Text key={line} x={20} y={ys[index] ?? 148} size={12} weight={500}>
          {line}
        </Text>
      ))}
    </Frame>
  );
}

export function UsmleBiteDiagram({ id, alt }: { id: string; alt: string }) {
  const picture = diagrams[id]?.(alt) ?? catalogPicture(id, alt);
  if (!picture) return null;
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)]">
      {picture}
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}

const diagrams: Record<string, (alt: string) => ReactNode> = {
  "acid-base": (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={15} weight={700}>
        Normal anion gap: check the urine
      </Text>
      <Text x={20} y={58} size={13} weight={500}>
        Urine anion gap = Na + K − Cl
      </Text>
      <Text x={20} y={88} size={13} weight={500}>
        Negative: the kidney is excreting acid
      </Text>
      <Text x={20} y={118} size={13} weight={500}>
        Positive: renal tubular acidosis
      </Text>
      <Text x={20} y={148} size={12} weight={500}>
        Low albumin hides unmeasured acid
      </Text>
    </Frame>
  ),
  diuretics: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={15} weight={700}>
        Where the diuretic works
      </Text>
      <Text x={20} y={58} size={13} weight={500}>
        Proximal tubule: carbonic anhydrase. Acidosis.
      </Text>
      <Text x={20} y={86} size={13} weight={500}>
        Thick ascending limb: loop. Wastes calcium.
      </Text>
      <Text x={20} y={114} size={13} weight={500}>
        Distal tubule: thiazide. Saves calcium.
      </Text>
      <Text x={20} y={142} size={13} weight={500}>
        Collecting duct: aldosterone block or ENaC. Saves K.
      </Text>
    </Frame>
  ),
  hypoxemia: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={15} weight={700}>
        100% oxygen does not fix a shunt
      </Text>
      <Text x={20} y={58} size={13} weight={500}>
        V/Q mismatch improves on oxygen
      </Text>
      <Text x={20} y={86} size={13} weight={500}>
        Shunt (V/Q = 0) does not
      </Text>
      <Text x={20} y={114} size={13} weight={500}>
        Carbon monoxide: PaO2 normal, content low
      </Text>
      <Text x={20} y={142} size={13} weight={500}>
        Right shift unloads: CO2, acid, heat, 2,3-BPG
      </Text>
    </Frame>
  ),
  murmurs: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={15} weight={700}>
        Less preload
      </Text>
      <Text x={20} y={58} size={13} weight={500}>
        Most murmurs get softer
      </Text>
      <Text x={20} y={86} size={13} weight={500}>
        HCM and mitral prolapse get louder or longer
      </Text>
      <Text x={20} y={122} size={15} weight={700}>
        More afterload (handgrip)
      </Text>
      <Text x={20} y={150} size={13} weight={500}>
        Regurgitation louder. HCM softer.
      </Text>
    </Frame>
  ),
  "steroid-blocks": (alt) => (
    <Frame label={alt}>
      <Text x={20} y={26} size={14} weight={700}>
        Which enzyme, which salt, which androgen
      </Text>
      <Text x={20} y={56} size={12} weight={500}>
        21: low cortisol, low aldosterone, high androgens
      </Text>
      <Text x={20} y={84} size={12} weight={500}>
        11: hypertension, low K, high androgens
      </Text>
      <Text x={20} y={112} size={12} weight={500}>
        17: hypertension, low K, low androgens
      </Text>
      <Text x={20} y={146} size={12} weight={500}>
        Virilized and hypertensive is not 21-hydroxylase
      </Text>
    </Frame>
  ),
  cycle: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={32} size={14} weight={700}>
        FSH → estradiol → LH surge → ovulation → progesterone
      </Text>
      <Text x={20} y={70} size={13} weight={500}>
        Progesterone starts after ovulation
      </Text>
      <Text x={20} y={102} size={13} weight={500}>
        No hCG: the corpus luteum fails and menses starts
      </Text>
      <Text x={20} y={140} size={13} weight={500}>
        Progesterone thickens cervical mucus
      </Text>
    </Frame>
  ),
  hypersensitivity: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={14} weight={700}>
        I IgE, minutes
      </Text>
      <Text x={20} y={58} size={14} weight={700}>
        II antibody on a cell
      </Text>
      <Text x={20} y={88} size={14} weight={700}>
        III immune complex
      </Text>
      <Text x={20} y={118} size={14} weight={700}>
        IV T cells, delayed
      </Text>
      <Text x={20} y={150} size={12} weight={500}>
        A rash at day ten is not type I
      </Text>
    </Frame>
  ),
  shock: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={26} size={14} weight={700}>
        Output, resistance, wedge
      </Text>
      <Text x={20} y={56} size={12} weight={500}>
        Hypovolemic: output down, resistance up, wedge down
      </Text>
      <Text x={20} y={84} size={12} weight={500}>
        Cardiogenic: output down, resistance up, wedge up
      </Text>
      <Text x={20} y={112} size={12} weight={500}>
        Distributive: output up, resistance down
      </Text>
      <Text x={20} y={146} size={12} weight={500}>
        Cold skin is high resistance. Warm skin is distributive.
      </Text>
    </Frame>
  ),
  "gram-cocci": (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={14} weight={700}>
        Catalase, then coagulase
      </Text>
      <Text x={20} y={60} size={13} weight={500}>
        Catalase positive: staphylococcus
      </Text>
      <Text x={20} y={88} size={13} weight={500}>
        Coagulase positive: Staphylococcus aureus
      </Text>
      <Text x={20} y={122} size={13} weight={500}>
        Catalase negative: streptococcus
      </Text>
      <Text x={20} y={150} size={13} weight={500}>
        Then split by hemolysis
      </Text>
    </Frame>
  ),
  "two-by-two": (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={14} weight={700}>
        Read the table in the right direction
      </Text>
      <Text x={20} y={60} size={13} weight={500}>
        Sensitivity: down the disease column
      </Text>
      <Text x={20} y={88} size={13} weight={500}>
        Specificity: down the no-disease column
      </Text>
      <Text x={20} y={122} size={13} weight={500}>
        Positive predictive value: across the positive row
      </Text>
      <Text x={20} y={150} size={13} weight={500}>
        Prevalence moves the row, not the columns
      </Text>
    </Frame>
  ),
  "stroke-window": (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={14} weight={700}>
        Inside 4.5 hours
      </Text>
      <Text x={20} y={58} size={13} weight={500}>
        Tenecteplase 0.25 mg/kg, max 25 mg
      </Text>
      <Text x={20} y={86} size={13} weight={500}>
        or alteplase 0.9 mg/kg, max 90 mg
      </Text>
      <Text x={20} y={122} size={13} weight={500}>
        Pressure before the drug: under 185/110
      </Text>
      <Text x={20} y={150} size={13} weight={500}>
        No reperfusion and under 220/120: do not lower
      </Text>
    </Frame>
  ),
  gdmt: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={28} size={14} weight={700}>
        HFrEF, all four
      </Text>
      <Text x={20} y={58} size={13} weight={500}>
        ARNI
      </Text>
      <Text x={20} y={82} size={13} weight={500}>
        Evidence-based beta blocker
      </Text>
      <Text x={20} y={106} size={13} weight={500}>
        Mineralocorticoid antagonist
      </Text>
      <Text x={20} y={130} size={13} weight={500}>
        SGLT2 inhibitor
      </Text>
      <Text x={20} y={156} size={12} weight={500}>
        Improved EF stays on these drugs
      </Text>
    </Frame>
  ),
  "gold-abe": (alt) => (
    <Frame label={alt}>
      <Text x={20} y={26} size={14} weight={700}>
        GOLD 2027, treatment-naive
      </Text>
      <Text x={20} y={56} size={12} weight={500}>
        No exacerbation, few symptoms: a bronchodilator
      </Text>
      <Text x={20} y={84} size={12} weight={500}>
        No exacerbation, more symptoms: LABA + LAMA
      </Text>
      <Text x={20} y={112} size={12} weight={500}>
        One moderate or severe exacerbation: LABA + LAMA
      </Text>
      <Text x={20} y={146} size={12} weight={500}>
        Eosinophils ≥ 300: consider triple therapy
      </Text>
    </Frame>
  ),
  screening: (alt) => (
    <Frame label={alt}>
      <Text x={20} y={26} size={14} weight={700}>
        Start, and how often
      </Text>
      <Text x={20} y={54} size={12} weight={500}>
        Breast: every other year, 40 through 74
      </Text>
      <Text x={20} y={80} size={12} weight={500}>
        Colon: start at 45
      </Text>
      <Text x={20} y={106} size={12} weight={500}>
        Lung: yearly low-dose CT, 50 to 80, 20 pack-years
      </Text>
      <Text x={20} y={132} size={12} weight={500}>
        Cervix: start at 21
      </Text>
      <Text x={20} y={156} size={12} weight={500}>
        Stop lung screening 15 years after quitting
      </Text>
    </Frame>
  ),
};
