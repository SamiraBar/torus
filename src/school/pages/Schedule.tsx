import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Avatar, Badge, Btn, Card, CountUp, Drawer, I, Icon, PageHead, Tabs, fmt } from "../../crm/ui";
import { C } from "../theme";
import { dayDates, formatColor, lessons, levelColor, teachers, weekDays, type Format, type Lesson } from "../data";
import { useSchool } from "../store";

export const teacherOf = (id: number) => teachers.find((t) => t.id === id)!;
export const hhmm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

export function FormatBadge({ f }: { f: Format }) {
  return (
    <Badge color={formatColor[f][0]} bg={formatColor[f][1]}>
      {f === "Онлайн" ? "● Онлайн" : "◆ Офлайн"}
    </Badge>
  );
}

/* ---------------- Обзор ---------------- */

export function Overview() {
  const { groups, students, leads, setClassLessonId, setOpenLessonId, notify, go } = useSchool();
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref, { once: true, amount: 0.2 });
  const today = lessons.filter((l) => l.day === 0).sort((a, b) => a.start - b.start);
  const extra = lessons.filter((l) => l.day === 1).sort((a, b) => a.start - b.start).slice(0, 2);
  const timeline = [...today, ...extra].slice(0, 5);
  const ending = students.filter((s) => s.lessonsLeft <= 2).slice(0, 4);
  const online = groups.filter((g) => g.format === "Онлайн").reduce((s, g) => s + g.filled, 0);
  const offline = groups.filter((g) => g.format === "Офлайн").reduce((s, g) => s + g.filled, 0);
  const onlineShare = Math.round((online / (online + offline)) * 100);

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[27px] font-semibold tracking-[-0.02em]">Доброе утро, Speak Up</div>
          <div className="mt-1 text-[14px]" style={{ color: C.mute }}>
            Сегодня {today.length} урока, {leads.filter((l) => l.stage === "Пробный урок").length} пробных занятия и {ending.length} абонемента заканчиваются.
          </div>
        </div>
        <Btn onClick={() => go("Расписание")}><Icon d={I.cal} size={16} /> Расписание недели</Btn>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          ["Активных учеников", 186, "", "+14 за месяц"],
          ["Уроков на неделе", lessons.length * 3, "", "онлайн и офлайн"],
          ["Посещаемость", 92.4, "%", "+2,1 п."],
          ["Выручка, октябрь", 1240000, " с", "+18%"],
        ].map(([l, v, suf, d], i) => (
          <Card key={l as string} className="p-5">
            <div className="text-[13px]" style={{ color: C.mute }}>{l}</div>
            <div className="mt-2 whitespace-nowrap text-[26px] font-semibold tracking-[-0.02em] tabular-nums">
              <CountUp to={v as number} decimals={i === 2 ? 1 : 0} run={run} />
              <span className="text-[18px]" style={{ color: C.mute }}>{suf}</span>
            </div>
            <div className="mt-2 text-[12.5px] font-semibold" style={{ color: C.green }}>{d}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Уроки сегодня и завтра</div>
            <span className="text-[12.5px]" style={{ color: C.mute }}>Пн, 12 октября</span>
          </div>
          {timeline.map((l, i) => {
            const g = groups.find((x) => x.id === l.groupId)!;
            const t = teacherOf(g.teacherId);
            const live = i === 0;
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: run ? 1 : 0, x: run ? 0 : -10 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-4 border-t py-3"
                style={{ borderColor: C.line }}
              >
                <div className="w-[64px] shrink-0">
                  <div className="text-[15px] font-semibold tabular-nums">{hhmm(l.start)}</div>
                  <div className="text-[11.5px]" style={{ color: C.mute }}>{l.day === 0 ? "сегодня" : "завтра"}</div>
                </div>
                <i className="h-10 w-[3px] shrink-0 rounded-full" style={{ background: levelColor[g.level] }} />
                <button onClick={() => setOpenLessonId(l.id)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2 truncate text-[14px] font-semibold">
                    {g.name}
                    <Badge color={levelColor[g.level]} bg={`${levelColor[g.level]}1a`}>{g.level}</Badge>
                  </div>
                  <div className="truncate text-[12.5px]" style={{ color: C.mute }}>{l.topic} · {g.filled} учеников · {g.room}</div>
                </button>
                <span className="flex items-center gap-2 text-[12.5px]" style={{ color: C.ink2 }}><Avatar name={t.name} size={26} />{t.name.split(" ")[0]}</span>
                <FormatBadge f={g.format} />
                {g.format === "Онлайн" ? (
                  <Btn kind={live ? "accent" : "light"} onClick={() => setClassLessonId(l.id)} className="w-[132px]">
                    {live && <i className="h-[7px] w-[7px] animate-pulse rounded-full bg-white" />} {live ? "Идёт урок" : "Онлайн-класс"}
                  </Btn>
                ) : (
                  <Btn kind="light" onClick={() => setOpenLessonId(l.id)} className="w-[132px]">Отметить</Btn>
                )}
              </motion.div>
            );
          })}
        </Card>

        <div className="flex w-[340px] shrink-0 flex-col gap-4">
          <Card className="p-5">
            <div className="mb-3 text-[15px] font-semibold">Формат обучения</div>
            <div className="flex h-[12px] overflow-hidden rounded-full">
              <motion.div style={{ background: C.accent }} initial={{ width: 0 }} animate={{ width: run ? `${onlineShare}%` : 0 }} transition={{ duration: 1 }} />
              <motion.div style={{ background: C.green }} initial={{ width: 0 }} animate={{ width: run ? `${100 - onlineShare}%` : 0 }} transition={{ duration: 1, delay: 0.2 }} />
            </div>
            <div className="mt-3 flex justify-between text-[13px]">
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: C.accent }} />Онлайн · <b>{onlineShare}%</b></span>
              <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: C.green }} />Офлайн · <b>{100 - onlineShare}%</b></span>
            </div>
          </Card>
          <Card className="flex-1 p-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[15px] font-semibold">Заканчиваются абонементы</div>
              <button onClick={() => go("Оплаты")} className="text-[12.5px]" style={{ color: C.accent }}>Все</button>
            </div>
            {ending.map((s) => (
              <div key={s.id} className="flex items-center gap-3 border-t py-[9px] text-[13px]" style={{ borderColor: C.line }}>
                <Avatar name={s.name} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="text-[12px]" style={{ color: s.lessonsLeft === 0 ? C.rose : C.amber }}>{s.lessonsLeft === 0 ? "уроки закончились" : `осталось ${s.lessonsLeft}`}</div>
                </div>
                <button onClick={() => notify("Напоминание отправлено", `${s.name}: ссылка на оплату в WhatsApp`)} className="text-[12.5px] font-semibold" style={{ color: C.accent }}>Напомнить</button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Расписание ---------------- */

const H_START = 9, H_END = 22, ROW = 46;

export function Schedule() {
  const { groups, setOpenLessonId } = useSchool();
  const [fmtF, setFmtF] = useState<"Все" | Format>("Все");
  const [teacher, setTeacher] = useState<number | null>(null);

  const visible = lessons.filter((l) => {
    const g = groups.find((x) => x.id === l.groupId)!;
    return (fmtF === "Все" || g.format === fmtF) && (!teacher || g.teacherId === teacher);
  });

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Расписание" sub="Неделя 12–17 октября · нажмите на урок, чтобы отметить посещаемость или войти в онлайн-класс">
        <Tabs items={["Все", "Онлайн", "Офлайн"] as const} value={fmtF} onChange={setFmtF} />
      </PageHead>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px]" style={{ color: C.mute }}>Преподаватель:</span>
        <button onClick={() => setTeacher(null)} className="rounded-full border px-3 py-[5px] text-[12.5px]" style={!teacher ? { background: C.ink, color: "#fff", borderColor: C.ink } : { borderColor: C.line, background: C.card }}>Все</button>
        {teachers.map((t) => (
          <button key={t.id} onClick={() => setTeacher(teacher === t.id ? null : t.id)} className="flex items-center gap-2 rounded-full border py-[3px] pl-[3px] pr-3 text-[12.5px]" style={teacher === t.id ? { background: C.ink, color: "#fff", borderColor: C.ink } : { borderColor: C.line, background: C.card }}>
            <Avatar name={t.name} size={22} /> {t.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(${weekDays.length}, 1fr)` }}>
          <div className="border-b" style={{ borderColor: C.line }} />
          {weekDays.map((d, i) => (
            <div key={d} className="border-b border-l px-3 py-3 text-[13px]" style={{ borderColor: C.line, background: i === 0 ? C.accentSoft : undefined }}>
              <span className="font-semibold" style={{ color: i === 0 ? C.accent : C.ink }}>{d}</span> <span style={{ color: C.mute }}>{dayDates[i]} окт</span>
            </div>
          ))}
          <div className="relative" style={{ height: (H_END - H_START) * ROW }}>
            {Array.from({ length: H_END - H_START }, (_, i) => (
              <div key={i} className="absolute right-2 text-[11.5px] tabular-nums" style={{ top: i * ROW - 7, color: C.mute }}>{i ? hhmm(H_START + i) : ""}</div>
            ))}
          </div>
          {weekDays.map((_, day) => (
            <div key={day} className="relative border-l" style={{ borderColor: C.line, height: (H_END - H_START) * ROW, background: day === 0 ? "#fafaff" : undefined }}>
              {Array.from({ length: H_END - H_START }, (_, i) => (
                <div key={i} className="absolute inset-x-0 border-t" style={{ top: i * ROW, borderColor: "#f1f1ec" }} />
              ))}
              {visible.filter((l) => l.day === day).map((l) => <LessonBlock key={l.id} l={l} onClick={() => setOpenLessonId(l.id)} />)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LessonBlock({ l, onClick }: { l: Lesson; onClick: () => void }) {
  const { groups } = useSchool();
  const g = groups.find((x) => x.id === l.groupId)!;
  const [col, bg] = formatColor[g.format];
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="absolute inset-x-[6px] overflow-hidden rounded-[10px] border-l-[3px] px-2 py-[6px] text-left transition-shadow hover:shadow-md"
      style={{ top: (l.start - H_START) * ROW + 2, height: l.dur * ROW - 4, background: bg, borderColor: col }}
    >
      <div className="truncate text-[12px] font-semibold" style={{ color: C.ink }}>{g.name}</div>
      <div className="truncate text-[11px]" style={{ color: col }}>{hhmm(l.start)} · {g.level} · {g.room}</div>
      <div className="truncate text-[11px]" style={{ color: C.mute }}>{teacherOf(g.teacherId).name.split(" ")[0]}</div>
    </motion.button>
  );
}

export function LessonDrawer() {
  const { openLessonId, setOpenLessonId, groups, students, attendance, setAttendance, setClassLessonId, notify } = useSchool();
  const l = lessons.find((x) => x.id === openLessonId);
  const g = l && groups.find((x) => x.id === l.groupId)!;
  const list = g ? students.filter((s) => s.groupId === g.id) : [];
  const present = (l && attendance[l.id]) ?? list.map((s) => s.id).filter((id) => id % 5 !== 0);

  return (
    <Drawer open={!!l} onClose={() => setOpenLessonId(null)}>
      {l && g && (
        <div className="flex flex-col gap-6 p-7">
          <div>
            <div className="flex gap-2"><FormatBadge f={g.format} /><Badge color={levelColor[g.level]} bg={`${levelColor[g.level]}1a`}>{g.level}</Badge></div>
            <div className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">{g.name}</div>
            <div className="mt-1 text-[14px]" style={{ color: C.mute }}>{weekDays[l.day]}, {dayDates[l.day]} окт · {hhmm(l.start)}–{hhmm(l.start + l.dur)} · {g.room}</div>
          </div>
          <div className="rounded-[14px] p-4" style={{ background: C.bg }}>
            <div className="text-[12px]" style={{ color: C.mute }}>Тема урока</div>
            <div className="mt-1 text-[15px] font-semibold">{l.topic}</div>
            <div className="mt-3 flex items-center gap-2 text-[13px]"><Avatar name={teacherOf(g.teacherId).name} size={26} />{teacherOf(g.teacherId).name}</div>
          </div>
          {g.format === "Онлайн" && (
            <Btn kind="accent" className="h-[46px]" onClick={() => { setOpenLessonId(null); setClassLessonId(l.id); }}>
              <i className="h-[7px] w-[7px] animate-pulse rounded-full bg-white" /> Войти в онлайн-класс
            </Btn>
          )}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[15px] font-semibold">Посещаемость</div>
              <span className="text-[13px]" style={{ color: C.mute }}>{present.length} из {list.length}</span>
            </div>
            {list.map((s) => {
              const on = present.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => setAttendance((a) => ({ ...a, [l.id]: on ? present.filter((x) => x !== s.id) : [...present, s.id] }))}
                  className="flex w-full items-center gap-3 border-t py-[10px] text-left text-[13.5px]"
                  style={{ borderColor: C.line }}
                >
                  <Avatar name={s.name} size={30} />
                  <span className="flex-1">
                    <span className="block font-medium">{s.name}</span>
                    <span className="block text-[12px]" style={{ color: s.lessonsLeft <= 1 ? C.rose : C.mute }}>осталось уроков: {s.lessonsLeft}</span>
                  </span>
                  <span className="rounded-full px-3 py-[4px] text-[12px] font-semibold" style={on ? { background: C.greenSoft, color: C.green } : { background: C.roseSoft, color: C.rose }}>
                    {on ? "Был" : "Не был"}
                  </span>
                </button>
              );
            })}
            <Btn className="mt-4 w-full" onClick={() => { notify("Посещаемость сохранена", `${g.name}: ${present.length} из ${list.length}. Списано по 1 уроку.`); setOpenLessonId(null); }}>Сохранить и списать уроки</Btn>
          </div>
          <div className="text-[12px]" style={{ color: C.mute }}>Отсутствующим бот отправит запись урока и домашнее задание · {fmt(g.price)} с / месяц</div>
        </div>
      )}
    </Drawer>
  );
}
