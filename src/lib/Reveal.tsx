import { useLayoutEffect, useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** split granularity */
  by?: "chars" | "words" | "lines";
  stagger?: number;
  delay?: number;
  /** scrub word opacity with scroll instead of playing once */
  scrub?: boolean;
};

/** Text rises out of a masked line, character by character — the reference's
 *  typewriter-adjacent reveal, but with vertical motion instead of typing. */
export function SplitReveal({
  children,
  as: Tag = "div",
  className,
  by = "chars",
  stagger = 0.016,
  delay = 0,
  scrub = false,
}: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(el, {
        type: by === "lines" ? "lines" : `${by},lines`,
        linesClass: "overflow-hidden",
      });
      const targets = by === "lines" ? split.lines : by === "words" ? split.words : split.chars;

      if (scrub) {
        gsap.fromTo(
          targets,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 82%", end: "top 30%", scrub: 0.6 },
          }
        );
      } else {
        gsap.fromTo(
          targets,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            delay,
            stagger,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, [by, stagger, delay, scrub]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

type FadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
};

/** Content drifts up, unblurs, and settles — for captions, cards, UI chrome. */
export function FadeUp({ children, className, delay = 0, y = 48, blur = true }: FadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y, opacity: 0, filter: blur ? "blur(10px)" : "none" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          // residual filter creates a backdrop root and breaks glass blur below
          onComplete: () => gsap.set(el, { clearProps: "filter" }),
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, blur]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
