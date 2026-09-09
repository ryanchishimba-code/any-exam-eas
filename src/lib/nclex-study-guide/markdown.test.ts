import { describe, expect, it } from "vitest";
import { markdownToSimpleHtml } from "./markdown";
import { readImageSize } from "./image-dimensions";
import { readdirSync } from "node:fs";
import path from "node:path";

const MD = `# Chapter

![one](/nclex-study-guide/visuals/a.jpg)

Prose between figures.

![two](/nclex-study-guide/visuals/b.jpg)

![three](/nclex-study-guide/visuals/c.svg)
`;

const size = (src: string) =>
  src.endsWith(".svg") ? { width: 1100, height: 760 } : { width: 1100, height: 734 };

const tagsOf = (html: string) => html.match(/<img[^>]*>/g) ?? [];

describe("figure emission", () => {
  // Figures without intrinsic dimensions reflow the chapter as they decode,
  // which reads as scroll judder. These assertions guard that regression.
  it("stamps width and height on every figure", () => {
    for (const tag of tagsOf(markdownToSimpleHtml(MD, { imageSize: size }))) {
      expect(tag).toMatch(/width="\d+" height="\d+"/);
      expect(tag).toContain("sg-img--sized");
    }
  });

  it("uses the resolved size per file, not a single default", () => {
    const tags = tagsOf(markdownToSimpleHtml(MD, { imageSize: size }));
    expect(tags[0]).toContain('width="1100" height="734"');
    expect(tags[2]).toContain('width="1100" height="760"');
  });

  it("eager-loads only the lead figure", () => {
    const tags = tagsOf(markdownToSimpleHtml(MD, { imageSize: size }));
    expect(tags[0]).toContain('loading="eager"');
    expect(tags[1]).toContain('loading="lazy"');
    expect(tags[2]).toContain('loading="lazy"');
  });

  it("still lazy-loads when no size resolver is supplied", () => {
    const tags = tagsOf(markdownToSimpleHtml(MD));
    expect(tags[0]).toContain('loading="eager"');
    expect(tags[1]).toContain('loading="lazy"');
    // No dimensions means no marker class, so the CSS min-height floor applies.
    expect(tags[0]).not.toContain("sg-img--sized");
  });

  it("marks unresolved figures so the CSS floor still catches them", () => {
    const tags = tagsOf(markdownToSimpleHtml(MD, { imageSize: () => undefined }));
    expect(tags).toHaveLength(3);
    for (const tag of tags) expect(tag).not.toContain("sg-img--sized");
  });
});

describe("shipped visual assets", () => {
  // Every guide's figures must be measurable at ingest, or that book goes back
  // to reflowing mid-scroll. Covers each exam so a new one cannot skip the check.
  it.each(["nclex-study-guide", "naplex-study-guide"])(
    "exposes readable dimensions for every figure in %s",
    (guideDir) => {
      const dir = path.join(process.cwd(), "public", guideDir, "visuals");
      const files = readdirSync(dir).filter((f) => /\.(jpe?g|svg)$/i.test(f));
      expect(files.length).toBeGreaterThan(0);

      const unreadable = files.filter((f) => !readImageSize(path.join(dir, f)));
      expect(unreadable).toEqual([]);
    }
  );
});
