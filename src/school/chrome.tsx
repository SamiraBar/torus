import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Icon, I, ease } from "../crm/ui";
import { C, NAVY } from "./theme";
import { useSchool, type Role } from "./store";

/* School-only chrome: deep navy sidebar with a coral active pill, and the
   admin ⇄ student switch. Distinct from the light sidebar of the business CRM. */

type Item<K extends string> = { key: K; icon: string; badge?: number };

export function Sidebar<K extends string>({ items, active, onSelect, footer, onLogout, layoutKey }: { items: Item<K>[]; active: K; onSelect: (k: K) => void; footer?: ReactNode; onLogout?: () => void; layoutKey: string }) {
  return (
    <aside className="flex w-[236px] shrink-0 flex-col px-4 py-6 text-white" style={{ background: NAVY }}>
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-[14px]" style={{ background: C.accent, boxShadow: "0 10px 24px -8px rgba(255,107,61,.7)" }}><Icon d={I.cap} size={21} /></span>
        <div>
          <div className="text-[16px] font-bold leading-tight tracking-[-0.01em]" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>Speak Up</div>
          <div className="text-[11.5px] text-white/50">English School</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const on = it.key === active;
          return (
            <button key={it.key} onClick={() => onSelect(it.key)} className="relative flex items-center gap-3 rounded-[14px] px-3 py-[11px] text-left text-[14px] transition-colors hover:bg-white/5" style={{ color: on ? "#fff" : "rgba(255,255,255,.62)", fontWeight: on ? 600 : 500 }}>
              {on && <motion.span layoutId={layoutKey} className="absolute inset-0 rounded-[14px]" style={{ background: "linear-gradient(90deg, rgba(255,107,61,.95), rgba(255,140,90,.85))", boxShadow: "0 10px 24px -10px rgba(255,107,61,.8)" }} transition={{ duration: 0.35, ease }} />}
              <span className="relative flex items-center gap-3"><Icon d={it.icon} />{it.key}</span>
              {!!it.badge && <span className="relative ml-auto rounded-full bg-white px-2 py-[1px] text-[11px] font-bold" style={{ color: C.accent }}>{it.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto">{footer}</div>
      {onLogout && (
        <button onClick={onLogout} className="mt-3 flex items-center gap-2 px-3 py-2 text-[13px] text-white/50 hover:text-white/80">
          <Icon d={I.logout} size={16} /> Выйти из демо
        </button>
      )}
    </aside>
  );
}

export function RoleSwitch() {
  const { role, setRole, setOpenLessonId, setOpenStudentId, setClassLessonId } = useSchool();
  const opts: [Role, string][] = [["admin", "Администратор"], ["student", "Ученик"]];
  return (
    <div className="flex items-center gap-1 rounded-full p-1 text-[13px]" style={{ background: C.tabsBg }}>
      {opts.map(([r, label]) => (
        <button
          key={r}
          onClick={() => { setOpenLessonId(null); setOpenStudentId(null); setClassLessonId(null); setRole(r); }}
          className="relative rounded-full px-4 py-[7px] font-semibold transition-colors"
          style={{ color: role === r ? "#fff" : C.ink2 }}
        >
          {role === r && <motion.span layoutId="role-pill" className="absolute inset-0 rounded-full" style={{ background: C.ink }} transition={{ duration: 0.35, ease }} />}
          <span className="relative flex items-center gap-2"><Icon d={r === "student" ? I.cap : I.sliders} size={15} />{label}</span>
        </button>
      ))}
    </div>
  );
}
