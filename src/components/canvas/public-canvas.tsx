import type { Portfolio } from "@/lib/types";
import { BlockShell } from "@/components/canvas/block-shell";
import { BlockContent } from "@/components/blocks/block-content";
import { FreeformScaler } from "@/components/canvas/freeform-scaler";
import { freeformBounds, FREEFORM_BASE_WIDTH } from "@/lib/layout";

// Pure-CSS staggered entrance (tw-animate-css's `animate-in`) so the public
// page stays server-rendered — no client JS needed just to fade blocks in.
function enterStyle(index: number): React.CSSProperties {
  return { animationDelay: `${Math.min(index, 10) * 55}ms`, animationDuration: "500ms" };
}

export function PublicCanvas({ portfolio }: { portfolio: Portfolio }) {
  const visible = portfolio.blocks.filter((b) => !b.hidden);
  const { theme } = portfolio;

  if (portfolio.mode === "freeform") {
    const bounds = freeformBounds(visible);
    return (
      <FreeformScaler baseWidth={FREEFORM_BASE_WIDTH} baseHeight={bounds.height}>
        {visible.map((block, i) => (
          <BlockShell
            key={block.id}
            block={block}
            theme={theme}
            className="animate-in fade-in-0 zoom-in-95 fill-mode-both ease-out"
            style={{
              position: "absolute",
              left: block.freeform.x,
              top: block.freeform.y,
              width: block.freeform.w,
              height: block.freeform.h,
              transform: `rotate(${block.freeform.rotate}deg)`,
              ...enterStyle(i),
            }}
          >
            <BlockContent block={block} interactive />
          </BlockShell>
        ))}
      </FreeformScaler>
    );
  }

  return (
    <div className="bento-grid" style={{ gap: theme.spacing, ["--cols" as string]: theme.columns }}>
      {visible.map((block, i) => (
        <BlockShell
          key={block.id}
          block={block}
          theme={theme}
          className="bento-grid-item animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both ease-out"
          style={{ ["--w" as string]: block.grid.w, ["--h" as string]: block.grid.h, ...enterStyle(i) }}
        >
          <BlockContent block={block} interactive />
        </BlockShell>
      ))}
    </div>
  );
}
