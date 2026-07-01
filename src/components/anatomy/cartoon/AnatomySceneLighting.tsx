"use client";

import { Environment, Lightformer } from "@react-three/drei";

/** Cinematic medical-studio lighting + image-based reflections. */
export function AnatomySceneLighting() {
  return (
    <>
      <Environment resolution={1024} frames={Infinity} background={false}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#fff4ea"
          rotation-x={Math.PI / 2}
          position={[0, 8, 0]}
          scale={[14, 14, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.35}
          color="#22d3ee"
          rotation-y={Math.PI / 2}
          position={[-6, 2.5, 0]}
          scale={[10, 6, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.85}
          color="#67e8f9"
          rotation-y={Math.PI}
          position={[0, 2.2, -5]}
          scale={9}
        />
        <Lightformer form="circle" intensity={0.35} color="#1e293b" position={[0, -4, 2]} scale={12} />
      </Environment>

      <ambientLight intensity={0.18} color="#c5d4e8" />

      <spotLight
        position={[1.4, 7.2, 3.6]}
        angle={0.38}
        penumbra={0.92}
        intensity={2.6}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
        shadow-normalBias={0.028}
      />

      <directionalLight
        position={[4.2, 9, 4.5]}
        intensity={1.35}
        color="#fff1e6"
        castShadow={false}
      />
      <directionalLight position={[-5.5, 3, -2.5]} intensity={0.95} color="#22d3ee" />
      <directionalLight position={[0, 1.5, -6]} intensity={0.22} color="#7dd3fc" />
      <directionalLight position={[0, -3, 4]} intensity={0.18} color="#475569" />

      <pointLight position={[0, 2.4, 3.2]} intensity={0.55} color="#fcd9b8" distance={9} decay={2} />
      <pointLight position={[-2.2, 1.2, 1.8]} intensity={0.28} color="#67e8f9" distance={6} decay={2} />

      <hemisphereLight args={["#1e3a5f", "#020617", 0.48]} />
    </>
  );
}
