/** Client-safe published NGN sentence. No database or Node imports. */

function exactCount(count: number): string {
  return Math.max(0, Math.floor(count)).toLocaleString("en-US");
}

/** Same sentence on the board page and the question bank. */
export function formatPublishedNgnSentence(units: {
  standaloneNgn: number;
  caseItems: number;
  caseStudies: number;
}): string {
  const caseItems = Math.max(0, Math.floor(units.caseItems));
  const standalone = Math.max(0, Math.floor(units.standaloneNgn));
  const total = caseItems + standalone;
  if (total <= 0) return "";
  return `${exactCount(total)} published NGN items (${exactCount(caseItems)} scored case items + ${exactCount(standalone)} standalone)`;
}
