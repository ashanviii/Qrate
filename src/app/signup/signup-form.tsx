"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";
import { UsernameField } from "@/components/auth/username-field";
import { isDemoMode, signUpDemo, signUpReal } from "@/lib/auth";
import { remixPortfolio } from "@/lib/persistence";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const remixSource = searchParams.get("remix");
  const demo = isDemoMode();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!available || !username || !displayName) return;
    setLoading(true);
    try {
      let user;
      if (demo) {
        user = signUpDemo({ username, displayName });
      } else {
        if (!email || password.length < 8) {
          toast.error("Enter an email and an 8+ character password");
          setLoading(false);
          return;
        }
        const result = await signUpReal({ email, password, username, displayName });
        if (result.status === "needs_confirmation") {
          setNotice("Check your inbox to confirm your email, then log in.");
          setLoading(false);
          return;
        }
        user = { id: "", username, displayName, email };
      }

      if (remixSource) {
        try {
          await remixPortfolio(remixSource, user);
          toast.success("Account created — your remix is ready!");
        } catch {
          toast.success("Account created!");
        }
      } else {
        toast.success("Account created!");
      }
      router.push("/editor");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (notice) {
    return (
      <AuthShell title="Almost there" subtitle="One more step" footer={null}>
        <p className="text-sm">{notice}</p>
        <Button asChild className="mt-4 w-full">
          <Link href="/login">Go to login</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your Bento"
      subtitle={
        remixSource
          ? `Sign up to save your remix of @${remixSource}`
          : demo
          ? "Local demo mode — no email needed, saved in this browser"
          : "Free forever. Takes about a minute."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="displayName">Your name</Label>
          <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ashan Vi" required />
        </div>
        <UsernameField value={username} onChange={setUsername} onAvailabilityChange={setAvailable} />
        {!demo && (
          <>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </div>
          </>
        )}
        <Button type="submit" className="mt-1 w-full" disabled={loading || !available || !displayName}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
