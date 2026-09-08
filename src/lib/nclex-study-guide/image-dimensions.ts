import { readFileSync } from "node:fs";
import type { MarkdownImageSize } from "./markdown";

/**
 * Intrinsic image dimensions read straight from file headers.
 *
 * Deliberately dependency-free: the study guide ships 35 JPEGs and 2 SVGs, and
 * pulling in sharp (a native binary) or image-size for a build-time read of two
 * formats isn't worth the install cost.
 */

/** Width/height from a JPEG's first Start-Of-Frame marker. */
function jpegSize(buf: Buffer): MarkdownImageSize | undefined {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return undefined;

  let offset = 2;
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1]!;

    // Standalone markers carry no length payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9) break;

    const length = buf.readUInt16BE(offset + 2);

    // SOF0..SOF15, excluding the DHT/JPG/DAC markers interleaved in that range.
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return undefined;
}

/** Width/height from an SVG's width/height attributes, else its viewBox. */
function svgSize(text: string): MarkdownImageSize | undefined {
  const head = text.slice(0, 2000);

  const attr = (name: string): number | undefined => {
    const m = head.match(new RegExp(`\\b${name}\\s*=\\s*"([\\d.]+)(?:px)?"`, "i"));
    const n = m ? Number(m[1]) : NaN;
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const width = attr("width");
  const height = attr("height");
  if (width && height) return { width: Math.round(width), height: Math.round(height) };

  const viewBox = head.match(/\bviewBox\s*=\s*"([^"]+)"/i);
  if (viewBox) {
    const parts = viewBox[1]!.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      const [, , vbWidth, vbHeight] = parts as [number, number, number, number];
      if (vbWidth > 0 && vbHeight > 0) {
        return { width: Math.round(vbWidth), height: Math.round(vbHeight) };
      }
    }
  }
  return undefined;
}

/** Read intrinsic dimensions for a local image file, or undefined if unreadable. */
export function readImageSize(filePath: string): MarkdownImageSize | undefined {
  let buf: Buffer;
  try {
    buf = readFileSync(filePath);
  } catch {
    return undefined;
  }
  if (/\.svg$/i.test(filePath)) return svgSize(buf.toString("utf8"));
  if (/\.jpe?g$/i.test(filePath)) return jpegSize(buf);
  return undefined;
}
