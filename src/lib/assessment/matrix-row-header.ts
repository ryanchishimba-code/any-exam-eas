export const DEFAULT_MATRIX_ROW_HEADER = "Finding";

/** Corner label for a matrix. The first non-blank string wins; otherwise "Finding". */
export function matrixRowHeader(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return DEFAULT_MATRIX_ROW_HEADER;
}
