import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyMediaSessionMetadata,
  isVideoPictureInPictureAvailable,
  requestVideoPictureInPicture,
  shouldAttemptAutoPictureInPictureOnHide,
  supportsDocumentPictureInPicture,
  supportsWebKitPictureInPicture,
  VIDEO_PIP_ARTIST,
} from "@/lib/media/video-picture-in-picture";

function mockVideo(overrides: Partial<HTMLVideoElement> = {}): HTMLVideoElement {
  return {
    paused: false,
    ended: false,
    requestPictureInPicture: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as HTMLVideoElement;
}

describe("video picture-in-picture helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function stubDocumentPip(enabled: boolean) {
    vi.stubGlobal("document", {
      pictureInPictureEnabled: enabled,
      pictureInPictureElement: null,
    } as Document);
  }

  it("detects WebKit presentation-mode PiP", () => {
    const video = mockVideo({
      webkitSupportsPresentationMode: (mode: string) => mode === "picture-in-picture",
      webkitSetPresentationMode: vi.fn(),
    } as Partial<HTMLVideoElement>);
    expect(supportsWebKitPictureInPicture(video)).toBe(true);
    expect(isVideoPictureInPictureAvailable(video)).toBe(true);
  });

  it("detects standard document PiP when enabled", () => {
    stubDocumentPip(true);
    const video = mockVideo();
    expect(supportsDocumentPictureInPicture()).toBe(true);
    expect(isVideoPictureInPictureAvailable(video)).toBe(true);
  });

  it("prefers WebKit enter over requestPictureInPicture", async () => {
    const webkitSetPresentationMode = vi.fn();
    const requestPictureInPicture = vi.fn();
    const video = mockVideo({
      webkitSupportsPresentationMode: () => true,
      webkitSetPresentationMode,
      requestPictureInPicture,
    } as Partial<HTMLVideoElement>);
    await expect(requestVideoPictureInPicture(video)).resolves.toBe(true);
    expect(webkitSetPresentationMode).toHaveBeenCalledWith("picture-in-picture");
    expect(requestPictureInPicture).not.toHaveBeenCalled();
  });

  it("uses requestPictureInPicture when WebKit mode is unavailable", async () => {
    stubDocumentPip(true);
    const requestPictureInPicture = vi.fn().mockResolvedValue(undefined);
    const video = mockVideo({ requestPictureInPicture });
    await expect(requestVideoPictureInPicture(video)).resolves.toBe(true);
    expect(requestPictureInPicture).toHaveBeenCalled();
  });

  it("skips auto PiP when paused or ended", () => {
    stubDocumentPip(true);
    expect(shouldAttemptAutoPictureInPictureOnHide(mockVideo({ paused: true }))).toBe(false);
    expect(shouldAttemptAutoPictureInPictureOnHide(mockVideo({ ended: true }))).toBe(false);
    expect(shouldAttemptAutoPictureInPictureOnHide(mockVideo())).toBe(true);
  });

  it("sets Media Session metadata with AnyExamEasy artist default", () => {
    const metadata = vi.fn();
    vi.stubGlobal("MediaMetadata", metadata);
    vi.stubGlobal("navigator", {
      ...navigator,
      mediaSession: { metadata: null },
    });
    applyMediaSessionMetadata({ title: "Episode 1", artworkUrl: "/poster.webp" });
    expect(metadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Episode 1",
        artist: VIDEO_PIP_ARTIST,
        artwork: [{ src: "/poster.webp", sizes: "512x512", type: "image/webp" }],
      })
    );
  });
});
