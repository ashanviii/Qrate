"use client";

// Adapted from shadcnspace.com's "Badge 07 - Success"
// (https://shadcnspace.com/r/badge-07.json), ported to framer-motion
// (already in this project) instead of the `motion` package.
import { motion, type Variants } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LETTER_VARIANTS: Variants = {
  hidden: { y: -14, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.038, duration: 0.35, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

const MotionBadge = motion.create(Badge);

export function SuccessBadge({ label = "Published", className }: { label?: string; className?: string }) {
  return (
    <MotionBadge
      variant="outline"
      className={cn(
        "relative h-auto cursor-default overflow-visible rounded-full",
        "gap-1.5 px-2.5 py-1",
        "bg-background",
        "text-foreground text-xs font-medium leading-none",
        "border-teal-400/25",
        className
      )}
    >
      <motion.span
        aria-hidden
        animate={{ opacity: 0.55 }}
        transition={{ duration: 0.45 }}
        className="pointer-events-none absolute -top-2 left-[10%] right-[10%] h-4 bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(45,212,191,0.95)_0%,transparent_70%)] blur"
      />
      <motion.span
        aria-hidden
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.45 }}
        className="pointer-events-none absolute top-0 left-[28%] right-[28%] h-px bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,rgba(45,212,191,0.95)_0%,transparent_100%)]"
      />
      <motion.span
        initial={{ scale: 0.35, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.32, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="flex h-3.5 w-3.5 shrink-0 items-center justify-center"
      >
        <CheckCircle size={14} strokeWidth={2} className="text-teal-500" />
      </motion.span>
      <span className="inline-flex overflow-hidden leading-none">
        {label.split("").map((char, i) => (
          <motion.span key={i} custom={i} variants={LETTER_VARIANTS} initial="hidden" animate="visible" className="inline-block whitespace-pre">
            {char}
          </motion.span>
        ))}
      </span>
    </MotionBadge>
  );
}
