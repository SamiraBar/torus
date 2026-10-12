import { useLayoutEffect, useRef } from "react";
import { TELEGRAM_URL } from "../lib/contacts";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { motion } from "framer-motion";
import { Magnetic } from "../lib/Magnetic";

gsap.registerPlugin(SplitText);

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText("[data-hero-line]", {
        type: "chars,lines",
        linesClass: "overflow-hidden",
      });
      gsap.fromTo(
        split.chars,
        { yPercent: 115, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.022, delay: 0.55, ease: "power4.out" }
      );
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.6,
          delay: 1.5,
          stagger: 0.15,
          ease: "power3.out",
          onComplete: () => gsap.set("[data-hero-fade]", { clearProps: "filter" }),
        }
      );
      // headline drifts up & thins out as the journey begins
      gsap.to("[data-hero-parallax]", {
        yPercent: -28,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 40%", scrub: 0.5 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative flex h-screen flex-col justify-center px-6 md:px-12">
      <div data-hero-parallax>
        <h1 className="display display-xl max-w-[12ch]">
          <span data-hero-line className="block">Софт, который</span>
          <span data-hero-line className="block pl-[0.8em] text-stroke">работает</span>
          <span data-hero-line className="block">за вас.</span>
        </h1>
      </div>

      {/* side caption — small, quiet, off-axis like the reference */}
      <div
        data-hero-fade
        className="caption absolute right-6 top-[58%] hidden max-w-[26ch] opacity-0 md:right-12 lg:block"
      >
        Torus — студия автоматизации бизнеса. Берём любой процесс, который
        отнимает время у команды, и превращаем его в систему, которая работает
        сама: от первой заявки до отчёта на столе у руководителя.
      </div>

      <div data-hero-fade className="mt-14 flex items-center gap-5 opacity-0">
        <Magnetic strength={0.4}>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="glass inline-block rounded-full px-9 py-4 text-[0.72rem] font-medium uppercase tracking-[0.28em] transition-colors duration-300 hover:text-accent"
          >
            Обсудить проект
          </a>
        </Magnetic>
        <a href="#features" className="link-line text-[0.72rem] uppercase tracking-[0.28em] text-fog hover:text-mist">
          Что мы делаем
        </a>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-fog">Листайте</span>
        <motion.span
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-10 w-px bg-mist/40"
        />
      </motion.div>
    </section>
  );
}
