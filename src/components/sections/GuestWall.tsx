import { Section, SectionHeading } from "@/components/ui/Section";
import { sticker } from "@/components/ui/sticker";
import { guests } from "@/data/guests";

export default function GuestWall() {
  return (
    <Section className="text-center">
      <SectionHeading>Khách mời thân yêu</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-3">
        {guests.map((g) => (
          <li
            key={g.slug}
            className={sticker({ shadow: false, className: "px-4 py-2" })}
          >
            {g.name}
          </li>
        ))}
      </ul>
    </Section>
  );
}
