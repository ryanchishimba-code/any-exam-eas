import { PHARMACY_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pharmacy-catalog";
import {
  canReadPharmacyQuickBiteProgress,
  quickBiteProgressListResponse,
} from "@/lib/quick-bites/progress-api";

export const runtime = "nodejs";

const SLUGS = PHARMACY_QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).map(
  (episode) => episode.slug
);

export async function GET(request: Request) {
  return quickBiteProgressListResponse(request, {
    slugs: SLUGS,
    canRead: (access) => canReadPharmacyQuickBiteProgress(access, SLUGS),
    lockedMessage: "Quick Bites: Pharmacy require a paid membership.",
  });
}
