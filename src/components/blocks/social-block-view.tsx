"use client";

import { useState } from "react";
import type { SocialBlockData } from "@/lib/types";
import { SocialIcon, SOCIAL_LABELS } from "@/components/blocks/social-icons";
import { extractSocialHandle, getSocialAvatarUrl } from "@/lib/social";

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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
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
