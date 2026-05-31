import { buildHomeJsonLd } from "@/lib/seo";

export function HomeJsonLd() {
  const data = buildHomeJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
