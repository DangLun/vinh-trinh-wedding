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

/** Hoa mai 5 cánh cho confetti: xoay cánh mai quanh tâm (12,12) để ghép thành một path */
function maiPath() {
  // Cánh gốc: M12 12 C9 9 9 3 12 1.5 C15 3 15 9 12 12 Z
  const petal = [
    [9, 9],
    [9, 3],
    [12, 1.5],
    [15, 3],
    [15, 9],
    [12, 12],
  ];
  const fmt = (n: number) => n.toFixed(2);
  return Array.from({ length: 5 }, (_, k) => {
    const a = (k * 72 * Math.PI) / 180;
    const [p1, p2, p3, p4, p5, p6] = petal.map(([x, y]) => {
      const dx = x - 12;
      const dy = y - 12;
      return `${fmt(12 + dx * Math.cos(a) - dy * Math.sin(a))} ${fmt(12 + dx * Math.sin(a) + dy * Math.cos(a))}`;
    });
    return `M12 12 C${p1} ${p2} ${p3} C${p4} ${p5} ${p6} Z`;
  }).join(" ");
}

/** Bắn chùm hoa mai vàng (kèm vài tim đỏ). Thư viện chỉ được tải ở lần gọi đầu tiên. */
export async function maiBurst(origin = { x: 0.5, y: 0.5 }) {
  const confetti = (await import("canvas-confetti")).default;
  const mai = confetti.shapeFromPath({ path: maiPath() });
  const heart = confetti.shapeFromPath({ path: HEART_PATH });
  const base = { origin, disableForReducedMotion: true };
  confetti({
    ...base,
    particleCount: 60,
    spread: 100,
    startVelocity: 34,
    shapes: [mai],
    colors: [palette.butter, "#f2b100", "#ffe27a"],
    scalar: 1.6,
  });
  confetti({
    ...base,
    particleCount: 18,
    spread: 70,
    startVelocity: 28,
    shapes: [heart],
    colors: [palette.lixi, palette.bubblegum],
    scalar: 1.2,
  });
}
