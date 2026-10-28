import { Section } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { formatDateTime } from "@/lib/date";

export default function EventInfo() {
  return (
    <Section className="grid gap-6 sm:grid-cols-2">
      {wedding.events.map((e) => (
        <article
          key={e.title}
          className="border-plum rounded-3xl border-2 bg-white/70 p-6"
        >
          <h3 className="font-display text-2xl font-bold">{e.title}</h3>
          <p className="mt-2 first-letter:uppercase">
            {formatDateTime(e.time)}
          </p>
          <p className="mt-2 font-semibold">{e.place}</p>
          <p>{e.address}</p>
          <a
            href={e.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block underline"
          >
            Chỉ đường
          </a>
        </article>
      ))}
    </Section>
  );
}
