type Point = [number, number];
type Cubic = [Point, Point, Point, Point];

/** Đọc path chỉ gồm "M x y" rồi một chuỗi "C x1 y1 x2 y2 x y" (toạ độ tuyệt đối) */
function cubics(d: string): Cubic[] {
  const n = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const out: Cubic[] = [];
  let p: Point = [n[0], n[1]];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const end: Point = [n[i + 4], n[i + 5]];
    out.push([p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], end]);
    p = end;
  }
  return out;
}

function at([a, b, c, e]: Cubic, t: number): Point {
  const m = 1 - t;
  const f = (k: 0 | 1) =>
    m * m * m * a[k] +
    3 * m * m * t * b[k] +
    3 * m * t * t * c[k] +
    t * t * t * e[k];
  return [f(0), f(1)];
}

/** Hướng đi của nét tại t, đã chuẩn hoá */
function heading([a, b, c, e]: Cubic, t: number): Point {
  const m = 1 - t;
  const f = (k: 0 | 1) =>
    3 * m * m * (b[k] - a[k]) +
    6 * m * t * (c[k] - b[k]) +
    3 * t * t * (e[k] - c[k]);
  const x = f(0);
  const y = f(1);
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

// Trục nghiêng của chữ copperplate: nét đậm nhất khi đi xuống hơi chếch sang trái
const SLANT: Point = [-0.29, 0.96];

const num = (v: number) => +v.toFixed(2);

/**
 * Biến một đường giữa thành nét ngòi nhọn kiểu chữ Imperial Script / copperplate:
 * đi xuống theo trục nghiêng thì ấn bút (đậm tới `thick`), đi lên hay đi ngang thì
 * nét mảnh như sợi tóc (`hair`). Đơn vị theo hệ toạ độ của path.
 * Trả về các path tô kín (mỗi đoạn cong một hình + chấm tròn ở các khớp nối), vẽ chồng lên nhau.
 */
export function penStroke(
  d: string,
  { hair, thick, steps = 16 }: { hair: number; thick: number; steps?: number },
): string[] {
  const half = ([x, y]: Point) => {
    const press = Math.max(0, x * SLANT[0] + y * SLANT[1]);
    return (hair + (thick - hair) * press * press) / 2;
  };
  const shapes: string[] = [];
  const joints: string[] = [];
  for (const seg of cubics(d)) {
    const left: Point[] = [];
    const right: Point[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const [x, y] = at(seg, t);
      const dir = heading(seg, t);
      const h = half(dir);
      left.push([x - dir[1] * h, y + dir[0] * h]);
      right.push([x + dir[1] * h, y - dir[0] * h]);
    }
    const outline = [...left, ...right.reverse()];
    shapes.push(
      `M${outline.map(([x, y]) => `${num(x)} ${num(y)}`).join("L")}Z`,
    );
    // Đầu mút bo tròn để các đoạn nối liền, không lộ khe ở chỗ đổi hướng gấp (mũi tim, khe tim)
    for (const t of [0, 1]) {
      const [x, y] = at(seg, t);
      const r = num(half(heading(seg, t)));
      joints.push(
        `M${num(x - r)} ${num(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`,
      );
    }
  }
  // Các chấm tròn cùng chiều vẽ nên gộp được một path; các hình đoạn cong để riêng
  // vì chiều vẽ khác nhau, gộp lại thì chỗ chồng nhau có thể bị khoét lỗ.
  return [...shapes, joints.join("")];
}
