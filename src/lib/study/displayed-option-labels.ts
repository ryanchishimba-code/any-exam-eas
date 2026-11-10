/**
 * Rationale letters follow the stored option order (A, B, C, D).
 * The study screen numbers those same options 1, 2, 3, 4.
 * This rewrites the letter the student reads so it matches the number on screen.
 * It does not change the stored stem, options, or key.
 */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function optionNumber(options: readonly string[], fragment: string): number | null {
  const needle = normalize(fragment);
  if (needle.length < 1) return null;
  let bestIndex = -1;
  let bestLength = -1;
  options.forEach((option, index) => {
    const hay = normalize(option);
    if (!hay) return;
    const hit = hay.includes(needle) || needle.includes(hay);
    if (!hit) return;
    const length = Math.min(hay.length, needle.length);
    if (length > bestLength) {
      bestLength = length;
      bestIndex = index;
    }
  });
  return bestIndex >= 0 ? bestIndex + 1 : null;
}

/**
 * "Correct answer: C. 11.43 mg/L" becomes "Correct answer: 1. 11.43 mg/L"
 * when 11.43 mg/L is displayed as option 1.
 * "A. 8 mg/L" becomes the number of the option whose text is 8 mg/L.
 */
export function alignRationaleToDisplayedOptions(
  text: string,
  options: readonly string[] | null | undefined
): string {
  if (!text || !options || options.length < 2) return text;
  const rewriteFragment = (lead: string, fragment: string): string => {
    const number = optionNumber(options, fragment);
    if (number == null) return `${lead}${fragment}`;
    return `${lead}${number}. ${fragment.trim()}`;
  };

  let next = text.replace(
    /([Cc]orrect answer:\s*)(?:[A-E]|\d+)\s*[.)]\s*([^\n.]+)/g,
    (_full, lead: string, fragment: string) => rewriteFragment(lead, fragment)
  );

  next = next.replace(
    /(^|\n)(\s*)([A-E])([.)])\s+([^\n]+)/g,
    (full, start: string, indent: string, _letter: string, _mark: string, fragment: string) => {
      const number = optionNumber(options, fragment);
      if (number == null) return full;
      return `${start}${indent}${number}. ${fragment.trim()}`;
    }
  );

  return next;
}
