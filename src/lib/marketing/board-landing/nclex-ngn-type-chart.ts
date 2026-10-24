import { formatExactQuestionCount } from "@/lib/counts";
import { nclexFormatCards } from "@/lib/marketing/board-landing/model";

export type NclexNgnTypeRow = {
  id: string;
  label: string;
  count: number;
};

const SHORT: Record<string, string> = {
  case: "Case studies",
  sata: "SATA",
  bowtie: "Bow-tie",
  matrix: "Matrix",
  ordered: "Ordered",
  highlight: "Highlight",
  drag: "Drag-drop",
  constructed: "Fill-in",
  "ngn-style": "NGN-style",
  standalone: "Standalone NGN",
};

function countFromDetail(detail: string): number {
  const match = /^([\d,]+)/.exec(detail);
  if (!match) return 0;
  return Number(match[1].replace(/,/g, "")) || 0;
}

/** Live NGN / item-type rows for the NCLEX hub bar chart (zeros omitted). */
export function buildNclexNgnTypeChartRows(input: {
  bankTypes: Record<string, number>;
  caseStudies: number;
  caseItems: number;
  standaloneNgn: number;
  bankNgnStyle: number;
  bankCaseStyle: number;
}): NclexNgnTypeRow[] {
  const cards = nclexFormatCards(input);
  const rows: NclexNgnTypeRow[] = [];
  for (const card of cards) {
    const count = card.id === "case"
      ? input.caseStudies
      : card.id === "standalone"
        ? input.standaloneNgn
        : countFromDetail(card.detail);
    if (count <= 0) continue;
    rows.push({
      id: card.id,
      label: SHORT[card.id] ?? card.title.split(" ").slice(0, 3).join(" "),
      count,
    });
  }
  return rows;
}

export function formatNgnTypeCount(count: number): string {
  return formatExactQuestionCount(count);
}
