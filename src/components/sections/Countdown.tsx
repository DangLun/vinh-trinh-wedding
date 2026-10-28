"use client";

import { Section } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import type { TimeLeft } from "@/lib/date";

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "ngày" },
  { key: "hours", label: "giờ" },
  { key: "minutes", label: "phút" },
  { key: "seconds", label: "giây" },
];

export default function Countdown() {
  const left = useCountdown(wedding.date);

  return (
    <Section className="flex justify-center gap-6">
      {left &&
        units.map(({ key, label }) => (
          <div key={key} className="text-center">
            <div className="font-display text-4xl font-bold tabular-nums">
              {left[key]}
            </div>
            <div className="text-sm">{label}</div>
          </div>
        ))}
    </Section>
  );
}
