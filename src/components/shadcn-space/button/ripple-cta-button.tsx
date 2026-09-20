"use client";

// Adapted from shadcnspace.com's "Button 16 - Ripple Spotlight"
// (https://shadcnspace.com/r/button-16.json) — a mouse-tracking spotlight
// ripple, recolored to our theme tokens and built on next/link (not a real
// <button>) since it's always used as a navigation CTA.
import { useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export function RippleCtaButton({
  href,
  className,
  children,
  size,
}: { href: string; className?: string; children: React.ReactNode } & VariantProps<typeof buttonVariants>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={handleMouseEnter}
      className={cn(buttonVariants({ size }), "group relative isolate overflow-hidden", className)}
    >
      <span
        className="pointer-events-none absolute h-10 w-10 scale-0 rounded-full bg-background/90 transition-transform duration-700 ease-out group-hover:scale-[15]"
        style={{ left: pos.x - 20, top: pos.y - 20 }}
      />
      <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-500 group-hover:text-foreground">
        {children}
      </span>
    </Link>
  );
}
