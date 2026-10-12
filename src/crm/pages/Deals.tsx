import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Avatar, Badge, Btn, C, Card, Drawer, Field, I, Icon, Modal, PageHead, SearchInput, Tabs, fmt, inputCls, inputStyle } from "../ui";
import { clientHistory, managers, sourcesList, stageColor, stages, type Stage } from "../data";
import { useCrm } from "../store";

const views = ["Канбан", "Список"] as const;

export function Deals() {
  const { deals, setDeals, setOpenDealId, notify, setNewDeal } = useCrm();
  const [view, setView] = useState<(typeof views)[number]>("Канбан");
  const [q, setQ] = useState("");
  const [who, setWho] = useState<string | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [over, setOver] = useState<Stage | null>(null);

  const list = deals.filter(
    (d) => (!who || d.manager === who) && (!q || `${d.title} ${d.contact}`.toLowerCase().includes(q.toLowerCase()))
  );

  const moveTo = (id: number, stage: Stage) => {
    const d = deals.find((x) => x.id === id);
    if (!d || d.stage === stage) return;
    setDeals((all) => all.map((x) => (x.id === id ? { ...x, stage } : x)));
    notify(stage === "Оплачено" ? "Сделка оплачена" : "Этап изменён", `${d.title} → ${stage}`);
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <PageHead title="Сделки" sub={`${list.length} сделок · ${fmt(list.reduce((s, d) => s + d.amount, 0))} с · перетаскивайте карточки между этапами`}>
        <SearchInput value={q} onChange={setQ} placeholder="Компания или контакт" width={240} />
        <Tabs items={views} value={view} onChange={setView} />
        <Btn onClick={() => setNewDeal(true)}><Icon d={I.plus} size={16} /> Сделка</Btn>
      </PageHead>

      <div className="flex items-center gap-2">
        <span className="mr-1 text-[13px]" style={{ color: C.mute }}>Менеджер:</span>
        <button onClick={() => setWho(null)} className="rounded-full border px-3 py-[5px] text-[12.5px]" style={!who ? { background: C.ink, color: "#fff", borderColor: C.ink } : { borderColor: C.line, background: C.card }}>Все</button>
        {managers.map((m) => (
          <button key={m} onClick={() => setWho(who === m ? null : m)} className="flex items-center gap-2 rounded-full border py-[3px] pl-[3px] pr-3 text-[12.5px]" style={who === m ? { background: C.ink, color: "#fff", borderColor: C.ink } : { borderColor: C.line, background: C.card }}>
            <Avatar name={m} size={22} /> {m.split(" ")[0]}
          </button>
        ))}
      </div>

      {view === "Канбан" ? (
        <div className="grid min-h-0 flex-1 grid-cols-5 gap-3">
          {stages.map((stage) => {
            const col = list.filter((d) => d.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(stage);
                }}
                onDragLeave={() => setOver((o) => (o === stage ? null : o))}
                onDrop={() => {
                  if (dragId != null) moveTo(dragId, stage);
                  setDragId(null);
                  setOver(null);
                }}
                className="flex min-h-0 flex-col gap-2 rounded-[16px] p-3 transition-colors"
                style={{ background: over === stage ? C.accentSoft : "#ecece7", outline: over === stage ? `2px dashed ${C.accent2}` : "none" }}
              >
                <div className="flex items-center gap-2 px-1 pb-1 text-[13px] font-semibold">
                  <i className="h-2 w-2 rounded-full" style={{ background: stageColor[stage] }} />
                  {stage}
                  <span className="rounded-full bg-white px-2 text-[11.5px] font-medium" style={{ color: C.mute }}>{col.length}</span>
                </div>
                <div className="px-1 text-[12px] tabular-nums" style={{ color: C.mute }}>{fmt(col.reduce((s, d) => s + d.amount, 0))} с</div>
                <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pb-2">
                  {col.map((d) => (
                    <motion.div
                      layout
                      layoutId={`deal-${d.id}`}
                      key={d.id}
                      draggable
                      onDragStart={() => setDragId(d.id)}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => setOpenDealId(d.id)}
                      className="cursor-grab rounded-[12px] border p-3 transition-shadow hover:shadow-md active:cursor-grabbing"
                      style={{ background: C.card, borderColor: C.line, opacity: dragId === d.id ? 0.4 : 1 }}
                    >
                      <div className="text-[13.5px] font-semibold leading-snug">{d.title}</div>
                      <div className="mt-[2px] text-[12px]" style={{ color: C.mute }}>{d.contact}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[13px] font-semibold tabular-nums">{fmt(d.amount)} с</span>
                        <Avatar name={d.manager} size={24} />
                      </div>
                      <div className="mt-2 flex items-center gap-2 border-t pt-2 text-[11.5px]" style={{ borderColor: C.line, color: C.mute }}>
                        <Icon d={I.cal} size={13} /> {d.next}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="text-[12px] uppercase tracking-[0.06em]" style={{ color: C.mute, background: "#fafaf8" }}>
                {["Сделка", "Этап", "Сумма", "Источник", "Менеджер", "В работе"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} onClick={() => setOpenDealId(d.id)} className="cursor-pointer border-t hover:bg-[#fafaf8]" style={{ borderColor: C.line }}>
                  <td className="px-5 py-3"><div className="font-semibold">{d.title}</div><div className="text-[12px]" style={{ color: C.mute }}>{d.contact}</div></td>
                  <td className="px-5 py-3"><Badge color={stageColor[d.stage]} bg={`${stageColor[d.stage]}1a`}>{d.stage}</Badge></td>
                  <td className="px-5 py-3 font-semibold tabular-nums">{fmt(d.amount)} с</td>
                  <td className="px-5 py-3" style={{ color: C.ink2 }}>{d.source}</td>
                  <td className="px-5 py-3"><span className="flex items-center gap-2"><Avatar name={d.manager} size={24} />{d.manager.split(" ")[0]}</span></td>
                  <td className="px-5 py-3" style={{ color: C.mute }}>{d.days} дн.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export function DealDrawer() {
  const { deals, setDeals, openDealId, setOpenDealId, notify } = useCrm();
  const d = deals.find((x) => x.id === openDealId);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Record<number, string[]>>({});

  return (
    <Drawer open={!!d} onClose={() => setOpenDealId(null)}>
      {d && (
        <div className="flex flex-col gap-6 p-7">
          <div>
            <Badge color={stageColor[d.stage]} bg={`${stageColor[d.stage]}1a`}>{d.stage}</Badge>
            <div className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">{d.title}</div>
            <div className="mt-1 text-[28px] font-semibold tabular-nums" style={{ color: C.accent }}>{fmt(d.amount)} с</div>
          </div>

          <div>
            <div className="mb-2 text-[12.5px]" style={{ color: C.mute }}>Этап сделки</div>
            <div className="flex gap-1">
              {stages.map((s, i) => {
                const reached = stages.indexOf(d.stage) >= i;
                return (
                  <button
                    key={s}
                    title={s}
                    onClick={() => {
                      setDeals((all) => all.map((x) => (x.id === d.id ? { ...x, stage: s } : x)));
                      notify("Этап изменён", `${d.title} → ${s}`);
                    }}
                    className="h-[30px] flex-1 rounded-[8px] text-[11px] font-semibold transition-colors"
                    style={{ background: reached ? stageColor[d.stage] : "#ecece7", color: reached ? "#fff" : C.mute }}
                  >
                    {s.slice(0, 5)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[13.5px]">
            {[["Контакт", d.contact], ["Источник", d.source], ["Менеджер", d.manager], ["В работе", `${d.days} дн.`], ["Следующий шаг", d.next]].map(([k, v]) => (
              <div key={k}>
                <div className="text-[12px]" style={{ color: C.mute }}>{k}</div>
                <div className="mt-[2px] font-medium">{v}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Btn kind="light" onClick={() => notify("Звонок", `Набираем ${d.contact}…`)}><Icon d={I.phone} size={15} /> Позвонить</Btn>
            <Btn kind="light" onClick={() => notify("WhatsApp", `Открыт чат с ${d.contact}`)}><Icon d={I.chat} size={15} /> Написать</Btn>
            {d.stage !== "Оплачено" && (
              <Btn kind="accent" onClick={() => { setDeals((all) => all.map((x) => (x.id === d.id ? { ...x, stage: "Оплачено" } : x))); notify("Сделка оплачена", d.title); }}>
                <Icon d={I.check} size={15} /> Оплачено
              </Btn>
            )}
          </div>

          <div>
            <div className="mb-3 text-[15px] font-semibold">История</div>
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (!comment.trim()) return;
                setComments((c) => ({ ...c, [d.id]: [comment.trim(), ...(c[d.id] || [])] }));
                setComment("");
              }}
              className="mb-4 flex gap-2"
            >
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Добавить комментарий…" className={`${inputCls} flex-1`} style={inputStyle} />
              <Btn type="submit">Добавить</Btn>
            </form>
            <div className="flex flex-col">
              {(comments[d.id] || []).map((c, i) => (
                <div key={`c${i}`} className="flex gap-3 border-l-2 pb-4 pl-4" style={{ borderColor: C.accent }}>
                  <div><div className="text-[12px] font-semibold" style={{ color: C.accent }}>Комментарий · только что</div><div className="text-[13.5px]">{c}</div></div>
                </div>
              ))}
              {clientHistory.map(([type, text, when]) => (
                <div key={text} className="flex gap-3 border-l-2 pb-4 pl-4" style={{ borderColor: C.line }}>
                  <div><div className="text-[12px] font-semibold" style={{ color: C.mute }}>{type} · {when}</div><div className="text-[13.5px]">{text}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export function NewDealModal() {
  const { newDeal, setNewDeal, setDeals, notify, go } = useCrm();
  const [form, setForm] = useState({ title: "", contact: "", amount: "", stage: "Новые" as Stage, manager: managers[0], source: "Сайт" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal open={newDeal} onClose={() => setNewDeal(false)} title="Новая сделка">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = form.title.trim() || "Новый клиент";
          setDeals((all) => [{ id: Date.now(), title, contact: form.contact.trim() || "—", amount: Number(form.amount) || 0, stage: form.stage, manager: form.manager, source: form.source, days: 0, next: "Первый звонок" }, ...all]);
          notify("Сделка создана", `${title} · ${fmt(Number(form.amount) || 0)} с`);
          setNewDeal(false);
          setForm((f) => ({ ...f, title: "", contact: "", amount: "" }));
          go("Сделки");
        }}
        className="flex flex-col gap-4"
      >
        <Field label="Компания"><input autoFocus value={form.title} onChange={set("title")} placeholder="Например, кофейня «Арома»" className={inputCls} style={inputStyle} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Контакт"><input value={form.contact} onChange={set("contact")} placeholder="Имя" className={inputCls} style={inputStyle} /></Field>
          <Field label="Сумма, сом"><input value={form.amount} onChange={set("amount")} inputMode="numeric" placeholder="50 000" className={inputCls} style={inputStyle} /></Field>
          <Field label="Этап"><select value={form.stage} onChange={set("stage")} className={inputCls} style={inputStyle}>{stages.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Источник"><select value={form.source} onChange={set("source")} className={inputCls} style={inputStyle}>{sourcesList.map((s) => <option key={s}>{s}</option>)}</select></Field>
        </div>
        <Field label="Ответственный"><select value={form.manager} onChange={set("manager")} className={inputCls} style={inputStyle}>{managers.map((m) => <option key={m}>{m}</option>)}</select></Field>
        <Btn type="submit" className="mt-2 h-[44px]">Создать сделку</Btn>
      </form>
    </Modal>
  );
}
