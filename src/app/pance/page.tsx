import type { Metadata } from "next";
import { HubBoardLanding } from "@/components/marketing/board-landing/HubBoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildHubLandingMetadata } from "@/lib/marketing/board-landing/hub-model";
import { loadHubBoardLanding } from "@/lib/marketing/board-landing/hub-page-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildHubLandingMetadata("pance");
}

export default async function PanceHubPage() {
  const { model, render } = await loadHubBoardLanding("pance");
  return (
    <>
      <JsonLdScript data={model.jsonLd} />
      <HubBoardLanding model={render} freeQuizBoard="pance" />
    </>
  );
}
