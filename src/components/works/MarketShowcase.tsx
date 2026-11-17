import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* Torus Marketplace — the real storefront (rebranded demo copy with a sample
   catalogue), captured full-page on desktop and on a phone. The pages glide
   down and back up so the whole storefront is visible without clicking. */

const DESKTOP = { src: "/works/market-desktop.jpg", w: 1440, h: 4331 };
const MOBILE = { src: "/works/market-mobile.jpg", w: 600, h: 11277 };

// desktop window geometry on the 1440×810 stage
const WIN = { left: 48, top: 40, w: 1030, h: 690, bar: 34 };
// phone geometry
const PHONE = { w: 320, h: 690, bezel: 10, status: 40, nav: Math.round((300 * 112) / 780) }; // nav strip keeps its 780×112 ratio

function Glide({ src, width, height, viewport, duration, delay, run }: { src: string; width: number; height: number; viewport: number; duration: number; delay: number; run: boolean }) {
  const travel = Math.max(0, height - viewport);
  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      className="absolute left-0 top-0 block max-w-none select-none"
      style={{ width, height }}
      initial={{ y: 0 }}
      animate={run ? { y: [0, 0, -travel, -travel, 0] } : { y: 0 }}
      transition={{ duration, delay, times: [0, 0.08, 0.55, 0.65, 1], ease: "easeInOut", repeat: Infinity }}
    />
  );
}

export function MarketShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref, { once: true, amount: 0.2 });

  const winView = WIN.h - WIN.bar;
  const deskH = (DESKTOP.h * WIN.w) / DESKTOP.w;
  const screenW = PHONE.w - PHONE.bezel * 2;
  const screenH = PHONE.h - PHONE.bezel * 2;
  const mobH = (MOBILE.h * screenW) / MOBILE.w;

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      style={{ background: "radial-gradient(900px 600px at 20% 15%, #1c2040 0%, transparent 60%), radial-gradient(700px 500px at 90% 90%, #10224a 0%, transparent 60%), #08090b", fontFamily: "Inter, sans-serif", textShadow: "none" }}
    >
      {/* desktop window */}
      <div className="absolute overflow-hidden rounded-[16px]" style={{ left: WIN.left, top: WIN.top, width: WIN.w, height: WIN.h, boxShadow: "0 0 0 1px rgba(255,255,255,.08), 0 60px 120px -40px rgba(0,0,0,.9)" }}>
        <div className="flex items-center gap-[7px] px-4" style={{ height: WIN.bar, background: "#1a1b20" }}>
          <i className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
          <i className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
          <i className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
          <span className="ml-4 rounded-full bg-white/5 px-4 py-[3px] text-[11px] text-white/45">market.torus.dev</span>
        </div>
        <div className="relative overflow-hidden bg-white" style={{ height: winView }}>
          <Glide src={DESKTOP.src} width={WIN.w} height={deskH} viewport={winView} duration={30} delay={0.6} run={run} />
        </div>
      </div>
      <div className="absolute text-[12px] uppercase tracking-[0.32em] text-white/40" style={{ left: WIN.left + 4, top: WIN.top + WIN.h + 22 }}>
        Витрина · компьютер
      </div>

      {/* phone */}
      <div className="absolute" style={{ right: 70, top: 40 }}>
        <div className="relative rounded-[50px]" style={{ width: PHONE.w, height: PHONE.h, padding: PHONE.bezel, background: "linear-gradient(160deg,#2a2c33,#0b0c0f)", boxShadow: "0 0 0 1px rgba(255,255,255,.08), 0 50px 100px -30px rgba(0,0,0,.9), 0 0 120px -40px rgba(91,108,255,.45)" }}>
          <div className="relative overflow-hidden rounded-[41px]" style={{ width: screenW, height: screenH, background: "#0f1420" }}>
            <div className="absolute inset-x-0 overflow-hidden" style={{ top: PHONE.status, bottom: 0 }}>
              <Glide src={MOBILE.src} width={screenW} height={mobH} viewport={screenH - PHONE.status - PHONE.nav} duration={36} delay={1.4} run={run} />
            </div>
            {/* status bar */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-7 text-[12.5px] font-semibold text-white" style={{ height: PHONE.status, background: "#0b1020" }}>
              <span>9:41</span>
              <span className="absolute left-1/2 top-[8px] h-[24px] w-[88px] -translate-x-1/2 rounded-full bg-black" />
              <span>▮▮▮</span>
            </div>
            {/* real bottom navigation of the storefront */}
            <img src="/works/market-mobile-nav.png" alt="" className="absolute inset-x-0 bottom-0 block w-full" style={{ height: PHONE.nav }} />
          </div>
        </div>
        <div className="mt-5 text-center text-[12px] uppercase tracking-[0.32em] text-white/40">Витрина · телефон</div>
      </div>
    </div>
  );
}
