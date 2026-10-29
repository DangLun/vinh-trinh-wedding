import { MaiFlower } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";
import { wedding } from "@/config/wedding";

// Lặp cụm chữ đủ dài để một dải luôn phủ kín màn hình rộng
const REPEAT = 3;

function Track() {
  return (
    <ul className="animate-marquee flex shrink-0 items-center motion-reduce:animate-none">
      {Array.from({ length: REPEAT }, () => wedding.marquee)
        .flat()
        .map((text, i) => (
          <li key={i} className="flex items-center">
            <span className="px-8">{text}</span>
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <MaiFlower color={palette.goldDeep} />
            </svg>
          </li>
        ))}
    </ul>
  );
}

/** Dải chữ chạy rất chậm giữa hai nét vàng, ngăn Hero (sơn mài) với phần nền ngà. */
export default function Marquee() {
  return (
    <div
      role="marquee"
      aria-label={wedding.marquee.join(", ")}
      className="border-gold/50 text-gold-deep flex overflow-hidden border-y py-4 font-serif text-xl whitespace-nowrap italic sm:text-2xl"
    >
      <div aria-hidden className="flex">
        <Track />
        <Track />
      </div>
    </div>
  );
}
