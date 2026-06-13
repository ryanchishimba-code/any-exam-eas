import type { ThreeEvent } from "@react-three/fiber";

/** Disable mesh raycasting so interior pick targets stay reachable. */
export const noopRaycast = () => null;

/** Only the closest mesh along the ray should react to hover / click. */
export function isPrimaryPointerHit(e: ThreeEvent<PointerEvent>): boolean {
  const first = e.intersections[0];
  if (!first) return false;
  return Math.abs(first.distance - e.distance) < 1e-4;
}
