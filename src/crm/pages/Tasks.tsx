import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Badge, Btn, C, Card, PageHead, Tabs, inputCls, inputStyle } from "../ui";
import { managers, type Task } from "../data";
import { useCrm } from "../store";

const filters = ["Сегодня", "Завтра", "На неделе", "Выполнено"] as const;
const prio: Record<Task["priority"], [string, string]> = { Высокий: [C.rose, C.roseSoft], Средний: [C.amber, C.amberSoft], Низкий: [C.mute, "#f0f0ec"] };

export function Tasks() {
  const { tasks, setTasks, notify } = useCrm();
  const [f, setF] = useState<(typeof filters)[number]>("Сегодня");
  const [title, setTitle] = useState("");

  const list = tasks.filter((t) => (f === "Выполнено" ? t.done : t.due === f && !t.done));
  const doneToday = tasks.filter((t) => t.due === "Сегодня" && t.done).length;
  const allToday = tasks.filter((t) => t.due === "Сегодня").length;

  const toggle = (t: Task) => {
    setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
    if (!t.done) notify("Задача выполнена ✓", t.title);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Задачи" sub="Звонки, встречи и напоминания всей команды">
        <Tabs items={filters} value={f} onChange={setF} />
      </PageHead>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-[13px]" style={{ color: C.mute }}>Прогресс дня</div>
          <div className="mt-1 text-[26px] font-semibold">{doneToday} из {allToday}</div>
          <div className="mt-3 h-[8px] overflow-hidden rounded-full" style={{ background: "#ecece7" }}>
            <motion.div className="h-full rounded-full" style={{ background: C.green }} animate={{ width: `${(doneToday / allToday) * 100}%` }} transition={{ duration: 0.6 }} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[13px]" style={{ color: C.mute }}>Просрочено</div>
          <div className="mt-1 text-[26px] font-semibold" style={{ color: C.green }}>0</div>
          <div className="mt-1 text-[12.5px]" style={{ color: C.mute }}>CRM напоминает за 15 минут</div>
        </Card>
        <Card className="p-5">
          <div className="text-[13px]" style={{ color: C.mute }}>Создано автоматически</div>
          <div className="mt-1 text-[26px] font-semibold">63%</div>
          <div className="mt-1 text-[12.5px]" style={{ color: C.mute }}>задач ставят сценарии и бот</div>
        </Card>
      </div>

      <Card className="p-5">
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (!title.trim()) return;
            setTasks((all) => [{ id: Date.now(), title: title.trim(), due: f === "Выполнено" ? "Сегодня" : f, time: "—", client: "—", manager: managers[0], priority: "Средний", done: false }, ...all]);
            notify("Задача добавлена", title.trim());
            setTitle("");
          }}
          className="mb-3 flex gap-2"
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Новая задача на «${f === "Выполнено" ? "Сегодня" : f}»…`} className={`${inputCls} flex-1`} style={inputStyle} />
          <Btn type="submit">Добавить</Btn>
        </form>
        <AnimatePresence initial={false}>
          {list.map((t) => (
            <motion.div key={t.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="flex items-center gap-4 border-t py-3 text-[13.5px]" style={{ borderColor: C.line }}>
                <button onClick={() => toggle(t)} className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border text-[12px] text-white transition-colors" style={t.done ? { background: C.green, borderColor: C.green } : { borderColor: "#cfcfca" }}>
                  {t.done && "✓"}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium" style={t.done ? { color: C.mute, textDecoration: "line-through" } : undefined}>{t.title}</div>
                  <div className="text-[12px]" style={{ color: C.mute }}>{t.client}</div>
                </div>
                <Badge color={prio[t.priority][0]} bg={prio[t.priority][1]}>{t.priority}</Badge>
                <span className="w-[90px] text-right tabular-nums" style={{ color: C.mute }}>{t.due === "На неделе" ? "на неделе" : `${t.due.toLowerCase()}, ${t.time}`}</span>
                <Avatar name={t.manager} size={26} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!list.length && <div className="py-10 text-center text-[14px]" style={{ color: C.mute }}>{f === "Выполнено" ? "Пока ничего не выполнено" : "Все задачи выполнены"}</div>}
      </Card>
    </div>
  );
}
