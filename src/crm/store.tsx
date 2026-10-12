import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { initialDeals, initialProducts, initialTasks, initialTxns, integrations as initialIntegrations, type Deal, type Product, type Task, type Txn } from "./data";

export type Page = "Обзор" | "Сделки" | "Клиенты" | "Задачи" | "Склад" | "Финансы" | "Отчёты" | "Интеграции";

type Toast = { id: number; title: string; text: string };

type Store = {
  page: Page;
  go: (p: Page) => void;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  txns: Txn[];
  setTxns: React.Dispatch<React.SetStateAction<Txn[]>>;
  integrations: typeof initialIntegrations;
  setIntegrations: React.Dispatch<React.SetStateAction<typeof initialIntegrations>>;
  openDealId: number | null;
  setOpenDealId: (id: number | null) => void;
  openClientId: number | null;
  setOpenClientId: (id: number | null) => void;
  newDeal: boolean;
  setNewDeal: (v: boolean) => void;
  toasts: Toast[];
  notify: (title: string, text: string) => void;
  /** card preview on the landing page: no clicks, just the overview */
  preview: boolean;
};

const Ctx = createContext<Store | null>(null);

export function CrmProvider({ children, preview = false }: { children: ReactNode; preview?: boolean }) {
  const [page, setPage] = useState<Page>("Обзор");
  const [deals, setDeals] = useState(initialDeals);
  const [tasks, setTasks] = useState(initialTasks);
  const [products, setProducts] = useState(initialProducts);
  const [txns, setTxns] = useState(initialTxns);
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [openDealId, setOpenDealId] = useState<number | null>(null);
  const [openClientId, setOpenClientId] = useState<number | null>(null);
  const [newDeal, setNewDeal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((title: string, text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, title, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const go = useCallback((p: Page) => {
    setPage(p);
    setOpenDealId(null);
    setOpenClientId(null);
  }, []);

  const value = useMemo(
    () => ({ page, go, deals, setDeals, tasks, setTasks, products, setProducts, txns, setTxns, integrations, setIntegrations, openDealId, setOpenDealId, openClientId, setOpenClientId, newDeal, setNewDeal, toasts, notify, preview }),
    [page, go, deals, tasks, products, txns, integrations, openDealId, openClientId, newDeal, toasts, notify, preview]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCrm() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useCrm outside CrmProvider");
  return s;
}
