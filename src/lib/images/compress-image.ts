/**
 * Browser-only image compression helper.
 *
 * We avoid external blob storage for small avatar photos: an uploaded image is
 * drawn to a canvas, downscaled to a max dimension, and exported as a compact
 * JPEG data URL that we store directly on the testimonial row. This keeps the
 * admin flow zero-infra (no Vercel Blob / S3 token required).
 *
 * For larger media (question diagrams at full resolution), swap this for a real
 * upload route backed by `@vercel/blob` and store the returned URL instead.
 */

export type CompressOptions = {
  /** Longest edge in pixels after downscale. */
  maxDimension?: number;
  /** JPEG quality 0–1. */
  quality?: number;
};

export async function compressImageToDataUrl(
  file: File,
  { maxDimension = 320, quality = 0.82 }: CompressOptions = {}
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, or WebP).");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Canvas unavailable — fall back to the original data URL.
    return dataUrl;
  }
  ctx.drawImage(img, 0, 0, width, height);

  // PNG with transparency would lose its background on JPEG; keep PNG if alpha
  // matters is overkill for avatars, so a white-matted JPEG is fine and small.
  return canvas.toDataURL("image/jpeg", quality);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load that image."));
    img.src = src;
  });
}
