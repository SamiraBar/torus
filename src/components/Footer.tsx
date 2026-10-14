import { useState } from "react";
import { SplitReveal } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";
import { TELEGRAM_URL, TELEGRAM_USERNAME } from "../lib/contacts";
import { track } from "../lib/track";

const TELEGRAM = TELEGRAM_URL;

type Status = "idle" | "sending" | "sent" | "error";

/** Заявка уходит на /api/lead (Vercel Function), а оттуда — в Telegram. */
function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("lead");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border border-mist/15 bg-transparent px-4 py-3 text-sm text-mist outline-none transition-colors placeholder:text-fog/60 focus:border-accent/50";

  return (
    <form onSubmit={onSubmit} className="glass flex flex-col gap-4 p-7 text-left md:p-9">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-fog">Оставить заявку</p>
      <input name="name" required maxLength={100} placeholder="Ваше имя" className={field} />
      <input name="contact" required maxLength={120} placeholder="Телефон или Telegram" className={field} />
      <textarea name="task" rows={3} maxLength={2000} placeholder="Коротко о задаче" className={`${field} resize-none`} />
      {/* ловушка для ботов: скрыта от людей */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <button
        type="submit"
        disabled={status === "sending"}
        data-cursor
        className="mt-1 rounded-full border border-accent/60 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-mist transition-colors duration-300 hover:bg-accent/10 disabled:opacity-60"
      >
        {status === "sending" ? "Отправляем…" : status === "sent" ? "Заявка отправлена" : "Отправить заявку"}
      </button>
      {status === "sent" && <p className="text-[0.85rem] text-accent">Спасибо! Ответим в Telegram или по телефону в течение дня.</p>}
      {status === "error" && (
        <p className="text-[0.85rem] text-mist/80">
          Не получилось отправить.{" "}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="link-line text-accent">
            Напишите нам в Telegram
          </a>
          .
        </p>
      )}
      <p className="caption !text-[0.7rem]">Нажимая кнопку, вы соглашаетесь на обработку данных.</p>
    </form>
  );
}

export function Footer() {
  return (
    <footer id="contacts" className="relative flex min-h-screen flex-col justify-between px-6 pt-48 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <p className="eyebrow mb-10">Свяжитесь с нами</p>
          <SplitReveal as="h2" by="chars" stagger={0.03} className="display display-xl">
            Готовы
          </SplitReveal>
          <SplitReveal as="h2" by="chars" stagger={0.03} delay={0.2} className="display display-xl text-stroke">
            начать?
          </SplitReveal>
        </div>

        <div className="mt-20 grid items-start gap-10 md:grid-cols-2">
          {/* контакты */}
          <div className="glass flex flex-col gap-6 p-7 md:p-9">
            <p className="max-w-md text-[0.98rem] leading-[1.7] text-mist/80">
              Расскажите о задаче — предложим решение и оценим стоимость.
              Консультация бесплатная и ни к чему не обязывает.
            </p>
            <Magnetic strength={0.3} className="self-start">
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="glass inline-block rounded-full px-10 py-4 text-[0.72rem] font-medium uppercase tracking-[0.28em] transition-colors duration-300 hover:text-accent"
              >
                Написать в Telegram
              </a>
            </Magnetic>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="link-line self-start text-sm text-mist">
              @{TELEGRAM_USERNAME}
            </a>
          </div>

          {/* форма заявки */}
          <ContactForm />
        </div>
      </div>

      <div className="mx-auto mt-40 w-full max-w-6xl border-t border-mist/10 py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <span className="display text-sm tracking-[0.28em] font-semibold">TORUS</span>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["Услуги", "#features"],
              ["Направления", "#solutions"],
              ["Работы", "#works"],
              ["Цены", "#pricing"],
              ["Контакты", "#contacts"],
              ["Telegram", TELEGRAM],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="link-line text-[0.65rem] uppercase tracking-[0.25em] text-fog hover:text-mist"
              >
                {label}
              </a>
            ))}
          </nav>

          <span className="text-[0.65rem] tracking-[0.2em] text-fog/70">
            © 2026 Torus — разработка и автоматизация бизнеса
          </span>
        </div>
      </div>
    </footer>
  );
}
