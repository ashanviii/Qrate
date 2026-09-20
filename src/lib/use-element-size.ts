"use client";

import { useEffect, useRef, useState } from "react";

// Tracks an element's own rendered box size (not just the viewport), so a
// block can adapt to how big it actually is on screen — grid mode sizes it
// in cell multiples, freeform mode in raw pixels, but both end up here.
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
