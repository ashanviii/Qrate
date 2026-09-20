"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Portfolio } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";
import { remixPortfolio } from "@/lib/persistence";

export function PublicPageFooter({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();
  const [remixing, setRemixing] = useState(false);

  async function handleRemix() {
    setRemixing(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push(`/signup?remix=${portfolio.username}`);
        return;
      }
      if (user.username === portfolio.username) {
        router.push("/editor");
        return;
      }
      await remixPortfolio(portfolio.username, user);
      toast.success("Remixed! Opening your editor…");
      router.push("/editor");
    } catch {
      toast.error("Couldn't remix this page right now.");
    } finally {
      setRemixing(false);
    }
  }

  return (
    <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm opacity-80" style={{ borderColor: "color-mix(in oklab, var(--bento-primary) 15%, transparent)" }}>
      <Button variant="ghost" size="sm" onClick={handleRemix} disabled={remixing} className="gap-1.5 opacity-90 hover:opacity-100">
        <Shuffle className="h-3.5 w-3.5" />
        Remix this portfolio
      </Button>
      {portfolio.branding && (
        <Link href="/" className="flex items-center gap-1.5 opacity-70 transition-opacity hover:opacity-100">
          <Sparkles className="h-3.5 w-3.5" />
          Made with Bento
        </Link>
      )}
    </footer>
  );
}
