import { describe, expect, it } from "vitest";
import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";
import {
  chooseShareAttempt,
  invokeShare,
  pngFileFromDataUrl,
  shareWasCancelled,
  startLinkCopy,
  type DailyVitalsShareData,
} from "@/lib/daily-vitals/share-action";

const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("Daily Vitals share", () => {
  it("shares the image with the link in the text field and nothing else", () => {
    const file = pngFileFromDataUrl(PNG, "daily-vitals.png");
    expect(file).not.toBeNull();
    const attempt = chooseShareAttempt({
      file,
      link: DAILY_VITALS_SHARE_URL,
      hasShare: true,
      canShare: (data) => Boolean(data.files?.length && data.text),
    });
    expect(attempt).toEqual({
      mode: "share",
      data: { files: [file], text: DAILY_VITALS_SHARE_URL },
    });
    if (attempt.mode !== "share") return;
    expect(Object.keys(attempt.data).sort()).toEqual(["files", "text"]);
    expect(attempt.data).not.toHaveProperty("url");
    expect(attempt.data).not.toHaveProperty("title");

    let called = false;
    const pending = invokeShare(attempt, (data) => {
      called = true;
      expect(data.text).toBe(DAILY_VITALS_SHARE_URL);
      return Promise.resolve();
    });
    expect(called).toBe(true);
    expect(pending).toBeInstanceOf(Promise);
  });

  it("shares the image alone when the device rejects a caption, and saves when it rejects files", () => {
    const file = new File(["png"], "daily-vitals.png", { type: "image/png" });
    const filesOnly = chooseShareAttempt({
      file,
      link: DAILY_VITALS_SHARE_URL,
      hasShare: true,
      canShare: (data: DailyVitalsShareData) => Boolean(data.files?.length) && data.text === undefined,
    });
    expect(filesOnly).toEqual({ mode: "share", data: { files: [file] } });

    expect(
      chooseShareAttempt({
        file,
        link: DAILY_VITALS_SHARE_URL,
        hasShare: true,
        canShare: () => false,
      }).mode,
    ).toBe("save");
    expect(chooseShareAttempt({ file: null, link: DAILY_VITALS_SHARE_URL, hasShare: true }).mode).toBe("save");
    expect(chooseShareAttempt({ file, link: DAILY_VITALS_SHARE_URL, hasShare: false }).mode).toBe("save");
  });

  it("copies only the link, and treats a closed sheet as a cancel", async () => {
    const writeText = async (value: string) => {
      expect(value).toBe(DAILY_VITALS_SHARE_URL);
    };
    const pending = startLinkCopy(DAILY_VITALS_SHARE_URL, writeText);
    expect(pending).toBeInstanceOf(Promise);
    await pending;
    expect(startLinkCopy(DAILY_VITALS_SHARE_URL, undefined)).toBeNull();
    expect(shareWasCancelled({ name: "AbortError" })).toBe(true);
    expect(shareWasCancelled({ name: "NotAllowedError" })).toBe(false);
  });
});
