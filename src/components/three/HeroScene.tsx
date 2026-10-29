"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { FitToViewport } from "./FitToViewport";
import { Floaters } from "./Floaters";
import { PastelStudio } from "./PastelStudio";
import { WeddingRings } from "./WeddingRings";

export type HeroSceneProps = {
  /** false: dừng vẽ (vd. khi Hero đã cuộn khỏi màn hình) */
  active: boolean;
  onRingsSelect?: () => void;
  onReady?: () => void;
};

export default function HeroScene({
  active,
  onRingsSelect,
  onReady,
}: HeroSceneProps) {
  // 1.5x đủ nét cho màn Retina; máy tụt khung hình thì hạ tiếp về 1x
  const [maxDpr, setMaxDpr] = useState(1.5);

  return (
    <Canvas
      dpr={[1, maxDpr]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={onReady}
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <PastelStudio />
      <FitToViewport>
        <WeddingRings onSelect={onRingsSelect} />
        <Floaters />
      </FitToViewport>
    </Canvas>
  );
}
