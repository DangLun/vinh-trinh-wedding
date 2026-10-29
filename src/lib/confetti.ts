import { palette } from "@/config/theme";

const colors = [
  palette.bubblegum,
  palette.lixi,
  palette.butter,
  palette.sky,
  "#ffffff",
];

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z";

/** Bắn tim + sao pastel. Thư viện chỉ được tải ở lần gọi đầu tiên. */
export async function heartBurst(origin = { x: 0.5, y: 0.45 }) {
  const confetti = (await import("canvas-confetti")).default;
  const heart = confetti.shapeFromPath({ path: HEART_PATH });
  const base = { colors, origin, disableForReducedMotion: true };
  confetti({
    ...base,
    particleCount: 70,
    spread: 80,
    startVelocity: 38,
    shapes: [heart],
    scalar: 1.4,
  });
  confetti({
    ...base,
    particleCount: 50,
    spread: 120,
    startVelocity: 28,
    shapes: ["star", "circle"],
  });
}
