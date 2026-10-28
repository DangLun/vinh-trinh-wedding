import { wedding } from "@/config/wedding";

// TODO: animation chạy ngang
export default function Marquee() {
  return (
    <div className="border-plum bg-butter font-display overflow-hidden border-y-2 py-3 font-bold whitespace-nowrap">
      {wedding.marquee.join(" ✦ ")}
    </div>
  );
}
