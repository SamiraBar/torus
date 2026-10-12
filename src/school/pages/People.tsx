import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, Badge, Btn, Card, Drawer, Field, I, Icon, Modal, PageHead, SearchInput, Tabs, fmt, inputCls, useInputStyle } from "../../crm/ui";
import { C } from "../theme";
import { leadColor, leadStages, levelColor, teachers, type Format, type LeadStage, type Level } from "../data";
import { useSchool } from "../store";
import { FormatBadge, teacherOf } from "./Schedule";

const levels: ("Все" | Level)[] = ["Все", "A1", "A2", "B1", "B2", "C1", "IELTS"];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-[6px] overflow-hidden rounded-full" style={{ background: "#ecece7" }}>
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} />
    </div>
  );
}

/* ---------------- Ученики ---------------- */

export function Students() {
  const { students, groups, setOpenStudentId } = useSchool();
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState<"Все" | Level>("Все");
  const [f, setF] = useState<"Все" | Format>("Все");
  const list = students.filter((s) => (lvl === "Все" || s.level === lvl) && (f === "Все" || s.format === f) && (!q || `${s.name} ${s.phone}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Ученики" sub={`${list.length} из ${students.length} · прогресс, посещаемость и остаток уроков по каждому`}>
        <SearchInput value={q} onChange={setQ} placeholder="Имя или телефон" width={240} />
        <Tabs items={["Все", "Онлайн", "Офлайн"] as const} value={f} onChange={setF} />
      </PageHead>
      <div className="flex"><Tabs items={levels} value={lvl} onChange={setLvl} /></div>
      <Card className="overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="text-[12px] uppercase tracking-[0.06em]" style={{ color: C.mute, background: "#fafaf8" }}>
              {["Ученик", "Уровень", "Группа", "Формат", "Прогресс", "Посещаемость", "Уроков", "Оплата"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const g = groups.find((x) => x.id === s.groupId)!;
              return (
                <tr key={s.id} onClick={() => setOpenStudentId(s.id)} className="cursor-pointer border-t hover:bg-[#fafaf8]" style={{ borderColor: C.line }}>
                  <td className="px-4 py-3"><span className="flex items-center gap-3"><Avatar name={s.name} size={30} /><span><span className="block font-semibold">{s.name}</span><span className="block text-[12px]" style={{ color: C.mute }}>{s.age} лет{s.parent ? ` · ${s.parent}` : ""}</span></span></span></td>
                  <td className="px-4 py-3"><Badge color={levelColor[s.level]} bg={`${levelColor[s.level]}1a`}>{s.level}</Badge></td>
                  <td className="px-4 py-3" style={{ color: C.ink2 }}>{g.name}</td>
                  <td className="px-4 py-3"><FormatBadge f={s.format} /></td>
                  <td className="w-[130px] px-4 py-3"><Bar value={s.progress} color={levelColor[s.level]} /><span className="text-[11.5px]" style={{ color: C.mute }}>{s.progress}% уровня</span></td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: s.attendance < 80 ? C.rose : C.ink }}>{s.attendance}%</td>
                  <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: s.lessonsLeft <= 2 ? C.rose : C.ink }}>{s.lessonsLeft}</td>
                  <td className="px-4 py-3">{s.paid ? <Badge color={C.green} bg={C.greenSoft}>оплачено</Badge> : <Badge color={C.rose} bg={C.roseSoft}>долг</Badge>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function StudentDrawer() {
  const { openStudentId, setOpenStudentId, students, setStudents, groups, setPayments, notify } = useSchool();
  const s = students.find((x) => x.id === openStudentId);
  const g = s && groups.find((x) => x.id === s.groupId)!;

  return (
    <Drawer open={!!s} onClose={() => setOpenStudentId(null)}>
      {s && g && (
        <div className="flex flex-col gap-6 p-7">
          <div className="flex items-center gap-4">
            <Avatar name={s.name} size={60} />
            <div>
              <div className="text-[21px] font-semibold tracking-[-0.02em]">{s.name}</div>
              <div className="text-[13.5px]" style={{ color: C.mute }}>{s.age} лет · учится с {s.since}</div>
              <div className="mt-2 flex gap-2"><Badge color={levelColor[s.level]} bg={`${levelColor[s.level]}1a`}>{s.level}</Badge><FormatBadge f={s.format} /></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["Прогресс", `${s.progress}%`], ["Посещаемость", `${s.attendance}%`], ["Осталось уроков", String(s.lessonsLeft)]].map(([k, v]) => (
              <div key={k} className="rounded-[14px] p-3" style={{ background: C.bg }}>
                <div className="text-[11.5px]" style={{ color: C.mute }}>{k}</div>
                <div className="mt-1 text-[20px] font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 text-[15px] font-semibold">Путь по уровням</div>
            <div className="flex gap-1">
              {(["A1", "A2", "B1", "B2", "C1"] as Level[]).map((lv) => {
                const order = ["A1", "A2", "B1", "B2", "C1", "IELTS"];
                const done = order.indexOf(lv) < order.indexOf(s.level);
                const cur = lv === s.level;
                return (
                  <div key={lv} className="flex-1">
                    <div className="h-[8px] overflow-hidden rounded-full" style={{ background: "#ecece7" }}>
                      <div className="h-full rounded-full" style={{ width: done ? "100%" : cur ? `${s.progress}%` : 0, background: levelColor[lv] }} />
                    </div>
                    <div className="mt-1 text-center text-[11.5px]" style={{ color: cur ? C.ink : C.mute, fontWeight: cur ? 700 : 400 }}>{lv}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[13.5px]">
            {[["Группа", g.name], ["Преподаватель", teacherOf(g.teacherId).name], ["Расписание", `${g.days}, ${g.time}`], ["Где", g.room], ["Телефон", s.phone], ["Контакт", s.parent ?? "сам ученик"]].map(([k, v]) => (
              <div key={k}><div className="text-[12px]" style={{ color: C.mute }}>{k}</div><div className="mt-[2px] font-medium">{v}</div></div>
            ))}
          </div>
          <div>
            <div className="mb-2 text-[15px] font-semibold">Последние тесты</div>
            {[["Unit 6 · Grammar", 86], ["Speaking assessment", 78], ["Vocabulary quiz", 92]].map(([t, v]) => (
              <div key={t as string} className="flex items-center gap-3 border-t py-2 text-[13px]" style={{ borderColor: C.line }}>
                <span className="flex-1">{t}</span>
                <span className="w-[120px]"><Bar value={v as number} color={C.accent} /></span>
                <span className="w-[40px] text-right font-semibold">{v}%</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn kind="accent" onClick={() => {
              setStudents((all) => all.map((x) => (x.id === s.id ? { ...x, lessonsLeft: x.lessonsLeft + 12, paid: true } : x)));
              setPayments((p) => [{ id: Date.now(), student: s.name, what: `Абонемент 12 уроков · ${g.name}`, amount: g.price, date: "12 окт", method: "Mbank" }, ...p]);
              notify("Абонемент продлён", `${s.name}: +12 уроков · ${fmt(g.price)} с`);
            }}><Icon d={I.plus} size={15} /> Продлить абонемент</Btn>
            <Btn kind="light" onClick={() => notify("WhatsApp", `Открыт чат с ${s.parent ?? s.name}`)}><Icon d={I.chat} size={15} /> Написать</Btn>
            <Btn kind="light" onClick={() => notify("Отчёт отправлен", `Отчёт о прогрессе за месяц → ${s.parent ?? s.name}`)}><Icon d={I.mail} size={15} /> Отчёт родителю</Btn>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/* ---------------- Группы ---------------- */

export function Groups() {
  const { groups, setGroups, notify } = useSchool();
  const [f, setF] = useState<"Все" | Format>("Все");
  const list = groups.filter((g) => f === "Все" || g.format === f);
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Группы" sub={`${groups.length} групп · ${groups.reduce((s, g) => s + g.filled, 0)} учеников · свободно мест: ${groups.reduce((s, g) => s + g.seats - g.filled, 0)}`}>
        <Tabs items={["Все", "Онлайн", "Офлайн"] as const} value={f} onChange={setF} />
      </PageHead>
      <div className="grid grid-cols-4 gap-4">
        {list.map((g) => {
          const t = teacherOf(g.teacherId);
          const full = g.filled >= g.seats;
          return (
            <Card key={g.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <Badge color={levelColor[g.level]} bg={`${levelColor[g.level]}1a`}>{g.level}</Badge>
                <FormatBadge f={g.format} />
              </div>
              <div className="text-[16px] font-semibold leading-tight">{g.name}</div>
              <div className="text-[12.5px]" style={{ color: C.mute }}>{g.days} · {g.time} · {g.room}</div>
              <div className="flex items-center gap-2 text-[13px]"><Avatar name={t.name} size={24} />{t.name}</div>
              <div>
                <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: C.mute }}>Заполнено</span><span className="font-semibold" style={{ color: full ? C.rose : C.ink }}>{g.filled}/{g.seats}</span></div>
                <Bar value={(g.filled / g.seats) * 100} color={full ? C.rose : levelColor[g.level]} />
              </div>
              <div className="mt-auto flex items-center justify-between pt-1">
                <span className="text-[14px] font-semibold">{fmt(g.price)} с<span className="text-[12px] font-normal" style={{ color: C.mute }}> / мес</span></span>
                <button
                  disabled={full}
                  onClick={() => { setGroups((all) => all.map((x) => (x.id === g.id ? { ...x, filled: x.filled + 1 } : x))); notify("Ученик записан", `${g.name}: ${g.filled + 1}/${g.seats}`); }}
                  className="rounded-[10px] px-3 py-[6px] text-[12.5px] font-semibold"
                  style={full ? { background: "#f0f0ec", color: C.mute } : { background: C.ink, color: "#fff" }}
                >
                  {full ? "Мест нет" : "+ Записать"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Преподаватели ---------------- */

export function Teachers() {
  const { groups } = useSchool();
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Преподаватели" sub="Нагрузка, рейтинг от учеников и зарплата считаются автоматически по проведённым урокам" />
      <div className="grid grid-cols-3 gap-4">
        {teachers.map((t, i) => {
          const mine = groups.filter((g) => g.teacherId === t.id);
          return (
            <Card key={t.id} className="p-5">
              <div className="flex items-center gap-4">
                <Avatar name={t.name} size={52} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[16px] font-semibold">{t.name}{t.native && <Badge color={C.amber} bg={C.amberSoft}>Native</Badge>}</div>
                  <div className="text-[12.5px]" style={{ color: C.mute }}>{t.langs}</div>
                  <div className="mt-1 text-[13px] font-semibold" style={{ color: C.amber }}>★ {t.rating.toFixed(1)}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["Часов/нед", t.hours], ["Групп", mine.length], ["Учеников", mine.reduce((s, g) => s + g.filled, 0)]].map(([k, v]) => (
                  <div key={k as string} className="rounded-[12px] py-2" style={{ background: C.bg }}>
                    <div className="text-[18px] font-semibold">{v}</div>
                    <div className="text-[11px]" style={{ color: C.mute }}>{k}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: C.mute }}>Загрузка</span><span className="font-semibold">{Math.round((t.hours / 32) * 100)}%</span></div>
                <Bar value={(t.hours / 32) * 100} color={i % 2 ? C.green : C.accent} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-3 text-[13px]" style={{ borderColor: C.line }}>
                <span className="flex gap-2">{t.online && <FormatBadge f="Онлайн" />}{t.offline && <FormatBadge f="Офлайн" />}</span>
                <span><span style={{ color: C.mute }}>к выплате </span><b className="tabular-nums">{fmt(t.hours * 4 * t.rate)} с</b></span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Заявки ---------------- */

export function Leads() {
  const { leads, setLeads, notify, setNewLead } = useSchool();
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<LeadStage | null>(null);
  return (
    <div className="flex h-full flex-col gap-5">
      <PageHead title="Заявки" sub="Путь ученика от заявки до оплаты · перетаскивайте карточки между этапами">
        <Btn onClick={() => setNewLead(true)}><Icon d={I.plus} size={16} /> Заявка</Btn>
      </PageHead>
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-3">
        {leadStages.map((st) => {
          const col = leads.filter((l) => l.stage === st);
          return (
            <div
              key={st}
              onDragOver={(e) => { e.preventDefault(); setOver(st); }}
              onDragLeave={() => setOver((o) => (o === st ? null : o))}
              onDrop={() => {
                const l = leads.find((x) => x.id === drag);
                if (l && l.stage !== st) {
                  setLeads((all) => all.map((x) => (x.id === l.id ? { ...x, stage: st } : x)));
                  notify(st === "Оплачено" ? "Новый ученик" : st === "Пробный урок" ? "Пробный урок назначен" : "Этап изменён", `${l.name} → ${st}`);
                }
                setDrag(null);
                setOver(null);
              }}
              className="flex flex-col gap-2 rounded-[16px] p-3 transition-colors"
              style={{ background: over === st ? C.accentSoft : "#ecece7", outline: over === st ? `2px dashed ${C.accent2}` : "none" }}
            >
              <div className="flex items-center gap-2 px-1 pb-1 text-[13px] font-semibold">
                <i className="h-2 w-2 rounded-full" style={{ background: leadColor[st] }} />{st}
                <span className="rounded-full bg-white px-2 text-[11.5px] font-medium" style={{ color: C.mute }}>{col.length}</span>
              </div>
              {col.map((l) => (
                <motion.div layout key={l.id} draggable onDragStart={() => setDrag(l.id)} onDragEnd={() => setDrag(null)} className="cursor-grab rounded-[12px] border p-3 active:cursor-grabbing" style={{ background: C.card, borderColor: C.line, opacity: drag === l.id ? 0.4 : 1 }}>
                  <div className="text-[13.5px] font-semibold">{l.name}</div>
                  <div className="mt-[2px] text-[12px]" style={{ color: C.mute }}>{l.goal}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <FormatBadge f={l.format} />
                    <span className="text-[11.5px]" style={{ color: C.mute }}>{l.source}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 border-t pt-2 text-[11.5px]" style={{ borderColor: C.line, color: C.mute }}><Icon d={I.cal} size={13} />{l.when}</div>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function NewLeadModal() {
  const { newLead, setNewLead, setLeads, notify, go } = useSchool();
  const [form, setForm] = useState({ name: "", goal: "", format: "Онлайн" as Format, source: "Instagram" });
  const inputStyle = useInputStyle();
  return (
    <Modal open={newLead} onClose={() => setNewLead(false)} title="Новая заявка">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = form.name.trim() || "Новый ученик";
          setLeads((all) => [{ id: Date.now(), name, goal: form.goal.trim() || "Подобрать курс", source: form.source, format: form.format, stage: "Новая заявка", when: "только что" }, ...all]);
          notify("Заявка создана", `${name} · бот уже предложил время пробного урока`);
          setNewLead(false);
          setForm((f) => ({ ...f, name: "", goal: "" }));
          go("Заявки");
        }}
        className="flex flex-col gap-4"
      >
        <Field label="Имя"><input autoFocus value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Например, Айпери" className={inputCls} style={inputStyle} /></Field>
        <Field label="Цель обучения"><input value={form.goal} onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))} placeholder="IELTS, разговорный, для ребёнка…" className={inputCls} style={inputStyle} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Формат"><select value={form.format} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as Format }))} className={inputCls} style={inputStyle}><option>Онлайн</option><option>Офлайн</option></select></Field>
          <Field label="Источник"><select value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} className={inputCls} style={inputStyle}>{["Instagram", "Сайт", "WhatsApp", "Telegram", "Рекомендации"].map((s) => <option key={s}>{s}</option>)}</select></Field>
        </div>
        <Btn type="submit" className="mt-2 h-[44px]">Создать заявку</Btn>
      </form>
    </Modal>
  );
}

/* ---------------- Оплаты ---------------- */

export function Payments() {
  const { payments, students, notify } = useSchool();
  const debts = students.filter((s) => !s.paid || s.lessonsLeft <= 1);
  const total = payments.reduce((s, p) => s + p.amount, 0);
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Оплаты" sub="Абонементы, долги и автонапоминания: бот сам присылает ссылку на оплату" />
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-[13px]" style={{ color: C.mute }}>Получено за октябрь</div><div className="mt-1 text-[26px] font-semibold" style={{ color: C.green }}>{fmt(1240000 + total - 24000)} с</div></Card>
        <Card className="p-5"><div className="text-[13px]" style={{ color: C.mute }}>Ожидаем оплату</div><div className="mt-1 text-[26px] font-semibold" style={{ color: C.rose }}>{debts.length} учеников</div></Card>
        <Card className="p-5"><div className="text-[13px]" style={{ color: C.mute }}>Оплачивают через бота</div><div className="mt-1 text-[26px] font-semibold">68%</div></Card>
      </div>
      <div className="flex gap-4">
        <Card className="w-[440px] shrink-0 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Нужно оплатить</div>
            <button onClick={() => notify("Напоминания отправлены", `${debts.length} учеников получили ссылку на оплату`)} className="text-[12.5px] font-semibold" style={{ color: C.accent }}>Напомнить всем</button>
          </div>
          {debts.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border-t py-[10px] text-[13px]" style={{ borderColor: C.line }}>
              <Avatar name={s.name} size={30} />
              <div className="min-w-0 flex-1"><div className="truncate font-medium">{s.name}</div><div className="text-[12px]" style={{ color: C.rose }}>{!s.paid ? "долг за октябрь" : `осталось уроков: ${s.lessonsLeft}`}</div></div>
              <button onClick={() => notify("Напоминание отправлено", `${s.name}: ссылка на оплату в WhatsApp`)} className="rounded-[10px] border px-3 py-[5px] text-[12px] font-semibold" style={{ borderColor: C.line }}>Напомнить</button>
            </div>
          ))}
        </Card>
        <Card className="min-w-0 flex-1 p-5">
          <div className="mb-2 text-[15px] font-semibold">Последние оплаты</div>
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-t py-[10px] text-[13.5px]" style={{ borderColor: C.line }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: C.greenSoft, color: C.green }}>↓</span>
              <div className="min-w-0 flex-1"><div className="truncate font-medium">{p.student}</div><div className="truncate text-[12px]" style={{ color: C.mute }}>{p.what} · {p.method}</div></div>
              <span className="text-[12.5px]" style={{ color: C.mute }}>{p.date}</span>
              <span className="w-[100px] text-right font-semibold tabular-nums" style={{ color: C.green }}>+{fmt(p.amount)} с</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
