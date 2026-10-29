import { Section, SectionHeading } from "@/components/ui/Section";
import { sticker } from "@/components/ui/sticker";
import { Ticket } from "@/components/ui/Ticket";
import { palette } from "@/config/theme";
import { coupleName, wedding } from "@/config/wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import { cn } from "@/lib/cn";
import { formatDotDate, formatTime, formatWeekday } from "@/lib/date";

// Mỗi vé một tông, xoay vòng nếu có nhiều sự kiện hơn
const looks = [
  {
    surface: `linear-gradient(160deg, ${palette.cream}, ${palette.blush})`,
    tilt: "sm:-rotate-[1.2deg]",
  },
  {
    surface: `linear-gradient(160deg, ${palette.mist}, ${palette.ice})`,
    tilt: "sm:rotate-[1.2deg]",
  },
];

const action =
  "inline-flex min-h-11 items-center gap-2 px-4 text-sm font-semibold transition-transform active:translate-y-px";

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export default function EventInfo() {
  return (
    <Section width="lg">
      <SectionHeading>Hẹn bạn ngày vui</SectionHeading>
      <ul className="grid gap-10 sm:grid-cols-2 sm:gap-x-14">
        {wedding.events.map((e, i) => {
          const look = looks[i % looks.length];
          return (
            <li key={e.title}>
              <Ticket
                surface={look.surface}
                className={cn(
                  "transition-transform duration-300 hover:rotate-0",
                  look.tilt,
                )}
                stub={
                  <>
                    <a
                      href={e.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={sticker({ tone: "butter", className: action })}
                    >
                      <PinIcon />
                      Chỉ đường
                    </a>
                    <a
                      href={googleCalendarUrl({
                        title: `${e.title} ${coupleName}`,
                        start: e.time,
                        end: e.endTime,
                        location: `${e.place}, ${e.address}`,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className={sticker({ shadow: false, className: action })}
                    >
                      <CalendarIcon />
                      Lưu vào lịch
                    </a>
                  </>
                }
              >
                <article>
                  <h3 className="font-display text-2xl sm:text-3xl">
                    {e.title}
                  </h3>
                  <p className="font-numeric y2k-type mt-3 text-6xl leading-none font-black tabular-nums sm:text-7xl">
                    <time dateTime={e.time}>{formatTime(e.time)}</time>
                  </p>
                  <p className="mt-3 font-semibold first-letter:uppercase">
                    {formatWeekday(e.time)}, {formatDotDate(e.time)}
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold">{e.place}</p>
                    <p className="text-plum/75">{e.address}</p>
                  </div>
                </article>
              </Ticket>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
