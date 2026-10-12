/* Student portal demo: Aidana, B1, online group + offline extras. Fictional. */
import type { Format } from "../data";

export const me = {
  id: 3,
  name: "Айдана Белекова",
  age: 21,
  level: "B1" as const,
  levelProgress: 68,
  group: "Pre-Intermediate Online",
  teacher: "Айгуль Сыдыкова",
  phone: "+996 700 282 428",
  email: "aidana.b@mail.kg",
  since: "март 2026",
  points: 1240,
  streak: 12,
  attendance: 96,
  lessonsLeft: 9,
  subscription: "Абонемент 12 уроков · B1 Online",
  rank: 2,
};

export type MyLesson = {
  id: number;
  title: string;
  topic: string;
  format: Format;
  where: string;
  teacher: string;
  date: string;
  time: string;
  status: "next" | "upcoming" | "done" | "missed";
  grade?: number;
  homework?: "сдано" | "проверено" | "не сдано";
  /** id of the group lesson used for the online classroom */
  classId?: number;
};

export const myLessons: MyLesson[] = [
  { id: 1, title: "Pre-Intermediate Online", topic: "Speaking: job interviews", format: "Онлайн", where: "Zoom · ссылка в CRM", teacher: "Айгуль Сыдыкова", date: "Сегодня", time: "19:00", status: "next", classId: 30 },
  { id: 2, title: "Индивидуальный урок", topic: "Pronunciation & intonation", format: "Офлайн", where: "ул. Киевская 77 · Каб. 1", teacher: "Мария Ким", date: "Пт, 16 окт", time: "17:00", status: "upcoming" },
  { id: 3, title: "Speaking Club", topic: "Debate: technology", format: "Онлайн", where: "Zoom", teacher: "Daniel Brooks", date: "Сб, 17 окт", time: "11:00", status: "upcoming", classId: 40 },
  { id: 4, title: "Офлайн-встреча клуба", topic: "Board games in English", format: "Офлайн", where: "ул. Киевская 77 · Лаунж", teacher: "Daniel Brooks", date: "Вс, 18 окт", time: "16:00", status: "upcoming" },
  { id: 5, title: "Pre-Intermediate Online", topic: "Present Perfect vs Past Simple", format: "Онлайн", where: "Zoom", teacher: "Айгуль Сыдыкова", date: "Ср, 7 окт", time: "19:00", status: "done", grade: 9, homework: "проверено" },
  { id: 6, title: "Индивидуальный урок", topic: "Travel vocabulary", format: "Офлайн", where: "Каб. 1", teacher: "Мария Ким", date: "Пт, 9 окт", time: "17:00", status: "done", grade: 10, homework: "проверено" },
  { id: 7, title: "Pre-Intermediate Online", topic: "Phrasal verbs", format: "Онлайн", where: "Zoom", teacher: "Айгуль Сыдыкова", date: "Пн, 5 окт", time: "19:00", status: "done", grade: 8, homework: "сдано" },
  { id: 8, title: "Speaking Club", topic: "Films & series", format: "Онлайн", where: "Zoom", teacher: "Daniel Brooks", date: "Сб, 3 окт", time: "11:00", status: "missed", homework: "не сдано" },
];

export type Unit = { n: number; title: string; topics: string[]; state: "done" | "current" | "locked"; score?: number; materials: [string, "pdf" | "audio" | "video" | "quiz"][] };

export const units: Unit[] = [
  { n: 1, title: "People & Places", topics: ["Present Simple vs Continuous", "Describing people", "Cities vocabulary"], state: "done", score: 92, materials: [["Рабочая тетрадь Unit 1", "pdf"], ["Listening: My hometown", "audio"], ["Тест Unit 1", "quiz"]] },
  { n: 2, title: "Past Experiences", topics: ["Past Simple", "Used to", "Telling stories"], state: "done", score: 88, materials: [["Рабочая тетрадь Unit 2", "pdf"], ["Video: A trip to remember", "video"], ["Тест Unit 2", "quiz"]] },
  { n: 3, title: "Travel & Holidays", topics: ["Present Perfect", "Travel vocabulary", "At the airport"], state: "done", score: 95, materials: [["Рабочая тетрадь Unit 3", "pdf"], ["Podcast: Travel tips", "audio"], ["Тест Unit 3", "quiz"]] },
  { n: 4, title: "Work & Careers", topics: ["Present Perfect vs Past Simple", "Job interviews", "Formal emails"], state: "current", score: 64, materials: [["Рабочая тетрадь Unit 4", "pdf"], ["Video: Interview do's & don'ts", "video"], ["Шаблон резюме на английском", "pdf"], ["Тест Unit 4", "quiz"]] },
  { n: 5, title: "Food & Health", topics: ["Countable / uncountable", "Quantifiers", "At the restaurant"], state: "locked", materials: [["Рабочая тетрадь Unit 5", "pdf"]] },
  { n: 6, title: "Technology", topics: ["Future forms", "Gadgets vocabulary", "Giving opinions"], state: "locked", materials: [["Рабочая тетрадь Unit 6", "pdf"]] },
  { n: 7, title: "Conditionals", topics: ["Zero & First Conditional", "Making plans", "Negotiating"], state: "locked", materials: [["Рабочая тетрадь Unit 7", "pdf"]] },
];

export const documents = [
  { name: "Договор на обучение № 0347", kind: "Договор", date: "01.03.2026", size: "212 КБ", icon: "file" },
  { name: "Чек об оплате · октябрь", kind: "Оплата", date: "12.10.2026", size: "48 КБ", icon: "receipt" },
  { name: "Чек об оплате · сентябрь", kind: "Оплата", date: "11.09.2026", size: "47 КБ", icon: "receipt" },
  { name: "Сертификат об окончании уровня A2", kind: "Сертификат", date: "28.08.2026", size: "1,2 МБ", icon: "award" },
  { name: "Результаты входного теста", kind: "Тест", date: "01.03.2026", size: "96 КБ", icon: "edit" },
  { name: "Расписание на октябрь", kind: "Расписание", date: "30.09.2026", size: "64 КБ", icon: "cal" },
];

export const skills = [
  { name: "Grammar", value: 82 },
  { name: "Vocabulary", value: 88 },
  { name: "Listening", value: 74 },
  { name: "Speaking", value: 69 },
  { name: "Reading", value: 91 },
  { name: "Writing", value: 71 },
];

export const testHistory = [
  ["Вход.", 54], ["U1", 92], ["U2", 88], ["Mid", 79], ["U3", 95], ["U4·1", 64], ["U4·2", 81],
] as const;

export const groupRating = [
  ["Нурай Абдыраева", 1380],
  ["Айдана Белекова", 1240],
  ["Камила Жумабаева", 1105],
  ["Тимур Алиев", 980],
  ["Эрлан Токтогулов", 760],
] as const;

export const homework = [
  { title: "Workbook p. 42–43, ex. 1–6", unit: "Unit 4", due: "к уроку сегодня", done: true },
  { title: "Записать голосовое: «My dream job» (1 мин)", unit: "Speaking", due: "до пятницы", done: false },
  { title: "Formal email: ответ на вакансию", unit: "Writing", due: "до воскресенья", done: false },
];

export const teacherNotes = [
  ["Айгуль Сыдыкова", "Отличный прогресс в грамматике! Поработай над скоростью речи, используй больше linking words.", "7 окт"],
  ["Мария Ким", "Произношение звука th стало намного лучше. Так держать!", "9 окт"],
] as const;
