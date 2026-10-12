import { useState } from "react";
import { Avatar, Badge, Btn, C, Card, Drawer, I, Icon, PageHead, SearchInput, Tabs, fmt } from "../ui";
import { clientHistory, clients, stageColor } from "../data";
import { useCrm } from "../store";

const segments = ["Все", "VIP", "Постоянный", "Новый"] as const;
const segColor = { VIP: [C.amber, C.amberSoft], Постоянный: [C.accent, C.accentSoft], Новый: [C.green, C.greenSoft] } as const;

export function Clients() {
  const { setOpenClientId } = useCrm();
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState<(typeof segments)[number]>("Все");
  const list = clients.filter((c) => (seg === "Все" || c.segment === seg) && (!q || `${c.name} ${c.company} ${c.phone}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Клиенты" sub={`${list.length} из ${clients.length} · единая база со всей историей общения`}>
        <SearchInput value={q} onChange={setQ} placeholder="Имя, компания или телефон" width={280} />
        <Tabs items={segments} value={seg} onChange={setSeg} />
      </PageHead>

      <div className="grid grid-cols-3 gap-4">
        {[["Всего клиентов", fmt(clients.length * 97), "+38 за месяц"], ["Повторные покупки", "46%", "+5 п. к сентябрю"], ["LTV клиента", "312 400 с", "+12%"]].map(([l, v, d]) => (
          <Card key={l} className="p-5">
            <div className="text-[13px]" style={{ color: C.mute }}>{l}</div>
            <div className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">{v}</div>
            <div className="mt-1 text-[12.5px]" style={{ color: C.green }}>↑ {d}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="text-[12px] uppercase tracking-[0.06em]" style={{ color: C.mute, background: "#fafaf8" }}>
              {["Клиент", "Сегмент", "Телефон", "Город", "Покупки", "Последний контакт", "Менеджер"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} onClick={() => setOpenClientId(c.id)} className="cursor-pointer border-t hover:bg-[#fafaf8]" style={{ borderColor: C.line }}>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-3">
                    <Avatar name={c.name} size={32} />
                    <span><span className="block font-semibold">{c.name}</span><span className="block text-[12px]" style={{ color: C.mute }}>{c.company}</span></span>
                  </span>
                </td>
                <td className="px-5 py-3"><Badge color={segColor[c.segment][0]} bg={segColor[c.segment][1]}>{c.segment}</Badge></td>
                <td className="px-5 py-3 tabular-nums" style={{ color: C.ink2 }}>{c.phone}</td>
                <td className="px-5 py-3" style={{ color: C.ink2 }}>{c.city}</td>
                <td className="px-5 py-3 font-semibold tabular-nums">{fmt(c.spent)} с</td>
                <td className="px-5 py-3" style={{ color: C.mute }}>{c.last}</td>
                <td className="px-5 py-3"><Avatar name={c.manager} size={26} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <div className="p-10 text-center text-[14px]" style={{ color: C.mute }}>Никого не нашли</div>}
      </Card>
    </div>
  );
}

export function ClientDrawer() {
  const { openClientId, setOpenClientId, deals, setOpenDealId, notify } = useCrm();
  const c = clients.find((x) => x.id === openClientId);
  const related = c ? deals.filter((d) => d.contact === c.name) : [];

  return (
    <Drawer open={!!c} onClose={() => setOpenClientId(null)}>
      {c && (
        <div className="flex flex-col gap-6 p-7">
          <div className="flex items-center gap-4">
            <Avatar name={c.name} size={60} />
            <div>
              <div className="text-[21px] font-semibold tracking-[-0.02em]">{c.name}</div>
              <div className="text-[13.5px]" style={{ color: C.mute }}>{c.company}</div>
              <div className="mt-2"><Badge color={segColor[c.segment][0]} bg={segColor[c.segment][1]}>{c.segment}</Badge></div>
            </div>
          </div>
          <div className="flex gap-2">
            <Btn kind="light" onClick={() => notify("Звонок", `Набираем ${c.phone}…`)}><Icon d={I.phone} size={15} /> Позвонить</Btn>
            <Btn kind="light" onClick={() => notify("WhatsApp", `Открыт чат с ${c.name}`)}><Icon d={I.chat} size={15} /> WhatsApp</Btn>
            <Btn kind="light" onClick={() => notify("Письмо", `Черновик для ${c.email}`)}><Icon d={I.mail} size={15} /> Email</Btn>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[13.5px]">
            {[["Телефон", c.phone], ["Email", c.email], ["Город", c.city], ["Источник", c.source], ["Покупок на сумму", `${fmt(c.spent)} с`], ["Сделок", String(c.deals)]].map(([k, v]) => (
              <div key={k}><div className="text-[12px]" style={{ color: C.mute }}>{k}</div><div className="mt-[2px] font-medium">{v}</div></div>
            ))}
          </div>
          {related.length > 0 && (
            <div>
              <div className="mb-3 text-[15px] font-semibold">Сделки</div>
              {related.map((d) => (
                <button key={d.id} onClick={() => { setOpenClientId(null); setOpenDealId(d.id); }} className="mb-2 flex w-full items-center justify-between rounded-[12px] border p-3 text-left hover:shadow-sm" style={{ borderColor: C.line }}>
                  <span><span className="block text-[13.5px] font-semibold">{d.title}</span><span className="text-[12px]" style={{ color: stageColor[d.stage] }}>{d.stage}</span></span>
                  <span className="font-semibold tabular-nums">{fmt(d.amount)} с</span>
                </button>
              ))}
            </div>
          )}
          <div>
            <div className="mb-3 text-[15px] font-semibold">История общения</div>
            {clientHistory.map(([type, text, when]) => (
              <div key={text} className="border-l-2 pb-4 pl-4" style={{ borderColor: C.line }}>
                <div className="text-[12px] font-semibold" style={{ color: C.mute }}>{type} · {when}</div>
                <div className="text-[13.5px]">{text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Drawer>
  );
}
