/**
 * Vercel Function: заявка с сайта → сообщение в Telegram.
 *
 * Нужны переменные окружения в Vercel (Project → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — ваш chat id (куда бот присылает заявки)
 * Токен живёт только на сервере и в браузер не попадает.
 */

const MAX = { name: 100, contact: 120, task: 2000 };

const escape = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return json(500, { ok: false, error: "Telegram не настроен" });

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "Некорректный запрос" });
  }

  // скрытое поле-ловушка: люди его не видят, боты заполняют
  if (data.website) return json(200, { ok: true });

  const name = String(data.name ?? "").trim().slice(0, MAX.name);
  const contact = String(data.contact ?? "").trim().slice(0, MAX.contact);
  const task = String(data.task ?? "").trim().slice(0, MAX.task);
  if (!name || !contact) return json(400, { ok: false, error: "Укажите имя и контакт" });

  const text = [
    "<b>Новая заявка с сайта Torus</b>",
    "",
    `<b>Имя:</b> ${escape(name)}`,
    `<b>Контакт:</b> ${escape(contact)}`,
    task ? `<b>Задача:</b> ${escape(task)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!tg.ok) return json(502, { ok: false, error: "Не удалось отправить заявку" });
  return json(200, { ok: true });
}
