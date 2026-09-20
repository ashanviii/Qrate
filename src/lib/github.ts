"use client";

import { useEffect, useState } from "react";

export interface GithubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
}

// Module-level cache so switching blocks, or two blocks pointing at the
// same handle, don't each re-fetch — GitHub's unauthenticated API is
// rate-limited per visitor IP, so we spend that budget carefully.
const cache = new Map<string, GithubUser | null>();
const inflight = new Map<string, Promise<GithubUser | null>>();

async function fetchGithubUser(handle: string): Promise<GithubUser | null> {
  const cached = cache.get(handle);
  if (cached !== undefined) return cached;
  const pending = inflight.get(handle);
  if (pending) return pending;

  const promise = fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((json) =>
      json
        ? {
            login: json.login as string,
            name: (json.name as string | null) ?? null,
            avatarUrl: json.avatar_url as string,
            publicRepos: (json.public_repos as number) ?? 0,
            followers: (json.followers as number) ?? 0,
          }
        : null
    )
    .catch(() => null)
    .then((user) => {
      cache.set(handle, user);
      inflight.delete(handle);
      return user;
    });

  inflight.set(handle, promise);
  return promise;
}

function cachedUserFor(handle: string | null): GithubUser | null | undefined {
  if (!handle) return null;
  return cache.has(handle) ? cache.get(handle) : undefined;
}

// undefined = still loading, null = no such user / request failed.
export function useGithubUser(handle: string | null): GithubUser | null | undefined {
  const [state, setState] = useState<{ handle: string | null; user: GithubUser | null | undefined }>(
    () => ({ handle, user: cachedUserFor(handle) })
  );

  // The handle can change between renders (a different block, an edited
  // URL) — resolve the synchronous cases (no handle, already cached)
  // immediately during render rather than waiting a tick for an effect.
  if (state.handle !== handle) {
    setState({ handle, user: cachedUserFor(handle) });
  }

  useEffect(() => {
    if (!handle || cache.has(handle)) return;
    let cancelled = false;
    fetchGithubUser(handle).then((result) => {
      if (!cancelled) {
        setState((prev) => (prev.handle === handle ? { handle, user: result } : prev));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return state.user;
}
