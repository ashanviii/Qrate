"use client";

// Adapted from shadcnspace.com's "Switch 03 - Toggle theme"
// (https://shadcnspace.com/r/switch-03.json), wired to next-themes.
import { useId } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeSwitch({ isDark, onToggle }: { isDark: boolean; onToggle: (dark: boolean) => void }) {
  const id = useId();

  return (
    <div className="group inline-flex items-center gap-1.5">
      <span
        id={`${id}-light`}
        className={cn("cursor-pointer text-muted-foreground transition-colors", !isDark && "text-foreground")}
        onClick={() => onToggle(false)}
      >
        <SunIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={isDark}
        onCheckedChange={onToggle}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-dark`}
        className={cn("cursor-pointer text-muted-foreground transition-colors", isDark && "text-foreground")}
        onClick={() => onToggle(true)}
      >
        <MoonIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </div>
  );
}
