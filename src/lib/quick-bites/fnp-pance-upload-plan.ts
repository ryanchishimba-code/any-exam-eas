/**
 * Exact private Blob pathnames for the temporary FNP + PANCE upload route.
 * 18 FNP episodes + 20 PANCE episodes × (web.mp4 + .vtt) = 76 objects.
 */

import {
  FNP_QUICK_BITE_EPISODES,
  fnpQuickBiteCaptionsPath,
  fnpQuickBiteVideoPath,
} from "@/lib/quick-bites/fnp-catalog";
import {
  PANCE_QUICK_BITE_EPISODES,
  panceQuickBiteCaptionsPath,
  panceQuickBiteVideoPath,
} from "@/lib/quick-bites/pance-catalog";

/** About 60 MB. Client tokens cannot authorize a larger object. */
export const QB_FNP_PANCE_MAX_UPLOAD_BYTES = 60 * 1024 * 1024;

export type FnpPanceUploadContentType = "video/mp4" | "text/vtt";

function mediaPair(
  videoPath: string,
  captionsPath: string
): Array<[string, FnpPanceUploadContentType]> {
  return [
    [videoPath, "video/mp4"],
    [captionsPath, "text/vtt"],
  ];
}

export const QB_FNP_PANCE_UPLOAD_PATHS: ReadonlyMap<string, FnpPanceUploadContentType> = new Map([
  ...FNP_QUICK_BITE_EPISODES.flatMap((episode) =>
    mediaPair(fnpQuickBiteVideoPath(episode.slug), fnpQuickBiteCaptionsPath(episode.slug))
  ),
  ...PANCE_QUICK_BITE_EPISODES.flatMap((episode) =>
    mediaPair(panceQuickBiteVideoPath(episode.slug), panceQuickBiteCaptionsPath(episode.slug))
  ),
]);

export function contentTypeForFnpPancePath(pathname: string): FnpPanceUploadContentType | null {
  return QB_FNP_PANCE_UPLOAD_PATHS.get(pathname) ?? null;
}

/** Constraints passed to onBeforeGenerateToken. Throws for any other pathname. */
export function fnpPanceClientTokenConstraints(pathname: string): {
  allowedContentTypes: [FnpPanceUploadContentType];
  maximumSizeInBytes: number;
  addRandomSuffix: false;
  allowOverwrite: false;
} {
  const contentType = contentTypeForFnpPancePath(pathname);
  if (!contentType) {
    throw new Error("Path is not in the FNP/PANCE upload plan");
  }
  return {
    allowedContentTypes: [contentType],
    maximumSizeInBytes: QB_FNP_PANCE_MAX_UPLOAD_BYTES,
    addRandomSuffix: false,
    allowOverwrite: false,
  };
}
