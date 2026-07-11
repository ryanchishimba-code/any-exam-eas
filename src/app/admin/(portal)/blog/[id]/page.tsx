import { notFound } from "next/navigation";
import { BlogPostEditor } from "@/components/admin/blog/BlogPostEditor";
import { getBlogPost } from "@/lib/admin/blog-admin";

export const metadata = {
  title: "Edit blog post — Admin",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params;
  if (id === "new") notFound();
  const post = await getBlogPost(id);
  if (!post || post.deletedAt) notFound();
  return <BlogPostEditor mode="edit" initial={post} />;
}
