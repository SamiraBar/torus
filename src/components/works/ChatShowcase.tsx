import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { I, Icon } from "../../crm/ui";

/* Two phones, one story: a client books through the bot, and the next day the
   same bot reminds them about the visit. Plays on a loop while visible. */

type Msg =
  | { from: "me" | "bot"; text: string; time: string }
  | { from: "bot"; text: string; time: string; buttons: string[]; picked?: number }
  | { from: "bot"; card: { title: string; rows: [string, string][] }; time: string };

type Step =
  | { at: number; phone: 0 | 1; typing: true }
  | { at: number; phone: 0 | 1; msg: Msg }
  | { at: number; note: string; side: "l" | "r"; y: number }
  | { at: number; clearLeft: true };

const steps: Step[] = [
  { at: 600, phone: 0, msg: { from: "me", text: "Здравствуйте! Можно записаться на стрижку в субботу?", time: "21:47" } },
  { at: 1500, phone: 0, typing: true },
  { at: 2700, note: "Отвечает за 3 секунды — даже ночью", side: "l", y: 210 },
  { at: 2900, phone: 0, msg: { from: "bot", text: "Добрый вечер! Конечно. Какая услуга нужна?", time: "21:47", buttons: ["Стрижка", "Стрижка + борода", "Детская"], picked: 1 } },
  { at: 4600, phone: 0, msg: { from: "me", text: "Стрижка + борода", time: "21:47" } },
  { at: 5300, phone: 0, typing: true },
  { at: 6300, note: "Свободные окна берёт из CRM", side: "l", y: 420 },
  { at: 6500, phone: 0, msg: { from: "bot", text: "В субботу свободно у мастера Азамата:", time: "21:48", buttons: ["11:00", "14:30", "17:00"], picked: 1 } },
  { at: 8200, phone: 0, msg: { from: "me", text: "14:30, подходит", time: "21:48" } },
  { at: 8900, phone: 0, typing: true },
  { at: 9900, phone: 0, msg: { from: "bot", card: { title: "Вы записаны ✓", rows: [["Услуга", "Стрижка + борода"], ["Мастер", "Азамат"], ["Когда", "Сб, 18 окт · 14:30"], ["Стоимость", "1 200 с"]] }, time: "21:48" } },
  { at: 10300, note: "Запись создана в CRM ✓", side: "l", y: 600 },

  // заметки левого телефона лежат над правым — убираем их, когда он оживает
  { at: 11900, clearLeft: true },
  { at: 12200, phone: 1, msg: { from: "bot", text: "Добрый день, Тимур! Напоминаем: завтра в 14:30 стрижка + борода у Азамата", time: "12:00", buttons: ["Подтверждаю", "Перенести"], picked: 0 } },
  { at: 12600, note: "Напоминает за день и за 2 часа", side: "r", y: 230 },
  { at: 14200, phone: 1, msg: { from: "me", text: "Подтверждаю", time: "12:04" } },
  { at: 14900, phone: 1, typing: true },
  { at: 15900, phone: 1, msg: { from: "bot", text: "Отлично, ждём вас! Адрес: ул. Киевская 77, парковка во дворе.", time: "12:04" } },
  { at: 16300, note: "−40% неявок у клиентов", side: "r", y: 430 },
  { at: 18400, phone: 1, msg: { from: "bot", text: "Спасибо, что были у нас! Оцените визит", time: "Сб, 15:40", buttons: ["5 — отлично", "4 — хорошо", "Есть замечания"], picked: 0 } },
  { at: 19200, note: "Собирает отзывы и возвращает клиентов", side: "r", y: 620 },
];
const LOOP = 24000;

type PhoneState = { msgs: Msg[]; typing: boolean };
const empty = (): [PhoneState, PhoneState] => [{ msgs: [], typing: false }, { msgs: [], typing: false }];

function Bubble({ m }: { m: Msg }) {
  const mine = m.from === "me";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
    >
      <div
        className="max-w-[250px] rounded-[16px] px-3 pb-[6px] pt-2 text-[14px] leading-[1.38]"
        style={{
          background: mine ? "#d9fdd3" : "#fff",
          borderTopRightRadius: mine ? 4 : 16,
          borderTopLeftRadius: mine ? 16 : 4,
          boxShadow: "0 1px 1px rgba(0,0,0,.06)",
          color: "#111b21",
        }}
      >
        {"card" in m ? (
          <div className="w-[214px]">
            <div className="mb-2 text-[15px] font-semibold" style={{ color: "#17a86b" }}>{m.card.title}</div>
            {m.card.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-t py-[5px] text-[13px]" style={{ borderColor: "#eef0ee" }}>
                <span style={{ color: "#667781" }}>{k}</span>
                <span className="text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
        ) : (
          m.text
        )}
        <div className="mt-[2px] text-right text-[10.5px]" style={{ color: "#667781" }}>
          {m.time} {mine && <span style={{ color: "#53bdeb" }}>✓✓</span>}
        </div>
      </div>
      {"buttons" in m && (
        <div className="mt-[6px] flex max-w-[260px] flex-wrap gap-[6px]">
          {m.buttons.map((b, i) => (
            <motion.span
              key={b}
              className="rounded-full border px-3 py-[6px] text-[12.5px] font-medium"
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: 1,
                y: 0,
                background: i === m.picked ? ["#ffffff", "#ffffff", "#5b6cff"] : "#ffffff",
                color: i === m.picked ? ["#5b6cff", "#5b6cff", "#ffffff"] : "#5b6cff",
              }}
              transition={{ delay: 0.15 + i * 0.08, duration: 1.4, times: [0, 0.7, 1] }}
              style={{ borderColor: "#d7dbff" }}
            >
              {b}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Typing() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex w-fit gap-[5px] rounded-[16px] rounded-tl-[4px] bg-white px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.i key={i} className="h-[7px] w-[7px] rounded-full bg-[#8696a0]" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </motion.div>
  );
}

function Phone({ title, status, state, label }: { title: string; status: string; state: PhoneState; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [state.msgs.length, state.typing]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-[12px] font-medium uppercase tracking-[0.32em] text-white/45">{label}</div>
      <div className="relative h-[660px] w-[330px] rounded-[52px] p-[10px]" style={{ background: "linear-gradient(160deg,#2a2c33,#0b0c0f)", boxShadow: "0 0 0 1px rgba(255,255,255,.08), 0 50px 100px -30px rgba(0,0,0,.9), 0 0 120px -40px rgba(91,108,255,.45)" }}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[43px]" style={{ background: "#efeae2" }}>
          {/* status bar + island */}
          <div className="relative flex h-[44px] shrink-0 items-center justify-between bg-[#f7f5f2] px-7 text-[13px] font-semibold text-[#111]">
            <span>{status}</span>
            <span className="absolute left-1/2 top-[10px] h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
            <span className="tracking-[-0.05em]">▮▮▮</span>
          </div>
          {/* chat header */}
          <div className="flex shrink-0 items-center gap-3 border-b bg-[#f7f5f2] px-4 pb-3 pt-1" style={{ borderColor: "#e4e0da" }}>
            <span className="text-[22px] leading-none text-[#5b6cff]">‹</span>
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-[17px]" style={{ background: "#15161a", color: "#fff" }}><Icon d={I.scissors} size={17} /></span>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-[#111b21]">{title}</div>
              <div className="text-[12px]" style={{ color: state.typing ? "#17a86b" : "#667781" }}>{state.typing ? "печатает…" : "бот · онлайн"}</div>
            </div>
          </div>
          {/* messages */}
          <div ref={scroller} className="flex flex-1 flex-col gap-[10px] overflow-hidden px-3 py-4" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,.035) 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
            <div className="mx-auto mb-1 rounded-full bg-white/80 px-3 py-[3px] text-[11.5px] text-[#667781]">{label === "Запись" ? "Сегодня" : "Пятница"}</div>
            {state.msgs.map((m, i) => (
              <Bubble key={i} m={m} />
            ))}
            <AnimatePresence>{state.typing && <Typing />}</AnimatePresence>
          </div>
          {/* composer */}
          <div className="flex shrink-0 items-center gap-2 bg-[#f7f5f2] px-3 pb-6 pt-2">
            <div className="flex h-[38px] flex-1 items-center rounded-full bg-white px-4 text-[13.5px] text-[#8696a0]">Сообщение</div>
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#17a86b] text-white"><Icon d={I.send} size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [phones, setPhones] = useState(empty);
  const [notes, setNotes] = useState<Extract<Step, { note: string }>[]>([]);

  useEffect(() => {
    if (!inView) return;
    let timers: number[] = [];
    const play = () => {
      setPhones(empty());
      setNotes([]);
      timers = steps.map((s) =>
        window.setTimeout(() => {
          if ("clearLeft" in s) return setNotes((n) => n.filter((x) => x.side === "r"));
          if ("note" in s) return setNotes((n) => [...n, s]);
          setPhones((prev) => {
            const next: [PhoneState, PhoneState] = [{ ...prev[0] }, { ...prev[1] }];
            const p = next[s.phone];
            if ("typing" in s) p.typing = true;
            else {
              p.typing = false;
              p.msgs = [...p.msgs, s.msg];
            }
            return next;
          });
        }, s.at)
      );
      timers.push(window.setTimeout(play, LOOP));
    };
    play();
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      style={{ background: "radial-gradient(900px 600px at 30% 20%, #1c2040 0%, transparent 60%), radial-gradient(800px 600px at 80% 90%, #10261d 0%, transparent 60%), #08090b", fontFamily: "Inter, sans-serif", textShadow: "none" }}
    >
      {/* left copy */}
      <div className="absolute left-[64px] top-[80px] w-[290px]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-[6px] text-[11.5px] uppercase tracking-[0.28em] text-white/55">
          <i className="h-[6px] w-[6px] rounded-full bg-[#28c840]" /> AI-ассистент
        </div>
        <div className="text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-white" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>
          Бот, который записывает и напоминает сам.
        </div>
        <div className="mt-5 text-[15px] leading-[1.6] text-white/55">
          WhatsApp, Telegram и Instagram. Понимает обычные сообщения, видит свободное время мастеров и ведёт клиента от вопроса до визита.
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6">
          {[["24/7", "без выходных"], ["3 сек", "время ответа"], ["−40%", "неявок"], ["×2", "повторных визитов"]].map(([v, l]) => (
            <div key={l}>
              <div className="text-[30px] font-semibold tracking-[-0.02em] text-white" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>{v}</div>
              <div className="text-[13px] text-white/45">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* phones */}
      <div className="absolute left-[430px] top-[40px] flex gap-[70px]">
        <Phone title="Brodyaga Barbershop" status="21:47" state={phones[0]} label="Запись" />
        <Phone title="Brodyaga Barbershop" status="12:00" state={phones[1]} label="Напоминание" />
      </div>

      {/* floating annotations */}
      <AnimatePresence>
        {notes.map((n) => (
          <motion.div
            key={n.note}
            className="absolute flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white"
            style={{ top: n.y + 30, ...(n.side === "l" ? { left: 430 + 330 - 50 } : { right: 36 }), background: "rgba(20,22,30,.78)", backdropFilter: "blur(10px)", boxShadow: "0 16px 40px -14px rgba(0,0,0,.7)" }}
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <i className="h-[7px] w-[7px] rounded-full" style={{ background: n.note.includes("CRM") ? "#9aa5ff" : "#28c840" }} />
            {n.note}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
