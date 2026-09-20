"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import * as demo from "@/lib/demo/local-store";
import { blankPortfolio } from "@/lib/demo/seed";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

const RESERVED_USERNAMES = new Set([
  "demo", "editor", "login", "signup", "api", "app", "admin", "settings",
  "www", "about", "help", "support", "terms", "privacy", "blog", "docs",
  "pricing", "explore", "search", "static", "assets", "public", "root",
]);

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

export function validateUsername(username: string): string | null {
  const uname = username.trim().toLowerCase();
  if (uname.length < 3) return "Username must be at least 3 characters";
  if (uname.length > 24) return "Username must be under 24 characters";
  if (!/^[a-z0-9_]+$/.test(uname)) return "Only lowercase letters, numbers, and underscores";
  if (RESERVED_USERNAMES.has(uname)) return "That username is reserved";
  return null;
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const uname = username.trim().toLowerCase();
  if (validateUsername(uname)) return false;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return !demo.isUsernameTaken(uname);
  const { data } = await supabase.from("profiles").select("username").eq("username", uname).maybeSingle();
  return !data;
}

export async function signUpReal(opts: {
  email: string;
  password: string;
  username: string;
  displayName: string;
}): Promise<{ status: "signed_in" | "needs_confirmation" }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const uname = opts.username.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: opts.email,
    password: opts.password,
    options: { data: { display_name: opts.displayName } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Sign up failed");

  const portfolio = blankPortfolio(uname, opts.displayName);
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, username: uname, data: portfolio });
  if (profileError) {
    if (profileError.code === "23505") throw new Error("That username was just taken. Try another.");
    throw profileError;
  }

  return { status: data.session ? "signed_in" : "needs_confirmation" };
}

export async function signInReal(opts: { email: string; password: string }) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.auth.signInWithPassword(opts);
  if (error) throw error;
}

export function signUpDemo(opts: { username: string; displayName: string }): AuthUser {
  const uname = opts.username.trim().toLowerCase();
  const err = validateUsername(uname);
  if (err) throw new Error(err);
  if (demo.isUsernameTaken(uname)) throw new Error("That username is taken");
  const session = demo.demoSignUp(uname, opts.displayName, `${uname}@demo.local`);
  return { id: session.username, username: session.username, displayName: session.displayName, email: session.email };
}

export function signInDemo(username: string): AuthUser {
  const session = demo.demoSignIn(username.trim().toLowerCase());
  if (!session) throw new Error("No account with that username. Try signing up.");
  return { id: session.username, username: session.username, displayName: session.displayName, email: session.email };
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    demo.demoSignOut();
    return;
  }
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const session = demo.getDemoSession();
    if (!session) return null;
    return { id: session.username, username: session.username, displayName: session.displayName, email: session.email };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, data")
    .eq("id", user.id)
    .maybeSingle();
  return {
    id: user.id,
    username: profile?.username ?? "",
    displayName: (profile?.data as { displayName?: string } | null)?.displayName ?? "",
    email: user.email ?? "",
  };
}
