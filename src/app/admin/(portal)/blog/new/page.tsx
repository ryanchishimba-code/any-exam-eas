import { redirect } from "next/navigation";
import { BlogPostEditor } from "@/components/admin/blog/BlogPostEditor";
import { countActiveBlogPosts } from "@/lib/admin/blog-admin";
import { MAX_BLOG_POSTS } from "@/lib/blog/limits";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "New blog post — Admin",
};

export default async function AdminBlogNewPage() {
  const activeCount = await countActiveBlogPosts();
  if (activeCount >= MAX_BLOG_POSTS) {
    redirect(ROUTES.admin.blog);
  }

  return <BlogPostEditor mode="create" />;
}
