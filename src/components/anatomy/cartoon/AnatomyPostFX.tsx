"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/** Subtle bloom + vignette for medical-studio realism on selection glow. */
export function AnatomyPostFX({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.35}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.22} darkness={0.55} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
