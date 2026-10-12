import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, Badge, Btn, C, Card, Field, I, Icon, Modal, PageHead, Tabs, Toggle, fmt, inputCls, inputStyle, type IconName } from "../ui";
import { financeMonths, managers, stageColor, stages } from "../data";
import { useCrm } from "../store";

/* ---------------- Финансы ---------------- */

const txFilters = ["Все", "Доходы", "Расходы"] as const;

export function Finance() {
  const { txns, setTxns, notify } = useCrm();
  const [f, setF] = useState<(typeof txFilters)[number]>("Все");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", kind: "Расход", category: "Офис" });

  const income = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = -txns.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const list = txns.filter((t) => f === "Все" || (f === "Доходы" ? t.amount > 0 : t.amount < 0));
  const maxBar = Math.max(...financeMonths.map((m) => m[1]));

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Финансы" sub="Деньги компании в одном окне: оплаты из сделок подтягиваются сами">
        <Btn onClick={() => setAdding(true)}><Icon d={I.plus} size={16} /> Операция</Btn>
      </PageHead>

      <div className="grid grid-cols-3 gap-4">
        {[["Доходы за октябрь", income, C.green], ["Расходы за октябрь", expense, C.rose], ["Прибыль", income - expense, C.accent]].map(([l, v, col]) => (
          <Card key={l as string} className="p-5">
            <div className="text-[13px]" style={{ color: C.mute }}>{l}</div>
            <div className="mt-1 text-[26px] font-semibold tabular-nums" style={{ color: col as string }}>{fmt(v as number)} с</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Card className="w-[420px] shrink-0 p-5">
          <div className="mb-1 text-[15px] font-semibold">Доходы и расходы</div>
          <div className="mb-5 text-[12.5px]" style={{ color: C.mute }}>млн сом · 6 месяцев</div>
          <div className="flex h-[200px] items-end justify-between gap-3">
            {financeMonths.map(([m, inc, exp], i) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-[170px] w-full items-end justify-center gap-[4px]">
                  <motion.div className="w-[14px] rounded-t-[5px]" style={{ background: C.accent }} initial={{ height: 0 }} animate={{ height: `${(inc / maxBar) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.7 }} />
                  <motion.div className="w-[14px] rounded-t-[5px]" style={{ background: "#d9dcf5" }} initial={{ height: 0 }} animate={{ height: `${(exp / maxBar) * 100}%` }} transition={{ delay: 0.1 + i * 0.06, duration: 0.7 }} />
                </div>
                <span className="text-[12px]" style={{ color: C.mute }}>{m}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-5 text-[12.5px]" style={{ color: C.mute }}>
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: C.accent }} />Доходы</span>
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: "#d9dcf5" }} />Расходы</span>
          </div>
        </Card>

        <Card className="min-w-0 flex-1 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Операции</div>
            <Tabs items={txFilters} value={f} onChange={setF} />
          </div>
          {list.map((t) => (
            <div key={t.id} className="flex items-center gap-4 border-t py-[10px] text-[13.5px]" style={{ borderColor: C.line }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px]" style={{ background: t.amount > 0 ? C.greenSoft : C.roseSoft, color: t.amount > 0 ? C.green : C.rose }}>
                {t.amount > 0 ? "↓" : "↑"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{t.title}</div>
                <div className="text-[12px]" style={{ color: C.mute }}>{t.category} · {t.method}</div>
              </div>
              <span className="text-[12.5px]" style={{ color: C.mute }}>{t.date}</span>
              <span className="w-[120px] text-right font-semibold tabular-nums" style={{ color: t.amount > 0 ? C.green : C.ink }}>
                {t.amount > 0 ? "+" : "−"}{fmt(Math.abs(t.amount))} с
              </span>
            </div>
          ))}
        </Card>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Новая операция">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(form.amount) || 0;
            if (!n) return;
            const title = form.title.trim() || (form.kind === "Доход" ? "Поступление" : "Расход");
            setTxns((all) => [{ id: Date.now(), date: "12 окт", title, category: form.kind === "Доход" ? "Продажи" : form.category, amount: form.kind === "Доход" ? n : -n, method: "Перевод" }, ...all]);
            notify("Операция добавлена", `${title}: ${form.kind === "Доход" ? "+" : "−"}${fmt(n)} с`);
            setAdding(false);
            setForm((x) => ({ ...x, title: "", amount: "" }));
          }}
          className="flex flex-col gap-4"
        >
          <Tabs items={["Расход", "Доход"] as const} value={form.kind as "Расход" | "Доход"} onChange={(kind) => setForm((x) => ({ ...x, kind }))} />
          <Field label="Описание"><input autoFocus value={form.title} onChange={(e) => setForm((x) => ({ ...x, title: e.target.value }))} placeholder="Например, закупка упаковки" className={inputCls} style={inputStyle} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Сумма, сом"><input value={form.amount} onChange={(e) => setForm((x) => ({ ...x, amount: e.target.value }))} inputMode="numeric" placeholder="10 000" className={inputCls} style={inputStyle} /></Field>
            <Field label="Категория">
              <select value={form.category} onChange={(e) => setForm((x) => ({ ...x, category: e.target.value }))} className={inputCls} style={inputStyle}>
                {["Офис", "Маркетинг", "Зарплата", "Аренда", "IT"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Btn type="submit" className="mt-2 h-[44px]">Сохранить</Btn>
        </form>
      </Modal>
    </div>
  );
}

/* ---------------- Отчёты ---------------- */

export function Reports() {
  const { deals } = useCrm();
  const byManager = managers
    .map((m) => {
      const mine = deals.filter((d) => d.manager === m);
      const won = mine.filter((d) => d.stage === "Оплачено");
      return { m, total: mine.length, won: won.length, revenue: won.reduce((s, d) => s + d.amount, 0), pipe: mine.reduce((s, d) => s + d.amount, 0) };
    })
    .sort((a, b) => b.revenue - a.revenue);
  const maxRev = Math.max(...byManager.map((x) => x.revenue), 1);
  const funnel = stages.map((s, i) => ({ s, n: deals.filter((d) => stages.indexOf(d.stage) >= i).length }));
  const maxN = Math.max(funnel[0].n, 1);

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Отчёты" sub="Цифры обновляются вместе с воронкой: попробуйте передвинуть сделку и вернуться сюда" />
      <div className="flex gap-4">
        <Card className="min-w-0 flex-1 p-6">
          <div className="mb-5 text-[15px] font-semibold">Рейтинг менеджеров</div>
          {byManager.map((x, i) => (
            <div key={x.m} className="flex items-center gap-4 border-t py-3" style={{ borderColor: C.line }}>
              <span className="w-5 text-[13px] font-semibold" style={{ color: i === 0 ? C.amber : C.mute }}>{i + 1}</span>
              <Avatar name={x.m} size={34} />
              <div className="w-[170px]">
                <div className="text-[13.5px] font-semibold">{x.m}</div>
                <div className="text-[12px]" style={{ color: C.mute }}>{x.won} оплат из {x.total} · конверсия {x.total ? Math.round((x.won / x.total) * 100) : 0}%</div>
              </div>
              <div className="h-[10px] flex-1 overflow-hidden rounded-full" style={{ background: "#ecece7" }}>
                <motion.div className="h-full rounded-full" style={{ background: i === 0 ? C.accent : C.accent2 }} animate={{ width: `${(x.revenue / maxRev) * 100}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="w-[110px] text-right text-[13.5px] font-semibold tabular-nums">{fmt(x.revenue)} с</span>
            </div>
          ))}
        </Card>
        <Card className="w-[400px] shrink-0 p-6">
          <div className="mb-5 text-[15px] font-semibold">Воронка конверсии</div>
          <div className="flex flex-col items-center gap-[6px]">
            {funnel.map(({ s, n }) => (
              <motion.div
                key={s}
                className="flex h-[44px] items-center justify-between rounded-[10px] px-4 text-[13px] font-semibold text-white"
                style={{ background: stageColor[s] }}
                animate={{ width: `${40 + (n / maxN) * 60}%` }}
                transition={{ duration: 0.7 }}
              >
                <span>{s}</span>
                <span>{n}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 text-center text-[13px]" style={{ color: C.mute }}>
            Итоговая конверсия: <b style={{ color: C.ink }}>{Math.round((funnel[4].n / maxN) * 100)}%</b>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[["Время ответа", "2 мин", "бот + менеджеры"], ["Цикл сделки", "11 дней", "−3 дня за квартал"], ["Пропущенных заявок", "0", "все попадают в CRM"], ["NPS клиентов", "72", "по опросам бота"]].map(([l, v, d]) => (
          <Card key={l} className="p-5">
            <div className="text-[13px]" style={{ color: C.mute }}>{l}</div>
            <div className="mt-1 text-[26px] font-semibold">{v}</div>
            <div className="mt-1 text-[12.5px]" style={{ color: C.mute }}>{d}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Интеграции ---------------- */

export function Integrations() {
  const { integrations, setIntegrations, notify } = useCrm();
  const on = integrations.filter((x) => x.on).length;
  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Интеграции" sub={`${on} из ${integrations.length} подключено · все сервисы бизнеса работают как одна система`} />
      <div className="grid grid-cols-2 gap-4">
        {integrations.map((x, i) => (
          <Card key={x.name} className="flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]" style={{ background: C.bg, color: C.ink }}><Icon d={I[x.icon as IconName]} size={20} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[14.5px] font-semibold">
                {x.name}
                {x.on && <Badge color={C.green} bg={C.greenSoft}>активна</Badge>}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: C.mute }}>{x.desc}</div>
            </div>
            <Toggle
              on={x.on}
              onChange={() => {
                setIntegrations((all) => all.map((y, j) => (j === i ? { ...y, on: !y.on } : y)));
                notify(x.on ? "Интеграция отключена" : "Интеграция подключена", x.name);
              }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
