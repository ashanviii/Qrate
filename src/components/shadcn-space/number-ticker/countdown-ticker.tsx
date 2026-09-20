"use client";

// Adapted from shadcnspace.com's "Number Ticker 03 - Countdown Counter"
// (https://shadcnspace.com/r/number-ticker-03.json) — ported to framer-motion
// (already in this project) instead of @number-flow/react, and extended with
// an optional leading days segment since this powers the Countdown block's
// arbitrary future target date, not just a fixed-length timer.
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

function RollingDigit({ char }: { char: string }) {
  return (
    <span className="relative inline-grid h-[1em] w-[0.62em] place-items-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 grid place-items-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Segment({ value, className }: { value: number; className?: string }) {
  const padded = String(Math.max(0, value)).padStart(2, "0");
  return (
    <span className={cn("inline-flex tabular-nums", className)}>
      {padded.split("").map((char, i) => (
        <RollingDigit key={i} char={char} />
      ))}
    </span>
  );
}

export function CountdownTicker({
  seconds,
  showDays = false,
  className,
}: {
  seconds: number;
  showDays?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.floor(seconds));
  const days = Math.floor(clamped / 86400);
  const hours = Math.floor((clamped % 86400) / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      {showDays && days > 0 && (
        <>
          <Segment value={days} />
          <span className="opacity-40">:</span>
        </>
      )}
      <Segment value={hours} />
      <span className="opacity-40">:</span>
      <Segment value={minutes} />
      <span className="opacity-40">:</span>
      <Segment value={secs} />
    </div>
  );
}
