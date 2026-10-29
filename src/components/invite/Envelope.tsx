"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { button } from "@/components/ui/button";
import { HeartLine, SignatureNames } from "@/components/ui/SignatureNames";
import { palette } from "@/config/theme";
import { couple, wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { INTRO_ID, markIntroOpen } from "@/lib/intro";
import { easeLuxe } from "@/lib/motion";

/**
 * cover: mặt trước "Save the date" · flip: đang xoay sang mặt sau ·
 * open: mặt sau (bìa kẹp) mở nắp · letter: thiệp đỏ rượu bên trong · closed: vào trang cưới
 */
type Phase = "cover" | "flip" | "open" | "letter" | "closed";

export type InviteEvent = {
  title: string;
  place: string;
  address: string;
  /** "08:00, Chủ Nhật 14.02.2027" */
  when: string;
  /** "08 giờ 00 phút" */
  clock: string;
  /** "Chủ Nhật, ngày 14 tháng 02 năm 2027" */
  day: string;
  /** "Nhằm mùng 9 tháng Giêng năm Đinh Mùi" */
  lunar?: string;
};

export type EnvelopeProps = {
  /** Người nhận, đã ghép người đi cùng: "Cô Ba và gia đình" */
  to: string;
  /** "Tụi con trân trọng kính mời" */
  verb: string;
  note?: string;
  /** Các lễ khách được mời, đã định dạng sẵn ở server */
  events: InviteEvent[];
  /** Ngày lễ đầu tiên khách được mời: "13.02.2027" */
  date: string;
};

const curtain = [0.76, 0, 0.24, 1] as const;
// Lật thiệp bằng tay: tăng tốc từ từ, hãm từ từ
const turn = [0.65, 0, 0.35, 1] as const;
// Vật rơi: chậm lúc đầu rồi nhanh dần như có trọng lực
const gravity = [0.5, 0, 0.75, 0] as const;
// Nắp giấy: nhấc lên chậm, qua điểm đứng thì đổ xuống nhanh rồi nằm êm
const flapEase = [0.45, 0, 0.2, 1] as const;

const SHADOW = "0 24px 60px -24px rgba(0,0,0,0.75)";
const NO_SHADOW = "0 24px 60px -24px rgba(0,0,0,0)";
const paper = "shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]";

/** Chữ in hoa nhỏ giãn rộng, như dòng "TRÂN TRỌNG KÍNH MỜI" trên thiệp giấy */
function Caps({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[0.7rem] tracking-[0.24em] uppercase", className)}>
      {children}
    </p>
  );
}

/** Tấm thiệp phụ in ngày xếp dọc "14 / 02 / 27", nằm chéo sau thiệp chính và ló ra một góc */
function DateCard({ date, hidden }: { date: string; hidden: boolean }) {
  const [day, month, year] = date.split(".");
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, rotate: 0, x: -40 }}
      animate={
        hidden
          ? { opacity: 0, rotate: 0, x: -40 }
          : { opacity: 1, rotate: 7, x: 0 }
      }
      transition={{
        duration: hidden ? 0.5 : 1.4,
        ease: easeLuxe,
        delay: hidden ? 0 : 0.5,
      }}
      className={cn(
        "bg-linen text-wine absolute -top-8 -right-3 flex w-24 flex-col items-center py-4 font-serif text-4xl leading-[0.95] font-medium sm:-top-6 sm:-right-20 sm:w-32 sm:py-6 sm:text-6xl",
        paper,
      )}
    >
      <span>{day}</span>
      <span>{month}</span>
      <span>{year.slice(2)}</span>
    </motion.div>
  );
}

/**
 * Mặt trước (theo mẫu thiệp giấy): "Save The Date", tên kiểu chữ ký nối nhau bằng nét tim
 * (tự vẽ ra), ngày, rồi "Trân trọng kính mời" + tên khách.
 */
function Cover({ to, date }: Pick<EnvelopeProps, "to" | "date">) {
  return (
    <>
      <p className="text-stone flex items-baseline justify-center gap-2 text-base tracking-[0.3em] sm:gap-3 sm:text-xl">
        <span>SAVE</span>
        <span className="font-signature text-wine/80 -mx-1 text-5xl leading-none tracking-normal sm:text-6xl">
          The
        </span>
        <span>DATE</span>
      </p>

      <h2 className="mt-8 text-[clamp(2.5rem,10vw,3.75rem)]">
        <SignatureNames draw delay={0.9} />
      </h2>

      <p className="figures mt-6 font-serif text-xl tracking-[0.28em] sm:text-2xl">
        {date}
      </p>

      <Caps className="text-ink mt-12 font-medium">Trân trọng kính mời</Caps>
      <p className="mt-2 font-serif text-2xl italic sm:text-3xl">{to}</p>
    </>
  );
}

/** Nơ ruy băng đỏ rượu, buộc ở mũi nắp bìa (khung 64×40, nút nơ ở giữa) */
function Bow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden>
      <g fill={palette.wine}>
        {/* Hai cánh nơ */}
        <path d="M32 18 C24 6 8 0 4 8 C0 16 10 26 32 22 Z" />
        <path d="M32 18 C40 6 56 0 60 8 C64 16 54 26 32 22 Z" />
        {/* Hai đuôi ruy băng */}
        <path d="M30 22 L20 38 L25 37 L28 40 L33 23 Z" />
        <path d="M34 22 L44 38 L39 37 L36 40 L31 23 Z" />
        <rect x={28} y={15} width={8} height={9} rx={2.5} />
      </g>
      {/* Nếp gấp sáng trên cánh nơ */}
      <g
        fill="none"
        stroke={palette.linen}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      >
        <path d="M28 17 C22 10 12 6 8 9" />
        <path d="M36 17 C42 10 52 6 56 9" />
      </g>
    </svg>
  );
}

// Bìa gấp hai cánh khép kín thiệp (toạ độ %): nắp chéo bên phải, mũi nhọn chĩa sang trái ở
// khoảng 38% bề ngang; cánh trái là phần còn lại, lấn nhẹ vào dưới nắp để đường ghép không hở.
const FLAP = "polygon(64% 0, 100% 0, 100% 100%, 76% 100%, 38% 55%)";
const PANEL = "polygon(0 0, 65.5% 0, 39.5% 55%, 77.5% 100%, 0 100%)";

/**
 * Một cánh bìa giấy ngà, bản lề ở mép `hinge`. `open` true thì lật về phía người xem quanh
 * bản lề và nằm sang bên đó. Không dùng preserve-3d để tránh lỗi xếp lớp 3D trên trình duyệt.
 */
function Leaf({
  shape,
  hinge,
  open,
  delay,
  onOpened,
  className,
}: {
  shape: string;
  hinge: "left" | "right";
  open: boolean;
  delay: number;
  onOpened?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "absolute inset-0",
        hinge === "left" ? "origin-left" : "origin-right",
        className,
      )}
      style={{ transformPerspective: 1600 }}
      initial={false}
      // Bản lề phải: góc dương đưa mép trái về phía người xem; bản lề trái thì ngược lại
      animate={{ rotateY: open ? (hinge === "right" ? 178 : -178) : 0 }}
      transition={{ duration: 1.2, ease: flapEase, delay }}
      onAnimationComplete={() => open && onOpened?.()}
    >
      <div className="bg-linen size-full" style={{ clipPath: shape }} />
    </motion.div>
  );
}

/**
 * Bìa kẹp phủ kín thiệp đỏ: cánh trái, nắp chéo bên phải đè lên, nơ buộc ở mũi nắp.
 * Mở: nơ bị kéo nhẹ rồi tuột rơi, nắp phải lật mở trước, cánh trái lật theo sau.
 */
function Folder({ open, onOpened }: { open: boolean; onOpened: () => void }) {
  return (
    <>
      <Leaf
        shape={PANEL}
        hinge="left"
        open={open}
        delay={1.05}
        onOpened={onOpened}
      />
      <Leaf
        shape={FLAP}
        hinge="right"
        open={open}
        delay={0.8}
        // Bóng nắp đổ lên cánh trái ở đường ghép chéo
        className="drop-shadow-[-5px_3px_6px_rgba(0,0,0,0.16)]"
      />
      <motion.div
        className="absolute top-[55%] left-[38%] w-20 -translate-x-1/2 -translate-y-1/2 sm:w-24"
        initial={false}
        animate={
          open
            ? {
                scale: [1, 1.12, 0.92],
                y: [0, -6, 110],
                rotate: [0, -8, 32],
                opacity: [1, 1, 0],
              }
            : { scale: 1, y: 0, rotate: 0, opacity: 1 }
        }
        transition={{
          duration: 0.8,
          times: [0, 0.3, 1],
          ease: ["easeOut", gravity],
          delay: 0.2,
        }}
      >
        <Bow className="w-full" />
      </motion.div>
    </>
  );
}

/**
 * Một họ đứng tên trên thiệp: "NHÀ GÁI", rồi từng phụ huynh (chữ "Ông/Bà" viết tay nhỏ,
 * họ tên in hoa), địa chỉ nghiêng bên dưới
 */
function FamilyBlock({
  label,
  family,
}: {
  label: string;
  family: (typeof wedding.families)["bride"];
}) {
  return (
    <div>
      <Caps className="text-linen/75 text-[0.6rem] sm:text-[0.65rem]">
        {label}
      </Caps>
      <div className="mt-1.5 space-y-0.5">
        {family.parents.map((p) => {
          const [title, ...name] = p.split(" ");
          return (
            <p
              key={p}
              className="text-[0.7rem] font-medium tracking-[0.06em] text-balance uppercase sm:text-sm"
            >
              <span className="font-signature mr-1 align-[-0.12em] text-[1.6em] font-normal tracking-normal normal-case">
                {title}
              </span>
              {name.join(" ")}
            </p>
          );
        })}
      </div>
      <p className="text-linen/70 mt-3 text-xs italic">{family.address}</p>
    </div>
  );
}

/**
 * Thiệp đỏ rượu bên trong, bố cục theo thiệp giấy mẫu: hai họ đứng tên hai cột, báo tin lễ,
 * tên cô dâu chú rể kiểu chữ ký kẹp dòng thứ bậc, nơi cử hành, giờ, ngày dương + âm.
 * `out` true khi thiệp đã được rút khỏi bìa: nhích lên phía người xem và đổ bóng riêng.
 */
function LetterCard({ events, out }: { events: InviteEvent[]; out: boolean }) {
  const [main] = events;
  const [first, second] = couple;
  return (
    <motion.article
      initial={false}
      animate={{
        scale: out ? 1 : 0.985,
        boxShadow: out ? SHADOW : NO_SHADOW,
      }}
      transition={{ duration: 0.8, ease: easeLuxe, delay: 0.1 }}
      // Tỉ lệ dọc 5:7 như thiệp giấy; nội dung dài hơn thì thiệp tự cao thêm
      className="bg-wine text-linen relative flex min-h-[min(121vw,39.5rem)] flex-col justify-between gap-7 px-5 py-9 text-center font-serif sm:px-9 sm:py-11"
    >
      <div className="grid grid-cols-2 gap-3">
        <FamilyBlock label="Nhà gái" family={wedding.families.bride} />
        <FamilyBlock label="Nhà trai" family={wedding.families.groom} />
      </div>

      <div>
        <Caps className="text-[0.65rem] sm:text-xs">Trân trọng báo tin</Caps>
        <p className="mt-1 text-sm font-medium tracking-[0.1em] uppercase sm:text-base">
          {main.title} của con chúng tôi
        </p>
      </div>

      <div className="font-signature text-[clamp(2.25rem,10vw,3.25rem)] leading-[1.15]">
        <p>{first.fullName}</p>
        <div className="text-linen/80 my-0.5 flex items-center justify-center gap-2 font-serif text-xs italic">
          <span className="w-20 text-right">{first.rank}</span>
          <HeartLine className="h-5 w-14 shrink-0" />
          <span className="w-20 text-left">{second.rank}</span>
        </div>
        <p>{second.fullName}</p>
      </div>

      <div>
        <Caps className="text-[0.65rem] sm:text-xs">
          Hôn lễ được cử hành tại
        </Caps>
        <p className="mt-1 text-base font-medium tracking-[0.1em] uppercase sm:text-lg">
          {main.place}
        </p>
      </div>

      <div>
        <p className="text-xs tracking-[0.12em] uppercase sm:text-sm">
          Vào lúc: <span className="font-medium">{main.clock}</span>
        </p>
        <p className="figures mt-1.5 text-[0.95rem] tracking-[0.05em] text-balance uppercase sm:text-lg">
          {main.day}
        </p>
        {main.lunar && (
          <p className="text-linen/70 mt-1 text-xs italic">({main.lunar})</p>
        )}
      </div>
    </motion.article>
  );
}

/** Lời mời riêng cho khách và nút vào trang, nằm dưới thiệp như mảnh giấy viết tay kèm theo */
function Invitation({
  to,
  verb,
  note,
  events,
  onEnter,
}: Pick<EnvelopeProps, "to" | "verb" | "note" | "events"> & {
  onEnter: () => void;
}) {
  const rest = events.slice(1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeLuxe, delay: 0.7 }}
      className="text-ivory mt-10 flex max-w-sm flex-col items-center text-center"
    >
      {rest.length > 0 && (
        <ul className="text-ivory/60 mb-6 space-y-1 text-sm">
          {rest.map((e) => (
            <li key={e.title}>
              {e.title}: {e.when}
            </li>
          ))}
        </ul>
      )}
      <Caps className="text-ivory/60">{verb}</Caps>
      <p className="mt-2 font-serif text-2xl italic sm:text-3xl">{to}</p>
      {note && (
        <p className="text-ivory/70 mt-4 font-serif text-lg italic">“{note}”</p>
      )}
      <button
        type="button"
        autoFocus
        onClick={onEnter}
        className={button({ tone: "linen", className: "mt-8 px-10" })}
      >
        Vào xem thiệp
      </button>
    </motion.div>
  );
}

/**
 * Màn mở đầu của link mời riêng, theo mẫu thiệp giấy. Từ đầu tới cuối là MỘT tấm thiệp:
 * mặt trước "Save the date"; chạm thì thiệp được nhấc lên, lật quanh trục dọc sang mặt sau
 * (bìa kẹp ngà, thiệp đỏ nằm bên trong, nắp chéo buộc nơ) rồi đặt xuống; nơ bị kéo tuột rơi,
 * nắp lật mở; bìa rơi khỏi tay, còn lại thiệp đỏ ngay tại chỗ, lời mời riêng hiện bên dưới.
 * Giảm chuyển động: chạm là tới thiệp đỏ, không lật.
 * Chỉ nhận chuỗi đã chuẩn bị ở server, không nhập danh sách khách để danh sách
 * không lọt vào JavaScript gửi xuống trình duyệt.
 */
export default function Envelope(props: EnvelopeProps) {
  const still = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("cover");

  // Khoá cuộn trang phía sau khi thiệp còn mở
  useEffect(() => {
    if (phase === "closed") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [phase]);

  const flipped = phase !== "cover";
  const opening = phase === "open" || phase === "letter";
  const out = phase === "letter";
  // Bìa và nắp rơi khỏi tay sau khi thiệp đỏ được rút ra
  const drop = {
    initial: false,
    animate: out ? { opacity: 0, y: 64 } : { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: gravity, delay: 0.15 },
  } as const;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {phase !== "closed" && (
          <motion.div
            key="invite"
            // Mang id của màn mở đầu: Hero thấy lớp này còn thì chờ, chưa chạy hiệu ứng xuất hiện
            id={INTRO_ID}
            role="dialog"
            aria-modal
            aria-label={`Thiệp mời gửi ${props.to}`}
            // Lenis bỏ qua thao tác cuộn bên trong lớp này
            data-lenis-prevent
            exit={{ opacity: 0, transition: { duration: 1, ease: curtain } }}
            // flex + m-auto ở con: thiệp dài hơn màn hình vẫn cuộn được tới mép trên
            className="lacquer fixed inset-0 isolate z-[60] flex overflow-x-hidden overflow-y-auto p-4 py-12"
          >
            {/* layout: lời mời hiện thêm bên dưới thì cả khối dời lên êm, không giật */}
            <motion.div
              layout="position"
              className="m-auto flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: easeLuxe }}
                className="relative w-[min(92vw,30rem)]"
                style={{ perspective: 2000 }}
              >
                <DateCard date={props.date} hidden={flipped} />

                {/* Tấm thiệp: nhấc lên, lật 180°, đặt xuống */}
                <motion.div
                  className="relative [transform-style:preserve-3d]"
                  initial={false}
                  animate={
                    flipped
                      ? { rotateY: 180, scale: [1, 1.05, 1], y: [0, -18, 0] }
                      : { rotateY: 0, scale: 1, y: 0 }
                  }
                  transition={{
                    rotateY: { duration: 1.2, ease: turn },
                    scale: { duration: 1.2, ease: "easeInOut" },
                    y: { duration: 1.2, ease: "easeInOut" },
                  }}
                  onAnimationComplete={() =>
                    phase === "flip" && setPhase("open")
                  }
                >
                  {/* Mặt trước là nút: cả tấm thiệp bấm được */}
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setPhase(still ? "letter" : "flip")}
                    aria-label="Mở thiệp mời"
                    disabled={flipped}
                    inert={flipped}
                    className={cn(
                      "bg-linen text-wine absolute inset-0 flex cursor-pointer flex-col items-center justify-center px-6 text-center [backface-visibility:hidden] sm:px-10",
                      paper,
                    )}
                  >
                    <Cover to={props.to} date={props.date} />
                  </button>

                  {/* Mặt sau: bìa kẹp, thiệp đỏ nằm trong. Khối này quyết định kích thước cả tấm thiệp */}
                  <div
                    inert={!flipped}
                    className="relative [transform:rotateY(180deg)] p-[3%] [backface-visibility:hidden]"
                  >
                    <motion.div
                      {...drop}
                      aria-hidden
                      className={cn("bg-linen absolute inset-0", paper)}
                    />
                    <LetterCard events={props.events} out={out} />
                    <motion.div
                      {...drop}
                      className="pointer-events-none absolute inset-0"
                    >
                      <Folder
                        open={opening}
                        onOpened={() => setPhase("letter")}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {out ? (
                <Invitation
                  to={props.to}
                  verb={props.verb}
                  note={props.note}
                  events={props.events}
                  onEnter={() => {
                    // Hero bắt đầu xuất hiện ngay lúc thiệp mờ đi, như khi cửa sơn mài mở ở trang chung
                    markIntroOpen();
                    setPhase("closed");
                  }}
                />
              ) : (
                <motion.p
                  className="text-ivory/55 mt-8 text-center text-sm"
                  animate={{ opacity: phase === "cover" ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Chạm vào thiệp để mở
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
