export const DEFAULT_MATRIX_ROW_HEADER = "Finding";

/** Corner label for a matrix. Items that list tasks can replace the default. */
export function matrixRowHeader(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_MATRIX_ROW_HEADER;
  const trimmed = value.trim();
  return trimmed || DEFAULT_MATRIX_ROW_HEADER;
}
