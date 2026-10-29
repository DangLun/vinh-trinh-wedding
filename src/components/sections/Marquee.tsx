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
            <span className="px-6">{text}</span>
            <span className="text-butter">✦</span>
          </li>
        ))}
    </ul>
  );
}

/** Băng chữ chạy ngang vô tận: hai dải giống hệt nhau nối đuôi, cùng trượt sang trái. */
export default function Marquee() {
  return (
    <div
      role="marquee"
      aria-label={wedding.marquee.join(", ")}
      className="border-plum bg-lixi text-milk font-display flex overflow-hidden border-y-2 py-3 text-base whitespace-nowrap sm:text-lg"
    >
      <div aria-hidden className="flex">
        <Track />
        <Track />
      </div>
    </div>
  );
}
