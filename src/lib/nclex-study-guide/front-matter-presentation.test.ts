import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { presentFrontMatter } from "./front-matter-presentation";
import { markdownToSimpleHtml } from "./markdown";

function ingested(relativeMd: string): string {
  const md = readFileSync(path.join(process.cwd(), relativeMd), "utf8").replace(
    /(!\[[^\]]*\]\()(?:\.\/)?visuals\//g,
    "$1/nclex-study-guide/visuals/"
  );
  return markdownToSimpleHtml(md, {
    imageSize: () => ({ width: 1100, height: 734 }),
  });
}

function textNodes(html: string): string[] {
  return [...html.matchAll(/>([^<]+)</g)]
    .map((match) => match[1]!.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .sort();
}

describe("presentFrontMatter", () => {
  it.each([
    ["content/nclex-study-guide/00-front-matter.md", "Pair this NCLEX book"],
    ["content/naplex-study-guide/00-front-matter.md", "Pair this NAPLEX book"],
    ["content/aanp-fnp-study-guide/00-front-matter.md", "Pair this AANP FNP book"],
  ])("keeps %s offer words and lifts them above the disclaimer", (file, phrase) => {
    const html = ingested(file);
    const presented = presentFrontMatter(html);

    expect(textNodes(presented)).toEqual(textNodes(html));
    expect(presented).toContain(phrase);
    expect(presented).toContain("5-day free trial");
    expect(presented).toContain("no payment method");
    expect(presented).toContain("$27.99/mo");
    expect(presented.match(/\$27\.99/g)).toHaveLength(1);

    const offerAt = presented.indexOf("5-day free trial");
    const pairingAt = presented.indexOf("Pairing with");
    const howToAt = presented.indexOf("How to use this book");
    const disclaimerAt = presented.indexOf("Study-aid disclaimer");
    expect(offerAt).toBeGreaterThan(-1);
    expect(offerAt).toBeLessThan(pairingAt);
    expect(pairingAt).toBeLessThan(howToAt);
    expect(howToAt).toBeLessThan(disclaimerAt);

    expect(presented).toContain('class="sg-figure sg-cover"');
    expect(presented).toContain("sg-front-spread");
    expect(presented).toContain('class="sg-offer"');
    expect(presented.indexOf("sg-cover")).toBeGreaterThan(presented.indexOf("sg-front-spread__copy"));
  });

  it("does not restyle a later figure whose alt is not the cover", () => {
    const presented = presentFrontMatter(
      ingested("content/aanp-fnp-study-guide/00-front-matter.md")
    );
    expect(presented).toContain("AANP vs ANCC soft callout");
    expect(presented).not.toMatch(/sg-cover"[^>]*>\s*<img[^>]*AANP vs ANCC/);
    const covers = presented.match(/sg-figure sg-cover/g) ?? [];
    expect(covers).toHaveLength(1);
  });

  it("is idempotent", () => {
    const once = presentFrontMatter(ingested("content/nclex-study-guide/00-front-matter.md"));
    expect(presentFrontMatter(once)).toBe(once);
  });

  it("leaves a clinical chapter alone", () => {
    const html =
      '<h2 id="preload">Preload</h2><p>Afterload is resistance.</p><figure class="sg-figure"><img src="/x.jpg" alt="Heart diagram" /></figure>';
    expect(presentFrontMatter(html)).toBe(html);
  });

  it("still shrinks a cover when the pairing block is missing", () => {
    const html =
      '<figure class="sg-figure"><img src="/c.jpg" alt="Book cover" /><figcaption>Book cover</figcaption></figure><h1>Title</h1>';
    const presented = presentFrontMatter(html);
    expect(presented).toContain("sg-cover");
    expect(presented).not.toContain("sg-front-spread");
    expect(textNodes(presented)).toEqual(textNodes(html));
  });

  it("keeps a search hit inside the moved trial sentence", () => {
    const html = ingested("content/nclex-study-guide/00-front-matter.md").replace(
      "5-day free trial",
      '5-day free <mark class="sg-search-hit">trial</mark>'
    );
    const presented = presentFrontMatter(html);
    expect(presented).toContain('<mark class="sg-search-hit">trial</mark>');
    expect(presented.indexOf("sg-search-hit")).toBeLessThan(presented.indexOf("How to use this book"));
  });
});
