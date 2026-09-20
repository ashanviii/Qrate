import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dot-grid px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6)" }}
      />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          Bento
        </Link>
        <div className="rounded-3xl border bg-card/90 p-7 shadow-xl backdrop-blur-sm">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </main>
  );
}
