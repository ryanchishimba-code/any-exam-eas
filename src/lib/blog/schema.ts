import { BLOG_INDEX_DESCRIPTION, BLOG_INDEX_TITLE } from "@/lib/blog/index-meta";
import { absoluteUrl } from "@/lib/seo";
import { organizationRef } from "@/lib/seo/brand-entity";
import { SCHEMA_BRAND_NAME } from "@/lib/seo/course-jsonld";

export type BlogFaqPair = { question: string; answer: string };

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const FAQ_HEADING = /frequently asked questions|faq/i;

function pairsFromH3(fragment: string): BlogFaqPair[] {
  const pairs = [
    ...fragment.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi),
  ];
  return pairs
    .map((match) => ({
      question: stripTags(match[1] ?? ""),
      answer: stripTags(match[2] ?? ""),
    }))
    .filter((pair) => pair.question.length > 0 && pair.answer.length > 0);
}

/**
 * The rich-text editor sometimes flattens pasted headings into one paragraph
 * that still starts each question with `###`.
 */
function pairsFromFlattenedMarkdown(fragment: string): BlogFaqPair[] {
  const pairs: BlogFaqPair[] = [];
  for (const paragraph of fragment.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(paragraph[1] ?? "");
    if (!text.includes("###")) continue;
    for (const chunk of text.split(/###\s*/)) {
      const body = chunk.trim();
      const mark = body.indexOf("?");
      if (!body || mark === -1) continue;
      const question = body.slice(0, mark + 1).trim();
      const answer = body.slice(mark + 1).trim();
      if (question.length > 1 && answer.length > 0) {
        pairs.push({ question, answer });
      }
    }
  }
  return pairs;
}

function fragmentAfterFaqHeading(html: string): string | null {
  const headings = html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi);
  for (const heading of headings) {
    if (!FAQ_HEADING.test(stripTags(heading[1] ?? ""))) continue;
    const start = (heading.index ?? 0) + heading[0].length;
    const rest = html.slice(start);
    const next = rest.search(/<h2\b/i);
    return next === -1 ? rest : rest.slice(0, next);
  }
  return null;
}

/** FAQ pairs from `<section class="aee-faq">`, or from a plain FAQ heading. */
export function extractBlogFaqs(html: string): BlogFaqPair[] {
  const section = html.match(
    /<section\b[^>]*class="[^"]*\baee-faq\b[^"]*"[^>]*>([\s\S]*?)<\/section>/i
  );
  if (section?.[1]) return pairsFromH3(section[1]);

  const fragment = fragmentAfterFaqHeading(html);
  if (!fragment) return [];
  const structured = pairsFromH3(fragment);
  if (structured.length > 0) return structured;
  return pairsFromFlattenedMarkdown(fragment);
}

export function blogBreadcrumbJsonLd(input: {
  title: string;
  slug: string;
  category: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: input.category,
        item: absoluteUrl(`/blog?category=${encodeURIComponent(input.category)}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: input.title,
        item: absoluteUrl(`/blog/${input.slug}`),
      },
    ],
  };
}

export function blogArticleJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
  updatedAt: string | null;
  authorName: string | null;
  imageUrl: string | null;
}): Record<string, unknown> {
  const authorName = input.authorName?.trim() || SCHEMA_BRAND_NAME;
  const brand = /any\s*exam/i.test(authorName);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(`/blog/${input.slug}`),
    datePublished: input.publishedAt ?? undefined,
    dateModified: input.updatedAt ?? input.publishedAt ?? undefined,
    author: brand
      ? organizationRef()
      : { "@type": "Person", name: authorName },
    publisher: organizationRef(),
    image: input.imageUrl ? [input.imageUrl] : undefined,
  };
}

export function blogFaqJsonLd(faqs: BlogFaqPair[]): Record<string, unknown> | null {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function blogIndexJsonLd(
  posts: { title: string; slug: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: BLOG_INDEX_TITLE,
    description: BLOG_INDEX_DESCRIPTION,
    url: absoluteUrl("/blog"),
    isPartOf: { "@type": "WebSite", name: SCHEMA_BRAND_NAME, url: absoluteUrl("/") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
      })),
    },
  };
}
