import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DailyVitalsPlayer } from "@/components/daily-vitals/DailyVitalsPlayer";
import { DAILY_VITALS_STORE_KEY } from "@/lib/daily-vitals/browser-store";
import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";
import { LINK_COPIED_NOTE } from "@/lib/daily-vitals/share-action";
import type { PublicDailyVitals } from "@/lib/daily-vitals/types";

const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

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

function mockCard() {
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
  vi.stubGlobal(
    "Path2D",
    class Path2D {
      constructor(_path?: string) {}
    },
  );
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context as unknown as CanvasRenderingContext2D);
  const dataUrl = vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(PNG);
  return () => {
    dataUrl.mockRestore();
    getContext.mockRestore();
  };
}

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, "share");
  Reflect.deleteProperty(navigator, "canShare");
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("Daily Vitals share button", () => {
  it("shares the image and the link together, and copies the link in the same tap", async () => {
    const restore = mockCard();
    const share = vi.fn(() => Promise.resolve());
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data: { files?: File[]; text?: string }) => Boolean(data.files?.length),
    });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await renderFinished("won");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(DAILY_VITALS_SHARE_URL);
    const payload = share.mock.calls[0]?.[0] as { files?: File[]; text?: string; url?: string; title?: string };
    expect(payload.files?.[0]?.type).toBe("image/png");
    expect(payload.text).toBe(DAILY_VITALS_SHARE_URL);
    expect(payload.url).toBeUndefined();
    expect(payload.title).toBeUndefined();
    expect(await screen.findByText(LINK_COPIED_NOTE)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Copy text" })).not.toBeInTheDocument();
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
    restore();
  });

  it("saves the image and copies the link when the device cannot share files", async () => {
    const restore = mockCard();
    const share = vi.fn(() => Promise.resolve());
    const writeText = vi.fn(() => Promise.resolve());
    const clicks: HTMLAnchorElement[] = [];
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push(this);
    });
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    Object.defineProperty(navigator, "canShare", { configurable: true, value: () => false });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await renderFinished("lost");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(share).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(DAILY_VITALS_SHARE_URL);
    expect(clicks.some((anchor) => anchor.download.includes("daily-vitals-"))).toBe(true);
    expect(await screen.findByText(LINK_COPIED_NOTE)).toBeVisible();
    click.mockRestore();
    restore();
  });

  it("keeps the copied link when the share sheet is closed", async () => {
    const restore = mockCard();
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: vi.fn(() => Promise.reject(Object.assign(new Error("cancel"), { name: "AbortError" }))),
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data: { files?: File[]; text?: string }) => Boolean(data.files?.length && data.text),
    });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await renderFinished("won");
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(writeText).toHaveBeenCalledWith(DAILY_VITALS_SHARE_URL);
    expect(await screen.findByText(LINK_COPIED_NOTE)).toBeVisible();
    expect(await screen.findByRole("button", { name: "Save square" })).toBeVisible();
    restore();
  });
});
