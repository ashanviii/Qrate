"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { getDemoPortfolio } from "@/lib/demo/local-store";
import { PublicCanvas } from "@/components/canvas/public-canvas";
import { PublicPageFooter } from "@/components/public/public-page-footer";
import { NotFoundNotice } from "@/components/public/not-found-notice";
import { themeRootStyle } from "@/lib/theme-css";

// Server-side rendering can't see localStorage, so in local-demo mode
// (no Supabase configured) a non-"demo" username is fetched here instead —
// client-side, in the same browser that created it. This is what makes
// "publish" and "view live" actually work end to end without a backend.
type LookupResult = { status: "found"; portfolio: Portfolio } | { status: "missing" };

export function DemoPublicPage({ username }: { username: string }) {
  const [result, setResult] = useState<LookupResult | null>(null);

  useEffect(() => {
    // Deferred a tick so this reads as an async lookup rather than a
    // synchronous setState-in-effect (localStorage is only available client
    // side, so this can't be computed during the initial render instead).
    const timeout = setTimeout(() => {
      const found = getDemoPortfolio(username);
      setResult(found && found.published ? { status: "found", portfolio: found } : { status: "missing" });
    }, 0);
    return () => clearTimeout(timeout);
  }, [username]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (result.status === "missing") {
    return <NotFoundNotice />;
  }

  const portfolio = result.portfolio;

  return (
    <div
      className={portfolio.theme.background.type === "noise" ? "noise-bg min-h-screen" : "min-h-screen"}
      style={themeRootStyle(portfolio.theme)}
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:py-16">
        <PublicCanvas portfolio={portfolio} />
        <PublicPageFooter portfolio={portfolio} />
      </div>
    </div>
  );
}
