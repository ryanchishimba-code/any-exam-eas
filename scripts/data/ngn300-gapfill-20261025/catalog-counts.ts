import { scoredItemCount, selectPublishedCatalog, type ServeCase, type ServeItem } from "@/lib/assessment/serve";

export type CatalogCounts = {
  publishedCases: number;
  caseItems: number;
  bowtie: number;
  trend: number;
  standalones: number;
  scoredItems: number;
};

export function catalogCountsFromRows(cases: ServeCase[], items: ServeItem[]): CatalogCounts {
  const catalog = selectPublishedCatalog({ cases, items });
  const caseItems = catalog.cases.reduce((sum, unit) => sum + unit.items.length, 0);
  const bowtie = catalog.standalones.filter((unit) => unit.item.itemType === "bowtie").length;
  const trend = catalog.standalones.filter((unit) => unit.item.itemType === "trend").length;
  const units = [...catalog.cases, ...catalog.standalones];
  return {
    publishedCases: catalog.cases.length,
    caseItems,
    bowtie,
    trend,
    standalones: catalog.standalones.length,
    scoredItems: scoredItemCount(units),
  };
}
