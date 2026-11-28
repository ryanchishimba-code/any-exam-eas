import { describe, expect, it } from "vitest";
import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";
import {
  chooseShareAttempt,
  invokeShare,
  pngFileFromDataUrl,
  shareWasCancelled,
  type DailyVitalsShareData,
} from "@/lib/daily-vitals/share-action";

const TEXT = `Daily Vitals\nSaved in 1/6\n\nCan you beat me?\n${DAILY_VITALS_SHARE_URL}`;
const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("Daily Vitals share", () => {
  it("shares the text, the link, and the image in the same tap when the device accepts files", () => {
    const file = pngFileFromDataUrl(PNG, "daily-vitals.png");
    expect(file).not.toBeNull();
    expect(file?.type).toBe("image/png");
    const accepted: DailyVitalsShareData[] = [];
    const attempt = chooseShareAttempt({
      text: TEXT,
      file,
      hasShare: true,
      canShare: (data) => {
        accepted.push(data);
        return Boolean(data.files?.length);
      },
    });
    expect(attempt.mode).toBe("share");
    if (attempt.mode !== "share") return;
    expect(attempt.data.files).toEqual([file]);
    expect(attempt.data.text).toContain(DAILY_VITALS_SHARE_URL);
    expect(attempt.data.url).toBeUndefined();

    let called = false;
    const pending = invokeShare(attempt, () => {
      called = true;
      return Promise.resolve();
    });
    expect(called).toBe(true);
    expect(pending).toBeInstanceOf(Promise);
  });

  it("shares the text and link when a file is not accepted", () => {
    const file = new File(["png"], "daily-vitals.png", { type: "image/png" });
    const attempt = chooseShareAttempt({
      text: "Can you beat me?",
      file,
      hasShare: true,
      canShare: (data) => !data.files,
    });
    expect(attempt).toEqual({
      mode: "share",
      data: { text: `Can you beat me?\n${DAILY_VITALS_SHARE_URL}`, url: DAILY_VITALS_SHARE_URL },
    });
  });

  it("copies when the device has no share sheet or rejects every payload", () => {
    expect(chooseShareAttempt({ text: TEXT, hasShare: false }).mode).toBe("clipboard");
    expect(
      chooseShareAttempt({
        text: TEXT,
        hasShare: true,
        canShare: () => false,
      }).mode,
    ).toBe("clipboard");
    expect(shareWasCancelled({ name: "AbortError" })).toBe(true);
    expect(shareWasCancelled({ name: "NotAllowedError" })).toBe(false);
  });
});
