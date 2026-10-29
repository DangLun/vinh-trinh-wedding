import { Section, SectionHeading } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { coupleName, lunarYear, wedding } from "@/config/wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import { cn } from "@/lib/cn";
import { formatDotDate, formatTime, formatWeekday } from "@/lib/date";
import type { WeddingEvent } from "@/types/wedding";

/**
 * Một lễ như tấm thiệp in: nền giấy dó, hai đường chỉ vàng lồng nhau, chữ canh giữa.
 * Nút chính (đỏ son) là chỉ đường vì đó là việc khách cần làm vào đúng ngày.
 */
function EventCard({ event: e }: { event: WeddingEvent }) {
  return (
    <article className="bg-paper border-gold/60 h-full border p-2">
      <div className="border-gold/40 flex h-full flex-col items-center border px-6 py-12 text-center sm:px-10">
        <h3 className="font-serif text-4xl font-light sm:text-5xl">
          {e.title}
        </h3>
        <p className="figures text-gold-deep mt-8 font-serif text-7xl leading-none font-light">
          <time dateTime={e.time}>{formatTime(e.time)}</time>
        </p>
        <p className="mt-5 first-letter:uppercase">
          {formatWeekday(e.time)}, {formatDotDate(e.time)}
        </p>
        {e.lunar && (
          <p className="text-gold-deep mt-1 font-serif text-lg italic">
            {e.lunar}, {lunarYear}
          </p>
        )}

        <span aria-hidden className="bg-gold/60 my-8 h-px w-12" />

        <p className="font-normal">{e.place}</p>
        <p className="text-ink/70 mt-1">{e.address}</p>

        <div className="mt-auto flex flex-wrap justify-center gap-3 pt-10">
          <a
            href={e.mapUrl}
            target="_blank"
            rel="noreferrer"
            className={button({ tone: "son" })}
          >
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
            className={button()}
          >
            Lưu vào lịch
          </a>
        </div>
      </div>
    </article>
  );
}

export default function EventInfo({
  events = wedding.events,
  guestName,
}: {
  /** Chỉ hiện các lễ khách được mời (link mời riêng); mặc định tất cả */
  events?: WeddingEvent[];
  guestName?: string;
}) {
  return (
    <Section width="lg">
      <SectionHeading className="text-center">
        Hẹn {guestName ?? "bạn"} ngày vui
      </SectionHeading>
      <ul
        className={cn(
          "grid gap-8 sm:gap-10",
          // Khách chỉ được mời một lễ: thiệp nằm giữa thay vì lệch trái
          events.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-md",
        )}
      >
        {events.map((e) => (
          <li key={e.id}>
            <EventCard event={e} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
