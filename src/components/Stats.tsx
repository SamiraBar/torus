import { FadeUp } from "../lib/Reveal";

/* What we promise, not what we've accumulated: no project counts or years on
   the market — just how working with us actually goes. */
const points = [
  {
    value: "Под ключ",
    label: "Одна команда от идеи до запуска: анализ, дизайн, разработка и поддержка",
    icon: "M12 2l9 5v10l-9 5-9-5V7l9-5zM12 22V12M21 7l-9 5-9-5",
  },
  {
    value: "Бесплатно",
    label: "Разбор задачи и оценка до старта, без обязательств",
    icon: "M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11",
  },
  {
    value: "2 недели",
    label: "От идеи до первой рабочей версии, которую можно потрогать",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    value: "24/7",
    label: "На связи после запуска: дорабатываем и развиваем вместе с вами",
    icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  },
];

export function Stats() {
  return (
    <section className="relative px-6 py-32 md:px-12">
      <div className="works-backdrop" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <FadeUp key={p.value} delay={i * 0.08}>
            <div className="glass h-full p-8">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d={p.icon} />
              </svg>
              <div className="display mt-8 font-medium leading-none" style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)" }}>
                {p.value}
              </div>
              <p className="mt-4 text-[0.92rem] leading-[1.65] text-mist/70">{p.label}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
