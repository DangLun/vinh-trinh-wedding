import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";
import { coupleName } from "@/config/wedding";
import { formatDotDate, formatWeekday } from "@/lib/date";

/** Kích thước chuẩn ảnh xem trước của Zalo / Facebook / Messenger */
export const ogSize = { width: 1200, height: 630 };

// Font TTF có dấu tiếng Việt (ImageResponse không đọc được woff2), giấy phép OFL trong assets/fonts
const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Agbalumo-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/BeVietnamPro-SemiBold.ttf")),
]);

// Hoa mai trang trí bốn góc: [left, top, cỡ, góc xoay]
const blossoms: [number, number, number, number][] = [
  [40, 40, 110, 10],
  [1050, 30, 90, 40],
  [60, 480, 80, 70],
  [1040, 470, 120, 25],
];

/**
 * Ảnh thiệp xem trước khi gửi link. Có `to` thì là thiệp riêng "Thân mời <tên>",
 * không có thì là thiệp chung "Save the date".
 */
export async function inviteCard({ to, date }: { to?: string; date: string }) {
  const [agbalumo, beVietnam] = await fonts;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        color: palette.plum,
        fontFamily: "Be Vietnam Pro",
        background: `linear-gradient(160deg, ${palette.ice} 0%, ${palette.milk} 40%, ${palette.cream} 70%, ${palette.blush} 100%)`,
      }}
    >
      {blossoms.map(([left, top, size, rotate], i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          style={{
            position: "absolute",
            left,
            top,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <MaiFlower />
        </svg>
      ))}

      <div style={{ fontSize: 34 }}>{to ? "Thân mời" : "Save the date"}</div>
      {to && (
        <div
          style={{
            fontFamily: "Agbalumo",
            fontSize: to.length > 18 ? 64 : 80,
            color: palette.lixi,
            marginTop: 4,
          }}
        >
          {to}
        </div>
      )}
      {to && (
        <div style={{ fontSize: 30, marginTop: 6 }}>
          đến chung vui ngày cưới của
        </div>
      )}
      <div
        style={{
          fontFamily: "Agbalumo",
          fontSize: to ? 116 : 150,
          lineHeight: 1.1,
          textShadow: `5px 5px 0 ${palette.bubblegum}, 10px 10px 0 ${palette.sky}`,
        }}
      >
        {coupleName}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 22,
          padding: "10px 32px",
          fontSize: 34,
          background: "white",
          border: `3px solid ${palette.plum}`,
          borderRadius: 999,
        }}
      >
        {`${formatWeekday(date)} · ${formatDotDate(date)}`}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Agbalumo", data: agbalumo, weight: 400, style: "normal" },
        {
          name: "Be Vietnam Pro",
          data: beVietnam,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );
}
