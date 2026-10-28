import { palette } from "@/config/theme";
import { cn } from "@/lib/cn";

const pastelMesh = [
  `radial-gradient(40% 35% at 15% 20%, ${palette.blush} 0%, transparent 70%)`,
  `radial-gradient(45% 40% at 85% 25%, ${palette.mist} 0%, transparent 70%)`,
  `radial-gradient(50% 40% at 70% 85%, ${palette.ice} 0%, transparent 70%)`,
  `radial-gradient(35% 30% at 20% 85%, ${palette.cream} 0%, transparent 70%)`,
  palette.milk,
].join(", ");

/** Nền loang pastel, phủ kín phần tử cha (cha cần relative + isolate). */
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 -z-10", className)}
      style={{ background: pastelMesh }}
    />
  );
}
