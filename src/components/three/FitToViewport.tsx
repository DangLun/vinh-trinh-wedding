import { useThree } from "@react-three/fiber";
import type { ReactNode } from "react";

/** Thu nhỏ nội dung khi khung nhìn hẹp hơn designWidth (đơn vị thế giới 3D). */
export function FitToViewport({
  designWidth = 7.5,
  children,
}: {
  designWidth?: number;
  children: ReactNode;
}) {
  const width = useThree((s) => s.viewport.width);
  return <group scale={Math.min(1, width / designWidth)}>{children}</group>;
}
