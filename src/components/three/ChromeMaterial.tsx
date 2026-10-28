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
