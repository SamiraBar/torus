import { SplitReveal, FadeUp } from "../lib/Reveal";

const steps = [
  { n: "01", title: "Бриф", body: "Обсуждаем задачу, цели и бюджет. Консультация бесплатно." },
  { n: "02", title: "Прототип", body: "Показываем структуру и дизайн до старта разработки." },
  { n: "03", title: "Разработка", body: "Собираем спринтами и показываем прогресс каждую неделю." },
  { n: "04", title: "Запуск", body: "Тестируем, разворачиваем у вас и обучаем команду." },
  { n: "05", title: "Поддержка", body: "Дорабатываем и развиваем систему вместе с бизнесом." },
];

export function Timeline() {
  return (
    <section className="relative px-6 py-32 md:px-12">
      <div className="works-backdrop" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-6">Как мы работаем</p>
            <SplitReveal as="h2" by="words" stagger={0.05} className="display display-md">
              Пять шагов
              <br />
              от заявки до&nbsp;результата
            </SplitReveal>
          </div>
          <FadeUp>
            <p className="max-w-[30ch] text-[0.95rem] leading-[1.7] text-mist/70 md:text-right">
              Вы всегда знаете, на каком этапе проект и что будет дальше.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <ol className="glass relative mt-16 grid lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.n} className={`relative p-7 ${i ? "border-t border-mist/10 lg:border-l lg:border-t-0" : ""}`}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/50 text-[0.8rem] font-semibold text-accent">
                    {s.n}
                  </span>
                  {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent lg:block" />}
                </div>
                <h3 className="display text-xl font-medium">{s.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-[1.6] text-mist/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </FadeUp>
      </div>
    </section>
  );
}
