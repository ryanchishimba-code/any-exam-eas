import type { StudyCompletionExamSlug } from "@/lib/learning/study-completion/completion-rules-v1";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import { PHARMACY_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pharmacy-catalog";

/** Slugs that count toward study-completion Quick Bites for each board. */
export function quickBiteSlugsForBoard(examSlug: StudyCompletionExamSlug): string[] {
  if (examSlug === "nclex") {
    return QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).map((episode) => episode.slug);
  }
  if (examSlug === "naplex") {
    return PHARMACY_QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).map(
      (episode) => episode.slug
    );
  }
  return [];
}
