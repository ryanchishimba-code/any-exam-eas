import type { Metadata } from "next";
import { CrosswordHub } from "@/components/crossword/CrosswordHub";
import { hubMetadata } from "@/lib/crossword/metadata";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return hubMetadata();
}

export default function CrosswordHubPage() {
  return <CrosswordHub />;
}
