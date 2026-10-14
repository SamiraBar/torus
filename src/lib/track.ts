/* Лёгкая аналитика сайта: события уходят на /api/analytics, смотреть — на /admin.
   Без cookies и персональных данных: только страница, источник и случайный id браузера. */

const ADMIN_KEY = "torus-admin";

function visitorId() {
  let id = localStorage.getItem("torus-vid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("torus-vid", id);
  }
  return id;
}

export function track(event: string, label?: string) {
  try {
    // свои визиты из админки не считаем
    if (localStorage.getItem(ADMIN_KEY) || location.hostname === "localhost") return;
    let ref = "";
    try {
      const host = document.referrer ? new URL(document.referrer).hostname : "";
      if (host && host !== location.hostname) ref = host.replace(/^www\./, "");
    } catch { /* битый referrer */ }
    const utm = new URLSearchParams(location.search).get("utm_source");
    const body = JSON.stringify({ event, label, path: location.pathname, ref: utm || ref, vid: visitorId() });
    if (!navigator.sendBeacon?.("/api/analytics", new Blob([body], { type: "application/json" }))) {
      fetch("/api/analytics", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
    }
  } catch { /* аналитика не должна ломать сайт */ }
}

/** Просмотр страницы + клики по ссылкам в Telegram. */
export function trackPage() {
  track("view");
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest?.("a");
    if (a?.href.includes("t.me/")) track("telegram");
  }, true);
}

export const markAdmin = () => localStorage.setItem(ADMIN_KEY, "1");
