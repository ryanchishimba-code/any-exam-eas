import { cache } from "react";
import { auth } from "@/auth";

/** One session read per server request (dedupes layout + page + guards). */
export const getCachedSession = cache(auth);
