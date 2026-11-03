import type { Metadata } from "next";
import { connection } from "next/server";
import QRCode from "qrcode";
import { Suspense } from "react";
import { InviteActions } from "@/components/admin/InviteActions";
import { RefreshGuests } from "@/components/admin/RefreshGuests";
import { button } from "@/components/ui/button";
import { logout } from "./actions";
import { siteUrl } from "@/config/site";
import { palette } from "@/config/theme";
import { coupleName, wedding } from "@/config/wedding";
import {
  getGuestList,
  guestEvents,
  inviteeLabel,
  invitePath,
  inviteVerb,
  sideLabel,
} from "@/lib/guests";
import { listRsvps, type RsvpRow } from "@/lib/rsvp";
import { sheetConfigured } from "@/lib/sheet";
import type { Guest, GuestSide } from "@/types/guest";

// Trang này được proxy.ts khoá: chưa đăng nhập thì chuyển sang /quan-ly/dang-nhap
export const metadata: Metadata = {
  title: `Quản lý khách mời | ${coupleName}`,
  robots: { index: false, follow: false },
};

const sides: GuestSide[] = ["nha-trai", "nha-gai", "ban-be"];

type Row = {
  guest: Guest;
  url: string;
  label: string;
  events: string[];
  message: string;
  qr: string;
};

/** Trạng thái hồi âm của một khách: chưa tải (undefined), chưa trả lời (null) hoặc dòng trong sheet */
function RsvpBadge({ rsvp }: { rsvp: RsvpRow | null | undefined }) {
  if (rsvp === undefined) return null;
  if (rsvp === null) {
    return <p className="mt-1 text-sm opacity-60">Chưa hồi âm</p>;
  }
  return (
    <div className="mt-1 text-sm">
      <p className={rsvp.attending ? "text-gold-deep" : "text-son"}>
        {rsvp.attending
          ? `Sẽ đến${rsvp.events ? ` (${rsvp.events})` : ""}`
          : "Không đến được"}
      </p>
    </div>
  );
}

function GuestList({
  rows,
  rsvps,
}: {
  rows: Row[];
  rsvps?: Map<string, RsvpRow>;
}) {
  return sides.map((side) => {
    const list = rows.filter((r) => r.guest.side === side);
    if (list.length === 0) return null;
    return (
      <section key={side} className="mt-10">
        <h2 className="font-serif text-3xl font-light">
          {sideLabel[side]}{" "}
          <span className="text-base opacity-60">({list.length})</span>
        </h2>
        <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
          {list.map((r) => (
            <li
              key={r.guest.code}
              className="border-gold/50 bg-ivory flex min-w-0 gap-3 border p-4"
            >
              <div
                className="size-20 shrink-0 sm:size-24 [&>svg]:size-full"
                aria-label={`Mã QR link mời ${r.label}`}
                role="img"
                // SVG do thư viện qrcode sinh từ chính URL của mình, không chứa dữ liệu ngoài
                dangerouslySetInnerHTML={{ __html: r.qr }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl">{r.label}</p>
                <p className="text-sm">
                  {r.events.join(", ")}
                  {r.guest.formal && " · trang trọng"}
                </p>
                <RsvpBadge rsvp={rsvps && (rsvps.get(r.guest.code) ?? null)} />
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
  });
}

/** Tổng hợp hồi âm theo số thiệp: đã trả lời, sẽ đến (theo từng lễ), không đến */
function RsvpSummary({
  guests,
  rsvps,
}: {
  guests: Guest[];
  rsvps: Map<string, RsvpRow>;
}) {
  const answered = guests.filter((g) => rsvps.has(g.code));
  const coming = answered.filter((g) => rsvps.get(g.code)!.attending);
  const stats = [
    { label: "Đã hồi âm", value: `${answered.length}/${guests.length}` },
    { label: "Sẽ đến", value: `${coming.length} thiệp` },
    ...wedding.events.map((e) => ({
      label: e.title,
      value: `${coming.filter((g) => rsvps.get(g.code)!.events.includes(e.title)).length} thiệp`,
    })),
    { label: "Không đến", value: `${answered.length - coming.length} thiệp` },
  ];
  return (
    <dl className="border-gold/50 mt-8 grid grid-cols-2 gap-px border bg-[color-mix(in_oklab,var(--gold)_40%,transparent)] sm:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="bg-ivory px-4 py-3">
          <dt className="text-sm opacity-70">{s.label}</dt>
          <dd className="figures mt-1 font-serif text-3xl">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Đọc hồi âm từ Google Sheet lúc mở trang (luôn mới nhất), rồi vẽ lại danh sách kèm trạng thái */
async function GuestBoard({ rows }: { rows: Row[] }) {
  await connection();
  if (!sheetConfigured()) {
    return (
      <>
        <p className="border-gold/50 mt-8 border px-4 py-3 text-sm">
          Chưa nối Google Sheet để nhận hồi âm. Xem hướng dẫn trong{" "}
          <code>docs/google-sheets.md</code>.
        </p>
        <GuestList rows={rows} />
      </>
    );
  }
  let rsvps: Map<string, RsvpRow> | null = null;
  try {
    rsvps = await listRsvps();
  } catch (err) {
    console.error("[rsvp]", err);
  }
  if (!rsvps) {
    return (
      <>
        <p className="text-son mt-8 text-sm">
          Không đọc được hồi âm từ Google Sheet lúc này, tải lại trang thử nha.
        </p>
        <GuestList rows={rows} />
      </>
    );
  }
  return (
    <>
      <RsvpSummary guests={rows.map((r) => r.guest)} rsvps={rsvps} />
      <GuestList rows={rows} rsvps={rsvps} />
    </>
  );
}

export default async function AdminPage() {
  const { guests, problems, source } = await getGuestList();
  const rows: Row[] = await Promise.all(
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
          color: { dark: palette.ink, light: palette.ivory },
        }),
      };
    }),
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-5xl font-light sm:text-6xl">
          Khách mời
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className={button({ className: "min-h-10 px-4" })}
          >
            Đăng xuất
          </button>
        </form>
      </div>
      <p className="mt-2">
        {guests.length} thiệp · {wedding.events.map((e) => e.title).join(" & ")}{" "}
        · link gửi dạng <code>{new URL("/m/", siteUrl).toString()}…</code>
      </p>
      {source === "sheet" ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <RefreshGuests />
          <p className="text-sm opacity-70">
            Thêm hoặc sửa khách ở tab Khách mời trong Google Sheet. Trang tự cập
            nhật sau khoảng 1 phút, bấm nút để thấy ngay.
          </p>
        </div>
      ) : (
        <p className="mt-1 text-sm opacity-70">
          Đang dùng danh sách mẫu (<code>src/data/guests.ts</code>). Nối Google
          Sheet để nhập khách thật, xem <code>docs/google-sheets.md</code>.
        </p>
      )}

      {process.env.SHEET_URL && (
        <p className="mt-2 text-sm">
          <a
            href={process.env.SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-gold-deep underline underline-offset-4"
          >
            Mở Google Sheet (khách mời, hồi âm, lời chúc)
          </a>
        </p>
      )}

      {problems.length > 0 && (
        <div className="border-son/40 text-son mt-6 border px-4 py-3 text-sm">
          <p>Vài dòng trong sheet cần sửa:</p>
          <ul className="mt-1 list-disc pl-5">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Danh sách hiện ngay; trạng thái hồi âm đọc từ sheet rồi thay vào sau */}
      <Suspense fallback={<GuestList rows={rows} />}>
        <GuestBoard rows={rows} />
      </Suspense>
    </main>
  );
}
