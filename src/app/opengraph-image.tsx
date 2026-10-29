import { coupleName, wedding } from "@/config/wedding";
import { inviteCard, ogSize } from "@/lib/og";

export const alt = `Thiệp cưới ${coupleName}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return inviteCard({ date: wedding.date });
}
