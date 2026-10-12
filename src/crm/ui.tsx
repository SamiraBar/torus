import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";

export const C = {
  bg: "#f5f5f2",
  card: "#ffffff",
  line: "#ebebe6",
  ink: "#15161a",
  ink2: "#4a4b47",
  mute: "#8a8b86",
  accent: "#5b6cff",
  accentSoft: "#eef0ff",
  accent2: "#9aa5ff",
  green: "#17a86b",
  greenSoft: "#e6f6ee",
  amber: "#e59a1a",
  amberSoft: "#fdf3e1",
  rose: "#e5536b",
  roseSoft: "#fdebee",
};

export type Palette = typeof C & { radius: number; tabsBg: string };

/* Shared components read colours from this context, so another product
   (the school CRM) can re-skin them without forking the kit. */
const ThemeCtx = createContext<Palette>({ ...C, radius: 18, tabsBg: "#ebebe6" });
export const ThemeProvider = ThemeCtx.Provider;
export const useC = () => useContext(ThemeCtx);
export const useInputStyle = (): CSSProperties => {
  const t = useC();
  return { borderColor: t.line, color: t.ink, background: t.card };
};

export const ease = [0.22, 1, 0.36, 1] as const;

export const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");
export const som = (n: number) => `${fmt(n)} с`;

export const I = {
  home: "M3 12l9-8 9 8M5 10v10h14V10",
  deals: "M4 7h16M4 12h16M4 17h10",
  clients: "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  tasks: "M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11",
  stock: "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7",
  finance: "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6",
  reports: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  plug: "M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0V7zM12 16v5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  cal: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  bell: "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0",
  x: "M18 6L6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  box: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8",
  check: "M5 12l5 5L20 7",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  logout: "M15 17l5-5-5-5M20 12H9M12 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z",
  card: "M2 6h20v12H2zM2 10h20M6 15h4",
  chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  micOff: "M1 1l22 22M9 9v3a3 3 0 0 0 5.1 2.1M15 9.3V5a3 3 0 0 0-5.9-.6M17 16.9A7 7 0 0 1 5 12v-2M19 10v2a7 7 0 0 1-.1 1.2M12 19v3",
  video: "M23 7l-7 5 7 5V7zM1 5h15v14H1z",
  monitor: "M2 3h20v14H2zM8 21h8M12 17v4",
  hand: "M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0",
  file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6zM14 3v6h6M8 13h8M8 17h5",
  receipt: "M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-1 .7L16 2l-3 2-3-2-3 2-3-2zM8 8h8M8 12h8M8 16h5",
  award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.2 13.9L7 23l5-3 5 3-1.2-9.1",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  bot: "M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M9 13v2M15 13v2",
  cap: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.3 1.3 2.8 2.5 2.8z",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0V2z",
  pin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z",
  film: "M2 2h20v20H2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  building: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16",
  checkCircle: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4L12 14l-3-3",
  trend: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  play: "M5 3l14 9-14 9V3z",
};
export type IconName = keyof typeof I;

export function Icon({ d, size = 18, color = "currentColor", stroke = 1.8 }: { d: string; size?: number; color?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

const avatarColors = ["#5b6cff", "#17a86b", "#e59a1a", "#e5536b", "#7c5cff", "#0ea5b7", "#d9488f"];
export const initialsOf = (name: string) =>
  name.replace(/[«»"]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export function Avatar({ name, size = 26 }: { name: string; size?: number }) {
  const ini = initialsOf(name);
  const color = avatarColors[[...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % avatarColors.length];
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {ini}
    </span>
  );
}

export function Card({ children, className = "", style, onClick }: { children: ReactNode; className?: string; style?: CSSProperties; onClick?: () => void }) {
  const C = useC();
  return (
    <div onClick={onClick} className={`border ${className}`} style={{ background: C.card, borderColor: C.line, borderRadius: C.radius, ...style }}>
      {children}
    </div>
  );
}

export function Badge({ children, color, bg }: { children: ReactNode; color?: string; bg?: string }) {
  const C = useC();
  color ??= C.accent;
  bg ??= C.accentSoft;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-[9px] py-[2px] text-[12px] font-semibold" style={{ color, background: bg }}>
      {children}
    </span>
  );
}

export function Btn({ children, onClick, kind = "dark", className = "", type = "button" }: { children: ReactNode; onClick?: () => void; kind?: "dark" | "light" | "accent"; className?: string; type?: "button" | "submit" }) {
  const C = useC();
  const styles: Record<string, CSSProperties> = {
    dark: { background: C.ink, color: "#fff" },
    accent: { background: C.accent, color: "#fff" },
    light: { background: C.card, color: C.ink, border: `1px solid ${C.line}` },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] px-4 py-[9px] text-[13.5px] font-semibold transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.98] ${className}`}
      style={styles[kind]}
    >
      {children}
    </button>
  );
}

export function Tabs<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  const C = useC();
  return (
    <div className="flex gap-1 rounded-[12px] p-1 text-[13px]" style={{ background: C.tabsBg }}>
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="whitespace-nowrap rounded-[9px] px-4 py-[6px] transition-colors"
          style={t === value ? { background: C.card, fontWeight: 600, boxShadow: "0 1px 2px rgba(0,0,0,.06)", color: C.ink } : { color: C.mute }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, width = 300 }: { value: string; onChange: (v: string) => void; placeholder: string; width?: number }) {
  const C = useC();
  return (
    <label className="flex h-[40px] items-center gap-2 rounded-[12px] border px-3 text-[13.5px]" style={{ background: C.card, borderColor: C.line, width, color: C.mute }}>
      <Icon d={I.search} size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent outline-none" style={{ color: C.ink }} />
    </label>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  const C = useC();
  return (
    <button onClick={onChange} className="relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors" style={{ background: on ? C.green : "#d8d8d2" }}>
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

export function CountUp({ to, decimals = 0, run = true }: { to: number; decimals?: number; run?: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(v, to, { duration: 1.4, ease, onUpdate: setV });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, to]);
  return <>{v.toLocaleString("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  const C = useC();
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[27px] font-semibold tracking-[-0.02em]">{title}</div>
        {sub && <div className="mt-1 text-[14px]" style={{ color: C.mute }}>{sub}</div>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

/** Side panel inside the CRM window. */
export function Drawer({ open, onClose, children, width = 440 }: { open: boolean; onClose: () => void; children: ReactNode; width?: number }) {
  const C = useC();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-40" style={{ background: "rgba(21,22,26,.18)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="absolute bottom-0 right-0 top-0 z-50 flex flex-col overflow-y-auto border-l"
            style={{ width, background: C.card, borderColor: C.line, boxShadow: "-24px 0 60px -30px rgba(21,22,26,.35)" }}
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ duration: 0.45, ease }}
          >
            <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5" style={{ color: C.mute }}>
              <Icon d={I.x} size={16} />
            </button>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const C = useC();
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(21,22,26,.28)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="w-[460px] rounded-[20px] p-6"
            style={{ background: C.card, boxShadow: "0 30px 80px -20px rgba(21,22,26,.4)" }}
            initial={{ y: 20, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="text-[18px] font-semibold">{title}</div>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5" style={{ color: C.mute }}>
                <Icon d={I.x} size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  const C = useC();
  return (
    <label className="flex flex-col gap-[6px] text-[12.5px]" style={{ color: C.mute }}>
      {label}
      {children}
    </label>
  );
}

export const inputCls = "h-[40px] rounded-[11px] border px-3 text-[14px] outline-none focus:border-[#5b6cff]";
export const inputStyle: CSSProperties = { borderColor: C.line, color: C.ink, background: C.card };
