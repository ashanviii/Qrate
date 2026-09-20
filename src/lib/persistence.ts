"use client";

import type { Portfolio } from "@/lib/types";
import type { AuthUser } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import * as demo from "@/lib/demo/local-store";
import { blankPortfolio } from "@/lib/demo/seed";

export async function loadMyPortfolio(user: AuthUser): Promise<Portfolio> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return demo.getDemoPortfolio(user.username) ?? blankPortfolio(user.username, user.displayName);
  }
  const { data } = await supabase.from("profiles").select("data").eq("id", user.id).maybeSingle();
  return (data?.data as Portfolio) ?? blankPortfolio(user.username, user.displayName);
}

export async function savePortfolio(user: AuthUser, portfolio: Portfolio) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    demo.saveDemoPortfolio(portfolio);
    return;
  }
  const { error } = await supabase.from("profiles").update({ data: portfolio }).eq("id", user.id);
  if (error) throw error;
}

export async function remixPortfolio(sourceUsername: string, user: AuthUser): Promise<Portfolio> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const remixed = demo.remixDemoPortfolio(sourceUsername, user.username);
    if (!remixed) throw new Error("Original portfolio not found");
    return remixed;
  }
  const { data: source } = await supabase
    .from("profiles")
    .select("data")
    .eq("username", sourceUsername.toLowerCase())
    .maybeSingle();
  if (!source) throw new Error("Original portfolio not found");
  const remixed: Portfolio = {
    ...(source.data as Portfolio),
    username: user.username,
    displayName: user.displayName,
    published: false,
    updatedAt: new Date().toISOString(),
  };
  const { error } = await supabase.from("profiles").update({ data: remixed }).eq("id", user.id);
  if (error) throw error;
  return remixed;
}
