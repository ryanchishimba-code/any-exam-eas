import { DEFAULT_STUDY_LAYERS } from "@/lib/anatomy/cartoon/layer-styles";
import { getCtAtlasTier0EntryIds } from "@/lib/anatomy/ct/ct-atlas-load-plan";
import { CT_ATLAS_ORGANS, resolveCtAtlasUrl } from "@/lib/anatomy/ct/ct-atlas-registry";
import { isCtAtlasEnabled } from "@/lib/anatomy/ct/ct-windows";

const DEFAULT_LAYERS = new Set(DEFAULT_STUDY_LAYERS);

/** Server-rendered fetch hints for tier-0 atlas volumes. */
export function CtAtlasHeadHints() {
  if (!isCtAtlasEnabled()) return null;

  const tier0Ids = new Set(getCtAtlasTier0EntryIds(DEFAULT_LAYERS));
  const hrefs = CT_ATLAS_ORGANS.filter((e) => tier0Ids.has(e.id)).map((e) =>
    resolveCtAtlasUrl(e.fileName)
  );

  return (
    <>
      {hrefs.map((href) => (
        <link key={href} rel="preload" href={href} as="fetch" crossOrigin="anonymous" />
      ))}
    </>
  );
}
