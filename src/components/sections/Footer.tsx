import { coupleName, wedding } from "@/config/wedding";

export default function Footer({ guestName }: { guestName?: string }) {
  return (
    <footer className="py-12 text-center">
      {guestName && (
        <p className="font-display mb-3 text-3xl">Hẹn gặp {guestName} nhé! ♥</p>
      )}
      <p className="text-sm opacity-70">
        Made with 💖 by {coupleName} · {wedding.hashtag}
      </p>
    </footer>
  );
}
