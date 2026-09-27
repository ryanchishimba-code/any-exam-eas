import { buildHomeJsonLd } from "@/lib/seo";

export function HomeJsonLd({ totalLabel }: { totalLabel?: string }) {
  const data = buildHomeJsonLd(totalLabel);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
