/**
 * Outbound publishing adapter.
 *
 * Implements a small provider-agnostic `SocialPublisher` interface so the rest
 * of the app never depends on a specific vendor. The default implementation
 * targets Ayrshare (https://www.ayrshare.com), a unified social API: one API
 * key publishes to all connected brand channels (X, LinkedIn, Facebook, …).
 *
 * When AYRSHARE_API_KEY is absent, publishing returns { ok: false,
 * notConfigured: true } so callers can keep posts queued rather than failing —
 * the feature degrades gracefully until the key is set.
 */

export type PublishRequest = {
  content: string;
  /** Ayrshare platform keys, e.g. ["twitter", "linkedin", "facebook"]. */
  platforms: string[];
  mediaUrls?: string[];
};

export type PublishResult =
  | { ok: true; externalRef: string | null }
  | { ok: false; error: string; notConfigured?: boolean };

export interface SocialPublisher {
  isConfigured(): boolean;
  publish(req: PublishRequest): Promise<PublishResult>;
}

const AYRSHARE_ENDPOINT = "https://api.ayrshare.com/api/post";

/** Map our internal platform keys to Ayrshare's expected names. */
const PLATFORM_MAP: Record<string, string> = {
  x: "twitter",
  twitter: "twitter",
  linkedin: "linkedin",
  facebook: "facebook",
};

export function toProviderPlatforms(platforms: string[]): string[] {
  return [...new Set(platforms.map((p) => PLATFORM_MAP[p.toLowerCase()]).filter(Boolean))];
}

class AyrsharePublisher implements SocialPublisher {
  isConfigured(): boolean {
    return Boolean(process.env.AYRSHARE_API_KEY);
  }

  async publish(req: PublishRequest): Promise<PublishResult> {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) {
      return { ok: false, notConfigured: true, error: "AYRSHARE_API_KEY is not set." };
    }

    const platforms = toProviderPlatforms(req.platforms);
    if (platforms.length === 0) {
      return { ok: false, error: "No supported platforms selected." };
    }

    try {
      const res = await fetch(AYRSHARE_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: req.content,
          platforms,
          ...(req.mediaUrls && req.mediaUrls.length > 0 ? { mediaUrls: req.mediaUrls } : {}),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        status?: string;
        id?: string;
        errors?: { message?: string }[];
        message?: string;
      };

      if (!res.ok || data.status === "error") {
        const msg =
          data.errors?.[0]?.message ?? data.message ?? `Publish failed (HTTP ${res.status}).`;
        return { ok: false, error: msg };
      }

      return { ok: true, externalRef: data.id ?? null };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Network error." };
    }
  }
}

/** Default publisher. Swap here to change providers without touching callers. */
export const socialPublisher: SocialPublisher = new AyrsharePublisher();
