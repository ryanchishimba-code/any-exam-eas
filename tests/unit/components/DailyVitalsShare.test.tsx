import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DailyVitalsPlayer } from "@/components/daily-vitals/DailyVitalsPlayer";
import { DAILY_VITALS_STORE_KEY } from "@/lib/daily-vitals/browser-store";
import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";
import type { PublicDailyVitals } from "@/lib/daily-vitals/types";

const puzzle: PublicDailyVitals = {
  id: "dv-share",
  date: "2026-11-28",
  dayNumber: 28,
  board: "nclex",
  boardLabel: "NCLEX",
  clue: "A finished case is ready to share.",
  prompt: "What word?",
  length: 5,
  practiceHref: "/practice",
  trialHref: "/trial",
  trialNote: "5-day free trial · No card needed",
  dateLabel: "Saturday, Nov 28",
  sharePath: "anyexameasy.com/daily-vitals",
  legalLines: ["For study only, not medical advice.", "NCLEX® is a trademark of NCSBN."],
  archive: false,
};

function finish(status: "won" | "lost") {
  localStorage.setItem(
    DAILY_VITALS_STORE_KEY,
    JSON.stringify({
      streak: { last: "2026-11-28", streak: 2 },
      days: {
        "2026-11-28": {
          guesses: ["AAAAA"],
          marks: [["absent", "absent", "absent", "absent", "absent"]],
          status,
          explanation: "A short why.",
          word: status === "lost" ? "BBBBB" : undefined,
        },
      },
    }),
  );
}

function renderFinished(status: "won" | "lost") {
  finish(status);
  render(<DailyVitalsPlayer puzzle={puzzle} today="2026-11-28" />);
  return screen.findByRole("button", { name: "Share" });
}

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, "share");
  Reflect.deleteProperty(navigator, "canShare");
});

describe("Daily Vitals share button", () => {
  it("opens the share sheet from the tap with the result text and link", async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data: { files?: File[] }) => !data.files,
    });
    await renderFinished("won");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(share).toHaveBeenCalledTimes(1);
    const payload = share.mock.calls[0]?.[0] as { text?: string; url?: string; files?: File[] };
    expect(payload.text).toContain("Saved in 1/6");
    expect(payload.text).toContain(DAILY_VITALS_SHARE_URL);
    expect(payload.url).toBe(DAILY_VITALS_SHARE_URL);
    expect(payload.files).toBeUndefined();
    expect(screen.queryByRole("status")).not.toHaveTextContent("Copied");
  });

  it("attaches the result image when the device can share files", async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    Object.defineProperty(navigator, "canShare", { configurable: true, value: () => true });
    const gradient = { addColorStop() {} };
    const context = new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "createRadialGradient" || prop === "createLinearGradient") return () => gradient;
          if (prop === "measureText") return () => ({ width: 12 });
          return () => undefined;
        },
        set() {
          return true;
        },
      },
    );
    vi.stubGlobal("Path2D", class Path2D {
      constructor(_path?: string) {}
    });
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const dataUrl = vi
      .spyOn(HTMLCanvasElement.prototype, "toDataURL")
      .mockReturnValue(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      );
    await renderFinished("lost");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(share).toHaveBeenCalledTimes(1);
    const payload = share.mock.calls[0]?.[0] as { text?: string; files?: File[] };
    expect(payload.files?.[0]?.type).toBe("image/png");
    expect(payload.text).toContain("Missed in 6/6");
    expect(payload.text).toContain(DAILY_VITALS_SHARE_URL);
    expect(await screen.findByRole("button", { name: "Save square" })).toBeVisible();
    dataUrl.mockRestore();
    getContext.mockRestore();
  });

  it("copies the text and shows Copied when the device has no share sheet", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await renderFinished("won");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0]?.[0]).toContain(DAILY_VITALS_SHARE_URL);
    expect(await screen.findByText("Copied", { selector: ".dv-toast" })).toBeVisible();
    expect(screen.getByText(new RegExp(DAILY_VITALS_SHARE_URL.replace(/[./]/g, "\\$&")))).toBeVisible();
  });

  it("does not copy when the person closes the share sheet", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: vi.fn(() => Promise.reject(Object.assign(new Error("cancel"), { name: "AbortError" }))),
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data: { files?: File[] }) => !data.files,
    });
    await renderFinished("lost");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    await screen.findByText(/Can you beat me/);
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });
});
