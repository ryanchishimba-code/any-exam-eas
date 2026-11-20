import { readFileSync } from "node:fs";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { EXAM_SLUGS } from "@/lib/edtech/exams";
import { revealQotdAnswer } from "@/lib/demo/qotd-reveal";
import {
  QOTD_BY_EXAM,
  dayIndexFromIso,
  getQotdForExam,
  parseQotdDate,
  todayIsoCentral,
  toPublicQotd,
} from "@/lib/demo/qotd";
import { GET as qotdOpenGraph } from "@/app/(marketing)/(with-flagship)/daily/[exam]/[date]/opengraph-image/route";
import DailyExamDatedPage, {
  generateMetadata as dailyDatedMetadata,
} from "@/app/(marketing)/(with-flagship)/daily/[exam]/[date]/page";

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse extends Response {
    constructor(element: unknown) {
      super("image", { status: 200, headers: { "content-type": "image/png" } });
      const bag = globalThis as { __qotdOg?: unknown[] };
      bag.__qotdOg ??= [];
      bag.__qotdOg.push(element);
    }
  },
}));

const REVIEW_NOW = new Date("2026-10-11T18:00:00.000Z");

function chicagoClock(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  return `${hour}:${minute}`;
}

function allItems() {
  return EXAM_SLUGS.flatMap((exam) => QOTD_BY_EXAM[exam]);
}

describe("question of the day calendar", () => {
  it("uses the America/Chicago date at 6:59 PM and 7:01 PM CT", () => {
    // CDT (UTC−5): 7:00 PM in Chicago is midnight UTC, which used to roll the pack.
    const six59 = new Date("2026-10-11T23:59:00.000Z");
    const seven01 = new Date("2026-10-12T00:01:00.000Z");
    expect(chicagoClock(six59)).toBe("18:59");
    expect(chicagoClock(seven01)).toBe("19:01");
    expect(six59.toISOString().slice(0, 10)).toBe("2026-10-11");
    expect(seven01.toISOString().slice(0, 10)).toBe("2026-10-12");

    expect(todayIsoCentral(six59)).toBe("2026-10-11");
    expect(todayIsoCentral(seven01)).toBe("2026-10-11");
    expect(getQotdForExam("nclex", todayIsoCentral(six59), six59)?.id).toBe(
      getQotdForExam("nclex", todayIsoCentral(seven01), seven01)?.id
    );

    const beforeMidnight = new Date("2026-10-12T04:59:00.000Z");
    const afterMidnight = new Date("2026-10-12T05:01:00.000Z");
    expect(todayIsoCentral(beforeMidnight)).toBe("2026-10-11");
    expect(todayIsoCentral(afterMidnight)).toBe("2026-10-12");
    expect(getQotdForExam("usmle", todayIsoCentral(beforeMidnight), beforeMidnight)?.id).not.toBe(
      getQotdForExam("usmle", todayIsoCentral(afterMidnight), afterMidnight)?.id
    );
  });

  it("rejects a future date and does not fall back to item 01", async () => {
    const now = new Date("2026-10-11T23:59:00.000Z");
    expect(todayIsoCentral(now)).toBe("2026-10-11");
    expect(parseQotdDate("2026-10-12", now)).toBeNull();
    expect(getQotdForExam("nclex", "2026-10-12", now)).toBeNull();
    expect(getQotdForExam("naplex", "2026-10-13", now)).toBeNull();
    expect(getQotdForExam("pance", "2030-01-01", now)).toBeNull();
    expect(getQotdForExam("nclex", "2024-02-31", now)).toBeNull();
    expect(getQotdForExam("nclex", "2023-12-31", now)).toBeNull();

    const today = getQotdForExam("nclex", "2026-10-11", now);
    const firstItem = getQotdForExam("nclex", "2024-01-01", now);
    expect(today).not.toBeNull();
    expect(firstItem?.id).toBe("nclex-01");
    expect(getQotdForExam("nclex", "2026-10-12", now)).toBeNull();
    expect(getQotdForExam("nclex", "2030-01-01", now)).not.toEqual(firstItem);

    const realToday = todayIsoCentral();
    const realItem = getQotdForExam("nclex", realToday);
    expect(realItem).not.toBeNull();
    const [y, m, d] = realToday.split("-").map(Number);
    const tomorrow = new Date(Date.UTC(y!, m! - 1, d! + 1)).toISOString().slice(0, 10);
    expect(getQotdForExam("nclex", tomorrow)).toBeNull();
    for (const option of realItem!.options) {
      expect(await revealQotdAnswer("nclex", tomorrow, option)).toBeNull();
    }
    expect(await revealQotdAnswer("nclex", "2099-01-01", firstItem!.options[0]!)).toBeNull();
  });

  it("rotates one item per day and wraps every 7 days", () => {
    expect(dayIndexFromIso("2024-01-01", REVIEW_NOW)).toBe(0);
    expect(dayIndexFromIso("2024-01-02", REVIEW_NOW)).toBe(1);
    expect(dayIndexFromIso("2024-01-08", REVIEW_NOW)).toBe(7);
    expect(dayIndexFromIso("2024-03-01", REVIEW_NOW)).toBe(60);

    for (const exam of EXAM_SLUGS) {
      expect(QOTD_BY_EXAM[exam]).toHaveLength(7);
      const first = getQotdForExam(exam, "2024-01-01", REVIEW_NOW);
      const eighth = getQotdForExam(exam, "2024-01-08", REVIEW_NOW);
      const second = getQotdForExam(exam, "2024-01-02", REVIEW_NOW);
      expect(first?.id).toBe(`${exam}-01`);
      expect(eighth?.id).toBe(first?.id);
      expect(second?.id).toBe(`${exam}-02`);
      expect(second?.id).not.toBe(first?.id);
    }
  });
});

describe("question of the day items", () => {
  it("does not make the correct option the longest choice on most items", () => {
    const items = allItems();
    expect(items).toHaveLength(42);
    const longestIds = items
      .filter((item) => {
        const lengths = item.options.map((option) => option.length);
        const max = Math.max(...lengths);
        return item.correct.length === max && lengths.filter((length) => length === max).length === 1;
      })
      .map((item) => item.id);
    expect(longestIds.length).toBeLessThanOrEqual(14);

    for (const item of items) {
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.options.filter((option) => option === item.correct)).toHaveLength(1);
      for (const option of item.options) {
        expect(option).not.toMatch(/\b(forever|ever)\b/i);
      }
    }
  });

  it("teaches AUC-guided vancomycin dosing and evidence-based croup care", () => {
    const vancomycin = QOTD_BY_EXAM.naplex.find((item) => item.id === "naplex-03");
    expect(vancomycin?.correct).toMatch(/AUC\/MIC target of 400–600/);
    expect(vancomycin?.rationale).toMatch(/2020 ASHP\/IDSA consensus/);
    expect(vancomycin?.rationale).toMatch(/AUC-guided vancomycin dosing/);
    expect(vancomycin?.rationale).toMatch(/AUC\/MIC target of 400–600/);
    expect(vancomycin?.rationale.toLowerCase()).toMatch(/trough/);
    expect(vancomycin?.rationale.toLowerCase()).toMatch(/no longer recommended/);

    const croup = QOTD_BY_EXAM.usmle.find((item) => item.id === "usmle-04");
    expect(croup?.stem.toLowerCase()).not.toMatch(/cool air/);
    expect(croup?.correct.toLowerCase()).toMatch(/dexamethasone/);
    expect(croup?.correct.toLowerCase()).toMatch(/epinephrine/);
    expect(croup?.rationale).toMatch(/all severities/);
    expect(croup?.rationale.toLowerCase()).toMatch(/nebulized epinephrine/);
    expect(croup?.rationale.toLowerCase()).toMatch(/moderate or severe/);
    expect(croup?.rationale.toLowerCase()).toMatch(/humidified air or mist is not treatment/);
  });

  it("keeps the answer key out of the public payload and the client page", () => {
    for (const item of allItems()) {
      const pub = toPublicQotd(item);
      expect(pub).not.toHaveProperty("correct");
      expect(pub).not.toHaveProperty("rationale");
      expect(JSON.stringify(pub)).not.toContain(item.rationale);
    }

    const practice = readFileSync("src/components/marketing/QotdPractice.tsx", "utf8");
    expect(practice).toContain('from "@/lib/demo/qotd-public"');
    expect(practice).not.toContain('from "@/lib/demo/qotd"');
    expect(practice).not.toContain("item.correct");
    expect(practice).not.toContain("item.rationale");

    const dated = readFileSync(
      "src/app/(marketing)/(with-flagship)/daily/[exam]/[date]/page.tsx",
      "utf8"
    );
    const today = readFileSync("src/app/(marketing)/(with-flagship)/daily/[exam]/page.tsx", "utf8");
    const hub = readFileSync("src/app/(marketing)/(with-flagship)/daily/page.tsx", "utf8");
    const og = readFileSync(
      "src/app/(marketing)/(with-flagship)/daily/[exam]/[date]/opengraph-image/route.tsx",
      "utf8"
    );
    expect(dated).toContain("toPublicQotd(");
    expect(dated).toContain("notFound(");
    expect(dated).toContain('dynamic = "force-dynamic"');
    expect(dated).not.toContain("connection(");
    expect(dated).not.toContain("export const revalidate");
    expect(dated).not.toContain("todayIsoUtc");
    expect(today).toContain("toPublicQotd(");
    expect(today).toContain("todayIsoCentral(");
    expect(hub).toContain("todayIsoCentral(");
    expect(hub).not.toContain("item.correct");
    expect(hub).not.toContain(".rationale");
    expect(og).not.toContain("item.correct");
    expect(og).not.toContain("item.rationale");
    expect(og).toContain('dynamic = "force-dynamic"');
    expect(og).not.toContain("connection(");
    expect(og).toContain('"Cache-Control": "no-store"');
    expect(readFileSync("src/app/sitemap.ts", "utf8")).toContain("todayIsoCentral(");
  });
});

const NOT_FOUND_DIGEST = "NEXT_HTTP_ERROR_FALLBACK;404";

function addUtcDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10);
}

async function expectDatedNotFound(exam: string, date: string) {
  await expect(
    DailyExamDatedPage({ params: Promise.resolve({ exam, date }) })
  ).rejects.toMatchObject({ digest: NOT_FOUND_DIGEST });
}

function practiceItem(node: ReactNode): { stem: string; rationale?: string; correct?: string } {
  if (!isValidElement(node)) throw new Error("expected a page element");
  const props = node.props as { item?: { stem: string }; children?: ReactNode };
  if (props.item && "stem" in props.item) return props.item;
  return practiceItem(props.children);
}

describe("dated question route", () => {
  it("404s a future or invalid date and still renders today and the past", async () => {
    const today = todayIsoCentral();
    const tomorrow = addUtcDays(today, 1);
    const dayAfter = addUtcDays(today, 2);
    const todayItem = getQotdForExam("nclex", today);
    const pastItem = getQotdForExam("naplex", "2024-01-03");
    expect(todayItem).not.toBeNull();
    expect(pastItem?.id).toBe("naplex-03");

    await expectDatedNotFound("nclex", tomorrow);
    await expectDatedNotFound("nclex", dayAfter);
    await expectDatedNotFound("nclex", "2099-01-01");
    await expectDatedNotFound("nclex", "2024-02-31");
    await expectDatedNotFound("not-a-board", today);

    const futureMeta = await dailyDatedMetadata({
      params: Promise.resolve({ exam: "nclex", date: tomorrow }),
    });
    expect(futureMeta).toEqual({});
    const farMeta = await dailyDatedMetadata({
      params: Promise.resolve({ exam: "nclex", date: "2099-01-01" }),
    });
    expect(JSON.stringify(farMeta)).not.toContain("tunneled central line");

    const pastView = await DailyExamDatedPage({
      params: Promise.resolve({ exam: "naplex", date: "2024-01-03" }),
    });
    const pastProps = practiceItem(pastView);
    expect(pastProps.stem).toBe(pastItem!.stem);
    expect(pastProps).not.toHaveProperty("rationale");
    expect(pastProps).not.toHaveProperty("correct");
    expect(JSON.stringify(pastView)).not.toContain(pastItem!.rationale);

    const todayView = await DailyExamDatedPage({
      params: Promise.resolve({ exam: "nclex", date: today }),
    });
    const todayProps = practiceItem(todayView);
    expect(todayProps.stem).toBe(todayItem!.stem);
    expect(JSON.stringify(todayView)).not.toContain(todayItem!.rationale);

    const pastMeta = await dailyDatedMetadata({
      params: Promise.resolve({ exam: "naplex", date: "2024-01-03" }),
    });
    expect(pastMeta.description).toContain(pastItem!.stem.slice(0, 40));
    expect(JSON.stringify(pastMeta)).not.toContain(pastItem!.rationale);
  });

  it("keeps the Chicago day through 7:01 PM CT and rejects the next calendar day", async () => {
    const six59 = new Date("2026-10-11T23:59:00.000Z");
    const seven01 = new Date("2026-10-12T00:01:00.000Z");
    const afterMidnight = new Date("2026-10-12T05:01:00.000Z");
    expect(chicagoClock(six59)).toBe("18:59");
    expect(chicagoClock(seven01)).toBe("19:01");

    vi.useFakeTimers();
    try {
      vi.setSystemTime(six59);
      const evening = await DailyExamDatedPage({
        params: Promise.resolve({ exam: "nclex", date: "2026-10-11" }),
      });
      expect(practiceItem(evening).stem).toContain("INR 5.8");
      await expectDatedNotFound("nclex", "2026-10-12");

      vi.setSystemTime(seven01);
      const stillEvening = await DailyExamDatedPage({
        params: Promise.resolve({ exam: "nclex", date: "2026-10-11" }),
      });
      expect(practiceItem(stillEvening).stem).toBe(practiceItem(evening).stem);
      await expectDatedNotFound("nclex", "2026-10-12");

      vi.setSystemTime(afterMidnight);
      const nextDay = await DailyExamDatedPage({
        params: Promise.resolve({ exam: "nclex", date: "2026-10-12" }),
      });
      expect(practiceItem(nextDay).stem).not.toBe(practiceItem(evening).stem);
      expect(JSON.stringify(nextDay)).not.toContain("An elevated INR");
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns a no-store 404 image for a future date and no answer in a past image", async () => {
    const bag = globalThis as { __qotdOg?: unknown[] };
    bag.__qotdOg = [];
    const past = getQotdForExam("naplex", "2024-01-03");
    expect(past).not.toBeNull();

    const missing = await qotdOpenGraph(new Request("http://localhost/og"), {
      params: Promise.resolve({ exam: "naplex", date: "2099-06-01" }),
    });
    expect(missing.status).toBe(404);
    expect(missing.headers.get("Cache-Control")).toBe("no-store");
    expect(await missing.text()).toBe("");
    expect(bag.__qotdOg).toHaveLength(0);

    const image = await qotdOpenGraph(new Request("http://localhost/og"), {
      params: Promise.resolve({ exam: "naplex", date: "2024-01-03" }),
    });
    expect(image.status).toBe(200);
    expect(JSON.stringify(bag.__qotdOg)).toContain(past!.stem.slice(0, 40));
    expect(JSON.stringify(bag.__qotdOg)).not.toContain(past!.rationale);
    expect(JSON.stringify(bag.__qotdOg)).not.toContain(past!.correct);
  });
});
