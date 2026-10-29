import { MaiBranch } from "@/components/ui/MaiFlower";
import { Monogram } from "@/components/ui/Monogram";
import { coupleName, lunarYear, wedding } from "@/config/wedding";

export default function Footer({ guestName }: { guestName?: string }) {
  return (
    <footer className="lacquer relative isolate overflow-hidden px-5 py-24 text-center">
      <MaiBranch className="absolute -right-10 -bottom-4 -z-10 w-[min(44vw,22rem)] -scale-x-100 opacity-50" />
      <Monogram className="mx-auto size-20" />
      {guestName && (
        <p className="mt-10 font-serif text-3xl font-light italic sm:text-4xl">
          Hẹn gặp {guestName}
        </p>
      )}
      <p className="text-ivory/60 mt-8 text-sm">
        {coupleName}, {lunarYear} 2027
      </p>
      <p className="text-gold mt-1 text-sm">{wedding.hashtag}</p>
    </footer>
  );
}
