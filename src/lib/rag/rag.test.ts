import { describe, expect, it } from "vitest";
import { semanticChunk } from "@/lib/rag/chunking";
import { rankByKeyword } from "@/lib/rag/keyword";
import type { RagChunk } from "@/lib/rag/types";

describe("semanticChunk", () => {
  it("returns single chunk for short text", () => {
    const chunks = semanticChunk("Short paragraph about pharmacology.");
    expect(chunks).toHaveLength(1);
  });

  it("splits long text on paragraph boundaries", () => {
    const text = Array.from({ length: 8 }, (_, i) =>
      `Paragraph ${i}: ${"Clinical reasoning content. ".repeat(20)}`
    ).join("\n\n");
    const chunks = semanticChunk(text, { maxChars: 400 });
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(500);
    }
  });
});

describe("rankByKeyword", () => {
  it("ranks chunks by query term overlap", () => {
    const chunks: RagChunk[] = [
      {
        id: "1",
        documentId: "d1",
        chunkIndex: 0,
        content: "NCLEX prioritization infection control nursing",
        sourceType: "oer",
        title: "Nursing",
        url: "https://example.com/1",
      },
      {
        id: "2",
        documentId: "d2",
        chunkIndex: 0,
        content: "SAT algebra quadratic equations",
        sourceType: "oer",
        title: "Math",
        url: "https://example.com/2",
      },
    ];

    const ranked = rankByKeyword("NCLEX infection control prioritization", chunks, 2);
    expect(ranked[0].chunk.id).toBe("1");
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });
});
