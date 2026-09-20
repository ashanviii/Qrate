"use client";

import { useId } from "react";
import type { StampBlockData } from "@/lib/types";

// A postage-stamp die-cut: a scalloped (perforated) outer edge, a plain
// paper-white margin, and a straight-edged inner window where the image
// sits. Built once against a fixed 100x100 reference box and stretched via
// the SVG viewport, so it works at any block aspect ratio with no JS
// measurement needed.
const SIZE = 100;
const BUMPS_PER_EDGE = 9;
const MARGIN = 9;

function buildScallopPath(size: number, n: number): string {
  const r = size / (2 * n);
  let d = `M 0 0`;
  for (let i = 0; i < n; i++) d += ` A ${r} ${r} 0 0 1 ${(i + 1) * 2 * r} 0`;
  for (let i = 0; i < n; i++) d += ` A ${r} ${r} 0 0 1 ${size} ${(i + 1) * 2 * r}`;
  for (let i = 0; i < n; i++) d += ` A ${r} ${r} 0 0 1 ${size - (i + 1) * 2 * r} ${size}`;
  for (let i = 0; i < n; i++) d += ` A ${r} ${r} 0 0 1 0 ${size - (i + 1) * 2 * r}`;
  return `${d} Z`;
}

const SCALLOP_PATH = buildScallopPath(SIZE, BUMPS_PER_EDGE);
const INNER = SIZE - MARGIN * 2;

export function StampFrame({ data }: { data: StampBlockData }) {
  const id = useId();
  const maskId = `stamp-mask-${id}`;
  const clipId = `stamp-clip-${id}`;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      role="img"
      aria-label={data.caption || "Postage stamp"}
    >
      <defs>
        <mask id={maskId}>
          <path d={SCALLOP_PATH} fill="white" />
        </mask>
        <clipPath id={clipId}>
          <rect x={MARGIN} y={MARGIN} width={INNER} height={INNER} />
        </clipPath>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width={SIZE} height={SIZE} fill="#fbf9f2" />
        {data.imageUrl ? (
          <image
            href={data.imageUrl}
            x={MARGIN}
            y={MARGIN}
            width={INNER}
            height={INNER}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />
        ) : (
          <rect x={MARGIN} y={MARGIN} width={INNER} height={INNER} fill="rgba(35,25,10,0.07)" clipPath={`url(#${clipId})`} />
        )}
        {data.caption && (
          <g clipPath={`url(#${clipId})`}>
            <rect x={MARGIN} y={SIZE - MARGIN - 13} width={INNER} height={13} fill="rgba(251,249,242,0.92)" />
            <text
              x={SIZE / 2}
              y={SIZE - MARGIN - 4.5}
              textAnchor="middle"
              fontSize="6"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontWeight={700}
              letterSpacing="0.5"
              fill="rgba(35,25,10,0.65)"
            >
              {data.caption.toUpperCase()}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
