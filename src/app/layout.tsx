import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { FONT_VARIABLES, inter } from "@/lib/fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bento — build a beautiful link-in-bio page in minutes",
    template: "%s · Bento",
  },
  description:
    "A playful, endlessly customizable Bento-grid portfolio builder. Drag, drop, resize, and publish your one-page site in minutes.",
  openGraph: {
    type: "website",
    siteName: "Bento",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${FONT_VARIABLES} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={150}>
            {children}
            <Toaster position="bottom-center" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
