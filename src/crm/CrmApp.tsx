import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Avatar, C, I, Icon, ease, fmt } from "./ui";
import { clients, managers } from "./data";
import { CrmProvider, useCrm, type Page } from "./store";
import { Overview } from "./pages/Overview";
import { DealDrawer, Deals, NewDealModal } from "./pages/Deals";
import { ClientDrawer, Clients } from "./pages/Clients";
import { Tasks } from "./pages/Tasks";
import { Stock } from "./pages/Stock";
import { Finance, Integrations, Reports } from "./pages/More";

const nav: [Page, string][] = [
  ["Обзор", I.home],
  ["Сделки", I.deals],
  ["Клиенты", I.clients],
  ["Задачи", I.tasks],
  ["Склад", I.stock],
  ["Финансы", I.finance],
  ["Отчёты", I.reports],
  ["Интеграции", I.plug],
];

const pages: Record<Page, () => JSX.Element> = {
  Обзор: Overview,
  Сделки: Deals,
  Клиенты: Clients,
  Задачи: Tasks,
  Склад: Stock,
  Финансы: Finance,
  Отчёты: Reports,
  Интеграции: Integrations,
};

const leads = [
  ["Новая заявка с сайта", "Ресторан «Navat» · 120 000 с"],
  ["Сообщение в WhatsApp", "Айдана: «Нужна CRM для 3 филиалов»"],
  ["Оплата получена", "«Speak Up» · 75 000 с"],
  ["Лид из Instagram", "Барбершоп «Brodyaga» · запись онлайн"],
];

function GlobalSearch() {
  const { deals, setOpenDealId, setOpenClientId, go } = useCrm();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const d = deals.filter((x) => `${x.title} ${x.contact}`.toLowerCase().includes(s)).slice(0, 4).map((x) => ({ kind: "Сделка", id: x.id, title: x.title, sub: `${fmt(x.amount)} с · ${x.stage}` }));
    const c = clients.filter((x) => `${x.name} ${x.company} ${x.phone}`.toLowerCase().includes(s)).slice(0, 3).map((x) => ({ kind: "Клиент", id: x.id, title: x.name, sub: x.company }));
    return [...d, ...c];
  }, [q, deals]);

  return (
    <div className="relative">
      <label className="flex h-[42px] w-[380px] items-center gap-3 rounded-[12px] border px-4 text-[13.5px]" style={{ background: C.card, borderColor: focus ? C.accent2 : C.line, color: C.mute }}>
        <Icon d={I.search} size={16} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder="Поиск по сделкам, клиентам, задачам…"
          className="min-w-0 flex-1 bg-transparent outline-none"
          style={{ color: C.ink }}
        />
        <span className="rounded-[6px] border px-[6px] text-[11px]" style={{ borderColor: C.line }}>⌘K</span>
      </label>
      <AnimatePresence>
        {focus && q && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 top-[48px] z-50 w-[380px] overflow-hidden rounded-[14px] border p-2" style={{ background: C.card, borderColor: C.line, boxShadow: "0 20px 50px -20px rgba(21,22,26,.3)" }}>
            {results.length ? (
              results.map((r) => (
                <button
                  key={`${r.kind}${r.id}`}
                  onMouseDown={() => {
                    if (r.kind === "Сделка") { go("Сделки"); setTimeout(() => setOpenDealId(r.id)); }
                    else { go("Клиенты"); setTimeout(() => setOpenClientId(r.id)); }
                    setQ("");
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left hover:bg-[#f5f5f2]"
                >
                  <span className="rounded-[6px] px-2 py-[1px] text-[11px] font-semibold" style={{ background: C.accentSoft, color: C.accent }}>{r.kind}</span>
                  <span className="min-w-0"><span className="block truncate text-[13.5px] font-medium" style={{ color: C.ink }}>{r.title}</span><span className="block truncate text-[12px]" style={{ color: C.mute }}>{r.sub}</span></span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-[13px]" style={{ color: C.mute }}>Ничего не найдено</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shell({ onLogout }: { onLogout?: () => void }) {
  const { page, go, tasks, toasts, setNewDeal, setOpenDealId, setOpenClientId, preview } = useCrm();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenDealId(null);
      setOpenClientId(null);
      setNewDeal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpenDealId, setOpenClientId, setNewDeal]);
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref, { once: true, amount: 0.3 });
  const [lead, setLead] = useState(-1);
  const openToday = tasks.filter((t) => t.due === "Сегодня" && !t.done).length;
  const PageView = pages[page];

  // ambient "live" leads: frequent in the landing preview, rare in the demo
  useEffect(() => {
    if (!run) return;
    const every = preview ? 4200 : 16000;
    let i = 0;
    const first = setTimeout(() => setLead(0), preview ? 2600 : 6000);
    const id = setInterval(() => setLead(++i % leads.length), every);
    const hide = preview ? undefined : setInterval(() => setLead(-1), every / 2);
    return () => { clearTimeout(first); clearInterval(id); if (hide) clearInterval(hide); };
  }, [run, preview]);

  return (
    <div ref={ref} className="crm-root relative flex h-full w-full overflow-hidden text-left" style={{ background: C.bg, color: C.ink, fontFamily: "Inter, sans-serif", textShadow: "none", fontWeight: 400 }}>
      <aside className="flex w-[232px] shrink-0 flex-col border-r px-5 py-6" style={{ background: C.card, borderColor: C.line }}>
        <div className="mb-9 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] text-[15px] font-bold text-white" style={{ background: C.ink }}>T</span>
          <div>
            <div className="text-[15px] font-semibold leading-tight">Torus CRM</div>
            <div className="text-[11.5px]" style={{ color: C.mute }}>Рабочее пространство</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map(([label, d]) => {
            const active = page === label;
            return (
              <button
                key={label}
                onClick={() => go(label)}
                className="relative flex items-center gap-3 rounded-[11px] px-3 py-[10px] text-left text-[14px] transition-colors hover:bg-[#f5f5f2]"
                style={active ? { color: C.accent, fontWeight: 600 } : { color: C.ink2 }}
              >
                {active && <motion.span layoutId={preview ? "crm-nav-p" : "crm-nav"} className="absolute inset-0 rounded-[11px]" style={{ background: C.accentSoft }} transition={{ duration: 0.35, ease }} />}
                <span className="relative flex items-center gap-3">
                  <Icon d={d} />
                  {label}
                </span>
                {label === "Задачи" && openToday > 0 && (
                  <span className="relative ml-auto rounded-full px-2 py-[1px] text-[11px] font-semibold text-white" style={{ background: C.rose }}>{openToday}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-[16px] p-4" style={{ background: C.ink, color: "#fff" }}>
          <div className="text-[13px] font-semibold">Автоматизации</div>
          <div className="mt-1 text-[12px] leading-snug text-white/60">14 сценариев работают прямо сейчас</div>
          <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-white/15">
            <motion.div className="h-full rounded-full" style={{ background: C.accent2 }} initial={{ width: 0 }} animate={{ width: run ? "78%" : 0 }} transition={{ duration: 1.6, delay: 0.4 }} />
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="mt-3 flex items-center gap-2 px-3 py-2 text-[13px] hover:opacity-70" style={{ color: C.mute }}>
            <Icon d={I.logout} size={16} /> Выйти из демо
          </button>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-4 px-8 pb-2 pt-6">
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-2 rounded-[12px] border px-4 py-[10px] text-[13.5px]" style={{ background: C.card, borderColor: C.line }}>
            <Icon d={I.cal} size={16} /> Октябрь 2026
          </div>
          <div className="flex -space-x-2">
            {managers.map((m) => <span key={m} className="rounded-full ring-2 ring-white"><Avatar name={m} size={34} /></span>)}
          </div>
          <button onClick={() => setNewDeal(true)} className="flex items-center gap-2 rounded-[12px] px-5 py-[11px] text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: C.ink }}>
            <span className="text-[17px] leading-none">+</span> Новая сделка
          </button>
        </div>

        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 pt-4">
          <AnimatePresence mode="wait">
            <motion.div key={page} className="h-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
              <PageView />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DealDrawer />
      <ClientDrawer />
      <NewDealModal />

      {/* notifications: action toasts + ambient live leads */}
      <div className="pointer-events-none absolute bottom-7 right-8 z-[60] flex w-[340px] flex-col gap-2">
        <AnimatePresence>
          {[...(lead >= 0 ? [{ id: -1 - lead, title: leads[lead][0], text: leads[lead][1] }] : []), ...toasts].map((t) => (
            <motion.div
              key={t.id}
              layout
              className="flex items-center gap-3 rounded-[16px] px-4 py-3 text-white"
              style={{ background: C.ink, boxShadow: "0 18px 40px -12px rgba(21,22,26,.45)" }}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.45, ease }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(154,165,255,.18)" }}>
                <Icon d={I.bell} size={17} color={C.accent2} />
              </span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold">{t.title}</div>
                <div className="truncate text-[12px] text-white/60">{t.text}</div>
              </div>
              <span className="ml-auto text-[11px] text-white/40">сейчас</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Full CRM concept. `preview` = the miniature on the landing page. */
export function CrmApp({ preview = false, onLogout }: { preview?: boolean; onLogout?: () => void }) {
  return (
    <CrmProvider preview={preview}>
      <Shell onLogout={onLogout} />
    </CrmProvider>
  );
}
