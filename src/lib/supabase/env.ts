// Supabase is optional: without credentials the app runs in local demo mode
// (auth + persistence via the browser, see lib/demo). Once you add real
// credentials (see .env.example) every one of these code paths switches to
// Supabase automatically — no code changes needed.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
