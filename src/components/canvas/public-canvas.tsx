import type { Portfolio } from "@/lib/types";
import { BlockShell } from "@/components/canvas/block-shell";
import { BlockContent } from "@/components/blocks/block-content";
import { FreeformScaler } from "@/components/canvas/freeform-scaler";
import { freeformBounds, FREEFORM_BASE_WIDTH } from "@/lib/layout";

export function PublicCanvas({ portfolio }: { portfolio: Portfolio }) {
  const visible = portfolio.blocks.filter((b) => !b.hidden);
  const { theme } = portfolio;

  if (portfolio.mode === "freeform") {
    const bounds = freeformBounds(visible);
    return (
      <FreeformScaler baseWidth={FREEFORM_BASE_WIDTH} baseHeight={bounds.height}>
        {visible.map((block) => (
          <BlockShell
            key={block.id}
            block={block}
            theme={theme}
            style={{
              position: "absolute",
              left: block.freeform.x,
              top: block.freeform.y,
              width: block.freeform.w,
              height: block.freeform.h,
              transform: `rotate(${block.freeform.rotate}deg)`,
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
      {visible.map((block) => (
        <BlockShell
          key={block.id}
          block={block}
          theme={theme}
          className="bento-grid-item"
          style={{ ["--w" as string]: block.grid.w, ["--h" as string]: block.grid.h }}
        >
          <BlockContent block={block} interactive />
        </BlockShell>
      ))}
    </div>
  );
}
