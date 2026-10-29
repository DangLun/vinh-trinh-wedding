import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";

// TODO: GSAP ScrollTrigger timeline
export default function LoveStory() {
  return (
    <Section width="sm">
      <SectionHeading>Chuyện tình mình</SectionHeading>
      <ol className="space-y-6">
        {wedding.loveStory.map((s) => (
          <li key={s.date}>
            <p className="text-sm font-semibold">{s.date}</p>
            <h3 className="font-display text-xl">{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
