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
import { isDemoMode, signInDemo, signInReal } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/editor";
  const demo = isDemoMode();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (demo) {
        signInDemo(username);
      } else {
        await signInReal({ email, password });
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle={demo ? "Local demo mode — enter the username you signed up with" : "Log in to keep editing your page"}
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        {demo ? (
          <div className="grid gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" required />
          </div>
        ) : (
          <>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </>
        )}
        <Button type="submit" className="mt-1 w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
