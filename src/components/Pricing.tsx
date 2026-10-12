import { SplitReveal, FadeUp } from "../lib/Reveal";
import { TELEGRAM_URL } from "../lib/contacts";
import { Magnetic } from "../lib/Magnetic";

// Ориентиры, не прайс: итоговая цена всегда после обсуждения.
const tiers = [
  {
    name: "Сайт или чат-бот",
    desc: "Лендинг, сайт-визитка или бот под задачу: заявки, запись, оплата.",
    price: "от 30 000",
  },
  {
    name: "CRM и автоматизация",
    desc: "CRM, личный кабинет, склад, интеграции с оплатой, 1С и мессенджерами.",
    price: "от 120 000",
  },
  {
    name: "Комплексная система",
    desc: "Веб- и мобильные приложения, маркетплейс, аналитика под ваши процессы.",
    price: "по задаче",
  },
];

const flow = [
  ["Обсуждаем задачу", "Бесплатно созваниваемся, разбираем процессы и цели."],
  ["Считаем смету", "Называем точную стоимость и сроки по этапам."],
  ["Тестовый запуск", "Запускаем первую рабочую версию — вы проверяете её в деле."],
  ["Фиксируем в договоре", "Цена и сроки не меняются по ходу работы."],
];

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-32 md:px-12">
      <div className="works-backdrop" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Цены</p>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SplitReveal as="h2" by="words" stagger={0.05} className="display display-md">
            Стоимость считаем
            <br />
            под вашу задачу
          </SplitReveal>
          <FadeUp>
            <p className="max-w-[36ch] text-[0.95rem] leading-[1.7] text-mist/70 md:text-right">
              Ниже — ориентиры. Окончательную цену называем после обсуждения, когда понятен объём работ.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* price guide */}
          <FadeUp className="lg:col-span-7">
            <div className="glass h-full">
              {tiers.map((t, i) => (
                <div key={t.name} className={`flex flex-col gap-3 p-8 sm:flex-row sm:items-center sm:justify-between ${i ? "border-t border-mist/10" : ""}`}>
                  <div className="max-w-[38ch]">
                    <h3 className="display text-xl font-medium">{t.name}</h3>
                    <p className="mt-2 text-[0.9rem] leading-[1.6] text-mist/65">{t.desc}</p>
                  </div>
                  <div className="display shrink-0 whitespace-nowrap text-3xl font-medium sm:text-right">
                    {t.price}
                    {t.price.startsWith("от") && <span className="ml-1 text-lg text-fog">сом</span>}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* how the final price is set */}
          <FadeUp delay={0.1} className="lg:col-span-5">
            <div className="glass flex h-full flex-col p-8 outline outline-1 outline-accent/40">
              <div className="text-[0.62rem] uppercase tracking-[0.3em] text-accent">Как формируется цена</div>
              <ol className="mt-6 flex-1 space-y-5">
                {flow.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.75rem] font-semibold ${i === 2 ? "border-accent bg-accent/15 text-accent" : "border-mist/20 text-mist/70"}`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className={`text-[0.98rem] font-medium ${i === 2 ? "text-accent" : ""}`}>{title}</div>
                      <div className="mt-1 text-[0.88rem] leading-[1.55] text-mist/65">{body}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <Magnetic strength={0.25} className="mt-8">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="block rounded-full border border-accent/60 py-3.5 text-center text-[0.68rem] font-medium uppercase tracking-[0.28em] text-mist transition-colors duration-300 hover:bg-accent/10"
                >
                  Обсудить проект
                </a>
              </Magnetic>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
