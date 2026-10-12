import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Badge, Btn, Card, I, Icon, PageHead, Tabs, Toggle, ease, type IconName } from "../../crm/ui";
import { C } from "../theme";
import { formatColor } from "../data";
import { useSchool } from "../store";
import { RoleSwitch, Sidebar } from "../chrome";
import { documents, groupRating, homework as initialHomework, me, myLessons, skills, teacherNotes, testHistory, units, type MyLesson } from "./data";

type SPage = "Главная" | "Мои уроки" | "Темы и материалы" | "Документы" | "Успеваемость" | "Профиль";

const nav: { key: SPage; icon: string }[] = [
  { key: "Главная", icon: I.home },
  { key: "Мои уроки", icon: I.cal },
  { key: "Темы и материалы", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" },
  { key: "Документы", icon: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6zM14 3v6h6M8 13h8M8 17h5" },
  { key: "Успеваемость", icon: I.reports },
  { key: "Профиль", icon: I.clients },
];

const matIcon = { pdf: I.file, audio: I.headphones, video: I.film, quiz: I.edit } as const;

function FormatPill({ f, where }: { f: MyLesson["format"]; where?: string }) {
  const [col, bg] = formatColor[f];
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full px-3 py-[4px] text-[12px] font-semibold" style={{ color: col, background: bg }}>
      <Icon d={f === "Онлайн" ? I.video : I.building} size={13} /> {f}{where ? ` · ${where}` : ""}
    </span>
  );
}

function Ring({ value, size = 120, stroke = 12, color = C.accent, children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.tabsBg} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.4, ease }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

function useCountdown(start: number) {
  const [s, setS] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------------- Главная ---------------- */

function Home({ go }: { go: (p: SPage) => void }) {
  const { setClassLessonId, notify } = useSchool();
  const next = myLessons.find((l) => l.status === "next")!;
  const soon = myLessons.filter((l) => l.status === "upcoming").slice(0, 3);
  const countdown = useCountdown(2 * 3600 + 14 * 60 + 9);
  const [hw, setHw] = useState(initialHomework);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[28px] font-bold tracking-[-0.02em]" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>Hi, Aidana!</div>
          <div className="mt-1 text-[14px]" style={{ color: C.mute }}>У тебя серия {me.streak} дней подряд. Не прерывай её: сегодня урок в 19:00.</div>
        </div>
        <div className="flex gap-3">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold" style={{ color: C.accent }}><Icon d={I.flame} size={16} /> {me.streak} дней</span>
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold" style={{ color: C.amber }}><Icon d={I.star} size={16} /> {me.points.toLocaleString("ru-RU")} баллов</span>
        </div>
      </div>

      <div className="flex gap-5">
        {/* next lesson hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative min-w-0 flex-1 overflow-hidden p-7 text-white" style={{ borderRadius: C.radius, background: "linear-gradient(135deg, #0f1b33 0%, #24407a 60%, #ff6b3d 140%)" }}>
          <div className="absolute -right-10 -top-10 h-[220px] w-[220px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,107,61,.45), transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/60"><i className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#7cf0b0]" /> Следующий урок</div>
            <div className="mt-3 text-[26px] font-bold leading-tight" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>{next.topic}</div>
            <div className="mt-1 text-[14px] text-white/70">{next.title} · {next.teacher}</div>
            <div className="mt-5 flex items-end gap-8">
              <div>
                <div className="text-[12px] text-white/50">начало через</div>
                <div className="font-mono text-[34px] font-semibold tabular-nums">{countdown}</div>
              </div>
              <div className="pb-2 text-[13px] text-white/70">{next.date}, {next.time}<br /><span className="inline-flex items-center gap-1"><Icon d={I.video} size={13} /> Онлайн · Zoom</span></div>
              <button onClick={() => setClassLessonId(next.classId!)} className="ml-auto flex items-center gap-2 rounded-[14px] px-6 py-3 text-[14px] font-bold" style={{ background: C.accent, boxShadow: "0 14px 30px -10px rgba(255,107,61,.9)" }}>
                Войти в урок <Icon d={I.arrow} size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        <Card className="flex w-[300px] shrink-0 flex-col items-center p-6 text-center">
          <div className="text-[13px] font-semibold" style={{ color: C.mute }}>Мой уровень</div>
          <div className="mt-3"><Ring value={me.levelProgress}><div className="text-[30px] font-bold">B1</div><div className="text-[12px]" style={{ color: C.mute }}>{me.levelProgress}%</div></Ring></div>
          <div className="mt-3 text-[13px]" style={{ color: C.ink2 }}>до уровня <b>B2</b> осталось примерно 2 месяца</div>
          <div className="mt-3 flex w-full justify-between border-t pt-3 text-[12.5px]" style={{ borderColor: C.line }}>
            <span>Посещаемость <b>{me.attendance}%</b></span><span>Уроков <b>{me.lessonsLeft}</b></span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between"><div className="text-[15px] font-bold">Ближайшие занятия</div><button onClick={() => go("Мои уроки")} className="text-[12.5px] font-semibold" style={{ color: C.accent }}>Все</button></div>
          {soon.map((l) => (
            <div key={l.id} className="border-t py-3" style={{ borderColor: C.line }}>
              <div className="flex items-center justify-between text-[13px]"><b>{l.date}, {l.time}</b><FormatPill f={l.format} /></div>
              <div className="mt-1 truncate text-[13px]" style={{ color: C.ink2 }}>{l.title} · {l.topic}</div>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <div className="mb-3 text-[15px] font-bold">Домашнее задание</div>
          {hw.map((h, i) => (
            <button key={h.title} onClick={() => { setHw((all) => all.map((x, j) => (j === i ? { ...x, done: !x.done } : x))); if (!h.done) notify("Задание сдано ✓", `+20 баллов · ${h.title}`); }} className="flex w-full items-start gap-3 border-t py-3 text-left" style={{ borderColor: C.line }}>
              <span className="mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[7px] border text-[12px] text-white" style={h.done ? { background: C.green, borderColor: C.green } : { borderColor: "#c9d2e0" }}>{h.done && "✓"}</span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium" style={h.done ? { color: C.mute, textDecoration: "line-through" } : undefined}>{h.title}</span>
                <span className="text-[12px]" style={{ color: h.done ? C.green : C.accent }}>{h.unit} · {h.done ? "сдано" : h.due}</span>
              </span>
            </button>
          ))}
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between"><div className="text-[15px] font-bold">Рейтинг группы</div><span className="text-[12px]" style={{ color: C.mute }}>октябрь</span></div>
          {groupRating.map(([n, p], i) => {
            const mine = n === me.name;
            return (
              <div key={n} className="flex items-center gap-3 rounded-[12px] px-2 py-2 text-[13px]" style={mine ? { background: C.accentSoft } : undefined}>
                <span className="w-5 text-center font-bold" style={{ color: i === 0 ? C.amber : C.mute }}>{i === 0 ? <Icon d={I.trophy} size={15} /> : i + 1}</span>
                <Avatar name={n} size={28} />
                <span className="flex-1 truncate" style={{ fontWeight: mine ? 700 : 500 }}>{mine ? "Ты" : n}</span>
                <span className="font-semibold tabular-nums">{p}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Мои уроки ---------------- */

function Lessons() {
  const { setClassLessonId, notify } = useSchool();
  const [tab, setTab] = useState<"Предстоящие" | "Прошедшие">("Предстоящие");
  const [fmt, setFmt] = useState<"Все" | MyLesson["format"]>("Все");
  const list = myLessons.filter((l) => (tab === "Предстоящие" ? l.status === "next" || l.status === "upcoming" : l.status === "done" || l.status === "missed") && (fmt === "Все" || l.format === fmt));

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Мои уроки" sub="Групповые и индивидуальные занятия: онлайн в Zoom и офлайн в школе">
        <Tabs items={["Все", "Онлайн", "Офлайн"] as const} value={fmt} onChange={setFmt} />
        <Tabs items={["Предстоящие", "Прошедшие"] as const} value={tab} onChange={setTab} />
      </PageHead>
      <div className="flex flex-col gap-3">
        {list.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="flex items-center gap-5 p-5">
              <div className="w-[96px] shrink-0 rounded-[16px] py-3 text-center" style={{ background: l.status === "next" ? C.accent : C.bg, color: l.status === "next" ? "#fff" : C.ink }}>
                <div className="text-[12px] font-semibold opacity-80">{l.date}</div>
                <div className="text-[22px] font-bold tabular-nums">{l.time}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="text-[16px] font-bold">{l.topic}</span>{l.status === "next" && <Badge>скоро</Badge>}</div>
                <div className="mt-1 text-[13px]" style={{ color: C.mute }}>{l.title} · {l.teacher}</div>
                <div className="mt-2"><FormatPill f={l.format} where={l.where} /></div>
              </div>
              {tab === "Предстоящие" ? (
                l.format === "Онлайн" ? (
                  <Btn kind={l.status === "next" ? "accent" : "light"} onClick={() => setClassLessonId(l.classId!)}><Icon d={I.video} size={15} /> Войти в класс</Btn>
                ) : (
                  <Btn kind="light" onClick={() => notify("Маршрут", "ул. Киевская 77, вход со двора · открыто в 2ГИС")}><Icon d={I.map} size={15} /> Как добраться</Btn>
                )
              ) : (
                <div className="flex items-center gap-4">
                  {l.status === "missed" ? (
                    <Badge color={C.rose} bg={C.roseSoft}>пропуск</Badge>
                  ) : (
                    <div className="text-center"><div className="text-[24px] font-bold" style={{ color: (l.grade ?? 0) >= 9 ? C.green : C.amber }}>{l.grade}/10</div><div className="text-[11px]" style={{ color: C.mute }}>оценка</div></div>
                  )}
                  <Badge color={l.homework === "не сдано" ? C.rose : C.green} bg={l.homework === "не сдано" ? C.roseSoft : C.greenSoft}>ДЗ: {l.homework}</Badge>
                  {l.format === "Онлайн" && <Btn kind="light" onClick={() => notify("Запись урока", `${l.topic} · 1:28:40`)}>▶ Запись</Btn>}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Темы и материалы ---------------- */

function Topics() {
  const { notify } = useSchool();
  const [open, setOpen] = useState(4);
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Темы и материалы" sub="Курс Pre-Intermediate (B1): 7 юнитов, тетради, аудио, видео и тесты" />
      <div className="flex flex-col gap-3">
        {units.map((u) => {
          const isOpen = open === u.n && u.state !== "locked";
          return (
            <Card key={u.n} className="overflow-hidden" style={u.state === "current" ? { borderColor: C.accent2, boxShadow: "0 12px 30px -18px rgba(255,107,61,.6)" } : undefined}>
              <button disabled={u.state === "locked"} onClick={() => setOpen(isOpen ? 0 : u.n)} className="flex w-full items-center gap-4 p-5 text-left" style={{ opacity: u.state === "locked" ? 0.5 : 1 }}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-[17px] font-bold" style={u.state === "done" ? { background: C.greenSoft, color: C.green } : u.state === "current" ? { background: C.accent, color: "#fff" } : { background: C.bg, color: C.mute }}>
                  {u.state === "done" ? "✓" : u.state === "locked" ? <Icon d={I.lock} size={17} /> : u.n}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.mute }}>Unit {u.n}</div>
                  <div className="text-[16px] font-bold">{u.title}</div>
                </div>
                {u.score !== undefined && (
                  <div className="w-[160px]">
                    <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: C.mute }}>{u.state === "current" ? "пройдено" : "тест"}</span><b>{u.score}%</b></div>
                    <div className="h-[6px] overflow-hidden rounded-full" style={{ background: C.tabsBg }}><div className="h-full rounded-full" style={{ width: `${u.score}%`, background: u.state === "current" ? C.accent : C.green }} /></div>
                  </div>
                )}
                {u.state !== "locked" && <span className="text-[18px] transition-transform" style={{ color: C.mute, transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-5 border-t px-5 pb-5 pt-4" style={{ borderColor: C.line }}>
                      <div>
                        <div className="mb-2 text-[13px] font-bold">Темы юнита</div>
                        {u.topics.map((t, i) => (
                          <div key={t} className="flex items-center gap-3 py-[6px] text-[13.5px]">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style={u.state === "done" || i === 0 ? { background: C.greenSoft, color: C.green } : { background: C.bg, color: C.mute }}>{u.state === "done" || i === 0 ? "✓" : i + 1}</span>{t}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="mb-2 text-[13px] font-bold">Материалы</div>
                        {u.materials.map(([name, kind]) => (
                          <button key={name} onClick={() => notify(kind === "quiz" ? "Тест открыт" : "Материал открыт", name)} className="mb-2 flex w-full items-center gap-3 rounded-[14px] border px-3 py-[9px] text-left text-[13px] transition-shadow hover:shadow-sm" style={{ borderColor: C.line }}>
                            <span style={{ color: C.accent }}><Icon d={matIcon[kind]} size={18} /></span><span className="flex-1">{name}</span>
                            <span className="text-[11.5px] font-semibold uppercase" style={{ color: C.accent }}>{kind === "quiz" ? "пройти" : "открыть"}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Документы ---------------- */

function Documents() {
  const { notify } = useSchool();
  const [f, setF] = useState("Все");
  const kinds = ["Все", ...Array.from(new Set(documents.map((d) => d.kind)))];
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Документы" sub="Договор, чеки, сертификаты и результаты тестов всегда под рукой">
        <Tabs items={kinds} value={f} onChange={setF} />
      </PageHead>
      <div className="grid grid-cols-3 gap-4">
        {documents.filter((d) => f === "Все" || d.kind === f).map((d) => (
          <Card key={d.name} className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-14 w-14 items-center justify-center rounded-[18px]" style={{ background: d.kind === "Сертификат" ? C.amberSoft : C.bg, color: d.kind === "Сертификат" ? C.amber : C.ink2 }}><Icon d={I[d.icon as IconName]} size={24} /></span>
              <Badge color={C.ink2} bg={C.bg}>{d.kind}</Badge>
            </div>
            <div>
              <div className="text-[15px] font-bold leading-snug">{d.name}</div>
              <div className="mt-1 text-[12.5px]" style={{ color: C.mute }}>{d.date} · PDF · {d.size}</div>
            </div>
            <div className="mt-auto flex gap-2">
              <Btn kind="light" className="flex-1" onClick={() => notify("Просмотр", d.name)}>Открыть</Btn>
              <Btn className="flex-1" onClick={() => notify("Скачивание", `${d.name}.pdf`)}>Скачать</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Успеваемость ---------------- */

function Progress() {
  const max = 100, W = 520, H = 170;
  const pts = testHistory.map(([, v], i) => [(i / (testHistory.length - 1)) * W, H - (v / max) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  // radar
  const R = 110, cx = 140, cy = 130;
  const ang = (i: number) => (Math.PI * 2 * i) / skills.length - Math.PI / 2;
  const poly = skills.map((s, i) => `${cx + Math.cos(ang(i)) * (R * s.value) / 100},${cy + Math.sin(ang(i)) * (R * s.value) / 100}`).join(" ");

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Успеваемость" sub="Баллы, оценки за уроки, результаты тестов и навыки по 6 направлениям" />
      <div className="grid grid-cols-4 gap-4">
        {([[I.star, "Баллы", me.points.toLocaleString("ru-RU"), "+180 за неделю"], [I.trophy, "Место в группе", `#${me.rank}`, "из 9 учеников"], [I.trend, "Средняя оценка", "9,0", "за последние 10 уроков"], [I.checkCircle, "Посещаемость", `${me.attendance}%`, "1 пропуск за месяц"]] as const).map(([ic, l, v, d]) => (
          <Card key={l} className="p-5">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: C.mute }}><span style={{ color: C.accent }}><Icon d={ic} size={15} /></span>{l}</div>
            <div className="mt-1 text-[28px] font-bold">{v}</div>
            <div className="mt-1 text-[12.5px]" style={{ color: C.green }}>{d}</div>
          </Card>
        ))}
      </div>
      <div className="flex gap-5">
        <Card className="w-[320px] shrink-0 p-5">
          <div className="text-[15px] font-bold">Навыки</div>
          <svg width="280" height="260" viewBox="0 0 280 260" className="mt-2">
            {[0.25, 0.5, 0.75, 1].map((k) => (
              <polygon key={k} points={skills.map((_, i) => `${cx + Math.cos(ang(i)) * R * k},${cy + Math.sin(ang(i)) * R * k}`).join(" ")} fill="none" stroke={C.line} />
            ))}
            <motion.polygon points={poly} fill="rgba(255,107,61,.18)" stroke={C.accent} strokeWidth="2.5" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
            {skills.map((s, i) => (
              <text key={s.name} x={cx + Math.cos(ang(i)) * (R + 18)} y={cy + Math.sin(ang(i)) * (R + 18) + 4} textAnchor="middle" fontSize="11.5" fill={C.ink2} fontWeight="600">{s.name} {s.value}</text>
            ))}
          </svg>
        </Card>
        <Card className="min-w-0 flex-1 p-5">
          <div className="mb-4 flex items-center justify-between"><div className="text-[15px] font-bold">Результаты тестов</div><span className="text-[12.5px]" style={{ color: C.mute }}>от входного теста до сегодня</span></div>
          <svg width="100%" height={H + 30} viewBox={`-10 -10 ${W + 20} ${H + 40}`} preserveAspectRatio="none" overflow="visible">
            {[0, 25, 50, 75, 100].map((v) => <line key={v} x1="0" x2={W} y1={H - (v / max) * H} y2={H - (v / max) * H} stroke={C.line} />)}
            <motion.path d={line} fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease }} />
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="#fff" stroke={C.accent} strokeWidth="2.5" />
                <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>{testHistory[i][1]}</text>
                <text x={x} y={H + 22} textAnchor="middle" fontSize="11.5" fill={C.mute}>{testHistory[i][0]}</text>
              </g>
            ))}
          </svg>
        </Card>
      </div>
      <Card className="p-5">
        <div className="mb-3 text-[15px] font-bold">Комментарии преподавателей</div>
        <div className="grid grid-cols-2 gap-4">
          {teacherNotes.map(([who, text, when]) => (
            <div key={who} className="flex gap-3 rounded-[16px] p-4" style={{ background: C.bg }}>
              <Avatar name={who} size={36} />
              <div><div className="text-[13px] font-bold">{who} <span className="font-normal" style={{ color: C.mute }}>· {when}</span></div><div className="mt-1 text-[13.5px]" style={{ color: C.ink2 }}>{text}</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Профиль ---------------- */

function Profile() {
  const { notify } = useSchool();
  const [prefs, setPrefs] = useState({ remind: true, hw: true, news: false, parent: false });
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Профиль" />
      <div className="flex gap-5">
        <Card className="w-[340px] shrink-0 p-6 text-center">
          <div className="mx-auto w-fit rounded-full p-1" style={{ background: `conic-gradient(${C.accent} ${me.levelProgress}%, ${C.tabsBg} 0)` }}>
            <div className="rounded-full bg-white p-1"><Avatar name={me.name} size={92} /></div>
          </div>
          <div className="mt-4 text-[20px] font-bold">{me.name}</div>
          <div className="text-[13px]" style={{ color: C.mute }}>{me.age} лет · с нами с {me.since}</div>
          <div className="mt-3 flex justify-center gap-2"><Badge>B1 · Pre-Intermediate</Badge><FormatPill f="Онлайн" /></div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {([[I.flame, me.streak, "дней"], [I.star, me.points, "баллов"], [I.trophy, `#${me.rank}`, "в группе"]] as const).map(([e, v, l]) => (
              <div key={l} className="rounded-[14px] py-3" style={{ background: C.bg }}><div className="flex justify-center" style={{ color: C.accent }}><Icon d={e} size={18} /></div><div className="text-[16px] font-bold">{v}</div><div className="text-[11px]" style={{ color: C.mute }}>{l}</div></div>
            ))}
          </div>
          <div className="mt-5 text-left">
            <div className="mb-2 text-[13px] font-bold">Достижения</div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              {([[I.target, "30 уроков"], [I.mic, "Speaking star"], [I.book, "Unit 3 на 95%"], [I.clock, "Без опозданий"]] as const).map(([ic, a]) => <span key={a} className="flex items-center gap-[6px] rounded-full px-3 py-1 font-semibold" style={{ background: C.amberSoft, color: "#9a6200" }}><Icon d={ic} size={13} />{a}</span>)}
            </div>
          </div>
        </Card>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Card className="p-6">
            <div className="mb-4 text-[15px] font-bold">Личные данные</div>
            <div className="grid grid-cols-2 gap-5 text-[13.5px]">
              {[["Телефон", me.phone], ["Email", me.email], ["Группа", me.group], ["Преподаватель", me.teacher], ["Формат", "Онлайн + офлайн-занятия"], ["Цель", "IELTS 6.5 к лету 2027"]].map(([k, v]) => (
                <div key={k}><div className="text-[12px]" style={{ color: C.mute }}>{k}</div><div className="mt-[2px] font-semibold">{v}</div></div>
              ))}
            </div>
          </Card>
          <Card className="flex items-center gap-5 p-6">
            <Ring value={((12 - me.lessonsLeft) / 12) * 100} size={86} stroke={9} color={C.green}><div className="text-[20px] font-bold">{me.lessonsLeft}</div></Ring>
            <div className="flex-1">
              <div className="text-[15px] font-bold">{me.subscription}</div>
              <div className="mt-1 text-[13px]" style={{ color: C.mute }}>Осталось {me.lessonsLeft} из 12 уроков · действует до 30 ноября</div>
            </div>
            <Btn kind="accent" onClick={() => notify("Ссылка на оплату", "Mbank / карта · 4 000 с за 12 уроков")}>Продлить</Btn>
          </Card>
          <Card className="p-6">
            <div className="mb-3 text-[15px] font-bold">Уведомления</div>
            {([["remind", "Напоминать об уроках за 2 часа"], ["hw", "Напоминать о домашнем задании"], ["parent", "Отправлять отчёт родителям"], ["news", "Новости и мероприятия школы"]] as const).map(([k, l]) => (
              <div key={k} className="flex items-center justify-between border-t py-3 text-[13.5px]" style={{ borderColor: C.line }}>
                {l}
                <Toggle on={prefs[k]} onChange={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

const pages: Record<SPage, (p: { go: (p: SPage) => void }) => JSX.Element> = {
  Главная: Home,
  "Мои уроки": Lessons,
  "Темы и материалы": Topics,
  Документы: Documents,
  Успеваемость: Progress,
  Профиль: Profile,
};

export function StudentPortal({ onLogout }: { onLogout?: () => void }) {
  const { preview } = useSchool();
  const [page, setPage] = useState<SPage>("Главная");
  const View = pages[page];
  return (
    <>
      <Sidebar
        items={nav.map((n) => ({ ...n, badge: n.key === "Мои уроки" ? 1 : undefined }))}
        active={page}
        onSelect={setPage}
        layoutKey={preview ? "stu-nav-p" : "stu-nav"}
        onLogout={onLogout}
        footer={
          <div className="rounded-[18px] p-4" style={{ background: "rgba(255,255,255,.07)" }}>
            <div className="flex items-center gap-3"><Avatar name={me.name} size={36} /><div className="min-w-0"><div className="truncate text-[13px] font-semibold">{me.name}</div><div className="text-[11.5px] text-white/50">B1 · {me.points} баллов</div></div></div>
            <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full" style={{ background: C.accent }} initial={{ width: 0 }} animate={{ width: `${me.levelProgress}%` }} transition={{ duration: 1.2 }} /></div>
          </div>
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-4 px-8 pb-2 pt-6">
          <div className="text-[13px]" style={{ color: C.mute }}>Личный кабинет ученика</div>
          <div className="ml-auto"><RoleSwitch /></div>
          <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white" style={{ color: C.ink2 }}><Icon d={I.bell} size={18} /><i className="absolute right-[10px] top-[10px] h-2 w-2 rounded-full" style={{ background: C.accent }} /></span>
        </div>
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 pt-4">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
              <View go={setPage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
