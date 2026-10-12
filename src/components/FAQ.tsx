import { useState } from "react";
import { TELEGRAM_URL } from "../lib/contacts";
import { motion, AnimatePresence } from "framer-motion";
import { SplitReveal, FadeUp } from "../lib/Reveal";

const faqs = [
  {
    q: "Сколько стоит разработка?",
    a: "Ориентиры: сайт или чат-бот — от 20 000 сом, CRM и автоматизация — от 50 000 сом. Точную цену называем после бесплатного обсуждения, когда понятен объём, и фиксируем в договоре.",
  },
  {
    q: "Можно сначала попробовать?",
    a: "Да. Делаем тестовый запуск: первую рабочую версию на ваших данных. Вы проверяете её в деле, и только потом двигаемся дальше.",
  },
  {
    q: "Сколько времени займёт?",
    a: "Сайт или бот — 1–2 недели. CRM, магазин или автоматизация — от 3 до 6 недель. Сроки по этапам прописываем в договоре.",
  },
  {
    q: "Как проходит оплата?",
    a: "По этапам: предоплата за этап и остаток после приёмки. Перевод на карту или безналичный расчёт для компаний.",
  },
  {
    q: "Кому принадлежит готовый проект?",
    a: "Вам. После оплаты передаём исходный код, все доступы и инструкцию по работе с системой.",
  },
  {
    q: "Что будет после запуска?",
    a: "Остаёмся на связи: исправляем, дорабатываем и развиваем систему — по абонементу или разово, как вам удобнее.",
  },
  {
    q: "У нас уже есть сайт или CRM. Поможете?",
    a: "Да. Разберём, что есть, доработаем или подключим нужные интеграции. Переделать с нуля предложим, только если так выйдет дешевле.",
  },
  {
    q: "Работаете удалённо?",
    a: "Да: созвоны, показ результатов и сдача работ проходят онлайн. Если нужно, встречаемся лично.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-6 py-32 md:px-12">
      <div className="works-backdrop" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-6">Вопросы</p>
            <SplitReveal as="h2" by="words" stagger={0.05} className="display display-md">
              Частые
              <br />
              вопросы
            </SplitReveal>
            <FadeUp>
              <p className="mt-6 max-w-[30ch] text-[0.95rem] leading-[1.7] text-mist/70">
                Не нашли ответ? Напишите нам — ответим в течение дня.
              </p>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" data-cursor className="link-line mt-6 inline-block text-[0.7rem] uppercase tracking-[0.3em] text-accent">
                Задать вопрос
              </a>
            </FadeUp>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`glass overflow-hidden transition-colors duration-300 ${isOpen ? "outline outline-1 outline-accent/30" : ""}`}>
                <button
                  data-cursor
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left"
                >
                  <span className="flex items-center gap-5">
                    <span className={`text-[0.75rem] font-semibold tabular-nums ${isOpen ? "text-accent" : "text-fog"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[1.08rem] font-medium md:text-[1.15rem]">{f.q}</span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative block h-4 w-4 shrink-0 ${isOpen ? "text-accent" : "text-mist/60"}`}
                  >
                    <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] px-7 pb-7 pl-[3.6rem] text-[0.98rem] leading-[1.75] text-mist/80">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
