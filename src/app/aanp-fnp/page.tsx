import type { Metadata } from "next";
import { BoardLanding } from "@/components/marketing/board-landing/BoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildHubLandingMetadata } from "@/lib/marketing/board-landing/hub-model";
import { loadHubBoardLanding } from "@/lib/marketing/board-landing/hub-page-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildHubLandingMetadata("aanp-fnp");
}

export default async function AanpFnpHubPage() {
  const { model } = await loadHubBoardLanding("aanp-fnp");
  return (
    <>
      <JsonLdScript data={model.jsonLd} />
      <BoardLanding model={model} />
    </>
  );
}
