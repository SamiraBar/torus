import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { C } from "./ui";
import { track } from "../lib/track";

/* Password screen for demo links sent to clients. Only the SHA-256 of the
   password lives in the code; the password itself goes out with the link. */

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

type Props = {
  title: string;
  logo: string;
  hash: string;
  storageKey: string;
  children: (logout: () => void) => ReactNode;
};

export function DemoGate({ title, logo, hash, storageKey, children }: Props) {
  const [ok, setOk] = useState(() => localStorage.getItem(storageKey) === hash);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (ok) {
    return (
      <>
        {children(() => {
          localStorage.removeItem(storageKey);
          setOk(false);
          setPwd("");
          setBusy(false);
        })}
      </>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    if ((await sha256(pwd)) === hash) {
      localStorage.setItem(storageKey, hash);
      track("demo", storageKey.replace("torus-", "").replace("-demo", ""));
      setOk(true);
    } else {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden" style={{ background: "#08090b" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(700px 500px at 25% 20%, #1c2040 0%, transparent 60%), radial-gradient(700px 500px at 80% 85%, #10261d 0%, transparent 60%)" }} />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: error ? [0, -8, 8, -5, 5, 0] : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-[380px] rounded-[24px] border p-8"
        style={{ background: "rgba(255,255,255,.04)", borderColor: "rgba(255,255,255,.09)", backdropFilter: "blur(20px)" }}
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-white text-[18px] font-bold" style={{ color: C.ink }}>{logo}</span>
          <div>
            <div className="text-[17px] font-semibold text-white">{title}</div>
            <div className="text-[13px] text-white/50">Демо-доступ</div>
          </div>
        </div>
        <label className="mb-2 block text-[12.5px] text-white/50">Пароль из письма</label>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(false); }}
          placeholder="••••••••"
          className="h-[46px] w-full rounded-[12px] border bg-white/5 px-4 text-[15px] text-white outline-none focus:border-[#9aa5ff]"
          style={{ borderColor: error ? "#e5536b" : "rgba(255,255,255,.12)" }}
        />
        <div className="mt-2 h-[18px] text-[12.5px]" style={{ color: "#ff8b9d" }}>{error && "Неверный пароль"}</div>
        <button disabled={busy} className="mt-3 h-[46px] w-full rounded-[12px] bg-white text-[14px] font-semibold transition-opacity hover:opacity-90" style={{ color: C.ink }}>
          {busy ? "Входим…" : "Войти"}
        </button>
        <div className="mt-6 text-center text-[12px] text-white/35">Нет пароля? Напишите нам — пришлём доступ.</div>
      </motion.form>
    </div>
  );
}
