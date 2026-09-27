import { absoluteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

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

/** FAQ pairs from the authored `<section class="aee-faq">` block. */
export function extractBlogFaqs(html: string): BlogFaqPair[] {
  const section = html.match(
    /<section\b[^>]*class="[^"]*\baee-faq\b[^"]*"[^>]*>([\s\S]*?)<\/section>/i
  );
  if (!section?.[1]) return [];
  const pairs = [...section[1].matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  return pairs
    .map((match) => ({
      question: stripTags(match[1] ?? ""),
      answer: stripTags(match[2] ?? ""),
    }))
    .filter((pair) => pair.question.length > 0 && pair.answer.length > 0);
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
  const authorName = input.authorName?.trim() || SITE_NAME;
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
      ? { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") }
      : { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
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
    name: "Board exam prep blog",
    url: absoluteUrl("/blog"),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
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
