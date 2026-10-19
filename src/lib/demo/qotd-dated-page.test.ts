import { beforeEach, describe, expect, it, vi } from "vitest";
import { todayIsoCentral } from "@/lib/demo/qotd-public";

const connection = vi.hoisted(() => vi.fn(async () => undefined));
const notFound = vi.hoisted(() =>
  vi.fn(() => {
    const error = new Error("NEXT_NOT_FOUND");
    (error as Error & { digest: string }).digest = "NEXT_HTTP_ERROR_FALLBACK;404";
    throw error;
  })
);

vi.mock("next/server", () => ({
  connection: () => connection(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

vi.mock("@/components/marketing/QotdPractice", () => ({
  QotdPractice: () => null,
}));

import DailyExamDatedPage, {
  generateMetadata,
  revalidate,
} from "@/app/(marketing)/(with-flagship)/daily/[exam]/[date]/page";

function dynamicServerUsage(): Error {
  const error = new Error(
    "Route /daily/[exam]/[date] couldn't be rendered statically because it used `connection`."
  );
  (error as Error & { digest: string }).digest = "DYNAMIC_SERVER_USAGE";
  return error;
}

describe("dated question of the day page", () => {
  beforeEach(() => {
    connection.mockReset();
    connection.mockResolvedValue(undefined);
    notFound.mockClear();
  });

  it("keeps a day-long cache for dates that can be served", () => {
    expect(revalidate).toBe(86400);
  });

  it("serves today and a past date without opting out of the cache", async () => {
    const today = todayIsoCentral();
    const todayPage = await DailyExamDatedPage({
      params: Promise.resolve({ exam: "nclex", date: today }),
    });
    const pastPage = await DailyExamDatedPage({
      params: Promise.resolve({ exam: "usmle", date: "2024-01-02" }),
    });

    expect(todayPage).toBeTruthy();
    expect(pastPage).toBeTruthy();
    expect(notFound).not.toHaveBeenCalled();
    expect(connection).not.toHaveBeenCalled();

    const metadata = await generateMetadata({
      params: Promise.resolve({ exam: "nclex", date: today }),
    });
    expect(metadata.title).toEqual(expect.stringContaining("Question of the Day"));
  });

  it("404s a future date even when static render throws DYNAMIC_SERVER_USAGE", async () => {
    connection.mockRejectedValue(dynamicServerUsage());

    await expect(
      DailyExamDatedPage({
        params: Promise.resolve({ exam: "pance", date: "2099-01-01" }),
      })
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });

    expect(connection).toHaveBeenCalledOnce();
    expect(notFound).toHaveBeenCalledOnce();
  });

  it("404s an invalid date and an unknown board the same way", async () => {
    await expect(
      DailyExamDatedPage({
        params: Promise.resolve({ exam: "nclex", date: "2024-02-31" }),
      })
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    await expect(
      DailyExamDatedPage({
        params: Promise.resolve({ exam: "not-a-board", date: "2024-01-01" }),
      })
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });

    expect(notFound).toHaveBeenCalledTimes(2);
    const futureMeta = await generateMetadata({
      params: Promise.resolve({ exam: "naplex", date: "2099-06-01" }),
    });
    expect(futureMeta).toEqual({});
  });

  it("does not turn a real connection failure into a 404", async () => {
    connection.mockRejectedValue(new Error("connection failed"));

    await expect(
      DailyExamDatedPage({
        params: Promise.resolve({ exam: "nclex", date: "2099-01-01" }),
      })
    ).rejects.toThrow("connection failed");
    expect(notFound).not.toHaveBeenCalled();
  });
});
