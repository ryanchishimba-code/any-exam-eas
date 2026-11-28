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

  it("reads h3 pairs after a plain FAQ heading and stops at the next h2", () => {
    const html = [
      "<h2>How to study</h2><h3>Not an FAQ</h3><p>Skip this.</p>",
      "<h2>Frequently asked questions</h2>",
      "<h3>How long is the exam?</h3><p>Five hours.</p>",
      "<h3>How many items?</h3><p>85 to 150.</p>",
      "<h2>Sources</h2><h3>Roediger</h3><p>2006.</p>",
    ].join("");
    expect(extractBlogFaqs(html)).toEqual([
      { question: "How long is the exam?", answer: "Five hours." },
      { question: "How many items?", answer: "85 to 150." },
    ]);
  });

  it("reads questions the editor saved as ### text inside one paragraph", () => {
    const html = [
      "<h2>Frequently asked questions</h2>",
      "<p>### How many questions should I do a day? Fifteen to forty. ### Will this guarantee a pass? No.</p>",
      "<p>To start the habit, try a free question.</p>",
      "<h2>Sources</h2><p>### Not a question. A citation.</p>",
    ].join("");
    expect(extractBlogFaqs(html)).toEqual([
      { question: "How many questions should I do a day?", answer: "Fifteen to forty." },
      { question: "Will this guarantee a pass?", answer: "No." },
    ]);
  });

  it("keeps the authored faq section when a later heading also says FAQ", () => {
    const html = [
      '<section class="aee-faq"><h2>Frequently asked questions</h2>',
      "<h3>Inside?</h3><p>Yes.</p></section>",
      "<h2>FAQ</h2><h3>Outside?</h3><p>No.</p>",
    ].join("");
    expect(extractBlogFaqs(html)).toEqual([{ question: "Inside?", answer: "Yes." }]);
  });
});
