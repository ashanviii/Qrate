"use client";

import type { Portfolio } from "@/lib/types";
import { blankPortfolio, DEMO_PORTFOLIO } from "@/lib/demo/seed";

// A tiny local "backend" so the entire product — signup, editor, persistence,
// publish — works with zero setup. It only runs in the browser and is scoped
// per-browser via localStorage. Swapped out automatically once Supabase env
// vars are present (see lib/persistence.ts).

const SESSION_KEY = "bento:demo-session";
const PORTFOLIOS_KEY = "bento:demo-portfolios";

export interface DemoSession {
  username: string;
  displayName: string;
  email: string;
}

type PortfolioMap = Record<string, Portfolio>;

function readPortfolios(): PortfolioMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PORTFOLIOS_KEY);
    const parsed = raw ? (JSON.parse(raw) as PortfolioMap) : {};
    return { demo: DEMO_PORTFOLIO, ...parsed };
  } catch {
    return { demo: DEMO_PORTFOLIO };
  }
}

function writePortfolios(map: PortfolioMap) {
  window.localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(map));
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

export function isUsernameTaken(username: string): boolean {
  const portfolios = readPortfolios();
  return Boolean(portfolios[username.toLowerCase()]);
}

export function demoSignUp(username: string, displayName: string, email: string): DemoSession {
  const uname = username.toLowerCase();
  const portfolios = readPortfolios();
  if (!portfolios[uname]) {
    portfolios[uname] = blankPortfolio(uname, displayName);
    writePortfolios(portfolios);
  }
  const session: DemoSession = { username: uname, displayName, email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function demoSignIn(username: string): DemoSession | null {
  const uname = username.toLowerCase();
  const portfolios = readPortfolios();
  const portfolio = portfolios[uname];
  if (!portfolio) return null;
  const session: DemoSession = { username: uname, displayName: portfolio.displayName, email: `${uname}@demo.local` };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function demoSignOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getDemoPortfolio(username: string): Portfolio | null {
  const portfolios = readPortfolios();
  return portfolios[username.toLowerCase()] ?? null;
}

export function saveDemoPortfolio(portfolio: Portfolio) {
  const portfolios = readPortfolios();
  portfolios[portfolio.username.toLowerCase()] = { ...portfolio, updatedAt: new Date().toISOString() };
  writePortfolios(portfolios);
}

export function remixDemoPortfolio(sourceUsername: string, intoUsername: string): Portfolio | null {
  const portfolios = readPortfolios();
  const source = portfolios[sourceUsername.toLowerCase()];
  if (!source) return null;
  const remixed: Portfolio = {
    ...source,
    username: intoUsername,
    published: false,
    updatedAt: new Date().toISOString(),
  };
  portfolios[intoUsername.toLowerCase()] = remixed;
  writePortfolios(portfolios);
  return remixed;
}
