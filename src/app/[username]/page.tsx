import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPortfolio } from "@/lib/persistence-server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PublicCanvas } from "@/components/canvas/public-canvas";
import { themeRootStyle } from "@/lib/theme-css";
import { PublicPageFooter } from "@/components/public/public-page-footer";
import { DemoPublicPage } from "@/components/public/demo-public-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPublicPortfolio(username);
  if (!portfolio) return { title: "Not found" };

  const title = `${portfolio.displayName} (@${portfolio.username})`;
  const description = portfolio.bio || `Check out ${portfolio.displayName}'s Bento page.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/${portfolio.username}` },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPublicPortfolio(username);

  if (!portfolio) {
    // Local-demo mode: the server can't see localStorage, so hand off to a
    // client component that looks the profile up in this browser instead.
    if (!isSupabaseConfigured()) return <DemoPublicPage username={username} />;
    notFound();
  }

  return (
    <main
      className={portfolio.theme.background.type === "noise" ? "noise-bg min-h-screen" : "min-h-screen"}
      style={themeRootStyle(portfolio.theme)}
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:py-16">
        <PublicCanvas portfolio={portfolio} />
        <PublicPageFooter portfolio={portfolio} />
      </div>
    </main>
  );
}
