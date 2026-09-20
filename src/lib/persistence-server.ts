import type { Portfolio } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_PORTFOLIO } from "@/lib/demo/seed";

// Server-side read for public /[username] pages and OG image generation.
// In local-demo mode (no Supabase configured) only the bundled "demo"
// profile is servable, since real accounts only live in each visitor's
// own browser storage.
export async function getPublicPortfolio(username: string): Promise<Portfolio | null> {
  const uname = username.toLowerCase();
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return uname === "demo" ? DEMO_PORTFOLIO : null;
  }
  const { data } = await supabase.from("profiles").select("data").eq("username", uname).maybeSingle();
  const portfolio = data?.data as Portfolio | undefined;
  if (!portfolio || !portfolio.published) return null;
  return portfolio;
}
