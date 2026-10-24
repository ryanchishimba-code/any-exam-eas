import type { Metadata } from "next";
import { HubBoardLanding } from "@/components/marketing/board-landing/HubBoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildHubLandingMetadata } from "@/lib/marketing/board-landing/hub-model";
import { loadHubBoardLanding } from "@/lib/marketing/board-landing/hub-page-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildHubLandingMetadata("usmle");
}

export default async function UsmleHubPage() {
  const { model, render } = await loadHubBoardLanding("usmle");
  return (
    <>
      <JsonLdScript data={model.jsonLd} />
      <HubBoardLanding model={render} />
    </>
  );
}
