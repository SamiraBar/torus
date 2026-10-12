/* Demo data: English school "Speak Up" with online and offline lessons. Fictional. */

export type Format = "Онлайн" | "Офлайн";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "IELTS";

export const levelColor: Record<Level, string> = {
  A1: "#9aa5ff",
  A2: "#5b6cff",
  B1: "#0ea5b7",
  B2: "#17a86b",
  C1: "#e59a1a",
  IELTS: "#d9488f",
};

export const formatColor: Record<Format, [string, string]> = {
  Онлайн: ["#2f7cf6", "#e8f1ff"],
  Офлайн: ["#12a37f", "#e2f6ef"],
};

export type Teacher = { id: number; name: string; langs: string; rating: number; hours: number; rate: number; online: boolean; offline: boolean; native?: boolean };

export const teachers: Teacher[] = [
  { id: 1, name: "Айгуль Сыдыкова", langs: "General, IELTS", rating: 4.9, hours: 28, rate: 900, online: true, offline: true },
  { id: 2, name: "Daniel Brooks", langs: "Speaking, Business", rating: 5.0, hours: 22, rate: 1400, online: true, offline: false, native: true },
  { id: 3, name: "Нурлан Асанов", langs: "Kids, General", rating: 4.8, hours: 30, rate: 800, online: false, offline: true },
  { id: 4, name: "Мария Ким", langs: "General, Grammar", rating: 4.9, hours: 26, rate: 850, online: true, offline: true },
  { id: 5, name: "Emily Carter", langs: "IELTS, Academic", rating: 4.9, hours: 18, rate: 1500, online: true, offline: false, native: true },
];

export type Group = { id: number; name: string; level: Level; format: Format; teacherId: number; days: string; time: string; room: string; seats: number; filled: number; price: number };

export const initialGroups: Group[] = [
  { id: 1, name: "Beginners Morning", level: "A1", format: "Офлайн", teacherId: 3, days: "Пн · Ср · Пт", time: "09:00", room: "Каб. 2", seats: 8, filled: 7, price: 4500 },
  { id: 2, name: "Elementary Evening", level: "A2", format: "Офлайн", teacherId: 4, days: "Вт · Чт", time: "18:30", room: "Каб. 1", seats: 8, filled: 8, price: 4500 },
  { id: 3, name: "Pre-Intermediate Online", level: "B1", format: "Онлайн", teacherId: 1, days: "Пн · Ср", time: "19:00", room: "Zoom", seats: 10, filled: 9, price: 4000 },
  { id: 4, name: "Speaking Club", level: "B2", format: "Онлайн", teacherId: 2, days: "Сб", time: "11:00", room: "Zoom", seats: 12, filled: 10, price: 3000 },
  { id: 5, name: "Upper-Intermediate", level: "B2", format: "Офлайн", teacherId: 4, days: "Вт · Чт", time: "17:00", room: "Каб. 3", seats: 8, filled: 6, price: 5000 },
  { id: 6, name: "IELTS 7.0 Intensive", level: "IELTS", format: "Онлайн", teacherId: 5, days: "Пн · Ср · Пт", time: "20:30", room: "Zoom", seats: 8, filled: 8, price: 7500 },
  { id: 7, name: "Kids Fun English", level: "A1", format: "Офлайн", teacherId: 3, days: "Вт · Чт · Сб", time: "15:00", room: "Каб. 2", seats: 8, filled: 5, price: 4200 },
  { id: 8, name: "Advanced Discussion", level: "C1", format: "Онлайн", teacherId: 2, days: "Чт", time: "20:00", room: "Zoom", seats: 8, filled: 4, price: 5500 },
];

export type Student = {
  id: number; name: string; age: number; phone: string; level: Level; groupId: number; format: Format;
  lessonsLeft: number; attendance: number; progress: number; paid: boolean; parent?: string; since: string;
};

const names = [
  "Алина Осмонова", "Тимур Алиев", "Айдана Белекова", "Эрлан Токтогулов", "Камила Жумабаева", "Данияр Исаев",
  "София Ким", "Арсен Мамытов", "Мээрим Асанова", "Руслан Усенов", "Нурай Абдыраева", "Бекжан Сыдыков",
  "Элина Ли", "Азамат Бакиров", "Жанель Токтосунова", "Ислам Кадыров", "Адина Мусаева", "Максат Эркинбеков",
];

export const initialStudents: Student[] = names.map((name, i) => {
  const g = initialGroups[i % initialGroups.length];
  return {
    id: i + 1,
    name,
    age: g.name.startsWith("Kids") ? 9 + (i % 4) : 17 + ((i * 7) % 20),
    phone: `+996 ${["555", "700", "777", "552"][i % 4]} ${String(200 + i * 41).slice(0, 3)} ${String(310 + i * 59).slice(0, 3)}`,
    level: g.level,
    groupId: g.id,
    format: g.format,
    lessonsLeft: [8, 2, 11, 0, 5, 12, 1, 7, 9, 3, 6, 10, 0, 4, 12, 2, 8, 5][i],
    attendance: [96, 88, 100, 72, 91, 94, 85, 98, 90, 79, 93, 97, 68, 89, 100, 83, 92, 87][i],
    progress: [72, 45, 88, 30, 64, 80, 52, 91, 58, 40, 76, 84, 25, 61, 95, 48, 70, 55][i],
    paid: ![3, 12, 6, 15].includes(i),
    parent: g.name.startsWith("Kids") ? "Мама: Гульнара" : undefined,
    since: ["сен 2025", "янв 2026", "мар 2026", "авг 2026", "окт 2025"][i % 5],
  };
});

export type Lesson = { id: number; groupId: number; day: number; start: number; dur: number; topic: string };

export const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
export const dayDates = ["12", "13", "14", "15", "16", "17"];

const dayIdx: Record<string, number> = { Пн: 0, Вт: 1, Ср: 2, Чт: 3, Пт: 4, Сб: 5 };
const topics = ["Present Perfect vs Past Simple", "Travel vocabulary", "Speaking: job interviews", "Listening practice", "IELTS Writing Task 2", "Phrasal verbs", "Conditionals", "Debate: technology", "Kids: animals & colours", "Reading & discussion"];

export const lessons: Lesson[] = initialGroups.flatMap((g, gi) =>
  g.days.split(" · ").map((d, k) => ({
    id: g.id * 10 + k,
    groupId: g.id,
    day: dayIdx[d],
    start: Number(g.time.slice(0, 2)) + Number(g.time.slice(3)) / 60,
    dur: g.name === "Speaking Club" ? 1 : 1.5,
    topic: topics[(gi + k) % topics.length],
  }))
);

export const leadStages = ["Новая заявка", "Пробный урок", "Тест уровня", "Договор", "Оплачено"] as const;
export type LeadStage = (typeof leadStages)[number];
export const leadColor: Record<LeadStage, string> = { "Новая заявка": "#9aa5ff", "Пробный урок": "#5b6cff", "Тест уровня": "#e59a1a", Договор: "#d9488f", Оплачено: "#17a86b" };

export type Lead = { id: number; name: string; goal: string; source: string; format: Format; stage: LeadStage; when: string };

export const initialLeads: Lead[] = [
  { id: 1, name: "Асель Нурланова", goal: "IELTS 6.5 для учёбы", source: "Instagram", format: "Онлайн", stage: "Новая заявка", when: "5 мин назад" },
  { id: 2, name: "Бакыт Жумабеков", goal: "Английский для работы", source: "Сайт", format: "Офлайн", stage: "Новая заявка", when: "1 ч назад" },
  { id: 3, name: "Сын, 8 лет (Гульмира)", goal: "Kids с нуля", source: "WhatsApp", format: "Офлайн", stage: "Пробный урок", when: "сегодня 15:00" },
  { id: 4, name: "Erlan Mamatov", goal: "Разговорный", source: "Telegram", format: "Онлайн", stage: "Пробный урок", when: "завтра 19:00" },
  { id: 5, name: "Диана Ли", goal: "Подтянуть грамматику", source: "Рекомендации", format: "Онлайн", stage: "Тест уровня", when: "B1 · 72%" },
  { id: 6, name: "Нурсултан Исаев", goal: "Переезд в Канаду", source: "Instagram", format: "Онлайн", stage: "Договор", when: "IELTS Intensive" },
  { id: 7, name: "Айжан Токтосунова", goal: "Speaking Club", source: "Сайт", format: "Онлайн", stage: "Оплачено", when: "3 000 с" },
];

export type Payment = { id: number; student: string; what: string; amount: number; date: string; method: "Карта" | "Наличные" | "Mbank" };

export const initialPayments: Payment[] = [
  { id: 1, student: "Айдана Белекова", what: "Абонемент 12 уроков · B1 Online", amount: 4000, date: "12 окт", method: "Mbank" },
  { id: 2, student: "Данияр Исаев", what: "IELTS Intensive · октябрь", amount: 7500, date: "11 окт", method: "Карта" },
  { id: 3, student: "София Ким", what: "Абонемент 8 уроков · A1", amount: 4500, date: "10 окт", method: "Наличные" },
  { id: 4, student: "Арсен Мамытов", what: "Speaking Club · 4 встречи", amount: 3000, date: "10 окт", method: "Mbank" },
  { id: 5, student: "Нурай Абдыраева", what: "Абонемент 12 уроков · B2", amount: 5000, date: "09 окт", method: "Карта" },
];
