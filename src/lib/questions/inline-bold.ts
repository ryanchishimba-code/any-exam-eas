export type InlineBoldPart = {
  text: string;
  bold: boolean;
};

const INLINE_BOLD = /(\*\*[^*]+\*\*)/g;

/**
 * Split student-facing text into plain runs and **bold** runs.
 * The result is data. Callers render it as text nodes, never as HTML.
 */
export function splitInlineBold(text: string): InlineBoldPart[] {
  if (!text) return [];
  return text.split(INLINE_BOLD).flatMap((part) => {
    if (!part) return [];
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return [{ text: part.slice(2, -2), bold: true }];
    }
    return [{ text: part, bold: false }];
  });
}

/** Plain text for controls that cannot hold elements, such as a native option. */
export function stripInlineBoldMarkers(text: string): string {
  return splitInlineBold(text)
    .map((part) => part.text)
    .join("");
}
