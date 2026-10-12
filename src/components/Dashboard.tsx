import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitReveal, FadeUp } from "../lib/Reveal";

gsap.registerPlugin(ScrollTrigger);

const agents = [
  { name: "Заявка #1043", status: "в работе", load: 82 },
  { name: "Заказ #А-207", status: "собирается", load: 64 },
  { name: "Возврат #58", status: "ожидает", load: 41 },
  { name: "Отгрузка #990", status: "готово", load: 93 },
];

export function Dashboard() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // panel rises out of depth as it enters
      gsap.fromTo(
        panel.current,
        { y: 120, rotateX: 14, opacity: 0, filter: "blur(14px)" },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: panel.current, start: "top 80%", once: true },
          onComplete: () => gsap.set(panel.current, { clearProps: "filter" }),
        }
      );
      // metric bars grow when visible
      gsap.fromTo(
        "[data-bar]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          stagger: 0.12,
          ease: "power4.inOut",
          scrollTrigger: { trigger: panel.current, start: "top 70%", once: true },
        }
      );
      // sparkline draws itself
      const path = root.current?.querySelector<SVGPathElement>("[data-spark]");
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: panel.current, start: "top 70%", once: true },
          }
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = panel.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      rotateY: ((e.clientX - r.left) / r.width - 0.5) * 4,
      rotateX: ((e.clientY - r.top) / r.height - 0.5) * -4,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  const onLeave = () => gsap.to(panel.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "power3.out" });

  return (
    <section id="dashboard" ref={root} className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Как это выглядит</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[16ch]">
          Ваш бизнес — на одном экране.
        </SplitReveal>
        <FadeUp delay={0.2}>
          <p className="caption mt-6">
            Так может выглядеть ваша CRM или панель управления: заявки, заказы
            и метрики со всех каналов — в реальном времени и в одном окне.
          </p>
        </FadeUp>

        <div className="mt-20 [perspective:1400px]">
          <div
            ref={panel}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="glass mx-auto max-w-4xl p-6 will-change-transform md:p-10"
          >
            {/* window chrome */}
            <div className="flex items-center justify-between border-b border-mist/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-mist/25" />
                <span className="h-2 w-2 rounded-full bg-mist/25" />
                <span className="h-2 w-2 rounded-full bg-accent/80" />
              </div>
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-fog">torus crm / панель / онлайн</span>
            </div>

            <div className="mt-8 grid gap-10 md:grid-cols-5">
              {/* agents list */}
              <div className="md:col-span-3">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-fog">Заявки в работе</p>
                <ul className="mt-5 space-y-5">
                  {agents.map((a) => (
                    <li key={a.name} className="group">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-mono text-[0.8rem] text-mist/90">{a.name}</span>
                        <span
                          className={`text-[0.6rem] uppercase tracking-[0.25em] ${
                            a.status === "готово" ? "text-accent" : "text-fog"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <div className="mt-2 h-px w-full bg-mist/10">
                        <div
                          data-bar
                          className="h-px origin-left bg-mist/60"
                          style={{ width: `${a.load}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* throughput sparkline */}
              <div className="md:col-span-2">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-fog">Заявок за месяц</p>
                <div className="display mt-4 text-4xl font-medium">2 480</div>
                <svg viewBox="0 0 220 80" className="mt-6 w-full" fill="none">
                  <path
                    data-spark
                    d="M0 62 C18 58, 26 44, 42 46 S 66 60, 82 52 S 104 22, 122 28 S 148 44, 164 34 S 190 8, 220 14"
                    stroke="rgba(143,168,255,0.9)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 62 C18 58, 26 44, 42 46 S 66 60, 82 52 S 104 22, 122 28 S 148 44, 164 34 S 190 8, 220 14 V80 H0 Z"
                    fill="url(#sparkfill)"
                  />
                  <defs>
                    <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="rgba(143,168,255,0.12)" />
                      <stop offset="1" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="caption mt-6 text-[0.72rem]">
                  Заявки со всех каналов — сайт, боты и маркетплейсы — в одном потоке.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
