import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { initialGroups, initialLeads, initialPayments, initialStudents, type Group, type Lead, type Payment, type Student } from "./data";

export type Page = "Обзор" | "Расписание" | "Ученики" | "Группы" | "Преподаватели" | "Заявки" | "Оплаты";
export type Role = "admin" | "student";

type Toast = { id: number; title: string; text: string };
type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type Store = {
  role: Role;
  setRole: (r: Role) => void;
  page: Page;
  go: (p: Page) => void;
  students: Student[];
  setStudents: Setter<Student[]>;
  groups: Group[];
  setGroups: Setter<Group[]>;
  leads: Lead[];
  setLeads: Setter<Lead[]>;
  payments: Payment[];
  setPayments: Setter<Payment[]>;
  /** lessonId → ids of students marked present */
  attendance: Record<number, number[]>;
  setAttendance: Setter<Record<number, number[]>>;
  openLessonId: number | null;
  setOpenLessonId: (id: number | null) => void;
  openStudentId: number | null;
  setOpenStudentId: (id: number | null) => void;
  classLessonId: number | null;
  setClassLessonId: (id: number | null) => void;
  newLead: boolean;
  setNewLead: (v: boolean) => void;
  toasts: Toast[];
  notify: (title: string, text: string) => void;
  preview: boolean;
};

const Ctx = createContext<Store | null>(null);

export function SchoolProvider({ children, preview = false, initialRole = "admin" }: { children: ReactNode; preview?: boolean; initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [page, setPage] = useState<Page>("Обзор");
  const [students, setStudents] = useState(initialStudents);
  const [groups, setGroups] = useState(initialGroups);
  const [leads, setLeads] = useState(initialLeads);
  const [payments, setPayments] = useState(initialPayments);
  const [attendance, setAttendance] = useState<Record<number, number[]>>({});
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [openStudentId, setOpenStudentId] = useState<number | null>(null);
  const [classLessonId, setClassLessonId] = useState<number | null>(null);
  const [newLead, setNewLead] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((title: string, text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, title, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const go = useCallback((p: Page) => {
    setPage(p);
    setOpenLessonId(null);
    setOpenStudentId(null);
  }, []);

  const value = useMemo(
    () => ({ role, setRole, page, go, students, setStudents, groups, setGroups, leads, setLeads, payments, setPayments, attendance, setAttendance, openLessonId, setOpenLessonId, openStudentId, setOpenStudentId, classLessonId, setClassLessonId, newLead, setNewLead, toasts, notify, preview }),
    [role, page, go, students, groups, leads, payments, attendance, openLessonId, openStudentId, classLessonId, newLead, toasts, notify, preview]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSchool() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSchool outside SchoolProvider");
  return s;
}
