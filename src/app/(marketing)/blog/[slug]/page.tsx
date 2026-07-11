import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { BlogViewTracker } from "@/components/blog/BlogViewTracker";
import {
  blogPostAbsoluteUrl,
  getPublishedBlogPostBySlug,
  listPublishedBlogSlugs,
  listRelatedBlogPosts,
} from "@/lib/blog/public";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

/** ISR — post HTML is cached; view counts update client-side. */
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await listPublishedBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || `${post.title} — ${SITE_NAME}`;
  const url = blogPostAbsoluteUrl(post.slug);

  return {
    title: `${title} — ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: { canonical: url },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Extract h2/h3 headings for a simple sticky TOC. */
function extractToc(html: string): { id: string; text: string; level: 2 | 3 }[] {
  const matches = [...html.matchAll(/<h([23])[^>]*>(.*?)<\/h\1>/gi)];
  return matches.map((m, i) => {
    const level = Number(m[1]) as 2 | 3;
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    const id = `section-${i}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
    return { id, text, level };
  });
}

function injectHeadingIds(html: string, toc: { id: string }[]): string {
  let i = 0;
  return html.replace(/<h([23])([^>]*)>/gi, (_full, level, attrs) => {
    const id = toc[i]?.id;
    i += 1;
    if (!id) return `<h${level}${attrs}>`;
    if (/\sid=/.test(attrs)) return `<h${level}${attrs}>`;
    return `<h${level}${attrs} id="${id}">`;
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await listRelatedBlogPosts(post.slug, post.category, 3);
  const toc = extractToc(post.content);
  const html = injectHeadingIds(post.content, toc);
  const url = blogPostAbsoluteUrl(post.slug);

  return (
    <>
      <BlogViewTracker slug={post.slug} />
      <article className="aee-blog-article">
        <div className="aee-blog-article-inner apple-animate-in">
          <nav className="text-sm text-[var(--color-ink-muted)]">
            <Link href={ROUTES.blog} className="hover:text-[var(--color-accent)]">
              ← Blog
            </Link>
          </nav>

          <header className="mt-8">
            <p className="aee-blog-meta">
              <span>{post.category}</span>
              <span aria-hidden>·</span>
              <span>{post.readTime} min read</span>
            </p>
            <h1 className="aee-blog-article-title">{post.title}</h1>
            <p className="aee-blog-byline">
              {formatDate(post.publishedAt)}
              {post.authorName ? ` · ${post.authorName}` : ""}
            </p>
            {post.excerpt ? (
              <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                {post.excerpt}
              </p>
            ) : null}
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt="" className="aee-blog-article-cover" />
            ) : null}
            <div className="mt-7 flex items-center justify-between gap-4 border-y border-[var(--color-border)] py-4">
              <BlogShareButtons url={url} title={post.title} />
              <p className="text-xs text-[var(--color-ink-muted)]">{post.views} views</p>
            </div>
          </header>

          {toc.length > 1 ? (
            <div className="mt-8 rounded-2xl bg-[var(--color-surface)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                On this page
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                    <a
                      href={`#${item.id}`}
                      className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div
            className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.authorName ? (
            <aside className="mt-14 flex items-center gap-4 border-t border-[var(--color-border)] pt-8">
              {post.authorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.authorImage}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface)] text-base font-bold text-[var(--color-ink)]">
                  {post.authorName.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--color-ink)]">{post.authorName}</p>
                <p className="text-sm text-[var(--color-ink-muted)]">
                  Clinician-built exam prep at {SITE_NAME}
                </p>
              </div>
            </aside>
          ) : null}

          {related.length > 0 ? (
            <nav className="mt-14 border-t border-[var(--color-border)] pt-10" aria-label="Related">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                More to read
              </h2>
              <ul className="mt-5 space-y-4">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="group block rounded-2xl px-1 py-2 transition hover:bg-[var(--color-surface)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                        {r.category}
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                        {r.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </article>
    </>
  );
}
