"use client";

import { useFormStatus } from "react-dom";
import { refreshGuests } from "@/app/quan-ly/actions";
import { button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={button({ className: "min-h-10 px-4 disabled:opacity-60" })}
    >
      {pending ? "Đang cập nhật…" : "Cập nhật danh sách"}
    </button>
  );
}

/** Nút đọc lại danh sách khách từ Google Sheet sau khi vừa sửa sheet */
export function RefreshGuests() {
  return (
    <form action={refreshGuests}>
      <Submit />
    </form>
  );
}
