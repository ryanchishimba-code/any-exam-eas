import { PrepPriceBarChart } from "@/components/marketing/PrepPriceBarChart";
import type { PrepPriceBarChartData } from "@/lib/marketing/prep-price-bar-chart";

export function BoardPriceCompare({ chart }: { chart: PrepPriceBarChartData }) {
  return <PrepPriceBarChart data={chart} />;
}
