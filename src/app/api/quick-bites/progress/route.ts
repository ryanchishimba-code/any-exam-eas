import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import {
  canReadNursingQuickBiteProgress,
  quickBiteProgressListResponse,
} from "@/lib/quick-bites/progress-api";

export const runtime = "nodejs";

const SLUGS = QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).map(
  (episode) => episode.slug
);

export async function GET(request: Request) {
  return quickBiteProgressListResponse(request, {
    slugs: SLUGS,
    canRead: (access) => canReadNursingQuickBiteProgress(access, SLUGS),
    lockedMessage: "Quick Bites require a paid membership.",
  });
}
