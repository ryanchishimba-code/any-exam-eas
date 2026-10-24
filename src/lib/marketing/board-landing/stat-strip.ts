/** Up to three sourced figures for the board landing stat strip (numeric values only). */
export function boardStatStripFigures(
  stats: { value: string; label: string }[]
): { value: string; label: string }[] {
  return stats.filter((stat) => /\d/.test(stat.value)).slice(0, 3);
}
