import { ensureDatabaseUrlEnv } from "../src/lib/database-url";
ensureDatabaseUrlEnv();
import { prisma } from "../src/lib/prisma";

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: { in: ["admin", "super_admin"] } },
    select: { id: true, email: true, name: true },
  });
  if (!admin) {
    console.error("No admin user found — create one before seeding blog.");
    process.exit(1);
  }

  const existing = await prisma.blogPost.findFirst({
    where: { slug: "welcome-to-the-anyexameasy-blog" },
  });
  if (existing) {
    console.log("Sample post already exists:", existing.id);
  } else {
    const post = await prisma.blogPost.create({
      data: {
        title: "Welcome to the AnyExamEasy Blog",
        slug: "welcome-to-the-anyexameasy-blog",
        excerpt:
          "High-yield study tips, exam strategy, and product updates — written for busy board exam students.",
        content:
          "<h2>Why we built this</h2><p>Board prep should feel calm, focused, and practical. This blog is where we publish study systems, exam-day tactics, and product updates across <strong>NCLEX</strong>, <strong>USMLE</strong>, and <strong>NAPLEX</strong>.</p><h2>What you will find here</h2><ul><li>Prioritization and clinical judgment frameworks</li><li>High-yield topic deep dives</li><li>Product changelogs that help you study smarter</li></ul><h3>Start here</h3><p>Pick your exam in Study Hub, run a short weak-area set, then come back for the related guide.</p><blockquote><p>Consistency beats cramming. Small daily blocks compound.</p></blockquote>",
        category: "Product Updates",
        tags: ["study tips", "product", "exam prep"],
        published: true,
        publishedAt: new Date(),
        readTime: 2,
        authorId: admin.id,
        metaTitle: "Welcome to the AnyExamEasy Blog",
        metaDescription:
          "Study tips and product updates for NCLEX, USMLE, and NAPLEX students.",
      },
    });
    console.log("Sample post created:", post.id);
  }
  console.log("Author:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
