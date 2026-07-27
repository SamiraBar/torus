import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitReveal, FadeUp } from "../lib/Reveal";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: "2019", title: "First principles", body: "Founded around a single question: what if software could carry responsibility, not just instructions?" },
  { year: "2021", title: "The reasoning core", body: "Our first domain-tuned model enters production at a global logistics group. It has not slept since." },
  { year: "2023", title: "Agents at scale", body: "Multi-agent orchestration ships. Fleets begin verifying each other's work across 40 enterprises." },
  { year: "2025", title: "The silent layer", body: "Auralis becomes infrastructure — invisible, assumed, load-bearing. 320 companies run on the core." },
  { year: "2026", title: "What's next", body: "Systems that don't just execute strategy, but quietly suggest better ones." },
];

export function Timeline() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-spine]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-track]",
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Trajectory</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[12ch]">
          Seven years of quiet momentum.
        </SplitReveal>

        <div data-track className="relative mt-28 pl-8 md:pl-0">
          {/* spine */}
          <div className="absolute left-0 top-0 h-full w-px bg-mist/10 md:left-1/2" />
          <div data-spine className="absolute left-0 top-0 h-full w-px origin-top bg-accent/70 md:left-1/2" />

          <div className="space-y-24">
            {milestones.map((m, i) => (
              <FadeUp key={m.year} y={56}>
                <div
                  className={`relative md:grid md:grid-cols-2 md:gap-20 ${
                    i % 2 ? "md:text-left" : "md:text-right"
                  }`}
                >
                  <div className={i % 2 ? "md:col-start-2" : ""}>
                    <span className="display text-stroke block text-6xl font-semibold md:text-7xl">
                      {m.year}
                    </span>
                    <h3 className="display mt-4 text-2xl font-medium">{m.title}</h3>
                    <p className={`caption mt-3 ${i % 2 ? "" : "md:ml-auto"}`}>{m.body}</p>
                  </div>
                  {/* node */}
                  <span className="absolute -left-8 top-3 h-2 w-2 -translate-x-1/2 rounded-full border border-accent/70 bg-ink md:left-1/2" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
