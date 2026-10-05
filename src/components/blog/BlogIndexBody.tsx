"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PublicBlogPostCard } from "@/lib/blog/public";
import { sortBlogCategories } from "@/lib/blog/categories";
import { ROUTES } from "@/lib/routes";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
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
        alt={post.title}
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

function categoryHref(category: string | null) {
  if (!category) return ROUTES.blog;
  return `${ROUTES.blog}?category=${encodeURIComponent(category)}`;
}

export function BlogIndexBody({
  posts,
  category,
}: {
  posts: PublicBlogPostCard[];
  category: string | null;
}) {
  const visible = category ? posts.filter((post) => post.category === category) : posts;
  const categories = sortBlogCategories(posts.map((post) => post.category));
  const [featured, ...rest] = visible;

  return (
    <div className="aee-blog">
      <section className="aee-blog-hero">
        <div className="aee-blog-hero-inner apple-animate-in">
          <p className="aee-blog-kicker">Blog</p>
          <h1 className="aee-blog-title">Guides for the exam in front of you.</h1>
          <p className="aee-blog-lede">
            Study plans and exam rules for NCLEX, NAPLEX, USMLE, PANCE, AANP FNP, and NPTE-PT.
            Start with your board, then practice.
          </p>
          {categories.length > 0 ? (
            <nav className="aee-blog-cats" aria-label="Exam categories">
              <Link
                href={categoryHref(null)}
                className={category ? "aee-blog-cat" : "aee-blog-cat is-active"}
                aria-current={category ? undefined : "page"}
              >
                All
              </Link>
              {categories.map((name) => (
                <Link
                  key={name}
                  href={categoryHref(name)}
                  className={category === name ? "aee-blog-cat is-active" : "aee-blog-cat"}
                  aria-current={category === name ? "page" : undefined}
                >
                  {name}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      <div className="aee-blog-body">
        {visible.length === 0 ? (
          <div className="aee-blog-empty apple-animate-in">
            <p>
              {category
                ? `No ${category} articles yet.`
                : "No articles are published right now."}{" "}
              <Link href={category ? ROUTES.blog : ROUTES.toolkit}>
                {category ? "See all articles" : "Explore the Toolkit"}
              </Link>
              .
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

/** Category lives in the query string so `/blog` itself can stay cached. */
export function BlogIndexFiltered({ posts }: { posts: PublicBlogPostCard[] }) {
  const category = useSearchParams().get("category")?.trim() || null;
  return <BlogIndexBody posts={posts} category={category} />;
}
