import { useState } from "react";
import { motion } from "framer-motion";
import { Badge, Btn, C, Card, Field, I, Icon, Modal, PageHead, SearchInput, Tabs, fmt, inputCls, inputStyle } from "../ui";
import { useCrm } from "../store";

export function Stock() {
  const { products, setProducts, notify } = useCrm();
  const cats = ["Все", ...Array.from(new Set(products.map((p) => p.category)))] as string[];
  const [cat, setCat] = useState("Все");
  const [q, setQ] = useState("");
  const [incoming, setIncoming] = useState<number | null>(null);
  const [qty, setQty] = useState("");

  const list = products.filter((p) => (cat === "Все" || p.category === cat) && (!q || `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())));
  const low = products.filter((p) => p.stock < p.min);
  const value = products.reduce((s, p) => s + p.stock * p.price, 0);
  const target = products.find((p) => p.id === incoming);

  return (
    <div className="flex flex-col gap-5">
      <PageHead title="Склад" sub="Остатки в реальном времени: продажи списывают товар автоматически">
        <SearchInput value={q} onChange={setQ} placeholder="Товар или артикул" width={240} />
        <Btn onClick={() => setIncoming(products[0].id)}><Icon d={I.box} size={16} /> Приход</Btn>
      </PageHead>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-[13px]" style={{ color: C.mute }}>Стоимость остатков</div><div className="mt-1 text-[26px] font-semibold">{fmt(value)} с</div></Card>
        <Card className="p-5"><div className="text-[13px]" style={{ color: C.mute }}>Позиций</div><div className="mt-1 text-[26px] font-semibold">{products.length}</div></Card>
        <Card className="p-5" style={low.length ? { background: C.roseSoft, borderColor: "#f6d3da" } : undefined}>
          <div className="text-[13px]" style={{ color: low.length ? C.rose : C.mute }}>Заканчиваются</div>
          <div className="mt-1 text-[26px] font-semibold" style={{ color: low.length ? C.rose : C.green }}>{low.length}</div>
          <div className="mt-1 truncate text-[12.5px]" style={{ color: C.rose }}>{low.map((p) => p.name.split(",")[0]).join(", ") || "Всё в норме"}</div>
        </Card>
      </div>

      <div className="flex"><Tabs items={cats} value={cat} onChange={setCat} /></div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="text-[12px] uppercase tracking-[0.06em]" style={{ color: C.mute, background: "#fafaf8" }}>
              {["Артикул", "Товар", "Склад", "Остаток", "", "Цена", ""].map((h, i) => <th key={i} className="px-5 py-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const ratio = Math.min(p.stock / (p.min * 2), 1);
              const isLow = p.stock < p.min;
              return (
                <tr key={p.id} className="border-t" style={{ borderColor: C.line }}>
                  <td className="px-5 py-3 font-mono text-[12.5px]" style={{ color: C.mute }}>{p.sku}</td>
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3" style={{ color: C.ink2 }}>{p.warehouse}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums">{fmt(p.stock)} шт</td>
                  <td className="w-[180px] px-5 py-3">
                    <div className="h-[6px] overflow-hidden rounded-full" style={{ background: "#ecece7" }}>
                      <motion.div className="h-full rounded-full" style={{ background: isLow ? C.rose : ratio < 0.7 ? C.amber : C.green }} animate={{ width: `${ratio * 100}%` }} transition={{ duration: 0.6 }} />
                    </div>
                  </td>
                  <td className="px-5 py-3 tabular-nums">{fmt(p.price)} с</td>
                  <td className="px-5 py-3 text-right">
                    {isLow ? (
                      <button onClick={() => setIncoming(p.id)}><Badge color={C.rose} bg={C.roseSoft}>Заказать</Badge></button>
                    ) : (
                      <button onClick={() => setIncoming(p.id)} className="text-[12.5px] hover:opacity-70" style={{ color: C.accent }}>+ приход</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal open={!!target} onClose={() => setIncoming(null)} title="Приход товара">
        {target && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(qty) || 0;
              if (!n) return;
              setProducts((all) => all.map((p) => (p.id === target.id ? { ...p, stock: p.stock + n } : p)));
              notify("Приход оформлен", `${target.name}: +${fmt(n)} шт`);
              setIncoming(null);
              setQty("");
            }}
            className="flex flex-col gap-4"
          >
            <Field label="Товар">
              <select value={target.id} onChange={(e) => setIncoming(Number(e.target.value))} className={inputCls} style={inputStyle}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label={`Количество (сейчас ${fmt(target.stock)} шт, минимум ${fmt(target.min)})`}>
              <input autoFocus value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" placeholder={String(Math.max(target.min * 2 - target.stock, 10))} className={inputCls} style={inputStyle} />
            </Field>
            <Btn type="submit" className="mt-2 h-[44px]">Оприходовать</Btn>
          </form>
        )}
      </Modal>
    </div>
  );
}
