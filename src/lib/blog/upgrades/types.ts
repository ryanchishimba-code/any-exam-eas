export type BlogFaq = { q: string; a: string };

export type BlogUpgrade = {
  slug: string;
  /** Visible H1. Kept in sync with metaTitle when both fit the title budget. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** One primary query. Used for the audit, not printed as a keyword dump. */
  primaryKeyword: string;
  searchIntent: string;
  content: string;
  readTime: number;
};
