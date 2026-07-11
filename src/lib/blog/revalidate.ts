import { revalidatePath, revalidateTag } from "next/cache";
import { BLOG_CACHE_TAG } from "@/lib/blog/public";
import { ROUTES } from "@/lib/routes";

/** Bust public blog ISR/cache after admin create/update/delete. */
export function revalidatePublicBlog(slug?: string | null) {
  try {
    revalidateTag(BLOG_CACHE_TAG);
    revalidatePath(ROUTES.blog);
    if (slug) revalidatePath(`${ROUTES.blog}/${slug}`);
  } catch {
    /* non-request contexts / tests */
  }
}
