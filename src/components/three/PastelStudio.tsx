import { Environment, Lightformer } from "@react-three/drei";
import { palette } from "@/config/theme";

/** Ánh sáng + môi trường phản chiếu kiểu chụp trang sức, dựng từ Lightformer, không tải HDR ngoài. */
export function PastelStudio() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      {/* Nền môi trường để tối: kim loại cần vùng tối xen vệt sáng thì mới ra chất kim loại */}
      <Environment resolution={256} frames={1}>
        {/* Tấm hắt sáng ngà phía sau máy quay: đủ sáng để nhẫn không đen, vẫn tối hơn các dải đèn */}
        <Lightformer
          form="rect"
          intensity={0.9}
          color={palette.milk}
          position={[0, 0, 9]}
          scale={[16, 12, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.6}
          color={palette.cream}
          position={[0, -6, 0]}
          scale={[16, 16, 1]}
        />
        {/* Dải đèn studio mảnh, trắng gắt (Lightformer tự quay về tâm cảnh) */}
        <Lightformer
          form="rect"
          intensity={6}
          color="#ffffff"
          position={[0, 5, 1]}
          scale={[10, 1.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={5}
          color="#ffffff"
          position={[-4, 0.5, 4]}
          scale={[0.7, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#ffffff"
          position={[4, -0.5, 4]}
          scale={[0.5, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffffff"
          position={[0, -4, 4]}
          scale={[8, 0.6, 1]}
        />
        {/* Ánh hắt pastel nhẹ hai bên, giữ không khí hồng – vàng mai */}
        <Lightformer
          form="rect"
          intensity={1.5}
          color={palette.bubblegum}
          position={[-6, 0, -2]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color={palette.butter}
          position={[6, 0, -2]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          color={palette.sky}
          position={[0, 3, 5]}
          scale={1.5}
        />
      </Environment>
    </>
  );
}
