"use client";

import { useState } from "react";
import { button } from "@/components/ui/button";

const btn = "min-h-10 px-4";

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
        className={button({ className: btn })}
      >
        {copied ? "Đã chép" : "Sao chép link"}
      </button>
      <button
        type="button"
        onClick={share}
        className={button({ tone: "son", className: btn })}
      >
        Gửi
      </button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={button({ className: btn })}
      >
        Xem thử
      </a>
    </div>
  );
}
