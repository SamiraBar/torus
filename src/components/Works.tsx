import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { SplitReveal, FadeUp } from "../lib/Reveal";
import { BrowserFrame, ScaledStage, STAGE_W, STAGE_H } from "./works/BrowserFrame";
import { CrmApp } from "../crm/CrmApp";
import { SchoolApp } from "../school/SchoolApp";
import { ChatShowcase } from "./works/ChatShowcase";
import { MarketShowcase } from "./works/MarketShowcase";

const DEMO_URL = "/otel/";

const ease = [0.22, 1, 0.36, 1] as const;

/** The real hotel system, running live in the card (read-only preview mode).
 *  The iframe mounts only once the card is close to the viewport. */
function HotelPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "400px 0px" });
  const [loaded, setLoaded] = useState(false);
  return (
    <div ref={ref} className="h-full w-full bg-[#f4f5f7]">
      {near && (
        <iframe
          src={`${DEMO_URL}?preview`}
          title="Garnet — система управления отелем"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0 transition-opacity duration-700"
          style={{ pointerEvents: "none", opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}

type WorkProps = {
  num: string;
  tag: string;
  title: string;
  lead: string;
  url: string;
  preview: ReactNode;
  hoverLabel: string;
  onOpen: () => void;
  children?: ReactNode;
};

function WorkCard({ num, tag, title, lead, url, preview, hoverLabel, onOpen, children }: WorkProps) {
  return (
    // width follows viewport height: frame (16:9) + caption must fit on one screen
    <article className="work-card mx-auto" style={{ maxWidth: "min(100%, calc((100vh - 13rem) * 16 / 9))" }}>
      <div
        role="button"
        tabIndex={0}
        data-cursor
        onClick={onOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
        className="group relative block cursor-pointer"
      >
        <BrowserFrame url={url} live>
          <div className="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.015]">
            <ScaledStage>
              <div className="pointer-events-none h-full w-full">{preview}</div>
            </ScaledStage>
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-ink/55 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-8">
            <span className="flex items-center gap-3 rounded-full bg-mist px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.25em] text-ink">
              {hoverLabel}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </span>
          </div>
        </BrowserFrame>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <span className="display text-sm text-fog">{num}</span>
            <span className="eyebrow !tracking-[0.3em]">{tag}</span>
          </div>
          <h3 className="display mt-4 text-3xl font-medium md:text-[2.1rem]">{title}</h3>
        </div>
        <div className="md:col-span-7">
          <p className="!max-w-none text-[0.95rem] leading-[1.75] text-mist/75">{lead}</p>
          {children}
        </div>
      </div>
    </article>
  );
}

/** Fullscreen viewer for a preview — the CRM concept fills the screen at its native proportions. */
function Viewer({ open, onClose, url, children }: { open: boolean; onClose: () => void; url: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // portal: <main> is its own stacking context (z-10), the viewer must sit above the nav
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-xl md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <motion.div
            className="relative"
            style={{ width: `min(100%, calc((100vh - 7rem) * ${STAGE_W / STAGE_H}))` }}
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <BrowserFrame url={url} live>
              <ScaledStage>
                <div className="pointer-events-none h-full w-full">{children}</div>
              </ScaledStage>
            </BrowserFrame>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute -top-11 right-0 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-fog transition-colors hover:text-mist"
            >
              Закрыть
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-mist/15">✕</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Works() {
  const [open, setOpen] = useState<"hotel" | "crm" | "school" | "bot" | "market" | null>(null);
  const close = () => setOpen(null);

  return (
    <section id="works" className="relative px-6 py-40 md:px-12">
      <div className="works-backdrop" aria-hidden />
      <div className="relative mx-auto max-w-[1320px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-6">Работы</p>
            <SplitReveal as="h2" by="chars" className="display display-lg max-w-[14ch]">
              Живые системы, а не картинки.
            </SplitReveal>
          </div>
          <FadeUp>
            <p className="caption md:text-right">
              Не макеты, а работающие продукты. Демо-доступ открываем по запросу: напишите нам, и мы пришлём ссылку.
            </p>
          </FadeUp>
        </div>

        <div className="mt-24 space-y-36">
          <FadeUp>
            <WorkCard
              num="01"
              tag="PMS · Гостиничный бизнес"
              title="Система управления отелем"
              lead="Шахматка номеров на месяц, заселение и выселение, база гостей с документами, питание, уборка и прачечная, персонал с авансами, доходы и расходы по дереву категорий, отчёты в PDF и Excel. Ресепшн и бухгалтерия работают в одной системе вместо тетрадей и таблиц."
              url="hotel.torus.dev"
              hoverLabel="Смотреть"
              preview={<HotelPreview />}
              onOpen={() => setOpen("hotel")}
            />
          </FadeUp>

          <FadeUp>
            <WorkCard
              num="02"
              tag="CRM · Продажи и сервис"
              title="CRM для бизнеса"
              lead="Заявки с сайта, Instagram и WhatsApp сразу попадают в воронку. Менеджер видит сделки, задачи и историю клиента, руководитель видит выручку и конверсию в реальном времени, а рутину вроде напоминаний, счетов и ответов ночью берут на себя автоматизации."
              url="crm.torus.dev"
              hoverLabel="Смотреть"
              preview={<CrmApp preview />}
              onOpen={() => setOpen("crm")}
            />
          </FadeUp>

          <FadeUp>
            <WorkCard
              num="03"
              tag="CRM · Образование"
              title="CRM для школы английского"
              lead="Два кабинета в одной системе. Администратор: онлайн- и офлайн-уроки в одном расписании, группы по уровням от A1 до IELTS, посещаемость в один клик и автосписание уроков из абонемента. Онлайн-класс с доской, чатом и записью урока, прогресс каждого ученика и отчёт родителям. Ученик: свои уроки, темы и материалы, документы, баллы и рейтинг в группе, вход в онлайн-класс в один клик."
              url="school.torus.dev"
              hoverLabel="Смотреть"
              preview={<SchoolApp preview />}
              onOpen={() => setOpen("school")}
            />
          </FadeUp>

          <FadeUp>
            <WorkCard
              num="04"
              tag="Чат-боты · AI-ассистент"
              title="Бот для записи и напоминаний"
              lead="Клиент пишет как обычно, бот понимает запрос, предлагает свободное время из CRM и сам записывает. Накануне напоминает о визите, после визита просит отзыв. Работает в WhatsApp, Telegram и Instagram круглосуточно, а администратор подключается только когда действительно нужен."
              url="bot.torus.dev"
              hoverLabel="Смотреть"
              preview={<ChatShowcase />}
              onOpen={() => setOpen("bot")}
            />
          </FadeUp>

          <FadeUp>
            <WorkCard
              num="05"
              tag="E-commerce · Маркетплейсы"
              title="Torus Marketplace"
              lead="Собственный маркетплейс вместо чужих площадок: каталог с поиском и фильтрами, хиты и новинки, избранное, корзина и онлайн-оплата, личный кабинет и чат с покупателем. На телефоне работает как приложение, с нижним меню и тёмной темой. Товары, цены и остатки подтягиваются из учётной системы автоматически."
              url="market.torus.dev"
              hoverLabel="Смотреть"
              preview={<MarketShowcase />}
              onOpen={() => setOpen("market")}
            />
          </FadeUp>
        </div>
      </div>

      <Viewer open={open === "hotel"} onClose={close} url="hotel.torus.dev">
        <HotelPreview />
      </Viewer>
      <Viewer open={open === "crm"} onClose={close} url="crm.torus.dev">
        <CrmApp preview />
      </Viewer>
      <Viewer open={open === "school"} onClose={close} url="school.torus.dev">
        <SchoolApp preview />
      </Viewer>
      <Viewer open={open === "bot"} onClose={close} url="bot.torus.dev">
        <ChatShowcase />
      </Viewer>
      <Viewer open={open === "market"} onClose={close} url="market.torus.dev">
        <MarketShowcase />
      </Viewer>
    </section>
  );
}
