import { useRef } from "react";
import gsap from "gsap";
import { SplitReveal, FadeUp } from "../lib/Reveal";

const features = [
  {
    n: "01",
    title: "Autonomous Agents",
    body: "Fleets of task-specific agents that plan, delegate and verify each other's work across your stack.",
  },
  {
    n: "02",
    title: "Process Automation",
    body: "End-to-end orchestration of operational workflows — from intake to resolution, without brittle rules.",
  },
  {
    n: "03",
    title: "Enterprise Copilot",
    body: "One interface over every internal system. Ask in language; receive actions, not links.",
  },
  {
    n: "04",
    title: "Predictive Core",
    body: "Forecasting woven into the transaction path, so decisions arrive before the moment they're needed.",
  },
];

/** Glass card with a light sheen that follows the cursor. */
function Card({ n, title, body, delay }: (typeof features)[0] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    gsap.to(sheen.current, { x: x - 140, y: y - 140, duration: 0.5, ease: "power2.out", opacity: 1 });
    gsap.to(el, {
      rotateY: ((x / r.width) - 0.5) * 5,
      rotateX: ((y / r.height) - 0.5) * -5,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    gsap.to(sheen.current, { opacity: 0, duration: 0.6 });
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
  };

  return (
    <FadeUp delay={delay} className="[perspective:900px]">
      <div
        ref={ref}
        data-cursor
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass group relative overflow-hidden p-8 transition-colors duration-500 will-change-transform md:p-10"
      >
        <div
          ref={sheen}
          className="pointer-events-none absolute h-[280px] w-[280px] rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(242,241,238,0.09) 0%, transparent 65%)" }}
        />
        <span className="text-[0.65rem] tracking-[0.3em] text-fog">{n}</span>
        <h3 className="display mt-16 text-2xl font-medium md:text-3xl">{title}</h3>
        <p className="caption mt-4">{body}</p>
        <span className="mt-8 block h-px w-8 bg-accent/70 transition-all duration-700 group-hover:w-full" />
      </div>
    </FadeUp>
  );
}

export function Features() {
  return (
    <section id="features" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Capabilities</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[14ch]">
          Four instruments. One nervous system.
        </SplitReveal>

        <div className="mt-24 grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <Card key={f.n} {...f} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
