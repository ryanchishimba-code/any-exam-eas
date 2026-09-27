/**
 * Upgrade the four published blog posts in place.
 *
 * Dry run (default) prints the plan and does not write.
 *   npx tsx scripts/upgrade-blog-posts.ts
 *
 * Apply (saves the previous row in blog_post_revisions first):
 *   BLOG_UPGRADE_CONFIRM=apply-blog-2026-09-27 npx tsx scripts/upgrade-blog-posts.ts --apply
 *
 * Production databases also need:
 *   BLOG_UPGRADE_ALLOW_PRODUCTION=1
 *
 * Restore the latest pre-upgrade snapshot for every slug:
 *   BLOG_UPGRADE_CONFIRM=apply-blog-2026-09-27 npx tsx scripts/upgrade-blog-posts.ts --restore
 *
 * Restore one snapshot:
 *   BLOG_UPGRADE_CONFIRM=apply-blog-2026-09-27 npx tsx scripts/upgrade-blog-posts.ts --restore --revision <id>
 *
 * Applying twice is a no-op when the live row already matches the catalog.
 * Do not point this at production unless you mean to. This agent run does not apply it.
 */
import { loadEnvFiles } from "./load-env";
import { BLOG_UPGRADES, BLOG_UPGRADE_VERSION } from "../src/lib/blog/upgrades/posts";
import {
  BLOG_UPGRADE_CONFIRM,
  editorialSnapshot,
  editorialsMatch,
  type BlogEditorialSnapshot,
} from "../src/lib/blog/upgrades/apply";
import { wordsInHtml } from "../src/lib/blog/upgrades/html";

type StoredPost = BlogEditorialSnapshot & {
  id: string;
  slug: string;
  published: boolean;
  publishedAt: Date | null;
  coverImage: string | null;
};

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function printPlan(): void {
  console.log(`Blog upgrade ${BLOG_UPGRADE_VERSION} — dry run (no database writes).`);
  for (const post of BLOG_UPGRADES) {
    console.log(
      [
        post.slug,
        `${wordsInHtml(post.content)} words`,
        `${post.readTime} min`,
        `keyword: ${post.primaryKeyword}`,
        `title (${post.metaTitle.length}): ${post.metaTitle}`,
        `description (${post.metaDescription.length})`,
      ].join(" | ")
    );
  }
  console.log("Re-run with --apply to write, or --restore to put the saved snapshot back.");
}

function assertConfirmed(): void {
  if (process.env.BLOG_UPGRADE_CONFIRM !== BLOG_UPGRADE_CONFIRM) {
    fail(
      `Refusing to write. Set BLOG_UPGRADE_CONFIRM=${BLOG_UPGRADE_CONFIRM} and pass --apply or --restore.`
    );
  }
  if (process.env.VERCEL_ENV === "production" && process.env.BLOG_UPGRADE_ALLOW_PRODUCTION !== "1") {
    fail("Refusing to write while VERCEL_ENV=production. Set BLOG_UPGRADE_ALLOW_PRODUCTION=1 to override.");
  }
}

function toSnapshot(row: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
}): BlogEditorialSnapshot {
  return {
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: [...row.tags],
    readTime: row.readTime,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

async function main(): Promise<void> {
  const apply = hasFlag("--apply");
  const restore = hasFlag("--restore");
  if (apply && restore) fail("Pass only one of --apply or --restore.");

  if (!apply && !restore) {
    printPlan();
    loadEnvFiles();
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      console.log("No DATABASE_URL in the environment. Skipped the live-row diff.");
      return;
    }
  } else {
    loadEnvFiles();
    assertConfirmed();
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      fail("DATABASE_URL is not set.");
    }
  }

  const { prisma } = await import("../src/lib/prisma");
  try {
    if (restore) {
      await restorePosts(prisma, argValue("--revision"));
    } else if (apply) {
      await applyPosts(prisma);
    } else {
      await diffPosts(prisma);
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function loadLive(prisma: {
  blogPost: {
    findMany: (args: object) => Promise<StoredPost[]>;
  };
}): Promise<Map<string, StoredPost>> {
  const rows = await prisma.blogPost.findMany({
    where: { slug: { in: BLOG_UPGRADES.map((post) => post.slug) }, deletedAt: null },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      category: true,
      tags: true,
      readTime: true,
      metaTitle: true,
      metaDescription: true,
      published: true,
      publishedAt: true,
      coverImage: true,
    },
  });
  return new Map(rows.map((row) => [row.slug, row]));
}

async function diffPosts(prisma: Parameters<typeof loadLive>[0]): Promise<void> {
  const live = await loadLive(prisma);
  for (const post of BLOG_UPGRADES) {
    const row = live.get(post.slug);
    if (!row) {
      console.log(`MISSING ${post.slug} — will not create a new URL`);
      continue;
    }
    const same = editorialsMatch(toSnapshot(row), editorialSnapshot(post));
    console.log(`${same ? "UNCHANGED" : "WOULD UPDATE"} /blog/${post.slug} (${row.id})`);
  }
}

async function applyPosts(prisma: {
  blogPost: {
    findMany: (args: object) => Promise<StoredPost[]>;
    update: (args: object) => Promise<unknown>;
  };
  blogPostRevision: {
    create: (args: object) => Promise<unknown>;
  };
}): Promise<void> {
  const live = await loadLive(prisma);
  let wrote = 0;
  for (const post of BLOG_UPGRADES) {
    const row = live.get(post.slug);
    if (!row) {
      console.log(`MISSING ${post.slug} — left untouched`);
      continue;
    }
    const next = editorialSnapshot(post);
    if (editorialsMatch(toSnapshot(row), next)) {
      console.log(`UNCHANGED /blog/${post.slug}`);
      continue;
    }
    await prisma.blogPostRevision.create({
      data: {
        blogPostId: row.id,
        slug: row.slug,
        reason: "pre-upgrade",
        snapshot: {
          ...toSnapshot(row),
          published: row.published,
          publishedAt: row.publishedAt?.toISOString() ?? null,
          coverImage: row.coverImage,
        },
      },
    });
    await prisma.blogPost.update({
      where: { id: row.id },
      data: next,
    });
    wrote += 1;
    console.log(`UPDATED /blog/${post.slug} — previous row saved`);
  }
  console.log(`Done. ${wrote} post(s) updated. Restore with --restore.`);
}

async function restorePosts(
  prisma: {
    blogPost: {
      findFirst: (args: object) => Promise<StoredPost | null>;
      update: (args: object) => Promise<unknown>;
    };
    blogPostRevision: {
      findFirst: (args: object) => Promise<{ id: string; slug: string; snapshot: unknown } | null>;
      findUnique: (args: object) => Promise<{ id: string; slug: string; snapshot: unknown } | null>;
      create: (args: object) => Promise<unknown>;
    };
  },
  revisionId: string | undefined
): Promise<void> {
  const targets = revisionId
    ? [revisionId]
    : BLOG_UPGRADES.map((post) => post.slug);

  for (const target of targets) {
    const revision = revisionId
      ? await prisma.blogPostRevision.findUnique({ where: { id: revisionId } })
      : await prisma.blogPostRevision.findFirst({
          where: { slug: target, reason: "pre-upgrade" },
          orderBy: { createdAt: "desc" },
        });
    if (!revision) {
      console.log(`NO SNAPSHOT ${target}`);
      continue;
    }
    const snapshot = revision.snapshot as BlogEditorialSnapshot & {
      published?: boolean;
      publishedAt?: string | null;
      coverImage?: string | null;
    };
    const row = await prisma.blogPost.findFirst({
      where: { slug: revision.slug, deletedAt: null },
    });
    if (!row) {
      console.log(`MISSING LIVE POST ${revision.slug}`);
      continue;
    }
    if (editorialsMatch(toSnapshot(row), snapshot)) {
      console.log(`ALREADY RESTORED /blog/${revision.slug} from ${revision.id}`);
      continue;
    }
    await prisma.blogPostRevision.create({
      data: {
        blogPostId: row.id,
        slug: row.slug,
        reason: "pre-restore",
        snapshot: toSnapshot(row),
      },
    });
    await prisma.blogPost.update({
      where: { id: row.id },
      data: {
        title: snapshot.title,
        excerpt: snapshot.excerpt,
        content: snapshot.content,
        category: snapshot.category,
        tags: snapshot.tags,
        readTime: snapshot.readTime,
        metaTitle: snapshot.metaTitle,
        metaDescription: snapshot.metaDescription,
      },
    });
    console.log(`RESTORED /blog/${revision.slug} from ${revision.id}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
