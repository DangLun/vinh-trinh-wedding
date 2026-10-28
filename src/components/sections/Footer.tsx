import { coupleName, wedding } from "@/config/wedding";

export default function Footer() {
  return (
    <footer className="py-12 text-center text-sm opacity-70">
      Made with 💖 by {coupleName} · {wedding.hashtag}
    </footer>
  );
}
