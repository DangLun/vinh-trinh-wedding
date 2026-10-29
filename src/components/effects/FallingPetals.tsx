import { MAI_PETAL, MaiFlower } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";
import { cn } from "@/lib/cn";

type Kind = "mai" | "petal" | "heart";

const COUNT = 30;

/** Số giả ngẫu nhiên cố định theo chỉ số: server và client ra cùng kết quả, không lệch hydrate */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Hoa mai nhiều nhất, xen cánh rời và vài trái tim
const KINDS: Kind[] = [
  "mai",
  "petal",
  "mai",
  "heart",
  "petal",
  "mai",
  "heart",
  "petal",
];

// Viết đủ tên class để Tailwind sinh ra keyframe tương ứng
const FALLS = ["animate-petal-a", "animate-petal-b", "animate-petal-c"];

const flakes = Array.from({ length: COUNT }, (_, i) => ({
  kind: KINDS[i % KINDS.length],
  left: rand(i, 1) * 100,
  size: 16 + rand(i, 2) * 14,
  duration: 14 + rand(i, 3) * 12,
  // Delay âm: vừa vào trang đã có cánh rơi giữa chừng, không đợi rơi từ đỉnh
  delay: -rand(i, 4) * 26,
  // Gió bấc thổi lệch sang trái, ba mức lệch khác nhau
  fall: FALLS[i % FALLS.length],
  // Một nửa ẩn trên mobile cho đỡ rối
  desktopOnly: i % 2 === 1,
}));

const HEART =
  "M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z";

function Shape({ kind, index }: { kind: Kind; index: number }) {
  if (kind === "heart") {
    return (
      <path
        d={HEART}
        fill={index % 3 === 0 ? palette.lixi : palette.bubblegum}
      />
    );
  }
  if (kind === "petal") {
    return (
      <path
        d={MAI_PETAL}
        transform="translate(0 6) scale(1.1)"
        fill={palette.butter}
      />
    );
  }
  return <MaiFlower />;
}

/**
 * Hoa mai, cánh mai và tim rơi chéo theo gió khắp trang (Tết miền Tây + Valentine).
 * Thuần CSS, không JS chạy theo khung hình; tắt hẳn khi người dùng bật giảm chuyển động.
 */
export default function FallingPetals() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden motion-reduce:hidden"
    >
      {flakes.map((f, i) => (
        <span
          key={i}
          className={cn(
            "absolute -top-10",
            f.fall,
            f.desktopOnly && "max-sm:hidden",
          )}
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={f.size}
            height={f.size}
            className="animate-flutter block opacity-90"
            style={{ animationDelay: `${f.delay / 3}s` }}
          >
            <Shape kind={f.kind} index={i} />
          </svg>
        </span>
      ))}
    </div>
  );
}
