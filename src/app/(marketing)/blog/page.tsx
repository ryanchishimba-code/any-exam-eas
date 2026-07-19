import Link from "next/link";
import type { Metadata } from "next";
import { listPublishedBlogPosts, type PublicBlogPostCard } from "@/lib/blog/public";
import { MAX_BLOG_POSTS } from "@/lib/blog/limits";
import { ROUTES } from "@/lib/routes";
/** ISR — public list is cached; admin writes call revalidatePublicBlog(). */
export const revalidate = 60;

const BLOG_TITLE = "Board Exam Prep Blog — Study Tips & Guides";
const BLOG_DESCRIPTION =
  "Study tips, exam roadmaps and Qbank strategy for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE. Practical guides written by clinician educators in 2026.";

export const metadata: Metadata = {
  title: { absolute: BLOG_TITLE },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Cover({
  post,
  className,
  priority = false,
}: {
  post: PublicBlogPostCard;
  className?: string;
  priority?: boolean;
}) {
  if (post.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.coverImage}
        alt=""
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }
  return (
    <div className={`aee-blog-cover-fallback ${className ?? ""}`}>
      <span>{post.category}</span>
    </div>
  );
}

export default async function BlogIndexPage() {
  const posts = await listPublishedBlogPosts({ limit: MAX_BLOG_POSTS });
  const [featured, ...rest] = posts;

  return (
    <div className="aee-blog">
      <section className="aee-blog-hero">
        <div className="aee-blog-hero-inner apple-animate-in">
          <p className="aee-blog-kicker">Stories</p>
          <h1 className="aee-blog-title">Ideas that help you pass.</h1>
          <p className="aee-blog-lede">
            Clear, high-yield guidance for NCLEX, USMLE, NAPLEX, and the rest of your boards —
            written for busy students.
          </p>
        </div>
      </section>

      <div className="aee-blog-body">
        {posts.length === 0 ? (
          <div className="aee-blog-empty apple-animate-in">
            <p>
              New stories are on the way. Meanwhile, explore the{" "}
              <Link href={ROUTES.toolkit}>Toolkit</Link>.
            </p>
          </div>
        ) : (
          <>
            {featured ? (
              <Link
                href={`/blog/${featured.slug}`}
                className="aee-blog-featured apple-animate-in group"
              >
                <div className="aee-blog-featured-media">
                  <Cover post={featured} className="aee-blog-featured-img" priority />
                </div>
                <div className="aee-blog-featured-copy">
                  <p className="aee-blog-meta">
                    <span>{featured.category}</span>
                    <span aria-hidden>·</span>
                    <span>{featured.readTime} min read</span>
                  </p>
                  <h2 className="aee-blog-featured-title">{featured.title}</h2>
                  {featured.excerpt ? (
                    <p className="aee-blog-featured-excerpt">{featured.excerpt}</p>
                  ) : null}
                  <p className="aee-blog-byline">
                    {formatDate(featured.publishedAt)}
                    {featured.authorName ? ` · ${featured.authorName}` : ""}
                  </p>
                  <span className="aee-blog-read">Read story</span>
                </div>
              </Link>
            ) : null}

            {rest.length > 0 ? (
              <ul className="aee-blog-list">
                {rest.map((post, index) => (
                  <li
                    key={post.id}
                    className="apple-animate-in"
                    style={{ animationDelay: `${0.12 + index * 0.08}s` }}
                  >
                    <Link href={`/blog/${post.slug}`} className="aee-blog-row group">
                      <div className="aee-blog-row-media">
                        <Cover post={post} className="aee-blog-row-img" />
                      </div>
                      <div className="aee-blog-row-copy">
                        <p className="aee-blog-meta">
                          <span>{post.category}</span>
                          <span aria-hidden>·</span>
                          <span>{post.readTime} min</span>
                        </p>
                        <h2 className="aee-blog-row-title">{post.title}</h2>
                        {post.excerpt ? (
                          <p className="aee-blog-row-excerpt">{post.excerpt}</p>
                        ) : null}
                        <p className="aee-blog-byline">{formatDate(post.publishedAt)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
