import { describe, expect, it } from "vitest";
import { extractBlogFaqs, blogFaqJsonLd } from "@/lib/blog/schema";

describe("blog FAQ schema", () => {
  it("reads question and answer pairs from the faq section", () => {
    const html = `<section class="aee-faq"><h2>Frequently asked questions</h2><h3>How long is the exam?</h3><p>Five hours.</p><h3>How many items?</h3><p>85 to 150.</p></section>`;
    const faqs = extractBlogFaqs(html);
    expect(faqs).toEqual([
      { question: "How long is the exam?", answer: "Five hours." },
      { question: "How many items?", answer: "85 to 150." },
    ]);
    const schema = blogFaqJsonLd(faqs);
    expect(schema?.["@type"]).toBe("FAQPage");
  });
});
