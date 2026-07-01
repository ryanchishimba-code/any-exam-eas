"use client";

import {
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  EffectComposer,
  SSAO,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/** Cinematic grade: AO depth, bloom on selection glow, subtle chromatic fringe. */
export function AnatomyPostFX({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={8} enableNormalPass>
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={32}
        rings={5}
        distanceThreshold={0.92}
        distanceFalloff={0.08}
        rangeThreshold={0.0015}
        rangeFalloff={0.04}
        luminanceInfluence={0.38}
        intensity={28}
        bias={0.018}
      />
      <Bloom
        intensity={0.72}
        luminanceThreshold={0.52}
        luminanceSmoothing={0.82}
        mipmapBlur
        radius={1.05}
      />
      <BrightnessContrast brightness={0.028} contrast={0.16} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.00038, 0.00028] as unknown as [number, number]}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.68} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
