import { prisma } from "@/lib/prisma";
import {
  estimateReadTimeMinutes,
  slugifyTitle,
  type CreateBlogPostInput,
  type UpdateBlogPostInput,
} from "@/lib/admin/blog-validators";
import { BlogPostLimitError, MAX_BLOG_POSTS } from "@/lib/blog/limits";

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorId: string;
  authorName: string | null;
  authorEmail: string | null;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  readTime: number;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorId: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  readTime: number;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author?: { name: string | null; email: string } | null;
};

function serialize(row: BlogRow): AdminBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    authorId: row.authorId,
    authorName: row.author?.name ?? null,
    authorEmail: row.author?.email ?? null,
    category: row.category,
    tags: row.tags,
    published: row.published,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    readTime: row.readTime,
    views: row.views,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const authorSelect = { name: true, email: true } as const;

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base || "post";
  let n = 2;
  for (;;) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base.slice(0, 70)}-${n}`;
    n += 1;
  }
}

export type ListBlogOptions = {
  q?: string;
  status?: "published" | "draft" | "all";
  category?: string;
  includeDeleted?: boolean;
};

export async function listBlogPosts(opts: ListBlogOptions = {}): Promise<AdminBlogPost[]> {
  const status = opts.status ?? "all";
  const rows = await prisma.blogPost.findMany({
    where: {
      ...(opts.includeDeleted ? {} : { deletedAt: null }),
      ...(status === "published" ? { published: true } : {}),
      ...(status === "draft" ? { published: false } : {}),
      ...(opts.category ? { category: opts.category } : {}),
      ...(opts.q
        ? {
            OR: [
              { title: { contains: opts.q, mode: "insensitive" } },
              { slug: { contains: opts.q, mode: "insensitive" } },
              { excerpt: { contains: opts.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { author: { select: authorSelect } },
    orderBy: [{ updatedAt: "desc" }],
  });
  return rows.map(serialize);
}

export async function getBlogPost(id: string): Promise<AdminBlogPost | null> {
  const row = await prisma.blogPost.findUnique({
    where: { id },
    include: { author: { select: authorSelect } },
  });
  return row ? serialize(row) : null;
}

export async function countActiveBlogPosts(): Promise<number> {
  return prisma.blogPost.count({ where: { deletedAt: null } });
}

export async function assertCanCreateBlogPost(): Promise<void> {
  const count = await countActiveBlogPosts();
  if (count >= MAX_BLOG_POSTS) {
    throw new BlogPostLimitError(MAX_BLOG_POSTS);
  }
}

export async function createBlogPost(
  input: CreateBlogPostInput,
  authorId: string
): Promise<AdminBlogPost> {
  await assertCanCreateBlogPost();

  const baseSlug = input.slug?.trim() || slugifyTitle(input.title);
  const slug = await uniqueSlug(baseSlug);
  const content = input.content ?? "";
  const published = Boolean(input.published);
  const now = new Date();

  const row = await prisma.blogPost.create({
    data: {
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt?.trim() ?? "",
      content,
      coverImage: input.coverImage?.trim() || null,
      authorId,
      category: input.category?.trim() || "Study Tips",
      tags: input.tags ?? [],
      published,
      publishedAt: published ? now : null,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
      readTime: estimateReadTimeMinutes(content),
      metaTitle: input.metaTitle?.trim() || null,
      metaDescription: input.metaDescription?.trim() || null,
    },
    include: { author: { select: authorSelect } },
  });
  return serialize(row);
}

export async function updateBlogPost(
  id: string,
  input: UpdateBlogPostInput
): Promise<AdminBlogPost | null> {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) return null;

  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title.trim();
  if (input.excerpt !== undefined) data.excerpt = input.excerpt.trim();
  if (input.content !== undefined) {
    data.content = input.content;
    data.readTime = estimateReadTimeMinutes(input.content);
  }
  if (input.coverImage !== undefined) data.coverImage = input.coverImage?.trim() || null;
  if (input.category !== undefined) data.category = input.category.trim() || "Study Tips";
  if (input.tags !== undefined) data.tags = input.tags;
  if (input.metaTitle !== undefined) data.metaTitle = input.metaTitle?.trim() || null;
  if (input.metaDescription !== undefined) {
    data.metaDescription = input.metaDescription?.trim() || null;
  }
  if (input.scheduledAt !== undefined) {
    data.scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : null;
  }

  if (input.slug !== undefined) {
    data.slug = await uniqueSlug(input.slug.trim() || slugifyTitle(existing.title), id);
  } else if (input.title !== undefined && !existing.published) {
    // Keep draft slugs in sync with title until published.
    data.slug = await uniqueSlug(slugifyTitle(input.title), id);
  }

  if (input.published !== undefined) {
    data.published = input.published;
    if (input.published && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
    if (!input.published) {
      // Keep publishedAt for history when unpublishing.
    }
  }

  const row = await prisma.blogPost.update({
    where: { id },
    data,
    include: { author: { select: authorSelect } },
  });
  return serialize(row);
}

export async function softDeleteBlogPost(id: string): Promise<boolean> {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) return false;
  await prisma.blogPost.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });
  return true;
}

export async function bulkBlogAction(
  ids: string[],
  action: "publish" | "unpublish" | "delete"
): Promise<number> {
  if (action === "delete") {
    const result = await prisma.blogPost.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), published: false },
    });
    return result.count;
  }

  if (action === "publish") {
    const result = await prisma.blogPost.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { published: true, publishedAt: new Date() },
    });
    return result.count;
  }

  const result = await prisma.blogPost.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { published: false },
  });
  return result.count;
}

export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.blogPost.findFirst({
    where: {
      slug,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  return !existing;
}
