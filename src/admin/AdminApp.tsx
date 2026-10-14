import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { C } from "../crm/ui";
import { markAdmin } from "../lib/track";

/* Админка: активность на сайте. Данные отдаёт /api/analytics (GET) по паролю ADMIN_PASSWORD. */

type Day = {
  day: string;
  visitors: number;
  events: Record<string, number>;
  paths: Record<string, number>;
  refs: Record<string, number>;
  countries: Record<string, number>;
  devices: Record<string, number>;
};
type Recent = { t: number; event: string; label?: string; path: string; ref: string; country: string; device: string };
type Stats = { days: Day[]; recent: Recent[] };

const PWD_KEY = "torus-admin-pwd";

const PAGES: Record<string, string> = { "/": "Главная", "/crm": "Демо CRM", "/school": "Демо школы", "/otel": "Демо отеля" };
const EVENTS: Record<string, string> = { view: "Просмотр", telegram: "Клик в Telegram", lead: "Заявка с формы", demo: "Вход в демо" };
const DEMOS: Record<string, string> = { crm: "CRM", school: "Школа" };
const COUNTRIES: Record<string, string> = { KG: "Кыргызстан", KZ: "Казахстан", RU: "Россия", UZ: "Узбекистан", TJ: "Таджикистан", US: "США", DE: "Германия", TR: "Турция", AE: "ОАЭ" };

const page = (p: string) => PAGES[p.replace(/\/+$/, "") || "/"] ?? p;

function merge(days: Day[], key: "paths" | "refs" | "countries" | "devices" | "events", norm = (k: string) => k) {
  const out: Record<string, number> = {};
  for (const d of days) for (const [k, v] of Object.entries(d[key])) out[norm(k)] = (out[norm(k)] ?? 0) + v;
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

const sumEvent = (days: Day[], prefix: string) =>
  days.reduce((s, d) => s + Object.entries(d.events).reduce((a, [k, v]) => a + (k === prefix || k.startsWith(prefix + ":") ? v : 0), 0), 0);

async function load(pwd: string): Promise<Stats> {
  const res = await fetch("/api/analytics", { headers: { "x-admin-password": pwd } });
  const body = await res.json().catch(() => ({ error: "Сервер недоступен" }));
  if (!res.ok) throw new Error(body.error ?? `Ошибка ${res.status}`);
  return body;
}

export function AdminApp() {
  const [pwd, setPwd] = useState(() => sessionStorage.getItem(PWD_KEY) ?? "");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh(p = pwd) {
    setBusy(true);
    setError("");
    try {
      setStats(await load(p));
      sessionStorage.setItem(PWD_KEY, p);
      markAdmin();
    } catch (e) {
      setError((e as Error).message);
      if (!stats) sessionStorage.removeItem(PWD_KEY);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (pwd) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) {
    const submit = (e: FormEvent) => { e.preventDefault(); refresh(); };
    return (
      <div className="flex h-full items-center justify-center" style={{ background: C.bg }}>
        <form onSubmit={submit} className="w-[360px] rounded-[20px] border bg-white p-7" style={{ borderColor: C.line }}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] text-[17px] font-bold text-white" style={{ background: C.ink }}>T</span>
            <div>
              <div className="text-[16px] font-semibold">Torus</div>
              <div className="text-[13px]" style={{ color: C.mute }}>Статистика сайта</div>
            </div>
          </div>
          <input
            type="password"
            autoFocus
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Пароль"
            className="h-[44px] w-full rounded-[12px] border px-4 text-[15px] outline-none"
            style={{ borderColor: error ? "#e5536b" : C.line }}
          />
          <div className="mt-2 min-h-[18px] text-[12.5px]" style={{ color: "#d23c55" }}>{error}</div>
          <button disabled={busy || !pwd} className="mt-2 h-[44px] w-full rounded-[12px] text-[14px] font-semibold text-white disabled:opacity-50" style={{ background: C.ink }}>
            {busy ? "Загружаем…" : "Войти"}
          </button>
        </form>
      </div>
    );
  }

  return <Dashboard stats={stats} busy={busy} error={error} onRefresh={() => refresh()} onLogout={() => { sessionStorage.removeItem(PWD_KEY); setPwd(""); setStats(null); }} />;
}

function Dashboard({ stats, busy, error, onRefresh, onLogout }: { stats: Stats; busy: boolean; error: string; onRefresh: () => void; onLogout: () => void }) {
  const [period, setPeriod] = useState<1 | 7 | 30>(7);
  const days = useMemo(() => stats.days.slice(-period), [stats, period]);

  const views = sumEvent(days, "view");
  const visitors = days.reduce((s, d) => s + d.visitors, 0);
  const tg = sumEvent(days, "telegram");
  const leads = sumEvent(days, "lead");
  const demos = sumEvent(days, "demo");
  const max = Math.max(1, ...stats.days.map((d) => d.events.view ?? 0));
  const demoRows = merge(days, "events").filter(([k]) => k.startsWith("demo:")).map(([k, v]) => [DEMOS[k.slice(5)] ?? k.slice(5), v] as [string, number]);

  return (
    <div className="min-h-full overflow-auto" style={{ background: C.bg }}>
      <div className="mx-auto max-w-[1180px] px-5 py-8 md:px-8">
        <header className="mb-7 flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] text-[17px] font-bold text-white" style={{ background: C.ink }}>T</span>
          <div className="mr-auto">
            <div className="text-[20px] font-semibold">Активность на сайте</div>
            <div className="text-[13px]" style={{ color: C.mute }}>Время — Бишкек. Свои визиты из этого браузера не считаются.</div>
          </div>
          <div className="flex rounded-[12px] border bg-white p-1" style={{ borderColor: C.line }}>
            {([1, 7, 30] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className="h-8 rounded-[9px] px-3 text-[13px] font-medium" style={period === p ? { background: C.ink, color: "#fff" } : { color: C.ink2 }}>
                {p === 1 ? "Сегодня" : `${p} дней`}
              </button>
            ))}
          </div>
          <button onClick={onRefresh} disabled={busy} className="h-10 rounded-[12px] border bg-white px-4 text-[13px] font-medium disabled:opacity-50" style={{ borderColor: C.line }}>
            {busy ? "Обновляем…" : "Обновить"}
          </button>
          <button onClick={onLogout} className="h-10 rounded-[12px] px-3 text-[13px]" style={{ color: C.mute }}>Выйти</button>
        </header>
        {error && <div className="mb-5 rounded-[12px] px-4 py-3 text-[13px]" style={{ background: "#fdecef", color: "#b02a43" }}>{error}</div>}

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <Tile label="Просмотры" value={views} />
          <Tile label="Посетители" value={visitors} hint={period > 1 ? "сумма уникальных по дням" : "уникальные"} />
          <Tile label="Клики в Telegram" value={tg} accent />
          <Tile label="Заявки с формы" value={leads} accent />
          <Tile label="Входы в демо" value={demos} />
        </div>

        <Card title="Просмотры за 30 дней">
          <div className="flex h-[150px] items-end gap-[3px]">
            {stats.days.map((d, i) => {
              const v = d.events.view ?? 0;
              const inPeriod = i >= stats.days.length - period;
              return (
                <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                  <div
                    className="w-full rounded-t-[3px] transition-opacity"
                    style={{ height: `${Math.max(v ? 3 : 1, (v / max) * 100)}%`, background: v ? (inPeriod ? C.accent : C.accent2) : C.line }}
                  />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-[8px] px-2.5 py-1.5 text-[12px] text-white group-hover:block" style={{ background: C.ink }}>
                    {fmtDay(d.day)}: {v} просм., {d.visitors} посет.
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[11.5px]" style={{ color: C.mute }}>
            <span>{fmtDay(stats.days[0].day)}</span>
            <span>сегодня</span>
          </div>
        </Card>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Card title="Страницы"><Rows rows={merge(days, "paths", page)} /></Card>
          <Card title="Откуда пришли"><Rows rows={merge(days, "refs")} /></Card>
          <Card title="Страны"><Rows rows={merge(days, "countries", (c) => COUNTRIES[c] ?? c)} /></Card>
          <Card title="Устройства и демо">
            <Rows rows={merge(days, "devices")} />
            {demoRows.length > 0 && <div className="mt-4 border-t pt-4" style={{ borderColor: C.line }}><Rows rows={demoRows.map(([k, v]) => [`Вход: ${k}`, v])} /></div>}
          </Card>
        </div>

        <div className="mt-5">
          <Card title="Последние события">
            {stats.recent.length === 0 ? (
              <Empty />
            ) : (
              <div className="divide-y" style={{ borderColor: C.line }}>
                {stats.recent.map((r, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 text-[13px]">
                    <span className="w-[110px] shrink-0 tabular-nums" style={{ color: C.mute }}>{fmtTime(r.t)}</span>
                    <span className="w-[140px] shrink-0 font-medium" style={r.event !== "view" ? { color: C.accent } : undefined}>
                      {EVENTS[r.event] ?? r.event}{r.label ? ` · ${DEMOS[r.label] ?? r.label}` : ""}
                    </span>
                    <span className="w-[120px] shrink-0">{page(r.path)}</span>
                    <span className="min-w-0 flex-1 truncate" style={{ color: C.ink2 }}>{r.ref}</span>
                    <span style={{ color: C.mute }}>{COUNTRIES[r.country] ?? r.country} · {r.device}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, hint, accent }: { label: string; value: number; hint?: string; accent?: boolean }) {
  return (
    <div className="rounded-[16px] border bg-white p-4" style={{ borderColor: C.line }}>
      <div className="text-[12.5px]" style={{ color: C.mute }}>{label}</div>
      <div className="mt-1 text-[28px] font-semibold tabular-nums" style={accent && value ? { color: C.accent } : undefined}>{value.toLocaleString("ru-RU")}</div>
      {hint && <div className="text-[11.5px]" style={{ color: C.mute }}>{hint}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border bg-white p-5" style={{ borderColor: C.line }}>
      <h2 className="mb-4 text-[14px] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Rows({ rows }: { rows: [string, number][] }) {
  if (!rows.length) return <Empty />;
  const top = rows[0][1];
  return (
    <div className="flex flex-col gap-2">
      {rows.slice(0, 8).map(([k, v]) => (
        <div key={k} className="relative flex items-center justify-between overflow-hidden rounded-[8px] px-3 py-1.5 text-[13px]">
          <div className="absolute inset-y-0 left-0 rounded-[8px]" style={{ width: `${(v / top) * 100}%`, background: C.accentSoft }} />
          <span className="relative truncate pr-3">{k}</span>
          <span className="relative tabular-nums font-medium">{v}</span>
        </div>
      ))}
    </div>
  );
}

const Empty = () => <div className="py-4 text-[13px]" style={{ color: C.mute }}>Пока нет данных</div>;

const fmtDay = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
const fmtTime = (t: number) =>
  new Date(t).toLocaleString("ru-RU", { timeZone: "Asia/Bishkek", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
