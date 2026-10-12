import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Avatar, I, Icon, ThemeProvider, ease } from "../crm/ui";
import { C } from "./theme";
import { teachers } from "./data";
import { SchoolProvider, useSchool, type Page, type Role } from "./store";
import { LessonDrawer, Overview, Schedule } from "./pages/Schedule";
import { Groups, Leads, NewLeadModal, Payments, StudentDrawer, Students, Teachers } from "./pages/People";
import { OnlineClass } from "./OnlineClass";
import { RoleSwitch, Sidebar } from "./chrome";
import { StudentPortal } from "./student/StudentPortal";

const nav: [Page, string][] = [
  ["Обзор", I.home],
  ["Расписание", I.cal],
  ["Ученики", I.clients],
  ["Группы", I.grid],
  ["Преподаватели", "M12 14l9-5-9-5-9 5 9 5zM12 14v7M5 11.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-4.5"],
  ["Заявки", I.deals],
  ["Оплаты", I.finance],
];

const pages: Record<Page, () => JSX.Element> = {
  Обзор: Overview,
  Расписание: Schedule,
  Ученики: Students,
  Группы: Groups,
  Преподаватели: Teachers,
  Заявки: Leads,
  Оплаты: Payments,
};

const ambient = [
  ["Заявка с сайта", "Асель: «Хочу IELTS 6.5 онлайн»"],
  ["Бот записал на пробный", "Сын Гульмиры · Kids · завтра 15:00"],
  ["Оплата через бота", "Айдана Белекова · 4 000 с"],
  ["Напоминание отправлено", "Pre-Intermediate Online · урок через 2 часа"],
];

function AdminShell({ onLogout }: { onLogout?: () => void }) {
  const { page, go, leads, setNewLead, preview } = useSchool();
  const PageView = pages[page];
  const newLeads = leads.filter((l) => l.stage === "Новая заявка").length;

  return (
    <>
      <Sidebar
        items={nav.map(([key, icon]) => ({ key, icon, badge: key === "Заявки" ? newLeads : undefined }))}
        active={page}
        onSelect={go}
        layoutKey={preview ? "school-nav-p" : "school-nav"}
        onLogout={onLogout}
        footer={
          <div className="rounded-[18px] p-4" style={{ background: "rgba(255,255,255,.07)" }}>
            <div className="flex items-center gap-2 text-[13px] font-semibold"><Icon d={I.bot} size={16} /> Бот школы</div>
            <div className="mt-1 text-[12px] leading-snug text-white/55">Записывает на пробные, напоминает об уроках и принимает оплату</div>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-white/70"><i className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#7cf0b0]" />онлайн 24/7</div>
          </div>
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-4 px-8 pb-2 pt-6">
          <div className="flex h-[42px] w-[300px] items-center gap-3 rounded-full border px-4 text-[13.5px]" style={{ background: C.card, borderColor: C.line, color: C.mute }}>
            <Icon d={I.search} size={16} /> Ученик, группа или телефон…
          </div>
          <div className="ml-auto"><RoleSwitch /></div>
          <div className="flex -space-x-2">
            {teachers.slice(0, 3).map((t) => <span key={t.id} className="rounded-full ring-2 ring-white"><Avatar name={t.name} size={34} /></span>)}
          </div>
          <button onClick={() => setNewLead(true)} className="flex items-center gap-2 rounded-full px-5 py-[11px] text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: C.accent, boxShadow: "0 12px 26px -12px rgba(255,107,61,.9)" }}>
            <span className="text-[17px] leading-none">+</span> Заявка
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
    </>
  );
}

function Shell({ onLogout }: { onLogout?: () => void }) {
  const { role, setRole, toasts, setNewLead, setOpenLessonId, setOpenStudentId, setClassLessonId, preview } = useSchool();
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref, { once: true, amount: 0.3 });
  const [amb, setAmb] = useState(-1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenLessonId(null);
      setOpenStudentId(null);
      setClassLessonId(null);
      setNewLead(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpenLessonId, setOpenStudentId, setClassLessonId, setNewLead]);

  // landing preview shows both sides: admin ⇄ student every few seconds
  useEffect(() => {
    if (!preview || !run) return;
    const id = setInterval(() => setRole(role === "admin" ? "student" : "admin"), 9000);
    return () => clearInterval(id);
  }, [preview, run, role, setRole]);

  // ambient "live" events — only for the admin view
  useEffect(() => {
    if (!run || role !== "admin") { setAmb(-1); return; }
    const every = preview ? 4200 : 16000;
    let i = 0;
    const first = setTimeout(() => setAmb(0), preview ? 2400 : 6000);
    const id = setInterval(() => setAmb(++i % ambient.length), every);
    const hide = preview ? undefined : setInterval(() => setAmb(-1), every / 2);
    return () => { clearTimeout(first); clearInterval(id); if (hide) clearInterval(hide); };
  }, [run, preview, role]);

  return (
    <div ref={ref} className="relative flex h-full w-full overflow-hidden text-left" style={{ background: C.bg, color: C.ink, fontFamily: "Inter, sans-serif", textShadow: "none", fontWeight: 400 }}>
      {role === "admin" ? <AdminShell onLogout={onLogout} /> : <StudentPortal onLogout={onLogout} />}

      <LessonDrawer />
      <StudentDrawer />
      <NewLeadModal />
      <OnlineClass />

      <div className="pointer-events-none absolute bottom-7 right-8 z-[80] flex w-[340px] flex-col gap-2">
        <AnimatePresence>
          {[...(amb >= 0 ? [{ id: -1 - amb, title: ambient[amb][0], text: ambient[amb][1] }] : []), ...toasts].map((t) => (
            <motion.div key={t.id} layout className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-white" style={{ background: "#0f1b33", boxShadow: "0 18px 40px -12px rgba(15,27,51,.5)" }} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.45, ease }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(255,107,61,.2)" }}><Icon d={I.bell} size={17} color={C.accent2} /></span>
              <div className="min-w-0"><div className="text-[13px] font-semibold">{t.title}</div><div className="truncate text-[12px] text-white/60">{t.text}</div></div>
              <span className="ml-auto text-[11px] text-white/40">сейчас</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** English-school CRM with an admin view and a student portal. `preview` = miniature on the landing page. */
export function SchoolApp({ preview = false, onLogout, initialRole }: { preview?: boolean; onLogout?: () => void; initialRole?: Role }) {
  return (
    <ThemeProvider value={C}>
      <SchoolProvider preview={preview} initialRole={initialRole}>
        <Shell onLogout={onLogout} />
      </SchoolProvider>
    </ThemeProvider>
  );
}
