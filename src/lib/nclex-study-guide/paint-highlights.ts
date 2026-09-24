export type PaintableHighlight = {
  id: string;
  selectedText: string;
  color: string;
};

const HIGHLIGHT_COLORS = new Set(["yellow", "teal", "gold", "rose", "lavender"]);

function unwrapMarks(root: HTMLElement) {
  root.querySelectorAll("mark.sg-hl").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
  root.normalize();
}

function wrapText(root: HTMLElement, needle: string, id: string, color: string): boolean {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest("mark.sg-hl, script, style")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    const idx = text.data.indexOf(needle);
    if (idx < 0) continue;
    const range = document.createRange();
    range.setStart(text, idx);
    range.setEnd(text, idx + needle.length);
    const mark = document.createElement("mark");
    mark.className = `sg-hl sg-hl--${color}`;
    mark.dataset.highlightId = id;
    try {
      range.surroundContents(mark);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/** Paint saved highlights onto chapter HTML without rewriting the manuscript. */
export function paintStudyGuideHighlights(
  root: HTMLElement,
  highlights: PaintableHighlight[]
) {
  unwrapMarks(root);
  for (const row of highlights) {
    const needle = row.selectedText.replace(/\s+/g, " ").trim();
    if (needle.length < 2) continue;
    const color = HIGHLIGHT_COLORS.has(row.color) ? row.color : "yellow";
    if (wrapText(root, needle, row.id, color)) continue;
    const short = needle.slice(0, 80);
    if (short.length >= 8 && short !== needle) wrapText(root, short, row.id, color);
  }
}
