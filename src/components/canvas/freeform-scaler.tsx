"use client";

import { useEffect, useRef, useState } from "react";

// Freeform blocks use fixed pixel coordinates authored at `baseWidth`.
// This wrapper measures its own width and scales its child down (never up)
// so the freeform layout stays proportional on every screen size.
export function FreeformScaler({
  baseWidth,
  baseHeight,
  children,
}: {
  baseWidth: number;
  baseHeight: number;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? baseWidth;
      setScale(Math.min(1, width / baseWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return (
    <div ref={outerRef} style={{ width: "100%", height: baseHeight * scale }}>
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
