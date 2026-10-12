import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Native canvas every preview is designed at; it is scaled down to fit the card. */
export const STAGE_W = 1440;
export const STAGE_H = 810; // 16:9 — wide enough, still fits a laptop screen with the caption

/** Renders children on a fixed STAGE_W×STAGE_H canvas and scales it to the container width,
 *  so a full desktop UI reads as a crisp miniature instead of a squeezed layout. */
export function ScaledStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

type FrameProps = {
  url: string;
  children: ReactNode;
  /** small live indicator in the address bar */
  live?: boolean;
};

/** Dark glass browser window: traffic lights, address bar, content below. */
export function BrowserFrame({ url, children, live }: FrameProps) {
  return (
    <div className="browser-frame">
      <div className="browser-bar">
        <span className="flex gap-[7px]">
          <i className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
          <i className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
          <i className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
        </span>
        <span className="browser-url">
          <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          {url}
        </span>
        {live ? (
          <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-fog">
            <i className="live-dot" /> live
          </span>
        ) : (
          <span className="w-[46px]" />
        )}
      </div>
      <div className="relative bg-graphite">{children}</div>
    </div>
  );
}
