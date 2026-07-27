import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "../lib/Magnetic";

const links = [
  { label: "Platform", href: "#about" },
  { label: "Solutions", href: "#solutions" },
  { label: "Cases", href: "#cases" },
  { label: "Pricing", href: "#pricing" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`flex items-center justify-between px-6 py-5 transition-all duration-700 md:px-12 ${
          scrolled ? "backdrop-blur-xl bg-ink/40" : ""
        }`}
      >
        <a href="#top" className="display text-[1.05rem] tracking-[0.28em] font-semibold">
          AURALIS
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-line text-[0.7rem] font-medium uppercase tracking-[0.3em] text-fog transition-colors duration-300 hover:text-mist"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Magnetic strength={0.3}>
          <a
            href="#pricing"
            className="glass block rounded-full px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.25em] transition-colors duration-300 hover:text-accent"
          >
            Request access
          </a>
        </Magnetic>
      </div>
    </motion.header>
  );
}
