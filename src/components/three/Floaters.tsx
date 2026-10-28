import { Float } from "@react-three/drei";
import { useMemo } from "react";
import { palette } from "@/config/theme";
import { BubbleMaterial, ChromeMaterial } from "./ChromeMaterial";
import { heartShape, puffy, sparkleShape } from "./shapes";

export type FloaterKind = "heart" | "sparkle" | "bubble";

export type Floater = {
  kind: FloaterKind;
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
};

export const defaultFloaters: Floater[] = [
  {
    kind: "heart",
    position: [-3.2, 1.6, -1],
    scale: 0.7,
    color: palette.bubblegum,
    speed: 1.4,
  },
  {
    kind: "heart",
    position: [3.1, -1.5, -0.5],
    scale: 0.55,
    color: palette.bubblegum,
    speed: 1.1,
  },
  {
    kind: "heart",
    position: [2.4, 2.1, -2],
    scale: 0.4,
    color: palette.lilac,
    speed: 1.7,
  },
  {
    kind: "sparkle",
    position: [-2.6, -1.9, 0],
    scale: 0.6,
    color: palette.butter,
    speed: 2,
  },
  {
    kind: "sparkle",
    position: [3.4, 0.6, -1.5],
    scale: 0.45,
    color: palette.sky,
    speed: 1.6,
  },
  {
    kind: "sparkle",
    position: [-1.2, 2.5, -2.5],
    scale: 0.35,
    color: palette.butter,
    speed: 2.2,
  },
  {
    kind: "bubble",
    position: [-3.6, -0.2, -2],
    scale: 0.45,
    color: palette.sky,
    speed: 1,
  },
  {
    kind: "bubble",
    position: [1.3, -2.4, -1.2],
    scale: 0.3,
    color: palette.lilac,
    speed: 1.3,
  },
  {
    kind: "bubble",
    position: [0.2, 2.6, -3],
    scale: 0.38,
    color: palette.sky,
    speed: 0.9,
  },
];

/** Tim, sao, bong bóng trôi lơ lửng. Hình học được tạo một lần và dùng chung. */
export function Floaters({ items = defaultFloaters }: { items?: Floater[] }) {
  const heart = useMemo(() => puffy(heartShape()), []);
  const sparkle = useMemo(
    () => puffy(sparkleShape(), { depth: 0.08, bevelSize: 0.03 }),
    [],
  );

  return items.map((f, i) => (
    <Float
      key={i}
      position={f.position}
      speed={f.speed}
      rotationIntensity={1.2}
      floatIntensity={1.4}
    >
      {f.kind === "bubble" ? (
        <mesh scale={f.scale}>
          <sphereGeometry args={[1, 48, 48]} />
          <BubbleMaterial color={f.color} />
        </mesh>
      ) : (
        <mesh
          geometry={f.kind === "heart" ? heart : sparkle}
          scale={f.scale}
          rotation={[0, 0, f.kind === "heart" ? 0.2 : 0]}
        >
          <ChromeMaterial
            color={f.color}
            iridescence={f.kind === "heart" ? 0.6 : 1}
          />
        </mesh>
      )}
    </Float>
  ));
}
