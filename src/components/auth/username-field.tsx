"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkUsernameAvailable, validateUsername } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function UsernameField({
  value,
  onChange,
  onAvailabilityChange,
}: {
  value: string;
  onChange: (v: string) => void;
  onAvailabilityChange?: (available: boolean) => void;
}) {
  const [result, setResult] = useState<{ uname: string; available: boolean } | null>(null);
  const onAvailabilityChangeRef = useRef(onAvailabilityChange);

  useEffect(() => {
    onAvailabilityChangeRef.current = onAvailabilityChange;
  }, [onAvailabilityChange]);

  const uname = value.trim().toLowerCase();
  const invalidReason = uname ? validateUsername(uname) : null;

  useEffect(() => {
    if (!uname || validateUsername(uname)) return;
    const timeout = setTimeout(async () => {
      const available = await checkUsernameAvailable(uname);
      setResult({ uname, available });
      onAvailabilityChangeRef.current?.(available);
    }, 350);
    return () => clearTimeout(timeout);
  }, [uname]);

  const status: "idle" | "checking" | "available" | "taken" | "invalid" = !uname
    ? "idle"
    : invalidReason
    ? "invalid"
    : result && result.uname === uname
    ? result.available
      ? "available"
      : "taken"
    : "checking";

  return (
    <div className="grid gap-1.5">
      <Label htmlFor="username">Username</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          bento.app/
        </span>
        <Input
          id="username"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          placeholder="yourname"
          className="pl-[4.9rem] pr-9"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {status === "available" && <Check className="h-4 w-4 text-emerald-500" />}
          {(status === "taken" || status === "invalid") && <X className="h-4 w-4 text-destructive" />}
        </div>
      </div>
      <p className={cn("text-xs", status === "taken" || status === "invalid" ? "text-destructive" : "text-muted-foreground")}>
        {status === "taken" && "That username is taken"}
        {status === "invalid" && (invalidReason || "Invalid username")}
        {status === "available" && "Available!"}
        {status === "idle" && "Lowercase letters, numbers, underscores — 3 to 24 characters"}
        {status === "checking" && "Checking availability…"}
      </p>
    </div>
  );
}
