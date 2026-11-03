"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { startTransition, useActionState, useState } from "react";
import type { WishState } from "@/app/actions";
import { Section, SectionHeading } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { coupleName } from "@/config/wedding";
import { easeLuxe } from "@/lib/motion";

const field =
  "border-ink/20 focus:border-gold-deep mt-2 block w-full border bg-transparent px-3 py-2 outline-none";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Gửi lời chúc. Chỉ ghi vào Google Sheet, không hiện lên trang.
 * Có `guest` (link riêng) thì không hỏi tên: server lấy tên theo mã khách đã gắn vào `action`.
 */
export default function Wishes({
  action,
  guest,
}: {
  action: (prev: WishState, formData: FormData) => Promise<WishState>;
  /** name: "Anh Tuấn", self: "tụi em" */
  guest?: { name: string; self: string; formal: boolean };
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: "idle",
  });
  // Bấm "Viết thêm" thì ẩn lời cảm ơn của lần gửi này
  const [dismissed, setDismissed] = useState<number | null>(null);
  const sent = state.status === "sent" && state.id !== dismissed ? state : null;

  return (
    <MotionConfig reducedMotion="user">
      <Section width="sm" id="loi-chuc">
        <SectionHeading className="text-center">Lời chúc</SectionHeading>
        <div className="bg-paper border-gold/60 border p-2">
          <div className="border-gold/40 border px-5 py-10 sm:px-10 sm:py-12">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: easeLuxe }}
                  className="text-center"
                  aria-live="polite"
                >
                  <p className="font-serif text-3xl font-light sm:text-4xl">
                    Đã gửi lời chúc
                  </p>
                  <p className="text-ink/80 mx-auto mt-4 max-w-sm text-balance">
                    {guest
                      ? `${capitalize(guest.self)} đã nhận được lời chúc của ${guest.name}. Cảm ơn ${guest.name} nhiều!`
                      : `${coupleName} đã nhận được lời chúc của ${sent.name}. Cảm ơn bạn nhiều!`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDismissed(sent.id)}
                    className={button({ className: "mt-8" })}
                  >
                    Viết thêm lời chúc
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  // Gửi qua onSubmit thay vì action={…}: React tự xoá trắng form sau mỗi
                  // lần gửi, kể cả khi lỗi, khách sẽ mất chữ đã gõ
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    startTransition(() => formAction(data));
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: easeLuxe }}
                >
                  <p className="text-ink/80 text-center text-balance">
                    {guest
                      ? guest.formal
                        ? `Kính mong ${guest.name} gửi đôi lời chúc cho ${guest.self}.`
                        : `${guest.name} gửi đôi lời chúc cho ${guest.self} nha.`
                      : `Gửi đôi lời chúc đến ${coupleName}.`}{" "}
                    Lời chúc được gửi riêng, không hiện lên trang.
                  </p>

                  {!guest && (
                    <label className="mt-8 block">
                      <span className="text-ink/70 text-sm">Tên của bạn</span>
                      <input
                        name="name"
                        required
                        maxLength={60}
                        autoComplete="name"
                        // Gửi thêm lời chúc thì giữ tên đã gõ lần trước
                        defaultValue={
                          state.status === "sent" ? state.name : undefined
                        }
                        className={field}
                      />
                    </label>
                  )}

                  <label className={guest ? "mt-8 block" : "mt-6 block"}>
                    <span className="text-ink/70 text-sm">Lời chúc</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      maxLength={1000}
                      className={`${field} resize-y`}
                    />
                  </label>

                  {/* Ô bẫy bot: ẩn với người dùng và trình đọc màn hình */}
                  <div
                    aria-hidden
                    className="absolute -left-[9999px] size-px overflow-hidden"
                  >
                    <label>
                      Website
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <p
                    aria-live="polite"
                    className="text-son mt-4 min-h-5 text-center text-sm"
                  >
                    {state.status === "error" && state.error}
                  </p>

                  <div className="mt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={pending}
                      className={button({
                        tone: "son",
                        className: "px-10 disabled:opacity-60",
                      })}
                    >
                      {pending ? "Đang gửi…" : "Gửi lời chúc"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>
    </MotionConfig>
  );
}
