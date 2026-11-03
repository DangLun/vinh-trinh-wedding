"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  startTransition,
  useActionState,
  useState,
  useSyncExternalStore,
} from "react";
import type { RsvpState } from "@/app/m/[code]/actions";
import { Section, SectionHeading } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { easeLuxe } from "@/lib/motion";

/** Câu trả lời gần nhất, nhớ trong trình duyệt khách để mở lại link vẫn thấy */
type Stored = {
  attending: boolean;
  events: string[];
};

const CHANGE_EVENT = "rsvp:change";
const storageKey = (code: string) => `vt-rsvp:${code}`;

function readStored(code: string) {
  try {
    return localStorage.getItem(storageKey(code));
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function parse(raw: string | null): Stored | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Stored;
  } catch {
    return null;
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Ô chọn dạng thẻ: viền mực nhạt, chọn rồi thì viền vàng sẫm + nền ngà sáng.
// Không kèm padding vì `cn` không gộp class trùng: mỗi nơi dùng tự thêm padding.
const choice =
  "border-ink/20 has-[:checked]:border-gold-deep has-[:checked]:bg-ivory has-[:focus-visible]:outline-gold flex cursor-pointer items-center gap-3 border transition-colors duration-300 has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 hover:border-ink/40";

export type RsvpEvent = { id: string; title: string; date: string };

/**
 * Hồi âm (RSVP) trên link mời riêng, ghi vào Google Sheet qua Server Action.
 * Mọi chuỗi về khách được chuẩn bị ở server; `action` đã gắn sẵn mã khách.
 */
export default function Rsvp({
  action,
  code,
  name,
  self,
  formal,
  events,
  deadline,
}: {
  action: (prev: RsvpState, formData: FormData) => Promise<RsvpState>;
  code: string;
  /** "Anh Tuấn" */
  name: string;
  /** "tụi em" */
  self: string;
  formal: boolean;
  events: RsvpEvent[];
  /** "31.01.2027" */
  deadline: string;
}) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readStored(code),
    () => null,
  );
  const stored = parse(raw);
  const [editing, setEditing] = useState(false);
  const [going, setGoing] = useState<boolean | null>(null);

  const [state, formAction, pending] = useActionState(
    async (prev: RsvpState, formData: FormData) => {
      const result = await action(prev, formData);
      if (result.status === "saved") {
        const answer: Stored = {
          attending: result.attending,
          events: formData.getAll("events").map(String),
        };
        try {
          localStorage.setItem(storageKey(code), JSON.stringify(answer));
        } catch {
          // Trình duyệt chặn lưu: vẫn hiện lời cảm ơn cho lần này
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
        setEditing(false);
      }
      return result;
    },
    { status: "idle" },
  );

  const answered: Pick<Stored, "attending"> | null =
    state.status === "saved" ? state : stored;
  const showThanks = answered && !editing;
  const Self = capitalize(self);
  // Đang sửa thì điền sẵn câu trả lời cũ
  const prefill = editing ? stored : null;
  const attending = going ?? prefill?.attending ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <Section width="sm" id="hoi-am">
        <SectionHeading className="text-center">Hồi âm</SectionHeading>
        <div className="bg-paper border-gold/60 border p-2">
          <div className="border-gold/40 border px-5 py-10 sm:px-10 sm:py-12">
            <AnimatePresence mode="wait" initial={false}>
              {showThanks ? (
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
                    {answered.attending ? "Hẹn gặp ngày vui!" : "Tiếc quá!"}
                  </p>
                  <p className="text-ink/80 mx-auto mt-4 max-w-sm text-balance">
                    {answered.attending
                      ? `Cảm ơn ${name} đã hồi âm. ${Self} mong gặp ${name} trong ngày vui.`
                      : `Cảm ơn ${name} đã báo cho ${self} biết.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGoing(null);
                      setEditing(true);
                    }}
                    className={button({ className: "mt-8" })}
                  >
                    Sửa câu trả lời
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
                    {formal
                      ? `Kính mong ${name} hồi âm giúp ${self} trước ngày ${deadline}.`
                      : `${name} báo giúp ${self} trước ngày ${deadline} nha.`}
                  </p>

                  <fieldset className="mt-8">
                    <legend className="sr-only">Có đến dự được không</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { value: "yes", label: "Sẽ đến chung vui" },
                        { value: "no", label: "Tiếc quá, không đến được" },
                      ].map((o) => (
                        <label
                          key={o.value}
                          className={cn(choice, "px-4 py-3")}
                        >
                          <input
                            type="radio"
                            name="attending"
                            value={o.value}
                            required
                            defaultChecked={
                              prefill
                                ? prefill.attending === (o.value === "yes")
                                : undefined
                            }
                            onChange={() => setGoing(o.value === "yes")}
                            className="accent-son size-4"
                          />
                          <span className="font-serif text-xl">{o.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {attending && events.length > 1 && (
                    <div className="mt-6 space-y-6">
                      {events.length > 1 && (
                        <fieldset>
                          <legend className="text-ink/70 text-sm">
                            Sẽ đến lễ
                          </legend>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {events.map((e) => (
                              <label
                                key={e.id}
                                className={cn(choice, "px-4 py-3")}
                              >
                                <input
                                  type="checkbox"
                                  name="events"
                                  value={e.id}
                                  defaultChecked={
                                    prefill?.events.length
                                      ? prefill.events.includes(e.id)
                                      : true
                                  }
                                  className="accent-son size-4"
                                />
                                <span>
                                  {e.title}
                                  <span className="figures text-ink/60 ml-2 text-sm">
                                    {e.date}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      )}
                    </div>
                  )}

                  <p
                    aria-live="polite"
                    className="text-son mt-6 min-h-5 text-center text-sm"
                  >
                    {state.status === "error" && state.error}
                  </p>

                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    <button
                      type="submit"
                      disabled={pending}
                      className={button({
                        tone: "son",
                        className: "px-10 disabled:opacity-60",
                      })}
                    >
                      {pending ? "Đang gửi…" : "Gửi hồi âm"}
                    </button>
                    {editing && (
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className={button()}
                      >
                        Giữ như cũ
                      </button>
                    )}
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
