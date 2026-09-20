"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import type { CountdownBlockData } from "@/lib/types";
import { CountdownTicker } from "@/components/shadcn-space/number-ticker/countdown-ticker";

export function CountdownBlockView({ data }: { data: CountdownBlockData }) {
  const target = Date.parse(data.targetDate);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.round((target - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (Number.isNaN(target)) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-4 text-center text-xs opacity-40">
        <Timer className="h-5 w-5" />
        Set a target date
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
      {data.label && <div className="text-xs font-medium uppercase tracking-wide opacity-50">{data.label}</div>}
      {secondsLeft === 0 ? (
        <div className="text-lg font-semibold" style={{ fontFamily: "var(--bento-font-heading)" }}>
          🎉 It&apos;s time!
        </div>
      ) : (
        <CountdownTicker
          seconds={secondsLeft ?? Math.max(0, Math.round((target - Date.now()) / 1000))}
          showDays
          className="text-3xl font-semibold sm:text-4xl"
        />
      )}
    </div>
  );
}
