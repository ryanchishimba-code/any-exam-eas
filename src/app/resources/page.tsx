import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/toolkit") },
  robots: { index: false, follow: true },
};

/** Legacy hub URL — individual articles remain at /resources/[slug]. */
export default function ResourcesHubRedirect() {
  redirect("/toolkit");
}
