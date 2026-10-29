import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";
import { couple, lunarOf, lunarYear } from "@/config/wedding";
import { formatDotDate, formatWeekday } from "@/lib/date";
import { HEART_INK } from "@/lib/heart-line";

/** Kích thước chuẩn ảnh xem trước của Zalo / Facebook / Messenger */
export const ogSize = { width: 1200, height: 630 };

const font = (file: string) =>
  readFile(join(process.cwd(), "assets/fonts", file));

// Font TTF có dấu tiếng Việt (ImageResponse không đọc được woff2), giấy phép OFL trong assets/fonts
const fonts = Promise.all([
  font("CormorantGaramond-Light.ttf"),
  font("CormorantGaramond-LightItalic.ttf"),
  font("Waterfall-Regular.ttf"),
  font("BeVietnamPro-SemiBold.ttf"),
]);

// Hoa mai vàng ở hai góc chéo: [left, top, cỡ, góc xoay]
const blossoms: [number, number, number, number][] = [
  [56, 52, 64, 10],
  [112, 96, 36, 40],
  [1080, 470, 72, 25],
  [1036, 530, 34, 60],
];

/**
 * Ảnh thiệp xem trước khi gửi link: nền sơn mài, khung chỉ vàng đôi.
 * Có `to` thì là thiệp riêng "Thân mời <tên>", không có thì là thiệp chung.
 */
export async function inviteCard({ to, date }: { to?: string; date: string }) {
  const [light, italic, waterfall, beVietnam] = await fonts;
  // Cỡ tên; nét tim nối hai tên có kích thước theo cỡ này như SignatureNames trên trang (đơn vị em)
  const nameSize = to ? 140 : 176;
  const lunar = lunarOf(date);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 28,
        color: palette.ivory,
        fontFamily: "Be Vietnam Pro",
        background: `radial-gradient(90% 70% at 50% 0%, ${palette.umber} 0%, ${palette.lacquer} 70%)`,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: 10,
          border: `1px solid ${palette.gold}99`,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            border: `1px solid ${palette.gold}66`,
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
                left: left - 38,
                top: top - 38,
                transform: `rotate(${rotate}deg)`,
              }}
            >
              {/* Satori chỉ nhận thẻ SVG gốc bên trong <svg>: gọi hàm thay vì dùng component */}
              {MaiFlower({ tone: "fill" })}
            </svg>
          ))}

          <div style={{ fontSize: 22, letterSpacing: 4, color: palette.gold }}>
            {to ? "Thân mời" : "Trân trọng kính mời"}
          </div>
          {to && (
            <div
              style={{
                fontFamily: "Cormorant Italic",
                fontSize: to.length > 18 ? 56 : 68,
                marginTop: 6,
              }}
            >
              {to}
            </div>
          )}
          {/* Tên kiểu chữ ký nối nét tim vàng, giống thiệp mời và Hero */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontFamily: "Waterfall",
              fontSize: nameSize,
              lineHeight: 1,
              marginTop: to ? 10 : 18,
            }}
          >
            {couple[0].name}
            <svg
              viewBox="0 0 120 50"
              width={nameSize * 1.5}
              height={nameSize * 0.62}
              fill={palette.gold}
              style={{
                margin: `0 ${-nameSize * 0.06}px ${nameSize * 0.16}px`,
              }}
            >
              {HEART_INK.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
            {couple[1].name}
          </div>
          <div
            style={{
              width: 64,
              height: 1,
              background: palette.gold,
              margin: "18px 0 20px",
            }}
          />
          <div
            style={{ fontFamily: "Cormorant", fontSize: 40, letterSpacing: 6 }}
          >
            {formatDotDate(date)}
          </div>
          <div
            style={{
              fontFamily: "Cormorant Italic",
              fontSize: 28,
              color: palette.gold,
              marginTop: 4,
            }}
          >
            {lunar
              ? `${formatWeekday(date)}, ${lunar[0].toLowerCase()}${lunar.slice(1)}, ${lunarYear}`
              : formatWeekday(date)}
          </div>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Cormorant", data: light, weight: 300, style: "normal" },
        // Tên riêng cho bản nghiêng: hai bản cùng tên thì Satori chọn nhầm
        {
          name: "Cormorant Italic",
          data: italic,
          weight: 300,
          style: "normal",
        },
        {
          name: "Waterfall",
          data: waterfall,
          weight: 400,
          style: "normal",
        },
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
