/** Server-side once-only flag lives in existing `UserPreference.metadata` JSON. */
export const FIRST_LOGIN_TOUR_ID = "firstLogin.v1" as const;

export const TOUR_LOCAL_KEY = "aee_tour_firstLogin.v1";
export const TOUR_REPLAY_KEY = "aee_tour_replay";
export const TOUR_REPLAY_EVENT = "aee:replay-tour";

export type TourStatus = "shown" | "completed" | "skipped";
export type TourDevice = "mobile" | "desktop";

export type FirstLoginTourRecord = {
  status: TourStatus;
  step: number;
  at: string;
  device?: TourDevice;
};

type MetadataObject = Record<string, unknown> & {
  tours?: Record<string, unknown>;
};

const TOUR_STATUSES = new Set<TourStatus>(["shown", "completed", "skipped"]);

export function parseMetadataObject(metadata: unknown): MetadataObject | null {
  if (metadata == null) return null;
  if (typeof metadata === "string") {
    const trimmed = metadata.trim();
    if (!trimmed) return {};
    try {
      return parseMetadataObject(JSON.parse(trimmed) as unknown);
    } catch {
      return {};
    }
  }
  if (typeof metadata === "object" && !Array.isArray(metadata)) {
    return metadata as MetadataObject;
  }
  return null;
}

export function readTourRecord(metadata: unknown): FirstLoginTourRecord | null {
  const root = parseMetadataObject(metadata);
  const raw = root?.tours?.[FIRST_LOGIN_TOUR_ID];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Partial<FirstLoginTourRecord>;
  if (!record.status || !TOUR_STATUSES.has(record.status)) return null;
  if (typeof record.at !== "string" || !record.at) return null;
  return {
    status: record.status,
    step: typeof record.step === "number" && Number.isFinite(record.step) ? record.step : 0,
    at: record.at,
    device: record.device === "mobile" || record.device === "desktop" ? record.device : undefined,
  };
}

export function isTourSeen(metadata: unknown): boolean {
  return readTourRecord(metadata) != null;
}

/**
 * Merge a tour write into metadata without dropping exam dates or other keys.
 * The original `at` is kept so a later complete/skip does not look like a new show.
 */
export function mergeTourRecord(
  metadata: unknown,
  patch: { status: TourStatus; step: number; device?: TourDevice; at: string }
): MetadataObject {
  const current = parseMetadataObject(metadata) ?? {};
  const existing = readTourRecord(current);
  const tours =
    current.tours && typeof current.tours === "object" ? { ...current.tours } : {};
  tours[FIRST_LOGIN_TOUR_ID] = {
    status: patch.status,
    step: patch.step,
    at: existing?.at ?? patch.at,
    device: patch.device ?? existing?.device,
  };
  return { ...current, tours };
}

export type TourEligibilityInput = {
  seen: boolean;
  /** Null means the attempt count could not be read. Fail closed. */
  attemptCount: number | null;
  examSelected: boolean;
  pathname: string;
  replay?: boolean;
  signedIn?: boolean;
};

/**
 * Safest launch rule: never seen, and zero saved attempts on the account.
 * Anyone who has already practiced is left alone, including attempts on another board.
 * Replay is an explicit settings action and ignores that gate.
 */
export function isFirstLoginTourEligible(input: TourEligibilityInput): boolean {
  if (input.signedIn === false) return false;
  if (input.pathname !== "/dashboard") return false;
  if (!input.examSelected) return false;
  if (input.replay) return true;
  if (input.seen) return false;
  if (input.attemptCount == null || input.attemptCount > 0) return false;
  return true;
}

/** Prisma missing-table / missing-column. Callers fail closed and do not throw. */
export function isTourSchemaGap(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = String((error as { code: unknown }).code);
  return code === "P2021" || code === "P2022";
}
