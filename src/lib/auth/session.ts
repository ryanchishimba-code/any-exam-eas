import { cache } from "react";
import { auth } from "@/auth";

/** One session read per server request (dedupes layout + page + guards). */
export const getCachedSession = cache(async () => {
  try {
    return await auth();
  } catch (error) {
    // Preview builds often lack AUTH_SECRET / DATABASE_URL. Fail closed as signed-out
    // so marketing SSG can finish; runtime still uses real auth when env is set.
    console.warn(
      "[session] auth unavailable:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
});
