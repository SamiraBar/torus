/* Demo data for the CRM concept. Everything is fictional. */

export const managers = ["Айгерим Касымова", "Нурбек Бакиров", "Жылдыз Сыдыкова", "Тимур Абдыкадыров"];

export const stages = ["Новые", "Квалификация", "Предложение", "Переговоры", "Оплачено"] as const;
export type Stage = (typeof stages)[number];
export const stageColor: Record<Stage, string> = {
  Новые: "#9aa5ff",
  Квалификация: "#5b6cff",
  Предложение: "#e59a1a",
  Переговоры: "#d9488f",
  Оплачено: "#17a86b",
};

export const sourcesList = ["Instagram", "Сайт", "WhatsApp", "Рекомендации", "Telegram"] as const;

export type Deal = {
  id: number;
  title: string;
  contact: string;
  amount: number;
  stage: Stage;
  manager: string;
  source: string;
  days: number; // сколько дней в работе
  next: string;
};

export const initialDeals: Deal[] = [
  { id: 1, title: "Кофейня «Зерно»", contact: "Алина Осмонова", amount: 48000, stage: "Новые", manager: managers[0], source: "Instagram", days: 1, next: "Первый звонок" },
  { id: 2, title: "ОсОО «Ала-Тоо Строй»", contact: "Бакыт Жумабеков", amount: 260000, stage: "Новые", manager: managers[1], source: "Сайт", days: 2, next: "Уточнить объём" },
  { id: 3, title: "Ресторан «Navat»", contact: "Эрмек Токтосунов", amount: 120000, stage: "Новые", manager: managers[3], source: "WhatsApp", days: 0, next: "Отправить презентацию" },
  { id: 4, title: "Сеть «Фитнес Лайф»", contact: "Жанна Ли", amount: 185000, stage: "Квалификация", manager: managers[2], source: "Рекомендации", days: 5, next: "Демо CRM в 12:00" },
  { id: 5, title: "Клиника «Медок»", contact: "Самат Исаев", amount: 92500, stage: "Квалификация", manager: managers[0], source: "Сайт", days: 4, next: "Согласовать договор" },
  { id: 6, title: "Автосервис «Мотор»", contact: "Улан Мамытов", amount: 64000, stage: "Квалификация", manager: managers[1], source: "Telegram", days: 3, next: "Встреча в офисе" },
  { id: 7, title: "Логистика «Карго 24»", contact: "Дмитрий Ким", amount: 340000, stage: "Предложение", manager: managers[3], source: "Рекомендации", days: 9, next: "Перезвонить по КП" },
  { id: 8, title: "Школа «Speak Up»", contact: "Айдана Белекова", amount: 75000, stage: "Предложение", manager: managers[1], source: "Instagram", days: 6, next: "Ждём ответ" },
  { id: 9, title: "Салон «Beauty Lab»", contact: "Нургуль Асанова", amount: 58000, stage: "Предложение", manager: managers[2], source: "Instagram", days: 7, next: "Скидка 10%?" },
  { id: 10, title: "Дистрибьютор «Агро Трейд»", contact: "Марат Сыдыков", amount: 410000, stage: "Переговоры", manager: managers[0], source: "Сайт", days: 14, next: "Финальная встреча" },
  { id: 11, title: "Барбершоп «Brodyaga»", contact: "Тимур Алиев", amount: 54000, stage: "Переговоры", manager: managers[3], source: "WhatsApp", days: 8, next: "Подписать договор" },
  { id: 12, title: "Отель «Ала-Арча»", contact: "Гульмира Токтогулова", amount: 410000, stage: "Оплачено", manager: managers[2], source: "Рекомендации", days: 21, next: "Старт внедрения" },
  { id: 13, title: "Магазин «Свет»", contact: "Азамат Усенов", amount: 128000, stage: "Оплачено", manager: managers[3], source: "Сайт", days: 16, next: "Обучение команды" },
  { id: 14, title: "Пекарня «Нан»", contact: "Чолпон Абдыраева", amount: 36000, stage: "Оплачено", manager: managers[1], source: "Instagram", days: 11, next: "Сбор отзыва" },
];

export type Client = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  segment: "VIP" | "Постоянный" | "Новый";
  spent: number;
  deals: number;
  last: string;
  manager: string;
  source: string;
};

export const clients: Client[] = initialDeals.map((d, i) => ({
  id: d.id,
  name: d.contact,
  company: d.title,
  phone: `+996 ${["555", "700", "777", "552"][i % 4]} ${String(120 + i * 37).slice(0, 3)} ${String(410 + i * 53).slice(0, 3)}`,
  email: `${["info", "office", "hello", "manager"][i % 4]}@${["zerno", "alatoo", "navat", "fitlife", "medok", "motor", "cargo24", "speakup", "beautylab", "agrotrade", "brodyaga", "alaarcha", "svet", "nan"][i]}.kg`,
  city: ["Бишкек", "Бишкек", "Ош", "Бишкек", "Каракол"][i % 5],
  segment: i % 5 === 0 ? "VIP" : i % 3 === 0 ? "Новый" : "Постоянный",
  spent: [148000, 520000, 120000, 365000, 92500, 64000, 780000, 150000, 116000, 1240000, 54000, 410000, 384000, 72000][i],
  deals: [3, 2, 1, 4, 1, 1, 5, 2, 2, 6, 1, 1, 3, 2][i],
  last: ["сегодня", "вчера", "сегодня", "2 дня назад", "сегодня", "3 дня назад", "вчера", "неделю назад", "4 дня назад", "сегодня", "вчера", "2 недели назад", "5 дней назад", "неделю назад"][i],
  manager: d.manager,
  source: d.source,
}));

export const clientHistory = [
  ["Звонок", "Обсудили сроки внедрения, клиент готов стартовать в ноябре", "сегодня, 10:24"],
  ["WhatsApp", "Отправили коммерческое предложение (PDF)", "вчера, 16:02"],
  ["Бот", "Клиент оставил заявку через бота в Instagram", "3 дня назад"],
  ["Встреча", "Знакомство, показали демо системы", "неделю назад"],
] as const;

export type Task = { id: number; title: string; due: "Сегодня" | "Завтра" | "На неделе"; time: string; client: string; manager: string; priority: "Высокий" | "Средний" | "Низкий"; done: boolean };

export const initialTasks: Task[] = [
  { id: 1, title: "Перезвонить «Карго 24» по КП", due: "Сегодня", time: "10:30", client: "Логистика «Карго 24»", manager: managers[3], priority: "Высокий", done: true },
  { id: 2, title: "Демо CRM для «Фитнес Лайф»", due: "Сегодня", time: "12:00", client: "Сеть «Фитнес Лайф»", manager: managers[2], priority: "Высокий", done: false },
  { id: 3, title: "Согласовать договор с «Медок»", due: "Сегодня", time: "15:00", client: "Клиника «Медок»", manager: managers[0], priority: "Средний", done: false },
  { id: 4, title: "Отчёт по воронке руководителю", due: "Сегодня", time: "17:30", client: "—", manager: managers[0], priority: "Средний", done: false },
  { id: 5, title: "Отправить презентацию «Navat»", due: "Сегодня", time: "18:00", client: "Ресторан «Navat»", manager: managers[3], priority: "Низкий", done: false },
  { id: 6, title: "Финальная встреча «Агро Трейд»", due: "Завтра", time: "11:00", client: "Дистрибьютор «Агро Трейд»", manager: managers[0], priority: "Высокий", done: false },
  { id: 7, title: "Обучение команды «Свет»", due: "Завтра", time: "14:00", client: "Магазин «Свет»", manager: managers[3], priority: "Средний", done: false },
  { id: 8, title: "Подписать договор «Brodyaga»", due: "Завтра", time: "16:00", client: "Барбершоп «Brodyaga»", manager: managers[3], priority: "Высокий", done: false },
  { id: 9, title: "Собрать отзыв у «Нан»", due: "На неделе", time: "—", client: "Пекарня «Нан»", manager: managers[1], priority: "Низкий", done: false },
  { id: 10, title: "Подготовить КП для «Мотор»", due: "На неделе", time: "—", client: "Автосервис «Мотор»", manager: managers[1], priority: "Средний", done: false },
];

export type Product = { id: number; sku: string; name: string; category: string; stock: number; min: number; price: number; warehouse: string };

export const initialProducts: Product[] = [
  { id: 1, sku: "KF-001", name: "Кофе в зёрнах Arabica, 1 кг", category: "Кофе", stock: 42, min: 20, price: 1850, warehouse: "Главный" },
  { id: 2, sku: "KF-002", name: "Кофе молотый Espresso, 250 г", category: "Кофе", stock: 8, min: 25, price: 590, warehouse: "Главный" },
  { id: 3, sku: "ML-010", name: "Молоко 3,2%, 1 л", category: "Молочное", stock: 120, min: 60, price: 95, warehouse: "Холодильник" },
  { id: 4, sku: "ML-011", name: "Сливки 33%, 0,5 л", category: "Молочное", stock: 14, min: 20, price: 240, warehouse: "Холодильник" },
  { id: 5, sku: "SR-101", name: "Сироп ваниль, 1 л", category: "Сиропы", stock: 18, min: 10, price: 720, warehouse: "Главный" },
  { id: 6, sku: "SR-102", name: "Сироп карамель, 1 л", category: "Сиропы", stock: 3, min: 10, price: 720, warehouse: "Главный" },
  { id: 7, sku: "UP-200", name: "Стакан бумажный 350 мл", category: "Упаковка", stock: 2400, min: 1000, price: 6, warehouse: "Склад №2" },
  { id: 8, sku: "UP-201", name: "Крышка для стакана 350 мл", category: "Упаковка", stock: 900, min: 1000, price: 3, warehouse: "Склад №2" },
  { id: 9, sku: "DS-300", name: "Чизкейк Нью-Йорк, порция", category: "Десерты", stock: 26, min: 12, price: 280, warehouse: "Холодильник" },
  { id: 10, sku: "DS-301", name: "Круассан классический", category: "Десерты", stock: 40, min: 30, price: 120, warehouse: "Главный" },
];

export type Txn = { id: number; date: string; title: string; category: string; amount: number; method: "Карта" | "Наличные" | "Перевод" };

export const initialTxns: Txn[] = [
  { id: 1, date: "12 окт", title: "Оплата · Отель «Ала-Арча»", category: "Продажи", amount: 205000, method: "Перевод" },
  { id: 2, date: "12 окт", title: "Аренда офиса, октябрь", category: "Аренда", amount: -85000, method: "Перевод" },
  { id: 3, date: "11 окт", title: "Оплата · Магазин «Свет»", category: "Продажи", amount: 128000, method: "Карта" },
  { id: 4, date: "11 окт", title: "Реклама Instagram", category: "Маркетинг", amount: -42000, method: "Карта" },
  { id: 5, date: "10 окт", title: "Оплата · Пекарня «Нан»", category: "Продажи", amount: 36000, method: "Наличные" },
  { id: 6, date: "10 окт", title: "Зарплата, аванс", category: "Зарплата", amount: -210000, method: "Перевод" },
  { id: 7, date: "09 окт", title: "Предоплата · «Агро Трейд»", category: "Продажи", amount: 150000, method: "Перевод" },
  { id: 8, date: "08 окт", title: "Сервера и подписки", category: "IT", amount: -18500, method: "Карта" },
  { id: 9, date: "07 окт", title: "Оплата · Школа «Speak Up»", category: "Продажи", amount: 75000, method: "Карта" },
  { id: 10, date: "06 окт", title: "Канцелярия и хозтовары", category: "Офис", amount: -6400, method: "Наличные" },
];

export const financeMonths = [
  ["Май", 1.42, 0.98], ["Июн", 1.71, 1.05], ["Июл", 1.94, 1.12], ["Авг", 1.88, 1.18], ["Сен", 2.21, 1.24], ["Окт", 2.48, 1.31],
] as const;

export const integrations = [
  { name: "WhatsApp Business", desc: "Переписка с клиентами прямо в карточке сделки", icon: "chat", on: true },
  { name: "Instagram Direct", desc: "Заявки из директа и комментариев попадают в воронку", icon: "camera", on: true },
  { name: "Telegram-бот", desc: "Запись, напоминания и уведомления менеджерам", icon: "send", on: true },
  { name: "Сайт и формы", desc: "Каждая заявка с сайта — новая сделка за секунду", icon: "globe", on: true },
  { name: "1С: Бухгалтерия", desc: "Счета, акты и оплаты синхронизируются автоматически", icon: "book", on: false },
  { name: "Kaspi / Mbank", desc: "Онлайн-оплата по ссылке и статус оплаты в сделке", icon: "card", on: true },
  { name: "Google Таблицы", desc: "Выгрузка отчётов по расписанию", icon: "chart", on: false },
  { name: "IP-телефония", desc: "Звонки из CRM, записи разговоров и аналитика", icon: "phone", on: false },
];
