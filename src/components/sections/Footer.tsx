import { MaiBranch } from "@/components/ui/MaiFlower";
import { Monogram } from "@/components/ui/Monogram";
import { button } from "@/components/ui/button";
import { maker } from "@/config/site";
import { coupleName, lunarYear, wedding } from "@/config/wedding";

export default function Footer({ guestName }: { guestName?: string }) {
  return (
    <footer className="lacquer relative isolate overflow-hidden px-5 py-24 text-center">
      <MaiBranch className="absolute -right-10 -bottom-4 -z-10 w-[min(30vw,17rem)] -scale-x-100 opacity-50" />
      <Monogram className="mx-auto size-20" />
      {guestName && (
        <p className="mt-10 font-serif text-3xl font-light italic sm:text-4xl">
          Hẹn gặp {guestName}
        </p>
      )}
      <p className="text-ivory/75 mt-8 text-sm">
        {coupleName}, {lunarYear} 2027
      </p>
      <p className="text-gold mt-1 text-sm">{wedding.hashtag}</p>

      {/* Ghi công người làm trang: một câu kể, bên dưới là nút tên dẫn tới Facebook
          (nút riêng thay vì link giữa câu: đủ lớn để chạm, nhìn là biết bấm được) */}
      <div className="border-gold/20 mx-auto mt-14 max-w-lg border-t pt-8">
        <p className="text-ivory/75 text-sm text-balance">
          Thiệp do {maker.relation} tự tay làm tặng anh {wedding.groom.name}{" "}
          &amp; chị {wedding.bride.name}
        </p>
        <a
          href={maker.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={button({
            tone: "gold",
            className:
              "focus-visible:outline-gold mt-4 cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-4",
          })}
        >
          <FacebookIcon className="size-4" />
          {maker.name}
          <span className="sr-only">(Facebook)</span>
        </a>
      </div>
    </footer>
  );
}

/** Logo Facebook (Simple Icons, CC0), tô bằng màu chữ hiện tại */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}
