import type { Object3D } from "three";

const preparedByUrl = new Map<string, Object3D>();

/** Clone + one-time mesh setup per GLB URL — avoids re-cloning heavy atlas scenes on re-renders. */
export function getPreparedAtlasScene(url: string, scene: Object3D, prepare: (root: Object3D) => void): Object3D {
  let cached = preparedByUrl.get(url);
  if (!cached) {
    cached = scene.clone(true);
    prepare(cached);
    preparedByUrl.set(url, cached);
  }
  return cached;
}

/** Test-only — reset module cache between cases. */
export function clearCtAtlasSceneCacheForTests(): void {
  preparedByUrl.clear();
}
