import Link from "next/link";
import {
  ArrowRight, LayoutGrid, Palette, PawPrint, Shuffle, Sparkles,
  Undo2, MousePointerClick, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { HeroShowcase } from "@/components/marketing/hero-showcase";
import { RippleCtaButton } from "@/components/shadcn-space/button/ripple-cta-button";
import { PRESETS } from "@/lib/presets";
import type { PresetId } from "@/lib/types";

const FEATURES = [
  { icon: LayoutGrid, title: "Drag, drop, resize", body: "A real Bento grid editor — reorder blocks, resize with a click, and see changes instantly." },
  { icon: Palette, title: "Make it yours", body: "Fonts, colors, radius, shadows, spacing, and backgrounds — solid, gradient, image, or noise." },
  { icon: MousePointerClick, title: "Freeform mode", body: "Break out of the grid entirely and place blocks exactly where you want them." },
  { icon: PawPrint, title: "Pixel pets", body: "Drop a tiny animated companion onto your page, just because." },
  { icon: Shuffle, title: "Remix anything", body: "Found a page you love? Remix it into your own account in one click." },
  { icon: Undo2, title: "Never lose a change", body: "Full undo/redo history and autosave while you edit — nothing to hit save on." },
  { icon: Smartphone, title: "Looks great everywhere", body: "Every page is responsive by default, from a 13\" laptop to a phone in portrait." },
  { icon: Sparkles, title: "Publish in one click", body: "Get a clean, shareable URL — bento.app/you — with SEO and social preview cards built in." },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <section className="relative overflow-hidden bg-dot-grid">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6, #fbbf24)" }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-700 ease-out">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3 w-3" /> Your whole internet presence, one page
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                A link-in-bio that actually looks like <span className="italic">you</span>.
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Build a playful, fully custom Bento-grid portfolio in minutes. Drag blocks, pick a vibe, publish — no code required.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <RippleCtaButton href="/signup" size="lg">
                  Start building free <ArrowRight className="h-4 w-4" />
                </RippleCtaButton>
                <Button asChild size="lg" variant="outline">
                  <Link href="/demo">See a live example</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">No credit card. Your page is free forever, with light Bento branding.</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <HeroShowcase />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight">Everything you need, nothing you don&apos;t</h2>
            <p className="mt-3 text-muted-foreground">Bento gives you the pieces — you decide how it all comes together.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                <f.icon className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="presets" className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight">Start from a vibe</h2>
              <p className="mt-3 text-muted-foreground">Seven design presets to start from — every color, font, and shadow stays fully editable after.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.entries(PRESETS) as [PresetId, (typeof PRESETS)[PresetId]][]).map(([id, preset]) => (
                <div key={id} className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className="flex h-28 items-end overflow-hidden p-4"
                    style={{
                      background: preset.theme.background.type === "gradient"
                        ? `linear-gradient(135deg, ${preset.theme.background.gradientFrom}, ${preset.theme.background.gradientTo})`
                        : preset.theme.background.solid,
                    }}
                  >
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium transition-transform duration-300 ease-out group-hover:scale-110"
                      style={{ background: preset.theme.accent, color: "#fff" }}
                    >
                      Aa
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-semibold">{preset.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{preset.blurb}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your page is waiting.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Takes about a minute to set up. Free forever, upgrade never required.</p>
          <RippleCtaButton href="/signup" size="lg" className="mt-8">
            Claim your username <ArrowRight className="h-4 w-4" />
          </RippleCtaButton>
        </section>
      </main>
      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Bento</span>
          <span>Built with Next.js, Supabase, and a little too much affection for grids.</span>
        </div>
      </footer>
    </>
  );
}
