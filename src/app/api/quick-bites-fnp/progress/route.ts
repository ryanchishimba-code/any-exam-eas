import { FNP_QUICK_BITE_EPISODES } from "@/lib/quick-bites/fnp-catalog";
import {
  canReadPaidQuickBiteProgress,
  quickBiteProgressListResponse,
} from "@/lib/quick-bites/progress-api";

export const runtime = "nodejs";

const SLUGS = FNP_QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).map(
  (episode) => episode.slug
);

export async function GET(request: Request) {
  return quickBiteProgressListResponse(request, {
    slugs: SLUGS,
    canRead: canReadPaidQuickBiteProgress,
    lockedMessage: "Quick Bites: FNP require a paid membership.",
  });
}
