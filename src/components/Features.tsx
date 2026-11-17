import { useRef } from "react";
import gsap from "gsap";
import { SplitReveal, FadeUp } from "../lib/Reveal";

const features = [
  {
    n: "01",
    title: "Сайты и лендинги",
    body: "Быстрые и красивые сайты и посадочные страницы, которые превращают трафик в заявки.",
  },
  {
    n: "02",
    title: "Чат-боты и AI-ассистенты",
    body: "Боты в Telegram, WhatsApp и на сайте: принимают заявки, отвечают клиентам и экономят время менеджеров.",
  },
  {
    n: "03",
    title: "CRM для бизнеса",
    body: "Настраиваем и разрабатываем CRM: клиенты, сделки и задачи в одном окне — ничего не теряется.",
  },
  {
    n: "04",
    title: "Складской учёт",
    body: "Точный учёт товаров, остатков и поставок — без Excel, пересорта и ручных сверок.",
  },
  {
    n: "05",
    title: "Маркетплейсы",
    body: "Магазины и автоматизация продаж на Wildberries, Ozon и в вашем интернет-магазине.",
  },
  {
    n: "06",
    title: "Интеграции",
    body: "Связываем 1С, платёжки, доставку и мессенджеры в единую систему, где данные ходят сами.",
  },
  {
    n: "07",
    title: "Автоматизация процессов",
    body: "Автоворонки, уведомления и отчёты вместо ручной рутины и бесконечного копипаста.",
  },
  {
    n: "08",
    title: "Аналитика и дашборды",
    body: "Сводим данные бизнеса в наглядные дашборды — решения на цифрах, а не на ощущениях.",
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
    gsap.to(sheen.current, { x: x - 110, y: y - 110, duration: 0.5, ease: "power2.out", opacity: 1 });
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
    <FadeUp delay={delay} className="h-full [perspective:900px]">
      <div
        ref={ref}
        data-cursor
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass group relative flex h-full flex-col overflow-hidden p-6 transition-colors duration-500 will-change-transform md:p-7"
      >
        <div
          ref={sheen}
          className="pointer-events-none absolute h-[220px] w-[220px] rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(242,241,238,0.09) 0%, transparent 65%)" }}
        />
        <span className="text-[0.65rem] tracking-[0.3em] text-fog">{n}</span>
        <h3 className="display mt-8 text-xl font-medium md:text-[1.35rem] md:leading-snug">{title}</h3>
        <p className="caption mt-3 flex-1 !text-[0.85rem] !leading-relaxed">{body}</p>
        <span className="mt-6 block h-px w-8 bg-accent/70 transition-all duration-700 group-hover:w-full" />
      </div>
    </FadeUp>
  );
}

export function Features() {
  return (
    <section id="features" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-[1320px]">
        <p className="eyebrow mb-6">Услуги</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[16ch]">
          Всё, что нужно бизнесу онлайн.
        </SplitReveal>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Card key={f.n} {...f} delay={(i % 4) * 0.08} />
          ))}
        </div>

        <FadeUp delay={0.1}>
          <p className="caption mt-14 !max-w-3xl">
            А ещё — личные кабинеты, веб- и мобильные приложения, доработка и
            перенос вашего текущего софта. Не нашли свою задачу?{" "}
            <a href="#contacts" className="link-line text-mist">Напишите нам</a> — разберёмся.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
