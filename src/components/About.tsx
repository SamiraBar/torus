import { SplitReveal, FadeUp } from "../lib/Reveal";

const steps = [
  ["01", "Разберёмся", "Погружаемся в ваши процессы и находим, что тормозит и где теряются деньги."],
  ["02", "Спроектируем", "Собираем решение под конкретную задачу — без лишнего, только то, что даёт результат."],
  ["03", "Внедрим", "Запускаем, обучаем команду и остаёмся на связи — сопровождаем после старта."],
];

export function About() {
  return (
    <section id="about" className="relative px-6 py-40 md:px-12">
      {/* solid ground: the 3D scene must not run behind the copy */}
      <div className="works-backdrop" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl">
        <FadeUp>
          <p className="eyebrow mb-10">О студии</p>
        </FadeUp>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SplitReveal as="h2" by="words" stagger={0.05} className="display display-md lg:col-span-8 !leading-[1.08]">
            Рутину&nbsp;— программам.
            <br />
            Вашей команде&nbsp;—
            <br />
            <span className="text-accent">время на&nbsp;рост.</span>
          </SplitReveal>

          <FadeUp delay={0.15} className="lg:col-span-4">
            <p className="text-[1.05rem] leading-[1.75] text-mist/75">
              Бизнес тратит часы на задачи, которые давно можно отдать программам.{" "}
              <span className="text-mist">Torus проектирует и внедряет цифровые инструменты</span> — от лендинга до
              сложной CRM, — которые берут эту рутину на себя и работают без выходных.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <div className="glass mt-20 grid md:grid-cols-3">
            {steps.map(([n, title, body], i) => (
              <div key={n} className={`relative p-8 md:p-10 ${i ? "border-t border-mist/10 md:border-l md:border-t-0" : ""}`}>
                <div className="mb-8 flex items-center gap-4">
                  <span className="display text-[2.4rem] font-semibold leading-none text-accent">{n}</span>
                  {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent md:block" />}
                </div>
                <h3 className="display text-2xl font-medium">{title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.7] text-mist/70">{body}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
