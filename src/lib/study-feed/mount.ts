/**
 * How many slides on either side of the visible card stay fully mounted.
 * One neighbor in each direction is enough for scroll-snap. The other slides
 * stay as empty snap spacers so iOS never composites the whole deck.
 */
export const FEED_MOUNT_RADIUS = 1;

export function feedMountedRange(
  count: number,
  activeIndex: number,
  radius = FEED_MOUNT_RADIUS
): { start: number; end: number } {
  if (count <= 0) return { start: 0, end: -1 };
  const active = Math.min(count - 1, Math.max(0, Math.trunc(activeIndex) || 0));
  return {
    start: Math.max(0, active - radius),
    end: Math.min(count - 1, active + radius),
  };
}

export function isFeedSlideMounted(
  index: number,
  count: number,
  activeIndex: number,
  radius = FEED_MOUNT_RADIUS
): boolean {
  const { start, end } = feedMountedRange(count, activeIndex, radius);
  return index >= start && index <= end;
}

/** Closest slide when each offset is the slide's offsetTop. Offsets must be sorted. */
export function feedIndexFromOffsets(scrollTop: number, offsets: readonly number[]): number {
  if (!offsets.length) return 0;
  let best = 0;
  let bestDist = Infinity;
  for (let index = 0; index < offsets.length; index += 1) {
    const dist = Math.abs(offsets[index]! - scrollTop);
    if (dist < bestDist) {
      best = index;
      bestDist = dist;
    } else {
      break;
    }
  }
  return best;
}
