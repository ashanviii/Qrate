import { forwardRef } from "react";
import type { Block, Theme } from "@/lib/types";
import { SHADOW_CSS } from "@/lib/theme-css";
import { cn } from "@/lib/utils";

export const BlockShell = forwardRef<
  HTMLDivElement,
  {
    block: Block;
    theme: Theme;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>
>(function BlockShell({ block, theme, className, style, children, ...rest }, ref) {
  const bg = block.bg ?? "var(--bento-card-bg)";
  return (
    <div
      ref={ref}
      className={cn("group/block overflow-hidden", className)}
      style={{
        background: bg,
        borderRadius: `var(--bento-radius, ${theme.radius}px)`,
        boxShadow: `var(--bento-shadow, ${SHADOW_CSS[theme.shadow]})`,
        borderWidth: `var(--bento-border, ${theme.borderWidth}px)`,
        borderStyle: theme.borderWidth > 0 ? "solid" : undefined,
        borderColor: theme.primary,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
