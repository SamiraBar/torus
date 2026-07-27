import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeUp } from "../lib/Reveal";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 4.2, suffix: "B", decimals: 1, label: "Autonomous decisions, daily" },
  { value: 99.98, suffix: "%", decimals: 2, label: "Reasoning-layer uptime" },
  { value: 320, suffix: "+", decimals: 0, label: "Enterprises in production" },
  { value: 12, suffix: "×", decimals: 0, label: "Median throughput gain" },
];

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count!);
        const decimals = parseInt(el.dataset.decimals ?? "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-6 py-40 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.1}>
            <div className="border-t border-mist/10 pt-8">
              <div className="display font-medium leading-none" style={{ fontSize: "clamp(3rem, 5.5vw, 5.2rem)" }}>
                <span data-count={s.value} data-decimals={s.decimals}>0</span>
                <span className="text-accent">{s.suffix}</span>
              </div>
              <p className="caption mt-5">{s.label}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
