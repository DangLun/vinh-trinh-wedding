import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { metals } from "@/config/theme";
import { setCursorVariant } from "@/lib/cursor";
import { MetalMaterial } from "./ChromeMaterial";

// Bán kính 1, bản nhẫn 0.15: thanh như nhẫn cưới thật, đủ đặc để bắt sáng
const RING: [number, number, number, number] = [1, 0.15, 64, 200];

/** Cặp nhẫn lồng nhau: tự xoay, nghiêng theo con trỏ, phóng nhẹ khi hover. */
export function WeddingRings({ onSelect }: { onSelect?: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const { damp } = THREE.MathUtils;
    const spin = state.clock.elapsedTime * 0.25;
    g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.6 + spin, 3, delta);
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.4 + 0.25, 3, delta);
    g.scale.setScalar(damp(g.scale.x, hovered ? 1.06 : 1, 6, delta));
  });

  const interactive = onSelect
    ? {
        onClick: (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          onSelect();
        },
        onPointerOver: () => {
          setHovered(true);
          setCursorVariant("hover");
        },
        onPointerOut: () => {
          setHovered(false);
          setCursorVariant("default");
        },
      }
    : {};

  return (
    <group ref={ref} {...interactive}>
      {/* Một nhẫn nằm mặt XY, nhẫn kia xoay 90° quanh trục X, lệch tâm để móc vào nhau */}
      <mesh position={[-0.6, 0, 0]}>
        <torusGeometry args={RING} />
        <MetalMaterial color={metals.roseGold} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={RING} />
        <MetalMaterial color={metals.gold} />
      </mesh>
    </group>
  );
}
