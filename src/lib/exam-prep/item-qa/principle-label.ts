/**
 * Shared schema field, board-local label.
 * The stored key is always `governingPrinciple`.
 */
export function principleFieldLabel(fieldId: string | null | undefined): string {
  const id = (fieldId ?? "").trim().toLowerCase();
  if (id === "nursing" || id.startsWith("nclex")) return "Nursing priority";
  if (id === "pharmacy" || id === "naplex" || id.startsWith("mpje")) return "Monitoring rule";
  if (id.startsWith("usmle") || id === "pance" || id === "aanp-fnp") return "Clinical pearl";
  if (id === "npte-pt") return "Intervention principle";
  return "Governing principle";
}
