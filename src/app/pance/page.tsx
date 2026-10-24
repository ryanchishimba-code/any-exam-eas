import type { Metadata } from "next";
import { BoardLanding } from "@/components/marketing/board-landing/BoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildHubLandingMetadata } from "@/lib/marketing/board-landing/hub-model";
import { loadHubBoardLanding } from "@/lib/marketing/board-landing/hub-page-data";
import { boardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildHubLandingMetadata("pance");
}

export default async function PanceHubPage() {
  const { model } = await loadHubBoardLanding("pance");
  const render = boardLandingRenderModel(model, { examKey: "pance" });
  return (
    <>
      <JsonLdScript data={model.jsonLd} />
      <BoardLanding model={render} freeQuizBoard="pance" />
    </>
  );
}
