import type { StampBlockData } from "@/lib/types";

// The die-cut/perforated stamp graphic, used exactly as provided
// (public/stamp-frame.png). Its transparent inner window sits at these
// fixed percentages of the 736x736 source canvas — measured directly from
// the asset's pixels — so a photo placed behind it lines up with the cutout
// regardless of how large the block is rendered.
const WINDOW = {
  left: (143 / 736) * 100,
  top: (79 / 736) * 100,
  right: (144 / 736) * 100,
  bottom: (83 / 736) * 100,
};

export function StampFrame({ data }: { data: StampBlockData }) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${WINDOW.left}%`,
          top: `${WINDOW.top}%`,
          right: `${WINDOW.right}%`,
          bottom: `${WINDOW.bottom}%`,
        }}
      >
        {data.imageUrl ? (
          <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: "rgba(35,25,10,0.08)" }} />
        )}
        {data.caption && (
          <div
            className="absolute inset-x-0 bottom-0 py-1 text-center"
            style={{ background: "rgba(251,249,242,0.92)" }}
          >
            <span
              className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "rgba(35,25,10,0.65)" }}
            >
              {data.caption}
            </span>
          </div>
        )}
      </div>
      <img
        src="/stamp-frame.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ objectFit: "fill" }}
      />
    </div>
  );
}
