/**
 * Vercel Function: аналитика сайта.
 *   POST — событие с сайта (просмотр, клик в Telegram, заявка, вход в демо)
 *   GET  — статистика для /admin, доступ по паролю ADMIN_PASSWORD (заголовок x-admin-password)
 *
 * Хранилище — Redis из Vercel Storage. Переменная со строкой подключения появляется сама
 * при подключении базы к проекту: STORAGE_URL или REDIS_URL (Redis Cloud),
 * либо KV_REST_API_URL + KV_REST_API_TOKEN (Upstash, через REST).
 * Счётчики по дням живут 90 дней.
 */
import { createClient } from "redis";

type Cmd = (string | number)[];

const env = process.env;
const REDIS_URL = env.STORAGE_URL || env.REDIS_URL;
const REST_URL = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;

const redisConfigured = () => Boolean(REDIS_URL || (REST_URL && REST_TOKEN));

// соединение переиспользуется между вызовами, пока функция «тёплая»
let client: Promise<ReturnType<typeof createClient>> | null = null;
function connect() {
  if (!client) {
    const c = createClient({ url: REDIS_URL });
    c.on("error", () => { client = null; });
    client = c.connect().then(() => c).catch((e) => { client = null; throw e; });
  }
  return client;
}

async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
  if (REDIS_URL) {
    const c = await connect();
    // команды одного тика node-redis сам отправляет пачкой
    return Promise.all(cmds.map((cmd) => c.sendCommand(cmd.map(String))));
  }
  const res = await fetch(`${REST_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => r.result);
}

/** Дата по Бишкеку (UTC+6), YYYY-MM-DD. */
function day(offsetDays = 0) {
  return new Date(Date.now() + 6 * 3600e3 - offsetDays * 86400e3).toISOString().slice(0, 10);
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const TTL = 90 * 86400;
const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|vercel/i;
const EVENTS = new Set(["view", "telegram", "lead", "demo"]);

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[^\p{L}\p{N}\-_./:]/gu, "").slice(0, max);

export async function POST(request: Request) {
  if (!redisConfigured()) return json(200, { ok: false });
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOTS.test(ua)) return json(200, { ok: true });

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false });
  }

  const event = clean(data.event, 20);
  if (!EVENTS.has(event)) return json(400, { ok: false });
  const path = clean(data.path, 60) || "/";
  const ref = clean(data.ref, 60) || "прямой заход";
  const label = clean(data.label, 40);
  const vid = clean(data.vid, 40);
  const country = request.headers.get("x-vercel-ip-country") || "—";
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "телефон" : "компьютер";

  const d = day();
  const k = (name: string) => `a:${d}:${name}`;
  const cmds: (string | number)[][] = [["HINCRBY", k("events"), label ? `${event}:${label}` : event, 1]];

  if (event === "view") {
    cmds.push(
      ["HINCRBY", k("paths"), path, 1],
      ["HINCRBY", k("refs"), ref, 1],
      ["HINCRBY", k("countries"), country, 1],
      ["HINCRBY", k("devices"), device, 1]
    );
    if (vid) cmds.push(["PFADD", k("visitors"), vid], ["EXPIRE", k("visitors"), TTL]);
    for (const n of ["paths", "refs", "countries", "devices"]) cmds.push(["EXPIRE", k(n), TTL]);
  }
  cmds.push(["EXPIRE", k("events"), TTL]);

  // лента последних событий
  cmds.push(
    ["LPUSH", "a:recent", JSON.stringify({ t: Date.now(), event, label, path, ref, country, device })],
    ["LTRIM", "a:recent", 0, 99]
  );

  try {
    await pipeline(cmds);
  } catch {
    return json(502, { ok: false });
  }
  return json(200, { ok: true });
}

const DAYS = 30;

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** HGETALL в REST-ответе — плоский массив [ключ, значение, ключ, значение…]. */
function toMap(raw: unknown): Record<string, number> {
  const arr = (raw as string[]) ?? [];
  const out: Record<string, number> = {};
  for (let i = 0; i < arr.length; i += 2) out[arr[i]] = Number(arr[i + 1]);
  return out;
}

export async function GET(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return json(500, { error: "Не задан ADMIN_PASSWORD в Vercel" });
  if (!safeEqual(request.headers.get("x-admin-password") ?? "", password)) return json(401, { error: "Неверный пароль" });
  if (!redisConfigured()) return json(500, { error: "Не подключена база Redis в Vercel (Storage)" });

  const days = Array.from({ length: DAYS }, (_, i) => day(DAYS - 1 - i));
  const parts = ["events", "paths", "refs", "countries", "devices"] as const;
  const cmds: string[][] = [];
  for (const d of days) {
    cmds.push(["PFCOUNT", `a:${d}:visitors`]);
    for (const p of parts) cmds.push(["HGETALL", `a:${d}:${p}`]);
  }
  cmds.push(["LRANGE", "a:recent", "0", "49"]);

  let res: unknown[];
  try {
    res = await pipeline(cmds);
  } catch {
    return json(502, { error: "Хранилище недоступно" });
  }

  const step = parts.length + 1;
  const byDay = days.map((d, i) => {
    const row = res.slice(i * step, (i + 1) * step);
    return {
      day: d,
      visitors: Number(row[0] ?? 0),
      events: toMap(row[1]),
      paths: toMap(row[2]),
      refs: toMap(row[3]),
      countries: toMap(row[4]),
      devices: toMap(row[5]),
    };
  });
  const recent = ((res[res.length - 1] as string[]) ?? []).map((s) => {
    try { return JSON.parse(s); } catch { return null; }
  }).filter(Boolean);

  return json(200, { days: byDay, recent });
}
