import type { Metadata } from "next";
import QRCode from "qrcode";
import { InviteActions } from "@/components/admin/InviteActions";
import { siteUrl } from "@/config/site";
import { palette } from "@/config/theme";
import { coupleName, wedding } from "@/config/wedding";
import { guests } from "@/data/guests";
import {
  guestEvents,
  inviteeLabel,
  invitePath,
  inviteVerb,
  sideLabel,
} from "@/lib/guests";
import type { GuestSide } from "@/types/guest";

// Trang này được proxy.ts khoá bằng mật khẩu (biến môi trường ADMIN_PASSWORD)
export const metadata: Metadata = {
  title: `Quản lý khách mời | ${coupleName}`,
  robots: { index: false, follow: false },
};

const sides: GuestSide[] = ["nha-trai", "nha-gai", "ban-be"];

export default async function AdminPage() {
  const rows = await Promise.all(
    guests.map(async (g) => {
      const url = new URL(invitePath(g), siteUrl).toString();
      return {
        guest: g,
        url,
        label: inviteeLabel(g),
        events: guestEvents(g).map((e) => e.title),
        // Lời nhắn soạn sẵn khi bấm "Gửi"
        message: `${inviteVerb(g)} ${inviteeLabel(g)} đến dự đám cưới ${coupleName} 💌`,
        // Mã QR để in kèm thiệp giấy
        qr: await QRCode.toString(url, {
          type: "svg",
          margin: 1,
          color: { dark: palette.plum, light: "#ffffff" },
        }),
      };
    }),
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <h1 className="font-display text-4xl sm:text-5xl">Khách mời</h1>
      <p className="mt-2">
        {guests.length} thiệp · {wedding.events.map((e) => e.title).join(" & ")}{" "}
        · link gửi dạng <code>{new URL("/m/", siteUrl).toString()}…</code>
      </p>
      <p className="mt-1 text-sm opacity-70">
        Thêm hoặc sửa khách trong <code>src/data/guests.ts</code>, push lên là
        trang tự cập nhật.
      </p>

      {sides.map((side) => {
        const list = rows.filter((r) => r.guest.side === side);
        if (list.length === 0) return null;
        return (
          <section key={side} className="mt-10">
            <h2 className="font-display text-2xl">
              {sideLabel[side]}{" "}
              <span className="text-base opacity-60">({list.length})</span>
            </h2>
            <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
              {list.map((r) => (
                <li
                  key={r.guest.code}
                  className="border-plum flex min-w-0 gap-3 rounded-3xl border-2 bg-white p-4 shadow-[4px_4px_0_var(--plum)]"
                >
                  <div
                    className="size-20 shrink-0 sm:size-24 [&>svg]:size-full"
                    aria-label={`Mã QR link mời ${r.label}`}
                    role="img"
                    // SVG do thư viện qrcode sinh từ chính URL của mình, không chứa dữ liệu ngoài
                    dangerouslySetInnerHTML={{ __html: r.qr }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl">{r.label}</p>
                    <p className="text-sm">
                      {r.events.join(", ")}
                      {r.guest.formal && " · trang trọng"}
                    </p>
                    {r.guest.note && (
                      <p className="mt-1 truncate text-sm italic opacity-70">
                        “{r.guest.note}”
                      </p>
                    )}
                    <p className="mt-1 truncate text-xs opacity-60">{r.url}</p>
                    <div className="mt-3">
                      <InviteActions url={r.url} message={r.message} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
