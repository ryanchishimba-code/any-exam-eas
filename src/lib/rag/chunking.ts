/** Semantic-ish chunking: paragraph boundaries, overlap, max token estimate. */

const DEFAULT_MAX_CHARS = 1800;
const OVERLAP_CHARS = 200;

export type ChunkOptions = {
  maxChars?: number;
  overlapChars?: number;
};

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Split on paragraph breaks first, then merge/split to target size. */
export function semanticChunk(
  text: string,
  options: ChunkOptions = {}
): string[] {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const overlap = options.overlapChars ?? OVERLAP_CHARS;
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buffer = "";

  for (const para of paragraphs) {
    if (buffer.length + para.length + 2 <= maxChars) {
      buffer = buffer ? `${buffer}\n\n${para}` : para;
      continue;
    }

    if (buffer) {
      chunks.push(buffer);
      buffer = overlap > 0 ? buffer.slice(-overlap) : "";
    }

    if (para.length <= maxChars) {
      buffer = buffer ? `${buffer}\n\n${para}` : para;
    } else {
      for (const sentenceChunk of splitLongParagraph(para, maxChars)) {
        chunks.push(sentenceChunk);
      }
      buffer = "";
    }
  }

  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks.filter((c) => c.length > 40);
}

function splitLongParagraph(text: string, maxChars: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) ?? [text];
  const out: string[] = [];
  let buf = "";

  for (const s of sentences) {
    const piece = s.trim();
    if (!piece) continue;
    if (buf.length + piece.length + 1 <= maxChars) {
      buf = buf ? `${buf} ${piece}` : piece;
    } else {
      if (buf) out.push(buf);
      buf = piece.length > maxChars ? piece.slice(0, maxChars) : piece;
    }
  }
  if (buf) out.push(buf);
  return out;
}

export function chunkSearchResults(
  items: Array<{ title: string; url: string; content: string; sourceType: string }>,
  fieldId: string
): import("./types").RagDocument[] {
  return items.map((item, docIdx) => {
    const docId = `doc-${fieldId}-${docIdx}-${hashUrl(item.url)}`;
    const parts = semanticChunk(`${item.title}\n\n${item.content}`);
    return {
      id: docId,
      fieldId,
      title: item.title,
      url: item.url,
      sourceType: item.sourceType as import("./types").RagSourceType,
      fullText: item.content,
      chunks: parts.map((content, chunkIndex) => ({
        id: `${docId}-c${chunkIndex}`,
        documentId: docId,
        content,
        chunkIndex,
        sourceType: item.sourceType as import("./types").RagSourceType,
        title: item.title,
        url: item.url,
      })),
    };
  });
}

function hashUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
