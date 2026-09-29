import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MerchCollection } from "@/components/merch/MerchCollection";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  buildMerchJsonLd,
  buildMerchMetadata,
  isMerchPageAvailable,
  merchStoreHref,
  visibleMerchProducts,
} from "@/lib/merch/merch";

export function generateMetadata(): Metadata {
  if (!isMerchPageAvailable()) {
    return {
      title: { absolute: "Page not found" },
      robots: { index: false, follow: false },
    };
  }
  return buildMerchMetadata();
}

export default function MerchPage() {
  if (!isMerchPageAvailable()) notFound();
  const products = visibleMerchProducts();
  return (
    <>
      <JsonLdScript data={buildMerchJsonLd(products)} />
      <MerchCollection products={products} storeUrl={merchStoreHref()} />
    </>
  );
}
