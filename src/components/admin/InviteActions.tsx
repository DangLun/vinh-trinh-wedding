"use client";

import { useState } from "react";
import { sticker } from "@/components/ui/sticker";

const btn = "inline-flex min-h-10 items-center px-4 text-sm font-semibold";

/** Sao chép link / gửi qua bảng chia sẻ của điện thoại (chọn Zalo, Messenger…) */
export function InviteActions({
  url,
  message,
}: {
  url: string;
  message: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Sao chép link này:", text);
    }
  };

  const share = async () => {
    // Máy tính không có bảng chia sẻ thì chép cả lời nhắn + link để dán vào Zalo
    if (!navigator.share) return copy(`${message} ${url}`);
    try {
      await navigator.share({ text: message, url });
    } catch {
      // Người dùng đóng bảng chia sẻ: không làm gì
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => copy(url)}
        className={sticker({ tone: "butter", shadow: false, className: btn })}
      >
        {copied ? "Đã chép ✓" : "Sao chép link"}
      </button>
      <button
        type="button"
        onClick={share}
        className={sticker({
          tone: "bubblegum",
          shadow: false,
          className: btn,
        })}
      >
        Gửi
      </button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={sticker({ shadow: false, className: btn })}
      >
        Xem thử
      </a>
    </div>
  );
}
