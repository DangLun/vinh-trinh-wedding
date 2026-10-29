/** Chrome ánh xà cừ kiểu Y2K. Cần có Environment trong cảnh để phản chiếu. */
export function ChromeMaterial({
  color,
  iridescence = 1,
}: {
  color: string;
  iridescence?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.65}
      roughness={0.12}
      clearcoat={1}
      clearcoatRoughness={0.05}
      iridescence={iridescence}
      iridescenceIOR={1.6}
      iridescenceThicknessRange={[120, 700]}
    />
  );
}

/**
 * Kim loại quý đánh bóng cho nhẫn: kim loại hoàn toàn, không phủ bóng, không ánh xà cừ
 * (hai thứ đó làm bề mặt trông như nhựa). Độ nhám nhỏ để vệt sáng mềm như trang sức thật.
 */
export function MetalMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={0.16}
      envMapIntensity={1.3}
    />
  );
}

export function BubbleMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0}
      metalness={0.2}
      iridescence={1}
      iridescenceIOR={1.3}
      transparent
      opacity={0.55}
    />
  );
}
