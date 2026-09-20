"use client";

import { useState } from "react";
import type { SocialBlockData } from "@/lib/types";
import { SocialIcon, SOCIAL_LABELS } from "@/components/blocks/social-icons";
import { extractSocialHandle, getSocialAvatarUrl } from "@/lib/social";
import { useGithubUser } from "@/lib/github";
import { useElementSize } from "@/lib/use-element-size";

// Below this, there isn't room to lay out a name row, repo count, and a
// legible contribution chart — those blocks just show the avatar + handle.
const EXPANDED_MIN_WIDTH = 200;
const EXPANDED_MIN_HEIGHT = 170;

export function SocialBlockView({ data }: { data: SocialBlockData }) {
  const avatarUrl = getSocialAvatarUrl(data.platform, data.url);
  const handle = extractSocialHandle(data.platform, data.url);

  // A failed load should only stick for the URL that failed — once the
  // user edits it (fixing a typo, switching platforms), give the new
  // avatar URL a fresh chance instead of staying stuck on the fallback.
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [checkedUrl, setCheckedUrl] = useState(avatarUrl);
  if (avatarUrl !== checkedUrl) {
    setCheckedUrl(avatarUrl);
    setAvatarFailed(false);
  }

  const showAvatar = avatarUrl && !avatarFailed;

  const { ref, size } = useElementSize<HTMLDivElement>();
  const isExpanded = size.width >= EXPANDED_MIN_WIDTH && size.height >= EXPANDED_MIN_HEIGHT;
  const showGithubDetail = data.platform === "github" && isExpanded && !!handle;
  const githubUser = useGithubUser(showGithubDetail ? handle : null);

  if (showGithubDetail) {
    return (
      <div ref={ref} className="flex h-full w-full flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          {showAvatar ? (
            <img
              src={avatarUrl}
              alt={handle}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <SocialIcon platform="github" className="h-7 w-7" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{githubUser?.name || `@${handle}`}</div>
            <div className="truncate text-xs opacity-60">@{handle}</div>
          </div>
        </div>

        {githubUser === undefined && (
          <div className="flex flex-1 items-center justify-center text-xs opacity-40">Loading…</div>
        )}

        {githubUser === null && (
          <div className="flex flex-1 items-center justify-center text-center text-xs opacity-40">
            GitHub profile unavailable
          </div>
        )}

        {githubUser && (
          <>
            <div className="text-xs opacity-70">
              <span className="font-semibold">{githubUser.publicRepos}</span> repos ·{" "}
              <span className="font-semibold">{githubUser.followers}</span> followers
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg bg-white p-1.5">
              <img
                src={`https://ghchart.rshah.org/${encodeURIComponent(githubUser.login)}`}
                alt={`${githubUser.login}'s GitHub contribution chart`}
                className="h-full w-full object-contain"
              />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
      <div className="relative">
        {showAvatar ? (
          <img
            src={avatarUrl}
            alt={handle ? `@${handle}` : SOCIAL_LABELS[data.platform]}
            className="h-11 w-11 rounded-full object-cover"
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <SocialIcon platform={data.platform} className="h-7 w-7" />
        )}
        {showAvatar && (
          <span
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2"
            style={{ background: "var(--bento-card-bg, #fff)", borderColor: "var(--bento-card-bg, #fff)" }}
          >
            <SocialIcon platform={data.platform} className="h-3 w-3" />
          </span>
        )}
      </div>
      <span className="text-xs font-medium opacity-70">
        {showAvatar && handle ? `@${handle}` : SOCIAL_LABELS[data.platform]}
      </span>
    </div>
  );
}
