import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/study",
  "/pricing",
  "/signup",
  "/login",
  "/dashboard",
  "/generate",
  "/legal/terms",
  "/legal/privacy",
  "/legal/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/study" || path === "/pricing" ? 0.9 : 0.6,
  }));
}
