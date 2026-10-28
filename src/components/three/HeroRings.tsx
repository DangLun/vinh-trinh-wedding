"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useCan3D } from "@/hooks/useCan3D";
import { useInView } from "@/hooks/useInView";
import { heartBurst } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { StaticRings } from "./StaticRings";

// three.js chỉ tải ở client và chỉ khi máy đủ điều kiện
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** Cặp nhẫn ở Hero: luôn có bản tĩnh, crossfade sang 3D khi cảnh đã sẵn sàng. */
export default function HeroRings() {
  const can3D = useCan3D();
  const [ready, setReady] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>();
  const show3D = can3D && ready;

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-700",
          show3D ? "opacity-0" : "opacity-100",
        )}
      >
        <StaticRings />
      </div>

      {can3D && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            show3D ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroScene
            active={inView}
            onRingsSelect={() => heartBurst()}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      {show3D && (
        <p className="text-plum/70 pointer-events-none absolute inset-x-0 bottom-3 text-center text-sm">
          Chạm vào cặp nhẫn thử xem ✦
        </p>
      )}
    </div>
  );
}
