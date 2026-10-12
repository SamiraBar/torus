import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { I, Icon, initialsOf } from "../crm/ui";
import { lessons } from "./data";
import { useSchool } from "./store";
import { teacherOf } from "./pages/Schedule";

/* Mock video lesson: teacher tile, students, whiteboard, chat. Everything is
   staged — speaking rings move, chat messages arrive, the timer runs. */

const chatScript = [
  ["Алина", "Good evening!"],
  ["Teacher", "Hi everyone! Today: Present Perfect vs Past Simple"],
  ["Тимур", "I have been to London last year?"],
  ["Teacher", "Almost! → I went to London last year"],
  ["Айдана", "I have never tried sushi"],
  ["Teacher", "Perfect, Aidana!"],
];

const tileColors = ["#5b6cff", "#17a86b", "#e59a1a", "#d9488f", "#0ea5b7", "#7c5cff"];

function Tile({ name, big, speaking, muted, i }: { name: string; big?: boolean; speaking?: boolean; muted?: boolean; i: number }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-[16px]" style={{ background: `radial-gradient(120% 120% at 30% 20%, ${tileColors[i % tileColors.length]}55, #15171d 70%)`, outline: speaking ? "2px solid #7cf0b0" : "1px solid rgba(255,255,255,.06)", height: "100%" }}>
      <motion.span
        animate={speaking ? { boxShadow: ["0 0 0 0 rgba(124,240,176,.5)", "0 0 0 16px rgba(124,240,176,0)"] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="flex items-center justify-center rounded-full font-semibold text-white"
        style={{ width: big ? 110 : 54, height: big ? 110 : 54, fontSize: big ? 38 : 19, background: tileColors[i % tileColors.length] }}
      >
        {initialsOf(name)}
      </motion.span>
      <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-[8px] bg-black/50 px-2 py-[2px] text-[11.5px] text-white">
        <Icon d={muted ? I.micOff : I.mic} size={12} /> {name}
      </span>
    </div>
  );
}

export function OnlineClass() {
  const { classLessonId, setClassLessonId, groups, students, notify } = useSchool();
  const l = lessons.find((x) => x.id === classLessonId);
  const g = l && groups.find((x) => x.id === l.groupId);
  const [sec, setSec] = useState(14 * 60 + 32);
  const [chat, setChat] = useState(0);
  const [speaker, setSpeaker] = useState(-1);
  const [mic, setMic] = useState(true);

  useEffect(() => {
    if (!l) return;
    setChat(0);
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    const c = setInterval(() => setChat((n) => Math.min(n + 1, chatScript.length)), 2200);
    const s = setInterval(() => setSpeaker((n) => (n + 1) % 4 - 1), 2600);
    return () => { clearInterval(t); clearInterval(c); clearInterval(s); };
  }, [l]);

  // в демо-группах мало людей — добираем класс до 6 плиток остальными учениками
  const people = g ? [...students.filter((s) => s.groupId === g.id), ...students.filter((s) => s.groupId !== g.id)].slice(0, 6) : [];

  return (
    <AnimatePresence>
      {l && g && (
        <motion.div className="absolute inset-0 z-[70] flex flex-col p-5 text-white" style={{ background: "#0b0c10" }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="mb-4 flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-full bg-[#e5536b] px-3 py-[5px] text-[12px] font-semibold"><i className="h-[7px] w-[7px] animate-pulse rounded-full bg-white" />REC</span>
            <div>
              <div className="text-[16px] font-semibold">{g.name} · {g.level}</div>
              <div className="text-[12.5px] text-white/50">{l.topic}</div>
            </div>
            <span className="ml-auto font-mono text-[15px] tabular-nums text-white/70">{String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}</span>
            <span className="rounded-full bg-white/10 px-3 py-[5px] text-[12px]">{people.length + 1} в классе</span>
          </div>

          <div className="flex min-h-0 flex-1 gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex min-h-0 flex-1 gap-3">
                <div className="min-w-0 flex-[1.3]"><Tile name={`${teacherOf(g.teacherId).name} · преподаватель`} big speaking={speaker === -1} i={0} /></div>
                {/* whiteboard */}
                <div className="flex min-w-0 flex-1 flex-col rounded-[16px] bg-white p-5 text-[#15161a]">
                  <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a8b86]">Доска</div>
                  <div className="text-[19px] font-semibold">Present Perfect vs Past Simple</div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-[13.5px]">
                    <div className="rounded-[12px] bg-[#eef0ff] p-3"><b className="text-[#5b6cff]">Present Perfect</b><div className="mt-1">I <u>have visited</u> Paris.</div><div className="text-[12px] text-[#8a8b86]">опыт, без времени</div></div>
                    <div className="rounded-[12px] bg-[#e6f6ee] p-3"><b className="text-[#17a86b]">Past Simple</b><div className="mt-1">I <u>visited</u> Paris in 2023.</div><div className="text-[12px] text-[#8a8b86]">конкретное время</div></div>
                  </div>
                  <motion.svg className="mt-4" width="100%" height="40" viewBox="0 0 300 40">
                    <motion.path d="M10 30 C 60 5, 120 5, 160 25 S 260 35, 290 10" fill="none" stroke="#e5536b" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }} />
                  </motion.svg>
                  <div className="mt-auto flex flex-wrap gap-2 text-[12px]">
                    {["ever", "never", "already", "yet", "last year", "ago"].map((w) => <span key={w} className="rounded-full border border-[#ebebe6] px-3 py-1">{w}</span>)}
                  </div>
                </div>
              </div>
              <div className="grid h-[150px] shrink-0 grid-cols-6 gap-3">
                {people.map((p, i) => <Tile key={p.id} name={p.name.split(" ")[0]} speaking={speaker === i} muted={i % 3 === 2} i={i + 1} />)}
              </div>
            </div>

            {/* chat */}
            <div className="flex w-[300px] shrink-0 flex-col rounded-[16px] bg-white/[0.05] p-4">
              <div className="mb-3 text-[13px] font-semibold text-white/70">Чат урока</div>
              <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                <AnimatePresence initial={false}>
                  {chatScript.slice(0, chat).map(([who, text], i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[12px] px-3 py-2 text-[13px]" style={{ background: who === "Teacher" ? "rgba(91,108,255,.22)" : "rgba(255,255,255,.06)" }}>
                      <div className="text-[11px] font-semibold" style={{ color: who === "Teacher" ? "#9aa5ff" : "#7cf0b0" }}>{who === "Teacher" ? teacherOf(g.teacherId).name.split(" ")[0] : who}</div>
                      {text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="mt-3 rounded-[10px] bg-white/[0.06] px-3 py-2 text-[12.5px] text-white/40">Сообщение…</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            {[
              [mic ? I.mic : I.micOff, () => setMic((m) => !m)],
              [I.video, () => notify("Камера", "Камера включена")],
              [I.monitor, () => notify("Демонстрация экрана", "Показываете презентацию урока")],
              [I.hand, () => notify("Рука поднята", "Преподаватель видит ваш вопрос")],
            ].map(([ico, fn], i) => (
              <button key={i} onClick={fn as () => void} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"><Icon d={ico as string} size={19} /></button>
            ))}
            <button onClick={() => { setClassLessonId(null); notify("Урок завершён", "Запись и домашнее задание отправлены ученикам"); }} className="ml-3 rounded-full bg-[#e5536b] px-6 py-3 text-[13.5px] font-semibold">Завершить урок</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
