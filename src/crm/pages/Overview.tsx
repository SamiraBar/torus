import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Avatar, C, Card, CountUp, Tabs, ease, fmt } from "../ui";
import { stageColor, type Stage } from "../data";
import { useCrm } from "../store";

const periods = ["День", "Неделя", "Месяц", "Год"] as const;
type Period = (typeof periods)[number];

const kpiBase = [
  { label: "Выручка", value: 2480000, suffix: " с", delta: "+18,2%", spark: [8, 10, 9, 13, 12, 15, 18, 17, 21], scale: true },
  { label: "Новые лиды", value: 312, suffix: "", delta: "+24%", spark: [5, 7, 6, 9, 11, 10, 13, 15, 16], scale: true },
  { label: "Конверсия в оплату", value: 27.4, suffix: "%", delta: "+3,1 п.", spark: [10, 11, 10, 12, 13, 12, 14, 14, 15], decimals: 1 },
  { label: "Средний чек", value: 41300, suffix: " с", delta: "+6,8%", spark: [12, 11, 13, 12, 14, 13, 15, 16, 16] },
];
const periodScale: Record<Period, number> = { День: 0.045, Неделя: 0.26, Месяц: 1, Год: 11.4 };

const series: Record<Period, { values: number[]; labels: string[]; unit: string }> = {
  День: { values: [2, 5, 9, 14, 11, 18, 22, 19, 26, 31, 24, 28], labels: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"], unit: "тыс сом · по часам" },
  Неделя: { values: [380, 420, 360, 510, 470, 290, 210], labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], unit: "тыс сом · по дням" },
  Месяц: { values: [1.12, 1.34, 1.28, 1.52, 1.47, 1.71, 1.66, 1.94, 2.08, 2.01, 2.27, 2.48], labels: ["Ноя", "Дек", "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт"], unit: "млн сом · по месяцам" },
  Год: { values: [9.8, 14.6, 21.3, 28.4], labels: ["2023", "2024", "2025", "2026"], unit: "млн сом · по годам" },
};

const sources = [
  { name: "Instagram", share: 38, color: C.accent },
  { name: "Сайт", share: 27, color: C.accent2 },
  { name: "WhatsApp", share: 21, color: C.green },
  { name: "Рекомендации", share: 14, color: C.amber },
];

function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((y, i) => `${(i / (data.length - 1)) * 96},${30 - ((y - min) / (max - min)) * 26}`).join(" ");
  return (
    <svg width="96" height="32" viewBox="0 0 96 32" className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RevenueChart({ run, period }: { run: boolean; period: Period }) {
  const { values, labels } = series[period];
  const W = 700, H = 150, max = Math.max(...values) * 1.08;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - (v / max) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const [lx, ly] = pts[pts.length - 1];
  const last = values[values.length - 1];
  return (
    <svg width="100%" height={H + 26} viewBox={`0 0 ${W} ${H + 26}`} preserveAspectRatio="none" overflow="visible">
      <defs>
        <linearGradient id="crm-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={W} y1={(H / 4) * i + 0.5} y2={(H / 4) * i + 0.5} stroke={C.line} />
      ))}
      <motion.path key={`a-${period}`} d={area} fill="url(#crm-area)" initial={{ opacity: 0 }} animate={{ opacity: run ? 1 : 0 }} transition={{ duration: 1.2, delay: 0.5 }} />
      <motion.path key={`l-${period}`} d={line} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: run ? 1 : 0 }} transition={{ duration: 1.6, ease }} />
      <motion.g key={`p-${period}`} initial={{ opacity: 0 }} animate={{ opacity: run ? 1 : 0 }} transition={{ delay: 1.5 }}>
        <circle cx={lx} cy={ly} r="11" fill={C.accent} opacity="0.15" />
        <circle cx={lx} cy={ly} r="5" fill="#fff" stroke={C.accent} strokeWidth="2.5" />
        <rect x={lx - 106} y={ly - 15} width="84" height="30" rx="8" fill={C.ink} />
        <text x={lx - 64} y={ly + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">
          {last.toLocaleString("ru-RU")}
        </text>
      </motion.g>
      {labels.map((m, i) => (
        <text key={m} x={(i / (labels.length - 1)) * W} y={H + 22} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} fill={C.mute} fontSize="12">
          {m}
        </text>
      ))}
    </svg>
  );
}

function Donut({ run }: { run: boolean }) {
  const r = 62, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
      <circle cx="80" cy="80" r={r} fill="none" stroke={C.line} strokeWidth="18" />
      {sources.map((s, i) => {
        const len = (s.share / 100) * c;
        const off = acc;
        acc += len;
        return (
          <motion.circle key={s.name} cx="80" cy="80" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={`${len - 3} ${c}`} transform="rotate(-90 80 80)"
            initial={{ strokeDashoffset: -off + len }} animate={{ strokeDashoffset: run ? -off : -off + len }} transition={{ duration: 0.9, delay: 0.3 + i * 0.18, ease }} />
        );
      })}
      <text x="80" y="76" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.ink}>312</text>
      <text x="80" y="98" textAnchor="middle" fontSize="12" fill={C.mute}>лидов</text>
    </svg>
  );
}

export function Overview() {
  const { deals, tasks, setTasks, setOpenDealId, go, notify } = useCrm();
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref, { once: true, amount: 0.2 });
  const [period, setPeriod] = useState<Period>("Месяц");

  const shown: Stage[] = ["Новые", "Квалификация", "Предложение", "Оплачено"];
  const today = tasks.filter((t) => t.due === "Сегодня").slice(0, 4);
  const pipeTotal = deals.filter((d) => d.stage !== "Оплачено").reduce((s, d) => s + d.amount, 0);
  const openToday = tasks.filter((t) => t.due === "Сегодня" && !t.done).length;

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[27px] font-semibold tracking-[-0.02em]">Добрый день, Айгерим</div>
          <div className="mt-1 text-[14px]" style={{ color: C.mute }}>
            Сегодня 6 новых заявок и {openToday} {openToday === 1 ? "задача" : "задачи"}. Бот уже ответил всем клиентам за ночь.
          </div>
        </div>
        <Tabs items={periods} value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpiBase.map((k, i) => {
          const v = k.scale ? k.value * periodScale[period] : k.value;
          return (
            <Card key={k.label} className="p-5">
              <div className="text-[13px]" style={{ color: C.mute }}>{k.label}{k.scale ? `, ${period.toLowerCase()}` : ""}</div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <div className="whitespace-nowrap text-[26px] font-semibold tracking-[-0.02em] tabular-nums">
                  <CountUp to={v} decimals={k.decimals} run={run} />
                  <span className="text-[18px]" style={{ color: C.mute }}>{k.suffix}</span>
                </div>
                <Spark data={k.spark} color={i === 0 ? C.accent : C.green} />
              </div>
              <div className="mt-2 flex items-center gap-2 text-[12.5px]">
                <span className="rounded-full px-2 py-[2px] font-semibold" style={{ background: C.greenSoft, color: C.green }}>↑ {k.delta}</span>
                <span style={{ color: C.mute }}>к прошлому периоду</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 px-6 pb-4 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold">Выручка</div>
              <div className="text-[12.5px]" style={{ color: C.mute }}>{series[period].unit}</div>
            </div>
            <div className="flex gap-4 text-[12.5px]" style={{ color: C.mute }}>
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: C.accent }} />Факт</span>
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: C.line }} />План</span>
            </div>
          </div>
          <RevenueChart run={run} period={period} />
        </Card>
        <Card className="w-[330px] shrink-0 p-5">
          <div className="text-[15px] font-semibold">Источники лидов</div>
          <div className="text-[12.5px]" style={{ color: C.mute }}>за октябрь</div>
          <div className="mt-1 flex items-center gap-5">
            <Donut run={run} />
            <div className="flex flex-col gap-3">
              {sources.map((s) => (
                <div key={s.name} className="text-[13px]">
                  <div className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</div>
                  <div className="pl-4 font-semibold">{s.share}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 p-5">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => go("Сделки")} className="text-[15px] font-semibold hover:opacity-70">Воронка продаж →</button>
            <div className="text-[12.5px]" style={{ color: C.mute }}>{deals.length} сделок · {fmt(pipeTotal)} с в работе</div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {shown.map((stage, ci) => {
              const list = deals.filter((d) => d.stage === stage);
              return (
                <div key={stage} className="flex flex-col gap-2 rounded-[14px] p-3" style={{ background: C.bg }}>
                  <div className="flex items-center gap-2 whitespace-nowrap px-1 text-[12.5px] font-semibold">
                    <i className="h-2 w-2 rounded-full" style={{ background: stageColor[stage] }} />
                    {stage}
                    <span className="ml-auto text-[11.5px] font-normal" style={{ color: C.mute }}>{fmt(list.reduce((s, d) => s + d.amount, 0))}</span>
                  </div>
                  {list.slice(0, 2).map((d, di) => (
                    <motion.button
                      key={d.id}
                      onClick={() => setOpenDealId(d.id)}
                      className="rounded-[11px] border px-3 py-[9px] text-left transition-shadow hover:shadow-md"
                      style={{ background: C.card, borderColor: C.line }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: run ? 1 : 0, y: run ? 0 : 10 }}
                      transition={{ delay: 0.5 + ci * 0.12 + di * 0.08, duration: 0.6 }}
                    >
                      <div className="truncate text-[13px] font-medium">{d.title}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[12.5px] font-semibold tabular-nums">{fmt(d.amount)} с</span>
                        <Avatar name={d.manager} size={22} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="flex w-[330px] shrink-0 flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Задачи на сегодня</div>
            <button onClick={() => go("Задачи")} className="text-[12.5px] hover:opacity-70" style={{ color: C.accent }}>Все</button>
          </div>
          <div className="flex flex-col">
            {today.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
                  if (!t.done) notify("Задача выполнена", t.title);
                }}
                className="flex items-center gap-3 border-b py-[9px] text-left text-[13px] last:border-0"
                style={{ borderColor: C.line }}
              >
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border text-[11px] text-white transition-colors" style={t.done ? { background: C.green, borderColor: C.green } : { borderColor: "#cfcfca" }}>
                  {t.done && "✓"}
                </span>
                <span className="truncate" style={t.done ? { color: C.mute, textDecoration: "line-through" } : undefined}>{t.title}</span>
                <span className="ml-auto shrink-0 tabular-nums" style={{ color: C.mute }}>{t.time}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
