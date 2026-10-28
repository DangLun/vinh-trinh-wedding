import { Environment, Lightformer } from "@react-three/drei";
import { palette } from "@/config/theme";

/** Ánh sáng + môi trường phản chiếu dựng từ Lightformer pastel, không tải HDR ngoài. */
export function PastelStudio() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={5}
          color="#ffffff"
          position={[0, 5, -5]}
          scale={[10, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color={palette.bubblegum}
          position={[-5, 1, 0]}
          rotation-y={Math.PI / 2}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color={palette.sky}
          position={[5, 0, 1]}
          rotation-y={-Math.PI / 2}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          color={palette.butter}
          position={[0, -4, 3]}
          scale={3}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color={palette.lilac}
          position={[0, 0, 6]}
          scale={[10, 10, 1]}
        />
      </Environment>
    </>
  );
}
